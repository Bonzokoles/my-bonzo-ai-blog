globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                       */
import { c as createComponent, m as maybeRenderHead, am as unescapeHTML, a as renderTemplate } from '../../../chunks/astro/server_CENSSoee.mjs';
export { renderers } from '../../../renderers.mjs';

const html = () => `<h1 id="-instrukcja-wdrożenia-nowego-eksperymentu">🚀 Instrukcja Wdrożenia Nowego Eksperymentu</h1>
<p><strong>Data utworzenia szablonu</strong>: 1 listopada 2025<br>
<strong>Compatibility date</strong>: 2025-10-31<br>
<strong>Źródło</strong>: <code>Q:\\mybonzo\\mybonzoAIblog\\public\\KONFIG_PODPROJEKT\\</code></p>
<hr>
<h2 id="-checklist-szybkiego-startu">📋 Checklist Szybkiego Startu</h2>
<h3 id="-quick-deploy-5-minut">⚡ Quick Deploy (5 minut)</h3>
<ul class="contains-task-list">
<li class="task-list-item"><input type="checkbox" disabled> Skopiuj folder <code>_SZABLON</code> → <code>nazwa-projektu</code></li>
<li class="task-list-item"><input type="checkbox" disabled> Zmień nazwę projektu w 3 miejscach (patrz: Krok 1)</li>
<li class="task-list-item"><input type="checkbox" disabled> Ustaw base path dla subpage (patrz: Krok 2)</li>
<li class="task-list-item"><input type="checkbox" disabled> Zbuduj i przetestuj lokalnie (patrz: Krok 3)</li>
<li class="task-list-item"><input type="checkbox" disabled> Deploy na Cloudflare (patrz: Krok 4)</li>
<li class="task-list-item"><input type="checkbox" disabled> Skonfiguruj Worker Proxy (patrz: Krok 5)</li>
<li class="task-list-item"><input type="checkbox" disabled> Dodaj GitHub Actions (opcjonalnie, Krok 6)</li>
</ul>
<hr>
<h2 id="-krok-1-tworzenie-nowego-projektu">🎯 Krok 1: Tworzenie Nowego Projektu</h2>
<h3 id="skopiuj-szablon">Skopiuj szablon:</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">cd Q:\\mybonzo\\mybonzoAIblog\\src\\pages\\eksperymenty</span></span>
<span class="line"></span>
<span class="line"><span style="color:#637777;font-style:italic"># Przykład: nowy projekt "moj-test"</span></span>
<span class="line"><span style="color:#7FDBCAFF">Copy-Item</span><span style="color:#C792EA"> -</span><span style="color:#D6DEEB">Recurse </span><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">_SZABLON</span><span style="color:#D9F5DD">"</span><span style="color:#D9F5DD"> "</span><span style="color:#ECC48D">moj-test</span><span style="color:#D9F5DD">"</span></span>
<span class="line"><span style="color:#D6DEEB">cd moj</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">test</span></span></code></pre>
<h3 id="zmień-nazwy-projektu-w-plikach">Zmień nazwy projektu w plikach:</h3>
<h4 id="-main-appwranglerjsonc---linia-6">📁 <code>main-app/wrangler.jsonc</code> - linia 6:</h4>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="jsonc"><code><span class="line"><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">name</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">mybonzo-EXP-moj-test-main</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">,</span></span></code></pre>
<h4 id="-subpagewranglerjsonc---linia-6">📁 <code>subpage/wrangler.jsonc</code> - linia 6:</h4>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="jsonc"><code><span class="line"><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">name</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">mybonzo-EXP-moj-test-subpage</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">,</span></span></code></pre>
<h4 id="-worker-proxywranglerjsonc---linia-6">📁 <code>worker-proxy/wrangler.jsonc</code> - linia 6:</h4>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="jsonc"><code><span class="line"><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">name</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">mybonzo-EXP-moj-test-proxy</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">,</span></span></code></pre>
<p><strong>⚠️ WAŻNE</strong>: Prefiks <code>mybonzo-EXP-</code> odróżnia eksperymenty od produkcji!</p>
<hr>
<h2 id="-krok-2-konfiguracja-base-path">🎯 Krok 2: Konfiguracja Base Path</h2>
<h3 id="a-decyzja-o-routing">A. Decyzja o routing:</h3>
<ul>
<li><strong>Główna strona</strong>: <code>example.com/</code> → <code>base: '/'</code> (bez zmian)</li>
<li><strong>Podstrona</strong>: <code>example.com/moj-test/</code> → ustaw <code>base: '/moj-test/'</code></li>
</ul>
<h3 id="b-edytuj-subpageastroconfigmjs---linia-39">B. Edytuj <code>subpage/astro.config.mjs</code> - linia 39:</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#637777;font-style:italic">// Zmień z:</span></span>
<span class="line"><span style="color:#D6DEEB">base: </span><span style="color:#D9F5DD">'</span><span style="color:#ECC48D">/subpage/</span><span style="color:#D9F5DD">'</span><span style="color:#D6DEEB">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#637777;font-style:italic">// Na:</span></span>
<span class="line"><span style="color:#D6DEEB">base: </span><span style="color:#D9F5DD">'</span><span style="color:#ECC48D">/moj-test/</span><span style="color:#D9F5DD">'</span><span style="color:#D6DEEB">,  </span><span style="color:#637777;font-style:italic">// ← TWOJA ŚCIEŻKA</span></span></code></pre>
<h3 id="c-edytuj-subpagewranglerjsonc---linia-23">C. Edytuj <code>subpage/wrangler.jsonc</code> - linia 23:</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="jsonc"><code><span class="line"><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">vars</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">: {</span></span>
<span class="line"><span style="color:#7FDBCA">    "ENVIRONMENT"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#C789D6">production</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">,</span></span>
<span class="line"><span style="color:#7FDBCA">    "LOG_LEVEL"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#C789D6">info</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">,</span></span>
<span class="line"><span style="color:#7FDBCA">    "BASE_PATH"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#C789D6">/moj-test/</span><span style="color:#D9F5DD">"</span><span style="color:#637777;font-style:italic">  // ← SYNCHRONIZUJ Z ASTRO</span></span>
<span class="line"><span style="color:#D6DEEB">}</span></span></code></pre>
<hr>
<h2 id="-krok-3-lokalny-test">🎯 Krok 3: Lokalny Test</h2>
<h3 id="a-main-app">A. Main App:</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">cd main</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">app</span></span>
<span class="line"><span style="color:#D6DEEB">npm install</span></span>
<span class="line"><span style="color:#D6DEEB">npm run build      </span><span style="color:#637777;font-style:italic"># Test kompilacji</span></span>
<span class="line"><span style="color:#D6DEEB">npm run preview    </span><span style="color:#637777;font-style:italic"># Test lokalny na http://localhost:4321</span></span></code></pre>
<p><strong>Sprawdź</strong>: Czy strona działa poprawnie?</p>
<h3 id="b-subpage">B. Subpage:</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">cd ..</span><span style="color:#C792EA">/</span><span style="color:#D6DEEB">subpage</span></span>
<span class="line"><span style="color:#D6DEEB">npm install</span></span>
<span class="line"><span style="color:#D6DEEB">npm run build</span></span>
<span class="line"><span style="color:#D6DEEB">npm run preview    </span><span style="color:#637777;font-style:italic"># Na http://localhost:4322 (inny port!)</span></span></code></pre>
<p><strong>Sprawdź</strong>: Czy wszystkie linki zawierają <code>/moj-test/</code>?</p>
<h3 id="c-worker-proxy-później-po-deploy-pages">C. Worker Proxy (później, po deploy Pages):</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">cd ..</span><span style="color:#C792EA">/</span><span style="color:#D6DEEB">worker</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">proxy</span></span>
<span class="line"><span style="color:#D6DEEB">npm install</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># Poczekaj na Krok 5 przed testowaniem</span></span></code></pre>
<hr>
<h2 id="-krok-4-deploy-na-cloudflare-pages">🎯 Krok 4: Deploy na Cloudflare Pages</h2>
<h3 id="autentykacja-jednorazowo">Autentykacja (jednorazowo):</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">wrangler login</span></span></code></pre>
<h3 id="deploy-main-app">Deploy Main App:</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">cd main</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">app</span></span>
<span class="line"><span style="color:#D6DEEB">npm run deploy</span></span></code></pre>
<p><strong>Zapisz URL</strong>: <code>https://mybonzo-exp-moj-test-main.pages.dev</code> ← POTRZEBNE W KROKU 5!</p>
<h3 id="deploy-subpage">Deploy Subpage:</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">cd ..</span><span style="color:#C792EA">/</span><span style="color:#D6DEEB">subpage</span></span>
<span class="line"><span style="color:#D6DEEB">npm run deploy</span></span></code></pre>
<p><strong>Zapisz URL</strong>: <code>https://mybonzo-exp-moj-test-subpage.pages.dev</code> ← POTRZEBNE W KROKU 5!</p>
<hr>
<h2 id="-krok-5-konfiguracja-worker-proxy">🎯 Krok 5: Konfiguracja Worker Proxy</h2>
<h3 id="a-edytuj-worker-proxyindexjs---linie-17-18">A. Edytuj <code>worker-proxy/index.js</code> - linie 17-18:</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#637777;font-style:italic">// ZMIEŃ NA SWOJE URL-E Z KROKU 4:</span></span>
<span class="line"><span style="color:#C792EA">const</span><span style="color:#82AAFF;font-style:italic"> MAIN_APP_URL</span><span style="color:#C792EA"> =</span><span style="color:#D9F5DD"> '</span><span style="color:#ECC48D">https://mybonzo-exp-moj-test-main.pages.dev</span><span style="color:#D9F5DD">'</span><span style="color:#D6DEEB">;</span></span>
<span class="line"><span style="color:#C792EA">const</span><span style="color:#82AAFF;font-style:italic"> SUBPAGE_URL</span><span style="color:#C792EA"> =</span><span style="color:#D9F5DD"> '</span><span style="color:#ECC48D">https://mybonzo-exp-moj-test-subpage.pages.dev</span><span style="color:#D9F5DD">'</span><span style="color:#D6DEEB">;</span></span></code></pre>
<h3 id="b-edytuj-worker-proxyindexjs---linie-23-27">B. Edytuj <code>worker-proxy/index.js</code> - linie 23-27:</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#C792EA">const</span><span style="color:#82AAFF;font-style:italic"> ROUTES</span><span style="color:#C792EA"> =</span><span style="color:#D6DEEB"> [</span></span>
<span class="line"><span style="color:#D6DEEB">    {</span></span>
<span class="line"><span style="color:#D6DEEB;font-style:italic">        prefix</span><span style="color:#D6DEEB">:</span><span style="color:#D9F5DD"> '</span><span style="color:#ECC48D">/moj-test/</span><span style="color:#D9F5DD">'</span><span style="color:#D6DEEB">,</span><span style="color:#637777;font-style:italic">  // ← TWÓJ BASE PATH</span></span>
<span class="line"><span style="color:#D6DEEB;font-style:italic">        target</span><span style="color:#D6DEEB">:</span><span style="color:#82AAFF;font-style:italic"> SUBPAGE_URL</span><span style="color:#D6DEEB">,</span></span>
<span class="line"><span style="color:#D6DEEB;font-style:italic">        name</span><span style="color:#D6DEEB">:</span><span style="color:#D9F5DD"> '</span><span style="color:#ECC48D">Moj Test Subpage</span><span style="color:#D9F5DD">'</span></span>
<span class="line"><span style="color:#D6DEEB">    },</span></span>
<span class="line"><span style="color:#D6DEEB">];</span></span></code></pre>
<h3 id="c-deploy-worker">C. Deploy Worker:</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">cd worker</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">proxy</span></span>
<span class="line"><span style="color:#D6DEEB">npm run deploy</span></span></code></pre>
<h3 id="d-przypisz-custom-domain-cloudflare-dashboard">D. Przypisz Custom Domain (Cloudflare Dashboard):</h3>
<ol>
<li>Idź do: <strong>Workers &#x26; Pages</strong> → <strong>mybonzo-EXP-moj-test-proxy</strong></li>
<li><strong>Settings</strong> → <strong>Triggers</strong> → <strong>Add Custom Domain</strong></li>
<li>Dodaj: <code>moj-test.mybonzo.com</code> (lub subdomenę eksperymentów)</li>
<li>Poczekaj 2-5 minut na SSL provisioning</li>
</ol>
<h3 id="e-testuj-routing">E. Testuj routing:</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#637777;font-style:italic"># Health check</span></span>
<span class="line"><span style="color:#D6DEEB">curl https:</span><span style="color:#C792EA">//</span><span style="color:#7FDBCAFF">moj-test.mybonzo.com</span><span style="color:#C792EA">/</span><span style="color:#D6DEEB">_proxy</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">health</span></span>
<span class="line"></span>
<span class="line"><span style="color:#637777;font-style:italic"># Main app (root)</span></span>
<span class="line"><span style="color:#D6DEEB">curl </span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">I https:</span><span style="color:#C792EA">//</span><span style="color:#7FDBCAFF">moj-test.mybonzo.com</span><span style="color:#C792EA">/</span></span>
<span class="line"></span>
<span class="line"><span style="color:#637777;font-style:italic"># Subpage</span></span>
<span class="line"><span style="color:#D6DEEB">curl </span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">I https:</span><span style="color:#C792EA">//</span><span style="color:#7FDBCAFF">moj-test.mybonzo.com</span><span style="color:#C792EA">/</span><span style="color:#D6DEEB">moj</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">test</span><span style="color:#C792EA">/</span></span></code></pre>
<hr>
<h2 id="-krok-6-github-actions-opcjonalnie">🎯 Krok 6: GitHub Actions (Opcjonalnie)</h2>
<h3 id="skopiuj-workflow-template">Skopiuj workflow template:</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">cd Q:\\mybonzo\\mybonzoAIblog</span></span>
<span class="line"><span style="color:#D6DEEB">mkdir .github\\workflows\\eksperymenty </span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">Force</span></span>
<span class="line"></span>
<span class="line"><span style="color:#637777;font-style:italic"># Skopiuj z KONFIG_PODPROJEKT:</span></span>
<span class="line"><span style="color:#7FDBCAFF">Copy-Item</span><span style="color:#D9F5DD"> "</span><span style="color:#ECC48D">public\\KONFIG_PODPROJEKT\\.github\\workflows\\deploy-main.yml</span><span style="color:#D9F5DD">"</span><span style="color:#D9F5DD"> "</span><span style="color:#ECC48D">.github\\workflows\\eksperymenty\\deploy-moj-test-main.yml</span><span style="color:#D9F5DD">"</span></span>
<span class="line"><span style="color:#7FDBCAFF">Copy-Item</span><span style="color:#D9F5DD"> "</span><span style="color:#ECC48D">public\\KONFIG_PODPROJEKT\\.github\\workflows\\deploy-subpage.yml</span><span style="color:#D9F5DD">"</span><span style="color:#D9F5DD"> "</span><span style="color:#ECC48D">.github\\workflows\\eksperymenty\\deploy-moj-test-subpage.yml</span><span style="color:#D9F5DD">"</span></span>
<span class="line"><span style="color:#7FDBCAFF">Copy-Item</span><span style="color:#D9F5DD"> "</span><span style="color:#ECC48D">public\\KONFIG_PODPROJEKT\\.github\\workflows\\deploy-proxy.yml</span><span style="color:#D9F5DD">"</span><span style="color:#D9F5DD"> "</span><span style="color:#ECC48D">.github\\workflows\\eksperymenty\\deploy-moj-test-proxy.yml</span><span style="color:#D9F5DD">"</span></span></code></pre>
<h3 id="edytuj-każdy-workflow">Edytuj każdy workflow:</h3>
<h4 id="zmień-path-trigger-przykład-dla-deploy-moj-test-mainyml">Zmień path trigger (przykład dla <code>deploy-moj-test-main.yml</code>):</h4>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="yaml"><code><span class="line"><span style="color:#FF5874">on</span><span style="color:#D6DEEB">:</span></span>
<span class="line"><span style="color:#7FDBCA">  push</span><span style="color:#D6DEEB">:</span></span>
<span class="line"><span style="color:#7FDBCA">    branches</span><span style="color:#D6DEEB">: [</span><span style="color:#ECC48D">main</span><span style="color:#D6DEEB">]</span></span>
<span class="line"><span style="color:#7FDBCA">    paths</span><span style="color:#D6DEEB">:</span></span>
<span class="line"><span style="color:#D6DEEB">      - </span><span style="color:#D9F5DD">'</span><span style="color:#ECC48D">src/pages/eksperymenty/moj-test/main-app/**</span><span style="color:#D9F5DD">'</span><span style="color:#637777;font-style:italic">  # ← TWOJA ŚCIEŻKA</span></span></code></pre>
<h4 id="zmień-working-directory">Zmień working directory:</h4>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="yaml"><code><span class="line"><span style="color:#7FDBCA">jobs</span><span style="color:#D6DEEB">:</span></span>
<span class="line"><span style="color:#7FDBCA">  deploy</span><span style="color:#D6DEEB">:</span></span>
<span class="line"><span style="color:#7FDBCA">    steps</span><span style="color:#D6DEEB">:</span></span>
<span class="line"><span style="color:#D6DEEB">      - </span><span style="color:#7FDBCA">name</span><span style="color:#D6DEEB">: </span><span style="color:#ECC48D">Deploy to Cloudflare Pages</span></span>
<span class="line"><span style="color:#7FDBCA">        working-directory</span><span style="color:#D6DEEB">: </span><span style="color:#ECC48D">./src/pages/eksperymenty/moj-test/main-app</span><span style="color:#637777;font-style:italic">  # ← TWOJA ŚCIEŻKA</span></span></code></pre>
<h3 id="dodaj-secrets-w-github">Dodaj secrets w GitHub:</h3>
<ol>
<li>Repository → <strong>Settings</strong> → <strong>Secrets and variables</strong> → <strong>Actions</strong></li>
<li><strong>New repository secret</strong>:
<ul>
<li><code>CLOUDFLARE_API_TOKEN</code> → (skopiuj z Cloudflare Dashboard)</li>
<li><code>CLOUDFLARE_ACCOUNT_ID</code> → (Workers &#x26; Pages → Overview → Account ID)</li>
</ul>
</li>
</ol>
<hr>
<h2 id="-rozwiązywanie-problemów">📚 Rozwiązywanie Problemów</h2>
<h3 id="-problem-404-not-found-na-subpage">❌ Problem: “404 Not Found” na subpage</h3>
<p><strong>Diagnoza</strong>: Base path nie jest ustawiony poprawnie.</p>
<p><strong>Fix</strong>:</p>
<ol>
<li>Sprawdź <code>subpage/astro.config.mjs</code> → <code>base: '/moj-test/'</code> (ze slashami!)</li>
<li>Sprawdź <code>worker-proxy/index.js</code> → <code>prefix: '/moj-test/'</code> (synchronizacja!)</li>
<li>Przebuduj i redeploy:
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">cd subpage &#x26;&#x26; npm run build &#x26;&#x26; npm run deploy</span></span>
<span class="line"><span style="color:#D6DEEB">cd ..</span><span style="color:#C792EA">/</span><span style="color:#D6DEEB">worker</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">proxy &#x26;&#x26; npm run deploy</span></span></code></pre>
</li>
</ol>
<hr>
<h3 id="-problem-assets-nie-ładują-się-404-dla-cssjs">❌ Problem: “Assets nie ładują się” (404 dla CSS/JS)</h3>
<p><strong>Diagnoza</strong>: Niepoprawne ścieżki do assetów z base path.</p>
<p><strong>Fix</strong>:</p>
<ol>
<li>W Astro używaj zawsze:
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="astro"><code><span class="line"><span style="color:#637777;font-style:italic">---</span></span>
<span class="line"><span style="color:#C792EA;font-style:italic">import</span><span style="color:#D6DEEB"> { getImage } </span><span style="color:#C792EA;font-style:italic">from</span><span style="color:#D9F5DD"> '</span><span style="color:#ECC48D">astro:assets</span><span style="color:#D9F5DD">'</span><span style="color:#D6DEEB">;</span></span>
<span class="line"><span style="color:#C792EA">const</span><span style="color:#82AAFF;font-style:italic"> basePath</span><span style="color:#C792EA"> =</span><span style="color:#C792EA;font-style:italic"> import.</span><span style="color:#7FDBCA;font-style:italic">meta</span><span style="color:#C792EA;font-style:italic">.</span><span style="color:#FAF39F;font-style:italic">env</span><span style="color:#C792EA;font-style:italic">.</span><span style="color:#82AAFF;font-style:italic">BASE_URL</span><span style="color:#D6DEEB">; </span><span style="color:#637777;font-style:italic">// Automatycznie '/moj-test/'</span></span>
<span class="line"><span style="color:#637777;font-style:italic">---</span></span>
<span class="line"><span style="color:#7FDBCA">&#x3C;</span><span style="color:#CAECE6">link</span><span style="color:#C5E478;font-style:italic"> rel</span><span style="color:#7FDBCA">=</span><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">stylesheet</span><span style="color:#D9F5DD">"</span><span style="color:#C5E478;font-style:italic"> href</span><span style="color:#7FDBCA">=</span><span style="color:#D3423E">{</span><span style="color:#D6DEEB">\`</span><span style="color:#D3423E">\${</span><span style="color:#D6DEEB">basePath</span><span style="color:#D3423E">}</span><span style="color:#ECC48D">_astro/styles.css</span><span style="color:#D6DEEB">\`</span><span style="color:#D3423E">}</span><span style="color:#7FDBCA">></span></span></code></pre>
</li>
<li>Lub korzystaj z Astro’s automatic handling:
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="astro"><code><span class="line"><span style="color:#7FDBCA">&#x3C;</span><span style="color:#CAECE6">link</span><span style="color:#C5E478;font-style:italic"> rel</span><span style="color:#7FDBCA">=</span><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">stylesheet</span><span style="color:#D9F5DD">"</span><span style="color:#C5E478;font-style:italic"> href</span><span style="color:#7FDBCA">=</span><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">/_astro/styles.css</span><span style="color:#D9F5DD">"</span><span style="color:#7FDBCA">></span></span>
<span class="line"><span style="color:#637777;font-style:italic">&#x3C;!-- Astro automatycznie dodaje base path --></span></span></code></pre>
</li>
</ol>
<hr>
<h3 id="-problem-worker-proxy-nie-działa">❌ Problem: Worker proxy nie działa</h3>
<p><strong>Diagnoza</strong>: Niepoprawne URL-e w <code>worker-proxy/index.js</code>.</p>
<p><strong>Fix</strong>:</p>
<ol>
<li>Sprawdź czy URL-e Pages są poprawne:
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">wrangler pages project list</span></span></code></pre>
</li>
<li>Zweryfikuj URL-e w <code>worker-proxy/index.js</code> (linie 17-18)</li>
<li>Redeploy worker:
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">cd worker</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">proxy &#x26;&#x26; npm run deploy</span></span></code></pre>
</li>
<li>Sprawdź logi:
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">wrangler tail mybonzo</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">EXP</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">moj</span><span style="color:#C792EA">-</span><span style="color:#7FDBCAFF">test-proxy</span></span></code></pre>
</li>
</ol>
<hr>
<h3 id="-problem-error-1101---worker-error">❌ Problem: “Error 1101” - Worker Error</h3>
<p><strong>Diagnoza</strong>: Worker przekracza limity CPU/memory lub ma błąd w kodzie.</p>
<p><strong>Fix</strong>:</p>
<ol>
<li>Sprawdź logi:
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">wrangler tail mybonzo</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">EXP</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">moj</span><span style="color:#C792EA">-</span><span style="color:#7FDBCAFF">test-proxy</span></span></code></pre>
</li>
<li>Sprawdź limity w <code>worker-proxy/wrangler.jsonc</code>:
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="jsonc"><code><span class="line"><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">limits</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">: {</span></span>
<span class="line"><span style="color:#7FDBCA">  "cpu_ms"</span><span style="color:#D6DEEB">: </span><span style="color:#F78C6C">50</span><span style="color:#637777;font-style:italic">  // Zwiększ do 100 jeśli potrzeba</span></span>
<span class="line"><span style="color:#D6DEEB">}</span></span></code></pre>
</li>
<li>Sprawdź czy Pages URL-e są osiągalne:
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">curl </span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">I https:</span><span style="color:#C792EA">//</span><span style="color:#D6DEEB">mybonzo</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">exp</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">moj</span><span style="color:#C792EA">-</span><span style="color:#7FDBCAFF">test-main</span><span style="color:#D6DEEB">.pages.dev</span></span></code></pre>
</li>
</ol>
<hr>
<h3 id="-problem-cors-errors">❌ Problem: CORS errors</h3>
<p><strong>Diagnoza</strong>: Proxy nie dodaje poprawnych headerów CORS.</p>
<p><strong>Fix</strong>: Worker automatycznie obsługuje CORS (patrz <code>worker-proxy/index.js</code> linia 246-259), ale jeśli problem persystuje:</p>
<ol>
<li>Sprawdź czy requesty pochodzą z właściwej domeny</li>
<li>Dodaj domenę do <code>Access-Control-Allow-Origin</code> jeśli potrzeba custom origin</li>
</ol>
<hr>
<h2 id="-zaawansowana-konfiguracja">🔧 Zaawansowana Konfiguracja</h2>
<h3 id="dodanie-kv-storage-cache-sessions">Dodanie KV Storage (cache, sessions):</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="jsonc"><code><span class="line"><span style="color:#637777;font-style:italic">// W wrangler.jsonc (main-app lub subpage):</span></span>
<span class="line"><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">kv_namespaces</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">: [</span></span>
<span class="line"><span style="color:#D6DEEB">  {</span></span>
<span class="line"><span style="color:#7FDBCA">    "binding"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#C789D6">CACHE</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">,</span></span>
<span class="line"><span style="color:#7FDBCA">    "id"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#C789D6">abcd1234...</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">,           </span><span style="color:#637777;font-style:italic">// Utwórz: wrangler kv:namespace create CACHE</span></span>
<span class="line"><span style="color:#7FDBCA">    "preview_id"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#C789D6">xyz5678...</span><span style="color:#D9F5DD">"</span><span style="color:#637777;font-style:italic">     // Utwórz: wrangler kv:namespace create CACHE --preview</span></span>
<span class="line"><span style="color:#D6DEEB">  }</span></span>
<span class="line"><span style="color:#D6DEEB">]</span></span></code></pre>
<h3 id="dodanie-r2-storage-pliki-media">Dodanie R2 Storage (pliki, media):</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="jsonc"><code><span class="line"><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">r2_buckets</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">: [</span></span>
<span class="line"><span style="color:#D6DEEB">  {</span></span>
<span class="line"><span style="color:#7FDBCA">    "binding"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#C789D6">MEDIA</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">,</span></span>
<span class="line"><span style="color:#7FDBCA">    "bucket_name"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#C789D6">mybonzo-exp-moj-test-media</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">,</span></span>
<span class="line"><span style="color:#7FDBCA">    "preview_bucket_name"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#C789D6">mybonzo-exp-moj-test-media-preview</span><span style="color:#D9F5DD">"</span></span>
<span class="line"><span style="color:#D6DEEB">  }</span></span>
<span class="line"><span style="color:#D6DEEB">]</span></span></code></pre>
<p>Utwórz bucket:</p>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#D6DEEB">wrangler r2 bucket create mybonzo</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">exp</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">moj</span><span style="color:#C792EA">-</span><span style="color:#7FDBCAFF">test-media</span></span></code></pre>
<h3 id="dodanie-d1-database-sql">Dodanie D1 Database (SQL):</h3>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="jsonc"><code><span class="line"><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">d1_databases</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">: [</span></span>
<span class="line"><span style="color:#D6DEEB">  {</span></span>
<span class="line"><span style="color:#7FDBCA">    "binding"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#C789D6">DB</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">,</span></span>
<span class="line"><span style="color:#7FDBCA">    "database_name"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#C789D6">mybonzo-exp-moj-test-db</span><span style="color:#D9F5DD">"</span><span style="color:#D6DEEB">,</span></span>
<span class="line"><span style="color:#7FDBCA">    "database_id"</span><span style="color:#D6DEEB">: </span><span style="color:#D9F5DD">"</span><span style="color:#C789D6">abc-123-def</span><span style="color:#D9F5DD">"</span><span style="color:#637777;font-style:italic">  // Z: wrangler d1 create mybonzo-exp-moj-test-db</span></span>
<span class="line"><span style="color:#D6DEEB">  }</span></span>
<span class="line"><span style="color:#D6DEEB">]</span></span></code></pre>
<hr>
<h2 id="-pełna-ścieżka-deployu---przykład">📝 Pełna Ścieżka Deployu - Przykład</h2>
<pre class="astro-code night-owl" style="background-color:#011627;color:#d6deeb; overflow-x: auto;" tabindex="0" data-language="powershell"><code><span class="line"><span style="color:#637777;font-style:italic"># 1. Skopiuj szablon</span></span>
<span class="line"><span style="color:#D6DEEB">cd Q:\\mybonzo\\mybonzoAIblog\\src\\pages\\eksperymenty</span></span>
<span class="line"><span style="color:#7FDBCAFF">Copy-Item</span><span style="color:#C792EA"> -</span><span style="color:#D6DEEB">Recurse </span><span style="color:#D9F5DD">"</span><span style="color:#ECC48D">_SZABLON</span><span style="color:#D9F5DD">"</span><span style="color:#D9F5DD"> "</span><span style="color:#ECC48D">ai-generator</span><span style="color:#D9F5DD">"</span></span>
<span class="line"><span style="color:#D6DEEB">cd ai</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">generator</span></span>
<span class="line"></span>
<span class="line"><span style="color:#637777;font-style:italic"># 2. Zmień nazwy w wrangler.jsonc (3 pliki)</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># main-app/wrangler.jsonc → "name": "mybonzo-EXP-ai-generator-main"</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># subpage/wrangler.jsonc → "name": "mybonzo-EXP-ai-generator-subpage"</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># worker-proxy/wrangler.jsonc → "name": "mybonzo-EXP-ai-generator-proxy"</span></span>
<span class="line"></span>
<span class="line"><span style="color:#637777;font-style:italic"># 3. Ustaw base path w subpage</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># subpage/astro.config.mjs → base: '/ai-generator/'</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># subpage/wrangler.jsonc → "BASE_PATH": "/ai-generator/"</span></span>
<span class="line"></span>
<span class="line"><span style="color:#637777;font-style:italic"># 4. Zbuduj i deploy Pages</span></span>
<span class="line"><span style="color:#D6DEEB">cd main</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">app</span></span>
<span class="line"><span style="color:#D6DEEB">npm install &#x26;&#x26; npm run build &#x26;&#x26; npm run deploy</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># Zapisz URL: https://mybonzo-exp-ai-generator-main.pages.dev</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D6DEEB">cd ..</span><span style="color:#C792EA">/</span><span style="color:#D6DEEB">subpage</span></span>
<span class="line"><span style="color:#D6DEEB">npm install &#x26;&#x26; npm run build &#x26;&#x26; npm run deploy</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># Zapisz URL: https://mybonzo-exp-ai-generator-subpage.pages.dev</span></span>
<span class="line"></span>
<span class="line"><span style="color:#637777;font-style:italic"># 5. Skonfiguruj Worker Proxy</span></span>
<span class="line"><span style="color:#D6DEEB">cd ..</span><span style="color:#C792EA">/</span><span style="color:#D6DEEB">worker</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">proxy</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># Edytuj index.js:</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># - MAIN_APP_URL = 'https://mybonzo-exp-ai-generator-main.pages.dev'</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># - SUBPAGE_URL = 'https://mybonzo-exp-ai-generator-subpage.pages.dev'</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># - prefix: '/ai-generator/'</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D6DEEB">npm install &#x26;&#x26; npm run deploy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#637777;font-style:italic"># 6. Dodaj custom domain w Dashboard:</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># Workers &#x26; Pages → mybonzo-EXP-ai-generator-proxy → Settings → Triggers</span></span>
<span class="line"><span style="color:#637777;font-style:italic"># Add Custom Domain: ai-generator.mybonzo.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#637777;font-style:italic"># 7. Test</span></span>
<span class="line"><span style="color:#D6DEEB">curl https:</span><span style="color:#C792EA">//</span><span style="color:#7FDBCAFF">ai-generator.mybonzo.com</span><span style="color:#C792EA">/</span><span style="color:#D6DEEB">_proxy</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">health</span></span>
<span class="line"><span style="color:#D6DEEB">curl </span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">I https:</span><span style="color:#C792EA">//</span><span style="color:#7FDBCAFF">ai-generator.mybonzo.com</span><span style="color:#C792EA">/</span></span>
<span class="line"><span style="color:#D6DEEB">curl </span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">I https:</span><span style="color:#C792EA">//</span><span style="color:#7FDBCAFF">ai-generator.mybonzo.com</span><span style="color:#C792EA">/</span><span style="color:#D6DEEB">ai</span><span style="color:#C792EA">-</span><span style="color:#D6DEEB">generator</span><span style="color:#C792EA">/</span></span></code></pre>
<hr>
<h2 id="-dodatkowe-zasoby">🎓 Dodatkowe Zasoby</h2>
<h3 id="dokumentacja-z-konfig_podprojekt">Dokumentacja z KONFIG_PODPROJEKT:</h3>
<ul>
<li><code>README.md</code> - Architektura i przegląd</li>
<li><code>STEP_BY_STEP_GUIDE.md</code> - Szczegółowy przewodnik deployu</li>
<li><code>TERMINAL_COMMANDS.md</code> - Szybka ściągawka komend PowerShell</li>
<li><code>TROUBLESHOOTING.md</code> - Rozwiązywanie problemów</li>
<li><code>PROJECT_STRUCTURE.md</code> - Struktura plików i konfiguracji</li>
</ul>
<h3 id="oficjalna-dokumentacja">Oficjalna dokumentacja:</h3>
<ul>
<li><a href="https://docs.astro.build">Astro Docs</a></li>
<li><a href="https://developers.cloudflare.com/workers/">Cloudflare Workers</a></li>
<li><a href="https://developers.cloudflare.com/pages/">Cloudflare Pages</a></li>
<li><a href="https://developers.cloudflare.com/workers/wrangler/">Wrangler CLI</a></li>
</ul>
<hr>
<h2 id="-checklist-po-deploymencie">✅ Checklist Po Deploymencie</h2>
<ul class="contains-task-list">
<li class="task-list-item"><input type="checkbox" disabled> Main app działa: <code>https://nazwa-projektu.mybonzo.com/</code></li>
<li class="task-list-item"><input type="checkbox" disabled> Subpage działa: <code>https://nazwa-projektu.mybonzo.com/sciezka/</code></li>
<li class="task-list-item"><input type="checkbox" disabled> Worker health check: <code>https://nazwa-projektu.mybonzo.com/_proxy-health</code></li>
<li class="task-list-item"><input type="checkbox" disabled> Assets ładują się poprawnie (CSS, JS, obrazy)</li>
<li class="task-list-item"><input type="checkbox" disabled> Routing działa: główna → main-app, subpage → subpage</li>
<li class="task-list-item"><input type="checkbox" disabled> SSL certificate aktywny (🔒 w przeglądarce)</li>
<li class="task-list-item"><input type="checkbox" disabled> GitHub Actions workflow dodany (opcjonalnie)</li>
<li class="task-list-item"><input type="checkbox" disabled> Secrets dodane w GitHub (jeśli workflow)</li>
<li class="task-list-item"><input type="checkbox" disabled> Dokumentacja zaktualizowana w README projektu</li>
<li class="task-list-item"><input type="checkbox" disabled> Projekt dodany do głównego INDEX wszystkich eksperymentów</li>
</ul>
<hr>
<h2 id="-ważne-przypomnienia">🚨 WAŻNE PRZYPOMNIENIA</h2>
<ol>
<li><strong>Prefiks <code>mybonzo-EXP-</code></strong> w nazwach odróżnia eksperymenty od produkcji</li>
<li><strong>Base path MUSI mieć slashe</strong>: <code>/nazwa/</code> (początek i koniec!)</li>
<li><strong>Synchronizuj base path</strong> w 3 miejscach:
<ul>
<li><code>subpage/astro.config.mjs</code> → <code>base:</code></li>
<li><code>subpage/wrangler.jsonc</code> → <code>BASE_PATH</code> var</li>
<li><code>worker-proxy/index.js</code> → <code>prefix:</code> w ROUTES</li>
</ul>
</li>
<li><strong>Worker proxy</strong> wymaga URL-i AFTER deployu Pages</li>
<li><strong>Custom domain</strong> potrzebuje 2-5 minut na SSL</li>
<li><strong>GitHub Actions</strong> wymaga secrets: <code>CLOUDFLARE_API_TOKEN</code> + <code>CLOUDFLARE_ACCOUNT_ID</code></li>
<li><strong>Compatibility date</strong>: 2025-10-31 (aktualizuj przy każdym deploymencie)</li>
</ol>
<hr>
<p><strong>Powodzenia! 🚀</strong></p>
<p>Jeśli coś nie działa, sprawdź sekcję “Rozwiązywanie Problemów” powyżej lub pełną dokumentację w <code>KONFIG_PODPROJEKT/TROUBLESHOOTING.md</code>.</p>`;
const frontmatter = {};
const file = "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/projekt-1/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md";
const url = "/eksperymenty/projekt-1/INSTRUKCJA_DLA_NOWEGO_PROJEKTU";
function rawContent() {
  return '# 🚀 Instrukcja Wdrożenia Nowego Eksperymentu\r\n\r\n**Data utworzenia szablonu**: 1 listopada 2025  \r\n**Compatibility date**: 2025-10-31  \r\n**Źródło**: `Q:\\mybonzo\\mybonzoAIblog\\public\\KONFIG_PODPROJEKT\\`\r\n\r\n---\r\n\r\n## 📋 Checklist Szybkiego Startu\r\n\r\n### ⚡ Quick Deploy (5 minut)\r\n- [ ] Skopiuj folder `_SZABLON` → `nazwa-projektu`\r\n- [ ] Zmień nazwę projektu w 3 miejscach (patrz: Krok 1)\r\n- [ ] Ustaw base path dla subpage (patrz: Krok 2)\r\n- [ ] Zbuduj i przetestuj lokalnie (patrz: Krok 3)\r\n- [ ] Deploy na Cloudflare (patrz: Krok 4)\r\n- [ ] Skonfiguruj Worker Proxy (patrz: Krok 5)\r\n- [ ] Dodaj GitHub Actions (opcjonalnie, Krok 6)\r\n\r\n---\r\n\r\n## 🎯 Krok 1: Tworzenie Nowego Projektu\r\n\r\n### Skopiuj szablon:\r\n```powershell\r\ncd Q:\\mybonzo\\mybonzoAIblog\\src\\pages\\eksperymenty\r\n\r\n# Przykład: nowy projekt "moj-test"\r\nCopy-Item -Recurse "_SZABLON" "moj-test"\r\ncd moj-test\r\n```\r\n\r\n### Zmień nazwy projektu w plikach:\r\n\r\n#### 📁 `main-app/wrangler.jsonc` - linia 6:\r\n```jsonc\r\n"name": "mybonzo-EXP-moj-test-main",\r\n```\r\n\r\n#### 📁 `subpage/wrangler.jsonc` - linia 6:\r\n```jsonc\r\n"name": "mybonzo-EXP-moj-test-subpage",\r\n```\r\n\r\n#### 📁 `worker-proxy/wrangler.jsonc` - linia 6:\r\n```jsonc\r\n"name": "mybonzo-EXP-moj-test-proxy",\r\n```\r\n\r\n**⚠️ WAŻNE**: Prefiks `mybonzo-EXP-` odróżnia eksperymenty od produkcji!\r\n\r\n---\r\n\r\n## 🎯 Krok 2: Konfiguracja Base Path\r\n\r\n### A. Decyzja o routing:\r\n- **Główna strona**: `example.com/` → `base: \'/\'` (bez zmian)\r\n- **Podstrona**: `example.com/moj-test/` → ustaw `base: \'/moj-test/\'`\r\n\r\n### B. Edytuj `subpage/astro.config.mjs` - linia 39:\r\n```javascript\r\n// Zmień z:\r\nbase: \'/subpage/\',\r\n\r\n// Na:\r\nbase: \'/moj-test/\',  // ← TWOJA ŚCIEŻKA\r\n```\r\n\r\n### C. Edytuj `subpage/wrangler.jsonc` - linia 23:\r\n```jsonc\r\n"vars": {\r\n    "ENVIRONMENT": "production",\r\n    "LOG_LEVEL": "info",\r\n    "BASE_PATH": "/moj-test/"  // ← SYNCHRONIZUJ Z ASTRO\r\n}\r\n```\r\n\r\n---\r\n\r\n## 🎯 Krok 3: Lokalny Test\r\n\r\n### A. Main App:\r\n```powershell\r\ncd main-app\r\nnpm install\r\nnpm run build      # Test kompilacji\r\nnpm run preview    # Test lokalny na http://localhost:4321\r\n```\r\n\r\n**Sprawdź**: Czy strona działa poprawnie?\r\n\r\n### B. Subpage:\r\n```powershell\r\ncd ../subpage\r\nnpm install\r\nnpm run build\r\nnpm run preview    # Na http://localhost:4322 (inny port!)\r\n```\r\n\r\n**Sprawdź**: Czy wszystkie linki zawierają `/moj-test/`?\r\n\r\n### C. Worker Proxy (później, po deploy Pages):\r\n```powershell\r\ncd ../worker-proxy\r\nnpm install\r\n# Poczekaj na Krok 5 przed testowaniem\r\n```\r\n\r\n---\r\n\r\n## 🎯 Krok 4: Deploy na Cloudflare Pages\r\n\r\n### Autentykacja (jednorazowo):\r\n```powershell\r\nwrangler login\r\n```\r\n\r\n### Deploy Main App:\r\n```powershell\r\ncd main-app\r\nnpm run deploy\r\n```\r\n\r\n**Zapisz URL**: `https://mybonzo-exp-moj-test-main.pages.dev` ← POTRZEBNE W KROKU 5!\r\n\r\n### Deploy Subpage:\r\n```powershell\r\ncd ../subpage\r\nnpm run deploy\r\n```\r\n\r\n**Zapisz URL**: `https://mybonzo-exp-moj-test-subpage.pages.dev` ← POTRZEBNE W KROKU 5!\r\n\r\n---\r\n\r\n## 🎯 Krok 5: Konfiguracja Worker Proxy\r\n\r\n### A. Edytuj `worker-proxy/index.js` - linie 17-18:\r\n```javascript\r\n// ZMIEŃ NA SWOJE URL-E Z KROKU 4:\r\nconst MAIN_APP_URL = \'https://mybonzo-exp-moj-test-main.pages.dev\';\r\nconst SUBPAGE_URL = \'https://mybonzo-exp-moj-test-subpage.pages.dev\';\r\n```\r\n\r\n### B. Edytuj `worker-proxy/index.js` - linie 23-27:\r\n```javascript\r\nconst ROUTES = [\r\n    {\r\n        prefix: \'/moj-test/\',  // ← TWÓJ BASE PATH\r\n        target: SUBPAGE_URL,\r\n        name: \'Moj Test Subpage\'\r\n    },\r\n];\r\n```\r\n\r\n### C. Deploy Worker:\r\n```powershell\r\ncd worker-proxy\r\nnpm run deploy\r\n```\r\n\r\n### D. Przypisz Custom Domain (Cloudflare Dashboard):\r\n\r\n1. Idź do: **Workers & Pages** → **mybonzo-EXP-moj-test-proxy**\r\n2. **Settings** → **Triggers** → **Add Custom Domain**\r\n3. Dodaj: `moj-test.mybonzo.com` (lub subdomenę eksperymentów)\r\n4. Poczekaj 2-5 minut na SSL provisioning\r\n\r\n### E. Testuj routing:\r\n```powershell\r\n# Health check\r\ncurl https://moj-test.mybonzo.com/_proxy-health\r\n\r\n# Main app (root)\r\ncurl -I https://moj-test.mybonzo.com/\r\n\r\n# Subpage\r\ncurl -I https://moj-test.mybonzo.com/moj-test/\r\n```\r\n\r\n---\r\n\r\n## 🎯 Krok 6: GitHub Actions (Opcjonalnie)\r\n\r\n### Skopiuj workflow template:\r\n```powershell\r\ncd Q:\\mybonzo\\mybonzoAIblog\r\nmkdir .github\\workflows\\eksperymenty -Force\r\n\r\n# Skopiuj z KONFIG_PODPROJEKT:\r\nCopy-Item "public\\KONFIG_PODPROJEKT\\.github\\workflows\\deploy-main.yml" ".github\\workflows\\eksperymenty\\deploy-moj-test-main.yml"\r\nCopy-Item "public\\KONFIG_PODPROJEKT\\.github\\workflows\\deploy-subpage.yml" ".github\\workflows\\eksperymenty\\deploy-moj-test-subpage.yml"\r\nCopy-Item "public\\KONFIG_PODPROJEKT\\.github\\workflows\\deploy-proxy.yml" ".github\\workflows\\eksperymenty\\deploy-moj-test-proxy.yml"\r\n```\r\n\r\n### Edytuj każdy workflow:\r\n\r\n#### Zmień path trigger (przykład dla `deploy-moj-test-main.yml`):\r\n```yaml\r\non:\r\n  push:\r\n    branches: [main]\r\n    paths:\r\n      - \'src/pages/eksperymenty/moj-test/main-app/**\'  # ← TWOJA ŚCIEŻKA\r\n```\r\n\r\n#### Zmień working directory:\r\n```yaml\r\njobs:\r\n  deploy:\r\n    steps:\r\n      - name: Deploy to Cloudflare Pages\r\n        working-directory: ./src/pages/eksperymenty/moj-test/main-app  # ← TWOJA ŚCIEŻKA\r\n```\r\n\r\n### Dodaj secrets w GitHub:\r\n1. Repository → **Settings** → **Secrets and variables** → **Actions**\r\n2. **New repository secret**:\r\n   - `CLOUDFLARE_API_TOKEN` → (skopiuj z Cloudflare Dashboard)\r\n   - `CLOUDFLARE_ACCOUNT_ID` → (Workers & Pages → Overview → Account ID)\r\n\r\n---\r\n\r\n## 📚 Rozwiązywanie Problemów\r\n\r\n### ❌ Problem: "404 Not Found" na subpage\r\n**Diagnoza**: Base path nie jest ustawiony poprawnie.\r\n\r\n**Fix**:\r\n1. Sprawdź `subpage/astro.config.mjs` → `base: \'/moj-test/\'` (ze slashami!)\r\n2. Sprawdź `worker-proxy/index.js` → `prefix: \'/moj-test/\'` (synchronizacja!)\r\n3. Przebuduj i redeploy:\r\n   ```powershell\r\n   cd subpage && npm run build && npm run deploy\r\n   cd ../worker-proxy && npm run deploy\r\n   ```\r\n\r\n---\r\n\r\n### ❌ Problem: "Assets nie ładują się" (404 dla CSS/JS)\r\n**Diagnoza**: Niepoprawne ścieżki do assetów z base path.\r\n\r\n**Fix**:\r\n1. W Astro używaj zawsze:\r\n   ```astro\r\n   ---\r\n   import { getImage } from \'astro:assets\';\r\n   const basePath = import.meta.env.BASE_URL; // Automatycznie \'/moj-test/\'\r\n   ---\r\n   <link rel="stylesheet" href={`${basePath}_astro/styles.css`}>\r\n   ```\r\n2. Lub korzystaj z Astro\'s automatic handling:\r\n   ```astro\r\n   <link rel="stylesheet" href="/_astro/styles.css">\r\n   <!-- Astro automatycznie dodaje base path -->\r\n   ```\r\n\r\n---\r\n\r\n### ❌ Problem: Worker proxy nie działa\r\n**Diagnoza**: Niepoprawne URL-e w `worker-proxy/index.js`.\r\n\r\n**Fix**:\r\n1. Sprawdź czy URL-e Pages są poprawne:\r\n   ```powershell\r\n   wrangler pages project list\r\n   ```\r\n2. Zweryfikuj URL-e w `worker-proxy/index.js` (linie 17-18)\r\n3. Redeploy worker:\r\n   ```powershell\r\n   cd worker-proxy && npm run deploy\r\n   ```\r\n4. Sprawdź logi:\r\n   ```powershell\r\n   wrangler tail mybonzo-EXP-moj-test-proxy\r\n   ```\r\n\r\n---\r\n\r\n### ❌ Problem: "Error 1101" - Worker Error\r\n**Diagnoza**: Worker przekracza limity CPU/memory lub ma błąd w kodzie.\r\n\r\n**Fix**:\r\n1. Sprawdź logi:\r\n   ```powershell\r\n   wrangler tail mybonzo-EXP-moj-test-proxy\r\n   ```\r\n2. Sprawdź limity w `worker-proxy/wrangler.jsonc`:\r\n   ```jsonc\r\n   "limits": {\r\n     "cpu_ms": 50  // Zwiększ do 100 jeśli potrzeba\r\n   }\r\n   ```\r\n3. Sprawdź czy Pages URL-e są osiągalne:\r\n   ```powershell\r\n   curl -I https://mybonzo-exp-moj-test-main.pages.dev\r\n   ```\r\n\r\n---\r\n\r\n### ❌ Problem: CORS errors\r\n**Diagnoza**: Proxy nie dodaje poprawnych headerów CORS.\r\n\r\n**Fix**: Worker automatycznie obsługuje CORS (patrz `worker-proxy/index.js` linia 246-259), ale jeśli problem persystuje:\r\n1. Sprawdź czy requesty pochodzą z właściwej domeny\r\n2. Dodaj domenę do `Access-Control-Allow-Origin` jeśli potrzeba custom origin\r\n\r\n---\r\n\r\n## 🔧 Zaawansowana Konfiguracja\r\n\r\n### Dodanie KV Storage (cache, sessions):\r\n```jsonc\r\n// W wrangler.jsonc (main-app lub subpage):\r\n"kv_namespaces": [\r\n  {\r\n    "binding": "CACHE",\r\n    "id": "abcd1234...",           // Utwórz: wrangler kv:namespace create CACHE\r\n    "preview_id": "xyz5678..."     // Utwórz: wrangler kv:namespace create CACHE --preview\r\n  }\r\n]\r\n```\r\n\r\n### Dodanie R2 Storage (pliki, media):\r\n```jsonc\r\n"r2_buckets": [\r\n  {\r\n    "binding": "MEDIA",\r\n    "bucket_name": "mybonzo-exp-moj-test-media",\r\n    "preview_bucket_name": "mybonzo-exp-moj-test-media-preview"\r\n  }\r\n]\r\n```\r\n\r\nUtwórz bucket:\r\n```powershell\r\nwrangler r2 bucket create mybonzo-exp-moj-test-media\r\n```\r\n\r\n### Dodanie D1 Database (SQL):\r\n```jsonc\r\n"d1_databases": [\r\n  {\r\n    "binding": "DB",\r\n    "database_name": "mybonzo-exp-moj-test-db",\r\n    "database_id": "abc-123-def"  // Z: wrangler d1 create mybonzo-exp-moj-test-db\r\n  }\r\n]\r\n```\r\n\r\n---\r\n\r\n## 📝 Pełna Ścieżka Deployu - Przykład\r\n\r\n```powershell\r\n# 1. Skopiuj szablon\r\ncd Q:\\mybonzo\\mybonzoAIblog\\src\\pages\\eksperymenty\r\nCopy-Item -Recurse "_SZABLON" "ai-generator"\r\ncd ai-generator\r\n\r\n# 2. Zmień nazwy w wrangler.jsonc (3 pliki)\r\n# main-app/wrangler.jsonc → "name": "mybonzo-EXP-ai-generator-main"\r\n# subpage/wrangler.jsonc → "name": "mybonzo-EXP-ai-generator-subpage"\r\n# worker-proxy/wrangler.jsonc → "name": "mybonzo-EXP-ai-generator-proxy"\r\n\r\n# 3. Ustaw base path w subpage\r\n# subpage/astro.config.mjs → base: \'/ai-generator/\'\r\n# subpage/wrangler.jsonc → "BASE_PATH": "/ai-generator/"\r\n\r\n# 4. Zbuduj i deploy Pages\r\ncd main-app\r\nnpm install && npm run build && npm run deploy\r\n# Zapisz URL: https://mybonzo-exp-ai-generator-main.pages.dev\r\n\r\ncd ../subpage\r\nnpm install && npm run build && npm run deploy\r\n# Zapisz URL: https://mybonzo-exp-ai-generator-subpage.pages.dev\r\n\r\n# 5. Skonfiguruj Worker Proxy\r\ncd ../worker-proxy\r\n# Edytuj index.js:\r\n# - MAIN_APP_URL = \'https://mybonzo-exp-ai-generator-main.pages.dev\'\r\n# - SUBPAGE_URL = \'https://mybonzo-exp-ai-generator-subpage.pages.dev\'\r\n# - prefix: \'/ai-generator/\'\r\n\r\nnpm install && npm run deploy\r\n\r\n# 6. Dodaj custom domain w Dashboard:\r\n# Workers & Pages → mybonzo-EXP-ai-generator-proxy → Settings → Triggers\r\n# Add Custom Domain: ai-generator.mybonzo.com\r\n\r\n# 7. Test\r\ncurl https://ai-generator.mybonzo.com/_proxy-health\r\ncurl -I https://ai-generator.mybonzo.com/\r\ncurl -I https://ai-generator.mybonzo.com/ai-generator/\r\n```\r\n\r\n---\r\n\r\n## 🎓 Dodatkowe Zasoby\r\n\r\n### Dokumentacja z KONFIG_PODPROJEKT:\r\n- `README.md` - Architektura i przegląd\r\n- `STEP_BY_STEP_GUIDE.md` - Szczegółowy przewodnik deployu\r\n- `TERMINAL_COMMANDS.md` - Szybka ściągawka komend PowerShell\r\n- `TROUBLESHOOTING.md` - Rozwiązywanie problemów\r\n- `PROJECT_STRUCTURE.md` - Struktura plików i konfiguracji\r\n\r\n### Oficjalna dokumentacja:\r\n- [Astro Docs](https://docs.astro.build)\r\n- [Cloudflare Workers](https://developers.cloudflare.com/workers/)\r\n- [Cloudflare Pages](https://developers.cloudflare.com/pages/)\r\n- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)\r\n\r\n---\r\n\r\n## ✅ Checklist Po Deploymencie\r\n\r\n- [ ] Main app działa: `https://nazwa-projektu.mybonzo.com/`\r\n- [ ] Subpage działa: `https://nazwa-projektu.mybonzo.com/sciezka/`\r\n- [ ] Worker health check: `https://nazwa-projektu.mybonzo.com/_proxy-health`\r\n- [ ] Assets ładują się poprawnie (CSS, JS, obrazy)\r\n- [ ] Routing działa: główna → main-app, subpage → subpage\r\n- [ ] SSL certificate aktywny (🔒 w przeglądarce)\r\n- [ ] GitHub Actions workflow dodany (opcjonalnie)\r\n- [ ] Secrets dodane w GitHub (jeśli workflow)\r\n- [ ] Dokumentacja zaktualizowana w README projektu\r\n- [ ] Projekt dodany do głównego INDEX wszystkich eksperymentów\r\n\r\n---\r\n\r\n## 🚨 WAŻNE PRZYPOMNIENIA\r\n\r\n1. **Prefiks `mybonzo-EXP-`** w nazwach odróżnia eksperymenty od produkcji\r\n2. **Base path MUSI mieć slashe**: `/nazwa/` (początek i koniec!)\r\n3. **Synchronizuj base path** w 3 miejscach:\r\n   - `subpage/astro.config.mjs` → `base:`\r\n   - `subpage/wrangler.jsonc` → `BASE_PATH` var\r\n   - `worker-proxy/index.js` → `prefix:` w ROUTES\r\n4. **Worker proxy** wymaga URL-i AFTER deployu Pages\r\n5. **Custom domain** potrzebuje 2-5 minut na SSL\r\n6. **GitHub Actions** wymaga secrets: `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`\r\n7. **Compatibility date**: 2025-10-31 (aktualizuj przy każdym deploymencie)\r\n\r\n---\r\n\r\n**Powodzenia! 🚀**\r\n\r\nJeśli coś nie działa, sprawdź sekcję "Rozwiązywanie Problemów" powyżej lub pełną dokumentację w `KONFIG_PODPROJEKT/TROUBLESHOOTING.md`.\r\n';
}
async function compiledContent() {
  return await html();
}
function getHeadings() {
  return [{ "depth": 1, "slug": "-instrukcja-wdrożenia-nowego-eksperymentu", "text": "🚀 Instrukcja Wdrożenia Nowego Eksperymentu" }, { "depth": 2, "slug": "-checklist-szybkiego-startu", "text": "📋 Checklist Szybkiego Startu" }, { "depth": 3, "slug": "-quick-deploy-5-minut", "text": "⚡ Quick Deploy (5 minut)" }, { "depth": 2, "slug": "-krok-1-tworzenie-nowego-projektu", "text": "🎯 Krok 1: Tworzenie Nowego Projektu" }, { "depth": 3, "slug": "skopiuj-szablon", "text": "Skopiuj szablon:" }, { "depth": 3, "slug": "zmień-nazwy-projektu-w-plikach", "text": "Zmień nazwy projektu w plikach:" }, { "depth": 4, "slug": "-main-appwranglerjsonc---linia-6", "text": "📁 main-app/wrangler.jsonc - linia 6:" }, { "depth": 4, "slug": "-subpagewranglerjsonc---linia-6", "text": "📁 subpage/wrangler.jsonc - linia 6:" }, { "depth": 4, "slug": "-worker-proxywranglerjsonc---linia-6", "text": "📁 worker-proxy/wrangler.jsonc - linia 6:" }, { "depth": 2, "slug": "-krok-2-konfiguracja-base-path", "text": "🎯 Krok 2: Konfiguracja Base Path" }, { "depth": 3, "slug": "a-decyzja-o-routing", "text": "A. Decyzja o routing:" }, { "depth": 3, "slug": "b-edytuj-subpageastroconfigmjs---linia-39", "text": "B. Edytuj subpage/astro.config.mjs - linia 39:" }, { "depth": 3, "slug": "c-edytuj-subpagewranglerjsonc---linia-23", "text": "C. Edytuj subpage/wrangler.jsonc - linia 23:" }, { "depth": 2, "slug": "-krok-3-lokalny-test", "text": "🎯 Krok 3: Lokalny Test" }, { "depth": 3, "slug": "a-main-app", "text": "A. Main App:" }, { "depth": 3, "slug": "b-subpage", "text": "B. Subpage:" }, { "depth": 3, "slug": "c-worker-proxy-później-po-deploy-pages", "text": "C. Worker Proxy (później, po deploy Pages):" }, { "depth": 2, "slug": "-krok-4-deploy-na-cloudflare-pages", "text": "🎯 Krok 4: Deploy na Cloudflare Pages" }, { "depth": 3, "slug": "autentykacja-jednorazowo", "text": "Autentykacja (jednorazowo):" }, { "depth": 3, "slug": "deploy-main-app", "text": "Deploy Main App:" }, { "depth": 3, "slug": "deploy-subpage", "text": "Deploy Subpage:" }, { "depth": 2, "slug": "-krok-5-konfiguracja-worker-proxy", "text": "🎯 Krok 5: Konfiguracja Worker Proxy" }, { "depth": 3, "slug": "a-edytuj-worker-proxyindexjs---linie-17-18", "text": "A. Edytuj worker-proxy/index.js - linie 17-18:" }, { "depth": 3, "slug": "b-edytuj-worker-proxyindexjs---linie-23-27", "text": "B. Edytuj worker-proxy/index.js - linie 23-27:" }, { "depth": 3, "slug": "c-deploy-worker", "text": "C. Deploy Worker:" }, { "depth": 3, "slug": "d-przypisz-custom-domain-cloudflare-dashboard", "text": "D. Przypisz Custom Domain (Cloudflare Dashboard):" }, { "depth": 3, "slug": "e-testuj-routing", "text": "E. Testuj routing:" }, { "depth": 2, "slug": "-krok-6-github-actions-opcjonalnie", "text": "🎯 Krok 6: GitHub Actions (Opcjonalnie)" }, { "depth": 3, "slug": "skopiuj-workflow-template", "text": "Skopiuj workflow template:" }, { "depth": 3, "slug": "edytuj-każdy-workflow", "text": "Edytuj każdy workflow:" }, { "depth": 4, "slug": "zmień-path-trigger-przykład-dla-deploy-moj-test-mainyml", "text": "Zmień path trigger (przykład dla deploy-moj-test-main.yml):" }, { "depth": 4, "slug": "zmień-working-directory", "text": "Zmień working directory:" }, { "depth": 3, "slug": "dodaj-secrets-w-github", "text": "Dodaj secrets w GitHub:" }, { "depth": 2, "slug": "-rozwiązywanie-problemów", "text": "📚 Rozwiązywanie Problemów" }, { "depth": 3, "slug": "-problem-404-not-found-na-subpage", "text": "❌ Problem: “404 Not Found” na subpage" }, { "depth": 3, "slug": "-problem-assets-nie-ładują-się-404-dla-cssjs", "text": "❌ Problem: “Assets nie ładują się” (404 dla CSS/JS)" }, { "depth": 3, "slug": "-problem-worker-proxy-nie-działa", "text": "❌ Problem: Worker proxy nie działa" }, { "depth": 3, "slug": "-problem-error-1101---worker-error", "text": "❌ Problem: “Error 1101” - Worker Error" }, { "depth": 3, "slug": "-problem-cors-errors", "text": "❌ Problem: CORS errors" }, { "depth": 2, "slug": "-zaawansowana-konfiguracja", "text": "🔧 Zaawansowana Konfiguracja" }, { "depth": 3, "slug": "dodanie-kv-storage-cache-sessions", "text": "Dodanie KV Storage (cache, sessions):" }, { "depth": 3, "slug": "dodanie-r2-storage-pliki-media", "text": "Dodanie R2 Storage (pliki, media):" }, { "depth": 3, "slug": "dodanie-d1-database-sql", "text": "Dodanie D1 Database (SQL):" }, { "depth": 2, "slug": "-pełna-ścieżka-deployu---przykład", "text": "📝 Pełna Ścieżka Deployu - Przykład" }, { "depth": 2, "slug": "-dodatkowe-zasoby", "text": "🎓 Dodatkowe Zasoby" }, { "depth": 3, "slug": "dokumentacja-z-konfig_podprojekt", "text": "Dokumentacja z KONFIG_PODPROJEKT:" }, { "depth": 3, "slug": "oficjalna-dokumentacja", "text": "Oficjalna dokumentacja:" }, { "depth": 2, "slug": "-checklist-po-deploymencie", "text": "✅ Checklist Po Deploymencie" }, { "depth": 2, "slug": "-ważne-przypomnienia", "text": "🚨 WAŻNE PRZYPOMNIENIA" }];
}
const Content = createComponent((result, _props, slots) => {
  const { layout, ...content } = frontmatter;
  content.file = file;
  content.url = url;
  return renderTemplate`<meta charset="utf-8">${maybeRenderHead()}${unescapeHTML(html())}`;
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	Content,
	compiledContent,
	default: Content,
	file,
	frontmatter,
	getHeadings,
	rawContent,
	url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
