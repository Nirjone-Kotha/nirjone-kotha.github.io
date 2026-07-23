function base64UrlToUint8Array(value = "") {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(char => char.charCodeAt(0)));
}

export function initPWA({ onInstallAvailable, onInstalled, onOfflineChange, onUpdateReady, onError } = {}) {
  let deferredPrompt = null;
  let registration = null;

  const reportNetwork = () => onOfflineChange?.(!navigator.onLine);
  window.addEventListener("online", reportNetwork);
  window.addEventListener("offline", reportNetwork);
  reportNetwork();

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    onInstallAvailable?.(true);
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    onInstallAvailable?.(false);
    onInstalled?.();
  });

  if ("serviceWorker" in navigator && (location.protocol === "https:" || ["localhost", "127.0.0.1"].includes(location.hostname))) {
    window.addEventListener("load", async () => {
      try {
        registration = await navigator.serviceWorker.register("./sw.js?v=6.4.0", { scope: "./", updateViaCache: "none" });
        if (registration.waiting) registration.waiting.postMessage({ type: "SKIP_WAITING" });
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          worker?.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              worker.postMessage({ type: "SKIP_WAITING" });
              onUpdateReady?.(() => worker.postMessage({ type: "SKIP_WAITING" }));
            }
          });
        });
        registration.update().catch(()=>{});
        setInterval(()=>registration?.update?.().catch(()=>{}),30*60*1000);
        document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")registration?.update?.().catch(()=>{})});
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (refreshing) return;
          refreshing = true;
          location.reload();
        });
      } catch (error) { onError?.(error); }
    });
  }

  async function readyRegistration() {
    if (registration) return registration;
    if (!("serviceWorker" in navigator)) return null;
    try {
      registration = await navigator.serviceWorker.ready;
      return registration;
    } catch { return null; }
  }

  return {
    async promptInstall() {
      if (!deferredPrompt) return { available: false, outcome: "unavailable" };
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      deferredPrompt = null;
      onInstallAvailable?.(false);
      return { available: true, outcome: result.outcome };
    },
    async checkForUpdate() { await registration?.update?.(); },
    async requestNotifications() {
      if (!("Notification" in window)) return { supported: false, permission: "unsupported" };
      const permission = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
      return { supported: true, permission };
    },
    async showNotification(title, options = {}) {
      if (!("Notification" in window) || Notification.permission !== "granted") return false;
      const reg = await readyRegistration();
      const normalized = {
        icon: "./assets/icons/icon-192.png",
        badge: "./assets/icons/favicon.png",
        tag: "moner-kotha-local",
        renotify: false,
        ...options
      };
      if (reg?.showNotification) await reg.showNotification(title, normalized);
      else new Notification(title, normalized);
      return true;
    },
    async subscribePush({ publicKey = "" } = {}) {
      const reg = await readyRegistration();
      if (!reg?.pushManager || !publicKey) return { available: false, reason: publicKey ? "unsupported" : "missing-public-key" };
      const permission = await this.requestNotifications();
      if (permission.permission !== "granted") return { available: false, reason: "permission-denied" };
      const existing = await reg.pushManager.getSubscription();
      if (existing) return { available: true, subscription: existing };
      const subscription = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64UrlToUint8Array(publicKey) });
      return { available: true, subscription };
    },
    isStandalone: Boolean(
      matchMedia("(display-mode: standalone)").matches ||
      matchMedia("(display-mode: fullscreen)").matches ||
      matchMedia("(display-mode: minimal-ui)").matches ||
      matchMedia("(display-mode: window-controls-overlay)").matches ||
      navigator.standalone === true ||
      String(globalThis.document?.referrer || "").startsWith("android-app://") ||
      /(?:^|[?&])source=pwa(?:&|$)/.test(String(globalThis.location?.search || ""))
    )
  };
}
