# Deployment Verification Guide

## 🎯 Purpose
This guide helps verify that the new deployment workflow (`deploy.yml`) is working correctly after merge to `main`.

---

## ✅ Pre-Merge Checklist

Before merging this PR, ensure:

- [ ] `CLOUDFLARE_API_TOKEN` is set in GitHub Secrets
- [ ] `CLOUDFLARE_ACCOUNT_ID` is set in GitHub Secrets
- [ ] **`CLOUDFLARE_ZONE_ID` is set in GitHub Secrets** (CRITICAL - new requirement!)

### How to Add CLOUDFLARE_ZONE_ID:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain `mybonzoaiblog.com`
3. Scroll down in **Overview** tab
4. Find **Zone ID** in the right sidebar (format: `1234567890abcdef1234567890abcdef`)
5. Copy the Zone ID
6. Go to GitHub: **Settings → Secrets and variables → Actions → New repository secret**
7. Name: `CLOUDFLARE_ZONE_ID`
8. Value: paste the Zone ID
9. Click **Add secret**

---

## 🚀 Post-Merge Verification

After merging this PR to `main`, the deploy workflow will run automatically. Follow these steps to verify:

### Step 1: Monitor GitHub Actions

1. Go to: https://github.com/Bonzokoles/my-bonzo-ai-blog/actions
2. Find the latest **"Deploy AI SEO"** workflow run
3. Click on it to see details

### Step 2: Check Workflow Steps

Verify that all new steps completed successfully:

#### ✅ Expected Steps:
- [x] Setup Node (should show "Cache restored" if npm cache is working)
- [x] Install
- [x] Build Astro
- [x] **Verify Critical Files** ← NEW - should show all 5 files present
- [x] Deploy Pages (Keep Alive)
- [x] **Clear Cloudflare Cache** ← NEW - should show "✅ Cache cleared successfully"
- [x] **Verify Live Deployment** ← NEW - should show 4 URLs with "✅ 200 OK"
- [x] Prefetch Critical Paths
- [x] Health Check

#### 🔍 What to Look For in Logs:

**"Verify Critical Files" step should show:**
```
🔍 Verifying build output...
✅ All critical files present

📋 File details:
-rw-rw-r-- 1 runner runner   32 ... dist/8f9a2d4e6b1c3a5d7e9f0a2b4c6d8e0f.txt
-rw-rw-r-- 1 runner runner  815 ... dist/llms.txt
-rw-rw-r-- 1 runner runner  134 ... dist/robots.txt
-rw-rw-r-- 1 runner runner  13K ... dist/sitemap-pumo.xml
```

**"Clear Cloudflare Cache" step should show:**
```
🧹 Clearing Cloudflare cache...
Response Code: 200
✅ Cache cleared successfully
```

**"Verify Live Deployment" step should show:**
```
🔍 Verifying live URLs...
Waiting 15 seconds for cache propagation...
Testing: https://mybonzoaiblog.pages.dev/robots.txt
  ✅ 200 OK
Testing: https://mybonzoaiblog.pages.dev/sitemap-pumo.xml
  ✅ 200 OK
Testing: https://mybonzoaiblog.pages.dev/llms.txt
  ✅ 200 OK
Testing: https://mybonzoaiblog.pages.dev/8f9a2d4e6b1c3a5d7e9f0a2b4c6d8e0f.txt
  ✅ 200 OK
✅ All URLs verified successfully
```

### Step 3: Manual URL Testing

Test the URLs manually in your browser or with curl:

```bash
# Test robots.txt
curl -I https://mybonzoaiblog.pages.dev/robots.txt
curl -I https://www.mybonzoaiblog.com/robots.txt

# Test sitemap
curl -I https://mybonzoaiblog.pages.dev/sitemap-pumo.xml
curl -I https://www.mybonzoaiblog.com/sitemap-pumo.xml

# Test llms.txt
curl -I https://mybonzoaiblog.pages.dev/llms.txt
curl -I https://www.mybonzoaiblog.com/llms.txt

# Test IndexNow key
curl -I https://mybonzoaiblog.pages.dev/8f9a2d4e6b1c3a5d7e9f0a2b4c6d8e0f.txt

# Test .well-known
curl -I https://mybonzoaiblog.pages.dev/.well-known/ai.json
```

**Expected response for all:**
```
HTTP/2 200 
content-type: text/plain
cache-control: public, max-age=3600
```

### Step 4: Test Crawler Visibility

Use external tools to verify crawler visibility:

1. **Google Search Console**
   - Go to: https://search.google.com/search-console
   - Test URL: https://www.mybonzoaiblog.com/robots.txt
   - Should show: "URL is on Google"

2. **Bing Webmaster Tools**
   - Go to: https://www.bing.com/webmasters
   - Check sitemap status

3. **ChatGPT Crawler Test** (manual)
   - Ask ChatGPT to browse: https://www.mybonzoaiblog.com/llms.txt
   - Should successfully read the file

---

## 🐛 Troubleshooting

### Problem: "CLOUDFLARE_ZONE_ID not set" warning

**Solution:**
1. Check if the secret is set: Settings → Secrets and variables → Actions
2. If missing, add it following the guide above
3. Trigger a new deployment: Actions → Deploy AI SEO → Run workflow

### Problem: Cache clear shows HTTP 403 or 401

**Cause:** API token doesn't have cache purge permissions

**Solution:**
1. Go to Cloudflare Dashboard → My Profile → API Tokens
2. Edit the token used for `CLOUDFLARE_API_TOKEN`
3. Ensure it has: Zone → Cache Purge → Purge
4. Save and update the secret in GitHub if token changed

### Problem: Live URL verification fails with 404

**Possible causes:**
1. **Cloudflare cache** - Old 404 still cached (wait 15-30 minutes)
2. **Build issue** - Files not copied to dist (check "Verify Critical Files" step)
3. **Deployment issue** - Wrangler deploy failed (check deploy logs)

**Solutions:**
1. Manually purge cache: Actions → Clear Cloudflare Cache → Run workflow
2. Wait 30 minutes and re-run deployment
3. Check Cloudflare Pages dashboard for deployment status

### Problem: Live URL verification fails with 000 (timeout)

**Cause:** DNS or network issues

**Solution:**
1. Test manually: `curl -v https://mybonzoaiblog.pages.dev/robots.txt`
2. Check Cloudflare status: https://www.cloudflarestatus.com/
3. Wait 5-10 minutes and re-run deployment

---

## 📊 Success Criteria

The deployment is successful when:

- ✅ All workflow steps complete without errors
- ✅ "Verify Critical Files" shows all 5 files present
- ✅ "Clear Cloudflare Cache" returns HTTP 200
- ✅ "Verify Live Deployment" shows all 4 URLs with 200 OK
- ✅ Manual curl tests return HTTP 200 for all URLs
- ✅ Files are accessible from both mybonzoaiblog.pages.dev and www.mybonzoaiblog.com

---

## 🔄 Next Steps After Successful Deployment

1. **Monitor crawler behavior** (next 24-48 hours):
   - Check Google Search Console for robot.txt fetch
   - Monitor sitemap submission status
   - Check ChatGPT crawler access logs

2. **Verify cache behavior**:
   - Make a small change to `public/robots.txt`
   - Commit and push
   - Verify new version is live within 2-3 minutes (not hours)

3. **Document results**:
   - Update issue with success confirmation
   - Note any issues encountered
   - Share crawler visibility improvements

---

## 📚 Additional Resources

- [Cloudflare Cache API Documentation](https://developers.cloudflare.com/api/operations/zone-purge)
- [Cloudflare Pages Deployment Docs](https://developers.cloudflare.com/pages/platform/deployments/)
- [GitHub Actions Secrets Guide](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [robots.txt Specification](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
