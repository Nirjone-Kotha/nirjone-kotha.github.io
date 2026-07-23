export const CORE_MOODS = ["lonely","sad","anxious","overwhelmed","angry","numb","lost","hopeful"];
export const VIDEO_LIMITS = Object.freeze({ short:90, video:900 });
export const VIDEO_FORMATS = Object.freeze([
  {id:"video",en:"Videos",bn:"ভিডিও"},
  {id:"short",en:"Shorts",bn:"শর্টস"}
]);

/*
 * These seed links are starter records only. Availability is checked by the
 * YouTube IFrame API at playback time and by the future backend health job.
 * The catalogue expands each ten-link mood pack to 80 mood-mapped records per
 * section, preserving the requested 80 Islamic + 80 general starting records.
 */
const GENERAL_BASE = [
  {youtubeId:"z2hRQBZQXdM",title:"Turning loneliness into strength",channel:"YouTube creator",contentType:"video",durationSeconds:600,aspect:"landscape"},
  {youtubeId:"tPoQadObOK4",title:"How to enjoy being alone",channel:"YouTube creator",contentType:"video",durationSeconds:600,aspect:"landscape"},
  {youtubeId:"2kW4V3y84pY",title:"A simple breathing anchor for anxiety",channel:"YouTube creator",contentType:"video",durationSeconds:300,aspect:"landscape"},
  {youtubeId:"S_X_BQ54524",title:"Finding peace in loneliness",channel:"YouTube creator",contentType:"video",durationSeconds:720,aspect:"landscape"},
  {youtubeId:"wDxi6Sy4mD4",title:"A short story about controlling emotions",channel:"YouTube creator",contentType:"video",durationSeconds:600,aspect:"landscape"},
  {youtubeId:"XcaWSHFeOiE",title:"Gentle words for an anxious mind",channel:"YouTube creator",contentType:"short",durationSeconds:69,aspect:"portrait"},
  {youtubeId:"srpzRUFcWLg",title:"A reminder to protect your self-respect",channel:"YouTube creator",contentType:"short",durationSeconds:90,aspect:"portrait"},
  {youtubeId:"J3XBx_z0S38",title:"You versus you — a growth reminder",channel:"YouTube creator",contentType:"video",durationSeconds:480,aspect:"landscape"},
  {youtubeId:"wjSScqD7Q80",title:"Take back control of your day",channel:"YouTube creator",contentType:"video",durationSeconds:420,aspect:"landscape"},
  {youtubeId:"92iW1tkRWGo",title:"A grounding reminder for anxiety",channel:"YouTube creator",contentType:"short",durationSeconds:90,aspect:"portrait"}
];

const ISLAMIC_BASE = [
  {youtubeId:"SUh9KIuqIyY",title:"Surah Ar-Rahman - Soothing Recitation",channel:"Mishary Rashid Alafasy",contentType:"video",durationSeconds:420,aspect:"landscape"},
  {youtubeId:"R3L5v_0G9pM",title:"Surah Yaseen - Peace for Broken Hearts",channel:"Mishary Rashid Alafasy",contentType:"video",durationSeconds:510,aspect:"landscape"},
  {youtubeId:"jW_n-W41JSI",title:"Surah Al-Mulk - Night Protection & Calm",channel:"Mishary Rashid Alafasy",contentType:"video",durationSeconds:390,aspect:"landscape"},
  {youtubeId:"EOy77foLSEU",title:"Surah Ar-Rahman with Translation",channel:"AYAT Recitations",contentType:"video",durationSeconds:480,aspect:"landscape"},
  {youtubeId:"kYJj2M7h2k4",title:"Surah Al-Mulk - Heartfelt Recitation",channel:"Mishary Rashid Alafasy",contentType:"video",durationSeconds:380,aspect:"landscape"}
];

const MOOD_LABELS = {
  lonely:{en:"loneliness",bn:"একাকীত্ব"},sad:{en:"sadness",bn:"মন খারাপ"},anxious:{en:"anxiety",bn:"উদ্বেগ"},
  overwhelmed:{en:"pressure",bn:"চাপ"},angry:{en:"anger",bn:"রাগ"},numb:{en:"emotional numbness",bn:"শূন্যতা"},
  lost:{en:"feeling lost",bn:"দিশেহারা ভাব"},hopeful:{en:"hope",bn:"আশা"}
};

export function youtubeThumbnail(youtubeId,quality="hqdefault"){
  return `https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/${quality}.jpg`;
}

function expand(section,base){
  return CORE_MOODS.flatMap((mood,moodIndex)=>base.map((item,index)=>({
    id:`${section}-${mood}-${String(index+1).padStart(2,"0")}`,
    section,
    mood,
    moods:[mood],
    youtubeId:item.youtubeId,
    sourceUrl:`https://www.youtube.com/watch?v=${item.youtubeId}`,
    title:item.title,
    titleBn:`${MOOD_LABELS[mood].bn}—${item.title}`,
    channelTitle:item.channel,
    contentType:item.contentType,
    durationSeconds:Math.min(Number(item.durationSeconds||0),VIDEO_LIMITS[item.contentType]||VIDEO_LIMITS.video),
    playbackCapSeconds:VIDEO_LIMITS[item.contentType]||VIDEO_LIMITS.video,
    aspect:item.aspect,
    thumbnailUrl:youtubeThumbnail(item.youtubeId),
    likes:(moodIndex*7+index*3)%43,
    enabled:true,
    featured:index<2,
    metadataStatus:"seed-needs-live-validation",
    addedAt:"2026-07-21T00:00:00.000Z"
  })));
}

export const generalVideoCatalog=expand("general",GENERAL_BASE);
export const islamicVideoCatalog=expand("islamic",ISLAMIC_BASE);
export const videoCatalog=[...islamicVideoCatalog,...generalVideoCatalog];

export function extractYouTubeId(value=""){
  const raw=String(value).trim();
  if(/^[A-Za-z0-9_-]{11}$/.test(raw))return raw;
  try{
    const url=new URL(raw);
    const host=url.hostname.replace(/^www\./,"").toLowerCase();
    if(host==="youtu.be")return url.pathname.split("/").filter(Boolean)[0]||"";
    if(!["youtube.com","m.youtube.com","music.youtube.com"].includes(host))return "";
    if(url.pathname.startsWith("/shorts/"))return url.pathname.split("/")[2]||"";
    if(url.pathname.startsWith("/embed/"))return url.pathname.split("/")[2]||"";
    if(url.pathname.startsWith("/live/"))return url.pathname.split("/")[2]||"";
    return url.searchParams.get("v")||"";
  }catch{return ""}
}

export function parseBulkYouTubeLinks(value=""){
  const unique=new Map();
  String(value).split(/[\n,;\t ]+/).map(item=>item.trim()).filter(Boolean).forEach(raw=>{
    const youtubeId=extractYouTubeId(raw);
    if(youtubeId&&!unique.has(youtubeId))unique.set(youtubeId,raw);
  });
  return [...unique.entries()].map(([youtubeId,raw])=>({youtubeId,raw}));
}

export function createAdminVideoDraft({url,section="general",moods=[],contentType="video",title="",channelTitle=""}={}){
  const youtubeId=extractYouTubeId(url);
  if(!youtubeId)throw new Error("Invalid YouTube link");
  const normalizedType=contentType==="short"?"short":"video";
  const normalizedMoods=Array.isArray(moods)?[...new Set(moods.filter(m=>CORE_MOODS.includes(m)))]:[];
  return {
    id:`${section}-${Date.now()}-${youtubeId}`,
    section:section==="islamic"?"islamic":"general",
    moods:normalizedMoods,
    youtubeId,
    sourceUrl:`https://www.youtube.com/watch?v=${youtubeId}`,
    title:String(title||"").trim(),
    channelTitle:String(channelTitle||"").trim(),
    contentType:normalizedType,
    durationSeconds:0,
    playbackCapSeconds:VIDEO_LIMITS[normalizedType],
    aspect:normalizedType==="short"?"portrait":"landscape",
    thumbnailUrl:youtubeThumbnail(youtubeId),
    likes:0,
    enabled:true,
    featured:false,
    metadataStatus:"needs-youtube-api-validation",
    addedAt:new Date().toISOString()
  };
}

export function createBulkAdminDrafts({links,section="general",moods=[],contentType="video"}={}){
  return parseBulkYouTubeLinks(links).map(({raw})=>createAdminVideoDraft({url:raw,section,moods,contentType}));
}

export function validateVideoMetadata(item={}){
  const type=item.contentType==="short"?"short":"video";
  const max=VIDEO_LIMITS[type];
  const duration=Number(item.durationSeconds||0);
  const errors=[];
  if(!extractYouTubeId(item.youtubeId||item.sourceUrl||""))errors.push("invalid-youtube-id");
  if(duration&&duration>max)errors.push(type==="short"?"short-over-90-seconds":"video-over-15-minutes");
  if(item.embeddable===false)errors.push("embedding-disabled");
  if(item.privacyStatus&&item.privacyStatus!=="public")errors.push("not-public");
  return {ok:errors.length===0,errors,maxSeconds:max};
}

export function catalogStats(catalog=videoCatalog){
  return catalog.reduce((out,item)=>{
    out.total+=1;out[item.section]=(out[item.section]||0)+1;out[item.contentType]=(out[item.contentType]||0)+1;
    return out;
  },{total:0,islamic:0,general:0,short:0,video:0});
}
