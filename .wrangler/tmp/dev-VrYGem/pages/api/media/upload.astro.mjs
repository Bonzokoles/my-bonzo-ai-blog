globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, locals }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type") || "image";
    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const allowedTypes = {
      image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      video: ["video/mp4", "video/webm", "video/ogg"],
      audio: ["audio/mp3", "audio/wav", "audio/ogg"]
    };
    const typeCategory = type;
    if (!allowedTypes[typeCategory]?.includes(file.type)) {
      return new Response(
        JSON.stringify({
          error: "Unsupported file type",
          supported: allowedTypes[typeCategory]
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: "File too large. Max size: 50MB" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const runtime = locals.runtime;
    const env = runtime?.env;
    if (!env?.MEDIA_BUCKET) {
      return new Response(
        JSON.stringify({ error: "Storage not available" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const extension = file.name.split(".").pop();
    const fileName = `${type}/${timestamp}-${random}.${extension}`;
    await env.MEDIA_BUCKET.put(fileName, file.stream(), {
      httpMetadata: {
        contentType: file.type
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
        size: file.size.toString(),
        type
      }
    });
    let thumbnailUrl = null;
    if (type === "image" && env.AI) {
      try {
        const imageUrl = `https://media.mybonzoaiblog.com/${fileName}`;
        thumbnailUrl = `${imageUrl}/thumbnail`;
      } catch (error) {
        console.warn("Thumbnail generation failed:", error);
      }
    }
    if (env.IMAGE_QUEUE) {
      await env.IMAGE_QUEUE.send({
        fileName,
        type,
        size: file.size,
        mimeType: file.type,
        action: "process"
      });
    }
    return new Response(
      JSON.stringify({
        success: true,
        fileName,
        url: `https://media.mybonzoaiblog.com/${fileName}`,
        thumbnailUrl,
        type,
        size: file.size,
        mimeType: file.type
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return new Response(
      JSON.stringify({
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
const GET = async ({ url, locals }) => {
  try {
    const runtime = locals.runtime;
    const env = runtime?.env;
    if (!env?.MEDIA_BUCKET) {
      return new Response(
        JSON.stringify({ error: "Storage not available" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const type = url.searchParams.get("type") || "all";
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const listing = await env.MEDIA_BUCKET.list({
      prefix: type !== "all" ? `${type}/` : void 0,
      limit: Math.min(limit, 100)
    });
    const files = listing.objects.map((obj) => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded,
      url: `https://media.mybonzoaiblog.com/${obj.key}`,
      metadata: obj.customMetadata
    }));
    return new Response(
      JSON.stringify({
        success: true,
        files,
        truncated: listing.truncated,
        count: files.length
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("List Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to list files",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
