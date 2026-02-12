globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { b as createAstro, c as createComponent, r as renderComponent, e as renderScript, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../../chunks/Layout_CUoF9Ydm.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const VOICE_CHAT_URL = "https://bonzo-ai-chat.pages.dev";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Google Voice Chat AI - MyBonzo AI Lab", "description": "Rozmowa g\u0142osowa z AI Google Gemini - eksperymentalny voice assistant" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-linear"> <div class="container mx-auto px-4 py-8"> <!-- Breadcrumb --> <nav class="text-sm mb-6"> <a href="/" class="text-theme-accent hover:underline">Home</a> <span class="mx-2 text-theme-primary">/</span> <a href="/eksperymenty" class="text-theme-accent hover:underline">Eksperymenty</a> <span class="mx-2 text-theme-primary">/</span> <span class="text-theme-primary">Google Voice Chat AI</span> </nav> <!-- Header --> <div class="mb-12 text-center"> <h1 class="text-5xl md:text-6xl font-bold text-theme-accent mb-4">
🎤 Google Voice Chat AI
</h1> <p class="text-xl text-theme-primary max-w-3xl mx-auto">
Rozmawiaj głosowo z zaawansowanym AI Google Gemini.
                    Naturalna konwersacja z obsługą głosu w czasie rzeczywistym.
</p> </div> <!-- Features Grid --> <div class="grid md:grid-cols-3 gap-6 mb-12"> <div class="bg-theme-primary p-6 border border-theme-primary hover:bg-theme-secondary transition-colors duration-300"> <div class="text-4xl mb-4">🗣️</div> <h3 class="text-xl font-bold mb-2 text-theme-accent">
Voice Recognition
</h3> <p class="text-theme-primary">
Mów naturalnie - AI rozpoznaje Twój głos w czasie
                        rzeczywistym
</p> </div> <div class="bg-theme-primary p-6 border border-theme-primary hover:bg-theme-secondary transition-colors duration-300"> <div class="text-4xl mb-4">🤖</div> <h3 class="text-xl font-bold mb-2 text-theme-accent">
Google Gemini
</h3> <p class="text-theme-primary">
Najnowszy model AI Google z zaawansowanym rozumieniem
                        kontekstu
</p> </div> <div class="bg-theme-primary p-6 border border-theme-primary hover:bg-theme-secondary transition-colors duration-300"> <div class="text-4xl mb-4">⚡</div> <h3 class="text-xl font-bold mb-2 text-theme-accent">
Realtime Chat
</h3> <p class="text-theme-primary">
Natychmiastowe odpowiedzi - płynna konwersacja bez
                        opóźnień
</p> </div> </div> <!-- Main App Container --> <div class="bg-theme-primary border-2 border-theme-accent p-8 mb-12"> <div class="mb-6 flex items-center justify-between"> <h2 class="text-2xl font-bold text-theme-accent">
🎙️ Voice Assistant
</h2> <div class="flex gap-4"> <a${addAttribute(VOICE_CHAT_URL, "href")} target="_blank" rel="noopener noreferrer" class="bg-theme-accent text-theme-secondary px-6 py-2 font-semibold hover:bg-theme-secondary hover:text-theme-accent transition-colors border border-theme-primary">
Otwórz w nowym oknie →
</a> </div> </div> <!-- Loading Animation --> <div id="iframe-loader" class="text-center py-12"> <div class="inline-block animate-spin h-12 w-12 border-4 border-theme-accent border-t-transparent" style="border-radius: 50%;"></div> <p class="text-theme-primary mt-4">
Ładowanie Voice Chat...
</p> </div> <!-- Iframe --> <iframe id="voice-chat-iframe"${addAttribute(VOICE_CHAT_URL, "src")} class="w-full h-[800px] border-2 border-theme-primary opacity-0 transition-opacity duration-500" title="Google Voice Chat AI" allow="microphone"></iframe> </div> <!-- Info Section --> <div class="grid md:grid-cols-2 gap-8 mb-12"> <div class="bg-theme-primary p-6 border border-theme-primary hover:bg-theme-secondary transition-colors duration-300"> <h3 class="text-2xl font-bold mb-4 text-theme-accent">
📝 Jak używać?
</h3> <ol class="list-decimal list-inside space-y-2 text-theme-primary"> <li>Kliknij przycisk mikrofonu 🎤</li> <li>Pozwól na dostęp do mikrofonu (jeśli pyta)</li> <li>Zacznij mówić naturalnie</li> <li>AI odpowie głosowo i tekstowo</li> <li>Kontynuuj rozmowę w naturalny sposób</li> </ol> </div> <div class="bg-theme-primary p-6 border border-theme-primary hover:bg-theme-secondary transition-colors duration-300"> <h3 class="text-2xl font-bold mb-4 text-theme-accent">
⚙️ Technologie
</h3> <ul class="space-y-2 text-theme-primary"> <li> <strong>Framework:</strong> Astro 4.16 + React 18
</li> <li> <strong>AI Model:</strong> Google Gemini 2.0 Flash
</li> <li><strong>Voice API:</strong> Web Speech API</li> <li><strong>Styling:</strong> Tailwind CSS</li> <li><strong>Hosting:</strong> Cloudflare Pages</li> </ul> </div> </div> <!-- Deployment Info --> <div class="bg-theme-accent text-theme-secondary p-6 border-2 border-theme-primary"> <h3 class="text-2xl font-bold mb-4">🚀 Status Deploymentu</h3> <div class="grid md:grid-cols-2 gap-6"> <div> <p class="font-semibold mb-2">Główna aplikacja:</p> <a${addAttribute(VOICE_CHAT_URL, "href")} target="_blank" class="text-theme-primary hover:underline break-all"> ${VOICE_CHAT_URL} </a> </div> <div> <p class="font-semibold mb-2">Repozytorium GitHub:</p> <a href="https://github.com/Bonzokoles/ai-google-voice-chat" target="_blank" class="text-theme-primary hover:underline">
github.com/Bonzokoles/ai-google-voice-chat
</a> </div> </div> </div> </div> </div> ` })} ${renderScript($$result, "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/projekt-2/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/projekt-2/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/projekt-2/index.astro";
const $$url = "/eksperymenty/projekt-2";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
