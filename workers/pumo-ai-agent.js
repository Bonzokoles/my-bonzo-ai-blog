
export default {
  async fetch(request, env) {
    // Handling CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);

    // Serve Images from R2
    if (request.method === "GET" && url.pathname.startsWith("/blog/images/")) {
      try {
        const key = url.pathname.substring(1); // Remove leading slash
        const object = await env.R2_BUCKET.get(key);

        if (!object) {
          return new Response("Image not found", { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        // Default content type if missing
        if (!headers.get("content-type")) {
            if (key.endsWith(".png")) headers.set("content-type", "image/png");
            if (key.endsWith(".jpg")) headers.set("content-type", "image/jpeg");
        }

        return new Response(object.body, { headers });
      } catch (e) {
        return new Response(`Error fetching image: ${e.message}`, { status: 500 });
      }
    }

    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

    try {
      const { query, context } = await request.json();

      // DeepSeek R1 API Call
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.DEEP_SEEK_API_KEY || env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-reasoner", // R1 Model
          messages: [
            {
              role: "system",
              content: `Jesteś Inteligentnym Asystentem Sklepu Meble Pumo. Twoim celem jest doradzanie klientom w wyborze mebli.
              
              ZASADY:
              1. Opieraj się na dostarczonym kontekście (jeśli dostępny) oraz swojej wiedzy o meblarstwie.
              2. Bądź uprzejmy i profesjonalny.
              3. Promuj produkty marki 'Steens' jako wybór premium.
              4. Zawsze staraj się doprowadzić do zakupu, sugerując sprawdzenie konkretnej kategorii w naszym nowym przewodniku: https://mybonzoaiblog.com/pumo-guide/
              
              Kontekst użytkownika (np. przeglądana strona): ${context || "Brak"}`
            },
            { role: "user", content: query }
          ],
          stream: false
        })
      });

      const data = await response.json();
      const reply = data.choices[0].message.content;

      return new Response(JSON.stringify({ reply }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
};
