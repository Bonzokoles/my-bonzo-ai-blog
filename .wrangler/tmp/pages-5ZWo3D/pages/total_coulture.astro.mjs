globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Card } from '../chunks/Card_DHxbvKZD.mjs';
import { $ as $$PageHeader } from '../chunks/PageHeader_DaikhrCu.mjs';
import { $ as $$Layout, a as $$Icon } from '../chunks/Layout_Dkg1w919.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const description = "Total Culture - kultura w najszerszym wydaniu. Sztuka, muzyka, film, literatura i wszystko co kszta\u0142tuje nasz\u0105 cywilizacj\u0119.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Total Culture - MyBonzo AI Blog", "description": description }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "Total Culture", "description": description, "animate": true })} ${maybeRenderHead()}<section class="container mx-auto px-4 py-16"> <div class="text-center mb-16"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:palette-line", "class": "w-24 h-24 mx-auto mb-6 text-theme-text" })} <h2 class="text-3xl font-bold mb-6 text-theme-text">
Kultura bez Granic
</h2> <p class="text-xl text-theme-text opacity-80 max-w-4xl mx-auto">
Odkryj bogactwo ludzkiej kultury - od klasyki po współczesność, od
        lokalnych tradycji po globalne trendy.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"> ${renderComponent($$result2, "Card", $$Card, { "title": "Sztuka & Design", "description": "Malarstwo, rze\u017Aba, architektura i design - od mistrz\xF3w przesz\u0142o\u015Bci po wsp\xF3\u0142czesnych wizjoner\xF3w.", "shadowSize": "lg", "iconName": "ri:brush-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Muzyka & D\u017Awi\u0119k", "description": "Wszystkie gatunki muzyczne, nowe albumy, arty\u015Bci i technologie audio.", "shadowSize": "lg", "iconName": "ri:music-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Film & Media", "description": "Kino \u015Bwiatowe, seriale, dokumenty i nowe formy medi\xF3w cyfrowych.", "shadowSize": "lg", "iconName": "ri:movie-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Literatura & Poezja", "description": "Ksi\u0105\u017Cki, poezja, dramaty i wszystkie formy pisanej ekspresji artystycznej.", "shadowSize": "lg", "iconName": "ri:book-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Kultura Cyfrowa", "description": "NFT, sztuka generowana przez AI, kultura internetowa i nowe media.", "shadowSize": "lg", "iconName": "ri:computer-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Tradycje \u015Awiata", "description": "Lokalne kultury, tradycje, festiwale i ceremonie z ca\u0142ego globu.", "shadowSize": "lg", "iconName": "ri:earth-line" })} </div> <div class="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-8 text-center"> <h3 class="text-2xl font-bold mb-4 text-theme-text">
Kultura w Erze AI
</h3> <p class="text-lg text-theme-text opacity-80 mb-6">
Jak sztuczna inteligencja wpływa na sztukę, muzykę, literaturę i inne
        formy ekspresji kulturowej.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/blog" class="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg">
Eksploruj Kulturę →
</a> <a href="/NARZEDZIA_AI" class="inline-block border-2 border-pink-500 text-pink-600 px-8 py-4 rounded-lg font-semibold hover:bg-pink-500 hover:text-white transition-all">
AI w Sztuce →
</a> </div> </div> </section> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/TOTAL_COULTURE/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/TOTAL_COULTURE/index.astro";
const $$url = "/TOTAL_COULTURE";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
