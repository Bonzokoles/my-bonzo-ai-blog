globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { b as createAstro, c as createComponent, r as renderComponent, e as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Dkg1w919.mjs';
import { $ as $$PageHeader } from '../../chunks/PageHeader_DaikhrCu.mjs';
/* empty css                                         */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://www.mybonzoaiblog.com");
const $$Containers = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Containers;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Container Management - MyBonzo AI", "data-astro-cid-cojhpvgu": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "PageHeader", $$PageHeader, { "title": "\u{1F433} Container Management", "subtitle": "Zarz\u0105dzaj kontenerami Docker i Kubernetes z pomoc\u0105 AI", "data-astro-cid-cojhpvgu": true })} ${maybeRenderHead()}<section class="container mx-auto px-4 py-8" data-astro-cid-cojhpvgu> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8" data-astro-cid-cojhpvgu> <!-- Docker Management --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" data-astro-cid-cojhpvgu> <h2 class="text-2xl font-bold mb-4 flex items-center" data-astro-cid-cojhpvgu>
🐋 Docker Management
</h2> <div class="space-y-4" data-astro-cid-cojhpvgu> <button id="docker-list" class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" data-astro-cid-cojhpvgu>
Lista Kontenerów Docker
</button> <div class="grid grid-cols-2 gap-2" data-astro-cid-cojhpvgu> <input id="docker-container-id" type="text" placeholder="Container ID" class="px-3 py-2 border rounded" data-astro-cid-cojhpvgu> <select id="docker-action" class="px-3 py-2 border rounded" data-astro-cid-cojhpvgu> <option value="start" data-astro-cid-cojhpvgu>Start</option> <option value="stop" data-astro-cid-cojhpvgu>Stop</option> <option value="logs" data-astro-cid-cojhpvgu>Logs</option> </select> </div> <button id="docker-execute" class="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" data-astro-cid-cojhpvgu>
Wykonaj Akcję Docker
</button> </div> <div id="docker-results" class="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded max-h-64 overflow-y-auto" data-astro-cid-cojhpvgu></div> </div> <!-- Kubernetes Management --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" data-astro-cid-cojhpvgu> <h2 class="text-2xl font-bold mb-4 flex items-center" data-astro-cid-cojhpvgu>
⚙️ Kubernetes Management
</h2> <div class="space-y-4" data-astro-cid-cojhpvgu> <div class="grid grid-cols-2 gap-2" data-astro-cid-cojhpvgu> <input id="k8s-namespace" type="text" placeholder="Namespace (default)" class="px-3 py-2 border rounded" data-astro-cid-cojhpvgu> <select id="k8s-action" class="px-3 py-2 border rounded" data-astro-cid-cojhpvgu> <option value="pods" data-astro-cid-cojhpvgu>Lista Pods</option> <option value="deployments" data-astro-cid-cojhpvgu>Lista Deployments</option> <option value="services" data-astro-cid-cojhpvgu>Lista Services</option> </select> </div> <button id="k8s-list" class="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700" data-astro-cid-cojhpvgu>
Wykonaj K8s Query
</button> <!-- Scaling --> <div class="border-t pt-4" data-astro-cid-cojhpvgu> <h3 class="font-semibold mb-2" data-astro-cid-cojhpvgu>Scale Deployment</h3> <div class="grid grid-cols-3 gap-2" data-astro-cid-cojhpvgu> <input id="k8s-deployment-name" type="text" placeholder="Deployment name" class="px-3 py-2 border rounded" data-astro-cid-cojhpvgu> <input id="k8s-replicas" type="number" placeholder="Replicas" min="0" class="px-3 py-2 border rounded" data-astro-cid-cojhpvgu> <button id="k8s-scale" class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700" data-astro-cid-cojhpvgu>
Scale
</button> </div> </div> </div> <div id="k8s-results" class="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded max-h-64 overflow-y-auto" data-astro-cid-cojhpvgu></div> </div> </div> <!-- AI Analysis Panel --> <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" data-astro-cid-cojhpvgu> <h2 class="text-2xl font-bold mb-4 flex items-center" data-astro-cid-cojhpvgu>
🤖 AI Container Analysis
</h2> <div id="ai-analysis" class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500" data-astro-cid-cojhpvgu> <p class="text-gray-600 dark:text-gray-300" data-astro-cid-cojhpvgu>
Wykonaj operację na kontenerach aby otrzymać analizę AI...
</p> </div> </div> <!-- Real-time Status --> <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" data-astro-cid-cojhpvgu> <h2 class="text-2xl font-bold mb-4 flex items-center" data-astro-cid-cojhpvgu>
📊 System Status
</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-astro-cid-cojhpvgu> <div class="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded" data-astro-cid-cojhpvgu> <div class="text-3xl font-bold text-green-600" id="healthy-containers" data-astro-cid-cojhpvgu>
-
</div> <div class="text-sm text-gray-600 dark:text-gray-300" data-astro-cid-cojhpvgu>
Healthy Containers
</div> </div> <div class="text-center p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded" data-astro-cid-cojhpvgu> <div class="text-3xl font-bold text-yellow-600" id="warning-containers" data-astro-cid-cojhpvgu>
-
</div> <div class="text-sm text-gray-600 dark:text-gray-300" data-astro-cid-cojhpvgu>Warnings</div> </div> <div class="text-center p-4 bg-red-100 dark:bg-red-900/20 rounded" data-astro-cid-cojhpvgu> <div class="text-3xl font-bold text-red-600" id="failed-containers" data-astro-cid-cojhpvgu>
-
</div> <div class="text-sm text-gray-600 dark:text-gray-300" data-astro-cid-cojhpvgu>Failed</div> </div> </div> </div> </section> ` })} ${renderScript($$result, "U:/WWW_MYbonzoai_blog/src/pages/system/containers.astro?astro&type=script&index=0&lang.ts")} `;
}, "U:/WWW_MYbonzoai_blog/src/pages/system/containers.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/system/containers.astro";
const $$url = "/system/containers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Containers,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
