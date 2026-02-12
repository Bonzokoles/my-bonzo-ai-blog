globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, r as renderComponent, a as renderTemplate } from './astro/server_CENSSoee.mjs';
import { A as AUTHORS, c as $$SocialsCloud } from './Layout_CUoF9Ydm.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Author = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Author;
  const { authorId, pubDateTime = null, class: className } = Astro2.props;
  const displayDate = pubDateTime ? new Date(pubDateTime.getTime() + pubDateTime.getTimezoneOffset() * 6e4) : null;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["text-theme-primary font-mono -mt-0.5 ml-0 p-0", className], "class:list")}> <span> ${AUTHORS.find((author) => author.id === authorId)?.name} <div class="text-sm font-normal -mt-0.5 -mb-3"> ${displayDate ? `- ${displayDate.toDateString()}  ` : ""} </div> </span> <div class="m-0"> ${renderComponent($$result, "SocialsCloud", $$SocialsCloud, { "socials": AUTHORS.find((author) => author.id === authorId)?.socials || [], "size": 18, "class:list": ["ml-0 mt-3"] })} </div> </div>`;
}, "U:/WWW_MYbonzoai_blog/src/components/Astro/Author.astro", void 0);

export { $$Author as $ };
