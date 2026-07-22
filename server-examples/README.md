# Video backend examples

`video-health-worker.mjs` is a server/cron example for checking every unique
YouTube ID in the starter catalogue. It uses YouTube Data API metadata to detect:

- missing/private videos;
- embedding disabled;
- Shorts longer than 90 seconds;
- regular videos longer than 15 minutes.

It writes a JSON document containing `unavailableYoutubeIds`. Serve that JSON
from the URL configured as `youtube.videoHealthEndpoint`. Every website/PWA
client fetches the list and removes disabled videos from its feed.

Run on a trusted server:

```bash
YOUTUBE_API_KEY=your_server_key node server-examples/video-health-worker.mjs
```

Recommended production flow:

1. Admin submits one link or a bulk list to an authenticated endpoint.
2. Server validates the YouTube ID, metadata, duration, public status and
   embeddability before saving it.
3. A scheduled health worker rechecks active records.
4. Failed records are disabled in the central database.
5. `videoHealthEndpoint` returns all disabled YouTube IDs or the current active
   catalogue version.

The static prototype cannot delete a record globally from every user's browser
without this central backend/database.
