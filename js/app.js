(function () {
'use strict';

var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var root = document.documentElement;
var body = document.body;
function $(id) { return document.getElementById(id); }
function pad2(n) { return String(n).padStart(2, '0'); }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function s01(t) { return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); }

var COPY = {

  rooms: {

    practice: {
      eyebrow: 'Studio',
      lede: 'Stylos is simple and reliable, precise and versatile. It brings together antiquity and modern day, creativity and precision.\n\nWe build websites for academic and heritage projects, creative professionals and businesses.',
      mottoLa: 'Saepe stilum uertas, iterum quae digna legi sint scripturus.',
      mottoEn: 'Turn the stylus often, if you mean to write something worth a second reading.',
      citeAuthor: 'Horace,',
      citeWork: 'Sermones',
      citeRef: '1.10.72–73'
    },

    practice2: {
      eyebrow: 'What Stylos does',
      heading: 'Agility and precision—delivered reliably and with style',
      body: [
        'We build bespoke websites, relational databases, and mobile applications.',
        {
          cls: 'hand-over',
          t: 'Whether you have an evolving research programme, an intricate archive, an exhibition of artwork, or a specific audience you need to reach—we match your pace, adapt to the brief, and deliver.'
        },
        { cls: 'hand-over', t: '' },
        { cls: 'hand-over aside', t: '(You already  get to choose the palette)' }
      ],
      tags: []
    },

    registers: {
      eyebrow: 'What we do',
      heading: 'Three kinds of commission.',
      label: 'Research & humanities',
      cardHeading: 'Project websites, databases, archives',
      body: [
        'Grant outputs, relational databases and project platforms—built to be used and cited, and to hold up under scholarly scrutiny. Designed from inside research, by an active academic who understands what a fellow researcher, a student, or an advisory board expects to see'
      ],
      tags: ['academic projects', 'SQL Databases', 'scholarly archives']
    },

    reg2: {
      label: 'Heritage & archaeology',
      cardHeading: '3D models, photogrammetry, outreach visualisations',
      body: [
        '3D models of ancient objects structures—created from scratch through photogrammetry or supplied by you, annotated, embedded. Storyboards and visual archives made legible for scholars, funders and the public. Built from first-hand experience of archaeological practice and collaborations with museums'
      ],
      tags: ['3D visualisation', 'photogrammetry', 'storyboards']
    },

    reg3: {
      label: 'Creative & independent',
      cardHeading: 'Portfolios & personal webpages for creative businesses',
      body: [
        'Editorial websites for creative professionals and businesses. Design that catches the tone of a practice: bespoke style, and branding, engaging user interfaces complete with back offices and online payment systems'
      ],
      tags: ['Editorial design', 'Engagement', 'Back office', 'Payments'],
      note: 'What you do may range. What we do is reliably good'
    },

    works: {
      eyebrow: 'Selected projects',
      heading: 'Websites, databases, portfolios',
      note: 'A selection of Stylos\' projects. They range from research outputs to 3D visualisations and to independent creatives. Much of the work is commissioned privately or expects an institutional launch, so items are shown as far as its status allows.'
    },

    method: {
      eyebrow: 'Commission progression',
      heading: 'How Stylos goes about work',
      steps: [
        {
          n: 'I',
          h: 'Read',
          p: 'It starts with your material: the goal and audiences, your data and and insights, and where you would like to go with it'
        },
        {
          n: 'II',
          h: 'Structure',
          p: 'Architecture before decoration: we discuss and approve the scope of the project, timeline, implementation and revisions: you will know what to expect and when, and the date your website or app can be launched. Once the offer is accepted, the work starts in agreed stages'
        },
        {
          n: 'III',
          h: 'Draw',
          p: 'Aesthetic choises—typography, palette, pace and atmosphere, set to the register of the work—scholarly, creative or commercial. The discussion can be as technical as you would like, or a turnkey solution can be offered'
        },
        {
          n: 'IV',
          h: 'Keep',
          p: 'Full documentation is offered on handover, alongside hosting advice and maintenance options. Sites built to work sustainably and to age well'
        }
      ]
    },

    studio: {
      eyebrow: 'About',
      heading: 'A practice rooted in classics, built for the present.',
      body: [
        'Stylos is a one-person practice led by {b|Arkadiy (Arik) Avdokhin|https://www.classics.ox.ac.uk/people/dr-arkadiy-avdokhin}, a historian and archaeologist at the University of Oxford and Wolfson College—PhD (King’s College London), a recent Marie Skłodowska-Curie Fellow at the Faculty of Classics, with ongoing projects in 3D visualisations in archaeology of Asia Minor and the Near East.',
        {
          cls: 'aside',
          t: 'The web design work grew naturally out of the research and archaeological practice. The same habits—structure, provenance, longevity, multilingual and accessible by default—shape every website, whether it serves a research grant a creative or a business project.'
        },
        {
          cls: 'studio-tail aside',
          t: 'Informed by Arik\'s experience with grant timelines and work-package deliverables, engagements are targeted and individually scoped.'
        }
      ],
      plateName: 'Arkadiy (Arik) Avdokhin',
      creds: [
        { b: 'Ph.D, Classics', v: 'King’s College London' },
        { b: 'Marie Skłodowska-Curie Fellow', v: 'Faculty of Classics, Oxford' },
        { b: 'Fellow', v: 'Wolfson College, Oxford' },
        { b: '3D & visualisation', v: 'Photogrammetry · GLAM' }
      ]
    },

    contact: {
      eyebrow: 'Correspondence',
      heading: 'Start a commission, or simply get a conversation going.',
      body: [
        'Write a few lines about the project—what it is, who it is for; Stylos will write back swiftly.'
      ]
    }
  },

  site: {

    meta: {
      title: 'Stylos—web design studio, Oxford',
      description: 'Stylos is a one-person web design studio in Oxford run by an active academic. Websites, research platforms, digital exhibitions and portfolios for research, heritage and creative practice.'
    },

    header: {
      studio: 'Studio',
      scope: 'Scope',
      projects: 'Projects',
      about: 'About',
      commission: 'Commission',
      contact: 'Contact'
    },

    contact: { email: 'studio@stylos.uk', availability: 'Commissions open for 2026' },

    footer: {
      columns: [
        { h: 'Studio', lines: ['17  Garford street', 'Oxford OX2  6UY', 'United Kingdom'] },
        {
          h: 'Inquiries',
          links: [
            { label: 'studio@stylos.uk', href: 'mailto:studio@stylos.uk' }
          ]
        },
        {
          h: 'Registers',
          lines: ['Research & humanities', 'Heritage & visualisation', 'Creative & independent']
        }
      ],
      copyright: '© 2026 Stylos — Oxford',
      toTop: 'Top ↑'
    }
  },

  works: null
};

var TOKENS = {
  ink: function (label) {
    return '<button type="button" class="ink-nudge" id="inkNudge">' + esc(label) + '</button>';
  },
  b: function (label, href) {
    var s = '<strong>' + esc(label) + '</strong>', h = href ? linkHref(href) : '';
    return h ? linkHTML(h, s, 'tx-link tx-name') : s;
  },
  link: function (label, href) {
    var h = linkHref(href || label);
    if (!h) return esc(label);
    return linkHTML(h, esc(label) + (isExternal(h) ? ARROW : ''), 'tx-link');
  }
};

var ARROW = '<span class="tx-arrow" aria-hidden="true">↗</span>';
var RICH = /\{(\w+)\|([^{}|]*)(?:\|([^{}]*))?\}|((?:https?:\/\/|www\.)[^\s<>"{}]+)/gi;

function expand(text) {
  var s = String(text == null ? '' : text), out = '', last = 0, m, fn, u, h;
  RICH.lastIndex = 0;
  while ((m = RICH.exec(s))) {
    out += esc(s.slice(last, m.index));
    if (m[4]) {
      u = trimUrl(m[4]);
      h = linkHref(u[0]);
      out += (h ? linkHTML(h, esc(u[0]) + ARROW, 'tx-link') : esc(u[0])) + esc(u[1]);
    } else {
      fn = TOKENS[m[1].toLowerCase()];
      out += fn ? fn(m[2], m[3]) : esc(m[0]);
    }
    last = RICH.lastIndex;
  }
  return out + esc(s.slice(last));
}

function trimUrl(u) {
  var tail = '', c;
  while (u.length > 1) {
    c = u.charAt(u.length - 1);
    if (/[.,;:!?'"‘’“”]/.test(c) ||
        (c === ')' && u.split(')').length > u.split('(').length) ||
        (c === ']' && u.split(']').length > u.split('[').length)) {
      tail = c + tail; u = u.slice(0, -1);
    } else break;
  }
  return [u, tail];
}

function linkHref(h) {
  h = String(h == null ? '' : h).trim();
  if (/^www\./i.test(h)) h = 'https://' + h;
  return (h && safeHref(h) === h) ? h : '';
}
function isExternal(h) { return /^https?:\/\//i.test(h); }
function linkHTML(href, inner, cls) {
  var ext = isExternal(href);
  return '<a class="' + cls + '" href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>'
       + inner + (ext ? '<span class="sr-only"> (opens in a new tab)</span>' : '') + '</a>';
}
function hostOf(h) {
  return String(h).replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');
}

function safeHref(h) {
  h = String(h == null ? '' : h).trim();
  return /^(https?:\/\/|mailto:|#|\/|\.\.?\/)/i.test(h) ? h : '#';
}

function copyAt(path, src) {
  var parts = String(path).split('.'), i, node;
  node = src.rooms;
  for (i = 0; node != null && i < parts.length; i++) node = node[parts[i]];
  if (node !== undefined && node !== null) return node;
  node = src;
  for (i = 0; node != null && i < parts.length; i++) node = node[parts[i]];
  return node;
}

function fillRich(el, blocks) {

  if (typeof blocks === 'string') blocks = blocks.split(/\n\s*\n/);
  if (!blocks || !blocks.length) { el.innerHTML = ''; el.hidden = true; return; }
  var html = '';
  blocks.forEach(function (b) {
    var t = (typeof b === 'string') ? b : (b && b.t);

    if (t == null || !String(t).trim()) return;
    var cls = (b && b.cls) ? ' class="' + esc(b.cls) + '"' : '';
    html += '<p' + cls + '>' + expand(t) + '</p>';
  });
  el.innerHTML = html;
  el.hidden = !html;
}

function fillList(el, arr, make) {
  var has = !!(arr && arr.length);
  el.innerHTML = has ? arr.map(make).join('') : '';
  el.hidden = !has;
  return has;
}
function fillTags(el, arr) {
  fillList(el, arr, function (s) { return '<span>' + esc(s) + '</span>'; });
}

function fillSteps(el, steps) {
  fillList(el, steps, function (s, i) {
    return '<div class="step" data-step="' + i + '">'
         + '<span class="n mono">' + esc(s.n) + '</span>'
         + '<div><h3>' + esc(s.h) + '</h3><p>' + expand(s.p) + '</p></div></div>';
  });
}

function fillCreds(el, rows) {
  fillList(el, rows, function (r, i) {
    return '<div class="cred mono" style="--ci:' + (i * 110) + 'ms">'
         + '<b>' + esc(r.b) + '</b><span>' + esc(r.v) + '</span></div>';
  });
}
function fillFoot(el, cols) {
  fillList(el, cols, function (c) {
    var inner = (c.links && c.links.length)
      ? c.links.map(function (l) {
          return '<a href="' + esc(safeHref(l.href)) + '">' + esc(l.label) + '</a>';
        }).join('<br>')
      : (c.lines || []).map(esc).join('<br>');
    return '<div class="foot-col"><h4 class="mono cap">' + esc(c.h) + '</h4><p>' + inner + '</p></div>';
  });
}

function renderCopy(src) {
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (el) {
    var v = copyAt(el.getAttribute('data-copy'), src);
    if (v === undefined || v === null) return;
    var d = el.dataset;
    if ('copyRich'  in d) { fillRich(el, v);  return; }
    if ('copyTags'  in d) { fillTags(el, v);  return; }
    if ('copySteps' in d) { fillSteps(el, v); return; }
    if ('copyCreds' in d) { fillCreds(el, v); return; }
    if ('copyFoot'  in d) { fillFoot(el, v);  return; }
    if ('copyInline' in d) { el.innerHTML = expand(v); return; }

    if ('copyMail'  in d) { el.textContent = v; el.setAttribute('href', 'mailto:' + v); return; }
    el.textContent = v;
  });

  var meta = copyAt('site.meta', src);
  if (meta) {
    if (meta.title) { document.title = meta.title; BASE_TITLE = meta.title; }
    var m = document.querySelector('meta[name="description"]');
    if (m && meta.description) m.setAttribute('content', meta.description);
  }
  syncJSONLD(src);
}

function syncJSONLD(src) {
  var el = document.getElementById('ldjson');
  if (!el) return;
  var data;
  try { data = JSON.parse(el.textContent); } catch (e) { return; }
  var meta = copyAt('site.meta', src), ct = copyAt('site.contact', src);
  var foot = copyAt('site.footer', src);
  function one(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  if (meta && meta.description) data.description = one(meta.description);
  if (ct && ct.email) data.email = one(ct.email);

  var col = foot && foot.columns && foot.columns[0];
  if (col && col.lines && col.lines.length >= 2 && data.address) {
    var pc = one(col.lines[1]).match(/^(.*?)\s+([A-Z]{1,2}\d[\dA-Z]?\s*\d[A-Z]{2})$/i);
    data.address.streetAddress = one(col.lines[0]);
    if (pc) { data.address.addressLocality = pc[1]; data.address.postalCode = pc[2]; }
  }
  el.textContent = JSON.stringify(data, null, 2);
}

function mergeDoc(seed, live) {
  var o = {}, k;
  for (k in seed) if (Object.prototype.hasOwnProperty.call(seed, k)) o[k] = seed[k];
  for (k in live) {
    if (!Object.prototype.hasOwnProperty.call(live, k)) continue;
    if (live[k] === undefined || live[k] === null || live[k] === '') continue;
    o[k] = live[k];
  }
  return o;
}

var copyLive = null;

function applyRemote(r) {
  copyLive = r || null;
  if (!r) return;
  var k;
  if (r.rooms) for (k in r.rooms) if (r.rooms[k]) COPY.rooms[k] = mergeDoc(COPY.rooms[k] || {}, r.rooms[k]);
  if (r.site)  for (k in r.site)  if (r.site[k])  COPY.site[k]  = mergeDoc(COPY.site[k]  || {}, r.site[k]);
  if (r.works && r.works.length) {

    var w = r.works.slice().sort(function (a, b) {
      return (a.order === undefined ? 999 : a.order) - (b.order === undefined ? 999 : b.order);
    });
    P.length = 0; Array.prototype.push.apply(P, w.map(normWork));
  }
}

var WORK_FIELDS = ['title', 'slug', 'cat', 'client', 'status', 'register', 'scope', 'live', 'img',
                   'desc', 'longText', 'quote', 'quoteBy', 'sections', 'roman'];

function normWork(w) {
  var o = {}, k, i;
  w = w || {};
  for (i = 0; i < WORK_FIELDS.length; i++) {
    k = WORK_FIELDS[i];
    o[k] = (w[k] !== undefined && w[k] !== null) ? w[k] : (k === 'sections' ? [] : '');
  }
  for (k in w) if (Object.prototype.hasOwnProperty.call(w, k) && !(k in o)) o[k] = w[k];
  return o;
}

var INTRO = {
  TOTAL:   3200,

  brief:    620,
  turn0:    800,

  turn:     340,
  cod:     1900,
  step0:   2220,
  step:     900,
  word:    2300,
  fade:     900
};

var SEEN_KEY = 'stylos-intro';
function introSeen() {
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) { return false; }
}
function markIntroSeen() {
  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
}

var LANDING = { trim: 1.00, dx: 0.03, dy: -0.07, dxM: 0.00, dyM: -0.235 };
var BOX = { x0: 0, y0: 0, x1: 1, y1: 1, measured: false };

function plateBox(im) {
  if (!im || !im.naturalWidth) return false;
  try {
    var w = 200, h = Math.max(2, Math.round(w * im.naturalHeight / im.naturalWidth));
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(im, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data;

    var i, cut = false;
    for (i = 3; i < d.length; i += 4) { if (d[i] < 240) { cut = true; break; } }

    var gr = 0, gg = 0, gb = 0;
    if (!cut) {
      var corners = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + w - 1) * 4];
      for (i = 0; i < 4; i++) { gr += d[corners[i]]; gg += d[corners[i] + 1]; gb += d[corners[i] + 2]; }
      gr /= 4; gg /= 4; gb /= 4;
    }

    var x0 = w, y0 = h, x1 = -1, y1 = -1, x, y, o, on;
    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        o = (y * w + x) * 4;
        if (cut) on = d[o + 3] > 26;
        else on = (Math.abs(d[o] - gr) + Math.abs(d[o + 1] - gg) + Math.abs(d[o + 2] - gb)) > 42;
        if (!on) continue;
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
    if (x1 < x0 || y1 < y0) return false;
    var bw = (x1 - x0 + 1) / w, bh = (y1 - y0 + 1) / h;
    if (bw < 0.12 || bh < 0.06) return false;
    BOX = { x0: x0 / w, y0: y0 / h, x1: (x1 + 1) / w, y1: (y1 + 1) / h, measured: true };
    return true;
  } catch (err) {

    return false;
  }
}

function stageBox() {
  var c = $('tab');
  var w = c ? c.clientWidth : 0, h = c ? c.clientHeight : 0;
  if (!(w > 0)) w = window.innerWidth;
  if (!(h > 0)) h = window.innerHeight;
  return { w: w, h: h };
}

function syncLanding() {
  var S = stageBox(), sw = S.w, sh = S.h, small = sw < 901;
  var pw = small ? Math.min(sw * 0.86, 480) : Math.min(sw * 0.53, 720);
  root.style.setProperty('--plate-w', pw + 'px');

  var cod = $('plateCod'), ph = pw * 0.455;
  if (cod && cod.naturalWidth) {
    ph = pw * cod.naturalHeight / cod.naturalWidth;
    root.style.setProperty('--plate-h', ph + 'px');
  }

  var figX = small ? LANDING.dxM : LANDING.dx;
  var figY = small ? LANDING.dyM : LANDING.dy;
  root.style.setProperty('--fig-x', (figX * sw).toFixed(2) + 'px');
  root.style.setProperty('--fig-y', (figY * sh).toFixed(2) + 'px');

  figPx = sw / 2 + figX * sw;
  figPy = sh / 2 + figY * sh;

  if (!(window.ENG && ENG.KEY)) return;
  var K = ENG.KEY[0];

  if (BOX.measured) {

    var boxW = pw * (BOX.x1 - BOX.x0), boxH = ph * (BOX.y1 - BOX.y0);
    var ox = ((BOX.x0 + BOX.x1) / 2 - 0.5) * pw;
    var oy = ((BOX.y0 + BOX.y1) / 2 - 0.5) * ph;
    K.fill  = clamp(boxW / sw * LANDING.trim, 0.20, 1.30);
    K.fillY = clamp(boxH / sh * LANDING.trim, 0.16, 1.30);
    K.px = figX + ox / sw;
    K.py = figY + oy / sh;
  } else {
    var fill = clamp(pw / sw * LANDING.trim, 0.28, 1.10);
    K.fill = fill; K.fillY = fill;
    K.px = figX; K.py = figY;
  }
}

var PNG_TIP = [0.49583, 0.96563], PNG_BUTT = [0.48750, 0.04688];

var figPx = 0, figPy = 0;

function registerStylus() {
  var el = $('plateSty');

  if (!el) return true;
  if (!window.FIGURE || !window.FIGURE.ready) return false;

  var s = window.FIGURE.stylus();

  if (!s || !isFinite(s.len) || s.len < 24) return false;

  var cs = getComputedStyle(el);
  var ew = parseFloat(cs.width), eh = parseFloat(cs.height);
  if (!(ew > 0) || !(eh > 0)) return false;

  var tx = (PNG_TIP[0]  - 0.5) * ew, ty = (PNG_TIP[1]  - 0.5) * eh;
  var bx = (PNG_BUTT[0] - 0.5) * ew, by = (PNG_BUTT[1] - 0.5) * eh;

  var alen = Math.hypot(bx - tx, by - ty);
  if (!(alen > 1)) return false;
  var adeg = Math.atan2(by - ty, bx - tx) * 180 / Math.PI;

  var wdeg = Math.atan2(s.butt[1] - s.tip[1], s.butt[0] - s.tip[0]) * 180 / Math.PI;
  var rot = wdeg - adeg;
  var scale = s.len / alen;

  var mx = (tx + bx) / 2, my = (ty + by) / 2;
  var r = rot * Math.PI / 180, cr = Math.cos(r), sr = Math.sin(r);
  var ox = scale * (mx * cr - my * sr), oy = scale * (mx * sr + my * cr);
  var cx = (s.tip[0] + s.butt[0]) / 2 - ox;
  var cy = (s.tip[1] + s.butt[1]) / 2 - oy;

  root.style.setProperty('--sty-r', rot.toFixed(2) + 'deg');
  root.style.setProperty('--sty-s', scale.toFixed(4));
  root.style.setProperty('--sty-x', ((cx - figPx) / ew * 100).toFixed(2) + '%');
  root.style.setProperty('--sty-y', ((cy - figPy) / eh * 100).toFixed(2) + '%');
  return true;
}

function registerStylusSoon(tries, then) {
  if (registerStylus()) { if (then) then(true); return; }
  var n = (tries || 0) + 1;
  if (n > 32) { if (then) then(false); return; }
  requestAnimationFrame(function () { registerStylusSoon(n, then); });
}

function probeUrl(url, retried) {
  if (!retried) return url;
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'stylos-cors=1';
}
function probePlate(url, cb, retried) {
  var im = new Image();
  im.crossOrigin = 'anonymous';
  im.decoding = 'async';
  im.onload = function () {
    var ok = plateBox(im);
    if (!ok && !retried) { probePlate(url, cb, true); return; }
    cb(ok);
  };
  im.onerror = function () {
    if (!retried) { probePlate(url, cb, true); return; }
    cb(false);
  };
  im.src = probeUrl(url, retried);
}

var Intro = (function () {
  var el = $('loader'), sty = $('plateSty'), cod = $('plateCod');
  var handoff = $('handoff');
  var timers = [], played = false;

  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function decode(im) {
    if (!im) return Promise.resolve();
    if (im.complete) return im.decode ? im.decode().catch(function () {}) : Promise.resolve();
    return new Promise(function (res) {
      im.addEventListener('load', res, { once: true });
      im.addEventListener('error', res, { once: true });
    }).then(function () { return im.decode ? im.decode().catch(function () {}) : undefined; });
  }

  function finish(done) {

    if (window.FIGURE && window.FIGURE.resume) window.FIGURE.resume();

    handoff.classList.add('on');
    el.classList.add('done');
    at(60, function () { handoff.classList.remove('on'); handoff.classList.add('off'); });
    at(REDUCED ? 40 : INTRO.fade, function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      done();
    });
    at(REDUCED ? 200 : 1500, function () { if (handoff.parentNode) handoff.parentNode.removeChild(handoff); });
  }

  function run(done) {
    el.style.setProperty('--turn', INTRO.turn + 'ms');
    el.style.setProperty('--shrink', INTRO.step + 'ms');

    var brief = REDUCED || deepLinked() || introSeen();
    markIntroSeen();
    if (brief) {
      el.classList.add('s1', 'q4', 'cod', 'k', 'word');
      at(REDUCED ? 320 : INTRO.brief, function () { finish(done); });
      return;
    }

    el.classList.add('s1');

    var marks = [
      [INTRO.turn0 - 40,                's2'],
      [INTRO.turn0,                     'q1'],
      [INTRO.turn0 + INTRO.turn,        'q2'],
      [INTRO.turn0 + INTRO.turn * 2,    'q3'],
      [INTRO.turn0 + INTRO.turn * 3,    'q4'],
      [INTRO.cod,                       'cod'],
      [INTRO.step0 - 40,                's3'],
      [INTRO.step0,                     'k'],
      [INTRO.word,                      'word']
    ];
    var t0 = performance.now(), m = 0;

    (function frame(now) {
      var e = now - t0;
      while (m < marks.length && e >= marks[m][0]) el.classList.add(marks[m++][1]);
      if (m < marks.length) { requestAnimationFrame(frame); return; }
      at(Math.max(0, INTRO.TOTAL - e), function () { finish(done); });
    })(performance.now());
  }

  return {
    play: function (done) {
      if (played) return;
      played = true;
      var all = Promise.all([decode(sty), decode(cod)]);
      var ceiling = new Promise(function (r) { setTimeout(r, 4000); });
      Promise.race([all, ceiling]).then(function () {
        syncLanding();

        registerStylusSoon(0, function () {
          if (window.FIGURE && window.FIGURE.pause) window.FIGURE.pause();
        });
        run(done);
      });
    }
  };
})();

var P = [
  {
    title: 'Aphrodisias 3D Epigraphy',
    slug: 'aphrodisias-3d-epigraphy',
    cat: 'Archaeology project & 3D',
    client: 'University of Oxford · UKRI',
    status: 'Awaiting official launch at University of Oxford domain',
    register: 'Research & heritage',
    scope: 'Design · Frontend · 3D modelling & embedding',
    live: '',
    img: './assets/images/projects/aphrodisias-3d-epigraphy-1200.webp',
    desc: 'An online platform for ancient urban spaces, joining interactive 3D models with scholarly object records.',
    longText: 'Online platform of interactive 3D models of structures and inscriptions from the ancient site of Aphrodisias (Roman province of Caria, modern Turkey). The website makes publicly available the results of a research project at tUniversity of Oxford, that has looked at epigraphy and archaeology of late antique Aphrodisias. The site joins scholarly object records (Greek inscriptions, translations, and commentary), interactive site plans, and embedded photogrammetric models under one designed interface, and is to be hosted by the Faculty of Classics, Oxford (https://3DAph.classics.ox.ac.uk), once the remaining models are complete.',
    quote: '',
    quoteBy: '',
    sections: [
      {
        h: 'What was built',
        p: [
          'Interactive and animation-driven modern frontend for an academic website using Javascript, CSS, and HTML.',
          '3D models were produced from scratch through photogrammetric capture during fieldwork in modern Turkey; they were adapted, hosted online, embedded into web interface and tagged with inscriptions\' text and commentary'
        ]
      },
      {
        h: 'Where it stands',
        p: [
          'The platform is complete and nearly populated; publication waits on the last of the models and on the University\'s hosting arrangements.'
        ]
      }
    ],
    roman: 'I'
  },

  {
    title: 'Festivals & Society',
    slug: 'festivals-and-society',
    cat: 'Academic project & database',
    client: 'University of Vienna',
    status: 'Launched & live',
    register: 'Research & Humanities',
    scope: 'Frontend· Database design · Backend',
    live: '',
    img: './assets/images/projects/festivals-and-society-1200.webp',
    desc: 'An open-access database and a public-facing website for a Vienna-based research project making complex humanities data navigable, structurally sound and visually credible.',
    longText: 'A public-facing website and fully searchable database for an academic project on festivals in Roman-era Egypt as evidenced in papyri. Stylos designed both the backend and the public interface—the landing page, the database structure, the presentation of project materials and the projects\' blog—so that complex humanities data reads as navigable, structurally sound, and visually credible.',
    quote: '',
    quoteBy: '',
    sections: [
      {
        h: 'The material',
        p: [
          'Greek papyri containing evidence for festivals in Roman-era Egypt catalogued, grouped, and made searchable within an ongoing research project.',
          'The project also has three audiences with different needs—experts who want the apparatus, members of the general public who are curious about Roman Egypt and papyri, and the funder who wants to see outcome of the work.'
        ]
      },
      {
        h: 'What was built',
        p: [
          'Frontend (Javascript, HTML, Three.js) and backend (relational fully searchable database complete with interactive online map) that researchers can update and maintain themselves, a schema that carries provenance and confidence alongside every record value, and a public site that presents the same data at two depths.'
        ]
      },
      {
        h: 'Where it stands',
        p: [
          'Launched and live at https://festivals-egypt.org as the database is being updated and expanded'
        ]
      }
    ],
    roman: 'II'
  },

  {
    title: 'Portrait painter',
    slug: 'portrait-painter',
    cat: 'Artist\' portfolio & website',
    client: 'Painter · Oxford',
    status: 'In progress',
    register: 'Creative & independent',
    scope: 'Design · Motion · Image pipeline · Back office',
    live: '',
    img: './assets/images/projects/portrait-painter-1200.webp',
    desc: 'A painter’s site built around the work itself: staged reveals, careful colour, and a lightweight artist\'s back office.',
    longText: 'A portfolio website for an Oxford-based painter working in portraiture and an expressionist register. The design puts the paintings first—staged reveals, restrained typography and colour handling that lets the work set the temperature of the page—with a lightweight artist\'s back office enabling them to update the online catalogue, and a managed image pipeline underneath.',
    quote: '',
    quoteBy: '',
    sections: [
      {
        h: 'The brief',
        p: [
          'A painter in an expressionist register, whose canvases carry their own colour temperature—so any page they sit on has to be quiet enough not to argue with them, and consistent enough that the argument is never accidental.'
        ]
      },
      {
        h: 'What was built',
        p: [
          'A dramatic, near-monochrome, animated shell with the paintings as the only colour in it, staged reveals that give a work the beat it needs before the next one arrives, and an image pipeline that keeps colour faithful from studio photograph to phone screen.'
        ]
      },
      {
        h: 'Where it stands',
        p: [
          'In progress; the artist\'s back office is in place and the catalogue is being photographed and updated'
        ]
      }
    ],
    roman: 'V'
  },

  {
    title: 'Immersive story artist portfolio',
    slug: 'story-artist',
    cat: 'Performer\'s website',
    client: 'Independent performer · London',
    status: 'Work in progress',
    register: 'Creative & independent',
    scope: 'Editorial design · Motion · Back office · Payments',
    live: '',
    img: './assets/images/projects/story-artist-1200.webp',
    desc: 'A cinematic animated portfolio for an independent performer, balancing dramatic atmosphere, biography, and online checkout for shows',
    longText: 'Animated and captivating portfolio for a London-based performer hosted on Vercel, with a functional back office and payment integration. The design balances dramatic atmosphere against plain biography—a stage presence that still reads as a working professional page.',
    quote: '',
    quoteBy: '',
    sections: [
      {
        h: 'The brief',
        p: [
          ' A performer whose work is theatrical and whose website has to be bookable—atmosphere for an audience, plain facts for a producer, and no sense that the two were designed by different people.'
        ]
      },
      {
        h: 'What was built',
        p: [
          'An editorial structure with custom animations and staged reveals timed to reading speed rather than to a scroll position, and a back office in which dates, prices and availability are edited without touching the design.',
          'Payment and enquiry flows sit behind the same layer, so a booking never leaves the site.'
        ]
      },
      {
        h: 'Where it stands',
        p: [
          'Work-in-progress: we are working with the client on refining the frontend design and their backoffice'
        ]
      }
    ],
    roman: 'III'
  },

  {
    title: 'Independent school',
    slug: 'independent-school',
    cat: 'Educational platform',
    client: 'Independent school, Oxford · UK',
    status: 'Proposal stage',
    register: 'Creative & independent',
    scope: 'Design system · Content structure · Back office',
    live: '',
    img: './assets/images/projects/independent-school-1200.webp',
    desc: 'A warm, clear website system built around trust, parent-facing clarity and an elegant information hierarchy.',
    longText: 'A pilot for a small private school in Oxford: an interactive, editorial-style website with carefully structured public-facing content and an administrative back office. The system is designed around trust — parent-facing clarity, warm tone, and an information hierarchy that answers questions before they are asked.',
    quote: '',
    quoteBy: '',
    sections: [
      {
        h: 'The brief',
        p: [
          'A small bilingual school whose parents arrive with the same six questions and were finding none of them answered above the fold — and a staff of three who would have to keep the site current themselves.'
        ]
      },
      {
        h: 'What was built',
        p: [
          'An information hierarchy built backwards from those six questions, a warm and unfussy type system that survives being edited by non-designers, and an administrative back office sized for the people who actually use it.'
        ]
      },
      {
        h: 'Where it stands',
        p: [
          'Proposal stage awaiting the school’s decision'
        ]
      }
    ],
    roman: 'IV'
  }
];

(function () { for (var i = 0; i < P.length; i++) P[i] = normWork(P[i]); })();

COPY.works = P;

var IMAGES = window.STYLOS_IMAGES || {};
var IMG_DIR = './assets/images/projects/';
var CARD_SIZES = '(max-width: 900px) 92vw, (max-width: 1042px) 250px, (max-width: 1708px) 24vw, 410px';

function localImage(src) {
  var m = /(?:^|\/)assets\/images\/projects\/([a-z0-9-]+)\.(?:png|jpe?g|webp|avif)$/i.exec(String(src || '').trim());
  if (!m) return null;
  var stem = m[1].toLowerCase(), cut = stem.replace(/-\d+$/, ''), k, was;
  if (IMAGES[stem]) return { name: stem, e: IMAGES[stem] };
  if (IMAGES[cut]) return { name: cut, e: IMAGES[cut] };
  for (k in IMAGES) {
    was = IMAGES[k].was || [];
    if (was.indexOf(stem) >= 0 || was.indexOf(cut) >= 0) return { name: k, e: IMAGES[k] };
  }
  return null;
}
function imagePath(name, w, ext) { return IMG_DIR + name + '-' + w + '.' + ext; }
function srcsetOf(li, ext) {
  return li.e.widths.map(function (w) { return imagePath(li.name, w, ext) + ' ' + w + 'w'; }).join(', ');
}
function pictureHTML(src, alt, sizes, attrs) {
  var li = localImage(src);
  attrs = attrs || '';
  if (!li) return '<img src="' + esc(safeHref(src)) + '" alt="' + esc(alt) + '"' + attrs + '>';
  return '<picture>'
    + '<source type="image/avif" srcset="' + esc(srcsetOf(li, 'avif')) + '" sizes="' + sizes + '">'
    + '<source type="image/webp" srcset="' + esc(srcsetOf(li, 'webp')) + '" sizes="' + sizes + '">'
    + '<img src="' + esc(imagePath(li.name, li.e.fallback, 'webp')) + '" width="' + li.e.w + '" height="' + li.e.h + '"'
    + ' alt="' + esc(alt) + '"' + attrs + '></picture>';
}

var track = $('track'), counter = $('counter'), barFill = $('barFill');
var wIdx = 0, suppress = false;

var STACKED = window.matchMedia('(max-width: 900px)');

var SHORT = window.matchMedia('(max-height: 800px)');

var cards = [];
function buildCards() {
  track.innerHTML = '';
  P.forEach(function (p, i) {
    var b = document.createElement('a');
    b.className = 'card';
    b.setAttribute('href', '#' + WORK_PREFIX + workSlug(i));
    b.setAttribute('draggable', 'false');
    b.style.setProperty('--sd', (i * 150) + 'ms');
    b.setAttribute('aria-label', 'Case study: ' + p.title);
    b.innerHTML =
      '<div class="shot' + (p.img ? '' : ' veiled') + '">'
      + (p.img ? pictureHTML(p.img, p.title + ' \u2014 interface study', CARD_SIZES, ' loading="lazy" decoding="async"')
                 + '<span class="scan" aria-hidden="true"></span>'
               : '<span class="veil mono">Shown on request</span>')
      + '<span class="plus" aria-hidden="true">+</span></div>'
      + '<div class="card-meta"><div class="row mono"><span>' + esc(p.cat) + '</span></div>'
      + '<h3>' + esc(p.title) + '</h3><div class="client mono">' + esc(p.client) + '</div></div>';
    track.appendChild(b);
  });
  cards = Array.prototype.slice.call(track.children);
}

track.addEventListener('click', function (e) {
  var card = e.target.closest && e.target.closest('.card');
  if (!card) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
  e.preventDefault();
  if (suppress) return;
  var i = cards.indexOf(card);
  if (i >= 0) caseMorph(card, i);
});

function centerOn(i) {
  if (STACKED.matches) return;
  var c = cards[clamp(i, 0, cards.length - 1)];
  track.scrollTo({ left: c.offsetLeft - (track.clientWidth - c.clientWidth) / 2, behavior: REDUCED ? 'auto' : 'smooth' });
}
function nearestCard() {
  var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = Infinity;
  cards.forEach(function (c, i) {
    var d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
    if (d < bd) { bd = d; best = i; }
  });
  return best;
}
$('prev').addEventListener('click', function () { setWorks(wIdx - 1); });
$('next').addEventListener('click', function () { setWorks(wIdx + 1); });

var sRaf = null;
track.addEventListener('scroll', function () {
  if (STACKED.matches || sRaf) return;
  sRaf = requestAnimationFrame(function () { sRaf = null; setWorks(nearestCard(), 'track'); });
}, { passive: true });

track.addEventListener('wheel', function (e) {
  if (STACKED.matches) return;
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  var max = track.scrollWidth - track.clientWidth;
  if ((e.deltaY > 0 && track.scrollLeft < max - 2) || (e.deltaY < 0 && track.scrollLeft > 2)) {
    e.preventDefault(); track.scrollLeft += e.deltaY;
  }
}, { passive: false });

var dragging = false, dx0 = 0, sl0 = 0;
track.addEventListener('pointerdown', function (e) {
  if (STACKED.matches) return;
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  dragging = true; suppress = false; dx0 = e.clientX; sl0 = track.scrollLeft;
  track.classList.add('dragging');
});
window.addEventListener('pointermove', function (e) {
  if (!dragging) return;
  var d = e.clientX - dx0;
  if (Math.abs(d) > 6) suppress = true;
  track.scrollLeft = sl0 - d;
});
function endDrag() {
  if (!dragging) return;
  dragging = false;
  track.classList.remove('dragging');

}
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', function () { endDrag(); suppress = false; });

function setWorks(i, src) {
  i = clamp(i, 0, P.length - 1);
  var changed = i !== wIdx;
  wIdx = i;
  counter.textContent = pad2(i + 1) + ' / ' + pad2(P.length);
  barFill.style.width = (100 / P.length) + '%';
  barFill.style.left = (i / P.length * 100) + '%';
  litTick(i);

  for (var k = 0; k < cards.length; k++) cards[k].classList.toggle('is-on', k === i && !STACKED.matches);
  if (window.FIGURE && window.FIGURE.ready) window.FIGURE.setHand(i, P.length);
  if (src !== 'track' && (changed || src === 'hand')) centerOn(i);
}

var cascaded = false, cardIO = null;
function runCascade() {
  if (cascaded) return;
  cascaded = true;

  if (STACKED.matches) {
    track.classList.add('rested');
    if (REDUCED || !('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('in'); });
      return;
    }
    cardIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        cardIO.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -14% 0px' });
    cards.forEach(function (c) { cardIO.observe(c); });
    return;
  }

  track.classList.add('cascade');
  setTimeout(function () { track.classList.add('rested'); }, REDUCED ? 0 : P.length * 150 + 2200);
}

var midIO = null;
function watchMid() {
  if (!('IntersectionObserver' in window)) return;
  if (midIO) { midIO.disconnect(); midIO = null; }
  if (!STACKED.matches) {
    cards.forEach(function (c) { c.classList.remove('is-mid'); });
    return;
  }
  midIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var card = en.target.parentNode;
      if (card) card.classList.toggle('is-mid', en.isIntersecting);
    });
  }, { rootMargin: '-49% 0px -49% 0px', threshold: 0 });
  cards.forEach(function (c) {
    var shot = c.querySelector('.shot');
    if (shot) midIO.observe(shot);
  });
}

var handEl = $('hand'), dialSvg = $('handDial'), tickEls = [], handOn = false;

function handGeom() {
  var W = window.innerWidth, H = window.innerHeight;
  var len = Math.min(W * 0.19, H * 0.27);
  return { cx: 500, cy: (window.FIGURE ? window.FIGURE.HAND_CY : 0.155) * 1000,
           rx: 1000 * len / W, ry: 1000 * len / H };
}
function buildHit() {
  var g = handGeom(), NS = 'http://www.w3.org/2000/svg';
  dialSvg.innerHTML = ''; tickEls = [];

  var arc = document.createElementNS(NS, 'path');
  var d = '';
  for (var j = 0; j <= 48; j++) {
    var a = Math.PI * j / 48;
    d += (j ? 'L' : 'M') + (g.cx - g.rx * Math.cos(a) * 0.995).toFixed(1) + ' '
       + (g.cy + g.ry * Math.sin(a) * 0.995).toFixed(1);
  }
  arc.setAttribute('d', d); arc.setAttribute('class', 'dial');
  dialSvg.appendChild(arc);

  for (var k = 0; k < P.length; k++) {
    var t = Math.PI * (k + 0.5) / P.length;
    var ux = -Math.cos(t), uy = Math.sin(t);
    var ln = document.createElementNS(NS, 'line');
    ln.setAttribute('x1', (g.cx + ux * g.rx * 0.955).toFixed(1));
    ln.setAttribute('y1', (g.cy + uy * g.ry * 0.955).toFixed(1));
    ln.setAttribute('x2', (g.cx + ux * g.rx * 1.045).toFixed(1));
    ln.setAttribute('y2', (g.cy + uy * g.ry * 1.045).toFixed(1));
    ln.setAttribute('class', 'tick' + (k === wIdx ? ' on' : ''));
    dialSvg.appendChild(ln); tickEls.push(ln);
  }
}
function litTick(i) {
  tickEls.forEach(function (t, k) { t.classList.toggle('on', k === i); });
}

var caseEl = $('case');
var C = {
  count: $('caseCount'), cat: $('caseCat'), title: $('caseTitle'), long: $('caseLong'),
  dek: $('caseDek'), facts: $('caseFacts'), media: $('caseMedia'), status: $('caseStatus'),
  live: $('caseLive'),
  mast: caseEl.querySelector('.case-mast'), scroll: $('caseScroll')
};

if (C.scroll && C.mast) {
  C.scroll.addEventListener('scroll', function () {
    if (C.scroll.scrollTop > 18) C.mast.classList.add('lit');
  }, { passive: true });
}
var cIdx = 0, lastFocus = null;
caseEl.setAttribute('inert', '');

function fillCase(i) {
  var p = P[i];
  cIdx = i;

  if (C.mast) C.mast.classList.remove('lit');
  if (C.scroll) C.scroll.scrollTop = 0;
  C.count.textContent = pad2(i + 1) + ' / ' + pad2(P.length);
  C.cat.textContent = p.cat;
  C.title.textContent = p.title;

  if (C.dek) C.dek.innerHTML = expand(p.desc || '');

  var html = String(p.longText || '')
    .split(/\n\s*\n/)
    .map(function (para) { para = para.trim(); return para ? '<p>' + expand(para) + '</p>' : ''; })
    .join('');
  if (String(p.quote || '').trim()) {
    html += '<blockquote class="case-quote"><p>' + expand(String(p.quote).trim()) + '</p>'
          + (String(p.quoteBy || '').trim() ? '<cite class="mono">' + esc(String(p.quoteBy).trim()) + '</cite>' : '')
          + '</blockquote>';
  }
  (p.sections || []).forEach(function (sec) {
    if (!sec) return;
    if (typeof sec === 'string') { if (sec.trim()) html += '<p>' + expand(sec) + '</p>'; return; }
    if (String(sec.h || '').trim()) html += '<h4>' + esc(sec.h) + '</h4>';
    (sec.p || []).forEach(function (para) {
      if (String(para || '').trim()) html += '<p>' + expand(para) + '</p>';
    });
  });
  C.long.innerHTML = html;

  var live = linkHref(p.live);
  if (live && !isExternal(live)) live = '';
  if (C.live) {
    C.live.hidden = !live;
    C.live.setAttribute('href', live || '#');
  }

  C.status.textContent = p.status;
  C.facts.innerHTML =
    row('Client', p.client) + row('Register', p.register) + row('Scope', p.scope) + row('Status', p.status)
    + (live ? '<div class="f"><dt>Live site</dt><dd>' + linkHTML(live, esc(hostOf(live)) + ARROW, 'tx-link') + '</dd></div>' : '');

  syncRowTo(i);

  C.media.innerHTML = p.img
    ? pictureHTML(p.img, p.title + ' \u2014 interface study', '100vw', ' decoding="async"')
    : '<div class="ph"><span class="mono cap">Shown on request</span></div>';
  function row(k, v) { return '<div class="f"><dt>' + k + '</dt><dd>' + esc(v) + '</dd></div>'; }
}

var VT = typeof document.startViewTransition === 'function';
var MORPH = 'case-shot';

function inView(el) {
  var r = el.getBoundingClientRect();
  return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
}
function waitFor(p, ms) {
  return Promise.race([p, new Promise(function (r) { setTimeout(r, ms); })]);
}

function caseMorph(card, i) {
  var shot = card && card.querySelector('.shot');
  if (REDUCED || !VT || !shot || !inView(shot) || document.visibilityState !== 'visible') { openCase(i); return; }
  shot.style.viewTransitionName = MORPH;
  root.classList.add('case-vt');
  var t = document.startViewTransition(function () {
    shot.style.viewTransitionName = '';
    openCase(i);
    C.media.style.viewTransitionName = MORPH;
    var im = C.media.querySelector('img');
    return (im && im.decode) ? waitFor(im.decode().catch(function () {}), 320) : null;
  });
  t.finished.then(clean, clean);
  function clean() { C.media.style.viewTransitionName = ''; root.classList.remove('case-vt'); }
}

function caseUnmorph() {
  var card = cards[cIdx], shot = card && card.querySelector('.shot');
  if (!caseEl.classList.contains('open')) return;
  if (REDUCED || !VT || !shot || document.visibilityState !== 'visible') { closeCase(); return; }
  var r = shot.getBoundingClientRect();
  if (!(r.width > 0) || r.bottom < 0 || r.top > window.innerHeight) { closeCase(); return; }
  C.media.style.viewTransitionName = MORPH;
  root.classList.add('case-vt');
  var t = document.startViewTransition(function () {
    C.media.style.viewTransitionName = '';
    closeCase();
    shot.style.viewTransitionName = MORPH;
  });
  t.finished.then(clean, clean);
  function clean() { shot.style.viewTransitionName = ''; root.classList.remove('case-vt'); }
}
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function syncRowTo(i) {
  if (i === wIdx) return;
  setWorks(i, 'case');
}

function openCase(i, src) {
  lastFocus = document.activeElement;
  fillCase(i);
  caseEl.removeAttribute('inert');
  caseEl.classList.add('open');
  root.classList.add('locked');
  if (window.FIGURE) window.FIGURE.pause();
  if (src !== 'route') pushWork(i);
  setDocTitle(i);
  $('caseX').focus();
}
function closeCase(src) {
  if (!caseEl.classList.contains('open')) return;
  caseEl.classList.remove('open');
  caseEl.setAttribute('inert', '');
  root.classList.remove('locked');
  if (window.FIGURE) window.FIGURE.resume();
  setDocTitle(-1);

  if (src !== 'route') syncAddress(room >= 0 ? room : 9);
  if (lastFocus) lastFocus.focus();
}
$('caseX').addEventListener('click', function () { caseUnmorph(); });
$('casePrev').addEventListener('click', function () { pageCase(-1); });
$('caseNext').addEventListener('click', function () { pageCase(1); });
document.addEventListener('keydown', function (e) {
  if (!caseEl.classList.contains('open')) return;
  if (e.key === 'Escape') caseUnmorph();
  else if (e.key === 'ArrowLeft') pageCase(-1);
  else if (e.key === 'ArrowRight') pageCase(1);
});

function pageCase(d) {
  var i = (cIdx + d + P.length) % P.length;
  fillCase(i);
  setHash(WORK_PREFIX + workSlug(i), 'replace');
  setDocTitle(i);
}

var WORK_PREFIX = 'work/';
var BASE_TITLE = document.title;

function slugify(s) {
  s = String(s == null ? '' : s);
  if (s.normalize) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return s.toLowerCase()
    .replace(/[‘’']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
function workSlug(i) {
  var p = P[i];
  if (!p) return '';
  return slugify(p.slug || p.title) || String(i + 1);
}

function workIndex(s) {
  s = slugify(s);
  if (!s) return -1;
  for (var i = 0; i < P.length; i++) if (workSlug(i) === s) return i;
  var n = parseInt(s, 10);
  if (n >= 1 && n <= P.length && String(n) === s.replace(/^0+/, '')) return n - 1;
  return -1;
}

function setDocTitle(i) {
  document.title = (i >= 0 && P[i] && P[i].title) ? (P[i].title + ' — ' + BASE_TITLE) : BASE_TITLE;
}

function setHash(h, how) {
  if (!history.pushState) return;
  var url = '#' + h;
  if (('#' + (location.hash || '').replace(/^#/, '')) === url && how !== 'push') return;
  try {
    if (how === 'replace') history.replaceState(history.state, '', url);
    else history.pushState({ h: h }, '', url);
  } catch (e) {  }
}
function pushWork(i) { setHash(WORK_PREFIX + workSlug(i), 'push'); }

var LEGACY = {
  practice: 'studio', practice2: 'studio',
  registers: 'scope', reg2: 'scope/3d', reg3: 'scope/creative',
  works: 'projects', method: 'commission'

};

var roomAddr = null, addrMap = null;
function buildRoomAddrs() {
  roomAddr = []; addrMap = {};
  var last = '', i, j, al;
  for (i = 0; i < screens.length; i++) {
    var a = (screens[i].dataset.addr || '').trim();
    if (a) { last = a; addrMap[a.toLowerCase()] = i; }
    roomAddr[i] = (i === 0) ? '' : last;
    al = (screens[i].dataset.alias || '').split(',');
    for (j = 0; j < al.length; j++) {
      var t = al[j].trim().toLowerCase();
      if (t && addrMap[t] === undefined) addrMap[t] = i;
    }
  }

  for (i = 0; i < screens.length; i++) {
    var id = (screens[i].id || '').toLowerCase();
    if (id && addrMap[id] === undefined) addrMap[id] = i;
  }
}

function roomIndex(h) {
  if (!roomAddr) buildRoomAddrs();
  h = String(h == null ? '' : h).trim().toLowerCase().replace(/^#/, '').replace(/\/+$/, '');
  if (!h) return -1;
  if (addrMap[h] !== undefined) return addrMap[h];
  var leg = LEGACY[h];
  if (leg && addrMap[leg] !== undefined) return addrMap[leg];
  return -1;
}
function syncAddress(i) {
  if (!history.replaceState) return;
  if (root.classList.contains('intro-locked')) return;

  if (caseEl && caseEl.classList.contains('open')) return;
  if (!roomAddr) buildRoomAddrs();
  var h = roomAddr[i] || '';
  if (h) { setHash(h, 'replace'); return; }
  if (!location.hash) return;
  try { history.replaceState(history.state, '', location.pathname + location.search); }
  catch (e) {  }
}

function readHash() {
  var h = (location.hash || '').replace(/^#/, '');
  try { h = decodeURIComponent(h); } catch (e) {}
  return h;
}

function deepLinked() {
  var h = readHash();
  if (!h) return false;
  if (h.slice(0, WORK_PREFIX.length).toLowerCase() === WORK_PREFIX) {
    return workIndex(h.slice(WORK_PREFIX.length)) >= 0;
  }
  if (h === 'top') return false;
  return roomIndex(h) > 0;
}

function applyHash(how) {
  var h = readHash();
  if (h.slice(0, WORK_PREFIX.length).toLowerCase() === WORK_PREFIX) {
    var wi = workIndex(h.slice(WORK_PREFIX.length));
    if (wi >= 0) {

      if (caseEl.classList.contains('open') && cIdx === wi) return true;
      if (caseEl.classList.contains('open')) { fillCase(wi); setDocTitle(wi); return true; }
      setWorks(wi, 'route');
      goRoom($('works'), how);
      openCase(wi, 'route');
      return true;
    }
    h = 'projects';
  }
  closeCase('route');
  var ri = roomIndex(h);
  if (ri >= 0) { goRoom(screens[ri], how); return true; }
  return false;
}

function goRoom(el, how) {
  if (!el) return;
  if (how === 'auto') {
    settleSuspend(600);
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    posePrimed = false;
    onScroll();
    auditFit();
  } else {
    goTo(el);
  }
}

window.addEventListener('popstate', function () { applyHash('auto'); });

var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'));
var navEl = $('nav');
var SNAP = window.matchMedia('(min-width: 901px) and (min-height: 601px)');
var room = -1, tops = [], actT0 = 0, actMs = 0, deckRaf = 0;

var hts = [];

var vhRef = window.innerHeight, vhProbe = null;
function measureVH() {
  if (!vhProbe) {
    vhProbe = document.createElement('div');
    vhProbe.setAttribute('aria-hidden', 'true');
    vhProbe.style.cssText =
      'position:absolute;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none';
    document.body.appendChild(vhProbe);
  }
  var h = vhProbe.offsetHeight;
  vhRef = h > 0 ? h : window.innerHeight;
}

function measure() {
  measureVH();
  tops = screens.map(function (s) { return s.getBoundingClientRect().top + window.scrollY; });
  hts = screens.map(function (s) { return s.offsetHeight; });
  measureGiga();
}

var gigaBox = null;
function measureGiga() {
  gigaBox = null;
  var g = document.querySelector('.practice .gigaword');
  if (!g || !document.createRange) return;
  var sec = g.closest ? g.closest('.screen') : null;
  var i = sec ? screens.indexOf(sec) : -1;
  if (i < 0) return;
  var rng = document.createRange();
  rng.selectNodeContents(g);
  var b = rng.getBoundingClientRect();
  if (!b.width || !b.height) return;
  gigaBox = { room: i, top: b.top + window.scrollY - tops[i], h: b.height, x0: b.left, x1: b.right };
}

function gigaClear() {
  if (!gigaBox) return null;
  if (poseP < gigaBox.room - 1.06 || poseP > gigaBox.room + 0.55) return null;
  var y0 = tops[gigaBox.room] + gigaBox.top - window.scrollY;
  return { x0: gigaBox.x0, x1: gigaBox.x1, y0: y0, y1: y0 + gigaBox.h };
}
function deckPos() {
  var y = window.scrollY + vhRef * 0.5;
  if (y <= tops[0]) return 0;
  for (var i = 0; i < tops.length - 1; i++) {
    var a = tops[i] + hts[i] * 0.5;
    var b = tops[i + 1] + hts[i + 1] * 0.5;
    if (y < b) return i + clamp((y - a) / Math.max(1, b - a), 0, 1);
  }
  return tops.length - 1;
}

function startAct(i) {
  var k = ENG.KEY[i];
  actMs = (k && k.actMs) ? k.actMs : 0;
  actT0 = performance.now();
}

function runMethod() {
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
  steps.forEach(function (s) { s.classList.remove('lit'); });
  if (REDUCED) { steps.forEach(function (s) { s.classList.add('lit'); }); return; }
  steps.forEach(function (s, i) {
    setTimeout(function () { s.classList.add('lit'); }, 420 + i * 900);
  });
}

function enterRoom(i) {
  if (i === room) return;
  room = i;
  startAct(i);

  var inWorks = screens[i].id === 'works';

  var wantHand = inWorks && !STACKED.matches;
  if (wantHand !== handOn) {
    handOn = wantHand;
    handEl.classList.toggle('on', handOn);
  }
  if (inWorks) {
    if (window.FIGURE && window.FIGURE.ready) window.FIGURE.setHand(wIdx, P.length);
    runCascade();
  }

  var inMethod = screens[i].id === 'method';
  body.classList.toggle('on-paper', inMethod);
  if (inMethod) runMethod();

  if (mosaicEl) mosaicEl.classList.toggle('mute', inMethod);

  if (window.FIGURE) {
    var id = screens[i].id;
    var warm = (id === 's1' || id === 's2' || id === 's3') ? 0.10
             : (id === 'top') ? 0.05 : 0.02;
    window.FIGURE.setWarm(REDUCED ? 0 : warm);
  }

  var nav = screens[i].dataset.nav || '';
  Array.prototype.forEach.call(document.querySelectorAll('.nav-link, .sheet-nav a'), function (a) {
    a.setAttribute('aria-current', String(a.dataset.nav === nav && nav !== ''));
  });
  syncNavRule();

  syncAddress(i);
}

var navRule = $('navRule');
function syncNavRule(snap) {
  if (!navRule) return;
  var pill = navRule.parentNode;
  var a = pill.querySelector('.nav-link[aria-current="true"]');
  if (!a || !a.offsetWidth) { navRule.classList.remove('on'); return; }
  var cs = getComputedStyle(a);
  var pl = parseFloat(cs.paddingLeft) || 0, pr = parseFloat(cs.paddingRight) || 0;
  var x = a.offsetLeft + pl, w = Math.max(0, a.offsetWidth - pl - pr), y = a.offsetTop + a.offsetHeight - 2;
  var jump = snap || !navRule.classList.contains('on');
  if (jump) navRule.classList.add('snap');
  navRule.style.setProperty('--rx', x.toFixed(1) + 'px');
  navRule.style.setProperty('--ry', y.toFixed(1) + 'px');
  navRule.style.setProperty('--rw', w.toFixed(1) + 'px');
  if (jump) { void navRule.offsetWidth; navRule.classList.remove('snap'); }
  navRule.classList.add('on');
}

var tick = null, vis = [];
function onScroll() {
  if (root.classList.contains('intro-locked')) return;
  if (tick) return;
  tick = requestAnimationFrame(function () {
    tick = null;
    if (!tops.length) measure();
    var y = window.scrollY, vh = vhRef, snapped = SNAP.matches;
    var n = screens.length, i = 0, bestV = -1, k, top, h, v;

    for (k = 0; k < n; k++) {
      top = tops[k] - y; h = hts[k] || 0;
      v = Math.min(top + h, vh) - Math.max(top, 0);
      vis[k] = v;
      if (v > bestV) { bestV = v; i = k; }
    }
    enterRoom(i);
    for (k = 0; k < n; k++) {
      if (snapped) { screens[k].classList.toggle('live', Math.abs(k - i) <= 1); continue; }
      if (vis[k] > Math.min(hts[k] || 0, vh) * 0.10) screens[k].classList.add('live');
    }
    navEl.classList.toggle('stuck', y > 40);
  });
}

var backEl = $('backplate'), backO = -1, backB = -1, backLive = false;

var BLOOM_MS = 2200, BLOOM_HOLD = 0.26, BLOOM_GROW = 1.16;
var bloomT0 = 0, bloomRaf = 0;

function bloomFrame(now) {
  var t = clamp((now - bloomT0) / BLOOM_MS, 0, 1);
  var g = s01((t - BLOOM_HOLD) / (1 - BLOOM_HOLD));
  if (window.FIGURE) window.FIGURE.setBloom(1 + (BLOOM_GROW - 1) * g);
  bloomFade = 1 - g;
  backO = -1;
  backplateAt(poseP);
  if (t < 1) bloomRaf = requestAnimationFrame(bloomFrame);
  else { bloomRaf = 0; bloomFade = 0; }
}
var bloomFade = 1;
function startBloom() {
  if (REDUCED) { bloomFade = 0; if (window.FIGURE) window.FIGURE.setBloom(BLOOM_GROW); return; }
  bloomT0 = performance.now();
  if (!bloomRaf) bloomRaf = requestAnimationFrame(bloomFrame);
}

function backplateAt(p) {
  if (!backEl) return;

  var t = clamp(p / 2.00, 0, 1);

  var o = backLive ? (1 - t) * (1 - t) * 0.52 * bloomFade : 0;
  var b = 7 + t * 34 + (1 - bloomFade) * 26;
  if (Math.abs(o - backO) > 0.004) { backO = o; backEl.style.setProperty('--back-o', o.toFixed(3)); }
  if (Math.abs(b - backB) > 0.35)  { backB = b; backEl.style.setProperty('--back-blur', b.toFixed(1) + 'px'); }
}

function bezier(x1, y1, x2, y2) {
  var cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  var cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  function sx(t) { return ((ax * t + bx) * t + cx) * t; }
  function sy(t) { return ((ay * t + by) * t + cy) * t; }
  function dx(t) { return (3 * ax * t + 2 * bx) * t + cx; }
  return function (x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var t = x, i, d, s;
    for (i = 0; i < 6; i++) {
      d = sx(t) - x;
      if (Math.abs(d) < 1e-5) return sy(t);
      s = dx(t);
      if (Math.abs(s) < 1e-6) break;
      t -= d / s;
    }
    var lo = 0, hi = 1;
    t = x;
    for (i = 0; i < 24; i++) {
      d = sx(t);
      if (Math.abs(d - x) < 1e-5) break;
      if (d < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return sy(t);
  };
}

var SETTLE = (function () {
  var IDLE_WHEEL = 160, CARRY = 0.085;
  var GLIDE_MIN = 360, GLIDE_MAX = 760, GLIDE_PX = 0.45;
  var quiet = null, raf = 0, from = 0, dest = 0, t0 = 0, glide = GLIDE_MAX, destRoom = -1;
  var dir = 0, lastY = 0, suspendUntil = 0, touching = false;
  var coastRaf = 0, coastY = 0, coastStill = 0;

  var ease = bezier(0.45, 0.05, 0.16, 1);
  function maxScroll() {

    var d = document.documentElement;
    return Math.max(0, d.scrollHeight - (d.clientHeight || window.innerHeight));
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  var pass = null;
  function passage() {
    if (pass) return pass;
    var a = -1, b = -1, i;
    for (i = 0; i < screens.length; i++) {
      if (!screens[i].classList.contains('show')) continue;
      if (a < 0) a = i;
      b = i;
    }
    pass = (a > 0 && b + 1 < screens.length) ? { from: a - 1, to: b + 1 } : { from: -1, to: -1 };
    return pass;
  }
  function inPassage() {
    var s = passage();
    if (s.from < 0 || !tops.length) return false;
    var y = window.scrollY, edge = vhRef * CARRY;
    return y > tops[s.from] + edge && y < tops[s.to] - edge;
  }

  function targetRoom() {
    var p = deckPos(), i = Math.floor(p), f = p - i, n = tops.length, r;
    if (dir > 0) r = clamp(f > CARRY ? i + 1 : i, 0, n - 1);
    else if (dir < 0) r = clamp(f < 1 - CARRY ? i : i + 1, 0, n - 1);
    else r = clamp(Math.round(p), 0, n - 1);
    var s = passage();
    if (s.from >= 0 && r > s.from && r < s.to) {
      var y = window.scrollY;
      r = (y - tops[s.from] < tops[s.to] - y) ? s.from : s.to;
    }
    return r;
  }

  function insideTall() {
    var y = window.scrollY, vh = vhRef;
    for (var i = 0; i < tops.length; i++) {
      var h = hts[i] || 0;
      if (h <= vh + 8) continue;
      var top = tops[i], bot = top + h - vh;
      if (y > top + 8 && y < bot - 8) return true;
    }
    return false;
  }

  function step(now) {
    var t = clamp((now - t0) / glide, 0, 1);
    var y = from + (dest - from) * ease(t);
    window.scrollTo(0, y);
    var got = window.scrollY;
    if (t > 0.06 && Math.abs(got - y) > 24) { raf = 0; dir = 0; destRoom = -1; lastY = got; return; }
    lastY = got;
    if (t < 1) { raf = requestAnimationFrame(step); } else { raf = 0; dir = 0; destRoom = -1; }
  }

  function glideTo(y, room) {
    var at = window.scrollY;
    dest = clamp(y, 0, maxScroll());
    if (Math.abs(dest - at) < 2) { dir = 0; destRoom = -1; return; }
    from = at; t0 = performance.now(); destRoom = room;
    glide = clamp(GLIDE_MIN + Math.abs(dest - from) * GLIDE_PX, GLIDE_MIN, GLIDE_MAX);
    stop(); raf = requestAnimationFrame(step);
  }

  function settle() {
    quiet = null;
    if (touching || performance.now() < suspendUntil || !tops.length) return;
    if (insideTall() || inPassage()) { dir = 0; return; }
    var r = targetRoom();
    glideTo(tops[r], r);
  }

  function page(d) {
    if (!tops.length || performance.now() < suspendUntil) return false;
    var y = window.scrollY, vh = vhRef, n = tops.length, c = 0, i;
    for (i = 0; i < n; i++) if (tops[i] <= y + 2) c = i;
    var h = hts[c] || 0;
    if (h > vh + 8) {
      if (d > 0 && y < tops[c] + h - vh - 8) return false;
      if (d < 0 && y > tops[c] + 8) return false;
    }
    var r = d > 0 ? c + 1 : (y > tops[c] + 8 ? c : c - 1);
    if (raf && destRoom >= 0 && (dest - from) * d > 0) r = destRoom + d;
    r = clamp(r, 0, n - 1);
    var y1 = tops[r];
    if (d < 0 && r < c && (hts[r] || 0) > vh + 8) y1 = tops[r] + hts[r] - vh;
    clearTimeout(quiet); quiet = null;
    if (coastRaf) { cancelAnimationFrame(coastRaf); coastRaf = 0; }
    dir = d;
    glideTo(y1, r);
    return true;
  }

  function coast() {
    coastRaf = 0;
    var y = window.scrollY;
    if (Math.abs(y - coastY) < 0.5) { coastStill++; } else { coastStill = 0; coastY = y; }
    if (coastStill >= 3) { settle(); return; }
    coastRaf = requestAnimationFrame(coast);
  }
  function watchCoast() {
    if (coastRaf) cancelAnimationFrame(coastRaf);
    coastY = -1e9; coastStill = 0;
    coastRaf = requestAnimationFrame(coast);
  }

  function poke(d) {
    if (performance.now() < suspendUntil) return;
    if (d) dir = d;
    stop(); destRoom = -1;
    clearTimeout(quiet);
    if (coastRaf) { cancelAnimationFrame(coastRaf); coastRaf = 0; }
    if (!touching) quiet = setTimeout(watchCoast, IDLE_WHEEL);
  }

  function typing(t, k) {
    if (!t || !t.closest) return false;
    if (t.closest('input, textarea, select, [contenteditable], [role="menu"], [role="radiogroup"]')) return true;
    return k === ' ' && !!t.closest('button, [role="button"]');
  }

  if (!REDUCED) {
    window.addEventListener('wheel', function (e) {
      poke(e.deltaY > 0.5 ? 1 : e.deltaY < -0.5 ? -1 : 0);
    }, { passive: true });
    window.addEventListener('touchstart', function () {
      touching = true; stop(); clearTimeout(quiet);
      if (coastRaf) { cancelAnimationFrame(coastRaf); coastRaf = 0; }
    }, { passive: true });
    window.addEventListener('touchmove', function () {
      var y = window.scrollY;
      if (y > lastY + 0.5) dir = 1; else if (y < lastY - 0.5) dir = -1;
      lastY = y;
    }, { passive: true });
    window.addEventListener('touchend', function () {
      touching = false;
      clearTimeout(quiet);
      watchCoast();
    }, { passive: true });

    window.addEventListener('keydown', function (e) {
      var k = e.key, d = 0;
      if (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) d = 1;
      else if (k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) d = -1;
      if (!d || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (typing(e.target, k)) return;
      if (root.classList.contains('locked') || root.classList.contains('cons-open') ||
          root.classList.contains('intro-locked')) return;
      if (e.repeat && raf) { e.preventDefault(); return; }
      if (page(d)) { e.preventDefault(); return; }
      poke(d);
    });
  }

  return {
    suspend: function (ms) {
      suspendUntil = performance.now() + ms;
      stop(); clearTimeout(quiet);
      if (coastRaf) { cancelAnimationFrame(coastRaf); coastRaf = 0; }
    }
  };
})();
function settleSuspend(ms) { SETTLE.suspend(ms); }

var poseP = 0, posePrimed = false;
function poseLoop() {
  deckRaf = requestAnimationFrame(poseLoop);
  if (!window.FIGURE || !window.FIGURE.ready) return;
  var target = deckPos();
  if (!posePrimed) { poseP = target; posePrimed = true; }

  else { poseP += (target - poseP) * (REDUCED ? 0.035 : 0.16); }
  if (Math.abs(target - poseP) < 0.0004) poseP = target;

  var q = actMs ? clamp((performance.now() - actT0) / actMs, 0, 1) : 0;
  if (REDUCED && actMs) {
    var kr = ENG.KEY[room];
    q = (kr && kr.eraseTo !== undefined) ? 0.58 : 1;
  }
  window.FIGURE.setPose(poseP, q);
  window.FIGURE.setVeil(veilAt());
  dialAt();
  backplateAt(poseP);
  overtureAt(poseP);
  showIndexAt(poseP);
  if (mosaic) { mosaic.setClear(gigaClear()); mosaic.update(poseP); }
}

function veilAt() {
  if ((!STACKED.matches && !SHORT.matches) || !tops.length) return 0;
  var i = room >= 0 ? room : 0, vh = vhRef;
  if (!hts[i] || hts[i] <= vh + 8) return 0;
  var over = (window.scrollY - tops[i]) / (vh * 0.22);
  return clamp(over, 0, 1) * 0.94;
}

var dialV = -1;
function dialAt() {
  if (!handEl) return;
  var h = (window.FIGURE.state().hand) || 0;
  var v = STACKED.matches ? 0 : Math.round(clamp(h * h, 0, 1) * 100) / 100;
  if (v === dialV) return;
  dialV = v;
  handEl.style.setProperty('--dial', String(v));
}

var showIdxEl = $('showIndex');
var showTicks = showIdxEl ? Array.prototype.slice.call(showIdxEl.children) : [];
var showLit = -2, showOn = null;

var overtureEl = screens[0], leaving = false;
function overtureAt(p) {
  var go = p > 0.045;
  if (go === leaving) return;
  leaving = go;
  if (overtureEl) overtureEl.classList.toggle('leaving', go);
}

function showIndexAt(p) {
  if (!showIdxEl) return;

  var on = p > 0.45 && p < 3.55;
  if (on !== showOn) { showOn = on; showIdxEl.classList.toggle('on', on); }
  if (!on) return;
  var k = clamp(Math.round(p) - 1, 0, showTicks.length - 1);
  if (k === showLit) return;
  showLit = k;
  for (var i = 0; i < showTicks.length; i++) showTicks[i].classList.toggle('on', i === k);
}

function auditFit() {
  var vh = window.innerHeight, over = false;
  for (var k = 0; k < screens.length; k++) {
    if (screens[k].scrollHeight > vh + 4) {
      over = true;
      console.warn('[stylos] room "' + (screens[k].id || k) + '" is ' +
        (screens[k].scrollHeight - vh) + ' px taller than the viewport; snapping relaxed.');
    }
  }
  if (over) settleSuspend(900);
}
window.addEventListener('scroll', onScroll, { passive: true });

var jumpT = null;
function goTo(el) {
  if (!el) return;
  settleSuspend(1200);
  el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  var idle = function () {
    clearTimeout(jumpT);
    jumpT = setTimeout(function () {
      window.removeEventListener('scroll', idle);
      auditFit();
    }, 150);
  };
  window.addEventListener('scroll', idle, { passive: true });
  idle();
}

document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href^="#"]');
  if (!a || a.classList.contains('card')) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
  var id = a.getAttribute('href').slice(1);
  if (!id) return;
  var isWork = id.slice(0, WORK_PREFIX.length).toLowerCase() === WORK_PREFIX;

  if (!isWork && roomIndex(id) < 0) return;
  e.preventDefault();
  setHash(id, 'push');
  if (sheetOpen) {
    setSheet(false);
    setTimeout(function () { applyHash('smooth'); }, REDUCED ? 0 : 260);
  } else {
    applyHash('smooth');
  }
});

function dressPortrait() {
  var fig = $('portrait');
  if (!fig || REDUCED) return;
  var im = fig.querySelector('img');
  if (!im) return;
  var cue = $('plateCue');

  var cv = document.createElement('canvas');
  var pctx = cv.getContext('2d');
  var src = null, srcW = 0, srcH = 0, built = false;

  var B = [0,32,8,40,2,34,10,42, 48,16,56,24,50,18,58,26,
           12,44,4,36,14,46,6,38, 60,28,52,20,62,30,54,22,
           3,35,11,43,1,33,9,41, 51,19,59,27,49,17,57,25,
           15,47,7,39,13,45,5,37, 63,31,55,23,61,29,53,21];

  function rgb(name, fb) {
    var v = getComputedStyle(root).getPropertyValue(name).trim() || fb;
    if (v.charAt(0) === '#') {
      if (v.length === 4) v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
      return [parseInt(v.substr(1, 2), 16), parseInt(v.substr(3, 2), 16), parseInt(v.substr(5, 2), 16)];
    }
    var m = v.match(/\d+/g);
    return m ? [+m[0], +m[1], +m[2]] : [240, 240, 240];
  }

  var PLATE_LABEL = fig.getAttribute('aria-label') || '';
  var isCtl = true;
  function setControl(on) {
    if (on === isCtl) return;
    isCtl = on;
    fig.classList.toggle('plain', !on);
    if (on) {
      fig.setAttribute('role', 'button');
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('aria-pressed', 'false');
      fig.setAttribute('aria-label', PLATE_LABEL);
    } else {
      fig.removeAttribute('role');
      fig.removeAttribute('tabindex');
      fig.removeAttribute('aria-pressed');
      fig.removeAttribute('aria-label');
    }
  }

  function draw() {
    if (!src) return true;

    if (window.innerWidth < 901) {
      if (built) { if (cv.parentNode) cv.parentNode.removeChild(cv); fig.classList.remove('dithered'); built = false; }

      stuck = false; setResolved(false);
      setControl(false);
      return true;
    }
    setControl(true);
    var r = fig.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return true;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var Wc = Math.round(r.width * dpr), Hc = Math.round(r.height * dpr);
    cv.width = Wc; cv.height = Hc;

    var cell = Math.max(2, Math.round(1.45 * dpr));
    var cols = Math.ceil(Wc / cell), rows = Math.ceil(Hc / cell);

    var sc = Math.max(Wc / srcW, Hc / srcH);
    var dw = srcW * sc, dh = srcH * sc;
    var dx = (Wc - dw) * 0.5, dy = (Hc - dh) * 0.34;

    var small = document.createElement('canvas');
    small.width = cols; small.height = rows;
    var sg = small.getContext('2d', { willReadFrequently: true });
    sg.drawImage(src, dx / cell, dy / cell, dw / cell, dh / cell);
    var d;
    try { d = sg.getImageData(0, 0, cols, rows).data; } catch (err) { return false; }

    var ground = rgb('--ground', '#092c2a');
    var bone = rgb('--bone', '#f1f6e6');
    var warm = rgb('--warm', '#e8674c');

    pctx.clearRect(0, 0, Wc, Hc);
    pctx.fillStyle = 'rgb(' + ground.join(',') + ')';
    pctx.fillRect(0, 0, Wc, Hc);

    var lum = function (c) { return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255; };
    var lit = lum(bone) < lum(ground);
    var gam = lit ? 1.06 : 0.80;

    var LV = 7;
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var o = (y * cols + x) * 4;
        if (d[o + 3] < 8) continue;

        var l = (0.2126 * d[o] + 0.7152 * d[o + 1] + 0.0722 * d[o + 2]) / 255;
        if (lit) l = 1 - l;
        l = Math.pow(l, gam);
        var q = l * LV + (B[(y & 7) * 8 + (x & 7)] + 0.5) / 64 - 0.5;
        var lev = q | 0;
        if (lev < 1) continue;
        if (lev > LV) lev = LV;
        var t = lev / LV;
        var c = (lev === LV && ((x * 7 + y * 13) % 23) === 0) ? warm : bone;
        var a = 0.30 + 0.70 * t;
        var rad = cell * (0.20 + 0.34 * t);
        pctx.globalAlpha = a;
        pctx.fillStyle = 'rgb(' + c.join(',') + ')';
        pctx.beginPath();
        pctx.arc(x * cell + cell * 0.5, y * cell + cell * 0.5, rad, 0, Math.PI * 2);
        pctx.fill();
      }
    }
    pctx.globalAlpha = 1;
    if (!built) { fig.appendChild(cv); fig.classList.add('dithered'); built = true; }
    return true;
  }

  var stuck = false;
  function setResolved(on) {
    fig.classList.toggle('resolved', on);
    fig.setAttribute('aria-pressed', String(on));
    if (cue) cue.textContent = on ? 'Dither \u2199' : 'Resolve \u2197';
  }
  fig.addEventListener('pointerenter', function (e) {
    if (e.pointerType === 'mouse' && !stuck) setResolved(true);
  });
  fig.addEventListener('pointerleave', function (e) {
    if (e.pointerType === 'mouse' && !stuck) setResolved(false);
  });
  fig.addEventListener('click', function () { stuck = !stuck; setResolved(stuck); });
  fig.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stuck = !stuck; setResolved(stuck); }
  });

  function loadProbe(retried) {
    var probe = new Image();
    probe.crossOrigin = 'anonymous';
    probe.decoding = 'async';
    probe.onload = function () {
      src = probe; srcW = probe.naturalWidth; srcH = probe.naturalHeight;
      if (!srcW || !srcH) return;
      if (!draw() && !retried) { src = null; loadProbe(true); }
    };
    probe.onerror = function () {
      if (!retried) { loadProbe(true); }

    };
    probe.src = probeUrl(im.getAttribute('src'), retried);
  }
  loadProbe(false);

  return { redraw: function () { if (src) draw(); } };
}
var Portrait = null;

function createMosaic(el) {
  var cv = el.querySelector('canvas'), mctx = cv.getContext('2d');
  var tiles = [], Wp = 0, Hp = 0, lastKey = -9, blank = true;
  var bone = '#f1f6e6', warm = '#e8674c', MDPR = 1;

  function cssVar(n) { return getComputedStyle(root).getPropertyValue(n).trim(); }
  function sm(t) { return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); }

  function build() {
    var r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    MDPR = Math.min(2, window.devicePixelRatio || 1);
    Wp = Math.max(2, Math.round(r.width * MDPR));
    Hp = Math.max(2, Math.round(r.height * MDPR));
    cv.width = Wp; cv.height = Hp;

    var unit = Math.max(16, Math.min(30, r.width / 46)) * MDPR;
    var cols = Math.ceil(Wp / unit), rows = Math.ceil(Hp / unit);
    tiles = [];
    for (var ry = 0; ry < rows; ry++) {
      for (var rx = 0; rx < cols; rx++) {
        var fy = (ry + 0.5) / rows;
        if (Math.random() > 0.10 + 0.84 * fy * fy) continue;
        var gap = unit * 0.16;
        tiles.push({
          x: rx * unit, y: ry * unit, fy: fy,
          w: (Math.random() < 0.22 ? 2 : 1) * unit - gap,
          h: (Math.random() < 0.10 ? 2 : 1) * unit - gap,

          thr: clamp((1 - fy) * 0.34 + Math.random() * 0.22, 0, 1),
          acc: Math.random() < 0.06
        });
      }
    }
    lastKey = -9;
  }

  var clear = null, CLEAR_FADE = 64;

  function clearAt(x, y) {
    if (!clear) return 1;
    var dx = Math.max(clear.x0 - x, x - clear.x1, 0);
    var dy = Math.max(clear.y0 - y, y - clear.y1, 0);
    var d = Math.max(dx, dy);
    if (d >= CLEAR_FADE) return 1;
    return 0.10 + 0.90 * sm(d / CLEAR_FADE);
  }

  function paint(frac, env, reach) {
    var ck = clear ? (Math.round(clear.y0) * 7919 + Math.round(clear.x0)) : 0;
    var key = Math.round(frac * 240) + Math.round(env * 240) * 512 + Math.round(reach * 20) * 262144 + ck * 8388608;
    if (key === lastKey) return;
    lastKey = key;
    mctx.clearRect(0, 0, Wp, Hp);
    if (env < 0.012) { blank = true; return; }
    blank = false;

    var lo = 1 - reach;
    for (var i = 0; i < tiles.length; i++) {
      var tl = tiles[i];
      var a = sm((frac - tl.thr) / 0.11) * (1 - sm((frac - tl.thr - 0.62) / 0.26));
      a *= env;
      if (reach < 0.999) a *= sm((tl.fy - lo) / 0.20);
      if (a < 0.022) continue;
      a *= clearAt((tl.x + tl.w / 2) / MDPR, (tl.y + tl.h / 2) / MDPR);
      if (a < 0.022) continue;
      mctx.globalAlpha = a * 0.9;
      mctx.fillStyle = tl.acc ? warm : bone;
      var s = 0.5 + 0.5 * a;
      mctx.fillRect(tl.x + tl.w * (1 - s) / 2, tl.y + tl.h * (1 - s) / 2, tl.w * s, tl.h * s);
    }
    mctx.globalAlpha = 1;
  }

  var SEAMS = { 3: { w: 1.00, reach: 1.00, in: 0.13, out: 0.84 },
                8: { w: 0.90, reach: 0.70, in: 0.17, out: 0.80 } };

  var SEAMS_C = { 3: { w: 0.94, reach: 0.78, in: 0.15, out: 0.82 } };

  function setClear(r) {
    if (!r) { clear = null; return; }
    var off = window.innerHeight - Hp / MDPR;
    clear = { x0: r.x0, x1: r.x1, y0: r.y0 - off, y1: r.y1 - off };
  }

  function update(p) {
    var room = Math.floor(p);
    var frac = p - room;
    var sk = (STACKED.matches ? SEAMS_C : SEAMS)[room];
    var env = 0, reach = 1;
    if (sk) {

      env = sm(frac / sk.in) * (1 - sm((frac - sk.out) / (1 - sk.out))) * sk.w;
      reach = sk.reach;
    }
    if (env < 0.012 && blank) return;
    paint(frac, env, reach);
  }

  function recolour() {
    bone = cssVar('--bone') || bone;
    warm = cssVar('--warm') || warm;
    lastKey = -9;
  }

  build(); recolour();
  return { build: build, update: update, recolour: recolour, setClear: setClear };
}

var mosaicEl = $('mosaic');
var mosaic = (mosaicEl && !REDUCED) ? createMosaic(mosaicEl) : null;

function syncPortrait() {
  var grid = document.querySelector('.studio-grid');
  if (!grid) return;
  var media = grid.querySelector('.studio-media');
  var copy = grid.querySelector('.body-w');
  if (!media || !copy) return;
  if (STACKED.matches) { media.style.removeProperty('--portrait-h'); return; }
  var h = copy.getBoundingClientRect().height;
  if (!h) { media.style.removeProperty('--portrait-h'); return; }
  var want = Math.round(clamp(h, 260, Math.min(vhRef * 0.52, 660)));
  media.style.setProperty('--portrait-h', want + 'px');

  var room = grid.closest ? grid.closest('.screen') : null;
  if (!room) return;
  var over = room.scrollHeight - vhRef;
  if (over > 1) {
    media.style.setProperty('--portrait-h', Math.max(260, want - over) + 'px');
  }
}

var LANE_REF = { w: 0.255, mid: 0.5185 }, laneKey = null;
function syncStudioLane() {
  if (!(window.ENG && ENG.KEY)) return;
  var i = screens.indexOf($('studio')), K = ENG.KEY[i];
  if (!K) return;
  if (!laneKey) laneKey = { fill: K.fill, px: K.px };
  K.fill = laneKey.fill; K.px = laneKey.px;
  var grid = document.querySelector('.studio-grid');
  if (!grid || STACKED.matches) return;
  var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').map(parseFloat);
  var W = stageBox().w;
  if (cols.length < 3 || !(cols[1] > 0) || !(W > 0)) return;
  var laneW = cols[1], laneMid = grid.getBoundingClientRect().left + cols[0] + laneW / 2;
  var k = laneW / (LANE_REF.w * W);
  K.fill = laneKey.fill * k;
  K.px = (laneMid + (laneKey.px + 0.5 - LANE_REF.mid) * W * k - W / 2) / W;
}

function splitInto(el, mode) {
  if (!el || el.dataset.split === 'done') return;
  var txt = el.textContent;
  if (!txt.trim()) return;
  var units = mode === 'char' ? txt.split('') : txt.split(/(\s+)/);
  var frag = document.createDocumentFragment(), n = 0;
  units.forEach(function (u) {
    if (!u) return;
    if (/^\s+$/.test(u)) { frag.appendChild(document.createTextNode(u)); return; }
    var box = document.createElement('span');
    box.className = 'wsplit';
    box.style.setProperty('--wd', (n * (mode === 'char' ? 46 : 78)) + 'ms');
    var i = document.createElement('i');
    i.textContent = u;
    box.appendChild(i); frag.appendChild(box);
    n++;
  });
  el.textContent = '';
  el.appendChild(frag);
  el.dataset.split = 'done';
}

function numberMoves() {
  var n = 0;
  Array.prototype.forEach.call(document.querySelectorAll('.reg-card .reg-fig'), function (el) {
    el.textContent = pad2(++n);
  });
}

var MORE_MIN = 180;
var NUMBERS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

function dressAsides() {
  screens.forEach(function (sc) {
    var asides = sc.querySelectorAll('.aside');
    if (!asides.length) return;

    var chars = 0, i;
    for (i = 0; i < asides.length; i++) chars += (asides[i].textContent || '').trim().length;
    if (chars < MORE_MIN) { sc.classList.add('told'); return; }

    var n = asides.length;
    var shut = 'More — ' + (NUMBERS[n] || n) + (n === 1 ? ' paragraph' : ' paragraphs');
    var last = asides[n - 1];
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'aside-more';
    b.setAttribute('aria-expanded', 'false');
    b.textContent = shut;
    b.addEventListener('click', function () {
      var on = !sc.classList.contains('told');
      sc.classList.toggle('told', on);
      b.setAttribute('aria-expanded', String(on));
      b.textContent = on ? 'Less' : shut;
      measure();
      onScroll();

      syncPortrait();
      if (Portrait) Portrait.redraw();
    });
    last.parentNode.insertBefore(b, last.nextSibling);
  });
}

function dressReveals() {

  splitInto($('oMark'), 'char');

  Array.prototype.forEach.call(document.querySelectorAll('.h2.rv-wipe, .reg-card h3.rv-wipe'), function (h) {
    h.classList.remove('rv-wipe');
    splitInto(h, 'word');
  });

  Array.prototype.forEach.call(document.querySelectorAll('.cap-rule.rv'), function (e) {
    e.classList.remove('rv');
    e.classList.add('rv-cut');
  });
}

var sheetEl = $('sheet'), burger = $('burger'), sheetOpen = false, sheetFocus = null;

function setSheet(on) {
  if (on === sheetOpen) return;
  sheetOpen = on;
  if (on) {
    sheetFocus = document.activeElement;
    sheetEl.removeAttribute('inert');
    sheetEl.classList.add('open');
    root.classList.add('locked', 'sheet-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    var first = sheetEl.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  } else {
    sheetEl.classList.remove('open');
    sheetEl.setAttribute('inert', '');
    root.classList.remove('locked', 'sheet-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    if (sheetFocus && sheetFocus.focus) sheetFocus.focus({ preventScroll: true });
  }
}

if (burger && sheetEl) {
  burger.addEventListener('click', function () { setSheet(!sheetOpen); });

  var sheetX = $('sheetClose');
  if (sheetX) sheetX.addEventListener('click', function () { setSheet(false); });
  sheetEl.addEventListener('click', function (e) {
    if (e.target === sheetEl) setSheet(false);
  });
  document.addEventListener('keydown', function (e) {
    if (sheetOpen && e.key === 'Escape') { e.preventDefault(); setSheet(false); }
  });

  window.addEventListener('resize', function () {
    if (sheetOpen && window.innerWidth > 900) setSheet(false);
  }, { passive: true });
}

$('toTop').addEventListener('click', function () { goTo(screens[0]); });

function copyText(s) {
  function legacy() {
    var ta = document.createElement('textarea'), ok = false;
    ta.value = s; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    try { ok = document.execCommand('copy'); } catch (e) {}
    ta.remove();
    return ok;
  }
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(s).then(function () { return true; }, function () { return legacy(); });
  }
  return Promise.resolve(legacy());
}

function initCopyMail() {
  var b = $('emailCopy');
  if (!b) return;
  var label = b.querySelector('.email-copy-t'), timer = null;
  b.addEventListener('click', function () {
    var ct = COPY.site.contact || {}, addr = String(ct.email || '').trim();
    if (!addr) return;
    copyText(addr).then(function (ok) {
      if (!ok) {
        var mail = document.querySelector('.contact .email'), sel = window.getSelection && window.getSelection();
        if (mail && sel) { var rg = document.createRange(); rg.selectNodeContents(mail); sel.removeAllRanges(); sel.addRange(rg); }
      }
      b.classList.add('done');
      label.textContent = ok ? 'Copied' : 'Selected';
      clearTimeout(timer);
      timer = setTimeout(function () { b.classList.remove('done'); label.textContent = 'Copy'; }, 2200);
    });
  });
}

var THEMES = { blue: '#07264c', green: '#092c2a', wax: '#ece6d6' };

var INK_NAMES = { blue: 'Blue', green: 'Green', wax: 'Wax' };

var ICONS = { blue: './assets/icons/favicon-blue.svg', green: './assets/icons/favicon.svg', wax: './assets/icons/favicon-wax.svg' };
var INK_MS = 720;

function setTheme(k) {
  if (!THEMES[k]) return;
  root.classList.remove('t-green', 't-wax');
  if (k !== 'blue') root.classList.add('t-' + k);
  syncInk(k);
  if (window.FIGURE) window.FIGURE.setTheme(k);
  if (mosaic) mosaic.recolour();
  if (Portrait) Portrait.redraw();
  var m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', THEMES[k]);
  var ic = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
  if (ic && ICONS[k] && ic.getAttribute('href') !== ICONS[k]) ic.setAttribute('href', ICONS[k]);

  try { localStorage.setItem('stylos-ink', k); } catch (err) {}
}

function inkReveal(k, from) {
  if (!THEMES[k]) return;
  if (k === currentTheme() || REDUCED || !VT || document.visibilityState !== 'visible') { setTheme(k); return; }
  var r = from && from.getBoundingClientRect ? from.getBoundingClientRect() : null;
  var W = window.innerWidth, H = window.innerHeight;
  var x = (r && r.width) ? r.left + r.width / 2 : W / 2;
  var y = (r && r.height) ? r.top + r.height / 2 : H / 2;
  var far = Math.ceil(Math.hypot(Math.max(x, W - x), Math.max(y, H - y)));
  root.classList.add('ink-vt');
  var t = document.startViewTransition(function () { setTheme(k); });
  t.ready.then(function () {
    root.animate(
      { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + far + 'px at ' + x + 'px ' + y + 'px)'] },
      { duration: INK_MS, easing: 'cubic-bezier(.45,.05,.16,1)', pseudoElement: '::view-transition-new(root)' });
  }, function () {});
  t.finished.then(done, done);
  function done() { root.classList.remove('ink-vt'); }
}
function currentTheme() {
  return root.classList.contains('t-wax') ? 'wax'
       : root.classList.contains('t-green') ? 'green' : 'blue';
}

function syncInk(k) {
  Array.prototype.forEach.call(document.querySelectorAll('[data-theme]'), function (o) {
    if (o.hasAttribute('role')) o.setAttribute('aria-checked', String(o.dataset.theme === k));
  });

  var now = $('inkNow');
  if (now) now.textContent = INK_NAMES[k] || k;
}

var inkEl = $('ink'), inkBtn = $('inkBtn'), inkMenu = $('inkMenu'), inkOpen = false;

function setInkMenu(on) {
  if (!inkBtn || !inkMenu || on === inkOpen) return;
  inkOpen = on;
  inkBtn.setAttribute('aria-expanded', String(on));
  if (on) {
    inkMenu.hidden = false;

    requestAnimationFrame(function () { inkMenu.classList.add('open'); });
    var cur = inkMenu.querySelector('[aria-checked="true"]') || inkMenu.querySelector('.ink-opt');
    if (cur) cur.focus({ preventScroll: true });
  } else {
    inkMenu.classList.remove('open');
    var hide = function () { if (!inkOpen) inkMenu.hidden = true; };
    if (REDUCED) hide(); else setTimeout(hide, 220);
  }
}

if (inkBtn && inkMenu) {
  inkBtn.addEventListener('click', function () { setInkMenu(!inkOpen); });

  inkMenu.addEventListener('keydown', function (e) {
    var opts = Array.prototype.slice.call(inkMenu.querySelectorAll('.ink-opt'));
    var i = opts.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var n = opts.length;
      var j = i < 0 ? 0 : (i + (e.key === 'ArrowDown' ? 1 : n - 1)) % n;
      opts[j].focus();
    } else if (e.key === 'Home') { e.preventDefault(); opts[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); opts[opts.length - 1].focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); setInkMenu(false); inkBtn.focus(); }
    else if (e.key === 'Tab') { setInkMenu(false); }
  });
  inkBtn.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setInkMenu(true); }
    else if (e.key === 'Escape' && inkOpen) { e.preventDefault(); setInkMenu(false); }
  });
  document.addEventListener('pointerdown', function (e) {
    if (inkOpen && inkEl && !inkEl.contains(e.target)) setInkMenu(false);
  }, true);

  window.addEventListener('scroll', function () { if (inkOpen) setInkMenu(false); }, { passive: true });
}

document.addEventListener('click', function (e) {
  var b = e.target.closest ? e.target.closest('[data-theme]') : null;
  if (b && b.dataset.theme && THEMES[b.dataset.theme]) {
    inkReveal(b.dataset.theme, b.querySelector('.ink-chip') || b);
    if (inkOpen) { setInkMenu(false); if (inkBtn) inkBtn.focus({ preventScroll: true }); }
    return;
  }

  if (e.target.closest && e.target.closest('.ink-nudge')) {
    var row = $('inkTry');
    if (row) {
      row.classList.remove('asked');
      void row.offsetWidth;
      row.classList.add('asked');
      setTimeout(function () { row.classList.remove('asked'); }, 1600);
      var cur = row.querySelector('[aria-checked="true"]') || row.querySelector('.ink-seg-b');
      if (cur) cur.focus({ preventScroll: true });
    } else if (inkBtn) {
      setInkMenu(true);
    }
  }
});

if (!REDUCED && window.matchMedia('(pointer: fine)').matches) {
  var hovIdle = null;
  window.addEventListener('pointermove', function (e) {
    if (!window.FIGURE) return;
    window.FIGURE.nudge((e.clientX / window.innerWidth - 0.5) * 0.10,
                        (0.5 - e.clientY / window.innerHeight) * 0.055);
    window.FIGURE.setHover(e.clientX, e.clientY, true);
    clearTimeout(hovIdle);
    hovIdle = setTimeout(function () { window.FIGURE.setHover(null, null, false); }, 2600);
  }, { passive: true });
  window.addEventListener('pointerleave', function () {
    if (window.FIGURE) window.FIGURE.setHover(null, null, false);
  }, { passive: true });
  document.addEventListener('pointerdown', function (e) {
    if (window.FIGURE) window.FIGURE.setHover(e.clientX, e.clientY, true);
  }, { passive: true });
}

var rzT = null, rzW = window.innerWidth, rzH = window.innerHeight, rzFull = false;
var CHROME_BAND = 180;

window.addEventListener('resize', function () {
  var w = window.innerWidth, h = window.innerHeight;
  if (!rzFull && w === rzW && Math.abs(h - rzH) <= CHROME_BAND) {
    rzH = h;
    clearTimeout(rzT);
    rzT = setTimeout(function () { measure(); onScroll(); }, 160);
    return;
  }
  rzW = w; rzH = h; rzFull = true;
  clearTimeout(rzT);
  rzT = setTimeout(function () {
    rzFull = false;

    var mid = root.classList.contains('intro-locked');
    if (mid && window.FIGURE && window.FIGURE.resume) window.FIGURE.resume();

    syncLanding();
    syncStudioLane();
    registerStylusSoon(0, mid ? function () {
      if (window.FIGURE && window.FIGURE.pause) window.FIGURE.pause();
    } : null);
    measure(); buildHit(); auditFit();
    if (mosaic) mosaic.build();
    syncPortrait();
    if (Portrait) Portrait.redraw();
    if (window.FIGURE && window.FIGURE.ready) window.FIGURE.resize();
    onScroll();
    setWorks(wIdx, 'resize');

    watchMid();
    syncNavRule(true);
  }, 200);
});

var consEl = $('cons'), consRail = $('consRail'), consInEl = $('consPanelIn'), consSrcEl = $('consSrc');
var consSel = { kind: 'site', id: 'meta' };
var consBase = null;
var consDirty = false;
var consFB = null;
var consLastFocus = null;

var BLOCK_CLASSES = ['', 'aside', 'hand-over', 'hand-over aside'];

var PROSE_HINT = 'Links: paste an address as it is (https://…), or select words and press Link. Bold: select and press Bold.';

var FIELD_META = {
  slug:     { mono: true,  hint: 'The public address. Changing it breaks any link already sent.' },
  img:      { picker: true },
  href:     { mono: true },
  cls:      { choose: BLOCK_CLASSES },
  live:     { mono: true, label: 'Live site',
              hint: 'The address of the live website, with https://. When it is filled in, the case study shows “Visit the live site”. Leave it empty while a site is not public.' },
  quote:    { prose: true, hint: 'A sentence from the client, in their words and with their agreement. Leave it empty and nothing is shown.' },
  quoteBy:  { label: 'Quote by', hint: 'How the person is named under the quote, e.g. “Principal investigator, University of Vienna”.' },
  body:     { prose: true },
  lede:     { prose: true },
  t:        { prose: true },
  p:        { prose: true },
  desc:     { prose: true },
  longText: { prose: true },
  note:     { prose: true }
};

var FIELD_LOCKED = { id: 1, order: 1, __k: 1 };

var ARRAY_TEMPLATES = {
  sections: function () { return { h: '', p: [''] }; },
  steps:    function () { return { n: '', h: '', p: '' }; },
  creds:    function () { return { b: '', v: '' }; },
  columns:  function () { return { h: '', lines: [''] }; },
  links:    function () { return { label: '', href: '' }; }
};

function consClone(v) {
  if (Array.isArray(v)) return v.map(consClone);
  if (v && typeof v === 'object') {
    var o = {}, k;
    for (k in v) if (Object.prototype.hasOwnProperty.call(v, k)) o[k] = consClone(v[k]);
    return o;
  }
  return v;
}

function consBlankLike(x) {
  if (Array.isArray(x)) return [];
  if (x && typeof x === 'object') {
    var o = {}, k;
    for (k in x) if (Object.prototype.hasOwnProperty.call(x, k)) o[k] = consBlankLike(x[k]);
    return o;
  }
  return (typeof x === 'number') ? 0 : '';
}

function consMark(d) {
  consDirty = !!d;
  var live = (typeof copyLive !== 'undefined' && copyLive) ? 1 : 0;
  consSrcEl.dataset.state = consDirty ? 'dirty' : (live ? 'live' : 'seed');
  consSrcEl.textContent = consDirty
    ? 'Edited · not applied'
    : (live ? 'Live · Firestore' : 'Seed · in this file');
}

function consRoot(kind) { return kind === 'works' ? P : (kind === 'rooms' ? COPY.rooms : COPY.site); }

function consRailBuild() {
  consRail.innerHTML = '';
  consRailGroup('Site', 'site', Object.keys(COPY.site));
  consRailGroup('Rooms', 'rooms', Object.keys(COPY.rooms));

  var g = document.createElement('div');
  g.className = 'cons-group';
  g.innerHTML = '<span>Works</span>';
  var add = document.createElement('button');
  add.type = 'button'; add.textContent = '+ Add';
  add.addEventListener('click', consAddWork);
  g.appendChild(add);
  consRail.appendChild(g);

  P.forEach(function (w, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cons-item' + (consSel.kind === 'works' && consSel.id === i ? ' on' : '');

    b.innerHTML = '<span></span><span class="id"></span>';
    b.firstChild.textContent = 'Work ' + (i + 1);
    b.lastChild.textContent = (w.title || '—') + '  ·  #work/' + (w.slug || '?');
    b.addEventListener('click', function () { consSelect('works', i); });
    consRail.appendChild(b);
  });
}
function consRailGroup(label, kind, ids) {
  var g = document.createElement('div');
  g.className = 'cons-group';
  g.innerHTML = '<span></span>';
  g.firstChild.textContent = label;
  consRail.appendChild(g);
  ids.forEach(function (id) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cons-item' + (consSel.kind === kind && consSel.id === id ? ' on' : '');
    b.innerHTML = '<span></span><span class="id"></span>';
    b.firstChild.textContent = consTitleOf(kind, id);
    b.lastChild.textContent = kind + '/' + id;
    b.addEventListener('click', function () { consSelect(kind, id); });
    consRail.appendChild(b);
  });
}
function consTitleOf(kind, id) {
  var d = consRoot(kind)[id];
  if (kind === 'works') return d && d.title ? d.title : 'Untitled';
  if (d && d.heading) return d.heading;
  if (d && d.eyebrow) return d.eyebrow;
  return id;
}

function consSelect(kind, id) {
  consSel = { kind: kind, id: id };
  consRailBuild();
  consRender();
  consInEl.parentNode.scrollTop = 0;
}

function consRender() {
  var host = consInEl;
  host.innerHTML = '';
  var doc = consRoot(consSel.kind)[consSel.id];
  if (!doc) { host.appendChild(consEl_('p', 'cons-note', 'Nothing selected.')); return; }

  var h = consEl_('h3', 'cons-h', consTitleOf(consSel.kind, consSel.id));
  var sub = consEl_('div', 'cons-sub',
    consSel.kind === 'works'
      ? 'works / work-' + (consSel.id + 1) + '  ·  document ' + (consSel.id + 1) + ' of ' + P.length
      : consSel.kind + ' / ' + consSel.id);
  host.appendChild(h); host.appendChild(sub);

  if (consSel.kind === 'works') consWorkTools(host);
  if (consSel.kind === 'rooms') {
    host.appendChild(consEl_('p', 'cons-note',
      'Room copy only. Which rooms exist, and the order they are read in, is the deck — a change to index.html, not a document.'));
  }
  if (consSel.kind === 'site' && consSel.id === 'meta') {
    host.appendChild(consEl_('p', 'cons-note',
      'The browser tab’s title and the description search engines read. Link previews on Facebook, WhatsApp and LinkedIn do not read this document: they read the og: tags in index.html, which change only when the site is deployed.'));
  }
  if (consSel.kind !== 'site') host.appendChild(consEl_('p', 'cons-note', PROSE_HINT));

  Object.keys(doc).forEach(function (k) {
    consField(host, doc, k, k);
  });
}

function consEl_(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function consField(host, obj, key, label) {
  var v = obj[key];
  if (FIELD_LOCKED[key]) return;
  if (Array.isArray(v)) return consArray(host, obj, key, label);
  if (v && typeof v === 'object') return consObject(host, v, label);
  if ((FIELD_META[key] || {}).picker) return consImage(host, obj, key);
  return consScalar(host, obj, key, label);
}

var consUid = 0;

function consScalar(host, obj, key, label, ctx) {
  var meta = (typeof key === 'string' && FIELD_META[key]) || (ctx && FIELD_META[ctx]) || {};
  var wrap = consEl_('div', 'cons-field');
  var lab = consEl_('label', 'cons-lab', meta.label || consLabel(label));
  var fid = 'cf-' + (++consUid);
  lab.setAttribute('for', fid);
  if (meta.prose) {
    var head = consEl_('div', 'cons-lab-row');
    head.appendChild(lab);
    var tools = consEl_('span', 'cons-tools');
    tools.appendChild(consTool('Link', 'Make the selected words a link, or insert an address', function () { consWrap(node, 'link'); }));
    tools.appendChild(consTool('Bold', 'Make the selected words bold', function () { consWrap(node, 'bold'); }));
    head.appendChild(tools);
    wrap.appendChild(head);
  } else {
    wrap.appendChild(lab);
  }

  var v = obj[key] == null ? '' : String(obj[key]);
  var node;
  if (meta.choose) {
    node = document.createElement('select');
    node.className = 'cons-sel';
    meta.choose.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c; o.textContent = c === '' ? '(none)' : c;
      if (c === v) o.selected = true;
      node.appendChild(o);
    });
  } else if (v.length > 90 || /\n/.test(v)) {
    node = document.createElement('textarea');
    node.className = 'cons-ta';
    node.rows = Math.min(14, Math.max(3, Math.ceil(v.length / 78)));
    node.value = v;
  } else {
    node = document.createElement('input');
    node.type = 'text';
    node.className = 'cons-in' + (meta.mono ? ' cons-code' : '');
    node.value = v;
  }
  node.id = fid;
  if (meta.prose) wrap.appendChild(node); else lab.appendChild(node);
  node.addEventListener('input', function () {
    obj[key] = node.value;
    consMark(true);
    if (key === 'slug' || key === 'title') { consSlugLine(wrap, obj); consRailBuild(); }
  });
  if (meta.hint) wrap.appendChild(consEl_('span', 'cons-hint', meta.hint));
  if (key === 'slug') consSlugLine(wrap, obj);
  host.appendChild(wrap);
  return wrap;
}

function consSlugLine(wrap, obj) {
  var old = wrap.querySelector('.cons-addr'); if (old) old.remove();
  var oldW = wrap.querySelector('.cons-warn'); if (oldW) oldW.remove();
  var s = slugify(obj.slug || obj.title || '');
  var line = consEl_('div', 'cons-addr', 'Address  ·  ');
  var b = consEl_('b', null, '#work/' + (s || '?'));
  line.appendChild(b);
  wrap.appendChild(line);

  var was = null, i;
  for (i = 0; i < consBase.works.length; i++) {
    if (consBase.works[i] && consBase.works[i].__k === obj.__k) { was = consBase.works[i]; break; }
  }
  if (was) {
    var wasSlug = slugify(was.slug || was.title || '');
    if (wasSlug && s !== wasSlug) {
      wrap.appendChild(consEl_('div', 'cons-warn',
        'This was #work/' + wasSlug + '. Any link already sent to that address will stop resolving to this project.'));
    }
  }
}

function consLabel(k) {
  return String(k)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, function (c) { return c.toUpperCase(); });
}

function consObject(host, obj, label) {
  var wrap = consEl_('div', 'cons-field');
  if (label) wrap.appendChild(consEl_('span', 'cons-lab', consLabel(label)));
  var nest = consEl_('div', 'cons-nest');
  Object.keys(obj).forEach(function (k) { consField(nest, obj, k, k); });
  wrap.appendChild(nest);
  host.appendChild(wrap);
}

function consArray(host, obj, key, label) {
  var arr = obj[key];
  var wrap = consEl_('div', 'cons-field');
  wrap.appendChild(consEl_('span', 'cons-lab', consLabel(label) + '  (' + arr.length + ')'));

  var list = consEl_('div', null);
  wrap.appendChild(list);

  function redraw() {
    list.innerHTML = '';
    arr.forEach(function (item, i) {
      var row = consEl_('div', 'cons-row');
      var bar = consEl_('div', 'cons-row-bar');
      bar.appendChild(consEl_('span', 'cons-n', String(i + 1).padStart(2, '0')));
      bar.appendChild(consMini('↑', 'Move up', function () {
        if (i === 0) return; var t = arr[i - 1]; arr[i - 1] = arr[i]; arr[i] = t;
        consMark(true); redraw();
      }));
      bar.appendChild(consMini('↓', 'Move down', function () {
        if (i === arr.length - 1) return; var t = arr[i + 1]; arr[i + 1] = arr[i]; arr[i] = t;
        consMark(true); redraw();
      }));
      bar.appendChild(consMini('✕', 'Remove', function () {
        arr.splice(i, 1); consMark(true); redraw();
        wrap.firstChild.textContent = consLabel(label) + '  (' + arr.length + ')';
      }, 'del'));
      row.appendChild(bar);

      if (item && typeof item === 'object' && !Array.isArray(item)) {
        Object.keys(item).forEach(function (k) { consField(row, item, k, k); });
      } else if (Array.isArray(item)) {
        consArray(row, arr, i, 'items');
      } else {
        consScalar(row, arr, i, '', key);
      }
      list.appendChild(row);
    });
  }
  redraw();

  var add = consEl_('button', 'cons-add', '+ Add ' + consLabel(label).toLowerCase().replace(/s$/, ''));
  add.type = 'button';
  add.addEventListener('click', function () {
    var make = ARRAY_TEMPLATES[key];
    arr.push(arr.length ? consBlankLike(arr[0]) : (make ? make() : ''));
    consMark(true); redraw();
    wrap.firstChild.textContent = consLabel(label) + '  (' + arr.length + ')';
  });
  wrap.appendChild(add);
  host.appendChild(wrap);
}

function consMini(glyph, title, fn, extra) {
  var b = consEl_('button', 'cons-mini' + (extra ? ' ' + extra : ''), glyph);
  b.type = 'button'; b.title = title; b.setAttribute('aria-label', title);
  b.addEventListener('click', fn);
  return b;
}

function consTool(text, title, fn) {
  var b = consEl_('button', 'cons-tool', text);
  b.type = 'button'; b.title = title;
  b.addEventListener('mousedown', function (e) { e.preventDefault(); });
  b.addEventListener('click', fn);
  return b;
}

function consWrap(node, kind) {
  var v = node.value, s = node.selectionStart || 0, e = node.selectionEnd || 0;
  var sel = v.slice(s, e), a = s, z = e, ins;
  if (kind === 'bold') {
    if (!sel.trim()) { window.alert('Select the words to make bold first.'); node.focus(); return; }
    ins = '{b|' + sel + '}';
  } else {
    var bare = sel.replace(/^\{b\|/, '').replace(/\}$/, '');
    var guess = /^(https?:\/\/|www\.|mailto:)/i.test(sel.trim()) ? sel.trim() : 'https://';
    var url = window.prompt(sel.trim() ? 'Link “' + bare + '” to this address:' : 'Address to insert:', guess);
    if (url == null) { node.focus(); return; }
    url = url.trim();
    if (!url || url === 'https://') { node.focus(); return; }
    if (!/^(https?:\/\/|mailto:|#|\/|\.\.?\/)/i.test(url)) {
      url = /@/.test(url) && !/\//.test(url) ? 'mailto:' + url : 'https://' + url.replace(/^\/+/, '');
    }
    var before = v.slice(Math.max(0, s - 3), s), after = v.charAt(e);
    if (before === '{b|' && (after === '}' || after === '|')) {
      a = s - 3;
      z = after === '}' ? e + 1 : v.indexOf('}', e) + 1;
      if (z <= e) z = e;
      ins = '{b|' + sel + '|' + url + '}';
    } else if (/^\{b\|[^{}|]*\}$/.test(sel)) {
      ins = '{b|' + bare + '|' + url + '}';
    } else if (!sel.trim() || sel.trim() === url) {
      ins = url;
    } else {
      ins = '{link|' + sel + '|' + url + '}';
    }
  }
  node.value = v.slice(0, a) + ins + v.slice(z);
  node.dispatchEvent(new Event('input', { bubbles: true }));
  node.focus();
  var c = a + ins.length;
  try { node.setSelectionRange(c, c); } catch (err) {}
}

function consImage(host, obj, key) {
  var wrap = consEl_('div', 'cons-field');
  var fid = 'cf-' + (++consUid);
  var lab = consEl_('label', 'cons-lab', 'Image');
  lab.setAttribute('for', fid);
  wrap.appendChild(lab);

  var grid = consEl_('div', 'cons-pics');
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-label', 'Images on the site');
  var input = document.createElement('input');
  input.type = 'text'; input.id = fid; input.className = 'cons-in cons-code';
  input.value = obj[key] == null ? '' : String(obj[key]);
  input.placeholder = 'or paste the address of an image';

  var names = Object.keys(IMAGES).sort(function (a, b) {
    return String(IMAGES[b].added || '').localeCompare(String(IMAGES[a].added || ''));
  });
  var newest = names.length ? String(IMAGES[names[0]].added || '') : '';
  var tiles = [];

  function current() {
    var li = localImage(obj[key]);
    if (li) return li.name;
    return String(obj[key] || '').trim() ? '' : '-none-';
  }
  function mark() {
    var c = current();
    tiles.forEach(function (t) { t.setAttribute('aria-pressed', String(t.dataset.name === c)); });
  }
  function tile(name) {
    var b = consEl_('button', 'cons-pic');
    b.type = 'button';
    b.dataset.name = name;
    if (name === '-none-') {
      b.appendChild(consEl_('span', 'cons-pic-none', 'Shown on request'));
      b.appendChild(consEl_('span', 'cons-pic-t', 'No image'));
    } else {
      var e = IMAGES[name], im = document.createElement('img');
      im.src = imagePath(name, e.widths[0], 'webp'); im.alt = ''; im.loading = 'lazy';
      b.appendChild(im);
      b.appendChild(consEl_('span', 'cons-pic-t', name + (newest && e.added === newest && names.length > 1 ? '  ·  new' : '')));
      b.title = name + '  ·  ' + e.w + ' × ' + e.h;
    }
    b.addEventListener('click', function () {
      obj[key] = name === '-none-' ? '' : imagePath(name, IMAGES[name].fallback, 'webp');
      input.value = obj[key];
      consMark(true);
      mark();
    });
    tiles.push(b);
    grid.appendChild(b);
  }
  names.forEach(tile);
  tile('-none-');
  mark();

  input.addEventListener('input', function () { obj[key] = input.value; consMark(true); mark(); });
  wrap.appendChild(grid);
  wrap.appendChild(input);
  wrap.appendChild(consEl_('span', 'cons-hint',
    'Pick one of the images on the site, or paste the address of one. The picker lists the images in assets/images/projects: '
    + 'to add a new one, run tools/add-image.py (how is at the top of that file) and deploy, or ask Claude to add it.'));
  host.appendChild(wrap);
  return wrap;
}

function consWorkTools(host) {
  var i = consSel.id, w = P[i];
  var bar = consEl_('div', 'cons-row-bar');
  bar.appendChild(consMini('↑', 'Move earlier in the row', function () {
    if (i === 0) return;
    var t = P[i - 1]; P[i - 1] = P[i]; P[i] = t;
    consMark(true); consSelect('works', i - 1);
  }));
  bar.appendChild(consMini('↓', 'Move later in the row', function () {
    if (i === P.length - 1) return;
    var t = P[i + 1]; P[i + 1] = P[i]; P[i] = t;
    consMark(true); consSelect('works', i + 1);
  }));
  bar.appendChild(consMini('✕', 'Remove this project', function () {

    if (!window.confirm('Remove "' + (w.title || 'Untitled') + '" from the works row?\n\n'
      + 'Its address #work/' + (w.slug || '?') + ' will stop resolving. '
      + 'Revert puts it back until the panel is closed.')) return;
    P.splice(i, 1);
    consMark(true);
    consSelect(P.length ? 'works' : 'site', P.length ? Math.max(0, i - 1) : 'meta');
  }, 'del'));
  host.appendChild(bar);

  if (!w.title || /^untitled/i.test(w.title)) {
    host.appendChild(consEl_('p', 'cons-warn',
      'This project has no title. It is in the works row the moment you press Apply, and the last plate in a row is the one a prospective client clicks — fill it in or remove it.'));
  }
}

function consAddWork() {

  var w = P.length ? consBlankLike(P[0]) : normWork({});
  delete w.id; delete w.order;
  w.title = 'Untitled project';
  w.roman = consRoman(P.length + 1);
  w.__k = 'new-' + Date.now();
  P.push(w);
  consMark(true);
  consSelect('works', P.length - 1);
}
function consRoman(n) {
  var t = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']], out = '';
  t.forEach(function (p) { while (n >= p[0]) { out += p[1]; n -= p[0]; } });
  return out;
}

function consApply() {
  COPY.works = P;

  Array.prototype.forEach.call(document.querySelectorAll('[data-split="done"]'), function (e) {
    delete e.dataset.split;
  });
  Array.prototype.forEach.call(document.querySelectorAll('.aside-more'), function (e) { e.remove(); });
  Array.prototype.forEach.call(document.querySelectorAll('.screen.told'), function (e) { e.classList.remove('told'); });

  renderCopy(COPY);
  buildCards();

  Array.prototype.forEach.call(document.querySelectorAll('.h2, .reg-card h3'), function (h) {
    splitInto(h, 'word');
  });
  dressAsides();
  numberMoves();

  syncPortrait();
  if (Portrait) Portrait.redraw();

  syncInk(currentTheme());

  Array.prototype.forEach.call(document.querySelectorAll('.screen.live .rv, .screen.live .rv-cut, .screen.live .wsplit'), function (e) {
    e.classList.add('in');
  });

  measure();
  buildHit();
  setWorks(Math.min(wIdx, Math.max(0, P.length - 1)), 'console');
  onScroll();
  syncNavRule(true);
  auditFit();
  consMark(false);
  consRailBuild();
  consRender();
}

function consExport() {
  var seed = window.STYLOS.seed();
  var payload = {
    generated: new Date().toISOString(),
    note: 'Stylos copy tree. Keys are Firestore document ids. See SECURITY-AUDIT.md.',
    collections: seed
  };
  consDownload('stylos-copy-' + consStamp() + '.json', JSON.stringify(payload, null, 2), 'application/json');
  consDownload('stylos-COPY-block-' + consStamp() + '.js',
    '' + 'var COPY = ' + JSON.stringify({ rooms: seed.rooms, site: seed.site, works: null }, null, 2) + ';\n\n'
    + 'var P = ' + JSON.stringify(P, null, 2) + ';\n', 'text/javascript');
}
function consStamp() { return new Date().toISOString().slice(0, 10); }
function consDownload(name, text, type) {
  var b = new Blob([text], { type: type + ';charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

function consPublish() {

  var cfg = window.__FB && window.__FB.config;
  if (!cfg || !window.__FB.ready) {
    consSay('No Firebase project is configured yet, so there is nothing to publish to. '
      + 'Use Export — it produces the documents to paste in — and see SECURITY-AUDIT.md. '
      + 'Once FB_CONFIG is filled in, this button signs in and writes.');
    return;
  }
  if (!consFB || !consFB.user) { consSignIn(); return; }
  consWrite();
}

function consSay(msg) {
  var p = consInEl.querySelector('.cons-say');
  if (!p) {
    p = consEl_('p', 'cons-note cons-say');
    consInEl.insertBefore(p, consInEl.firstChild);
  }
  p.textContent = msg;
  p.scrollIntoView({ block: 'nearest' });
}

function consSignIn() {
  var host = consInEl;
  var box = consEl_('div', 'cons-field');
  box.appendChild(consEl_('span', 'cons-lab', 'Sign in to publish'));
  var row = consEl_('div', 'cons-auth');
  var em = document.createElement('input'); em.type = 'email'; em.className = 'cons-in cons-code'; em.placeholder = 'email'; em.autocomplete = 'username';
  var pw = document.createElement('input'); pw.type = 'password'; pw.className = 'cons-in cons-code'; pw.placeholder = 'password'; pw.autocomplete = 'current-password';
  var go = consEl_('button', 'cons-btn primary', 'Sign in'); go.type = 'button';
  row.appendChild(em); row.appendChild(pw); row.appendChild(go);
  box.appendChild(row);
  box.appendChild(consEl_('span', 'cons-hint',
    'The account is one you create by hand in the Firebase console under Authentication → Email/Password. '
    + 'Nothing about it is stored in this file.'));
  host.insertBefore(box, host.firstChild);
  em.focus();

  go.addEventListener('click', function () {
    go.disabled = true; go.textContent = 'Signing in…';
    consLoadFB().then(function (m) {
      return m.signInWithEmailAndPassword(m.auth, em.value, pw.value).then(function (cred) {
        consFB.user = cred.user;
        box.remove();
        consSay('Signed in as ' + cred.user.email + '. Press Publish again to write.');
      });
    }).catch(function (err) {
      go.disabled = false; go.textContent = 'Sign in';
      consSay('Sign-in failed: ' + (err && err.message ? err.message : String(err)));
    });
  });
}

function consLoadFB() {
  if (consFB && consFB.ready) return Promise.resolve(consFB);
  var F = window.__FB;
  return Promise.all([
    import(F.sdk + 'firebase-app.js'),
    import(F.sdk + 'firebase-auth.js'),
    import(F.sdk + 'firebase-firestore.js')
  ]).then(function (mods) {
    var app = mods[0].initializeApp(F.config, 'stylos-console');
    consFB = {
      ready: true, user: null,
      auth: mods[1].getAuth(app),
      signInWithEmailAndPassword: mods[1].signInWithEmailAndPassword,
      db: mods[2].getFirestore(app),
      setDoc: mods[2].setDoc, doc: mods[2].doc,
      deleteDoc: mods[2].deleteDoc, getDocs: mods[2].getDocs, collection: mods[2].collection
    };
    return consFB;
  });
}

function consWrite() {
  consSay('Publishing…');
  var seed = window.STYLOS.seed();
  consLoadFB().then(function (m) {
    var jobs = [], k;
    for (k in seed.rooms) jobs.push(m.setDoc(m.doc(m.db, 'rooms', k), seed.rooms[k]));
    for (k in seed.site)  jobs.push(m.setDoc(m.doc(m.db, 'site', k), seed.site[k]));
    for (k in seed.works) jobs.push(m.setDoc(m.doc(m.db, 'works', k), seed.works[k]));
    return m.getDocs(m.collection(m.db, 'works')).then(function (snap) {
      snap.forEach(function (d) {
        if (!Object.prototype.hasOwnProperty.call(seed.works, d.id)) {
          jobs.push(m.deleteDoc(m.doc(m.db, 'works', d.id)));
        }
      });
      return Promise.all(jobs);
    });
  }).then(function () {
    consSay('Published. ' + Object.keys(seed.rooms).length + ' rooms, '
      + Object.keys(seed.site).length + ' site documents, ' + Object.keys(seed.works).length + ' works.');
    consMark(false);
  }).catch(function (err) {
    consSay('Publish failed: ' + (err && err.message ? err.message : String(err))
      + '  —  if this says "permission-denied", the security rule is still the console default. See SECURITY-AUDIT.md.');
  });
}

function consSnapshot() {

  P.forEach(function (w, i) { if (!w.__k) w.__k = 'k' + i + '-' + (w.slug || w.title || i); });
  return { rooms: consClone(COPY.rooms), site: consClone(COPY.site), works: consClone(P) };
}
function consRevert() {
  if (!consBase) return;
  COPY.rooms = consClone(consBase.rooms);
  COPY.site = consClone(consBase.site);
  P.length = 0;
  Array.prototype.push.apply(P, consClone(consBase.works));
  consApply();
}

function openConsole() {
  if (consEl.classList.contains('open')) return;
  consLastFocus = document.activeElement;
  consBase = consSnapshot();
  consEl.removeAttribute('inert');
  consEl.classList.add('open');
  root.classList.add('cons-open');

  if (window.FIGURE && window.FIGURE.pause) window.FIGURE.pause();
  consMark(false);
  consRailBuild();
  consRender();
  $('consClose').focus();
}
function closeConsole() {
  if (!consEl.classList.contains('open')) return;
  consEl.classList.remove('open');
  consEl.setAttribute('inert', '');
  root.classList.remove('cons-open');
  if (window.FIGURE && window.FIGURE.resume) window.FIGURE.resume();
  if (consLastFocus && consLastFocus.focus) consLastFocus.focus();
}

function initConsole() {
  var key = $('consKey');
  if (key) key.addEventListener('click', openConsole);
  $('consClose').addEventListener('click', closeConsole);
  $('consApply').addEventListener('click', consApply);
  $('consExport').addEventListener('click', consExport);
  $('consPublish').addEventListener('click', consPublish);
  $('consRevert').addEventListener('click', function () {
    if (!consDirty || window.confirm('Discard every change made since this panel was opened?')) consRevert();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && consEl.classList.contains('open')) { e.stopPropagation(); closeConsole(); }
  }, true);
}

function initialise() {

  renderCopy(COPY);
  buildCards();

  dressReveals();
  dressAsides();
  numberMoves();

  measureVH();
  syncPortrait();
  Portrait = dressPortrait();
  syncLanding();
  syncStudioLane();

  var cod = $('plateCod');
  if (cod && cod.getAttribute('src')) {
    probePlate(cod.getAttribute('src'), function (ok) {
      if (!ok) return;
      syncLanding();
      if (window.FIGURE && window.FIGURE.ready) { window.FIGURE.refit(); }
    });
  }

  measure();
  buildHit();
  setWorks(0, 'initialise');
  watchMid();
  auditFit();
  initConsole();
  initCopyMail();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { syncNavRule(true); });

  if (window.FIGURE) {
    window.FIGURE.init();

    window.FIGURE.setTheme(currentTheme());
    window.FIGURE.setPose(0, 0);
  }

  syncInk(currentTheme());
  poseLoop();

  root.style.setProperty('--hero-hold', REDUCED ? '0ms' : '420ms');

  Intro.play(function () {
    root.classList.remove('intro-locked');
    navEl.classList.add('shown');

    backLive = true; backO = -1; backB = -1; backplateAt(deckPos());
    startBloom();
    if (window.FIGURE && window.FIGURE.beginIdle) window.FIGURE.beginIdle();
    room = -1;
    measure();
    onScroll();
    auditFit();

    applyHash('auto');
    setTimeout(function () { root.style.setProperty('--hero-hold', '0ms'); }, 2600);
  });

  window.STYLOS = {
    figure: function () { return window.FIGURE.state(); },
    stylus: function () { return window.FIGURE.stylus(); },
    room: function () { return room; },
    goto: function (i) { goTo(screens[clamp(i, 0, screens.length - 1)]); },

    copy: function () { return COPY; },
    live: function () { return copyLive; },

    addresses: function () {
      var out = { rooms: [], works: [] };
      if (!roomAddr) buildRoomAddrs();
      screens.forEach(function (sc, i) {
        var a = (sc.dataset.addr || '').trim();
        if (!a) return;
        var al = (sc.dataset.alias || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
        out.rooms.push('#' + a + (al.length ? '   (also ' + al.map(function (t) { return '#' + t; }).join(', ') + ')' : ''));
      });
      P.forEach(function (p, i) { out.works.push('#' + WORK_PREFIX + workSlug(i) + '  —  ' + p.title); });
      return out;
    },

    seed: function (which) {
      var out = { rooms: COPY.rooms, site: COPY.site, works: {} };
      P.forEach(function (p, i) {
        var d = {}, k;
        for (k in p) {
          if (!Object.prototype.hasOwnProperty.call(p, k)) continue;

          if (k === '__k') continue;
          d[k] = p[k];
        }

        d.order = i;
        out.works['work-' + (i + 1)] = d;
      });
      return which ? out[which] : out;
    },

    console: function () { openConsole(); return 'console open'; }
  };
}

var fontsReady = (document.fonts && document.fonts.ready)
  ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 2200); })])
  : Promise.resolve();

Promise.all([fontsReady, window.COPY_READY || Promise.resolve(null)])
  .then(function (res) {
    applyRemote(res[1]);
    initialise();
  })
  .catch(function (err) {

    console.warn('[stylos] copy: rendering the seed —', err && err.message);
    initialise();
  });

})();
