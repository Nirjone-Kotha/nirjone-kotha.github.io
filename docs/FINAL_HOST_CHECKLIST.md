# Final hosting checklist

## Information needed from the owner

- final preferred HTTPS domain
- hosting type and access method
- available backend/runtime and database
- launch countries and verified safety resources
- guest-only versus recovery/login plan
- moderation team size and response hours
- expected traffic and peak concurrency
- whether media or private messaging will be introduced
- verified Facebook page, support email and WhatsApp number

## Before deployment

1. Edit `config/site.json` with the real domain and verified contact values.
2. Set `environment` to `production`.
3. Review/finalize legal drafts and editorial details.
4. Run `py tools/generate_static_site.py --production`.
5. Check `/bn/`, `/en/`, sitemap, robots and generated structured data.
6. Configure one canonical HTTPS host and 301/308 redirects.
7. Configure a real 404, CSP, Referrer Policy, Permissions Policy and no-sniff headers.
8. Keep the app shell, service worker, manifest, config, robots and sitemap revalidating rather than immutable.
9. Test PWA install, update and offline behavior on Android and desktop.
10. Run device, keyboard, accessibility, security and performance tests on staging.

## Social sharing

No temporary tunnel URL is hardcoded. Runtime sharing uses the current origin. Production public-page Open Graph, canonical and sitemap URLs come from `config/site.json → baseUrl` after regeneration. Confirm `/assets/brand/share-cover.png` is public.

## Backend migration

Provide the latest source with `assets/js/storage.js`. Replace the local adapter with API repositories; add authentication/recovery, database migrations, moderation, rate limits, audit logs, backups, monitoring and load testing. Preserve user-written text exactly and keep UI language separate.

## Advertising

Keep advertising OFF until production moderation, consent/CMP, public policy review and provider approval are complete. Admin settings must support master, placement and stable per-slot switches. Protected and high-risk contexts always override admin settings. Never send emotional data to advertising or analytics.


## Version 5.1 launch additions

- [ ] Configure server-enforced six-month post expiry and 48-hour moment expiry.
- [ ] Add server-side ownership checks for Profile post edit/delete.
- [ ] Add server-side link/private/sensitive-content moderation and human review.
- [ ] Load-test ranked feed and moment queries with cursor pagination.
- [ ] Generate VAPID keys; set only the public key in `config/site.json`.
- [ ] Implement and secure the PushSubscription endpoint and background sender.
- [ ] Verify notification payloads contain no private emotional text.
- [ ] Verify Android maskable icon, desktop launcher icon and exact app title.
- [ ] Verify browser/desktop layout and installed-phone-PWA mobile layout on real devices.
- [ ] Verify service-worker migration from previous cache versions.

## V5.2 content checks

- [ ] Revalidate every YouTube seed record through a protected metadata service.
- [ ] Confirm Shorts are <= 90 seconds and regular videos are <= 900 seconds.
- [ ] Confirm embedding is allowed and the video is appropriate for every assigned mood.
- [ ] Configure/review Qur'an, Hadith and Dua data sources and their licenses.
- [ ] Review all Bengali religious text and source references with a qualified editorial reviewer.
- [ ] Test YouTube privacy-enhanced embeds, CSP, consent and takedown workflow.
- [ ] Verify service-worker auto-update on at least two phones and two desktop browsers.

## V5.3 video and story launch checks

- [ ] Configure a server-side YouTube Data API key; never expose it in browser code.
- [ ] Deploy authenticated single and bulk video-import endpoints.
- [ ] Validate public status, embedding permission, duration, title, channel and thumbnail before publication.
- [ ] Schedule the video health worker and configure `videoHealthEndpoint`.
- [ ] Configure and rate-limit `videoReportEndpoint`.
- [ ] Confirm a failed video is disabled across two different browsers/devices.
- [ ] Confirm Regular and Shorts are separate in General and Islamic sections.
- [ ] Confirm only one video plays and the next two become ready.
- [ ] Confirm Islamic Video is ad-free and General Video respects admin ad switches.
- [ ] Verify Bengali is the default Qur’an/Hadith/Dua translation and English toggles per card.
- [ ] Review every Qur’an/Hadith/Dua source and translation before public launch.
- [ ] Configure central likes/comments/ranking for Islamic content.
- [ ] Configure server-enforced 48-hour story deletion and separate story storage.
- [ ] Test story Like/Love/Care/Sympathy/Comment on multiple accounts.
- [ ] Verify production CSP allows YouTube IFrame API, YouTube frames, thumbnails and Islamic datasets without wildcard script permissions.
