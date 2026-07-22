import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
class ClassList{constructor(){this.values=new Set()}toggle(name,on){if(on===undefined){this.values.has(name)?this.values.delete(name):this.values.add(name)}else on?this.values.add(name):this.values.delete(name)}add(...names){names.forEach(name=>this.values.add(name))}remove(...names){names.forEach(name=>this.values.delete(name))}contains(name){return this.values.has(name)}}
class FakeElement{
  constructor(name="div"){this.nodeName=name.toUpperCase();this.dataset={};this.style={};this.classList=new ClassList();this.children=[];this.hidden=false;this.disabled=false;this.value="";this.textContent="";this.innerHTML="";this.content="";this.offsetParent={};this.attributes={}}
  appendChild(el){this.children.push(el);el.parentNode=this;return el}replaceChildren(...els){this.children=[...els]}
  insertBefore(el,ref){const index=this.children.indexOf(ref);if(index<0)this.children.push(el);else this.children.splice(index,0,el);el.parentNode=this;return el}
  remove(){if(this.parentNode){const index=this.parentNode.children.indexOf(this);if(index>=0)this.parentNode.children.splice(index,1)}}
  addEventListener(){}removeEventListener(){}setAttribute(key,value){this.attributes[key]=String(value)}removeAttribute(key){delete this.attributes[key]}
  querySelector(){return null}querySelectorAll(){return []}focus(){}select(){}click(){}scrollTo(){}getBoundingClientRect(){return{left:0,top:0,width:100,height:100}}
}
const elements=new Map();
const getElement=selector=>{if(!elements.has(selector))elements.set(selector,new FakeElement());return elements.get(selector)};
const body=getElement("body"),documentElement=getElement("html");
const document={baseURI:"https://example.test/",body,documentElement,activeElement:null,querySelector(selector){if(selector==='meta[name="app-public-url"]'){const el=getElement(selector);el.content="";return el}return getElement(selector)},querySelectorAll(){return[]},createElement(name){return new FakeElement(name)},addEventListener(){},removeEventListener(){},execCommand(){return true}};
const values=new Map();
const localStorage={setItem(key,value){values.set(key,String(value))},getItem(key){return values.has(key)?values.get(key):null},removeItem(key){values.delete(key)},key(index){return[...values.keys()][index]||null},get length(){return values.size}};
const location={protocol:"https:",hostname:"example.test",origin:"https://example.test",href:"https://example.test/",search:"",reload(){}};
const window={innerWidth:1440,innerHeight:900,document,localStorage,location,addEventListener(){},removeEventListener(){},dispatchEvent(){},open(){return null}};
Object.defineProperty(globalThis,"navigator",{value:{userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64)",platform:"Win32",maxTouchPoints:0,onLine:true,hardwareConcurrency:8,connection:{saveData:false},vibrate(){},clipboard:{writeText:async()=>{}},serviceWorker:undefined},configurable:true});
Object.assign(globalThis,{window,document,localStorage,location,screen:{width:1440,height:900},innerWidth:1440,innerHeight:900,matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail}},HTMLElement:FakeElement,HTMLCanvasElement:FakeElement,requestAnimationFrame:callback=>{callback();return 1},cancelAnimationFrame(){},scrollTo(){},confirm(){return true},Image:class{},BroadcastChannel:class{postMessage(){}addEventListener(){}removeEventListener(){}},fetch:async()=>({ok:true,status:200,json:async()=>JSON.parse(fs.readFileSync(path.join(root,"config/site.json"),"utf8"))}),Notification:class{static permission="default";static requestPermission=async()=>"granted"},File:class{},CSS:{escape:value=>String(value)}});
const originalSetInterval=globalThis.setInterval;globalThis.setInterval=(callback,ms)=>{const timer=originalSetInterval(callback,ms);timer.unref?.();return timer};
await import(`${pathToFileURL(path.join(root,"assets/js/app.js")).href}?runtime=${Date.now()}`);
if(documentElement.dataset.layout!=="desktop")throw new Error(`Unexpected layout: ${documentElement.dataset.layout}`);
if(document.title!=="Moner Kotha: Anonymous Social Site")throw new Error(`Unexpected title: ${document.title}`);
if(!body.classList.contains("force-desktop-layout"))throw new Error("Desktop layout class was not applied");
console.log(JSON.stringify({status:"PASS",layout:documentElement.dataset.layout,title:document.title,elements:elements.size}));
