globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../../chunks/Layout_CUoF9Ydm.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

const $$AiChat = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "AI Chat - Bonzo AI Assistant", "description": "Rozmawiaj z AI asytentem Bonzo", "data-astro-cid-cidxde2y": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="w-full min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" data-astro-cid-cidxde2y> <div class="container mx-auto px-4 py-8" data-astro-cid-cidxde2y> <div class="max-w-6xl mx-auto" data-astro-cid-cidxde2y> <div class="mb-8 text-center" data-astro-cid-cidxde2y> <h1 class="text-4xl font-bold text-white mb-4" data-astro-cid-cidxde2y>
🤖 AI Chat Assistant
</h1> <p class="text-gray-300 text-lg" data-astro-cid-cidxde2y>
Eksperymentalny chatbot z OpenAI GPT-4
</p> </div> <div class="bg-white rounded-2xl shadow-2xl overflow-hidden" style="height: calc(100vh - 250px); min-height: 600px;" data-astro-cid-cidxde2y> <iframe src="https://main.bonzo-ai-chat.pages.dev" class="w-full h-full border-0" title="Bonzo AI Chat" allow="clipboard-write" loading="lazy" data-astro-cid-cidxde2y></iframe> </div> <div class="mt-6 text-center text-sm text-gray-400" data-astro-cid-cidxde2y> <p data-astro-cid-cidxde2y>
Powered by Cloudflare Pages + OpenAI GPT-4 |
<a href="https://github.com/Bonzokoles/bonzo-ai-chat" target="_blank" rel="noopener" class="text-purple-400 hover:text-purple-300 underline" data-astro-cid-cidxde2y>
Zobacz kod na GitHub
</a> </p> </div> </div> </div> </div> ` })} `;
}, "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/ai-chat.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/ai-chat.astro";
const $$url = "/eksperymenty/ai-chat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$AiChat,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
