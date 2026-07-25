from pathlib import Path
from html.parser import HTMLParser
import gzip, json, re, struct, sys

ROOT=Path(__file__).resolve().parents[1]
errors=[]; checks=[]
def check(name, condition, detail=''):
    ok=bool(condition); checks.append((name,ok,detail))
    if not ok: errors.append(f'{name}: {detail}')

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.paths=[]; self.actions=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.append(a['id'])
        if a.get('data-action'): self.actions.append(a['data-action'])
        for key in ('href','src'):
            value=a.get(key,'').split('?',1)[0].split('#',1)[0]
            if value and not value.startswith(('http:','https:','tel:','mailto:','data:','blob:')):
                self.paths.append(value)

def target_for(path):
    if path in ('','./','/'):
        return ROOT/'index.html'
    if path.startswith('/'):
        target=ROOT/path.lstrip('/')
    else:
        target=ROOT/path.replace('./','',1)
    if target.is_dir(): target=target/'index.html'
    return target

html=(ROOT/'index.html').read_text(encoding='utf-8'); parser=Parser(); parser.feed(html)
check('unique root IDs',len(parser.ids)==len(set(parser.ids)),f'{len(parser.ids)-len(set(parser.ids))} duplicate')
for path in sorted(set(parser.paths)):
    check(f'linked path {path}',target_for(path).exists(),str(target_for(path)))

manifest=json.loads((ROOT/'manifest.webmanifest').read_text(encoding='utf-8'))
for field in ('name','short_name','description','start_url','scope','display','icons'):
    check(f'manifest {field}',bool(manifest.get(field)))
check('standalone PWA',manifest.get('display')=='standalone')
check('default manifest language English',manifest.get('lang')=='en')

def png_size(path):
    raw=path.read_bytes()[:24]
    return struct.unpack('>II',raw[16:24]) if raw[:8]==b'\x89PNG\r\n\x1a\n' else None
for icon in manifest['icons']:
    target=target_for(icon['src']); expected=tuple(map(int,icon['sizes'].split('x')))
    check(f'icon {icon["sizes"]}',target.exists() and png_size(target)==expected,str(target))

js_files=list((ROOT/'assets/js').glob('*.js'))+[ROOT/'sw.js']
all_js='\n'.join(p.read_text(encoding='utf-8') for p in js_files)
check('no eval',not re.search(r'\beval\s*\(',all_js))
check('no new Function','new Function' not in all_js)
check('no document.write','document.write' not in all_js)
check('localStorage isolated',all('localStorage' not in p.read_text(encoding='utf-8') for p in js_files if p.name!='storage.js'))
check('no bot token',not re.search(r'\d{7,12}:[A-Za-z0-9_-]{20,}',all_js))
check('no external scripts',not re.search(r'<script[^>]+src=["\']https?://',html,re.I))
check('root app noindex','name="robots" content="noindex,follow"' in html)
check('public language links','/bn/' in html and '/en/' in html)
check('smart English composer copy',"Say the things you have not been able to say." in (ROOT/'assets/js/app.js').read_text(encoding='utf-8'))
check('smart Bangla composer copy','না বলতে পারা কথাগুলো প্রাণ খুলে বলুন' in (ROOT/'assets/js/app.js').read_text(encoding='utf-8'))
check('generic Bangla composer removed','কি করতে চান?' not in all_js)

sw=(ROOT/'sw.js').read_text(encoding='utf-8')
current_version=(ROOT/'VERSION.txt').read_text(encoding='utf-8').strip(); check('cache version matches VERSION.txt',f'const VERSION = \"{current_version}\"' in sw,current_version)
check('offline fallback','offline.html' in sw)
check('offline noindex','noindex,nofollow' in (ROOT/'offline.html').read_text(encoding='utf-8'))

app=(ROOT/'assets/js/app.js').read_text(encoding='utf-8'); css=(ROOT/'assets/css/styles.css').read_text(encoding='utf-8')
check('phone layout follows platform mode','const useMobileLayout = platform.layout === "mobile"' in app)
check('browser and computer app use desktop layout','const useDesktopLayout = !useMobileLayout' in app and 'body.force-desktop-layout' in css)
check('no forced desktop min width','body.force-desktop-layout{--sidebar:220px;--rightbar:300px;--topbar:72px;min-width:0' in css)
check('desktop right rail flex','body.force-desktop-layout .right-rail{display:flex!important;flex-direction:column;gap:15px}' in css)
check('mobile install text visible','body.force-mobile-layout .install-button span:last-child{display:inline!important' in css)
check('mobile nav six columns','grid-template-columns:repeat(6,minmax(0,1fr))' in css)
check('contact config module',(ROOT/'assets/js/config.js').exists() and (ROOT/'config/site.json').exists())
check('consent architecture',(ROOT/'assets/js/consent.js').exists() and (ROOT/'assets/js/analytics.js').exists())
check('ads default off','masterEnabled: false' in (ROOT/'assets/js/ads.js').read_text(encoding='utf-8'))
check('transient ad hide without deletion','PERMANENT_REMOVAL_REASONS' in (ROOT/'assets/js/ads.js').read_text(encoding='utf-8'))
check('consent-aware provider renderer','registerAdSenseRenderer' in (ROOT/'assets/js/ads.js').read_text(encoding='utf-8'))
check('calm reset','start-reset' in app and 'reset-clock' in css)
check('calm body scan','next-body-scan' in app and 'kindness-card' in css)
check('modal focus trap','FOCUSABLE_SELECTOR' in app and 'e.key==="Tab"' in app)
check('Escape closes layers','e.key==="Escape"' in app)


# V5.1 community, ranking, story, retention and notification checks
data=(ROOT/'assets/js/data.js').read_text(encoding='utf-8')
safety=(ROOT/'assets/js/safety.js').read_text(encoding='utf-8')
pwa=(ROOT/'assets/js/pwa.js').read_text(encoding='utf-8')
check('exact application title','<title>Moner Kotha: Anonymous Social Site</title>' in html)
check('brand slogan present','id="brandSlogan">কথা বলুন মন খুলে<' in html)
check('visible Ctrl K removed','<kbd' not in html and '>Ctrl K<' not in html)
mood_section=data.split('export const needMeta',1)[0]
check('relationship is a topic, not a mood','relationship: { bn: "রিলেশন"' in data and 'relationship' not in mood_section)
check('married life is a topic, not a mood','postMarriage: { bn: "দাম্পত্য জীবন"' in data and 'postMarriage' not in mood_section)
check('optional other choices','\"other\": {' in mood_section and 'customMoodPlaceholder' in app and 'customSupportPlaceholder' in app and '__skip__' in app)
check('200 moment moods','export const momentMoods' in data and data.count('\"group\"') >= 200)
check('48 hour stories','MOMENT_TTL_MS=48*60*60*1000' in app)
check('six month post expiry','POST_TTL_MS=183*24*60*60*1000' in app)
check('ranking feed','data-feed="ranking"' in html and 'postRankScore' in app)
check('profile post edit and delete','data-edit-post' in app and 'data-delete-post' in app and 'function deleteUserPost' in app)
check('links and restricted content blocked','containsLink' in safety and 'containsProhibitedSensitiveContent' in safety and 'validateCommunityText' in safety)
config_js=(ROOT/'assets/js/config.js').read_text(encoding='utf-8')
check('push notification scaffold','requestNotifications' in pwa and 'subscribePush' in pwa and 'subscriptionEndpoint' in config_js and 'self.addEventListener("push"' in sw)
check('manifest shortcuts removed','shortcuts' not in manifest)

# UI actions handled
source=html+'\n'+app
actions=set(re.findall(r'data-action=["\']([^"\']+)',source)); cases=set(re.findall(r'case["\']([^"\']+)["\']:',app))
check('all actions handled',actions.issubset(cases),str(sorted(actions-cases)))

# Public routes and meaningful initial HTML
route_report=json.loads((ROOT/'docs/GENERATED_ROUTES.json').read_text(encoding='utf-8'))
routes=route_report['routes']
check('40 localized routes',len(routes)==40,str(len(routes)))
for route in routes:
    page=target_for(route); text=page.read_text(encoding='utf-8') if page.exists() else ''
    check(f'route exists {route}',page.exists())
    check(f'route initial H1 {route}',bool(re.search(r'<h1>[^<]{2,}</h1>',text)))
    check(f'route unique metadata {route}','<title>' in text and 'name="description"' in text)
    check(f'route semantic main {route}','<main ' in text and '<footer ' in text)
    check(f'route JSON-LD {route}','application/ld+json' in text)

check('development robots blocks indexing','Disallow: /' in (ROOT/'robots.txt').read_text())
check('custom bilingual 404','lang="bn"' in (ROOT/'404.html').read_text(encoding='utf-8') and '404' in (ROOT/'404.html').read_text())
check('hosting real 404','try_files $uri $uri/ =404' in (ROOT/'hosting/nginx.conf.example').read_text())
check('security headers','Content-Security-Policy' in (ROOT/'hosting/.htaccess.example').read_text())

# Compressed editable shell budget (network transfer approximation)
budget=[ROOT/'index.html',ROOT/'assets/css/styles.css',*list((ROOT/'assets/js').glob('*.js'))]
raw=sum(p.stat().st_size for p in budget); zipped=sum(len(gzip.compress(p.read_bytes(),compresslevel=9)) for p in budget)
check('compressed shell under 132 KB',zipped<132_000,f'raw={raw}, gzip={zipped}')

for name,ok,detail in checks: print(('PASS' if ok else 'FAIL'),'-',name,detail)
print(f'\n{sum(ok for _,ok,_ in checks)}/{len(checks)} checks passed')
if errors:
    print('\nFailures:\n'+'\n'.join(errors)); sys.exit(1)
