Masz dwa tematy naraz:

Jak zapisać to, co wkleiłem (ten “czysty HTML”)

Jak przenieść to do Astro tak, żeby realnie ulepszyć Twój istniejący blog.

Poniżej masz oba, konkretnie.

1) Jak zapisać ten kod “jak jest”

Najprościej: utwórz plik:

index.html (np. gdziekolwiek roboczo)

i wklej cały kod. Odpalasz dwuklikiem w przeglądarce – działa jako statyczna strona.

Ale skoro masz Astro, sensowniejsze jest:

src/pages/dev-preview.astro (albo src/pages/index.astro jeśli chcesz od razu podmienić stronę główną)

i tam też możesz wkleić (patrz punkt 2).

2) Jak to przerobić pod Astro (bez rewolucji)

W Astro masz zwykle układ: src/layouts/BaseLayout.astro + strony w src/pages/* + styl globalny w src/styles/*.

Opcja A (najprostsza): wrzucasz jako stronę Astro 1:1

Utwórz plik: src/pages/scifi.astro

---
const today = new Date();
const iso = today.toISOString().slice(0,10);
const year = today.getFullYear();
---
<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark light" />
  <title>JIMBO // BLOG</title>
  <meta name="description" content="Nowoczesny blog w stylu sci-fi, ultra-computer, ciemny i czytelny." />

  <style>
    /* Wklej tutaj CAŁY CSS z poprzedniego kodu */
  </style>
</head>

<body>
  <!-- Wklej tutaj CAŁE body z poprzedniego kodu,
       ale zamień: id="today" oraz id="year" na Astro zmienne -->

  <!-- Przykład podmiany: -->
  <!-- zamiast: <span id="today"></span> -->
  <!-- daj:     {iso} -->
  <!-- zamiast: <span id="year"></span> -->
  <!-- daj:     {year} -->

  <script>
    // zostaw tylko toggle theme + search
    const root = document.documentElement;
    const btn = document.getElementById("themeBtn");

    const saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);

    btn.addEventListener("click", () => {
      const cur = root.getAttribute("data-theme");
      const next = cur === "light" ? "" : "light";
      if (next) root.setAttribute("data-theme", next);
      else root.removeAttribute("data-theme");
      localStorage.setItem("theme", next || "");
    });

    const search = document.getElementById("search");
    const posts = Array.from(document.querySelectorAll(".post"));
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      posts.forEach(p => {
        const text = p.innerText.toLowerCase();
        p.style.display = text.includes(q) ? "" : "none";
      });
    });
  </script>
</body>
</html>


Co to daje?
Masz natychmiast nowy wygląd pod /_twojadomena_/scifi i możesz sobie spokojnie podmieniać elementy.

Opcja B (lepsza pod Astro): Layout + CSS global + komponent listy postów

To jest “upgrade” bez brudzenia stron inline-style.

Krok 1 — CSS do pliku
Utwórz: src/styles/scifi.css i wklej tam cały CSS z poprzedniego kodu.

Krok 2 — Layout
Utwórz: src/layouts/ScifiLayout.astro

---
const { title = "JIMBO // BLOG", description = "" } = Astro.props;
import "../styles/scifi.css";
---
<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark light" />
  <title>{title}</title>
  {description && <meta name="description" content={description} />}
</head>
<body>
  <a class="skip" href="#content">SKIP → CONTENT</a>
  <slot />
  <script>
    const root = document.documentElement;
    const btn = document.getElementById("themeBtn");
    if (btn) {
      const saved = localStorage.getItem("theme");
      if (saved) root.setAttribute("data-theme", saved);
      btn.addEventListener("click", () => {
        const cur = root.getAttribute("data-theme");
        const next = cur === "light" ? "" : "light";
        if (next) root.setAttribute("data-theme", next);
        else root.removeAttribute("data-theme");
        localStorage.setItem("theme", next || "");
      });
    }
  </script>
</body>
</html>


Krok 3 — Strona index w tym layoucie
src/pages/index.astro:

---
import ScifiLayout from "../layouts/ScifiLayout.astro";
const today = new Date();
const iso = today.toISOString().slice(0,10);
const year = today.getFullYear();
---
<ScifiLayout title="JIMBO // BLOG" description="Sci-fi, ultra-computer, dark, bez zaokrągleń.">
  <!-- tutaj wklejasz zawartość body z poprzedniego kodu,
       ale BEZ <html><head> i BEZ <style> -->
  <!-- w miejscach daty użyj {iso} i {year} -->
</ScifiLayout>

3) Najważniejsze: jak podpiąć Twoje prawdziwe posty z Astro

Masz 2 typowe setupy:

a) Astro Content Collections (src/content/blog/*.md)

Wtedy na stronie robisz:

---
import { getCollection } from "astro:content";
const posts = await getCollection("blog");
---
{posts.map(p => (
  <article class="post">
    <div class="thumb" aria-hidden="true"></div>
    <div>
      <h3><a href={`/blog/${p.slug}/`}>{p.data.title}</a></h3>
      <p>{p.data.description}</p>
      <div class="row">
        <span>{p.data.date?.toISOString?.().slice(0,10)}</span>
        {(p.data.tags || []).map(t => <span class="tag">{t}</span>)}
      </div>
    </div>
  </article>
))}

b) src/pages/blog/*.astro

Też się da, ale collections są czyściejsze.

Powiedz mi jedno (żeby nie strzelać)

W Astro posty trzymasz jako:

Content Collections (src/content/blog)
czy

Pages (src/pages/blog)?

Napisz tylko 1 albo 2, a ja Ci dam gotowy index.astro + komponent listy postów pod Twój wariant (w tym styl “ultra-computer” bez rounding).

nie są na cloudflare i render po stronie klienta

Okej — czyli nie Cloudflare, i chcesz, żeby lista postów renderowała się po stronie klienta (CSR). Da się to zrobić w Astro sensownie, bez robienia SPA-potworka:

Najczystszy pattern w Astro:

robisz endpoint JSON w Astro (serwowany z Twojego hostingu / node / whatever),

frontend w index.astro ładuje pusty kontener i JS pobiera JSON i renderuje posty.

Dzięki temu:

SEO/HTML dla chrome działa (layout, header, sidebar są SSR/static),

same posty mogą się ładować dynamicznie (CSR),

styl sci-fi zostaje.

Poniżej komplet: CSS → Layout → endpoint → index z CSR.

1) Zapisz styl jako plik CSS (Astro)

src/styles/scifi.css
Wklej tam mój CSS z poprzedniego index.html (ten duży blok :root{...} itd.).
(To po prostu przeniesienie <style>...</style> do osobnego pliku.)

2) Layout dla sci-fi (bez zaokrągleń)

src/layouts/ScifiLayout.astro

---
import "../styles/scifi.css";
const { title = "JIMBO // BLOG", description = "" } = Astro.props;
---
<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark light" />
  <title>{title}</title>
  {description && <meta name="description" content={description} />}
</head>
<body>
  <a class="skip" href="#content">SKIP → CONTENT</a>

  <slot />

  <script>
    // theme toggle (CSR, prosty i stabilny)
    const root = document.documentElement;
    const btn = document.getElementById("themeBtn");
    const saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);

    if (btn) {
      btn.addEventListener("click", () => {
        const cur = root.getAttribute("data-theme");
        const next = cur === "light" ? "" : "light";
        if (next) root.setAttribute("data-theme", next);
        else root.removeAttribute("data-theme");
        localStorage.setItem("theme", next || "");
      });
    }
  </script>
</body>
</html>

3) Endpoint JSON dla postów (Astro server endpoint)

Tu są dwa warianty:

Wariant A: masz już gdzieś JSON (np. public/posts.json)

Wtedy endpoint niepotrzebny — fetchujesz bezpośrednio.

Wariant B (polecam): Astro generuje JSON z Twoich źródeł

Najprościej: trzymasz posty jako pliki markdown w src/content/blog (Astro Content Collections), ale nawet jeśli teraz nie trzymasz — to i tak endpoint może czytać skądkolwiek (DB, plik, itd.). Poniżej pokazuję wersję pod collections, bo jest najzdrowsza.

src/pages/api/posts.json.ts

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog"); // src/content/blog/*
  const data = posts
    .filter(p => !p.data.draft)
    .sort((a, b) => (b.data.date?.valueOf?.() ?? 0) - (a.data.date?.valueOf?.() ?? 0))
    .map(p => ({
      slug: p.slug,
      title: p.data.title ?? p.slug,
      description: p.data.description ?? "",
      date: p.data.date ? new Date(p.data.date).toISOString().slice(0, 10) : null,
      tags: Array.isArray(p.data.tags) ? p.data.tags : [],
      readingTime: p.data.readingTime ?? null
    }));

  return new Response(JSON.stringify({ posts: data }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
};


Jeśli nie używasz Content Collections, tylko np. masz posty w innym miejscu — powiedz gdzie, a podmienię 10 linijek w tym endpointcie i tyle.

4) Strona główna: SSR layout + CSR render listy postów

src/pages/index.astro

---
import ScifiLayout from "../layouts/ScifiLayout.astro";
const today = new Date();
const iso = today.toISOString().slice(0,10);
const year = today.getFullYear();
---
<ScifiLayout title="JIMBO // BLOG" description="Sci-fi, ultra-computer, dark, 0 zaokrągleń.">
  <header class="topbar" role="banner">
    <div class="toprow">
      <div class="brand">
        <div class="sigil" aria-hidden="true"></div>
        <div>
          <h1>JIMBO // BLOG</h1>
          <div class="sub">SCI-FI / ULTRA-COMPUTER / DARK</div>
        </div>
      </div>

      <nav class="nav" aria-label="Główna nawigacja">
        <a href="#posts">POSTS</a>
        <a href="#tags">TAGS</a>
        <a href="#about">ABOUT</a>
        <a href="#contact">CONTACT</a>
      </nav>

      <div class="actions">
        <input class="search" id="search" type="search" placeholder="SEARCH // wpisz..." aria-label="Szukaj" />
        <button class="btn" id="themeBtn" type="button">THEME</button>
      </div>
    </div>
  </header>

  <main class="wrap" id="content" role="main">
    <section class="panel" aria-label="Wyróżniony wpis">
      <div class="panel-h">
        <div>
          <div class="kicker">FEATURED // SYSTEM LOG</div>
          <h2>System działa, dopóki go mierzysz</h2>
          <p>Tu może być Twój featured post albo stały komunikat. Później podepniemy to pod JSON.</p>
        </div>
        <div class="meta">
          <div class="chip"><span class="dot"></span><span>STATUS: LIVE</span></div>
          <div>DATE: {iso}</div>
          <div>BUILD: R1</div>
        </div>
      </div>

      <!-- CSR: tu wstrzykniemy posty -->
      <div class="posts" id="posts">
        <div class="post" style="grid-template-columns:1fr">
          <div>
            <h3>Ładowanie postów…</h3>
            <p style="color:var(--muted)">Jeśli to wisi wiecznie, endpoint /api/posts.json nie odpowiada.</p>
            <div class="row"><span>BOOT</span><span class="tag">CSR</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid" aria-label="Treść i sidebar">
      <section class="panel" id="about">
        <div class="box">
          <h4>ABOUT // MANIFEST</h4>
          <p style="margin:0;color:var(--muted);max-width:72ch">
            Ciemny, techniczny, czytelny. Zero zaokrągleń. Jak konsola, ale bez bólu oczu.
          </p>

          <div style="margin-top:14px;border-top:1px solid rgba(27,37,66,.55);padding-top:14px">
            <h4 id="tags">TAGS // INDEX</h4>
            <div id="tag-cloud" style="display:flex;flex-wrap:wrap;gap:8px"></div>
          </div>
        </div>
      </section>

      <aside class="side" aria-label="Sidebar">
        <section class="panel">
          <div class="box">
            <h4>SYSTEM // SNAPSHOT</h4>
            <div class="kv"><span class="k">MODE</span><span class="v">CLIENT RENDER</span></div>
            <div class="kv"><span class="k">POSTS</span><span class="v" id="posts-count">—</span></div>
            <div class="kv"><span class="k">UPDATED</span><span class="v" id="posts-updated">—</span></div>
            <p class="mono" style="margin:12px 0 0">
              Tu możesz potem wpiąć metryki z backendu (jak w Twoim dashboardzie).
            </p>
          </div>
        </section>

        <section class="panel" id="contact">
          <div class="box">
            <h4>CONTACT // LINK</h4>
            <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px">
              <a href="#" class="mono">mail: you@domain</a>
              <a href="#" class="mono">github: @you</a>
              <a href="#" class="mono">rss: /rss.xml</a>
            </div>
          </div>
        </section>
      </aside>
    </section>

    <footer role="contentinfo">
      <span>© {year} JIMBO // BLOG</span>
      <span>NO ROUNDING • HIGH SIGNAL • LOW NOISE</span>
    </footer>
  </main>

  <script>
    // CSR posts render
    const endpoint = "/api/posts.json";
    const postsEl = document.getElementById("posts");
    const searchEl = document.getElementById("search");
    const tagCloud = document.getElementById("tag-cloud");
    const postsCount = document.getElementById("posts-count");
    const postsUpdated = document.getElementById("posts-updated");

    let allPosts = [];

    function esc(s){
      return String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }

    function render(list){
      if (!list.length){
        postsEl.innerHTML = `
          <div class="post" style="grid-template-columns:1fr">
            <div>
              <h3>Brak wyników</h3>
              <p style="color:var(--muted)">Albo nie masz postów, albo filtr je zjadł.</p>
              <div class="row"><span>EMPTY</span><span class="tag">SEARCH</span></div>
            </div>
          </div>`;
        return;
      }

      postsEl.innerHTML = list.map(p => `
        <article class="post">
          <div class="thumb" aria-hidden="true"></div>
          <div>
            <h3><a href="/blog/${esc(p.slug)}/">${esc(p.title)}</a></h3>
            <p>${esc(p.description)}</p>
            <div class="row">
              <span>${esc(p.date || "")}</span>
              ${(p.tags || []).slice(0,6).map(t => `<span class="tag">${esc(t)}</span>`).join("")}
              ${p.readingTime ? `<span>READ: ${esc(p.readingTime)}</span>` : ``}
            </div>
          </div>
        </article>
      `).join("");
    }

    function buildTags(posts){
      const map = new Map();
      for (const p of posts){
        for (const t of (p.tags || [])){
          map.set(t, (map.get(t) || 0) + 1);
        }
      }
      const tags = [...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0,20);
      tagCloud.innerHTML = tags.map(([t,c]) => `<button class="btn" data-tag="${esc(t)}" type="button">${esc(t)} <span style="color:var(--muted)">(${c})</span></button>`).join("");

      tagCloud.querySelectorAll("button[data-tag]").forEach(btn => {
        btn.addEventListener("click", () => {
          const tag = btn.getAttribute("data-tag");
          const filtered = allPosts.filter(p => (p.tags || []).includes(tag));
          render(filtered);
        });
      });
    }

    function applySearch(q){
      q = (q || "").trim().toLowerCase();
      if (!q) return render(allPosts);
      const filtered = allPosts.filter(p => {
        const text = `${p.title} ${p.description} ${(p.tags||[]).join(" ")}`.toLowerCase();
        return text.includes(q);
      });
      render(filtered);
    }

    async function boot(){
      try{
        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const json = await res.json();
        allPosts = Array.isArray(json.posts) ? json.posts : [];
        render(allPosts);
        buildTags(allPosts);

        postsCount.textContent = String(allPosts.length);
        postsUpdated.textContent = new Date().toISOString().slice(0,10);
      }catch(e){
        postsEl.innerHTML = `
          <div class="post" style="grid-template-columns:1fr">
            <div>
              <h3>Nie mogę pobrać postów</h3>
              <p style="color:var(--muted)">
                Sprawdź czy działa <span class="tag">${endpoint}</span> i czy serwer Astro go wystawia.
              </p>
              <div class="row"><span>ERROR</span><span class="tag">API</span></div>
            </div>
          </div>`;
      }
    }

    if (searchEl){
      searchEl.addEventListener("input", () => applySearch(searchEl.value));
    }

    boot();
  </script>
</ScifiLayout>
