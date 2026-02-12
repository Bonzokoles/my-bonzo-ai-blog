globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as renderScript } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../chunks/Layout_CUoF9Ydm.mjs';
import { $ as $$PageHeader } from '../chunks/PageHeader_DwjQcEuj.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Search;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Search | MyBonzo AI Blog" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "Search Articles" })} ${maybeRenderHead()}<div class="container mx-auto px-4"> <div class="mb-8"> <input type="text" id="search-input" placeholder="Search for articles..." class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"> </div> <div id="search-results" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> <!-- Search results will be loaded here --> </div> </div> ${renderScript($$result2, "U:/WWW_MYbonzoai_blog/src/pages/search.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/search.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/search.astro";
const $$url = "/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
