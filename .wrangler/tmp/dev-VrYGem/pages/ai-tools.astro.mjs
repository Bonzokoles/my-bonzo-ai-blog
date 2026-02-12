globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, a as renderTemplate, r as renderComponent, e as renderScript } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout, a as $$Icon } from '../chunks/Layout_Dkg1w919.mjs';
import { $ as $$PageHeader } from '../chunks/PageHeader_DaikhrCu.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://www.mybonzoaiblog.com");
const $$AIToolCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AIToolCard;
  const { icon, title, description, url, category } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="ai-tool-card-wrapper"${addAttribute(category, "data-category")}${addAttribute(title.toLowerCase(), "data-title")}${addAttribute(description.toLowerCase(), "data-description")} data-astro-cid-u6oflbwa> <a${addAttribute(url, "href")} target="_blank" rel="noopener noreferrer" class="ai-tool-card group" data-astro-cid-u6oflbwa> <div class="card-content" data-astro-cid-u6oflbwa> <div class="card-icon-wrapper" data-astro-cid-u6oflbwa> <span class="card-icon" data-astro-cid-u6oflbwa>${icon}</span> </div> <h3 class="card-title" data-astro-cid-u6oflbwa>${title}</h3> <p class="card-description" data-astro-cid-u6oflbwa>${description}</p> ${category && renderTemplate`<span class="card-category" data-astro-cid-u6oflbwa>${category}</span>`} </div> </a> <button class="favorite-btn"${addAttribute(title, "data-tool-title")}${addAttribute(url, "data-tool-url")} onclick="window.toggleFavorite(this)" title="Dodaj do ulubionych" data-astro-cid-u6oflbwa> <span class="favorite-icon" data-astro-cid-u6oflbwa>☆</span> </button> </div> `;
}, "U:/WWW_MYbonzoai_blog/src/components/Astro/AIToolCard.astro", void 0);

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const description = "Kompleksowy katalog najlepszych darmowych narz\u0119dzi AI w 2025 roku. Od generator\xF3w tekstu i obraz\xF3w po narz\u0119dzia do edycji video i automatyzacji.";
  const quickAccess = [
    {
      icon: "\u{1F916}",
      title: "ChatGPT",
      description: "AI assistant for conversations and tasks",
      url: "https://chat.openai.com",
      category: "Chat AI"
    },
    {
      icon: "\u{1F9E0}",
      title: "Claude AI",
      description: "Advanced AI by Anthropic",
      url: "https://claude.ai",
      category: "Chat AI"
    },
    {
      icon: "\u2728",
      title: "Google Gemini",
      description: "Multimodal AI by Google",
      url: "https://gemini.google.com",
      category: "Chat AI"
    },
    {
      icon: "\u{1F680}",
      title: "MS Copilot",
      description: "Microsoft's AI assistant",
      url: "https://copilot.microsoft.com",
      category: "Productivity"
    },
    {
      icon: "\u{1F50D}",
      title: "Perplexity AI",
      description: "AI-powered search engine",
      url: "https://perplexity.ai",
      category: "Search"
    },
    {
      icon: "\u{1F917}",
      title: "Hugging Face",
      description: "ML models and datasets",
      url: "https://huggingface.co",
      category: "Platform"
    },
    {
      icon: "\u{1F4BB}",
      title: "GitHub",
      description: "Code repositories and collaboration",
      url: "https://github.com",
      category: "Development"
    },
    {
      icon: "\u26A1",
      title: "v0.dev",
      description: "AI-powered UI generation",
      url: "https://v0.dev",
      category: "Design"
    }
  ];
  const textTools = [
    {
      icon: "\u270D\uFE0F",
      title: "Jasper",
      description: "AI writing and content creation",
      url: "https://www.jasper.ai",
      category: "Writing"
    },
    {
      icon: "\u{1F985}",
      title: "QuillBot",
      description: "Paraphrasing and grammar checker",
      url: "https://quillbot.com",
      category: "Writing"
    },
    {
      icon: "\u{1F4DD}",
      title: "Copy.ai",
      description: "AI copywriting assistant",
      url: "https://www.copy.ai",
      category: "Writing"
    },
    {
      icon: "\u{1F5D2}\uFE0F",
      title: "Notion AI",
      description: "AI-powered note-taking",
      url: "https://www.notion.so/product/ai",
      category: "Productivity"
    }
  ];
  const imageTools = [
    {
      icon: "\u{1F3A8}",
      title: "Ideogram",
      description: "Text to image generation",
      url: "https://ideogram.ai",
      category: "Image Gen"
    },
    {
      icon: "\u{1F3AE}",
      title: "Playground AI",
      description: "AI art creation platform",
      url: "https://playground.ai",
      category: "Image Gen"
    },
    {
      icon: "\u{1F58D}\uFE0F",
      title: "Craiyon",
      description: "Free AI image generator",
      url: "https://www.craiyon.com",
      category: "Image Gen"
    },
    {
      icon: "\u{1F3AD}",
      title: "Lexica",
      description: "Stable Diffusion search engine",
      url: "https://lexica.art",
      category: "Image Gen"
    },
    {
      icon: "\u2702\uFE0F",
      title: "Remove.bg",
      description: "AI background remover",
      url: "https://www.remove.bg",
      category: "Photo Edit"
    },
    {
      icon: "\u{1F9FD}",
      title: "Cleanup Pictures",
      description: "Remove unwanted objects",
      url: "https://cleanup.pictures",
      category: "Photo Edit"
    },
    {
      icon: "\u{1F573}\uFE0F",
      title: "PhotoRoom",
      description: "Product photography AI",
      url: "https://www.photoroom.com",
      category: "Photo Edit"
    },
    {
      icon: "\u{1F3AD}",
      title: "Canva AI",
      description: "AI-powered design platform",
      url: "https://www.canva.com/ai-image-generator",
      category: "Design"
    }
  ];
  const videoAudioTools = [
    {
      icon: "\u{1F3A5}",
      title: "Synthesia",
      description: "AI video generation with avatars",
      url: "https://www.synthesia.io",
      category: "Video"
    },
    {
      icon: "\u{1F3AC}",
      title: "Runway ML",
      description: "AI video editing suite",
      url: "https://runway.ml",
      category: "Video"
    },
    {
      icon: "\u{1F3A4}",
      title: "ElevenLabs",
      description: "AI voice synthesis",
      url: "https://elevenlabs.io",
      category: "Voice"
    },
    {
      icon: "\u{1F50A}",
      title: "Murf AI",
      description: "Text to speech platform",
      url: "https://murf.ai",
      category: "Voice"
    },
    {
      icon: "\u{1F9A6}",
      title: "Otter.ai",
      description: "AI meeting transcription",
      url: "https://www.otter.ai",
      category: "Transcription"
    },
    {
      icon: "\u{1F4E3}",
      title: "Fireflies",
      description: "AI meeting assistant",
      url: "https://fireflies.ai",
      category: "Transcription"
    }
  ];
  const presentationTools = [
    {
      icon: "\u{1F4D6}",
      title: "Tome",
      description: "AI presentation maker",
      url: "https://tome.app",
      category: "Presentations"
    },
    {
      icon: "\u{1F4CA}",
      title: "Gamma",
      description: "AI-powered presentations",
      url: "https://gamma.app",
      category: "Presentations"
    },
    {
      icon: "\u{1F4F0}",
      title: "Beautiful.ai",
      description: "Smart presentation software",
      url: "https://beautiful.ai",
      category: "Presentations"
    }
  ];
  const huggingFaceSpaces = [
    {
      icon: "\u{1F3A8}",
      title: "FLUX Image Gen",
      description: "Fast text-to-image generation",
      url: "https://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell",
      category: "HF Space"
    },
    {
      icon: "\u{1F5BC}\uFE0F",
      title: "Stable Diffusion",
      description: "Classic image generation",
      url: "https://huggingface.co/spaces/stabilityai/stable-diffusion",
      category: "HF Space"
    },
    {
      icon: "\u{1F3A4}",
      title: "Whisper WebGPU",
      description: "Speech recognition in browser",
      url: "https://huggingface.co/spaces/Xenova/whisper-webgpu",
      category: "HF Space"
    },
    {
      icon: "\u{1F3C6}",
      title: "LLM Leaderboard",
      description: "Compare AI models",
      url: "https://huggingface.co/spaces/huggingface/open-llm-leaderboard",
      category: "HF Space"
    },
    {
      icon: "\u{1F3B5}",
      title: "MusicGen",
      description: "AI music generation",
      url: "https://huggingface.co/spaces/facebook/MusicGen",
      category: "HF Space"
    },
    {
      icon: "\u{1F93C}",
      title: "Chatbot Arena",
      description: "Compare AI chatbots",
      url: "https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard",
      category: "HF Space"
    }
  ];
  const searchEngines = [
    {
      icon: "\u{1F986}",
      title: "DuckDuckGo",
      description: "Privacy-focused search",
      url: "https://duckduckgo.com",
      category: "Search"
    },
    {
      icon: "\u{1F981}",
      title: "Brave Search",
      description: "Independent private search",
      url: "https://search.brave.com",
      category: "Search"
    },
    {
      icon: "\u{1F333}",
      title: "Ecosia",
      description: "Plant trees with searches",
      url: "https://www.ecosia.org",
      category: "Search"
    },
    {
      icon: "\u{1F510}",
      title: "Startpage",
      description: "Google without tracking",
      url: "https://www.startpage.com",
      category: "Search"
    },
    {
      icon: "\u{1F4AC}",
      title: "You.com",
      description: "AI-powered search",
      url: "https://you.com",
      category: "AI Search"
    },
    {
      icon: "\u{1F50E}",
      title: "Kagi",
      description: "Premium ad-free search",
      url: "https://kagi.com",
      category: "Search"
    }
  ];
  const devTools = [
    {
      icon: "\u{1F4BB}",
      title: "GitHub Copilot",
      description: "AI pair programmer",
      url: "https://github.com/features/copilot",
      category: "Development"
    },
    {
      icon: "\u{1F52E}",
      title: "Cursor",
      description: "AI-powered code editor",
      url: "https://cursor.sh",
      category: "Development"
    },
    {
      icon: "\u26A1",
      title: "Replit AI",
      description: "AI coding assistant",
      url: "https://replit.com",
      category: "Development"
    },
    {
      icon: "\u{1F916}",
      title: "Tabnine",
      description: "AI code completion",
      url: "https://www.tabnine.com",
      category: "Development"
    },
    {
      icon: "\u{1F4DA}",
      title: "Stack Overflow",
      description: "Developer Q&A community",
      url: "https://stackoverflow.com",
      category: "Development"
    },
    {
      icon: "\u{1F419}",
      title: "GitHub",
      description: "Code hosting platform",
      url: "https://github.com",
      category: "Development"
    }
  ];
  const productivityTools = [
    {
      icon: "\u{1F4CB}",
      title: "Zapier AI",
      description: "Workflow automation",
      url: "https://zapier.com",
      category: "Productivity"
    },
    {
      icon: "\u{1F504}",
      title: "Make.com",
      description: "Visual automation platform",
      url: "https://make.com",
      category: "Productivity"
    },
    {
      icon: "\u{1F4CA}",
      title: "Notion AI",
      description: "All-in-one workspace",
      url: "https://www.notion.so",
      category: "Productivity"
    },
    {
      icon: "\u{1F4DD}",
      title: "Grammarly",
      description: "AI writing assistant",
      url: "https://www.grammarly.com",
      category: "Productivity"
    },
    {
      icon: "\u{1F5D3}\uFE0F",
      title: "Reclaim AI",
      description: "Smart calendar assistant",
      url: "https://reclaim.ai",
      category: "Productivity"
    },
    {
      icon: "\u23F0",
      title: "Motion",
      description: "AI task management",
      url: "https://usemotion.com",
      category: "Productivity"
    }
  ];
  const dataTools = [
    {
      icon: "\u{1F4CA}",
      title: "Julius AI",
      description: "AI data analyst",
      url: "https://julius.ai",
      category: "Data"
    },
    {
      icon: "\u{1F4C8}",
      title: "Tableau",
      description: "Data visualization",
      url: "https://www.tableau.com",
      category: "Data"
    },
    {
      icon: "\u{1F50D}",
      title: "Akkio",
      description: "No-code ML platform",
      url: "https://www.akkio.com",
      category: "Data"
    },
    {
      icon: "\u{1F4BE}",
      title: "DataRobot",
      description: "Enterprise AI platform",
      url: "https://www.datarobot.com",
      category: "Data"
    }
  ];
  const allTools = [
    ...quickAccess,
    ...textTools,
    ...imageTools,
    ...videoAudioTools,
    ...presentationTools,
    ...huggingFaceSpaces,
    ...searchEngines,
    ...devTools,
    ...productivityTools,
    ...dataTools
  ];
  const totalTools = allTools.length;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "AI Tools Dashboard - MyBonzo AI Blog", "description": description, "data-astro-cid-6jgagx6q": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": "\u{1F680} Dashboard Narz\u0119dzi AI", "description": description, "animate": true, "data-astro-cid-6jgagx6q": true })} ${maybeRenderHead()}<div class="container mx-auto px-4 py-12" data-astro-cid-6jgagx6q> <!-- Search & Filter Section --> <div class="search-filter-section mb-12" data-astro-cid-6jgagx6q> <div class="search-wrapper" data-astro-cid-6jgagx6q> <input type="text" id="searchInput" placeholder="🔍 Szukaj narzędzi AI..." class="search-input" data-astro-cid-6jgagx6q> </div> <div class="filter-buttons" data-astro-cid-6jgagx6q> <button class="filter-btn active" data-category="all" data-astro-cid-6jgagx6q>
Wszystkie (<span id="count-all" data-astro-cid-6jgagx6q>${totalTools}</span>)
</button> <button class="filter-btn" data-category="favorites" data-astro-cid-6jgagx6q>
⭐ Ulubione (<span id="count-favorites" data-astro-cid-6jgagx6q>0</span>)
</button> <button class="filter-btn" data-category="Chat AI" data-astro-cid-6jgagx6q>
🤖 Chat AI
</button> <button class="filter-btn" data-category="Writing" data-astro-cid-6jgagx6q>
✍️ Pisanie
</button> <button class="filter-btn" data-category="Image Gen" data-astro-cid-6jgagx6q>
🎨 Obrazy
</button> <button class="filter-btn" data-category="Video" data-astro-cid-6jgagx6q>
🎬 Wideo
</button> <button class="filter-btn" data-category="Development" data-astro-cid-6jgagx6q>
💻 Dev Tools
</button> <button class="filter-btn" data-category="Productivity" data-astro-cid-6jgagx6q>
📋 Produktywność
</button> </div> </div> <!-- Stats Section --> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16" data-astro-cid-6jgagx6q> <div class="stat-card" data-astro-cid-6jgagx6q> <div class="stat-value" data-astro-cid-6jgagx6q>${totalTools}</div> <div class="stat-label" data-astro-cid-6jgagx6q>Narzędzi AI</div> </div> <div class="stat-card" data-astro-cid-6jgagx6q> <div class="stat-value" data-astro-cid-6jgagx6q>100%</div> <div class="stat-label" data-astro-cid-6jgagx6q>Darmowych</div> </div> <div class="stat-card" data-astro-cid-6jgagx6q> <div class="stat-value" data-astro-cid-6jgagx6q>2025</div> <div class="stat-label" data-astro-cid-6jgagx6q>Rok</div> </div> <div class="stat-card" data-astro-cid-6jgagx6q> <div class="stat-value" data-astro-cid-6jgagx6q>11</div> <div class="stat-label" data-astro-cid-6jgagx6q>Kategorii</div> </div> </div> <!-- Quick Access --> <section class="mb-16" data-astro-cid-6jgagx6q> <div class="section-header" data-astro-cid-6jgagx6q> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:flashlight-line", "class": "section-icon", "data-astro-cid-6jgagx6q": true })} <h2 class="section-title" data-astro-cid-6jgagx6q>⚡ Szybki Dostęp</h2> </div> <p class="section-description" data-astro-cid-6jgagx6q>
Najpopularniejsze i najczęściej używane narzędzia AI
</p> <div class="tools-grid" data-astro-cid-6jgagx6q> ${quickAccess.map((tool) => renderTemplate`${renderComponent($$result2, "AIToolCard", $$AIToolCard, { ...tool, "data-astro-cid-6jgagx6q": true })}`)} </div> </section> <!-- Text & Writing Tools --> <section class="mb-16" data-astro-cid-6jgagx6q> <div class="section-header" data-astro-cid-6jgagx6q> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:quill-pen-line", "class": "section-icon", "data-astro-cid-6jgagx6q": true })} <h2 class="section-title" data-astro-cid-6jgagx6q>✍️ Pisanie i Treść</h2> </div> <p class="section-description" data-astro-cid-6jgagx6q>
Narzędzia AI do tworzenia tekstów, copywritingu i edycji
</p> <div class="tools-grid" data-astro-cid-6jgagx6q> ${textTools.map((tool) => renderTemplate`${renderComponent($$result2, "AIToolCard", $$AIToolCard, { ...tool, "data-astro-cid-6jgagx6q": true })}`)} </div> </section> <!-- Image Tools --> <section class="mb-16" data-astro-cid-6jgagx6q> <div class="section-header" data-astro-cid-6jgagx6q> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:image-line", "class": "section-icon", "data-astro-cid-6jgagx6q": true })} <h2 class="section-title" data-astro-cid-6jgagx6q>🎨 Obrazy i Grafika</h2> </div> <p class="section-description" data-astro-cid-6jgagx6q>
Generatory obrazów, edytory zdjęć i narzędzia do designu
</p> <div class="tools-grid" data-astro-cid-6jgagx6q> ${imageTools.map((tool) => renderTemplate`${renderComponent($$result2, "AIToolCard", $$AIToolCard, { ...tool, "data-astro-cid-6jgagx6q": true })}`)} </div> </section> <!-- Video & Audio --> <section class="mb-16" data-astro-cid-6jgagx6q> <div class="section-header" data-astro-cid-6jgagx6q> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:video-line", "class": "section-icon", "data-astro-cid-6jgagx6q": true })} <h2 class="section-title" data-astro-cid-6jgagx6q>🎬 Wideo i Audio</h2> </div> <p class="section-description" data-astro-cid-6jgagx6q>
Tworzenie i edycja wideo, synteza głosu i transkrypcja
</p> <div class="tools-grid" data-astro-cid-6jgagx6q> ${videoAudioTools.map((tool) => renderTemplate`${renderComponent($$result2, "AIToolCard", $$AIToolCard, { ...tool, "data-astro-cid-6jgagx6q": true })}`)} </div> </section> <!-- Presentations --> <section class="mb-16" data-astro-cid-6jgagx6q> <div class="section-header" data-astro-cid-6jgagx6q> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:slideshow-line", "class": "section-icon", "data-astro-cid-6jgagx6q": true })} <h2 class="section-title" data-astro-cid-6jgagx6q>📊 Prezentacje</h2> </div> <p class="section-description" data-astro-cid-6jgagx6q>
AI-powered narzędzia do tworzenia prezentacji i dokumentów
</p> <div class="tools-grid" data-astro-cid-6jgagx6q> ${presentationTools.map((tool) => renderTemplate`${renderComponent($$result2, "AIToolCard", $$AIToolCard, { ...tool, "data-astro-cid-6jgagx6q": true })}`)} </div> </section> <!-- Hugging Face Spaces --> <section class="mb-16" data-astro-cid-6jgagx6q> <div class="section-header" data-astro-cid-6jgagx6q> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:rocket-line", "class": "section-icon", "data-astro-cid-6jgagx6q": true })} <h2 class="section-title" data-astro-cid-6jgagx6q>🤗 Hugging Face Spaces</h2> </div> <p class="section-description" data-astro-cid-6jgagx6q>
Najlepsze darmowe modele AI dostępne w przeglądarce
</p> <div class="tools-grid" data-astro-cid-6jgagx6q> ${huggingFaceSpaces.map((tool) => renderTemplate`${renderComponent($$result2, "AIToolCard", $$AIToolCard, { ...tool, "data-astro-cid-6jgagx6q": true })}`)} </div> </section> <!-- Search Engines --> <section class="mb-16" data-astro-cid-6jgagx6q> <div class="section-header" data-astro-cid-6jgagx6q> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:search-line", "class": "section-icon", "data-astro-cid-6jgagx6q": true })} <h2 class="section-title" data-astro-cid-6jgagx6q>🔍 Wyszukiwarki</h2> </div> <p class="section-description" data-astro-cid-6jgagx6q>
Alternatywne wyszukiwarki z naciskiem na prywatność i AI
</p> <div class="tools-grid" data-astro-cid-6jgagx6q> ${searchEngines.map((tool) => renderTemplate`${renderComponent($$result2, "AIToolCard", $$AIToolCard, { ...tool, "data-astro-cid-6jgagx6q": true })}`)} </div> </section> <!-- Development Tools --> <section class="mb-16" data-astro-cid-6jgagx6q> <div class="section-header" data-astro-cid-6jgagx6q> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:code-line", "class": "section-icon", "data-astro-cid-6jgagx6q": true })} <h2 class="section-title" data-astro-cid-6jgagx6q>💻 Narzędzia Programistyczne</h2> </div> <p class="section-description" data-astro-cid-6jgagx6q>
AI dla programistów - copiloty, edytory i platformy developerskie
</p> <div class="tools-grid" data-astro-cid-6jgagx6q> ${devTools.map((tool) => renderTemplate`${renderComponent($$result2, "AIToolCard", $$AIToolCard, { ...tool, "data-astro-cid-6jgagx6q": true })}`)} </div> </section> <!-- Productivity Tools --> <section class="mb-16" data-astro-cid-6jgagx6q> <div class="section-header" data-astro-cid-6jgagx6q> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:settings-3-line", "class": "section-icon", "data-astro-cid-6jgagx6q": true })} <h2 class="section-title" data-astro-cid-6jgagx6q>📋 Produktywność i Automatyzacja</h2> </div> <p class="section-description" data-astro-cid-6jgagx6q>
Narzędzia zwiększające produktywność i automatyzujące procesy
</p> <div class="tools-grid" data-astro-cid-6jgagx6q> ${productivityTools.map((tool) => renderTemplate`${renderComponent($$result2, "AIToolCard", $$AIToolCard, { ...tool, "data-astro-cid-6jgagx6q": true })}`)} </div> </section> <!-- Data & Analytics --> <section class="mb-16" data-astro-cid-6jgagx6q> <div class="section-header" data-astro-cid-6jgagx6q> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:bar-chart-box-line", "class": "section-icon", "data-astro-cid-6jgagx6q": true })} <h2 class="section-title" data-astro-cid-6jgagx6q>📊 Dane i Analityka</h2> </div> <p class="section-description" data-astro-cid-6jgagx6q>
AI do analizy danych, wizualizacji i machine learning
</p> <div class="tools-grid" data-astro-cid-6jgagx6q> ${dataTools.map((tool) => renderTemplate`${renderComponent($$result2, "AIToolCard", $$AIToolCard, { ...tool, "data-astro-cid-6jgagx6q": true })}`)} </div> </section> <!-- CTA Section --> <section class="cta-section" data-astro-cid-6jgagx6q> <div class="cta-content" data-astro-cid-6jgagx6q> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:sparkling-line", "class": "cta-icon", "data-astro-cid-6jgagx6q": true })} <h3 class="cta-title" data-astro-cid-6jgagx6q>Chcesz dodać swoje narzędzie?</h3> <p class="cta-description" data-astro-cid-6jgagx6q>
Masz własne narzędzie AI? Skontaktuj się z nami i dodamy je do naszego katalogu!
</p> <a href="/contact" class="cta-button" data-astro-cid-6jgagx6q>
Skontaktuj się
</a> </div> </section> </div> ` })}  ${renderScript($$result, "U:/WWW_MYbonzoai_blog/src/pages/ai-tools/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/ai-tools/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/ai-tools/index.astro";
const $$url = "/ai-tools";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
