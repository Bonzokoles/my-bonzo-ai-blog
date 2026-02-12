globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Card } from '../chunks/Card_C5hPfhMB.mjs';
import { $ as $$PageHeader } from '../chunks/PageHeader_DwjQcEuj.mjs';
import { $ as $$Layout, a as $$Icon } from '../chunks/Layout_CUoF9Ydm.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const description = "Najnowsze wiadomo\u015Bci ze \u015Bwiata sztucznej inteligencji - trendy, prze\u0142omy technologiczne i analiza rynku AI.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Wiadomo\u015Bci AI - MyBonzo AI Blog", "description": description }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "Wiadomo\u015Bci AI", "description": description, "animate": true })} ${maybeRenderHead()}<section class="container mx-auto px-4 py-16"> <div class="text-center mb-16"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:newspaper-line", "class": "w-24 h-24 mx-auto mb-6 text-theme-text" })} <h2 class="text-3xl font-bold mb-6 text-theme-text">
AI News & Trendy
</h2> <p class="text-xl text-theme-text opacity-80 max-w-4xl mx-auto">
Bądź na bieżąco z najważniejszymi wydarzeniami w świecie sztucznej
        inteligencji.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"> ${renderComponent($$result2, "Card", $$Card, { "title": "Prze\u0142omy Technologiczne", "description": "Najnowsze osi\u0105gni\u0119cia w dziedzinie AI - nowe modele, algorytmy i mo\u017Cliwo\u015Bci.", "shadowSize": "lg", "iconName": "ri:rocket-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Rynek & Biznes", "description": "Analiza rynku AI, fuzje i przej\u0119cia, nowe inwestycje w bran\u017Cy technologicznej.", "shadowSize": "lg", "iconName": "ri:line-chart-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Regulacje & Prawo", "description": "Nowe przepisy dotycz\u0105ce AI, dyskusje o etyce i bezpiecze\u0144stwie sztucznej inteligencji.", "shadowSize": "lg", "iconName": "ri:scales-3-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Badania Naukowe", "description": "Najnowsze publikacje z laboratori\xF3w badawczych i uniwersytet\xF3w na ca\u0142ym \u015Bwiecie.", "shadowSize": "lg", "iconName": "ri:microscope-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Przemys\u0142 & Zastosowania", "description": "Jak AI zmienia r\xF3\u017Cne bran\u017Ce - od medycyny po transport i finanse.", "shadowSize": "lg", "iconName": "ri:building-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Spo\u0142ecze\u0144stwo & Kultura", "description": "Wp\u0142yw sztucznej inteligencji na \u017Cycie codzienne, sztuk\u0119 i kultur\u0119.", "shadowSize": "lg", "iconName": "ri:community-line" })} </div> <div class="bg-theme-bg/5 rounded-2xl p-8 text-center"> <h3 class="text-2xl font-bold mb-4 text-theme-text">Aktualności AI</h3> <p class="text-lg text-theme-text opacity-80 mb-6">
Wkrótce znajdziesz tutaj codziennie aktualizowane wiadomości ze świata
        sztucznej inteligencji.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/blog" class="inline-block bg-theme-accent text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg">
Zobacz Blog →
</a> <a href="/pro" class="inline-block border-2 border-theme-accent text-theme-accent px-8 py-4 rounded-lg font-semibold hover:bg-theme-accent hover:text-white transition-all">
MyBonzo Pro →
</a> </div> </div> </section> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/WIADOMOSCI_AI/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/WIADOMOSCI_AI/index.astro";
const $$url = "/WIADOMOSCI_AI";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
