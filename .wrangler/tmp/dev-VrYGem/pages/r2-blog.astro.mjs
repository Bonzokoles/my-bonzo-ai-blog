globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                 */
import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../chunks/Layout_Dkg1w919.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const title = "R2 Blog System - MyBonzo AI";
  let blogPosts = [];
  let error = null;
  try {
    const response = await fetch(`${Astro2.site?.origin || "http://localhost:4321"}/api/blog/index`);
    if (response.ok) {
      const blogIndex = await response.json();
      blogPosts = blogIndex.posts || [];
    } else {
      error = "Failed to load blog posts";
    }
  } catch (e) {
    error = `Error loading posts: ${e instanceof Error ? e.message : "Unknown error"}`;
    console.error("Blog page error:", e);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "data-astro-cid-p2xhkqtf": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white" data-astro-cid-p2xhkqtf> <!-- Header --> <div class="relative py-20 px-4" data-astro-cid-p2xhkqtf> <div class="max-w-6xl mx-auto text-center" data-astro-cid-p2xhkqtf> <h1 class="graffiti-footer text-5xl md:text-7xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" data-astro-cid-p2xhkqtf>
ARTYKUŁY
</h1> <p class="text-xl text-gray-300 max-w-3xl mx-auto" data-astro-cid-p2xhkqtf>
Najnowsze artykuły o technologii, sztucznej inteligencji i innowacjach
</p> </div> </div> <!-- Blog Posts Section --> <div class="max-w-6xl mx-auto px-4 pb-20" data-astro-cid-p2xhkqtf> ${error ? renderTemplate`<div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center" data-astro-cid-p2xhkqtf> <h2 class="text-2xl font-bold text-red-400 mb-2" data-astro-cid-p2xhkqtf>Błąd ładowania postów</h2> <p class="text-red-300" data-astro-cid-p2xhkqtf>${error}</p> <button onclick="window.location.reload()" class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors" data-astro-cid-p2xhkqtf>
Spróbuj ponownie
</button> </div>` : blogPosts.length === 0 ? renderTemplate`<div class="text-center py-12" data-astro-cid-p2xhkqtf> <h2 class="text-3xl font-bold text-gray-400 mb-4" data-astro-cid-p2xhkqtf>Brak postów</h2> <p class="text-gray-500" data-astro-cid-p2xhkqtf>Nie znaleziono żadnych postów w systemie R2.</p> <button onclick="refreshBlog()" class="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors" data-astro-cid-p2xhkqtf>
Odśwież indeks blogów
</button> </div>` : renderTemplate`<div data-astro-cid-p2xhkqtf> <!-- Blog Stats --> <div class="bg-gray-800/50 rounded-lg p-6 mb-8 text-center" data-astro-cid-p2xhkqtf> <h2 class="text-2xl font-bold mb-4" data-astro-cid-p2xhkqtf>Statystyki Blogów</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-astro-cid-p2xhkqtf> <div class="bg-blue-900/30 rounded-lg p-4" data-astro-cid-p2xhkqtf> <div class="text-3xl font-bold text-blue-400" data-astro-cid-p2xhkqtf>${blogPosts.length}</div> <div class="text-sm text-gray-400" data-astro-cid-p2xhkqtf>Łącznie postów</div> </div> <div class="bg-green-900/30 rounded-lg p-4" data-astro-cid-p2xhkqtf> <div class="text-3xl font-bold text-green-400" data-astro-cid-p2xhkqtf>${blogPosts.filter((p) => p.images?.length > 0).length}</div> <div class="text-sm text-gray-400" data-astro-cid-p2xhkqtf>Posty z obrazami</div> </div> <div class="bg-purple-900/30 rounded-lg p-4" data-astro-cid-p2xhkqtf> <div class="text-3xl font-bold text-purple-400" data-astro-cid-p2xhkqtf>${blogPosts.reduce((acc, p) => acc + (p.images?.length || 0), 0)}</div> <div class="text-sm text-gray-400" data-astro-cid-p2xhkqtf>Łącznie obrazów</div> </div> </div> </div> <!-- Blog Posts Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-astro-cid-p2xhkqtf> ${blogPosts.map((post) => renderTemplate`<article class="bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group" data-astro-cid-p2xhkqtf> <div class="p-6" data-astro-cid-p2xhkqtf> <!-- Post ID Badge --> <div class="flex justify-between items-start mb-4" data-astro-cid-p2xhkqtf> <span class="bg-blue-600/20 text-blue-400 text-xs font-mono px-2 py-1 rounded-md" data-astro-cid-p2xhkqtf>
#${post.id || post.fileName?.replace(".md", "")} </span> ${post.images && post.images.length > 0 && renderTemplate`<span class="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-md" data-astro-cid-p2xhkqtf> ${post.images.length} obrazów
</span>`} </div> <!-- Title --> <h3 class="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2" data-astro-cid-p2xhkqtf> ${post.title} </h3> <!-- Excerpt --> ${post.excerpt && renderTemplate`<p class="text-gray-400 text-sm mb-4 line-clamp-3" data-astro-cid-p2xhkqtf> ${post.excerpt} </p>`} <!-- Date --> <div class="text-xs text-gray-500 mb-4" data-astro-cid-p2xhkqtf> ${new Date(post.date).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </div> <!-- Actions --> <div class="flex gap-2" data-astro-cid-p2xhkqtf> <button${addAttribute(`viewPost('${post.id || post.fileName?.replace(".md", "")}')`, "onclick")} class="flex-1 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors text-sm" data-astro-cid-p2xhkqtf>
Wyświetl
</button> ${post.images && post.images.length > 0 && renderTemplate`<button${addAttribute(`showImages('${post.id || post.fileName?.replace(".md", "")}', ${JSON.stringify(post.images).replace(/"/g, "&quot;")})`, "onclick")} class="px-4 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg transition-colors text-sm" data-astro-cid-p2xhkqtf>
Obrazy
</button>`} </div> </div> </article>`)} </div> </div>`} </div> <!-- Blog Management Panel --> <div class="max-w-4xl mx-auto px-4 pb-20" data-astro-cid-p2xhkqtf> <div class="bg-gray-800/30 rounded-lg border border-gray-700/30 p-6" data-astro-cid-p2xhkqtf> <h2 class="text-2xl font-bold mb-6" data-astro-cid-p2xhkqtf>Zarządzanie Blogiem</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-astro-cid-p2xhkqtf> <button onclick="refreshBlog()" class="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors border border-blue-500/30" data-astro-cid-p2xhkqtf>
🔄 Odśwież Indeks
</button> <button onclick="uploadPost()" class="px-6 py-3 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg transition-colors border border-green-500/30" data-astro-cid-p2xhkqtf>
➕ Dodaj Post
</button> <button onclick="showCFImageUpload()" class="px-6 py-3 bg-orange-600/20 hover:bg-orange-600/40 text-orange-400 rounded-lg transition-colors border border-orange-500/30" data-astro-cid-p2xhkqtf>
🖼️ CF Images
</button> <button onclick="showSystemInfo()" class="px-6 py-3 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 rounded-lg transition-colors border border-purple-500/30" data-astro-cid-p2xhkqtf>
ℹ️ Info Systemu
</button> </div> </div> </div> <!-- Modal for post content --> <div id="postModal" class="hidden fixed inset-0 bg-black/80 p-4 z-50" style="display: none; align-items: center; justify-content: center;" data-astro-cid-p2xhkqtf> <div class="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" data-astro-cid-p2xhkqtf> <div class="p-6 border-b border-gray-700 flex justify-between items-center" data-astro-cid-p2xhkqtf> <h3 id="modalTitle" class="text-xl font-bold" data-astro-cid-p2xhkqtf></h3> <button onclick="closeModal()" class="text-gray-400 hover:text-white text-2xl" data-astro-cid-p2xhkqtf>×</button> </div> <div id="modalContent" class="p-6 prose prose-invert max-w-none" data-astro-cid-p2xhkqtf></div> </div> </div> </main>   ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/r2-blog/index.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/r2-blog/index.astro";
const $$url = "/r2-blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
