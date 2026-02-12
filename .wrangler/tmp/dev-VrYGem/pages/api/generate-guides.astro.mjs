globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getGuideGenerator } from '../../chunks/guide-generator_B8ZqTjA1.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  const url = new URL(context.request.url);
  const category = url.searchParams.get("category");
  if (!env) {
    return new Response(JSON.stringify({
      success: false,
      error: "Missing runtime environment"
    }), { status: 500 });
  }
  if (!category) {
    return new Response(JSON.stringify({
      success: false,
      error: "Category parameter required (e.g. ?category=Łóżka)"
    }), { status: 400 });
  }
  try {
    console.log(`🚀 Triggering guide generation for: ${category}`);
    const generator = getGuideGenerator(env);
    const guide = await generator.generateCategoryGuide(category);
    return new Response(JSON.stringify({
      success: true,
      data: {
        message: `Guide generated with TRACKING links!`,
        path: `/guides/${guide.metadata.slug}`,
        tracked_products_count: guide.metadata.products.length,
        sample_tracked_url: guide.metadata.products[0]?.tracked_url,
        metadata: guide.metadata
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("❌ Guide generation failed:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
