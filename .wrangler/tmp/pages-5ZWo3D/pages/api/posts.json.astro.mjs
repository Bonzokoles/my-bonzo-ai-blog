globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getCollection } from '../../chunks/_astro_content_DcfyER59.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  const posts = await getCollection("blog");
  const data = posts.filter((p) => !p.data.isDraft).sort((a, b) => (b.data.pubDatetime?.valueOf?.() ?? 0) - (a.data.pubDatetime?.valueOf?.() ?? 0)).map((p) => ({
    slug: p.slug,
    // lub p.id - zależnie od definicji kolekcji, ale slug bezpieczniejszy
    id: p.id,
    title: p.data.title ?? p.slug,
    description: p.data.description ?? "",
    date: p.data.pubDatetime ? new Date(p.data.pubDatetime).toISOString().slice(0, 10) : null,
    tags: Array.isArray(p.data.tags) ? p.data.tags : [],
    readingTime: p.data.readingTime ?? null
    // upewnij się że masz to w schemacie
  }));
  return new Response(JSON.stringify({ posts: data }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
