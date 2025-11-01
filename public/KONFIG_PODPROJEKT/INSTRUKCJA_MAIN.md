Poniżej szczegółowa konfiguracja projektów Astro i Cloudflare pod pełną implementację z proxy routingiem na Cloudflare Worker, który rozdziela ruch między główną aplikacją a podstroną w osobnym deploymentcie.

1. Konfiguracja astro.config.mjs dla głównej aplikacji (/main-app/astro.config.mjs)
js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Konfiguracja Astro do builda pod Cloudflare Workers
export default defineConfig({
  adapter: cloudflare(),
  base: '/', // bazowa ścieżka głównej aplikacji
  build: {
    outDir: 'dist',
  },
});
2. Konfiguracja astro.config.mjs dla podstrony (/subpage/astro.config.mjs)
js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Podstrona w osobnym buildzie i deploymentcie,
// uruchamiana pod /subpage
export default defineConfig({
  adapter: cloudflare(),
  base: '/subpage/', // kluczowy parametr, aby wygenerować poprawne ścieżki
  build: {
    outDir: 'dist',
  },
});
3. Plik wrangler.toml dla głównej aplikacji (/main-app/wrangler.toml)
text
name = "main-app"
compatibility_date = "2025-10-31"
account_id = "<CLOUDFLARE_ACCOUNT_ID>"
workers_dev = true
route = ""
zone_id = "<CLOUDFLARE_ZONE_ID>"
main = "dist/index.js"
4. Plik wrangler.toml dla podstrony (/subpage/wrangler.toml)
text
name = "subpage"
compatibility_date = "2025-10-31"
account_id = "<CLOUDFLARE_ACCOUNT_ID>"
workers_dev = true
route = ""
zone_id = "<CLOUDFLARE_ZONE_ID>"
main = "dist/index.js"
5. Worker proxy routing (/worker-proxy/index.js)
javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/subpage')) {
    // Proxy do subpage deployment
    const targetUrl = url.href.replace(url.origin, 'https://subpage.example.workers.dev');
    return fetch(targetUrl, request);
  }

  // Proxy do main app deployment
  const targetUrl = url.href.replace(url.origin, 'https://mainapp.example.workers.dev');
  return fetch(targetUrl, request);
}
6. Plik wrangler.toml dla proxy Workera (/worker-proxy/wrangler.toml)
text
name = "proxy-router"
compatibility_date = "2025-10-31"
account_id = "<CLOUDFLARE_ACCOUNT_ID>"
workers_dev = false
route = "example.com/*"
zone_id = "<CLOUDFLARE_ZONE_ID>"
main = "index.js"
7. Deployment krok po kroku
W /main-app:

npm install

npm run build

wrangler publish

W /subpage:

npm install

npm run build

wrangler publish

W /worker-proxy:

wrangler publish

8. Konfiguracja DNS i Routing w Cloudflare
W panelu Cloudflare skieruj domenę example.com do Workera proxy-router poprzez routing example.com/*.

Worker decyduje, czy ruch idzie do głównej aplikacji czy do podstrony.

Obie aplikacje działają na swoich osobnych adresach workers.dev, ale użytkownik widzi je pod jedną domeną.

9. Frontend - linkowanie i nawigacja
W głównej aplikacji Astro linkujesz do podstrony normalnie:

jsx
<a href="/subpage">Przejdź do podstrony</a>
Podsumowanie
Dzięki temu setupowi:

Możesz osobno rozwijać i deployować główną aplikację i podstronę.

Masz jeden punkt wejścia w domenie example.com.

Worker proxy zarządza routingiem i przekierowuje zapytania pod odpowiedni deployment.

Zapewnia to elastyczność, separację i możliwość skalowania mikrofrontendów.

 konkretne prztłady skryptów package.json lub  buildów dla Astro w PRZYK_1.md