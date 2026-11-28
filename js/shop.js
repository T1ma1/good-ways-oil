/* Good Ways Oil — магазин: корзина, избранное, фильтры каталога, карточка товара, прайс-лист, формы.
   Данные товаров — window.GW из js/catalog.js (его делает сборщик). Корзина и избранное живут в браузере. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement.dataset.root || '';
  const G = window.GW || { items: [], cats: [] };
  const byU = Object.fromEntries(G.items.map(i => [i.u, i]));
  const link = u => root + u.slice(1) + '/';
  const rub = (n, kop) => n ? n.toLocaleString('ru-RU', kop ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 }) + ' ₽' : 'по запросу';
  const escH = s => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  let cart = store.get('gw-cart').filter(x => byU[x.u] && byU[x.u].o[x.i] && x.q > 0);
  let fav = store.get('gw-fav').filter(u => byU[u]);

  /* ---------- счётчики в шапке ---------- */
  const badges = pop => {
    const n = { cart: cart.reduce((a, x) => a + x.q, 0), fav: fav.length };
    $$('[data-badge]').forEach(b => { const v = n[b.dataset.badge]; b.hidden = !v; b.textContent = v > 99 ? '99+' : v; if (pop === b.dataset.badge) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } });
  };
  const syncFav = () => $$('[data-fav]').forEach(b => { const on = fav.includes(b.dataset.fav); b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', on ? 'Убрать из избранного' : 'В избранное'); });

  /* ---------- сообщение внизу экрана ---------- */
  let toastEl, toastT;
  const toast = html => {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.innerHTML = html; clearTimeout(toastT);
    requestAnimationFrame(() => toastEl.classList.add('is-on'));
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 4200);
  };

  /* ---------- корзина ---------- */
  const add = (u, i, q) => {
    const it = byU[u]; if (!it || !it.o[i]) return;
    const row = cart.find(x => x.u === u && x.i === i);
    if (row) row.q += q; else cart.push({ u, i, q });
    store.set('gw-cart', cart); badges('cart');
    toast(`<span>В корзине: <b>${escH(it.n)}</b>, ${escH(it.o[i][0])}</span><a href="${root}cart/">Оформить →</a>`);
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a) {
      e.preventDefault(); add(a.dataset.add, +a.dataset.offer || 0, 1);
      const s = $('span', a); if (s && !a.dataset.t) { a.dataset.t = s.textContent; s.textContent = 'Добавлено'; a.classList.add('is-done'); setTimeout(() => { s.textContent = a.dataset.t; delete a.dataset.t; a.classList.remove('is-done'); }, 1400); }
      return;
    }
    const f = e.target.closest('[data-fav]');
    if (f) {
      e.preventDefault(); const u = f.dataset.fav;
      fav = fav.includes(u) ? fav.filter(x => x !== u) : fav.concat(u);
      store.set('gw-fav', fav); syncFav(); badges('fav'); renderSaved();
    }
  });

  /* ---------- меню каталога в шапке ---------- */
  const megaBtn = $('#megaBtn'), mega = $('#mega');
  if (megaBtn && mega) {
    const setMega = open => {
      megaBtn.setAttribute('aria-expanded', open);
      if (open) { mega.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => mega.classList.add('is-open'))); }
      else { mega.classList.remove('is-open'); setTimeout(() => { if (!mega.classList.contains('is-open')) mega.hidden = true; }, 560); }
    };
    megaBtn.addEventListener('click', () => setMega(megaBtn.getAttribute('aria-expanded') !== 'true'));
    mega.addEventListener('click', e => { if (e.target === mega || e.target.closest('a')) setMega(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && megaBtn.getAttribute('aria-expanded') === 'true') { setMega(false); megaBtn.focus(); } });
  }

  /* ---------- фильтры каталога ---------- */
  const grid = $('#pgrid');
  if (grid) {
    const cards = $$('.pcard', grid), count = $('#pCount'), empty = $('#pEmpty');
    const order = cards.slice(); let visc = '', sort = 'def', stock = false;
    const apply = () => {
      let n = 0;
      cards.forEach(c => { const ok = (!visc || c.dataset.visc === visc) && (!stock || c.dataset.stock === '1'); c.hidden = !ok; if (ok) n++; });
      const arr = sort === 'def' ? order : order.slice().sort((a, b) => (+a.dataset.price || 1e12) - (+b.dataset.price || 1e12));
      if (sort === 'desc') arr.reverse();
      arr.forEach(c => grid.appendChild(c));
      if (count) count.textContent = 'Показано: ' + n;
      if (empty) empty.hidden = n > 0;
    };
    const fv = $('#fVisc'); if (fv) fv.addEventListener('click', e => { const b = e.target.closest('[data-visc]'); if (!b) return; visc = b.dataset.visc; $$('.fchip', fv).forEach(x => x.classList.toggle('is-on', x === b)); apply(); });
    const fs = $('#fSort'); if (fs) fs.addEventListener('click', e => { const b = e.target.closest('[data-sort]'); if (!b) return; sort = b.dataset.sort; $$('button', fs).forEach(x => x.classList.toggle('is-on', x === b)); apply(); });
    const st = $('#fStock'); if (st) st.addEventListener('change', () => { stock = st.checked; apply(); });
  }

  /* ---------- карточка товара: фасовка, количество, в корзину ---------- */
  const pi = $('.prod__info');
  if (pi) {
    const it = byU[pi.dataset.product]; let idx = +pi.dataset.first || 0;
    const price = $('#pPrice'), sku = $('#pSku'), avail = $('#pAvail'), qty = $('#pQty'), addB = $('#pAdd');
    const show = () => {
      const o = it.o[idx];
      price.textContent = o[1] ? 'от ' + rub(o[1], true) : 'по запросу';
      if (sku && o[2]) sku.textContent = o[2];
      avail.textContent = o[3] ? 'есть в наличии' : 'под заказ'; avail.classList.toggle('ok', !!o[3]);
      $('span', addB).textContent = o[1] ? 'В корзину' : 'Запросить цену';
      $$('.seg__b', pi).forEach((b, i) => { b.classList.toggle('is-on', i === idx); b.setAttribute('aria-pressed', i === idx); });
    };
    if (it) {
      $('#pVols').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; idx = +b.dataset.i; show(); });
      const q = () => Math.max(1, Math.min(999, parseInt(qty.value, 10) || 1));
      $$('[data-q]', pi).forEach(b => b.addEventListener('click', () => { qty.value = Math.max(1, q() + +b.dataset.q); }));
      qty.addEventListener('blur', () => { qty.value = q(); });
      addB.addEventListener('click', () => {
        if (!it.o[idx][1]) { const m = $('#form textarea'); if (m) { m.value = `${it.k} Good Ways ${it.n}, ${it.o[idx][0]} — прошу сообщить цену. `; m.parentElement.classList.add('has-val'); } location.hash = '#ask'; return; }
        add(it.u, idx, q());
      });
      show();
    }
  }

  /* ---------- страница корзины ---------- */
  const cr = $('#cartRoot'), order = $('#order');
  const renderCart = () => {
    if (!cr) return;
    cr.parentElement.classList.toggle('cart--empty', !cart.length);
    if (order) order.hidden = !cart.length;
    if (!cart.length) { cr.innerHTML = `<div class="shop__empty"><p>В корзине пока пусто. Выберите масло в каталоге или найдите его по артикулу в прайс-листе.</p><a class="btn" href="${root}catalog/"><span>В каталог</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>`; return; }
    let sum = 0;
    cr.innerHTML = cart.map((x, n) => {
      const it = byU[x.u], o = it.o[x.i]; sum += o[1] * x.q;
      return `<div class="crow"><div class="crow__t"><a href="${link(it.u)}">${escH(it.k)} ${escH(it.n)}</a><span class="mono">${escH(o[0])}${o[2] ? ' · арт. ' + escH(o[2]) : ''} · от ${rub(o[1], true)}</span></div>
        <div class="qty qty--sm"><button type="button" data-cq="-1" data-n="${n}" aria-label="Меньше">−</button><input value="${x.q}" data-n="${n}" inputmode="numeric" aria-label="Количество"><button type="button" data-cq="1" data-n="${n}" aria-label="Больше">+</button></div>
        <b class="crow__sum">${rub(o[1] * x.q, true)}</b><button type="button" class="crow__x" data-cx="${n}" aria-label="Убрать из корзины">×</button></div>`;
    }).join('') + `<div class="cart__total"><span>Итого, от</span><b>${rub(sum, true)}</b></div><p class="cart__hint">Цены указаны «от». Точную сумму, скидку за объём и стоимость доставки менеджер подтвердит по телефону.</p>`;
  };
  if (cr) {
    const save = () => { cart = cart.filter(x => x.q > 0); store.set('gw-cart', cart); badges(); renderCart(); };
    cr.addEventListener('click', e => {
      const q = e.target.closest('[data-cq]'); if (q) { cart[+q.dataset.n].q = Math.max(1, cart[+q.dataset.n].q + +q.dataset.cq); save(); return; }
      const x = e.target.closest('[data-cx]'); if (x) { cart.splice(+x.dataset.cx, 1); save(); }
    });
    cr.addEventListener('change', e => { const i = e.target.closest('input[data-n]'); if (i) { cart[+i.dataset.n].q = Math.max(1, Math.min(999, parseInt(i.value, 10) || 1)); save(); } });
    renderCart();
  }

  /* ---------- избранное ---------- */
  const sg = $('#savedGrid');
  function renderSaved() { if (!sg) return; let n = 0; $$('.pcard', sg).forEach(c => { const on = fav.includes(c.dataset.u); c.hidden = !on; if (on) n++; }); $('#savedEmpty').hidden = n > 0; }

  /* ---------- прайс-лист ---------- */
  const pl = $('#plRoot');
  if (pl) {
    const q = $('#plQ'), st = $('#plStock'), rows = $$('.plrow:not(.plrow--h)', pl), groups = $$('.plgroup', pl);
    const norm = s => s.toLowerCase().replace(/ё/g, 'е').replace(/[\s\-−–]/g, '');
    rows.forEach(r => { r._t = norm(r.dataset.t); });
    const apply = () => {
      const t = norm(q.value); let n = 0;
      rows.forEach(r => { const ok = (!t || r._t.includes(t)) && (!st.checked || r.dataset.stock === '1'); r.hidden = !ok; if (ok) n++; });
      groups.forEach(g => { g.hidden = !$$('.plrow:not(.plrow--h)', g).some(r => !r.hidden); });
      $('#plEmpty').hidden = n > 0;
    };
    q.addEventListener('input', apply); st.addEventListener('change', apply);
    $('#plPrint').addEventListener('click', () => print());
  }

  /* ---------- формы: заявка и заказ ---------- */
  // Сначала пробуем обработчик на сервере (send.php на хостинге), иначе открываем письмо в почте посетителя.
  const send = async (subject, body, fields) => {
    try {
      const fd = new FormData(); fd.append('subject', subject); fd.append('body', body); Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
      const r = await fetch(root + 'send.php', { method: 'POST', body: fd, headers: { 'X-Requested-With': 'fetch' } });
      if (r.ok && (await r.json()).ok) return 'sent';
    } catch (e) {}
    location.href = 'mailto:oils@good-ways.ru?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    return 'mail';
  };
  const bindForm = (form, msg, build, done) => {
    if (!form) return;
    $$('.fld input, .fld textarea', form).forEach(f => {
      const sync = () => f.parentElement.classList.toggle('has-val', !!f.value);
      f.addEventListener('input', () => { sync(); f.parentElement.classList.remove('is-err'); }); f.addEventListener('blur', sync); sync();
    });
    form.agree.addEventListener('change', () => form.agree.parentElement.classList.remove('is-err'));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const bad = [];
      if (!form.name.value.trim()) bad.push(form.name);
      if (form.phone.value.replace(/\D/g, '').length < 10) bad.push(form.phone);
      bad.forEach(f => f.parentElement.classList.add('is-err'));
      if (!form.agree.checked) form.agree.parentElement.classList.add('is-err');
      if (bad.length) { msg.textContent = 'Укажите имя и телефон — без них не сможем перезвонить.'; bad[0].focus(); return; }
      if (!form.agree.checked) { msg.textContent = 'Нужно согласие на обработку персональных данных.'; return; }
      const btn = $('button[type=submit]', form); btn.disabled = true; msg.textContent = 'Отправляем…';
      const { subject, body } = build();
      const how = await send(subject, body, { name: form.name.value, phone: form.phone.value, email: form.email.value });
      btn.disabled = false;
      msg.textContent = how === 'sent' ? 'Заявка отправлена. Перезвоним в рабочее время.' : 'Открыли письмо в вашей почтовой программе — осталось нажать «Отправить».';
      if (how === 'sent') { form.reset(); $$('.fld', form).forEach(f => f.classList.remove('has-val')); if (done) done(); }
    });
  };
  const head = f => `ФИО: ${f.name.value}\nТелефон: ${f.phone.value}\nПочта: ${f.email.value}\n`;
  const ask = $('#form');
  bindForm(ask, $('#formMsg'), () => ({ subject: 'Заявка с сайта Good Ways Oil', body: head(ask) + `Страница: ${location.href}\n\n${ask.msg.value}` }));
  bindForm(order, $('#orderMsg'), () => {
    let sum = 0;
    const lines = cart.map((x, n) => { const it = byU[x.u], o = it.o[x.i]; sum += o[1] * x.q; return `${n + 1}. ${it.k} Good Ways ${it.n}, ${o[0]}${o[2] ? ', арт. ' + o[2] : ''} — ${x.q} шт × ${rub(o[1], true)} = ${rub(o[1] * x.q, true)}`; });
    return { subject: 'Заказ с сайта Good Ways Oil', body: head(order) + `Комментарий: ${order.msg.value}\n\nЗаказ:\n${lines.join('\n')}\n\nИтого, от: ${rub(sum, true)}` };
  }, () => { cart = []; store.set('gw-cart', cart); badges(); renderCart(); });

  badges(); syncFav(); renderSaved();
})();
