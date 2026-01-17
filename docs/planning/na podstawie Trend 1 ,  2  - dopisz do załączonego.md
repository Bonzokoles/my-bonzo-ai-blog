<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# na podstawie Trend 1 ,  2  - dopisz do załączonego dokumenty dodatkowe instrukcje dla ulepszenia systemu, chce mieć: 1) framework open‑source do agentów, który możesz sam hostować, 2) pełny komercyjny stack reasoningowy z gwarancjami SLA. używamy zarówno darmowych jak i płatnych rozwiązań , jesli nie chcesz tworzyc całego planu to rozpisz tylko moiejsca gdzie co wzbogacic

Dodaj do planu po prostu nowe podsekcje – poniżej masz **gotowe fragmenty**, które możesz wkleić w odpowiednie miejsca (Sekcja 4–6) i potem doprecyzować stack (konkretne modele / providera).

***

## 🔧 Sekcja 4 – Warstwa Semantyczna LLM/RAG: rozszerzenia pod agentów + reasoning

### 4.3: Warstwa Orkiestracji Agentów (OSS) – „RAG as a Graph”

**Cel:** przejście z pojedynczego pipeline’u RAG do **grafu z agentami**, który później łatwo podłączyć pod reasoning‑model Pro.[^1][^2]

**Dopisz blok do SEKCJI 4:**

```markdown
#### Krok 4.3: Warstwa Orkiestracji Agentów (Priorytet: HIGH)

**Czas: 3–4 dni (MVP)**

**Cel:** Zastąpić „sztywny” pipeline RAG grafem kroków (agents + tools), który można podpiąć pod różne LLM (open-source + komercyjne).

**Decyzja architektoniczna:**
- Framework OSS (self-hosted): `Microsoft Agent Framework` / `LangGraph` jako główny orkiestrator.
- Tryb pracy: single-tenant (tylko Pumo Guide), później multi-tenant.

**Nowe komponenty:**

- [ ] `agents/pumo/planner.ts`
- [ ] `agents/pumo/retriever-agent.ts`
- [ ] `agents/pumo/reasoner-agent.ts`
- [ ] `agents/pumo/recommender-agent.ts`
- [ ] `graphs/pumo/pumo_guide_graph.ts`

**Minimalny graf:**

1. `planner-agent`
   - Wejście: naturalne pytanie użytkownika (`query`, kontekst usera).
   - Wyjście: plan w JSON (typy kroków: `search`, `filter`, `compare`, `explain`).

2. `retriever-agent` (RAG)
   - Integracja z istniejącym `pumo-search` / wektorowym backendem.
   - Zwraca 3–10 chunków + metadata (cena, kategoria, marka).

3. `reasoner-agent`
   - W wersji OSS: standardowy LLM (np. tańszy model) z promptem ReAct.
   - W wersji PRO: reasoning model (patrz Sekcja 5 – Stack Pro).
   - Łączy kontekst z retrievera i planu, wylicza wstępne rekomendacje.

4. `recommender-agent`
   - Odpowiada za finalny format (tabela, listy, CTA + linki z UTM).

**Definicja Done:**
- Jeden endpoint `/api/pumo-agent` korzysta z grafu agentów (zamiast prostego RAG).
- Logujesz:
  - liczbę kroków,
  - p50/p95/p99 latency,
  - liczbę tokenów per agent.
```


***

## 🤖 Sekcja 5 – Integracja z agentami: dodaj OSS framework + reasoning stack

### 5.4: Konkretny OSS Framework dla Agentów (self‑hosted)

**Dodaj podsekcję do SEKCJI 5:**

```markdown
#### Krok 5.4: Wybór i wdrożenie frameworka agentowego OSS (Priorytet: HIGH)

**Cel:** Mieć *jeden* centralny framework agentowy, który można samemu hostować i podpinać pod wielu providerów.

**Kandydaci (do decyzji w README):**
- `Microsoft Agent Framework` – .NET/Python, focus na multi-agent + orkiestrację enterprise.
- `LangGraph` – Python, dojrzały ekosystem, dobre wsparcie dla agentic workflows.

**Wymagania funkcjonalne:**
- Obsługa grafów kroków (DAG) + pętli kontrolowanych (Reflexion).
- Łatwy routing do wielu LLM (fast + reasoning).
- Hooki do logowania: czasy, tokeny, decyzje routera.

**Implementation notes (do dopisania w WORKFLOW_ARCHITECTURE/README.md):**
- [ ] Stworzyć `AGENT_ORCHESTRATION.md` z opisem:
  - jakie role ma każdy agent Pumo Guide,
  - jakie narzędzia (API / search / kalkulatory) może wołać,
  - który krok może eskalować do reasoning modelu (Pro).
- [ ] Dodać osobną sekcję "LLM Providers":
  - `llm_fast` – tani model (np. open-source przez własny inference / Cloud),
  - `llm_reasoning` – komercyjny model reasoning (patrz Sekcja 5.5).
```


### 5.5: Pełny komercyjny stack reasoningowy (SLA)

**Na bazie Trend 2 chcesz mieć reasoning‑model jako *węzeł specjalny* w grafie, nie jako default.**[^3][^4]

```markdown
#### Krok 5.5: Reasoning Engine (Pro) jako węzeł w grafie

**Cel:** Podłączyć komercyjny model reasoning (np. OpenAI o3) jako selektywny „hard mode” node w grafie agentów.

**Założenia:**
- Reasoning używany tylko gdy:
  - planner oznaczy zadanie jako `complex` (np. porównania wielu parametrów, złożone trade-offy),
  - lub gdy fast model zwróci niski confidence.
- Musimy mieć SLA: p95 latency + limit kosztu per zapytanie.

**Nowe elementy:**

- [ ] `llm_providers/reasoning_client.ts`
  - Klient do API (o3 / inny model)
  - Obsługa parametrów controlling „thinking depth” / reasoning mode.
  - Circuit breaker (górny limit tokenów, timeout).

- [ ] `policies/reasoning_policy.ts`
  - Funkcja `should_use_reasoning(task_metadata, fast_model_score) -> boolean`.
  - Możliwość konfiguracji progiem w ENV (np. `REASONING_MAX_COST`, `REASONING_ALLOWED_TYPES`).

- [ ] Logging:
  - logujesz osobno „thinking tokens” / koszt reasoning,
  - przygotowujesz metrykę: `accuracy_gain / extra_cost`.

**Definition of Done:**
- Endpoint `/api/pumo-agent`:
  - działa w 2 wariantach:
    - `mode=fast` → tylko fast model,
    - `mode=auto` → router może użyć reasoning.
  - w logach widzisz udział zapytań, które eskalowały do reasoning + ich koszt.
```


***

## 📊 Sekcja 6 – Backlog Funkcji: dopisz taski pod OSS + reasoning

Dodaj do tabeli / listy w SEKCJI 6:

```markdown
## Nowe zadania – Agent Orchestration (OSS) + Reasoning Stack

### Quick Wins (1–2 dni)

- [ ] **5.4.1** AGENT_ORCHESTRATION.md (1 dzień)
  - Impact: ⭐⭐⭐⭐ (klarowna rola każdego agenta, baza pod framework)
  - Difficulty: ⭐⭐
  - Files: WORKFLOW_ARCHITECTURE/AGENT_ORCHESTRATION.md

### Średnie Zadania (3–5 dni)

- [ ] **4.3** Warstwa Orkiestracji Agentów (MVP graf) (3–4 dni)
  - Impact: ⭐⭐⭐⭐⭐ (przejście z RAG-pipeline na agent graph)
  - Difficulty: ⭐⭐⭐⭐
  - Files: agents/pumo/*, graphs/pumo_guide_graph.ts, api/pumo-agent.ts

- [ ] **5.5** Reasoning Engine Node (2–3 dni)
  - Impact: ⭐⭐⭐⭐⭐ (podpięcie komercyjnego reasoning modelu z SLA)
  - Difficulty: ⭐⭐⭐
  - Files: llm_providers/reasoning_client.ts, policies/reasoning_policy.ts

### Długoterminowe (1–2 tygodnie)

- [ ] **6.x** Metryki „Utility vs Cost” dla reasoning
  - Impact: ⭐⭐⭐⭐ (świadome użycie drogich modeli)
  - Difficulty: ⭐⭐⭐⭐
  - Deliverable: raport z porównaniem:
    - `fast-only` vs `reasoning-only` vs `auto-policy`
    - metryki: accuracy tasku, p95 latency, koszt per zapytanie.
```


***

Jeśli chcesz, w kolejnym kroku można doprecyzować konkretny stack (np. „LangGraph + Groq Llama 3.1 8B jako fast model + OpenAI o3 jako reasoning”) i dopisać gotowe snippet‑y konfiguracji providerów.
<span style="display:none">[^5]</span>

<div align="center">⁂</div>

[^1]: https://arxiv.org/html/2601.01743v1

[^2]: https://arxiv.org/html/2404.11584v1

[^3]: https://www.infoq.com/news/2025/02/openai-o3-mini/

[^4]: https://openai.com/index/introducing-o3-and-o4-mini/

[^5]: PUMO_GUIDE_UPGRADE_PLAN.md

