/// <reference types="astro/client" />

interface ImportMetaEnv {
  // Public environment variables (accessible on client-side)
  readonly PUBLIC_BLOG_API_URL?: string;

  // Private environment variables (server-side only)
  readonly BLOG_API_TOKEN?: string;
  readonly CLOUDFLARE_ACCOUNT_ID?: string;
  readonly CLOUDFLARE_API_TOKEN?: string;
  readonly CF_IMAGES_DELIVERY_URL?: string;
  readonly CF_IMAGES_API_TOKEN?: string;
  readonly R2_BUCKET_NAME?: string;
  readonly NODE_ENV?: string;
}


interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="@astrojs/cloudflare" />
type D1Database = import("@cloudflare/workers-types").D1Database;
type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

declare namespace App {
  interface Locals extends Record<string, any> {
    runtime: {
      env: {
        DB: D1Database;
        ANALYTICS_DB: D1Database;
        SESSION: KVNamespace;
        CACHE: KVNamespace;
        ANALYTICS_KV: KVNamespace;
        AI: any;
      };
      cf: Record<string, any>;
      ctx: {
        waitUntil: (promise: Promise<any>) => void;
        passThroughOnException: () => void;
      };
    };
  }
}
