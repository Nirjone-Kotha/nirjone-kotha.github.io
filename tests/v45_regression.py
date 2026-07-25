from pathlib import Path
import re,sys
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'assets/js/app.js').read_text(encoding='utf-8'); platform=(ROOT/'assets/js/platform.js').read_text(encoding='utf-8'); css=(ROOT/'assets/css/styles.css').read_text(encoding='utf-8'); data=(ROOT/'assets/js/data.js').read_text(encoding='utf-8'); sw=(ROOT/'sw.js').read_text(encoding='utf-8')
checks=[]
def ck(n,v):checks.append((n,bool(v)))
ck('phone layout follows platform mode','const useMobileLayout = platform.layout === "mobile"' in app)
ck('browser/tablet use desktop website layout','const useDesktopLayout = !useMobileLayout' in app and 'force-desktop-layout' in css)
ck('desktop remains desktop','force-desktop-layout' in app and 'deviceType === "desktop"' in platform)
ck('custom name','displayName: store.getText("display-name"' in app and 'displayNameInput' in app)
ck('custom name validation','containsPrivateInfo(name)' in app and 'name.length>32' in app)
ck('relationship topic','relationship: { bn: "রিলেশন"' in data)
ck('married life topic','postMarriage: { bn: "দাম্পত্য জীবন"' in data)
ck('mobile install label visible','display:inline!important' in css and '.install-button span:last-child' in css)
ck('cache version 4.5+',tuple(map(int,re.search(r'const VERSION = "(\d+)\.(\d+)\.(\d+)"',sw).groups())) >= (4,5,0))
for n,o in checks:print(('PASS' if o else 'FAIL'),'-',n)
print(f'\n{sum(o for _,o in checks)}/{len(checks)} checks passed')
if not all(o for _,o in checks):sys.exit(1)
