globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, a as renderTemplate } from './astro/server_CENSSoee.mjs';
/* empty css                       */

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$FeaturesList = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FeaturesList;
  const { features, class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<ul${addAttribute([className], "class:list")} data-astro-cid-7so47bve> ${features.map((feature) => renderTemplate`<li class="relative mb-8" data-astro-cid-7so47bve> <h3 class="text-xl font-mono font-semibold text-theme-accent build-in mb-0" data-astro-cid-7so47bve> ${feature.title} </h3> ${feature.description && renderTemplate`<p class="ml-4 italic text-theme-primary fade-in mt-2 text-lg" data-astro-cid-7so47bve> ${feature.description} </p>`} </li>`)} </ul> `;
}, "U:/WWW_MYbonzoai_blog/src/components/Astro/FeaturesList.astro", void 0);

export { $$FeaturesList as $ };
