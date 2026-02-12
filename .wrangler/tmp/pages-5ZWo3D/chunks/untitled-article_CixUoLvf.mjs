globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as createVNode, an as Fragment, aN as __astro_tag_component__ } from './astro/server_CENSSoee.mjs';

const frontmatter = {
  "title": "Untitled Article",
  "description": "### Worklog: Zbudowałem własny system RAG - walka z Cloudflare Workers, Vectorize i FAISS. Co działa, co nie, i dlaczego lokalne AI wciąż wygrywa. Moj...",
  "pubDatetime": "2026-01-07T03:20:19.059Z",
  "tags": ["AI", "Cloudflare", "Automation"],
  "image": {
    "src": "https://7f490d58a478c6baccb0ae01ea1d87c3.r2.cloudflarestorage.com/mybonzo-blog-content/images/2026-01/WORKLOG_Our_RAG_System.png",
    "alt": "Cover image for Untitled Article"
  }
};
function getHeadings() {
  return [{
    "depth": 3,
    "slug": "worklog-zbudowałem-własny-system-rag---walka-z-cloudflare-workers-vectorize-i-faiss-co-działa-co-nie-i-dlaczego-lokalne-ai-wciąż-wygrywa-moje-wnioski",
    "text": "Worklog: Zbudowałem własny system RAG - walka z Cloudflare Workers, Vectorize i FAISS. Co działa, co nie, i dlaczego lokalne AI wciąż wygrywa. Moje wnioski."
  }];
}
function _createMdxContent(props) {
  const {Fragment} = props.components || ({});
  if (!Fragment) _missingMdxReference("Fragment");
  return createVNode(Fragment, {
    "set:html": "<h3 id=\"worklog-zbudowałem-własny-system-rag---walka-z-cloudflare-workers-vectorize-i-faiss-co-działa-co-nie-i-dlaczego-lokalne-ai-wciąż-wygrywa-moje-wnioski\">Worklog: Zbudowałem własny system RAG - walka z Cloudflare Workers, Vectorize i FAISS. Co działa, co nie, i dlaczego lokalne AI wciąż wygrywa. Moje wnioski.</h3>\n<p><strong>KONTEKST:</strong> Wczoraj wieczorem pracowałem nad własnym systemem RAG, próbując ogarnąć Cloudflare Workers z Vectorize jako bazą wektorową, kontra lokalny setup z FAISS. Chciałem zobaczyć, czy cloud da radę lokalnemu stackowi z embeddingami i LLM na mojej maszynie.</p>\n<p><strong>PROCES:</strong> Debugowałem Worker’a non-stop – embeddingi wrzucałem, ale retrieval w Vectorize ciągle gubił kontekst przy większych chunkach, latency skakało na 2-3s. Testowałem na Pumo dataset (dokumenty PDF z tech specyfikacjami), porównywałem z FAISS lokalnie via LangChain. Mailowałem z supportem Cloudflare, bo autoryzacje blokowały dostęp do indeksu. FAISS śmigał błyskawicznie, zero problemów z skalą na moim GPU.</p>\n<p><strong>WYNIK:</strong> Działa połowicznie! Worker z Vectorize ogarnia proste zapytania, ale przy złożonych RAG-ach (retrieval + generation) accuracy spada o 30-40% vs lokalny FAISS – cloud ma opóźnienia i słabsze matchowanie embeddingów. Lokalne AI wygrywa: zero kosztów, pełna kontrola, latency &#x3C;200ms, i mogę tweakować modele embeddingowe (np. text-embedding-3-large) bez limitów API[1][4]. Wniosek: cloud fajny do demo, ale lokalnie budujesz solidniej, zwłaszcza z FAISS/ChromaDB[4].</p>\n<p><strong>NASTĘPNY KROK:</strong> Jutro dodam hybrid – FAISS lokalnie + Worker tylko do edge cachingu, i przetestuję na realnych klientach.</p>\n<p><strong>CTA:</strong> Chcesz podobny setup? Napisz maila na [<a href=\"mailto:moj.email@dev.pl\">moj.email@dev.pl</a>].</p>\n<blockquote>\n<p><em>Konsultacje AI setup pod Twój biznes – link w bio</em></p>\n</blockquote>"
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const url = "src/data/blog/untitled-article.mdx";
const file = "U:/WWW_MYbonzoai_blog/src/data/blog/untitled-article.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "U:/WWW_MYbonzoai_blog/src/data/blog/untitled-article.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
