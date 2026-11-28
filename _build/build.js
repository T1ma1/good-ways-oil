/* Сборщик сайта Good Ways Oil: из data/*.json и home.html делает все страницы.
   Запуск: node _build/build.js          (демо, закрыто от индексации)
           node _build/build.js --prod   (боевой домен, индексация открыта) */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), D = path.join(__dirname, 'data');
const PROD = process.argv.includes('--prod');
const SITE = 'https://good-ways-oil.ru';
const T = require('./tpl.js');
const cat = JSON.parse(fs.readFileSync(path.join(D, 'catalog.json'), 'utf8'));
const pages = JSON.parse(fs.readFileSync(path.join(D, 'pages.json'), 'utf8'));
const extra = JSON.parse(fs.readFileSync(path.join(D, 'extra.json'), 'utf8'));
const imgMap = fs.existsSync(path.join(D, 'images.json')) ? JSON.parse(fs.readFileSync(path.join(D, 'images.json'), 'utf8')) : {};

/* ---------- каталог: приводим данные к рабочему виду ---------- */
const CATS = [
  { slug: 'motornye-masla-dlya-tnt', short: 'Тяжёлая техника', nav: 'Для тяжелонагруженной техники', img: 'truck.jpg', lead: 'Дизельные масла для грузовиков, автобусов, строительной и специальной техники.', subs: ['Для техники предыдущих поколений', 'Евро-5/6, низкая зольность', 'Универсальные дизельные масла'] },
  { slug: 'motornye-masla-dlya-legkovyh-avtomobilej', short: 'Легковые', nav: 'Для легковых автомобилей', img: 'mechanic.jpg', lead: 'От минеральных масел базового сегмента до премиальной синтетики.', subs: ['Минеральные масла, базовый сегмент', 'Полусинтетика и синтетика, сервисный сегмент', 'Премиальная синтетика'] },
  { slug: 'transmissionnye-masla', short: 'Трансмиссия', nav: 'Трансмиссионные масла', img: 'canisters.jpg', lead: 'Для МКПП, мостов, редукторов и самоблокирующихся дифференциалов.', subs: ['МКПП, мосты лёгкой техники', 'Мосты, редукторы, внедорожники', 'Самоблокирующиеся дифференциалы'] },
  { slug: 'gidravlicheskie-masla', short: 'Гидравлика', nav: 'Гидравлические масла', img: 'warehouse.jpg', lead: 'HLP, HVLP и МГЕ для гидросистем техники и оборудования.', subs: ['Для стабильных рабочих температур', 'Для широкого диапазона температур', 'Для спецтехники'] },
  { slug: 'antifrizy', short: 'Антифризы', nav: 'Антифризы', img: 'lab.jpg', lead: 'Карбоксилатные и силикатные охлаждающие жидкости.', subs: ['Карбоксилатные', 'Силикатные'] }
];
const designation = name => {
  let m = /\b\d{1,2}W-?\d{2,3}\b/i.exec(name); if (m) return m[0].toUpperCase();
  m = /\b(HVLP|HLP|МГЕ)\s*\d+\b/.exec(name); if (m) return m[0];
  m = /\bG1\d(?:\/G12\+)?/.exec(name); if (m) return m[0];
  m = /\bGL-\d(?:\s+LS)?\s+\d+\b/.exec(name); if (m) return m[0];
  return name.split(' ').slice(-1)[0];
};
const products = cat.products.map(p => {
  const i = p.title.indexOf('Good Ways');
  const kind = (i > 0 ? p.title.slice(0, i) : '').trim() || 'Продукт';
  const name = (i >= 0 ? p.title.slice(i + 9) : p.title).trim().replace(/\s-\s?40\b/, ' −40');
  const des = designation(name);
  const series = name.replace(des, '').replace(/\bSAE\b/g, '').replace(/\bAPI\b.*$/, '').replace(/[−-]40/, '').replace(/\s+/g, ' ').replace(/[,\s]+$/, '').trim() || name;
  const ci = cat.cats.findIndex(c => c.url === p.cat);
  const si = cat.cats[ci].subs.findIndex(s => s.products.includes(p.url));
  const offers = p.offers.filter(o => o.price).map(o => ({ vol: o.vol, price: o.price, sku: o.sku || '', from: !!o.from, stock: /налич/i.test(o.avail || '') && !/под заказ|нет в/i.test(o.avail || ''), avail: o.avail || '' }));
  const short = Object.fromEntries(p.short);
  return { ...p, kind, name, des, series, ci, si, offers, shortMap: short, min: offers.length ? Math.min(...offers.map(o => o.price)) : 0, stock: offers.some(o => o.stock), img: imgMap[p.url] || '' };
}).filter(p => p.offers.length);
const byUrl = Object.fromEntries(products.map(p => [p.url, p]));
cat.cats.forEach(c => c.subs.forEach(s => { if (s.url === '/hvlp') { s.url = '/gidravlicheskie-masla/hvlp'; s.h1 = 'Гидравлические масла Good Ways HVLP'; s.title = s.h1; s.metaDesc = 'Гидравлические масла Good Ways HVLP для широкого диапазона температур.'; s.products = cat.products.filter(p => p.cat === c.url && /HVLP/.test(p.title)).map(p => p.url); } }));
cat.cats.forEach((c, i) => { c.meta = CATS[i]; c.items = c.products.map(u => byUrl[u]).filter(Boolean); c.subs.forEach((s, j) => { s.name = CATS[i].subs[j]; s.items = s.products.map(u => byUrl[u]).filter(Boolean); }); });

/* ---------- запись страниц ---------- */
const written = [];
function write(url, o) {
  const depth = url === '/' ? 0 : url.split('/').filter(Boolean).length;
  const root = '../'.repeat(depth);
  const html = T.layout({ ...o, root, url, prod: PROD, site: SITE, cats: cat.cats });
  const file = path.join(ROOT, url === '/' ? '' : url, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written.push(url);
}

// главная
write("/", { kind: "home", title: "Good Ways Oil — моторные масла от производителя: каталог, цены, доставка по России", desc: "Производитель моторных, трансмиссионных и гидравлических масел Good Ways. Собственная лаборатория и автопарк для испытаний: 10 000 000 км на своём масле. Каталог с ценами, доставка по России.", body: fs.readFileSync(path.join(__dirname, "home.html"), "utf8").replace(/https:\/\/good-ways-oil\.ru\/(consent|policy)"/g, "$1/\"").replace(/\{\{count\}\}/g, products.length) });

// весь каталог
write("/catalog", { kind: "catalog", title: "Каталог масел Good Ways — моторные, трансмиссионные, гидравлические, антифризы", desc: "Весь каталог Good Ways Oil: " + products.length + " продуктов с ценами и фасовками. Фильтр по вязкости и наличию.", body: root => T.catalogPage({ root, all: true, h1: "Каталог Good Ways", lead: "Все масла и технические жидкости с ценами и фасовками. Выберите категорию или отфильтруйте по вязкости.", items: products, cats: cat.cats, crumbs: [["Каталог"]] }) });

// категории и подкатегории
cat.cats.forEach(c => {
  write(c.url, { kind: "category", title: c.title || c.h1, desc: c.metaDesc, body: root => T.catalogPage({ root, cat: c, h1: c.h1, lead: c.meta.lead, items: c.items, cats: cat.cats, crumbs: [["Каталог", "/catalog"], [c.h1]], seo: c.text }) });
  c.subs.forEach(s => write(s.url, { kind: "category", title: s.title || s.h1, desc: s.metaDesc, body: root => T.catalogPage({ root, cat: c, sub: s, h1: s.h1 || s.name, lead: c.meta.nav + " · " + s.name.toLowerCase(), items: s.items, cats: cat.cats, crumbs: [["Каталог", "/catalog"], [c.h1, c.url], [s.name]], seo: s.text }) }));
});

// товары
products.forEach(p => {
  const c = cat.cats[p.ci], s = p.si >= 0 ? c.subs[p.si] : null;
  const rel = (s ? s.items : c.items).filter(x => x.url !== p.url).concat(c.items.filter(x => x.url !== p.url && (!s || !s.items.includes(x)))).slice(0, 8);
  write(p.url, { kind: "product", title: p.metaTitle || p.title, desc: p.metaDesc, body: root => T.productPage({ root, p, c, s, rel, delivery: extra.delivery }), ld: T.productLd(p, SITE) });
});

// инфостраницы
const INFO = { "/o-kompanii": "О компании", "/proizvodstvo-i-kachestvo": "Производство и качество", "/partneram": "Партнёрам", "/warranty": "Гарантия", "/ispytaniya-v-realnyh-usloviyah": "Испытания в реальных условиях", "/good-ways-test": "Good Ways Test" };
Object.entries(INFO).forEach(([u, name]) => { const pg = pages[u]; if (!pg) return; write(u, { kind: "info", title: pg.title, desc: pg.metaDesc, body: root => T.infoPage({ root, pg, name, imgMap }) }); });

// контакты, доставка и оплата, прайс-лист, корзина, избранное, документы
write("/kontakty", { kind: "contacts", title: "Контакты производителя Good Ways", desc: "Телефон, почта, адрес и реквизиты ООО «Гудвейс» — производителя масел Good Ways.", body: T.contactsPage(extra.contacts) });
["/dostavka", "/oplata"].forEach(u => write(u, { kind: "text", title: "Доставка и оплата — Good Ways Oil", desc: "Условия доставки и оплаты продукции Good Ways.", body: T.deliveryPage(extra, u), canonical: "/dostavka" }));
write("/price-list", { kind: "price", title: "Прайс-лист Good Ways Oil — цены на масла и антифризы", desc: "Актуальные цены на всю продукцию Good Ways: артикулы, фасовки, наличие.", body: T.pricePage({ cats: cat.cats, date: extra.priceDate }) });
write("/cart", { kind: "cart", title: "Корзина — Good Ways Oil", desc: "Ваш заказ Good Ways Oil.", body: T.cartPage(), noindex: true });
write("/saved", { kind: "saved", title: "Избранное — Good Ways Oil", desc: "Избранные продукты Good Ways Oil.", body: T.savedPage({ items: products }), noindex: true });
Object.entries(extra.legal || {}).forEach(([u, pg]) => write(u, { kind: "text", title: pg.title, desc: pg.h, body: T.textPage(pg) }));

/* ---------- данные для поиска и корзины ---------- */
const GW = { cats: cat.cats.map(c => [c.meta.short, c.url]), items: products.map(p => ({ u: p.url, k: p.kind, n: p.name, c: p.ci, v: p.des, i: p.img, o: p.offers.map(o => [o.vol, o.price, o.sku, o.stock ? 1 : 0]) })) };
fs.writeFileSync(path.join(ROOT, 'js', 'catalog.js'), '/* Собрано _build/build.js из data/catalog.json — руками не править. */\nwindow.GW=' + JSON.stringify(GW) + ';\n');

/* ---------- sitemap и robots ---------- */
const sm = written.filter(u => !['/cart', '/saved', '/oplata'].includes(u)).map(u => `<url><loc>${SITE}${u === '/' ? '/' : u + '/'}</loc></url>`).join('\n');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sm}\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), PROD ? `User-agent: *\nDisallow: /cart/\nDisallow: /saved/\nSitemap: ${SITE}/sitemap.xml\n` : '# Демо-версия редизайна: закрыта от индексации. Для боевого домена собрать с ключом --prod.\nUser-agent: *\nDisallow: /\n');
console.log('pages:', written.length, '| products:', products.length, '| in stock:', products.filter(p => p.stock).length, '| with photo:', products.filter(p => p.img).length);
