
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const villages = [
  "NAYABASTI", "PATIHANI", "JAGATPUR", "MANGALPUR",
  "BHARATPUR-24", "BHARATPUR", "NARAYANGHAT"
];

export function renderGame() {
  return `
  <section id="gtaGame" class="gta-game">
    <style>
      .gta-game{color:#fff;font-family:inherit}
      .gta-game .gta-head{display:flex;gap:9px;flex-wrap:wrap;margin:12px 0}
      .gta-game .gta-stat{background:#101c25;border:1px solid #314652;padding:9px 13px;border-radius:10px;flex:1;min-width:90px}
      .gta-game .gta-stat small{display:block;color:#9eb3bc;font-size:10px;letter-spacing:1px}
      .gta-game .gta-stat strong{font-size:16px;color:#c8f7d1}
      .gta-game .gta-screen{height:min(74vh,720px);min-height:430px;position:relative;overflow:hidden;background:#83b7d2;border-radius:16px;border:1px solid #496775;touch-action:none}
      .gta-game canvas{display:block;width:100%;height:100%}
      .gta-game .gta-hud{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;gap:8px;pointer-events:none}
      .gta-game .gta-pill{background:#07151bdc;padding:8px 11px;border-radius:9px;font-size:10px;letter-spacing:1px}
      .gta-game .gta-overlay{position:absolute;inset:0;background:linear-gradient(130deg,#06131deF,#0b1b20b8);display:flex;align-items:center;justify-content:center;text-align:center;padding:22px}
      .gta-game .gta-overlay[hidden]{display:none}
      .gta-game .gta-panel{max-width:440px}
      .gta-game .gta-kicker{font-size:10px;letter-spacing:4px;color:#b7f4c5}
      .gta-game .gta-portrait{width:92px;height:92px;object-fit:cover;border-radius:50%;border:2px solid #b7f4c5;box-shadow:0 0 28px #8ce9b477;margin:0 auto 12px;display:block}
      .gta-game .gta-panel h2{font-size:clamp(27px,6vw,43px);letter-spacing:2px;margin:10px 0;color:#e9fff0;text-shadow:0 4px 22px #000}
      .gta-game .gta-panel p{font-size:13px;line-height:1.8;color:#d9e8e8;min-height:48px}
      .gta-game button{border:0;border-radius:10px;padding:12px 15px;font-weight:800;cursor:pointer;touch-action:none}
      .gta-game .gta-main{background:linear-gradient(120deg,#d6ffcf,#78dba0);color:#10251a;box-shadow:0 5px 24px #76e69b44}
      .gta-game .gta-bottom{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:12px;flex-wrap:wrap}
      .gta-game .gta-pad{display:grid;grid-template-columns:repeat(3,48px);grid-template-rows:repeat(2,43px);gap:5px}
      .gta-game .gta-pad button,.gta-game .gta-actions button{background:#172d38;color:#fff;border:1px solid #49616b;font-size:15px}
      .gta-game .gta-actions{display:flex;gap:7px;flex-wrap:wrap}
      .gta-game .gta-actions button{font-size:10px;padding:12px 9px}
      .gta-game .gta-pad button:active,.gta-game .gta-actions button:active{background:#b7f4c5;color:#10251a}
      .gta-game .gta-bar{height:5px;background:#243640;border-radius:10px;margin:8px 0 13px;overflow:hidden}
      .gta-game .gta-bar span{display:block;height:100%;background:#b7f4c5;width:0}
      .gta-game .gta-dialogue{position:absolute;left:5%;right:5%;bottom:15px;background:#07151beF;border:1px solid #9ac9aa66;border-radius:13px;padding:13px 15px;text-align:left;display:none;backdrop-filter:blur(8px)}
      .gta-game .gta-dialogue b{display:block;color:#b7f4c5;font-size:11px;letter-spacing:1px;margin-bottom:5px}
      .gta-game .gta-dialogue span{font-size:13px;line-height:1.6}
      .gta-game .gta-help{font-size:11px;color:#9eb3bc;line-height:1.6;margin-top:12px}
      .gta-game .gta-empty{visibility:hidden}
    </style>

    <div class="eyebrow">MAYUSH.GAMEPLAY / CHITWAN • NEPAL</div>
    <h1>MAYUSH <span>OPEN WORLD.</span></h1>
    <p class="lead">A journey through Nayabasti, village life and the road to Narayanghat.</p>

    <div class="gta-head">
      <div class="gta-stat"><small>MODE</small><strong id="gtaMode">STORY</strong></div>
      <div class="gta-stat"><small>LOCATION</small><strong id="gtaLocation">NAYABASTI</strong></div>
      <div class="gta-stat"><small>DISTANCE</small><strong id="gtaDistance">0 m</strong></div>
    </div>
    <div class="gta-bar"><span id="gtaProgress"></span></div>

    <div class="gta-screen" id="gtaScreen">
      <div class="gta-hud">
        <div class="gta-pill">🇳🇵 CHITWAN • NEPAL</div>
        <div class="gta-pill" id="gtaHint">MAYUSH'S STORY</div>
      </div>
      <div class="gta-dialogue" id="gtaDialogue"><b id="gtaSpeaker">वृद्ध बा</b><span id="gtaLine"></span></div>
      <div class="gta-overlay" id="gtaOverlay">
        <div class="gta-panel">
          <div class="gta-kicker">AN ORIGINAL NEPALI OPEN WORLD</div>
          <img class="gta-portrait" src="./assets/photos/IMG_2348.JPG" alt="Mayush character reference" onerror="this.style.display='none'">
          <h2 id="gtaTitle">MAYUSH.GAMEPLAY</h2>
          <p id="gtaMessage">नयाबस्तीको एउटा कथा... एउटा यात्रा... र Mayush को आफ्नै संसार।</p>
          <button class="gta-main" id="gtaStart">STORY सुरु गरौँ ▶</button>
        </div>
      </div>
    </div>

    <div class="gta-bottom">
      <div class="gta-pad">
        <button class="gta-empty"> </button><button data-key="forward">▲</button><button class="gta-empty"> </button>
        <button data-key="left">◀</button><button data-key="back">▼</button><button data-key="right">▶</button>
      </div>
      <div class="gta-actions">
        <button data-action="jump">JUMP</button><button data-action="run">RUN</button>
        <button data-action="talk">TALK</button><button data-action="vehicle">ENTER / EXIT CAR</button>
        <button data-action="sound">SOUND ON</button>
      </div>
    </div>
    <p class="gta-help">Mobile: controls थिचेर खेल। Computer: W A S D / Arrow keys, Space = Jump, Shift = Run, E = car। गाउँलेसँग नजिक गएर TALK थिच।</p>
  </section>`;
}

export function initGame() {
  const root = document.getElementById("gtaGame");
  if (!root) return;
  if (window.__gtaCleanup) window.__gtaCleanup();

  const $ = id => root.querySelector("#" + id);
  const screen = $("gtaScreen"), overlay = $("gtaOverlay");
  let renderer, scene, camera, player, car, resizeObserver;
  let active = false, driving = false, disposed = false, jumping = false;
  let jumpTime = 0, playerYaw = 0, carYaw = 0, speed = 0, distance = 0, frame = 0;
  let controls = {}, audioCtx = null, soundOn = true, storyIndex = -1;
  const clock = new THREE.Clock(), worldLength = 7000, materials = {};
  const villagers = [], animals = [];

  function mat(name, color, roughness=0.9, extra={}) {
    if (!materials[name]) materials[name] = new THREE.MeshStandardMaterial({color, roughness, ...extra});
    return materials[name];
  }
  function box(parent,x,y,z,sx,sy,sz,material,cast=true) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);
    m.position.set(x,y,z); m.castShadow=cast; m.receiveShadow=true; parent.add(m); return m;
  }
  function makeCanvasTexture(draw,w=512,h=256) {    const canvas = document.createElement("canvas");
    canvas.width=w; canvas.height=h;
    const ctx=canvas.getContext("2d");
    draw(ctx,w,h);
    const texture=new THREE.CanvasTexture(canvas);
    texture.colorSpace=THREE.SRGBColorSpace;
    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
    return texture;
  }

  function createWorld() {
    scene=new THREE.Scene();
    scene.background=new THREE.Color(0x9ac8dd);
    scene.fog=new THREE.FogExp2(0x9ac8dd,0.00017);

    camera=new THREE.PerspectiveCamera(65,1,0.1,1800);

    renderer=new THREE.WebGLRenderer({antialias:true, powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.15;
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    screen.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xdaf1ff,0x52613c,2.1));

    const sun=new THREE.DirectionalLight(0xffe3b0,3.1);
    sun.position.set(-90,150,80);
    sun.castShadow=true;
    sun.shadow.mapSize.set(2048,2048);
    sun.shadow.camera.left=-150;
    sun.shadow.camera.right=150;
    sun.shadow.camera.top=150;
    sun.shadow.camera.bottom=-150;
    scene.add(sun);

    const grassTexture=makeCanvasTexture((ctx,w,h)=>{
      ctx.fillStyle="#718d4c";ctx.fillRect(0,0,w,h);
      for(let i=0;i<18000;i++){
        ctx.fillStyle=["#617d3e","#829c56","#9aa965","#526f3b"][Math.floor(Math.random()*4)];
        ctx.globalAlpha=.2+Math.random()*.5;
        ctx.fillRect(Math.random()*w,Math.random()*h,2+Math.random()*4,2+Math.random()*3);
      }
      ctx.globalAlpha=1;
    });
    grassTexture.repeat.set(35,150);

    const ground=new THREE.Mesh(
      new THREE.PlaneGeometry(260,worldLength+500),
      new THREE.MeshStandardMaterial({map:grassTexture})
    );
    ground.rotation.x=-Math.PI/2;
    ground.position.set(0,-.08,-worldLength/2);
    ground.receiveShadow=true;
    scene.add(ground);

    const roadTexture=makeCanvasTexture((ctx,w,h)=>{
      ctx.fillStyle="#77766d";ctx.fillRect(0,0,w,h);
      for(let i=0;i<7000;i++){
        ctx.fillStyle=Math.random()>.5?"#aaa79a":"#55564f";
        ctx.globalAlpha=Math.random()*.35;
        ctx.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*5,1+Math.random()*3);
      }
      ctx.globalAlpha=1;
    });
    roadTexture.repeat.set(1,70);

    const road=new THREE.Mesh(
      new THREE.PlaneGeometry(10,worldLength+300),
      new THREE.MeshStandardMaterial({map:roadTexture,roughness:1})
    );
    road.rotation.x=-Math.PI/2;
    road.position.set(0,.015,-worldLength/2);
    road.receiveShadow=true;
    scene.add(road);

    const lineMat=mat("roadLine",0xe5d7a7);
    for(let z=0;z>-worldLength;z-=28){
      const line=box(scene,0,.035,z,.13,.025,12,lineMat,false);
    }

    const roadSide=mat("roadSide",0xaaa18c);
    box(scene,-5.15,.02,-worldLength/2,.3,.04,worldLength+300,roadSide,false);
    box(scene,5.15,.02,-worldLength/2,.3,.04,worldLength+300,roadSide,false);

    createMountains();
    createVillage();
    createRoadside();
    createPlayer();
    createCar();
    createVillagers();
    createAnimals();
    createSigns();
  }

  function createMountains() {
    const mountainMat=mat("mountain",0x536d65);
    const farMat=mat("farMountain",0x82978b);
    for(let i=0;i<24;i++){
      const h=35+Math.random()*65;
      const mountain=new THREE.Mesh(
        new THREE.ConeGeometry(35+Math.random()*45,h,5),
        i%2?mountainMat:farMat
      );
      mountain.position.set((i%2?1:-1)*(100+Math.random()*80),h/2-4,-i*330-100);
      mountain.rotation.y=Math.random()*2;
      scene.add(mountain);
    }
  }

  function createHouse(x,z,scale=1) {
    const group=new THREE.Group();
    group.position.set(x,0,z);
    const wallColors=[0xd6b78c,0xc8a57e,0xe0c9a1,0xb9b08e];
    const wall=mat("wall"+Math.floor(Math.random()*4),wallColors[Math.floor(Math.random()*4)]);
    const roof=mat("roof",0x814b32);
    const dark=mat("dark",0x45372d);
    const door=mat("door",0x65432e);
    const w=(5+Math.random()*3)*scale;
    const d=(4+Math.random()*3)*scale;
    box(group,0,1.45,0,w,2.9*scale,d,wall);
    const roofMesh=new THREE.Mesh(new THREE.ConeGeometry(w*.83,2.2*scale,4),roof);
    roofMesh.position.y=3.7*scale;
    roofMesh.rotation.y=Math.PI/4;
    roofMesh.castShadow=true;
    group.add(roofMesh);
    box(group,0,.85,d/2+.025,1.1*scale,1.7*scale,.12,door);
    box(group,-w*.28,1.8,d/2+.04,.9*scale,.8*scale,.1,dark);
    box(group,w*.28,1.8,d/2+.04,.9*scale,.8*scale,.1,dark);
    scene.add(group);
  }

  function createTree(x,z,scale=1) {
    const group=new THREE.Group();
    group.position.set(x,0,z);
    const trunk=mat("trunk",0x65452d);
    const leaves=[mat("leaf1",0x315e36),mat("leaf2",0x467746),mat("leaf3",0x5d8848)];
    const height=3+Math.random()*2;
    const stem=new THREE.Mesh(new THREE.CylinderGeometry(.18*scale,.3*scale,height*scale,7),trunk);
    stem.position.y=height*scale/2;
    stem.castShadow=true;
    group.add(stem);
    for(let i=0;i<4;i++){
      const crown=new THREE.Mesh(new THREE.SphereGeometry((1.1+Math.random()*.5)*scale,8,7),leaves[i%3]);
      crown.position.set((Math.random()-.5)*1.2*scale,height*scale+(Math.random()-.5)*1.2*scale,(Math.random()-.5)*1.2*scale);
      crown.castShadow=true;
      group.add(crown);
    }
    scene.add(group);
  }

  function createVillage() {
    for(let z=-30;z>-worldLength;z-=75){
      const side=Math.random()>.5?1:-1;
      if(Math.random()>.18){
        createHouse(side*(11+Math.random()*17),z-Math.random()*35,.8+Math.random()*.5);
      }
      for(let i=0;i<5;i++){
        createTree(side*(7+Math.random()*32),z-i*13,.7+Math.random()*.7);
      }
    }
  }

  function createRoadside() {
    const fenceMat=mat("fence",0x806044);
    for(let z=-50;z>-worldLength;z-=100){
      for(const side of [-1,1]){
        if(Math.random()>.4){
          for(let i=0;i<5;i++){
            box(scene,side*8,.55,z-i*3,.12,1.1,.12,fenceMat);
          }
          box(scene,side*8,.85,z-6,.12,.12,12,fenceMat);
        }
      }
    }
  }

  function createSigns() {
    villages.forEach((name,i)=>{
      const z=-i*(worldLength/(villages.length-1));
      const post=mat("signPost",0x60472e);
      const board=mat("signBoard",0x28563b);
      box(scene,-7,1.4,z,.15,2.8,.15,post);
      box(scene,-7,2.7,z,4,.9,.18,board);
      const canvas=document.createElement("canvas");
      canvas.width=512;canvas.height=128;
      const ctx=canvas.getContext("2d");
      ctx.fillStyle="#28563b";ctx.fillRect(0,0,512,128);
      ctx.fillStyle="#fff";ctx.font="bold 42px Arial";
      ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.fillText(name,256,64);
      const texture=new THREE.CanvasTexture(canvas);
      const sign=new THREE.Mesh(
        new THREE.PlaneGeometry(3.8,.8),
        new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide})
      );
      sign.position.set(-7,2.7,z+.11);
      scene.add(sign);
    });
  }

  function createPlayer() {
    player=new THREE.Group();

    const skin=mat("skin",0xb9825d);
    const shirt=mat("shirt",0x263f68);
    const pants=mat("pants",0x252b35);
    const shoes=mat("shoes",0x17191b);
    const hair=mat("hair",0x171411);

    const body=new THREE.Group();
    box(body,0,1.35,0,.75,1,.4,shirt);
    box(body,0,2.05,0,.48,.55,.43,skin);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.29,16,12),skin);
    head.position.y=2.48;
    head.castShadow=true;
    body.add(head);

    const hairMesh=new THREE.Mesh(new THREE.SphereGeometry(.3,16,10,0,Math.PI*2,0,Math.PI*.55),hair);
    hairMesh.position.y=2.56;
    body.add(hairMesh);

    box(body,-.23,.55,0,.25,.75,.3,pants);
    box(body,.23,.55,0,.25,.75,.3,pants);
    box(body,-.23,.12,.08,.28,.2,.42,shoes);
    box(body,.23,.12,.08,.28,.2,.42,shoes);

    const armL=box(body,-.52,1.35,0,.22,.8,.24,skin);
    const armR=box(body,.52,1.35,0,.22,.8,.24,skin);
    body.userData.armL=armL;
    body.userData.armR=armR;

    player.add(body);
    player.userData.body=body;
    player.position.set(0,0,-5);
    scene.add(player);
  }

  function createCar() {
    car=new THREE.Group();
    const red=mat("carRed",0x9e3028,.35,{metalness:.25});
    const glass=mat("carGlass",0x8ab4c3,.25,{metalness:.3});
    const black=mat("carBlack",0x171a1d);
    const tire=mat("tire",0x111111);

    box(car,0,.8,0,2.2,.8,4.1,red);
    box(car,0,1.45,-.35,1.85,.85,2.05,red);
    box(car,1.0,1.45,-.35,.08,.65,1.6,glass,false);
    box(car,-1.0,1.45,-.35,.08,.65,1.6,glass,false);
    box(car,0,1.45,-1.38,1.7,.6,.08,glass,false);

    for(const x of [-1.05,1.05]){
      for(const z of [-1.35,1.35]){
        const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.24,16),tire);
        wheel.rotation.z=Math.PI/2;
        wheel.position.set(x,.45,z);
        wheel.castShadow=true;
        car.add(wheel);
      }
    }
    box(car,-.72,.92,2.08,.35,.2,.1,mat("headlight",0xffe5a0));
    box(car,.72,.92,2.08,.35,.2,.1,mat("headlight2",0xffe5a0));

    car.position.set(3,0,-12);
    car.visible=true;
    scene.add(car);
  }

  function createVillager(x,z,index) {
    const group=new THREE.Group();
    const skin=mat("villagerSkin"+index,0xb9825d);
    const clothes=[
      mat("villagerCloth1",0x9c4938),
      mat("villagerCloth2",0x426d4b),
      mat("villagerCloth3",0x4d527d),
      mat("villagerCloth4",0xb38a42)
    ];
    const cloth=clothes[index%clothes.length];

    box(group,0,1.1,0,.65,.9,.35,cloth);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.25,12,10),skin);
    head.position.y=1.85;
    head.castShadow=true;
    group.add(head);

    box(group,-.2,.45,0,.2,.65,.24,mat("villagerPants",0x34302b));
    box(group,.2,.45,0,.2,.65,.24,mat("villagerPants",0x34302b));

    const hair=new THREE.Mesh(
      new THREE.SphereGeometry(.26,12,8,0,Math.PI*2,0,Math.PI*.55),
      mat("villagerHair",0x211b17)
    );
    hair.position.y=1.92;
    group.add(hair);

    group.position.set(x,0,z);
    group.userData={
      index,
      baseX:x,
      baseZ:z,
      phase:Math.random()*Math.PI*2,
      name:["गाउँका काका","गाउँकी दिदी","किसान दाइ","हजुरआमा","युवा साथी"][index%5]
    };
    scene.add(group);
    villagers.push(group);
  }

  function createVillagers() {
    for(let i=0;i<28;i++){
      const z=-35-i*235-Math.random()*70;
      const side=Math.random()>.5?1:-1;
      createVillager(side*(6+Math.random()*5),z,i);
    }
  }

  function createAnimal(x,z,type) {
    const group=new THREE.Group();
    const fur=mat("animal"+type,type==="buffalo"?0x292a28:0x9a7650);
    const dark=mat("animalDark",0x29221b);

    const body=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),fur);
    body.scale.set(.65,.48,1);
    body.position.y=.75;
    body.castShadow=true;
    group.add(body);

    const head=new THREE.Mesh(new THREE.SphereGeometry(.35,12,10),fur);
    head.position.set(0,.95,1);
    group.add(head);

    for(const side of [-1,1]){
      box(group,side*.35,.35,.45,.16,.65,.17,dark);
      const horn=new THREE.Mesh(new THREE.ConeGeometry(.09,.5,8),dark);
      horn.position.set(side*.28,1.3,1.1);
      horn.rotation.z=side*.5;
      group.add(horn);
    }

    group.position.set(x,0,z);
    group.userData.phase=Math.random()*6;
    scene.add(group);
    animals.push(group);
  }

  function createAnimals() {
    for(let i=0;i<13;i++){
      const z=-100-i*490;
      createAnimal((Math.random()>.5?1:-1)*(7+Math.random()*6),z,i%3===0?"buffalo":"cow");
    }
  }

  const story=[
    {
      speaker:"वृद्ध बा",
      line:"यो हो हाम्रो नयाबस्ती गाउँ... यही गाउँमा हुर्किएको एउटा केटो हो Mayush। उसको पनि आफ्नै सपना छ, आफ्नै कथा छ। आज ऊ कहाँ पुग्छ, के गर्छ... त्यो समयले बताउनेछ।"
    },
    {
      speaker:"गाउँका काका",
      line:"ए Mayush भाइ! के छ? सन्चै छौ? गाउँतिर आजकल कम देखिन्छौ नि!"
    },
    {
      speaker:"Mayush",
      line:"सबै सन्चै छन् काका! अब आफ्नो सपना पूरा गर्न एउटा नयाँ यात्रा सुरु गर्दैछु।"
    },
    {
      speaker:"वृद्ध बा",
      line:"लौ त बाबु, बाटो लामो छ। हिम्मत नहार्नु। आफ्नो गाउँ र मान्छेहरूलाई कहिल्यै नभुल्नु।"
    }
  ];

  function speak(textToSay,rate=0.9,pitch=1) {
    if(!soundOn || !("speechSynthesis" in window)) return;
    try{
      window.speechSynthesis.cancel();
      const utterance=new SpeechSynthesisUtterance(textToSay);
      utterance.lang="ne-NP";
      utterance.rate=rate;
      utterance.pitch=pitch;
      window.speechSynthesis.speak(utterance);
    }catch(e){}
  }

  function showStory() {
    const item=story[storyIndex];
    $("gtaTitle").textContent=item.speaker;
    $("gtaMessage").textContent=item.line;
    $("gtaStart").textContent=storyIndex===story.length-1?"GAME सुरु गरौँ ▶":"अर्को ▶";
    speak(item.line,.88,item.speaker==="वृद्ध बा"?.78:1);
  }

  function startGame() {
    if(storyIndex>=0 && storyIndex<story.length){
      overlay.hidden=false;
      return;
    }
    overlay.hidden=true;
    active=true;
    $("gtaMode").textContent="WALK";
    $("gtaHint").textContent="EXPLORE NAYABASTI";
    $("gtaLocation").textContent="NAYABASTI";
    speak("स्वागत छ Mayush। अब तिम्रो यात्रा सुरु भयो।",.9,1);
    clock.getDelta();
  }

  $("gtaStart").addEventListener("click",()=>{
    if(storyIndex<story.length-1){
      storyIndex++;
      showStory();
    }else{
      startGame();
    }
  });  function updateLocation() {
    const progress=Math.min(1,Math.abs(player.position.z)/worldLength);
    const index=Math.min(villages.length-1,Math.floor(progress*(villages.length-1)));
    $("gtaLocation").textContent=villages[index];
    $("gtaDistance").textContent=Math.floor(distance)+" m";
    $("gtaProgress").style.width=(progress*100)+"%";
  }

  function setControl(name,value) {
    controls[name]=value;
  }

  root.querySelectorAll("[data-key]").forEach(button=>{
    const key=button.dataset.key;
    button.addEventListener("pointerdown",e=>{
      e.preventDefault();
      setControl(key,true);
      button.setPointerCapture?.(e.pointerId);
    });
    ["pointerup","pointercancel","lostpointercapture"].forEach(event=>{
      button.addEventListener(event,()=>setControl(key,false));
    });
  });

  function jump() {
    if(!active || driving || jumping) return;
    jumping=true;
    jumpTime=0;
  }

  function toggleRun() {
    controls.run=!controls.run;
  }

  function nearestVillager() {
    let nearest=null, best=8;
    villagers.forEach(person=>{
      const d=player.position.distanceTo(person.position);
      if(d<best){best=d;nearest=person;}
    });
    return nearest;
  }

  function talk() {
    if(!active || driving) return;
    const person=nearestVillager();
    const dialogue=$("gtaDialogue");
    if(!person){
      $("gtaSpeaker").textContent="Mayush";
      $("gtaLine").textContent="यहाँ नजिक गाउँले कोही छैन। अलि अगाडि जाऊ।";
      dialogue.style.display="block";
      return;
    }

    const conversations=[
      ["के छ Mayush भाइ? सन्चै छौ?","सन्चै छु काका! तपाईंलाई कस्तो छ?"],
      ["खाना खायौ कि खाएनौ बाबु?","खाएँ हजुरआमा। तपाईंले खानुभयो?"],
      ["काम कस्तो चल्दैछ Mayush?","राम्रो चल्दैछ दाइ। नयाँ कुरा सिक्दैछु।"],
      ["घरमा सबै सन्चै छन् नि?","सबै सन्चै छन्। तपाईंको घरमा पनि सन्चै?"],
      ["लौ, चिया खान आउनुस् न!","हुन्छ दिदी, अलि पछि आउँछु।"]
    ];
    const choice=conversations[person.userData.index%conversations.length];

    $("gtaSpeaker").textContent=person.userData.name;
    $("gtaLine").textContent=choice[0];
    dialogue.style.display="block";
    speak(choice[0],.9,.85);

    setTimeout(()=>{
      if(disposed) return;
      $("gtaSpeaker").textContent="Mayush";
      $("gtaLine").textContent=choice[1];
      speak(choice[1],.95,1);
    },2200);
  }

  function toggleVehicle() {
    if(!active) return;
    if(!driving){
      if(player.position.distanceTo(car.position)<5){
        driving=true;
        player.visible=false;
        $("gtaMode").textContent="DRIVING";
        $("gtaHint").textContent="VEHICLE MODE";
        speak("गाडी चलाऔँ।",1,1);
      }else{
        $("gtaSpeaker").textContent="Mayush";
        $("gtaLine").textContent="गाडीमा चढ्न पहिले गाडी नजिक जानुपर्छ।";
        $("gtaDialogue").style.display="block";
      }
    }else{
      driving=false;
      player.visible=true;
      player.position.copy(car.position);
      player.position.x+=2.2;
      $("gtaMode").textContent="WALK";
      $("gtaHint").textContent="EXPLORE THE VILLAGE";
    }
  }

  function makeTone(freq,duration,type="sine",volume=.035) {
    if(!soundOn) return;
    try{
      audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
      if(audioCtx.state==="suspended") audioCtx.resume();
      const osc=audioCtx.createOscillator();
      const gain=audioCtx.createGain();
      osc.type=type;
      osc.frequency.value=freq;
      gain.gain.setValueAtTime(volume,audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime+duration);
    }catch(e){}
  }

  function folkMotif() {
    const notes=[392,440,523,440,392,330,349,392];
    notes.forEach((note,i)=>{
      setTimeout(()=>{
        if(!disposed && soundOn) makeTone(note,.32,"triangle",.018);
      },i*390);
    });
  }

  function action(name) {
    if(name==="jump") jump();
    if(name==="run") toggleRun();
    if(name==="talk") talk();
    if(name==="vehicle") toggleVehicle();
    if(name==="sound"){
      soundOn=!soundOn;
      $("gtaDialogue").style.display="none";
      const button=root.querySelector('[data-action="sound"]');
      button.textContent=soundOn?"SOUND ON":"SOUND OFF";
      if(!soundOn && window.speechSynthesis) window.speechSynthesis.cancel();
      if(soundOn) folkMotif();
    }
  }

  root.querySelectorAll("[data-action]").forEach(button=>{
    button.addEventListener("click",()=>action(button.dataset.action));
  });

  function keyDown(e) {
    const key=e.key.toLowerCase();
    const map={
      w:"forward",arrowup:"forward",
      s:"back",arrowdown:"back",
      a:"left",arrowleft:"left",
      d:"right",arrowright:"right"
    };
    if(map[key]){
      e.preventDefault();
      controls[map[key]]=true;
    }
    if(key===" "){e.preventDefault();jump();}
    if(key==="shift") controls.run=true;
    if(key==="e") toggleVehicle();
    if(key==="f") talk();
  }

  function keyUp(e) {
    const key=e.key.toLowerCase();
    const map={
      w:"forward",arrowup:"forward",
      s:"back",arrowdown:"back",
      a:"left",arrowleft:"left",
      d:"right",arrowright:"right"
    };
    if(map[key]) controls[map[key]]=false;
    if(key==="shift") controls.run=false;
  }

  window.addEventListener("keydown",keyDown);
  window.addEventListener("keyup",keyUp);

  function updatePlayer(delta) {
    if(!active) return;
    const forward=(controls.forward?1:0)-(controls.back?1:0);
    const sideways=(controls.right?1:0)-(controls.left?1:0);

    if(driving){
      speed+=(forward*.16-speed*.035);
      if(!forward) speed*=.96;
      speed=Math.max(-.25,Math.min(1.1,speed));
      carYaw-=sideways*delta*1.7;
      car.rotation.y=carYaw;
      car.position.x-=Math.sin(carYaw)*speed*delta*60;
      car.position.z-=Math.cos(carYaw)*speed*delta*60;
      car.position.x=Math.max(-4.3,Math.min(4.3,car.position.x));
      distance+=Math.abs(speed)*delta*60;
      return;
    }

    const moveSpeed=controls.run?8:4;
    if(forward || sideways){
      playerYaw=Math.atan2(sideways,-forward);
      const angle=player.rotation.y+playerYaw;
      player.position.x+=Math.sin(angle)*moveSpeed*delta;
      player.position.z+=Math.cos(angle)*moveSpeed*delta;
      player.position.x=Math.max(-4.4,Math.min(4.4,player.position.x));
      distance+=Math.abs(forward||sideways)*moveSpeed*delta;
    }
    player.rotation.y=THREE.MathUtils.lerp(player.rotation.y,playerYaw,.12);

    if(jumping){
      jumpTime+=delta;
      player.position.y=Math.sin(Math.min(1,jumpTime/.75)*Math.PI)*1.6;
      if(jumpTime>=.75){
        player.position.y=0;
        jumping=false;
      }
    }
  }

    $("gtaStart").addEventListener("click",()=>{
    if(storyIndex<story.length-1){
      storyIndex++;
      showStory();
    }else{
      storyIndex=story.length;
      startGame();
    }
  });
  
    function updateCamera(delta) {
    const target=driving?car:player;
    const direction=new THREE.Vector3(
      Math.sin(target.rotation.y),0,
      Math.cos(target.rotation.y)
    );

    const desired=new THREE.Vector3(
      target.position.x-direction.x*8,
      target.position.y+5.2,
      target.position.z-direction.z*8
    );

    camera.position.lerp(desired,Math.min(1,delta*4));

    camera.lookAt(
      target.position.x,
      target.position.y+1.4,
      target.position.z
    );
  }

  function resize() {
    if(!renderer || disposed) return;

    const width=screen.clientWidth;
    const height=screen.clientHeight;

    if(!width || !height) return;

    camera.aspect=width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);
  }

  function animate() {
    if(disposed) return;

    frame=requestAnimationFrame(animate);

    const delta=Math.min(clock.getDelta(),.05);

    updatePlayer(delta);
    updatePeople(delta);
    updateCamera(delta);
    updateLocation();

    renderer.render(scene,camera);
  }

  try {
    createWorld();
    resize();

    if("ResizeObserver" in window){
      resizeObserver=new ResizeObserver(resize);
      resizeObserver.observe(screen);
    }else{
      window.addEventListener("resize",resize);
    }

    animate();

  }catch(error){
    console.error("MAYUSH GAME ERROR:",error);
    $("gtaMessage").textContent="3D गेम सुरु हुन सकेन। पेज Reload गरेर फेरि प्रयास गर।";
    overlay.hidden=false;
  }

  window.__gtaCleanup=function(){
    disposed=true;

    cancelAnimationFrame(frame);

    if(resizeObserver) resizeObserver.disconnect();

    window.removeEventListener("resize",resize);
    window.removeEventListener("keydown",keyDown);
    window.removeEventListener("keyup",keyUp);

    if(window.speechSynthesis){
      window.speechSynthesis.cancel();
    }

    if(audioCtx){
      try{audioCtx.close();}catch(e){}
    }

    if(renderer){
      renderer.dispose();
      renderer.domElement.remove();
    }

    if(scene){
      scene.traverse(object=>{
        if(object.geometry) object.geometry.dispose();

        if(object.material){
          const list=Array.isArray(object.material)
            ? object.material
            : [object.material];

          list.forEach(material=>{
            Object.values(material).forEach(value=>{
              if(value && value.isTexture) value.dispose();
            });

            material.dispose();
          });
        }
      });
    }

    window.__gtaCleanup=null;
  };
}

