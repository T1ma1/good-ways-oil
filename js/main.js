/* Good Ways Oil — движение и интерактив. Без библиотек. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeIO = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = t => 1 - Math.pow(1 - t, 4);

  /* ---------- прелоадер ---------- */
  const loader = $('.loader');
  const seen = root.classList.contains('seen') || reduce;
  const ready = () => {
    document.body.classList.add('ready');
    try { sessionStorage.setItem('gw-seen', '1'); } catch (e) {}
    setTimeout(() => loader && loader.remove(), 1100);
  };
  if (seen || !loader) {
    requestAnimationFrame(() => requestAnimationFrame(ready));
  } else {
    const num = $('.loader__num'), fill = $('.loader__fill');
    const t0 = performance.now(), D = 1150;
    let fontsOk = false;
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => (fontsOk = true));
    setTimeout(() => (fontsOk = true), 2200);
    const tick = now => {
      let p = clamp((now - t0) / D);
      if (!fontsOk) p = Math.min(p, .88);
      const e = easeIO(p) * 100;
      fill.style.setProperty('--p', e.toFixed(1));
      num.textContent = String(Math.round(e)).padStart(3, '0');
      if (p < 1) requestAnimationFrame(tick); else setTimeout(ready, 140);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- WebGL: вязкое масло в герое ---------- */
  const glInit = () => {
    const cv = $('#gl');
    if (!cv || reduce) return;
    const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) return;
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `
precision highp float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uScroll;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*f*(f*(f*6.-15.)+10.);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*noise(p);p=mat2(1.6,1.2,-1.2,1.6)*p+7.3;a*=.5;}return s;}
float field(vec2 p){
  float t=uTime*.045;
  vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-vec2(t,0.)));
  vec2 r=vec2(fbm(p+2.4*q+vec2(1.7,9.2)+t*.7),fbm(p+2.4*q+vec2(8.3,2.8)-t*.5));
  return fbm(p*.9+2.6*r);
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 m=(uMouse-.5*uRes)/uRes.y;
  vec2 d=p-m;float md=dot(d,d);
  p-=d*exp(-md*5.)*.32;
  p=p*.92+vec2(.35,uScroll*.5);
  float e=.02;
  float h=field(p),hx=field(p+vec2(e,0.)),hy=field(p+vec2(0.,e));
  vec3 n=normalize(vec3((h-hx)/e,(h-hy)/e,.55));
  vec3 v=vec3(0.,0.,1.);
  vec3 l1=normalize(vec3(.55,.65,.6));
  vec3 l2=normalize(vec3(-.6,-.25,.5));
  float s1=pow(max(dot(reflect(-l1,n),v),0.),38.);
  float s2=pow(max(dot(reflect(-l2,n),v),0.),14.);
  float fr=pow(1.-n.z,2.2);
  float band=smoothstep(.34,.72,h);
  vec3 deep=vec3(.018,.014,.012);
  vec3 oil=vec3(.62,.19,.0);
  vec3 col=mix(deep,oil*.42,band*band);
  col+=oil*.5*fr;
  col+=vec3(1.,.66,.22)*s1*1.25;
  col+=vec3(1.,.32,.04)*s2*.42;
  col+=vec3(1.,.5,.1)*exp(-md*7.)*.07;
  float vig=smoothstep(1.3,.2,length((uv-vec2(.62,.5))*vec2(1.05,1.1)));
  col*=mix(.25,1.,vig);
  col=pow(col,vec3(.9));
  gl_FragColor=vec4(col,1.);
}`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : (console.warn(gl.getShaderInfoLog(s)), null); };
    const a = sh(gl.VERTEX_SHADER, vs), b = sh(gl.FRAGMENT_SHADER, fs);
    if (!a || !b) return;
    const pr = gl.createProgram(); gl.attachShader(pr, a); gl.attachShader(pr, b); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(pr, n);
    const uRes = U('uRes'), uTime = U('uTime'), uMouse = U('uMouse'), uScroll = U('uScroll');
    let W = 0, H = 0, scale = .55, mx = .7, my = .55, tx = .7, ty = .55, vis = true, raf = 0, slow = 0;
    const size = () => {
      const r = cv.getBoundingClientRect();
      const k = Math.min(devicePixelRatio || 1, 1.5) * scale;
      W = Math.max(2, Math.round(r.width * k)); H = Math.max(2, Math.round(r.height * k));
      cv.width = W; cv.height = H; gl.viewport(0, 0, W, H);
    };
    size(); addEventListener('resize', size, { passive: true });
    const hero = cv.parentElement;
    hero.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = 1 - (e.clientY - r.top) / r.height; }, { passive: true });
    new IntersectionObserver(([en]) => { vis = en.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(draw); }).observe(hero);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && vis && !raf) raf = requestAnimationFrame(draw); });
    const t0 = performance.now(); let last = t0, frames = 0;
    function draw(now) {
      raf = 0;
      if (!vis || document.hidden) return;
      const dt = now - last; last = now;
      /* слабое устройство: один раз снижаем разрешение */
      if (++frames > 20 && frames < 140) { if (dt > 30) slow++; if (slow > 45 && scale > .34) { scale = .34; slow = -999; size(); } }
      mx = lerp(mx, tx, .045); my = lerp(my, ty, .045);
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uTime, (now - t0) / 1000 + 14);
      gl.uniform2f(uMouse, mx * W, my * H);
      gl.uniform1f(uScroll, scrollY / innerHeight);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (frames === 2) cv.classList.add('is-on');
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
  };
  glInit();

  /* ---------- навигация и меню ---------- */
  const nav = $('#nav'), burger = $('.burger'), menu = $('#menu');
  const setMenu = open => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); document.body.style.overflow = 'hidden'; }
    else { menu.classList.remove('is-open'); document.body.style.overflow = ''; setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 600); }
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); } });

  /* ---------- поиск по каталогу (список — js/catalog.js) ---------- */
  const sBox = $('#search');
  if (sBox && window.GW) {
    const G = window.GW, cats = G.cats, sRoot = root.dataset.root || '';
    const kw = ['дизель грузовик', 'легковой', 'трансмиссия', 'гидравлика', 'охлаждающая жидкость'];
    const norm = s => s.toLowerCase().replace(/ё/g, 'е').replace(/[\s\-−–\/.,+]/g, '');
    const items = G.items.map(it => { const full = it.k + ' ' + cats[it.c][0] + ' ' + kw[it.c] + ' ' + it.n; const pr = it.o.map(o => o[1]).filter(Boolean); return { c: it.c, t: it.n, u: sRoot + it.u.slice(1) + '/', p: pr.length ? Math.min(...pr) : 0, k: norm(full), w: full.split(/\s+/).map(norm) }; });
    /* «5w40» не должно находить «15W-40»: запрос с цифры сверяем с началом слова */
    const hit = (it, t) => (/^\d/.test(t) ? it.w.some(w => w.startsWith(t)) : it.k.includes(t));
    const inp = $('#searchInput'), list = $('#searchList'), meta = $('#searchMeta'), panel = $('.search__panel', sBox);
    const escH = s => s.replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
    const ARR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
    let cur = -1, lastFocus = null;
    const rows = () => $$('.sres', list);
    const setCur = n => { const r = rows(); if (!r.length) return; cur = (n + r.length) % r.length; r.forEach((el, i) => el.classList.toggle('is-cur', i === cur)); r[cur].scrollIntoView({ block: 'nearest' }); };
    const render = () => {
      const toks = inp.value.trim().split(/\s+/).map(norm).filter(Boolean);
      cur = -1;
      if (!toks.length) { meta.textContent = 'Введите вязкость, серию или тип: «5w40», «endure truck», «гидравлическое»'; list.innerHTML = ''; return; }
      const whole = toks.join('');
      const res = items.filter(it => toks.every(t => hit(it, t)) || hit(it, whole));
      meta.textContent = res.length ? 'Найдено: ' + res.length : 'Такого в каталоге нет. Оставьте заявку — подберём аналог или изготовим партию под задачу.';
      list.innerHTML = res.slice(0, 12).map((it, i) => `<li><a class="sres" href="${it.u}" style="--i:${i}"><span class="sres__c mono">${cats[it.c][0]}</span><span class="sres__t">${escH(it.t).replace(/(\d+W-\d+)/g, "<span class=\"nb\">$1</span>")}</span><span class="sres__p mono">${it.p ? 'от ' + Math.round(it.p).toLocaleString('ru-RU') + ' ₽' : 'по запросу'}</span>${ARR}</a></li>`).join('')
        + (res.length > 12 ? `<li class="sres__more mono">Ещё ${res.length - 12} — уточните запрос</li>` : '');
    };
    const openS = () => {
      if (!sBox.hidden) return;
      if (burger.getAttribute('aria-expanded') === 'true') setMenu(false);
      lastFocus = document.activeElement;
      sBox.hidden = false; document.body.style.overflow = 'hidden';
      list.classList.add('is-fresh'); render();
      requestAnimationFrame(() => requestAnimationFrame(() => sBox.classList.add('is-open')));
      setTimeout(() => inp.focus(), 80);
    };
    const closeS = () => {
      if (sBox.hidden) return;
      sBox.classList.remove('is-open'); document.body.style.overflow = '';
      setTimeout(() => { if (!sBox.classList.contains('is-open')) sBox.hidden = true; }, 620);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    $('#searchOpen').addEventListener('click', openS);
    $('#searchClose').addEventListener('click', closeS);
    sBox.addEventListener('click', e => { if (e.target === sBox) closeS(); });
    inp.addEventListener('input', () => { list.classList.remove('is-fresh'); render(); });
    $('#searchChips').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; inp.value = b.textContent; list.classList.add('is-fresh'); render(); inp.focus(); });
    addEventListener('keydown', e => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '');
      if (sBox.hidden) {
        if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); openS(); }
        return;
      }
      if (e.key === 'Escape') { e.preventDefault(); closeS(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setCur(cur + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setCur(cur - 1); }
      else if (e.key === 'Enter' && document.activeElement === inp) { const r = rows(); if (r.length) { e.preventDefault(); location.href = r[Math.max(cur, 0)].href; } }
      else if (e.key === 'Tab') {
        const f = $$('input,button,a[href]', panel); const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- счётчики ---------- */
  const fmt = (v, dec) => dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('ru-RU').replace(/ |\s/g, ' ');
  const countUp = el => {
    const to = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
    if (reduce) { el.textContent = fmt(to, dec); return; }
    const t0 = performance.now(), D = 1500 + Math.min(900, to);
    const step = now => { const p = clamp((now - t0) / D); el.textContent = fmt(to * easeOut(p), dec); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  /* ---------- появление по входу в экран (заголовки, отчёт, счётчики) ---------- */
  const io = new IntersectionObserver(ents => {
    ents.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; io.unobserve(el);
      if (el.dataset.count !== undefined) countUp(el); else el.classList.add('in');
    });
  }, { threshold: .3, rootMargin: '0px 0px -8% 0px' });
  $$('[data-rv], .report, [data-count]').forEach(el => io.observe(el));

  /* ---------- одометр ---------- */
  const story = $('#story');
  let homeScroll = null;
  if (story) {
  const odo = $('#odo');
  const DIG = 8, cells = [];
  for (let i = 0; i < DIG; i++) {
    if (i === 2 || i === 5) { const g = document.createElement('span'); g.className = 'odo__gap'; odo.appendChild(g); }
    const d = document.createElement('span'); d.className = 'odo__d';
    d.innerHTML = '<i>' + '0123456789'.split('').map(n => `<b>${n}</b>`).join('') + '</i>';
    odo.appendChild(d); cells.push(d);
  }
  let odoShown = -1;
  const setOdo = v => {
    v = Math.round(v); if (v === odoShown) return; odoShown = v;
    const s = String(v).padStart(DIG, '0');
    let lead = true;
    cells.forEach((c, i) => {
      c.style.setProperty('--v', s[i]);
      if (s[i] !== '0') lead = false;
      c.classList.toggle('is-acc', !lead);
    });
  };
  const chaps = $$('.chap', story), shots = $$('.story__frame img', story), idx = $('#storyIdx');
  let chap = 0;
  const setChap = n => {
    if (n === chap) return;
    shots.forEach((im, i) => { im.classList.toggle('is-prev', i === chap); im.classList.toggle('is-on', i === n); });
    chaps.forEach((c, i) => c.classList.toggle('is-on', i === n));
    idx.textContent = `0${n + 1} / 03`;
    chap = n;
  };
  const pinMq = matchMedia('(min-width: 960px)');
  let pinned = false;
  const setPinned = () => {
    pinned = pinMq.matches && !reduce;
    story.classList.toggle('is-pinned', pinned);
    if (!pinned) { chaps.forEach(c => c.classList.remove('is-on')); shots.forEach((im, i) => { im.classList.toggle('is-on', i === 0); im.classList.remove('is-prev'); }); chap = 0; chaps[0].classList.add('is-on'); }
  };
  setPinned(); pinMq.addEventListener('change', setPinned);
  /* без закрепления: одометр докручивается сам, когда попадает в экран */
  let odoAuto = false;
  new IntersectionObserver(([en], ob) => {
    if (pinned || odoAuto || !en.isIntersecting) return;
    odoAuto = true; ob.disconnect();
    if (reduce) { setOdo(1e7); story.style.setProperty('--sp', 1); return; }
    const t0 = performance.now(), D = 2600;
    const step = now => { const p = clamp((now - t0) / D); setOdo(1e7 * easeIO(p)); story.style.setProperty('--sp', easeIO(p).toFixed(4)); if (p < 1 && !pinned) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, { threshold: .6 }).observe($('.odo'));
  setOdo(0);

  /* ---------- формула: шаги и уровень в капле ---------- */
  const drop = $('#drop'), steps = $$('.step'), formula = $('#formula');
  const dStep = $('#dropStep'), dName = $('#dropName');
  let stepOn = 0;
  const setStep = n => {
    if (n === stepOn) return; stepOn = n;
    steps.forEach((s, i) => s.classList.toggle('is-on', i === n));
    drop.style.setProperty('--lvl', (n + 1) / 4);
    dStep.textContent = `0${n + 1} / 04`; dName.textContent = steps[n].dataset.name;
  };
  new IntersectionObserver(([en]) => formula.classList.toggle('is-live', en.isIntersecting)).observe(formula);

  homeScroll = vh => {
    if (pinned) {
      const r = story.getBoundingClientRect();
      const sp = clamp(-r.top / (r.height - vh));
      story.style.setProperty('--sp', sp.toFixed(4));
      setOdo(1e7 * easeIO(clamp(sp / .92)));
      setChap(sp < .34 ? 0 : sp < .67 ? 1 : 2);
    }
    if (innerWidth >= 960) {
      let best = 0, bd = 1e9;
      steps.forEach((s, i) => { const r = s.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - vh * .52); if (d < bd) { bd = d; best = i; } });
      setStep(best);
    } else if (drop.getBoundingClientRect().top < vh * .7) {
      /* на телефоне капля стоит над шагами: наполняем её целиком, когда она в кадре */
      drop.style.setProperty('--lvl', 1);
    }
  };
  }

  /* ---------- единый обработчик прокрутки ---------- */
  const dipFill = $('#dipFill'), dipPct = $('#dipPct'), dipLbl = $('#dipLbl');
  const secs = $$('[data-sec]'), band = $('.why__band'), bandImg = band && $('img', band);
  let lastY = scrollY, ticking = false, secName = '';
  const onScroll = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight, max = document.documentElement.scrollHeight - vh;
    nav.classList.toggle('is-solid', y > 40);
    if (Math.abs(y - lastY) > 6) { nav.classList.toggle('is-hidden', y > lastY && y > vh * .6); lastY = y; }
    if (dipFill && secs.length) {
      const p = clamp(y / max);
      dipFill.style.setProperty('--p', p.toFixed(4));
      dipPct.textContent = String(Math.round(p * 100)).padStart(2, '0');
      let cur = secs[0];
      for (const s of secs) if (s.getBoundingClientRect().top <= vh * .5) cur = s;
      if (cur.dataset.sec !== secName) { secName = cur.dataset.sec; dipLbl.textContent = secName; }
    }
    if (homeScroll) homeScroll(vh);
    if (bandImg && !reduce) {
      const r = band.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) bandImg.style.setProperty('--py', (((r.top + r.height / 2) - vh / 2) * -.08).toFixed(1) + 'px');
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- магнитные кнопки ---------- */
  if (fine && !reduce) {
    $$('[data-magnet]').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * .22).toFixed(1) + 'px');
        b.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * .32).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
    });
    /* свет под курсором на карточках */
    $$('.label, .pcard, .ccard, [data-spot]').forEach(c => c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));
  }

  /* ---------- каталог: картинка за курсором ---------- */
  const peek = $('#peek'), peekImg = $('#peekImg'), cats = $('#cats');
  if (fine && peek && !reduce) {
    let px = 0, py = 0, cx = 0, cy = 0, on = false, raf = 0;
    const loop = () => {
      const dx = px - cx; cx = lerp(cx, px, .14); cy = lerp(cy, py, .14);
      peek.style.setProperty('--x', cx.toFixed(1) + 'px'); peek.style.setProperty('--y', cy.toFixed(1) + 'px');
      peek.style.setProperty('--rot', clamp(dx * .05, -7, 7).toFixed(2) + 'deg');
      raf = on || Math.abs(dx) > .5 ? requestAnimationFrame(loop) : 0;
    };
    $$('.cat', cats).forEach(c => { const im = new Image(); im.src = c.dataset.img; });
    cats.addEventListener('pointermove', e => {
      const c = e.target.closest('.cat'); if (!c) return;
      px = e.clientX + 28; py = e.clientY - 120;
      if (px + 400 > innerWidth) px = e.clientX - 408;
      if (peekImg.dataset.src !== c.dataset.img) { peekImg.dataset.src = c.dataset.img; peekImg.src = c.dataset.img; }
      if (!on) { on = true; cx = px; cy = py; peek.classList.add('is-on'); }
      if (!raf) raf = requestAnimationFrame(loop);
    });
    cats.addEventListener('pointerleave', () => { on = false; peek.classList.remove('is-on'); });
    addEventListener('scroll', () => { if (on) { on = false; peek.classList.remove('is-on'); } }, { passive: true });
  }

  /* ---------- лента хитов: перетаскивание и стрелки ---------- */
  const rail = $('#rail'), prev = $('#railPrev'), next = $('#railNext');
  if (rail) {
    $$('.label', rail).forEach(l => l.insertAdjacentHTML('afterbegin', '<svg class="label__mark" aria-hidden="true"><use href="#gmark"/></svg>'));
    const stepW = () => (rail.firstElementChild.getBoundingClientRect().width + 14) * (innerWidth < 700 ? 1 : 2);
    const upd = () => { prev.disabled = rail.scrollLeft < 4; next.disabled = rail.scrollLeft > rail.scrollWidth - rail.clientWidth - 4; };
    prev.addEventListener('click', () => rail.scrollBy({ left: -stepW(), behavior: reduce ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: stepW(), behavior: reduce ? 'auto' : 'smooth' }));
    rail.addEventListener('scroll', upd, { passive: true }); upd();
    let down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button) return; down = true; sx = e.clientX; sl = rail.scrollLeft; moved = 0; });
    addEventListener('pointermove', e => { if (!down) return; const d = e.clientX - sx; moved = Math.max(moved, Math.abs(d)); if (moved > 6) { rail.classList.add('is-drag'); rail.scrollLeft = sl - d; } });
    addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => rail.classList.remove('is-drag'), 0); });
    rail.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    rail.addEventListener('dragstart', e => e.preventDefault());
  }

  /* ---------- бегущая строка: дублируем дорожку ---------- */
  const mq = $('.mq');
  if (mq && !reduce) { const t = $('.mq__track', mq); for (let i = 0; i < 2; i++) { const c = t.cloneNode(true); c.setAttribute('aria-hidden', 'true'); mq.appendChild(c); } }

  /* ---------- капля в схеме Good Ways Test идёт на всю высоту линии ---------- */
  const pipe = $('.pipe');
  if (pipe) { const setPipe = () => pipe.style.setProperty('--pipe-h', (pipe.offsetHeight - 60) + 'px'); setPipe(); addEventListener('resize', setPipe, { passive: true }); }

})();
