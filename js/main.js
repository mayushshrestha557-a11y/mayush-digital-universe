import {createIntro,createWorld} from "./world.js";
import {translations} from "./translations.js";
import {openPage} from "./pages.js";

function startPortfolio() {
const $=s=>document.querySelector(s);
const intro=$("#intro"),universe=$("#universe"),layer=$("#pageLayer"),content=$("#pageContent");
let soundOn=true,audioCtx=null,worldCleanup=null;
function tone(freq=440,duration=.12,type="sine",volume=.035){if(!soundOn)return;try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==="suspended")audioCtx.resume();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(volume,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration);}catch(e){}}
function chime(){tone(392,.18);setTimeout(()=>tone(587,.2),130);setTimeout(()=>tone(784,.35),260);}
const stopIntro=createIntro($("#introCanvas"));
let progress=0;const bar=$("#loadingBar");const timer=setInterval(()=>{progress=Math.min(100,progress+Math.random()*8+2);bar.style.width=progress+"%";if(progress>=100)clearInterval(timer);},180);
function enter(){
  tone(220,.15,"triangle");
  setTimeout(chime,150);
  intro.classList.add("exit");

  setTimeout(()=>{
    stopIntro?.();
    intro.classList.add("hidden");
    universe.classList.remove("hidden");
    worldCleanup=createWorld($("#worldCanvas"));
  },850);

  $("#audioHint").classList.add("off");
}
$("#enterWorld").addEventListener("click",enter);intro.addEventListener("pointerdown",()=>{if(audioCtx===null){tone(660,.08);$("#audioHint").classList.add("off");}});
function closePage(){layer.classList.remove("open");layer.setAttribute("aria-hidden","true");tone(330,.1);setTimeout(()=>content.innerHTML="",500);}
function showPage(id){openPage(id,content);layer.classList.add("open");layer.setAttribute("aria-hidden","false");tone(520,.09,"triangle");}
document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.open)));
$("#backHome").addEventListener("click",closePage);$("#closePage").addEventListener("click",closePage);$("#homeBrand").addEventListener("click",e=>{e.preventDefault();closePage();window.scrollTo({top:0,behavior:"smooth"});});
$("#menuToggle").addEventListener("click",()=>{document.querySelector(".portal-section").scrollIntoView({behavior:"smooth"});tone(600,.08);});
$("#soundToggle").addEventListener("click",()=>{soundOn=!soundOn;$("#soundToggle").textContent=soundOn?"♫":"♩̸";if(soundOn)tone(660,.12);});
$("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("day");$("#themeToggle").textContent=document.body.classList.contains("day")?"☾":"☼";tone(500,.08);});
function setLanguage(lang){document.documentElement.lang=lang;document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(translations[lang][key])el.textContent=translations[lang][key];});}
$("#languageSelect").addEventListener("change",e=>{setLanguage(e.target.value);tone(720,.1);});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePage();});
window.addEventListener("beforeunload",()=>{stopIntro?.();worldCleanup?.();});
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startPortfolio, { once: true });
} else {
  startPortfolio();
}

