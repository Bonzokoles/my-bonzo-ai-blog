// Astro config, you likely won't need to change this file. But if you do -> https://docs.astro.build/en/reference/configuration-reference/
import { SITE } from "./src/alkaline.config";

// import robotsConfig from "./src/utils/robots-txt.config"; // DISABLED: using static public/robots.txt

import { defineConfig } from "astro/config";

// Adapters
import cloudflare from "@astrojs/cloudflare";

// Integrations
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  output: 'server', // Changed to server for dynamic D1 access
  adapter: cloudflare({
    imageService: 'compile', // Use explicit compile mode for images
    platformProxy: {
      enabled: true, // Enable local simulation of Cloudflare platform
    },
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    icon({
      include: {
        ri: ["*"], // Remix Icons
      },
    }),
    vue(),
  ],
  vite: {
    ssr: {
      noExternal: ['path-to-regexp'], // Fix for some SSR dependencies
    },
    build: {
      rollupOptions: {
        // Ensure worker target
      }
    }
  }
});
