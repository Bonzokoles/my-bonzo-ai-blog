// Astro config, you likely won't need to change this file. But if you do -> https://docs.astro.build/en/reference/configuration-reference/
import { SITE } from "./src/alkaline.config";
import robotsConfig from "./src/utils/robots-txt.config";

import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
	site: SITE.url,
	output: "server",
	adapter: cloudflare(),
	image: {
		service: { entrypoint: "astro/assets/services/sharp", config: {} }
	},
	markdown: {
		shikiConfig: SITE.shikiConfig,
	},
	integrations: [mdx(), tailwind(), sitemap(), robotsTxt(robotsConfig), icon()],
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "src/styles/animations.css";`,
				},
			},
		},
	},
});
