# Final backend migration map

> **V6.1.0 status:** Optional password profiles now synchronize private app data through Firebase Authentication and Realtime Database, while Guest mode remains local-only. Admin settings, announcements, campaigns and managed videos also use Firebase. This document now describes a future migration for truly shared cross-user feeds, server-side moderation, scalable querying and background jobs—not the current private profile restore layer.

বর্তমানে `assets/js/storage.js` local browser adapter হিসেবে কাজ করছে। Final hosting-এর সময় UI পুনরায় না লিখে এই boundary-কে API-backed repository দিয়ে প্রতিস্থাপন করতে হবে।

## Current

```text
Website / Installed PWA
          ↓
assets/js/storage.js
          ↓
localStorage
```

## Final

```text
Website / Installed PWA
          ↓
Authenticated API repository
          ↓
Backend API
          ↓
Database + moderation queue + realtime events
```

## Recommended API groups

- `POST /api/auth/guest`
- `POST /api/auth/login` or passwordless/OTP authentication when selected
- `POST /api/auth/recover`
- `GET/POST /api/posts`
- `GET/POST /api/posts/:id/comments`
- `POST /api/posts/:id/reactions`
- `POST /api/posts/:id/report`
- `GET /api/notifications`
- `GET/POST /api/circles`
- `GET/POST /api/checkins`
- `GET/PATCH /api/me/preferences`

## Minimum database entities

`users`, `anonymous_profiles`, `posts`, `comments`, `reactions`, `bookmarks`, `follows`, `circles`, `circle_members`, `reports`, `moderation_actions`, `notifications`, `mood_checkins`, `sessions`.

## Preparation for approximately 1,000 concurrent users

- Stateless API instances behind a reverse proxy/load balancer when required
- Database indexes for feed, comments, notifications and moderation reports
- Cursor pagination rather than loading all posts
- Rate limiting and abuse controls, preferably with Redis or equivalent
- Background moderation and notification queues
- CDN/object storage only if media is introduced later
- WebSocket/SSE only for events that genuinely require realtime delivery
- Structured logs, health checks, backups and restore testing
- Load test against the chosen hosting and database before launch

The frontend already uses event delegation, incremental feed rendering, cached static assets and a replaceable storage boundary. Actual 1,000-user concurrency can only be verified after the backend, database and hosting environment exist.

## Language and content fields for final migration

Keep interface preference and user content separate:

- `users.ui_language`: `en` or `bn`
- `posts.content`: exact text entered by the user
- `posts.content_language`: detected/optional language metadata; never use it to overwrite content
- `comments.content`: exact text entered by the user
- `comments.content_language`: detected/optional language metadata

The frontend currently stores new user posts/comments as `content` with `contentLang: "auto"`. Older local records containing duplicated `bn` and `en` values are still supported and should be migrated to one `content` column.


## Admin-controlled advertising status

V6.1.0 already keeps advertising settings and direct campaigns under Firebase `/runtime`, with authorized-admin writes and public runtime reads. `assets/js/ads.js` remains the frontend policy boundary. A future high-scale backend may replace or supplement Firebase for billing-grade statistics, fraud detection and server-side campaign validation. All settings remain OFF until explicitly enabled, and protected contexts must remain ad-free. Never include mood, post text, search terms, check-ins or safety actions in advertising requests or analytics dimensions.


## Version 5.1 data and job requirements

### Posts

Add `expires_at`, `edited_at`, `display_name`, optional mood/support/topic keys and optional custom values. A scheduled database job must permanently delete or safely archive expired posts after six months without waiting for a client to open. Deletion must cascade or anonymize comments, reactions, bookmarks, reports and search indexes according to the final retention policy.

### 48-hour moments

Add a `moments` table with `created_at`, `expires_at`, `content`, `mood_id`, `emoji`, moderation state and author ID. Query only active rows and run a scheduled purge after 48 hours. Add moment reactions and a ranked query weighted by empathy, preferred-mood relevance and recency.

### Ranking

Materialize or calculate ranking from verified reaction and comment counts. Prevent duplicate reactions per user/session, exclude removed/moderation-held content, add indexes for active/expiry/mood/topic/rank and use cursor pagination rather than returning an entire feed.

### User post management

Provide authenticated/anonymous-recovery ownership checks for list-own-posts, edit and delete. Never authorize an edit/delete only from a client-supplied post ID.

### Moderation

Repeat all link/private/sensitive checks server-side. Add normalized-text detection, rate limits, moderation queues, reporting, audit logs and human review. Front-end regex checks are only early feedback.

### Web Push

Store PushSubscription endpoint/keys per device, protect the VAPID private key on the server, remove expired subscriptions, and send notifications through a queue. Notification payloads must not include private post/comment text or emotional profiling fields.

## V5.2 Islamic/video migration

Add central tables/collections for:

- `islamic_content` — kind, Arabic, Bangla, English, source, audio, moods, review status, enabled
- `videos` — YouTube ID, section, moods, type, duration, thumbnail, embeddable, enabled, priority, metadata timestamps
- `content_likes` — user/content unique reaction
- `push_subscriptions` — user/device subscriptions

The backend must validate YouTube metadata, enforce 90/900-second limits and reject non-embeddable or unavailable videos. API keys must never be placed in `video_catalog.js` or other browser code.

Replace local `islamic-likes` and `video-likes` storage through the repository/API boundary. Preserve the Islamic ad-free context on both client and server-rendered/admin views.

## V5.3 video availability and import requirements

Create a central `videos` table with at least:

```text
id, youtube_id, section, content_type, duration_seconds, title,
channel_title, thumbnail_url, enabled, featured, moderation_status,
last_checked_at, disabled_reason, created_at, updated_at
```

Use a join table for moods so one source can be assigned to several moods or no
mood (All moods). Add a unique constraint appropriate to your reuse policy,
usually `youtube_id + section`.

Authenticated admin endpoints should support:

```text
POST /admin/videos
POST /admin/videos/bulk
PATCH /admin/videos/{id}
DELETE /admin/videos/{id}
POST /admin/videos/health-results
```

Public clients need a versioned catalogue or a lightweight disabled list:

```text
GET /video-health
```

Playback-error reports should be rate-limited and treated as a signal, not as
sufficient authority for immediate global deletion. Recheck the source through
server-side YouTube metadata before disabling it centrally.

Run the health job periodically and after each new import. Missing/private,
non-embeddable or over-duration records should be disabled. Keep an audit trail
and allow an administrator to re-enable a source after review.

### Islamic engagement tables

Qur’an, Hadith and Dua should have stable content IDs plus:

```text
islamic_content_likes
islamic_content_comments
islamic_content_moderation
```

Ranking queries should combine verified engagement and mood relevance without
exposing a user's emotional history to advertising or external analytics.

### Story tables

Store stories separately from posts. Use `expires_at`, filter expired rows in
every query and run a scheduled purge. Add typed story reactions (`like`,
`love`, `care`, `sympathy`) and story comments with the same moderation and link
blocking used for post comments.
