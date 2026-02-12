globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { c as createComponent, m as maybeRenderHead, e as renderScript, a as renderTemplate } from '../chunks/astro/server_CENSSoee.mjs';
export { renderers } from '../renderers.mjs';

const $$ImportProducts = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <div class="max-w-4xl mx-auto"> <!-- Header --> <div class="text-center mb-8"> <h1 class="text-4xl font-bold mb-4">📦 Import Produktów do D1</h1> <p class="text-xl text-gray-600 dark:text-gray-300">
Migracja 2,560 produktów z WHITECAT JSON do D1 Database
</p> </div> <!-- Status --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"> <h2 class="text-2xl font-semibold mb-4">📊 Status D1 Database</h2> <div id="status-container"> <div class="animate-pulse"> <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div> <div class="h-4 bg-gray-300 rounded w-1/3"></div> </div> </div> </div> <!-- Import Controls --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"> <h3 class="text-xl font-semibold mb-4">🚀 Import Actions</h3> <div class="space-y-4"> <!-- Import from WHITECAT --> <div class="border rounded-lg p-4"> <h4 class="font-semibold mb-2">Import z WHITECAT JSON</h4> <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
Importuje wszystkie 2,560 produktów z lokalnego pliku
                        products.json
</p> <button id="import-whitecat" class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
📥 Import z WHITECAT
</button> </div> <!-- Verify Import --> <div class="border rounded-lg p-4"> <h4 class="font-semibold mb-2">Weryfikuj Import</h4> <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
Sprawdza czy produkty zostały poprawnie zaimportowane
</p> <button id="verify-import" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
✅ Weryfikuj
</button> </div> </div> </div> <!-- Results --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"> <h3 class="text-xl font-semibold mb-4">📄 Wyniki</h3> <div id="results-container"> <p class="text-gray-500 dark:text-gray-400">
Kliknij jeden z przycisków powyżej aby rozpocząć.
</p> </div> </div> </div> </div> ${renderScript($$result, "U:/WWW_MYbonzoai_blog/src/pages/import-products.astro?astro&type=script&index=0&lang.ts")}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/import-products.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/import-products.astro";
const $$url = "/import-products";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$ImportProducts,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
