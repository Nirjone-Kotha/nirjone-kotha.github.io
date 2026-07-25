import { adminApi, adminSignOut, compressAdminImage } from "./admin-firebase.js";
import { generalVideoCatalog, islamicVideoCatalog } from "../../assets/js/video_catalog.js?v=6.1.0";
const cfg=window.MK_ADMIN;
const content=document.querySelector('#adminContent');
const nav=document.querySelector('#adminNav');
const modal=document.querySelector('#modal');
const modalBody=document.querySelector('#modalBody');
const toastNode=document.querySelector('#toast');
const state={page:'dashboard',settings:null,announcements:[],campaigns:[],videos:[],stats:{campaigns:{}},audit:[],system:null,user:null};
const featureMeta={
  posting:['পোস্ট প্রকাশ','Compose button ও নতুন post publishing নিয়ন্ত্রণ করে। Off করলে existing post দেখা যাবে, কিন্তু নতুন post লেখা যাবে না।'],
  stories:['স্টোরি','Story row এবং ৪৮ ঘণ্টার story publishing বন্ধ/চালু করে।'],
  comments:['কমেন্ট','Post ও Islamic content-এর comment entry points নিয়ন্ত্রণ করে।'],
  search:['সার্চ','Global search box দেখাবে বা লুকাবে।'],
  supportCircles:['সাপোর্ট সার্কেল','Circle navigation ও active support group section নিয়ন্ত্রণ করে।'],
  saved:['সেভড পোস্ট','Saved navigation এবং saved-content view নিয়ন্ত্রণ করে।'],
  calmRoom:['Calm Space','Breathing, grounding ও calming tools section নিয়ন্ত্রণ করে।'],
  islamicContent:['ইসলামিক কনটেন্ট','Qur’an, Hadith, Dua এবং Islamic video tab নিয়ন্ত্রণ করে। Islamic section সবসময় ad-free থাকবে।'],
  generalVideo:['জেনারেল ভিডিও','General video/shorts feed চালু বা বন্ধ করে।'],
  profile:['প্রোফাইল','Profile ও edit-profile controls দেখাবে বা লুকাবে।'],
  notifications:['নোটিফিকেশন','In-app notification entry point নিয়ন্ত্রণ করে।'],
  contact:['যোগাযোগ','Contact buttons ও contact page link নিয়ন্ত্রণ করে।']
};
const placementMeta={
  feedInFeed:['Feed in-feed','প্রথম ১০টি content-এর পরে এবং পরবর্তী নির্ধারিত interval-এ native ad দেখায়।'],
  desktopRightRail:['Desktop right rail','Desktop-এর ডান পাশে 300×250/Responsive display ad দেখায়।'],
  resourceInArticle:['Resource article','Resource article-এর ভেতরে contextual placement; sensitive content-এ render হবে না।'],
  resourceMultiplex:['Resource multiplex','Article শেষে related-content style multiplex ad-এর জন্য reserved।'],
  mobileAnchor:['Mobile anchor','Mobile screen-এর নিচে sticky ad; কম ব্যবহার করাই ভালো।'],
  desktopAnchor:['Desktop anchor','Desktop-এর নিচে anchor placement।'],
  vignette:['Vignette','Page transition-এর মাঝে full-screen ad; user experience বিবেচনায় সীমিত রাখুন।'],
  sideRailAuto:['Auto side rail','Wide screen-এ Google side-rail auto ads-এর জন্য।']
};
const moodOptions=['happy','sad','anxious','angry','lonely','stressed','tired','hopeful','confused','grateful'];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const fmt=n=>new Intl.NumberFormat('en-US').format(Number(n||0));
const dateText=v=>{if(!v)return 'Not scheduled';const d=new Date(v);return Number.isNaN(d.getTime())?v:d.toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short'})};
const toLocalInput=v=>{if(!v)return '';const d=new Date(v);if(Number.isNaN(d.getTime()))return String(v).slice(0,16);const off=d.getTimezoneOffset();return new Date(d.getTime()-off*60000).toISOString().slice(0,16)};
const fromLocalInput=v=>v?new Date(v).toISOString():'';
function toast(message,error=false){toastNode.textContent=message;toastNode.classList.toggle('error',error);toastNode.classList.add('show');clearTimeout(toastNode._timer);toastNode._timer=setTimeout(()=>toastNode.classList.remove('show'),2800)}
async function api(action,{method='GET',body=null}={}){try{return await adminApi(action,{method,body})}catch(error){if(['AUTH_REQUIRED','ADMIN_REQUIRED'].includes(error?.code)){location.replace('login.html');return new Promise(()=>{})}throw error}}
function getPath(obj,path){return path.split('.').reduce((v,k)=>v?.[k],obj)}
function setPath(obj,path,value){const keys=path.split('.');let ref=obj;keys.slice(0,-1).forEach(k=>{if(!ref[k]||typeof ref[k]!=='object')ref[k]={};ref=ref[k]});ref[keys.at(-1)]=value}
function switchMarkup(path,title,desc,checked){return `<div class="toggle-row"><div class="toggle-copy"><b>${esc(title)}</b><small>${esc(desc)}</small></div><label class="switch"><input type="checkbox" data-path="${esc(path)}" ${checked?'checked':''}><i></i></label></div>`}
function statusOf(item){if(item.enabled===false)return ['off','Off'];const now=Date.now(),start=item.startsAt?Date.parse(item.startsAt):0,end=item.endsAt?Date.parse(item.endsAt):0;if(start&&start>now)return ['scheduled','Scheduled'];if(end&&end<now)return ['ended','Ended'];return ['active','Active']}
function statusBadge(item){const [cls,label]=statusOf(item);return `<span class="status-badge ${cls}"><i class="status-dot"></i>${label}</span>`}
function openModal(html){modalBody.innerHTML=html;modal.hidden=false;document.body.style.overflow='hidden';modalBody.querySelector('input,select,textarea,button')?.focus()}
function closeModal(){modal.hidden=true;modalBody.innerHTML='';document.body.style.overflow=''}
function modalHead(title){return `<header class="modal-head"><h2>${esc(title)}</h2><button class="modal-close" type="button" data-close-modal>✕</button></header>`}
function setPage(page){state.page=page;nav.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));document.querySelector('#pageTitle').textContent={dashboard:'Dashboard',site:'Site Control',features:'Feature Manager',announcements:'Announcements',advertising:'Advertisement Manager',videos:'Video Manager',system:'System & Guide'}[page]||'Control Center';document.querySelector('#sidebar').classList.remove('open');render()}
async function loadAll(){try{const r=await api('all');Object.assign(state,r.data);document.querySelector('#adminUserName').textContent=state.user?.name||'Administrator';document.querySelector('#adminUserEmail').textContent=state.user?.email||'Firebase administrator';render()}catch(e){content.innerHTML=`<div class="panel"><h2>Admin data load হয়নি</h2><p class="muted">${esc(e.message)}</p><p class="muted">Firebase config, Authentication, Database rules এবং adminUsers access যাচাই করুন।</p><button class="primary" onclick="location.reload()">Reload</button></div>`}}
function render(){if(!state.settings)return;({dashboard:renderDashboard,site:renderSite,features:renderFeatures,announcements:renderAnnouncements,advertising:renderAdvertising,videos:renderVideos,system:renderSystem}[state.page]||renderDashboard)()}
function renderDashboard(){const s=state.settings,camps=state.campaigns.filter(x=>statusOf(x)[0]==='active').length,anns=state.announcements.filter(x=>statusOf(x)[0]==='active').length,impressions=Object.values(state.stats?.campaigns||{}).reduce((a,x)=>a+Number(x.impressions||0),0),clicks=Object.values(state.stats?.campaigns||{}).reduce((a,x)=>a+Number(x.clicks||0),0);content.innerHTML=`<div class="page-stack"><section class="hero-card"><div><small>MONER KOTHA · VERSION ${esc(state.system?.version||cfg.version)}</small><h2>এক জায়গা থেকে পুরো project পরিচালনা করুন</h2><p>Code edit না করে feature on/off, maintenance mode, important announcement, Google Ads বা নিজস্ব advertisement campaign এবং নতুন video নিয়ন্ত্রণ করুন।</p></div><div class="hero-actions"><button data-go="site">Site settings</button><button data-go="advertising">Manage ads</button><a href="../" target="_blank" rel="noopener">View website ↗</a></div></section><section class="stat-grid">
${statCard('Website',s.site.maintenanceMode?'Maintenance':'Live',s.site.maintenanceMode?'Visitors maintenance notice দেখবে':'Public website স্বাভাবিকভাবে চলছে','◉')}
${statCard('Announcements',anns,`${state.announcements.length} total broadcast`,`!`)}
${statCard('Ad campaigns',camps,s.advertising.masterEnabled?`${impressions} impressions · ${clicks} clicks`:'Global ads currently off','▣')}
${statCard('Managed videos',state.videos.length,'Admin panel থেকে যোগ করা content','▶')}
</section><section class="two-col"><div class="panel"><div class="panel-head"><div><h2>Current control status</h2><p>গুরুত্বপূর্ণ settings-এর live summary।</p></div></div><div class="list-cards">
${summaryRow('Maintenance mode',s.site.maintenanceMode,'On হলে public site block করে maintenance notice দেখায়।')}
${summaryRow('Post publishing',s.features.posting,'Visitors নতুন anonymous post publish করতে পারবে।')}
${summaryRow('Islamic content',s.features.islamicContent,'এই section ad-safe এবং বিজ্ঞাপনমুক্ত থাকে।')}
${summaryRow('Advertisement master switch',s.advertising.masterEnabled,`Provider: ${s.advertising.provider}`)}
</div></div><div class="panel"><div class="panel-head"><div><h2>Recent activity</h2><p>Admin changes-এর audit trail।</p></div><button class="ghost" data-go="system">View all</button></div>${auditMarkup(state.audit.slice(0,7))}</div></section></div>`}
function statCard(label,value,desc,icon){return `<article class="stat-card"><div class="stat-top"><span>${esc(label)}</span><i class="icon">${icon}</i></div><strong>${esc(value)}</strong><small>${esc(desc)}</small></article>`}
function summaryRow(title,on,desc){return `<div class="item-card"><div><h4>${esc(title)}</h4><p>${esc(desc)}</p></div><span class="status-badge ${on?'on':'off'}"><i class="status-dot"></i>${on?'ON':'OFF'}</span></div>`}
function auditMarkup(rows){if(!rows?.length)return `<div class="empty-table">এখনও কোনো activity নেই।</div>`;return `<div class="audit-list">${rows.map(x=>`<div class="audit-row"><i class="audit-icon">✓</i><div><b>${esc(x.summary)}</b><p>${esc(x.user||'system')} · ${esc(x.action)}</p></div><time>${esc(dateText(x.createdAt))}</time></div>`).join('')}</div>`}
function renderSite(){const s=state.settings.site;content.innerHTML=`<div class="page-stack"><section class="panel"><div class="panel-head"><div><h2>Brand & contact information</h2><p>এখানে পরিবর্তন করলে website-এর runtime branding এবং support contact update হবে।</p></div><button class="primary" data-action="save-settings">Save changes</button></div><div class="form-grid"><div class="field"><span>Site name</span><input data-path="site.siteName" value="${esc(s.siteName)}"><small>Browser title ও runtime brand name-এ ব্যবহার হবে।</small></div><div class="field"><span>Default language</span><select data-path="site.defaultLanguage"><option value="en" ${s.defaultLanguage==='en'?'selected':''}>English</option><option value="bn" ${s.defaultLanguage==='bn'?'selected':''}>বাংলা</option></select><small>নতুন visitor-এর preferred language fallback।</small></div><div class="field"><span>Bangla tagline</span><input data-path="site.taglineBn" value="${esc(s.taglineBn)}"></div><div class="field"><span>English tagline</span><input data-path="site.taglineEn" value="${esc(s.taglineEn)}"></div><div class="field"><span>Support email</span><input type="email" data-path="site.supportEmail" value="${esc(s.supportEmail)}" placeholder="support@example.com"></div><div class="field"><span>WhatsApp number</span><input data-path="site.whatsappNumber" value="${esc(s.whatsappNumber)}" placeholder="8801XXXXXXXXX"></div><div class="field full"><span>Facebook page URL</span><input type="url" data-path="site.facebookUrl" value="${esc(s.facebookUrl)}" placeholder="https://facebook.com/..."></div></div></section><section class="panel"><div class="panel-head"><div><h2>Maintenance mode</h2><p>Hosting update বা জরুরি কাজের সময় code পরিবর্তন ছাড়াই public access সাময়িকভাবে বন্ধ করুন। Admin panel accessible থাকবে।</p></div></div>${switchMarkup('site.maintenanceMode','Maintenance mode',s.maintenanceMode?'বর্তমানে ON—visitor maintenance screen দেখছে।':'বর্তমানে OFF—website live আছে।',s.maintenanceMode)}<div class="form-grid" style="margin-top:16px"><div class="field"><span>Bangla title</span><input data-path="site.maintenanceTitleBn" value="${esc(s.maintenanceTitleBn)}"></div><div class="field"><span>English title</span><input data-path="site.maintenanceTitleEn" value="${esc(s.maintenanceTitleEn)}"></div><div class="field"><span>Bangla message</span><textarea data-path="site.maintenanceMessageBn">${esc(s.maintenanceMessageBn)}</textarea></div><div class="field"><span>English message</span><textarea data-path="site.maintenanceMessageEn">${esc(s.maintenanceMessageEn)}</textarea></div></div><div class="warning-box" style="margin-top:16px"><b>প্রভাব:</b> ON করার পর runtime API load হলেই public interface-এর উপর maintenance screen দেখাবে। তাই নিজের browser-এ website খুলে পরীক্ষা করুন।</div><div class="button-row"><button class="primary" data-action="save-settings">Save maintenance setting</button></div></section></div>`}
function renderFeatures(){const features=state.settings.features,rules=state.settings.featureRules||[];content.innerHTML=`<div class="page-stack"><section class="panel"><div class="panel-head"><div><h2>Built-in feature switches</h2><p>প্রতিটি switch frontend controls-এর সাথে যুক্ত। OFF করলে সংশ্লিষ্ট entry point লুকবে এবং blocked action কাজ করবে না।</p></div><button class="primary" data-action="save-settings">Save feature controls</button></div><div class="feature-grid">${Object.entries(featureMeta).map(([key,[title,desc]])=>switchMarkup(`features.${key}`,title,desc,Boolean(features[key]))).join('')}</div></section><section class="panel"><div class="panel-head"><div><h2>Advanced selector rules</h2><p>Future-এ নতুন UI element যোগ করলে code edit ছাড়াই CSS selector দিয়ে hide, disable অথবা class apply করতে পারবেন।</p></div><button class="secondary" data-action="new-rule">+ Add custom rule</button></div><div class="info-box"><b>উদাহরণ:</b> নতুন “Shop” button-এর selector যদি <span class="code-chip">[data-nav='shop']</span> হয়, সেটি hide করার rule এখান থেকে যোগ করা যাবে। ভুল selector দিলে শুধু rule কাজ করবে না; website code নষ্ট হবে না।</div><div class="table-wrap" style="margin-top:15px"><table class="data-table"><thead><tr><th>Rule</th><th>Selector</th><th>Effect</th><th>Status</th><th></th></tr></thead><tbody>${rules.length?rules.map(r=>`<tr><td><b>${esc(r.label)}</b></td><td><span class="code-chip">${esc(r.selector)}</span></td><td>${esc(r.effect)}${r.className?` · ${esc(r.className)}`:''}</td><td>${r.enabled?'<span class="status-badge on">Enabled</span>':'<span class="status-badge off">Disabled</span>'}</td><td><div class="row-actions"><button class="icon-btn" data-edit-rule="${esc(r.id)}">Edit</button><button class="icon-btn" data-delete-rule="${esc(r.id)}">Delete</button></div></td></tr>`).join(''):`<tr><td colspan="5" class="empty-table">কোনো custom rule নেই।</td></tr>`}</tbody></table></div><div class="button-row"><button class="primary" data-action="save-settings">Save rules</button></div></section></div>`}
function renderAnnouncements(){content.innerHTML=`<div class="page-stack"><section class="hero-card"><div><small>IMPORTANT MESSAGE BROADCAST</small><h2>Website-wide announcement প্রকাশ করুন</h2><p>Top bar, feed card বা modal হিসেবে বাংলা/English message, priority, action button এবং start/end schedule নির্ধারণ করুন।</p></div><div class="hero-actions"><button data-action="new-announcement">+ New announcement</button></div></section><section class="panel"><div class="panel-head"><div><h2>All announcements</h2><p>Active, scheduled, ended বা manually disabled অবস্থার পরিষ্কার summary।</p></div></div>${announcementTable()}</section></div>`}
function announcementTable(){return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Message</th><th>Placement</th><th>Schedule</th><th>Status</th><th></th></tr></thead><tbody>${state.announcements.length?state.announcements.map(a=>`<tr><td><b>${esc(a.titleBn||a.titleEn||'Untitled')}</b><small>${esc((a.messageBn||a.messageEn||'').slice(0,100))}</small></td><td>${esc(a.placement)}<small>${esc(a.type)} · priority ${esc(a.priority)}</small></td><td>${a.startsAt?esc(dateText(a.startsAt)):'Immediately'}<small>${a.endsAt?'Ends '+esc(dateText(a.endsAt)):'No end date'}</small></td><td>${statusBadge(a)}</td><td><div class="row-actions"><button class="icon-btn" data-edit-announcement="${esc(a.id)}">Edit</button><button class="icon-btn" data-delete-announcement="${esc(a.id)}">Delete</button></div></td></tr>`).join(''):`<tr><td colspan="5" class="empty-table">এখনও কোনো announcement তৈরি হয়নি।</td></tr>`}</tbody></table></div>`}
function renderAdvertising(){const a=state.settings.advertising,stats=state.stats?.campaigns||{};content.innerHTML=`<div class="page-stack"><section class="hero-card"><div><small>DETAILED AD CONTROL</small><h2>Google Ads এবং নিজস্ব campaign—দুটিই নিয়ন্ত্রণ করুন</h2><p>Master switch, provider, privacy, placement, slot ID, frequency cap, campaign schedule, device/language targeting এবং impression/click summary একই জায়গায়। Islamic ও safety-sensitive context-এ ads render হবে না।</p></div><div class="hero-actions"><button data-action="new-campaign">+ New direct ad</button><a href="../?view=home" target="_blank" rel="noopener">Preview website ↗</a></div></section><section class="panel"><div class="panel-head"><div><h2>1. Global advertisement control</h2><p>সবচেয়ে আগে master switch এবং provider ঠিক করুন। Master OFF থাকলে কোনো placement বা campaign render হবে না।</p></div><button class="primary" data-action="save-settings">Save ad settings</button></div><div class="form-grid"><div class="field full">${switchMarkup('advertising.masterEnabled','Advertisement master switch',a.masterEnabled?'বর্তমানে ON—enabled placement-এ ad দেখানো যাবে।':'বর্তমানে OFF—Google ও direct campaign সম্পূর্ণ বন্ধ।',a.masterEnabled)}</div><div class="field"><span>Ad provider mode</span><select data-path="advertising.provider"><option value="none" ${a.provider==='none'?'selected':''}>None</option><option value="google" ${a.provider==='google'?'selected':''}>Google AdSense only</option><option value="direct" ${a.provider==='direct'?'selected':''}>Own/direct campaigns only</option><option value="hybrid" ${a.provider==='hybrid'?'selected':''}>Hybrid: direct first, Google fallback</option></select><small>Hybrid mode-এ matching direct campaign না থাকলে Google slot ব্যবহৃত হবে।</small></div><div class="field">${switchMarkup('advertising.nonPersonalizedOnly','Non-personalized ads only','Mood, post text, search এবং safety data কখনও targeting-এ ব্যবহার করা হবে না।',a.nonPersonalizedOnly)}</div><div class="field"><span>Maximum impressions per session</span><input type="number" min="1" max="100" data-path="advertising.frequency.maxImpressionsPerSession" value="${esc(a.frequency.maxImpressionsPerSession)}"><small>একটি browser session-এ ad overload কমায়।</small></div><div class="field"><span>Minimum seconds between ads</span><input type="number" min="0" max="3600" data-path="advertising.frequency.minSecondsBetweenAds" value="${esc(a.frequency.minSecondsBetweenAds)}"><small>এক ad-এর পর আরেকটি render হওয়ার minimum gap।</small></div></div></section><section class="two-col"><div class="panel"><div class="panel-head"><div><h2>2. Placement controls</h2><p>কোন জায়গায় বিজ্ঞাপন দেখানো যাবে তা আলাদাভাবে নির্বাচন করুন।</p></div></div><div class="placement-grid">${Object.entries(placementMeta).map(([key,[title,desc]])=>switchMarkup(`advertising.placements.${key}`,title,desc,Boolean(a.placements[key]))).join('')}</div></div><div class="panel"><div class="panel-head"><div><h2>Placement guidance</h2><p>User experience ও safety boundary।</p></div></div><div class="guide-card"><h4>Recommended শুরু</h4><p>প্রথমে শুধু <b>Desktop right rail</b> এবং <b>Feed in-feed</b> চালু করুন। Anchor/Vignette পরে performance দেখে ব্যবহার করুন।</p></div><div class="guide-card" style="margin-top:11px"><h4>Protected areas</h4><p>Islamic section, composer, comments, safety page, calm room, profile, modal, high-risk feed এবং private context-এ ad engine নিজে থেকে block করে।</p></div><div class="guide-card" style="margin-top:11px"><h4>Google Ads off করার সময়</h4><p>Provider <b>Direct</b> নির্বাচন করুন বা Google enabled OFF করুন। Direct campaigns তখনও চলতে পারবে, যদি master switch ON থাকে।</p></div></div></section><section class="panel"><div class="panel-head"><div><h2>3. Google AdSense configuration</h2><p>Approved AdSense account-এর publisher ID এবং exact slot IDs দিন। ভুল/খালি ID হলে Google ad render হবে না; direct campaign unaffected থাকবে।</p></div></div><div class="form-grid"><div class="field">${switchMarkup('advertising.google.enabled','Enable Google AdSense','Provider Google/Hybrid হলে এই switch প্রয়োজন।',a.google.enabled)}</div><div class="field">${switchMarkup('advertising.google.autoAds','Google Auto Ads','Auto Ads script-level behavior; AdSense dashboard policy-ও প্রযোজ্য।',a.google.autoAds)}</div><div class="field full"><span>Publisher client ID</span><input data-path="advertising.google.clientId" value="${esc(a.google.clientId)}" placeholder="ca-pub-1234567890123456"><small>শুধু approved ca-pub ID ব্যবহার করুন।</small></div>${googleSlotFields(a.google.slotById||{})}</div><div class="button-row"><button class="primary" data-action="save-settings">Save Google configuration</button></div></section><section class="panel"><div class="panel-head"><div><h2>4. Direct advertisement campaigns</h2><p>নিজস্ব advertiser, banner, native promotion বা video campaign schedule করুন।</p></div><button class="secondary" data-action="new-campaign">+ Create campaign</button></div><div class="mini-kpi" style="margin-bottom:15px"><span><b>${fmt(Object.values(stats).reduce((n,x)=>n+Number(x.impressions||0),0))}</b><small>Total impressions</small></span><span><b>${fmt(Object.values(stats).reduce((n,x)=>n+Number(x.clicks||0),0))}</b><small>Total clicks</small></span><span><b>${state.campaigns.filter(x=>statusOf(x)[0]==='active').length}</b><small>Active campaigns</small></span></div>${campaignTable()}</section></div>`}
function googleSlotFields(slots){const fields=[['desktop-right-rail-1','Desktop right rail slot'],['feed-10','Standard feed first slot'],['video-feed-10','Video feed first slot']];return fields.map(([id,label])=>`<div class="field"><span>${esc(label)}</span><input data-path="advertising.google.slotById.${id}" value="${esc(slots[id]||'')}" placeholder="1234567890"><small>Runtime slot ID: <span class="code-chip">${id}</span></small></div>`).join('')}
function campaignTable(){const stats=state.stats?.campaigns||{};return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Campaign</th><th>Placement & target</th><th>Performance</th><th>Status</th><th></th></tr></thead><tbody>${state.campaigns.length?state.campaigns.map(c=>{const st=stats[c.id]||{};return `<tr><td><div style="display:flex;gap:10px;align-items:center">${c.imageUrl?`<img class="campaign-thumb" src="${esc(c.imageUrl)}" alt="">`:''}<div><b>${esc(c.name)}</b><small>${esc(c.advertiser||'Direct advertiser')} · ${esc(c.type)}</small></div></div></td><td>${esc((c.placements||[]).join(', ')||'No placement')}<small>${esc(c.locale)} · ${esc(c.device)} · weight ${esc(c.weight)}</small></td><td>${fmt(st.impressions)} views<small>${fmt(st.clicks)} clicks · CTR ${st.impressions?((st.clicks/st.impressions)*100).toFixed(2):'0.00'}%</small></td><td>${statusBadge(c)}</td><td><div class="row-actions"><button class="icon-btn" data-edit-campaign="${esc(c.id)}">Edit</button><button class="icon-btn" data-delete-campaign="${esc(c.id)}">Delete</button></div></td></tr>`}).join(''):`<tr><td colspan="5" class="empty-table">কোনো direct campaign নেই। Google Ads আলাদাভাবে ব্যবহার করা যাবে।</td></tr>`}</tbody></table></div>`}
function getVideoStats(){
  const managed = state.videos || [];
  const managedGeneral = managed.filter(v => (v.section || 'general') === 'general' && v.enabled !== false);
  const managedIslamic = managed.filter(v => v.section === 'islamic' && v.enabled !== false);

  const seenGen = new Set();
  const allGeneral = [...managedGeneral, ...(generalVideoCatalog || [])].filter(item => {
    const key = item.youtubeId || item.id;
    if (!key || seenGen.has(key)) return false;
    seenGen.add(key);
    return true;
  });

  const seenIsl = new Set();
  const allIslamic = [...managedIslamic, ...(islamicVideoCatalog || [])].filter(item => {
    const key = item.youtubeId || item.id;
    if (!key || seenIsl.has(key)) return false;
    seenIsl.add(key);
    return true;
  });

  const moods = ["lonely","sad","anxious","overwhelmed","angry","numb","lost","hopeful"];
  const moodLabels = {
    lonely: "Lonely (একাকীত্ব)",
    sad: "Sad (মন খারাপ)",
    anxious: "Anxious (উদ্বেগ)",
    overwhelmed: "Overwhelmed (চাপ)",
    angry: "Angry (রাগ)",
    numb: "Numb (শূন্যতা)",
    lost: "Lost (দিশেহারা)",
    hopeful: "Hopeful (আশা)"
  };

  const moodStats = {};
  moods.forEach(m => {
    moodStats[m] = {
      label: moodLabels[m] || m,
      general: 0,
      islamic: 0,
      total: 0
    };
  });

  allGeneral.forEach(item => {
    const itemMoods = item.moods && item.moods.length ? item.moods : (item.mood ? [item.mood] : moods);
    itemMoods.forEach(m => {
      if (moodStats[m]) {
        moodStats[m].general += 1;
        moodStats[m].total += 1;
      }
    });
  });

  allIslamic.forEach(item => {
    const itemMoods = item.moods && item.moods.length ? item.moods : (item.mood ? [item.mood] : moods);
    itemMoods.forEach(m => {
      if (moodStats[m]) {
        moodStats[m].islamic += 1;
        moodStats[m].total += 1;
      }
    });
  });

  return {
    totalGeneral: allGeneral.length,
    totalIslamic: allIslamic.length,
    totalAll: allGeneral.length + allIslamic.length,
    adminGeneral: managedGeneral.length,
    adminIslamic: managedIslamic.length,
    adminTotal: managed.length,
    moodStats
  };
}

function renderVideos(){
  const stats = getVideoStats();
  content.innerHTML=`<div class="page-stack">
    <section class="hero-card">
      <div>
        <small>ADMIN-MANAGED VIDEO CATALOGUE</small>
        <h2>Code edit ছাড়াই YouTube video ও Shorts যোগ করুন</h2>
        <p>General/Islamic section, content type, mood mapping, duration, featured state এবং enabled status নির্ধারণ করুন। Admin-managed video seed catalogue-এর সঙ্গে স্বয়ংক্রিয়ভাবে merge হবে।</p>
      </div>
      <div class="hero-actions">
        <button data-action="new-video">+ Add video</button>
        <button data-action="bulk-video">Bulk import</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>📊 Video Statistics (ভিডিও সংখ্যা পরিসংখ্যান)</h2>
          <p>Islamic video এবং General video-র মোট সংখ্যা এবং প্রতিটি Mood-এ ভিডিওর বিভাজন।</p>
        </div>
      </div>
      <div class="three-col" style="margin-bottom:20px">
        <div class="guide-card">
          <h4>Islamic Videos</h4>
          <p style="font-size:22px;margin:6px 0 2px;color:#075d52"><b>${stats.totalIslamic} টি</b></p>
          <small>${stats.adminIslamic} Admin Added + Built-in Seed Videos</small>
        </div>
        <div class="guide-card">
          <h4>General Videos</h4>
          <p style="font-size:22px;margin:6px 0 2px;color:var(--brand)"><b>${stats.totalGeneral} টি</b></p>
          <small>${stats.adminGeneral} Admin Added + Built-in Seed Videos</small>
        </div>
        <div class="guide-card">
          <h4>Total Combined Videos</h4>
          <p style="font-size:22px;margin:6px 0 2px"><b>${stats.totalAll} টি</b></p>
          <small>${stats.adminTotal} Admin Added + Built-in Seed Videos</small>
        </div>
      </div>

      <div class="panel-head" style="padding-top:14px;border-top:1px solid var(--line)">
        <div>
          <h2>🎭 Mood Breakdown (প্রতিটি মুডে ভিডিও সংখ্যা)</h2>
          <p>Islamic video ও General video-র প্রতিটি mood ফিল্টারে কয়টি করে ভিডিও আছে:</p>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Mood Category</th>
              <th>Islamic Videos Count</th>
              <th>General Videos Count</th>
              <th>Total Count in Mood</th>
            </tr>
          </thead>
          <tbody>
            ${Object.values(stats.moodStats).map(m => `
              <tr>
                <td><b>${esc(m.label)}</b></td>
                <td><span class="status-badge on" style="background:#e8f6ee;color:#075d52;border-color:#bce5d5">${m.islamic} টি ভিডিও</span></td>
                <td><span class="status-badge on">${m.general} টি ভিডিও</span></td>
                <td><b>${m.total} টি ভিডিও</b></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Managed videos</h2>
          <p>এই তালিকা admin panel থেকে যোগ করা video; project-এর built-in seed videos অপরিবর্তিত থাকে।</p>
        </div>
      </div>
      ${videoTable()}
    </section>
  </div>`;
}
function videoTable(){return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Video</th><th>Section</th><th>Moods</th><th>Status</th><th></th></tr></thead><tbody>${state.videos.length?state.videos.map(v=>`<tr><td><div style="display:flex;gap:10px;align-items:center"><img class="campaign-thumb" src="${esc(v.thumbnailUrl)}" alt=""><div><b>${esc(v.titleBn||v.title)}</b><small>${esc(v.youtubeId)} · ${esc(v.channelTitle||'YouTube')}</small></div></div></td><td>${esc(v.section)}<small>${esc(v.contentType)} · ${esc(v.durationSeconds||0)} sec</small></td><td>${esc((v.moods||[]).join(', ')||'All moods')}</td><td>${v.enabled?'<span class="status-badge on">Enabled</span>':'<span class="status-badge off">Disabled</span>'}</td><td><div class="row-actions"><button class="icon-btn" data-edit-video="${esc(v.id)}">Edit</button><button class="icon-btn" data-delete-video="${esc(v.id)}">Delete</button></div></td></tr>`).join(''):`<tr><td colspan="5" class="empty-table">Admin-managed video নেই। Built-in catalogue এখনও website-এ থাকবে।</td></tr>`}</tbody></table></div>`}
function renderSystem(){const sys=state.system||{};content.innerHTML=`<div class="page-stack"><section class="panel"><div class="panel-head"><div><h2>Firebase connection & project modules</h2><p>Admin panel এখন PHP বা server JSON file ব্যবহার করে না। Firebase Authentication access যাচাই করে এবং Realtime Database থেকে live settings load করে।</p></div><button class="secondary" data-action="refresh-system">Refresh connection</button></div><div class="three-col"><div class="guide-card"><h4>Project version</h4><p><b>${esc(sys.version||'unknown')}</b></p></div><div class="guide-card"><h4>Database</h4><p><b>${esc(sys.databaseMode||'Firebase')}</b></p></div><div class="guide-card"><h4>Authentication</h4><p><b>${esc(sys.authMode||'Firebase Auth')}</b></p></div></div><div style="margin-top:16px">${(sys.modules||[]).map(m=>`<div class="module-row"><div><b>${esc(m.label)}</b><small>${esc(m.path)}</small></div><div><small>Connection</small><div>Static ES module</div></div><span class="status-badge ${m.exists?'on':'off'}">${m.exists?'Connected':'Missing'} · ${esc(m.sha1||'')}</span></div>`).join('')}</div><div class="warning-box" style="margin-top:15px"><b>Automatic update-এর সীমা:</b> Existing settings ও registered selector rules realtime-এ update হয়। নতুন business feature code-এ যোগ করলে Feature Manager-এ selector rule বা registry entry যোগ করতে হবে; panel অজানা logic নিরাপদভাবে অনুমান করে না।</div></section><section class="two-col"><div class="panel"><div class="panel-head"><div><h2>Firebase operating guide</h2><p>Deployment-এর পর প্রয়োজনীয় workflow।</p></div></div><div class="guide-grid"><div class="guide-card"><h4>Site update</h4><ul><li>Site Control থেকে brand/contact edit করুন</li><li>Save করলে Firebase runtime সাথে সাথে update হবে</li><li>বড় deployment-এর আগে maintenance mode ON করুন</li></ul></div><div class="guide-card"><h4>Announcement</h4><ul><li>Topbar: ছোট জরুরি update</li><li>Feed: কম বিরক্তিকর detailed notice</li><li>Modal: শুধু critical announcement</li></ul></div><div class="guide-card"><h4>Advertisement</h4><ul><li>প্রথমে master OFF রেখে configuration করুন</li><li>Provider ও placement ঠিক করুন</li><li>Image upload browser-এ optimize হয়ে Database-এ campaign-এর সঙ্গে save হয়</li></ul></div><div class="guide-card"><h4>Firebase security</h4><ul><li><span class="code-chip">firebase-database.rules.json</span> deploy করুন</li><li>Admin UID-কে <span class="code-chip">adminUsers/{uid}/enabled=true</span> দিন</li><li>Test mode production-এ ব্যবহার করবেন না</li></ul></div></div></div><div class="panel"><div class="panel-head"><div><h2>Security</h2><p>Firebase administrator password পরিবর্তন করুন।</p></div></div><form id="passwordForm" class="form-grid"><div class="field full"><span>Current password</span><input type="password" name="currentPassword" required autocomplete="current-password"></div><div class="field full"><span>New password</span><input type="password" name="newPassword" minlength="10" required autocomplete="new-password"><small>কমপক্ষে ১০ অক্ষর।</small></div><div class="field full"><button class="primary" type="submit">Change password</button></div></form></div></section><section class="panel"><div class="panel-head"><div><h2>Audit log</h2><p>Firebase-এ সংরক্ষিত admin change history।</p></div></div>${auditMarkup(state.audit)}</section></div>`;document.querySelector('#passwordForm')?.addEventListener('submit',changePassword)}
function ruleEditor(rule={}){openModal(`${modalHead(rule.id?'Edit selector rule':'New selector rule')}<form id="ruleForm" class="modal-content form-grid"><input type="hidden" name="id" value="${esc(rule.id||'')}"><div class="field"><span>Rule label</span><input name="label" required value="${esc(rule.label||'')}"></div><div class="field"><span>Effect</span><select name="effect"><option value="hide" ${rule.effect==='hide'?'selected':''}>Hide matching elements</option><option value="disable" ${rule.effect==='disable'?'selected':''}>Disable matching elements</option><option value="class" ${rule.effect==='class'?'selected':''}>Add CSS class</option></select></div><div class="field full"><span>CSS selector</span><input name="selector" required value="${esc(rule.selector||'')}" placeholder="[data-nav='shop']"><small>Browser document.querySelectorAll-compatible selector দিন।</small></div><div class="field"><span>Class name (class effect only)</span><input name="className" value="${esc(rule.className||'')}"></div><div class="field">${switchMarkup('','Rule enabled','OFF করলে rule সংরক্ষিত থাকবে, apply হবে না।',rule.enabled!==false).replace('data-path=""','name="enabled"')}</div><div class="field full button-row"><button type="button" class="ghost" data-close-modal>Cancel</button><button type="submit" class="primary">Apply rule</button></div></form>`);document.querySelector('#ruleForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget),item={id:f.get('id')||`rule_${Date.now()}`,label:f.get('label'),selector:f.get('selector'),effect:f.get('effect'),className:f.get('className'),enabled:e.currentTarget.querySelector('[name=enabled]').checked};const rows=state.settings.featureRules||[];const i=rows.findIndex(x=>x.id===item.id);if(i>=0)rows[i]=item;else rows.unshift(item);closeModal();renderFeatures();toast('Rule added. Save feature controls to publish it.')})}
function announcementEditor(a={}){openModal(`${modalHead(a.id?'Edit announcement':'New announcement')}<form id="announcementForm" class="modal-content form-grid"><input type="hidden" name="id" value="${esc(a.id||'')}"><input type="hidden" name="createdAt" value="${esc(a.createdAt||'')}"><div class="field"><span>Bangla title</span><input name="titleBn" value="${esc(a.titleBn||'')}"></div><div class="field"><span>English title</span><input name="titleEn" value="${esc(a.titleEn||'')}"></div><div class="field"><span>Bangla message</span><textarea name="messageBn">${esc(a.messageBn||'')}</textarea></div><div class="field"><span>English message</span><textarea name="messageEn">${esc(a.messageEn||'')}</textarea></div><div class="field"><span>Placement</span><select name="placement"><option value="topbar" ${a.placement==='topbar'?'selected':''}>Top bar</option><option value="feed" ${a.placement==='feed'?'selected':''}>Feed card</option><option value="modal" ${a.placement==='modal'?'selected':''}>Modal popup</option></select><small>Modal শুধুমাত্র critical message-এর জন্য ব্যবহার করুন।</small></div><div class="field"><span>Message type</span><select name="type">${['info','success','warning','critical'].map(x=>`<option ${a.type===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><span>Audience language</span><select name="locale">${['all','bn','en'].map(x=>`<option ${a.locale===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><span>Priority (0–100)</span><input type="number" name="priority" min="0" max="100" value="${esc(a.priority??50)}"></div><div class="field"><span>Starts at</span><input type="datetime-local" name="startsAt" value="${esc(toLocalInput(a.startsAt))}"></div><div class="field"><span>Ends at</span><input type="datetime-local" name="endsAt" value="${esc(toLocalInput(a.endsAt))}"></div><div class="field"><span>Bangla action label</span><input name="actionLabelBn" value="${esc(a.actionLabelBn||'')}"></div><div class="field"><span>English action label</span><input name="actionLabelEn" value="${esc(a.actionLabelEn||'')}"></div><div class="field full"><span>Action URL</span><input type="url" name="actionUrl" value="${esc(a.actionUrl||'')}" placeholder="https://..."></div><div class="field">${switchMarkup('','Dismissible','Visitor message বন্ধ করতে পারবে।',a.dismissible!==false).replace('data-path=""','name="dismissible"')}</div><div class="field">${switchMarkup('','Enabled','OFF করলে schedule থাকলেও broadcast হবে না।',a.enabled!==false).replace('data-path=""','name="enabled"')}</div><div class="field full button-row"><button type="button" class="ghost" data-close-modal>Cancel</button><button type="submit" class="primary">Save & publish</button></div></form>`);document.querySelector('#announcementForm').addEventListener('submit',saveAnnouncement)}
function campaignEditor(c={}){const placements=c.placements||[];openModal(`${modalHead(c.id?'Edit advertisement campaign':'New direct advertisement')}<form id="campaignForm" class="modal-content form-grid"><input type="hidden" name="id" value="${esc(c.id||'')}"><input type="hidden" name="createdAt" value="${esc(c.createdAt||'')}"><div class="field"><span>Internal campaign name</span><input name="name" required value="${esc(c.name||'')}" placeholder="Eid campaign 2026"></div><div class="field"><span>Advertiser / sponsor</span><input name="advertiser" value="${esc(c.advertiser||'')}"></div><div class="field"><span>Ad creative type</span><select name="type"><option value="image" ${c.type==='image'?'selected':''}>Image banner</option><option value="native" ${c.type==='native'?'selected':''}>Native text + image</option><option value="video" ${c.type==='video'?'selected':''}>Video creative</option></select></div><div class="field"><span>Weight (1–100)</span><input type="number" name="weight" min="1" max="100" value="${esc(c.weight??10)}"><small>একই placement-এ একাধিক campaign থাকলে বেশি weight বেশি chance পাবে।</small></div><div class="field"><span>Bangla headline</span><input name="headlineBn" value="${esc(c.headlineBn||'')}"></div><div class="field"><span>English headline</span><input name="headlineEn" value="${esc(c.headlineEn||'')}"></div><div class="field"><span>Bangla body</span><textarea name="bodyBn">${esc(c.bodyBn||'')}</textarea></div><div class="field"><span>English body</span><textarea name="bodyEn">${esc(c.bodyEn||'')}</textarea></div><div class="field full"><span>Image URL</span><div style="display:flex;gap:8px"><input id="campaignImageUrl" name="imageUrl" value="${esc(c.imageUrl||'')}" placeholder="https://... or upload"><button type="button" class="secondary" data-action="choose-ad-image">Upload</button><input id="adImageFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden></div><small>Recommended: 1200×628 WEBP/JPG, সর্বোচ্চ 5 MB।</small></div><div class="field full"><span>Video URL (optional)</span><input type="url" name="videoUrl" value="${esc(c.videoUrl||'')}"></div><div class="field"><span>Bangla CTA</span><input name="ctaBn" value="${esc(c.ctaBn||'')}"></div><div class="field"><span>English CTA</span><input name="ctaEn" value="${esc(c.ctaEn||'')}"></div><div class="field full"><span>Destination URL</span><input type="url" name="targetUrl" value="${esc(c.targetUrl||'')}" placeholder="https://advertiser.example/"></div><div class="field"><span>Language target</span><select name="locale">${['all','bn','en'].map(x=>`<option ${c.locale===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><span>Device target</span><select name="device">${['all','mobile','desktop'].map(x=>`<option ${c.device===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field full"><span>Placements</span><div class="feature-grid">${Object.entries(placementMeta).map(([key,[title,desc]])=>`<label class="toggle-row"><div class="toggle-copy"><b>${esc(title)}</b><small>${esc(desc)}</small></div><span class="switch"><input type="checkbox" name="placements" value="${key}" ${placements.includes(key)?'checked':''}><i></i></span></label>`).join('')}</div></div><div class="field"><span>Starts at</span><input type="datetime-local" name="startsAt" value="${esc(toLocalInput(c.startsAt))}"></div><div class="field"><span>Ends at</span><input type="datetime-local" name="endsAt" value="${esc(toLocalInput(c.endsAt))}"></div><div class="field">${switchMarkup('','Campaign enabled','Schedule-এর ভেতরে থাকলে render হতে পারবে।',c.enabled!==false).replace('data-path=""','name="enabled"')}</div><div class="field full"><div class="info-box"><b>Rendering order:</b> Campaign অবশ্যই master ON, provider Direct/Hybrid, placement ON, schedule active এবং audience match হতে হবে।</div></div><div class="field full button-row"><button type="button" class="ghost" data-close-modal>Cancel</button><button type="submit" class="primary">Save campaign</button></div></form>`);document.querySelector('#campaignForm').addEventListener('submit',saveCampaign);document.querySelector('[data-action=choose-ad-image]').addEventListener('click',()=>document.querySelector('#adImageFile').click());document.querySelector('#adImageFile').addEventListener('change',uploadCampaignImage)}
async function fetchYouTubeMetadata(urlOrId) {
  let ytId = "";
  const str = String(urlOrId || "").trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    ytId = str;
  } else {
    const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/);
    if (match) ytId = match[1];
  }
  if (!ytId) return null;
  const targetUrl = `https://www.youtube.com/watch?v=${ytId}`;
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`);
    if (res.ok) {
      const data = await res.json();
      return { title: data.title || "", channelTitle: data.author_name || "", youtubeId: ytId };
    }
  } catch {}
  try {
    const res2 = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(targetUrl)}`);
    if (res2.ok) {
      const data2 = await res2.json();
      return { title: data2.title || "", channelTitle: data2.author_name || "", youtubeId: ytId };
    }
  } catch {}
  return null;
}

function videoEditor(v={}){const moods=v.moods||[];openModal(`${modalHead(v.id?'Edit video':'Add YouTube video')}<form id="videoForm" class="modal-content form-grid"><input type="hidden" name="id" value="${esc(v.id||'')}"><input type="hidden" name="addedAt" value="${esc(v.addedAt||'')}"><div class="field full"><span>YouTube URL or ID</span><input name="youtubeId" required value="${esc(v.youtubeId||'')}" placeholder="https://www.youtube.com/watch?v=..."></div><div class="field"><span>English/default title</span><input name="title" value="${esc(v.title||'')}"></div><div class="field"><span>Bangla title</span><input name="titleBn" value="${esc(v.titleBn||'')}"></div><div class="field"><span>Channel title</span><input name="channelTitle" value="${esc(v.channelTitle||'')}"></div><div class="field"><span>Section</span><select name="section"><option value="general" ${v.section==='general'?'selected':''}>General video</option><option value="islamic" ${v.section==='islamic'?'selected':''}>Islamic video (ad-free)</option></select></div><div class="field"><span>Content type</span><select name="contentType"><option value="video" ${v.contentType==='video'?'selected':''}>Regular video (max 15 min)</option><option value="short" ${v.contentType==='short'?'selected':''}>Shorts (max 90 sec)</option></select></div><div class="field"><span>Duration in seconds</span><input type="number" min="0" max="900" name="durationSeconds" value="${esc(v.durationSeconds||0)}"><small>Metadata না জানলে 0 রাখুন।</small></div><div class="field full"><span>Mood mapping</span><div class="feature-grid">${moodOptions.map(m=>`<label class="toggle-row"><div class="toggle-copy"><b>${m}</b><small>এই mood filter-এ video দেখাবে।</small></div><span class="switch"><input type="checkbox" name="moods" value="${m}" ${moods.includes(m)?'checked':''}><i></i></span></label>`).join('')}</div><small>কোনো mood select না করলে সব mood-এ eligible থাকবে।</small></div><div class="field">${switchMarkup('','Featured','Ranking-এ priority signal হিসেবে থাকবে।',Boolean(v.featured)).replace('data-path=""','name="featured"')}</div><div class="field">${switchMarkup('','Enabled','OFF করলে video সংরক্ষিত থাকবে কিন্তু website-এ দেখাবে না।',v.enabled!==false).replace('data-path=""','name="enabled"')}</div><div class="field full button-row"><button type="button" class="ghost" data-close-modal>Cancel</button><button type="submit" class="primary">Save video</button></div></form>`);const form=document.querySelector('#videoForm'),ytInput=form.querySelector('[name=youtubeId]');ytInput.addEventListener('change',async()=>{const val=ytInput.value.trim();if(!val)return;const meta=await fetchYouTubeMetadata(val);if(meta){if(meta.title&&!form.querySelector('[name=title]').value)form.querySelector('[name=title]').value=meta.title;if(meta.channelTitle&&!form.querySelector('[name=channelTitle]').value)form.querySelector('[name=channelTitle]').value=meta.channelTitle}});form.addEventListener('submit',saveVideo)}
function bulkVideoEditor(){openModal(`${modalHead('Bulk YouTube import')}<form id="bulkVideoForm" class="modal-content form-grid"><div class="field full"><span>YouTube links or IDs</span><textarea name="links" required rows="10" placeholder="One link per line"></textarea><small>সর্বোচ্চ ১০০টি; duplicate YouTube ID skip হবে। automatic title & channel name নিয়ে নেওয়া হবে।</small></div><div class="field"><span>Section</span><select name="section"><option value="general">General</option><option value="islamic">Islamic</option></select></div><div class="field"><span>Type</span><select name="contentType"><option value="video">Regular video</option><option value="short">Shorts</option></select></div><div class="field full"><span>Default title (Auto-fetched if left blank)</span><input name="title" value=""></div><div class="field full"><span>Moods</span><div class="feature-grid">${moodOptions.map(m=>`<label class="toggle-row"><b>${m}</b><span class="switch"><input type="checkbox" name="moods" value="${m}"><i></i></span></label>`).join('')}</div></div><div class="field full button-row"><button type="button" class="ghost" data-close-modal>Cancel</button><button type="submit" class="primary">Import videos</button></div></form>`);document.querySelector('#bulkVideoForm').addEventListener('submit',saveBulkVideos)}
async function saveSettings(){try{const r=await api('settings.save',{method:'POST',body:state.settings});state.settings=r.data;toast('Settings published successfully.');render()}catch(e){toast(e.message,true)}}
async function saveAnnouncement(e){e.preventDefault();const f=new FormData(e.currentTarget),body=Object.fromEntries(f);body.startsAt=fromLocalInput(body.startsAt);body.endsAt=fromLocalInput(body.endsAt);body.dismissible=e.currentTarget.querySelector('[name=dismissible]').checked;body.enabled=e.currentTarget.querySelector('[name=enabled]').checked;try{const r=await api('announcement.save',{method:'POST',body});state.announcements=r.data;closeModal();renderAnnouncements();toast('Announcement saved and runtime updated.')}catch(err){toast(err.message,true)}}
async function saveCampaign(e){e.preventDefault();const f=new FormData(e.currentTarget),body=Object.fromEntries(f);body.placements=f.getAll('placements');body.startsAt=fromLocalInput(body.startsAt);body.endsAt=fromLocalInput(body.endsAt);body.enabled=e.currentTarget.querySelector('[name=enabled]').checked;try{const r=await api('campaign.save',{method:'POST',body});state.campaigns=r.data;closeModal();renderAdvertising();toast('Advertisement campaign saved.')}catch(err){toast(err.message,true)}}
async function uploadCampaignImage(e){const file=e.target.files?.[0];if(!file)return;try{const dataUrl=await compressAdminImage(file);document.querySelector('#campaignImageUrl').value=dataUrl;toast('Image optimized. Campaign save করলে Firebase Database-এ সংরক্ষিত হবে।')}catch(err){toast(err.message,true)}}
async function saveVideo(e){e.preventDefault();const f=new FormData(e.currentTarget),body=Object.fromEntries(f);body.moods=f.getAll('moods');body.featured=e.currentTarget.querySelector('[name=featured]').checked;body.enabled=e.currentTarget.querySelector('[name=enabled]').checked;try{const r=await api('video.save',{method:'POST',body});state.videos=r.data;closeModal();renderVideos();toast('Video added to runtime catalogue.')}catch(err){toast(err.message,true)}}
async function saveBulkVideos(e){e.preventDefault();const f=new FormData(e.currentTarget),body=Object.fromEntries(f);body.moods=f.getAll('moods');try{const r=await api('video.bulk',{method:'POST',body});state.videos=r.data;closeModal();renderVideos();toast(`${r.added} videos imported.`)}catch(err){toast(err.message,true)}}
async function changePassword(e){e.preventDefault();const body=Object.fromEntries(new FormData(e.currentTarget));try{await api('password.change',{method:'POST',body});e.currentTarget.reset();toast('Password changed successfully.')}catch(err){toast(err.message,true)}}
async function removeItem(type,id){if(!confirm('এই item স্থায়ীভাবে delete করবেন?'))return;try{const r=await api(`${type}.delete`,{method:'POST',body:{id}});state[type==='announcement'?'announcements':type==='campaign'?'campaigns':'videos']=r.data;render();toast('Item deleted.')}catch(e){toast(e.message,true)}}
nav.addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b)setPage(b.dataset.page)});
document.addEventListener('input',e=>{const el=e.target.closest('[data-path]');if(!el||!state.settings)return;let value=el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value;setPath(state.settings,el.dataset.path,value)});
document.addEventListener('change',e=>{const el=e.target.closest('[data-path]');if(!el||!state.settings)return;let value=el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value;setPath(state.settings,el.dataset.path,value)});
document.addEventListener('click',async e=>{if(e.target.closest('[data-close-modal]')){closeModal();return}const go=e.target.closest('[data-go]');if(go){setPage(go.dataset.go);return}const a=e.target.closest('[data-action]');if(a){const x=a.dataset.action;if(x==='save-settings')saveSettings();if(x==='new-rule')ruleEditor();if(x==='new-announcement')announcementEditor();if(x==='new-campaign')campaignEditor();if(x==='new-video')videoEditor();if(x==='bulk-video')bulkVideoEditor();if(x==='refresh-system'){try{const r=await api('system');state.system=r.data;renderSystem();toast('Firebase connection refreshed.')}catch(err){toast(err.message,true)}}return}const editRule=e.target.closest('[data-edit-rule]');if(editRule){ruleEditor((state.settings.featureRules||[]).find(x=>x.id===editRule.dataset.editRule));return}const delRule=e.target.closest('[data-delete-rule]');if(delRule){state.settings.featureRules=(state.settings.featureRules||[]).filter(x=>x.id!==delRule.dataset.deleteRule);renderFeatures();toast('Rule removed locally. Save to publish.');return}const ea=e.target.closest('[data-edit-announcement]');if(ea){announcementEditor(state.announcements.find(x=>x.id===ea.dataset.editAnnouncement));return}const da=e.target.closest('[data-delete-announcement]');if(da){removeItem('announcement',da.dataset.deleteAnnouncement);return}const ec=e.target.closest('[data-edit-campaign]');if(ec){campaignEditor(state.campaigns.find(x=>x.id===ec.dataset.editCampaign));return}const dc=e.target.closest('[data-delete-campaign]');if(dc){removeItem('campaign',dc.dataset.deleteCampaign);return}const ev=e.target.closest('[data-edit-video]');if(ev){videoEditor(state.videos.find(x=>x.id===ev.dataset.editVideo));return}const dv=e.target.closest('[data-delete-video]');if(dv){removeItem('video',dv.dataset.deleteVideo);return}});
document.querySelector('#mobileMenu').addEventListener('click',()=>document.querySelector('#sidebar').classList.toggle('open'));
modal.addEventListener('click',e=>{if(e.target.classList.contains('modal-shade'))closeModal()});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal()});
document.querySelector('#adminSignOut')?.addEventListener('click',async()=>{try{await adminSignOut()}finally{location.replace('login.html')}});
loadAll();
