const parts = [
['body','琴身','Body','body','電吉他的主要結構，承載琴橋、拾音器與電子零件。這裡採用實心琴身，雙缺角讓手更容易接近高把位。','外形與厚度影響重量、平衡與演奏時的貼身感。',[0,-1.2,0]],
['neck','琴頸','Neck','neck','連接琴身與琴頭，支撐指板與琴弦。琴頸背面的曲線、寬度與厚度，都會影響握持手感。','轉到背面，看看琴頸如何與琴身接合。',[0,2.1,-.08]],
['fretboard','指板','Fretboard / Fingerboard','neck','按弦時手指所在的表面，承載琴格與定位記號。此模型以深色指板搭配淺色琴頸，方便辨識結構。','指板是表面；琴頸是支撐它的整體結構。',[0,2.2,.21]],
['frets','琴格／品絲','Frets','neck','橫跨指板的金屬條。按下琴弦時，琴弦接觸品絲，決定有效振動長度；相鄰兩格相差一個半音。','「第幾格」也常指兩根品絲之間的按弦區域；越往琴身，格距越小。',[0,2.65,.25]],
['markers','指板定位記號','Position Markers / Inlays','neck','指板上的圓點協助快速辨識把位。這把示意琴在第 3、5、7、9、12、15、17、19、21 格設有記號，第 12 格使用雙點。','第 12 格相對空弦高一個八度。',[.10,2.27,.26]],
['sideDots','側邊定位點','Side Dots','neck','位於指板側緣，讓演奏者不用將吉他翻向自己，也能從上方辨認把位。','轉動模型，從指板側邊觀察小圓點。',[-.23,2.27,.17]],
['nut','上弦枕','Nut','neck','位於指板與琴頭交界，以六道弦槽固定弦距，支撐空弦的一端；空弦的有效弦長由它到弦鞍之間計算。','弦槽的高度與形狀會影響低把位手感與調音穩定。',[0,4.08,.25]],
['headstock','琴頭','Headstock','neck','琴頸末端擴大的部位，用來安裝弦鈕並安排琴弦走向。這裡採六顆弦鈕同側排列。','另有兩側各三顆的 3+3 配置。',[.13,4.68,.04]],
['tuners','弦鈕／調音旋鈕','Tuning Machines / Tuners','neck','旋轉弦鈕，透過齒輪帶動繞弦柱，改變琴弦張力以調整音高。背面可看到齒輪外殼。','繞弦柱和旋鈕分別位於琴頭正面與側邊。',[-.38,4.82,.02]],
['posts','繞弦柱','Tuning Posts','neck','琴弦固定並纏繞的金屬柱。它與弦鈕的齒輪機構相連，旋轉時收緊或放鬆琴弦。','鎖定式弦鈕會額外夾住琴弦，結構與一般弦鈕不同。',[-.02,4.78,.19]],
['tree','壓弦器','String Tree / String Retainer','neck','讓部分高音弦在通過上弦枕後維持適當向下角度，使琴弦穩定貼住弦槽。常見於同側弦鈕琴頭。','並不是所有琴頭都需要壓弦器。',[.11,4.43,.27]],
['strings','琴弦','Strings','body','六條金屬弦振動後，由磁性拾音器轉換為電訊號。標準調弦由粗到細為 E2、A2、D3、G3、B3、E4。','弦的粗細、材質與張力會改變手感與聲音。',[0,1.25,.30]],
['pickguard','護板','Pickguard / Scratchplate','body','保護琴身表面，降低彈片刮傷漆面的機會。在這類琴上，也承載拾音器、旋鈕與切換開關。','不是每種電吉他都有護板。',[.49,-.24,.27]],
['neckPickup','琴頸拾音器','Neck Pickup','electronics','位於靠近琴頸的位置。琴弦在這裡的振幅通常較大，聲音常較圓潤、厚實，適合柔和的旋律與和弦。','這把示意琴使用單線圈拾音器。',[0,-.02,.38]],
['middlePickup','中段拾音器','Middle Pickup','electronics','位於琴頸與琴橋拾音器之間，提供另一種取樣位置。與其他拾音器搭配時，可以產生不同的音色。','SSS 表示三顆 Single-coil，亦即單線圈拾音器。',[0,-.53,.38]],
['bridgePickup','琴橋拾音器','Bridge Pickup','electronics','靠近琴橋，琴弦在這個位置的振幅較小，音色通常較明亮、銳利。模型中的斜置設計也改變各弦的取樣位置。','拾音器的高度與電路同樣影響最終聲音。',[0,-1.03,.38]],
['poles','磁極柱','Pole Pieces','electronics','拾音器上對應六條琴弦的金屬柱，是磁路的一部分。琴弦擾動磁場時，線圈產生隨振動變化的電訊號。','有些拾音器使用整條刀片狀磁極。',[.08,-.53,.46]],
['selector','拾音器切換開關','Pickup Selector Switch','electronics','這類五段開關可選擇琴橋、琴橋＋中段、中段、中段＋琴頸、琴頸等拾音器組合。','位置編號的叫法可能不同，先認清目前啟用的拾音器。',[.66,-.66,.39]],
['volume','音量旋鈕','Volume Control','electronics','透過電位器調整輸出訊號大小。接到破音效果器或音箱時，轉小也可能讓聲音變乾淨。','它控制訊號，不是直接改變琴弦的振動。',[.73,-1.02,.43]],
['tone','音色旋鈕','Tone Controls','electronics','典型被動音色電路由電位器與電容組成，轉低時削減較多高頻，使聲音變暗、變柔和。','兩顆 Tone 分別控制哪些拾音器，取決於實際配線。',[.80,-1.49,.43]],
['bridge','琴橋','Bridge','body','支撐琴弦在琴身端的結構，承載六個弦鞍。這裡採同步顫音琴橋，可隨搖桿動作改變琴弦張力。','固定式琴橋則沒有相同的顫音活動機構。',[0,-1.52,.30]],
['saddles','弦鞍／下弦枕','Bridge Saddles','body','每條弦各自跨過一個弦鞍，形成有效振動長度的終點。弦鞍高度用來調整弦距，前後位置用來校正八度音準。','上弦枕在琴頭端；弦鞍在琴橋端。',[0,-1.42,.42]],
['arm','搖桿','Tremolo Arm / Vibrato Arm','body','帶動可活動的琴橋，改變琴弦張力以讓音高升降。雖然慣稱 Tremolo，這個動作產生的其實是音高顫動 Vibrato。','能向上拉多少，取決於琴橋是否採浮動設定。',[.67,-1.65,.56]],
['jack','輸出插孔','Output Jack','electronics','連接導線，將吉他的電訊號送往效果器、音箱或錄音介面。這類插孔常使用 6.35 mm 單聲道 TS 接頭。','它輸出的是樂器訊號，不能直接當作耳機輸出。',[.77,-1.99,.30]],
['strap','背帶扣','Strap Buttons','body','固定背帶的金屬扣，通常分別位於琴身尾端與上側琴角附近，讓吉他可以站立演奏。','安全背帶扣會有額外的鎖定機構。',[0,-2.65,0]],
['neckPlate','琴頸接合板','Neck Plate','body','這類螺栓接合式琴頸的背面金屬板，配合螺絲固定琴頸與琴身，並分散固定點的受力。','其他接合方式還包括膠合式與貫穿式琴頸。',[0,.12,-.30]],
['backCover','背面彈簧蓋板','Tremolo Cavity Cover','body','覆蓋琴身背面的顫音彈簧腔，保護內部機構。模型中以淺色長方形蓋板表示。','開啟「透視內部」即可看到底下的結構。',[0,-1.55,-.30]],
['truss','琴頸調整桿','Truss Rod','inside','藏在琴頸內的調整桿，協助抵抗弦張力，調整琴頸順弓程度（Relief）。模型顯示的是簡化位置。','Relief、弦鞍高度與上弦枕高度是不同的調整項目。',[0,2.12,0]],
['block','顫音金屬塊','Tremolo Block','inside','連接琴橋底板，延伸進琴身的金屬塊。琴弦的球端固定於這組機構，背面彈簧也連接在此。','它會隨顫音琴橋一起活動。',[0,-1.46,-.03]],
['springs','顫音彈簧','Tremolo Springs','inside','位於琴身背面腔室，拉住顫音金屬塊，與琴弦張力取得平衡。這裡示意三根彈簧。','彈簧數量與張力依琴弦規格、琴橋設定而異。',[0,-.94,-.13]],
['claw','彈簧固定爪','Spring Claw','inside','以螺絲固定在琴身內，作為顫音彈簧的另一端錨點。螺絲的深度會影響整組彈簧的拉力。','透視圖以簡化零件呈現固定方式。',[0,-.45,-.12]],
['circuit','電位器與配線','Potentiometers & Wiring','inside','旋鈕底下的電位器、切換開關與配線，決定拾音器訊號如何送往輸出插孔。音色電容也在這個電路中。','透視模式顯示的是概念配線，並非可照做的接線圖。',[.76,-1.24,.04]],
];
const isEnglish=document.documentElement.lang.toLowerCase().startsWith('en');
const localized=document.getElementById('guitar-localization');
const englishCopy=localized?JSON.parse(localized.textContent):null;
if(isEnglish){
  if(!englishCopy)throw new Error('English guitar copy is missing.');
  for(const p of parts){const names=p[2].split(' / '),copy=englishCopy.parts[p[0]];if(!copy)throw new Error(`Missing English description: ${p[0]}`);p[1]=names[0];p[2]=names.slice(1).join(' / ');p[4]=copy[0];p[5]=copy[1];}
}
const ui=isEnglish?englishCopy.ui:{reveal:'透視內部',empty:'找不到這個元件，試試其他中英文名稱。',loadError:'3D 暫時無法啟動；仍可從部件索引閱讀所有介紹。',loadErrorAria:'3D 無法啟動，請使用部件索引',hoverHint:'拖曳旋轉 · 滾輪縮放',contextLost:'3D 顯示已暫停，請重新整理；仍可使用部件索引。'};
const categories=isEnglish?englishCopy.categories:{neck:'NECK / 琴頸與琴頭',body:'HARDWARE / 琴身與五金',electronics:'ELECTRONICS / 電子與音色',inside:'UNDER THE SURFACE / 內部結構'};
const partLabel=p=>[p[1],p[2]].filter(Boolean).join(' / ');
const byId=new Map(parts.map(p=>[p[0],p]));
let selected=null,filter='all',sceneApi=null,restoreFocus=null;
const $=s=>document.querySelector(s);
function closePopup(){ $('#part-popup').hidden=true; $('#connector-path').setAttribute('d',''); $('#anchor-dot').hidden=true; selected=null; document.body.classList.remove('has-selection'); sceneApi?.cancelFocus(); sceneApi?.highlight(null); if(restoreFocus?.isConnected)restoreFocus.focus({preventScroll:true}); }
function toggleIndex(open){$('#part-index').hidden=!open;$('#index-toggle').setAttribute('aria-expanded',open);if(open)$('#search').focus();}
function select(id,focus=false,point=null){selected=id;document.body.classList.add('has-selection');restoreFocus=document.activeElement;const p=byId.get(id);$('#part-number').textContent=`PART ${String(parts.indexOf(p)+1).padStart(2,'0')} / ${parts.length}`;$('#detail').innerHTML=`<p class="category">${categories[p[3]]}</p><h2 id="part-title">${p[1]}</h2>${p[2]?`<p class="english">${p[2]}</p>`:''}<p class="description">${p[4]}</p><p class="tip">${p[5]}</p>${p[3]==='inside'?`<div class="detail-actions"><button id="reveal-part">${ui.reveal}</button></div>`:''}`;$('#part-popup').hidden=false;const reveal=$('#reveal-part');if(reveal)reveal.onclick=()=>{sceneApi?.xray(true);sceneApi?.focus(id)};document.querySelectorAll('.part-row').forEach(b=>{b.classList.toggle('selected',b.dataset.id===id);b.setAttribute('aria-pressed',b.dataset.id===id)});sceneApi?.setAnchor(id,point);sceneApi?.highlight(id);if(p[3]==='inside')sceneApi?.xray(true);if(focus||sceneApi?.isSmall(id))sceneApi?.focus(id);}
function list(){const q=$('#search').value.toLowerCase().trim();const found=parts.filter(p=>(filter==='all'||p[3]===filter)&&`${p[1]} ${p[2]}`.toLowerCase().includes(q));$('#part-count').textContent=`${found.length} / ${parts.length}`;$('#part-list').innerHTML=found.map(p=>`<button class="part-row ${p[0]===selected?'selected':''}" data-id="${p[0]}" aria-pressed="${p[0]===selected}"><span>${p[1]}</span><small>${isEnglish?(p[2]||englishCopy.groupLabels[p[3]]):p[2].split(' / ')[0]}</small></button>`).join('')||`<p class="empty">${ui.empty}</p>`;$('#part-list').querySelectorAll('button').forEach(b=>b.onclick=()=>{toggleIndex(false);select(b.dataset.id,true);$('#close-popup').focus({preventScroll:true});})}
$('#close-popup').onclick=closePopup;$('#index-toggle').onclick=()=>toggleIndex($('#part-index').hidden);$('#index-close').onclick=()=>{toggleIndex(false);$('#index-toggle').focus()};$('#about-toggle').onclick=()=>{const open=$('#about-model').hidden;$('#about-model').hidden=!open;$('#about-toggle').setAttribute('aria-expanded',open)};$('#about-close').onclick=()=>{$('#about-model').hidden=true;$('#about-toggle').setAttribute('aria-expanded',false)};document.addEventListener('keydown',e=>{if(e.key==='Escape'){closePopup();toggleIndex(false);$('#about-model').hidden=true;$('#about-toggle').setAttribute('aria-expanded',false)}});
$('#search').oninput=list;document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));list()});list();
try{await init()}catch(e){console.error(e);$('#loading').textContent=ui.loadError;$('#viewport').setAttribute('aria-label',ui.loadErrorAria);document.querySelectorAll('.view-controls button').forEach(b=>b.disabled=true);}
async function init(){
const THREE=await import('three');const {OrbitControls}=await import('./vendor/OrbitControls.js');
const siteHeader=document.querySelector('.guitar-page > .site-header');
if(siteHeader){const measure=()=>document.body.style.setProperty('--site-nav-height',`${siteHeader.getBoundingClientRect().height}px`);new ResizeObserver(measure).observe(siteHeader);measure();}
const viewport=$('#viewport'),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.05,120),renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;viewport.append(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.09;controls.minDistance=.75;controls.maxDistance=28;controls.enablePan=true;controls.screenSpacePanning=true;
scene.add(new THREE.HemisphereLight(0xeaf2ff,0x202535,2.2));const light=new THREE.DirectionalLight(0xffe9d0,3.5);light.position.set(-4,7,8);scene.add(light);const rim=new THREE.DirectionalLight(0xabcaff,4);rim.position.set(4,2,-5);scene.add(rim);const soft=new THREE.DirectionalLight(0xffffff,1.6);soft.position.set(4,-3,6);scene.add(soft);
const guitar=new THREE.Group();scene.add(guitar);guitar.rotation.z=-.26;
const mat=(c,metal=0,rough=.4)=>new THREE.MeshStandardMaterial({color:c,metalness:metal,roughness:rough});
const amber=new THREE.MeshPhysicalMaterial({color:0x78071a,metalness:.08,roughness:.29,clearcoat:1,clearcoatRoughness:.17}),wood=mat(0xc69a5e,0,.55),rose=mat(0x31241d,0,.65),ivory=mat(0xe7dec2,.08,.32),chrome=mat(0xb5bfba,.85,.22),dark=mat(0x161b24,.25,.4),wire=mat(0xb97d3a,.65,.4),red=mat(0xc2603f,0,.6);
const meshes=[],groups=new Map(),opaque=[];let internal=false,hover=null;
function mesh(geo,material,id,pos){const m=new THREE.Mesh(geo,material);m.position.set(...pos);m.userData.part=id;guitar.add(m);meshes.push(m);if(!groups.has(id))groups.set(id,[]);groups.get(id).push(m);return m}
function box(id,x,y,z,w,h,d,m){return mesh(new THREE.BoxGeometry(w,h,d),m,id,[x,y,z])}
function cyl(id,x,y,z,r,h,m,axis='z'){const o=mesh(new THREE.CylinderGeometry(r,r,h,48),m,id,[x,y,z]);if(axis==='z')o.rotation.x=Math.PI/2;if(axis==='x')o.rotation.z=Math.PI/2;return o}
function line(id,points,r,m){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return mesh(new THREE.TubeGeometry(curve,Math.max(12,points.length*12),r,6,false),m,id,[0,0,0])}
function shape(id,points,depth,z,m,bevel=.05){const s=new THREE.Shape();s.moveTo(...points[0]);for(let i=1;i<points.length;i++){const p=points[i];if(p.length===6)s.bezierCurveTo(...p);else s.lineTo(...p)}s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:bevel>0,bevelSegments:4,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:28});return mesh(g,m,id,[0,0,z])}
// Scale-aligned silhouette landmarks for the body and headstock.
// All landmarks share the same nut-to-saddle scale.
const refUnit=.00434;
const refBody=points=>points.map(p=>p.flatMap((v,i)=>i%2===0?[(v-328)*refUnit]:[1.18596-v*refUnit]));
const body=shape('body',refBody([[328,925],[175,928,40,885,10,804],[-25,700,30,615,72,521],[115,430,134,385,103,290],[69,175,25,105,60,34],[76,6,99,-3,115,4],[132,11,115,75,143,111],[171,151,236,183,265,139],[270,133,273,124,275,119],[379,223],[387,239,417,254,449,252],[511,248,516,209,526,160],[538,94,572,108,592,157],[619,222,582,291,554,350],[528,405,535,446,564,505],[618,614,658,679,651,754],[646,884,514,930,328,925]]),.46,-.25,amber,.035);opaque.push(body);
const top=4.25,scale=5.90,boardEnd=.04;
const halfWidth=y=>THREE.MathUtils.lerp(.247,.19,(y-boardEnd)/(top-boardEnd));
// Rounded D-section neck back; a thin, separately tapered fingerboard.
const vertices=[],indices=[],sections=44,sides=24;
for(let j=0;j<=sections;j++){const y=boardEnd+(top-boardEnd)*j/sections,w=halfWidth(y);for(let k=0;k<=sides;k++){const theta=k/sides*Math.PI;vertices.push(Math.cos(theta)*w,y,.19-Math.sin(theta)*.25);}}
for(let j=0;j<sections;j++)for(let k=0;k<sides;k++){const a=j*(sides+1)+k,b=a+sides+1;indices.push(a,b,a+1,b,b+1,a+1)}
const neckGeo=new THREE.BufferGeometry();neckGeo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));neckGeo.setIndex(indices);neckGeo.computeVertexNormals();const neck=mesh(neckGeo,wood,'neck',[0,0,0]);neck.material.side=THREE.DoubleSide;opaque.push(neck);
const board=shape('fretboard',[[-halfWidth(boardEnd),boardEnd],[halfWidth(boardEnd),boardEnd],[.19,top],[-.19,top]],.065,.214,rose,.008);opaque.push(board);
// The headstock has a straight sloping tuner edge, concave waist, and offset round crown.
const refHead=points=>points.map(p=>p.flatMap((v,i)=>i%2===0?[(v-327)*refUnit]:[top+(374-v)*refUnit]));
const head=shape('headstock',refHead([[284,374],[280,356,247,355,251,330],[266,283,279,235,291,188],[306,139,322,90,334,46],[342,14,363,-1,389,0],[426,-2,444,25,443,57],[442,86,421,104,404,112],[391,117,391,129,395,149],[399,185,416,242,422,289],[396,301,372,329,369,374],[284,374]]),.18,.045,wood,.012);opaque.push(head);
box('nut',0,top,.283,.393,.043,.062,ivory);
const pg=shape('pickguard',refBody([[267,220],[245,218,233,194,221,206],[204,221,228,270,229,308],[240,387,188,456,174,520],[154,589,171,642,221,649],[233,652,241,650,249,650],[249,621],[408,621],[408,652],[482,650,530,711,583,730],[612,747,628,741,630,719],[628,655,584,574,556,516],[521,442,514,405,540,342],[567,273,602,206,584,159],[578,140,570,141,566,159],[557,205,552,259,504,274],[452,292,417,277,381,262],[381,277],[269,277],[267,220]]),.016,.246,ivory,.005);opaque.push(pg);
// Rounded covers and machined hardware replace block-shaped placeholders.
function rounded(id,x,y,z,w,h,d,r,m,angle=0){const a=-w/2,b=-h/2;const o=shape(id,[[a+r,b],[a+w-r,b],[a+w,b,a+w,b+r,a+w,b+r],[a+w,b+h-r],[a+w,b+h,a+w-r,b+h,a+w-r,b+h],[a+r,b+h],[a,b+h,a,b+h-r,a,b+h-r],[a,b+r],[a,b,a+r,b,a+r,b]],d,z,m,.002);o.position.x=x;o.position.y=y;o.rotation.z=angle;return o;}
function screw(id,x,y,z,r=.024){cyl(id,x,y,z,r,.012,chrome);box(id,x,y,z+.007,r*1.35,.005,.003,dark);box(id,x,y,z+.008,.005,r*1.35,.003,dark);}
function ring(id,x,y,z,r,t,m){const o=mesh(new THREE.TorusGeometry(r,t,10,40),m,id,[x,y,z]);return o;}
// Procedural fine wood grain.
function grainTexture(base,variation){const c=document.createElement('canvas');c.width=256;c.height=1024;const ctx=c.getContext('2d');ctx.fillStyle=base;ctx.fillRect(0,0,256,1024);for(let x=0;x<256;x++){const a=(Math.sin(x*1.73)+Math.sin(x*.21)+2)/4;ctx.strokeStyle=`rgba(${variation},${.03+a*.085})`;ctx.lineWidth=.4+(x%3)*.3;ctx.beginPath();for(let y=0;y<=1024;y+=8){const px=x+Math.sin(y*.009+x*.17)*2.4+Math.sin(y*.025+x*.09);y?ctx.lineTo(px,y):ctx.moveTo(px,y)}ctx.stroke()}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;}
function planarGrain(m,texture){const g=m.geometry;g.computeBoundingBox();const bb=g.boundingBox,ps=g.attributes.position,uv=[];for(let i=0;i<ps.count;i++)uv.push((ps.getX(i)-bb.min.x)/(bb.max.x-bb.min.x),(ps.getY(i)-bb.min.y)/(bb.max.y-bb.min.y));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));m.material=m.material.clone();m.material.map=texture;m.material.needsUpdate=true;}
planarGrain(head,grainTexture('#edc78f','112,63,20'));head.material.color.setHex(0xffffff);
planarGrain(board,grainTexture('#3b261d','15,8,5'));board.material.color.setHex(0xffffff);
// Softbox reflections make small chrome rims readable from all angles.
const studio=new THREE.Scene();studio.background=new THREE.Color(0x6b7280);
for(const[x,y,z,w,h,intensity]of[[-4,3,4,3,7,5],[4,1,2,2,6,4],[0,5,-2,5,3,3]]){const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(intensity,intensity,intensity),side:THREE.DoubleSide}));panel.position.set(x,y,z);panel.lookAt(0,0,0);studio.add(panel)}
const pmrem=new THREE.PMREMGenerator(renderer);const studioMap=pmrem.fromScene(studio,.04);scene.environment=studioMap.texture;scene.environmentIntensity=.55;pmrem.dispose();studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});
for(let f=1;f<=21;f++){const y=top-scale*(1-Math.pow(2,-f/12)),w=halfWidth(y);line('frets',[[-w,y,.294],[0,y,.301],[w,y,.294]],.007,chrome);if([3,5,7,9,12,15,17,19,21].includes(f)){const prev=top-scale*(1-Math.pow(2,-(f-1)/12)),ym=(prev+y)/2;for(const x of f===12?[-.09,.09]:[0])cyl('markers',x,ym,.287,.024,.005,ivory);cyl('sideDots',-halfWidth(ym)-.003,ym,.252,.012,.007,ivory,'x')}}
const tunerPoints=[];
for(let i=0;i<6;i++){
const y=4.54+i*.215,x=-.187+i*.0617;tunerPoints.push([x+.025,y,.299]);
// Washer, hexagonal retaining nut, central post, and string hole.
cyl('posts',x,y,.246,.056,.012,chrome);ring('posts',x,y,.254,.045,.006,chrome);
const hex=mesh(new THREE.CylinderGeometry(.043,.043,.021,6),chrome,'posts',[x,y,.265]);hex.rotation.x=Math.PI/2;
cyl('posts',x,y,.293,.027,.046,chrome);cyl('posts',x,y,.318,.011,.002,dark);
const wrap=[];for(let j=0;j<=70;j++){const a=j/70*Math.PI*4;wrap.push([x+Math.cos(a)*.028,y+Math.sin(a)*.028,.285+j/70*.016])}line('posts',wrap,.002,chrome);
rounded('tuners',x,y,.007,.135,.151,.055,.028,chrome);
line('tuners',[[x-.03,y,.084],[x-.17,y+.025,.084]],.018,chrome);
const key=rounded('tuners',x-.205,y+.04,.063,.105,.132,.041,.032,chrome,-.18);
}
rounded('tree',.105,4.76,.276,.133,.042,.020,.012,chrome);cyl('tree',.105,4.76,.255,.017,.046,chrome);screw('tree',.105,4.76,.304,.019);
for(const[id,y,angle]of[['neckPickup',-.20,0],['middlePickup',-.72,0],['bridgePickup',-1.22,-.15]]){
rounded(id,0,y,.265,.659,.145,.014,.068,dark,angle);rounded(id,0,y,.277,.647,.135,.024,.064,ivory,angle);
for(let i=0;i<6;i++){const q=(i-2.5)*.091;const x=q*Math.cos(angle),py=y+q*Math.sin(angle);cyl('poles',x,py,.305,.022,.013,chrome);ring('poles',x,py,.312,.017,.002,dark);}
for(const q of[-.365,.365])screw(id,q*Math.cos(angle),y+q*Math.sin(angle),.274,.021);
}
rounded('bridge',0,-1.70,.262,.72,.43,.030,.018,chrome);
const stringPaths=[],stringRadii=[.0052,.0040,.0030,.0021,.0015,.0011];
for(let i=0;i<6;i++){
const xBridge=(i-2.5)*.096,xNut=(i-2.5)*.061,sy=-1.65+[.005,.025,.045,.005,.025,.045][i];
rounded('saddles',xBridge,sy-.052,.290,.078,.19,.029,.010,chrome);
cyl('saddles',xBridge,sy,.340-stringRadii[i]-.012,.012,.073,chrome,'x');
box('saddles',xBridge,sy-.058,.323,.025,.065,.006,dark);
for(const q of[-.027,.027]){cyl('saddles',xBridge+q,sy+.012,.325,.009,.012,chrome);box('saddles',xBridge+q,sy+.012,.333,.010,.003,.002,dark);}
line('saddles',[[xBridge,sy-.09,.310],[xBridge,sy-.18,.310]],.008,chrome);
for(let j=0;j<7;j++)ring('saddles',xBridge,sy-.10-j*.008,.310,.012,.003,chrome).rotation.x=Math.PI/2;
screw('bridge',xBridge,-1.885,.296,.017);
const path=[[xBridge,sy-.14,.296],[xBridge,sy,.340],[xNut,top,.318],tunerPoints[i]];
// Taut strings are straight between supports. Splines overshoot these supports.
const curve=new THREE.CurvePath();for(let j=1;j<path.length;j++)curve.add(new THREE.LineCurve3(new THREE.Vector3(...path[j-1]),new THREE.Vector3(...path[j])));
mesh(new THREE.TubeGeometry(curve,100,stringRadii[i],8,false),chrome,'strings',[0,0,0]);
stringPaths.push(path);cyl('bridge',xBridge,-1.88,.301,.021,.020,dark);
}
line('arm',[[.29,-1.79,.31],[.40,-1.52,.42],[.47,-1.12,.48],[.47,-.84,.48]],.014,chrome);line('arm',[[.47,-.84,.48],[.47,-.56,.48]],.026,ivory);
function knobLabel(id){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#796d57';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='18px sans-serif';for(let n=1;n<=10;n++){const a=(n/10)*Math.PI*2;ctx.save();ctx.translate(128+Math.sin(a)*102,128-Math.cos(a)*102);ctx.rotate(a);ctx.fillText(String(n),0,0);ctx.restore()}ctx.font='19px sans-serif';ctx.fillText(id==='volume'?'VOLUME':'TONE',128,128);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false});}
for(const[id,x,y]of[['volume',.48,-1.32],['tone',.81,-1.51],['tone',1.12,-1.78]]){
const knob=mesh(new THREE.CylinderGeometry(.078,.104,.092,48),ivory,id,[x,y,.313]);knob.rotation.x=Math.PI/2;
cyl(id,x,y,.365,.079,.016,ivory);ring(id,x,y,.269,.096,.005,ivory);
mesh(new THREE.PlaneGeometry(.158,.158),knobLabel(id),id,[x,y,.375]);
for(let j=0;j<24;j++){const a=j/24*Math.PI*2;line(id,[[x+Math.cos(a)*.101,y+Math.sin(a)*.101,.274],[x+Math.cos(a)*.079,y+Math.sin(a)*.079,.356]],.0016,ivory);}
}
const slot=rounded('selector',.83,-1.16,.269,.025,.35,.006,.010,dark,-.72);line('selector',[[.83,-1.16,.275],[.78,-1.10,.40]],.011,chrome);rounded('selector',.78,-1.10,.40,.038,.09,.038,.016,ivory,-.72);
// Oval recessed output cup, with an actual dark opening and metal retaining ring.
const jackShape=rounded('jack',.75,-2.20,.258,.30,.57,.014,.14,chrome,.65);
rounded('jack',.75,-2.20,.276,.18,.37,.004,.083,dark,.65);
ring('jack',.70,-2.14,.291,.049,.011,chrome);cyl('jack',.70,-2.14,.293,.035,.008,dark);ring('jack',.70,-2.14,.299,.026,.006,chrome);
for(const t of[-.235,.235])screw('jack',.75-Math.sin(.65)*t,-2.20+Math.cos(.65)*t,.283,.018);
// Pickguard perimeter mounting screws.
for(const [px,py]of[[234,217],[397,279],[564,182],[551,301],[536,495],[602,709],[223,630],[189,542],[225,423],[493,501]]){const [x,y]=refBody([[px,py]])[0];screw('pickguard',x,y,.271,.016);}
cyl('strap',0,-2.94,-.01,.09,.13,chrome,'y');cyl('strap',-.93,1.23,-.03,.07,.12,chrome,'y');
box('neckPlate',0,.12,-.32,.47,.53,.035,chrome);for(const x of[-.16,.16])for(const y of[-.06,.30])cyl('neckPlate',x,y,-.35,.037,.025,chrome);
const cover=box('backCover',0,-1.35,-.315,.93,1.55,.035,ivory);opaque.push(cover);for(let i=0;i<6;i++)box('backCover',(i-2.5)*.12,-1.89,-.338,.065,.19,.012,dark);
box('truss',0,2.15,-.015,.055,3.7,.055,chrome);cyl('truss',0,4.35,.23,.053,.09,dark);
box('block',0,-1.68,-.02,.58,.30,.38,chrome);box('claw',0,-.43,-.13,.61,.09,.045,chrome);for(const x of[-.22,.22])line('claw',[[x,-.41,-.13],[x,-.19,-.13]],.022,chrome);
for(const x of[-.21,0,.21]){const pts=[];for(let i=0;i<=150;i++){const t=i/150;pts.push([x+Math.cos(t*Math.PI*32)*.045,-.49-t*1.05,-.13+Math.sin(t*Math.PI*32)*.045])}line('springs',pts,.011,chrome)}
for(const[x,y]of[[.48,-1.32],[.81,-1.51],[1.12,-1.78]]){cyl('circuit',x,y,.08,.085,.13,chrome);line('circuit',[[x,y,.08],[.52,y+.08,.04],[.49,-.8,.04],[.32,-.72,.05]],.012,red)}line('circuit',[[.76,-1.85,.06],[.87,-1.95,.03],[.75,-2.05,.13]],.012,wire);
for(const id of['truss','block','springs','claw','circuit'])groups.get(id)?.forEach(m=>m.visible=false);
// Anchors use the selected surface point when available, otherwise a component center.
const revised={body:[-.9,-1.9,.25],neck:[0,2,.02],fretboard:[0,2.1,.28],nut:[0,4.25,.315],headstock:[.16,5.15,.24],tuners:[-.27,5.01,.085],posts:[.06,5.4,.32],tree:[.105,4.76,.30],neckPickup:[0,-.20,.30],middlePickup:[0,-.72,.30],bridgePickup:[0,-1.22,.30],poles:[.09,-.72,.31],bridge:[0,-1.7,.30],saddles:[0,-1.65,.34],strings:[-.09,1.8,.33],strap:[0,-2.94,0],volume:[.48,-1.32,.375],tone:[.81,-1.51,.375],selector:[.80,-1.13,.40],jack:[.70,-2.14,.30],arm:[.47,-1.1,.48],block:[0,-1.68,-.03]};for(const[id,point]of Object.entries(revised))byId.get(id)[6]=point;
const labelIds=['headstock','nut','frets','neckPickup','bridge','volume','jack'];const labelEls=labelIds.map(id=>{const b=document.createElement('button');b.className='hotspot';b.innerHTML=`<span>${byId.get(id)[1]}</span>`;b.onclick=()=>select(id);b.setAttribute('aria-label',partLabel(byId.get(id)));$('#labels').append(b);return b});
const anchor=id=>guitar.localToWorld(new THREE.Vector3(...byId.get(id)[6]));let popupLocal=null,surfaceAnchor=false,motion=null;
function setAnchor(id,point){surfaceAnchor=!!point;popupLocal=point?guitar.worldToLocal(point.clone()):new THREE.Vector3(...byId.get(id)[6]);}
function xray(value=!internal){internal=value;$('#xray').setAttribute('aria-pressed',value);opaque.forEach(m=>{if(!m.userData.xrayMat){m.material=m.material.clone();m.userData.xrayMat=true}m.material.transparent=value;m.material.opacity=value?.10:1;m.material.depthWrite=!value});for(const id of['truss','block','springs','claw','circuit'])groups.get(id)?.forEach(m=>m.visible=value);highlight(selected)}
let highlighted=[];function highlight(id){highlighted.forEach(m=>m.material.emissive?.setHex(0));highlighted=[];for(const m of groups.get(id)||[]){if(!m.visible||!m.material.emissive)continue;if(!m.userData.uniqueMat){m.material=m.material.clone();m.userData.uniqueMat=true}m.material.emissive.setHex(0x102238);highlighted.push(m)}labelEls.forEach((b,i)=>b.classList.toggle('active',labelIds[i]===id))}
let firstResize=true;function resize(){const {width,height}=viewport.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();if(firstResize){reset();firstResize=false}}
function reset(back=false){motion=null;closePopup();document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===(back?'back':'front')));const mobile=viewport.clientWidth<600;guitar.position.set(mobile?(back?-.15:.15):(back?-1.65:1.65),mobile?-1.25:0,0);guitar.rotation.z=mobile?-.20:-.26;controls.target.set(0,mobile?1.05:1.25,0);const dist=mobile?25.5:16.8;camera.position.set(back?-1.2:1.2,mobile?1.8:2.5,back?-dist:dist);controls.update()}
const focusSpans={headstock:1.6,tuners:.65,posts:.27,tree:.34,nut:.56,frets:.72,markers:.30,sideDots:.28,neckPickup:.90,middlePickup:.90,bridgePickup:.90,poles:.30,selector:.55,volume:.42,tone:.42,bridge:1.0,saddles:.46,arm:1.35,jack:.56,strap:.38,neckPlate:.78,backCover:1.9,springs:1.25,block:.78,claw:.85,circuit:1.45};
function focus(id){
document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));
const p=byId.get(id);if(p[3]==='inside'&&!internal)xray(true);
const point=selected===id&&popupLocal?guitar.localToWorld(popupLocal.clone()):anchor(id);
let direction=surfaceAnchor?camera.position.clone().sub(controls.target).normalize():new THREE.Vector3(.12,.06,1).normalize();
if(!surfaceAnchor&&['neck','neckPlate','backCover','springs','claw','block'].includes(id))direction.set(-.18,.06,-1).normalize();
if(!surfaceAnchor&&id==='sideDots')direction.set(-1,.08,.45).normalize();
const tangent=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),span=focusSpans[id];
const distance=span?THREE.MathUtils.clamp(span/(2*tangent*Math.min(camera.aspect,1)*.36),1.5,15):10;
const screenUp=new THREE.Vector3(0,1,0).addScaledVector(direction,-direction.y).normalize(),right=new THREE.Vector3().crossVectors(screenUp,direction).normalize();
const target=point.clone();
if(viewport.clientWidth<600)target.addScaledVector(screenUp,-distance*tangent*.48);
else target.addScaledVector(right,distance*tangent*camera.aspect*.22);
const endPosition=target.clone().addScaledVector(direction,distance);
if(matchMedia('(prefers-reduced-motion: reduce)').matches){motion=null;controls.target.copy(target);camera.position.copy(endPosition);controls.update();}
else motion={start:performance.now(),from:camera.position.clone(),to:endPosition,fromTarget:controls.target.clone(),toTarget:target};
}
controls.addEventListener('start',()=>{motion=null;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed','false'))});
sceneApi={highlight,xray,focus,setAnchor,cancelFocus:()=>{motion=null},isSmall:id=>Object.hasOwn(focusSpans,id)};document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>reset(b.dataset.view==='back'));$('#xray').onclick=()=>xray();$('#reset').onclick=()=>{if(internal)xray(false);reset()};const zoom=f=>{motion=null;const d=camera.position.clone().sub(controls.target);d.setLength(THREE.MathUtils.clamp(d.length()*f,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(d);controls.update()};$('#zoom-in').onclick=()=>zoom(.8);$('#zoom-out').onclick=()=>zoom(1.25);
viewport.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','0'].includes(e.key))return;e.preventDefault();motion=null;if(e.key==='0')return reset();if(['+','=','-'].includes(e.key))return zoom(e.key==='-'?1.15:.87);const d=camera.position.clone().sub(controls.target);if(e.key==='ArrowLeft'||e.key==='ArrowRight')d.applyAxisAngle(new THREE.Vector3(0,1,0),e.key==='ArrowLeft'?.16:-.16);else d.applyAxisAngle(new THREE.Vector3().crossVectors(d,camera.up).normalize(),e.key==='ArrowUp'?.12:-.12);camera.position.copy(controls.target).add(d);controls.update()});
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();function hit(e){const r=viewport.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);return ray.intersectObjects(meshes).find(h=>h.object.visible&&(!internal||!opaque.includes(h.object)))}
const pointers=new Set();let start=null,gesture=false;viewport.addEventListener('pointerdown',e=>{pointers.add(e.pointerId);if(pointers.size>1)gesture=true;start=[e.clientX,e.clientY]});viewport.addEventListener('pointerup',e=>{if(!gesture&&e.button===0&&start&&Math.hypot(e.clientX-start[0],e.clientY-start[1])<5){const h=hit(e);if(h)select(h.object.userData.part,false,h.point);else closePopup()}pointers.delete(e.pointerId);if(!pointers.size)gesture=false;start=null});viewport.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);start=null;if(!pointers.size)gesture=false});viewport.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType==='touch')return;const h=hit(e),id=h?.object.userData.part;if(id!==hover){hover=id;viewport.style.cursor=id?'pointer':'grab';$('#hover-hint').textContent=id?partLabel(byId.get(id)):ui.hoverHint;if(!selected)highlight(id)}});viewport.addEventListener('pointerleave',()=>{hover=null;if(!selected)highlight(null)});
new ResizeObserver(resize).observe(viewport);resize();$('#loading').hidden=true;
let running=true;renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();running=false;$('#loading').hidden=false;$('#loading').textContent=ui.contextLost});
function positionPopup(){if(!selected||$('#part-popup').hidden||!popupLocal)return;const popup=$('#part-popup'),w=viewport.clientWidth,h=viewport.clientHeight,v=guitar.localToWorld(popupLocal.clone()).project(camera),x=(v.x*.5+.5)*w,y=(-v.y*.5+.5)*h;const pw=popup.offsetWidth,ph=popup.offsetHeight,margin=16,topMin=80,bottomMax=h-115;const gap=w<600?40:Math.max(90,Math.min(180,h*.16));let left=x+gap;if(left+pw>w-margin)left=x-pw-gap;left=THREE.MathUtils.clamp(left,margin,w-pw-margin);let top=THREE.MathUtils.clamp(w<600?y+44:y-ph*.35,topMin,Math.max(topMin,bottomMax-ph));popup.style.left=`${left}px`;popup.style.top=`${top}px`;const visible=v.z<1&&x>0&&x<w&&y>65&&y<h-100;$('#anchor-dot').hidden=!visible;if(visible){$('#anchor-dot').style.left=`${x}px`;$('#anchor-dot').style.top=`${y}px`;const endX=left>x?left:left+pw,endY=THREE.MathUtils.clamp(y,top+20,top+ph-20);$('#connector-path').setAttribute('d',`M ${x} ${y} L ${(x+endX)/2} ${y} L ${endX} ${endY}`)}else $('#connector-path').setAttribute('d','');}
function render(){requestAnimationFrame(render);if(!running||document.hidden)return;if(motion){const t=Math.min((performance.now()-motion.start)/650,1),ease=t*t*(3-2*t);camera.position.lerpVectors(motion.from,motion.to,ease);controls.target.lerpVectors(motion.fromTarget,motion.toTarget,ease);if(t===1)motion=null;}controls.update();scene.updateMatrixWorld();const w=viewport.clientWidth,h=viewport.clientHeight,cameraLocal=guitar.worldToLocal(camera.position.clone());labelEls.forEach((b,i)=>{const pos=anchor(labelIds[i]),v=pos.clone().project(camera),x=(v.x*.5+.5)*w,y=(-v.y*.5+.5)*h;b.hidden=cameraLocal.z<0||internal||v.z>1||x<20||x>w-35||y<80||y>h-110||!!selected;b.style.left=`${x}px`;b.style.top=`${y}px`});positionPopup();renderer.render(scene,camera)}render();window.guitarExplorer={select,parts:parts.length,stringPaths,get zooming(){return !!motion},get internal(){return internal},get camera(){return camera.position.toArray()},get target(){return controls.target.toArray()},project(id){return anchor(id).project(camera).toArray()}};
}
