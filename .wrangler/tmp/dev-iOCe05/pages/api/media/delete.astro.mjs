globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, locals }) => {
  try {
    console.log("🗑️ Media delete request");
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      console.error("❌ Invalid JSON in request body:", error);
      return new Response(JSON.stringify({
        success: false,
        error: "Nieprawidłowe dane JSON w żądaniu"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { key } = requestData;
    if (!key || typeof key !== "string") {
      console.error("❌ Missing or invalid key parameter");
      return new Response(JSON.stringify({
        success: false,
        error: 'Brak wymaganego parametru "key" lub nieprawidłowy typ'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const sanitizedKey = key.replace(/\.\./g, "").replace(/\/+/g, "/");
    if (sanitizedKey !== key) {
      console.error("❌ Invalid key format:", key);
      return new Response(JSON.stringify({
        success: false,
        error: "Nieprawidłowy format klucza pliku"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!locals.runtime?.env) {
      console.error("❌ No Cloudflare runtime access");
      return new Response(JSON.stringify({
        success: false,
        error: "Brak dostępu do środowiska Cloudflare"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { MEDIA_BUCKET } = locals.runtime.env;
    if (!MEDIA_BUCKET) {
      console.error("❌ MEDIA_BUCKET not configured");
      return new Response(JSON.stringify({
        success: false,
        error: "Bucket R2 nie jest skonfigurowany"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existingObject = await MEDIA_BUCKET.head(sanitizedKey);
    if (!existingObject) {
      console.error("❌ File not found:", sanitizedKey);
      return new Response(JSON.stringify({
        success: false,
        error: "Plik nie został znaleziony"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    await MEDIA_BUCKET.delete(sanitizedKey);
    console.log(`✅ Successfully deleted file: ${sanitizedKey}`);
    return new Response(JSON.stringify({
      success: true,
      message: "Plik został pomyślnie usunięty",
      deletedKey: sanitizedKey
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Error deleting media file:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Nieznany błąd podczas usuwania pliku",
      details: void 0
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
