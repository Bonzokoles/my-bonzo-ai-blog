var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// _worker.js/index.js
import { renderers } from "./renderers.mjs";
import { c as createExports, s as serverEntrypointModule } from "./chunks/_@astrojs-ssr-adapter_DnAqkTRU.mjs";
import { manifest } from "./manifest_BDiQnYU4.mjs";
globalThis.process ??= {};
globalThis.process.env ??= {};
var serverIslandMap = /* @__PURE__ */ new Map();
var _page0 = /* @__PURE__ */ __name(() => import("./pages/_image.astro.mjs"), "_page0");
var _page1 = /* @__PURE__ */ __name(() => import("./pages/404.astro.mjs"), "_page1");
var _page2 = /* @__PURE__ */ __name(() => import("./pages/ai-tools.astro.mjs"), "_page2");
var _page3 = /* @__PURE__ */ __name(() => import("./pages/analytics/utm-dashboard.astro.mjs"), "_page3");
var _page4 = /* @__PURE__ */ __name(() => import("./pages/api/ai/bonzo-avatar.astro.mjs"), "_page4");
var _page5 = /* @__PURE__ */ __name(() => import("./pages/api/ai/bonzo-chat.astro.mjs"), "_page5");
var _page6 = /* @__PURE__ */ __name(() => import("./pages/api/ai/bonzo-voice.astro.mjs"), "_page6");
var _page7 = /* @__PURE__ */ __name(() => import("./pages/api/ai/chat.astro.mjs"), "_page7");
var _page8 = /* @__PURE__ */ __name(() => import("./pages/api/ai/chat-openai.astro.mjs"), "_page8");
var _page9 = /* @__PURE__ */ __name(() => import("./pages/api/ai/chat-stream.astro.mjs"), "_page9");
var _page10 = /* @__PURE__ */ __name(() => import("./pages/api/ai/gallery-manage.astro.mjs"), "_page10");
var _page11 = /* @__PURE__ */ __name(() => import("./pages/api/ai/gateway.astro.mjs"), "_page11");
var _page12 = /* @__PURE__ */ __name(() => import("./pages/api/ai/gemini-chat.astro.mjs"), "_page12");
var _page13 = /* @__PURE__ */ __name(() => import("./pages/api/ai/generate-image.astro.mjs"), "_page13");
var _page14 = /* @__PURE__ */ __name(() => import("./pages/api/ai/generate-image-queue.astro.mjs"), "_page14");
var _page15 = /* @__PURE__ */ __name(() => import("./pages/api/ai/image/_imageid_.astro.mjs"), "_page15");
var _page16 = /* @__PURE__ */ __name(() => import("./pages/api/ai/image-gallery.astro.mjs"), "_page16");
var _page17 = /* @__PURE__ */ __name(() => import("./pages/api/ai/queue-status/_requestid_.astro.mjs"), "_page17");
var _page18 = /* @__PURE__ */ __name(() => import("./pages/api/ai/rag-shop-data.astro.mjs"), "_page18");
var _page19 = /* @__PURE__ */ __name(() => import("./pages/api/ai/vector-search.astro.mjs"), "_page19");
var _page20 = /* @__PURE__ */ __name(() => import("./pages/api/ai-analyst.astro.mjs"), "_page20");
var _page21 = /* @__PURE__ */ __name(() => import("./pages/api/ai-metadata.json.astro.mjs"), "_page21");
var _page22 = /* @__PURE__ */ __name(() => import("./pages/api/analytics/event.astro.mjs"), "_page22");
var _page23 = /* @__PURE__ */ __name(() => import("./pages/api/analytics/setup-db.astro.mjs"), "_page23");
var _page24 = /* @__PURE__ */ __name(() => import("./pages/api/analytics/utm-tracking.astro.mjs"), "_page24");
var _page25 = /* @__PURE__ */ __name(() => import("./pages/api/analytics.astro.mjs"), "_page25");
var _page26 = /* @__PURE__ */ __name(() => import("./pages/api/blog/upload-cf-image.astro.mjs"), "_page26");
var _page27 = /* @__PURE__ */ __name(() => import("./pages/api/blog/_postid_.astro.mjs"), "_page27");
var _page28 = /* @__PURE__ */ __name(() => import("./pages/api/blog.astro.mjs"), "_page28");
var _page29 = /* @__PURE__ */ __name(() => import("./pages/api/business-analytics.astro.mjs"), "_page29");
var _page30 = /* @__PURE__ */ __name(() => import("./pages/api/business-intelligence.astro.mjs"), "_page30");
var _page31 = /* @__PURE__ */ __name(() => import("./pages/api/check-product-availability.astro.mjs"), "_page31");
var _page32 = /* @__PURE__ */ __name(() => import("./pages/api/containers/manage.astro.mjs"), "_page32");
var _page33 = /* @__PURE__ */ __name(() => import("./pages/api/containers/test.astro.mjs"), "_page33");
var _page34 = /* @__PURE__ */ __name(() => import("./pages/api/debug-env.astro.mjs"), "_page34");
var _page35 = /* @__PURE__ */ __name(() => import("./pages/api/debug-middleware.astro.mjs"), "_page35");
var _page36 = /* @__PURE__ */ __name(() => import("./pages/api/debug-pumo.astro.mjs"), "_page36");
var _page37 = /* @__PURE__ */ __name(() => import("./pages/api/debug-pumo-api-sync.astro.mjs"), "_page37");
var _page38 = /* @__PURE__ */ __name(() => import("./pages/api/debug-whitecat.astro.mjs"), "_page38");
var _page39 = /* @__PURE__ */ __name(() => import("./pages/api/debug-whitecat2.astro.mjs"), "_page39");
var _page40 = /* @__PURE__ */ __name(() => import("./pages/api/direct-pumo.astro.mjs"), "_page40");
var _page41 = /* @__PURE__ */ __name(() => import("./pages/api/example-with-middleware.astro.mjs"), "_page41");
var _page42 = /* @__PURE__ */ __name(() => import("./pages/api/features/health.astro.mjs"), "_page42");
var _page43 = /* @__PURE__ */ __name(() => import("./pages/api/features/registry.astro.mjs"), "_page43");
var _page44 = /* @__PURE__ */ __name(() => import("./pages/api/features/validate.astro.mjs"), "_page44");
var _page45 = /* @__PURE__ */ __name(() => import("./pages/api/generate-guides.astro.mjs"), "_page45");
var _page46 = /* @__PURE__ */ __name(() => import("./pages/api/health.astro.mjs"), "_page46");
var _page47 = /* @__PURE__ */ __name(() => import("./pages/api/import-products.astro.mjs"), "_page47");
var _page48 = /* @__PURE__ */ __name(() => import("./pages/api/index-now.astro.mjs"), "_page48");
var _page49 = /* @__PURE__ */ __name(() => import("./pages/api/media/delete.astro.mjs"), "_page49");
var _page50 = /* @__PURE__ */ __name(() => import("./pages/api/media/list.astro.mjs"), "_page50");
var _page51 = /* @__PURE__ */ __name(() => import("./pages/api/media/upload.astro.mjs"), "_page51");
var _page52 = /* @__PURE__ */ __name(() => import("./pages/api/migrate-products.astro.mjs"), "_page52");
var _page53 = /* @__PURE__ */ __name(() => import("./pages/api/ping-search-engines.astro.mjs"), "_page53");
var _page54 = /* @__PURE__ */ __name(() => import("./pages/api/posts.json.astro.mjs"), "_page54");
var _page55 = /* @__PURE__ */ __name(() => import("./pages/api/product/_id_/tracked-url.astro.mjs"), "_page55");
var _page56 = /* @__PURE__ */ __name(() => import("./pages/api/pumo-api-sync.astro.mjs"), "_page56");
var _page57 = /* @__PURE__ */ __name(() => import("./pages/api/pumo-availability-sync.astro.mjs"), "_page57");
var _page58 = /* @__PURE__ */ __name(() => import("./pages/api/pumo-category/_slug_.json.astro.mjs"), "_page58");
var _page59 = /* @__PURE__ */ __name(() => import("./pages/api/pumo-chat.astro.mjs"), "_page59");
var _page60 = /* @__PURE__ */ __name(() => import("./pages/api/pumo-search.astro.mjs"), "_page60");
var _page61 = /* @__PURE__ */ __name(() => import("./pages/api/pumo-system-manager.astro.mjs"), "_page61");
var _page62 = /* @__PURE__ */ __name(() => import("./pages/api/pumo-system-simple.astro.mjs"), "_page62");
var _page63 = /* @__PURE__ */ __name(() => import("./pages/api/rag-chat.astro.mjs"), "_page63");
var _page64 = /* @__PURE__ */ __name(() => import("./pages/api/rag-search.astro.mjs"), "_page64");
var _page65 = /* @__PURE__ */ __name(() => import("./pages/api/setup-sync-table.astro.mjs"), "_page65");
var _page66 = /* @__PURE__ */ __name(() => import("./pages/api/simple-test-no-deps.astro.mjs"), "_page66");
var _page67 = /* @__PURE__ */ __name(() => import("./pages/api/simple-whitecat.astro.mjs"), "_page67");
var _page68 = /* @__PURE__ */ __name(() => import("./pages/api/sitemap/sync.astro.mjs"), "_page68");
var _page69 = /* @__PURE__ */ __name(() => import("./pages/api/test-actual-middleware.astro.mjs"), "_page69");
var _page70 = /* @__PURE__ */ __name(() => import("./pages/api/test-d1.astro.mjs"), "_page70");
var _page71 = /* @__PURE__ */ __name(() => import("./pages/api/test-environment.astro.mjs"), "_page71");
var _page72 = /* @__PURE__ */ __name(() => import("./pages/api/test-health-feature.astro.mjs"), "_page72");
var _page73 = /* @__PURE__ */ __name(() => import("./pages/api/test-isolated-middleware.astro.mjs"), "_page73");
var _page74 = /* @__PURE__ */ __name(() => import("./pages/api/test-middleware.astro.mjs"), "_page74");
var _page75 = /* @__PURE__ */ __name(() => import("./pages/api/test-middleware-imports.astro.mjs"), "_page75");
var _page76 = /* @__PURE__ */ __name(() => import("./pages/api/test-pumo-api.astro.mjs"), "_page76");
var _page77 = /* @__PURE__ */ __name(() => import("./pages/api/test-pumo-fixed.astro.mjs"), "_page77");
var _page78 = /* @__PURE__ */ __name(() => import("./pages/api/test-simple-middleware.astro.mjs"), "_page78");
var _page79 = /* @__PURE__ */ __name(() => import("./pages/api/test-simple-middleware-working.astro.mjs"), "_page79");
var _page80 = /* @__PURE__ */ __name(() => import("./pages/api/ultimate-test.astro.mjs"), "_page80");
var _page81 = /* @__PURE__ */ __name(() => import("./pages/api/ultra-simple.astro.mjs"), "_page81");
var _page82 = /* @__PURE__ */ __name(() => import("./pages/api/ultra-simple-test.astro.mjs"), "_page82");
var _page83 = /* @__PURE__ */ __name(() => import("./pages/api/utm-tracking.astro.mjs"), "_page83");
var _page84 = /* @__PURE__ */ __name(() => import("./pages/api/whitecat.astro.mjs"), "_page84");
var _page85 = /* @__PURE__ */ __name(() => import("./pages/api/whitecat-fixed.astro.mjs"), "_page85");
var _page86 = /* @__PURE__ */ __name(() => import("./pages/api/whitecat-fixed-new.astro.mjs"), "_page86");
var _page87 = /* @__PURE__ */ __name(() => import("./pages/api/whitecat-simple.astro.mjs"), "_page87");
var _page88 = /* @__PURE__ */ __name(() => import("./pages/asystent_ai.astro.mjs"), "_page88");
var _page89 = /* @__PURE__ */ __name(() => import("./pages/blog/_id_.astro.mjs"), "_page89");
var _page90 = /* @__PURE__ */ __name(() => import("./pages/blog.astro.mjs"), "_page90");
var _page91 = /* @__PURE__ */ __name(() => import("./pages/blog/_---page_.astro.mjs"), "_page91");
var _page92 = /* @__PURE__ */ __name(() => import("./pages/browsery.astro.mjs"), "_page92");
var _page93 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/ai-chat.astro.mjs"), "_page93");
var _page94 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/index.astro.mjs"), "_page94");
var _page95 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/instrukcja_dla_nowego_projektu.astro.mjs"), "_page95");
var _page96 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/podsumowanie.astro.mjs"), "_page96");
var _page97 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/projekt-1/ai-chat.astro.mjs"), "_page97");
var _page98 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/projekt-1/deployment_guide.astro.mjs"), "_page98");
var _page99 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/projekt-1/instrukcja_dla_nowego_projektu.astro.mjs"), "_page99");
var _page100 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/projekt-1/quick_reference.astro.mjs"), "_page100");
var _page101 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/projekt-1/readme.astro.mjs"), "_page101");
var _page102 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/projekt-1/status_integracji.astro.mjs"), "_page102");
var _page103 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/projekt-2.astro.mjs"), "_page103");
var _page104 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/projekt-3.astro.mjs"), "_page104");
var _page105 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/projekt-4.astro.mjs"), "_page105");
var _page106 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/projekt-5.astro.mjs"), "_page106");
var _page107 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/projekt-6.astro.mjs"), "_page107");
var _page108 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/projekt-7.astro.mjs"), "_page108");
var _page109 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/readme_eksperymenty.astro.mjs"), "_page109");
var _page110 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty/start_guide.astro.mjs"), "_page110");
var _page111 = /* @__PURE__ */ __name(() => import("./pages/eksperymenty.astro.mjs"), "_page111");
var _page112 = /* @__PURE__ */ __name(() => import("./pages/elements.astro.mjs"), "_page112");
var _page113 = /* @__PURE__ */ __name(() => import("./pages/faq.astro.mjs"), "_page113");
var _page114 = /* @__PURE__ */ __name(() => import("./pages/features.astro.mjs"), "_page114");
var _page115 = /* @__PURE__ */ __name(() => import("./pages/feed-ai.xml.astro.mjs"), "_page115");
var _page116 = /* @__PURE__ */ __name(() => import("./pages/generator_grafiki.astro.mjs"), "_page116");
var _page117 = /* @__PURE__ */ __name(() => import("./pages/happy_news.astro.mjs"), "_page117");
var _page118 = /* @__PURE__ */ __name(() => import("./pages/import-products.astro.mjs"), "_page118");
var _page119 = /* @__PURE__ */ __name(() => import("./pages/mybonzo-pro.astro.mjs"), "_page119");
var _page120 = /* @__PURE__ */ __name(() => import("./pages/narzedzia_ai.astro.mjs"), "_page120");
var _page121 = /* @__PURE__ */ __name(() => import("./pages/newsletter.astro.mjs"), "_page121");
var _page122 = /* @__PURE__ */ __name(() => import("./pages/o-nas.astro.mjs"), "_page122");
var _page123 = /* @__PURE__ */ __name(() => import("./pages/poradniki.astro.mjs"), "_page123");
var _page124 = /* @__PURE__ */ __name(() => import("./pages/pro.astro.mjs"), "_page124");
var _page125 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/agent.astro.mjs"), "_page125");
var _page126 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/api-docs.astro.mjs"), "_page126");
var _page127 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/biurka-biurka-gamingowe.astro.mjs"), "_page127");
var _page128 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/biurka-biurka-naro\u017Cne.astro.mjs"), "_page128");
var _page129 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/biurka-biurka-proste.astro.mjs"), "_page129");
var _page130 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/biurka-biurka-z-regulacj\u0105-wysoko\u015Bci.astro.mjs"), "_page130");
var _page131 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/biurka-biurka-z-szufladami-i-drzwiami.astro.mjs"), "_page131");
var _page132 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/biurka-cz\u0119\u015Bci-do-biurek.astro.mjs"), "_page132");
var _page133 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/dla-agentow.astro.mjs"), "_page133");
var _page134 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/dodatki-do-mebli-akcesoria-.astro.mjs"), "_page134");
var _page135 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/dodatki-do-mebli-cz\u0119\u015Bci-do-mebli.astro.mjs"), "_page135");
var _page136 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/dodatki-do-mebli-o\u015Bwietlenie-led.astro.mjs"), "_page136");
var _page137 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/fotele-fotele-bujane.astro.mjs"), "_page137");
var _page138 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/fotele-fotele-do-biurka.astro.mjs"), "_page138");
var _page139 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/fotele-fotele-kube\u0142kowe.astro.mjs"), "_page139");
var _page140 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/fotele-fotele-m\u0142odzie\u017Cowe.astro.mjs"), "_page140");
var _page141 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/fotele-fotele-ogrodowe.astro.mjs"), "_page141");
var _page142 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/fotele-fotele-ogrodowe-halmar.astro.mjs"), "_page142");
var _page143 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/fotele-fotele-rozk\u0142adane.astro.mjs"), "_page143");
var _page144 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/fotele-fotele-wypoczynkowe.astro.mjs"), "_page144");
var _page145 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/halmar-tymczasowa.astro.mjs"), "_page145");
var _page146 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/hokery.astro.mjs"), "_page146");
var _page147 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/komody-komody-z-drzwiami.astro.mjs"), "_page147");
var _page148 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/komody-komody-z-szufladami.astro.mjs"), "_page148");
var _page149 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/komody-komody-z-szufladami-i-drzwiami.astro.mjs"), "_page149");
var _page150 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/kontenerki.astro.mjs"), "_page150");
var _page151 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/krzes\u0142a-krzes\u0142a-do-jadalni.astro.mjs"), "_page151");
var _page152 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/krzes\u0142a-krzes\u0142a-na-p\u0142ozie.astro.mjs"), "_page152");
var _page153 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/krzes\u0142a-krzes\u0142a-ogrodowe.astro.mjs"), "_page153");
var _page154 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/lustra.astro.mjs"), "_page154");
var _page155 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/\u0142awki-do-przedpokoju.astro.mjs"), "_page155");
var _page156 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/\u0142\xF3\u017Cka-dzieci\u0119ce.astro.mjs"), "_page156");
var _page157 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/\u0142\xF3\u017Cka-i-cz\u0119\u015Bci-cz\u0119\u015Bci-do-\u0142\xF3\u017Cek.astro.mjs"), "_page157");
var _page158 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/\u0142\xF3\u017Cka-i-cz\u0119\u015Bci-\u0142\xF3\u017Cka.astro.mjs"), "_page158");
var _page159 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/\u0142\xF3\u017Cka-i-cz\u0119\u015Bci-stela\u017Ce-do-\u0142\xF3\u017Cek.astro.mjs"), "_page159");
var _page160 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/materace-materace-piankowe.astro.mjs"), "_page160");
var _page161 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/materace-materace-spr\u0119\u017Cynowe-kieszeniowe.astro.mjs"), "_page161");
var _page162 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/meblo\u015Bcianki.astro.mjs"), "_page162");
var _page163 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/pozosta\u0142e-produkty.astro.mjs"), "_page163");
var _page164 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/p\xF3\u0142ki-wisz\u0105ce.astro.mjs"), "_page164");
var _page165 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/products/example-product.astro.mjs"), "_page165");
var _page166 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/pufy.astro.mjs"), "_page166");
var _page167 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/rega\u0142y.astro.mjs"), "_page167");
var _page168 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/sofy_i_naro\u017Cniki_sofy_2_osobowe.astro.mjs"), "_page168");
var _page169 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/sofy_i_naro\u017Cniki_sofy_3_osobowe.astro.mjs"), "_page169");
var _page170 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/sofy-i-naro\u017Cniki-naro\u017Cniki.astro.mjs"), "_page170");
var _page171 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/sofy-i-naro\u017Cniki-sofy-2-osobowe.astro.mjs"), "_page171");
var _page172 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/sofy-i-naro\u017Cniki-sofy-3-osobowe.astro.mjs"), "_page172");
var _page173 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/stela\u017Ce.astro.mjs"), "_page173");
var _page174 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/stoliki-kawowe-i-\u0142awy-\u0142awosto\u0142y.astro.mjs"), "_page174");
var _page175 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/stoliki-kawowe-i-\u0142awy-\u0142awy.astro.mjs"), "_page175");
var _page176 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/stoliki-kawowe-i-\u0142awy-stoliki-kawowe.astro.mjs"), "_page176");
var _page177 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/stoly-sto\u0142y-nierozk\u0142adane.astro.mjs"), "_page177");
var _page178 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/stoly-sto\u0142y-ogrodowe.astro.mjs"), "_page178");
var _page179 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/stoly-sto\u0142y-rozk\u0142adane.astro.mjs"), "_page179");
var _page180 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/szafki-kuchenne.astro.mjs"), "_page180");
var _page181 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/szafki-modu\u0142owe.astro.mjs"), "_page181");
var _page182 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/szafki-na-buty.astro.mjs"), "_page182");
var _page183 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/szafki-nocne.astro.mjs"), "_page183");
var _page184 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/szafki-rtv.astro.mjs"), "_page184");
var _page185 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/szafy-nadstawki-na-szaf\u0119.astro.mjs"), "_page185");
var _page186 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/szafy-szafy-uchylne.astro.mjs"), "_page186");
var _page187 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/szezlongi.astro.mjs"), "_page187");
var _page188 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/toaletki-i-konsole-konsole-.astro.mjs"), "_page188");
var _page189 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/toaletki-i-konsole-toaletki.astro.mjs"), "_page189");
var _page190 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/wieszaki-na-ubrania-wieszaki-stoj\u0105ce.astro.mjs"), "_page190");
var _page191 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/wieszaki-na-ubrania-wieszaki-\u015Bcienne.astro.mjs"), "_page191");
var _page192 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/witryny-i-kredensy-witryny.astro.mjs"), "_page192");
var _page193 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/zestawy-mebli-zestawy-mebli-do-jadalni.astro.mjs"), "_page193");
var _page194 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide/zestawy-mebli-zestawy-mebli-kuchennych.astro.mjs"), "_page194");
var _page195 = /* @__PURE__ */ __name(() => import("./pages/pumo-guide.astro.mjs"), "_page195");
var _page196 = /* @__PURE__ */ __name(() => import("./pages/r2-blog.astro.mjs"), "_page196");
var _page197 = /* @__PURE__ */ __name(() => import("./pages/rag.astro.mjs"), "_page197");
var _page198 = /* @__PURE__ */ __name(() => import("./pages/robots.txt.astro.mjs"), "_page198");
var _page199 = /* @__PURE__ */ __name(() => import("./pages/rozpoznawanie-mowy.astro.mjs"), "_page199");
var _page200 = /* @__PURE__ */ __name(() => import("./pages/rss.xml.astro.mjs"), "_page200");
var _page201 = /* @__PURE__ */ __name(() => import("./pages/search.astro.mjs"), "_page201");
var _page202 = /* @__PURE__ */ __name(() => import("./pages/sitemap-ai.xml.astro.mjs"), "_page202");
var _page203 = /* @__PURE__ */ __name(() => import("./pages/strony_internetowe.astro.mjs"), "_page203");
var _page204 = /* @__PURE__ */ __name(() => import("./pages/system/advanced-ai-assistant.astro.mjs"), "_page204");
var _page205 = /* @__PURE__ */ __name(() => import("./pages/system/ai-chat.astro.mjs"), "_page205");
var _page206 = /* @__PURE__ */ __name(() => import("./pages/system/ai-chat-main.astro.mjs"), "_page206");
var _page207 = /* @__PURE__ */ __name(() => import("./pages/system/ai-image-generator.astro.mjs"), "_page207");
var _page208 = /* @__PURE__ */ __name(() => import("./pages/system/containers.astro.mjs"), "_page208");
var _page209 = /* @__PURE__ */ __name(() => import("./pages/system/media.astro.mjs"), "_page209");
var _page210 = /* @__PURE__ */ __name(() => import("./pages/system.astro.mjs"), "_page210");
var _page211 = /* @__PURE__ */ __name(() => import("./pages/tags/_tag_/_---page_.astro.mjs"), "_page211");
var _page212 = /* @__PURE__ */ __name(() => import("./pages/tags.astro.mjs"), "_page212");
var _page213 = /* @__PURE__ */ __name(() => import("./pages/total_coulture.astro.mjs"), "_page213");
var _page214 = /* @__PURE__ */ __name(() => import("./pages/whitecat.astro.mjs"), "_page214");
var _page215 = /* @__PURE__ */ __name(() => import("./pages/wiadomosci_ai.astro.mjs"), "_page215");
var _page216 = /* @__PURE__ */ __name(() => import("./pages/index.astro.mjs"), "_page216");
var pageMap = /* @__PURE__ */ new Map([
  ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
  ["src/pages/404.astro", _page1],
  ["src/pages/ai-tools/index.astro", _page2],
  ["src/pages/analytics/utm-dashboard.astro", _page3],
  ["src/pages/api/ai/bonzo-avatar.ts", _page4],
  ["src/pages/api/ai/bonzo-chat.ts", _page5],
  ["src/pages/api/ai/bonzo-voice.ts", _page6],
  ["src/pages/api/ai/chat.ts", _page7],
  ["src/pages/api/ai/chat-openai.ts", _page8],
  ["src/pages/api/ai/chat-stream.ts", _page9],
  ["src/pages/api/ai/gallery-manage.ts", _page10],
  ["src/pages/api/ai/gateway.ts", _page11],
  ["src/pages/api/ai/gemini-chat.ts", _page12],
  ["src/pages/api/ai/generate-image.ts", _page13],
  ["src/pages/api/ai/generate-image-queue.ts", _page14],
  ["src/pages/api/ai/image/[imageId].ts", _page15],
  ["src/pages/api/ai/image-gallery.ts", _page16],
  ["src/pages/api/ai/queue-status/[requestId].ts", _page17],
  ["src/pages/api/ai/rag-shop-data.ts", _page18],
  ["src/pages/api/ai/vector-search.ts", _page19],
  ["src/pages/api/ai-analyst.ts", _page20],
  ["src/pages/api/ai-metadata.json.ts", _page21],
  ["src/pages/api/analytics/event.ts", _page22],
  ["src/pages/api/analytics/setup-db.ts", _page23],
  ["src/pages/api/analytics/utm-tracking.ts", _page24],
  ["src/pages/api/analytics.ts", _page25],
  ["src/pages/api/blog/upload-cf-image.ts", _page26],
  ["src/pages/api/blog/[postId].ts", _page27],
  ["src/pages/api/blog/index.ts", _page28],
  ["src/pages/api/business-analytics.ts", _page29],
  ["src/pages/api/business-intelligence.ts", _page30],
  ["src/pages/api/check-product-availability.ts", _page31],
  ["src/pages/api/containers/manage.ts", _page32],
  ["src/pages/api/containers/test.ts", _page33],
  ["src/pages/api/debug-env.ts", _page34],
  ["src/pages/api/debug-middleware.ts", _page35],
  ["src/pages/api/debug-pumo.ts", _page36],
  ["src/pages/api/debug-pumo-api-sync.ts", _page37],
  ["src/pages/api/debug-whitecat.ts", _page38],
  ["src/pages/api/debug-whitecat2.ts", _page39],
  ["src/pages/api/direct-pumo.ts", _page40],
  ["src/pages/api/example-with-middleware.ts", _page41],
  ["src/pages/api/features/health.ts", _page42],
  ["src/pages/api/features/registry.ts", _page43],
  ["src/pages/api/features/validate.ts", _page44],
  ["src/pages/api/generate-guides.ts", _page45],
  ["src/pages/api/health.ts", _page46],
  ["src/pages/api/import-products.ts", _page47],
  ["src/pages/api/index-now.ts", _page48],
  ["src/pages/api/media/delete.ts", _page49],
  ["src/pages/api/media/list.ts", _page50],
  ["src/pages/api/media/upload.ts", _page51],
  ["src/pages/api/migrate-products.ts", _page52],
  ["src/pages/api/ping-search-engines.ts", _page53],
  ["src/pages/api/posts.json.ts", _page54],
  ["src/pages/api/product/[id]/tracked-url.ts", _page55],
  ["src/pages/api/pumo-api-sync.ts", _page56],
  ["src/pages/api/pumo-availability-sync.ts", _page57],
  ["src/pages/api/pumo-category/[slug].json.ts", _page58],
  ["src/pages/api/pumo-chat.ts", _page59],
  ["src/pages/api/pumo-search.ts", _page60],
  ["src/pages/api/pumo-system-manager.ts", _page61],
  ["src/pages/api/pumo-system-simple.ts", _page62],
  ["src/pages/api/rag-chat.ts", _page63],
  ["src/pages/api/rag-search.ts", _page64],
  ["src/pages/api/setup-sync-table.ts", _page65],
  ["src/pages/api/simple-test-no-deps.ts", _page66],
  ["src/pages/api/simple-whitecat.ts", _page67],
  ["src/pages/api/sitemap/sync.ts", _page68],
  ["src/pages/api/test-actual-middleware.ts", _page69],
  ["src/pages/api/test-d1.ts", _page70],
  ["src/pages/api/test-environment.ts", _page71],
  ["src/pages/api/test-health-feature.ts", _page72],
  ["src/pages/api/test-isolated-middleware.ts", _page73],
  ["src/pages/api/test-middleware.ts", _page74],
  ["src/pages/api/test-middleware-imports.ts", _page75],
  ["src/pages/api/test-pumo-api.ts", _page76],
  ["src/pages/api/test-pumo-fixed.ts", _page77],
  ["src/pages/api/test-simple-middleware.ts", _page78],
  ["src/pages/api/test-simple-middleware-working.ts", _page79],
  ["src/pages/api/ultimate-test.ts", _page80],
  ["src/pages/api/ultra-simple.ts", _page81],
  ["src/pages/api/ultra-simple-test.ts", _page82],
  ["src/pages/api/utm-tracking.ts", _page83],
  ["src/pages/api/whitecat.ts", _page84],
  ["src/pages/api/whitecat-fixed.ts", _page85],
  ["src/pages/api/whitecat-fixed-new.ts", _page86],
  ["src/pages/api/whitecat-simple.ts", _page87],
  ["src/pages/ASYSTENT_AI/index.astro", _page88],
  ["src/pages/blog/[id].astro", _page89],
  ["src/pages/blog/index.astro", _page90],
  ["src/pages/blog/[...page].astro", _page91],
  ["src/pages/BROWSERY/index.astro", _page92],
  ["src/pages/eksperymenty/ai-chat.astro", _page93],
  ["src/pages/eksperymenty/INDEX.md", _page94],
  ["src/pages/eksperymenty/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md", _page95],
  ["src/pages/eksperymenty/PODSUMOWANIE.md", _page96],
  ["src/pages/eksperymenty/projekt-1/ai-chat.astro", _page97],
  ["src/pages/eksperymenty/projekt-1/DEPLOYMENT_GUIDE.md", _page98],
  ["src/pages/eksperymenty/projekt-1/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md", _page99],
  ["src/pages/eksperymenty/projekt-1/QUICK_REFERENCE.md", _page100],
  ["src/pages/eksperymenty/projekt-1/README.md", _page101],
  ["src/pages/eksperymenty/projekt-1/STATUS_INTEGRACJI.md", _page102],
  ["src/pages/eksperymenty/projekt-2/index.astro", _page103],
  ["src/pages/eksperymenty/projekt-3/index.astro", _page104],
  ["src/pages/eksperymenty/projekt-4/index.astro", _page105],
  ["src/pages/eksperymenty/projekt-5/index.astro", _page106],
  ["src/pages/eksperymenty/projekt-6/index.astro", _page107],
  ["src/pages/eksperymenty/projekt-7/index.astro", _page108],
  ["src/pages/eksperymenty/README_EKSPERYMENTY.md", _page109],
  ["src/pages/eksperymenty/START_GUIDE.md", _page110],
  ["src/pages/eksperymenty/index.astro", _page111],
  ["src/pages/elements.astro", _page112],
  ["src/pages/faq.astro", _page113],
  ["src/pages/features.astro", _page114],
  ["src/pages/feed-ai.xml.ts", _page115],
  ["src/pages/GENERATOR_GRAFIKI/index.astro", _page116],
  ["src/pages/HAPPY_NEWS/index.astro", _page117],
  ["src/pages/import-products.astro", _page118],
  ["src/pages/mybonzo-pro.astro", _page119],
  ["src/pages/NARZEDZIA_AI/index.astro", _page120],
  ["src/pages/newsletter.astro", _page121],
  ["src/pages/o-nas.astro", _page122],
  ["src/pages/poradniki/index.astro", _page123],
  ["src/pages/pro/index.astro", _page124],
  ["src/pages/pumo-guide/agent.astro", _page125],
  ["src/pages/pumo-guide/api-docs.astro", _page126],
  ["src/pages/pumo-guide/biurka-biurka-gamingowe.md", _page127],
  ["src/pages/pumo-guide/biurka-biurka-naro\u017Cne.md", _page128],
  ["src/pages/pumo-guide/biurka-biurka-proste.md", _page129],
  ["src/pages/pumo-guide/biurka-biurka-z-regulacj\u0105-wysoko\u015Bci.md", _page130],
  ["src/pages/pumo-guide/biurka-biurka-z-szufladami-i-drzwiami.md", _page131],
  ["src/pages/pumo-guide/biurka-cz\u0119\u015Bci-do-biurek.md", _page132],
  ["src/pages/pumo-guide/dla-agentow.astro", _page133],
  ["src/pages/pumo-guide/dodatki-do-mebli-akcesoria-.md", _page134],
  ["src/pages/pumo-guide/dodatki-do-mebli-cz\u0119\u015Bci-do-mebli.md", _page135],
  ["src/pages/pumo-guide/dodatki-do-mebli-o\u015Bwietlenie-led.md", _page136],
  ["src/pages/pumo-guide/fotele-fotele-bujane.md", _page137],
  ["src/pages/pumo-guide/fotele-fotele-do-biurka.md", _page138],
  ["src/pages/pumo-guide/fotele-fotele-kube\u0142kowe.md", _page139],
  ["src/pages/pumo-guide/fotele-fotele-m\u0142odzie\u017Cowe.md", _page140],
  ["src/pages/pumo-guide/fotele-fotele-ogrodowe.md", _page141],
  ["src/pages/pumo-guide/fotele-fotele-ogrodowe-halmar.md", _page142],
  ["src/pages/pumo-guide/fotele-fotele-rozk\u0142adane.md", _page143],
  ["src/pages/pumo-guide/fotele-fotele-wypoczynkowe.md", _page144],
  ["src/pages/pumo-guide/halmar-tymczasowa.md", _page145],
  ["src/pages/pumo-guide/hokery.md", _page146],
  ["src/pages/pumo-guide/komody-komody-z-drzwiami.md", _page147],
  ["src/pages/pumo-guide/komody-komody-z-szufladami.md", _page148],
  ["src/pages/pumo-guide/komody-komody-z-szufladami-i-drzwiami.md", _page149],
  ["src/pages/pumo-guide/kontenerki.md", _page150],
  ["src/pages/pumo-guide/krzes\u0142a-krzes\u0142a-do-jadalni.md", _page151],
  ["src/pages/pumo-guide/krzes\u0142a-krzes\u0142a-na-p\u0142ozie.md", _page152],
  ["src/pages/pumo-guide/krzes\u0142a-krzes\u0142a-ogrodowe.md", _page153],
  ["src/pages/pumo-guide/lustra.md", _page154],
  ["src/pages/pumo-guide/\u0142awki-do-przedpokoju.md", _page155],
  ["src/pages/pumo-guide/\u0142\xF3\u017Cka-dzieci\u0119ce.md", _page156],
  ["src/pages/pumo-guide/\u0142\xF3\u017Cka-i-cz\u0119\u015Bci-cz\u0119\u015Bci-do-\u0142\xF3\u017Cek.md", _page157],
  ["src/pages/pumo-guide/\u0142\xF3\u017Cka-i-cz\u0119\u015Bci-\u0142\xF3\u017Cka.md", _page158],
  ["src/pages/pumo-guide/\u0142\xF3\u017Cka-i-cz\u0119\u015Bci-stela\u017Ce-do-\u0142\xF3\u017Cek.md", _page159],
  ["src/pages/pumo-guide/materace-materace-piankowe.md", _page160],
  ["src/pages/pumo-guide/materace-materace-spr\u0119\u017Cynowe-kieszeniowe.md", _page161],
  ["src/pages/pumo-guide/meblo\u015Bcianki.md", _page162],
  ["src/pages/pumo-guide/pozosta\u0142e-produkty.md", _page163],
  ["src/pages/pumo-guide/p\xF3\u0142ki-wisz\u0105ce.md", _page164],
  ["src/pages/pumo-guide/products/example-product.astro", _page165],
  ["src/pages/pumo-guide/pufy.md", _page166],
  ["src/pages/pumo-guide/rega\u0142y.md", _page167],
  ["src/pages/pumo-guide/Sofy_i_naro\u017Cniki_Sofy_2_osobowe.md", _page168],
  ["src/pages/pumo-guide/Sofy_i_naro\u017Cniki_Sofy_3_osobowe.md", _page169],
  ["src/pages/pumo-guide/sofy-i-naro\u017Cniki-naro\u017Cniki.md", _page170],
  ["src/pages/pumo-guide/sofy-i-naro\u017Cniki-sofy-2-osobowe.md", _page171],
  ["src/pages/pumo-guide/sofy-i-naro\u017Cniki-sofy-3-osobowe.md", _page172],
  ["src/pages/pumo-guide/stela\u017Ce.md", _page173],
  ["src/pages/pumo-guide/stoliki-kawowe-i-\u0142awy-\u0142awosto\u0142y.md", _page174],
  ["src/pages/pumo-guide/stoliki-kawowe-i-\u0142awy-\u0142awy.md", _page175],
  ["src/pages/pumo-guide/stoliki-kawowe-i-\u0142awy-stoliki-kawowe.md", _page176],
  ["src/pages/pumo-guide/stoly-sto\u0142y-nierozk\u0142adane.md", _page177],
  ["src/pages/pumo-guide/stoly-sto\u0142y-ogrodowe.md", _page178],
  ["src/pages/pumo-guide/stoly-sto\u0142y-rozk\u0142adane.md", _page179],
  ["src/pages/pumo-guide/szafki-kuchenne.md", _page180],
  ["src/pages/pumo-guide/szafki-modu\u0142owe.md", _page181],
  ["src/pages/pumo-guide/szafki-na-buty.md", _page182],
  ["src/pages/pumo-guide/szafki-nocne.md", _page183],
  ["src/pages/pumo-guide/szafki-rtv.md", _page184],
  ["src/pages/pumo-guide/szafy-nadstawki-na-szaf\u0119.md", _page185],
  ["src/pages/pumo-guide/szafy-szafy-uchylne.md", _page186],
  ["src/pages/pumo-guide/szezlongi.md", _page187],
  ["src/pages/pumo-guide/toaletki-i-konsole-konsole-.md", _page188],
  ["src/pages/pumo-guide/toaletki-i-konsole-toaletki.md", _page189],
  ["src/pages/pumo-guide/wieszaki-na-ubrania-wieszaki-stoj\u0105ce.md", _page190],
  ["src/pages/pumo-guide/wieszaki-na-ubrania-wieszaki-\u015Bcienne.md", _page191],
  ["src/pages/pumo-guide/witryny-i-kredensy-witryny.md", _page192],
  ["src/pages/pumo-guide/zestawy-mebli-zestawy-mebli-do-jadalni.md", _page193],
  ["src/pages/pumo-guide/zestawy-mebli-zestawy-mebli-kuchennych.md", _page194],
  ["src/pages/pumo-guide/index.astro", _page195],
  ["src/pages/r2-blog/index.astro", _page196],
  ["src/pages/rag.astro", _page197],
  ["src/pages/robots.txt.ts", _page198],
  ["src/pages/rozpoznawanie-mowy/index.astro", _page199],
  ["src/pages/rss.xml.ts", _page200],
  ["src/pages/search.astro", _page201],
  ["src/pages/sitemap-ai.xml.ts", _page202],
  ["src/pages/STRONY_INTERNETOWE/index.astro", _page203],
  ["src/pages/system/advanced-ai-assistant.astro", _page204],
  ["src/pages/system/ai-chat.astro", _page205],
  ["src/pages/system/ai-chat-main.astro", _page206],
  ["src/pages/system/ai-image-generator.astro", _page207],
  ["src/pages/system/containers.astro", _page208],
  ["src/pages/system/media.astro", _page209],
  ["src/pages/system/index.astro", _page210],
  ["src/pages/tags/[tag]/[...page].astro", _page211],
  ["src/pages/tags/index.astro", _page212],
  ["src/pages/TOTAL_COULTURE/index.astro", _page213],
  ["src/pages/whitecat.astro", _page214],
  ["src/pages/WIADOMOSCI_AI/index.astro", _page215],
  ["src/pages/index.astro", _page216]
]);
var _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  actions: /* @__PURE__ */ __name(() => import("./noop-entrypoint.mjs"), "actions"),
  middleware: /* @__PURE__ */ __name(() => import("./_astro-internal_middleware.mjs"), "middleware")
});
var _args = void 0;
var _exports = createExports(_manifest);
var __astrojsSsrVirtualEntry = _exports.default;
var _start = "start";
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
  serverEntrypointModule[_start](_manifest, _args);
}
export {
  __astrojsSsrVirtualEntry as default,
  pageMap
};
//# sourceMappingURL=bundledWorker-0.6933235781270269.mjs.map
