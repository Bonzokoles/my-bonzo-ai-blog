# Gemini Avatar - Bonzo

React app with Google Gemini AI for voice and text conversations about PORTA doors.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Gemini API key to `.env`:
```
VITE_GEMINI_API_KEY=your-api-key-from-https://aistudio.google.com/app/apikey
```

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Deploy to Cloudflare Pages

1. Build the app:
```bash
npm run build
```

2. Deploy `dist/` folder to Cloudflare Pages

3. Set environment variable in Cloudflare Pages:
   - `VITE_GEMINI_API_KEY` = your Gemini API key

## Features

- **Text Chat**: Send messages to Gemini AI about PORTA doors
- **Live Conversation**: Voice chat (coming soon - requires WebRTC)
- **Door Knowledge Base**: Expert information on 5 PORTA door models
- **Polish Language**: Bonzo responds in Polish

## Access

After deployment, access at:
- Main app: `https://mybonzoaiblog.pages.dev/gemini-avatar/`
- Or link from experiments page

## Integration with Main App

Add link in `src/pages/eksperymenty/index.astro`:

```html
<a href="/gemini-avatar/" target="_blank">
  🤖 Rozmowa z Bonzo Avatar
</a>
```
