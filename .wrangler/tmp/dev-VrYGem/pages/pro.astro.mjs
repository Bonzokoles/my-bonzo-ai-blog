globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../chunks/Layout_Dkg1w919.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "MyBonzo Pro", "description": "Profesjonalna platforma AI MyBonzo Pro - narz\u0119dzia biznesowe" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-16"> <section class="text-center bg-theme-bg/5 backdrop-blur-sm rounded-2xl p-8"> <h1 class="text-4xl font-bold mb-8 text-theme-text">
Sprawdź MyBonzo Pro
</h1> <video controls src="https://pub-25059caf15274ebd844548094bfb4dc1.r2.dev/mybonzo123.mp4" style="max-width:600px; width:100%; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);"></video> <div class="mt-8"> <p class="text-lg mb-4 text-theme-text opacity-80"> <strong>Przejdź do pełnej wersji:</strong> </p> <a href="https://www.mybonzo.com" target="_blank" class="inline-block bg-theme-accent text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg text-lg">
Przejdź do głównej wersji MyBonzo Pro →
</a> </div> </section> </div> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/pro/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/pro/index.astro";
const $$url = "/pro";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
