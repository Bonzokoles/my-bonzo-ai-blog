globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_CENSSoee.mjs';
import { C as COLLECTION_NAMES_LIST, $ as $$Layout } from '../chunks/Layout_CUoF9Ydm.mjs';
import { g as getCollection } from '../chunks/_astro_content_CTEMS9cA.mjs';
import { $ as $$Tag } from '../chunks/Tag_BpotpOWi.mjs';
import { $ as $$Heading } from '../chunks/Heading_B5Sdo5gb.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://www.mybonzoaiblog.com");
const $$TagCloud = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$TagCloud;
  const { tags = [], class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute([
    "inline-flex flex-wrap-reverse justify-center items-center px-0 mb-0.5 w-full",
    className
  ], "class:list")}> ${tags.map((tag) => renderTemplate`${renderComponent($$result, "Tag", $$Tag, { "tag": tag.name, "count": tag.count, "size": "lg" })}`)} </div> <hr class="my-5 text-theme-accent">`;
}, "U:/WWW_MYbonzoai_blog/src/components/Astro/TagCloud.astro", void 0);

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const allEntries = await Promise.all(
    COLLECTION_NAMES_LIST.map((collection) => getCollection(collection))
  );
  const allTags = allEntries.flat().flatMap((entry) => entry.data.tags || []);
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {}
  );
  const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a).map(([tag, count]) => ({
    name: tag,
    count
  }));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tags" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Heading", $$Heading, { "text": "Get Entries by Tag" })} ${maybeRenderHead()}<section> ${renderComponent($$result2, "TagCloud", $$TagCloud, { "tags": sortedTags })} </section> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/tags/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/tags/index.astro";
const $$url = "/tags";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
