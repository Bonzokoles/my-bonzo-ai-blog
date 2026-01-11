# Avatar Intro Video Setup Guide

## Przygotowanie Video

### 1. Nagranie Intro
Nagraj krótkie (15-30 sekund) wideo przedstawiające Bonzo:

**Zawartość intro:**
- Powitanie: "Cześć! Jestem Bonzo, Twój ekspert od drzwi PORTA."
- Krótka informacja: "Pomogę Ci wybrać idealne drzwi do Twojego domu."
- Call to action: "Zadaj mi pytanie o nasze modele!"

**Parametry techniczne:**
- Format: MP4 (H.264)
- Rozdzielczość: 1920x1080 (Full HD) lub 1280x720 (HD)
- Długość: 15-30 sekund
- Bitrate: ~5 Mbps dla FHD, ~3 Mbps dla HD
- Audio: AAC, 128 kbps, stereo

### 2. Upload do R2 Bucket

#### Przez Cloudflare Dashboard:
1. Login: https://dash.cloudflare.com/
2. R2 > `mybonzo-media` bucket
3. Upload Files > wybierz `bonzo-intro.mp4`
4. Utwórz folder `avatar/` jeśli nie istnieje
5. Skopiuj Public URL

#### Przez wrangler CLI:
```bash
wrangler r2 object put mybonzo-media/avatar/bonzo-intro.mp4 --file ./bonzo-intro.mp4
```

**Public URL format:**
```
https://pub-25059caf15274ebd844548094bfb4dc1.r2.dev/avatar/bonzo-intro.mp4
```

### 3. Napisy/Subtitles (opcjonalne)

#### Tworzenie pliku SRT:
Zapisz jako `bonzo-intro.srt`:
```srt
1
00:00:00,000 --> 00:00:03,000
Cześć! Jestem Bonzo,

2
00:00:03,000 --> 00:00:06,000
Twój ekspert od drzwi PORTA.

3
00:00:06,000 --> 00:00:10,000
Pomogę Ci wybrać idealne drzwi do Twojego domu.

4
00:00:10,000 --> 00:00:13,000
Zadaj mi pytanie o nasze modele!
```

#### Upload SRT:
```bash
wrangler r2 object put mybonzo-media/avatar/bonzo-intro.srt --file ./bonzo-intro.srt
```

### 4. Aktualizacja Komponentu

#### W `AvatarChat.tsx`:
```tsx
useEffect(() => {
  setupAvatarPlayer(
    videoRef.current!,
    captionsRef.current!,
    "https://pub-25059caf15274ebd844548094bfb4dc1.r2.dev/avatar/bonzo-intro.srt"
  );
  videoRef.current!.addEventListener("ended", () => setPhase("live"));
}, []);

return (
  <div className="avatar-wrapper">
    <video 
      ref={videoRef} 
      src="https://pub-25059caf15274ebd844548094bfb4dc1.r2.dev/avatar/bonzo-intro.mp4" 
      autoPlay 
    />
    <div ref={captionsRef} className="captions" />
    {/* ... rest of component */}
  </div>
);
```

## Testy

### Lokalne (bez video):
```bash
cd experiments/bonzo-ai-door-avatar
npm run dev
```

### Z video na R2:
1. Upload video do R2
2. Zaktualizuj URL w `AvatarChat.tsx`
3. Deploy lub test lokalnie z production URLs

## Optymalizacje

### Kompresja Video:
```bash
# Użyj FFmpeg dla optymalizacji
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k bonzo-intro.mp4
```

### Miniaturka/Poster:
```bash
# Ekstrakcja pierwszej klatki jako poster
ffmpeg -i bonzo-intro.mp4 -ss 00:00:01 -vframes 1 bonzo-poster.jpg

# Upload postera
wrangler r2 object put mybonzo-media/avatar/bonzo-poster.jpg --file ./bonzo-poster.jpg
```

Dodaj poster w komponencie:
```tsx
<video 
  poster="https://pub-25059caf15274ebd844548094bfb4dc1.r2.dev/avatar/bonzo-poster.jpg"
  src="..."
/>
```

## Checklist

- [ ] Nagrane intro video (15-30s)
- [ ] Skompresowane do ~5 Mbps
- [ ] Uploadowane do R2 bucket (`avatar/bonzo-intro.mp4`)
- [ ] Opcjonalnie: napisy SRT uploadowane
- [ ] Opcjonalnie: poster uploadowany
- [ ] Zaktualizowane URLe w `AvatarChat.tsx`
- [ ] Przetestowane lokalnie
- [ ] Deploy na production
- [ ] Weryfikacja playback na live site

## Troubleshooting

**Video nie ładuje się:**
- Sprawdź public access na R2 bucket
- Verify URL w konsoli browser DevTools
- Check CORS settings w R2 bucket config

**Napisy nie pokazują:**
- Verify format SRT (UTF-8 encoding)
- Check timing w pliku SRT
- Sprawdź CSS dla `.captions` class

**Autoplay nie działa:**
- Dodaj `muted` attribute do `<video>`
- Browser policy wymaga muted dla autoplay
- Użytkownik musi zezwolić na autoplay w ustawieniach

**Jakość niska:**
- Zwiększ bitrate w FFmpeg
- Użyj wyższej rozdzielczości source
- Check CDN delivery (R2 powinno być szybkie)
