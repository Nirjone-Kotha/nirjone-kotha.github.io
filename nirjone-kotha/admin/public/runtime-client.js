import { applyRemoteAdSettings, registerAdRenderer, createAdSlot, AD_PLACEMENTS } from '../../assets/js/ads.js?v=6.1.0';
import { getConsent } from '../../assets/js/consent.js?v=6.1.0';
import { getFirebaseServices, firebaseConfigured, FIREBASE_PATHS } from '../../assets/js/firebase-core.js?v=6.1.0';
import { DEFAULT_RUNTIME } from '../../config/firebase-defaults.js';
const listeners=new Set();
const clone=value=>JSON.parse(JSON.stringify(value));
const values=value=>Array.isArray(value)?value:value&&typeof value==='object'?Object.values(value):[];
const activeBySchedule=item=>{if(item?.enabled===false)return false;const now=Date.now(),start=item?.startsAt?Date.parse(item.startsAt):0,end=item?.endsAt?Date.parse(item.endsAt):0;return !(start&&start>now)&&!(end&&end<now)};
let runtime=clone(DEFAULT_RUNTIME);
let initialized=false;
let observer=null;
const renderedImpressions=new Set();
const builtInSelectors={
  posting:"[data-action='compose'],.composer-compact",
  stories:".stories-row,[data-action='compose-moment']",
  comments:"[data-comments],[data-islamic-comments]",
  search:'.search-wrap',
  supportCircles:"[data-nav='circles'],.right-card",
  saved:"[data-nav='saved']",
  calmRoom:"[data-nav='calm']",
  islamicContent:"[data-feed='islamic']",
  generalVideo:"[data-feed='video']",
  profile:"[data-action='profile'],.edit-profile-card",
  notifications:"[data-action='notifications']",
  contact:"[data-action='contact-us'],[data-app-public='contact']"
};
const actionFeatureMap={
  compose:'posting','compose-moment':'stories',profile:'profile',notifications:'notifications','contact-us':'contact',calm:'calmRoom'
};
const navFeatureMap={circles:'supportCircles',saved:'saved',calm:'calmRoom'};
const feedFeatureMap={islamic:'islamicContent',video:'generalVideo'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const locale=()=>document.documentElement.lang==='bn'?'bn':'en';
const mobile=()=>matchMedia('(max-width: 760px)').matches;
const track=(id,event)=>{if(!firebaseConfigured()||!id)return;const metric=event==='click'?'clicks':'impressions';getFirebaseServices().then(({database,databaseSdk})=>databaseSdk.runTransaction(databaseSdk.ref(database,`${FIREBASE_PATHS.adStats}/${id}/${metric}`),value=>(Number(value)||0)+1,{applyLocally:false})).catch(()=>{})};

export function getAdminRuntime(){return runtime}
export function subscribeAdminRuntime(fn){listeners.add(fn);return()=>listeners.delete(fn)}
export function isRuntimeFeatureEnabled(id){return runtime.settings?.features?.[id]!==false}
export function guardAdminAction(target){
  if(!target)return true;
  const action=target.dataset?.action;
  const nav=target.dataset?.nav;
  const feed=target.dataset?.feed;
  const feature=actionFeatureMap[action]||navFeatureMap[nav]||feedFeatureMap[feed]||(target.dataset?.islamicComments?'comments':'');
  if(feature&&isRuntimeFeatureEnabled(feature)===false){window.dispatchEvent(new CustomEvent('mk:feature-blocked',{detail:{feature}}));return false}
  return true;
}
export function mergeManagedVideos(base=[],section='general'){
  const managed=(runtime.videos||[]).filter(v=>v.section===section&&v.enabled!==false);
  const seen=new Set();
  return [...managed,...base].filter(item=>{const key=item.youtubeId||item.id;if(!key||seen.has(key))return false;seen.add(key);return true});
}

function ensureCss(){if(document.querySelector('link[data-mk-admin-runtime]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('../../assets/css/admin_runtime.css?v=6.1.0',import.meta.url).href;link.dataset.mkAdminRuntime='1';document.head.appendChild(link)}
function applySite(){const s=runtime.settings?.site||{};if(s.siteName){document.title=String(document.title||'Moner Kotha').replace(/Moner Kotha/g,s.siteName);const brand=document.querySelector('#brandName');if(brand)brand.textContent=locale()==='bn'?'মনের কথা':s.siteName}const slogan=locale()==='bn'?s.taglineBn:s.taglineEn;const sloganNode=document.querySelector('#brandSlogan');if(slogan&&sloganNode)sloganNode.textContent=slogan;renderMaintenance(s)}
function setFeatureClass(selector,disabled){try{document.querySelectorAll(selector).forEach(el=>el.classList.toggle('mk-admin-feature-hidden',disabled))}catch{}}
function applyFeatures(){
  const f=runtime.settings?.features||{};
  Object.entries(builtInSelectors).forEach(([id,selector])=>setFeatureClass(selector,f[id]===false));
  (runtime.settings?.featureRules||[]).forEach(rule=>{
    if(!rule?.selector)return;
    let nodes=[];
    try{nodes=[...document.querySelectorAll(rule.selector)]}catch{return}
    nodes.forEach(el=>{
      const active=rule.enabled!==false;
      if(rule.effect==='hide')el.classList.toggle('mk-admin-feature-hidden',active);
      if(rule.effect==='disable'){
        if(active){
          if(!el.hasAttribute('data-mk-admin-was-disabled'))el.dataset.mkAdminWasDisabled=el.disabled?'1':'0';
          el.disabled=true;el.classList.add('mk-admin-disabled');
        }else if(el.hasAttribute('data-mk-admin-was-disabled')){
          el.disabled=el.dataset.mkAdminWasDisabled==='1';
          el.removeAttribute('data-mk-admin-was-disabled');el.classList.remove('mk-admin-disabled');
        }
      }
      if(rule.effect==='class'&&rule.className)el.classList.toggle(rule.className,active);
    });
  });
}
function renderMaintenance(s){let layer=document.querySelector('#mkMaintenanceLayer');if(!s.maintenanceMode){layer?.remove();return}if(layer)return;layer=document.createElement('div');layer.id='mkMaintenanceLayer';layer.className='mk-maintenance-layer';const bn=locale()==='bn';layer.innerHTML=`<section class="mk-maintenance-card"><img src="${new URL('../../assets/brand/logo-mark.png',import.meta.url).href}" alt=""><h1>${esc(bn?s.maintenanceTitleBn:s.maintenanceTitleEn)||'Scheduled maintenance'}</h1><p>${esc(bn?s.maintenanceMessageBn:s.maintenanceMessageEn)||'We will be back shortly.'}</p></section>`;document.body.appendChild(layer)}
function dismissed(id){try{return localStorage.getItem(`mk-announcement-dismissed-${id}`)==='1'}catch{return false}}
function dismiss(id,node){try{localStorage.setItem(`mk-announcement-dismissed-${id}`,'1')}catch{}node?.remove()}
function announcementText(a,key){const bn=locale()==='bn';return a[`${key}${bn?'Bn':'En'}`]||a[`${key}${bn?'En':'Bn'}`]||''}
function announcementAction(a){const label=announcementText(a,'actionLabel');return a.actionUrl&&label?`<a class="mk-announcement-action" href="${esc(a.actionUrl)}" target="_blank" rel="noopener sponsored">${esc(label)}</a>`:''}
function renderAnnouncements(){document.querySelectorAll('[data-mk-announcement]').forEach(n=>n.remove());const items=(runtime.announcements||[]).filter(a=>(a.locale==='all'||a.locale===locale())&&!dismissed(a.id));for(const a of items){const title=announcementText(a,'title'),message=announcementText(a,'message');if(a.placement==='topbar'){const bar=document.createElement('div');bar.className=`mk-announcement-bar ${a.type||'info'}`;bar.dataset.mkAnnouncement=a.id;bar.innerHTML=`<div>${title?`<strong>${esc(title)}</strong>`:''}${esc(message)}</div>${announcementAction(a)}${a.dismissible?'<button class="mk-announcement-close" aria-label="Close">✕</button>':''}`;bar.querySelector('.mk-announcement-close')?.addEventListener('click',()=>dismiss(a.id,bar));document.body.prepend(bar)}else if(a.placement==='feed'){const feed=document.querySelector('#feedList');if(!feed)continue;const card=document.createElement('section');card.className='mk-announcement-feed';card.dataset.mkAnnouncement=a.id;card.innerHTML=`${title?`<h3>${esc(title)}</h3>`:''}<p>${esc(message)}</p>${announcementAction(a)}${a.dismissible?'<button class="mk-announcement-close" aria-label="Close">✕</button>':''}`;card.querySelector('.mk-announcement-close')?.addEventListener('click',()=>dismiss(a.id,card));feed.before(card)}else if(a.placement==='modal'){const layer=document.createElement('div');layer.className='mk-runtime-modal-layer';layer.dataset.mkAnnouncement=a.id;layer.innerHTML=`<section class="mk-runtime-modal">${a.dismissible?'<button class="mk-announcement-close" aria-label="Close">✕</button>':''}${title?`<h2>${esc(title)}</h2>`:''}<p>${esc(message)}</p>${announcementAction(a)}</section>`;layer.querySelector('.mk-announcement-close')?.addEventListener('click',()=>dismiss(a.id,layer));document.body.appendChild(layer)} }
}
function eligibleCampaigns(request){const lang=locale(),isMobile=mobile();return (runtime.campaigns||[]).filter(c=>c.enabled!==false&&(c.placements||[]).includes(request.placement)&&(c.locale==='all'||c.locale===lang)&&(c.device==='all'||(c.device==='mobile'&&isMobile)||(c.device==='desktop'&&!isMobile)))}
function weightedPick(items){const total=items.reduce((n,x)=>n+Math.max(1,Number(x.weight||1)),0);let cursor=Math.random()*total;for(const item of items){cursor-=Math.max(1,Number(item.weight||1));if(cursor<=0)return item}return items[0]}
function frequencyAllows(){const f=runtime.settings?.advertising?.frequency||{};try{const count=Number(sessionStorage.getItem('mk-ad-session-count')||0),last=Number(sessionStorage.getItem('mk-ad-last-at')||0);if(count>=Number(f.maxImpressionsPerSession||8))return false;if(Date.now()-last<Number(f.minSecondsBetweenAds||0)*1000)return false;sessionStorage.setItem('mk-ad-session-count',String(count+1));sessionStorage.setItem('mk-ad-last-at',String(Date.now()));return true}catch{return true}}
function renderDirect(mount,request){
  const candidates=eligibleCampaigns(request);if(!candidates.length)return false;
  const c=weightedPick(candidates),impressionKey=`${c.id}:${request.slotId}`;
  if(!renderedImpressions.has(impressionKey)&&!frequencyAllows())return false;
  const bn=locale()==='bn',headline=c[bn?'headlineBn':'headlineEn']||c.headlineEn||c.headlineBn||'',body=c[bn?'bodyBn':'bodyEn']||c.bodyEn||c.bodyBn||'',cta=c[bn?'ctaBn':'ctaEn']||c.ctaEn||c.ctaBn||'Learn more';
  const wrapper=document.createElement(c.targetUrl?'a':'div');wrapper.className='mk-managed-ad';
  if(c.targetUrl){wrapper.href=c.targetUrl;wrapper.target='_blank';wrapper.rel='noopener sponsored';wrapper.addEventListener('click',()=>track(c.id,'click'))}
  wrapper.innerHTML=`<span class="mk-ad-label">Advertisement${c.advertiser?` · ${esc(c.advertiser)}`:''}</span>${c.type==='video'&&c.videoUrl?`<video src="${esc(c.videoUrl)}" muted loop playsinline preload="metadata"></video>`:c.imageUrl?`<img loading="lazy" decoding="async" src="${esc(c.imageUrl)}" alt="${esc(headline)}">`:''}<div class="mk-ad-copy">${headline?`<h3>${esc(headline)}</h3>`:''}${body?`<p>${esc(body)}</p>`:''}${c.targetUrl?`<span class="mk-ad-cta">${esc(cta)}</span>`:''}</div>`;
  mount.replaceChildren(wrapper);mount.hidden=false;
  if(!renderedImpressions.has(impressionKey)){renderedImpressions.add(impressionKey);track(c.id,'impression')}
  return true;
}
let adsensePromise=null;
function loadAdsense(client){if(adsensePromise)return adsensePromise;adsensePromise=new Promise((resolve,reject)=>{if(document.querySelector(`script[data-ad-client="${CSS.escape(client)}"]`)){resolve();return}const s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';s.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;s.dataset.adClient=client;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});return adsensePromise}
function renderGoogle(mount,request){const a=runtime.settings?.advertising||{},g=a.google||{};if(!getConsent().advertising)return false;const slot=g.slotById?.[request.slotId]||g.slotById?.[request.placement];if(!g.enabled||!g.clientId||!slot)return false;const ins=document.createElement('ins');ins.className='adsbygoogle';ins.style.display='block';ins.dataset.adClient=g.clientId;ins.dataset.adSlot=String(slot);ins.dataset.adFormat=request.format||'auto';ins.dataset.fullWidthResponsive='true';mount.replaceChildren(ins);mount.hidden=false;loadAdsense(g.clientId).then(()=>{try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch{}}).catch(()=>{mount.hidden=true});return true}
function renderAutomaticPlacements(){
  document.querySelectorAll('[data-mk-auto-ad]').forEach(node=>node.remove());
  const a=runtime.settings?.advertising||{};if(!a.masterEnabled)return;
  const placement=mobile()?AD_PLACEMENTS.MOBILE_ANCHOR:AD_PLACEMENTS.DESKTOP_ANCHOR;
  const slotId=mobile()?'mobile-anchor-1':'desktop-anchor-1';
  if(a.placements?.[placement]){
    const mount=document.createElement('div');mount.dataset.mkAutoAd='anchor';mount.className='mk-anchor-ad';
    const slot=createAdSlot({placement,slotId,context:'feed',format:'auto',className:'mk-auto-anchor-slot'});
    if(slot){mount.appendChild(slot);document.body.appendChild(mount)}
  }
}
function configureAds(){
  const a=runtime.settings?.advertising||{};
  applyRemoteAdSettings({masterEnabled:Boolean(a.masterEnabled),nonPersonalizedOnly:a.nonPersonalizedOnly!==false,previewPlaceholders:false,placements:a.placements||{},slotOverrides:a.slotOverrides||{}});
  registerAdRenderer((mount,request)=>{if(!a.masterEnabled)return false;const mode=a.provider||'none';if((mode==='direct'||mode==='hybrid')&&renderDirect(mount,request))return true;if((mode==='google'||mode==='hybrid')&&renderGoogle(mount,request))return true;return false});
  if(a.google?.autoAds&&a.google?.enabled&&a.google?.clientId&&getConsent().advertising&&['google','hybrid'].includes(a.provider||''))loadAdsense(a.google.clientId).catch(()=>{});
  renderAutomaticPlacements();
}
let applyQueued=false;
function applyRuntime(){if(applyQueued)return;applyQueued=true;requestAnimationFrame(()=>{applyQueued=false;ensureCss();applySite();applyFeatures();renderAnnouncements();configureAds();listeners.forEach(fn=>{try{fn(runtime)}catch{}});window.dispatchEvent(new CustomEvent('mk:admin-runtime-ready',{detail:runtime}))})}
function normalizeRuntime(raw){const source=raw&&typeof raw==='object'?raw:{};return {schemaVersion:Number(source.schemaVersion)||1,generatedAt:source.generatedAt||null,version:source.version||DEFAULT_RUNTIME.version,settings:source.settings||clone(DEFAULT_RUNTIME.settings),announcements:values(source.announcements).filter(activeBySchedule).sort((a,b)=>Number(b.priority||0)-Number(a.priority||0)),campaigns:values(source.campaigns).filter(activeBySchedule),videos:values(source.videos).filter(item=>item?.enabled!==false)}}
async function connectRuntime(){if(!firebaseConfigured()){runtime=clone(DEFAULT_RUNTIME);applyRuntime();return runtime}try{const {database,databaseSdk}=await getFirebaseServices();const runtimeRef=databaseSdk.ref(database,FIREBASE_PATHS.runtime);const initial=await databaseSdk.get(runtimeRef);if(initial.exists())runtime=normalizeRuntime(initial.val());else runtime=clone(DEFAULT_RUNTIME);applyRuntime();databaseSdk.onValue(runtimeRef,snapshot=>{runtime=snapshot.exists()?normalizeRuntime(snapshot.val()):clone(DEFAULT_RUNTIME);applyRuntime()},error=>console.warn('Firebase runtime listener stopped.',error));return runtime}catch(error){console.warn('Firebase runtime unavailable; using built-in defaults.',error);runtime=clone(DEFAULT_RUNTIME);applyRuntime();return runtime}}
export async function initAdminRuntime(){if(initialized)return runtime;initialized=true;ensureCss();await connectRuntime();if('MutationObserver' in globalThis){observer=new MutationObserver(()=>{applyFeatures()});observer.observe(document.documentElement,{childList:true,subtree:true});}return runtime}
