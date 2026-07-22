import { getFirebaseServices, firebaseConfigured, FIREBASE_PATHS } from "../../assets/js/firebase-core.js?v=6.1.0";

const form = document.querySelector("#adminLoginForm");
const errorNode = document.querySelector("#loginError");
const setupNotice = document.querySelector("#firebaseSetupNotice");
const button = document.querySelector("#loginButton");

function showError(message) {
  errorNode.textContent = message;
  errorNode.hidden = false;
}

if (!firebaseConfigured()) {
  setupNotice.hidden = false;
  form.querySelectorAll("input,button").forEach(node => { node.disabled = true; });
} else {
  getFirebaseServices().then(({ auth, authSdk }) => {
    authSdk.onAuthStateChanged(auth, async user => {
      if (!user) return;
      const { database, databaseSdk } = await getFirebaseServices();
      const snapshot = await databaseSdk.get(databaseSdk.ref(database, `${FIREBASE_PATHS.adminUsers}/${user.uid}`));
      if (snapshot.val()?.enabled === true) location.replace("index.html");
    });
  }).catch(error => showError(error.message));
}

form.addEventListener("submit", async event => {
  event.preventDefault(); errorNode.hidden = true; button.disabled = true; button.textContent = "Signing in…";
  const data = new FormData(form);
  try {
    const { auth, database, authSdk, databaseSdk } = await getFirebaseServices();
    await authSdk.setPersistence(auth, authSdk.browserLocalPersistence);
    const result = await authSdk.signInWithEmailAndPassword(auth, String(data.get("email") || "").trim(), String(data.get("password") || ""));
    const snapshot = await databaseSdk.get(databaseSdk.ref(database, `${FIREBASE_PATHS.adminUsers}/${result.user.uid}`));
    if (snapshot.val()?.enabled !== true) {
      await authSdk.signOut(auth);
      throw new Error("এই account-টি administrator হিসেবে অনুমোদিত নয়।");
    }
    location.replace("index.html");
  } catch (error) {
    const code = String(error?.code || "");
    const message = code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")
      ? "Email অথবা password সঠিক নয়।"
      : code.includes("too-many-requests") ? "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।" : error.message;
    showError(message);
  } finally {
    button.disabled = false; button.textContent = "Sign in securely";
  }
});
