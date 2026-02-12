globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { c as createComponent, r as renderComponent, e as renderScript, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Dkg1w919.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const IMAGE_GEN_URL = "https://gemini-graph-dobre.pages.dev";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Gemini Image Generator - MyBonzo AI Lab", "description": "Generuj obrazy AI z Google Gemini - kreatywne AI studio" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-linear"> <div class="container mx-auto px-4 py-8"> <!-- Breadcrumb --> <nav class="text-sm mb-6"> <a href="/" class="text-theme-accent hover:underline">Home</a> <span class="mx-2 text-theme-primary">/</span> <a href="/eksperymenty" class="text-theme-accent hover:underline">Eksperymenty</a> <span class="mx-2 text-theme-primary">/</span> <span class="text-theme-primary">Gemini Image Generator</span> </nav> <!-- Header --> <div class="mb-12 text-center"> <h1 class="text-5xl md:text-6xl font-bold text-theme-accent mb-4">
🎨 Gemini Image Generator
</h1> <p class="text-xl text-theme-primary max-w-3xl mx-auto">
Twórz unikalne obrazy z pomocą Google Gemini AI. Opisz co
                    chcesz zobaczyć - AI zrobi resztę.
</p> </div> <!-- Features Grid --> <div class="grid md:grid-cols-3 gap-6 mb-12"> <div class="bg-theme-primary p-6 border border-theme-primary hover:bg-theme-secondary transition-colors duration-300"> <div class="text-4xl mb-4">🖼️</div> <h3 class="text-xl font-bold mb-2 text-theme-accent">
AI Image Generation
</h3> <p class="text-theme-primary">
Twórz obrazy z tekstu - AI rozumie Twoje pomysły
</p> </div> <div class="bg-theme-primary p-6 border border-theme-primary hover:bg-theme-secondary transition-colors duration-300"> <div class="text-4xl mb-4">🎨</div> <h3 class="text-xl font-bold mb-2 text-theme-accent">
Kreacja bez granic
</h3> <p class="text-theme-primary">
Od prostych grafik po złożone kompozycje artystyczne
</p> </div> <div class="bg-theme-primary p-6 border border-theme-primary hover:bg-theme-secondary transition-colors duration-300"> <div class="text-4xl mb-4">🌈</div> <h3 class="text-xl font-bold mb-2 text-theme-accent">
Theme Switcher
</h3> <p class="text-theme-primary">
14 tematów kolorystycznych - personalizuj interfejs
</p> </div> </div> <!-- Main App Container --> <div class="bg-theme-primary border-2 border-theme-accent p-8 mb-12"> <div class="mb-6 flex items-center justify-between"> <h2 class="text-2xl font-bold text-theme-accent">
🖌️ Creative Studio
</h2> <div class="flex gap-4"> <a${addAttribute(IMAGE_GEN_URL, "href")} target="_blank" rel="noopener noreferrer" class="bg-theme-accent text-theme-secondary px-6 py-2 font-semibold hover:bg-theme-secondary hover:text-theme-accent transition-colors border border-theme-primary">
Otwórz w nowym oknie →
</a> </div> </div> <!-- Loading Animation --> <div id="iframe-loader" class="text-center py-12"> <div class="inline-block animate-spin h-12 w-12 border-4 border-theme-accent border-t-transparent" style="border-radius: 50%;"></div> <p class="text-theme-primary mt-4">
Ładowanie Image Generator...
</p> </div> <!-- Iframe --> <iframe id="image-gen-iframe"${addAttribute(IMAGE_GEN_URL, "src")} class="w-full h-[800px] border-2 border-theme-primary opacity-0 transition-opacity duration-500" title="Gemini Image Generator"></iframe> </div> <!-- Info Section --> <div class="grid md:grid-cols-2 gap-8 mb-12"> <div class="bg-theme-primary p-6 border border-theme-primary hover:bg-theme-secondary transition-colors duration-300"> <h3 class="text-2xl font-bold mb-4 text-theme-accent">
📝 Jak używać?
</h3> <ol class="list-decimal list-inside space-y-2 text-theme-primary"> <li>Wpisz dokładny opis tego co chcesz wygenerować</li> <li>Wybierz styl artystyczny (opcjonalnie)</li> <li>Kliknij "Generate" i poczekaj chwilę</li> <li>Pobierz lub udostępnij wygenerowany obraz</li> <li>Eksperymentuj z różnymi promptami</li> </ol> </div> <div class="bg-theme-primary p-6 border border-theme-primary hover:bg-theme-secondary transition-colors duration-300"> <h3 class="text-2xl font-bold mb-4 text-theme-accent">
⚙️ Technologie
</h3> <ul class="space-y-2 text-theme-primary"> <li> <strong>Framework:</strong> Vite 6.2 + React 19
</li> <li> <strong>AI Model:</strong> Google Gemini Pro Vision
</li> <li><strong>UI:</strong> Lucide Icons</li> <li><strong>Styling:</strong> Tailwind CSS</li> <li><strong>Hosting:</strong> Cloudflare Pages</li> </ul> </div> </div> <!-- Deployment Info --> <div class="bg-theme-accent text-theme-secondary p-6 border-2 border-theme-primary"> <h3 class="text-2xl font-bold mb-4">🚀 Status Deploymentu</h3> <div class="grid md:grid-cols-2 gap-6"> <div> <p class="font-semibold mb-2">Główna aplikacja:</p> <a${addAttribute(IMAGE_GEN_URL, "href")} target="_blank" class="text-theme-primary hover:underline break-all"> ${IMAGE_GEN_URL} </a> </div> <div> <p class="font-semibold mb-2">Repozytorium GitHub:</p> <a href="https://github.com/Bonzokoles/GEMINI-graph-generate-dobre" target="_blank" class="text-theme-primary hover:underline">
github.com/Bonzokoles/GEMINI-graph-generate-dobre
</a> </div> </div> </div> </div> </div> ` })} ${renderScript($$result, "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/projekt-3/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/projekt-3/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/projekt-3/index.astro";
const $$url = "/eksperymenty/projekt-3";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
