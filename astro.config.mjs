// Astro config, you likely won't need to change this file. But if you do -> https://docs.astro.build/en/reference/configuration-reference/
import { SITE } from "./src/alkaline.config";
// import robotsConfig from "./src/utils/robots-txt.config"; // DISABLED: using static public/robots.txt

import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
// import robotsTxt from "astro-robots-txt"; // DISABLED: using static public/robots.txt

import icon from "astro-icon";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  output: "server", // SSR mode but with selective prerendering
  adapter: cloudflare({
    // Konfiguracja sesji z KV
    sessionKVBindingName: "SESSION",
    mode: "directory",
  }),

  // Optymalizacje obrazów
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false, // Pozwala na większe obrazy
      },
    },
    // Dozwolone domeny dla zdalnych obrazów
    domains: ["images.unsplash.com", "cdn.example.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdnjs.cloudflare.com",
      },
    ],
  },

  // Optymalizacje budowy
  build: {
    inlineStylesheets: "auto", // Automatyczne wbudowywanie małych CSS (<4kb)
    assets: "_assets", // Niestandardowa nazwa katalogu assets
  },

  // Kompresja HTML domyślnie włączona w Astro 5.0+
  compressHTML: true,

  // Optymalizacje Markdown
  markdown: {
    shikiConfig: SITE.shikiConfig,
  },

  // Integracje z optymalizacjami
  integrations: [
    mdx({
      optimize: true, // Optymalizacja MDX dla szybszego renderowania
      ignoreElementNames: ["custom-component"], // Ignoruj custom komponenty
    }),
    tailwind(),
    sitemap({
      filter: (page) => !page.includes("/api/"),
      serialize: (item) => {
        // Ensure pumo-guide pages have high priority for AI crawlers
        if (item.url.includes("/pumo-guide/")) {
          item.changefreq = "weekly";
          item.priority = 0.9;
        }
        return item;
      },
    }) /* robotsTxt(robotsConfig) - DISABLED: using static public/robots.txt */,
    ,
    icon(),
    vue(),
  ],

  // Vite optymalizacje
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "src/styles/animations.css";`,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Lepsze chunking dla JS
          manualChunks: {
            vendor: ["astro/client"],
            components: ["@components/Astro/Card.astro"],
          },
        },
      },
      // Zwiększ limit dla inline assets
      assetsInlineLimit: 8192, // 8kb zamiast domyślnych 4kb
    },
    // Optymalizacje dla rozwoju
    optimizeDeps: {
      include: ["astro/client"],
    },
  },
});
