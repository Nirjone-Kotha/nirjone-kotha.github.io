import { store } from "./storage.js";

const STORAGE_KEY = "consent-preferences";
const DEFAULT_CONSENT = Object.freeze({
  schemaVersion: 1,
  necessary: true,
  analytics: false,
  advertising: false,
  updatedAt: ""
});

const listeners = new Set();

function normalize(raw = {}) {
  return Object.freeze({
    schemaVersion: 1,
    necessary: true,
    analytics: Boolean(raw.analytics),
    advertising: Boolean(raw.advertising),
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : ""
  });
}

let preferences = normalize(store.get(STORAGE_KEY, DEFAULT_CONSENT));

export function getConsent() {
  return { ...preferences };
}

export function setConsent(next = {}) {
  preferences = normalize({ ...preferences, ...next, updatedAt: new Date().toISOString() });
  store.set(STORAGE_KEY, preferences);
  listeners.forEach(listener => {
    try { listener(getConsent()); } catch (error) { console.warn("Consent listener failed", error); }
  });
  window.dispatchEvent(new CustomEvent("mk:consent-changed", { detail: getConsent() }));
  return getConsent();
}

export function subscribeConsent(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function hasConsent(category) {
  if (category === "necessary") return true;
  return Boolean(preferences[category]);
}

window.MonerKothaConsent = Object.freeze({
  get: getConsent,
  set: setConsent,
  has: hasConsent
});
