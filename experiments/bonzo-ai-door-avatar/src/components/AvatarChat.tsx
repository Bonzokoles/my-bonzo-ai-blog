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
      "https://pub-your-r2-url.r2.dev/avatar/bonzo-intro.srt"
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
      <video ref={videoRef} src="https://pub-your-r2-url.r2.dev/avatar/bonzo-intro.mp4" autoPlay />
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
