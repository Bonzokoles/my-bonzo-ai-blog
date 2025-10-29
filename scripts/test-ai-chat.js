// Local test runner using Miniflare to execute the built Cloudflare Worker
// Requires: npm i -D miniflare undici
import { Miniflare } from 'miniflare';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnvVar(name) {
  try {
    if (process.env[name]) return process.env[name];
    const envPath = resolve(process.cwd(), '.env');
    const text = readFileSync(envPath, 'utf8');
    const m = text.match(new RegExp(`^${name}=(.*)$`, 'm'));
    if (m) return m[1];
  } catch {}
  return undefined;
}

const ACCOUNT_ID = loadEnvVar('CLOUDFLARE_ACCOUNT_ID');
const API_TOKEN = loadEnvVar('CLOUDFLARE_API_TOKEN');

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error('Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN');
  process.exit(1);
}

const workerEntry = resolve(process.cwd(), 'dist/_worker.js/index.js');

const mf = new Miniflare({
  modules: true,
  scriptPath: workerEntry,
  compatibilityDate: '2024-10-28',
  // Provide env vars so the code can use REST fallback when env.AI is missing
  envPath: undefined,
  env: {
    CLOUDFLARE_ACCOUNT_ID: ACCOUNT_ID,
    CLOUDFLARE_API_TOKEN: API_TOKEN,
  },
  // Optional KV stubs
  kvNamespaces: ['SESSION', 'CACHE'],
});

// Helper to perform a request to the worker
async function call(method, path, body) {
  const url = new URL(path, 'http://localhost');
  const init = { method, headers: {} };
  if (body) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  const res = await mf.dispatchFetch(url, init);
  const text = await res.text();
  return { status: res.status, text };
}

const run = async () => {
  const statusResp = await call('GET', '/api/ai/chat?mcp-status=true');
  console.log('MCP:', statusResp.status, statusResp.text.slice(0, 200));

  const chatResp = await call('POST', '/api/ai/chat', {
    prompt: 'Szybki test: jaka jest stolica Polski?',
    history: [],
    model: '@cf/google/gemma-3-12b-it',
    temperature: 0.2,
    max_tokens: 64,
  });
  console.log('CHAT:', chatResp.status, chatResp.text.slice(0, 200));
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

