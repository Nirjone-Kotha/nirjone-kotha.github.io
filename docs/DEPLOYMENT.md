# One-domain Website + PWA deployment

Upload the complete project to one HTTPS document root. The same domain serves:

- responsive website users
- crawlable Bangla and English public pages
- installed Android/tablet PWA users
- installed desktop PWA users

A second hosting is not required.

## Production preparation

Edit `config/site.json` and run:

```powershell
py tools/generate_static_site.py --production
```

Upload the generated project including:

```text
index.html
bn/
en/
assets/
config/
manifest.webmanifest
sw.js
offline.html
404.html
robots.txt
sitemap*.xml
```

## Server behavior

- HTTPS and one preferred canonical host
- real 404 for unknown URLs; no catch-all SPA rewrite
- `application/manifest+json` for the manifest
- root-scope service worker
- no-cache/revalidation for HTML, service worker, config, robots and sitemaps
- compressed CSS/JS/HTML
- security headers from the included Apache/Nginx examples

## Verification

1. Test `/bn/`, `/en/` and several feature/topic routes without JavaScript.
2. Test the full website layout in phone browser/Desktop Site, tablet, desktop and desktop-installed PWA; test the compact layout only in an installed phone PWA.
3. Install on phone and desktop; verify layout/icon/start URL.
4. Test one offline reopen after online loading.
5. Verify unknown URLs return 404.
6. Verify canonical, hreflang and sitemap URLs use the real domain.
7. Run Lighthouse and real-device accessibility checks.
