globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CENSSoee.mjs';
import { $ as $$AIChat } from '../../chunks/AIChat.Enhanced_BKD4ZnM1.mjs';
import { $ as $$PageHeader } from '../../chunks/PageHeader_DwjQcEuj.mjs';
import { $ as $$Layout } from '../../chunks/Layout_CUoF9Ydm.mjs';
import { C as CHAT_MODELS } from '../../chunks/ai-chat-models_DfqCo_61.mjs';
/* empty css                                           */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$AiChatMain = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AiChatMain;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Enhanced AI Chat | MyBonzo AI Blog", "data-astro-cid-nnsft2af": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "\u{1F680} Enhanced AI Chat", "description": "Nowa wersja asystenta AI z zaawansowanymi funkcjami: persistence, streaming, export i wi\u0119cej", "data-astro-cid-nnsft2af": true })} ${maybeRenderHead()}<div class="enhanced-chat-page" data-astro-cid-nnsft2af> <!-- Main Chat Component --> ${renderComponent($$result2, "AIChat", $$AIChat, { "maxLength": 1e3, "enablePersistence": true, "enableHistorySidebar": true, "enableStreaming": true, "data-astro-cid-nnsft2af": true })} <!-- Features Section --> <section class="features-grid" data-astro-cid-nnsft2af> <div class="feature-card" data-astro-cid-nnsft2af> <div class="feature-icon" data-astro-cid-nnsft2af>💾</div> <h3 data-astro-cid-nnsft2af>Persistence & History</h3> <p data-astro-cid-nnsft2af>
Wszystkie konwersacje są automatycznie zapisywane lokalnie. Przeglądaj historię,
          wyszukuj w poprzednich rozmowach i przywracaj kontekst.
</p> <ul class="feature-list" data-astro-cid-nnsft2af> <li data-astro-cid-nnsft2af>Automatyczne zapisywanie w localStorage</li> <li data-astro-cid-nnsft2af>Pełna historia konwersacji</li> <li data-astro-cid-nnsft2af>Wyszukiwanie full-text</li> <li data-astro-cid-nnsft2af>Nieograniczona liczba rozmów</li> </ul> </div> <div class="feature-card" data-astro-cid-nnsft2af> <div class="feature-icon" data-astro-cid-nnsft2af>📥</div> <h3 data-astro-cid-nnsft2af>Multi-Format Export</h3> <p data-astro-cid-nnsft2af>
Eksportuj konwersacje w 4 różnych formatach. Idealny do dokumentacji,
          udostępniania lub archiwizacji.
</p> <ul class="feature-list" data-astro-cid-nnsft2af> <li data-astro-cid-nnsft2af><strong data-astro-cid-nnsft2af>JSON</strong> - Pełne dane strukturalne</li> <li data-astro-cid-nnsft2af><strong data-astro-cid-nnsft2af>TXT</strong> - Prosty format tekstowy</li> <li data-astro-cid-nnsft2af><strong data-astro-cid-nnsft2af>Markdown</strong> - Z formatowaniem</li> <li data-astro-cid-nnsft2af><strong data-astro-cid-nnsft2af>HTML</strong> - Gotowy do publikacji</li> </ul> </div> <div class="feature-card" data-astro-cid-nnsft2af> <div class="feature-icon" data-astro-cid-nnsft2af>⚡</div> <h3 data-astro-cid-nnsft2af>Real-time Streaming</h3> <p data-astro-cid-nnsft2af>
Odpowiedzi AI streamowane w czasie rzeczywistym. Widzisz tekst
          pojawiający się słowo po słowie, jak w ChatGPT.
</p> <ul class="feature-list" data-astro-cid-nnsft2af> <li data-astro-cid-nnsft2af>Server-Sent Events (SSE)</li> <li data-astro-cid-nnsft2af>Progressive rendering</li> <li data-astro-cid-nnsft2af>Opcjonalne włączanie/wyłączanie</li> <li data-astro-cid-nnsft2af>Fallback do standardowego trybu</li> </ul> </div> <div class="feature-card" data-astro-cid-nnsft2af> <div class="feature-icon" data-astro-cid-nnsft2af>⭐</div> <h3 data-astro-cid-nnsft2af>Smart Organization</h3> <p data-astro-cid-nnsft2af>
Oznaczaj ważne konwersacje, wyszukuj po treści i zarządzaj
          rozmowami z eleganckim sidebar UI.
</p> <ul class="feature-list" data-astro-cid-nnsft2af> <li data-astro-cid-nnsft2af>Bookmarking ulubionych rozmów</li> <li data-astro-cid-nnsft2af>Automatyczne tytuły konwersacji</li> <li data-astro-cid-nnsft2af>Sortowanie po dacie aktualizacji</li> <li data-astro-cid-nnsft2af>Batch delete i export</li> </ul> </div> </section> <!-- Available Models --> <section class="models-section" data-astro-cid-nnsft2af> <h2 data-astro-cid-nnsft2af>Dostępne modele AI</h2> <div class="models-grid" data-astro-cid-nnsft2af> ${CHAT_MODELS.map((model) => renderTemplate`<div class="model-card" data-astro-cid-nnsft2af> <h3 data-astro-cid-nnsft2af>${model.label}</h3> <p class="model-description" data-astro-cid-nnsft2af>${model.description}</p> ${model.usageHint && renderTemplate`<p class="model-hint" data-astro-cid-nnsft2af> <strong data-astro-cid-nnsft2af>Najlepszy dla:</strong> ${model.usageHint} </p>`} <code class="model-id" data-astro-cid-nnsft2af>${model.id}</code> </div>`)} </div> </section> <!-- Usage Tips --> <section class="tips-section" data-astro-cid-nnsft2af> <h2 data-astro-cid-nnsft2af>💡 Wskazówki użytkowe</h2> <div class="tips-grid" data-astro-cid-nnsft2af> <div class="tip-card" data-astro-cid-nnsft2af> <h4 data-astro-cid-nnsft2af>🔄 Przełączaj modele</h4> <p data-astro-cid-nnsft2af>
Możesz zmienić model AI w trakcie konwersacji. Każdy model ma inne
            mocne strony - eksperymentuj!
</p> </div> <div class="tip-card" data-astro-cid-nnsft2af> <h4 data-astro-cid-nnsft2af>📊 Streaming vs Standard</h4> <p data-astro-cid-nnsft2af>
Streaming daje natychmiastowy feedback, ale standard mode może być szybszy
            dla krótkich odpowiedzi.
</p> </div> <div class="tip-card" data-astro-cid-nnsft2af> <h4 data-astro-cid-nnsft2af>💾 Export dla dokumentacji</h4> <p data-astro-cid-nnsft2af>
Używaj Markdown export do tworzenia dokumentacji technicznej.
            HTML export jest świetny do udostępniania.
</p> </div> <div class="tip-card" data-astro-cid-nnsft2af> <h4 data-astro-cid-nnsft2af>🔍 Szukaj w historii</h4> <p data-astro-cid-nnsft2af>
Wyszukiwarka znajduje tekst zarówno w tytułach jak i treści wiadomości.
            Świetne do odnajdywania starych rozmów.
</p> </div> <div class="tip-card" data-astro-cid-nnsft2af> <h4 data-astro-cid-nnsft2af>⭐ Oznaczaj ulubione</h4> <p data-astro-cid-nnsft2af>
Bookmarkuj ważne konwersacje aby szybko do nich wracać.
            Ulubione są wyróżnione gwiazdką.
</p> </div> <div class="tip-card" data-astro-cid-nnsft2af> <h4 data-astro-cid-nnsft2af>🎨 Markdown formatting</h4> <p data-astro-cid-nnsft2af>
AI odpowiada w Markdown - używaj **pogrubienia**, *kursywy*,
            \`kodu\` i bloków \`\`\`code\`\`\` dla lepszej czytelności.
</p> </div> </div> </section> <!-- Technical Details --> <section class="technical-section" data-astro-cid-nnsft2af> <h2 data-astro-cid-nnsft2af>🔧 Szczegóły techniczne</h2> <div class="tech-grid" data-astro-cid-nnsft2af> <div class="tech-card" data-astro-cid-nnsft2af> <h3 data-astro-cid-nnsft2af>Performance</h3> <ul data-astro-cid-nnsft2af> <li data-astro-cid-nnsft2af>📦 <strong data-astro-cid-nnsft2af>Bundle Size:</strong> ~33KB total</li> <li data-astro-cid-nnsft2af>⚡ <strong data-astro-cid-nnsft2af>Load Time:</strong> &lt;1s initial</li> <li data-astro-cid-nnsft2af>💾 <strong data-astro-cid-nnsft2af>Storage:</strong> localStorage only</li> <li data-astro-cid-nnsft2af>🔄 <strong data-astro-cid-nnsft2af>Rate Limit:</strong> 15 req/min (streaming)</li> </ul> </div> <div class="tech-card" data-astro-cid-nnsft2af> <h3 data-astro-cid-nnsft2af>Security & Privacy</h3> <ul data-astro-cid-nnsft2af> <li data-astro-cid-nnsft2af>🔐 <strong data-astro-cid-nnsft2af>Local-first:</strong> Data w localStorage</li> <li data-astro-cid-nnsft2af>🚫 <strong data-astro-cid-nnsft2af>No tracking:</strong> Zero analytics</li> <li data-astro-cid-nnsft2af>✅ <strong data-astro-cid-nnsft2af>Sanitized HTML:</strong> XSS protection</li> <li data-astro-cid-nnsft2af>🛡️ <strong data-astro-cid-nnsft2af>Rate limiting:</strong> Abuse prevention</li> </ul> </div> <div class="tech-card" data-astro-cid-nnsft2af> <h3 data-astro-cid-nnsft2af>Browser Support</h3> <ul data-astro-cid-nnsft2af> <li data-astro-cid-nnsft2af>✅ Chrome/Edge 90+</li> <li data-astro-cid-nnsft2af>✅ Firefox 88+</li> <li data-astro-cid-nnsft2af>✅ Safari 14+</li> <li data-astro-cid-nnsft2af>⚠️ IE not supported</li> </ul> </div> <div class="tech-card" data-astro-cid-nnsft2af> <h3 data-astro-cid-nnsft2af>APIs Used</h3> <ul data-astro-cid-nnsft2af> <li data-astro-cid-nnsft2af>🤖 Cloudflare Workers AI</li> <li data-astro-cid-nnsft2af>💾 localStorage API</li> <li data-astro-cid-nnsft2af>📡 Server-Sent Events</li> <li data-astro-cid-nnsft2af>📋 Clipboard API</li> </ul> </div> </div> </section> <!-- Example Conversations --> <section class="examples-section" data-astro-cid-nnsft2af> <h2 data-astro-cid-nnsft2af>📝 Przykładowe konwersacje</h2> <div class="examples-grid" data-astro-cid-nnsft2af> <div class="example-card" data-astro-cid-nnsft2af> <h4 data-astro-cid-nnsft2af>Analiza techniczna</h4> <div class="example-messages" data-astro-cid-nnsft2af> <div class="example-message user" data-astro-cid-nnsft2af>
Jaka jest różnica między REST a GraphQL?
</div> <div class="example-message ai" data-astro-cid-nnsft2af>
REST i GraphQL to dwa różne podejścia do projektowania API...
<br data-astro-cid-nnsft2af><strong data-astro-cid-nnsft2af>REST:</strong> Endpoint-centric, fixed structure
<br data-astro-cid-nnsft2af><strong data-astro-cid-nnsft2af>GraphQL:</strong> Query-centric, flexible schema
</div> </div> <span class="example-model" data-astro-cid-nnsft2af>Model: Gemma 3 12B IT</span> </div> <div class="example-card" data-astro-cid-nnsft2af> <h4 data-astro-cid-nnsft2af>Problem-solving</h4> <div class="example-messages" data-astro-cid-nnsft2af> <div class="example-message user" data-astro-cid-nnsft2af>
Jak zoptymalizować performance aplikacji React?
</div> <div class="example-message ai" data-astro-cid-nnsft2af>
Oto kluczowe strategie optymalizacji:
<br data-astro-cid-nnsft2af>1. React.memo() dla komponentów
<br data-astro-cid-nnsft2af>2. useMemo() i useCallback()
<br data-astro-cid-nnsft2af>3. Code splitting z lazy()
<br data-astro-cid-nnsft2af>4. Virtualizacja długich list
</div> </div> <span class="example-model" data-astro-cid-nnsft2af>Model: Qwen QWQ 32B</span> </div> <div class="example-card" data-astro-cid-nnsft2af> <h4 data-astro-cid-nnsft2af>Szybkie Q&A</h4> <div class="example-messages" data-astro-cid-nnsft2af> <div class="example-message user" data-astro-cid-nnsft2af>
Czym jest TypeScript?
</div> <div class="example-message ai" data-astro-cid-nnsft2af>
TypeScript to superset JavaScript z typowaniem statycznym.
              Kompiluje się do JS, dodając type safety w rozwoju.
</div> </div> <span class="example-model" data-astro-cid-nnsft2af>Model: Phi-2</span> </div> </div> </section> <!-- Call to Action --> <section class="cta-section" data-astro-cid-nnsft2af> <h2 data-astro-cid-nnsft2af>Gotowy do wypróbowania?</h2> <p data-astro-cid-nnsft2af>
Zacznij rozmowę z AI powyżej i odkryj wszystkie funkcje Enhanced Chat.
        Twoje konwersacje zostaną automatycznie zapisane lokalnie.
</p> <div class="cta-buttons" data-astro-cid-nnsft2af> <a href="#" onclick="document.getElementById('chat-input')?.focus(); return false;" class="btn btn-primary btn-large" data-astro-cid-nnsft2af>
Zacznij rozmowę
</a> <a href="/ENHANCED_CHAT_DOCS" class="btn btn-secondary btn-large" data-astro-cid-nnsft2af>
Przeczytaj dokumentację
</a> </div> </section> </div> ` })} `;
}, "U:/WWW_MYbonzoai_blog/src/pages/system/ai-chat-main.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/system/ai-chat-main.astro";
const $$url = "/system/ai-chat-main";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AiChatMain,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
