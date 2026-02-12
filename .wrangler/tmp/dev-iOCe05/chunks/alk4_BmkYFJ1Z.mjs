globalThis.process ??= {}; globalThis.process.env ??= {};
const coverImage = new Proxy({"src":"/_assets/alk4.BG6DekIU.png","width":904,"height":904,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "U:/WWW_MYbonzoai_blog/src/assets/alk4.png";
							}
							
							return target[name];
						}
					});

export { coverImage as c };
