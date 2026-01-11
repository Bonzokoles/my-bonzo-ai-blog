# Schema.org Validation Guide

## Overview
This document provides instructions for validating the global Schema.org markup added to Layout.astro for AI crawler optimization.

## Implementation Details

### Location
`src/layouts/Layout.astro` - lines 89-135 (after DynamicMetaTags and GoogleFonts, before SocialMeta)

### Schema Types Implemented

1. **Organization Schema** (`@id: https://mybonzoaiblog.com/#organization`)
   - Name: MyBonzo AI Blog
   - Logo: https://mybonzoaiblog.com/bonzo_logo_new.png (512x512)
   - Description: Polish-language AI/ML blog description
   - Contact: Customer Service (Polish/English)
   - Social profiles: GitHub, Cloudflare Pages

2. **WebSite Schema** (`@id: https://mybonzoaiblog.com/#website`)
   - Name: MyBonzo AI Blog - Sztuczna Inteligencja po Polsku
   - Language: pl-PL
   - Publisher: References Organization schema
   - SearchAction: Enabled for AI crawlers
   - Search URL template: https://mybonzoaiblog.com/search?q={search_term_string}

## Validation Steps

### 1. Schema.org Validator
**URL:** https://validator.schema.org/

**Steps:**
1. Visit https://www.mybonzoaiblog.com (or any page using Layout.astro)
2. Copy the page URL
3. Go to validator.schema.org
4. Paste the URL in the "Fetch URL" tab
5. Click "Run Test"

**Expected Results:**
- ✅ No errors
- ✅ 2 detected items: Organization and WebSite
- ✅ Both schemas linked via `@id` references
- ✅ Valid @graph structure

### 2. Google Rich Results Test
**URL:** https://search.google.com/test/rich-results

**Steps:**
1. Go to search.google.com/test/rich-results
2. Enter URL: https://www.mybonzoaiblog.com
3. Click "Test URL"

**Expected Results:**
- ✅ Valid structured data detected
- ✅ Organization markup recognized
- ✅ WebSite markup recognized
- ⚠️ Note: Rich results may not apply to all schema types (normal for Organization/WebSite)

### 3. Manual JSON-LD Check

**In Browser DevTools:**
1. Open any page (e.g., https://www.mybonzoaiblog.com/o-nas)
2. Open DevTools (F12)
3. Go to Elements/Inspector tab
4. Search for: `application/ld+json`
5. Verify the script tag contains valid JSON

**Expected JSON Structure:**
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://mybonzoaiblog.com/#organization",
      "name": "MyBonzo AI Blog",
      ...
    },
    {
      "@type": "WebSite",
      "@id": "https://mybonzoaiblog.com/#website",
      "publisher": {
        "@id": "https://mybonzoaiblog.com/#organization"
      },
      ...
    }
  ]
}
```

### 4. AI Crawler Verification (Long-term)

**Timeline:** 7-14 days after deployment

**Perplexity AI:**
1. Search: "MyBonzo AI Blog"
2. Check if citation includes proper site info
3. Verify organization details are recognized

**ChatGPT Search:**
1. Search: "sztuczna inteligencja blog polski"
2. Look for improved citations
3. Check if search functionality is recognized

**Google/Gemini:**
1. Monitor Search Console for structured data recognition
2. Check Knowledge Graph updates (may take weeks)

## Verification Checklist

After deployment to production:

- [ ] Schema.org Validator shows no errors
- [ ] Google Rich Results Test passes
- [ ] JSON-LD visible in page source
- [ ] Organization schema has correct logo URL
- [ ] WebSite schema references Organization correctly
- [ ] SearchAction points to /search endpoint
- [ ] Language set to pl-PL
- [ ] Contact languages include Polish and English
- [ ] All URLs use https://mybonzoaiblog.com (not .pages.dev)

## Common Issues and Solutions

### Issue: Logo not loading (404)
**Solution:** Verify `/bonzo_logo_new.png` exists in `public/` directory

### Issue: Schema not appearing
**Solution:** Clear browser cache and check if page uses Layout.astro

### Issue: Duplicate schemas
**Expected:** PumoStructuredData.astro adds additional schemas for specific pages - this is intentional and won't conflict

### Issue: Search URL 404
**Solution:** Ensure `/search` page exists or update SearchAction URL template

## References

- Schema.org Organization: https://schema.org/Organization
- Schema.org WebSite: https://schema.org/WebSite
- SearchAction: https://schema.org/SearchAction
- Google Structured Data Guidelines: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

## Related Documentation

- Implementation: `src/layouts/Layout.astro`
- Existing Schema: `src/components/PumoStructuredData.astro`
- AI SEO Audit: `docs/planning/AI_SEO_AUDIT_PUMO_GUIDE.md`
- Case Study: `src/data/blog/ai-seo-knowledge-bases-2025.mdx`

---

**Last Updated:** 2026-01-11  
**Implementation PR:** copilot/add-global-schema-markup
