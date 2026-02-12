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

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  output: "server",
  adapter: cloudflare({
    sessionKVBindingName: "SESSION",
    mode: "directory",
  }),
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false,
      },
    },
    domains: ["images.unsplash.com", "cdn.example.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdnjs.cloudflare.com",
      },
    ],
  },
  build: {
    inlineStylesheets: "auto",
    assets: "_assets",
  },
  compressHTML: true,
  markdown: {
    shikiConfig: SITE.shikiConfig,
  },
  integrations: [
    mdx({
      optimize: true,
      ignoreElementNames: ["custom-component"],
    }),
    tailwind(),
    sitemap({
      filter: (page) => !page.includes("/api/"),
      serialize: (item) => {
        if (item.url.includes("/pumo-guide/")) {
          item.changefreq = "weekly";
          item.priority = 0.9;
        }
        return item;
      },
    }),
    icon(),
    vue(),
  ],
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "src": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@layouts": path.resolve(__dirname, "./src/layouts"),
        "@styles": path.resolve(__dirname, "./src/styles"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@data": path.resolve(__dirname, "./src/data"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@config": path.resolve(__dirname, "./src/config"),
        "@utils": path.resolve(__dirname, "./src/utils"),
      },
    },
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
