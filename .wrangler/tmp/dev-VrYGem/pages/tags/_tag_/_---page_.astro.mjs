globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                       */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate } from '../../../chunks/astro/server_CENSSoee.mjs';
import { C as COLLECTION_NAMES_LIST, S as SITE } from '../../../chunks/Layout_Dkg1w919.mjs';
import { g as getCollection } from '../../../chunks/_astro_content_DcfyER59.mjs';
import { $ as $$Posts } from '../../../chunks/Posts_BlkxPSqP.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
async function getStaticPaths({
  paginate
}) {
  const posts = (await Promise.all(
    COLLECTION_NAMES_LIST.map(
      async (collection) => await getCollection(collection)
    )
  )).flat();
  const uniqueTags = [
    ...new Set(posts.flatMap((post) => post.data.tags ?? []))
  ];
  return uniqueTags.flatMap((tag) => {
    if (tag === void 0) return [];
    const filteredPosts = posts.filter(
      (post) => post.data.tags && post.data.tags.includes(tag)
    );
    return paginate(filteredPosts, {
      params: { tag },
      pageSize: SITE.postsPerPage,
      props: { tag }
    });
  });
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { page } = Astro2.props;
  const { tag } = Astro2.params ?? {};
  const posts = page?.data ?? [];
  return renderTemplate`${renderComponent($$result, "Posts", $$Posts, { "posts": posts, "page": page, "subtitle": `Showing all posts for ${tag}`, "collectionName": tag, "title": tag?.toUpperCase() })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/tags/[tag]/[...page].astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/tags/[tag]/[...page].astro";
const $$url = "/tags/[tag]/[...page]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
