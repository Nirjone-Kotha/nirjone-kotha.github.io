const memory = new Map();
globalThis.localStorage = {
  getItem: key => memory.has(key) ? memory.get(key) : null,
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: key => memory.delete(key),
  key: index => [...memory.keys()][index] ?? null,
  get length(){ return memory.size; }
};
globalThis.CustomEvent = class CustomEvent { constructor(type, init={}){ this.type=type; this.detail=init.detail; } };
globalThis.window = {
  addEventListener(){}, removeEventListener(){}, dispatchEvent(){ return true; }
};
let removals=0;
globalThis.document = {
  documentElement: { classList: { toggle(){} } },
  querySelectorAll(selector){
    if(selector==='[data-ad-slot-id]')return [{remove(){removals++}}];
    if(selector==='.desktop-ad-mount')return [{hidden:false}];
    return [];
  }
};
globalThis.CSS = { escape: value => String(value) };

const ads = await import('../assets/js/ads.js');
const initial = ads.getAdSettings();
if (initial.masterEnabled !== false) throw new Error('Master ads must default to OFF');
for (const placement of Object.values(ads.AD_PLACEMENTS)) {
  if (initial.placements[placement] !== false) throw new Error(`${placement} must default to OFF`);
}
ads.setMasterAdsEnabled(true);
ads.setAdPlacementEnabled(ads.AD_PLACEMENTS.FEED_IN_FEED, true);
if (!ads.isAdSlotEnabled({placement:ads.AD_PLACEMENTS.FEED_IN_FEED,slotId:'feed-10'})) throw new Error('Enabled placement should enable its slot');
ads.setAdSlotEnabled('feed-10', false);
if (ads.isAdSlotEnabled({placement:ads.AD_PLACEMENTS.FEED_IN_FEED,slotId:'feed-10'})) throw new Error('Per-slot OFF override failed');
ads.setAdSlotEnabled('feed-18', true);
if (!ads.isAdSlotEnabled({placement:ads.AD_PLACEMENTS.FEED_IN_FEED,slotId:'feed-18'})) throw new Error('Per-slot ON override failed');
ads.setAdSafeMode(true,'modal');
if(removals!==0)throw new Error('Transient modal must hide, not destroy ad nodes');
if (ads.isAdSlotEnabled({placement:ads.AD_PLACEMENTS.FEED_IN_FEED,slotId:'feed-18'})) throw new Error('Safe mode must suppress ads');
ads.setAdSafeMode(false,'modal');
ads.setAdSafeMode(true,'high-risk-feed');
if(removals===0)throw new Error('Permanent safety reason must remove ad nodes');
ads.setAdSafeMode(false,'high-risk-feed');
if (!ads.shouldInsertInFeedAd(10) || !ads.shouldInsertInFeedAd(18) || ads.shouldInsertInFeedAd(17)) throw new Error('Feed schedule failed');
const policy=ads.getAdRequestPolicy();
if (policy.personalized || policy.useMoodForTargeting || policy.usePostContentForTargeting) throw new Error('Sensitive targeting policy failed');
ads.resetAdSettings();
console.log(JSON.stringify({status:'PASS',placements:Object.keys(initial.placements).length,schedule:[10,18,26]}));
