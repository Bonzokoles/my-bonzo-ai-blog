globalThis.process ??= {}; globalThis.process.env ??= {};
async function getMod() {
						return import('./rag-moa-podstawy-2025_BcwAzyuB.mjs');
					}
					const collectedLinks = [];
					const collectedStyles = [];
					const defaultMod = { __astroPropagation: true, getMod, collectedLinks, collectedStyles, collectedScripts: [] };

export { defaultMod as default };
