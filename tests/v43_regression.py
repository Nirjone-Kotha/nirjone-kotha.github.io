from pathlib import Path
import json, re, sys, struct
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8'); app=(ROOT/'assets/js/app.js').read_text(encoding='utf-8'); css=(ROOT/'assets/css/styles.css').read_text(encoding='utf-8'); sw=(ROOT/'sw.js').read_text(encoding='utf-8'); manifest=json.loads((ROOT/'manifest.webmanifest').read_text())
checks=[]
def ck(n,v): checks.append((n,bool(v)))
ck('explicit composer label','data-t="createPost"' in html and 'data-t="writePost"' in html)
ck('mobile composer text visible','composer-open span:last-child' in css)
ck('mood title and hint','mood-select-copy' in html and 'moodButtonHint' in html)
ck('preferred mood persists','preferred-mood' in app and 'matching=list.filter' in app)
ck('profile share centre','share-site' in app and 'download-share-card' in app)
ck('no temporary ngrok hardcode','ngrok-free.dev' not in html)
ck('brand logo integrated','assets/brand/logo-mark.png' in html)
ck('PWA icons integrated',all((ROOT/i['src'].lstrip('./')).exists() for i in manifest['icons']))
ck('PWA cache version 4.3+',tuple(map(int,re.search(r'const VERSION = "(\d+)\.(\d+)\.(\d+)"',sw).groups())) >= (4,3,0))
ck('sample content stays Bangla','return obj?.bn ?? obj?.en' in app)
for n,o in checks: print(('PASS' if o else 'FAIL'),'-',n)
print(f'\n{sum(o for _,o in checks)}/{len(checks)} checks passed')
if not all(o for _,o in checks):sys.exit(1)
