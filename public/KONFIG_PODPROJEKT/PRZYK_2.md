Poniżej znajdziesz przykładowe pliki konfiguracyjne wrangler.toml dla trzech projektów (główna aplikacja, podstrona, proxy Worker) oraz podstawowe instrukcje CI/CD przy użyciu GitHub Actions.

1. Plik wrangler.toml dla głównej aplikacji /main-app/wrangler.toml
text
name = "main-app"
main = "dist/index.js"
compatibility_date = "2025-10-31"
account_id = "<CLOUDFLARE_ACCOUNT_ID>"
workers_dev = false
route = "example.com/*"
zone_id = "<CLOUDFLARE_ZONE_ID>"
2. Plik wrangler.toml dla podstrony /subpage/wrangler.toml
text
name = "subpage"
main = "dist/index.js"
compatibility_date = "2025-10-31"
account_id = "<CLOUDFLARE_ACCOUNT_ID>"
workers_dev = false
route = "example.com/subpage/*"
zone_id = "<CLOUDFLARE_ZONE_ID>"
3. Plik wrangler.toml dla proxy Workera /worker-proxy/wrangler.toml
text
name = "proxy-router"
main = "index.js"
compatibility_date = "2025-10-31"
account_id = "<CLOUDFLARE_ACCOUNT_ID>"
workers_dev = false
route = "example.com/*"
zone_id = "<CLOUDFLARE_ZONE_ID>"
4. Instrukcje CI/CD z GitHub Actions
Stwórz w głównym repozytorium plik .github/workflows/deploy.yml:

text
name: Deploy Astro Projects to Cloudflare

on:
  push:
    branches:
      - main

jobs:
  deploy-main-app:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./main-app
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build main app
        run: npm run build

      - name: Publish to Cloudflare Workers
        uses: cloudflare/wrangler-action@v2
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          workingDirectory: .
          publish: true

  deploy-subpage:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./subpage
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build subpage
        run: npm run build

      - name: Publish subpage
        uses: cloudflare/wrangler-action@v2
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          workingDirectory: .
          publish: true

  deploy-proxy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./worker-proxy
    steps:
      - uses: actions/checkout@v3

      - name: Publish worker proxy
        uses: cloudflare/wrangler-action@v2
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          workingDirectory: .
          publish: true
5. Instrukcje dodatkowe
W repozytorium GitHub dodaj sekret CF_API_TOKEN (token z odpowiednimi uprawnieniami Cloudflare, do publikacji Workerów).

Token możesz wygenerować w panelu Cloudflare (API Tokens).

Workflow uruchomi się przy pushu do gałęzi main, automatycznie buildując i deployując wszystkie trzy projekty w odpowiednich folderach.

Tak przygotowane pliki i instrukcje CI/CD umożliwią automatyczne, niezależne deploymenty głównej aplikacji, podstrony oraz proxy routera z wykorzystaniem Cloudflare Workers i Pages. Jeśli chcesz, mogę pomóc rozwinąć to o testy lub inne etapy pipeline.