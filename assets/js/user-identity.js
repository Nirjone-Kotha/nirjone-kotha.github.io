import { getFirebaseServices, firebaseConfigured, FIREBASE_PATHS, cleanFirebaseValue } from "./firebase-core.js?v=6.1.0";

const listeners = new Set();
let current = Object.freeze({ status: firebaseConfigured() ? "loading" : "unavailable", user: null, configured: firebaseConfigured() });
let readyPromise = null;

const withDbTimeout = (promise) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error("Database connection timed out. Please check Firebase rules.")), 5000))
]);

function publish(next) {
  current = Object.freeze({ ...current, ...next });
  listeners.forEach(listener => {
    try { listener(current); } catch (error) { console.warn("Identity listener failed", error); }
  });
  window.dispatchEvent(new CustomEvent("mk:identity-change", { detail: current }));
  return current;
}

export function getIdentityState() { return current; }
export function subscribeIdentity(listener) { listeners.add(listener); return () => listeners.delete(listener); }

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
}

async function syntheticEmail(password) {
  const digest = await sha256Hex(`moner-kotha-password-id:v1:${password}`);
  return `mk-${digest.slice(0, 48)}@users.moner-kotha.app`;
}

function friendlyAuthError(error) {
  const code = String(error?.code || "");
  if (code.includes("network-request-failed")) return "Network connection পাওয়া যায়নি। আবার চেষ্টা করুন।";
  if (code.includes("too-many-requests")) return "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।";
  if (code.includes("weak-password")) return "কমপক্ষে ৮ অক্ষরের শক্ত password দিন।";
  if (code.includes("operation-not-allowed")) return "Firebase Console-এ Email/Password sign-in enable করা হয়নি।";
  return error?.message || "Password account চালু করা যায়নি।";
}

export async function initUserIdentity() {
  if (readyPromise) return readyPromise;
  if (!firebaseConfigured()) return publish({ status: "unavailable", configured: false, user: null });

  readyPromise = (async () => {
    const { auth, authSdk } = await getFirebaseServices();
    await authSdk.setPersistence(auth, authSdk.browserLocalPersistence);
    return new Promise(resolve => {
      let resolved = false;
      authSdk.onAuthStateChanged(auth, user => {
        const next = publish({
          status: user ? "authenticated" : "guest",
          configured: true,
          user: user ? { uid: user.uid } : null
        });
        if (!resolved) { resolved = true; resolve(next); }
      }, error => {
        const next = publish({ status: "error", configured: true, user: null, error: friendlyAuthError(error) });
        if (!resolved) { resolved = true; resolve(next); }
      });
    });
  })().catch(error => publish({ status: "error", configured: true, user: null, error: friendlyAuthError(error) }));

  return readyPromise;
}

export async function signInOrCreateWithPassword(rawPassword) {
  const password = String(rawPassword || "");
  if (password.length < 8) throw new Error("কমপক্ষে ৮ অক্ষরের password দিন।");
  if (password.length > 128) throw new Error("Password সর্বোচ্চ ১২৮ অক্ষরের হতে পারে।");
  if (!firebaseConfigured()) throw new Error("Firebase এখনো configure করা হয়নি।");

  const { auth, database, authSdk, databaseSdk } = await getFirebaseServices();
  const email = await syntheticEmail(password);
  let credential;
  let created = false;

  try {
    credential = await authSdk.signInWithEmailAndPassword(auth, email, password);
  } catch (signInError) {
    const code = String(signInError?.code || "");
    const mayCreate = ["auth/invalid-credential", "auth/user-not-found", "auth/invalid-login-credentials"].includes(code);
    if (!mayCreate) throw new Error(friendlyAuthError(signInError));
    try {
      credential = await authSdk.createUserWithEmailAndPassword(auth, email, password);
      created = true;
    } catch (createError) {
      if (String(createError?.code || "") === "auth/email-already-in-use") {
        credential = await authSdk.signInWithEmailAndPassword(auth, email, password);
      } else {
        throw new Error(friendlyAuthError(createError));
      }
    }
  }

  const uid = credential.user.uid;
  const metaRef = databaseSdk.ref(database, `${FIREBASE_PATHS.users}/${uid}/meta`);
  const now = new Date().toISOString();
  try {
    const metaSnap = await withDbTimeout(databaseSdk.get(metaRef));
    await withDbTimeout(databaseSdk.update(metaRef, cleanFirebaseValue({
      identityVersion: 1,
      createdAt: metaSnap.val()?.createdAt || now,
      lastSeenAt: now,
      usesPersonalContact: false
    })));
  } catch (dbError) {
    throw new Error(dbError.message || "Database connection failed.");
  }

  publish({ status: "authenticated", configured: true, user: { uid } });
  return { uid, created };
}

export async function loadUserAppData() {
  const identity = await initUserIdentity();
  if (identity.status !== "authenticated" || !identity.user?.uid) return null;
  const { database, databaseSdk } = await getFirebaseServices();
  try {
    const snapshot = await withDbTimeout(databaseSdk.get(databaseSdk.ref(database, `${FIREBASE_PATHS.users}/${identity.user.uid}/appData`)));
    return snapshot.exists() ? snapshot.val() : null;
  } catch (dbError) {
    console.warn("Failed to load user app data", dbError);
    return null;
  }
}

export async function clearUserAppData() {
  const identity = getIdentityState();
  if (identity.status !== "authenticated" || !identity.user?.uid) return false;
  const { database, databaseSdk } = await getFirebaseServices();
  try {
    await withDbTimeout(databaseSdk.remove(databaseSdk.ref(database, `${FIREBASE_PATHS.users}/${identity.user.uid}/appData`)));
    await withDbTimeout(databaseSdk.update(databaseSdk.ref(database, `${FIREBASE_PATHS.users}/${identity.user.uid}/meta`), { lastSeenAt: new Date().toISOString() }));
  } catch (e) {
    console.warn("Failed to clear app data", e);
  }
  return true;
}

export async function saveUserAppData(data) {
  const identity = getIdentityState();
  if (identity.status !== "authenticated" || !identity.user?.uid) return false;
  const { database, databaseSdk } = await getFirebaseServices();
  const payload = cleanFirebaseValue({ ...data, syncedAt: new Date().toISOString(), schemaVersion: 1 });
  try {
    await withDbTimeout(databaseSdk.set(databaseSdk.ref(database, `${FIREBASE_PATHS.users}/${identity.user.uid}/appData`), payload));
    await withDbTimeout(databaseSdk.update(databaseSdk.ref(database, `${FIREBASE_PATHS.users}/${identity.user.uid}/meta`), { lastSeenAt: new Date().toISOString() }));
  } catch (e) {
    console.warn("Failed to save app data", e);
    throw new Error("Failed to save data. Please check connection and permissions.");
  }
  return true;
}

export async function signOutUserIdentity() {
  const { auth, authSdk } = await getFirebaseServices();
  await authSdk.signOut(auth);
  publish({ status: "guest", configured: true, user: null });
}
