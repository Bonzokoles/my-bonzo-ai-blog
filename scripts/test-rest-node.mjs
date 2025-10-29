import { readFileSync } from 'node:fs';

const env = readFileSync('.env', 'utf8');
const get = (name) => {
  const m = env.match(new RegExp(`^${name}=(.*)$`, 'm'));
  return m && m[1];
};
const id = get('CLOUDFLARE_ACCOUNT_ID');
const tok = get('CLOUDFLARE_API_TOKEN');
if (!id || !tok) {
  console.error('Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN');
  process.exit(1);
}

const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(id)}/ai/run/@cf/google/gemma-3-12b-it`;
const body = {
  messages: [
    { role: 'system', content: 'Jestes polskim asystentem. Odpowiadaj krotko.' },
    { role: 'user', content: 'Test: jaka jest stolica Polski?' }
  ],
  temperature: 0.2,
  max_tokens: 64
};

const res = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tok}`
  },
  body: JSON.stringify(body)
});
console.log('status', res.status);
console.log(await res.text());

