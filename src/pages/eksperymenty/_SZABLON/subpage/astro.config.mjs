/**
 * Astro Configuration - Subpage
 * 
 * Podstrona projektu - deploy z base path /subpage/
 * Deploy: Cloudflare Pages (osobny deployment)
 * URL przez proxy: example.com/subpage/*
 * Direct URL: subpage-xyz.pages.dev/*
 */

import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';

export default defineConfig({
    // Adapter Cloudflare
    adapter: cloudflare({
        mode: 'advanced',

        routes: {
            strategy: 'auto',
            extend: {
                include: ['/subpage/api/*'],
                exclude: ['/subpage/assets/*', '/subpage/_astro/*']
            }
        },

        imageService: 'passthrough'
    }),

    // SSR mode
    output: 'server',

    // Site URL - proxy domain
    site: 'https://example.com',

    // KRYTYCZNE: Base path dla podstrony
    // Wszystkie linki, assety i routy będą prefixowane /subpage/
    base: '/subpage/',

    // Vite configuration
    vite: {
        build: {
            minify: true,
        },
        ssr: {
            external: ['node:buffer', 'node:crypto'],
            noExternal: ['@astrojs/cloudflare']
        }
    },

    // Build configuration
    build: {
        format: 'directory',
        assets: '_astro',
        inlineStylesheets: 'auto'
    },

    // Routing dla base path
    // Astro automatycznie prefiksuje wszystkie routes z /subpage/
    // Przykład: /about → /subpage/about

    // Trailingslash config (zalecane: 'always' dla spójności)
    trailingSlash: 'always'
});
