globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent, m as maybeRenderHead, a as renderTemplate, d as addAttribute, r as renderComponent, am as unescapeHTML } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$PageHeader } from '../chunks/PageHeader_DaikhrCu.mjs';
import { $ as $$Card } from '../chunks/Card_DHxbvKZD.mjs';
/* empty css                                 */
import { $ as $$Layout, a as $$Icon } from '../chunks/Layout_Dkg1w919.mjs';
import { c as coverImage } from '../chunks/alk4_BmkYFJ1Z.mjs';
export { renderers } from '../renderers.mjs';

const BLOG_CONFIG = {
  recentPostsCount: 3,
  featuredPostSlug: "naprawa-pumo-rag",
  archiveLimit: 30
};
const PRO_CONFIG = {
  };

async function getHomepageBlogPosts() {
  try {
    const baseUrl = "https://www.mybonzoaiblog.com";
    const response = await fetch(`${baseUrl}/api/blog/index`);
    if (!response.ok) {
      console.error("Failed to fetch blog posts:", response.statusText);
      return [];
    }
    const data = await response.json();
    return data.posts.slice(0, BLOG_CONFIG.recentPostsCount);
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
}
function formatPostDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function parseTags(tagsString, limit = 2) {
  if (!tagsString) return [];
  return tagsString.split(/[\s,]+/).filter((tag) => tag.trim()).slice(0, limit);
}
function getPostUrl(postId) {
  return `/blog/${postId}`;
}

const $$Astro$3 = createAstro("https://www.mybonzoaiblog.com");
const $$BlogSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$BlogSection;
  const {
    posts,
    title = "Najnowsze Artyku\u0142y",
    description = "Praktyczne porady, narz\u0119dzia AI i rozwi\u0105zania dla ca\u0142ej rodziny. Bez technicznego \u017Cargonu - po prostu dzia\u0142a!"
  } = Astro2.props;
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);
  return renderTemplate`${maybeRenderHead()}<section class="py-16" data-astro-cid-khyrrlfe> <div class="max-w-6xl mx-auto px-4" data-astro-cid-khyrrlfe> <div class="text-center mb-12" data-astro-cid-khyrrlfe> <div class="flex mt-12 mb-10 md:mt-24 md:mb-12 text-4xl font-bold mb-4" data-astro-cid-khyrrlfe> <h2 class="tracking-widest text-4xl font-medium capitalize leading-relaxed mx-auto bg-theme-accent text-theme-text-secondary p-4 inline-block rounded-theme" data-astro-cid-khyrrlfe> ${title} </h2> </div> <p class="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto" data-astro-cid-khyrrlfe> ${description} </p> </div> <!-- Featured Article --> ${featuredPost && renderTemplate`<div class="mb-12" data-astro-cid-khyrrlfe> <article class="featured-post glass border border-theme-accent/30 rounded-xl overflow-hidden hover:border-theme-accent transition-all duration-300 hover-glow group" data-astro-cid-khyrrlfe> <div class="p-6" data-astro-cid-khyrrlfe> <div class="flex flex-wrap gap-2 mb-3" data-astro-cid-khyrrlfe> ${parseTags(featuredPost.tags).map((tag) => renderTemplate`<span class="px-2 py-1 bg-blue-600 text-white text-xs rounded-none font-semibold tracking-wide uppercase" data-astro-cid-khyrrlfe> ${tag} </span>`)} </div> <div class="flex mt-8 mb-6 text-3xl font-bold mb-2 line-clamp-2 text-white group-hover:text-theme-accent transition-colors" data-astro-cid-khyrrlfe> <h3 class="leading-tight" data-astro-cid-khyrrlfe> ${featuredPost.title} </h3> </div> <p class="text-theme-text opacity-80 text-lg mb-3 line-clamp-3" data-astro-cid-khyrrlfe> ${featuredPost.excerpt} </p> <div class="flex justify-between items-center text-sm text-theme-text opacity-70 mb-4" data-astro-cid-khyrrlfe> <time${addAttribute(featuredPost.date, "datetime")} data-astro-cid-khyrrlfe> ${formatPostDate(featuredPost.date)} </time> </div> <a${addAttribute(getPostUrl(featuredPost.id), "href")} class="inline-block text-theme-accent font-semibold hover:text-theme-accent-alt transition-colors" data-astro-cid-khyrrlfe>
Czytaj więcej →
</a> </div> </article> </div>`} <!-- Recent Posts Grid --> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-khyrrlfe> ${recentPosts.map((post, index) => renderTemplate`<article${addAttribute(`glass border border-theme-text/20 rounded-xl overflow-hidden hover:border-theme-text/50 transition-all duration-300 hover-glow reveal-stagger delay-${index * 100} group`, "class")} data-astro-cid-khyrrlfe> <div class="p-6" data-astro-cid-khyrrlfe> <div class="flex flex-wrap gap-2 mb-3" data-astro-cid-khyrrlfe> ${parseTags(post.tags).map((tag) => renderTemplate`<span class="px-2 py-1 bg-blue-600 text-white text-xs rounded-none font-semibold tracking-wide uppercase" data-astro-cid-khyrrlfe> ${tag} </span>`)} </div> <div class="flex mt-6 mb-4 text-xl font-bold mb-2 line-clamp-2 text-white group-hover:text-theme-accent transition-colors" data-astro-cid-khyrrlfe> <h3 class="leading-tight" data-astro-cid-khyrrlfe> ${post.title} </h3> </div> <p class="text-theme-text opacity-80 text-sm mb-3 line-clamp-3" data-astro-cid-khyrrlfe> ${post.excerpt} </p> <div class="flex justify-between items-center text-sm text-theme-text opacity-70 mb-4" data-astro-cid-khyrrlfe> <time${addAttribute(post.date, "datetime")} data-astro-cid-khyrrlfe> ${formatPostDate(post.date)} </time> </div> <a${addAttribute(getPostUrl(post.id), "href")} class="inline-block text-theme-accent font-semibold hover:text-theme-accent-alt transition-colors" data-astro-cid-khyrrlfe>
Czytaj więcej →
</a> </div> </article>`)} </div> <div class="text-center mt-12" data-astro-cid-khyrrlfe> <a href="/blog" class="inline-block bg-theme-accent/10 border border-theme-accent text-theme-accent px-8 py-3 rounded-full font-semibold hover:bg-theme-accent hover:text-white transition-all duration-300 hover-glow" data-astro-cid-khyrrlfe>
Zobacz wszystkie artykuły
</a> </div> </div> </section> `;
}, "U:/WWW_MYbonzoai_blog/src/components/features/BlogSection.astro", void 0);

const $$Astro$2 = createAstro("https://www.mybonzoaiblog.com");
const $$FeaturesSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$FeaturesSection;
  const { title, description, cards, className = "" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section${addAttribute([
    "mx-0 w-full flex flex-row flex-wrap-reverse justify-center gap-2 mt-4 mb-4 lg:mt-0 lg:justify-between lg:flex-nowrap lg:p-2 build-in",
    className
  ], "class:list")}> ${cards.map((card) => renderTemplate`${renderComponent($$result, "Card", $$Card, { "title": card.title, "description": card.description, "shadowSize": card.shadowSize, "iconName": card.iconName })}`)} </section> ${title && description && renderTemplate`<section class="flex flex-col items-center justify-center mt-2 mb-8 fade-in relative z-10"> ${title && renderTemplate`<h2 class="text-3xl md:text-4xl font-graffiti text-theme-accent mb-3">${title}</h2>`} ${description && renderTemplate`<p class="text-xl max-w-6xl leading-relaxed text-center md:max-w-screen-lg lg:text-2xl lg:leading-relaxed text-white/80"> ${description} </p>`} </section>`}`;
}, "U:/WWW_MYbonzoai_blog/src/components/features/FeaturesSection.astro", void 0);

const $$Astro$1 = createAstro("https://www.mybonzoaiblog.com");
const $$HeroSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$HeroSection;
  const { videoUrl, videoPoster, title, sections } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="w-full py-12 bg-theme-bg/5 backdrop-blur-sm"> <div class="container mx-auto px-4"> <div class="flex flex-col lg:flex-row items-center justify-start lg:justify-between gap-8"> <!-- Video Section - Left Side --> <div class="w-full lg:w-2/5 pl-0"> <div class="w-full h-full max-w-[420px] aspect-[9/16] flex items-center justify-center border border-gray-700 bg-neutral-900 mx-auto lg:mx-0"> <video id="mainVideo" class="w-full h-full object-cover bg-gray-900" controls${addAttribute(videoPoster, "poster")}> <source${addAttribute(videoUrl, "src")} type="video/mp4">
Twoja przeglądarka nie obsługuje video HTML5.
</video> </div> <p class="mt-6 text-lg text-theme-text opacity-80 text-center lg:text-left"> ${title} </p> </div> <!-- Navigation Buttons - Right Side --> <div class="w-full lg:w-3/5 flex flex-col gap-6"> <h3 class="text-2xl font-semibold text-theme-text mb-4 text-center lg:text-left">
Odkryj Nasze Sekcje
</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> ${sections.map((section) => renderTemplate`<a${addAttribute(section.href, "href")} class="w-full px-7 py-5 text-base font-medium border border-theme-accent bg-transparent text-theme-text transition-colors hover:border-theme-accent hover:bg-theme-accent hover:text-theme-text-secondary focus:outline-none active:border-theme-accent rounded-none tracking-wide text-center"${addAttribute(section.description, "title")}> ${section.label} </a>`)} </div> <div class="mt-8 text-center lg:text-left"> <a href="/pro" class="inline-block bg-theme-accent text-white px-6 py-3 rounded-none font-semibold hover:opacity-90 transition-opacity border border-gray-500">
Sprawdź MyBonzo Pro →
</a> </div> </div> </div> </div> </section>`;
}, "U:/WWW_MYbonzoai_blog/src/components/features/HeroSection.astro", void 0);

const MAIN_FEATURE_CARDS = [
  {
    title: "AI Tools",
    description: "Odkryj najnowsze narzędzia sztucznej inteligencji. Od generatorów treści po zaawansowane systemy analityczne - wszystko w jednym miejscu.",
    shadowSize: "lg",
    iconName: "ri:robot-line"
  },
  {
    title: "Poradniki",
    description: "Praktyczne przewodniki krok po kroku. Naucz się wykorzystywać AI w codziennym życiu i biznesie z naszymi szczegółowymi instrukcjami.",
    shadowSize: "lg",
    iconName: "ri:book-open-line"
  },
  {
    title: "Eksperymenty",
    description: "Laboratorium projektów AI dla klientów. Prototypy, testy i innowacyjne rozwiązania sztucznej inteligencji.",
    shadowSize: "lg",
    iconName: "ri:flask-line"
  }
];
const SPEED_FEATURE_CARDS = [
  {
    title: "Szybko",
    description: "Natychmiastowy dostęp do najnowszych informacji o AI. Nasze artykuły i narzędzia są aktualizowane w czasie rzeczywistym.",
    shadowSize: "lg",
    iconName: "ri:rocket-2-line"
  },
  {
    title: "Praktycznie",
    description: "Nie tylko teoria - konkretne rozwiązania które możesz zastosować już dziś. Od domowych projektów po zaawansowane systemy biznesowe.",
    shadowSize: "lg",
    iconName: "ri:code-s-slash-line"
  },
  {
    title: "Bezpłatnie",
    description: "Cała wiedza dostępna za darmo. Wierzymy że AI powinno być dostępne dla wszystkich, nie tylko dla wielkich korporacji.",
    shadowSize: "lg",
    iconName: "ri:open-source-line"
  }
];
const HOMEPAGE_METADATA = {
  title: "MyBonzo AI Blog - Sztuczna Inteligencja dla Wszystkich",
  description: "MyBonzo AI Blog - Twoje centrum wiedzy o sztucznej inteligencji. Odkryj najnowsze narzędzia AI, przeczytaj przewodniki i eksperymentuj z technologiami przyszłości. Od podstaw do zaawansowanych zastosowań biznesowych.",
  heading: "MyBonzo AI Blog - Przyszłość w Twoich Rękach",
  videoUrl: "https://pub-25059caf15274ebd844548094bfb4dc1.r2.dev/DD1.mp4",
  videoPoster: "https://pub-25059caf15274ebd844548094bfb4dc1.r2.dev/alk4.png"
};

const NAVIGATION_SECTIONS = [
  {
    href: "/blog",
    label: "📰 Blog",
    description: "Artykuły i wpisy o AI i technologii"
  },
  {
    href: "/BROWSERY",
    label: "Browsery",
    description: "Porównanie i recenzje przeglądarek internetowych"
  },
  {
    href: "/STRONY_INTERNETOWE",
    label: "Strony Internetowe",
    description: "Tworzenie i optymalizacja stron www"
  },
  {
    href: "/NARZEDZIA_AI",
    label: "Narzędzia AI",
    description: "Praktyczne narzędzia sztucznej inteligencji"
  },
  {
    href: "/WIADOMOSCI_AI",
    label: "Wiadomości AI",
    description: "Najnowsze informacje ze świata AI"
  },
  {
    href: "/HAPPY_NEWS",
    label: "Happy News",
    description: "Pozytywne wiadomości z technologii"
  },
  {
    href: "/TOTAL_COULTURE",
    label: "Total Culture",
    description: "Kultura i technologia razem"
  },
  {
    href: "/poradniki",
    label: "📚 Poradniki",
    description: "Praktyczne przewodniki i tutoriale"
  },
  {
    href: "/system/ai-chat",
    label: "💬 AI Chat",
    description: "Rozmawiaj z asystentem AI MyBonzo"
  },
  {
    href: "/GENERATOR_GRAFIKI",
    label: "🎨 Generator Grafiki",
    description: "Twórz grafiki za pomocą AI"
  },
  {
    href: "/eksperymenty",
    label: "🧪 Eksperymenty",
    description: "Laboratorium projektów AI i zaawansowane testy"
  },
  {
    href: "/o-nas",
    label: "ℹ️ O Nas",
    description: "Poznaj zespół MyBonzo AI"
  }
];

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const blogPosts = await getHomepageBlogPosts();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": HOMEPAGE_METADATA.title, "description": HOMEPAGE_METADATA.description, "class": "theme-ultra" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", "  ", "  ", '<section class="w-full py-2 bg-gradient-to-b from-theme-primary/5 to-transparent"> <div class="container mx-auto px-4"> <div class="max-w-6xl mx-auto"> <div class="text-center mb-3"> <h2 class="text-2xl lg:text-3xl font-bold text-theme-text mb-2">\n\u{1F680} Najnowsze Projekty & Osi\u0105gni\u0119cia\n</h2> <p class="text-base text-theme-text/80 max-w-3xl mx-auto">\nOdkryj nasze najnowsze projekty AI - od optymalizacji crawler\xF3w po generowanie obraz\xF3w\n</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <!-- AI Crawler Optimization --> ', " <!-- PUMO RAG Vector Search --> ", " <!-- AI Image Generator --> ", " <!-- Wrangler 4.59.2 Update --> ", ' </div> <!-- Stats Grid --> <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3"> <div class="text-center p-3 bg-theme-accent/10 border border-theme-accent/30"> <div class="text-xl font-bold text-theme-accent mb-1">18,111</div> <div class="text-xs text-theme-text/70">Products Indexed</div> </div> <div class="text-center p-3 bg-green-500/10 border border-green-500/30"> <div class="text-xl font-bold text-green-400 mb-1">6</div> <div class="text-xs text-green-300/70">AI Bots Supported</div> </div> <div class="text-center p-3 bg-purple-500/10 border border-purple-500/30"> <div class="text-xl font-bold text-purple-400 mb-1">FREE</div> <div class="text-xs text-purple-300/70">Image Generation</div> </div> <div class="text-center p-3 bg-blue-500/10 border border-blue-500/30"> <div class="text-xl font-bold text-blue-400 mb-1">', '100ms</div> <div class="text-xs text-blue-300/70">API Response</div> </div> </div> </div> </div> </section>  <section class="w-full py-2 bg-gradient-to-b from-purple-500/5 to-blue-500/5"> <div class="container mx-auto px-4"> <div class="max-w-5xl mx-auto"> <div class="text-center mb-2"> <h2 class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">\n\u{1F3A8} AI Image Generator: FLUX & Stable Diffusion\n</h2> <p class="text-base text-theme-text/80 max-w-3xl mx-auto">\nGenerowanie obraz\xF3w z tekstu w czasie rzeczywistym. Najnowsze modele FLUX Schnell, FLUX\n            Pro i SDXL - od $0.003 za obraz, wyniki w ', '60 sekund.\n</p> </div> <!-- Main Feature Grid --> <div class="grid md:grid-cols-2 gap-4 mb-4"> <!-- Image Preview --> <div class="relative group"> <div class="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div> <div class="relative glass border border-purple-500/30 rounded-xl overflow-hidden hover-glow"> <img src="/generated/ai-search.png" alt="AI-generated semantic search visualization - Cloudflare Workers AI" class="w-full h-auto"> <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent p-4"> <p class="text-sm text-purple-300">\nWygenerowane przez Cloudflare Workers AI (SDXL) - FREE!\n</p> </div> </div> </div> <!-- Features & Tech Stack --> <div class="space-y-4"> <div class="glass border border-purple-500/20 p-5 rounded-xl"> <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2"> <span class="text-xl">\u26A1</span>\nDost\u0119pne Modele\n</h3> <div class="space-y-2"> <div class="flex justify-between items-center p-2 bg-green-500/10 rounded border border-green-500/20"> <span class="font-semibold text-green-300">SDXL (Cloudflare)</span> <span class="text-sm text-green-400 font-bold">FREE!</span> </div> <div class="flex justify-between items-center p-2 bg-purple-500/10 rounded"> <span class="font-semibold text-purple-300">FLUX Schnell</span> <span class="text-sm text-gray-400">$0.003/obraz</span> </div> <div class="flex justify-between items-center p-2 bg-blue-500/10 rounded"> <span class="font-semibold text-blue-300">FLUX Pro</span> <span class="text-sm text-gray-400">$0.055/obraz</span> </div> </div> </div> <div class="glass border border-blue-500/20 p-5 rounded-xl"> <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2"> <span class="text-xl">\u{1F527}</span>\nTech Stack\n</h3> <div class="grid grid-cols-2 gap-3"> <div class="text-center p-2 bg-orange-500/10 border border-orange-500/20 rounded"> <div class="text-lg mb-1">\u2601\uFE0F</div> <div class="text-xs text-orange-300 font-semibold">Workers AI</div> </div> <div class="text-center p-2 bg-amber-500/10 border border-amber-500/20 rounded"> <div class="text-lg mb-1">\u26A1</div> <div class="text-xs text-amber-300 font-semibold">Cloudflare Edge</div> </div> <div class="text-center p-2 bg-purple-500/10 border border-purple-500/20 rounded"> <div class="text-lg mb-1">\u{1F3AF}</div> <div class="text-xs text-purple-300 font-semibold">Stable Diffusion</div> </div> <div class="text-center p-2 bg-blue-500/10 border border-blue-500/20 rounded"> <div class="text-lg mb-1">\u{1F193}</div> <div class="text-xs text-blue-300 font-semibold">10k free/day</div> </div> </div> </div> </div> </div> <!-- Stats Bar --> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 glass border border-purple-500/20 p-6 rounded-xl mt-6"> <div class="text-center"> <div class="text-xl font-bold text-green-400">FREE</div> <div class="text-sm text-gray-400">Cloudflare AI</div> </div> <div class="text-center"> <div class="text-xl font-bold text-blue-400">', '30s</div> <div class="text-sm text-gray-400">Generowanie</div> </div> <div class="text-center"> <div class="text-xl font-bold text-indigo-400">1024\xB2</div> <div class="text-sm text-gray-400">Rozdzielczo\u015B\u0107</div> </div> <div class="text-center"> <div class="text-xl font-bold text-purple-400">10k/day</div> <div class="text-sm text-gray-400">Limit FREE</div> </div> </div> <!-- CTA --> <div class="mt-4 text-center"> <a href="https://cf-ai-image-gen.stolarnia-ams.workers.dev/api/generate" class="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50"> <span>\u{1F3A8}</span> <span>Wypr\xF3buj Generator (FREE!)</span> <span>\u2192</span> </a> <p class="mt-4 text-sm text-gray-400">\nPowered by Cloudflare Workers AI -\n<a href="https://developers.cloudflare.com/workers-ai/" target="_blank" class="text-green-400 hover:text-green-300 underline">\nWorkers AI Docs\n</a> </p> </div> </div> </div> </section>  <section class="w-full py-2 bg-gradient-to-b from-transparent to-theme-primary/5"> <div class="container mx-auto px-4"> <div class="max-w-6xl mx-auto"> <h2 class="text-2xl lg:text-3xl font-bold text-theme-text text-center mb-3">\n\u{1F310} Nasze Projekty & AI 2025 Highlights\n</h2> <!-- Partner Links --> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"> <a href="https://www.mybonzo.com" target="_blank" rel="noopener noreferrer" class="group relative overflow-hidden glass border border-theme-accent/20 p-6 rounded-xl hover:border-theme-accent transition-all duration-300 hover-glow"> <div class="flex items-center gap-3 mb-2"> <span class="text-3xl">\u{1F3E2}</span> <h3 class="text-xl font-bold text-theme-text group-hover:text-theme-accent transition-colors">\nMyBonzo.com\n</h3> </div> <p class="text-theme-text/70 leading-relaxed">\nPlatforma AI dla biznesu. Rozwi\u0105zania dla e-commerce, automatyzacja proces\xF3w i\n              inteligentne asystenty.\n</p> <div class="absolute bottom-3 right-3 text-theme-accent text-2xl opacity-0 group-hover:opacity-100 transition-opacity">\n\u2197\n</div> </a> <a href="https://www.zenbrowsers.org" target="_blank" rel="noopener noreferrer" class="group relative overflow-hidden glass border border-purple-500/20 p-6 rounded-xl hover:border-purple-400 transition-all duration-300 hover-glow"> <div class="flex items-center gap-3 mb-2"> <span class="text-3xl">\u{1F338}</span> <h3 class="text-xl font-bold text-theme-text group-hover:text-purple-400 transition-colors">\nZen Browsers\n</h3> </div> <p class="text-theme-text/70 leading-relaxed">\nNowoczesne przegl\u0105darki z wbudowan\u0105 AI. Prywatno\u015B\u0107, wydajno\u015B\u0107 i inteligentne funkcje w\n              jednym.\n</p> <div class="absolute bottom-3 right-3 text-purple-400 text-2xl opacity-0 group-hover:opacity-100 transition-opacity">\n\u2197\n</div> </a> </div> <!-- AI 2025 Insights --> <div class="space-y-4"> <h3 class="text-xl font-bold text-theme-accent text-center mb-4">\n\u26A1 Prze\u0142omowe Innowacje AI w 2025\n</h3> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> <!-- Reasoning Models --> <div class="bg-theme-bg/5 border border-theme-accent/30 p-4 hover:border-theme-accent/60 transition-all"> <div class="text-2xl mb-2">\u{1F9E0}</div> <h4 class="text-lg font-semibold text-theme-text mb-2">Modele z Rozumowaniem</h4> <p class="text-sm text-theme-text/70 leading-relaxed">\nOpenAI o1/o3 i Claude 3.7 wprowadzaj\u0105 "czas my\u015Blenia" - AI teraz deliberuje przed\n                odpowiedzi\u0105, osi\u0105gaj\u0105c 54% accuracy na ARC-AGI-2 (vs 0-2% rok temu).\n</p> </div> <!-- Multimodal AI --> <div class="bg-theme-bg/5 border border-theme-accent/30 p-4 hover:border-theme-accent/60 transition-all"> <div class="text-2xl mb-2">\u{1F3A8}</div> <h4 class="text-lg font-semibold text-theme-text mb-2">Multimodal AI</h4> <p class="text-sm text-theme-text/70 leading-relaxed">\nLlama 4 Scout z 10M token\xF3w kontekstu, Gemini 3 Flash z sub-millisecond latency. AI\n                teraz natywnie \u0142\u0105czy tekst, obraz, video i audio.\n</p> </div> <!-- AI Agents --> <div class="bg-theme-bg/5 border border-theme-accent/30 p-4 hover:border-theme-accent/60 transition-all"> <div class="text-2xl mb-2">\u{1F916}</div> <h4 class="text-lg font-semibold text-theme-text mb-2">Autonomiczne Agenty</h4> <p class="text-sm text-theme-text/70 leading-relaxed">\n62% firm eksperymentuje z AI agents, 23% skaluje production. Multi-agent\n                orchestration staje si\u0119 standardem enterprise.\n</p> </div> <!-- Healthcare AI --> <div class="bg-theme-bg/5 border border-theme-accent/30 p-4 hover:border-theme-accent/60 transition-all"> <div class="text-2xl mb-2">\u{1F3E5}</div> <h4 class="text-lg font-semibold text-theme-text mb-2">Medycyna & AI</h4> <p class="text-sm text-theme-text/70 leading-relaxed">\nPopEVE diagnozuje choroby genetyczne w godziny (vs lata). AI-auscultation wykrywa\n                niewydolno\u015B\u0107 serca 2-3x skuteczniej.\n</p> </div> <!-- Video Generation --> <div class="bg-theme-bg/5 border border-theme-accent/30 p-4 hover:border-theme-accent/60 transition-all"> <div class="text-2xl mb-2">\u{1F3AC}</div> <h4 class="text-lg font-semibold text-theme-text mb-2">AI Video Production</h4> <p class="text-sm text-theme-text/70 leading-relaxed">\nSora 2, Kling 2.5, Veo 3.1 - produkcyjna jako\u015B\u0107 4K video z audio. 3-minutowe klipy\n                za $8-30/miesi\u0105c.\n</p> </div> <!-- Economic Impact --> <div class="bg-theme-bg/5 border border-theme-accent/30 p-4 hover:border-theme-accent/60 transition-all"> <div class="text-2xl mb-2">\u{1F4B0}</div> <h4 class="text-lg font-semibold text-theme-text mb-2">Wp\u0142yw Ekonomiczny</h4> <p class="text-sm text-theme-text/70 leading-relaxed">\nAI zwi\u0119kszy GDP o 1.5% do 2035, 3.7% do 2075. $2T globalnych inwestycji w AI w 2026.\n                25-40% redukcja koszt\xF3w pracy.\n</p> </div> </div> <!-- CTA --> <div class="text-center mt-4"> <a href="/blog/" class="inline-block px-8 py-4 bg-theme-accent text-white font-semibold hover:opacity-90 transition-opacity border border-gray-500">\n\u{1F4DA} Czytaj Wi\u0119cej na Blogu\n</a> </div> </div> </div> </div> </section>  ', '  <section class="flex flex-col items-center justify-center mt-2 mb-12 fade-in"> <h2 class="graffiti-footer scale-75 origin-center">AI DLA WSZYSTKICH</h2> <p class="text-xl max-w-6xl leading-relaxed text-center md:max-w-screen-lg lg:text-2xl lg:leading-relaxed">\nSztuczna inteligencja nie musi by\u0107 skomplikowana. MyBonzo AI Blog \u0142\u0105czy zaawansowane\n      technologie z prostot\u0105 u\u017Cytkowania, bo przysz\u0142o\u015B\u0107 powinna by\u0107 dost\u0119pna dla ka\u017Cdego,\n      niezale\u017Cnie od poziomu technicznego.\n</p> </section>  ', "  ", '  <section class="flex flex-col items-center justify-center mt-4 mb-0 fade-in"> <h2 class="bg-theme-accent text-theme-text-secondary p-3 text-center mb-2 lg:w-auto">\nStworzone dla Ciebie\n</h2> <p class="text-xl max-w-6xl leading-relaxed text-center md:max-w-screen-lg lg:text-xl lg:leading-relaxed tracking-wide mt-2 mb-12">\nNiezale\u017Cnie od tego czy jeste\u015B pocz\u0105tkuj\u0105cy czy ekspertem, MyBonzo AI Blog dostarcza narz\u0119dzia\n      i wiedz\u0119 na odpowiednim poziomie. Rozwijaj swoje umiej\u0119tno\u015Bci AI w tempie kt\xF3re Ci odpowiada.\n</p> <a href="/blog" class="no-underline group group-hover:cursor-pointer"> <div class="text-xl tracking-wide bg-theme-bg text-theme-text text-center shadow-sm shadow-theme-accent border-2 mb-4 group-hover:bg-theme-bg-secondary group-hover:text-theme-accent group-hover:shadow-none transition-all duration-300 ease-in-out lg:text-2xl lg:tracking-wider"> <div class="mt-0"> ', ' <p class="p-4 group-hover:text-theme-accent">Rozpocznij Czytanie</p> </div> </div> </a> </section>  <section class="flex flex-col items-center justify-center mt-6"> <div class="w-full mb-8 flex justify-center"> <img src="/AI_News_ZenBrowsers.png" alt="Let AI empower your work - Modern AI tools transforming productivity and creativity in 2026" class="shadow-md shadow-theme-accent max-w-4xl rounded-lg" loading="lazy" width="1200" height="630"> </div> </section>  <section style="margin-top:0.5em; text-align:center; padding: 0.5rem 0;"> <div class="container mx-auto px-4"> <p class="text-lg"> <strong>', "</strong> <a", ' style="color:#2a6de9; text-decoration:underline; font-weight: 600;"> ', ' </a> </p> </div> </section>  <script type="application/ld+json">', "<\/script> "])), renderComponent($$result2, "PageHeader", $$PageHeader, { "heading": HOMEPAGE_METADATA.heading, "description": HOMEPAGE_METADATA.description, "image": coverImage, "imageAlt": "Futurystyczny rdze\u0144 AI - MyBonzo", "animate": true, "class": "float" }), renderComponent($$result2, "HeroSection", $$HeroSection, { "videoUrl": HOMEPAGE_METADATA.videoUrl, "videoPoster": HOMEPAGE_METADATA.videoPoster, "title": "Witaj w MyBonzo AI Blog! Poznaj Twojego asystenta AI", "sections": NAVIGATION_SECTIONS }), maybeRenderHead(), renderComponent($$result2, "Card", $$Card, { "title": "AI Crawler Optimization", "description": "Blog repositioning + llms.txt z PURPOSE section. Perplexity, ChatGPT i Claude maj\u0105 teraz dost\u0119p do 18,111 produkt\xF3w z meblepumo.pl przez RAG API.", "href": "/.workspace_meta/notes/2026-01-19-ai-crawler-optimization.md", "class": "h-full border-green-500/20 hover:border-green-400" }, { "default": async ($$result3) => renderTemplate` <div class="flex flex-wrap gap-2"> <span class="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">llms.txt</span> <span class="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">robots.txt</span> <span class="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">Schema.org</span> <span class="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">19.01.2026</span> </div> ` }), renderComponent($$result2, "Card", $$Card, { "title": "PUMO RAG Vector Search", "description": "768-wymiarowe embeddingi (BGE-base-en-v1.5), Cloudflare Vectorize, 18,111 produkt\xF3w zaindeksowanych. Semantic search <100ms.", "href": "/pumo-guide/", "class": "h-full border-blue-500/20 hover:border-blue-400" }, { "default": async ($$result3) => renderTemplate` <div class="flex flex-wrap gap-2"> <span class="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">Vectorize</span> <span class="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">Workers AI</span> <span class="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">Edge Computing</span> <span class="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">v2.0</span> </div> ` }), renderComponent($$result2, "Card", $$Card, { "title": "AI Image Generator", "description": "FREE generowanie obraz\xF3w przez Cloudflare Workers AI (SDXL). 10k neurons/day, wyniki w <30s, 1024x1024 PNG.", "href": "#ai-image-generator", "class": "h-full border-purple-500/20 hover:border-purple-400" }, { "default": async ($$result3) => renderTemplate` <div class="flex flex-wrap gap-2"> <span class="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">Stable Diffusion</span> <span class="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">FREE</span> <span class="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">10k/day</span> <span class="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">SDXL</span> </div> ` }), renderComponent($$result2, "Card", $$Card, { "title": "Wrangler 4.59.2", "description": "Aktualizacja Cloudflare Wrangler CLI (3.114.17 \u2192 4.59.2). Wszystkie workers wdro\u017Cone i dzia\u0142aj\u0105 bez b\u0142\u0119d\xF3w.", "class": "h-full border-orange-500/20" }, { "default": async ($$result3) => renderTemplate` <div class="flex flex-wrap gap-2"> <span class="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded">Workers</span> <span class="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded">Deployment</span> <span class="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded">Updated</span> <span class="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded">✅ OK</span> </div> ` }), "<", "<", "<", renderComponent($$result2, "FeaturesSection", $$FeaturesSection, { "cards": MAIN_FEATURE_CARDS, "className": "mx-0 w-full flex flex-row flex-wrap-reverse justify-center gap-2 mt-4 mb-4 lg:mt-0 lg:justify-between lg:flex-nowrap lg:p-2 build-in" }), renderComponent($$result2, "FeaturesSection", $$FeaturesSection, { "cards": SPEED_FEATURE_CARDS, "className": "mx-0 w-full flex flex-row flex-wrap-reverse justify-center gap-2 mt-2 mb-4 lg:justify-between lg:flex-nowrap lg:p-2 build-in" }), renderComponent($$result2, "BlogSection", $$BlogSection, { "posts": blogPosts }), renderComponent($$result2, "Icon", $$Icon, { "name": "ri:article-line", "height": "150", "width": "300", "class": "mb-5" }), PRO_CONFIG.ctaText, addAttribute(PRO_CONFIG.ctaUrl, "href"), PRO_CONFIG.ctaLinkText, unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Meble Pumo RAG Vector Database",
    description: "768-dimensional vector database with 13,388 furniture products from Meble Pumo, powered by Cloudflare Vectorize and Workers AI for semantic search.",
    url: "https://mybonzoaiblog.pages.dev/pumo-guide",
    creator: {
      "@type": "Organization",
      name: "MyBonzo AI"
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: "https://pumo-rag.stolarnia-ams.workers.dev/api/search"
      }
    ],
    isAccessibleForFree: true,
    datePublished: "2026-01-18",
    keywords: [
      "furniture",
      "vectors",
      "embeddings",
      "RAG",
      "AI",
      "Meble Pumo",
      "ecommerce",
      "Cloudflare",
      "Vectorize"
    ]
  }))) })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
