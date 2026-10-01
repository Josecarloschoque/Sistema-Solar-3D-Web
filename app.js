import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const app=document.querySelector('#app');
const scene=new THREE.Scene(); scene.background=new THREE.Color(0x010208);
const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.05,2000); camera.position.set(0,28,58);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(innerWidth,innerHeight); renderer.outputColorSpace=THREE.SRGBColorSpace; app.appendChild(renderer.domElement);
scene.add(new THREE.AmbientLight(0x20283a,1.1)); const sunLight=new THREE.PointLight(0xffffff,1100,400,1.3); scene.add(sunLight);
const loader=new THREE.TextureLoader(); const tex=n=>{const t=loader.load('./assets/textures/'+n);t.colorSpace=THREE.SRGBColorSpace;return t};
const starGeo=new THREE.BufferGeometry(); const sp=[]; for(let i=0;i<2200;i++){const r=150+Math.random()*500,th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1);sp.push(r*Math.sin(ph)*Math.cos(th),r*Math.cos(ph),r*Math.sin(ph)*Math.sin(th))} starGeo.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xffffff,size:.45,sizeAttenuation:true})));
const data=[
['Mercurio','mercury.jpg',.55,5.2,4.15],['Venus','venus_atmosphere.jpg',.82,7.3,1.62],['Tierra','earth.jpg',.9,10,1.0],['Marte','mars.jpg',.68,12.7,.53],['Júpiter','jupiter.jpg',2.25,18.0,.084],['Saturno','saturn.jpg',1.9,24.0,.034],['Urano','uranus.jpg',1.35,30.0,.012],['Neptuno','neptune.jpg',1.3,36.0,.006]
];
const group=new THREE.Group();scene.add(group);let showOrbits=true,showAst=true,paused=false,sim=0,target=null;
const orbitMat=new THREE.LineBasicMaterial({color:0x30415f,transparent:true,opacity:.45}); const planets=[];
function orbit(r){const pts=[];for(let i=0;i<=180;i++){const a=i/180*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r))}const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),orbitMat.clone());l.userData.orbit=true;group.add(l)}
const sun=new THREE.Mesh(new THREE.SphereGeometry(3.25,64,32),new THREE.MeshBasicMaterial({map:tex('sun.jpg')}));group.add(sun);
data.forEach((d,i)=>{orbit(d[3]);const p=new THREE.Mesh(new THREE.SphereGeometry(d[2],40,24),new THREE.MeshStandardMaterial({map:tex(d[1]),roughness:.9,metalness:0}));p.userData={name:d[0],r:d[3],speed:d[4],phase:i*.72};group.add(p);planets.push(p)});
// Luna
const moon=new THREE.Mesh(new THREE.SphereGeometry(.24,24,14),new THREE.MeshStandardMaterial({map:tex('moon.jpg'),roughness:1}));group.add(moon);
// Anillos de Saturno
const saturn=planets[5];const ring=new THREE.Mesh(new THREE.RingGeometry(2.5,3.6,96),new THREE.MeshBasicMaterial({color:0xc9b889,side:THREE.DoubleSide,transparent:true,opacity:.58}));ring.rotation.x=Math.PI/2.2;saturn.add(ring);
// Cinturón de asteroides
const astGeo=new THREE.IcosahedronGeometry(.055,0),astMat=new THREE.MeshStandardMaterial({color:0x8b8178,roughness:1});const belt=new THREE.InstancedMesh(astGeo,astMat,900),m=new THREE.Matrix4();for(let i=0;i<900;i++){const a=Math.random()*Math.PI*2,r=14.1+Math.random()*2.0,y=(Math.random()-.5)*.45;m.makeTranslation(Math.cos(a)*r,y,Math.sin(a)*r);belt.setMatrixAt(i,m)}group.add(belt);
// Oumuamua
const oum=new THREE.Mesh(new THREE.CapsuleGeometry(.16,1.6,4,10),new THREE.MeshStandardMaterial({color:0x8a6b55,roughness:1}));oum.rotation.z=Math.PI/2;group.add(oum);
function update(t){if(!paused)sim+=t;sun.rotation.y+=.0015;planets.forEach((p,i)=>{const d=data[i],a=sim*d[4]+p.userData.phase;p.position.set(Math.cos(a)*d[3],0,Math.sin(a)*d[3]);p.rotation.y+=.002+(.006/(i+1))});const e=planets[2].position,ma=sim*12;moon.position.set(e.x+Math.cos(ma)*1.45,.08,e.z+Math.sin(ma)*1.45);const oa=sim*.12;oum.position.set(-45+((sim*4)%90),5*Math.sin(oa),-22+((sim*1.8)%44));}
let yaw=.0,pitch=.34,dist=58,drag=false,lx=0,ly=0;const canvas=renderer.domElement;canvas.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw-=(e.clientX-lx)*.006;pitch=Math.max(-1.2,Math.min(1.2,pitch+(e.clientY-ly)*.005));lx=e.clientX;ly=e.clientY});canvas.addEventListener('wheel',e=>{dist=Math.max(5,Math.min(130,dist+e.deltaY*.035));e.preventDefault()},{passive:false});
const center=new THREE.Vector3();function cam(){const c=target?target.position:center;const d=target?Math.max(4,target.geometry.boundingSphere?.radius*8||7):dist;camera.position.set(c.x+d*Math.sin(yaw)*Math.cos(pitch),c.y+d*Math.sin(pitch),c.z+d*Math.cos(yaw)*Math.cos(pitch));camera.lookAt(c)}
planets.forEach(p=>p.geometry.computeBoundingSphere());const bar=document.querySelector('#planetbar');const home=document.createElement('button');home.textContent='Sol';home.onclick=()=>{target=sun;dist=12};bar.appendChild(home);planets.forEach(p=>{const b=document.createElement('button');b.textContent=p.userData.name;b.onclick=()=>{target=p;dist=8};bar.appendChild(b)});
document.querySelector('#pause').onclick=e=>{paused=!paused;e.currentTarget.textContent=paused?'▶ Continuar':'⏸ Pausar'};document.querySelector('#orbits').onclick=()=>{showOrbits=!showOrbits;group.children.filter(x=>x.userData.orbit).forEach(x=>x.visible=showOrbits)};document.querySelector('#asteroids').onclick=()=>{showAst=!showAst;belt.visible=showAst};document.querySelector('#reset').onclick=()=>{target=null;dist=58;yaw=0;pitch=.34};
let last=performance.now();function animate(now){const dt=Math.min((now-last)/1000,.05);last=now;update(dt);cam();renderer.render(scene,camera);requestAnimationFrame(animate)}requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
