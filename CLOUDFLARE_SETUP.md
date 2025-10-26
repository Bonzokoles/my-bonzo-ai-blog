# Konfiguracja Cloudflare dla domeny www.mybonzoaiblog.com

## 🌐 Wymagane ustawienia DNS w Cloudflare Dashboard

### 1. **DNS Records**
```
Type    Name                Value                           Proxy   TTL
A       mybonzoaiblog.com   192.0.2.1                      ✅      Auto
AAAA    mybonzoaiblog.com   100::                          ✅      Auto  
CNAME   www                 mybonzoaiblog.com              ✅      Auto
```

### 2. **Cloudflare Pages Configuration**
- Project Name: `mybonzo-ai-blog`
- Custom Domain: `www.mybonzoaiblog.com`
- Production Branch: `main`
- Build Command: `npm run build`
- Build Output Directory: `dist`

### 3. **SSL/TLS Settings**
- SSL/TLS encryption mode: **Full (strict)**
- Always Use HTTPS: **Enabled**
- HTTP Strict Transport Security (HSTS): **Enabled**
- Minimum TLS Version: **1.2**

### 4. **Page Rules (Optional)**
```
URL Pattern: mybonzoaiblog.com/*
Settings:
- Always Use HTTPS: On
- Forwarding URL: 301 Redirect to https://www.mybonzoaiblog.com/$1
```

### 5. **R2 Bucket Configuration**
```
Bucket Name: mybonzo-blog-content
Public Access: Enabled for blog content
Custom Domain: blog-cdn.mybonzoaiblog.com (optional)
```

### 6. **Workers Routes**
```
Route: blog-api.mybonzoaiblog.com/*
Worker: mybonzo-blog-worker

Route: www.mybonzoaiblog.com/blog-api/*  
Worker: mybonzo-blog-worker
```

## 🔧 Kroki konfiguracji

### Krok 1: Dodaj domenę do Cloudflare
1. Zaloguj się do Cloudflare Dashboard
2. Kliknij "Add a Site"
3. Wprowadź `mybonzoaiblog.com`
4. Wybierz plan (Free wystarczy na start)
5. Zaktualizuj nameservery u dostawcy domeny

### Krok 2: Skonfiguruj DNS
```bash
# Dodaj rekordy DNS w Cloudflare Dashboard:
A     mybonzoaiblog.com     192.0.2.1      (Proxied)
AAAA  mybonzoaiblog.com     100::          (Proxied)  
CNAME www                   mybonzoaiblog.com (Proxied)
```

### Krok 3: Połącz z Cloudflare Pages
1. Idź do Cloudflare Dashboard > Pages
2. Znajdź projekt `mybonzo-ai-blog`
3. Kliknij "Custom domains" 
4. Dodaj `www.mybonzoaiblog.com`

### Krok 4: Deploy Workers
```bash
cd workers
npx wrangler deploy --env production
```

### Krok 5: Skonfiguruj R2
```bash
# Utwórz bucket
npx wrangler r2 bucket create mybonzo-blog-content

# Ustaw public access
npx wrangler r2 bucket cors mybonzo-blog-content --file cors-config.json
```

## 📋 Checklist weryfikacji

- [ ] Domena wskazuje na Cloudflare nameservery
- [ ] DNS propagacja zakończona (sprawdź: dig www.mybonzoaiblog.com)
- [ ] SSL certyfikat wygenerowany i aktywny
- [ ] Redirect z apex domain (mybonzoaiblog.com) na www
- [ ] Cloudflare Pages deployment działa
- [ ] Workers odpowiadają na /blog-api/* endpointach
- [ ] R2 bucket accessible i skonfigurowany

## 🚀 Testy po konfiguracji

```bash
# Test głównej strony
curl -I https://www.mybonzoaiblog.com

# Test blog API
curl https://www.mybonzoaiblog.com/blog-api/health

# Test redirecta apex -> www
curl -I https://mybonzoaiblog.com

# Test SSL
openssl s_client -connect www.mybonzoaiblog.com:443 -servername www.mybonzoaiblog.com
```

## ⚙️ Environment Variables

### GitHub Secrets (dla CI/CD)
```
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ACCOUNT_ID=7f490d58a478c6baccb0ae01ea1d87c3
```

### Worker Environment Variables
```
WORKER_ENV=production
BLOG_API_TOKEN=your_secret_token (via wrangler secret put)
```

## 🔍 Troubleshooting

### Problem: DNS nie rozwiązuje się
```bash
# Sprawdź propagację DNS
dig www.mybonzoaiblog.com
nslookup www.mybonzoaiblog.com 8.8.8.8
```

### Problem: SSL certificate error  
- Sprawdź czy domena jest "proxied" (🧡 cloud icon)
- Poczekaj 15-30 minut na generację certyfikatu
- Universal SSL musi być enabled

### Problem: Pages deployment fails
- Sprawdź czy custom domain jest poprawnie dodana
- Verify build command i output directory
- Check GitHub Actions logs

### Problem: Workers nie odpowiadają
```bash
# Deploy workers ponownie
cd workers
npx wrangler deploy --env production

# Sprawdź route configuration
npx wrangler route list
```

## 📞 Support

W przypadku problemów:
1. Sprawdź Cloudflare Status Page
2. Przejrzyj logs w Cloudflare Dashboard
3. Użyj Cloudflare Community Forum
4. Contact support (na płatnych planach)