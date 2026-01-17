export async function onRequest(context, next) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Sprawdź czy URL dotyczy pumo-guide i zawiera podkreślniki lub wielkie litery
  if (path.startsWith('/pumo-guide/') && (path.includes('_') || /[A-Z]/.test(path))) {
    // Zamień podkreślniki na myślniki i wszystko na małe litery
    const newPath = path.replace(/_/g, '-').toLowerCase();
    
    // Unikaj pętli przekierowań jeśli URL się nie zmienił (np. przypadek brzegowy)
    if (newPath !== path) {
      return Response.redirect(new URL(newPath, url.origin), 301);
    }
  }

  return next();
}
