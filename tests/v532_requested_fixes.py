from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
VERSION=(ROOT/'VERSION.txt').read_text(encoding='utf-8').strip()
app=(ROOT/'assets/js/app.js').read_text(encoding='utf-8')
css=(ROOT/'assets/css/styles.css').read_text(encoding='utf-8')
platform=(ROOT/'assets/js/platform.js').read_text(encoding='utf-8')
youtube=(ROOT/'assets/js/youtube_player.js').read_text(encoding='utf-8')
manifest=(ROOT/'manifest.webmanifest').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
checks=[]
def ck(name,ok):
    checks.append((name,bool(ok)))
    print(('PASS' if ok else 'FAIL'),'-',name)
ck('shared video volume persists', 'video-volume' in youtube and 'store.getNumber' in youtube and 'getVolume' in youtube and 'setVolume' in youtube and 'saveStoredVolume' in youtube)
ck('shared volume applied to prepared videos', 'syncPreparedPlayers' in youtube and 'warmNextTwo' in youtube and 'applySharedVolume' in youtube)
ck('story circle contains preview', 'storyPreviewMarkup' in app and 'story-text-preview' in app and 'story-emoji-preview' in app)
ck('story owner name appears below circle', 'storyOwnerName(item)' in app and '<b>${escapeHtml(storyOwnerName(item))}</b>' in app)
ck('user stories are prioritised', 'const aOwn=a.userGenerated?1:0' in app and 'bOwn-aOwn' in app)
ck('story stays in story row after publishing', 'setTimeout(()=>openMoment(id),80)' not in app and 'scrollIntoView' in app and 'story-new' in app)
compose_match=re.search(r'<div class="compose-footer">.*?</div>\n',app,re.S)
ck('composer no longer shows six-month expiry', bool(compose_match) and 'expiresIn' not in compose_match.group(0) and '/4000' in compose_match.group(0))
ck('six-month deletion still active', 'POST_TTL_MS=183*24*60*60*1000' in app and 'expiresAt:now+POST_TTL_MS' in app)
ck('installed phone PWA launch is robust', 'source=pwa' in platform and 'app=installed' in platform and 'display-mode: fullscreen' in platform and 'android-app://' in platform)
ck('installed phone smooth CSS present', 'body.installed-phone-app.force-mobile-layout' in css and '-webkit-overflow-scrolling:touch' in css)
ck('version bumped', f'const VERSION = "{VERSION}"' in sw and f'app.js?v={VERSION}' in sw)
failed=[name for name,ok in checks if not ok]
print(f"{len(checks)-len(failed)}/{len(checks)} requested-fix checks passed")
raise SystemExit(1 if failed else 0)
