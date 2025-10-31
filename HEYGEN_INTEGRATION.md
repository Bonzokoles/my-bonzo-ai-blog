# HeyGen Voice Integration - Bonzo AI

## Overview
Integrated HeyGen TTS (Text-to-Speech) for natural Polish voice responses in Bonzo chat.

## Voice Configuration
- **Voice ID**: `30e127089cf14adfad2d8d2eed5e3efe`
- **Language**: `pl-PL` (Polish)
- **API Endpoint**: `https://api.heygen.com/v1/voice.create`

## Implementation

### 1. API Integration (`bonzo-chat.ts`)
- Added HeyGen TTS after OpenAI response generation
- Returns both text (`reply`) and audio (`audioUrl`) in response
- Audio encoded as base64 data URI: `data:audio/mp3;base64,...`
- Graceful fallback: text-only response if TTS fails

### 2. Frontend (`experiments.astro`, `eksperymenty/index.astro`)
- Automatically plays audio when available
- Uses Web Audio API for playback
- Error handling for audio playback failures

### 3. Environment Variables
Add to `.env` file:
```bash
HEYGEN_API_KEY=your-heygen-api-key-here
```

Get API key from: https://app.heygen.com/

### 4. Cloudflare Pages Secrets
Add to Cloudflare Dashboard > Pages > Settings > Environment Variables:
```
HEYGEN_API_KEY = [your-production-key]
```

## API Request Format
```typescript
POST https://api.heygen.com/v1/voice.create
Headers:
  X-Api-Key: YOUR_API_KEY
  Content-Type: application/json
Body:
{
  "text": "Response text in Polish",
  "voice_id": "30e127089cf14adfad2d8d2eed5e3efe",
  "language": "pl-PL"
}
```

## Configuration Steps

### 1. Local Development (.env)
```bash
HEYGEN_API_KEY=sk_V2_hgu_kK84UzkIxrW_PEPm3pJCAPQmwVSObR94ccqfdU9CYl2l
OPENAI_API_KEY=your-openai-key
CLOUDFLARE_ACCOUNT_ID=your-account-id
AI_GATEWAY_SLUG=bonzo-ai-gateway
```

### 2. Cloudflare Pages (Production)
Add to **Cloudflare Dashboard > Pages > Settings > Environment Variables**:
```
HEYGEN_API_KEY = sk_V2_hgu_kK84UzkIxrW_PEPm3pJCAPQmwVSObR94ccqfdU9CYl2l
OPENAI_API_KEY = [your-production-key]
CLOUDFLARE_ACCOUNT_ID = [your-account-id]
CLOUDFLARE_API_TOKEN = [your-api-token]
AI_GATEWAY_SLUG = bonzo-ai-gateway
```

### 3. wrangler.toml (Non-secret vars only)
```toml
[vars]
HEYGEN_VOICE_ID = "30e127089cf14adfad2d8d2eed5e3efe"
AI_GATEWAY_SLUG = "bonzo-ai-gateway"
```

**⚠️ IMPORTANT**: Never commit actual API keys to wrangler.toml!

## Testing
1. Navigate to `/eksperymenty` page
2. Switch to "💬 Tekst" mode
3. Send message: "Ile kosztuje Focus Premium?"
4. Verify:
   - Text response appears
   - Audio starts playing automatically
   - Check browser console for any errors

### Avatar Chat Testing
1. Navigate to experiments folder: `cd experiments/bonzo-ai-door-avatar`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Test avatar interactions:
   - Video plays intro automatically
   - After intro, chat interface appears
   - Type question and press Enter
   - Verify text + audio response

## Files Modified
- `src/pages/api/ai/bonzo-chat.ts` - Added HeyGen TTS
- `src/pages/api/ai/avatar.ts` - **NEW** Avatar chat endpoint with HeyGen
- `src/pages/experiments.astro` - Audio playback
- `src/pages/eksperymenty/index.astro` - Audio playback
- `experiments/bonzo-ai-door-avatar/src/components/AvatarChat.tsx` - Avatar component
- `.env` - Added HEYGEN_API_KEY (local dev)
- `.env.example` - Added HEYGEN_API_KEY template
- `wrangler.toml` - Added HEYGEN_VOICE_ID config

## API Endpoints

### `/api/ai/bonzo-chat` - Text Chat with Voice
- **Method**: POST
- **Body**: `{ "message": "your question" }`
- **Response**: `{ "reply": "text response", "audioUrl": "data:audio/mp3;base64,..." }`
- **Used by**: `/eksperymenty` page (Text mode)

### `/api/ai/avatar` - Avatar Chat with Voice
- **Method**: POST
- **Body**: `{ "message": "your question" }`
- **Response**: `{ "reply": "text response", "audioUrl": "data:audio/mp3;base64,..." }`
- **Used by**: `experiments/bonzo-ai-door-avatar` React component
- **Features**: Shorter responses (max 200 tokens) optimized for avatar

### `/api/ai/bonzo-voice` - WebSocket Realtime Voice
- **Method**: GET (returns ephemeral token for WebSocket)
- **Response**: `{ "client_secret": "...", "expires_at": ..., "session_id": "..." }`
- **Used by**: `/eksperymenty` page (Voice/Realtime mode)
- **Technology**: OpenAI Realtime API with Server VAD

## Next Steps
- [x] ~~Add to Cloudflare Pages environment variables~~ DONE
- [x] ~~Create avatar endpoint~~ DONE (`/api/ai/avatar.ts`)
- [ ] Upload intro video for avatar to R2 bucket
- [ ] Test avatar component with HeyGen voice
- [ ] Test on production deployment
- [ ] Monitor HeyGen API usage/costs
- [ ] Consider caching audio responses in R2 bucket
- [ ] Add audio loading indicator in UI
- [ ] Implement voice selection (if multiple voices needed)

## Cost Considerations
- HeyGen charges per character synthesized
- Average response: ~200-300 characters
- Monitor usage in HeyGen Dashboard
- Consider implementing response caching for frequently asked questions

## Troubleshooting
- **No audio**: Check HEYGEN_API_KEY in environment
- **API errors**: Verify voice_id and API key validity
- **Playback fails**: Check browser audio permissions
- **Console errors**: Check network tab for HeyGen response details
