# Moner Kotha — Website + PWA V6.1.0

এই build-এ আগের website/PWA feature flow অক্ষুণ্ণ রেখে দুটি architecture পরিবর্তন করা হয়েছে:

1. Admin panel এখন সম্পূর্ণ static JavaScript এবং সরাসরি Firebase Authentication + Firebase Realtime Database ব্যবহার করে। কোনো PHP endpoint বা PHP session নেই।
2. Visitor চাইলে শুধু একটি unique password দিয়ে private cloud profile তৈরি/ফিরিয়ে আনতে পারে। Phone number বা বাস্তব email নেওয়া হয় না। Skip করলে Guest mode-এ আগের local-first আচরণ থাকে।

## Admin Control Center

Admin URL:

```text
https://your-domain.com/admin/login.html
```

Admin capabilities:

- Site branding, contact, default language ও maintenance mode
- Feature on/off এবং safe selector rules
- Bilingual scheduled announcements
- Google/Direct/Hybrid advertisement control
- Direct campaign targeting, image optimization, frequency cap ও basic impression/click count
- Managed YouTube video import
- Firebase audit log ও administrator password change

## Firebase setup required

এই ZIP-এ security-sensitive Firebase project credentials বা administrator account রাখা হয়নি। Deploy করার আগে:

1. `config/firebase-config.js`-এ Firebase Web App config paste করুন।
2. Firebase Authentication-এ **Email/Password** provider enable করুন।
3. Realtime Database তৈরি করুন এবং `firebase-database.rules.json` deploy করুন।
4. Firebase Authentication-এ admin email/password account তৈরি করুন।
5. Admin account-এর UID দিয়ে Realtime Database-এ লিখুন:

```json
{
  "adminUsers": {
    "ADMIN_FIREBASE_UID": {
      "enabled": true,
      "name": "Administrator"
    }
  }
}
```

তারপর `/admin/login.html` থেকে sign in করুন। প্রথম authorized admin login-এর সময় default runtime settings Firebase-এ initialize হবে। পূর্ণ নির্দেশনা:

- [`docs/ADMIN_PANEL_GUIDE.md`](docs/ADMIN_PANEL_GUIDE.md)

## Password-only visitor profile

- User কোনো phone number বা বাস্তব email দেয় না।
- Password থেকে browser-এ deterministic private identifier তৈরি হয়; Firebase Authentication-এ pseudonymous account ব্যবহৃত হয়।
- একই password জানে এমন ব্যক্তি একই profile access করতে পারে, তাই শক্তিশালী ও unique password জরুরি।
- Password recovery নেই; password ভুলে গেলে account ফিরিয়ে আনা যাবে না।
- Guest mode-এ post, comment, story, saved items ও profile browser storage-এ স্বাভাবিকভাবে কাজ করে; অন্য device-এ বা browser data মুছে গেলে restore হবে না।
- Signed-in password profile user-owned Firebase path-এ app data sync করে।

## Hosting

Static hosting, Firebase Hosting, cPanel static hosting, Netlify বা সমমানের HTTPS hosting ব্যবহার করা যায়। PHP প্রয়োজন নেই। `file://` দিয়ে চালাবেন না; ES modules, service worker এবং Firebase-এর জন্য localhost বা HTTPS দরকার।

Local preview:

```powershell
py -m http.server 5500 --bind 0.0.0.0
```

Open:

```text
http://localhost:5500/
http://localhost:5500/admin/login.html
```

## Key files

- `assets/js/app.js` — existing app flow + password-profile integration
- `assets/js/user-identity.js` — password-only Firebase user identity
- `assets/js/firebase-core.js` — shared Firebase SDK loader
- `config/firebase-config.js` — deployment-specific Firebase Web App config
- `admin/index.html` — static admin panel
- `admin/assets/admin-firebase.js` — complete admin database/auth adapter
- `admin/public/runtime-client.js` — public realtime settings listener
- `firebase-database.rules.json` — Realtime Database access rules
- `sw.js` — V6.1.0 PWA cache/update handling

## Tests

```powershell
python tests/static_qa.py
python tests/admin_panel_test.py
python tests/http_smoke.py
node tests/runtime_module_smoke.mjs
node tests/service_worker_test.mjs
```
