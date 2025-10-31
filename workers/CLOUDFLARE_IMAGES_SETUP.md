# Cloudflare Images Setup for MyBonzo Blog

## Overview
Cloudflare Images integration provides optimized image delivery, automatic resizing, and CDN distribution for blog images.

## Features Added
- ✅ **CF Images API Integration** - Upload directly to Cloudflare Images
- ✅ **Automatic Image Optimization** - Multiple variants (webp, different sizes)
- ✅ **CDN Delivery** - Global edge distribution
- ✅ **Custom Image Tags** - `[[CF:image-name]]` syntax for blog posts
- ✅ **R2 Metadata Storage** - Track CF Images references in R2

## API Endpoints

### Upload to Cloudflare Images
```
POST /api/blog/upload-cf-image
Content-Type: multipart/form-data

FormData:
- image: File (required)
- postId: string (required) 
- imageName: string (optional)
```

**Response:**
```json
{
  "success": true,
  "imageName": "001-1",
  "cloudflareId": "uuid-here",
  "imageUrl": "https://imagedelivery.net/HASH/uuid/public",
  "variants": [
    "https://imagedelivery.net/HASH/uuid/public",
    "https://imagedelivery.net/HASH/uuid/thumbnail"
  ]
}
```

## Configuration Required

### 1. Cloudflare Dashboard Setup
1. Go to **Cloudflare Dashboard > Images**
2. Click **"Enable Cloudflare Images"**
3. Note your **Account ID** (already configured: `[USUNIĘTO_ZE_WZGLĘDÓW_BEZPIECZEŃSTWA]`)
4. Get your **delivery hash** from the Images section

### 2. API Token Setup
1. Go to **Cloudflare Dashboard > My Profile > API Tokens**
2. Create token with **Cloudflare Images:Edit** permissions
3. Already set in worker: `CF_IMAGES_API_TOKEN` secret

### 3. Update Configuration
In `workers/wrangler.toml`, update:
```toml
CF_IMAGES_DELIVERY_URL = "https://imagedelivery.net/YOUR_ACTUAL_HASH"
```

## Usage in Blog Posts

### Traditional R2 Images (current)
```markdown
![Alt text]([[001-1.jpg]])
```
→ Serves from: `https://mybonzo-blog-worker.stolarnia-ams.workers.dev/blog/images/001-1.jpg`

### Cloudflare Images (new)
```markdown
![Alt text]([[CF:001-1]])
```
→ Serves from: `https://imagedelivery.net/HASH/001-1/public`

## Benefits of CF Images

### Performance
- **Automatic WebP/AVIF** - Modern format conversion
- **Multiple Variants** - Thumbnail, mobile, desktop sizes
- **Global CDN** - Edge caching worldwide
- **Lazy Loading** - Built-in optimization

### Management  
- **Automatic Compression** - Optimal file sizes
- **Transform API** - Dynamic resizing/cropping
- **Analytics** - Usage tracking
- **Storage Optimization** - No duplicate files

## Migration Strategy

### Phase 1: Dual System (Current)
- Keep existing R2 image system
- Add CF Images as option
- Use `[[CF:name]]` tags for new CF images

### Phase 2: Gradual Migration
- Upload new images to CF Images
- Keep existing R2 images working
- Migrate popular images to CF Images

### Phase 3: Full CF Images (Future)
- Process all `[[image]]` tags through CF Images
- Keep R2 as backup/fallback

## Current Status
- ✅ **Worker Updated** - CF Images endpoints added
- ✅ **API Token** - Secret configured
- ✅ **Account ID** - Configured in wrangler.toml  
- 🔄 **Delivery Hash** - Needs update after enabling CF Images
- 📋 **Dashboard Setup** - Needs CF Images activation

## Next Steps
1. **Enable CF Images** in Cloudflare Dashboard
2. **Get delivery hash** and update `wrangler.toml`
3. **Test upload** with `test-cf-images.ps1`
4. **Deploy updated worker** with correct hash
5. **Update blog UI** to use CF Images upload option

## Testing
Run test script:
```powershell
cd workers
.\test-cf-images.ps1
```

## Implementation Notes
- CF Images metadata stored in `blog/cf-images/{name}.json` in R2
- Original `uploadImage` function preserved for backwards compatibility
- New `uploadCloudflareImage` function for CF Images
- `processCloudflareImageTags` handles `[[CF:name]]` replacement
- All functions use automatic post numbering (001, 002, etc.)