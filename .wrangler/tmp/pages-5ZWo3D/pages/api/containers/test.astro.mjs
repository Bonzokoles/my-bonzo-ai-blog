globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    console.log("🔍 Test API wywołane");
    const body = await request.json();
    console.log("📝 Otrzymano body:", body);
    return new Response(JSON.stringify({
      success: true,
      message: "Test API działa!",
      received: body,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("❌ Błąd w test API:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Unknown error",
      stack: error.stack
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
