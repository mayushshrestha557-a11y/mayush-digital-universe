import * as THREE from "three";
const mat=(color,roughness=.7,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
function makeTemple(scene){
 const stone=mat(0x8d7760),roof=mat(0x34231c,.45),gold=mat(0xd4a64d,.35,.65),dark=mat(0x281d1a);
 const group=new THREE.Group();group.position.set(3.2,-1.9,-1.5);
 const base=new THREE.Mesh(new THREE.BoxGeometry(3.5,.35,2.8),stone);base.position.y=.15;group.add(base);
 const levels=[{w:3.1,h:.55,y:.5},{w:2.55,h:.5,y:1.25},{w:2.0,h:.45,y:1.95}];
 levels.forEach((l,i)=>{const deck=new THREE.Mesh(new THREE.BoxGeometry(l.w,.16,l.w*.82),gold);deck.position.y=l.y;group.add(deck);const r=new THREE.Mesh(new THREE.ConeGeometry(l.w*.78,.8,4),roof);r.rotation.y=Math.PI/4;r.position.y=l.y+.5;group.add(r);});
 const body=new THREE.Mesh(new THREE.BoxGeometry(1.45,1.15,1.25),stone);body.position.y=1.05;group.add(body);
 const door=new THREE.Mesh(new THREE.BoxGeometry(.45,.8,.04),dark);door.position.set(0,.85,.64);group.add(door);
 for(let i=0;i<4;i++){const col=new THREE.Mesh(new THREE.CylinderGeometry(.055,.07,.9,10),gold);col.position.set(-.62+i*.41,.98,.68);group.add(col);}
 const spire=new THREE.Mesh(new THREE.ConeGeometry(.18,.8,8),gold);spire.position.y=3.35;group.add(spire);
 const finial=new THREE.Mesh(new THREE.SphereGeometry(.12,16,12),gold);finial.position.y=3.78;group.add(finial);
 scene.add(group);return group;
}
export function createWorld(canvas){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x061018);scene.fog=new THREE.Fog(0x061018,10,27);
 const camera=new THREE.PerspectiveCamera(45,1,.1,100);camera.position.set(0,3.2,11);camera.lookAt(0,1,0);
 let renderer;
 try {
  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
 } catch (error) {
  const panel=document.createElement('div');
  panel.style.cssText='position:fixed;z-index:99999;left:12px;right:12px;bottom:12px;padding:14px;background:#350d16;color:#fff;border:1px solid #ff7185;border-radius:10px;font:13px/1.5 sans-serif;';
  panel.textContent='WebGL सुरु हुन सकेन: '+(error.message||error);
  document.body.appendChild(panel);
  return ()=>{};
 }
 renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 scene.add(new THREE.HemisphereLight(0x9acfff,0x17251e,2));
 const key=new THREE.DirectionalLight(0xffd9a1,3);key.position.set(-5,8,6);scene.add(key);
 const green=new THREE.PointLight(0x42ffc0,30,18);green.position.set(1,3,3);scene.add(green);
 const ground=new THREE.Mesh(new THREE.CircleGeometry(14,64),mat(0x101f25));ground.rotation.x=-Math.PI/2;ground.position.y=-2.1;scene.add(ground);
 const temple=makeTemple(scene);
 const mountainMat=mat(0x172e35);
 for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.ConeGeometry(2.3+Math.random(),3+Math.random()*2,5),mountainMat);m.position.set(-8+i*2.7,-.2,-7-Math.random()*2);scene.add(m);}
 const particleGeo=new THREE.BufferGeometry(), count=900, pos=new Float32Array(count*3);
 for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*24;pos[i*3+1]=Math.random()*9-2;pos[i*3+2]=(Math.random()-.5)*18-3;}
 particleGeo.setAttribute("position",new THREE.BufferAttribute(pos,3));
 const dust=new THREE.Points(particleGeo,new THREE.PointsMaterial({color:0x8fffd8,size:.035,transparent:true,opacity:.7}));scene.add(dust);
 let mx=0,my=0;canvas.addEventListener("pointermove",e=>{const r=canvas.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5;});
 const resize=()=>{const rect=canvas.getBoundingClientRect();const w=Math.max(1,Math.round(rect.width));const h=Math.max(1,Math.round(rect.height));camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};
 if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
 window.addEventListener('resize',resize,{passive:true});resize();
 const clock=new THREE.Clock();let raf;
 function animate(){raf=requestAnimationFrame(animate);const t=clock.getElapsedTime();temple.rotation.y=Math.sin(t*.15)*.035;dust.rotation.y=t*.012;camera.position.x+=(mx*1.2-camera.position.x)*.018;camera.position.y+=(3.2-my*.5-camera.position.y)*.018;camera.lookAt(0,.7,0);renderer.render(scene,camera);}animate();
 return ()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);renderer.dispose();};
}
function createLeopard(scene){
 const fur=mat(0xc58a43,.85),cream=mat(0xe7c99a),black=mat(0x211a15),eye= new THREE.MeshStandardMaterial({color:0xffd45c,emissive:0x5b3500});
 const leopard=new THREE.Group();
 const sphere=(g,m,x,y,z,sx,sy,sz)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(1,20,16),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);leopard.add(o);return o;};
 sphere(null,fur,0,0,0,1.15,.55,.42);sphere(null,fur,-.8,.18,0,.42,.48,.4);sphere(null,fur,-1.12,.45,0,.38,.36,.34);
 sphere(null,cream,-1.18,.27,.23,.28,.15,.2);
 for(const z of [-.22,.22]){sphere(null,fur,-1.32,.65,z,.14,.17,.13);sphere(null,black,-1.34,.66,z*1.2,.07,.09,.07);sphere(null,eye,-1.38,.49,z*1.05,.045,.045,.035);}
 for(let i=0;i<4;i++){const leg=sphere(null,fur,-.55+i*.48,-.55,(i%2?-.23:.23),.16,.48,.16);leg.rotation.z=(i<2?.12:-.12);}
 const tail=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(.85,.1,0),new THREE.Vector3(1.35,-.05,0),new THREE.Vector3(1.55,-.42,.05),new THREE.Vector3(1.85,-.48,.05)]),24,.075,8,false),fur);leopard.add(tail);
 const spots=new THREE.Group();for(let i=0;i<85;i++){const a=(Math.random()-.5)*2.1,b=(Math.random()-.5)*.75;const dot=new THREE.Mesh(new THREE.SphereGeometry(.035+Math.random()*.025,8,6),black);dot.position.set(a,b,.405*Math.sqrt(Math.max(.1,1-(a/1.25)**2-(b/.6)**2)));spots.add(dot);}leopard.add(spots);
 leopard.scale.setScalar(1.25);scene.add(leopard);return leopard;
}
export function createIntro(canvas){
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(40,1,.1,100);camera.position.set(0,1.4,9);camera.lookAt(0,0,0);
 let renderer;
 try {
  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
 } catch (error) {
  const panel=document.createElement('div');
  panel.style.cssText='position:fixed;z-index:99999;left:12px;right:12px;bottom:12px;padding:14px;background:#350d16;color:#fff;border:1px solid #ff7185;border-radius:10px;font:13px/1.5 sans-serif;';
  panel.textContent='WebGL सुरु हुन सकेन: '+(error.message||error);
  document.body.appendChild(panel);
  return ()=>{};
 }
 renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 scene.add(new THREE.AmbientLight(0xffffff,2.2));
 const keyLight=new THREE.DirectionalLight(0xffffff,2.5);keyLight.position.set(-3,6,7);scene.add(keyLight);
 const light=new THREE.PointLight(0x61ffd0,35,30);light.position.set(2,4,5);scene.add(light);
 const leopard=createLeopard(scene);leopard.position.set(1.9,-.1,0);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(2.3,.012,8,120),new THREE.MeshBasicMaterial({color:0x55ffc2,transparent:true,opacity:.55}));ring.rotation.x=1.15;ring.position.set(1.8,0,-.3);scene.add(ring);
 const particles=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({color:0x8affd4,size:.035}));const p=new Float32Array(1200);for(let i=0;i<p.length;i++)p[i]=(Math.random()-.5)*15;particles.geometry.setAttribute("position",new THREE.BufferAttribute(p,3));scene.add(particles);
 const resize=()=>{const rect=canvas.getBoundingClientRect();const w=Math.max(1,Math.round(rect.width));const h=Math.max(1,Math.round(rect.height));camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};
 if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
 window.addEventListener('resize',resize,{passive:true});resize();
 const clock=new THREE.Clock();let raf;function animate(){raf=requestAnimationFrame(animate);const t=clock.getElapsedTime();leopard.position.y=-.1+Math.sin(t*1.4)*.08;leopard.rotation.y=Math.sin(t*.45)*.12;ring.rotation.z=t*.1;particles.rotation.y=t*.018;renderer.render(scene,camera);}animate();return()=>{cancelAnimationFrame(raf);renderer.dispose();};
}
