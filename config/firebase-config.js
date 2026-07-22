/**
 * Nirjone Kotha Firebase configuration.
 * Firebase Console > Project settings > Your apps > Web 
 */
export const FIREBASE_CONFIG = Object.freeze({
  apiKey: "AIzaSyBKcvLC3ZhZVQ4HWAQ9LxKhPLzWFG4dslI",
  authDomain: "nirjone-kotha.firebaseapp.com",
  databaseURL: "https://nirjone-kotha-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nirjone-kotha",
  storageBucket: "nirjone-kotha.firebasestorage.app",
  messagingSenderId: "628049723897",
  appId: "1:628049723897:web:f1f1bb9c0d3afd5209bd28"
});

// Fixed CDN version keeps this static project reproducible without npm/build tools.
export const FIREBASE_SDK_VERSION = "12.11.0";

export const FIREBASE_PATHS = Object.freeze({
  runtime: "runtime",
  adminUsers: "adminUsers",
  adminAudit: "adminAudit",
  adStats: "adStats",
  users: "users"
});

export function isFirebaseConfigReady() {
  const required = ["apiKey", "authDomain", "databaseURL", "projectId", "appId"];
  return required.every(key => {
    const value = String(FIREBASE_CONFIG[key] || "").trim();
    return value && !value.includes("PASTE_");
  });
}