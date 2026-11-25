const villages = ["Nayabasti","Patihani","Jagatpur","Mangalpur","Bharatpur-24","Bharatpur","Narayanghat"];
export function renderGame(){
 return `<div class="eyebrow">INTERACTIVE LOCAL EXPLORER / 06</div><h1>CHITWAN <span>TRAIL.</span></h1>
 <p class="lead">A small journey inspired by the places around my home in Chitwan. Move along the route from Nayabasti through Patihani and onward to Narayanghat.</p>
 <div class="game-box"><div class="game-location" id="gameLocation">START: NAYABASTI</div><div class="game-track"><div class="game-progress" id="gameProgress"></div></div><p id="gameMessage">Ready to explore? Press the button to travel to the next place.</p><div class="game-controls"><button id="nextVillage">NEXT LOCATION →</button><button id="resetVillage">↺ RESTART</button></div><p><small>ROUTE · ${villages.join(" → ")}</small></p></div>`;
}
export function initGame(){
 let index=0; const loc=document.getElementById("gameLocation"), progress=document.getElementById("gameProgress"), msg=document.getElementById("gameMessage");
 const update=()=>{loc.textContent=(index===villages.length-1?"DESTINATION: ":"NOW EXPLORING: ")+villages[index].toUpperCase();progress.style.width=(index/(villages.length-1)*100)+"%";msg.textContent=index===villages.length-1?"You made it to Narayanghat! Journey completed.":"Next stop: "+villages[Math.min(index+1,villages.length-1)]+". Keep exploring!";};
 document.getElementById("nextVillage").addEventListener("click",()=>{index=Math.min(index+1,villages.length-1);update();});
 document.getElementById("resetVillage").addEventListener("click",()=>{index=0;update();});update();
}
