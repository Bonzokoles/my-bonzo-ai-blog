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
  const description = "Najlepsze narz\u0119dzia sztucznej inteligencji - odkryj AI tools kt\xF3re rewolucjonizuj\u0105 spos\xF3b pracy i tw\xF3rczo\u015Bci.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Narz\u0119dzia AI - MyBonzo AI Blog", "description": description }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "Narz\u0119dzia AI", "description": description, "animate": true })} ${maybeRenderHead()}<section class="container mx-auto px-4 py-16"> <div class="text-center mb-16"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:robot-line", "class": "w-24 h-24 mx-auto mb-6 text-theme-text" })} <h2 class="text-3xl font-bold mb-6 text-theme-text">
Sztuczna Inteligencja w Akcji
</h2> <p class="text-xl text-theme-text opacity-80 max-w-4xl mx-auto">
Poznaj najnowsze narzędzia AI które mogą zmienić sposób w jaki
        pracujesz, tworzysz i się uczysz.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"> ${renderComponent($$result2, "Card", $$Card, { "title": "Generatory Tekstu", "description": "ChatGPT, Claude, Gemini i inne AI do pisania, t\u0142umaczenia i analizy tre\u015Bci.", "shadowSize": "lg", "iconName": "ri:quill-pen-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Generatory Grafik", "description": "DALL-E, Midjourney, Stable Diffusion - stw\xF3rz niesamowite obrazy z opis\xF3w tekstowych.", "shadowSize": "lg", "iconName": "ri:image-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Edytory Video", "description": "AI-powered narz\u0119dzia do monta\u017Cu film\xF3w, tworzenia animacji i efekt\xF3w specjalnych.", "shadowSize": "lg", "iconName": "ri:video-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Asystenci Kodu", "description": "GitHub Copilot, Cursor, Replit AI - programowanie z pomoc\u0105 sztucznej inteligencji.", "shadowSize": "lg", "iconName": "ri:code-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Analiza Danych", "description": "Narz\u0119dzia AI do przetwarzania du\u017Cych zbior\xF3w danych i tworzenia raport\xF3w.", "shadowSize": "lg", "iconName": "ri:bar-chart-box-line" })} ${renderComponent($$result2, "Card", $$Card, { "title": "Automatyzacja", "description": "Zapier AI, Make.com i inne platformy do automatyzacji proces\xF3w biznesowych.", "shadowSize": "lg", "iconName": "ri:settings-3-line" })} </div> <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 text-center"> <h3 class="text-2xl font-bold mb-4 text-theme-text">
MyBonzo Pro - Twój AI Asystent
</h3> <p class="text-lg text-theme-text opacity-80 mb-6">
Sprawdź nasze własne narzędzie AI zaprojektowane specjalnie dla polskich
        użytkowników.
</p> <a href="/pro" class="inline-block bg-theme-accent text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg mr-4">
Zobacz MyBonzo Pro →
</a> <a href="/ai-tools" class="inline-block border-2 border-theme-accent text-theme-accent px-8 py-4 rounded-lg font-semibold hover:bg-theme-accent hover:text-white transition-all">
Zobacz Pełny Dashboard Narzędzi →
</a> </div> </section> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/NARZEDZIA_AI/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/NARZEDZIA_AI/index.astro";
const $$url = "/NARZEDZIA_AI";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
