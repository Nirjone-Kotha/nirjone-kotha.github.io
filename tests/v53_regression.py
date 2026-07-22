from pathlib import Path
import json, re, subprocess
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'assets/js/app.js').read_text(encoding='utf-8')
css=(ROOT/'assets/css/styles.css').read_text(encoding='utf-8')
islamic=(ROOT/'assets/js/islamic.js').read_text(encoding='utf-8')
video=(ROOT/'assets/js/video_catalog.js').read_text(encoding='utf-8')
youtube=(ROOT/'assets/js/youtube_player.js').read_text(encoding='utf-8')
admin=(ROOT/'admin/video-import/video-import.js').read_text(encoding='utf-8')
admin_html=(ROOT/'admin/video-import/index.html').read_text(encoding='utf-8')
config=json.loads((ROOT/'config/site.json').read_text(encoding='utf-8'))
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
checks=[]
def ck(name,ok): checks.append((name,bool(ok))); print(('PASS' if ok else 'FAIL'),'-',name)

ck('regular and Shorts are separate', 'VIDEO_FORMATS' in app and 'item.contentType===format' in app and 'data-video-format' in app)
ck('video cards only expose Like', 'class="post-actions video-actions"' in app and 'data-video-like' in app and 'data-video-comments' not in app)
ck('permanent YouTube failures are removed', any(code in youtube for code in ['2, 100, 101, 150','2,100,101,150']) and 'onUnavailable' in youtube and 'unavailable-video-ids' in app)
ck('active plus next two players prepared', ('cards.slice(index + 1, index + 3)' in youtube or 'cards.slice(index+1,index+3)' in youtube) and 'warmNextTwo(card)' in youtube)
ck('privacy-enhanced YouTube host', 'https://www.youtube-nocookie.com' in youtube)
ck('global video health endpoints prepared', bool(config['youtube']['videoHealthEndpoint']=='' and 'videoReportEndpoint' in config['youtube']) and 'syncVideoHealth' in app)
ck('server health worker supplied', (ROOT/'server-examples/video-health-worker.mjs').exists())
ck('single and bulk admin import', 'Add one link' in admin_html and 'Bulk links' in admin_html and 'createBulkAdminDrafts' in admin)
ck('automatic thumbnail in admin draft', 'youtubeThumbnail' in video and 'thumbnailUrl:youtubeThumbnail' in video)
ck('Quran Bengali default and English toggle', 'translationLang=state.islamicTranslations' in app and 'translationLang==="bn"?"English":"বাংলা"' in app)
ck('Quran full verse fallback', 'q-2-286' in islamic and len(re.search(r'id:"q-2-286".*?bn:"(.*?)",\n\s*en:',islamic,re.S).group(1))>200)
ck('Islamic mood filter', 'data-islamic-mood' in app and 'selectedIslamicMood' in app)
ck('Quran Hadith Dua like comment share', all(x in app for x in ['data-islamic-like','data-islamic-comments','data-islamic-share','islamicRankScore']))
ck('story is separate 48-hour state', 'state.moments.unshift' in app and 'state.userPosts.unshift' not in re.search(r'function submitMoment\(\).*?\n}',app,re.S).group(0))
ck('story mood shows publish immediately', 'button.hidden=!ready' in app and 'Boolean(state.momentMoodId)' in app)
ck('story professional reactions and comments', 'MOMENT_REACTIONS' in app and all(x in app for x in ['like','love','care','sympathy','data-moment-comments']))
ck('old story wording removed', 'Send sympathy' not in app and 'Shared for 48 hour' not in app)
ck('profile post count opens manager', 'data-action="profile-posts"' in app and 'function openProfilePosts' in app and 'data-edit-post' in app and 'data-delete-post' in app)
ck('Facebook-like social styling', 'facebook-story-card' in app and 'social-content-card' in app and '.story-ring' in css and '.post-card' in css)
ck('4000-character text posts preserved', 'maxlength="4000"' in app and '.slice(0,4000)' in app)
ck('current service worker version', f'const VERSION = "{(ROOT / "VERSION.txt").read_text(encoding="utf-8").strip()}"' in sw and 'youtube_player.js' in sw)

node_script="""
import {generalVideoCatalog,islamicVideoCatalog,catalogStats,createBulkAdminDrafts} from './assets/js/video_catalog.js';
const s=catalogStats();
if(generalVideoCatalog.length!==80||islamicVideoCatalog.length!==80||s.total!==160)process.exit(2);
if(createBulkAdminDrafts({links:'https://youtu.be/z2hRQBZQXdM\\nhttps://www.youtube.com/watch?v=tPoQadObOK4'}).length!==2)process.exit(3);
console.log('catalog-ok');
"""
proc=subprocess.run(['node','--input-type=module','-e',node_script],cwd=ROOT,capture_output=True,text=True)
ck('80+80 catalogue and bulk parser runtime',proc.returncode==0 and 'catalog-ok' in proc.stdout)

failed=[name for name,ok in checks if not ok]
print(f"{len(checks)-len(failed)}/{len(checks)} V5.3 checks passed")
raise SystemExit(1 if failed else 0)
