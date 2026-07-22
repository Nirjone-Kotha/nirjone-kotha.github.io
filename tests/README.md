# Test commands

Run from the project root:

```bash
python3 tests/static_qa.py
python3 tests/v43_regression.py
python3 tests/v44_regression.py
python3 tests/v45_regression.py
python3 tests/seo_generation_test.py
python3 tests/accessibility_privacy_test.py
python3 tests/http_smoke.py
node tests/contact_config_test.mjs
node tests/ads_config_test.mjs
node tests/service_worker_test.mjs
node tests/device_detection_test.mjs
node --check assets/js/app.js
node --check assets/js/ads.js
node --check assets/js/config.js
node --check assets/js/public.js
node --check sw.js
```

Production SEO generation is tested in a temporary project copy with a safe `.example` domain. No placeholder production domain is written to the distributable build.

- `v51_regression.py` — topic/mood separation, story moments, ranking, retention, profile management, notification and branding regression checks.

- `runtime_module_smoke.mjs` — imports and executes the application module against a minimal DOM runtime to catch ESM parse/scope/startup errors.

## V5.3

```bash
python tests/v53_regression.py
```

Covers separated video formats, unavailable-video handling, next-two preparation,
admin bulk import, Islamic translation/engagement, story behavior, Profile post
management and the 80+80 catalogue runtime count.

## V6.0.0 Admin Control Center

```bash
python tests/admin_panel_test.py
python tests/static_qa.py
node tests/runtime_module_smoke.mjs
node tests/ads_config_test.mjs
node tests/service_worker_test.mjs
```

`admin_panel_test.py` verifies clean first-run data, authentication/security wiring, runtime integration, advertisement controls, campaign targeting, protected contexts, audit logging and module inventory.
