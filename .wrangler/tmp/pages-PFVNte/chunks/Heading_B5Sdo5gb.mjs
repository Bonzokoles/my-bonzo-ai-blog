globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, r as renderComponent, a as renderTemplate, ao as renderSlot } from './astro/server_CENSSoee.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Heading = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Heading;
  const { text, level = 1, showHeadingBackground = true, class: className } = Astro2.props;
  const Tag = `h${level}`;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute([
    "flex mt-12 mb-10 md:mt-24 md:mb-12",
    className
  ], "class:list")}> ${renderComponent($$result, "Tag", Tag, { "class:list": [
    " tracking-widest text-4xl font-medium capitalize leading-relaxed mx-auto",
    {
      "bg-theme-secondary text-theme-secondary leading-none p-4 inline-block": showHeadingBackground,
      "w-full": !showHeadingBackground
    },
    { "rounded-theme": true }
  ] }, { "default": ($$result2) => renderTemplate`${text || renderTemplate`${renderSlot($$result2, $$slots["default"])}`}` })} </div>`;
}, "U:/WWW_MYbonzoai_blog/src/components/Astro/Heading.astro", void 0);

export { $$Heading as $ };
