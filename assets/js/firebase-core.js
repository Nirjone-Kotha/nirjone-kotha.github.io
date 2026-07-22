import {
  FIREBASE_CONFIG,
  FIREBASE_PATHS,
  FIREBASE_SDK_VERSION,
  isFirebaseConfigReady
} from "../../config/firebase-config.js";

let servicesPromise = null;

export { FIREBASE_PATHS };
export const firebaseConfigured = isFirebaseConfigReady;

export async function getFirebaseServices() {
  if (!isFirebaseConfigReady()) {
    throw new Error("Firebase config is not complete. Open config/firebase-config.js and paste the Web App configuration.");
  }
  if (servicesPromise) return servicesPromise;

  servicesPromise = (async () => {
    const base = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
    const [appSdk, authSdk, databaseSdk] = await Promise.all([
      import(`${base}/firebase-app.js`),
      import(`${base}/firebase-auth.js`),
      import(`${base}/firebase-database.js`)
    ]);

    const app = appSdk.getApps().length ? appSdk.getApp() : appSdk.initializeApp(FIREBASE_CONFIG);
    const auth = authSdk.getAuth(app);
    const database = databaseSdk.getDatabase(app);
    return { app, auth, database, appSdk, authSdk, databaseSdk };
  })().catch(error => {
    servicesPromise = null;
    throw error;
  });

  return servicesPromise;
}

export function cleanFirebaseValue(value) {
  return JSON.parse(JSON.stringify(value, (_key, item) => item === undefined ? null : item));
}
