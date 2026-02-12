globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../chunks/Layout_Dkg1w919.mjs';
import { $ as $$Image } from '../chunks/_astro_assets_Fkzq6Wdh.mjs';
export { renderers } from '../renderers.mjs';

const coverImage = new Proxy({"src":"/_assets/alk-cover-2.ZJXBVA01.webp","width":1024,"height":1024,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "U:/WWW_MYbonzoai_blog/src/assets/alk-cover-2.webp";
							}
							
							return target[name];
						}
					});

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "404" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="flex flex-col items-center justify-center p-4 text-center mt-24 mb-10"> <h1 class="text-6xl sm:text-8xl font-bold mb-4 flex items-center"> <!-- 4<div class="donut ml-2 mr-4"></div>4 -->
4${renderComponent($$result2, "Image", $$Image, { "src": coverImage, "alt": "404", "class:list": [
    "w-full h-full object-cover donut--broken mx-2"
  ], "width": 100, "height": 100 })} <span class="ml-2">4</span> </h1> <p class="text-xl sm:text-2xl">Page not found</p> </section> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/404.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$404,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
