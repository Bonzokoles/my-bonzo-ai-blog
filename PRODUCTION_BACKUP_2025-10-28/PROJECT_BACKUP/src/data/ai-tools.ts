// AI Tools Database - extracted from ZENON Browser
// Curated list of free AI tools for 2025

export interface AITool {
  id: string;
  name: string;
  icon: string;
  url: string;
  description: string;
  category: string;
  featured?: boolean;
}

export const AI_TOOLS: AITool[] = [
  // Chat & Assistants
  { id: "chatgpt", name: "ChatGPT", icon: "🤖", url: "https://chat.openai.com", description: "AI assistant dla rozmów i zadań", category: "Czat i Asystenci", featured: true },
  { id: "claude", name: "Claude AI", icon: "🧠", url: "https://claude.ai", description: "Zaawansowany AI od Anthropic", category: "Czat i Asystenci", featured: true },
  { id: "gemini", name: "Google Gemini", icon: "✨", url: "https://gemini.google.com", description: "AI asystent od Google", category: "Czat i Asystenci", featured: true },
  { id: "copilot", name: "MS Copilot", icon: "🚀", url: "https://copilot.microsoft.com", description: "AI asystent Microsoft", category: "Czat i Asystenci", featured: true },
  { id: "perplexity", name: "Perplexity", icon: "🔍", url: "https://perplexity.ai", description: "AI wyszukiwarka z odpowiedziami", category: "Czat i Asystenci", featured: true },

  // Image Generation
  { id: "ideogram", name: "Ideogram", icon: "🎨", url: "https://ideogram.ai", description: "AI generator obrazów", category: "Generowanie Obrazów", featured: true },
  { id: "playground", name: "Playground AI", icon: "🎮", url: "https://playground.ai", description: "Kreatywne AI art", category: "Generowanie Obrazów", featured: true },
  { id: "craiyon", name: "Craiyon", icon: "🖍️", url: "https://www.craiyon.com", description: "Darmowy AI image generator", category: "Generowanie Obrazów" },
  { id: "lexica", name: "Lexica", icon: "🎭", url: "https://lexica.art", description: "Wyszukiwarka AI art + generator", category: "Generowanie Obrazów" },
  { id: "canva-ai", name: "Canva AI", icon: "🎭", url: "https://www.canva.com/ai-image-generator", description: "Generator obrazów Canva", category: "Generowanie Obrazów" },

  // Photo Editing
  { id: "remove-bg", name: "Remove.bg", icon: "✂️", url: "https://www.remove.bg", description: "Usuwanie tła ze zdjęć", category: "Edycja Zdjęć", featured: true },
  { id: "cleanup", name: "Cleanup Pictures", icon: "🧽", url: "https://cleanup.pictures", description: "Usuwanie obiektów ze zdjęć", category: "Edycja Zdjęć" },
  { id: "photoroom", name: "PhotoRoom", icon: "🕳️", url: "https://www.photoroom.com", description: "Profesjonalne zdjęcia produktów", category: "Edycja Zdjęć" },
  { id: "photor", name: "Photor", icon: "📸", url: "https://photor.io", description: "AI photo enhancer", category: "Edycja Zdjęć" },

  // Video & Animation
  { id: "runway", name: "Runway ML", icon: "🎬", url: "https://runway.ml", description: "AI video editing & generation", category: "Wideo", featured: true },
  { id: "synthesia", name: "Synthesia", icon: "🎥", url: "https://www.synthesia.io", description: "AI avatary video", category: "Wideo" },

  // Text & Writing
  { id: "jasper", name: "Jasper", icon: "✍️", url: "https://www.jasper.ai", description: "AI copywriting", category: "Tekst i Pisanie" },
  { id: "quillbot", name: "QuillBot", icon: "🦅", url: "https://quillbot.com", description: "Parafrazowanie i sprawdzanie gramatyki", category: "Tekst i Pisanie", featured: true },
  { id: "copy-ai", name: "Copy.ai", icon: "📝", url: "https://www.copy.ai", description: "AI content generator", category: "Tekst i Pisanie" },
  { id: "notion-ai", name: "Notion AI", icon: "🗒️", url: "https://www.notion.so/product/ai", description: "AI w Notion", category: "Tekst i Pisanie" },

  // Voice & Audio
  { id: "elevenlabs", name: "ElevenLabs", icon: "🎤", url: "https://elevenlabs.io", description: "Realistyczny głos AI", category: "Głos i Audio", featured: true },
  { id: "murf", name: "Murf AI", icon: "🔊", url: "https://murf.ai", description: "AI voice generator", category: "Głos i Audio" },
  { id: "otter", name: "Otter.ai", icon: "🦦", url: "https://www.otter.ai", description: "Transkrypcja spotkań", category: "Głos i Audio", featured: true },
  { id: "fireflies", name: "Fireflies", icon: "📣", url: "https://fireflies.ai", description: "Notatki ze spotkań", category: "Głos i Audio" },

  // Presentations
  { id: "tome", name: "Tome", icon: "📖", url: "https://tome.app", description: "AI prezentacje", category: "Prezentacje", featured: true },
  { id: "gamma", name: "Gamma", icon: "📊", url: "https://gamma.app", description: "Szybkie prezentacje AI", category: "Prezentacje" },
  { id: "beautiful-ai", name: "Beautiful.ai", icon: "📰", url: "https://beautiful.ai", description: "Piękne prezentacje AI", category: "Prezentacje" },

  // Research & Development
  { id: "huggingface", name: "HuggingFace", icon: "🤗", url: "https://huggingface.co", description: "ML modele i datasety", category: "Research", featured: true },
  { id: "deepai", name: "DeepAI", icon: "🧠", url: "https://deepai.org", description: "Różne narzędzia AI", category: "Research" },

  // Productivity
  { id: "mem", name: "Mem", icon: "🧠", url: "https://mem.ai", description: "AI personal assistant", category: "Produktywność" },
  { id: "summarize", name: "Summarize.tech", icon: "📊", url: "https://www.summarize.tech", description: "Streszczanie YouTube", category: "Produktywność" },
  { id: "rewind", name: "Rewind", icon: "⏪", url: "https://www.rewind.ai", description: "AI pamięć dla komputera", category: "Produktywność" },

  // Drawing & Design
  { id: "autodraw", name: "AutoDraw", icon: "✏️", url: "https://www.autodraw.com", description: "AI rysowanie", category: "Rysowanie" },
  { id: "scribble", name: "Scribble Diffusion", icon: "🖌️", url: "https://scribblediffusion.com", description: "Szkic → obraz AI", category: "Rysowanie" },
  { id: "pfp-maker", name: "PFP Maker", icon: "👤", url: "https://pfpmaker.com", description: "AI profile pictures", category: "Rysowanie" },

  // Hugging Face Spaces (Top picks)
  { id: "flux", name: "FLUX Image Gen", icon: "🎨", url: "https://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell", description: "Szybki generator obrazów", category: "HuggingFace Spaces", featured: true },
  { id: "stable-diffusion", name: "Stable Diffusion", icon: "🖼️", url: "https://huggingface.co/spaces/stabilityai/stable-diffusion", description: "Klasyczny SD", category: "HuggingFace Spaces" },
  { id: "whisper-webgpu", name: "Whisper WebGPU", icon: "🎤", url: "https://huggingface.co/spaces/Xenova/whisper-webgpu", description: "Speech-to-text w przeglądarce", category: "HuggingFace Spaces" },
  { id: "musicgen", name: "MusicGen", icon: "🎵", url: "https://huggingface.co/spaces/facebook/MusicGen", description: "AI muzyka", category: "HuggingFace Spaces" },
  { id: "chatbot-arena", name: "Chatbot Arena", icon: "🤼", url: "https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard", description: "Ranking chatbotów AI", category: "HuggingFace Spaces" },

  // Search Engines
  { id: "duckduckgo", name: "DuckDuckGo", icon: "🦆", url: "https://duckduckgo.com", description: "Prywatna wyszukiwarka", category: "Wyszukiwarki" },
  { id: "brave-search", name: "Brave Search", icon: "🦁", url: "https://search.brave.com", description: "Niezależna prywatna wyszukiwarka", category: "Wyszukiwarki" },
  { id: "you-com", name: "You.com", icon: "💬", url: "https://you.com", description: "AI wyszukiwarka", category: "Wyszukiwarki" },
];

export const CATEGORIES = [
  "Wszystkie",
  "Czat i Asystenci",
  "Generowanie Obrazów",
  "Edycja Zdjęć",
  "Wideo",
  "Tekst i Pisanie",
  "Głos i Audio",
  "Prezentacje",
  "Research",
  "Produktywność",
  "Rysowanie",
  "HuggingFace Spaces",
  "Wyszukiwarki",
];

export function getFeaturedTools(): AITool[] {
  return AI_TOOLS.filter(tool => tool.featured);
}

export function getToolsByCategory(category: string): AITool[] {
  if (category === "Wszystkie") return AI_TOOLS;
  return AI_TOOLS.filter(tool => tool.category === category);
}

export function getTop20Tools(): AITool[] {
  return AI_TOOLS.slice(0, 20);
}
