import { loadSiteConfig } from "./config.js";
import { hasConsent, subscribeConsent } from "./consent.js";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "public_link_open",
  "install_prompt_open",
  "pwa_install_result",
  "generic_feature_open",
  "performance_metric"
]);
const SENSITIVE_KEYS = /mood|need|post|comment|query|search|safety|message|email|phone|name|profile|relationship|anxiety|depress/i;
let providerReady = false;
let config = null;

function cleanPath(value) {
  try {
    const url = new URL(value, location.origin);
    return url.pathname;
  } catch {
    return "/";
  }
}

function safePayload(raw = {}) {
  const output = {};
  Object.entries(raw).forEach(([key, value]) => {
    if (SENSITIVE_KEYS.test(key)) return;
    if (!["string", "number", "boolean"].includes(typeof value)) return;
    output[key] = typeof value === "string" ? value.slice(0, 120) : value;
  });
  return output;
}

async function ensureProvider() {
  if (providerReady || !hasConsent("analytics")) return providerReady;
  config ||= await loadSiteConfig();
  if (config.analytics.provider !== "ga4" || !/^G-[A-Z0-9]+$/i.test(config.analytics.measurementId)) return false;
  // The provider script is deliberately not injected in the prototype. A production
  // deployment may register an adapter after consent by listening for this event.
  window.dispatchEvent(new CustomEvent("mk:analytics-provider-request", {
    detail: { provider: "ga4", measurementId: config.analytics.measurementId }
  }));
  providerReady = typeof window.gtag === "function";
  return providerReady;
}

export async function trackEvent(name, raw = {}) {
  if (!ALLOWED_EVENTS.has(name) || !hasConsent("analytics")) return false;
  const payload = safePayload(raw);
  if (name === "page_view") payload.page_path = cleanPath(raw.page_path || location.href);
  await ensureProvider();
  if (typeof window.gtag === "function") {
    window.gtag("event", name, payload);
    return true;
  }
  window.dispatchEvent(new CustomEvent("mk:analytics-event", { detail: { name, payload } }));
  return false;
}

export function trackPage(path = location.href, category = "app") {
  return trackEvent("page_view", { page_path: cleanPath(path), page_category: String(category).slice(0, 60) });
}

subscribeConsent(consent => {
  if (!consent.analytics) providerReady = false;
  else ensureProvider();
});
