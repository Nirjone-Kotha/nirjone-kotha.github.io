#!/usr/bin/env node
/**
 * Moner Kotha video health worker example.
 *
 * Required environment variable:
 *   YOUTUBE_API_KEY
 *
 * Optional:
 *   VIDEO_HEALTH_OUTPUT=/path/to/video-health.json
 *   VIDEO_HEALTH_PUBLISH_ENDPOINT=https://api.example.com/admin/video-health
 *   VIDEO_HEALTH_TOKEN=...
 *
 * This process is intended for a trusted server/cron job. Never expose the API
 * key or admin token in browser JavaScript.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  videoCatalog,
  VIDEO_LIMITS,
} from "../assets/js/video_catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiKey = String(process.env.YOUTUBE_API_KEY || "").trim();
const outputPath = process.env.VIDEO_HEALTH_OUTPUT || path.join(__dirname, "video-health.json");
const publishEndpoint = String(process.env.VIDEO_HEALTH_PUBLISH_ENDPOINT || "").trim();
const publishToken = String(process.env.VIDEO_HEALTH_TOKEN || "").trim();

if (!apiKey) {
  console.error("YOUTUBE_API_KEY is required.");
  process.exit(2);
}

function chunks(values, size = 50) {
  const out = [];
  for (let index = 0; index < values.length; index += size) out.push(values.slice(index, index + size));
  return out;
}

function isoDurationToSeconds(value = "") {
  const match = String(value).match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!match) return 0;
  return Number(match[1] || 0) * 86400 + Number(match[2] || 0) * 3600 + Number(match[3] || 0) * 60 + Number(match[4] || 0);
}

async function fetchBatch(ids) {
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,contentDetails,status");
  url.searchParams.set("id", ids.join(","));
  url.searchParams.set("key", apiKey);
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`YouTube API ${response.status}: ${await response.text()}`);
  return response.json();
}

function evaluateRecord(record, metadata) {
  if (!metadata) return { available: false, reason: "not-found-or-private" };
  if (metadata.status?.embeddable === false) return { available: false, reason: "embedding-disabled" };
  if (metadata.status?.privacyStatus !== "public") return { available: false, reason: `privacy-${metadata.status?.privacyStatus || "unknown"}` };
  const durationSeconds = isoDurationToSeconds(metadata.contentDetails?.duration);
  const type = record.contentType === "short" ? "short" : "video";
  const maxSeconds = VIDEO_LIMITS[type];
  if (durationSeconds > maxSeconds) return { available: false, reason: `${type}-duration-over-limit`, durationSeconds };
  return {
    available: true,
    durationSeconds,
    title: metadata.snippet?.title || record.title || "",
    channelTitle: metadata.snippet?.channelTitle || record.channelTitle || "",
    thumbnailUrl: metadata.snippet?.thumbnails?.high?.url || metadata.snippet?.thumbnails?.medium?.url || record.thumbnailUrl || "",
  };
}

const uniqueRecords = [...new Map(videoCatalog.map(item => [item.youtubeId, item])).values()];
const metadataById = new Map();
for (const batch of chunks(uniqueRecords.map(item => item.youtubeId))) {
  const data = await fetchBatch(batch);
  for (const item of data.items || []) metadataById.set(item.id, item);
}

const unavailableYoutubeIds = [];
const results = uniqueRecords.map(record => {
  const result = evaluateRecord(record, metadataById.get(record.youtubeId));
  if (!result.available) unavailableYoutubeIds.push(record.youtubeId);
  return { youtubeId: record.youtubeId, ...result };
});

const payload = {
  schemaVersion: 1,
  checkedAt: new Date().toISOString(),
  checkedCount: uniqueRecords.length,
  unavailableYoutubeIds: [...new Set(unavailableYoutubeIds)],
  results,
};

await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${payload.checkedCount} checks to ${outputPath}; ${payload.unavailableYoutubeIds.length} disabled.`);

if (publishEndpoint) {
  const response = await fetch(publishEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(publishToken ? { Authorization: `Bearer ${publishToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Health publish failed: ${response.status} ${await response.text()}`);
  console.log("Published health result to the configured endpoint.");
}
