import fs from "node:fs";
import vm from "node:vm";
const source=fs.readFileSync(new URL("../assets/js/platform.js",import.meta.url),"utf8").replace("export function initPlatform","function initPlatform")+"\nresult=initPlatform();";
function runCase(name,{ua,platform,width,height,touch=0,coarse=false,standalone=false,search="",referrer=""}){
  const classes=new Set();
  const context={
    result:null,
    navigator:{userAgent:ua,platform,maxTouchPoints:touch,userAgentData:{platform},vibrate(){}},
    screen:{width,height},
    window:{innerWidth:width,innerHeight:height},
    location:{search},
    document:{referrer,documentElement:{dataset:{}},body:{classList:{toggle(n,on){on?classes.add(n):classes.delete(n)}}}},
    matchMedia(q){
      if(q.includes('display-mode: standalone'))return{matches:standalone};
      if(q.includes('display-mode'))return{matches:false};
      if(q.includes('pointer: coarse'))return{matches:coarse};
      if(q.includes('prefers-color-scheme'))return{matches:false};
      return{matches:false};
    }
  };
  vm.createContext(context);vm.runInContext(source,context);return{name,result:context.result,classes};
}
const androidMobileUa="Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/125 Mobile Safari/537.36";
const androidDesktopUa="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/125 Safari/537.36";
const windowsUa="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36";
const ipadUa="Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1";
const cases=[
 ["Normal phone browser",{ua:androidMobileUa,platform:"Android",width:412,height:915,touch:5,coarse:true,standalone:false},"mobile"],
 ["Phone browser with desktop-style UA",{ua:androidDesktopUa,platform:"Android",width:980,height:1740,touch:5,coarse:true,standalone:false},"desktop"],
 ["Installed phone PWA",{ua:androidDesktopUa,platform:"Android",width:412,height:915,touch:5,coarse:true,standalone:true},"mobile"],
 ["Installed phone PWA start URL hint",{ua:androidDesktopUa,platform:"Android",width:412,height:915,touch:5,coarse:true,standalone:false,search:"?source=pwa&lang=en"},"mobile"],
 ["Tablet browser",{ua:ipadUa,platform:"iPad",width:1024,height:1366,touch:5,coarse:true,standalone:false},"desktop"],
 ["Installed desktop PWA",{ua:windowsUa,platform:"Win32",width:1440,height:900,touch:0,coarse:false,standalone:true},"desktop"],
 ["Normal desktop website",{ua:windowsUa,platform:"Win32",width:1440,height:900,touch:0,coarse:false,standalone:false},"desktop"]
];
for(const [name,args,expected] of cases){const item=runCase(name,args);if(item.result.layout!==expected){console.error('FAIL -',name,item.result);process.exitCode=1}else console.log('PASS -',name,'=>',item.result.layout);}
