/* Шаблоны страниц Good Ways Oil. Все ссылки строятся от root («../» по глубине страницы),
   поэтому сайт одинаково работает в корне домена и в подпапке GitHub Pages. */
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rub = (n, kop) => n == null ? 'по запросу' : n.toLocaleString('ru-RU', kop ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 }).replace(/[  ]/g, ' ') + ' ₽';
const L = (root, url) => url === '/' ? (root || './') : root + url.slice(1) + '/';
const nb = s => esc(s).replace(/(\d+W-\d+)/g, '<span class="nb">$1</span>');
const I = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  ur: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.2" r="3.7"/><path d="M4.8 20c.7-3.6 3.6-5.600 7.2-5.600s6.500 2 7.200 5.600"/></svg>',
  cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.500 4.500h2.300l2 10.300h9.700l1.800-7.300H6.700"/><circle cx="9.2" cy="18.7" r="1.3"/><circle cx="16.3" cy="18.7" r="1.3"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
};
const GMARK = 'M138.985 61.8167C138.86 64.3253 138.799 66.6544 138.799 68.8038C138.674 70.7162 138.614 72.5969 138.614 74.449C138.614 76.2995 138.552 77.7048 138.427 78.6603C137.686 86.9017 135.363 94.5484 131.462 101.594C127.561 108.642 122.545 114.704 116.418 119.783C110.288 124.857 103.231 128.832 95.242 131.698C87.2561 134.565 78.8675 136 70.0745 136C62.4454 136 55.1605 134.882 48.2276 132.645C53.0514 130.171 57.5058 127.264 61.5955 123.923C65.7152 120.554 69.3878 116.793 72.6101 112.64C76.4096 112.436 80.0837 111.772 83.6342 110.646C87.9665 109.274 91.9293 107.332 95.521 104.825C99.1128 102.314 102.238 99.3302 104.901 95.8646C107.562 92.4005 109.512 88.5786 110.751 84.396H85.4563C85.8147 82.4429 86.0858 80.4519 86.2713 78.4339C86.4093 77.3788 86.4791 75.8241 86.4791 73.7758C86.4791 71.7275 86.5504 69.6445 86.6884 67.5298C86.6884 65.7381 86.728 63.8348 86.8073 61.8182H138.987L138.985 61.8167ZM19.4541 115.169C13.4583 109.206 8.67096 102.293 5.09667 94.4307C3.66949 91.2911 2.51823 88.0715 1.63656 84.7764H28.8814L29.0273 85.113C31.3805 90.4896 34.5695 95.208 38.5925 99.2698C40.0482 100.737 41.5928 102.102 43.2277 103.36C41.6435 104.802 39.9579 106.139 38.1691 107.372C34.1429 110.147 29.7012 112.295 24.844 113.812C23.0759 114.366 21.2777 114.817 19.4557 115.169L19.4541 115.17V115.169ZM0 59.8001C0.785 53.5043 2.48176 47.4576 5.09667 41.6599C8.84222 33.3596 13.9214 26.1325 20.3278 19.9802C20.7036 19.6194 21.0842 19.2617 21.4664 18.91C25.4165 19.9666 29.2128 21.5741 32.8569 23.728C37.0559 26.211 40.7856 29.0367 44.0491 32.2019C42.1081 33.6283 40.2877 35.1996 38.5894 36.9143C34.5647 40.9762 31.3758 45.7248 29.0225 51.1587C27.7999 53.9843 26.8944 56.8658 26.3093 59.8031H0V59.8001ZM50.9868 2.52978C57.0872 0.843764 63.4492 0 70.0729 0C82.3308 0 93.5674 2.74714 103.784 8.24293C114.001 13.7372 122.268 21.0851 128.581 30.2834L106.291 43.3625C102.33 37.749 97.1591 33.0321 90.7812 29.2102C85.6497 26.1325 80.1773 24.2971 74.3639 23.6948C68.1668 15.1485 60.3728 8.09501 50.9852 2.5328V2.52978H50.9868Z';

/* ---------- общие части ---------- */
const specMap = p => Object.fromEntries(p.specs);
const tagOf = p => { const s = specMap(p); if (s['Спецификация API']) return 'API ' + s['Спецификация API'].split(',')[0].trim(); if (s['Спецификация по DIN']) return 'DIN ' + s['Спецификация по DIN'].split(',')[0].trim(); if (s['Класс антифриза']) return s['Класс антифриза']; return s['Тип масла'] || p.kind; };
const viscOf = p => specMap(p)['Вязкость'] || p.des;
const volsOf = p => { const u = [...new Set(p.offers.map(o => o.vol.replace(/^[\d.,]+\s*/, '')))]; return u.length === 1 ? p.offers.map(o => o.vol.replace(/\s*[^\d.,]+$/, '')).join(' · ') + ' ' + u[0] : p.offers.map(o => o.vol).join(' · '); };
const firstPriced = p => Math.max(0, p.offers.findIndex(o => o.price));
const crumbs = (root, list) => `<nav class="crumbs mono" aria-label="Хлебные крошки"><a href="${L(root, '/')}">Главная</a>${list.map(([t, u]) => '<i>/</i>' + (u ? `<a href="${L(root, u)}">${esc(t)}</a>` : `<span aria-current="page">${esc(t)}</span>`)).join('')}</nav>`;
const phero = ({ root, list, eyebrow, h1, lead, extra = '', cls = '' }) => `
<section class="phero ${cls}">
  <canvas class="hero__gl" id="gl" aria-hidden="true"></canvas><div class="phero__shade" aria-hidden="true"></div>
  <div class="wrap phero__in">
    ${crumbs(root, list)}
    ${eyebrow ? `<p class="eyebrow mono"><i class="dot"></i>${esc(eyebrow)}</p>` : ''}
    <h1 class="phero__h" data-rv><span class="ln"><span>${esc(h1)}</span></span></h1>
    ${lead ? `<p class="phero__lead">${esc(lead)}</p>` : ''}${extra}
  </div>
</section>`;

const pcard = (p, root) => `
<article class="pcard" data-u="${p.url}" data-visc="${esc(viscOf(p))}" data-price="${p.min}" data-stock="${p.stock ? 1 : 0}">
  <a class="pcard__main" href="${L(root, p.url)}">
    <span class="pcard__top mono"><i>${esc(p.series)}</i><i>${esc(tagOf(p))}</i></span>
    ${p.img ? `<span class="pcard__ph"><img src="${root}${p.img}" alt="${esc(p.title)}" loading="lazy" width="600" height="600"></span>` : '<svg class="pcard__mark" aria-hidden="true"><use href="#gmark"/></svg>'}
    <b class="pcard__v">${nb(p.des)}</b>
    <span class="pcard__name">${esc(p.kind)} ${nb(p.name)}</span>
  </a>
  <div class="pcard__meta"><span class="mono">${esc(volsOf(p))}</span><span class="chip${p.stock ? ' chip--ok' : ''}">${p.stock ? 'В наличии' : 'Под заказ'}</span></div>
  <div class="pcard__buy">
    <span class="pcard__price">${p.min ? 'от ' + rub(p.min) : 'по запросу'}</span>
    <button class="ibtn ibtn--line fav" type="button" data-fav="${p.url}" aria-label="В избранное" aria-pressed="false">${I.heart}</button>
    <button class="btn btn--sm" type="button" data-add="${p.url}" data-offer="${firstPriced(p)}"><span>В корзину</span></button>
  </div>
</article>`;

const ask = ({ root, title = 'Обсудим ваш парк?', text = 'Расскажите, какая у вас техника и в каких условиях она работает. Подберём масло, пришлём образцы и техническую документацию.', msg = '', eyebrow = 'Заявка' }) => `
<section class="contact" id="ask">
  <div class="wrap contact__grid">
    <div class="contact__copy">
      <p class="eyebrow mono"><i class="dot"></i>${esc(eyebrow)}</p>
      <h2 class="h2 h2--xl" data-rv><span class="ln"><span>${esc(title)}</span></span></h2>
      <p>${esc(text)}</p>
      <div class="contact__direct mono">
        <a href="tel:+78007757870">+7 (800) 775-78-70</a>
        <a href="mailto:oils@good-ways.ru">oils@good-ways.ru</a>
        <a href="https://t.me/pasoldatov" target="_blank" rel="noopener">Telegram →</a>
      </div>
    </div>
    <form class="form" id="form" novalidate>
      <label class="fld"><span>Ваше ФИО</span><input type="text" name="name" autocomplete="name" required></label>
      <div class="form__two">
        <label class="fld"><span>Телефон</span><input type="tel" name="phone" autocomplete="tel" inputmode="tel" required></label>
        <label class="fld"><span>Почта</span><input type="email" name="email" autocomplete="email"></label>
      </div>
      <label class="fld${msg ? ' has-val' : ''}"><span>Какая техника и какой вопрос</span><textarea name="msg" rows="3">${esc(msg)}</textarea></label>
      <label class="chk"><input type="checkbox" name="agree" required><i></i><span>Согласен на&nbsp;<a href="${L(root, '/consent')}" target="_blank">обработку персональных данных</a> и&nbsp;принимаю <a href="${L(root, '/policy')}" target="_blank">политику конфиденциальности</a></span></label>
      <div class="form__foot">
        <button class="btn" type="submit" data-magnet><span>Отправить заявку</span>${I.arrow}</button>
        <p class="form__msg mono" id="formMsg" role="status" aria-live="polite"></p>
      </div>
    </form>
  </div>
</section>`;

/* ---------- каркас страницы ---------- */
function layout(o) {
  const { root, url, kind, cats } = o, home = kind === 'home';
  const body = typeof o.body === 'function' ? o.body(root) : o.body;
  const canon = o.site + (o.canonical || url) + ((o.canonical || url) === '/' ? '' : '/');
  const cta = home ? '#contact' : kind === 'cart' ? '#order' : '#ask';
  const navLinks = [['/o-kompanii', 'Компания'], ['/proizvodstvo-i-kachestvo', 'Производство'], ['/partneram', 'Партнёрам'], ['/price-list', 'Прайс-лист'], ['/warranty', 'Гарантия'], ['/kontakty', 'Контакты']];
  const subUrl = (c, j) => c.subs[j].url;
  return `<!doctype html>
<html lang="ru" data-root="${root}" data-page="${kind}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc || '')}">
<meta name="theme-color" content="#0a0a0b">
${o.prod && !o.noindex ? '' : '<meta name="robots" content="noindex, nofollow">\n'}<link rel="canonical" href="${canon}">
<meta property="og:type" content="${kind === 'product' ? 'product' : 'website'}">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.desc || '')}">
<meta property="og:image" content="${o.site}/assets/img/canisters.jpg">
<link rel="icon" href="${root}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${root}assets/fonts/unbounded-cyrillic-cb504d.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${root}assets/fonts/onest-normal-300-700-cyrillic-d1abf1.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}css/fonts.css">
<link rel="stylesheet" href="${root}css/style.css">
<link rel="stylesheet" href="${root}css/shop.css">
<script>document.documentElement.classList.add('js');${home ? "try{if(sessionStorage.getItem('gw-seen'))document.documentElement.classList.add('seen')}catch(e){}" : ''}</script>
${o.ld ? `<script type="application/ld+json">${JSON.stringify(o.ld)}</script>\n` : ''}</head>
<body>

<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="gmark" viewBox="0 0 139 136"><path d="${GMARK}"/></symbol></svg>
<a class="skip" href="#main">К содержанию</a>
${home ? `
<div class="loader" aria-hidden="true">
  <div class="loader__mark"><svg class="loader__ghost"><use href="#gmark"/></svg><svg class="loader__fill"><use href="#gmark"/></svg></div>
  <div class="loader__row mono"><span>Good Ways Oil</span><span class="loader__num">000</span></div>
</div>` : ''}
<header class="nav" id="nav">
  <div class="nav__top">
    <div class="wrap nav__top-in mono">
      <span class="nav__top-l"><a href="${L(root, '/dostavka')}">Доставка и оплата</a><a href="${L(root, '/ispytaniya-v-realnyh-usloviyah')}">Испытания в реальных условиях</a><a href="${L(root, '/good-ways-test')}">Good Ways Test</a></span>
      <span class="nav__top-r"><span>Пн–Пт с 10:00 до 19:00 по Москве</span><a href="mailto:oils@good-ways.ru">oils@good-ways.ru</a><a href="tel:+78007757870">+7 (800) 775-78-70</a></span>
    </div>
  </div>
  <div class="wrap nav__in">
    <a class="nav__logo" href="${L(root, '/')}" aria-label="Good Ways — на главную"><img src="${root}assets/img/logo.svg" alt="Good Ways" width="987" height="136"></a>
    <nav class="nav__links" aria-label="Основное меню">
      <button class="nav__cat" type="button" id="megaBtn" aria-expanded="false" aria-controls="mega">Каталог${I.down}</button>
      ${navLinks.map(([u, t]) => `<a href="${L(root, u)}"${url === u ? ' aria-current="page"' : ''}>${t}</a>`).join('\n      ')}
    </nav>
    <div class="nav__shop">
      <button class="ibtn" type="button" id="searchOpen" aria-label="Поиск по каталогу" aria-haspopup="dialog" aria-controls="search">${I.search}</button>
      <a class="ibtn ibtn--d" href="${L(root, '/saved')}" aria-label="Избранное">${I.heart}<b class="badge" data-badge="fav" hidden></b></a>
      <a class="ibtn ibtn--d" href="https://good-ways-oil.ru/login" aria-label="Личный кабинет">${I.user}</a>
      <a class="ibtn" href="${L(root, '/cart')}" aria-label="Корзина">${I.cart}<b class="badge" data-badge="cart" hidden></b></a>
    </div>
    <a class="btn btn--sm nav__cta" href="${cta}" data-magnet><span>Оставить заявку</span></a>
    <button class="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu"><i></i><i></i></button>
  </div>
</header>

<div class="mega" id="mega" hidden>
  <div class="mega__panel"><div class="wrap">
    <div class="mega__grid">
      ${cats.map(c => `<div class="mega__col"><a class="mega__h" href="${L(root, c.url)}">${esc(c.meta.nav)}<sup>${c.items.length}</sup></a>${c.subs.map(s => `<a href="${L(root, s.url)}">${esc(s.name)}</a>`).join('')}</div>`).join('\n      ')}
    </div>
    <div class="mega__foot"><a class="btn btn--sm" href="${L(root, '/catalog')}"><span>Весь каталог</span>${I.arrow}</a><a class="mono" href="${L(root, '/price-list')}">Прайс-лист с ценами и артикулами →</a></div>
  </div></div>
</div>

<div class="search" id="search" role="dialog" aria-modal="true" aria-label="Поиск по каталогу" hidden>
  <div class="search__panel"><div class="wrap">
    <div class="search__bar">${I.search}<input type="search" id="searchInput" placeholder="5W-40, HVLP, антифриз…" autocomplete="off" spellcheck="false" aria-label="Что ищем"><button class="search__x mono" type="button" id="searchClose">Закрыть</button></div>
    <div class="search__chips mono" id="searchChips"><span>Часто ищут</span><button type="button">5W-40</button><button type="button">10W-40</button><button type="button">5W-30</button><button type="button">15W-40</button><button type="button">HVLP</button><button type="button">GL-5</button><button type="button">Антифриз</button><button type="button">Endure</button><button type="button">Precision</button></div>
    <p class="search__meta mono" id="searchMeta" aria-live="polite"></p>
    <ul class="search__list" id="searchList"></ul>
  </div></div>
</div>

<div class="menu" id="menu" hidden>
  <nav class="menu__links" aria-label="Меню">
    <a href="${L(root, '/catalog')}"><span class="mono">01</span>Каталог</a>
    <a href="${L(root, '/o-kompanii')}"><span class="mono">02</span>Компания</a>
    <a href="${L(root, '/proizvodstvo-i-kachestvo')}"><span class="mono">03</span>Производство</a>
    <a href="${L(root, '/partneram')}"><span class="mono">04</span>Партнёрам</a>
    <a href="${L(root, '/good-ways-test')}"><span class="mono">05</span>Good Ways Test</a>
    <a href="${L(root, '/kontakty')}"><span class="mono">06</span>Контакты</a>
  </nav>
  <div class="menu__shop mono">
    ${cats.map(c => `<a href="${L(root, c.url)}">${esc(c.meta.short)}</a>`).join('')}
    <a href="${L(root, '/price-list')}">Прайс-лист</a>
    <a href="${L(root, '/warranty')}">Гарантия</a>
    <a href="${L(root, '/dostavka')}">Доставка и оплата</a>
    <a href="${L(root, '/saved')}">Избранное</a>
    <a href="${L(root, '/cart')}">Корзина</a>
  </div>
  <div class="menu__foot mono"><a href="tel:+78007757870">+7 (800) 775-78-70</a><a href="mailto:oils@good-ways.ru">oils@good-ways.ru</a></div>
</div>
${home ? `
<aside class="dip" aria-hidden="true"><span class="dip__lbl mono" id="dipLbl">Старт</span><span class="dip__bar"><i id="dipFill"></i></span><span class="dip__pct mono" id="dipPct">00</span></aside>` : ''}

<main id="main">
${body}
</main>

<footer class="foot">
  <div class="wrap foot__grid">
    <div>
      <span class="mono foot__k">Контакты</span>
      <p>141202, Московская область, г.&nbsp;Пушкино, ул.&nbsp;Институтская, д.&nbsp;12, помещ.&nbsp;2</p>
      <p><a href="tel:+78007757870">+7 (800) 775-78-70</a><br><a href="mailto:oils@good-ways.ru">oils@good-ways.ru</a><br>Пн–Пт с&nbsp;10:00 до&nbsp;19:00 по&nbsp;Москве</p>
    </div>
    <div>
      <span class="mono foot__k">Каталог</span>
      ${cats.map(c => `<a href="${L(root, c.url)}">${esc(c.meta.nav)}</a>`).join('\n      ')}
      <a href="${L(root, '/price-list')}">Прайс-лист</a>
    </div>
    <div>
      <span class="mono foot__k">Компания</span>
      <a href="${L(root, '/o-kompanii')}">О компании</a>
      <a href="${L(root, '/proizvodstvo-i-kachestvo')}">Производство и качество</a>
      <a href="${L(root, '/ispytaniya-v-realnyh-usloviyah')}">Испытания в реальных условиях</a>
      <a href="${L(root, '/good-ways-test')}">Good Ways Test</a>
      <a href="${L(root, '/partneram')}">Партнёрам</a>
      <a href="${L(root, '/kontakty')}">Контакты</a>
    </div>
    <div>
      <span class="mono foot__k">Покупателю</span>
      <a href="${L(root, '/dostavka')}">Доставка и оплата</a>
      <a href="${L(root, '/warranty')}">Гарантия</a>
      <a href="${L(root, '/policy')}">Оферта и политика конфиденциальности</a>
      <a href="${L(root, '/agreement')}">Пользовательское соглашение</a>
      <a href="${L(root, '/consent')}">Согласие на обработку данных</a>
      <a href="https://good-ways-oil.ru/good-ways-company-presentation.pdf" target="_blank" rel="noopener">Презентация компании, PDF</a>
    </div>
  </div>
  <div class="foot__word" aria-hidden="true"><img src="${root}assets/img/logo.svg" alt="" loading="lazy" width="987" height="136"></div>
  <div class="wrap foot__bot mono"><span>© 2019—2026 ООО «Гудвейс»</span><a href="#main">Наверх ↑</a></div>
</footer>

<script src="${root}js/catalog.js" defer></script>
<script src="${root}js/main.js" defer></script>
<script src="${root}js/shop.js" defer></script>
</body>
</html>
`;
}

/* ---------- каталог: все товары, категория, подкатегория ---------- */
function catalogPage({ root, all, cat, sub, h1, lead, items, cats, crumbs: list, seo }) {
  const viscs = [...new Set(items.map(viscOf))];
  const pills = all
    ? cats.map(c => `<a class="pill" href="${L(root, c.url)}">${esc(c.meta.nav)}<sup>${c.items.length}</sup></a>`).join('')
    : `<a class="pill${sub ? '' : ' is-on'}" href="${L(root, cat.url)}"${sub ? '' : ' aria-current="page"'}>Все<sup>${cat.items.length}</sup></a>` + cat.subs.map(s => `<a class="pill${s === sub ? ' is-on' : ''}" href="${L(root, s.url)}"${s === sub ? ' aria-current="page"' : ''}>${esc(s.name)}<sup>${s.items.length}</sup></a>`).join('');
  return phero({ root, list, eyebrow: all ? 'Каталог' : sub ? cat.meta.nav : 'Каталог', h1, lead, cls: 'phero--cat' }) + `
<section class="shop">
  <div class="wrap">
    <div class="pills" aria-label="${all ? 'Категории' : 'Разделы категории'}">${pills}</div>
    <div class="tools">
      ${viscs.length > 1 ? `<div class="tools__g"><span class="mono">Вязкость</span><div class="chips" id="fVisc"><button type="button" class="fchip is-on" data-visc="">Все</button>${viscs.map(v => `<button type="button" class="fchip" data-visc="${esc(v)}">${nb(v)}</button>`).join('')}</div></div>` : ''}
      <div class="tools__g tools__g--r">
        <label class="sw"><input type="checkbox" id="fStock"><i></i><span>Только в наличии</span></label>
        <div class="segs" id="fSort" role="group" aria-label="Сортировка"><button type="button" class="is-on" data-sort="def">По порядку</button><button type="button" data-sort="asc">Дешевле</button><button type="button" data-sort="desc">Дороже</button></div>
      </div>
    </div>
    <p class="shop__count mono" id="pCount" aria-live="polite">Показано: ${items.length}</p>
    <div class="pgrid" id="pgrid">${items.map(p => pcard(p, root)).join('')}</div>
    <p class="shop__empty" id="pEmpty" hidden>По этим условиям ничего нет. Снимите фильтр или <a href="#ask">оставьте заявку</a> — подберём аналог или изготовим партию.</p>
  </div>
</section>
${seo ? `<section class="psec"><div class="wrap"><div class="prose">${seo}</div></div></section>` : ''}
<section class="helpband"><div class="wrap helpband__in"><div><h2 class="h3">Не нашли нужное масло или фасовку?</h2><p>Подберём подходящий продукт или обсудим изготовление партии под ваши требования.</p></div><a class="btn" href="#ask" data-magnet><span>Оставить заявку</span>${I.arrow}</a></div></section>
` + ask({ root, title: 'Поможем выбрать', text: 'Напишите, для какой техники нужно масло. Подберём продукт по допускам и условиям работы, пришлём документы и образцы.' });
}

/* ---------- товар ---------- */
function productPage({ root, p, c, s, rel, delivery }) {
  const sm = specMap(p), sh = p.shortMap || {};
  const oem = (sh['Допуски OEM'] || sm['Спецификация OEM'] || '').split(',').map(x => x.trim()).filter(Boolean);
  const props = [['Тип', sh['Тип масла'] || sm['Тип масла']], ['Вязкость', sm['Вязкость']], ['API', sm['Спецификация API']], ['ACEA', sm['Спецификация ACEA']], ['ILSAC', sm['Спецификация ILSAC']], ['DIN', sm['Спецификация по DIN']], ['ISO', sm['Спецификация по ISO']], ['Parker Denison', sm['Спецификация Parker Denison']], ['ASTM', sm['Стандарт ASTM']], ['Класс антифриза', sm['Класс антифриза']], ['Стандарты', sm['Стандарты']], ['Назначение', sh['Назначение']], ['Применение', sh['Применение']]].filter(x => x[1]);
  const fi = firstPriced(p), o0 = p.offers[fi];
  const list = [['Каталог', '/catalog'], [c.h1, c.url]].concat(s ? [[s.name, s.url]] : []).concat([[p.name]]);
  const specs = p.specs.filter(x => x[0] !== 'Объем');
  return `
<section class="prod">
  <canvas class="hero__gl" id="gl" aria-hidden="true"></canvas><div class="phero__shade" aria-hidden="true"></div>
  <div class="wrap prod__wrap">
    ${crumbs(root, list)}
    <div class="prod__grid">
      <div class="prod__vis${p.img ? ' has-img' : ''}">
        <span class="prod__vis-top mono"><i>${esc(p.series)}</i><i>${esc(tagOf(p))}</i></span>
        ${p.img ? `<img src="${root}${p.img}" alt="${esc(p.title)}" width="1000" height="1000">` : '<svg class="prod__mark" aria-hidden="true"><use href="#gmark"/></svg>'}
        <b class="prod__des">${nb(p.des)}</b>
      </div>
      <div class="prod__info" data-product="${p.url}" data-first="${fi}">
        <p class="eyebrow mono"><i class="dot"></i>${esc(p.kind)}${o0.sku ? ` · арт. <span id="pSku">${esc(o0.sku)}</span>` : '<span id="pSku" hidden></span>'}</p>
        <h1 class="prod__h"><small>${esc(p.kind)} Good Ways</small> ${nb(p.name)}</h1>
        <div class="prod__pick">
          <span class="mono">Фасовка</span>
          <div class="seg" id="pVols" role="group" aria-label="Фасовка">${p.offers.map((o, i) => `<button type="button" class="seg__b${i === fi ? ' is-on' : ''}" data-i="${i}" aria-pressed="${i === fi}">${esc(o.vol)}</button>`).join('')}</div>
        </div>
        <div class="prod__buy">
          <div class="prod__price"><b id="pPrice">${o0.price ? 'от ' + rub(o0.price, true) : 'по запросу'}</b><span class="mono">за шт · <span id="pAvail" class="${o0.stock ? 'ok' : ''}">${o0.stock ? 'есть в наличии' : 'под заказ'}</span></span></div>
          <div class="prod__act">
            <div class="qty"><button type="button" data-q="-1" aria-label="Меньше">−</button><input id="pQty" inputmode="numeric" value="1" aria-label="Количество"><button type="button" data-q="1" aria-label="Больше">+</button></div>
            <button class="btn" type="button" id="pAdd" data-magnet><span>В корзину</span>${I.arrow}</button>
            <button class="ibtn ibtn--line fav" type="button" data-fav="${p.url}" aria-label="В избранное" aria-pressed="false">${I.heart}</button>
          </div>
        </div>
        <dl class="props">${props.map(([k, v]) => `<div><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        ${oem.length ? `<div class="oem"><span class="mono">Допуски OEM</span><ul class="chips">${oem.map(x => `<li class="chip">${esc(x)}</li>`).join('')}</ul></div>` : ''}
      </div>
    </div>
  </div>
</section>
<nav class="pnav" aria-label="Разделы карточки"><div class="wrap pnav__in"><a href="#desc">Описание</a><a href="#specs">Характеристики</a><a href="#delivery">Доставка и оплата</a><a href="#ask">Задать вопрос</a></div></nav>
<section class="psec" id="desc"><div class="wrap psec__grid"><h2 class="h2" data-rv><span class="ln"><span>Описание</span></span></h2><div class="prose">${p.desc}</div></div></section>
<section class="psec psec--alt" id="specs"><div class="wrap psec__grid"><h2 class="h2" data-rv><span class="ln"><span>Характе&shy;ристики</span></span></h2><div><table class="spec"><tbody>${specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}<tr><th scope="row">Фасовка</th><td>${esc(p.offers.map(o => o.vol).join(', '))}</td></tr>${p.offers.filter(o => o.sku).length ? `<tr><th scope="row">Артикулы</th><td>${p.offers.filter(o => o.sku).map(o => esc(o.vol) + ' — ' + esc(o.sku)).join('<br>')}</td></tr>` : ''}</tbody></table></div></div></section>
<section class="psec" id="delivery"><div class="wrap psec__grid"><h2 class="h2" data-rv><span class="ln"><span>Доставка и&nbsp;оплата</span></span></h2><div class="dcards">${delivery.items.map(([h, t]) => `<article class="card" data-spot><h3>${esc(h)}</h3><p>${esc(t)}</p></article>`).join('')}<p class="dnote">Стоимость и сроки доставки, а также условия оплаты менеджер уточнит при подтверждении заказа. <a href="${L(root, '/dostavka')}">Подробнее о доставке</a></p></div></div></section>
<section class="helpband"><div class="wrap helpband__in"><div><h2 class="h3">Не нашли нужное масло или фасовку?</h2><p>Подберём подходящий продукт или обсудим изготовление партии под ваши требования.</p></div><a class="btn" href="#ask" data-magnet><span>Оставить заявку</span>${I.arrow}</a></div></section>
${rel.length ? `<section class="rel"><div class="wrap hits__head"><h2 class="h3">Из этой же линейки</h2><div class="hits__ctl"><button type="button" class="rbtn" id="railPrev" aria-label="Назад"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button><button type="button" class="rbtn" id="railNext" aria-label="Вперёд">${I.arrow}</button></div></div><div class="rail rail--p" id="rail" tabindex="0" aria-label="Похожие продукты">${rel.map(x => pcard(x, root)).join('')}</div></section>` : ''}
` + ask({ root, title: 'Вопрос по продукту?', text: 'Подскажем, подойдёт ли масло вашей технике, пришлём паспорт качества и рассчитаем партию.', msg: p.title + '. ' });
}
function productLd(p, site) {
  const priced = p.offers.filter(o => o.price);
  return { '@context': 'https://schema.org', '@type': 'Product', name: p.title, sku: (p.offers.find(o => o.sku) || {}).sku || undefined, brand: { '@type': 'Brand', name: 'Good Ways' }, description: p.metaDesc, url: site + p.url + '/', image: p.img ? site + '/' + p.img : undefined,
    offers: priced.length ? { '@type': 'AggregateOffer', priceCurrency: 'RUB', lowPrice: Math.min(...priced.map(o => o.price)), highPrice: Math.max(...priced.map(o => o.price)), offerCount: priced.length, availability: 'https://schema.org/' + (p.stock ? 'InStock' : 'PreOrder') } : undefined };
}

/* ---------- инфостраницы ---------- */
function infoPage({ root, pg, name, imgMap }) {
  const img = (o, cls = '') => o.img && imgMap[o.img.src] ? `<figure class="imedia ${cls}" data-rv><img src="${root}${imgMap[o.img.src]}" alt="${esc(o.img.alt)}" loading="lazy" width="1400" height="1050"></figure>` : '';
  const cards = o => o.cards.length ? `<div class="icards">${o.cards.map(c => `<article class="card" data-spot><h3>${esc(c.h)}</h3><p>${esc(c.t)}</p></article>`).join('')}</div>` : '';
  const steps = o => o.steps.length ? `<ol class="isteps">${o.steps.map(s => `<li><span class="mono">${esc(String(s.n).padStart(2, '0'))}</span><div><h3>${esc(s.h)}</h3><p>${esc(s.t)}</p></div></li>`).join('')}</ol>` : '';
  const stats = o => o.stats.length ? `<div class="istats">${o.stats.map(([a, b]) => `<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}</div>` : '';
  const actHref = t => /каталог/i.test(t) ? L(root, '/catalog') : /испытани/i.test(t) ? L(root, '/ispytaniya-v-realnyh-usloviyah') : /test|диагност/i.test(t) && !/запрос|заявк/i.test(t) ? L(root, '/good-ways-test') : '#ask';
  let n = 0;
  return pg.sections.map(o => {
    if (o.type === 'hero') return `
<section class="phero phero--info">
  <canvas class="hero__gl" id="gl" aria-hidden="true"></canvas><div class="phero__shade" aria-hidden="true"></div>
  <div class="wrap phero__in ihero">
    <div>
      ${crumbs(root, [[name]])}
      ${o.eyebrow ? `<p class="eyebrow mono"><i class="dot"></i>${esc(o.eyebrow)}</p>` : ''}
      <h1 class="phero__h" data-rv><span class="ln"><span>${esc(o.h)}</span></span></h1>
      ${o.lead ? `<p class="phero__lead">${esc(o.lead)}</p>` : ''}
      ${o.badges.length ? `<ul class="chips ihero__badges">${o.badges.map(b => `<li class="chip">${esc(b)}</li>`).join('')}</ul>` : ''}
    </div>
    ${img(o, 'imedia--hero')}
  </div>
</section>
${o.rich || o.stats.length ? `<section class="isec isec--intro"><div class="wrap isec__intro"><div class="prose prose--lead">${o.rich}</div>${stats(o)}</div></section>` : ''}`;
    if (o.type === 'cta') return `
<section class="helpband"><div class="wrap helpband__in"><div><h2 class="h3">${esc(o.h)}</h2>${o.rich ? `<div class="prose">${o.rich}</div>` : ''}</div><div class="helpband__act">${(o.actions.length ? o.actions : ['Оставить заявку']).map((t, i) => `<a class="btn${i ? ' btn--ghost' : ''}" href="${actHref(t)}" data-magnet><span>${esc(t)}</span>${i ? '' : I.arrow}</a>`).join('')}</div></div></section>`;
    if (o.type === 'request') return '';
    n++;
    return `
<section class="isec${o.muted ? ' isec--alt' : ''}">
  <div class="wrap isec__grid${n % 2 ? '' : ' isec__grid--flip'}">
    <div class="isec__body">
      ${o.eyebrow ? `<p class="eyebrow mono"><i class="dot"></i>${esc(String(n).padStart(2, '0'))} — ${esc(o.eyebrow)}</p>` : ''}
      <h2 class="h2 h2--sm" data-rv><span class="ln"><span>${esc(o.h)}</span></span></h2>
      ${o.rich ? `<div class="prose">${o.rich}</div>` : ''}${stats(o)}${cards(o)}${steps(o)}
    </div>
    ${img(o)}
  </div>
</section>`;
  }).join('') + ask({ root, title: 'Обсудим задачу?', text: 'Оставьте контакты — подготовим предложение по продуктам, объёмам, логистике и технической поддержке.' });
}

/* ---------- контакты ---------- */
function contactsPage(c) {
  return root => phero({ root, list: [['Контакты']], eyebrow: 'ООО «Гудвейс»', h1: 'Контакты', lead: c.about }) + `
<section class="isec">
  <div class="wrap">
    <div class="ccards">
      <a class="ccard" href="tel:${c.tel}" data-spot><span class="mono">Телефон</span><b>${esc(c.phone)}</b><i>Звонок по России бесплатный</i></a>
      <a class="ccard" href="mailto:${c.email}" data-spot><span class="mono">Почта</span><b>${esc(c.email)}</b><i>Заявки, документы, вопросы по продукции</i></a>
      <div class="ccard"><span class="mono">Режим работы</span><b>${esc(c.hours)}</b><i>${esc(c.hoursNote)}</i></div>
      <a class="ccard ccard--wide" href="https://yandex.ru/maps/?text=${encodeURIComponent('Московская область, Пушкино, улица Институтская, 12')}" target="_blank" rel="noopener" data-spot><span class="mono">Адрес</span><b>${esc(c.address)}</b><i>Открыть в Яндекс Картах →</i></a>
      <div class="ccard"><span class="mono">Мессенджеры</span><div class="ccard__links"><a class="btn btn--sm btn--ghost" href="${c.tg}" target="_blank" rel="noopener"><span>Telegram</span></a><a class="btn btn--sm btn--ghost" href="${c.max}" target="_blank" rel="noopener"><span>MAX</span></a></div></div>
    </div>
  </div>
</section>
<section class="psec psec--alt"><div class="wrap psec__grid"><h2 class="h2" data-rv><span class="ln"><span>Реквизиты</span></span></h2><div><table class="spec"><tbody>${c.req.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div></div></section>
` + ask({ root, title: 'Напишите нам', text: 'Ответим на вопрос по продукции, подготовим коммерческое предложение или документы по поставке.' });
}

/* ---------- доставка и оплата ---------- */
function deliveryPage(extra, u) {
  return root => phero({ root, list: [['Доставка и оплата']], eyebrow: 'Покупателю', h1: 'Доставка и оплата', lead: 'Отгружаем продукцию Good Ways по всей России.' }) + `
<section class="isec"><div class="wrap">
  <div class="icards icards--2">${extra.delivery.items.map(([h, t]) => `<article class="card" data-spot><h3>${esc(h)}</h3><p>${esc(t)}</p></article>`).join('')}</div>
  <div class="prose prose--lead dtext"><h2 id="oplata">Оплата</h2><p>Условия оплаты, стоимость и сроки доставки менеджер согласует с вами при подтверждении заказа — они зависят от объёма партии и города отгрузки.</p><p>Оформить заказ можно через <a href="${L(root, '/cart')}">корзину</a>, по телефону <a href="tel:+78007757870">+7 (800) 775-78-70</a> или по почте <a href="mailto:oils@good-ways.ru">oils@good-ways.ru</a>.</p></div>
</div></section>
` + ask({ root, title: 'Рассчитать доставку', text: 'Напишите город и объём заказа — посчитаем доставку и предложим удобный способ отгрузки.' });
}

/* ---------- прайс-лист ---------- */
function pricePage({ cats, date }) {
  return root => phero({ root, list: [['Прайс-лист']], eyebrow: 'Актуально на ' + date, h1: 'Прайс-лист', lead: 'Все продукты Good Ways с артикулами, фасовками и ценами. Цены указаны «от» за штуку.', extra: `<div class="phero__act"><button class="btn btn--sm btn--ghost" type="button" id="plPrint"><span>Печать</span></button><a class="btn btn--sm btn--ghost" href="https://good-ways-oil.ru/price-list/pdf" target="_blank" rel="noopener"><span>Скачать PDF</span></a></div>` }) + `
<section class="shop" id="plRoot">
  <div class="wrap">
    <div class="tools">
      <label class="plsearch"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg><input type="search" id="plQ" placeholder="Артикул или название" autocomplete="off" aria-label="Поиск по прайс-листу"></label>
      <div class="tools__g tools__g--r"><label class="sw"><input type="checkbox" id="plStock"><i></i><span>Только в наличии</span></label></div>
    </div>
    ${cats.map(c => `
    <div class="plgroup">
      <h2 class="h3"><a href="${L(root, c.url)}">${esc(c.h1)}</a></h2>
      <div class="pltable" role="table" aria-label="${esc(c.h1)}">
        <div class="plrow plrow--h mono" role="row"><span>Артикул</span><span>Наименование</span><span>Фасовка</span><span>Цена, от</span><span>Наличие</span><span></span></div>
        ${c.items.map(p => p.offers.map((o, i) => `<div class="plrow" role="row" data-stock="${o.stock ? 1 : 0}" data-t="${esc((o.sku + ' ' + p.title).toLowerCase())}"><span class="mono">${esc(o.sku || '—')}</span><a href="${L(root, p.url)}">${esc(p.kind)} ${nb(p.name)}</a><span>${esc(o.vol)}</span><b>${o.price ? rub(o.price, true) : 'по запросу'}</b><span class="chip${o.stock ? ' chip--ok' : ''}">${o.stock ? 'В наличии' : 'Под заказ'}</span>${o.price ? `<button class="ibtn ibtn--line" type="button" data-add="${p.url}" data-offer="${i}" aria-label="В корзину: ${esc(p.name)}, ${esc(o.vol)}">${I.cart}</button>` : '<span></span>'}</div>`).join('')).join('')}
      </div>
    </div>`).join('')}
    <p class="shop__empty" id="plEmpty" hidden>Ничего не нашли. Проверьте артикул или <a href="#ask">напишите нам</a>.</p>
  </div>
</section>
` + ask({ root, title: 'Нужен опт?', text: 'Скидки зависят от объёма закупок и длительности сотрудничества. Пришлём коммерческое предложение под ваш объём.' });
}

/* ---------- корзина и избранное ---------- */
function cartPage() {
  return root => phero({ root, list: [['Корзина']], eyebrow: 'Ваш заказ', h1: 'Корзина', cls: 'phero--sm' }) + `
<section class="shop">
  <div class="wrap cart">
    <div id="cartRoot" class="cart__list" aria-live="polite"></div>
    <form class="form cart__form" id="order" novalidate hidden>
      <h2 class="h3">Оформить заказ</h2>
      <p class="cart__note">Менеджер перезвонит, подтвердит наличие, согласует доставку и оплату.</p>
      <label class="fld"><span>Ваше ФИО</span><input type="text" name="name" autocomplete="name" required></label>
      <label class="fld"><span>Телефон</span><input type="tel" name="phone" autocomplete="tel" inputmode="tel" required></label>
      <label class="fld"><span>Почта</span><input type="email" name="email" autocomplete="email"></label>
      <label class="fld"><span>Город и комментарий</span><textarea name="msg" rows="2"></textarea></label>
      <label class="chk"><input type="checkbox" name="agree" required><i></i><span>Согласен на&nbsp;<a href="${L(root, '/consent')}" target="_blank">обработку персональных данных</a> и&nbsp;принимаю <a href="${L(root, '/policy')}" target="_blank">политику конфиденциальности</a></span></label>
      <div class="form__foot"><button class="btn" type="submit" data-magnet><span>Отправить заказ</span>${I.arrow}</button><p class="form__msg mono" id="orderMsg" role="status" aria-live="polite"></p></div>
    </form>
  </div>
</section>`;
}
function savedPage({ items }) {
  return root => phero({ root, list: [['Избранное']], eyebrow: 'Отложенные продукты', h1: 'Избранное', cls: 'phero--sm' }) + `
<section class="shop"><div class="wrap">
  <div class="pgrid" id="savedGrid">${items.map(p => pcard(p, root)).join('')}</div>
  <div class="shop__empty" id="savedEmpty" hidden><p>Пока пусто. Нажмите на сердечко у товара — он появится здесь.</p><a class="btn" href="${L(root, '/catalog')}"><span>В каталог</span>${I.arrow}</a></div>
</div></section>`;
}
function textPage(pg) {
  return root => phero({ root, list: [[pg.h]], eyebrow: 'Документы', h1: pg.h, cls: 'phero--sm' }) + `<section class="psec"><div class="wrap"><div class="prose prose--doc">${pg.html}</div></div></section>`;
}

module.exports = { layout, catalogPage, productPage, productLd, infoPage, contactsPage, deliveryPage, pricePage, cartPage, savedPage, textPage, L, esc, rub };
