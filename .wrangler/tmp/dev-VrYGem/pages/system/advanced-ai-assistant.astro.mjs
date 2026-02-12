globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { b as createAstro, c as createComponent, r as renderComponent, e as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Dkg1w919.mjs';
import { $ as $$PageHeader } from '../../chunks/PageHeader_DaikhrCu.mjs';
/* empty css                                                    */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$AdvancedAiAssistant = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdvancedAiAssistant;
  const description = "Zaawansowany asystent AI z wieloma modelami, trybami dzia\u0142ania i zaawansowanymi funkcjami. Powered by Cloudflare Workers AI.";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Zaawansowany Asystent AI - MyBonzo", "description": description, "data-astro-cid-db6vqaox": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "\u{1F916} Zaawansowany Asystent AI", "description": description, "animate": true, "data-astro-cid-db6vqaox": true })} ${maybeRenderHead()}<div class="container mx-auto px-4 py-12" data-astro-cid-db6vqaox> <div class="max-w-7xl mx-auto" data-astro-cid-db6vqaox> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6" data-astro-cid-db6vqaox> <!-- Sidebar - Settings & Models --> <div class="lg:col-span-1 space-y-6" data-astro-cid-db6vqaox> <!-- Model Selection --> <div class="settings-card" data-astro-cid-db6vqaox> <h3 class="settings-title" data-astro-cid-db6vqaox>🎯 Model AI</h3> <select id="modelSelect" class="settings-select" data-astro-cid-db6vqaox> <option value="@cf/meta/llama-2-7b-chat-int8" data-astro-cid-db6vqaox>Llama 2 7B (Szybki)</option> <option value="@cf/mistral/mistral-7b-instruct-v0.1" data-astro-cid-db6vqaox>Mistral 7B (Zalecany)</option> <option value="@cf/meta/llama-3-8b-instruct" data-astro-cid-db6vqaox>Llama 3 8B (Nowy)</option> <option value="@cf/meta/llama-3.1-8b-instruct" data-astro-cid-db6vqaox>Llama 3.1 8B (Najnowszy)</option> <option value="@hf/thebloke/neural-chat-7b-v3-1-awq" data-astro-cid-db6vqaox>Neural Chat 7B</option> </select> </div> <!-- Mode Selection --> <div class="settings-card" data-astro-cid-db6vqaox> <h3 class="settings-title" data-astro-cid-db6vqaox>⚙️ Tryb Pracy</h3> <div class="mode-buttons" data-astro-cid-db6vqaox> <button class="mode-btn active" data-mode="chat" data-astro-cid-db6vqaox>
💬 Chat
</button> <button class="mode-btn" data-mode="code" data-astro-cid-db6vqaox>
💻 Kod
</button> <button class="mode-btn" data-mode="creative" data-astro-cid-db6vqaox>
✨ Kreatywny
</button> <button class="mode-btn" data-mode="analysis" data-astro-cid-db6vqaox>
📊 Analiza
</button> </div> </div> <!-- Advanced Settings --> <div class="settings-card" data-astro-cid-db6vqaox> <h3 class="settings-title" data-astro-cid-db6vqaox>🎛️ Ustawienia</h3> <div class="setting-item" data-astro-cid-db6vqaox> <label for="temperature" class="setting-label" data-astro-cid-db6vqaox>
Temperatura: <span id="tempValue" data-astro-cid-db6vqaox>0.7</span> </label> <input type="range" id="temperature" min="0" max="1" step="0.1" value="0.7" class="setting-slider" data-astro-cid-db6vqaox> <p class="setting-hint" data-astro-cid-db6vqaox>Wyższe = bardziej kreatywne</p> </div> <div class="setting-item" data-astro-cid-db6vqaox> <label for="maxTokens" class="setting-label" data-astro-cid-db6vqaox>
Max Tokenów: <span id="tokensValue" data-astro-cid-db6vqaox>1024</span> </label> <input type="range" id="maxTokens" min="256" max="2048" step="256" value="1024" class="setting-slider" data-astro-cid-db6vqaox> <p class="setting-hint" data-astro-cid-db6vqaox>Długość odpowiedzi</p> </div> <div class="setting-item" data-astro-cid-db6vqaox> <label class="flex items-center gap-2" data-astro-cid-db6vqaox> <input type="checkbox" id="saveHistory" checked class="setting-checkbox" data-astro-cid-db6vqaox> <span class="setting-label" data-astro-cid-db6vqaox>Zapisuj historię</span> </label> </div> </div> <!-- Actions --> <div class="settings-card" data-astro-cid-db6vqaox> <h3 class="settings-title" data-astro-cid-db6vqaox>🔧 Akcje</h3> <div class="action-buttons" data-astro-cid-db6vqaox> <button id="exportBtn" class="action-btn" data-astro-cid-db6vqaox>
💾 Eksportuj
</button> <button id="clearHistoryBtn" class="action-btn" data-astro-cid-db6vqaox>
🗑️ Wyczyść historię
</button> <button id="resetBtn" class="action-btn" data-astro-cid-db6vqaox>
🔄 Reset
</button> </div> </div> <!-- Stats --> <div class="settings-card" data-astro-cid-db6vqaox> <h3 class="settings-title" data-astro-cid-db6vqaox>📊 Statystyki</h3> <div class="stats" data-astro-cid-db6vqaox> <div class="stat-item" data-astro-cid-db6vqaox> <span class="stat-label" data-astro-cid-db6vqaox>Wiadomości:</span> <span id="msgCount" class="stat-value" data-astro-cid-db6vqaox>0</span> </div> <div class="stat-item" data-astro-cid-db6vqaox> <span class="stat-label" data-astro-cid-db6vqaox>Sesje:</span> <span id="sessionCount" class="stat-value" data-astro-cid-db6vqaox>0</span> </div> <div class="stat-item" data-astro-cid-db6vqaox> <span class="stat-label" data-astro-cid-db6vqaox>Cache hit:</span> <span id="cacheHit" class="stat-value" data-astro-cid-db6vqaox>0%</span> </div> </div> </div> </div> <!-- Main Chat Area --> <div class="lg:col-span-3 space-y-6" data-astro-cid-db6vqaox> <!-- Prompt Templates --> <div class="prompt-templates-card" data-astro-cid-db6vqaox> <h3 class="templates-title" data-astro-cid-db6vqaox>💡 Przykładowe Prompty</h3> <div id="promptTemplates" class="prompt-grid" data-astro-cid-db6vqaox> <!-- Templates will be loaded by JavaScript based on mode --> </div> </div> <!-- Chat Container --> <div class="chat-container" data-astro-cid-db6vqaox> <div class="chat-header" data-astro-cid-db6vqaox> <div class="flex items-center justify-between" data-astro-cid-db6vqaox> <div data-astro-cid-db6vqaox> <h3 class="chat-title" data-astro-cid-db6vqaox>Konwersacja</h3> <p id="modelInfo" class="chat-subtitle" data-astro-cid-db6vqaox>Llama 2 7B • Tryb: Chat</p> </div> <div class="flex gap-2" data-astro-cid-db6vqaox> <button id="newChatBtn" class="header-btn" title="Nowa konwersacja" data-astro-cid-db6vqaox>
➕
</button> <button id="saveChatBtn" class="header-btn" title="Zapisz konwersację" data-astro-cid-db6vqaox>
💾
</button> </div> </div> </div> <div id="messagesContainer" class="messages-area" data-astro-cid-db6vqaox> <div class="message ai-message" data-astro-cid-db6vqaox> <div class="message-avatar" data-astro-cid-db6vqaox>🤖</div> <div class="message-content" data-astro-cid-db6vqaox> <div class="message-header" data-astro-cid-db6vqaox> <span class="message-sender" data-astro-cid-db6vqaox>Asystent AI</span> <span class="message-time" data-astro-cid-db6vqaox>Teraz</span> </div> <div class="message-text" data-astro-cid-db6vqaox> <p data-astro-cid-db6vqaox>Witaj! Jestem zaawansowanym asystentem AI MyBonzo.</p> <p data-astro-cid-db6vqaox>Wybierz tryb pracy z lewej strony lub skorzystaj z gotowych przykładów powyżej.</p> <p data-astro-cid-db6vqaox><strong data-astro-cid-db6vqaox>Możesości:</strong></p> <ul data-astro-cid-db6vqaox> <li data-astro-cid-db6vqaox>💬 Rozmowa na różne tematy</li> <li data-astro-cid-db6vqaox>💻 Pomoc w programowaniu</li> <li data-astro-cid-db6vqaox>✨ Kreatywne pisanie</li> <li data-astro-cid-db6vqaox>📊 Analiza danych i tekstów</li> </ul> </div> </div> </div> </div> <div class="chat-input-area" data-astro-cid-db6vqaox> <form id="chatForm" class="input-form" data-astro-cid-db6vqaox> <div class="input-container" data-astro-cid-db6vqaox> <textarea id="messageInput" placeholder="Wpisz wiadomość... (Shift+Enter dla nowej linii)" rows="3" maxlength="2000" class="message-textarea" data-astro-cid-db6vqaox></textarea> <div class="input-footer" data-astro-cid-db6vqaox> <div class="flex items-center gap-4" data-astro-cid-db6vqaox> <span id="charCounter" class="char-counter" data-astro-cid-db6vqaox>0/2000</span> <span id="statusIndicator" class="status-indicator" data-astro-cid-db6vqaox>Gotowy</span> </div> <button type="submit" id="sendBtn" class="send-button" data-astro-cid-db6vqaox> <span id="sendBtnText" data-astro-cid-db6vqaox>📤 Wyślij</span> </button> </div> </div> </form> </div> </div> </div> </div> </div> </div> ` })}  ${renderScript($$result, "U:/WWW_MYbonzoai_blog/src/pages/system/advanced-ai-assistant.astro?astro&type=script&index=0&lang.ts")}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/system/advanced-ai-assistant.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/system/advanced-ai-assistant.astro";
const $$url = "/system/advanced-ai-assistant";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AdvancedAiAssistant,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
