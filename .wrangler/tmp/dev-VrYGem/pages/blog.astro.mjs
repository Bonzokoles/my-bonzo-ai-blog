globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout, b as $$Link } from '../chunks/Layout_Dkg1w919.mjs';
import { g as getCollection } from '../chunks/_astro_content_DcfyER59.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const posts = await getCollection("blog");
  const recentPosts = posts.filter((post) => !post.data.isDraft).sort(
    (a, b) => new Date(b.data.pubDatetime).getTime() - new Date(a.data.pubDatetime).getTime()
  ).slice(0, 6);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "class": "theme-ultra", "title": "Blog", "description": "Najnowsze artyku\u0142y o AI, poradniki i praktyczne rozwi\u0105zania dla domu" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="ultra-stage"> <section class="py-16"> <div class="max-w-6xl mx-auto px-4"> <div class="text-center mb-12"> <h1 class="text-4xl font-bold mb-4">MyBonzo AI Blog</h1> <p class="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
Praktyczne porady, narzędzia AI i rozwiązania dla całej rodziny. Bez
          technicznego żargonu - po prostu działa!
</p> </div> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> ${recentPosts.map((post) => renderTemplate`<article class="ultra-panel border border-gray-500 bg-transparent rounded-none overflow-hidden hover:border-blue-400 hover:bg-gray-900 hover:shadow transition-colors"> ${post.data.image && renderTemplate`<div class="aspect-video bg-gray-200 dark:bg-gray-700"> <img${addAttribute(post.data.image.src, "src")}${addAttribute(post.data.image.alt || post.data.title, "alt")} class="w-full h-full object-cover"> </div>`} <div class="p-6"> <div class="flex flex-wrap gap-2 mb-3"> ${post.data.tags?.slice(0, 2).map((tag) => renderTemplate`<span class="px-2 py-1 bg-blue-600 text-white text-xs rounded-none font-semibold tracking-wide uppercase"> ${tag} </span>`)} </div> <h3 class="text-xl font-semibold mb-2 line-clamp-2 text-theme-text"> ${post.data.title} </h3> <p class="text-theme-text opacity-80 text-sm mb-3 line-clamp-3"> ${post.data.description} </p> <div class="flex justify-between items-center text-sm text-theme-text opacity-70 mb-4"> <time${addAttribute(post.data.pubDatetime, "datetime")}> ${new Date(post.data.pubDatetime).toLocaleDateString(
    "pl-PL"
  )} </time> ${post.data.isFeatured && renderTemplate`<span class="px-2 py-1 bg-yellow-600 text-white text-xs rounded-none font-semibold">
Wyróżniony
</span>`} </div> ${renderComponent($$result2, "Link", $$Link, { "href": `/blog/${post.id}`, "text": "Czytaj wi\u0119cej \u2192", "class": "text-theme-text font-semibold hover:text-white transition-colors" })} </div> </article>`)} </div> <div class="text-center mt-12"> ${renderComponent($$result2, "Link", $$Link, { "href": "/blog/1", "text": "Zobacz wszystkie artyku\u0142y", "class": "bg-theme-accent text-white px-6 py-3 rounded-none font-semibold hover:opacity-90 transition-opacity border border-gray-500" })} </div> </div> </section> </main> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/blog/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
