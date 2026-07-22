from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
checks = []

def check(name, value):
    ok = bool(value)
    checks.append((name, ok))
    print(('PASS' if ok else 'FAIL'), '-', name)

required = [
    'admin/index.html', 'admin/login.html', 'admin/assets/admin.js',
    'admin/assets/admin-login.js', 'admin/assets/admin-firebase.js',
    'admin/assets/admin.css', 'admin/public/runtime-client.js',
    'assets/js/firebase-core.js', 'assets/js/user-identity.js',
    'config/firebase-config.js', 'config/firebase-defaults.js',
    'firebase-database.rules.json', 'docs/ADMIN_PANEL_GUIDE.md'
]
check('all Firebase admin files supplied', all((ROOT / f).is_file() for f in required))
check('all PHP files removed', not list(ROOT.rglob('*.php')))

firebase_config = (ROOT/'config/firebase-config.js').read_text(encoding='utf-8')
firebase_core = (ROOT/'assets/js/firebase-core.js').read_text(encoding='utf-8')
identity = (ROOT/'assets/js/user-identity.js').read_text(encoding='utf-8')
app = (ROOT/'assets/js/app.js').read_text(encoding='utf-8')
runtime = (ROOT/'admin/public/runtime-client.js').read_text(encoding='utf-8')
admin_adapter = (ROOT/'admin/assets/admin-firebase.js').read_text(encoding='utf-8')
admin_js = (ROOT/'admin/assets/admin.js').read_text(encoding='utf-8')
admin_login = (ROOT/'admin/assets/admin-login.js').read_text(encoding='utf-8')
rules = json.loads((ROOT/'firebase-database.rules.json').read_text(encoding='utf-8'))
sw = (ROOT/'sw.js').read_text(encoding='utf-8')
readme = (ROOT/'README.md').read_text(encoding='utf-8')
guide = (ROOT/'docs/ADMIN_PANEL_GUIDE.md').read_text(encoding='utf-8')

check('Firebase config is deployment placeholder, not leaked credentials', 'PASTE_FIREBASE_API_KEY' in firebase_config and 'isFirebaseConfigReady' in firebase_config)
check('Firebase SDK is loaded as modular JavaScript', 'firebase-app.js' in firebase_core and 'firebase-auth.js' in firebase_core and 'firebase-database.js' in firebase_core)
check('admin authorization checks Firebase UID record', 'adminUsers' in admin_adapter and 'enabled !== true' in admin_adapter)
check('admin login uses Firebase Authentication', 'signInWithEmailAndPassword' in admin_login and 'browserLocalPersistence' in admin_login)
check('admin CRUD writes directly to Realtime Database', all(token in admin_adapter for token in ('sdk.set', 'sdk.update', 'sdk.remove')))
check('admin settings, announcement, campaign and video actions exist', all(token in admin_adapter for token in ('settings.save', 'announcement', 'campaign', 'video.bulk')))
check('browser-side campaign image optimization supplied', 'compressAdminImage' in admin_adapter and 'toDataURL("image/webp"' in admin_adapter)
check('runtime uses Realtime Database listener', 'onValue' in runtime and 'FIREBASE_PATHS.runtime' in runtime)
check('runtime has bundled fallback defaults', 'DEFAULT_RUNTIME' in runtime and 'built-in defaults' in runtime.lower())
check('main app and public pages use Firebase runtime client', '../../admin/public/runtime-client.js?v=6.1.0' in app and '../../admin/public/runtime-client.js?v=6.1.0' in (ROOT/'assets/js/public.js').read_text(encoding='utf-8'))

check('password-only identity derives pseudonymous login', 'sha256Hex' in identity and '@users.moner-kotha.app' in identity)
check('visitor does not enter real email or phone', 'signInOrCreateWithPassword' in identity and 'usesPersonalContact: false' in identity)
check('password account creates or restores Firebase Auth user', 'createUserWithEmailAndPassword' in identity and 'signInWithEmailAndPassword' in identity)
check('visitor data is scoped under own UID', 'FIREBASE_PATHS.users' in identity and '/appData' in identity)
check('guest skip and restore warning are present', 'identity-skip' in app and 'browser data মুছে গেলে' in app and 'recovery নেই' in app)
check('identity integrates without replacing existing user content logic', all(token in app for token in ('userPosts', 'userComments', 'moments', 'saveState()', 'renderFeed()')))

root_rules = rules['rules']
check('runtime is public-read admin-write', root_rules['runtime']['.read'] is True and 'adminUsers' in root_rules['runtime']['.write'])
check('visitor can access only own user path', 'auth.uid === $uid' in root_rules['users']['$uid']['.read'] and 'auth.uid === $uid' in root_rules['users']['$uid']['.write'])
check('admin user records are client write-protected', root_rules['adminUsers']['$uid']['.write'] is False)
check('ad counters only accept one-step increments', 'data.val() + 1' in root_rules['adStats']['$campaignId']['$event']['.validate'])

check('service worker version bumped and Firebase modules cached', 'const VERSION = "6.1.0"' in sw and 'firebase-core.js?v=6.1.0' in sw and 'user-identity.js?v=6.1.0' in sw)
check('admin UI keeps detailed controls', all(token in admin_js for token in ('Advertisement master switch','Ad provider mode','New direct ad','Google AdSense configuration','featureRules')))
check('documentation contains deployment and recovery warnings', 'admin/login.html' in readme and 'firebase-database.rules.json' in guide and 'recovery' in guide.lower())
check('project version is 6.1.0', (ROOT/'VERSION.txt').read_text(encoding='utf-8').strip() == '6.1.0')
check('no stale internal PHP endpoint reference', not re.search(r'admin/(?:api|login|setup|upload|logout|index)\.php|admin/public/(?:runtime|track)\.php', '\n'.join([readme, guide, app, runtime, admin_js, admin_adapter])))

failed = [name for name, ok in checks if not ok]
print(f"{len(checks)-len(failed)}/{len(checks)} Firebase admin checks passed")
raise SystemExit(1 if failed else 0)
