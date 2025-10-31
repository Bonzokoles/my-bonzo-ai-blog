📂 Struktura folderów
bonzo-ai-door-avatar/
├── public/
│   ├── avatar/
│   │   ├── Untitled Videoja334+mybonz.mp4
│   │   └── Untitled Videoja334+mybonz-caption.srt
│   └── catalog.json
├── src/
│   ├── components/
│   │   └── AvatarChat.tsx
│   ├── utils/
│   │   └── avatar-player.js
│   └── workers/
│       └── ai-avatar.ts
├── wrangler.toml
└── README.md

1. Plik public/catalog.json
{
  "drzwi": [
    { "id": 1, "name": "Drzwi 1", "price": "1300 PLN" },
    { "id": 2, "name": "Drzwi 2", "price": "1500 PLN" },
    { "id": 3, "name": "Drzwi 3", "price": "1700 PLN" },
    { "id": 4, "name": "Drzwi 4", "price": "2000 PLN" },
    { "id": 5, "name": "Drzwi 5", "price": "2400 PLN" }
  ]
}

2. Plik src/utils/avatar-player.js
// Odtwarza wideo HeyGen i pokazuje napisy z pliku .srt
export function setupAvatarPlayer(videoEl, captionsEl, srtUrl) {
  fetch(srtUrl)
    .then(r => r.text())
    .then(text => {
      const captions = parseSRT(text);
      videoEl.addEventListener("timeupdate", () => {
        const t = videoEl.currentTime;
        const line = captions.find(c => t >= c.start && t <= c.end);
        captionsEl.textContent = line ? line.text : "";
      });
    });
}

function parseSRT(srt) {
  return srt.split("\n\n").map(block => {
    const [, time, ...text] = block.split("\n");
    const [start, end] = time.split(" --> ").map(t => toSec(t));
    return { start, end, text: text.join(" ") };
  });
}
function toSec(t) {
  const [h, m, s] = t.split(":");
  const [sec] = s.split(",");
  return +h * 3600 + +m * 60 + +sec;
}

3. Plik src/components/AvatarChat.tsx
import { useEffect, useRef, useState } from "react";
import { setupAvatarPlayer } from "../utils/avatar-player";

export default function AvatarChat() {
  const [phase, setPhase] = useState<"intro"|"live">("intro");
  const [response, setResponse] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const captionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setupAvatarPlayer(
      videoRef.current!,
      captionsRef.current!,
      "/avatar/Untitled Videoja334+mybonz-caption.srt"
    );
    videoRef.current!.addEventListener("ended", () => setPhase("live"));
  }, []);

  const speakLive = async (text: string) => {
    const resp = await fetch("/api/ai/avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await resp.json();
    setResponse(data.reply);
    const audio = new Audio(data.audioUrl);
    audio.play();
  };

  return (
    <div className="avatar-wrapper">
      <video ref={videoRef} src="/avatar/Untitled Videoja334+mybonz.mp4" autoPlay />
      <div ref={captionsRef} className="captions" />
      {phase === "live" && (
        <div className="chat">
          <input id="msg" placeholder="Zadaj pytanie..." onKeyDown={e=>{
            if(e.key==="Enter") speakLive((e.target as HTMLInputElement).value);
          }}/>
          <div className="bot">{response}</div>
        </div>
      )}
    </div>
  );
}

4. Plik src/workers/ai-avatar.ts
export default {
  async fetch(request, env) {
    const { message } = await request.json();
    const base = `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/bonzo-ai-gateway/openai`;

    const chat = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content:
            "Jesteś Bonzo – sprzedawca drzwi. Odpowiadasz po polsku, rzeczowo, z lekkim sarkazmem i humorem." },
          { role: "user", content: message }
        ]
      })
    });
    const data = await chat.json();
    const text = data.choices[0].message.content;

    // generuj głos
    const tts = await fetch(`${base}/audio/speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "oak",
        input: text
      })
    });
    const audioArrayBuffer = await tts.arrayBuffer();
    const audioBase64 = Buffer.from(audioArrayBuffer).toString("base64");
    const audioUrl = `data:audio/mp3;base64,${audioBase64}`;

    return new Response(JSON.stringify({ reply: text, audioUrl }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};

5. Plik wrangler.toml
name = "bonzo-ai-door-avatar"
main = "src/workers/ai-avatar.ts"
compatibility_date = "2024-10-30"

[vars]
CF_ACCOUNT_ID = "twoje-cloudflare-account-id"
OPENAI_API_KEY = "twój-klucz-openai"

6. Plik README.md
# Bonzo AI Avatar - Sprzedawca Drzwi

## Instrukcja Uruchomienia

1. **Zainstaluj wymagane zależności**:
   ```bash
   npm install


Uruchom lokalnie:

npm run dev


Otwórz w przeglądarce:
Wejdź na http://localhost:8787, aby zobaczyć działającego Bonzo w akcji!

Po zakończeniu intro:
Bonzo będzie mówił i reagował na Twoje pytania. Możesz zapytać o drzwi, ich ceny lub poprosić o więcej informacji.


---

### **Pliki wideo i napisy**
- **Wideo:** `Untitled Videoja334+mybonz.mp4` (Twój HeyGen awatar)
- **Napisy:** `Untitled Videoja334+mybonz-caption.srt`  
