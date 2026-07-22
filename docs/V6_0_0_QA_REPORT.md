# Moner Kotha V6.0.0 Admin Panel — QA Report

## Scope

- Secure first-run setup and login
- Session authentication and CSRF-protected write API
- Site/feature settings persistence
- Announcement schedule and public runtime output
- Direct-ad campaign CRUD, targeting and statistics endpoint
- Google/direct/hybrid policy wiring
- Managed-video CRUD and runtime catalogue merge
- Maintenance/contact integration in main PWA and `/bn/`, `/en/` pages
- Protected data/include directories
- Existing static PWA regression coverage

## Final validation results

- PHP syntax: all Admin PHP entry points passed
- JavaScript syntax: Admin, runtime and integrated frontend modules passed
- Admin panel static/security integration: **29 / 29 passed**
- Main static QA: **278 / 278 passed**
- V5.3 feature regression retained in V6: **22 / 22 passed**
- Startup regression: **8 / 8 passed**
- Requested-fix regression: **11 / 11 passed**
- Phone/media regression: **18 / 18 passed**
- Runtime module smoke test: passed
- Advertisement configuration runtime test: passed
- Service-worker runtime test: passed
- Contact and device-detection tests: passed
- Clean public runtime endpoint: passed
- Unauthenticated Admin API blocking: passed

## Clean package state

- No administrator account included
- No demo announcement included
- No demo direct-ad campaign included
- No demo managed video included
- Advertisement master switch OFF
- Provider set to `none`
- Contact fields empty

## Deployment notes

Production hosting requires PHP 8.1+, HTTPS, writable `admin/data/` and `admin/uploads/`, and an explicit Nginx deny rule when Apache `.htaccess` is not used. Preserve those two folders during future source-code updates.
