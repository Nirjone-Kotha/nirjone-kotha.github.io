# Moner Kotha Hotfix 9.5.1

This hotfix repairs the empty home feed shown after deployment.

## Root cause

`assets/js/app.js` contained a malformed JavaScript string inside `localizePage()`. A post-card rendering block had also been inserted into that function accidentally. Because the main ES module could not parse, the static page shell appeared but stories, moods, support groups, quotes, and feed posts were never rendered.

A second runtime issue in `renderPostCard()` was also repaired by restoring the missing `labels` array.

## Cache update

The application and service-worker asset version was increased from `9.5.0` to `9.5.1` so browsers and installed PWAs fetch the repaired JavaScript instead of keeping the broken cached file.

## Deployment

Upload the complete contents of this package to the GitHub Pages repository root, replacing the existing files. After GitHub Pages finishes deploying, reload the website. An already-open tab or installed PWA should update automatically; closing and reopening it once may help the new service worker take control immediately.

## Validation

- Main ES module startup/render smoke test: PASS
- Service-worker cache/update test: PASS
- Desktop shell rendered with feed, story, and mood components in the runtime test
