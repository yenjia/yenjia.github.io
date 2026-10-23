(() => {
  // Pure grid maths for the SVD and diffusion entrances; tests/raven-grid.test.cjs
  // loads this file in Node, where only these functions are exported.
  const grids = {
    ramp: ' .:-=+*#%@',
    // ASCII art as a row-major brightness grid in [0, 1].
    brightness(ascii) {
      const lines = ascii.split('\n'), rows = lines.length, columns = Math.max(...lines.map(line => line.length));
      const target = new Float32Array(rows*columns), top = grids.ramp.length-1;
      lines.forEach((line, y) => { for (let x = 0; x < columns; x++) target[y*columns+x] = Math.max(0, grids.ramp.indexOf(line[x] || ' '))/top; });
      return {rows, columns, target};
    },
    svdLayers(target, rows, columns) {
      const cells = rows*columns;
      // A = UΣVᵀ, so the rank-k image is U_k U_kᵀ A. The eigenvectors of the
      // small 23×23 matrix AAᵀ are U and its eigenvalues are σ²; Jacobi rotations
      // diagonalise it in well under a millisecond.
      const n = rows, m = new Float64Array(n*n), u = new Float64Array(n*n);
      for (let i = 0; i < n; i++) { u[i*n+i] = 1; for (let j = 0; j < n; j++) { let sum = 0; for (let x = 0; x < columns; x++) sum += target[i*columns+x]*target[j*columns+x]; m[i*n+j] = sum; } }
      for (let sweep = 0; sweep < 60; sweep++) {
        let off = 0; for (let p = 0; p < n; p++) for (let q = p+1; q < n; q++) off += m[p*n+q]**2;
        if (off < 1e-22) break;
        for (let p = 0; p < n; p++) for (let q = p+1; q < n; q++) {
          const apq = m[p*n+q]; if (Math.abs(apq) < 1e-300) continue;
          const theta = (m[q*n+q]-m[p*n+p])/(2*apq), t = (theta < 0 ? -1 : 1)/(Math.abs(theta)+Math.hypot(theta,1)), c = 1/Math.hypot(t,1), s = t*c;
          for (let k = 0; k < n; k++) { const kp = m[k*n+p], kq = m[k*n+q]; m[k*n+p] = c*kp-s*kq; m[k*n+q] = s*kp+c*kq; }
          for (let k = 0; k < n; k++) { const pk = m[p*n+k], qk = m[q*n+k]; m[p*n+k] = c*pk-s*qk; m[q*n+k] = s*pk+c*qk; }
          for (let k = 0; k < n; k++) { const kp = u[k*n+p], kq = u[k*n+q]; u[k*n+p] = c*kp-s*kq; u[k*n+q] = s*kp+c*kq; }
        }
      }
      const order = Array.from({length:n}, (_, i) => i).sort((a, b) => m[b*n+b]-m[a*n+a]);
      const energy = order.map(i => Math.max(0, m[i*n+i])), total = energy.reduce((a, b) => a+b, 0);
      const rank = energy.filter(value => value > total*1e-12).length;
      // Partial sums of the rank-one layers u uᵀA, so any fractional rank is a blend of two.
      const sums = [new Float32Array(cells)], kept = [0];
      for (let k = 0; k < rank; k++) {
        const i = order[k], next = Float32Array.from(sums[k]);
        for (let x = 0; x < columns; x++) {
          let dot = 0; for (let y = 0; y < n; y++) dot += u[y*n+i]*target[y*columns+x];
          for (let y = 0; y < n; y++) next[y*columns+x] += u[y*n+i]*dot;
        }
        sums.push(next); kept.push(kept[k]+energy[k]/total);
      }
      return {rank, sums, kept};
    },
    denoise(target, steps = 50, random = Math.random) {
      const cells = target.length;
      // DDPM ancestral sampling with a cosine noise schedule. The
      // denoiser is an oracle that always predicts the clean raven x₀; a trained
      // network has to learn that prediction from data.
      const offset = .008, bar = t => Math.cos((t/steps+offset)/(1+offset)*Math.PI/2)**2;
      const alphaBar = Array.from({length:steps+1}, (_, t) => bar(t)/bar(0));
      const gaussian = () => Math.sqrt(-2*Math.log(1-random()))*Math.cos(2*Math.PI*random());
      const clean = target.map(value => value*2-1), frames = new Array(steps+1);
      let x = Float32Array.from({length:cells}, gaussian); frames[steps] = x;
      for (let t = steps; t > 0; t--) {
        const ab = alphaBar[t], prev = alphaBar[t-1], beta = Math.min(.999, 1-ab/prev);
        const a = Math.sqrt(prev)*beta/(1-ab), b = Math.sqrt(1-beta)*(1-prev)/(1-ab), sigma = t > 1 ? Math.sqrt(beta*(1-prev)/(1-ab)) : 0;
        const next = new Float32Array(cells);
        for (let i = 0; i < cells; i++) next[i] = a*clean[i]+b*x[i]+sigma*gaussian();
        frames[t-1] = x = next;
      }
      return {steps, alphaBar, frames};
    },
  };
  if (typeof module === 'object' && module.exports) { module.exports = grids; return; }
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
  const panel = document.querySelector('.raven-methods'), readout = panel?.querySelector('.raven-method-readout');
  const choices = [...(panel?.querySelectorAll('[data-raven-method]') || [])];
  const times = {draw:2500, hold:150, morph:650};
  // SVD and diffusion rebuild the ASCII grid itself, then hold the exact raven.
  const totals = {fourier:3300, svd:3100, diffusion:3400}, gridDraw = {svd:2700, diffusion:3000};
  const constant = data.coefficients.find(term => term[0] === 0);
  const terms = data.coefficients.filter(term => term[0] !== 0).map(([frequency,re,im]) => ({frequency,re,im,radius:Math.hypot(re,im)}));
  let elapsed = 0, last = 0, raf = 0, running = false, first = true, geometry = null, entrance = null, inView = true;
  let path = null, drawnTo = 0, circles = [], centers = null, accent = '', glyphColor = '', said = '';
  let method = 'fourier';
  const ease = value => { value = Math.max(0,Math.min(1,value)); return value*value*(3-2*value); };
  function phase(value) { if(document.body.dataset.fourierPhase !== value) document.body.dataset.fourierPhase = value; }

  const {ramp} = grids, {rows, columns, target} = grids.brightness(data.ascii), cells = rows*columns;
  const grid = new Float32Array(cells);
  let svd = null, diffusion = null;
  function prepareSvd() { svd ||= grids.svdLayers(target, rows, columns); }
  // Fresh noise every run.
  function prepareDiffusion() { diffusion = grids.denoise(target); }
  function say(text) { if (readout && text !== said) readout.textContent = said = text; }
  function describe(done) {
    if (method === 'svd') {
      const rank = done ? svd.rank : Math.min(svd.rank, Math.floor(gridRank()));
      return `rank ${rank}/${svd.rank} · ${done ? (zh ? '完全還原' : 'exact') : `${zh ? '能量 ' : ''}${Math.round(svd.kept[rank]*100)}%${zh ? '' : ' energy'}`}`;
    }
    if (method === 'diffusion') {
      const t = done ? 0 : Math.round(gridStep());
      return t ? `t = ${t}/${diffusion.steps} · ${zh ? '雜訊' : 'noise'} ${Math.round(Math.sqrt(1-diffusion.alphaBar[t])*100)}%` : `t = 0 · ${zh ? '去噪完成' : 'clean'}`;
    }
    const share = done ? 1 : Math.min(1, elapsed/times.draw);
    return `${data.harmonics} ${zh ? '項' : 'terms'} · ${Math.round(share*100)}%`;
  }
  const gridShare = () => Math.min(1, elapsed/gridDraw[method]);
  // Geometric rank sweep: early ranks change the picture most, so they get the time.
  const gridRank = () => svd.rank**ease(gridShare());
  // Under the cosine schedule the raven only surfaces in the last steps; move faster through pure noise.
  const gridStep = () => diffusion.steps*(1-gridShare())**1.6;
  function fillGrid() {
    if (method === 'svd') {
      const rank = gridRank(), k = Math.min(svd.rank-1, Math.floor(rank)), f = Math.min(1, rank-k), from = svd.sums[k], to = svd.sums[k+1];
      for (let i = 0; i < cells; i++) grid[i] = from[i]+(to[i]-from[i])*f;
    } else {
      const step = gridStep(), t = Math.floor(step), f = step-t, from = diffusion.frames[t], to = diffusion.frames[Math.min(diffusion.steps, t+1)];
      for (let i = 0; i < cells; i++) grid[i] = (from[i]+(to[i]-from[i])*f+1)/2;
    }
  }
  function renderGrid() {
    const g = geometry; ctx.clearRect(0,0,g.width,g.height);
    fillGrid(); ctx.fillStyle = glyphColor; ctx.font = g.font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
      const level = Math.round(Math.max(0, Math.min(1, grid[y*columns+x]))*(ramp.length-1));
      if (level) ctx.fillText(ramp[level], g.left+(x+.5)*g.cell, g.top+(y+.5)*g.line);
    }
    phase(elapsed < gridDraw[method] ? 'draw' : 'hold');
    say(describe(false));
  }

  function preparePath() {
    if(path) return;
    // The exact 320-term, 2,048-sample contour is baked at build time. Decode
    // only when visible; never run a Fourier synthesis on the visitor's CPU.
    const bytes = Uint8Array.from(atob(data.pathBase64), char => char.charCodeAt(0));
    const view = new DataView(bytes.buffer); path = new Float32Array(bytes.length / 2);
    for(let i=0;i<path.length;i++) path[i]=view.getInt16(i*2,true)/data.pathScale;
  }
  function refreshAccent() {
    glyphColor = getComputedStyle(art).color;
    const next = getComputedStyle(root).getPropertyValue('--site-accent').trim() || '#93c5fd';
    if(next !== accent) { accent = next; drawnTo = 0; ink.clearRect(0,0,trace.width,trace.height); }
  }
  function measure(force=false){
    const a=art.getBoundingClientRect(),box=ascii.getBoundingClientRect();
    if(!a.width||!box.height)return;
    const dpr=Math.min(devicePixelRatio||1,2),style=getComputedStyle(ascii);
    const next={width:a.width,height:a.height,x:box.left-a.left+box.width/2,y:box.top-a.top+box.height/2,scale:box.height,dpr,
      left:box.left-a.left,top:box.top-a.top,cell:box.width/columns,line:box.height/rows};
    if(!force && geometry && Object.keys(next).every(key=>Math.abs(next[key]-geometry[key])<.01))return;
    geometry={...next,font:`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`};
    canvas.width=trace.width=Math.round(a.width*dpr);canvas.height=trace.height=Math.round(a.height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);ink.setTransform(dpr,0,0,dpr,0,0);drawnTo=0;
    // Subpixel circles add cost without readable detail. The outline retains
    // all harmonics; only the visible epicycle illustration is simplified.
    circles=terms.filter(term=>term.radius*box.height>=.2).slice(0,96);
    centers=new Float32Array((circles.length+1)*2);
    if(running)render();
  }
  function select(next){
    method=next;
    for(const choice of choices)choice.setAttribute('aria-pressed',String(choice.dataset.ravenMethod===method));
  }
  function finish(){
    entrance?.disconnect();
    running=false;cancelAnimationFrame(raf);raf=0;clearTimeout(window.fourierIntroFallback);
    root.classList.remove('fourier-intro-pending');raven.removeAttribute('data-fourier-running');raven.disabled=false;
    ascii.style.removeProperty('opacity');canvas.hidden=true;art.classList.remove('fourier-intro-art');
    // No retained drawing buffers or animation loop after the intro.
    canvas.width=canvas.height=trace.width=trace.height=1;geometry=null;
    if(method==='svd')prepareSvd();else if(method==='diffusion'&&!diffusion)prepareDiffusion();
    say(describe(true));
    status.textContent=zh?'動畫完成，現在可點擊烏鴉餵光點。':'Animation complete. Click the raven to feed it.';
    phase('done');
  }
  function render(){
    if(!geometry)return;
    if(method!=='fourier'){renderGrid();return;}
    if(!path)return;
    const g=geometry,progress=Math.min(1,elapsed/times.draw),morph=Math.max(0,(elapsed-times.draw-times.hold)/times.morph);
    phase(elapsed<times.draw?'draw':elapsed<times.draw+times.hold?'hold':'morph');
    say(describe(false));
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
    if(last)elapsed=Math.min(totals[method],elapsed+now-last);last=now;render();
    if(elapsed>=totals[method]){finish();return;}raf=requestAnimationFrame(frame);
  }
  function resume(){if(running&&!document.hidden&&inView&&!raf){last=0;raf=requestAnimationFrame(frame);}}
  function start(force=false){
    entrance?.disconnect();
    if(reduced.matches&&!force){finish();return;}
    cancelAnimationFrame(raf);raf=0;
    running=false;
    if(!first)document.dispatchEvent(new CustomEvent('raven-eco',{detail:'wake'}));
    first=false;running=true;elapsed=0;last=0;status.textContent='';
    if(method==='fourier')preparePath();else if(method==='svd')prepareSvd();else prepareDiffusion();
    root.classList.remove('fourier-intro-pending');clearTimeout(window.fourierIntroFallback);
    raven.disabled=true;raven.setAttribute('data-fourier-running','true');art.classList.add('fourier-intro-art');canvas.hidden=false;
    ascii.style.opacity='0';refreshAccent();measure(true);resume();
  }
  // Each visit opens with the next method; storage failures fall back to Fourier.
  const methods=['fourier','svd','diffusion'];
  try{const visit=Number(localStorage.getItem('raven-draw-visit'))||0;select(methods[visit%methods.length]);localStorage.setItem('raven-draw-visit',String(visit+1));}catch{select('fourier');}
  if(panel)panel.hidden=false;
  for(const choice of choices)choice.addEventListener('click',()=>{select(choice.dataset.ravenMethod);start(true);});
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
