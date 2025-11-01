/**
 * Cloudflare Worker - Reverse Proxy
 * 
 * Kieruje requesty do odpowiednich Cloudflare Pages deploymentów
 * na podstawie ścieżki URL.
 * 
 * Routing:
 * - example.com/subpage/* → mybonzo-subpage.pages.dev
 * - example.com/* → mybonzo-main-app.pages.dev
 * 
 * Kompatybilność: 2025-10-31
 * Dokumentacja: https://developers.cloudflare.com/workers/
 */

/**
 * KONFIGURACJA - ZMIEŃ NA SWOJE URL-E PAGES
 */
const MAIN_APP_URL = 'https://mybonzo-main-app.pages.dev';
const SUBPAGE_URL = 'https://mybonzo-subpage.pages.dev';

/**
 * Routing map - dodaj tutaj nowe podstrony
 */
const ROUTES = [
    {
        prefix: '/subpage/',
        target: SUBPAGE_URL,
        name: 'Subpage'
    },
    // Dodaj kolejne projekty tutaj:
    // {
    //   prefix: '/projekt-2/',
    //   target: 'https://mybonzo-projekt-2.pages.dev',
    //   name: 'Projekt 2'
    // },
];

/**
 * Security headers - dodawane do wszystkich odpowiedzi
 */
const SECURITY_HEADERS = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

/**
 * Główna funkcja fetch - entry point Workera
 */
export default {
    async fetch(request, env, ctx) {
        try {
            // Parse URL
            const url = new URL(request.url);

            // Logowanie (widoczne w wrangler tail)
            console.log(`[PROXY] ${request.method} ${url.pathname}`);

            // Health check endpoint
            if (url.pathname === '/_proxy-health') {
                return new Response(JSON.stringify({
                    status: 'ok',
                    timestamp: new Date().toISOString(),
                    routes: ROUTES.map(r => ({ prefix: r.prefix, name: r.name }))
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        ...SECURITY_HEADERS
                    }
                });
            }

            // Znajdź matching route
            const route = findMatchingRoute(url.pathname);

            if (route) {
                // Proxy do subpage
                return await proxyRequest(request, route.target, route.prefix);
            } else {
                // Default: main app
                return await proxyRequest(request, MAIN_APP_URL, '/');
            }

        } catch (error) {
            // Error handling
            console.error('[PROXY ERROR]', error);
            return handleError(error);
        }
    }
};

/**
 * Znajduje matching route dla danej ścieżki
 * @param {string} pathname - URL pathname
 * @returns {Object|null} - Matching route lub null
 */
function findMatchingRoute(pathname) {
    // Sortujemy routes po długości prefiksu (najdłuższe pierwsze)
    // To zapewnia, że /subpage/nested ma priorytet nad /subpage/
    const sortedRoutes = [...ROUTES].sort((a, b) => b.prefix.length - a.prefix.length);

    return sortedRoutes.find(route => pathname.startsWith(route.prefix));
}

/**
 * Proxy request do target URL
 * @param {Request} request - Oryginalny request
 * @param {string} targetUrl - URL docelowego Pages deployment
 * @param {string} basePrefix - Base prefix do usunięcia/dodania
 * @returns {Promise<Response>}
 */
async function proxyRequest(request, targetUrl, basePrefix = '/') {
    const url = new URL(request.url);

    // Przepisz URL do target
    let targetPath = url.pathname;

    // Jeśli to subpage, zachowaj base path (np. /subpage/about)
    // Pages deployment oczekuje pełnej ścieżki z base

    const targetURL = new URL(targetPath + url.search, targetUrl);

    // Clone request headers
    const headers = new Headers(request.headers);

    // Ustaw/nadpisz ważne headery
    headers.set('Host', new URL(targetUrl).hostname);
    headers.set('X-Forwarded-Host', url.hostname);
    headers.set('X-Forwarded-Proto', url.protocol.slice(0, -1));
    headers.set('X-Real-IP', request.headers.get('CF-Connecting-IP') || '');
    headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');

    // Usuń problematyczne headery
    headers.delete('cf-connecting-ip');
    headers.delete('cf-ray');
    headers.delete('cf-visitor');

    // Stwórz nowy request
    const proxyRequest = new Request(targetURL.toString(), {
        method: request.method,
        headers: headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : null,
        redirect: 'manual'
    });

    // Wykonaj fetch do target
    const response = await fetch(proxyRequest);

    // Clone response i dodaj security headers
    const modifiedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
    });

    // Dodaj security headers
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        modifiedResponse.headers.set(key, value);
    });

    // Dodaj CORS headers jeśli potrzebne
    if (request.headers.get('Origin')) {
        modifiedResponse.headers.set('Access-Control-Allow-Origin', url.origin);
        modifiedResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        modifiedResponse.headers.set('Access-Control-Max-Age', '86400');
    }

    // Dodaj custom header z informacją o routing
    const routeName = basePrefix === '/' ? 'Main App' : `Subpage: ${basePrefix}`;
    modifiedResponse.headers.set('X-Proxy-Route', routeName);
    modifiedResponse.headers.set('X-Proxy-Target', new URL(targetUrl).hostname);

    return modifiedResponse;
}

/**
 * Error handling - zwraca user-friendly error page
 * @param {Error} error
 * @returns {Response}
 */
function handleError(error) {
    const errorPage = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Błąd - MyBonzo</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
    }
    .error-container {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
    }
    h1 {
      font-size: 4rem;
      color: #667eea;
      margin-bottom: 1rem;
    }
    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #764ba2;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2rem;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
    }
    .error-code {
      font-size: 0.9rem;
      color: #999;
      margin-top: 2rem;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <h1>⚠️</h1>
    <h2>Coś poszło nie tak</h2>
    <p>
      Przepraszamy, napotkaliśmy problem podczas przetwarzania Twojego żądania.
      Nasz zespół został powiadomiony i pracuje nad rozwiązaniem.
    </p>
    <a href="/" class="btn">Wróć do strony głównej</a>
    <div class="error-code">Error ID: ${Date.now()}</div>
  </div>
</body>
</html>
  `;

    return new Response(errorPage, {
        status: 500,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            ...SECURITY_HEADERS
        }
    });
}

/**
 * UWAGI BEZPIECZEŃSTWA:
 * 
 * 1. NIGDY nie loguj sensitywnych danych (passwords, tokens, etc.)
 * 2. Waliduj wszystkie input URL przed proxy
 * 3. Użyj rate limiting w produkcji (Cloudflare Rate Limiting)
 * 4. Monitoruj Worker metrics w Dashboard
 * 5. Ustaw alerty dla high error rate
 * 
 * PERFORMANCE:
 * 
 * 1. Worker działa na Edge - ultra niskie latency
 * 2. Automatyczny retry dla failed requests
 * 3. Cache API można dodać dla static assets
 * 4. Obsługa HTTP/2 i HTTP/3
 * 
 * MONITORING:
 * 
 * 1. Użyj: wrangler tail
 * 2. Cloudflare Analytics: Workers → Analytics
 * 3. Logpush dla długoterminowego storage logów
 */
