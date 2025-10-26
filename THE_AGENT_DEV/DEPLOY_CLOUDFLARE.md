# Deploy na Cloudflare Pages - Instrukcja

## Konfiguracja GitHub Secrets

W repozytorium GitHub przejdź do **Settings → Secrets and variables → Actions** i dodaj:

### CLOUDFLARE_API_TOKEN
1. Przejdź do [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Kliknij "Create Token"
3. Wybierz "Custom token" 
4. Permissions:
   - Account: Cloudflare Pages:Edit
   - Zone: Zone Settings:Read, Zone:Read (jeśli używasz custom domain)
5. Account Resources: Include - wybierz swoje konto
6. Skopiuj token i dodaj jako secret `CLOUDFLARE_API_TOKEN`

## Aktualizacja workflow

W pliku `.github/workflows/deploy.yml` zamień:

```yaml
accountId: <YOUR_CLOUDFLARE_ACCOUNT_ID>
projectName: <YOUR_PAGES_PROJECT_NAME>
```

### Cloudflare Account ID
1. Przejdź do [Cloudflare Dashboard](https://dash.cloudflare.com)
2. W prawej kolumnie znajdziesz "Account ID"
3. Skopiuj i wklej zamiast `<YOUR_CLOUDFLARE_ACCOUNT_ID>`

### Project Name
1. Przejdź do **Workers & Pages** w Cloudflare
2. Znajdź swoją aplikację Pages
3. Nazwa projektu to nazwa widoczna na liście
4. Wklej zamiast `<YOUR_PAGES_PROJECT_NAME>`

## Przykład gotowego workflow:

```yaml
accountId: "1234567890abcdef1234567890abcdef"
projectName: "mybonzo-ai-blog"
```

## Weryfikacja

✅ `package.json` ma script `"build": "astro build"` - **OK**  
✅ Folder build to `dist` - **OK**  
✅ Workflow trigger na `main` branch - **OK**

Po commit i push na `main` - GitHub automatycznie zbuduje i wdroży stronę!