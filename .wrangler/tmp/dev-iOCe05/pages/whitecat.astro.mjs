globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { c as createComponent, m as maybeRenderHead, e as renderScript, a as renderTemplate } from '../chunks/astro/server_CENSSoee.mjs';
export { renderers } from '../renderers.mjs';

const $$Whitecat = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <div class="max-w-4xl mx-auto"> <!-- Header --> <div class="text-center mb-8"> <h1 class="text-4xl font-bold mb-4">🐱 WHITECAT Integration</h1> <p class="text-xl text-gray-600 dark:text-gray-300">
AI Przewodniki Zakupowe z UTM Tracking
</p> </div> <!-- Stats Dashboard --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"> <h2 class="text-2xl font-semibold mb-4">📊 Statystyki Systemu</h2> <div id="stats-container"> <div class="animate-pulse"> <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div> <div class="h-4 bg-gray-300 rounded w-1/3"></div> </div> </div> </div> <!-- Controls --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"> <!-- Categories --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold mb-4">
📂 Kategorie Produktów
</h3> <select id="category-select" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mb-4"> <option value="">Ładowanie kategorii...</option> </select> <div class="space-y-2"> <button id="load-products" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
📦 Pokaż Produkty
</button> <button id="generate-guide" class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
📝 Generuj Przewodnik
</button> </div> </div> <!-- Search --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold mb-4">🔍 Wyszukiwanie</h3> <div class="space-y-2"> <input type="text" id="search-input" placeholder="Wyszukaj produkty..." class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"> <button id="search-products" class="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
🔍 Szukaj
</button> </div> </div> </div> <!-- Results --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"> <h3 class="text-xl font-semibold mb-4">📄 Wyniki</h3> <div id="results-container"> <p class="text-gray-500 dark:text-gray-400">
Wybierz kategorię lub wyszukaj produkty aby zobaczyć wyniki.
</p> </div> </div> <!-- Generator All Guides --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold mb-4">⚡ Generuj Wszystkie</h3> <p class="text-gray-600 dark:text-gray-400 mb-4">
Wygeneruj przewodniki dla wszystkich 68 kategorii produktów.
</p> <button id="generate-all" class="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700">
🚀 Generuj Wszystkie Przewodniki
</button> <div id="generation-status" class="mt-4 hidden"> <div class="bg-blue-100 dark:bg-blue-900 p-4 rounded"> <p class="font-semibold">Generowanie w toku...</p> <div class="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2"> <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" style="width: 0%" id="progress-bar"></div> </div> </div> </div> </div> </div> </div> ${renderScript($$result, "U:/WWW_MYbonzoai_blog/src/pages/whitecat.astro?astro&type=script&index=0&lang.ts")}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/whitecat.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/whitecat.astro";
const $$url = "/whitecat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Whitecat,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
