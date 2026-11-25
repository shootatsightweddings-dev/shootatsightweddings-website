# SEO implementation and publishing

## Content editing

- Blog create/edit forms include SEO title, description, canonical URL, cover description and author name/type/profile URL. Descriptions have a character counter; 155 is a writing guideline, not a mandatory search-engine limit.
- Existing shoot URLs stay unchanged. In **Edit Gallery**, edit cover/gallery descriptions and optional case-study narrative, summary and client quotation, then choose **Save descriptions and case study**. Use genuine quotations with permission. Gallery image descriptions are optional during uploads, but recommended for accessibility and image search.
- **Services & Locations** in the admin dashboard manages page content, SEO fields, city/locality, hero description, questions and publication state. The initial pages describe existing offerings and the Bengaluru base; review and enrich them with the SEO team. Draft pages are not publicly listed. Keep existing slugs when editing.
- Hero image uploads require a description before the file is sent. Gallery image descriptions are optional. Older records continue to render with their existing title-based descriptions until backfilled. No existing gallery URLs are converted or removed by this update.
- Organization authors remain valid. Select Person only for a real named author. Article dates use ISO timestamps, separately from the human-readable display date.
- FAQs are visible content. New pages do not promise or rely on Google FAQ rich results.

## Publishing

Run `npm run lint` and `npm run build`. The build prerenders service and location pages and includes published routes in the sitemap. Rebuild/redeploy after publishing or changing content to refresh the static HTML seen by crawlers. Live browser content also loads through the API.

Only the Naveen & Kate teaser and the mobile Low Bitrate video currently exist on the server (`backend/media`). Copy the other films there, then enter their own paths (e.g. `/films/couple-name.mp4`) and posters in the film editor. Do not reuse the teaser as a different couple's film.

## Apex-domain redirect: hosting action required

The app redirects requests with host `shootatsightweddings.com` to `https://www.shootatsightweddings.com`, preserving the complete path and query string. This works only when the request reaches Express.

The existing live apex host returns 404 for paths such as `/about` before the client app can handle them. The hosting/CDN owner must route the apex host to the current origin or add an edge redirect for **all paths**, not just `/`:

```
https://shootatsightweddings.com/<path>?<query>
  -> 301 https://www.shootatsightweddings.com/<same-path>?<same-query>
```

Keep HTTPS certificates valid for both hosts. Verify `/`, `/about`, `/contact`, a real shoot URL and a URL with query parameters. Do not redirect missing pages to the homepage; genuine missing URLs should remain 404 on the canonical host. The repository push alone cannot change a legacy CDN/hosting redirect rule.

## SEO landing pages (published 2026-11-25)

The client approved the eight pages; `"public": true` is set, so they are indexable, in `sitemap.xml`, and linked from the site footer (Footer.jsx renders every page in landingPages.js).

### History: shareable, not yet public

Eight landing pages from the keyword plan live in `frontend/src/data/landingPages.js`, with their URLs in `frontend/src/data/landingPageRoutes.json`. They load at their own URLs and can be shared by link, but while `"public": false` in that JSON file they are **not linked from anywhere on the site**, are marked `noindex`, and are left out of `sitemap.xml`. A test fails if another page links to them while they are unpublished.

To publish them to search: set `"public": true`, then link them from the navigation/footer or the `/services` and `/locations` hubs, and push to `main`.

Before publishing, confirm with the client:

- **Films:** that the studio makes non-linear (story-structured) films, as the films page says.
- **Ooty:** that the studio offers Ooty shoots, and its own Ooty price if one should be shown (currently "quoted individually"). Real Ooty photographs are also needed.
- **Drone:** that the studio offers drone coverage, and whether it can do FPV shots. Real aerial footage is also needed.
- **Pre-wedding guide:** current permission and fee rules for Lalbagh, Cubbon Park and Bangalore Palace, and the studio's own photos from each location.
- **Srinidhi & Ramya:** the shoot is listed as Bangalore, but its photos show Dubai. Correct the location (it is not cited on these pages).
