export function initPlatform() {
  const displayStandalone = matchMedia("(display-mode: standalone)").matches;
  const displayFullscreen = matchMedia("(display-mode: fullscreen)").matches;
  const displayMinimalUi = matchMedia("(display-mode: minimal-ui)").matches;
  const displayWindowControls = matchMedia("(display-mode: window-controls-overlay)").matches;
  const launchSearch = String(globalThis.location?.search || "");
  const pwaLaunchHint = /(?:^|[?&])(?:source=pwa|app=installed)(?:&|$)/.test(launchSearch);
  const androidAppReferrer = String(globalThis.document?.referrer || "").startsWith("android-app://");
  try {
    if (pwaLaunchHint || androidAppReferrer || displayStandalone || displayFullscreen || displayMinimalUi) {
      sessionStorage.setItem("mk-installed-app-session", "1");
    }
  } catch {}
  let installedSessionHint = false;
  try { installedSessionHint = sessionStorage.getItem("mk-installed-app-session") === "1"; } catch {}
  const standalone = Boolean(
    displayStandalone || displayFullscreen || displayMinimalUi || displayWindowControls ||
    navigator.standalone === true || androidAppReferrer || pwaLaunchHint || installedSessionHint
  );

  const userAgent = navigator.userAgent || "";
  const platformHint = `${navigator.userAgentData?.platform || ""} ${navigator.platform || ""}`;
  const hasTouch = Number(navigator.maxTouchPoints || 0) > 0 || matchMedia("(pointer: coarse)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const narrowViewport = Math.min(window.innerWidth || 0, window.innerHeight || 0) <= 760;
  const smallestScreenSide = Math.min(
    Number(screen?.width || window.innerWidth || 0),
    Number(screen?.height || window.innerHeight || 0)
  );

  const phoneUA = /iphone|ipod|windows phone|android.+mobile|\bmobile\b/i.test(userAgent);
  const tabletUA = /ipad|tablet|kindle|silk/i.test(userAgent) || (/android/i.test(userAgent) && !/mobile/i.test(userAgent));
  const androidPlatform = /android/i.test(`${userAgent} ${platformHint}`);
  const iosPlatform = /iphone|ipod/i.test(`${userAgent} ${platformHint}`);
  const ipadDesktopMode = /macintel/i.test(platformHint) && Number(navigator.maxTouchPoints || 0) > 1;

  // A physical phone can request a desktop browser identity. Keep that request in the
  // complete desktop layout, while a normal phone browser uses the same compact layout
  // as the installed phone app.
  const phoneByCapabilities = hasTouch && coarse && smallestScreenSide > 0 && smallestScreenSide <= 760;
  const desktopModePhone = androidPlatform && hasTouch && !tabletUA && smallestScreenSide > 0 && smallestScreenSide <= 1100;
  const isPhone = Boolean(phoneUA || iosPlatform || phoneByCapabilities || desktopModePhone);
  const isTablet = Boolean(!isPhone && (tabletUA || ipadDesktopMode || (hasTouch && smallestScreenSide > 760 && smallestScreenSide <= 1280)));
  const deviceType = isPhone ? "phone" : isTablet ? "tablet" : "desktop";

  // When a phone browser explicitly asks for the desktop site, its mobile UA marker is
  // normally absent even though coarse touch and the physical screen still identify it
  // as a phone. In that one case, preserve the desktop layout.
  const desktopSiteRequested = Boolean(isPhone && !standalone && !phoneUA && !iosPlatform && (phoneByCapabilities || desktopModePhone));
  const installedPhoneApp = standalone && isPhone;
  const phoneAppLayout = Boolean(isPhone && (standalone || !desktopSiteRequested));
  const layout = phoneAppLayout ? "mobile" : "desktop";
  const platform = standalone ? "PWA" : "Web";

  document.documentElement.dataset.platform = platform.toLowerCase();
  document.documentElement.dataset.device = deviceType;
  document.documentElement.dataset.layout = layout;
  document.documentElement.dataset.desktopSite = desktopSiteRequested ? "true" : "false";
  document.body?.classList.toggle("standalone-mode", standalone);
  // The existing compact phone-app styles are intentionally shared by a normal phone
  // browser so the two views remain visually identical.
  document.body?.classList.toggle("installed-phone-app", phoneAppLayout);
  document.body?.classList.toggle("device-phone", isPhone);
  document.body?.classList.toggle("device-tablet", isTablet);
  document.body?.classList.toggle("device-desktop", deviceType === "desktop");

  /* Prevent zoom-out from breaking the mobile layout.
     On installed phone apps / mobile browser layouts, lock the viewport scale
     and add a recovery listener that resets zoom if it strays. */
  if (phoneAppLayout) {
    const vp = document.querySelector('meta[name="viewport"]');
    if (vp) vp.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
    if (window.visualViewport) {
      let resetTimer;
      window.visualViewport.addEventListener("resize", () => {
        clearTimeout(resetTimer);
        const s = window.visualViewport.scale;
        if (s < 0.95 || s > 1.15) {
          resetTimer = setTimeout(() => {
            if (vp) vp.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
          }, 200);
        }
      });
    }
  }

  function vibrate(pattern) {
    try {
      if (typeof navigator.vibrate === "function") navigator.vibrate(pattern);
    } catch {}
  }

  return {
    name: platform,
    standalone,
    deviceType,
    layout,
    isPhone,
    isTablet,
    isDesktop: deviceType === "desktop",
    installedPhoneApp,
    phoneAppLayout,
    desktopSiteRequested,
    hasTouch,
    narrowViewport,
    smallestScreenSide,
    preferredTheme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    haptic(type = "light") {
      const patterns = { light: 10, medium: 18, heavy: 28 };
      vibrate(patterns[type] || patterns.light);
    },
    notify(type = "success") {
      const patterns = {
        success: [12, 35, 12],
        warning: [22, 40, 22],
        error: [35, 45, 35]
      };
      vibrate(patterns[type] || patterns.success);
    },
    setBackVisible() {},
    shareUrl() { return false; }
  };
}
