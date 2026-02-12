globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as createVNode, an as Fragment, aN as __astro_tag_component__ } from './astro/server_CENSSoee.mjs';

const frontmatter = {
  "title": "Alkaline Design - Przywrócenie Oryginalnego Tematu",
  "description": "Jak przywróciliśmy czysty design Alkaline jako bazę dla MyBonzo AI Blog",
  "pubDate": "2025-10-26T00:00:00.000Z",
  "author": "Redakcja MyBonzo",
  "tags": ["alkaline", "design", "astro", "nowości"]
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "alkaline-design---powrót-do-korzeni",
    "text": "Alkaline Design - Powrót do Korzeni"
  }, {
    "depth": 2,
    "slug": "dlaczego-alkaline",
    "text": "Dlaczego Alkaline?"
  }, {
    "depth": 3,
    "slug": "-czysty-minimalistyczny-design",
    "text": "🎨 Czysty, Minimalistyczny Design"
  }, {
    "depth": 3,
    "slug": "-wysoką-wydajność",
    "text": "⚡ Wysoką Wydajność"
  }, {
    "depth": 3,
    "slug": "-łatwość-rozbudowy",
    "text": "🔧 Łatwość Rozbudowy"
  }, {
    "depth": 2,
    "slug": "co-zachowaliśmy",
    "text": "Co Zachowaliśmy?"
  }, {
    "depth": 2,
    "slug": "nasze-rozszerzenia",
    "text": "Nasze Rozszerzenia"
  }, {
    "depth": 3,
    "slug": "nowe-sekcje",
    "text": "Nowe Sekcje"
  }, {
    "depth": 3,
    "slug": "mybonzo-pro",
    "text": "MyBonzo Pro"
  }, {
    "depth": 2,
    "slug": "przyszłe-plany",
    "text": "Przyszłe Plany"
  }];
}
function _createMdxContent(props) {
  const {Fragment} = props.components || ({});
  if (!Fragment) _missingMdxReference("Fragment");
  return createVNode(Fragment, {
    "set:html": "<h1 id=\"alkaline-design---powrót-do-korzeni\">Alkaline Design - Powrót do Korzeni</h1>\n<p>Zdecydowaliśmy się przywrócić oryginalny, czysty design <strong>Alkaline Theme</strong> jako solidną podstawę dla naszego AI bloga. To strategiczna decyzja, która zapewnia nam:</p>\n<h2 id=\"dlaczego-alkaline\">Dlaczego Alkaline?</h2>\n<h3 id=\"-czysty-minimalistyczny-design\">🎨 Czysty, Minimalistyczny Design</h3>\n<p>Alkaline oferuje elegancki, nowoczesny wygląd bez zbędnych elementów. Skupia się na treści, co jest kluczowe dla bloga.</p>\n<h3 id=\"-wysoką-wydajność\">⚡ Wysoką Wydajność</h3>\n<ul>\n<li>Minimalne zależności</li>\n<li>Optymalizacja dla Lighthouse</li>\n<li>Szybkie ładowanie stron</li>\n</ul>\n<h3 id=\"-łatwość-rozbudowy\">🔧 Łatwość Rozbudowy</h3>\n<ul>\n<li>Modularna architektura</li>\n<li>14 gotowych motywów kolorystycznych</li>\n<li>Gotowe komponenty Astro</li>\n</ul>\n<h2 id=\"co-zachowaliśmy\">Co Zachowaliśmy?</h2>\n<ol>\n<li><strong>Oryginalną strukturę komponentów</strong> - wszystkie komponenty z <code>@components/Astro/</code></li>\n<li><strong>System motywów</strong> - 14 unikalnych schematów kolorów</li>\n<li><strong>Responsywny design</strong> - idealnie działa na wszystkich urządzeniach</li>\n<li><strong>Accessibility</strong> - zgodność z standardami dostępności</li>\n</ol>\n<h2 id=\"nasze-rozszerzenia\">Nasze Rozszerzenia</h2>\n<h3 id=\"nowe-sekcje\">Nowe Sekcje</h3>\n<ul>\n<li><strong>AI Tools</strong> - narzędzia sztucznej inteligencji</li>\n<li><strong>Eksperymenty</strong> - laboratoria technologiczne</li>\n<li><strong>Poradniki</strong> - przewodniki krok po kroku</li>\n<li><strong>System</strong> - panel administracyjny</li>\n</ul>\n<h3 id=\"mybonzo-pro\">MyBonzo Pro</h3>\n<p>Dodaliśmy dedykowaną stronę z video prezentacją profesjonalnej wersji naszej platformy AI.</p>\n<h2 id=\"przyszłe-plany\">Przyszłe Plany</h2>\n<p>Alkaline daje nam solidne fundamenty do:</p>\n<ul>\n<li>Integracji z AI Workers</li>\n<li>Dodawania interaktywnych komponentów</li>\n<li>Rozwijania funkcji e-commerce</li>\n<li>Implementacji zaawansowanych narzędzi analitycznych</li>\n</ul>\n<p><strong>Alkaline to nie tylko template - to filozofia prostoty i efektywności w web developmencie.</strong></p>"
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
const url = "src/data/blog/alkaline-design-przywrocony.mdx";
const file = "U:/WWW_MYbonzoai_blog/src/data/blog/alkaline-design-przywrocony.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "U:/WWW_MYbonzoai_blog/src/data/blog/alkaline-design-przywrocony.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
