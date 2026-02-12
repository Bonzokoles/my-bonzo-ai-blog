globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Dkg1w919.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Projekt 4 - MyBonzo AI Lab", "description": "Eksperymentalny projekt AI dla klienta" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-16"> <a href="/eksperymenty" class="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
← Powrót do Laboratorium
</a> <h1 class="text-4xl font-bold mb-4">🔬 Projekt 4</h1> <div class="prose dark:prose-invert max-w-none"> <h2>Opis projektu</h2> <p>
Ten projekt jest w trakcie przygotowania. Wkrótce zostanie
                uruchomiony eksperyment AI dla klienta.
</p> <h2>Status</h2> <ul> <li>📋 Planowanie</li> <li>⏳ Oczekuje na implementację</li> </ul> <h2>Technologie</h2> <p>Do uzupełnienia po ustaleniu zakresu projektu.</p> </div> </div> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/projekt-4/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/projekt-4/index.astro";
const $$url = "/eksperymenty/projekt-4";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
