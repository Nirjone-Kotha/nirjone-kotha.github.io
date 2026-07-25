
const PREFIX = "mk3";
const LEGACY_PREFIX = "mk2";

function safeParse(raw, fallback) {
  if (raw === null || raw === undefined) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

class LocalStorageAdapter {
  constructor(prefix = PREFIX) {
    this.prefix = prefix;
    this.memory = new Map();
    this.available = this.#probe();
    try { this.channel = "BroadcastChannel" in window ? new BroadcastChannel(`${prefix}-sync`) : null; } catch { this.channel = null; }
  }
  #probe() {
    try {
      const key = `__${this.prefix}_probe__`;
      localStorage.setItem(key, "1");
      localStorage.removeItem(key);
      return true;
    } catch { return false; }
  }
  key(name) { return `${this.prefix}-${name}`; }
  legacyKey(name) { return `${LEGACY_PREFIX}-${name}`; }
  has(name) {
    if (this.available) return localStorage.getItem(this.key(name)) !== null;
    return this.memory.has(name);
  }
  get(name, fallback = null) {
    let raw = null;
    let legacy = false;
    if (this.available) {
      raw = localStorage.getItem(this.key(name));
      if (raw === null) { raw = localStorage.getItem(this.legacyKey(name)); legacy = raw !== null; }
    } else if (this.memory.has(name)) return this.memory.get(name);
    if (legacy) {
      try { return JSON.parse(raw); } catch { return raw ?? fallback; }
    }
    return safeParse(raw, fallback);
  }
  getText(name, fallback = "") {
    const value = this.get(name, fallback);
    return typeof value === "string" ? value : fallback;
  }
  getNumber(name, fallback = 0) {
    const value = Number(this.get(name, fallback));
    return Number.isFinite(value) ? value : fallback;
  }
  set(name, value, { broadcast = true } = {}) {
    try {
      if (this.available) localStorage.setItem(this.key(name), JSON.stringify(value));
      else this.memory.set(name, value);
      if (broadcast) this.channel?.postMessage({ type: "changed", name, at: Date.now() });
      return true;
    } catch (error) {
      window.dispatchEvent(new CustomEvent("mk:storage-error", { detail: { name, error } }));
      return false;
    }
  }
  batch(values) {
    let ok = true;
    Object.entries(values).forEach(([name, value]) => { ok = this.set(name, value, { broadcast: false }) && ok; });
    this.channel?.postMessage({ type: "batch-changed", names: Object.keys(values), at: Date.now() });
    return ok;
  }
  remove(name) {
    if (this.available) localStorage.removeItem(this.key(name));
    else this.memory.delete(name);
  }
  clearAppData() {
    if (this.available) {
      Object.keys(localStorage).filter(key => key.startsWith(`${this.prefix}-`)).forEach(key => localStorage.removeItem(key));
    } else this.memory.clear();
    this.channel?.postMessage({ type: "reset", at: Date.now() });
  }
  exportData() {
    const data = { schemaVersion: 1, exportedAt: new Date().toISOString(), values: {} };
    if (this.available) {
      Object.keys(localStorage).filter(key => key.startsWith(`${this.prefix}-`)).forEach(key => {
        data.values[key.slice(this.prefix.length + 1)] = safeParse(localStorage.getItem(key), null);
      });
    } else {
      this.memory.forEach((value, key) => { data.values[key] = value; });
    }
    return data;
  }
  subscribe(callback) {
    const storageHandler = event => {
      if (event.key?.startsWith(`${this.prefix}-`)) callback({ type: "external", name: event.key.slice(this.prefix.length + 1) });
    };
    const channelHandler = event => callback(event.data || { type: "external" });
    window.addEventListener("storage", storageHandler);
    this.channel?.addEventListener("message", channelHandler);
    return () => {
      window.removeEventListener("storage", storageHandler);
      this.channel?.removeEventListener("message", channelHandler);
    };
  }
}

export const store = new LocalStorageAdapter();
