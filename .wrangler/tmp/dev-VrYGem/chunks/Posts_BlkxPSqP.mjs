globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, r as renderComponent, an as Fragment, a as renderTemplate } from './astro/server_CENSSoee.mjs';
import { $ as $$Author } from './Author_BfqqrYjM.mjs';
import { $ as $$Heading } from './Heading_B5Sdo5gb.mjs';
import { b as $$Link, C as COLLECTION_NAMES_LIST, $ as $$Layout, a as $$Icon, S as SITE } from './Layout_Dkg1w919.mjs';
import { $ as $$Tag } from './Tag_BpotpOWi.mjs';
import { $ as $$Image } from './_astro_assets_Fkzq6Wdh.mjs';

const $$Astro$2 = createAstro("https://www.mybonzoaiblog.com");
const $$Breadcrumbs = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Breadcrumbs;
  const { items, class: className = "" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav aria-label="Breadcrumb"${addAttribute(["mb-6", className], "class:list")}> <ol class="flex items-center gap-2 text-sm text-gray-400 flex-wrap" itemscope itemtype="https://schema.org/BreadcrumbList"> ${items.map((item, index) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"> ${item.href ? renderTemplate`<a${addAttribute(item.href, "href")} class="hover:text-blue-400 transition-colors" itemprop="item"> <span itemprop="name">${item.name}</span> </a>` : renderTemplate`<span class="text-white font-semibold" itemprop="name"> ${item.name} </span>`} <meta itemprop="position"${addAttribute(String(index + 1), "content")}> </li> ${index < items.length - 1 && renderTemplate`<li class="text-gray-600" aria-hidden="true">/</li>`}` })}`)} </ol> </nav>`;
}, "U:/WWW_MYbonzoai_blog/src/components/Breadcrumbs.astro", void 0);

const $$Astro$1 = createAstro("https://www.mybonzoaiblog.com");
const $$Pagination = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Pagination;
  const { page, class: className } = Astro2.props;
  if (!page) return;
  const { currentPage, lastPage, url } = page;
  const { next, prev } = url;
  return renderTemplate`${maybeRenderHead()}<nav${addAttribute(["flex justify-start items-center", className], "class:list")}> ${renderComponent($$result, "Link", $$Link, { "href": prev || "#", "text": "\u2190 Previous", "class:list": ["text-theme-primary p-2", { disabled: !prev }] })} <span class="px-2">
Page ${currentPage} of ${lastPage} </span> ${renderComponent($$result, "Link", $$Link, { "href": next || "#", "text": "Next \u2192", "class:list": ["text-theme-primary p-2", { disabled: !next }] })} </nav>`;
}, "U:/WWW_MYbonzoai_blog/src/components/Astro/Pagination.astro", void 0);

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Posts = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Posts;
  const {
    posts,
    page,
    collectionName = COLLECTION_NAMES_LIST[0],
    title,
    subtitle,
    description = title,
    class: className
  } = Astro2.props;
  posts?.sort(
    (a, b) => new Date(b.data?.pubDatetime || 0).valueOf() - new Date(a.data?.pubDatetime || 0).valueOf()
  );
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: title || (collectionName === "blog" ? "Blog" : "Docs") }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "class:list": ["theme-ultra", className] }, { "default": ($$result2) => renderTemplate`${subtitle && renderTemplate`${renderComponent($$result2, "Heading", $$Heading, { "text": subtitle, "showHeadingBackground": true })}`}${subtitle?.toLowerCase() !== "blog examples" && renderTemplate`${maybeRenderHead()}<span class="text-center block"> <a href="/blog"> Back to all blog entires</a> </span>`}<div class="md:max-w-3xl md:mx-auto"> ${renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, { "items": breadcrumbItems, "class": "mt-4" })} </div> <section class="md:max-w-3xl md:mx-auto mt-0"> ${!posts?.length && renderTemplate`<p class="text-theme-text">No posts found.</p>`} ${posts?.map((post) => renderTemplate`<article class="mb-10 border border-gray-500 bg-transparent rounded-none p-6 hover:border-blue-400 hover:bg-gray-900 transition-colors"${addAttribute(post.id, "id")}> <a${addAttribute(`/${post.collection || collectionName}/${post.id}`, "href")} class="no-underline flex flex-row items-center mb-2 group"> ${post.data.cover && renderTemplate`<div class="w-[4.5rem] h-[4.5rem] mr-4 mb-2 flex-shrink-0"> ${renderComponent($$result2, "Image", $$Image, { "src": post.data.cover.src, "alt": post.data.cover.alt || post.data.title || "Post Image", "format": "webp", "width": 128, "height": 128, "class": "object-cover w-full h-full border border-theme-accent group-hover:rotate-6 transition-transform duration-500 m-0 rounded-none", "loading": "lazy" })} </div>`} <h2 class="">${post.data.title}</h2> </a> <div class="flex flex-wrap mt-0 mb-3"> ${post.data.tags?.map((tag) => renderTemplate`${renderComponent($$result2, "Tag", $$Tag, { "tag": tag, "size": "sm" })}`)} </div> <p class="text-lg mb-2"> ${post.data.description}${" "} <a${addAttribute(`/${post.collection || collectionName}/${post.id}`, "href")} class="text-theme-text pl-2">
Read more...
</a> </p> ${post.data.modDatetime && renderTemplate`<p class="text-theme-text font-mono text-sm">
updated: ${new Date(post.data.modDatetime).toLocaleString()} </p>`} <div class="border-l-4 border-theme-text p-4 mb-3 ml-1 inline-block"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ri:quill-pen-line", "size": "16", "class": "align-middle inline mr-0.5" })}
Posted by:
${renderComponent($$result2, "Author", $$Author, { "authorId": post.data.authorId || "", "pubDateTime": new Date(post.data.pubDatetime), "class": "ml-0.5 mt-2 inline font-mono not-italic" })} </div> </article>`)} </section> <div class="flex justify-center"> ${SITE.postsPerPage < page?.total && renderTemplate`${renderComponent($$result2, "Pagination", $$Pagination, { "page": page })}`} </div> ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/layouts/Posts.astro", void 0);

export { $$Posts as $ };
