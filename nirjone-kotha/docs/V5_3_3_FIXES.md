# Moner Kotha V5.3.4 — Installed-phone and media fixes

This release is intentionally limited to the issues shown in the supplied phone screenshots. The existing desktop website, public SEO pages, post rules, Islamic content, ad defaults and backend-ready structures are preserved.

## 1. Story names

- Seed stories now contain their own Bangla and English creator aliases.
- A newly published story stores the user's current chosen display name or generated alias.
- The story circle contains the text/emoji preview and the creator name appears directly below it.
- Existing reactions, comments, ranking and 48-hour expiry remain unchanged.

## 2. Compact installed-phone layout

Only a physical phone launched as the installed PWA receives these layout changes:

- compact top area;
- visible but smaller “How are you feeling today?” card;
- shorter story rail;
- reduced post-composer height;
- all six feed tabs visible in a 3 × 2 grid, so horizontal dragging is not required;
- compact filter button;
- smoother vertical and story scrolling.

Phone browsers and desktop/laptop layouts keep their existing presentation policy.

## 3. Installed-app detection

The manifest starts the PWA with explicit `source=pwa&app=installed` launch hints. The platform module also remembers the installed context for the current app session. This supplements normal `display-mode: standalone`, Android app referrer and iOS standalone detection.

Because the manifest launch URL changed, an already-installed old shortcut may need to be removed and installed once again. After that one-time reinstall, normal service-worker updates continue automatically.

## 4. Video sound and volume

- Sound is enabled by default.
- A direct Play action requests unmuted playback.
- The selected volume and sound state are saved and reused for General and Islamic videos.
- Changing native YouTube volume/mute controls synchronizes prepared players.
- A visible sound button is available on every card.
- If the browser blocks unmuted autoplay before a user gesture, playback falls back to muted and the sound button remains available. This browser restriction cannot be bypassed by site code.

## 5. Faster media preparation

- YouTube, thumbnail and media origins receive preconnect hints only when the video controller is used.
- Only the active player and the next two players are kept prepared.
- Next-two preparation is scheduled during browser idle time, avoiding unnecessary work during initial card rendering.
- Older off-screen player instances are destroyed.
- First-card thumbnail receives higher fetch priority; remaining thumbnails stay lazy loaded.

## 6. Large video view

General and Islamic video cards now have a Large view control available on phone, laptop and desktop.

- Videos appear in a vertically scrollable, snap-assisted view.
- Only the video feed chrome is hidden; existing video cards and feed ad slots are reused.
- General Video therefore keeps its normal admin-controlled ad placement.
- The Islamic section remains ad-free under its existing safety/monetisation policy.
- Escape or the Exit large view button restores the previous feed position.

## 7. Video-card notice

The repeated ownership sentence underneath every video card was removed. The full YouTube ownership/embedding notice remains on the About page and in the existing application information area.

## 8. Startup recovery

The five-second false-positive “Refresh / Repair and reload” panel was removed.

- The app marks itself ready immediately after its first usable render rather than waiting for every image and third-party resource to finish loading.
- The splash screen still has a non-blocking timeout.
- A simple Reload notice appears only if the main JavaScript module itself genuinely fails to load.
- No automatic cache deletion or user-data deletion is performed.

## Unchanged

- 4,000-character post limit.
- Six-month user-post expiry.
- 48-hour story expiry.
- Islamic text content and reactions.
- Video Like-only ranking.
- 80 Islamic + 80 General mood mappings.
- Ads default OFF.
- Islamic section ad-free.
- Link and restricted-content blocking.
- Profile post edit/delete system.
- Public Bangla/English SEO routes.
