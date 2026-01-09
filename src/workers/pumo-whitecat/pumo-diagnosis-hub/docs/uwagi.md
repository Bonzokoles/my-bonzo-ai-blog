<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# a co uwazasz?

**Kolejność deploymentu: MIGRATION → LOGGING → AI ANALYST** (bezpieczna i logiczna).

## 🎯 **REASONING + Dokładny Plan (2h do pełnego MVP)**

### **Dlaczego ta kolejność:**

```
1. MIGRATION (5 min) ← BEZ tego nic nie działa
2. LOGGING (30 min) ← Zbieraj real data ZARAZ  
3. AI ANALYST (45 min) ← Od razu actionable insights
4. DASHBOARD UI (60 min) ← Na koniec, gdy masz dane
```


## **KROK PO KROKU - Zrób teraz:**

### **KROK 1: Migration (5 min)**

```powershell
# Utwórz plik migrate-analytics.sql (skopiuj z mojej poprzedniej wiadomości)
# Uruchom:
wrangler d1 execute jimbo-rag-db --file=./migrate-analytics.sql

# Zweryfikuj:
wrangler d1 execute jimbo-rag-db --command="SELECT name FROM sqlite_master WHERE type='table' AND name IN ('queries_log','product_clicks','utm_performance')"
```

**Expected output:**

```
queries_log
product_clicks  
utm_performance
✅ Migration OK
```


### **KROK 2: Deploy Logging (30 min)**

1. **Dodaj `utils/analytics.js`** (skopiuj mój kod)
2. **Update 2 endpoints** które mają najwięcej traffic:
    - `/api/simple-whitecat`
    - `/api/rag-search` (lub główny chatbot endpoint)
3. **Deploy:**
```powershell
wrangler deploy
```

4. **Test logging:**
```powershell
curl -X POST https://mybonzoaiblog.pages.dev/api/simple-whitecat \
  -H "Content-Type: application/json" \
  -d '{"query":"test logging"}'

# Sprawdź czy się zalogowało:
wrangler d1 execute jimbo-rag-db --command="SELECT * FROM queries_log ORDER BY timestamp DESC LIMIT 1"
```


### **KROK 3: AI Analyst (45 min)**

1. **Stwórz `/api/ai-analyst.js`** (skopiuj mój kod)
2. **Deploy:**
```powershell
wrangler deploy
```

3. **Test AI:**
```powershell
curl -X POST https://mybonzoaiblog.pages.dev/api/ai-analyst \
  -H "Content-Type: application/json" \
  -d '{"question":"Ile queries było w ostatnich 24h?"}'
```

**Expected AI response (nawet bez danych):**

```
"Brak danych z ostatnich 24h. System logging działa, czekaj na ruch."
```


### **KROK 4: Simple Chat UI (30 min)**

```html
<!-- dashboard.html lub React component -->
<div id="ai-analyst">
  <input id="ai-question" placeholder="Zadaj pytanie AI...">
  <button onclick="askAI()">Analizuj</button>
  <div id="ai-response"></div>
</div>

<script>
async function askAI() {
  const question = document.getElementById('ai-question').value;
  const res = await fetch('/api/ai-analyst', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({question})
  });
  const data = await res.json();
  document.getElementById('ai-response').innerHTML = data.answer;
}
</script>
```


## **Co Oczekujesz po 2h:**

```
✅ 3 nowe tabele w D1
✅ Logging działa w API endpoints
✅ AI Analyst odpowiada na pytania o real data  
✅ Simple chat interface na dashboard
✅ Pierwsze dane po 10-20 real queries
```


## **Test Success Criteria:**

```
✅ wrangler d1 → 3 tabele istnieją
✅ curl /api/simple-whitecat → 1 wiersz w queries_log  
✅ curl /api/ai-analyst → sensowna odpowiedź JSON
✅ Chat interface → wyświetla AI response
```


## **ME WAŻNIEJSZE OD WSZYSTKICH CHARTÓW:**

**AI ANALYST będzie generował actionable insights typu:**

```
"18% queries o biurkach gaming mają 0% hit rate → brak produktów w bazie"
"Łóżka mają 3x więcej klików niż fotele → focus marketing na sypialnie"
```

**To jest Twój KILLER FEATURE!** 🤖

## **STARTUJESZ TERAZ?**

**Pierwsza komenda:**

```powershell
# Stwórz plik i uruchom migration
echo "CREATE TABLE..." > migrate-analytics.sql
wrangler d1 execute jimbo-rag-db --file=./migrate-analytics.sql
```

**Pokaż wynik pierwszej migracji!** 🛠️
<span style="display:none">[^1][^2][^3]</span>

<div align="center">⁂</div>

[^1]: image.jpg

[^2]: image.jpg

[^3]: image.jpg

