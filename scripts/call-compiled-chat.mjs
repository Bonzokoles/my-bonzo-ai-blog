// Call the compiled Worker API route directly without running a server
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const modPath = path.resolve(process.cwd(), 'dist/_worker.js/pages/api/ai/chat.astro.mjs');
const { page } = await import(pathToFileURL(modPath).href);
const { GET, POST } = page();

// Minimal locals shape expected by the route
const locals = { runtime: { env: {} } };

// 1) MCP status via GET
const getUrl = new URL('http://localhost/api/ai/chat?mcp-status=true');
const getResp = await GET({ url: getUrl, locals });
console.log('GET MCP status:', getResp.status);
console.log(await getResp.text());

// 2) Chat via POST (uses REST fallback inside if env.AI missing)
const body = {
  prompt: 'Szybki test AI: jaka jest stolica Polski?',
  history: [],
  model: '@cf/google/gemma-3-12b-it',
  temperature: 0.2,
  max_tokens: 64,
};
const postReq = new Request('http://localhost/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const postResp = await POST({ request: postReq, locals, clientAddress: '127.0.0.1' });
console.log('POST chat:', postResp.status);
console.log(await postResp.text());
