globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CENSSoee.mjs';
import { C as CHAT_MODELS } from '../../chunks/ai-chat-models_DfqCo_61.mjs';
import { $ as $$AIChat } from '../../chunks/AIChat.Enhanced_BKD4ZnM1.mjs';
import { $ as $$PageHeader } from '../../chunks/PageHeader_DaikhrCu.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Dkg1w919.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$AiChat = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AiChat;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Asystent AI | MyBonzo AI Blog", "data-astro-cid-rk23mbqz": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "\u{1F916} Asystent AI MyBonzo", "description": "Unified AI Chat z Cloudflare AI i OpenAI Gateway. Wybierz providera, zadawaj pytania, korzystaj ze streamingu i historii rozm\xF3w.", "data-astro-cid-rk23mbqz": true })} ${maybeRenderHead()}<div class="ai-chat-page-shell" data-astro-cid-rk23mbqz> ${renderComponent($$result2, "AIChat", $$AIChat, { "maxLength": 900, "enableStreaming": true, "enableMCPTools": true, "enableGateway": true, "data-astro-cid-rk23mbqz": true })} <section class="ai-chat-info-card" data-astro-cid-rk23mbqz> <h3 data-astro-cid-rk23mbqz>Przykladowe pytania</h3> <ul data-astro-cid-rk23mbqz> <li data-astro-cid-rk23mbqz>
Jakie narzedzia AI polecacie do tworzenia tresci marketingowych?
</li> <li data-astro-cid-rk23mbqz>Wyjasnij prostymi slowami, czym jest uczenie maszynowe.</li> <li data-astro-cid-rk23mbqz>Pomoz mi dobrac model AI do analizy danych finansowych.</li> <li data-astro-cid-rk23mbqz>Jak zautomatyzowac obsluge klienta w malej firmie?</li> <li data-astro-cid-rk23mbqz>Jakie sa najnowsze trendy w sztucznej inteligencji?</li> </ul> </section> <section class="ai-chat-info-card" data-astro-cid-rk23mbqz> <h3 data-astro-cid-rk23mbqz>Dostepne modele Cloudflare</h3> <p data-astro-cid-rk23mbqz>
Wybierz model, ktory najlepiej pasuje do twojej rozmowy. Domyslnie
        aktywna jest Gemma 3 12B IT, ale w kazdej chwili mozesz przelaczyc sie
        na inny wariant.
</p> <ul data-astro-cid-rk23mbqz> ${CHAT_MODELS.map((model) => renderTemplate`<li data-astro-cid-rk23mbqz> <strong data-astro-cid-rk23mbqz>${model.label}</strong> <span data-astro-cid-rk23mbqz>${model.description}</span> ${model.usageHint && renderTemplate`<em data-astro-cid-rk23mbqz>${model.usageHint}</em>`} </li>`)} </ul> </section> <section class="ai-chat-info-card" data-astro-cid-rk23mbqz> <h3 data-astro-cid-rk23mbqz>✨ Nowe funkcje Enhanced</h3> <ul data-astro-cid-rk23mbqz> <li data-astro-cid-rk23mbqz> <strong data-astro-cid-rk23mbqz>🔄 Streaming</strong> - Odpowiedzi w czasie rzeczywistym, slowo
          po slowie
</li> <li data-astro-cid-rk23mbqz> <strong data-astro-cid-rk23mbqz>🧠 MCP Tools</strong> - Context7, Sequential Thinking, Filesystem,
          Memory
</li> <li data-astro-cid-rk23mbqz> <strong data-astro-cid-rk23mbqz>🚀 AI Gateway</strong> - Cloudflare Gateway z cache i analytics
</li> <li data-astro-cid-rk23mbqz><strong data-astro-cid-rk23mbqz>📤 Export</strong> - Zapisz cala konwersacje do JSON</li> <li data-astro-cid-rk23mbqz> <strong data-astro-cid-rk23mbqz>📊 Status Badges</strong> - Zobacz na zywo aktywne funkcje
</li> <li data-astro-cid-rk23mbqz> <strong data-astro-cid-rk23mbqz>💾 Cache Indicator</strong> - Sprawdz, czy odpowiedz pochodzi z
          cache
</li> </ul> </section> <section class="ai-chat-info-card" data-astro-cid-rk23mbqz> <h3 data-astro-cid-rk23mbqz>Wskazowki uzytkowe</h3> <ul data-astro-cid-rk23mbqz> <li data-astro-cid-rk23mbqz>
Piszesz po polsku? Model automatycznie odpowiada w tym samym jezyku.
</li> <li data-astro-cid-rk23mbqz>Potrzebujesz analizy krok po kroku? Wyprobuj Qwen QWQ 32B.</li> <li data-astro-cid-rk23mbqz>
Chcesz szybkiej odpowiedzi? Lekki Phi-2 odpowiada niemal natychmiast.
</li> <li data-astro-cid-rk23mbqz>Stawiasz na naturalna rozmowe? Wybierz OpenChat 3.5.</li> <li data-astro-cid-rk23mbqz>
Uzyj przelacznikow aby wylacz/wlacz funkcje (Streaming, Gateway, MCP).
</li> <li data-astro-cid-rk23mbqz>Kliknij przycisk MCP, aby zobaczyc dostepne narzedzia AI.</li> <li data-astro-cid-rk23mbqz>
Eksportuj konwersacje przyciskiem Export dla pozniejszego uzycia.
</li> </ul> </section> </div> ` })} `;
}, "U:/WWW_MYbonzoai_blog/src/pages/system/ai-chat.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/system/ai-chat.astro";
const $$url = "/system/ai-chat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AiChat,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
