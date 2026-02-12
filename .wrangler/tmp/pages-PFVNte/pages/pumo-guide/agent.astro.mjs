globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as renderScript } from '../../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../../chunks/Layout_CUoF9Ydm.mjs';
import { $ as $$PumoBreadcrumbs } from '../../chunks/PumoBreadcrumbs_BAR-5UZm.mjs';
import { $ as $$PumoStructuredData } from '../../chunks/PumoStructuredData_DHccGT0g.mjs';
export { renderers } from '../../renderers.mjs';

const $$Agent = createComponent(async ($$result, $$props, $$slots) => {
  const title = "Rozmawiaj z Ekspertem Pumo";
  const description = "Chatbot AI oparty na DeepSeek R1 - zadaj pytanie o meble Pumo";
  return renderTemplate`${renderComponent($$result, "PumoStructuredData", $$PumoStructuredData, { "pageType": "chat", "title": title, "description": description })} ${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-2xl mx-auto px-4 py-8"> ${renderComponent($$result2, "PumoBreadcrumbs", $$PumoBreadcrumbs, { "current": "Asystent AI" })} <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700"> <div class="bg-gradient-to-r from-blue-700 to-purple-800 p-4"> <h1 class="text-xl font-bold text-white flex items-center gap-2">
🤖 Asystent Pumo (DeepSeek R1)
</h1> <p class="text-blue-200 text-sm">
Zadaj pytanie o meble, aranżację lub dostępność.
</p> </div> <div id="chat-box" class="h-96 overflow-y-auto p-4 space-y-4 bg-gray-900"> <div class="flex gap-3"> <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
AI
</div> <div class="bg-gray-800 p-3 rounded-lg rounded-tl-none max-w-[80%]">
Cześć! Jestem Twoim wirtualnym doradcą. Szukasz biurka, łóżka, czy
            może inspiracji do salonu?
</div> </div> </div> <div class="p-4 bg-gray-800 border-t border-gray-700"> <form id="chat-form" class="flex gap-2"> <input type="text" id="user-input" class="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-white" placeholder="Np. jakie biurko dla dziecka polecasz?"> <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
Wyślij
</button> </form> </div> </div> </div> ${renderScript($$result2, "U:/WWW_MYbonzoai_blog/src/pages/pumo-guide/agent.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/pumo-guide/agent.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/pumo-guide/agent.astro";
const $$url = "/pumo-guide/agent";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Agent,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
