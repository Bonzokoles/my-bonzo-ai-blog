globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent, a as renderTemplate, r as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../chunks/Layout_Dkg1w919.mjs';
import { $ as $$PageHeader } from '../chunks/PageHeader_DaikhrCu.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const description = "Rozpoznawanie mowy w przegl\u0105darce z wykorzystaniem Whisper AI. Transkrypcja audio na tekst w czasie rzeczywistym, obs\u0142uga wielu j\u0119zyk\xF3w, ca\u0142kowicie darmowe.";
  return renderTemplate(_a || (_a = __template(["", `  <script type="module">
  import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.0';

  let transcriber = null;
  let mediaRecorder = null;
  let audioChunks = [];
  let isRecording = false;
  let selectedLanguage = 'pl';

  const statusEl = document.getElementById('status');
  const outputEl = document.getElementById('output');
  const recordBtn = document.getElementById('recordBtn');
  const clearBtn = document.getElementById('clearBtn');

  // Initialize model
  async function initModel() {
    try {
      statusEl.textContent = '\u23F3 \u0141adowanie modelu Whisper... (pierwsze uruchomienie ~1 min)';
      statusEl.className = 'status-message';

      transcriber = await pipeline(
        'automatic-speech-recognition',
        'onnx-community/whisper-base'
      );

      statusEl.textContent = '\u2705 Model za\u0142adowany! Gotowy do rozpoznawania mowy.';
      statusEl.style.borderColor = '#10b981';
      statusEl.style.color = '#10b981';
      recordBtn.disabled = false;

    } catch (error) {
      console.error('B\u0142\u0105d:', error);
      statusEl.textContent = '\u274C B\u0142\u0105d \u0142adowania modelu: ' + error.message;
      statusEl.style.borderColor = '#ef4444';
      statusEl.style.color = '#ef4444';
    }
  }

  // Language selection
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedLanguage = btn.dataset.lang;
    });
  });

  // Record button
  recordBtn.addEventListener('click', async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      await stopRecording();
    }
  });

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      isRecording = true;
      recordBtn.textContent = '\u23F9\uFE0F Zatrzymaj Nagrywanie';
      recordBtn.classList.add('recording');
      statusEl.textContent = '\u{1F534} Nagrywanie... M\xF3w teraz!';
      statusEl.style.borderColor = '#ef4444';
      statusEl.style.color = '#ef4444';

    } catch (error) {
      statusEl.textContent = '\u274C B\u0142\u0105d mikrofonu: ' + error.message;
      statusEl.style.borderColor = '#ef4444';
      statusEl.style.color = '#ef4444';
    }
  }

  async function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      isRecording = false;
      recordBtn.textContent = '\u{1F3A4} Rozpocznij Nagrywanie';
      recordBtn.classList.remove('recording');
      statusEl.textContent = '\u23F3 Przetwarzanie...';
      statusEl.style.borderColor = '#f59e0b';
      statusEl.style.color = '#f59e0b';
    }
  }

  async function transcribeAudio(audioBlob) {
    try {
      statusEl.textContent = '\u{1F9E0} Rozpoznawanie mowy...';

      const result = await transcriber(audioBlob, {
        language: selectedLanguage,
        task: 'transcribe'
      });

      const transcription = result.text || result;

      if (outputEl.classList.contains('empty')) {
        outputEl.classList.remove('empty');
        outputEl.innerHTML = '';
      }

      const timestamp = new Date().toLocaleTimeString('pl-PL');
      const entryDiv = document.createElement('div');
      entryDiv.className = 'transcript-entry';
      entryDiv.innerHTML = \`
        <div class="transcript-timestamp">[\${timestamp}]</div>
        <div class="transcript-text">\${transcription}</div>
      \`;

      outputEl.appendChild(entryDiv);
      outputEl.scrollTop = outputEl.scrollHeight;

      statusEl.textContent = '\u2705 Gotowe! Mo\u017Cesz nagra\u0107 kolejne.';
      statusEl.style.borderColor = '#10b981';
      statusEl.style.color = '#10b981';

    } catch (error) {
      statusEl.textContent = '\u274C B\u0142\u0105d transkrypcji: ' + error.message;
      statusEl.style.borderColor = '#ef4444';
      statusEl.style.color = '#ef4444';
    }
  }

  // Clear button
  clearBtn.addEventListener('click', () => {
    outputEl.innerHTML = 'Naci\u015Bnij przycisk nagrywania i zacznij m\xF3wi\u0107...';
    outputEl.classList.add('empty');
    statusEl.textContent = '\u2705 Gotowy do rozpoznawania mowy.';
    statusEl.style.borderColor = '#10b981';
    statusEl.style.color = '#10b981';
  });

  // Initialize on page load
  window.addEventListener('load', initModel);
<\/script>`], ["", `  <script type="module">
  import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.0';

  let transcriber = null;
  let mediaRecorder = null;
  let audioChunks = [];
  let isRecording = false;
  let selectedLanguage = 'pl';

  const statusEl = document.getElementById('status');
  const outputEl = document.getElementById('output');
  const recordBtn = document.getElementById('recordBtn');
  const clearBtn = document.getElementById('clearBtn');

  // Initialize model
  async function initModel() {
    try {
      statusEl.textContent = '\u23F3 \u0141adowanie modelu Whisper... (pierwsze uruchomienie ~1 min)';
      statusEl.className = 'status-message';

      transcriber = await pipeline(
        'automatic-speech-recognition',
        'onnx-community/whisper-base'
      );

      statusEl.textContent = '\u2705 Model za\u0142adowany! Gotowy do rozpoznawania mowy.';
      statusEl.style.borderColor = '#10b981';
      statusEl.style.color = '#10b981';
      recordBtn.disabled = false;

    } catch (error) {
      console.error('B\u0142\u0105d:', error);
      statusEl.textContent = '\u274C B\u0142\u0105d \u0142adowania modelu: ' + error.message;
      statusEl.style.borderColor = '#ef4444';
      statusEl.style.color = '#ef4444';
    }
  }

  // Language selection
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedLanguage = btn.dataset.lang;
    });
  });

  // Record button
  recordBtn.addEventListener('click', async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      await stopRecording();
    }
  });

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      isRecording = true;
      recordBtn.textContent = '\u23F9\uFE0F Zatrzymaj Nagrywanie';
      recordBtn.classList.add('recording');
      statusEl.textContent = '\u{1F534} Nagrywanie... M\xF3w teraz!';
      statusEl.style.borderColor = '#ef4444';
      statusEl.style.color = '#ef4444';

    } catch (error) {
      statusEl.textContent = '\u274C B\u0142\u0105d mikrofonu: ' + error.message;
      statusEl.style.borderColor = '#ef4444';
      statusEl.style.color = '#ef4444';
    }
  }

  async function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      isRecording = false;
      recordBtn.textContent = '\u{1F3A4} Rozpocznij Nagrywanie';
      recordBtn.classList.remove('recording');
      statusEl.textContent = '\u23F3 Przetwarzanie...';
      statusEl.style.borderColor = '#f59e0b';
      statusEl.style.color = '#f59e0b';
    }
  }

  async function transcribeAudio(audioBlob) {
    try {
      statusEl.textContent = '\u{1F9E0} Rozpoznawanie mowy...';

      const result = await transcriber(audioBlob, {
        language: selectedLanguage,
        task: 'transcribe'
      });

      const transcription = result.text || result;

      if (outputEl.classList.contains('empty')) {
        outputEl.classList.remove('empty');
        outputEl.innerHTML = '';
      }

      const timestamp = new Date().toLocaleTimeString('pl-PL');
      const entryDiv = document.createElement('div');
      entryDiv.className = 'transcript-entry';
      entryDiv.innerHTML = \\\`
        <div class="transcript-timestamp">[\\\${timestamp}]</div>
        <div class="transcript-text">\\\${transcription}</div>
      \\\`;

      outputEl.appendChild(entryDiv);
      outputEl.scrollTop = outputEl.scrollHeight;

      statusEl.textContent = '\u2705 Gotowe! Mo\u017Cesz nagra\u0107 kolejne.';
      statusEl.style.borderColor = '#10b981';
      statusEl.style.color = '#10b981';

    } catch (error) {
      statusEl.textContent = '\u274C B\u0142\u0105d transkrypcji: ' + error.message;
      statusEl.style.borderColor = '#ef4444';
      statusEl.style.color = '#ef4444';
    }
  }

  // Clear button
  clearBtn.addEventListener('click', () => {
    outputEl.innerHTML = 'Naci\u015Bnij przycisk nagrywania i zacznij m\xF3wi\u0107...';
    outputEl.classList.add('empty');
    statusEl.textContent = '\u2705 Gotowy do rozpoznawania mowy.';
    statusEl.style.borderColor = '#10b981';
    statusEl.style.color = '#10b981';
  });

  // Initialize on page load
  window.addEventListener('load', initModel);
<\/script>`])), renderComponent($$result, "Layout", $$Layout, { "title": "Rozpoznawanie Mowy AI - MyBonzo AI Blog", "description": description, "data-astro-cid-g2hon6e3": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "\u{1F3A4} Rozpoznawanie Mowy AI", "description": description, "animate": true, "data-astro-cid-g2hon6e3": true })} ${maybeRenderHead()}<div class="container mx-auto px-4 py-12" data-astro-cid-g2hon6e3> <div class="max-w-4xl mx-auto" data-astro-cid-g2hon6e3> <!-- Main Speech Recognition Card --> <div class="speech-card" data-astro-cid-g2hon6e3> <div class="card-header" data-astro-cid-g2hon6e3> <h2 class="card-title" data-astro-cid-g2hon6e3>ZENON AI Speech Recognition</h2> <p class="card-subtitle" data-astro-cid-g2hon6e3>
Powered by Whisper • Działa lokalnie w przeglądarce
</p> </div> <!-- Status --> <div class="status-section" data-astro-cid-g2hon6e3> <div id="status" class="status-message" data-astro-cid-g2hon6e3>
Inicjalizacja modelu AI...
</div> </div> <!-- Language Selection --> <div class="languages-section" data-astro-cid-g2hon6e3> <h3 class="section-label" data-astro-cid-g2hon6e3>Wybierz Język</h3> <div class="language-buttons" data-astro-cid-g2hon6e3> <button class="lang-btn active" data-lang="pl" data-astro-cid-g2hon6e3>
🇵🇱 Polski
</button> <button class="lang-btn" data-lang="en" data-astro-cid-g2hon6e3>
🇬🇧 English
</button> <button class="lang-btn" data-lang="de" data-astro-cid-g2hon6e3>
🇩🇪 Deutsch
</button> <button class="lang-btn" data-lang="es" data-astro-cid-g2hon6e3>
🇪🇸 Español
</button> <button class="lang-btn" data-lang="fr" data-astro-cid-g2hon6e3>
🇫🇷 Français
</button> </div> </div> <!-- Controls --> <div class="controls-section" data-astro-cid-g2hon6e3> <button id="recordBtn" class="btn btn-record" disabled data-astro-cid-g2hon6e3>
🎤 Rozpocznij Nagrywanie
</button> <button id="clearBtn" class="btn btn-clear" data-astro-cid-g2hon6e3>
🗑️ Wyczyść
</button> </div> <!-- Output --> <div class="output-section" data-astro-cid-g2hon6e3> <h3 class="section-label" data-astro-cid-g2hon6e3>Transkrypcja</h3> <div id="output" class="output-content empty" data-astro-cid-g2hon6e3>
Naciśnij przycisk nagrywania i zacznij mówić...
</div> </div> <!-- Info --> <div class="info-section" data-astro-cid-g2hon6e3> <h3 class="info-title" data-astro-cid-g2hon6e3>ℹ️ Informacje</h3> <div class="info-content" data-astro-cid-g2hon6e3> <p data-astro-cid-g2hon6e3><strong data-astro-cid-g2hon6e3>Model:</strong> Whisper Base (OpenAI) - wersja ONNX</p> <p data-astro-cid-g2hon6e3><strong data-astro-cid-g2hon6e3>Języki:</strong> Polski, Angielski, Niemiecki, Hiszpański, Francuski i wiele innych</p> <p data-astro-cid-g2hon6e3><strong data-astro-cid-g2hon6e3>Prywatność:</strong> Działa lokalnie - żadne dane nie są wysyłane na serwer</p> <p data-astro-cid-g2hon6e3><strong data-astro-cid-g2hon6e3>Rozmiar modelu:</strong> ~74 MB (pobierany raz i cachowany w przeglądarce)</p> <p data-astro-cid-g2hon6e3><strong data-astro-cid-g2hon6e3>Pierwsze uruchomienie:</strong> Może potrwać ~1 minutę podczas ładowania modelu</p> </div> </div> </div> </div> </div> ` }));
}, "U:/WWW_MYbonzoai_blog/src/pages/rozpoznawanie-mowy/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/rozpoznawanie-mowy/index.astro";
const $$url = "/rozpoznawanie-mowy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
