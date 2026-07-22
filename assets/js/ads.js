import { store } from "./storage.js";

/**
 * Moner Kotha advertising boundary.
 *
 * No advertising provider or publisher ID is included in this prototype.
 * All placements are OFF by default. A future admin panel can update the same
 * settings through the public API exposed as window.MonerKothaAds.
 */

export const AD_PLACEMENTS = Object.freeze({
  FEED_IN_FEED: "feedInFeed",
  DESKTOP_RIGHT_RAIL: "desktopRightRail",
  RESOURCE_IN_ARTICLE: "resourceInArticle",
  RESOURCE_MULTIPLEX: "resourceMultiplex",
  MOBILE_ANCHOR: "mobileAnchor",
  DESKTOP_ANCHOR: "desktopAnchor",
  VIGNETTE: "vignette",
  SIDE_RAIL_AUTO: "sideRailAuto"
});

export const DEFAULT_AD_SETTINGS = Object.freeze({
  schemaVersion: 1,
  masterEnabled: false,
  nonPersonalizedOnly: true,
  previewPlaceholders: false,
  placements: Object.freeze({
    [AD_PLACEMENTS.FEED_IN_FEED]: false,
    [AD_PLACEMENTS.DESKTOP_RIGHT_RAIL]: false,
    [AD_PLACEMENTS.RESOURCE_IN_ARTICLE]: false,
    [AD_PLACEMENTS.RESOURCE_MULTIPLEX]: false,
    [AD_PLACEMENTS.MOBILE_ANCHOR]: false,
    [AD_PLACEMENTS.DESKTOP_ANCHOR]: false,
    [AD_PLACEMENTS.VIGNETTE]: false,
    [AD_PLACEMENTS.SIDE_RAIL_AUTO]: false
  }),
  slotOverrides: Object.freeze({})
});

const STORAGE_KEY = "ad-settings";
const PROTECTED_CONTEXTS = new Set([
  "welcome",
  "mood-checkin",
  "composer",
  "comments",
  "safety",
  "calm",
  "profile",
  "install",
  "empty-results",
  "offline",
  "login",
  "signup",
  "password-recovery",
  "private-message",
  "modal",
  "drawer"
]);

const listeners = new Set();
const safeReasons = new Set();
const PERMANENT_REMOVAL_REASONS = new Set([
  "high-risk-feed",
  "safety-content",
  "policy-violation"
]);
let renderer = null;
let developerPreviewMode = Boolean(
  typeof location !== "undefined" &&
  ["localhost", "127.0.0.1", "::1"].includes(location.hostname)
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalize(raw = {}) {
  const placements = {};
  Object.values(AD_PLACEMENTS).forEach(id => {
    placements[id] = Boolean(raw?.placements?.[id]);
  });

  const slotOverrides = {};
  if (raw?.slotOverrides && typeof raw.slotOverrides === "object") {
    Object.entries(raw.slotOverrides).forEach(([slotId, enabled]) => {
      if (typeof slotId === "string" && slotId.trim()) slotOverrides[slotId] = Boolean(enabled);
    });
  }

  return {
    schemaVersion: 1,
    masterEnabled: Boolean(raw.masterEnabled),
    nonPersonalizedOnly: raw.nonPersonalizedOnly !== false,
    previewPlaceholders: Boolean(raw.previewPlaceholders),
    placements,
    slotOverrides
  };
}

let settings = normalize(store.get(STORAGE_KEY, DEFAULT_AD_SETTINGS));

function saveAndNotify() {
  store.set(STORAGE_KEY, settings);
  const snapshot = getAdSettings();
  listeners.forEach(listener => {
    try { listener(snapshot); } catch (error) { console.warn("Ad settings listener failed", error); }
  });
  window.dispatchEvent(new CustomEvent("mk:ad-settings-changed", { detail: snapshot }));
}

export function getAdSettings() {
  return clone(settings);
}

/** Apply trusted server-side settings supplied by the administration runtime. */
export function applyRemoteAdSettings(raw = {}) {
  settings = normalize(raw);
  saveAndNotify();
  return getAdSettings();
}

export function setMasterAdsEnabled(enabled) {
  settings.masterEnabled = Boolean(enabled);
  saveAndNotify();
  return getAdSettings();
}

export function setAdPlacementEnabled(placement, enabled) {
  if (!Object.values(AD_PLACEMENTS).includes(placement)) {
    throw new Error(`Unknown ad placement: ${placement}`);
  }
  settings.placements[placement] = Boolean(enabled);
  saveAndNotify();
  return getAdSettings();
}

export function setAdSlotEnabled(slotId, enabled) {
  if (!slotId || typeof slotId !== "string") throw new Error("A stable slot ID is required.");
  settings.slotOverrides[slotId] = Boolean(enabled);
  saveAndNotify();
  return getAdSettings();
}

export function clearAdSlotOverride(slotId) {
  delete settings.slotOverrides[slotId];
  saveAndNotify();
  return getAdSettings();
}

export function setAdPreviewPlaceholders(enabled) {
  settings.previewPlaceholders = Boolean(enabled) && developerPreviewMode;
  saveAndNotify();
  return getAdSettings();
}

export function setAdDevelopmentPreviewMode(enabled) {
  developerPreviewMode = Boolean(enabled);
  if (!developerPreviewMode && settings.previewPlaceholders) {
    settings.previewPlaceholders = false;
    saveAndNotify();
  }
  return developerPreviewMode;
}

export function resetAdSettings() {
  settings = normalize(DEFAULT_AD_SETTINGS);
  saveAndNotify();
  return getAdSettings();
}

export function subscribeAdSettings(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function registerAdRenderer(callback) {
  renderer = typeof callback === "function" ? callback : null;
  removeAllAdSlots();
  window.dispatchEvent(new CustomEvent("mk:ad-renderer-changed"));
}

export function setAdSafeMode(enabled, reason = "manual") {
  if (enabled) safeReasons.add(reason);
  else safeReasons.delete(reason);
  const active = safeReasons.size > 0;
  document.documentElement.classList.toggle("ad-safe-mode", active);
  if (active && [...safeReasons].some(item => PERMANENT_REMOVAL_REASONS.has(item))) {
    removeAllAdSlots();
  }
  return active;
}

export function isAdSafeMode() {
  return safeReasons.size > 0;
}

export function isProtectedAdContext(context) {
  return PROTECTED_CONTEXTS.has(context);
}

export function isAdSlotEnabled({ placement, slotId, context = "feed", highRisk = false } = {}) {
  if (!settings.masterEnabled || isAdSafeMode() || highRisk || isProtectedAdContext(context)) return false;
  if (!Object.values(AD_PLACEMENTS).includes(placement)) return false;
  if (Object.prototype.hasOwnProperty.call(settings.slotOverrides, slotId)) {
    return Boolean(settings.slotOverrides[slotId]);
  }
  return Boolean(settings.placements[placement]);
}

/** First feed slot after post 10, then after every additional 8 posts. */
export function shouldInsertInFeedAd(position) {
  return position === 10 || (position > 10 && (position - 10) % 8 === 0);
}

function createPreview(slot) {
  slot.hidden = false;
  slot.classList.add("ad-preview-slot");
  slot.innerHTML = `
    <span class="ad-slot-label">Advertisement</span>
    <div class="ad-slot-preview-body" aria-hidden="true">
      <strong>Ad placement preview</strong>
      <small>${slot.dataset.adSlotId}</small>
    </div>`;
}

export function createAdSlot({
  placement,
  slotId,
  context = "feed",
  position = null,
  format = "responsive",
  className = ""
} = {}) {
  if (!isAdSlotEnabled({ placement, slotId, context })) return null;

  const slot = document.createElement("section");
  slot.className = `ad-slot ${className}`.trim();
  slot.dataset.adPlacement = placement;
  slot.dataset.adSlotId = slotId;
  slot.dataset.adContext = context;
  slot.dataset.adFormat = format;
  if (position !== null) slot.dataset.adPosition = String(position);
  slot.setAttribute("aria-label", "Advertisement");

  const request = Object.freeze({
    placement,
    slotId,
    context,
    position,
    format,
    personalized: false
  });

  let rendered = false;
  if (renderer) {
    try { rendered = renderer(slot, request) !== false; }
    catch (error) { console.warn("Ad renderer failed", error); }
  }

  if (!rendered) {
    const event = new CustomEvent("mk:ad-slot-request", {
      detail: { slot, request, markRendered: () => { rendered = true; } }
    });
    window.dispatchEvent(event);
  }

  if (!rendered && settings.previewPlaceholders && developerPreviewMode) createPreview(slot);
  else if (!rendered) slot.hidden = true;

  return slot;
}

export function renderAdInto(mount, options) {
  if (!mount) return null;
  const existing = mount.querySelector(`[data-ad-slot-id="${CSS.escape(options.slotId)}"]`);
  const enabled = isAdSlotEnabled(options);
  if (!enabled) {
    mount.hidden = true;
    existing?.remove();
    return null;
  }
  if (existing) {
    mount.hidden = existing.hidden;
    return existing;
  }
  const slot = createAdSlot(options);
  mount.replaceChildren();
  if (slot) mount.appendChild(slot);
  mount.hidden = !slot || slot.hidden;
  return slot;
}

export function removeAllAdSlots(root = document) {
  root.querySelectorAll("[data-ad-slot-id]").forEach(slot => slot.remove());
  root.querySelectorAll(".desktop-ad-mount").forEach(mount => { mount.hidden = true; });
}

/**
 * Optional future AdSense renderer. It is intentionally not registered here.
 * Call only after an approved provider configuration and consent have resolved.
 */
export function registerAdSenseRenderer({ client, slotById = {}, consentGranted = () => false } = {}) {
  if (!client || typeof client !== "string") throw new Error("A valid AdSense client ID is required.");
  registerAdRenderer((mount, request) => {
    if (!consentGranted() || !slotById[request.slotId]) return false;
    const ad = document.createElement("ins");
    ad.className = "adsbygoogle";
    ad.style.display = "block";
    ad.dataset.adClient = client;
    ad.dataset.adSlot = String(slotById[request.slotId]);
    ad.dataset.adFormat = request.format || "auto";
    ad.dataset.fullWidthResponsive = "true";
    mount.appendChild(ad);
    requestAnimationFrame(() => {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
      catch (error) { console.error("Ad render failed:", error); }
    });
    return true;
  });
}

export function getAdRequestPolicy() {
  return Object.freeze({
    personalized: false,
    useMoodForTargeting: false,
    usePostContentForTargeting: false,
    useSearchForTargeting: false,
    useSafetyEventsForTargeting: false
  });
}

// Future admin panels can use this API without importing app internals.
window.MonerKothaAds = Object.freeze({
  placements: AD_PLACEMENTS,
  getSettings: getAdSettings,
  applyRemoteSettings: applyRemoteAdSettings,
  setMasterEnabled: setMasterAdsEnabled,
  setPlacementEnabled: setAdPlacementEnabled,
  setSlotEnabled: setAdSlotEnabled,
  clearSlotOverride: clearAdSlotOverride,
  setPreviewPlaceholders: setAdPreviewPlaceholders,
  setDevelopmentPreviewMode: setAdDevelopmentPreviewMode,
  reset: resetAdSettings,
  registerRenderer: registerAdRenderer,
  registerAdSenseRenderer,
  getRequestPolicy: getAdRequestPolicy
});
