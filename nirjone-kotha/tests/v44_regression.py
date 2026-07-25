from pathlib import Path
import re,sys
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'assets/js/app.js').read_text(encoding='utf-8'); ads=(ROOT/'assets/js/ads.js').read_text(encoding='utf-8'); html=(ROOT/'index.html').read_text(encoding='utf-8'); sw=(ROOT/'sw.js').read_text(encoding='utf-8')
checks=[]
def ck(n,v):checks.append((n,bool(v)))
ck('Bangla group terminology','"circles": "গ্রুপ"' in app and '"activeCircles": "সক্রিয় গ্রুপ"' in app)
ck('ads master off','masterEnabled: false' in ads)
ck('placements off',all(f'[AD_PLACEMENTS.{x}]: false' in ads for x in ['FEED_IN_FEED','DESKTOP_RIGHT_RAIL','RESOURCE_IN_ARTICLE','RESOURCE_MULTIPLEX','MOBILE_ANCHOR','DESKTOP_ANCHOR','VIGNETTE','SIDE_RAIL_AUTO']))
ck('admin APIs','setPlacementEnabled' in ads and 'setSlotEnabled' in ads)
ck('feed schedule','position === 10' in ads and '(position - 10) % 8 === 0' in ads)
ck('stable feed reconciliation','existingByKey' in app and 'node.dataset.feedKey' in app)
ck('right rail mount','id="desktopAdSlotMount"' in html)
ck('high risk suppression','setAdSafeMode(hasHighRiskPost,"high-risk-feed")' in app)
ck('modal uses transient safe reason','setAdSafeMode(true, "modal")' in app and 'PERMANENT_REMOVAL_REASONS' in ads)
ck('no provider script',not re.search(r'<script[^>]+(?:adsbygoogle|doubleclick|googlesyndication)',html,re.I))
ck('cache version 4.4+',tuple(map(int,re.search(r'const VERSION = "(\d+)\.(\d+)\.(\d+)"',sw).groups())) >= (4,4,0))
for n,o in checks:print(('PASS' if o else 'FAIL'),'-',n)
print(f'\n{sum(o for _,o in checks)}/{len(checks)} checks passed')
if not all(o for _,o in checks):sys.exit(1)
