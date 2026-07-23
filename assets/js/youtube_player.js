import { store } from "./storage.js?v=6.1.0";

let apiPromise = null;
let connectionsPrepared = false;

const VIDEO_VOLUME_KEY = "video-volume";
const VIDEO_SOUND_KEY = "video-sound-enabled";
const DEFAULT_VIDEO_VOLUME = 70;
let sharedVideoVolume = readStoredVolume();
let sharedSoundEnabled = readStoredSound();

function clampVolume(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric)
    ? Math.max(0, Math.min(100, Math.round(numeric)))
    : DEFAULT_VIDEO_VOLUME;
}
function readStoredVolume() {
  return clampVolume(store.getNumber(VIDEO_VOLUME_KEY, DEFAULT_VIDEO_VOLUME));
}
function readStoredSound() {
  return store.get(VIDEO_SOUND_KEY, true) !== false;
}
function saveStoredVolume(value) {
  sharedVideoVolume = clampVolume(value);
  store.set(VIDEO_VOLUME_KEY, sharedVideoVolume);
  return sharedVideoVolume;
}
function saveStoredSound(value) {
  sharedSoundEnabled = Boolean(value);
  store.set(VIDEO_SOUND_KEY, sharedSoundEnabled);
  return sharedSoundEnabled;
}

function prepareYouTubeConnections() {
  if (connectionsPrepared || !globalThis.document) return;
  connectionsPrepared = true;
  [
    "https://www.youtube-nocookie.com",
    "https://www.youtube.com",
    "https://i.ytimg.com",
    "https://googlevideo.com"
  ].forEach(href => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
}

function loadYouTubeApi() {
  if (globalThis.YT?.Player) return Promise.resolve(globalThis.YT);
  if (apiPromise) return apiPromise;
  prepareYouTubeConnections();
  apiPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("YouTube IFrame API timed out")), 12000);
    const previous = globalThis.onYouTubeIframeAPIReady;
    globalThis.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      try { previous?.(); } catch {}
      resolve(globalThis.YT);
    };
    const existing = document.querySelector("script[data-youtube-iframe-api]");
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.dataset.youtubeIframeApi = "true";
    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error("YouTube IFrame API failed to load"));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

const PERMANENT_ERRORS = new Set([2, 100, 101, 150]);
const TEMPORARY_ERRORS = new Set([5, 153]);

export function createYouTubeFeedController({
  root = document,
  onUnavailable = () => {},
  onTemporaryError = () => {},
  onActiveChange = () => {}
} = {}) {
  const players = new Map();
  let observer = null;
  let cards = [];
  let activeCard = null;
  let destroyed = false;
  let volumeMonitor = null;
  let monitoredPlayer = null;
  let ignoreControlChangesUntil = 0;

  prepareYouTubeConnections();

  function playerHost(card) {
    if (!card) return null;
    let host = card.querySelector("[data-youtube-player-host]");
    if (host) return host;
    const wrapper = card.querySelector(".youtube-player-host");
    if (!wrapper) return null;
    wrapper.innerHTML = '<div data-youtube-player-host></div>';
    return wrapper.querySelector("[data-youtube-player-host]");
  }
  function stage(card) { return card?.querySelector(".youtube-stage"); }
  function showPlayer(card, show = true) { stage(card)?.classList.toggle("playing", show); }
  function markLoading(card, value = true) { stage(card)?.classList.toggle("loading", value); }

  function updateSoundButton(card, muted) {
    if (!card) return;
    card.dataset.soundMuted = muted ? "true" : "false";
    const button = card.querySelector("[data-video-sound]");
    if (!button) return;
    const icon = button.querySelector(".video-sound-icon");
    const label = button.querySelector(".video-sound-label");
    const soundOnLabel = button.dataset.soundOnLabel || "Sound on";
    const soundOffLabel = button.dataset.soundOffLabel || "Sound off";
    if (icon) icon.textContent = muted ? "🔇" : "🔊";
    if (label) label.textContent = muted ? soundOnLabel : soundOffLabel;
    button.setAttribute("aria-label", muted ? soundOnLabel : soundOffLabel);
    button.classList.toggle("muted", muted);
  }

  function applySharedVolume(player) {
    try {
      player.setVolume?.(sharedVideoVolume);
      ignoreControlChangesUntil = Date.now() + 800;
    } catch {}
  }

  function applySound(player, enabled = sharedSoundEnabled) {
    try {
      if (enabled) player.unMute?.();
      else player.mute?.();
      ignoreControlChangesUntil = Date.now() + 800;
    } catch {}
  }

  function syncPreparedPlayers(exceptPlayer = null) {
    players.forEach((player, key) => {
      if (player === exceptPlayer) return;
      try {
        player.setVolume?.(sharedVideoVolume);
        applySound(player, sharedSoundEnabled);
        const card = cards.find(item => String(item.dataset.videoId) === key);
        updateSoundButton(card, !sharedSoundEnabled);
      } catch {}
    });
  }

  function startVolumeMonitor(player, card) {
    if (monitoredPlayer === player && volumeMonitor) return;
    clearInterval(volumeMonitor);
    monitoredPlayer = player;
    volumeMonitor = setInterval(() => {
      if (destroyed || !monitoredPlayer || Date.now() < ignoreControlChangesUntil) return;
      try {
        const currentVolume = clampVolume(monitoredPlayer.getVolume?.());
        const currentMuted = Boolean(monitoredPlayer.isMuted?.());
        let changed = false;
        if (Math.abs(currentVolume - sharedVideoVolume) >= 1) {
          saveStoredVolume(currentVolume);
          changed = true;
        }
        if (currentMuted === sharedSoundEnabled) {
          saveStoredSound(!currentMuted);
          changed = true;
        }
        updateSoundButton(card, currentMuted);
        if (changed) syncPreparedPlayers(monitoredPlayer);
      } catch {}
    }, 450);
  }

  function fallbackToMutedAutoplay(card, player) {
    try {
      player.mute?.();
      player.setVolume?.(sharedVideoVolume);
      player.playVideo?.();
      showPlayer(card, true);
      updateSoundButton(card, true);
      card.dataset.autoplayBlocked = "true";
    } catch {
      showPlayer(card, false);
    }
  }

  async function ensurePlayer(card, { autoplay = false, muted = !sharedSoundEnabled, userInitiated = false } = {}) {
    if (!card || destroyed) return null;
    const key = String(card.dataset.videoId || "");
    if (players.has(key)) {
      const player = players.get(key);
      applySharedVolume(player);
      if (autoplay) startPlayer(card, player, { muted, userInitiated });
      return player;
    }
    const host = playerHost(card);
    const videoId = card.dataset.youtubeId;
    if (!host || !videoId) return null;
    markLoading(card, true);
    card.dataset.requestMuted = muted ? "true" : "false";
    try {
      const YT = await loadYouTubeApi();
      if (destroyed || !card.isConnected) return null;
      let player;
      player = new YT.Player(host, {
        host: "https://www.youtube-nocookie.com",
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 0,
          controls: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
          origin: location.origin,
          vq: "medium"
        },
        events: {
          onReady: event => {
            markLoading(card, false);
            card.dataset.playerReady = "true";
            // Prefer 480p for faster loading
            try { event.target.setPlaybackQualityRange?.("small","medium"); } catch {}
            try { event.target.setPlaybackQuality?.("medium"); } catch {}
            applySharedVolume(event.target);
            updateSoundButton(card, !sharedSoundEnabled);
            if (autoplay) startPlayer(card, event.target, { muted, userInitiated });
          },
          onStateChange: event => {
            if (event.data === YT.PlayerState.PLAYING) {
              showPlayer(card, true);
              card.dataset.playerPlaying = "true";
              const isMuted = Boolean(event.target.isMuted?.());
              updateSoundButton(card, isMuted);
              startVolumeMonitor(event.target, card);
            } else if (event.data === YT.PlayerState.PAUSED) {
              card.dataset.playerPlaying = "false";
            } else if (event.data === YT.PlayerState.ENDED) {
              card.dataset.playerPlaying = "false";
              showPlayer(card, false);
              // Auto-advance to next video if NOT in fullscreen mode
              if (!document.body.classList.contains("video-large-view")) {
                const nextCard = card.nextElementSibling;
                if (nextCard && nextCard.classList.contains("video-card")) {
                  nextCard.scrollIntoView({ behavior: "smooth", block: "center" });
                  const playBtn = nextCard.querySelector("[data-video-play]");
                  if (playBtn) {
                    playBtn.click();
                  } else {
                    const nextId = nextCard.dataset.videoId;
                    if (nextId) play(nextCard, { muted: !sharedSoundEnabled, userInitiated: true });
                  }
                }
              }
            }
          },
          onError: event => {
            const code = Number(event.data);
            markLoading(card, false);
            if (PERMANENT_ERRORS.has(code)) {
              players.delete(key);
              try { event.target.destroy(); } catch {}
              onUnavailable({ card, itemId: key, youtubeId: videoId, errorCode: code });
            } else if (TEMPORARY_ERRORS.has(code)) {
              onTemporaryError({ card, itemId: key, youtubeId: videoId, errorCode: code });
            }
          },
          onAutoplayBlocked: event => {
            fallbackToMutedAutoplay(card, event?.target || player);
          }
        }
      });
      players.set(key, player);
      return player;
    } catch (error) {
      markLoading(card, false);
      onTemporaryError({ card, itemId: key, youtubeId: videoId, errorCode: "api-load", error });
      return null;
    }
  }

  function pauseOthers(exceptKey = "") {
    players.forEach((player, key) => {
      if (key === exceptKey) return;
      try { player.pauseVideo?.(); } catch {}
      const card = cards.find(item => String(item.dataset.videoId) === key);
      if (card) card.dataset.playerPlaying = "false";
    });
  }

  function startPlayer(card, player, { muted = !sharedSoundEnabled, userInitiated = false } = {}) {
    if (!card || !player) return;
    const key = String(card.dataset.videoId || "");
    pauseOthers(key);
    try {
      applySharedVolume(player);
      if (userInitiated && !muted) saveStoredSound(true);
      const shouldMute = muted || !sharedSoundEnabled;
      if (shouldMute) player.mute?.();
      else player.unMute?.();
      updateSoundButton(card, shouldMute);
      player.playVideo?.();
      showPlayer(card, true);
      activeCard = card;
      startVolumeMonitor(player, card);
      onActiveChange({
        card,
        itemId: key,
        youtubeId: card.dataset.youtubeId,
        volume: sharedVideoVolume,
        muted: shouldMute
      });
      warmNextTwo(card);
    } catch {}
  }

  async function play(card, { muted = !sharedSoundEnabled, userInitiated = false } = {}) {
    const player = await ensurePlayer(card, { autoplay: true, muted, userInitiated });
    if (player && card.dataset.playerReady === "true") {
      startPlayer(card, player, { muted, userInitiated });
    }
  }

  async function toggleSound(card) {
    if (!card) return;
    const key = String(card.dataset.videoId || "");
    const player = players.get(key) || await ensurePlayer(card, { autoplay: false });
    if (!player) return;
    let currentlyMuted = true;
    try { currentlyMuted = Boolean(player.isMuted?.()); } catch {}
    const enable = currentlyMuted;
    saveStoredSound(enable);
    applySharedVolume(player);
    applySound(player, enable);
    updateSoundButton(card, !enable);
    syncPreparedPlayers(player);
    if (enable) {
      try { player.playVideo?.(); } catch {}
      showPlayer(card, true);
      activeCard = card;
      warmNextTwo(card);
    }
  }

  function schedulePreparation(task) {
    if (typeof requestIdleCallback === "function") requestIdleCallback(task, { timeout: 700 });
    else setTimeout(task, 180);
  }

  function warmNextTwo(card) {
    const index = cards.indexOf(card);
    if (index < 0) return;
    const keep = new Set([String(card.dataset.videoId)]);
    cards.slice(index + 1, index + 3).forEach(next => {
      keep.add(String(next.dataset.videoId));
      next.classList.add("video-prepared");
      schedulePreparation(() => {
        ensurePlayer(next, { autoplay: false, muted: !sharedSoundEnabled }).then(player => {
          if (player) {
            applySharedVolume(player);
            applySound(player, sharedSoundEnabled);
          }
        });
      });
    });
    players.forEach((player, key) => {
      if (keep.has(key)) return;
      const oldCard = cards.find(item => String(item.dataset.videoId) === key);
      if (oldCard === activeCard) return;
      try { player.destroy?.(); } catch {}
      players.delete(key);
      oldCard?.classList.remove("video-prepared");
      if (oldCard) {
        const wrapper = oldCard.querySelector(".youtube-player-host");
        if (wrapper) wrapper.innerHTML = '<div data-youtube-player-host></div>';
        oldCard.dataset.playerReady = "false";
        oldCard.dataset.playerPlaying = "false";
        showPlayer(oldCard, false);
      }
    });
  }

  function observe() {
    cards = [...root.querySelectorAll(".video-card")];
    cards.forEach(card => updateSoundButton(card, !sharedSoundEnabled));
    if (!cards.length || !("IntersectionObserver" in globalThis)) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && entry.target.dataset.playerPlaying === "true") {
          const videoId = entry.target.dataset.videoId;
          const player = players.get(videoId);
          try { player?.pauseVideo?.(); } catch {}
          entry.target.dataset.playerPlaying = "false";
        }
      });
    }, { root: null, threshold: [0.1, 0.5] });
    cards.forEach(card => observer.observe(card));
  }

  function destroy() {
    destroyed = true;
    clearInterval(volumeMonitor);
    volumeMonitor = null;
    monitoredPlayer = null;
    observer?.disconnect();
    players.forEach(player => { try { player.destroy?.(); } catch {} });
    players.clear();
    cards = [];
    activeCard = null;
  }

  observe();
  return {
    play,
    toggleSound,
    warmNextTwo,
    destroy,
    players,
    getVolume: () => sharedVideoVolume,
    isSoundEnabled: () => sharedSoundEnabled
  };
}

export const youtubePlayerErrors = {
  permanent: [...PERMANENT_ERRORS],
  temporary: [...TEMPORARY_ERRORS]
};
