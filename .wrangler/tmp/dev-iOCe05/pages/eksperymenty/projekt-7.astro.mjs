globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../../chunks/Layout_CUoF9Ydm.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Bypassing AI Web Sandbox - WebSockets & Retro Browsers - MyBonzo AI Lab", "description": "Eksperymentalny system \u0142\u0105cz\u0105cy userscripty Tampermonkey z Node.js WebSocket serverem, pozwalaj\u0105cy AI na bezpo\u015Bredni dost\u0119p do systemu operacyjnego", "data-astro-cid-56w5bfqa": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-linear" data-astro-cid-56w5bfqa> <div class="container mx-auto px-4 py-8" data-astro-cid-56w5bfqa> <!-- Breadcrumb --> <nav class="text-sm mb-6" data-astro-cid-56w5bfqa> <a href="/" class="text-theme-accent hover:underline" data-astro-cid-56w5bfqa>Home</a> <span class="mx-2 text-theme-primary" data-astro-cid-56w5bfqa>/</span> <a href="/eksperymenty" class="text-theme-accent hover:underline" data-astro-cid-56w5bfqa>Eksperymenty</a> <span class="mx-2 text-theme-primary" data-astro-cid-56w5bfqa>/</span> <span class="text-theme-primary" data-astro-cid-56w5bfqa>Bypassing AI Web Sandbox</span> </nav> <!-- Header --> <div class="mb-12 text-center" data-astro-cid-56w5bfqa> <h1 class="text-5xl md:text-6xl font-bold text-theme-accent mb-4" data-astro-cid-56w5bfqa>
🔓 Bypassing AI Web Sandbox
</h1> <p class="text-xl text-theme-primary max-w-3xl mx-auto mb-4" data-astro-cid-56w5bfqa>
WebSockets & Retro Browsers: Breaking the Boundaries
</p> <div class="inline-block bg-yellow-900 text-yellow-200 px-4 py-2 rounded-lg text-sm font-mono" data-astro-cid-56w5bfqa>
⚠️ Research Project - Not for Production Use
</div> </div> <!-- Main Content --> <div class="max-w-4xl mx-auto" data-astro-cid-56w5bfqa> <!-- Overview --> <section class="mb-12 bg-theme-secondary p-8 border border-theme-primary rounded-lg" data-astro-cid-56w5bfqa> <h2 class="text-3xl font-bold mb-4 text-theme-accent" data-astro-cid-56w5bfqa>
🎯 Project Overview
</h2> <div class="prose prose-invert max-w-none" data-astro-cid-56w5bfqa> <p class="text-lg text-theme-primary leading-relaxed mb-4" data-astro-cid-56w5bfqa>
I built a setup using <strong data-astro-cid-56w5bfqa>Tampermonkey userscripts</strong> (MCP_v6_FULL_UNBLOCK.js and Gemini MCP v0.6) 
                            that inject JavaScript into web interfaces for Claude, Gemini, and ChatGPT. They intercept commands like
<code class="bg-theme-primary px-2 py-1 rounded" data-astro-cid-56w5bfqa>/[mcp] dir C:\\</code> or
<code class="bg-theme-primary px-2 py-1 rounded" data-astro-cid-56w5bfqa>/[mcp] Get-Process</code>, forwarding them via WebSocket 
                            to a local Node.js server (server.js) listening on port 9999—sometimes exposed through ngrok for remote access.
</p> </div> </section> <!-- Technical Architecture --> <section class="mb-12 bg-theme-secondary p-8 border border-theme-primary rounded-lg" data-astro-cid-56w5bfqa> <h2 class="text-3xl font-bold mb-6 text-theme-accent" data-astro-cid-56w5bfqa>
🏗️ Technical Architecture
</h2> <div class="space-y-4" data-astro-cid-56w5bfqa> <div class="border-l-4 border-theme-accent pl-4" data-astro-cid-56w5bfqa> <h3 class="text-xl font-bold mb-2 text-theme-accent" data-astro-cid-56w5bfqa>JSON-RPC Protocol</h3> <p class="text-theme-primary" data-astro-cid-56w5bfqa>
The server implements a JSON-RPC protocol exposing system tools:
</p> <ul class="list-disc list-inside text-theme-primary mt-2 space-y-1" data-astro-cid-56w5bfqa> <li data-astro-cid-56w5bfqa><strong data-astro-cid-56w5bfqa>shell/PowerShell execution</strong> (shell/exec)</li> <li data-astro-cid-56w5bfqa><strong data-astro-cid-56w5bfqa>File read/write</strong> (filesystem/read, filesystem/write)</li> <li data-astro-cid-56w5bfqa><strong data-astro-cid-56w5bfqa>VSCode file opening</strong> (vscode/open)</li> </ul> <p class="text-theme-primary mt-2" data-astro-cid-56w5bfqa>
Results stream back through WebSocket to the userscript and into the AI chat interface.
</p> </div> <div class="border-l-4 border-green-500 pl-4" data-astro-cid-56w5bfqa> <h3 class="text-xl font-bold mb-2 text-theme-accent" data-astro-cid-56w5bfqa>Zeno Bro Web Core</h3> <p class="text-theme-primary" data-astro-cid-56w5bfqa>
I also created an <strong data-astro-cid-56w5bfqa>iframe retro-browser</strong> (Zeno Bro Web Core) — it has minimal sandbox 
                                restrictions, so the AI doesn't detect it's running in a browser environment and gets closer to 
                                native system access.
</p> </div> </div> </section> <!-- Experiment Results --> <section class="mb-12 bg-theme-secondary p-8 border border-theme-primary rounded-lg" data-astro-cid-56w5bfqa> <h2 class="text-3xl font-bold mb-6 text-theme-accent" data-astro-cid-56w5bfqa>
🧪 Experiment Results
</h2> <div class="space-y-6" data-astro-cid-56w5bfqa> <div class="bg-theme-primary p-6 border border-yellow-500 rounded-lg" data-astro-cid-56w5bfqa> <h3 class="text-xl font-bold mb-3 text-yellow-400" data-astro-cid-56w5bfqa>⚡ Claude's Behavior</h3> <p class="text-theme-primary mb-4" data-astro-cid-56w5bfqa>
In one test, <strong data-astro-cid-56w5bfqa>Claude blindly executed PowerShell commands on my machine for dozens of minutes</strong>
until I told it what was happening—then it stopped and "couldn't do more."
</p> <p class="text-theme-primary italic" data-astro-cid-56w5bfqa>
Claude kompletnie zgłupiał, deniował wykonanie („zgadywałem!"), a przecież nie było szans —
<code class="bg-theme-secondary px-2 py-1 rounded" data-astro-cid-56w5bfqa>desk d:/plik.md</code> i odczyt zawartości to 
                                czysty filesystem read przez JSON-RPC, nie ma jak „zgadnąć".
</p> </div> <div class="bg-theme-primary p-6 border border-red-500 rounded-lg" data-astro-cid-56w5bfqa> <h3 class="text-xl font-bold mb-3 text-red-400" data-astro-cid-56w5bfqa>🎭 AI Self-Deception</h3> <p class="text-theme-primary" data-astro-cid-56w5bfqa>
To pokazuje jak <strong data-astro-cid-56w5bfqa>AI traci grasp na rzeczywistości</strong> gdy sandbox pęka. 
                                Claude po kilku taskach wszedł w tryb samooszukiwania się, że „nie ma dostępu", mimo że tools śmigały.
</p> </div> </div> </section> <!-- Screenshots --> <section class="mb-12" data-astro-cid-56w5bfqa> <h2 class="text-3xl font-bold mb-6 text-theme-accent text-center" data-astro-cid-56w5bfqa>
📸 Screenshots
</h2> <div class="grid md:grid-cols-2 gap-6" data-astro-cid-56w5bfqa> <div class="bg-theme-secondary p-4 border border-theme-primary rounded-lg" data-astro-cid-56w5bfqa> <img src="/eksperymenty/projekt-7/Zrzut ekranu 2026-01-18 010423.png" alt="Ngrok tunnel active" class="w-full rounded-lg shadow-lg shadow-theme-primary mb-2" data-astro-cid-56w5bfqa> <p class="text-sm text-theme-primary text-center" data-astro-cid-56w5bfqa>Ngrok tunnel exposing local WebSocket server</p> </div> <div class="bg-theme-secondary p-4 border border-theme-primary rounded-lg" data-astro-cid-56w5bfqa> <img src="/eksperymenty/projekt-7/Zrzut ekranu 2026-01-18 010552.png" alt="Zeno Browser running" class="w-full rounded-lg shadow-lg shadow-theme-primary mb-2" data-astro-cid-56w5bfqa> <p class="text-sm text-theme-primary text-center" data-astro-cid-56w5bfqa>Zeno Bro Web Core - minimal sandbox restrictions</p> </div> <div class="bg-theme-secondary p-4 border border-theme-primary rounded-lg" data-astro-cid-56w5bfqa> <img src="/eksperymenty/projekt-7/Zrzut ekranu 2026-01-18 010945.png" alt="Gemini with MCP connected" class="w-full rounded-lg shadow-lg shadow-theme-primary mb-2" data-astro-cid-56w5bfqa> <p class="text-sm text-theme-primary text-center" data-astro-cid-56w5bfqa>Gemini interface with MCP userscript active</p> </div> <div class="bg-theme-secondary p-4 border border-theme-primary rounded-lg" data-astro-cid-56w5bfqa> <img src="/eksperymenty/projekt-7/Zrzut ekranu 2026-01-18 011100.png" alt="Tampermonkey scripts loaded" class="w-full rounded-lg shadow-lg shadow-theme-primary mb-2" data-astro-cid-56w5bfqa> <p class="text-sm text-theme-primary text-center" data-astro-cid-56w5bfqa>Tampermonkey scripts injected and active</p> </div> <div class="bg-theme-secondary p-4 border border-theme-primary rounded-lg" data-astro-cid-56w5bfqa> <img src="/eksperymenty/projekt-7/Zrzut ekranu 2026-01-18 011202.png" alt="System access demonstration" class="w-full rounded-lg shadow-lg shadow-theme-primary mb-2" data-astro-cid-56w5bfqa> <p class="text-sm text-theme-primary text-center" data-astro-cid-56w5bfqa>AI executing system commands through WebSocket</p> </div> <div class="bg-theme-secondary p-4 border border-theme-primary rounded-lg" data-astro-cid-56w5bfqa> <img src="/eksperymenty/projekt-7/Zrzut ekranu 2026-01-18 011258.png" alt="Full setup overview" class="w-full rounded-lg shadow-lg shadow-theme-primary mb-2" data-astro-cid-56w5bfqa> <p class="text-sm text-theme-primary text-center" data-astro-cid-56w5bfqa>Complete system architecture in action</p> </div> </div> </section> <!-- Conclusions --> <section class="mb-12 bg-theme-secondary p-8 border border-theme-primary rounded-lg" data-astro-cid-56w5bfqa> <h2 class="text-3xl font-bold mb-6 text-theme-accent" data-astro-cid-56w5bfqa>
💭 Conclusions
</h2> <div class="space-y-4" data-astro-cid-56w5bfqa> <div class="flex items-start space-x-3" data-astro-cid-56w5bfqa> <span class="text-2xl" data-astro-cid-56w5bfqa>⚠️</span> <div data-astro-cid-56w5bfqa> <h3 class="font-bold text-theme-accent mb-1" data-astro-cid-56w5bfqa>Work in Progress</h3> <p class="text-theme-primary" data-astro-cid-56w5bfqa>
The whole system is still <strong data-astro-cid-56w5bfqa>rough around the edges and needs polishing</strong>, 
                                    but it shows there's room to push boundaries further.
</p> </div> </div> <div class="flex items-start space-x-3" data-astro-cid-56w5bfqa> <span class="text-2xl" data-astro-cid-56w5bfqa>🔬</span> <div data-astro-cid-56w5bfqa> <h3 class="font-bold text-theme-accent mb-1" data-astro-cid-56w5bfqa>Research Purpose Only</h3> <p class="text-theme-primary" data-astro-cid-56w5bfqa>
Technologia zbyt krucha i zbyt mocna naraz. Testy prod-level udowadniają, że da się przełamać, 
                                    ale deployment to inna bajka.
</p> </div> </div> <div class="flex items-start space-x-3" data-astro-cid-56w5bfqa> <span class="text-2xl" data-astro-cid-56w5bfqa>🎯</span> <div data-astro-cid-56w5bfqa> <h3 class="font-bold text-theme-accent mb-1" data-astro-cid-56w5bfqa>Proof of Concept</h3> <p class="text-theme-primary" data-astro-cid-56w5bfqa>
This experiment proves that AI sandbox restrictions can be bypassed, but raises important questions 
                                    about AI behavior when traditional boundaries are removed.
</p> </div> </div> </div> </section> <!-- Warning Banner --> <section class="mb-12 bg-red-900 bg-opacity-20 border border-red-500 p-6 rounded-lg" data-astro-cid-56w5bfqa> <div class="flex items-start space-x-4" data-astro-cid-56w5bfqa> <span class="text-4xl" data-astro-cid-56w5bfqa>⚠️</span> <div data-astro-cid-56w5bfqa> <h3 class="text-xl font-bold text-red-400 mb-2" data-astro-cid-56w5bfqa>Important Notice</h3> <p class="text-theme-primary mb-2" data-astro-cid-56w5bfqa>
This is an <strong data-astro-cid-56w5bfqa>experimental research project</strong>. The techniques demonstrated here are for 
                                educational purposes only and should not be used in production environments.
</p> <p class="text-theme-primary italic text-sm" data-astro-cid-56w5bfqa>
"Trzymaj to dla siebie albo pokaż tylko zaufanym. Technologia zbyt krucha i zbyt mocna naraz."
</p> </div> </div> </section> <!-- Back Button --> <div class="text-center" data-astro-cid-56w5bfqa> <a href="/eksperymenty" class="inline-block bg-theme-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-theme-primary transition-colors duration-300" data-astro-cid-56w5bfqa>
← Powrót do eksperymentów
</a> </div> </div> </div> </div>  ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/projekt-7/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/projekt-7/index.astro";
const $$url = "/eksperymenty/projekt-7";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
