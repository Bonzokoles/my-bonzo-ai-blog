globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                    */
import { c as createComponent, m as maybeRenderHead, am as unescapeHTML, a as renderTemplate } from '../../chunks/astro/server_CENSSoee.mjs';
export { renderers } from '../../renderers.mjs';

const html = () => "<ol>\n<li>Utwórz folder projektu\r\nStruktura katalogów powinna wyglądać tak:</li>\n</ol>\n<p>text\r\neksperymenty\\NAZWA_PROJEKTU<br>\nmain-app<br>\nsubpage<br>\nworker-proxy<br>\n2. Skopiuj pliki konfiguracyjne z katalogu KONFIG_PODPROJEKT\r\nDo każdego podfolderu (main-app, subpage, worker-proxy) skopiuj odpowiedni szablon:</p>\n<p>astro.config.mjs, package.json, wrangler.toml/jsonc, public/_headers, src/pages/index.astro (dla app i subpage)</p>\n<p>index.js, package.json, wrangler.toml/jsonc (dla worker-proxy)</p>\n<p>Dokumentację: README.md lub INSTRUKCJA.md</p>\n<ol start=\"3\">\n<li>Ustawienia konfiguracyjne\r\nEdytuj nazwę projektu, route, zone_id i account_id w plikach wrangler.toml.</li>\n</ol>\n<p>W astro.config.mjs w subpage ustaw base: “/subpage/”.</p>\n<ol start=\"4\">\n<li>Instalacja zależności (każdy podprojekt osobno)\r\nbash\r\nnpm install</li>\n<li>Build i deploy (każdy podprojekt osobno)\r\nbash\r\nnpm run build\r\nnpm run deploy\r\nalbo (jeśli skrypt deploy = wrangler publish):</li>\n</ol>\n<p>bash\r\nnpx wrangler publish\r\n6. Routing\r\nWorker-proxy rozdziela ruch na domenie na podstawie ścieżki /subpage/* do podstrony, a resztę do main-app.</p>\n<p>Skonfiguruj domenę w Cloudflare tak, by requests przechodziły przez Workera.</p>\n<ol start=\"7\">\n<li>\n<p>Automatyzacja — GitHub Actions\r\nSkopiuj i ustaw workflow z .github/workflows jeśli korzystasz z GitHub.</p>\n</li>\n<li>\n<p>Checklist &#x26; troubleshooting\r\nSprawdź ścieżki w base, route i adresach proxy (index.js w worker-proxy).</p>\n</li>\n</ol>\n<p>Po zmianach w worker-proxy nie zapomnij ponownie go zdeployować.</p>\n<p>Więcej porad/typowych błędów znajdziesz w plikach TROUBLESHOOTING.md i STEP_BY_STEP_GUIDE.md.</p>\n<ol start=\"9\">\n<li>Dodawanie nowych podstron/eksperymentów\r\nPowielaj ten szablon — zawsze trzy foldery, spójne nazwy, komplet plików konfiguracyjnych.</li>\n</ol>\n<p>Wskazówki:</p>\n<p>Pracuj zawsze na osobnych gałęziach repozytorium dla każdego eksperymentu.</p>\n<p>Aktualizuj instrukcje na bieżąco według własnego doświadczenia (dla siebie i współpracowników).</p>\n<p>Dokumentację i troubleshooting trzymaj zawsze w głównym folderze projektu.</p>";

				const frontmatter = {};
				const file = "U:/WWW_MYbonzoai_blog/src/pages/eksperymenty/INSTRUKCJA_DLA_NOWEGO_PROJEKTU.md";
				const url = "/eksperymenty/INSTRUKCJA_DLA_NOWEGO_PROJEKTU";
				function rawContent() {
					return "1. Utwórz folder projektu\r\nStruktura katalogów powinna wyglądać tak:\r\n\r\ntext\r\neksperymenty\\NAZWA_PROJEKTU\\\r\n    main-app\\\r\n    subpage\\\r\n    worker-proxy\\\r\n2. Skopiuj pliki konfiguracyjne z katalogu KONFIG_PODPROJEKT\r\nDo każdego podfolderu (main-app, subpage, worker-proxy) skopiuj odpowiedni szablon:\r\n\r\nastro.config.mjs, package.json, wrangler.toml/jsonc, public/_headers, src/pages/index.astro (dla app i subpage)\r\n\r\nindex.js, package.json, wrangler.toml/jsonc (dla worker-proxy)\r\n\r\nDokumentację: README.md lub INSTRUKCJA.md\r\n\r\n3. Ustawienia konfiguracyjne\r\nEdytuj nazwę projektu, route, zone_id i account_id w plikach wrangler.toml.\r\n\r\nW astro.config.mjs w subpage ustaw base: \"/subpage/\".\r\n\r\n4. Instalacja zależności (każdy podprojekt osobno)\r\nbash\r\nnpm install\r\n5. Build i deploy (każdy podprojekt osobno)\r\nbash\r\nnpm run build\r\nnpm run deploy\r\nalbo (jeśli skrypt deploy = wrangler publish):\r\n\r\nbash\r\nnpx wrangler publish\r\n6. Routing\r\nWorker-proxy rozdziela ruch na domenie na podstawie ścieżki /subpage/* do podstrony, a resztę do main-app.\r\n\r\nSkonfiguruj domenę w Cloudflare tak, by requests przechodziły przez Workera.\r\n\r\n7. Automatyzacja — GitHub Actions\r\nSkopiuj i ustaw workflow z .github/workflows jeśli korzystasz z GitHub.\r\n\r\n8. Checklist & troubleshooting\r\nSprawdź ścieżki w base, route i adresach proxy (index.js w worker-proxy).\r\n\r\nPo zmianach w worker-proxy nie zapomnij ponownie go zdeployować.\r\n\r\nWięcej porad/typowych błędów znajdziesz w plikach TROUBLESHOOTING.md i STEP_BY_STEP_GUIDE.md.\r\n\r\n9. Dodawanie nowych podstron/eksperymentów\r\nPowielaj ten szablon — zawsze trzy foldery, spójne nazwy, komplet plików konfiguracyjnych.\r\n\r\nWskazówki:\r\n\r\nPracuj zawsze na osobnych gałęziach repozytorium dla każdego eksperymentu.\r\n\r\nAktualizuj instrukcje na bieżąco według własnego doświadczenia (dla siebie i współpracowników).\r\n\r\nDokumentację i troubleshooting trzymaj zawsze w głównym folderze projektu.";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`<meta charset="utf-8">${maybeRenderHead()}${unescapeHTML(html())}`;
				});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	Content,
	compiledContent,
	default: Content,
	file,
	frontmatter,
	getHeadings,
	rawContent,
	url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
