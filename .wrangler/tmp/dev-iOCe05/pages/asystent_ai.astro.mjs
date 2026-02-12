globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent } from '../chunks/astro/server_CENSSoee.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return Astro2.redirect("https://ai.mybonzoaiblog.com", 302);
}, "U:/WWW_MYbonzoai_blog/src/pages/ASYSTENT_AI/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/ASYSTENT_AI/index.astro";
const $$url = "/ASYSTENT_AI";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
