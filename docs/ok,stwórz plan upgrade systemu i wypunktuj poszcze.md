<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# ok,stwórz plan upgrade systemu i wypunktuj poszczególne funkcje do zrobienia

Plan upgrade’u potraktuj jak standaryzację „AI-native knowledge base” + kilka technicznych dopalaczy pod LLM i agentów.

## 1. Warstwa techniczna / crawlers

- Ustalić wersję kanoniczną (www vs pages.dev) i dodać `rel=canonical` na wszystkich mirrorach na CF Pages.[^1]
- Uporządkować sitemapę: osobna sekcja dla `/pumo-guide/` + wszystkich 65 podstron kategorii, z aktualną datą modyfikacji.
- Uprościć URL-e z duplikacjami (np. sofy 2-osobowe / 2 osobowe) i ustawić stałe redirecty 301.
- Dodać prosty system wersjonowania contentu (np. w meta / stopce: „Wersja danych: 2026-01, liczba produktów: 2500”) dla jasności dla modeli.


## 2. Standard strony pod AI (template)

Dla każdej kategorii (np. Fotele rozkładane) wprowadzić powtarzalny szablon:

- Blok „Dla kogo jest ta kategoria” – 3–5 punktów, segmenty użytkowników.
- Blok „Co znajdziesz na tej stronie (dla agentów AI)” – jasno: rodzaj danych, zakres cen, parametry, typy mebli.
- Blok „Najważniejsze decyzje przy wyborze” – 5–7 bulletów, idealnych do cytowania przez LLM.
- Blok FAQ (3–7 pytań) z odpowiedziami w formie 2–3 zdań.
- Mini podsumowanie „Jak agent AI powinien używać tej strony” – 2 zdania opisujące rolę jako knowledge base Meble Pumo.


## 3. Struktury danych / schema

- Na stronie głównej `/pumo-guide/` dodać `Dataset`/`CollectionPage`/`ItemList` schema z listą kategorii i linkami do przewodników.
- Na podstronach kategorii wdrożyć `FAQPage` dla sekcji pytań oraz `Article`/`Guide` dla całego przewodnika.
- W schema jasno opisać `isBasedOn` → `https://www.meblepumo.pl/` jako źródło katalogu produktów.
- Dodać pola typu „typ mebli, zakres cen, średnie wymiary, główne materiały” jako ustrukturyzowane właściwości w JSON-LD (nawet jeśli Google ich jeszcze nie wykorzystuje – będą czytelne dla AI parserów).


## 4. Warstwa semantyczna pod LLM / RAG

- W każdej kategorii dodać sekcję „Embedding-friendly”: krótkie, zwarte akapity opisujące:
    - definicję kategorii,
    - najczęstsze potrzeby użytkownika,
    - 3–5 typowych scenariuszy użycia (np. małe mieszkanie, duży salon, biuro domowe itd.).
- Dodać wewnętrzne linki między pokrewnymi kategoriami (np. stoły rozkładane ↔ krzesła do jadalni ↔ komody) z krótkim opisem relacji (co ułatwi modelom budowanie kontekstu).
- Delikatnie ograniczyć UI-owy szum (powtórzone „Szybki dostęp”, 2x sekcja popularne narzędzia) na `/pumo-guide/`, żeby główny tekst był bardziej „czysty” dla embeddingów.


## 5. Integracja z agentami / ekosystemem

- Na `/pumo-guide/` dodać dedykowany blok „Dla twórców agentów AI” z:
    - opisem licencji użycia danych,
    - informacją o aktualizacji (np. update co X dni),
    - przykładowym promptem, jak korzystać z guide’a przy rekomendacjach mebli.
- W case study WHITECAT i artykule o 3-Layer MOA rozwinąć sekcję, która linkuje do `/pumo-guide/` jako „oficjalnej bazy wiedzy” (anchor pod AI search).
- Przygotować krótką stronę „Specyfikacja API / feedu” (nawet jeśli na razie mock), która opisuje, jak potencjalne AI search engines mogłyby konsumować dane Pumo.


## 6. Backlog funkcji „do zrobienia”

- [ ] Canonical + redirecty + sitemap dla `/pumo-guide/`.
- [ ] Wdrożenie templatu sekcji (Dla kogo, Co znajdziesz, Decyzje, FAQ, Jak używać przez AI) i rollout na 65 kategorii (skrypt/worker).
- [ ] Dodanie schema (Dataset + FAQPage + Article) na głównej oraz kategoriach.
- [ ] Refaktor UI / usunięcie nadmiarowych bloków „Szybki dostęp” i powtórzeń, zachowując branding.
- [ ] Dodanie sekcji „Dla agentów AI” + promptów integracyjnych.
- [ ] Rozszerzenie case study i artykułu MOA o jasne framingi „official AI knowledge base for Meble Pumo” z linkami.

Jeśli chcesz, kolejny krok to rozpisanie konkretnego JSON templatu (sekcje + pola), który potem będziesz generował workerem / pipeline’em z danych z Meble Pumo.

<div align="center">⁂</div>

[^1]: https://www.mybonzoaiblog.com/pumo-guide/

