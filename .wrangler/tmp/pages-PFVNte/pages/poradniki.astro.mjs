globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../chunks/Layout_CUoF9Ydm.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Poradniki", "description": "Przewodniki i instrukcje krok po kroku" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-16"> <h1 class="text-4xl font-bold mb-6">Poradniki</h1> <p class="text-lg mb-8">
Tu powstać będą przewodniki i instrukcje krok po kroku.
</p> </div> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/poradniki/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/poradniki/index.astro";
const $$url = "/poradniki";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
