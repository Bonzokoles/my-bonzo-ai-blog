globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as renderScript } from '../../chunks/astro/server_CENSSoee.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Dkg1w919.mjs';
export { renderers } from '../../renderers.mjs';

const $$UtmDashboard = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "UTM Analytics Dashboard - MyBonzo AI Blog", "description": "Monitor UTM tracking performance and revenue attribution" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <!-- Header --> <div class="mb-8"> <h1 class="text-4xl font-bold mb-4">📊 UTM Analytics Dashboard</h1> <p class="text-gray-600 dark:text-gray-400">
Monitor UTM tracking performance across WHITECAT API, Guide
                Generator, and RAG Chat
</p> </div> <!-- Quick Actions --> <div class="mb-6 flex flex-wrap gap-4"> <button onclick="setupDatabase()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
Setup Database
</button> <button onclick="loadStats()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
Refresh Stats
</button> <button onclick="testTracking()" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
Test Tracking
</button> </div> <!-- Status Cards --> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"> <h3 class="text-lg font-semibold mb-2">🎯 Total Clicks</h3> <p class="text-3xl font-bold text-blue-600" id="total-clicks">
-
</p> <p class="text-sm text-gray-500">Last 7 days</p> </div> <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"> <h3 class="text-lg font-semibold mb-2">👥 Unique Visitors</h3> <p class="text-3xl font-bold text-green-600" id="unique-visitors">
-
</p> <p class="text-sm text-gray-500">Distinct IP addresses</p> </div> <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"> <h3 class="text-lg font-semibold mb-2">📈 Top Campaign</h3> <p class="text-xl font-bold text-purple-600" id="top-campaign">
-
</p> <p class="text-sm text-gray-500">Best performing</p> </div> </div> <!-- Filters --> <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6"> <div class="grid grid-cols-1 md:grid-cols-4 gap-4"> <div> <label class="block text-sm font-medium mb-2">Days</label> <select id="days-filter" class="w-full p-2 border rounded dark:bg-gray-700"> <option value="7">Last 7 days</option> <option value="30">Last 30 days</option> <option value="90">Last 90 days</option> </select> </div> <div> <label class="block text-sm font-medium mb-2">UTM Source</label> <select id="source-filter" class="w-full p-2 border rounded dark:bg-gray-700"> <option value="">All sources</option> <option value="mybonzo">mybonzo</option> <option value="test">test</option> </select> </div> <div> <label class="block text-sm font-medium mb-2">UTM Medium</label> <select id="medium-filter" class="w-full p-2 border rounded dark:bg-gray-700"> <option value="">All mediums</option> <option value="whitecat">whitecat</option> <option value="guide">guide</option> <option value="rag_chat">rag_chat</option> </select> </div> <div class="flex items-end"> <button onclick="loadStats()" class="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
Apply Filters
</button> </div> </div> </div> <!-- Stats Table --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"> <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700"> <h3 class="text-lg font-semibold">📊 UTM Performance Stats</h3> </div> <div class="overflow-x-auto"> <table class="w-full"> <thead class="bg-gray-50 dark:bg-gray-700"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Campaign</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Source</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Medium</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Clicks</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Unique</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th> </tr> </thead> <tbody id="stats-table" class="divide-y divide-gray-200 dark:divide-gray-700"> <tr> <td colspan="6" class="px-6 py-4 text-center text-gray-500">
Click "Load Stats" to view analytics data
</td> </tr> </tbody> </table> </div> </div> <!-- System Status --> <div class="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow"> <h3 class="text-lg font-semibold mb-4">🔧 System Status</h3> <div id="system-status" class="space-y-2"> <p>Loading system status...</p> </div> </div> </div> ${renderScript($$result2, "U:/WWW_MYbonzoai_blog/src/pages/analytics/utm-dashboard.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "U:/WWW_MYbonzoai_blog/src/pages/analytics/utm-dashboard.astro", void 0);

const $$file = "U:/WWW_MYbonzoai_blog/src/pages/analytics/utm-dashboard.astro";
const $$url = "/analytics/utm-dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$UtmDashboard,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
