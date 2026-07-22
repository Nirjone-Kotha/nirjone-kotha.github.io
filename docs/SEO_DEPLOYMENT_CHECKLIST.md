# SEO deployment checklist

## 1. Set the real domain and contacts

Edit `config/site.json`:

- `environment`: `production`
- `baseUrl`: one preferred HTTPS origin, without a trailing slash
- verified Facebook page, support email and WhatsApp number
- optional verified Google/Bing tokens

Then run:

```powershell
py tools/generate_static_site.py --production
```

The production command refuses to continue without a valid HTTPS base URL.

## 2. Review owner-dependent content

- Replace editable legal drafts with owner/legal-reviewed text.
- Verify privacy, cookies, terms and data-deletion process.
- Add only real organization/contact information.
- Publish resource articles only after editorial and safety review.
- Keep unmoderated user posts noindex.

## 3. Host behaviour

- Choose one HTTPS canonical host.
- Redirect HTTP and alternate `www`/non-`www` host with 308 or 301.
- Keep real 404 responses; do not rewrite every unknown path to the app shell.
- Apply the provided security headers and caching examples.
- Serve `sitemap.xml`, sitemap children and `robots.txt` from the root.

## 4. Search engines

- Verify the domain in Google Search Console.
- Submit `/sitemap.xml`.
- Inspect representative Bangla and English URLs.
- Review indexing, Core Web Vitals, Manual Actions and Security Issues.
- Verify Bing Webmaster Tools and submit the same sitemap.
- Add IndexNow only when a real key and backend/deployment process exist.

## 5. Performance and accessibility

- Test 320, 360, 390, 768, 1024 and desktop widths on real devices.
- Confirm no horizontal page scroll.
- Run Lighthouse after production hosting.
- Measure field Core Web Vitals after enough real traffic exists.
- Keyboard-test dialogs, language links, contact cards and cookie choices.

## 6. Advertising and analytics

- Keep ads and analytics disabled until consent and provider configuration are complete.
- Never send mood, post/comment text, searches or safety interactions.
- Keep crisis/safety, composer, comments, profile and calm tools ad-free.
