/**
 * Astro Configuration - Main App
 * 
 * Główna aplikacja blogowa - root domain bez base path
 * Deploy: Cloudflare Pages
 * URL: example.com/*
 */

import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';

export default defineConfig({
    // Adapter Cloudflare dla SSR support
    adapter: cloudflare({
        // Mode: 'advanced' dla pełnej kontroli nad Workers API
        mode: 'advanced',

        // Routes configuration - automatycznie generowany _routes.json
        routes: {
            // Strategia: wszystkie requesty do SSR oprócz /assets/*
            strategy: 'auto',

            // Dodatkowe include patterns (opcjonalnie)
            extend: {
                include: ['/api/*'],
                exclude: ['/assets/*', '/_astro/*']
            }
        },

        // Image optimization na Cloudflare
        imageService: 'passthrough'
    }),

    // Output mode: 'server' dla pełnego SSR
    output: 'server',

    // Site URL (zamień na swoją domenę)
    site: 'https://example.com',

    // Base path: brak (root domain)
    // base: '/',

    // Vite configuration
    vite: {
        build: {
            // Minifikacja włączona dla produkcji
            minify: true,
        },
        ssr: {
            // Node.js compatibility dla Cloudflare Workers
            external: ['node:buffer', 'node:crypto'],
            noExternal: ['@astrojs/cloudflare']
        }
    },

    // Build configuration
    build: {
        // Format output dla Cloudflare
        format: 'directory',

        // Client-side assets directory
        assets: '_astro',

        // Inlining dla małych assetów
        inlineStylesheets: 'auto'
    },

    // Security headers (będą dodane przez _headers)
    // Zobacz: public/_headers

    // Experimental features (opcjonalnie)
    experimental: {
        // Cloudflare-specific optimizations
    }
});
