globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  try {
    return new Response(JSON.stringify({
      success: true,
      debug: {
        has_env: !!env,
        has_pumo_api_key: !!env?.PUMO_API_KEY,
        has_pumo_api_base_url: !!env?.PUMO_API_BASE_URL,
        pumo_api_key_length: env?.PUMO_API_KEY?.length || 0,
        pumo_api_key_preview: env?.PUMO_API_KEY?.substring(0, 20) + "..." || "NOT_SET",
        pumo_base_url: env?.PUMO_API_BASE_URL || "NOT_SET",
        all_env_keys: Object.keys(env || {}).filter((k) => k.includes("PUMO"))
      },
      message: "Environment variables debug info"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
