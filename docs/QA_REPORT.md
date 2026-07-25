# V5.3.4 QA Report

## Requested-scope verification

| Test group | Result |
|---|---:|
| V5.3.4 direct-page/mobile-layout checks | 10 / 10 passed |
| Device classification | 7 / 7 passed |
| Static/source/PWA/localized routes | 278 / 278 passed |
| Runtime ES-module startup | Passed |
| Service-worker simulation | Passed |
| HTTP routes/assets/404 | Passed |
| JavaScript syntax | Passed |

## Behaviour verified

- Calm space opens as a full direct page.
- Profile/Edit profile and Profile post management open as direct pages.
- Support circles and individual circle details open as direct pages.
- Contact, Cookie settings and Safety open as direct pages.
- Every direct page contains a visible Back control.
- Returning from Calm space or Support circles restores the previous feed navigation state.
- Normal Android-style phone browser: mobile phone-app layout.
- Phone browser with Desktop site identity: desktop layout.
- Installed phone PWA: mobile phone-app layout.
- Tablet, laptop, desktop website and desktop-installed PWA behaviour remains desktop.

## Preserved regression suites

| Suite | Result |
|---|---:|
| V4.3 | 10 / 10 passed |
| V4.4 advertising | 11 / 11 passed |
| V4.5 | 9 / 9 passed |
| V5.1 | 20 / 20 passed |
| V5.2 | 20 / 20 passed |
| V5.3 | 22 / 22 passed |
| V5.3.2 requested fixes | 11 / 11 passed |
| V5.3.3 phone/media | 18 / 18 passed |
| Startup regression | 8 / 8 passed |
| Accessibility/privacy | 12 / 12 passed |
| Advertising configuration | Passed |
| Contact configuration | Passed |
| Production SEO generation | Passed |

Automated Chromium visual navigation was unavailable in this environment, so no screenshot or Lighthouse pass is claimed. Manual testing on the target phone browser is still recommended.
