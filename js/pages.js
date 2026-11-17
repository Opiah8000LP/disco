// The pages that open from the menu, with a different transition for each category. The text lives in config.js (DW.sections).

(function(){
var DW = window.DW;
var A = DW.audio;
var P = {};
DW.pages = P;

var root = null;  // #pages
var panel = null;  // the page window
var body = null;  // the part that scrolls
var fxbox = null;  // where the transition effects get built
var line = null;  // the scan line (only the scan transition uses it)
var crumbCat = null;
var crumbSub = null;
var count = null;
var prevBtn = null;
var nextBtn = null;

var cur = null;  // the page that is open: { c: category, s: sub }
var state = 'idle';  // idle, opening, open or closing
var timer = 0;
var lastBot = 0;
var origin = { x: 0, y: 0 };  // where the page opened from (the icon you pressed)
var trackRows = [];  // the rows of a song list block, if the page has one
var cardEls = [];  // the cards on the page, they pulse with the music

// how long each transition runs in ms. on = opening, off = closing
var FX = {
  scan:  { on: 800,  off: 450 },
  tiles: { on: 1040, off: 1040 },
  iris:  { on: 850,  off: 500 },
  fold:  { on: 850,  off: 500 },
  crt:   { on: 900,  off: 450 },
  flip:  { on: 800,  off: 450 },
  burst: { on: 850,  off: 450 },
  warp:  { on: 900,  off: 500 },
  ping:  { on: 950,  off: 500 },
  fade:  { on: 300,  off: 250 }
};

// words in a link that press one of the buttons that are already on the site
var DOORS = { songs: 'pl-list', games: 'b-games', settings: 'b-set', changelog: 'b-log', help: 'b-help' };

function $(id){ return document.getElementById(id); }

function makeEl(tag, cls, txt){
  var e = document.createElement(tag);
  if (cls) { e.className = cls; }
  if (txt) { e.textContent = txt; }
  return e;
}

function label(id){
  return String(id).replace(/[-_]+/g, ' ').toUpperCase();
}

function section(c){
  var all = DW.sections || {};
  return all[c] || null;
}

function pageDef(c, s){
  var sec = section(c);
  if (!sec || !sec.subs) { return null; }
  return sec.subs[s] || null;
}

// the links of one category in menu order
function siblings(c){
  var menu = DW.menu || [];
  for (var i = 0; i < menu.length; i++) {
    if (menu[i].id == c) { return Object.keys(menu[i].subs || {}); }
  }
  return [];
}

function catLabel(c){
  var menu = DW.menu || [];
  for (var i = 0; i < menu.length; i++) {
    if (menu[i].id == c) { return String(menu[i].label || c).toUpperCase(); }
  }
  return String(c).toUpperCase();
}

// true if this link has a page written for it
P.has = function(c, s){
  return pageDef(c, s) ? true : false;
};

/* what a link or card does when pressed */

function link(to, name){
  if (!to) {
    DW.toast(name + ' has no link yet');
    return;
  }

  // one of the buttons already on the site. wait a moment so this click isnt counted as an outside click
  if (DOORS[to]) {
    var b = $(DOORS[to]);
    if (b) { setTimeout(function(){ b.click(); }, 0); }
    return;
  }

  // another page
  if (to.indexOf('page:') == 0) {
    var p = to.slice(5).split('/');
    if (pageDef(p[0], p[1])) { P.jump(p[0], p[1]); }
    else { DW.toast(name + ' has no page yet'); }
    return;
  }

  // a name from DW.links, or a web address
  var u = to;
  if (DW.links && Object.prototype.hasOwnProperty.call(DW.links, to)) { u = DW.links[to]; }
  u = DW.safeUrl(u);
  if (!u) {
    DW.toast(name + ' has no link yet');
    return;
  }
  DW.openLink(u);
}

/* the blocks a page is made of */

var BLOCKS = {};

BLOCKS.text = function(b){
  var e = makeEl('div', 'pg-text');
  var ps = [].concat(b.p || []);
  for (var i = 0; i < ps.length; i++) { e.appendChild(makeEl('p', null, ps[i])); }
  return e;
};

BLOCKS.stats = function(b){
  var e = makeEl('div', 'pg-stats');
  var items = b.items || [];
  for (var i = 0; i < items.length; i++) {
    var s = makeEl('div', 'pg-stat');
    s.appendChild(makeEl('small', null, items[i][0]));
    s.appendChild(makeEl('b', null, items[i][1]));
    e.appendChild(s);
  }
  return e;
};

BLOCKS.cards = function(b){
  var e = makeEl('div', 'pg-cards');
  var items = b.items || [];
  for (var i = 0; i < items.length; i++) {
    (function(it){
      var c = makeEl('button', 'pg-card');
      c.type = 'button';
      c.appendChild(makeEl('b', null, it.name));
      c.appendChild(makeEl('span', null, it.text));
      c.addEventListener('click', function(){
        link(it.go, it.name);
        c.blur();
      });
      cardEls.push(c);
      e.appendChild(c);
    })(items[i]);
  }
  return e;
};

BLOCKS.chips = function(b){
  var e = makeEl('div', 'pg-chips');
  var items = b.items || [];
  for (var i = 0; i < items.length; i++) { e.appendChild(makeEl('span', 'pg-chip', items[i])); }
  return e;
};

BLOCKS.list = function(b){
  var e = makeEl('ul', 'pg-ul');
  var items = b.items || [];
  for (var i = 0; i < items.length; i++) {
    var li = makeEl('li', null, items[i]);
    if (b.check) {
      li.classList.add('box');
      li.tabIndex = 0;
      li.setAttribute('role', 'checkbox');
      li.setAttribute('aria-checked', 'false');
      (function(el){
        function flip(){
          var on = el.classList.toggle('on');
          el.setAttribute('aria-checked', on ? 'true' : 'false');
        }
        el.addEventListener('click', flip);
        el.addEventListener('keydown', function(ev){
          if (ev.key == 'Enter') { ev.preventDefault(); flip(); }
        });
      })(li);
    }
    e.appendChild(li);
  }
  return e;
};

BLOCKS.steps = function(b){
  var e = makeEl('ol', 'pg-steps');
  var items = b.items || [];
  for (var i = 0; i < items.length; i++) {
    var li = makeEl('li');
    li.appendChild(makeEl('b', null, items[i][0]));
    li.appendChild(makeEl('span', null, items[i][1]));
    e.appendChild(li);
  }
  return e;
};

BLOCKS.quote = function(b){
  var e = makeEl('blockquote', 'pg-quote');
  e.appendChild(makeEl('p', null, b.text));
  if (b.by) { e.appendChild(makeEl('cite', null, b.by)); }
  return e;
};

BLOCKS.timeline = function(b){
  var e = makeEl('ol', 'pg-tl');
  var items = b.items || [];
  for (var i = 0; i < items.length; i++) {
    var li = makeEl('li');
    li.appendChild(makeEl('small', null, items[i][0]));
    li.appendChild(makeEl('b', null, items[i][1]));
    if (items[i][2]) { li.appendChild(makeEl('span', null, items[i][2])); }
    e.appendChild(li);
  }
  return e;
};

BLOCKS.tiles = function(b){
  var e = makeEl('div', 'pg-tiles');
  if (b.wide) { e.classList.add('wide'); }
  var items = b.items || [];
  for (var i = 0; i < items.length; i++) {
    (function(it, n){
      var t = makeEl('button', 'pg-tile t' + (n % 6));
      t.type = 'button';
      var cap = makeEl('span', 'pg-cap');
      cap.appendChild(makeEl('b', null, it[0]));
      cap.appendChild(makeEl('small', null, it[1]));
      t.appendChild(cap);
      t.addEventListener('click', function(){
        DW.toast(it[0] + ' is a placeholder');
        t.blur();
      });
      e.appendChild(t);
    })(items[i], i);
  }
  return e;
};

// the real playlist from the music player
BLOCKS.tracks = function(){
  var e = makeEl('div', 'pg-tracks');
  var list = DW.tracks || [];
  if (list.length == 0) {
    e.appendChild(makeEl('p', 'pg-empty', 'no songs in the playlist yet'));
    return e;
  }
  for (var i = 0; i < list.length; i++) {
    (function(t, n){
      var r = makeEl('button', 'pg-trk');
      r.type = 'button';
      var img = new Image();
      img.alt = '';
      img.draggable = false;
      img.src = A.cover(t);
      img.addEventListener('error', function(){ img.style.visibility = 'hidden'; });
      r.appendChild(img);
      var txt = makeEl('span', 'pg-tt');
      txt.appendChild(makeEl('b', null, t.title));
      var by = DW.byline(t);
      if (by) { txt.appendChild(makeEl('small', null, by)); }
      r.appendChild(txt);
      r.appendChild(makeEl('i', 'pg-st'));
      r.addEventListener('click', function(){
        if (A.index() == n) { A.toggle(); }
        else { A.load(n, true); }
        r.blur();
      });
      trackRows.push(r);
      e.appendChild(r);
    })(list[i], i);
  }
  paintTracks();
  return e;
};

BLOCKS.faq = function(b){
  var e = makeEl('div', 'pg-faq');
  var items = b.items || [];
  for (var i = 0; i < items.length; i++) {
    (function(it){
      var q = makeEl('div', 'pg-q');
      var btn = makeEl('button', null, it[0]);
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      var a = makeEl('div', 'pg-a');
      a.appendChild(makeEl('div', null, it[1]));
      btn.addEventListener('click', function(){
        var on = q.classList.toggle('open');
        btn.setAttribute('aria-expanded', on ? 'true' : 'false');
        btn.blur();
      });
      q.appendChild(btn);
      q.appendChild(a);
      e.appendChild(q);
    })(items[i]);
  }
  return e;
};

BLOCKS.links = function(b){
  var e = makeEl('div', 'pg-links');
  var items = b.items || [];
  for (var i = 0; i < items.length; i++) {
    (function(it){
      var btn = makeEl('button', 'pg-link', it[0]);
      btn.type = 'button';
      var has = DW.links && DW.links[it[1]];
      if (!has) {
        btn.classList.add('off');
        btn.appendChild(makeEl('small', null, 'SOON'));
      }
      btn.addEventListener('click', function(){
        link(it[1], it[0]);
        btn.blur();
      });
      e.appendChild(btn);
    })(items[i]);
  }
  return e;
};

BLOCKS.action = function(b){
  var e = makeEl('div', 'pg-action');
  e.appendChild(makeEl('p', null, b.text));
  var btn = makeEl('button', 'cm-go', b.label || 'OPEN');
  btn.type = 'button';
  btn.addEventListener('click', function(){
    link(b.go, b.label || 'this');
    btn.blur();
  });
  e.appendChild(btn);
  return e;
};

// thoughts: dated paragraphs with a search bar, text comes from DW.thoughts in js/config.js
var MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function niceDate(d){
  var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(d);
  if (!m) { return String(d); }
  return m[3] + ' ' + MONTHS[Number(m[2]) - 1] + ' ' + m[1];
}

BLOCKS.posts = function(b){
  var wrap = makeEl('div', 'pg-posts');
  var list = (DW[b.list || 'thoughts'] || []).slice();
  // newest first
  list.sort(function(a, z){ return a.date < z.date ? 1 : (a.date > z.date ? -1 : 0); });

  var box = makeEl('input', 'pg-search');
  box.type = 'search';
  box.placeholder = 'search...';
  box.setAttribute('aria-label', 'search');
  box.autocomplete = 'off';
  // typing shouldnt trigger the music keys
  box.addEventListener('keydown', function(e){
    if (e.key != 'Escape') { e.stopPropagation(); }
  });
  wrap.appendChild(box);

  var count = makeEl('p', 'pg-count');
  wrap.appendChild(count);

  var posts = [];
  for (var i = 0; i < list.length; i++) {
    var post = makeEl('article', 'pg-post');
    post.appendChild(makeEl('time', null, niceDate(list[i].date)));
    var paras = String(list[i].text).split(/\n\s*\n/);
    for (var j = 0; j < paras.length; j++) { post.appendChild(makeEl('p', null, paras[j])); }
    wrap.appendChild(post);
    posts.push({ el: post, hay: (niceDate(list[i].date) + ' ' + list[i].date + ' ' + list[i].text).toLowerCase() });
  }

  function filter(){
    var q = box.value.toLowerCase().replace(/^\s+|\s+$/g, '');
    var shown = 0;
    for (var k = 0; k < posts.length; k++) {
      var ok = !q || posts[k].hay.indexOf(q) > -1;
      posts[k].el.hidden = !ok;
      if (ok) { shown++; }
    }
    if (!posts.length) { count.textContent = 'nothing written yet.'; }
    else if (!shown) { count.textContent = 'nothing found for "' + box.value + '".'; }
    else if (q) { count.textContent = shown + ' of ' + posts.length + ' found'; }
    else { count.textContent = posts.length + ' thoughts'; }
  }
  box.addEventListener('input', filter);
  filter();
  return wrap;
};

/* the song list block keeps up with the player */

function paintTracks(){
  if (!trackRows.length) { return; }
  var n = A.index();
  for (var i = 0; i < trackRows.length; i++) {
    trackRows[i].classList.toggle('cur', i == n);
    trackRows[i].classList.toggle('playing', i == n && A.playing);
  }
}

/* putting a page together */

function reactBind(){
  var V = DW.vis;
  if (!V) { return; }
  var img = body.querySelector('.pg-img');
  V.bind('pgico', img || []);
  var dist = [];
  for (var i = 0; i < cardEls.length; i++) { dist.push(i); }
  V.bind('pgcards', cardEls, dist);
}

function reactClear(){
  var V = DW.vis;
  if (!V) { return; }
  V.bind('pgico', []);
  V.bind('pgcards', []);
}

// fills the page with the blocks of one link. delay = how long to wait before the blocks rise in
function build(c, s, delay){
  var def = pageDef(c, s);
  var sec = section(c);
  var ids = siblings(c);
  var at = ids.indexOf(s);

  body.textContent = '';
  body.scrollTop = 0;
  trackRows = [];
  cardEls = [];
  body.style.setProperty('--bd', delay + 'ms');
  panel.dataset.c = c;
  panel.setAttribute('aria-label', catLabel(c) + ' - ' + label(s));

  crumbCat.textContent = catLabel(c);
  crumbSub.textContent = label(s);
  count.textContent = (at + 1) + '/' + ids.length;
  prevBtn.disabled = at <= 0;
  nextBtn.disabled = at < 0 || at >= ids.length - 1;

  // the big title at the top
  var hero = makeEl('div', 'pg-hero');
  var ico = makeEl('div', 'pg-ico');
  var img = new Image();
  img.src = 'icons/' + s + '.png';
  img.alt = '';
  img.draggable = false;
  img.className = 'pg-img';
  img.addEventListener('error', function(){ img.style.visibility = 'hidden'; });
  ico.appendChild(img);
  var ht = makeEl('div', 'pg-ht');
  ht.appendChild(makeEl('small', null, catLabel(c)));
  ht.appendChild(makeEl('h2', null, label(s)));
  var tag = (def && def.tag) || (sec && sec.tag) || '';
  if (tag) { ht.appendChild(makeEl('p', null, tag)); }
  hero.appendChild(ico);
  hero.appendChild(ht);
  body.appendChild(hero);

  var blocks = (def && def.blocks) || [];
  for (var i = 0; i < blocks.length; i++) {
    var fn = BLOCKS[blocks[i].t];
    if (!fn) {
      console.warn('[dweeb] unknown page block type: ' + blocks[i].t);
      continue;
    }
    var wrap = makeEl('section', 'pg-blk b-' + blocks[i].t);
    wrap.style.setProperty('--i', i);
    if (blocks[i].h) { wrap.appendChild(makeEl('h3', 'pg-h', blocks[i].h)); }
    wrap.appendChild(fn(blocks[i]));
    body.appendChild(wrap);
  }

  reactBind();
}

// the page counts as visited, the menu follows along and the address bar says where you are
function arrive(c, s){
  if (DW.trophy) {
    DW.trophy.mark('tourist', s);
    DW.trophy.mark('hopper', c);
  }
  if (DW.nav) { DW.nav.go(c + '/' + s); }
  try { localStorage.setItem('dw-spot', c + '/' + s); } catch(e) {}
  try { history.replaceState(null, '', '#' + c + '/' + s + '/open'); } catch(e) {}
}

// sometimes the chat bot says something about the page
function chat(c){
  var sec = section(c);
  var lines = sec && sec.bot;
  if (!lines || !lines.length) { return; }
  if (Date.now() - lastBot < 8000) { return; }
  lastBot = Date.now();
  setTimeout(function(){
    if (!cur || !DW.splashUI) { return; }
    DW.splashUI.say(lines[Math.floor(Math.random() * lines.length)]);
  }, 900);
}

// keeps the page above the music player, whatever size it is
function fit(){
  if (!root) { return; }
  var pl = $('player');
  var h = 0;
  var w = 0;
  if (pl) {
    h = pl.offsetHeight;
    w = pl.offsetWidth;
  }
  root.style.setProperty('--pb', (h + 28) + 'px');
  root.style.setProperty('--pw', (w + 12) + 'px');
  // on short screens the page goes next to the player instead of above it
  root.classList.toggle('side', innerHeight <= 520 && innerWidth - w >= 420);
}

/* transitions */

function hyp(a, b){ return Math.sqrt(a * a + b * b); }

function addFx(cls, set){
  var e = makeEl('div', cls);
  if (set) { set(e); }
  fxbox.appendChild(e);
  return e;
}

// a chunky tile grid that covers the screen and then uncovers it. the page swaps in while it is covered
function buildTiles(){
  var w = innerWidth;
  var h = innerHeight;
  var cols = 12;
  if (DW.low) { cols = 6; }
  var size = w / cols;
  var rows = Math.ceil(h / size);
  var maxd = Math.max(hyp(origin.x, origin.y), hyp(w - origin.x, origin.y), hyp(origin.x, h - origin.y), hyp(w - origin.x, h - origin.y));

  var grid = addFx('fx-grid', function(g){
    g.style.setProperty('--cols', cols);
    g.style.setProperty('--rows', rows);
  });
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      var d = hyp((c + 0.5) * size - origin.x, (r + 0.5) * size - origin.y) / maxd;
      var t = makeEl('i', 'fx-tile');
      t.style.animationDelay = (d * 240).toFixed(0) + 'ms';
      grid.appendChild(t);
    }
  }
}

// the extra things that fly around during the opening
function buildExtras(name, rr){
  var low = DW.low;

  if (name == 'iris') {
    addFx('fx-ring', function(e){
      e.style.setProperty('--rs', (rr * 2 / 40).toFixed(1));
    });
  } else if (name == 'ping') {
    for (var i = 0; i < 3; i++) {
      addFx('fx-ring ping', function(e){
        e.style.animationDelay = (i * 160) + 'ms';
        e.style.setProperty('--rs', (rr * 1.6 / 40).toFixed(1));
      });
    }
  } else if (name == 'burst') {
    addFx('fx-rays');
    var n = 22;
    if (low) { n = 10; }
    for (var j = 0; j < n; j++) {
      addFx('fx-bit k' + (j % 4), function(e){
        var a = (j / n) * 6.2832 + Math.random() * 0.4;
        var dist = 140 + Math.random() * Math.min(420, rr * 0.5);
        e.style.setProperty('--dx', (Math.cos(a) * dist).toFixed(0) + 'px');
        e.style.setProperty('--dy', (Math.sin(a) * dist).toFixed(0) + 'px');
        e.style.setProperty('--rot', (Math.random() * 720 - 360).toFixed(0) + 'deg');
        e.style.animationDelay = (Math.random() * 90).toFixed(0) + 'ms';
      });
    }
  } else if (name == 'warp') {
    addFx('fx-warp');
  } else if (name == 'crt') {
    addFx('fx-crt');
  } else if (name == 'flip') {
    addFx('fx-gloss');
  }
}

// starts a transition. mode is 'on' (opening) or 'off' (closing)
function runFx(mode){
  var sec = section(cur.c);
  var name = (sec && sec.fx) || 'fade';
  if (!FX[name] || DW.reduce) { name = 'fade'; }
  var ms = FX[name][mode];

  // work out where the page starts from, in the pages own coordinates too (before it moves)
  var pr = panel.getBoundingClientRect();
  var px = origin.x - pr.left;
  var py = origin.y - pr.top;
  var rr = Math.max(hyp(px, py), hyp(pr.width - px, py), hyp(px, pr.height - py), hyp(pr.width - px, pr.height - py)) + 40;
  var far = Math.max(hyp(origin.x, origin.y), hyp(innerWidth - origin.x, origin.y), hyp(origin.x, innerHeight - origin.y), hyp(innerWidth - origin.x, innerHeight - origin.y));

  fxbox.textContent = '';
  root.style.setProperty('--t', ms + 'ms');
  root.style.setProperty('--ox', origin.x + 'px');
  root.style.setProperty('--oy', origin.y + 'px');
  panel.style.setProperty('--px', px.toFixed(0) + 'px');
  panel.style.setProperty('--py', py.toFixed(0) + 'px');
  panel.style.setProperty('--rr', rr.toFixed(0) + 'px');
  root.dataset.fx = name;

  if (name == 'tiles') { buildTiles(); }
  else if (mode == 'on' && name != 'fade') { buildExtras(name, far); }

  root.classList.remove('go', 'back');
  void root.offsetWidth;  // restart the animations
  root.classList.add(mode == 'on' ? 'go' : 'back');
  return ms;
}

/* opening and closing */

// open the page for a link. from = the icon it came from (can be left out)
P.open = function(c, s, from){
  if (!root || !pageDef(c, s) || state == 'closing') { return false; }
  if (state != 'idle') {
    P.jump(c, s);
    return true;
  }

  cur = { c: c, s: s };
  state = 'opening';
  origin = { x: innerWidth / 2, y: innerHeight / 2 };
  if (from && from.getBoundingClientRect) {
    var r = from.getBoundingClientRect();
    if (r.width) { origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  }

  fit();
  root.hidden = false;
  document.body.classList.add('paging', 'pg-dim');
  var ms = runFx('on');
  build(c, s, Math.round(ms * 0.45));
  arrive(c, s);
  chat(c);

  clearTimeout(timer);
  timer = setTimeout(function(){
    root.classList.remove('go');
    fxbox.textContent = '';
    state = 'open';
  }, ms + 60);
  body.focus({ preventScroll: true });
  return true;
};

P.close = function(){
  if (!cur || state == 'closing') { return; }
  var c = cur.c;
  var s = cur.s;
  state = 'closing';
  document.body.classList.remove('pg-dim');
  var ms = runFx('off');
  reactClear();
  try { history.replaceState(null, '', '#' + c + '/' + s); } catch(e) {}

  clearTimeout(timer);
  timer = setTimeout(function(){
    root.classList.remove('go', 'back');
    fxbox.textContent = '';
    root.hidden = true;
    document.body.classList.remove('paging');
    cur = null;
    state = 'idle';
    body.textContent = '';
    trackRows = [];
    cardEls = [];
  }, ms + 60);
};

// switch to another page while one is open (a quick slide, no big transition)
P.jump = function(c, s, dir){
  if (!pageDef(c, s) || !cur || state == 'closing') { return; }
  var same = cur.c == c;
  cur = { c: c, s: s };
  build(c, s, 0);
  body.classList.remove('slide-l', 'slide-r');
  void body.offsetWidth;
  if (dir) { body.classList.add(dir < 0 ? 'slide-l' : 'slide-r'); }
  arrive(c, s);
  if (!same) { chat(c); }
  body.focus({ preventScroll: true });
};

// previous / next link in the same category
P.step = function(dir){
  if (!cur) { return; }
  var ids = siblings(cur.c);
  var n = ids.indexOf(cur.s) + dir;
  if (n < 0 || n >= ids.length) { return; }
  if (!pageDef(cur.c, ids[n])) { return; }
  P.jump(cur.c, ids[n], dir);
};

/* setup */

P.init = function(){
  root = $('pages');
  if (!root) { return; }

  panel = makeEl('section');
  panel.id = 'pg';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');

  // the title bar
  var hd = makeEl('div', 'pg-hd');
  var back = makeEl('button', 'tab-go pg-back', 'BACK');
  back.type = 'button';
  back.setAttribute('aria-label', 'close this page');
  back.addEventListener('click', function(){ P.close(); back.blur(); });

  var crumb = makeEl('div', 'pg-crumb');
  crumbCat = makeEl('span');
  crumbSub = makeEl('b');
  crumb.appendChild(crumbCat);
  crumb.appendChild(makeEl('i', null, '/'));
  crumb.appendChild(crumbSub);

  var nav = makeEl('div', 'pg-nav');
  prevBtn = makeEl('button', 'tab-go', '<');
  nextBtn = makeEl('button', 'tab-go', '>');
  prevBtn.type = nextBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'previous page');
  nextBtn.setAttribute('aria-label', 'next page');
  count = makeEl('span', 'pg-count');
  prevBtn.addEventListener('click', function(){ P.step(-1); prevBtn.blur(); });
  nextBtn.addEventListener('click', function(){ P.step(1); nextBtn.blur(); });
  nav.appendChild(prevBtn);
  nav.appendChild(count);
  nav.appendChild(nextBtn);

  hd.appendChild(back);
  hd.appendChild(crumb);
  hd.appendChild(nav);

  body = makeEl('div', 'pg-body');
  body.tabIndex = -1;
  line = makeEl('div', 'pg-line');

  panel.appendChild(hd);
  panel.appendChild(body);
  panel.appendChild(line);

  fxbox = makeEl('div');
  fxbox.id = 'pg-fx';
  fxbox.setAttribute('aria-hidden', 'true');

  root.appendChild(panel);
  root.appendChild(fxbox);

  addEventListener('resize', fit);
  fit();

  // runs before the other key handlers so a window or the song list gets the first Esc
  addEventListener('keydown', function(e){
    if (!cur || state == 'closing') { return; }
    if (e.ctrlKey || e.metaKey || e.altKey) { return; }
    var c = document.body.classList;
    if (c.contains('modal') || c.contains('gaming')) { return; }

    if (e.key == 'Escape') {
      var list = $('tracklist');
      if (list && !list.hidden) { return; }
      e.preventDefault();
      P.close();
    } else if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
      var t = e.target;
      if (t && /^(input|textarea|select)$/i.test(t.tagName)) { return; }
      e.preventDefault();
      P.step(e.key == 'ArrowLeft' ? -1 : 1);
    }
  }, true);

  // the song list block follows the player
  A.on('track', paintTracks);
  A.on('state', paintTracks);
};

// a link like #identity/bio/open opens that page when the site loads
P.start = function(){
  var m = /^#?([\w-]+)\/([\w-]+)\/open$/.exec(location.hash);
  if (!m || !pageDef(m[1], m[2])) { return; }
  setTimeout(function(){
    if (state == 'idle') { P.open(m[1], m[2]); }
  }, 1300);
};
})();
