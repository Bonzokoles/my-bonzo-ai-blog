addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/subpage')) {
    const subpageUrl = url.href.replace(url.origin, 'https://subpage.example.workers.dev');
    return fetch(subpageUrl, request);
  }

  const mainAppUrl = url.href.replace(url.origin, 'https://mainapp.example.workers.dev');
  return fetch(mainAppUrl, request);
}
