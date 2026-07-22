# Startup hotfix 5.3.1

The previous splash screen was dismissed only by the end of the main JavaScript module. A stale service-worker cache or any module startup error could therefore leave the splash visible forever.

Version 5.3.1 adds:

- A five-second fail-safe that always dismisses the splash.
- A visible Refresh / Repair and reload notice if startup does not complete.
- A repair action that unregisters old service workers and clears only Moner Kotha caches.
- Versioned JavaScript and CSS URLs to prevent old/new module mixing.
- Network-first loading for JavaScript and CSS.
- `updateViaCache: none` for service-worker updates.

For the first upgrade from 5.3.0, open the site and use **Repair and reload** if the old cache is still controlling the page.
