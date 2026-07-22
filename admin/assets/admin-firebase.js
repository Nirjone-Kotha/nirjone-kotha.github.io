import { getFirebaseServices, firebaseConfigured, FIREBASE_PATHS, cleanFirebaseValue } from "../../assets/js/firebase-core.js?v=6.1.0";
import { DEFAULT_RUNTIME } from "../../config/firebase-defaults.js";
import { FIREBASE_SDK_VERSION } from "../../config/firebase-config.js";

const VERSION = "6.1.0-firebase";
const clone = value => JSON.parse(JSON.stringify(value));
const now = () => new Date().toISOString();
const id = prefix => `${prefix}_${Date.now()}_${crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10)}`;
const text = (value, max = 500) => String(value ?? "").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
const bool = value => value === true || ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
const int = (value, min, max, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : fallback;
};
const list = value => Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value) : [];

function cleanUrl(value, { allowDataImage = false } = {}) {
  const raw = text(value, allowDataImage ? 1500000 : 700);
  if (!raw) return "";
  if (allowDataImage && /^data:image\/(?:jpeg|png|webp|gif);base64,[a-z0-9+/=]+$/i.test(raw)) return raw;
  if (raw.startsWith("/")) return raw;
  try {
    const parsed = new URL(raw);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch { return ""; }
}

function defaultSettings() { return clone(DEFAULT_RUNTIME.settings); }

function sanitizeSettings(input = {}) {
  const base = defaultSettings();
  const site = input.site && typeof input.site === "object" ? input.site : {};
  const features = input.features && typeof input.features === "object" ? input.features : {};
  const ads = input.advertising && typeof input.advertising === "object" ? input.advertising : {};
  const google = ads.google && typeof ads.google === "object" ? ads.google : {};
  const frequency = ads.frequency && typeof ads.frequency === "object" ? ads.frequency : {};
  const placements = ads.placements && typeof ads.placements === "object" ? ads.placements : {};
  const out = base;

  out.site = {
    siteName: text(site.siteName || base.site.siteName, 90) || "Moner Kotha",
    taglineBn: text(site.taglineBn, 120), taglineEn: text(site.taglineEn, 120),
    defaultLanguage: ["bn", "en"].includes(site.defaultLanguage) ? site.defaultLanguage : "en",
    maintenanceMode: bool(site.maintenanceMode),
    maintenanceTitleBn: text(site.maintenanceTitleBn, 160), maintenanceTitleEn: text(site.maintenanceTitleEn, 160),
    maintenanceMessageBn: text(site.maintenanceMessageBn, 800), maintenanceMessageEn: text(site.maintenanceMessageEn, 800),
    supportEmail: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(site.supportEmail || "")) ? String(site.supportEmail).toLowerCase() : "",
    facebookUrl: cleanUrl(site.facebookUrl), whatsappNumber: String(site.whatsappNumber || "").replace(/\D+/g, "")
  };

  Object.keys(base.features).forEach(key => { out.features[key] = bool(features[key]); });
  out.featureRules = list(input.featureRules).slice(0, 100).map(rule => {
    const effect = ["hide", "disable", "class"].includes(rule?.effect) ? rule.effect : "hide";
    return {
      id: text(rule?.id || id("rule"), 80), label: text(rule?.label || "Custom rule", 120),
      selector: text(rule?.selector, 300), enabled: bool(rule?.enabled ?? true), effect,
      className: effect === "class" ? text(rule?.className, 80) : ""
    };
  }).filter(rule => rule.selector);

  out.advertising.masterEnabled = bool(ads.masterEnabled);
  out.advertising.provider = ["none", "google", "direct", "hybrid"].includes(ads.provider) ? ads.provider : "none";
  out.advertising.nonPersonalizedOnly = bool(ads.nonPersonalizedOnly ?? true);
  let clientId = text(google.clientId, 80);
  if (clientId && !/^ca-pub-\d{10,25}$/.test(clientId)) clientId = "";
  const slotById = {};
  Object.entries(google.slotById || {}).forEach(([slot, value]) => {
    const key = text(slot, 120), digits = String(value || "").replace(/\D+/g, "");
    if (key && digits) slotById[key] = digits;
  });
  out.advertising.google = { enabled: bool(google.enabled), clientId, autoAds: bool(google.autoAds), slotById };
  out.advertising.frequency = {
    maxImpressionsPerSession: int(frequency.maxImpressionsPerSession, 1, 100, 8),
    minSecondsBetweenAds: int(frequency.minSecondsBetweenAds, 0, 3600, 30)
  };
  Object.keys(base.advertising.placements).forEach(key => { out.advertising.placements[key] = bool(placements[key]); });
  out.advertising.slotOverrides = Object.fromEntries(Object.entries(ads.slotOverrides || {}).map(([key, value]) => [text(key, 120), bool(value)]).filter(([key]) => key));
  out.schemaVersion = 1;
  return out;
}

function sanitizeAnnouncement(row = {}) {
  return {
    id: text(row.id || id("announcement"), 100),
    titleBn: text(row.titleBn, 180), titleEn: text(row.titleEn, 180),
    messageBn: text(row.messageBn, 1200), messageEn: text(row.messageEn, 1200),
    type: ["info", "success", "warning", "critical"].includes(row.type) ? row.type : "info",
    placement: ["topbar", "modal", "feed"].includes(row.placement) ? row.placement : "topbar",
    locale: ["all", "bn", "en"].includes(row.locale) ? row.locale : "all",
    priority: int(row.priority, 0, 100, 50), dismissible: bool(row.dismissible ?? true),
    actionLabelBn: text(row.actionLabelBn, 80), actionLabelEn: text(row.actionLabelEn, 80), actionUrl: cleanUrl(row.actionUrl),
    startsAt: text(row.startsAt, 40), endsAt: text(row.endsAt, 40), enabled: bool(row.enabled ?? true),
    updatedAt: now(), createdAt: text(row.createdAt || now(), 40)
  };
}

function sanitizeCampaign(row = {}) {
  const allowedPlacements = Object.keys(defaultSettings().advertising.placements);
  const item = {
    id: text(row.id || id("campaign"), 100), name: text(row.name, 160),
    type: ["image", "native", "video"].includes(row.type) ? row.type : "image",
    headlineBn: text(row.headlineBn, 180), headlineEn: text(row.headlineEn, 180),
    bodyBn: text(row.bodyBn, 700), bodyEn: text(row.bodyEn, 700),
    imageUrl: cleanUrl(row.imageUrl, { allowDataImage: true }), videoUrl: cleanUrl(row.videoUrl), targetUrl: cleanUrl(row.targetUrl),
    ctaBn: text(row.ctaBn, 70), ctaEn: text(row.ctaEn, 70), advertiser: text(row.advertiser, 120),
    placements: [...new Set(list(row.placements).filter(value => allowedPlacements.includes(value)))],
    locale: ["all", "bn", "en"].includes(row.locale) ? row.locale : "all",
    device: ["all", "mobile", "desktop"].includes(row.device) ? row.device : "all",
    weight: int(row.weight, 1, 100, 10), startsAt: text(row.startsAt, 40), endsAt: text(row.endsAt, 40),
    enabled: bool(row.enabled ?? true), updatedAt: now(), createdAt: text(row.createdAt || now(), 40)
  };
  if (!item.name) throw new Error("Campaign name is required.");
  if (!item.placements.length) throw new Error("Select at least one ad placement.");
  return item;
}

function youtubeId(value) {
  const source = text(value, 500);
  if (/^[A-Za-z0-9_-]{11}$/.test(source)) return source;
  try {
    const url = new URL(source), host = url.hostname.replace(/^www\./, ""), path = url.pathname.replace(/^\/+|\/+$/g, "");
    if (host === "youtu.be") return path.split("/")[0]?.slice(0, 11) || "";
    if (url.searchParams.get("v")) return url.searchParams.get("v").slice(0, 11);
    for (const prefix of ["shorts/", "embed/", "live/"]) if (path.startsWith(prefix)) return path.split("/")[1]?.slice(0, 11) || "";
  } catch {}
  return "";
}

function sanitizeVideo(row = {}) {
  const yt = youtubeId(row.youtubeId || row.sourceUrl);
  if (!/^[A-Za-z0-9_-]{11}$/.test(yt)) throw new Error("Valid YouTube URL or ID required.");
  const contentType = row.contentType === "short" ? "short" : "video";
  return {
    id: text(row.id || id("video"), 120), youtubeId: yt, sourceUrl: `https://www.youtube.com/watch?v=${yt}`,
    title: text(row.title, 220) || "YouTube video", titleBn: text(row.titleBn, 220), channelTitle: text(row.channelTitle, 160),
    section: row.section === "islamic" ? "islamic" : "general", contentType,
    moods: [...new Set(list(row.moods).filter(mood => ["happy", "sad", "anxious", "angry", "lonely", "stressed", "tired", "hopeful", "confused", "grateful"].includes(mood)))],
    durationSeconds: int(row.durationSeconds, 0, contentType === "short" ? 90 : 900, 0),
    playbackCapSeconds: contentType === "short" ? 90 : 900, aspect: contentType === "short" ? "portrait" : "landscape",
    thumbnailUrl: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`, likes: int(row.likes, 0, 100000000, 0),
    featured: bool(row.featured), enabled: bool(row.enabled ?? true), metadataStatus: "admin-managed",
    updatedAt: now(), addedAt: text(row.addedAt || now(), 40)
  };
}

async function waitForAuth(auth, authSdk) {
  if (auth.currentUser) return auth.currentUser;
  return new Promise(resolve => {
    const stop = authSdk.onAuthStateChanged(auth, user => { stop(); resolve(user); }, () => { stop(); resolve(null); });
  });
}

export async function requireFirebaseAdmin() {
  if (!firebaseConfigured()) throw Object.assign(new Error("Firebase config is incomplete."), { code: "FIREBASE_CONFIG" });
  const services = await getFirebaseServices();
  const user = await waitForAuth(services.auth, services.authSdk);
  if (!user) throw Object.assign(new Error("Admin sign-in required."), { code: "AUTH_REQUIRED" });
  const snapshot = await services.databaseSdk.get(services.databaseSdk.ref(services.database, `${FIREBASE_PATHS.adminUsers}/${user.uid}`));
  const record = snapshot.val();
  if (!record || record.enabled !== true) {
    await services.authSdk.signOut(services.auth);
    throw Object.assign(new Error("This Firebase account is not authorized as an administrator."), { code: "ADMIN_REQUIRED" });
  }
  return { ...services, user, admin: record };
}

async function writeAudit(context, action, summary, details = {}) {
  const entry = cleanFirebaseValue({
    id: id("log"), action: text(action, 80), summary: text(summary, 300), details,
    user: context.user.email || context.admin.name || context.user.uid, createdAt: now()
  });
  await context.databaseSdk.set(context.databaseSdk.push(context.databaseSdk.ref(context.database, FIREBASE_PATHS.adminAudit)), entry);
}

async function readAll(context) {
  const refs = {
    settings: `${FIREBASE_PATHS.runtime}/settings`, announcements: `${FIREBASE_PATHS.runtime}/announcements`,
    campaigns: `${FIREBASE_PATHS.runtime}/campaigns`, videos: `${FIREBASE_PATHS.runtime}/videos`,
    stats: FIREBASE_PATHS.adStats, audit: FIREBASE_PATHS.adminAudit
  };
  const snapshots = await Promise.all(Object.values(refs).map(path => context.databaseSdk.get(context.databaseSdk.ref(context.database, path))));
  const values = Object.fromEntries(Object.keys(refs).map((key, index) => [key, snapshots[index].val()]));

  if (!values.settings) {
    await context.databaseSdk.set(context.databaseSdk.ref(context.database, FIREBASE_PATHS.runtime), cleanFirebaseValue({
      schemaVersion: 1, version: VERSION, generatedAt: now(), settings: clone(DEFAULT_RUNTIME.settings),
      announcements: {}, campaigns: {}, videos: {}
    }));
    values.settings = clone(DEFAULT_RUNTIME.settings);
  }

  const audit = list(values.audit).sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0)).slice(0, 300);
  return {
    settings: sanitizeSettings(values.settings), announcements: list(values.announcements), campaigns: list(values.campaigns), videos: list(values.videos),
    stats: { campaigns: values.stats || {} }, audit,
    system: systemInfo(), user: { id: context.user.uid, name: context.admin.name || "Administrator", email: context.user.email || "" }
  };
}

function systemInfo() {
  return {
    version: VERSION, sdkVersion: FIREBASE_SDK_VERSION, databaseMode: "Firebase Realtime Database", authMode: "Firebase Authentication",
    dataWritable: true, uploadsWritable: true, serverTime: now(),
    modules: [
      ["Main application", "assets/js/app.js"], ["User identity", "assets/js/user-identity.js"],
      ["Firebase connector", "assets/js/firebase-core.js"], ["Advertising engine", "assets/js/ads.js"],
      ["Runtime controller", "admin/public/runtime-client.js"], ["Admin database adapter", "admin/assets/admin-firebase.js"]
    ].map(([label, path]) => ({ label, path, exists: true, modifiedAt: null, size: 0, sha1: "Firebase" }))
  };
}

async function setRuntimeMeta(context) {
  await context.databaseSdk.update(context.databaseSdk.ref(context.database, FIREBASE_PATHS.runtime), { version: VERSION, schemaVersion: 1, generatedAt: now() });
}

export async function adminApi(action, { body = null } = {}) {
  const context = await requireFirebaseAdmin();
  const db = context.database, sdk = context.databaseSdk;
  if (action === "all") return { ok: true, data: await readAll(context) };
  if (action === "system") return { ok: true, data: systemInfo() };

  if (action === "settings.save") {
    const settings = sanitizeSettings(body || {});
    await sdk.set(sdk.ref(db, `${FIREBASE_PATHS.runtime}/settings`), cleanFirebaseValue(settings));
    await setRuntimeMeta(context); await writeAudit(context, action, "Site and feature settings updated.");
    return { ok: true, data: settings };
  }

  const [type, operation] = String(action).split(".");
  const collectionMap = { announcement: "announcements", campaign: "campaigns", video: "videos" };
  const collection = collectionMap[type];
  if (collection && operation === "save") {
    const item = type === "announcement" ? sanitizeAnnouncement(body) : type === "campaign" ? sanitizeCampaign(body) : sanitizeVideo(body);
    await sdk.set(sdk.ref(db, `${FIREBASE_PATHS.runtime}/${collection}/${item.id}`), cleanFirebaseValue(item));
    await setRuntimeMeta(context); await writeAudit(context, action, `${type[0].toUpperCase() + type.slice(1)} saved.`, { id: item.id });
    const snapshot = await sdk.get(sdk.ref(db, `${FIREBASE_PATHS.runtime}/${collection}`));
    return { ok: true, data: list(snapshot.val()), item };
  }
  if (collection && operation === "delete") {
    const itemId = text(body?.id, 120);
    await sdk.remove(sdk.ref(db, `${FIREBASE_PATHS.runtime}/${collection}/${itemId}`));
    await setRuntimeMeta(context); await writeAudit(context, action, `${type[0].toUpperCase() + type.slice(1)} deleted.`, { id: itemId });
    const snapshot = await sdk.get(sdk.ref(db, `${FIREBASE_PATHS.runtime}/${collection}`));
    return { ok: true, data: list(snapshot.val()) };
  }

  if (action === "video.bulk") {
    const links = String(body?.links || "").split(/[\s,;]+/).filter(Boolean).slice(0, 100);
    const snapshot = await sdk.get(sdk.ref(db, `${FIREBASE_PATHS.runtime}/videos`));
    const existing = list(snapshot.val()), known = new Set(existing.map(item => item.youtubeId));
    const updates = {}; let added = 0;
    links.forEach(link => {
      try {
        const item = sanitizeVideo({ ...body, id: id("video"), youtubeId: link, title: body?.title || "YouTube video" });
        if (!known.has(item.youtubeId)) { updates[item.id] = item; known.add(item.youtubeId); added += 1; }
      } catch {}
    });
    if (added) await sdk.update(sdk.ref(db, `${FIREBASE_PATHS.runtime}/videos`), cleanFirebaseValue(updates));
    await setRuntimeMeta(context); await writeAudit(context, action, "Bulk video import completed.", { added });
    const result = await sdk.get(sdk.ref(db, `${FIREBASE_PATHS.runtime}/videos`));
    return { ok: true, data: list(result.val()), added };
  }

  if (action === "password.change") {
    const currentPassword = String(body?.currentPassword || ""), newPassword = String(body?.newPassword || "");
    if (newPassword.length < 10) throw new Error("New password must contain at least 10 characters.");
    const credential = context.authSdk.EmailAuthProvider.credential(context.user.email, currentPassword);
    await context.authSdk.reauthenticateWithCredential(context.user, credential);
    await context.authSdk.updatePassword(context.user, newPassword);
    await writeAudit(context, action, "Administrator password changed.");
    return { ok: true };
  }

  if (action === "audit.clear") {
    await sdk.remove(sdk.ref(db, FIREBASE_PATHS.adminAudit));
    await writeAudit(context, action, "Audit log cleared.");
    return { ok: true };
  }

  throw new Error("Unknown admin action.");
}

export async function adminSignOut() {
  const { auth, authSdk } = await getFirebaseServices();
  await authSdk.signOut(auth);
}

export async function compressAdminImage(file) {
  if (!file || !/^image\/(jpeg|png|webp|gif)$/i.test(file.type)) throw new Error("Only JPG, PNG, WEBP or GIF is allowed.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller.");
  if (file.type === "image/gif") {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error("Image could not be read.")); reader.readAsDataURL(file);
    });
  }
  const bitmap = await createImageBitmap(file);
  const max = 1600, scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d", { alpha: false }).drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close?.();
  let quality = 0.86, data = canvas.toDataURL("image/webp", quality);
  while (data.length > 1200000 && quality > 0.5) { quality -= 0.08; data = canvas.toDataURL("image/webp", quality); }
  if (data.length > 1400000) throw new Error("Image is still too large after optimization. Use a smaller image.");
  return data;
}
