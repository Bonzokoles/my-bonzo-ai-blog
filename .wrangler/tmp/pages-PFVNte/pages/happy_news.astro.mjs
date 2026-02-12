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
  const description = "Pozytywne wiadomo\u015Bci ze \u015Bwiata - inspiruj\u0105ce historie, dobre uczynki i optymistyczne tre\u015Bci na ka\u017Cdy dzie\u0144.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Happy News - MyBonzo AI Blog", "description": description }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "Happy News", "description": description, "animate": true })} ${maybeRenderHead()}<section class="container mx-auto px-4 py-16"> <div class="text-center mb-16"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:emotion-happy-line", "class": "w-24 h-24 mx-auto mb-6 text-theme-text" })} <h2 class="text-3xl font-bold mb-6 text-theme-text">
Dobre Wiadomości
</h2> <p class="text-xl text-theme-text opacity-80 max-w-4xl mx-auto">
Pozytywne historie ze świata technologii, nauki i społeczeństwa. Bo
        świat jest lepszy niż myślisz!
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"> ${renderComponent($$result2, "Card", $$Card, { "title": "Technologia dla Dobra", "description": "Jak nowoczesne technologie pomagaj\u0105 rozwi\u0105zywa\u0107 problemy \u015Bwiata i poprawia\u0107 \u017Cycie ludzi.", "shadowSize": "lg", "iconName": "ri:heart-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "\u015Arodowisko & Ekologia", "description": "Pozytywne zmiany klimatyczne, odnawialne \u017Ar\xF3d\u0142a energii i ochrona przyrody.", "shadowSize": "lg", "iconName": "ri:leaf-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Nauka & Odkrycia", "description": "Fascynuj\u0105ce odkrycia naukowe kt\xF3re polepszaj\u0105 nasze zrozumienie \u015Bwiata.", "shadowSize": "lg", "iconName": "ri:flask-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Spo\u0142eczno\u015B\u0107", "description": "Inspiruj\u0105ce historie ludzi kt\xF3rzy zmieniaj\u0105 \u015Bwiat na lepsze w swoich spo\u0142eczno\u015Bciach.", "shadowSize": "lg", "iconName": "ri:team-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Zdrowie & Medycyna", "description": "Prze\u0142omy medyczne, nowe terapie i pozytywne trendy w opiece zdrowotnej.", "shadowSize": "lg", "iconName": "ri:health-book-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Edukacja & Rozw\xF3j", "description": "Innowacyjne metody nauki i pozytywne zmiany w systemach edukacyjnych.", "shadowSize": "lg", "iconName": "ri:graduation-cap-line" })} </div> <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 text-center"> <h3 class="text-2xl font-bold mb-4 text-theme-text">
Codziennie Nowe Dobre Wieści
</h3> <p class="text-lg text-theme-text opacity-80 mb-6">
Przychodź tutaj po dawkę optymizmu i pozytywnych wiadomości ze świata.
</p> <a href="/blog" class="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg">
Czytaj Więcej →
</a> </div> </section> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/HAPPY_NEWS/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/HAPPY_NEWS/index.astro";
const $$url = "/HAPPY_NEWS";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
