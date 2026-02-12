globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute, ao as renderSlot } from './astro/server_CENSSoee.mjs';
import { a as $$Icon } from './Layout_Dkg1w919.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Card;
  const {
    title,
    description,
    href,
    alt = false,
    iconName = null,
    alignIcon = "left",
    shadowSize = "sm",
    class: className
  } = Astro2.props;
  const Tag = href ? "a" : "div";
  const options = {
    "rounded-xl": true,
    "glass border border-theme-text/30 hover:border-theme-text transition-all duration-300 hover-glow": !alt,
    "glass border border-theme-text-secondary/30 hover:border-theme-text-secondary transition-all duration-300 hover-glow": alt,
    "shadow-sm": shadowSize === "sm",
    "shadow-md": shadowSize === "md",
    "shadow-lg": shadowSize === "lg",
    "shadow-none": shadowSize === "none",
    "cursor-pointer group": href
  };
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "href": href, "class:list": [
    "border-2 shadow-theme-accent p-4 w-full h-auto md:max-w-[450px] block",
    options,
    className
  ] }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<p${addAttribute([
    "h3",
    "uppercase",
    "font-bold",
    "mb-2",
    { "text-white group-hover:text-theme-accent transition-colors": !alt, "text-theme-text-secondary": alt }
  ], "class:list")}> <span class="flex items-center gap-4"> ${iconName && alignIcon === "left" && renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": iconName, "width": 42, "height": 42, "class": "text-theme-accent" })}
          <span class="md:flex-1 sm:border-b sm:border-theme-text/30"></span>`} ${title} ${iconName && alignIcon === "right" && renderTemplate`<span class="md:flex-1 sm:border-b sm:border-theme-text/30"></span>
          ${renderComponent($$result2, "Icon", $$Icon, { "name": iconName, "width": 42, "height": 42, "class": "text-theme-accent" })}`} </span> </p> <hr${addAttribute([
    "border-1 mb-2",
    { "border-theme-text/30": !alt },
    { "border-theme-text-secondary/30": alt }
  ], "class:list")}> <p${addAttribute(["text-lg text-white/80 mb-4", { "text-white/80": !alt, "text-theme-text-secondary/80": alt }], "class:list")}> ${description} </p> ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/components/Astro/Card.astro", void 0);

export { $$Card as $ };
