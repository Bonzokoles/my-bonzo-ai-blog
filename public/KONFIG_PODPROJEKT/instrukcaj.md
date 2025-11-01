6. DNS i routing w Cloudflare
Skonfiguruj domenę example.com w Cloudflare.

Ustaw Worker proxy-router na routingu example.com/*.

Ten Worker przekierowuje ruch do mainapp.example.workers.dev i subpage.example.workers.dev.

7. Deployment
Deployuj projekty main-app i subpage osobno (np. wrangler publish w każdym folderze).

Deployuj Worker proxy-router i ustaw na example.com/*.

8. Frontend
W main-app linkuj do /subpage normalnie, np. <a href="/subpage">Podstrona</a>.

Użytkownik wchodzi na /subpage, proxy przekierowuje żądanie do subpage.

Podsumowanie
Nazwa	Adres	Deployment
Główna aplikacja	https://example.com/	Cloudflare Pages lub Workers
Podstrona	https://example.com/subpage	Cloudflare Pages lub Workers
Proxy router Worker	https://example.com/*	Cloudflare Worker (proxy routing)
