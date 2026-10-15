(() => {
  const data = window.RAVEN_FOURIER;
  const fallback = document.querySelector('#ascii-fallback');
  fallback.textContent = data.ascii;
  const canvas = document.querySelector('#raven-canvas'), ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const replay = document.querySelector('#replay'), pause = document.querySelector('#pause');
  const terms = document.querySelector('#terms'), circles = document.querySelector('#show-circles');
  const label = document.querySelector('#phase-label'), percent = document.querySelector('#phase-progress');
  const fill = document.querySelector('#timeline-fill'), status = document.querySelector('#animation-status');
  const times = {draw: 4700, hold: 350, morph: 1450};
  const total = times.draw + times.hold + times.morph;
  let width = 0, height = 0, artHeight = 0, origin, glyphs = [], path = [];
  let count = +terms.value, elapsed = 0, last = 0, raf = 0, paused = false, finished = false, phase = '';
  const constant = data.coefficients.find(term => term[0] === 0);
  const harmonics = data.coefficients.filter(term => term[0] !== 0);
  let selected = [];
  const ease = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  const position = t => {
    let x = 0, y = 0;
    for (const [f, re, im] of selected) {
      const angle = 2 * Math.PI * f * t, c = Math.cos(angle), s = Math.sin(angle);
      x += re * c - im * s; y += re * s + im * c;
    }
    return {x, y};
  };
  function preparePath() {
    selected = [constant, ...harmonics.slice(0, count)];
    path = Array.from({length: 1201}, (_, i) => position(i / 1200));
    const lines = data.ascii.split('\n'); glyphs = [];
    for (let row = 0; row < lines.length; row++) for (let col = 0; col < lines[row].length; col++) {
      const character = lines[row][col]; if (character === ' ') continue;
      const x = (col + .5 - data.columns / 2) * data.cellAspect / data.rows;
      const y = (row + .5) / data.rows - .5;
      let distance = Infinity;
      for (let i = 0; i < path.length; i += 4) distance = Math.min(distance, Math.hypot(x - path[i].x, y - path[i].y));
      glyphs.push({character, row, col, depth: distance});
    }
    const max = Math.max(...glyphs.map(g => g.depth));
    glyphs.forEach(g => { g.reveal = g.depth / max * .52 + ((g.col * 17 + g.row * 23) % 19) / 19 * .06; });
  }
  function resize() {
    const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Reserve room for large epicycles and keep the same ASCII proportions.
    artHeight = Math.min(height * .67, width * .68, 430);
    origin = {x: width / 2, y: height / 2 + 8};
    render();
  }
  function screen(point) { return {x: origin.x + point.x * artHeight, y: origin.y + point.y * artHeight}; }
  function updatePhase(next) {
    if (phase === next) return;
    phase = next; document.body.dataset.phase = next;
    label.textContent = {draw: '01 / FOURIER', hold: '02 / CONTOUR', morph: '03 / ASCII', done: 'ASCII / COMPLETE'}[next];
    document.querySelectorAll('.sequence [data-phase]').forEach(node => node.classList.toggle('active', node.dataset.phase === next || next === 'done' && node.dataset.phase === 'morph'));
    if (next === 'done') status.textContent = '輪廓已轉為目前首頁的 ASCII 烏鴉。';
  }
  function render() {
    if (!origin) return;
    ctx.clearRect(0, 0, width, height);
    const drawing = Math.min(1, elapsed / times.draw);
    const morph = Math.max(0, Math.min(1, (elapsed - times.draw - times.hold) / times.morph));
    updatePhase(elapsed >= total ? 'done' : elapsed >= times.draw + times.hold ? 'morph' : elapsed >= times.draw ? 'hold' : 'draw');
    percent.textContent = `${String(Math.floor(drawing * 100)).padStart(3, '0')}%`;
    fill.style.width = `${Math.min(100, elapsed / total * 100)}%`;
    const lineAlpha = 1 - ease(morph / .9);
    const circleAlpha = (1 - ease((elapsed - times.draw + 180) / 650)) * ease(elapsed / 250);
    if (circles.checked && circleAlpha > 0) {
      ctx.lineWidth = .7; let x = origin.x, y = origin.y;
      for (const [f, re, im] of selected) {
        const angle = Math.PI * 2 * f * drawing, radius = Math.hypot(re, im) * artHeight;
        const nextX = x + (re * Math.cos(angle) - im * Math.sin(angle)) * artHeight;
        const nextY = y + (re * Math.sin(angle) + im * Math.cos(angle)) * artHeight;
        if (f !== 0 && radius > .38) {
          ctx.strokeStyle = `rgba(147,197,253,${circleAlpha * (radius > 12 ? .23 : .38)})`;
          ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.stroke();
          ctx.strokeStyle = `rgba(195,218,244,${circleAlpha * .4})`;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nextX, nextY); ctx.stroke();
        }
        x = nextX; y = nextY;
      }
      ctx.fillStyle = `rgba(225,242,255,${circleAlpha})`; ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    if (lineAlpha > 0 && drawing > 0) {
      ctx.lineWidth = 1.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.strokeStyle = `rgba(153,211,255,${lineAlpha})`;
      ctx.shadowColor = '#93c5fd'; ctx.shadowBlur = 8;
      ctx.beginPath();
      const end = Math.floor(drawing * (path.length - 1));
      path.slice(0, end + 1).forEach((point, i) => { const p = screen(point); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
      ctx.stroke(); ctx.shadowBlur = 0;
    }
    if (morph > 0) {
      const size = artHeight / (data.rows * 1.25), lineHeight = size * 1.25;
      ctx.font = `${size}px "JetBrains Mono", monospace`; ctx.textBaseline = 'top';
      const charWidth = ctx.measureText('M').width;
      const left = origin.x - charWidth * data.columns / 2, top = origin.y - artHeight / 2;
      for (const g of glyphs) {
        const opacity = ease((morph - g.reveal) / .34);
        if (!opacity) continue;
        ctx.fillStyle = `rgba(245,245,245,${opacity})`;
        ctx.fillText(g.character, left + g.col * charWidth, top + g.row * lineHeight + (1 - opacity) * 1.5);
      }
    }
  }
  function frame(now) {
    raf = 0;
    if (paused || finished || document.hidden) return;
    if (last) elapsed = Math.min(total, elapsed + now - last);
    last = now; render();
    if (elapsed >= total) { finished = true; pause.disabled = true; return; }
    raf = requestAnimationFrame(frame);
  }
  function start(force = false) {
    cancelAnimationFrame(raf); elapsed = 0; last = 0; paused = false; finished = false;
    pause.disabled = false; pause.textContent = 'Ⅱ 暫停'; status.textContent = '';
    if (reduced.matches && !force) {
      elapsed = total; finished = true; pause.disabled = true; render();
      document.querySelector('#motion-note').textContent = '已依減少動態效果設定直接顯示 ASCII。仍可按「重播」主動預覽動畫。';
      return;
    }
    render(); raf = requestAnimationFrame(frame);
  }
  replay.addEventListener('click', () => start(true));
  pause.addEventListener('click', () => {
    paused = !paused; pause.textContent = paused ? '▶ 繼續' : 'Ⅱ 暫停';
    if (paused) { cancelAnimationFrame(raf); raf = 0; }
    else { last = 0; raf = requestAnimationFrame(frame); }
  });
  circles.addEventListener('change', render);
  terms.addEventListener('input', () => {
    count = +terms.value; document.querySelector('#terms-value').value = count;
    document.querySelector('#harmonics-label').textContent = `${count} EPICYCLES`;
    preparePath(); start(true);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else if (!paused && !finished) { last = 0; raf = requestAnimationFrame(frame); }
  });
  reduced.addEventListener('change', () => start());
  new ResizeObserver(resize).observe(canvas);
  preparePath();
  document.fonts.load('16px "JetBrains Mono"').catch(() => []).then(() => {
    replay.disabled = false; circles.disabled = false; terms.disabled = false;
    document.body.classList.add('enhanced'); resize(); start();
  });
})();
