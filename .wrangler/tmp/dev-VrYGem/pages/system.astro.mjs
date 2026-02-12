globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../chunks/Layout_Dkg1w919.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "System", "description": "Panel administracyjny i ustawienia systemu" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-16"> <h1 class="text-4xl font-bold mb-6">System</h1> <p class="text-lg mb-8">
Tu powstać będzie panel administracyjny i ustawienia systemu.
</p> </div> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/system/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/system/index.astro";
const $$url = "/system";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
