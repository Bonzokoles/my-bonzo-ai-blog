# ⚠️ Emergency Keep-Alive - WYŁĄCZONY

## Status: DISABLED (2026-01-09)

Plik `emergency-keep-alive.yml` został przemianowany na `emergency-keep-alive.yml.disabled` aby oszczędzić minuty GitHub Actions.

## Powód wyłączenia:

Emergency keep-alive uruchamiał się **co 5 minut (24/7)**, co oznacza:
- **288 wykonań dziennie**
- **8,640 wykonań miesięcznie**
- **~43,200 minut GitHub Actions miesięcznie** (przy 5 min/workflow)

To przekracza darmowy limit GitHub Actions (2000 min/miesiąc) **ponad 20 razy!**

## Obecne rozwiązanie keep-alive:

Strona jest nadal chroniona przed usypianiem przez:

1. **keep-alive.yml** - Główny workflow
   - Co 10 min (6:00-22:00 UTC)
   - Co 30 min (22:00-6:00 UTC)
   - ~10,000 wykonań/miesiąc

2. **advanced-monitoring.yml** - Zaawansowany monitoring
   - Co 1h w dzień (6:00-22:00 UTC)
   - Co 2h w nocy
   - ~360 wykonań/miesiąc

## Kiedy ponownie włączyć emergency mode?

**Włącz TYLKO jeśli:**
- Strona ma poważne problemy z usypianiem
- Standardowe keep-alive nie wystarcza
- Jesteś gotowy na wysokie zużycie minut Actions
- To jest tymczasowe rozwiązanie (max 1-2 dni)

## Jak ponownie włączyć:

```bash
cd .github/workflows
git mv emergency-keep-alive.yml.disabled emergency-keep-alive.yml
git commit -m "Enable emergency keep-alive temporarily"
git push
```

## Jak całkowicie wyłączyć:

```bash
# Usuń workflow (można przywrócić z gita)
rm .github/workflows/emergency-keep-alive.yml.disabled
git commit -m "Remove emergency keep-alive"
git push
```

## Alternatywy:

Jeśli strona ma problemy z dostępnością, rozważ:

1. **External monitoring services:**
   - UptimeRobot (darmowy: 50 monitors, ping co 5 min)
   - Pingdom (darmowy plan dostępny)
   - Freshping by Freshworks (darmowy: unlimited checks)

2. **Cloudflare Solutions:**
   - Cloudflare Analytics (wbudowane w Pages)
   - Cloudflare Workers Cron Triggers (bardziej cost-effective)
   - Health Checks (płatne, ale dedykowane)

3. **Optymalizacja aplikacji:**
   - Review Cloudflare Pages settings
   - Check for cold start issues
   - Optimize Astro SSR configuration

---

**Status zmienił:** GitHub Copilot  
**Data:** 2026-01-09  
**Powód:** Cost optimization - oszczędność minut GitHub Actions
