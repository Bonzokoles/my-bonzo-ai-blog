globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, a as renderTemplate } from './astro/server_CENSSoee.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Tag = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Tag;
  const { tag, count, size = "md", class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<span${addAttribute([
    "bg-secondary border border-theme-accent-alt text-xs text-white inline-flex justify-center items-center hover:cursor-pointer hover:bg-theme-primary hover:text-theme-accent-alt hover:border-theme-primary transition-all duration-300 font-semibold tracking-widest uppercase rounded-none",
    { "py-1 px-2 mr-2 mb-1 text-sm": size === "xs" || "sm" },
    { "py-1 px-3 mr-2 mb-2 text-md": size === "md" },
    { "py-2 px-4 my-3 mr-6 ": size === "lg" },
    className
  ], "class:list")}> <a${addAttribute(`/tags/${tag}`, "href")}${addAttribute([
    "hover:cursor-pointer no-underline",
    { "text-xs": size === "sm" },
    { "text-sm": size === "md" || size === "lg" }
  ], "class:list")}> ${tag?.replace(/-/g, " ")} ${count !== void 0 && renderTemplate`<span class="text-xs font-semibold"> (${count})</span>`} </a> </span>`;
}, "U:/WWW_MYbonzoai_blog/src/components/Astro/utils/Tag.astro", void 0);

export { $$Tag as $ };
