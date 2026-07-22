const FALLBACK_CONFIG = Object.freeze({
  schemaVersion: 2,
  environment: "development",
  siteName: "Moner Kotha: Anonymous Social Site",
  baseUrl: "",
  defaultLocale: "en",
  supportedLocales: ["bn", "en"],
  defaultOgImage: "/assets/brand/share-cover.png",
  twitterHandle: "",
  contact: Object.freeze({
    facebookPageUrl: "",
    supportEmail: "",
    whatsappNumber: "",
    whatsappPrefilledMessage: "Hello, I need help regarding the Moner Kotha website."
  }),
  analytics: Object.freeze({
    provider: "none",
    measurementId: "",
    googleSiteVerification: "",
    bingSiteVerification: ""
  }),
  editorial: Object.freeze({
    organizationName: "Moner Kotha Editorial Team",
    reviewerName: "",
    reviewerCredentials: ""
  }),
  notifications: Object.freeze({
    enabled: false,
    pushPublicKey: "",
    subscriptionEndpoint: ""
  })
});

let cachedConfig = null;
let pendingConfig = null;

function cleanText(value, max = 500) {
  return String(value ?? "").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
}

function validHttpUrl(value) {
  const text = cleanText(value, 500);
  if (!text) return "";
  try {
    const url = new URL(text);
    return ["https:", "http:"].includes(url.protocol) ? url.href.replace(/\/$/, "") : "";
  } catch {
    return "";
  }
}

export function sanitizeEmail(value) {
  const email = cleanText(value, 254).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : "";
}

export function sanitizeWhatsAppNumber(value) {
  const digits = cleanText(value, 40).replace(/[^0-9]/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : "";
}

function normalizeConfig(raw = {}) {
  const baseUrl = validHttpUrl(raw.baseUrl);
  const facebookPageUrl = validHttpUrl(raw?.contact?.facebookPageUrl);
  const supportEmail = sanitizeEmail(raw?.contact?.supportEmail);
  const whatsappNumber = sanitizeWhatsAppNumber(raw?.contact?.whatsappNumber);
  const supportedLocales = Array.isArray(raw.supportedLocales)
    ? raw.supportedLocales.filter(x => ["bn", "en"].includes(x))
    : ["bn", "en"];

  return Object.freeze({
    schemaVersion: Number(raw.schemaVersion) || 2,
    environment: raw.environment === "production" ? "production" : "development",
    siteName: cleanText(raw.siteName, 80) || FALLBACK_CONFIG.siteName,
    baseUrl,
    defaultLocale: supportedLocales.includes(raw.defaultLocale) ? raw.defaultLocale : "en",
    supportedLocales: supportedLocales.length ? supportedLocales : ["bn", "en"],
    defaultOgImage: cleanText(raw.defaultOgImage, 240) || FALLBACK_CONFIG.defaultOgImage,
    twitterHandle: cleanText(raw.twitterHandle, 80),
    contact: Object.freeze({
      facebookPageUrl,
      supportEmail,
      whatsappNumber,
      whatsappPrefilledMessage: cleanText(
        raw?.contact?.whatsappPrefilledMessage,
        500
      ) || FALLBACK_CONFIG.contact.whatsappPrefilledMessage
    }),
    analytics: Object.freeze({
      provider: ["none", "ga4"].includes(raw?.analytics?.provider) ? raw.analytics.provider : "none",
      measurementId: cleanText(raw?.analytics?.measurementId, 80),
      googleSiteVerification: cleanText(raw?.analytics?.googleSiteVerification, 180),
      bingSiteVerification: cleanText(raw?.analytics?.bingSiteVerification, 180)
    }),
    editorial: Object.freeze({
      organizationName: cleanText(raw?.editorial?.organizationName, 120) || FALLBACK_CONFIG.editorial.organizationName,
      reviewerName: cleanText(raw?.editorial?.reviewerName, 120),
      reviewerCredentials: cleanText(raw?.editorial?.reviewerCredentials, 180)
    }),
    notifications: Object.freeze({
      enabled: Boolean(raw?.notifications?.enabled),
      pushPublicKey: cleanText(raw?.notifications?.pushPublicKey, 300),
      subscriptionEndpoint: validHttpUrl(raw?.notifications?.subscriptionEndpoint)
    })
  });
}

export async function loadSiteConfig({ force = false } = {}) {
  if (cachedConfig && !force) return cachedConfig;
  if (pendingConfig && !force) return pendingConfig;
  pendingConfig = fetch(new URL("../../config/site.json", import.meta.url), {
    credentials: "same-origin",
    cache: force ? "no-store" : "default"
  })
    .then(response => {
      if (!response.ok) throw new Error(`Site configuration request failed: ${response.status}`);
      return response.json();
    })
    .then(raw => {
      cachedConfig = normalizeConfig(raw);
      window.dispatchEvent(new CustomEvent("mk:site-config-ready", { detail: cachedConfig }));
      return cachedConfig;
    })
    .catch(error => {
      console.warn("Using safe fallback site configuration", error);
      cachedConfig = normalizeConfig(FALLBACK_CONFIG);
      return cachedConfig;
    })
    .finally(() => { pendingConfig = null; });
  return pendingConfig;
}

export function getFallbackSiteConfig() {
  return normalizeConfig(FALLBACK_CONFIG);
}

export function runtimeBaseUrl(config = cachedConfig || FALLBACK_CONFIG) {
  if (config.baseUrl) return config.baseUrl;
  if (typeof location !== "undefined" && /^https?:$/.test(location.protocol)) return location.origin;
  return "";
}

export function localizedPath(locale, path = "") {
  const lang = locale === "bn" ? "bn" : "en";
  const clean = String(path || "").replace(/^\/+|\/+$/g, "");
  return `/${lang}/${clean ? `${clean}/` : ""}`;
}

export function absoluteSiteUrl(path = "/", config = cachedConfig || FALLBACK_CONFIG) {
  const base = runtimeBaseUrl(config);
  const cleanPath = String(path || "/").startsWith("/") ? String(path || "/") : `/${path}`;
  return base ? new URL(cleanPath, `${base}/`).href : cleanPath;
}

export function contactOptions(config, locale = "en") {
  const bn = locale === "bn";
  const contact = config?.contact || FALLBACK_CONFIG.contact;
  const encodedMessage = encodeURIComponent(contact.whatsappPrefilledMessage || "");
  const options = [
    {
      id: "facebook",
      label: bn ? "Facebook Page" : "Facebook Page",
      description: bn ? "প্ল্যাটফর্মের আপডেট ও সাধারণ যোগাযোগ" : "Platform updates and general enquiries",
      href: contact.facebookPageUrl || "",
      external: true
    },
    {
      id: "email",
      label: bn ? "ইমেইল সাপোর্ট" : "Email support",
      description: bn ? "প্রযুক্তিগত, গোপনীয়তা বা অ্যাকাউন্ট প্রশ্ন" : "Technical, privacy or account questions",
      href: contact.supportEmail ? `mailto:${contact.supportEmail}` : "",
      external: false
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      description: bn ? "প্ল্যাটফর্ম-সংক্রান্ত সহায়তার বার্তা" : "Message the platform support team",
      href: contact.whatsappNumber ? `https://wa.me/${contact.whatsappNumber}${encodedMessage ? `?text=${encodedMessage}` : ""}` : "",
      external: true
    }
  ];
  return options.map(option => Object.freeze({ ...option, enabled: Boolean(option.href) }));
}
