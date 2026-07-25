# Advertising configuration — Version 6.1.0

## Current state

Advertisement master switch এবং সব placement **OFF by default**। Admin Control Center থেকে Google, Direct অথবা Hybrid mode configure করা যায়। Runtime configuration Firebase Realtime Database-এর নিচে থাকে:

```text
/runtime/settings/advertising
/runtime/campaigns
/adStats
```

Admin URL:

```text
/admin/login.html
```

## Placement switches

- `feedInFeed` — post 10-এর পরে এবং পরবর্তী প্রতি 8 post-এ stable slot
- `desktopRightRail` — desktop right rail slot
- `resourceInArticle` — long resource content
- `resourceMultiplex` — resource ending
- `mobileAnchor`
- `desktopAnchor`
- `vignette`
- `sideRailAuto`

প্রতিটি placement আলাদাভাবে enable/disable করা যায়। Advertisement master OFF থাকলে কোনো provider render হবে না।

## Provider modes

- **None** — কোনো advertisement নয়
- **Google** — consent ও configured client/slot থাকলে Google Ads
- **Direct** — Firebase-managed direct campaign
- **Hybrid** — eligible direct campaign না থাকলে Google fallback

Google publisher/client ID বা slot ID ZIP-এ দেওয়া নেই। Approved account পাওয়ার পরে Admin Panel থেকে বসাতে হবে।

## Direct campaign

Campaign fields:

- advertiser/name
- bilingual headline, body ও CTA
- target URL
- image/video URL
- locale ও device target
- one or multiple placements
- weight
- start/end schedule
- enabled state

Uploaded image browser-এ WebP/Data URL হিসেবে optimize হয় এবং campaign record-এর সঙ্গে Realtime Database-এ save হয়। খুব বড় file reject হয়।

## Frequency and statistics

Admin settings support:

- maximum impressions per session
- minimum seconds between ads
- stable slot overrides
- basic impressions/clicks counters

`/adStats` lightweight first-party summary। এটি billing, fraud detection বা advertiser invoice system নয়।

## Consent and safety boundaries

Google advertising requires the app’s advertising consent. Direct campaign renderer-ও protected contexts respect করে। Ads remain absent from safety/high-risk context, composer, comments, check-in, Calm space, profile, login/recovery and other private or sensitive surfaces.

Mood, need, post content, comments, search terms, saved content, check-ins বা safety actions advertisement request বা analytics dimension-এ পাঠানো হয় না।

## Firebase and CSP

Deploy `firebase-database.rules.json` এবং strict admin UID authorization রাখুন। Custom Content-Security-Policy ব্যবহার করলে Firebase SDK/Auth/Realtime Database এবং enabled ad provider-এর required origins allow করতে হবে। Updated examples আছে:

- `hosting/.htaccess.example`
- `hosting/nginx.conf.example`
