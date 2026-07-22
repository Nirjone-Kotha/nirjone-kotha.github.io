from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
VERSION=(ROOT/'VERSION.txt').read_text(encoding='utf-8').strip()
app=(ROOT/'assets/js/app.js').read_text(encoding='utf-8')
data=(ROOT/'assets/js/data.js').read_text(encoding='utf-8')
css=(ROOT/'assets/css/styles.css').read_text(encoding='utf-8')
youtube=(ROOT/'assets/js/youtube_player.js').read_text(encoding='utf-8')
platform=(ROOT/'assets/js/platform.js').read_text(encoding='utf-8')
html=(ROOT/'index.html').read_text(encoding='utf-8')
manifest=json.loads((ROOT/'manifest.webmanifest').read_text(encoding='utf-8'))
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
checks=[]
def ck(name,ok):
    checks.append((name,bool(ok)))
    print(('PASS' if ok else 'FAIL'),'-',name)

ck('seed stories have creator names', data.count('"alias_bn"') >= 8 and data.count('"alias_en"') >= 8)
ck('new story saves chosen alias', 'displayName:alias(),reactions' in app)
ck('story owner falls back to seed aliases', 'item.alias_bn' in app and 'item.alias_en' in app and 'Unknown Friend' in app)
ck('persistent shared sound switch', 'video-sound-enabled' in youtube and 'saveStoredSound' in youtube and 'syncPreparedPlayers' in youtube)
ck('user play requests sound', 'activateVideoCard(card,{muted:false,userInitiated:true})' in app)
ck('visible sound control', 'data-video-sound' in app and '.video-sound-button' in css)
ck('next two videos prepare lazily', 'cards.slice(index + 1, index + 3)' in youtube and 'requestIdleCallback' in youtube)
ck('video card disclosure removed', 'class="video-disclosure"' not in app)
ck('large video view', 'setVideoLargeView' in app and 'video-large-view' in css and 'data-video-large-card' in app)
ck('large view retains feed ad nodes', 'body.video-large-view .feed-ad-slot' in css and '.feed-ad-slot{display:none' not in css)
ck('phone welcome is compact', 'min-height:94px' in css and 'installed-phone-app.force-mobile-layout .welcome-strip' in css)
ck('phone composer is compact', 'min-height:112px' in css and 'installed-phone-app.force-mobile-layout .composer-compact' in css)
ck('phone feed tabs need no horizontal drag', 'grid-template-columns:repeat(3,minmax(0,1fr))' in css and 'installed-phone-app.force-mobile-layout .feed-tabs' in css)
ck('installed start URL is explicit', 'source=pwa' in manifest['start_url'] and 'app=installed' in manifest['start_url'])
ck('installed session detection', 'mk-installed-app-session' in platform)
ck('repair overlay removed', 'Repair and reload' not in html and '__MK_REPAIR_APP__' not in html)
ck('startup ready after first render', 'localizePage();\ncompleteAppStartup();' in app)
ck('current cache version', f'const VERSION = "{VERSION}"' in sw)
failed=[name for name,ok in checks if not ok]
print(f"{len(checks)-len(failed)}/{len(checks)} phone/media checks passed")
raise SystemExit(1 if failed else 0)
