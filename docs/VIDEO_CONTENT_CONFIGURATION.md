# Video Content, Health and Admin Configuration

## Current catalogue model

`assets/js/video_catalog.js` generates:

- Islamic Video: 8 core moods × 10 mappings = 80 records;
- General Video: 8 core moods × 10 mappings = 80 records;
- total mood mappings: 160.

A single source may be useful for more than one mood. Within one feed, records
are de-duplicated by YouTube ID.

## Feed format rule

Regular videos and Shorts are not mixed:

```text
Regular video: contentType = video, maximum 900 seconds
Shorts:        contentType = short, maximum 90 seconds
```

General and Islamic sections remember their format independently.

## Browser availability handling

The IFrame controller treats these as permanent failures:

```text
2, 100, 101, 150
```

The matching ID is stored locally, all visible cards with that source are
removed, and a report is sent when `videoReportEndpoint` is configured.

Temporary/API failures are not automatically deleted.

## Central health configuration

Edit `config/site.json`:

```json
{
  "youtube": {
    "videoHealthEndpoint": "https://api.example.com/video-health",
    "videoReportEndpoint": "https://api.example.com/video-report",
    "adminVideoEndpoint": "https://api.example.com/admin/videos",
    "adminBulkVideoEndpoint": "https://api.example.com/admin/videos/bulk",
    "healthCheckIntervalHours": 12
  }
}
```

A health response may contain:

```json
{
  "checkedAt": "2026-07-21T12:00:00Z",
  "unavailableYoutubeIds": ["XXXXXXXXXXX"]
}
```

The app removes those IDs from both General and Islamic feeds.

## Server health worker

Run on a trusted server, not in the browser:

```bash
YOUTUBE_API_KEY=server_key node server-examples/video-health-worker.mjs
```

Optional environment variables:

```text
VIDEO_HEALTH_OUTPUT
VIDEO_HEALTH_PUBLISH_ENDPOINT
VIDEO_HEALTH_TOKEN
```

The worker batches unique IDs, checks current metadata and outputs disabled IDs.
Use cron, a queue worker or a scheduled cloud function.

## Admin import preview

Open:

```text
/admin/video-import/
```

Capabilities:

- one link;
- bulk links;
- URL/ID extraction;
- automatic thumbnail URL;
- General/Islamic selection;
- Regular/Shorts selection;
- multiple moods or All moods;
- duplicate prevention;
- JSON export.

To enable server upload:

```json
{
  "adminTools": {
    "enabled": true,
    "videoImportPreviewOnly": false
  }
}
```

Do this only after the endpoint has authentication, authorization, CSRF/origin
protection, rate limits, audit logs and server-side YouTube validation.

## Required server-side validation

Before publication validate:

- YouTube ID exists;
- video is public;
- embedding is allowed;
- exact duration is within the selected format limit;
- section/mood values are valid;
- title/channel/thumbnail metadata are current;
- moderation and content-safety review passes;
- duplicate rules pass.

## Player preparation

While one card is active, the controller prepares the next two. Older offscreen
players are destroyed to avoid loading the entire catalogue simultaneously.
Only one player should actively play at a time.

## Copyright/source handling

- Do not download, proxy, re-upload or offline-cache YouTube video streams.
- Use the official embedded player and preserve source/channel attribution.
- Keep the bilingual About-page ownership notice and a working takedown/contact workflow.
- A disclaimer alone does not eliminate copyright or platform-policy obligations.
