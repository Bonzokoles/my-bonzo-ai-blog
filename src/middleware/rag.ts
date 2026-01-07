export async function onRequest({ locals, request }, next) {
  // Intercept requests to inject RAG data
  if (request.url.includes('/pumo-guide')) {
      console.log("RAG Middleware active for: " + request.url);
      
      try {
          // Call the Worker (Michael)
          // URL should be your deployed worker URL
          const ragResponse = await fetch('https://jimbo-angels-worker.stolarnia-ams.workers.dev/orchestrate', {
            method: 'POST',
            body: JSON.stringify({topic: new URL(request.url).pathname})
          });
          
          if (ragResponse.ok) {
              locals.ragData = await ragResponse.json();
          }
      } catch (e) {
          console.error("RAG Fetch Failed", e);
      }
  }
  return next();
}
