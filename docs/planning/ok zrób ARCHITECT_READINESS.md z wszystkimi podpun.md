<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# ok zrób ARCHITECT_READINESS.md z wszystkimi podpunktami

```markdown
# ARCHITECT_READINESS.md
Status gotowości architektury (PUMO Guide + MoE‑RAG + Agent Graph)

## 0. Meta – jak czytać ten plik

- Ten plik jest **checklistą architekta**, nie tylko technicznym TODO.
- Każdy blok ma:
  - ✅ / ❌ / ⏳ – status,
  - Wymagane artefakty (pliki / dashboardy),
  - Minimalne metryki „pass/fail”.

---

## 1. Warstwa Orkiestracji (LangGraph / Agent Framework)

### 1.1. Graph jako „source of truth”

- [ ] `graphs/pumo_guide_graph` istnieje i opisuje pełny przepływ:
  - Wejście: zapytanie użytkownika + kontekst.
  - Ścieżki: `fast_path`, `expert_path`, `hybrid_path` (MoE).[file:49]
  - Wyjście: finalna odpowiedź + metryki (latency, koszt, confidence).
- [ ] CAŁY przepływ (nie tylko LLM) jest zdefiniowany w jednym miejscu (graph), a nie rozlany po wielu serwisach.
- [ ] Istnieje diagram (ASCII / Mermaid / obrazek) w `WORKFLOW_ARCHITECTURE/README.md`, który odzwierciedla rzeczywistą implementację.[file:49]

### 1.2. Router i MoE‑gate

- [ ] `LANGGRAPH ROUTER` / główny router ma jasno opisane:
  - kryteria wyboru ścieżki fast / expert / hybrid,[file:49]
  - jakie feature’y (task_type, complexity_score, user_tier) bierze pod uwagę.
- [ ] MoE‑gate ma _na start_ prostą heurystykę (if‑y), a nie ML, ale jest zaprojektowany tak, aby później podmienić go na model.
- [ ] W README jest tabela: „Typ zapytania → ścieżka → docelowy LLM”.

---

## 2. Warstwa LLM – Fast & Reasoning

### 2.1. Fast LLM (Llama 3.1 8B @ Groq)

- [ ] Jest zdefiniowany provider `llm_fast` (np. `llama-3.1-8b-instant`) z:
  - timeout,
  - retry policy,
  - loggingiem tokenów i latency.[web:34][web:38]
- [ ] `fast_path` obsługuje:
  - FAQ,
  - proste porównania,
  - rewrite / parafrazy,
  - routing / klasyfikację zapytania.
- [ ] p95 latency dla `fast_path` < **1.5 s** dla typowych zapytań (zmierzone na 50+ sample).[web:36][web:38]

### 2.2. Reasoning LLM (OpenAI o3 / o3‑mini)

- [ ] Jest zdefiniowany provider `llm_reasoning` (o3 / o3‑mini):
  - używany TYLKO z węzłów oznaczonych jako „hard mode”.[web:18][web:21]
- [ ] `reasoning_policy`:
  - ma konfigurację przez ENV (max_cost_per_request, allowed_tasks),
  - loguje każde użycie reasoning (flagą + koszt).[web:46]
- [ ] Dla zestawu 30–50 „trudnych” zapytań:
  - widać wzrost jakości względem fast modelu,
  - dodatkowy koszt reasoning jest policzony i zapisany w raporcie.

---

## 3. MoE‑RAG + Retrieval

### 3.1. Indeksy i ścieżki RAG

- [ ] Jest rozróżnienie:
  - RAG Simple (1 indeks PUMO Guide),
  - RAG Deep (3+ indeksy / źródła, np. PUMO + blog + dokumentacja techniczna).[file:49]
- [ ] Każda ścieżka w grafie ma jasno przypisany zestaw indeksów:
  - w kodzie (config),
  - w dokumentacji (tabela „Ścieżka → Indeksy → Use‑case”).

### 3.2. Chunking + metadata

- [ ] Zaimplementowane chunkowanie:
  - sekcje „Przewodnik Zakupowy” = pojedyncze chunki,
  - FAQ = osobne chunki z typem `faq`.[file:31]
- [ ] Każdy wynik RAG zawiera:
  - category_slug, section_type, price_range, product_count, brands.[file:31]
- [ ] Retrieval jest testowany:
  - 20–30 zapytań ręcznie ocenionych (czy kontekst jest trafny),
  - zapisane w `RAG_EVAL.md`.

---

## 4. Integracja z Agentami (18 agentów + PUMO)

### 4.1. Agent Dispatcher

- [ ] Istnieje komponent `AGENT DISPATCH`:
  - mapping: typ zadania → który z 18 agentów ma być zawołany,[file:49]
  - zasady, kiedy łączyć kilku agentów (np. research + writer + SEO).
- [ ] Każdy agent ma opis:
  - rola,
  - wejście/wyjście (kontrakt),
  - ograniczenia (czas, koszty).

### 4.2. PUMO e‑commerce jako „first‑class citizen”

- [ ] PUMO ma:
  - własne narzędzia w grafie (search, fetch category, fetch product),[file:31]
  - własne agenty, jeśli potrzebne (np. „PUMO Advisor”).
- [ ] Integracja PUMO jest opisana w:
  - `PUMO_GUIDE_UPGRADE_PLAN.md` (co już masz),[file:31]
  - + krótkim tech‑docu: `PUMO_ARCHITECTURE_INTEGRATION.md` (krok po kroku flow agenta).

---

## 5. Niefunkcjonalne: Latency, Koszt, Bezpieczeństwo

### 5.1. Metryki i monitoring

- [ ] Jest co najmniej jeden endpoint / dashboard (`/api/pumo-agent-metrics` / Grafana / CF Analytics), który pokazuje:
  - p50/p95/p99 latency per ścieżka (fast / expert / hybrid),
  - udział zapytań z reasoning,
  - koszt per 1000 zapytań (fast vs reasoning).[file:31][web:17]
- [ ] Dla każdego deployu:
  - masz baseline i porównanie (czy nie pogorszyłeś latency / kosztu).

### 5.2. Degradacja i fallback

- [ ] Jeśli reasoning LLM jest niedostępny / za drogi:
  - system automatycznie przełącza się na `fast_path` z ostrzeżeniem w logach,
  - użytkownik nadal dostaje odpowiedź (gorszą jakościowo, ale na czas).
- [ ] Jest opisany plan fallback (blue/green, ręczne wyłączenie reasoning) w `RISK_MANAGEMENT` (może być link do istniejącej sekcji w planach).[file:31][file:49]

---

## 6. Deployment & Operacje

### 6.1. Topologia wdrożenia

- [ ] Istnieje diagram / opis:
  - gdzie stoi LangGraph (Python),
  - gdzie stoi front / Astro / API PUMO,
  - które usługi są stateful (vector DB, cache),
  - gdzie wchodzi ruch zewnętrzny (Cloudflare, proxy).[file:49]
- [ ] Deployment:
  - ma przynajmniej prosty `Dockerfile` + `docker-compose` / manifest K8s (dla części Python),
  - jest opisane, jak zrobić lokalny environment (dev) i staging.

### 6.2. Canary / rollout

- [ ] Istnieje procedura „włączania” agent‑stacku na procent ruchu:
  - env flag / feature flag w routerze (np. `USE_AGENT_STACK_PERCENT`),
  - opisane w `DEPLOYMENT_STRATEGY.md`.
- [ ] Masz checklistę „pre‑deploy” i „post‑deploy” (część może pochodzić ze środowych planów – wykorzystaj to, co już jest).[file:31][file:49]

---

## 7. Jakość odpowiedzi i ewaluacja

### 7.1. Zbiór testowy

- [ ] Istnieje `PUMO_TEST_SUITE.md` albo `.json` z:
  - min. 30–50 reprezentatywnymi zapytaniami,
  - oczekiwanym typem odpowiedzi (np. porównanie, rekomendacja, FAQ).
- [ ] Co najmniej raz zmierzono:
  - jakość stary RAG vs nowy agent graph vs agent graph + reasoning,
  - wyniki są zapisane (np. tabela: score 1–5 + koszt).

### 7.2. Kryteria „gotowości architekta”

- [ ] Masz własne KPI:
  - np. „p95 latency < 4s”, „średni koszt < X USD / 1k zapytań”, „≥ 80% zapytań poprawnie obsłużonych fast path”.
- [ ] Jako architekt potrafisz na podstawie logów:
  - zlokalizować bottlenecks,
  - podjąć decyzję: „wyłączamy / włączamy reasoning dla tej klasy zadań”.

---

## 8. Status – szybki przegląd

(Ten bloczek uzupełniasz ręcznie raz na tydzień)

```markdown
### Aktualny status (data: YYYY-MM-DD)

- Orkiestracja (graph):        ✅/⏳/❌
- Fast LLM (Groq, 3.1 8B):     ✅/⏳/❌
- Reasoning LLM (o3):          ✅/⏳/❌
- MoE-RAG (multi-index):       ✅/⏳/❌
- Integracja 18 agentów:       ✅/⏳/❌
- PUMO jako first-class:       ✅/⏳/❌
- Monitoring & metrics:        ✅/⏳/❌
- Canary / rollback:           ✅/⏳/❌
- Test suite & eval:           ✅/⏳/❌
```


---

## 9. Definition of Done (Architecture‑Ready)

System jest „Architecture‑Ready”, jeśli:

- Min. 90% checkboxów z sekcji 1–7 jest ✅.
- Dla 30–50 testowych zapytań agent graph + routing (fast + reasoning) ma:
    - wyższą jakość niż stary RAG,
    - akceptowalny p95 latency,
    - akceptowalny koszt (wg Twoich KPI).
- Masz aktualny, jednolity opis architektury (ten plik + WORKFLOW_ARCHITECTURE/*) i potrafisz go wyjaśnić innej osobie technicznej w 15 minut.

```
<span style="display:none">[^1][^2][^3][^4]</span>

<div align="center">⁂</div>

[^1]: PUMO_GUIDE_UPGRADE_PLAN.md
[^2]: PHASE_3.md
[^3]: PHASE_2.md
[^4]: PHASE_1.md```

