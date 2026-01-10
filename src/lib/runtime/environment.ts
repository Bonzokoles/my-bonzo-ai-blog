/**
 * Environment Detection and Configuration
 * Handles differences between local development and Cloudflare Workers
 */

export type RuntimeEnvironment = 'local' | 'cloudflare' | 'unknown';

/**
 * Detect current runtime environment
 */
export function detectRuntime(): RuntimeEnvironment {
    // Check for Cloudflare Pages specifically first
    if (typeof globalThis.process === 'undefined' &&
        typeof globalThis.caches !== 'undefined' &&
        typeof globalThis.fetch !== 'undefined' &&
        typeof globalThis.crypto?.subtle !== 'undefined') {
        return 'cloudflare';
    }

    // Check for Node.js environment (local dev)
    if (typeof process !== 'undefined' &&
        process.env &&
        typeof globalThis.caches === 'undefined') {
        return 'local';
    }

    // Fallback - if we have process but also caches (likely Cloudflare with Node compatibility)
    if (typeof process !== 'undefined' && typeof globalThis.caches !== 'undefined') {
        return 'cloudflare';
    }

    return 'unknown';
}

/**
 * Environment-specific configuration
 */
export const RUNTIME_CONFIG = {
    local: {
        allowGlobalInit: true,
        useNodeCompatibility: true,
        rateLimitStorage: 'memory',
    },
    cloudflare: {
        allowGlobalInit: false,
        useNodeCompatibility: false,
        rateLimitStorage: 'kv', // Could use KV for distributed rate limiting
    },
    unknown: {
        allowGlobalInit: false,
        useNodeCompatibility: false,
        rateLimitStorage: 'memory',
    }
};

/**
 * Get current runtime configuration
 */
export function getRuntimeConfig() {
    const runtime = detectRuntime();
    return {
        runtime,
        config: RUNTIME_CONFIG[runtime]
    };
}

/**
 * Safe global initialization helper
 * Only runs initialization in environments that support it
 */
export function safeGlobalInit<T>(initFn: () => T, fallback: T): T {
    const { config } = getRuntimeConfig();

    if (config.allowGlobalInit) {
        try {
            return initFn();
        } catch (error) {
            console.warn('Global initialization failed, using fallback:', error);
            return fallback;
        }
    }

    return fallback;
}

/**
 * Lazy initialization helper for Cloudflare Workers
 */
export function createLazyInitializer<T>(initFn: () => T) {
    let instance: T | null = null;
    let initialized = false;

    return (): T => {
        if (!initialized) {
            instance = initFn();
            initialized = true;
        }
        return instance!;
    };
}