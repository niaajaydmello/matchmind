const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function mountTechText(host, options = {}) {
  if (!host) return;
  host.__techTextCleanup?.();
  const text = options.text || 'MATCHMIND';
  const canvas = document.createElement('canvas');
  canvas.className = 'tech-text-canvas';
  canvas.setAttribute('aria-label', `${text} interactive wordmark`);
  host.replaceChildren(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const pointer = { x: -999, y: -999 };
  let width = 1; let height = 1; let raf = 0; let time = 0; let alive = true;
  const resize = () => { const rect = host.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1); width = Math.max(1, rect.width); height = Math.max(1, rect.height); canvas.width = width * dpr; canvas.height = height * dpr; canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const draw = () => {
    if (!alive) return;
    time += .016; ctx.clearRect(0, 0, width, height);
    const size = Math.min(62, width / (text.length * .72));
    ctx.font = `800 ${size}px Manrope, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const cx = width / 2; const cy = height / 2;
    const gradient = ctx.createLinearGradient(0, 0, width, 0); gradient.addColorStop(0, '#eaf5f0'); gradient.addColorStop(.58, '#a1ffc7'); gradient.addColorStop(1, '#79c9ff');
    ctx.fillStyle = gradient; ctx.globalAlpha = .92; ctx.fillText(text, cx, cy);
    const gap = ctx.measureText(text).width / text.length;
    for (let i = 0; i < text.length; i += 1) {
      const x = cx - (gap * (text.length - 1)) / 2 + gap * i;
      const d = Math.abs(pointer.x - x);
      const active = d < 125;
      if (active) { ctx.save(); ctx.strokeStyle = '#a1ffc7'; ctx.globalAlpha = .9; ctx.setLineDash([3, 3]); ctx.strokeRect(x - gap * .38, cy - size * .56, gap * .76, size * 1.12); ctx.restore(); }
      const speck = Math.sin(time * 2 + i * 1.7) > .86;
      if (speck && !reduceMotion()) { ctx.fillStyle = '#a1ffc7'; ctx.globalAlpha = .65; ctx.fillRect(x + Math.sin(time + i) * 13, cy - size * .75 + (i % 3) * 8, 2, 2); }
    }
    ctx.globalAlpha = 1; if (!reduceMotion()) raf = requestAnimationFrame(draw);
  };
  const wake = () => { if (!alive) return; if (!raf && !reduceMotion()) raf = requestAnimationFrame(draw); else if (reduceMotion()) draw(); };
  host.addEventListener('pointermove', e => { const rect = host.getBoundingClientRect(); pointer.x = e.clientX - rect.left; pointer.y = e.clientY - rect.top; wake(); });
  host.addEventListener('pointerleave', () => { pointer.x = -999; pointer.y = -999; wake(); });
  window.addEventListener('resize', resize, { passive: true }); resize(); wake();
  host.__techTextCleanup = () => { alive = false; if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize', resize); host.__techTextCleanup = null; };
}
