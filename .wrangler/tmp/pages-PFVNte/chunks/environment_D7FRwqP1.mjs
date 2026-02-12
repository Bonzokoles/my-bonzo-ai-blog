globalThis.process ??= {}; globalThis.process.env ??= {};
function detectRuntime() {
  if (typeof globalThis.process === "undefined" && typeof globalThis.caches !== "undefined" && typeof globalThis.fetch !== "undefined" && typeof globalThis.crypto?.subtle !== "undefined") {
    return "cloudflare";
  }
  if (typeof process !== "undefined" && process.env && typeof globalThis.caches === "undefined") {
    return "local";
  }
  if (typeof process !== "undefined" && typeof globalThis.caches !== "undefined") {
    return "cloudflare";
  }
  return "unknown";
}
const RUNTIME_CONFIG = {
  local: {
    allowGlobalInit: true,
    useNodeCompatibility: true,
    rateLimitStorage: "memory"
  },
  cloudflare: {
    allowGlobalInit: false,
    useNodeCompatibility: false,
    rateLimitStorage: "kv"
    // Could use KV for distributed rate limiting
  },
  unknown: {
    allowGlobalInit: false,
    useNodeCompatibility: false,
    rateLimitStorage: "memory"
  }
};
function getRuntimeConfig() {
  const runtime = detectRuntime();
  return {
    runtime,
    config: RUNTIME_CONFIG[runtime]
  };
}
function createLazyInitializer(initFn) {
  let instance = null;
  let initialized = false;
  return () => {
    if (!initialized) {
      instance = initFn();
      initialized = true;
    }
    return instance;
  };
}

export { createLazyInitializer as c, getRuntimeConfig as g };
