globalThis.process ??= {}; globalThis.process.env ??= {};
import { d as defineMiddleware, s as sequence } from './chunks/index_Dr4QNiR4.mjs';
import './chunks/astro-designed-error-pages_CMeLk5xm.mjs';
import './chunks/astro/server_CENSSoee.mjs';

const onRequest$2 = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  if (url.pathname.startsWith("/pumo-guide/") && url.pathname !== "/pumo-guide/" && url.pathname !== "/pumo-guide" && !url.pathname.startsWith("/pumo-guide/dla-agentow")) {
    if (url.pathname.includes("_") || /[A-Z]/.test(url.pathname)) {
      const newPath = url.pathname.toLowerCase().replace(/_/g, "-");
      return context.redirect(newPath, 301);
    }
  }
  return next();
});

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	onRequest$2
	
);

export { onRequest };
