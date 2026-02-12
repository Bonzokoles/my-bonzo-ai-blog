globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Heading } from '../chunks/Heading_B5Sdo5gb.mjs';
import { $ as $$Layout, a as $$Icon, b as $$Link } from '../chunks/Layout_CUoF9Ydm.mjs';
import { $ as $$FeaturesList } from '../chunks/FeaturesList_n7UAhfvr.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Faq = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Faq;
  const faq = [
    {
      title: "I'd like to contribute. How can I help?",
      description: "Currently, I am not accepting PRs. However, you can help by reporting bugs and suggesting features on GitHub. I plan to accept contributions in the very near future."
    },
    {
      title: "What are the future plans for Alkaline?",
      description: "Post-launch the focus is on bug fixes, stability, and feature requests. After that I hope to build Alkaline for SvelteKit. I may also do that publicly on Twitch."
    },
    {
      title: "I have a question that isn't answered here.",
      description: "You can file an issue on Github (link in footer) or reach out to me directly at hello@jaredtruscott.com"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "FAQ" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Heading", $$Heading, { "text": "FAQ" })} ${maybeRenderHead()}<p class="flex items-center justify-center gap-2"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:questionnaire-line", "size": "1.5em", "class": "opacity-80" })}
Looking for the ${renderComponent($$result2, "Link", $$Link, { "href": "/features", "text": "Feature List?" })} </p> <section class="max-w-6xl mx-auto p-6 w-full mt-0"> <article class="md:mx-12 lg:mx-auto w-full max-w-2xl"> ${renderComponent($$result2, "FeaturesList", $$FeaturesList, { "features": faq })} </article> </section> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/faq.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/faq.astro";
const $$url = "/faq";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Faq,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
