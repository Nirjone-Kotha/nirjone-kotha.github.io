from pathlib import Path
import re, sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8'); app=(ROOT/'assets/js/app.js').read_text(encoding='utf-8'); analytics=(ROOT/'assets/js/analytics.js').read_text(encoding='utf-8'); public=(ROOT/'assets/css/public.css').read_text(encoding='utf-8'); css=(ROOT/'assets/css/styles.css').read_text(encoding='utf-8')
checks={
 'viewport allows zoom':'maximum-scale=1' not in html and 'user-scalable=no' not in html,
 'main landmark':'<main class="feed-column"' in html,
 'real public links':'data-app-public' in html and '<a class="nav-item public-nav-link"' in html,
 'modal focus trap':'FOCUSABLE_SELECTOR' in app and 'e.key==="Tab"' in app,
 'escape close':'e.key==="Escape"' in app,
 'aria live feed':'aria-live="polite"' in html,
 'visible focus app':':focus-visible' in css,
 'visible focus public':':focus-visible' in public,
 'reduced motion':'prefers-reduced-motion' in css and 'prefers-reduced-motion' in public,
 'sensitive analytics keys':all(k in analytics for k in ['mood','post','comment','search','safety','profile']),
 'analytics consent required':'hasConsent("analytics")' in analytics,
 'no emotional pixel':not re.search(r'facebook\.com/tr|connect\.facebook\.net|googletagmanager\.com',html+app,re.I)
}
for n,o in checks.items():print(('PASS' if o else 'FAIL'),'-',n)
if not all(checks.values()):sys.exit(1)
