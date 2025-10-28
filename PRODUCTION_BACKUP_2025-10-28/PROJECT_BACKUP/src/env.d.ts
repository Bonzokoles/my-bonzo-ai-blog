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
