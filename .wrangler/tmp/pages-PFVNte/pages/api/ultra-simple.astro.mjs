globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async (context) => {
  const runtime = context.locals?.runtime;
  const env = runtime?.env;
  return new Response(JSON.stringify({
    test: "ultra-simple",
    success: true,
    env_check: {
      has_runtime: !!runtime,
      has_env: !!env,
      has_db: !!env?.DB,
      has_pumo_db: !!env?.PUMO_DB,
      all_env_keys: env ? Object.keys(env) : []
    }
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
