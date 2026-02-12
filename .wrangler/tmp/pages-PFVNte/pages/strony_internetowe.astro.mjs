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
  const description = "Najciekawsze strony internetowe - odkryj u\u017Cyteczne narz\u0119dzia, inspiruj\u0105ce tre\u015Bci i ukryte pere\u0142ki sieci.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Strony Internetowe - MyBonzo AI Blog", "description": description }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "Strony Internetowe", "description": description, "animate": true })} ${maybeRenderHead()}<section class="container mx-auto px-4 py-16"> <div class="text-center mb-16"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:global-line", "class": "w-24 h-24 mx-auto mb-6 text-theme-text" })} <h2 class="text-3xl font-bold mb-6 text-theme-text">Odkryj Sieć</h2> <p class="text-xl text-theme-text opacity-80 max-w-4xl mx-auto">
Kolekcja najciekawszych stron internetowych - od użytecznych narzędzi po
        inspirujące treści.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"> ${renderComponent($$result2, "Card", $$Card, { "title": "Narz\u0119dzia Online", "description": "Praktyczne aplikacje webowe kt\xF3re u\u0142atwi\u0105 Ci prac\u0119 - edytory, konwertery, generatory.", "shadowSize": "lg", "iconName": "ri:tools-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Nauka & Edukacja", "description": "Platformy edukacyjne, kursy online i \u017Ar\xF3d\u0142a wiedzy dost\u0119pne za darmo w internecie.", "shadowSize": "lg", "iconName": "ri:book-open-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Kreatywno\u015B\u0107", "description": "Strony dla tw\xF3rc\xF3w - banki zdj\u0119\u0107, narz\u0119dzia graficzne, inspiracje designerskie.", "shadowSize": "lg", "iconName": "ri:palette-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Produktywno\u015B\u0107", "description": "Aplikacje i serwisy kt\xF3re pomog\u0105 Ci lepiej organizowa\u0107 prac\u0119 i zarz\u0105dza\u0107 czasem.", "shadowSize": "lg", "iconName": "ri:timer-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Rozrywka", "description": "Ciekawe strony rozrywkowe, gry przegl\u0105darkowe i tre\u015Bci kt\xF3re umil\u0105 Ci czas.", "shadowSize": "lg", "iconName": "ri:gamepad-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Spo\u0142eczno\u015Bci", "description": "Platformy spo\u0142eczno\u015Bciowe, fora dyskusyjne i miejsca gdzie mo\u017Cesz pozna\u0107 nowych ludzi.", "shadowSize": "lg", "iconName": "ri:team-line" })} </div> <div class="bg-theme-bg/5 rounded-2xl p-8 text-center"> <h3 class="text-2xl font-bold mb-4 text-theme-text">
Wkrótce Więcej Treści
</h3> <p class="text-lg text-theme-text opacity-80 mb-6">
Przygotowujemy dla Ciebie starannie wyselekcjonowane kolekcje
        najlepszych stron internetowych w każdej kategorii.
</p> <a href="/blog" class="inline-block bg-theme-accent text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg">
Zobacz Blog →
</a> </div> </section> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/STRONY_INTERNETOWE/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/STRONY_INTERNETOWE/index.astro";
const $$url = "/STRONY_INTERNETOWE";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
