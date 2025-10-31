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
