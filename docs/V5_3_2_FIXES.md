# Moner Kotha V5.3.4 — Focused Fixes

This release intentionally changes only the four items requested after V5.3.1.

## 1. Shared YouTube volume

- The selected YouTube volume is saved under the isolated application storage key `video-volume`.
- A lightweight monitor reads volume changes made through the YouTube player controls.
- The same level is applied to the active player, the next two prepared players, and later video cards.
- Automatic feed playback remains muted when required by browser autoplay policy; tapping Play uses the saved level.

## 2. Story publishing and preview

- A newly published story remains in the story row instead of immediately reopening as a normal-looking modal.
- User-created stories are prioritised at the beginning of the story row.
- A text story shows a compact text preview inside the circle; an emoji story shows the selected emoji.
- The user's chosen profile name appears below the circle.
- The new story scrolls into view and receives a short highlight animation.
- The 48-hour story expiry, reactions and comments remain unchanged.

## 3. Post composer expiry text

- The composer now shows only the `0/4000` character counter.
- “Automatically deletes in 6 months” is no longer shown while creating a feed post.
- The actual six-month automatic deletion logic remains active.

## 4. Installed phone PWA layout

Phone app detection now recognises:

- `display-mode: standalone`
- `display-mode: fullscreen`
- `display-mode: minimal-ui`
- `display-mode: window-controls-overlay`
- iOS standalone mode
- Android app referrer
- the manifest start URL marker `?source=pwa`

A physical phone launched as the installed PWA receives the compact mobile-app layout. A phone browser continues to use the website layout, as previously requested. Touch scrolling and horizontal story scrolling were refined without changing desktop or browser presentation.

## Cache/update

- Application/service-worker version: `5.3.4`
- CSS and JavaScript URLs are versioned with `v=5.3.4`.
- Existing hosted installations should receive the new service worker automatically. A full close and reopen may be needed once after deployment while the new worker takes control.
