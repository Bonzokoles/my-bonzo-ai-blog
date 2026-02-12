globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as renderScript } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../chunks/Layout_CUoF9Ydm.mjs';
import { $ as $$PageHeader } from '../chunks/PageHeader_DwjQcEuj.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Newsletter = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Newsletter;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Newsletter | MyBonzo AI Blog" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "Subscribe to our Newsletter" })} ${maybeRenderHead()}<div class="container mx-auto px-4"> <div class="max-w-xl mx-auto"> <p class="text-center text-lg mb-8">Get the latest AI news, tools, and tutorials delivered to your inbox every week.</p> <form id="newsletter-form" class="flex gap-2"> <input type="email" id="email-input" placeholder="Enter your email..." required class="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"> <button type="submit" id="submit-button" class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
Subscribe
</button> </form> <div id="form-status" class="mt-4 text-center"></div> </div> </div> ${renderScript($$result2, "U:/WWW_MYbonzoai_blog/src/pages/newsletter.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/newsletter.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/newsletter.astro";
const $$url = "/newsletter";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Newsletter,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
