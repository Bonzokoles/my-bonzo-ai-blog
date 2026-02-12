globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, a as renderTemplate, r as renderComponent } from './astro/server_CENSSoee.mjs';
import { l as logo } from './Layout_Dkg1w919.mjs';
import { $ as $$Image } from './_astro_assets_Fkzq6Wdh.mjs';
/* empty css                         */

const $$Astro$1 = createAstro("https://www.mybonzoaiblog.com");
const $$PatternBackground = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PatternBackground;
  const PATTERN_PRESETS = {
    dots: "M2 2h2v2H2z",
    diagonal: "M0 0l5 5l-5 5l5-5z",
    grid: "M10 10h10v10H10z",
    waves: "M0 10c2.8 0 2.8 5 5.6 5s2.8-5 5.6-5 2.8 5 5.6 5 2.8-5 5.6-5",
    circuit: "M5 0v10M0 5h10M15 0v10M10 5h10"
  };
  const {
    pattern,
    patternOpacity = 0.1,
    patternSize = 30,
    strokeWidth = 1,
    animate = true,
    class: className = ""
  } = Astro2.props;
  const patternData = PATTERN_PRESETS[pattern] || pattern;
  const patternId = `pattern-${crypto.randomUUID()}`;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute([
    `absolute inset-0 -z-10 h-full w-full m-0 p-0`,
    className,
    { "fade-in": animate }
  ], "class:list")} aria-hidden="true"> <svg xmlns="http://www.w3.org/2000/svg"${addAttribute([
    "inset-0 h-full w-full absolute hidden lg:block",
    { spinOnAxis: animate }
  ], "class:list")}${addAttribute(`mask-image: radial-gradient(circle at 75% 5%, hsla(0,0%,0%,${patternOpacity}) 0%, transparent 45%);`, "style")} aria-hidden="true"> <defs> <pattern${addAttribute(patternId, "id")}${addAttribute(patternSize, "width")}${addAttribute(patternSize, "height")} patternUnits="userSpaceOnUse" patternTransform="translate(-1 -1)"> <path${addAttribute(patternData || PATTERN_PRESETS.circuit, "d")} stroke="currentColor"${addAttribute(strokeWidth, "stroke-width")} fill="none" vector-effect="non-scaling-stroke"></path> </pattern> </defs> <rect width="100%" height="100%"${addAttribute(`url(#${patternId})`, "fill")}></rect> </svg> </div>`;
}, "U:/WWW_MYbonzoai_blog/src/components/Astro/utils/PatternBackground.astro", void 0);

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$PageHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PageHeader;
  const {
    heading,
    description,
    image,
    imageAlt,
    animate = true,
    backgroundPattern,
    patternOpacity,
    class: className
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute([
    "relative flex flex-col items-center justify-between w-full p-4 lg:-mt-16 lg:flex-row lg:p-24",
    className
  ], "class:list")} data-astro-cid-h5mru5hw> ${backgroundPattern && renderTemplate`${renderComponent($$result, "PatternBackground", $$PatternBackground, { "pattern": backgroundPattern, "patternOpacity": patternOpacity, "animate": animate, "data-astro-cid-h5mru5hw": true })}`} <div${addAttribute([
    "flex flex-col items-start justify-center lg:w-1/2 mb-8 lg:mb-0",
    { "lg:w-full lg:mb-12": !image }
  ], "class:list")} data-astro-cid-h5mru5hw> <!-- Logo + Heading Container --> <div class="flex flex-col md:flex-row items-center md:items-start gap-6 mb-2" data-astro-cid-h5mru5hw> <div class="shrink-0 p-2 border-2 border-theme-accent bg-black/20 backdrop-blur-sm" data-astro-cid-h5mru5hw> ${renderComponent($$result, "Image", $$Image, { "src": logo, "alt": "Logo", "class": "w-32 h-32 object-contain rounded-none invert opacity-90", "data-astro-cid-h5mru5hw": true })} </div> <h2${addAttribute([
    "font-display text-5xl md:text-6xl font-medium tracking-wide [text-wrap:balance] lg:text-7xl text-center md:text-left",
    { "build-in": animate }
  ], "class:list")} data-astro-cid-h5mru5hw> ${heading} </h2> </div> <p${addAttribute([
    "mt-4 text-xl leading-relaxed tracking-wide text-theme-primary lg:text-2xl 2xl:leading-loose text-center md:text-left",
    { "build-in": animate }
  ], "class:list")} data-astro-cid-h5mru5hw> ${description} </p> </div> ${image && renderTemplate`<div class="m-0 lg:w-5/12" data-astro-cid-h5mru5hw> <div class="relative overflow-hidden rounded-full aspect-square max-w-sm md:max-w-lg m-0 p-0" data-astro-cid-h5mru5hw> ${renderComponent($$result, "Image", $$Image, { "src": image, "alt": imageAlt ?? "Image", "class:list": [
    "w-full h-full object-cover",
    { "spin-and-grow": animate },
    { "rounded-theme": true }
  ], "width": 500, "height": 500, "loading": "eager", "data-astro-cid-h5mru5hw": true })} </div> </div>`} </div> `;
}, "U:/WWW_MYbonzoai_blog/src/components/Astro/PageHeader.astro", void 0);

export { $$PageHeader as $ };
