globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent, r as renderComponent, e as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../chunks/Layout_Dkg1w919.mjs';
import { $ as $$Heading } from '../chunks/Heading_B5Sdo5gb.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$MybonzoPro = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MybonzoPro;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "MyBonzo Pro - Zaawansowana Platforma AI", "description": "Poznaj MyBonzo Pro - profesjonalne narz\u0119dzie AI z dodatkowymi funkcjami" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden min-h-screen flex items-center"> <!-- Dekoracyjny obrazek alk4.png po prawej stronie (jak na głównej) --> <div class="absolute top-0 right-0 w-1/2 h-full opacity-30 dark:opacity-20 pointer-events-none hidden lg:block"> <img src="/images/alk4.png" alt="AI Graphics" class="w-full h-full object-cover object-left"> <div class="absolute inset-0 bg-gradient-to-l from-transparent via-blue-50/50 to-blue-50 dark:from-transparent dark:via-gray-900/50 dark:to-gray-900"></div> </div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10"> <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"> <!-- Left: Video with Play Button --> <div class="order-2 lg:order-1 flex justify-center lg:justify-start"> <div class="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 w-full max-w-2xl"> <!-- Video --> <video id="proVideo" class="w-full h-auto aspect-video" playsinline> <source src="/mybonzo123.mp4" type="video/mp4">
Twoja przeglądarka nie obsługuje video.
</video> <!-- Play Button Overlay --> <div id="playOverlayPro" class="absolute inset-0 bg-gradient-to-br from-indigo-200 to-purple-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center cursor-pointer transition-opacity"> <div class="text-center bg-black/40 backdrop-blur-sm p-8 rounded-2xl"> <div class="text-6xl mb-4 text-white drop-shadow-lg">▶</div> <p class="text-lg font-semibold text-white drop-shadow">
Kliknij PLAY aby obejrzeć
</p> </div> </div> <!-- Video Controls (bottom center) --> <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/70 dark:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"> <!-- Play Button --> <button id="playBtnPro" class="text-white hover:text-blue-400 transition-colors text-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1" aria-label="Play video" title="Odtwórz">
▶
</button> <!-- Pause Button (hidden by default) --> <button id="pauseBtnPro" class="hidden text-white hover:text-blue-400 transition-colors text-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1" aria-label="Pause video" title="Pauza">
⏸
</button> <!-- Stop Button --> <button id="stopBtnPro" class="text-white hover:text-red-400 transition-colors text-2xl focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full p-1" aria-label="Stop video" title="Stop">
⏹
</button> <!-- Volume Button --> <button id="volumeBtnPro" class="text-white hover:text-yellow-400 transition-colors text-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-1" aria-label="Volume" title="Włącz/Wyłącz dźwięk">
🔊
</button> </div> </div> </div> <!-- Right: Content --> <div class="order-1 lg:order-2 text-center lg:text-left"> <h1 class="text-5xl lg:text-6xl font-bold mb-6">
Sprawdź MyBonzo Pro
</h1> <p class="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-6">
Zaawansowana platforma AI z dodatkowymi funkcjami
</p> <p class="text-lg text-gray-600 dark:text-gray-400 mb-8"> <strong>Jesteś tutaj po raz pierwszy?</strong><br>
Obejrzyj krótki film (2 min 49 sek), aby poznać możliwości MyBonzo Pro.
            To narzędzie stworzone dla wymagających użytkowników - z zaawansowanymi
            funkcjami automatyzacji, AI Workers, analityki i integracji.
</p> <!-- Action Buttons --> <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"> <!-- Main CTA - Go to MyBonzo.com --> <a href="https://www.mybonzo.com" target="_blank" class="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center shadow-lg hover:shadow-xl">
Przejdź do MyBonzo Pro →
</a> <!-- Skip Button --> <a href="https://www.mybonzo.com" target="_blank" class="inline-block bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-8 py-4 rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center">
Pomiń i przejdź dalej
</a> </div> </div> </div> </div> </section>  <section class="py-16 bg-white dark:bg-gray-900"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> ${renderComponent($$result2, "Heading", $$Heading, { "level": 2, "class": "text-4xl font-bold text-center mb-12" }, { "default": ($$result3) => renderTemplate`
Co oferuje MyBonzo Pro?
` })} <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> <div class="bg-blue-50 dark:bg-gray-800 p-6 rounded-xl hover:shadow-lg transition-shadow"> <div class="text-5xl mb-4">🤖</div> ${renderComponent($$result2, "Heading", $$Heading, { "level": 3, "class": "text-xl font-bold mb-2" }, { "default": ($$result3) => renderTemplate`AI Workers` })} <p class="text-gray-600 dark:text-gray-400">
Wyspecjalizowane asystenty AI działające w chmurze Cloudflare
</p> </div> <div class="bg-green-50 dark:bg-gray-800 p-6 rounded-xl hover:shadow-lg transition-shadow"> <div class="text-5xl mb-4">📊</div> ${renderComponent($$result2, "Heading", $$Heading, { "level": 3, "class": "text-xl font-bold mb-2" }, { "default": ($$result3) => renderTemplate`Analytics` })} <p class="text-gray-600 dark:text-gray-400">
BigQuery, DuckDB i zaawansowana analiza biznesowa po polsku
</p> </div> <div class="bg-purple-50 dark:bg-gray-800 p-6 rounded-xl hover:shadow-lg transition-shadow"> <div class="text-5xl mb-4">🔗</div> ${renderComponent($$result2, "Heading", $$Heading, { "level": 3, "class": "text-xl font-bold mb-2" }, { "default": ($$result3) => renderTemplate`Integracje` })} <p class="text-gray-600 dark:text-gray-400">
Langchain, Flowise, Activepieces, MCP Servers i więcej
</p> </div> <div class="bg-yellow-50 dark:bg-gray-800 p-6 rounded-xl hover:shadow-lg transition-shadow"> <div class="text-5xl mb-4">⚡</div> ${renderComponent($$result2, "Heading", $$Heading, { "level": 3, "class": "text-xl font-bold mb-2" }, { "default": ($$result3) => renderTemplate`Automatyzacja` })} <p class="text-gray-600 dark:text-gray-400">
Generator treści, tickety AI, voice assistant i dynamiczne FAQ
</p> </div> </div> </div> </section>  <section class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16"> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> ${renderComponent($$result2, "Heading", $$Heading, { "level": 2, "class": "text-4xl font-bold mb-4" }, { "default": ($$result3) => renderTemplate`
Gotowy na pełną moc AI?
` })} <p class="text-xl mb-8">
MyBonzo Pro czeka - zaawansowane narzędzia dla profesjonalistów
</p> <a href="https://www.mybonzo.com" target="_blank" class="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl">
Uruchom MyBonzo Pro →
</a> </div> </section> ` })} ${renderScript($$result, "U:/WWW_MYbonzoai_blog/src/pages/mybonzo-pro.astro?astro&type=script&index=0&lang.ts")}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/mybonzo-pro.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/mybonzo-pro.astro";
const $$url = "/mybonzo-pro";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MybonzoPro,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
