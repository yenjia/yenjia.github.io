(() => {
  const data = window.RAVEN_HOME_FOURIER;
  const root = document.documentElement;
  const raven = document.querySelector('.raven-button'), art = raven?.querySelector('.raven-art');
  const ascii = art?.querySelector('.fetch-ascii'), replay = document.querySelector('#home-fourier-replay');
  if (!data || !ascii) { root.classList.remove('fourier-intro-pending'); return; }
  const canvas = document.createElement('canvas'); canvas.className = 'home-fourier-canvas'; canvas.hidden = true; canvas.setAttribute('aria-hidden','true'); art.append(canvas);
  const trace = document.createElement('canvas');
  const ctx = canvas.getContext('2d'), ink = trace.getContext('2d');
  if (!ctx || !ink) { root.classList.remove('fourier-intro-pending'); canvas.remove(); return; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const zh = document.documentElement.lang.toLowerCase().startsWith('zh');
  const status = document.querySelector('#home-fourier-status');
  const times = {draw:2500, hold:150, morph:650}, total = 3300;
  const constant = data.coefficients.find(term => term[0] === 0);
  const terms = data.coefficients.filter(term => term[0] !== 0).map(([frequency,re,im]) => ({frequency,re,im,radius:Math.hypot(re,im)}));
  let elapsed = 0, last = 0, raf = 0, running = false, first = true, geometry = null, entrance = null, inView = true;
  let path = null, drawnTo = 0, circles = [], centers = null, accent = '';
  const ease = value => { value = Math.max(0,Math.min(1,value)); return value*value*(3-2*value); };
  function phase(value) { if(document.body.dataset.fourierPhase !== value) document.body.dataset.fourierPhase = value; }
  function preparePath() {
    if(path) return;
    // The exact 320-term, 2,048-sample contour is baked at build time. Decode
    // only when visible; never run a Fourier synthesis on the visitor's CPU.
    const bytes = Uint8Array.from(atob(data.pathBase64), char => char.charCodeAt(0));
    const view = new DataView(bytes.buffer); path = new Float32Array(bytes.length / 2);
    for(let i=0;i<path.length;i++) path[i]=view.getInt16(i*2,true)/data.pathScale;
  }
  function refreshAccent() {
    const next = getComputedStyle(root).getPropertyValue('--site-accent').trim() || '#93c5fd';
    if(next !== accent) { accent = next; drawnTo = 0; ink.clearRect(0,0,trace.width,trace.height); }
  }
  function measure(force=false){
    const a=art.getBoundingClientRect(),box=ascii.getBoundingClientRect();
    if(!a.width||!box.height)return;
    const dpr=Math.min(devicePixelRatio||1,2);
    const next={width:a.width,height:a.height,x:box.left-a.left+box.width/2,y:box.top-a.top+box.height/2,scale:box.height,dpr};
    if(!force && geometry && Object.keys(next).every(key=>Math.abs(next[key]-geometry[key])<.01))return;
    geometry=next;
    canvas.width=trace.width=Math.round(a.width*dpr);canvas.height=trace.height=Math.round(a.height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);ink.setTransform(dpr,0,0,dpr,0,0);drawnTo=0;
    // Subpixel circles add cost without readable detail. The outline retains
    // all harmonics; only the visible epicycle illustration is simplified.
    circles=terms.filter(term=>term.radius*box.height>=.2).slice(0,96);
    centers=new Float32Array((circles.length+1)*2);
    if(running)render();
  }
  function finish(){
    entrance?.disconnect();
    running=false;cancelAnimationFrame(raf);raf=0;clearTimeout(window.fourierIntroFallback);
    root.classList.remove('fourier-intro-pending');raven.removeAttribute('data-fourier-running');raven.disabled=false;
    ascii.style.removeProperty('opacity');canvas.hidden=true;art.classList.remove('fourier-intro-art');
    // No retained drawing buffers or animation loop after the intro.
    canvas.width=canvas.height=trace.width=trace.height=1;geometry=null;
    status.textContent=zh?'動畫完成，現在可點擊烏鴉餵光點。':'Animation complete. Click the raven to feed it.';
    phase('done');
  }
  function render(){
    if(!geometry||!path)return;
    const g=geometry,progress=Math.min(1,elapsed/times.draw),morph=Math.max(0,(elapsed-times.draw-times.hold)/times.morph);
    phase(elapsed<times.draw?'draw':elapsed<times.draw+times.hold?'hold':'morph');
    ctx.clearRect(0,0,g.width,g.height);
    const circleOpacity=(1-ease((elapsed-times.draw+100)/300))*ease(elapsed/90);
    if(circleOpacity>0){
      let x=g.x+constant[1]*g.scale,y=g.y+constant[2]*g.scale;
      centers[0]=x;centers[1]=y;
      for(let i=0;i<circles.length;i++){
        const term=circles[i],angle=2*Math.PI*term.frequency*progress,c=Math.cos(angle),s=Math.sin(angle);
        x+=(term.re*c-term.im*s)*g.scale;y+=(term.re*s+term.im*c)*g.scale;
        centers[(i+1)*2]=x;centers[(i+1)*2+1]=y;
      }
      ctx.strokeStyle=accent;ctx.lineWidth=.75;
      // Batch circles into two strokes and the vector chain into one stroke.
      for(const large of [true,false]){
        ctx.globalAlpha=circleOpacity*(large?.48:.6);ctx.beginPath();
        for(let i=0;i<circles.length;i++){
          const radius=circles[i].radius*g.scale;if((radius>8)!==large)continue;
          const cx=centers[i*2],cy=centers[i*2+1];ctx.moveTo(cx+radius,cy);ctx.arc(cx,cy,radius,0,Math.PI*2);
        }
        ctx.stroke();
      }
      ctx.globalAlpha=circleOpacity*.5;ctx.beginPath();ctx.moveTo(centers[0],centers[1]);
      for(let i=1;i<=circles.length;i++)ctx.lineTo(centers[i*2],centers[i*2+1]);
      const end=Math.floor(progress*data.samples)*2,tipX=g.x+path[end]*g.scale,tipY=g.y+path[end+1]*g.scale;
      ctx.lineTo(tipX,tipY);ctx.stroke();
      ctx.globalAlpha=circleOpacity;ctx.fillStyle=accent;ctx.beginPath();ctx.arc(tipX,tipY,1.7,0,Math.PI*2);ctx.fill();
    }
    const end=Math.floor(progress*data.samples);
    if(end>drawnTo){
      // Append only new segments to a small raster cache. Previously every
      // frame rebuilt and blurred the entire prefix of the contour.
      ink.strokeStyle=accent;ink.lineCap='round';ink.lineJoin='round';
      ink.beginPath();ink.moveTo(g.x+path[drawnTo*2]*g.scale,g.y+path[drawnTo*2+1]*g.scale);
      for(let i=drawnTo+1;i<=end;i++)ink.lineTo(g.x+path[i*2]*g.scale,g.y+path[i*2+1]*g.scale);
      // A translucent under-stroke keeps the soft edge without a Canvas
      // blur filter, which can stall the first raster on Chromium/Brave.
      ink.lineWidth=2.5;ink.globalAlpha=.16;ink.stroke();
      ink.lineWidth=1.05;ink.globalAlpha=1;ink.stroke();drawnTo=end;
    }
    ctx.globalAlpha=1-ease(morph);ctx.drawImage(trace,0,0,g.width,g.height);ctx.globalAlpha=1;
    if(morph>0)ascii.style.opacity=String(ease(morph));
  }
  function frame(now){
    raf=0;if(!running||document.hidden||!inView)return;
    if(last)elapsed=Math.min(total,elapsed+now-last);last=now;render();
    if(elapsed>=total){finish();return;}raf=requestAnimationFrame(frame);
  }
  function resume(){if(running&&!document.hidden&&inView&&!raf){last=0;raf=requestAnimationFrame(frame);}}
  function start(force=false){
    entrance?.disconnect();
    if(reduced.matches&&!force){finish();return;}
    cancelAnimationFrame(raf);raf=0;
    running=false;
    if(!first)document.dispatchEvent(new CustomEvent('raven-eco',{detail:'wake'}));
    first=false;preparePath();running=true;elapsed=0;last=0;status.textContent='';
    root.classList.remove('fourier-intro-pending');clearTimeout(window.fourierIntroFallback);
    raven.disabled=true;raven.setAttribute('data-fourier-running','true');art.classList.add('fourier-intro-art');canvas.hidden=false;
    ascii.style.opacity='0';refreshAccent();measure(true);resume();
  }
  for(const type of ['raven-attention','raven-preen','raven-eco'])document.addEventListener(type,event=>{if(running)event.stopImmediatePropagation();},true);
  replay?.addEventListener('click',()=>{raven.scrollIntoView({block:'center',behavior:'instant'});start(true);});
  new ResizeObserver(()=>{if(running)measure();}).observe(ascii);
  new MutationObserver(()=>{if(running)refreshAccent();}).observe(root,{attributes:true,attributeFilter:['class','style','data-site-theme']});
  new IntersectionObserver(entries=>{
    inView=entries[0].isIntersecting;
    if(!inView){cancelAnimationFrame(raf);raf=0;last=0;}else resume();
  }).observe(raven);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0;}else resume();});
  reduced.addEventListener('change',()=>{if(reduced.matches)finish();});
  document.fonts.ready.then(()=>{
    if(replay)replay.disabled=false;
    if(reduced.matches){finish();return;}
    root.classList.remove('fourier-intro-pending');clearTimeout(window.fourierIntroFallback);
    phase('waiting');
    entrance=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.6))start();
    },{threshold:.6,rootMargin:'-64px 0px -84px 0px'});
    entrance.observe(raven);
  });
})();
