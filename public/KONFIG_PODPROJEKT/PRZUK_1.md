Poniżej przykłady przydatnych skryptów package.json oraz przykłady buildu dla projektów Astro, które ułatwią Ci rozwój i deployment głównej aplikacji oraz podstrony.

1. Przykładowy package.json dla głównej aplikacji (/main-app/package.json)
json
{
  "name": "main-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "wrangler publish"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^2.0.0",
    "astro": "^3.0.0"
  },
  "devDependencies": {
    "wrangler": "^3.0.0"
  }
}
dev: uruchamia lokalny serwer developerski Astro.

build: buduje projekt Astro do folderu dist/.

preview: podgląd buildu lokalnie.

deploy: wypycha zbudowaną aplikację na Cloudflare Worker (wymaga konfiguracji wrangler.toml).

2. Przykładowy package.json dla podstrony (/subpage/package.json)
json
{
  "name": "subpage",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "wrangler publish"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^2.0.0",
    "astro": "^3.0.0"
  },
  "devDependencies": {
    "wrangler": "^3.0.0"
  }
}
Identyczny zestaw skryptów do głównej aplikacji, ale astro.config.mjs ma base: '/subpage/'.

3. Budowanie i deploy lokalnie dla obu projektów
bash
# Dla głównej aplikacji
cd main-app
npm install
npm run build
npm run preview          # podgląd lokalnie
npm run deploy           # deploy na Cloudflare

# Dla podstrony
cd ../subpage
npm install
npm run build
npm run preview
npm run deploy
4. Przykładowy package.json dla Workera-proxy (/worker-proxy/package.json)
json
{
  "name": "proxy-router",
  "version": "1.0.0",
  "scripts": {
    "deploy": "wrangler publish"
  },
  "devDependencies": {
    "wrangler": "^3.0.0"
  }
}
Ten projekt to tylko Worker, więc skrypty obsługują deploy.

5. Dodatkowe wskazówki
Upewnij się, że w projektach Astro masz poprawnie zainstalowany adapter Cloudflare:

bash
npm install @astrojs/cloudflare
W astro.config.mjs używaj adaptera @astrojs/cloudflare.

Przy deployu pracuj każdorazowo oddzielnie w folderze projektu.

Te szablony package.json i komendy buildu/deploy pozwolą Ci sprawnie rozwijać i wdrażać oba projekty oraz proxy, zachowując porządek i separację kodu. 
 pliki konfiguracyjne wrangler.toml i instrukcje CI/CD w PRZUK_2.md