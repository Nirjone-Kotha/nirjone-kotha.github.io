# Moner Kotha V6.1.0 — Firebase Admin ও Password Profile Guide

এই version-এ Admin Control Center সম্পূর্ণ JavaScript-ভিত্তিক। Admin UI সরাসরি Firebase Authentication দিয়ে access যাচাই করে এবং Firebase Realtime Database-এর `runtime` data update করে। কোনো PHP file, PHP session, server JSON write বা upload endpoint নেই।

## 1. Architecture

### Public website

`admin/public/runtime-client.js` Realtime Database-এর `/runtime` path শুনে site settings, announcements, advertisements ও managed videos live apply করে। Firebase unavailable বা configuration অসম্পূর্ণ হলে bundled safe defaults ব্যবহার করে, ফলে মূল site ভেঙে যায় না।

### Visitor identity

`assets/js/user-identity.js` user-এর দেওয়া password থেকে একটি deterministic pseudonymous Firebase login তৈরি করে। বাস্তব phone number বা email চাওয়া হয় না। User data শুধু তার Firebase UID-এর `/users/{uid}` path-এ থাকে।

### Administrator identity

Admin-এর জন্য Firebase Authentication-এ বাস্তব admin email/password account ব্যবহৃত হয়। শুধু `/adminUsers/{uid}/enabled = true` থাকা account admin panel খুলতে পারে। Visitor password account কখনো admin access পায় না।

## 2. Firebase project তৈরি

1. Firebase Console-এ project তৈরি করুন।
2. Project Settings → Your apps → Web app তৈরি করুন।
3. Web app configuration copy করে `config/firebase-config.js`-এ placeholder value-এর জায়গায় paste করুন।
4. Authentication → Sign-in method-এ **Email/Password** enable করুন।
5. Realtime Database তৈরি করুন। Project location অনুযায়ী Firebase যে `databaseURL` দেয় সেটিই config-এ ব্যবহার করুন।
6. `firebase-database.rules.json`-এর rules publish/deploy করুন। Production-এ Test Mode রেখে দেবেন না।

উদাহরণ config shape:

```js
export const FIREBASE_CONFIG = Object.freeze({
  apiKey: "...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "your-project",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
});
```

Firebase Web config browser code-এ থাকা স্বাভাবিক; আসল protection `firebase-database.rules.json`, authorized admin UID এবং Firebase project settings থেকে আসে।

## 3. প্রথম administrator তৈরি

1. Firebase Console → Authentication → Users → Add user.
2. Admin email ও শক্তিশালী password দিন।
3. তৈরি account-এর UID copy করুন।
4. Realtime Database Data tab-এ নিচের record যোগ করুন:

```json
{
  "adminUsers": {
    "PASTE_ADMIN_UID": {
      "enabled": true,
      "name": "Administrator"
    }
  }
}
```

5. Hosting-এর পরে খুলুন:

```text
https://your-domain.com/admin/login.html
```

Authorized login-এর পর `admin/index.html` খুলবে। `/runtime/settings` না থাকলে admin adapter bundled defaults দিয়ে প্রথম runtime তৈরি করবে।

## 4. Realtime Database structure

```text
/runtime
  /settings
  /announcements
  /campaigns
  /videos
/adminUsers/{adminUid}
/adminAudit/{logId}
/adStats/{campaignId}/impressions
/adStats/{campaignId}/clicks
/users/{visitorUid}/meta
/users/{visitorUid}/appData
```

Access model:

- `/runtime`: public read, authorized admin write
- `/adminUsers/{uid}`: শুধু একই signed-in account নিজের authorization record read করতে পারে; client write বন্ধ
- `/adminAudit`: শুধু authorized admin read/write
- `/users/{uid}`: শুধু সেই signed-in visitor read/write
- `/adStats`: public client শুধু counter এক ধাপ increment করতে পারে; admin read করতে পারে

## 5. Password-only user flow

Onboarding শেষে visitor একটি smart choice পায়:

- **Password দিয়ে চালিয়ে যান:** একই password দিয়ে পরে sign in করলে private profile ও synced activity ফিরে আসে।
- **Skip:** site Guest হিসেবে স্বাভাবিকভাবে কাজ করে, কিন্তু data শুধু বর্তমান browser-এ থাকে।

User-facing message স্পষ্ট করে:

- phone number বা বাস্তব email নেওয়া হচ্ছে না;
- password-টিই private ID/access key;
- password মনে রাখতে হবে;
- recovery নেই;
- অন্য service-এর password reuse করা যাবে না;
- একই password অন্য কেউ জানলে একই profile খুলতে পারবে।

Minimum password length 8 এবং maximum 128 characters। Production launch-এর আগে users-কে দীর্ঘ, unique passphrase ব্যবহার করতে উৎসাহিত করুন।

Synced fields-এর মধ্যে profile alias/name, posts, comments, stories, reactions, saved/following/joined state, check-ins, likes ও কিছু personal app preference আছে। Guest behavior আগের local-storage নিয়মেই থাকে।

## 6. Site Control

Site Control থেকে:

- Site name ও bilingual tagline
- Default language
- Support email, WhatsApp, Facebook URL
- Maintenance mode ও bilingual maintenance message

Save করলে `/runtime/settings` update হয় এবং connected public clients realtime update পায়।

## 7. Feature Manager

Built-in feature switch দিয়ে posting, stories, comments, search, support circles, saved content, calm room, Islamic content, general video, profile, notifications ও contact on/off করা যায়।

Advanced selector rules দিয়ে stable CSS selector-এর element `hide`, `disable` বা class-based control করা যায়। Panel অজানা নতুন business logic নিজে থেকে অনুমান করে না; নতুন complex feature যোগ করলে selector rule বা code-level registration প্রয়োজন।

## 8. Announcement Broadcast

Announcement display mode:

- Top bar
- Feed card
- Modal

প্রতিটি announcement-এ বাংলা/English title ও message, priority, enabled state, start/end schedule এবং dismiss behavior রাখা যায়। Runtime client schedule অনুযায়ী active announcement দেখায়।

## 9. Advertisement Manager

### Global control

- Advertisement master switch
- Provider: None / Google / Direct / Hybrid
- Placement-level control
- Session impression cap
- Minimum time gap
- Consent-aware Google Ads behavior
- Protected/sensitive context exclusion

### Direct campaign

Campaign-এ title, image, target URL, CTA, locale, device, placements, weight, enabled state এবং schedule রাখা যায়। Image browser-এই optimize হয়ে WebP/Data URL হিসেবে campaign data-এর সঙ্গে Realtime Database-এ save হয়; আলাদা PHP upload folder লাগে না। খুব বড় image automatic reject হবে।

`adStats` lightweight first-party impression/click count। এটি billing, fraud detection বা financial reporting system নয়।

## 10. Video Manager

একটি বা একাধিক YouTube URL/ID import করা যায়। Admin section, content type, moods, featured ও enabled state control করতে পারে। Public video catalogue-এর সঙ্গে Firebase-managed records merge হয়।

## 11. Audit ও password change

Admin action `/adminAudit`-এ timestamp, action, summary ও administrator identity সহ save হয়। System & Guide page থেকে admin password পরিবর্তনে Firebase reauthentication লাগে।

## 12. Deployment checklist

- `config/firebase-config.js`-এ আসল config বসানো
- Email/Password provider enabled
- Realtime Database তৈরি
- `firebase-database.rules.json` publish/deploy
- Admin Authentication user তৈরি
- `/adminUsers/{uid}/enabled` true করা
- HTTPS hosting
- Custom CSP ব্যবহার করলে `www.gstatic.com`, Firebase Auth API এবং Realtime Database HTTPS/WSS origin allow করা
- `/admin/login.html` login test
- Normal user password create/restore test
- Guest skip test
- Announcement, feature switch ও advertisement master OFF/ON test
- PWA service worker update/refresh test

## 13. Project update safety

নতুন code version upload করলে Firebase Database data overwrite হয় না। `config/firebase-config.js` preserve করুন। Database rules পরিবর্তিত হলে আবার deploy করুন। Service worker version bump করা আছে; live deployment-এর পরে একবার hard refresh বা installed PWA reopen করলে নতুন shell load হবে।

## 14. Important limitations

- Password-only model-এ recovery email/phone নেই; forgotten password recover করা যাবে না।
- Common password ব্যবহার করলে অন্য user একই password দিয়ে একই profile পেতে পারে; unique passphrase বাধ্যতামূলকভাবে বুঝিয়ে দিন।
- Firebase connection ছাড়া cloud profile/admin save কাজ করবে না, তবে public app bundled defaults ও Guest local mode-এ চলবে।
- Client-only admin architecture-এর security সম্পূর্ণভাবে Firebase Authentication এবং strict Database Rules-এর উপর নির্ভর করে। Rules relax করবেন না।
