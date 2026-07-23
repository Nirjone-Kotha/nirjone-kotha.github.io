import { CORE_MOODS, createAdminVideoDraft, createBulkAdminDrafts, createAdminVideoDraftAsync, createBulkAdminDraftsAsync, validateVideoMetadata } from "../../assets/js/video_catalog.js";

const moodLabels={lonely:"Lonely",sad:"Sad",anxious:"Anxious",overwhelmed:"Overwhelmed",angry:"Angry",numb:"Numb",lost:"Lost",hopeful:"Hopeful"};
const $=selector=>document.querySelector(selector);
let config={};let drafts=[];

async function loadConfig(){
  try{config=await (await fetch("../../config/site.json",{cache:"no-store"})).json();}
  catch{config={};}
  const enabled=Boolean(config?.adminTools?.enabled),endpoint=config?.youtube?.adminBulkVideoEndpoint||config?.youtube?.adminVideoEndpoint||"";
  $("#status").textContent=enabled&&endpoint?"Admin endpoint is configured. Server-side authentication and validation are still required.":"Preview/export mode only. Admin tools are disabled or no server endpoint is configured.";
}
function selectedMoods(){return [...document.querySelectorAll('[name="mood"]:checked')].map(input=>input.value)}
function options(){return {section:$("#section").value,contentType:$("#format").value,moods:selectedMoods()}}
function render(){
  $("#summary").textContent=drafts.length?`${drafts.length} record(s) prepared. Metadata must be validated by the backend before publication.`:"No records prepared.";
  $("#preview").innerHTML=drafts.map(item=>{const validation=validateVideoMetadata(item);return `<article class="video"><img src="${item.thumbnailUrl}" alt=""><div><strong>${item.title||item.youtubeId}</strong><small>${item.section} · ${item.contentType} · ${item.moods.length?item.moods.join(", "):"all moods"}</small><span class="status ${validation.ok?"ok":"bad"}">${validation.ok?item.metadataStatus:validation.errors.join(", ")}</span></div></article>`}).join("");
}
function append(items){const seen=new Set(drafts.map(item=>`${item.section}:${item.youtubeId}:${item.moods.join("|")}`));for(const item of items){const key=`${item.section}:${item.youtubeId}:${item.moods.join("|")}`;if(!seen.has(key)){drafts.push(item);seen.add(key)}}render()}
function download(){const blob=new Blob([JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),records:drafts},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="moner-kotha-video-import.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
async function upload(){
  const endpoint=config?.youtube?.adminBulkVideoEndpoint||config?.youtube?.adminVideoEndpoint||"";
  if(!config?.adminTools?.enabled||!endpoint){alert("Admin upload is not enabled. Export JSON and connect a secure backend endpoint first.");return}
  const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({records:drafts})});
  if(!response.ok)throw new Error(`Upload failed: ${response.status}`);alert("Records sent to the configured endpoint for server-side validation.");
}

$("#moods").innerHTML=CORE_MOODS.map(mood=>`<label><input type="checkbox" name="mood" value="${mood}">${moodLabels[mood]}</label>`).join("");
$("#addSingle").addEventListener("click",async()=>{const val=$("#single").value;if(!val)return;$("#status").textContent="Fetching video details...";try{const item=await createAdminVideoDraftAsync({url:val,...options()});append([item]);$("#single").value="";$("#status").textContent=`Added: ${item.title}`}catch(error){alert(error.message)}});
$("#addBulk").addEventListener("click",async()=>{const val=$("#bulk").value;if(!val)return;$("#status").textContent="Fetching videos details in bulk...";try{const items=await createBulkAdminDraftsAsync({links:val,...options()});if(!items.length){alert("No valid YouTube links found.");return}append(items);$("#bulk").value="";$("#status").textContent=`Added ${items.length} video(s) with automatic titles.`}catch(error){alert(error.message)}});
$("#clear").addEventListener("click",()=>{drafts=[];render()});
$("#export").addEventListener("click",download);
$("#upload").addEventListener("click",()=>upload().catch(error=>alert(error.message)));
loadConfig();render();
