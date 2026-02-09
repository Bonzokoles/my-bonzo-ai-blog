# 🚀 MyBonzo AI Blog

[![Deploy Status](https://img.shields.io/badge/deploy-automated-success)](https://github.com/Bonzokoles/my-bonzo-ai-blog/actions)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange)](https://mybonzoaiblog.pages.dev)
[![Astro](https://img.shields.io/badge/Astro-5.15.1-ff5d01?logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Last Updated](https://img.shields.io/badge/updated-Feb%202026-blue)]()

> Modern AI-powered blog built with Astro 5, Cloudflare Pages, and cutting-edge AI technologies.

## 🌐 Live Demo

**Production:** [https://www.mybonzoaiblog.com](https://www.mybonzoaiblog.com)  
**Preview:** [https://mybonzoaiblog.pages.dev](https://mybonzoaiblog.pages.dev)

---

## ✨ Features

### 🎨 Design & Theming
- **15 Color Themes** - Dynamic theme switching with persistent preferences
- **Responsive Design** - Mobile-first, fully responsive layout
- **Dark/Light Mode** - Automatic theme detection and manual override
- **Tailwind CSS** - Modern utility-first styling

### 🤖 AI Integration
- **AI Chat** - Real-time chat with streaming responses powered by Cloudflare Workers AI
- **Image Generation** - AI-powered image creation using Flux models
- **Voice Synthesis** - Text-to-speech capabilities
- **MCP Tools** - Model Context Protocol integration for advanced AI interactions
- **AI Gateway** - Cloudflare AI Gateway for request optimization

### 📝 Content Management
- **MDX Support** - Enhanced markdown with JSX components
- **Blog System** - Full-featured blog with categories and tags
- **RSS Feed** - Automatic feed generation
- **Sitemap** - SEO-optimized sitemap generation
- **Syntax Highlighting** - Code blocks with Shiki

### ⚡ Performance & Deployment
- **Server-Side Rendering (SSR)** - Fast initial page loads
- **Cloudflare Pages** - Global edge deployment
- **Automatic Deployment** - GitHub Actions CI/CD
- **Edge Functions** - Cloudflare Workers for API endpoints
- **KV Storage** - Session and cache management
- **D1 Database** - RAG database and product catalog
- **R2 Storage** - Media storage bucket
- **Vectorize** - Vector embeddings for semantic search

### 🔧 Developer Features
- **TypeScript** - Type-safe codebase
- **Feature Control System** - Feature flags, permissions, and rate limiting
- **Modular Architecture** - Clean separation of concerns
- **Hot Module Replacement** - Fast development with Vite
- **Health Monitoring** - Automated health checks and keep-alive

---

## 🛠️ Tech Stack

### Core Framework
- **[Astro 5.15.1](https://astro.build)** - Static Site Generator with SSR
- **[Vue 3.5](https://vuejs.org)** - Interactive components
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Styling
- **[Tailwind CSS 3.4](https://tailwindcss.com)** - Utility-first CSS
- **[@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)** - Beautiful prose styling

### Cloudflare Platform
- **[Cloudflare Pages](https://pages.cloudflare.com)** - Hosting and deployment
- **[Workers AI](https://ai.cloudflare.com)** - AI model inference
- **[D1 Database](https://developers.cloudflare.com/d1)** - Serverless SQL
- **[KV Storage](https://developers.cloudflare.com/kv)** - Edge key-value store
- **[R2 Storage](https://developers.cloudflare.com/r2)** - Object storage
- **[Vectorize](https://developers.cloudflare.com/vectorize)** - Vector database
- **[AI Gateway](https://developers.cloudflare.com/ai-gateway)** - AI request optimization

### Content & SEO
- **[MDX](https://mdxjs.com)** - Markdown with JSX
- **[Astro Sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** - XML sitemap generation
- **[Astro RSS](https://docs.astro.build/en/guides/rss/)** - RSS feed generation
- **[astro-robots-txt](https://github.com/alextim/astro-lib/tree/main/packages/astro-robots-txt)** - robots.txt generator

### Build & Development
- **[Vite](https://vitejs.dev)** - Build tool and dev server
- **[Wrangler](https://developers.cloudflare.com/workers/wrangler/)** - Cloudflare development CLI
- **[Prettier](https://prettier.io)** - Code formatting

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 8.x or higher
- **Cloudflare Account** (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/Bonzokoles/my-bonzo-ai-blog.git
cd my-bonzo-ai-blog

# Install dependencies
npm install
```

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:
```env
# Cloudflare Account ID (required for deployment)
CLOUDFLARE_ACCOUNT_ID=your-account-id

# AI API Keys (optional for local development)
OPENAI_API_KEY=your-openai-key
DEEPSEEK_API_KEY=your-deepseek-key
```

### Development

```bash
# Start development server with Wrangler bindings
npm run dev

# The site will be available at http://localhost:4321
```

The dev server includes:
- Hot Module Replacement (HMR)
- Cloudflare Workers AI bindings
- KV, D1, R2, and Vectorize emulation

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

#### Automatic Deployment (Recommended)
Push to the `main` branch triggers automatic deployment via GitHub Actions:

```bash
git push origin main
```

#### Manual Deployment
```bash
# Build and deploy to Cloudflare Pages
npm run deploy

# Or deploy pre-built dist folder
npm run deploy:pages
```

---

## 📁 Project Structure

```
my-bonzo-ai-blog/
├── .github/
│   └── workflows/          # GitHub Actions (deploy, monitoring, keep-alive)
├── docs/                   # Documentation files
│   ├── WORKFLOW_ARCHITECTURE/
│   └── ZLOTE_ZASADY_ROZWOJU.md
├── public/                 # Static assets
│   ├── apple-touch-icon.png
│   ├── og-image.webp
│   └── ...
├── scripts/                # Utility scripts
│   ├── prefetch.js
│   ├── test-ai-chat.js
│   └── ...
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Astro/Vue components
│   │   ├── Astro/
│   │   └── Vue/
│   ├── config/            # Configuration files
│   │   └── features.ts    # Feature flags
│   ├── content/           # Blog posts (MDX)
│   ├── layouts/           # Page layouts
│   ├── middleware/        # Feature control middleware
│   ├── pages/             # Routes and pages
│   │   ├── api/          # API endpoints
│   │   │   ├── ai/       # AI chat, image gen
│   │   │   └── features/ # Feature control
│   │   └── eksperymenty/ # Experimental projects
│   ├── styles/            # Global styles
│   ├── utils/             # Utility functions
│   ├── workers/           # Cloudflare Workers
│   └── alkaline.config.ts # Main site configuration
├── workers/               # Standalone Cloudflare Workers
│   ├── cron/             # Scheduled tasks
│   └── queue/            # Queue workers
├── astro.config.mjs       # Astro configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.mjs    # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── wrangler.toml          # Cloudflare bindings (AI, KV, D1, R2)
└── README.md              # This file
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Wrangler bindings |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build and deploy to Cloudflare Pages |
| `npm run deploy:pages` | Deploy pre-built dist folder |
| `npm run health` | Check site health status |
| `npm run prefetch` | Prefetch resources for faster loading |

---

## 🔧 Configuration

### Site Configuration
Main site settings are in `src/alkaline.config.ts`:
- Site metadata (title, description, URL)
- Navigation structure
- Author information
- Social links
- Blog settings

### Feature Flags
Feature control and permissions in `src/config/features.ts`:
- Feature status (enabled, beta, disabled)
- User permissions (public, user, admin)
- Rate limiting rules

### Cloudflare Bindings
Cloudflare resources in `wrangler.toml`:
- AI model bindings
- KV namespaces
- D1 databases
- R2 buckets
- Vectorize indexes

---

## 🚀 Deployment Status

### GitHub Actions Workflows

| Workflow | Purpose | Schedule |
|----------|---------|----------|
| **Deploy** | Automatic deployment on push to main | On push |
| **Keep-Alive** | Prevent cold starts | Every 10 minutes |
| **Advanced Monitoring** | Health checks and alerts | Hourly |
| **Auto-Index** | Update vector search index | On schedule |

### Cloudflare Pages

- **Project:** mybonzoaiblog
- **Production Branch:** main
- **Build Command:** `npm run build`
- **Build Output:** `dist/`
- **Node Version:** 18

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** in `src/pages/eksperymenty/` for experimental features
4. **Test your changes** (`npm run dev`)
5. **Build to verify** (`npm run build`)
6. **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. **Push to the branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Development Guidelines

- **Never edit directly in `mybonzoAIblog`** during feature development
- Use `src/pages/eksperymenty/` for isolated experimental projects
- Follow the existing code style (Prettier formatting)
- Add TypeScript types for new features
- Update documentation for significant changes
- Test with `npm run build` before submitting PR

See [docs/ZLOTE_ZASADY_ROZWOJU.md](docs/ZLOTE_ZASADY_ROZWOJU.md) for detailed development workflow.

---

## 📚 Documentation

Detailed documentation has been organized in the `/docs` directory:

- **[Setup Guides](docs/setup/)** - Configuration and integration guides (AI Gateway, Cloudflare, HeyGen, Fonts, etc.)
- **[Features](docs/features/)** - Feature documentation and usage (AI Chat, Feature Control, Media Management)
- **[Deployment](docs/deployment/)** - CI/CD and deployment guides
- **[Development](docs/development/)** - Architecture and development guides
- **[Archive](docs/archive/)** - Historical documentation

Key documents:
- **[Golden Development Rules](docs/ZLOTE_ZASADY_ROZWOJU.md)** - Essential development workflow
- **[System Architecture](docs/WORKFLOW_ARCHITECTURE/)** - Complete architecture overview

---

## 🔒 Security

- **Never commit secrets** to the repository
- Use Cloudflare environment variables for API keys
- Set secrets with `wrangler secret put <KEY_NAME>`
- See security guidelines in documentation

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Redakcja MyBonzo**
- Email: JimBoZen@proton.me
- Website: [https://www.mybonzoaiblog.com](https://www.mybonzoaiblog.com)

---

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com)
- AI powered by [Cloudflare Workers AI](https://ai.cloudflare.com)
- Theme based on Alkaline template

---

**Made with ❤️ and AI**
