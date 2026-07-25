from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
VERSION=(ROOT/'VERSION.txt').read_text(encoding='utf-8').strip()
html=(ROOT/'index.html').read_text(encoding='utf-8')
app=(ROOT/'assets/js/app.js').read_text(encoding='utf-8')
pwa=(ROOT/'assets/js/pwa.js').read_text(encoding='utf-8')
sw=(ROOT/'sw.js').read_text(encoding='utf-8')
checks={
'non-blocking splash fallback':'__MK_HIDE_SPLASH__' in html and 'if (!window.__MK_APP_READY__) hideSplash()' in html,
'no repair overlay':'Repair and reload' not in html and '__MK_REPAIR_APP__' not in html,
'app ready handshake':'window.__MK_APP_READY__=true' in app and 'completeAppStartup();' in app,
'first render marks ready':'localizePage();\ncompleteAppStartup();' in app,
'versioned module':f'app.js?v={VERSION}' in html and f'data.js?v={VERSION}' in app,
'uncached SW update':'updateViaCache: "none"' in pwa and f'sw.js?v={VERSION}' in pwa,
'network-first code assets':'fetch(request, { cache: "no-store" })' in sw,
'new cache version':f'const VERSION = "{VERSION}"' in sw,
}
for name,ok in checks.items(): print(('PASS' if ok else 'FAIL'),'-',name)
failed=[name for name,ok in checks.items() if not ok]
print(f"{len(checks)-len(failed)}/{len(checks)} startup checks passed")
raise SystemExit(1 if failed else 0)
