from pathlib import Path
root=Path(__file__).resolve().parents[1]
app=(root/'assets/js/app.js').read_text()
platform=(root/'assets/js/platform.js').read_text()
css=(root/'assets/css/styles.css').read_text()
checks=[
 ('mobile layout uses platform result','const useMobileLayout = platform.layout === "mobile"' in app),
 ('normal phone and installed phone share layout','const phoneAppLayout = Boolean(isPhone && (standalone || !desktopSiteRequested))' in platform),
 ('desktop site detection preserved','const desktopSiteRequested = Boolean' in platform),
 ('direct page surface helper','function setPage(html){prepareModalSurface(html,{directPage:true});}' in app),
 ('profile direct page','setPage(`${pageHeader(t("profileTitle"))}' in app),
 ('calm direct page','setPage(`${pageHeader(t("calmTitle"))}' in app),
 ('circles direct page','setPage(`${pageHeader(t("circlesTitle"))}' in app),
 ('direct page back action','case"back-page":closeModal();break;' in app),
 ('direct page restores previous feed navigation','directPageReturnView=state.view;openCalm()' in app and 'state.view=directPageReturnView' in app),
 ('direct page full viewport css','.modal-layer.direct-page-layer' in css and 'height:100dvh!important' in css),
]
failed=[]
for name,ok in checks:
 print(('PASS' if ok else 'FAIL'),'-',name)
 if not ok: failed.append(name)
if failed: raise SystemExit(1)
