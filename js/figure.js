(function () {
'use strict';

var cvs = document.getElementById('tab');
if (!cvs) return;
var ctx = cvs.getContext('2d', { alpha: false });

var LATIN = ['SAEPE', 'STILVM', 'VERTAS'];

var CODE = ['read', 'structure', 'draw', 'keep'];

var PAL = {
  blue: {
    bg: [7, 38, 76], bgHi: [13, 52, 98], bgLo: [3, 25, 54],
    dim: [52, 74, 112], mid: [148, 176, 214], hot: [252, 250, 246],
    wDim: [92, 48, 44], wMid: [214, 104, 84], wHot: [255, 190, 158],
    op: 'lighter', glow: 1
  },
  green: {
    bg: [9, 44, 42], bgHi: [15, 60, 55], bgLo: [4, 29, 28],
    dim: [58, 86, 72], mid: [156, 186, 156], hot: [250, 252, 232],
    wDim: [84, 44, 34], wMid: [204, 92, 68], wHot: [252, 182, 142],
    op: 'lighter', glow: 1
  },

  wax: {
    bg: [236, 230, 214], bgHi: [243, 239, 227], bgLo: [222, 214, 193],

    dim: [138, 138, 120], mid: [56, 80, 66], hot: [8, 36, 28],
    wDim: [190, 158, 140], wMid: [158, 78, 52], wHot: [104, 30, 16],
    op: 'source-over', glow: 0
  }
};

var OPT = {
  theme: 'green',
  grain: 2.55,
  spacing: 2.05,
  xray: true,
  DPR_CAP: 1.8
};

var DSX = 2, DSY = 3;

var INFILL = 0.44;

var W = 0, H = 0, DPR = 1, cell = 6, gw = 1, gh = 1;
var atlas = null, atlasW = null, aw = 0, ah = 0, LEVELS = 8, DOTLV = 4;
var bufD, bufI, bufX, bufY, bufV, bufF;
var img = null, buf32 = null, bgBuf = null, SR = 0, SG = 8, SB = 16, AMASK = 0xFF000000;
var scene = null, tLat = null, tCode = null, layout = null;
var posCur = null, norCur = null, sPos = null, sNor = null;
var dist = 380, target = [0, 0, 0], fitted = false;
var RAMP = [], RAMPCSS = [], RAMPW = [], RAMPWCSS = [], GLOW = [0, 0, 0, 0, 0.35, 0.85, 1.6, 2.7];
var DK = [], DKR = 0;
var clock = 0, last = 0, running = false, raf = 0;
var frames = 0, fpsAcc = 0, fps = 60, degraded = 0;
var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var compact = false;

var deckP = 0, deckQ = 0;

var handPhi = Math.PI * 0.5, handSectors = 6;

var veil = 0;

var handSec = -1, handFrom = Math.PI * 0.5, handTo = Math.PI * 0.5;
var handT0 = -1, handDur = 0.42, handSwing = 0;

var hovX = -1e4, hovY = -1e4, hovA = 0, hovAim = 0, hoR = 15, warmBase = 0;

var densCur = ENG.KEY[0].dens, digCur = ENG.KEY[0].dig;
var pxNudge = 0, pyNudge = 0, pxAim = 0, pyAim = 0;

var bloomGrow = 1;
var stCur = null, dirty = true;

var blankOn = false;

var styScr = [0, 0, 0, 0];

var BAYER = (function () {
  var b = [0,32,8,40,2,34,10,42, 48,16,56,24,50,18,58,26,
           12,44,4,36,14,46,6,38, 60,28,52,20,62,30,54,22,
           3,35,11,43,1,33,9,41, 51,19,59,27,49,17,57,25,
           15,47,7,39,13,45,5,37, 63,31,55,23,61,29,53,21];
  var o = new Float32Array(64);
  for (var i = 0; i < 64; i++) o[i] = (b[i] + 0.5) / 64;
  return o;
})();
function hash2(x, y) {
  var h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function P() { return PAL[OPT.theme]; }

function rampFrom(dim, mid, hot, outRGB, outCSS) {
  outRGB.length = 0; outCSS.length = 0;
  for (var i = 0; i < LEVELS; i++) {
    var t = i / (LEVELS - 1), c;
    if (t < 0.5) { var u = t / 0.5; c = [ENG.lerp(dim[0], mid[0], u), ENG.lerp(dim[1], mid[1], u), ENG.lerp(dim[2], mid[2], u)]; }
    else { var v = (t - 0.5) / 0.5; c = [ENG.lerp(mid[0], hot[0], v), ENG.lerp(mid[1], hot[1], v), ENG.lerp(mid[2], hot[2], v)]; }
    outRGB.push([c[0] | 0, c[1] | 0, c[2] | 0]);
    outCSS.push('rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (0.66 + 0.34 * t).toFixed(2) + ')');
  }
}
function buildRamp() {
  var p = P();
  rampFrom(p.dim,  p.mid,  p.hot,  RAMP,  RAMPCSS);
  rampFrom(p.wDim, p.wMid, p.wHot, RAMPW, RAMPWCSS);
}

function buildKernels() {
  var rad = [0, 0.52, 0.86, 1.28, 1.80];
  var k = Math.max(0.75, DPR * 0.92);
  DK = [null]; DKR = 0;
  for (var L = 1; L <= DOTLV; L++) {
    var R = rad[L] * k, ext = Math.ceil(R + (L === DOTLV ? 1.9 : 0.9));
    var ox = [], oy = [], a = [];
    for (var y = -ext; y <= ext; y++) for (var x = -ext; x <= ext; x++) {
      var d = Math.sqrt(x * x + y * y);
      var v = ENG.clamp(R - d + 0.55, 0, 1);
      if (L >= 3) v += 0.16 / (1 + (d - R > 0 ? (d - R) * (d - R) * 3.2 : 0)) * (d > R ? 1 : 0);
      if (L === DOTLV) v += 0.10 / (1 + d * d * 0.55);
      if (v < 0.035) continue;
      ox.push(x); oy.push(y); a.push(Math.min(1, v));
    }
    DK.push({ ox: new Int16Array(ox), oy: new Int16Array(oy), a: new Float32Array(a), n: a.length });
    if (ext > DKR) DKR = ext;
  }
}

var NOISE = (function () {
  var t = new Float32Array(64 * 64);
  for (var i = 0; i < 64 * 64; i++) t[i] = (hash2(i & 63, i >> 6) - 0.5) * 3.1;
  return t;
})();
function buildBG() {
  if (!W || !H) return;
  var p = P();
  bgBuf = new Uint32Array(W * H);
  var cx = W * 0.5, cy = H * 0.34, rr = 1 / (Math.max(W, H) * 0.82);
  for (var y = 0; y < H; y++) {
    var dy = (y - cy) * rr, dy2 = dy * dy, row = y * W, nrow = (y & 63) << 6;
    for (var x = 0; x < W; x++) {
      var dx = (x - cx) * rr;
      var t = dx * dx + dy2; t = t > 0.61 ? 1 : t * 1.64;
      var n = NOISE[nrow + (x & 63)];
      var r0 = p.bgHi[0] + (p.bgLo[0] - p.bgHi[0]) * t + n;
      var g0 = p.bgHi[1] + (p.bgLo[1] - p.bgHi[1]) * t + n;
      var b0 = p.bgHi[2] + (p.bgLo[2] - p.bgHi[2]) * t + n;
      bgBuf[row + x] = AMASK |
        ((r0 < 0 ? 0 : r0 > 255 ? 255 : r0) << SR) |
        ((g0 < 0 ? 0 : g0 > 255 ? 255 : g0) << SG) |
        ((b0 < 0 ? 0 : b0 > 255 ? 255 : b0) << SB);
    }
  }
}

function sheet(css, glowRGB) {
  var c = document.createElement('canvas');
  c.width = aw * 10; c.height = ah * LEVELS;
  var a = c.getContext('2d');
  var fs = Math.max(6, cell * DSY * 1.00);

  var gm = P().glow === undefined ? 1 : P().glow;
  a.textAlign = 'center'; a.textBaseline = 'middle';
  a.font = '600 ' + fs.toFixed(1) + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace';
  for (var L = 0; L < LEVELS; L++) {
    a.fillStyle = css[L];
    a.shadowColor = 'rgba(' + glowRGB.join(',') + ',0.85)';
    a.shadowBlur = GLOW[L] * DPR * gm;
    for (var g = 0; g < 10; g++) a.fillText(String(g), g * aw + aw / 2, L * ah + ah / 2);
  }
  a.shadowBlur = 0;
  return c;
}
function buildAtlas() {
  var p = P();
  var fs = Math.max(6, cell * DSY * 1.00);
  var pad = Math.ceil(fs * 0.75);
  aw = Math.ceil(cell * DSX) + pad * 2;
  ah = Math.ceil(cell * DSY) + pad * 2;
  atlas  = sheet(RAMPCSS,  p.hot);
  atlasW = sheet(RAMPWCSS, p.wHot);
}

function buildTextCloud(spec) {
  var F = spec.field, PX = spec.px;
  var mw = Math.round((F.x1 - F.x0) * PX), mh = Math.round((F.z1 - F.z0) * PX);
  var mc = document.createElement('canvas');
  mc.width = mw; mc.height = mh;
  var m = mc.getContext('2d', { willReadFrequently: true });
  var lines = spec.lines, CAP = spec.cap, LEAD = spec.lead, TRACK = spec.track;

  var fam = spec.mono
    ? 'ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace'
    : '"Times New Roman", Georgia, "DejaVu Serif", serif';
  var wgt = spec.mono ? '500 ' : '700 ';
  var fs = CAP * PX / 0.70;
  m.font = wgt + fs + 'px ' + fam;
  var asc = m.measureText('H').actualBoundingBoxAscent || fs * 0.70;
  fs *= (CAP * PX) / asc;
  m.font = wgt + fs.toFixed(2) + 'px ' + fam;
  var tr = fs * TRACK;

  function lineWidth(s) {
    var w = 0;
    for (var i = 0; i < s.length; i++) w += m.measureText(s[i]).width + (i ? tr : 0);
    return w;
  }
  var maxW = 0, i;
  for (i = 0; i < lines.length; i++) maxW = Math.max(maxW, lineWidth(lines[i]));
  var inset = spec.inset * PX;
  var avail = mw - 2 * inset;
  if (maxW > avail) { fs *= avail / maxW; m.font = wgt + fs.toFixed(2) + 'px ' + fam; tr = fs * TRACK; }
  var capPx = (m.measureText('H').actualBoundingBoxAscent || fs * 0.7);
  var leadPx = capPx * (LEAD / CAP);
  var blockH = (lines.length - 1) * leadPx + capPx;
  var top = (mh - blockH) / 2;

  m.fillStyle = '#fff'; m.textBaseline = 'alphabetic'; m.textAlign = 'left';

  var chars = [], lineRanges = [];
  for (i = 0; i < lines.length; i++) {
    var s = lines[i], base = top + capPx + i * leadPx;
    var x = spec.align === 'left' ? inset : (mw - lineWidth(s)) / 2;
    var ranges = [];
    for (var j = 0; j < s.length; j++) {
      var ch = s[j], adv = m.measureText(ch).width;
      if (ch !== ' ') {
        m.fillText(ch, x, base);
        var e = {
          line: i, first: j === 0 || s.slice(0, j).trim() === '',
          px0: x, px1: x + adv, pbase: base,
          mx0: F.x0 + x / PX, mx1: F.x0 + (x + adv) / PX,
          mz: F.z0 + base / PX, idx: chars.length
        };
        chars.push(e); ranges.push(e);
      }
      x += adv + tr;
    }
    lineRanges.push({ base: base, top: base - capPx, ranges: ranges });
  }

  var data = m.getImageData(0, 0, mw, mh).data;

  var PROF = 5;
  for (i = 0; i < chars.length; i++) {
    var ce = chars[i], cl = lineRanges[ce.line];
    var by0 = Math.max(0, Math.floor(cl.top - capPx * 0.20));
    var by1 = Math.min(mh - 1, Math.ceil(cl.base + capPx * 0.32));
    ce.top = new Float32Array(PROF);
    ce.bot = new Float32Array(PROF);
    for (var sp = 0; sp < PROF; sp++) {
      var sx = Math.round(ce.px0 + (ce.px1 - ce.px0) * (sp + 0.5) / PROF);
      if (sx < 0) sx = 0; if (sx > mw - 1) sx = mw - 1;
      var ta = -1, ba = -1;
      for (var sy = by0; sy <= by1; sy++) {
        if (data[(sy * mw + sx) * 4 + 3] >= 130) { if (ta < 0) ta = sy; ba = sy; }
      }
      if (ta < 0) { ta = cl.top; ba = cl.base; }
      ce.top[sp] = F.z0 + ta / PX;
      ce.bot[sp] = F.z0 + ba / PX;
    }
  }

  var step = Math.max(2, Math.round(spec.harvest * PX));
  var px = [], pz = [], po = [], pu = [], pb = [], ps = [];
  var nC = chars.length, nBands = 3, gold = 0.6180339887, seedq = 0.123;
  for (var y = step * 0.5 | 0; y < mh; y += step) {
    for (var xx = step * 0.5 | 0; xx < mw; xx += step) {
      if (data[(y * mw + xx) * 4 + 3] < 130) continue;
      var li = 0, bestd = 1e9;
      for (i = 0; i < lineRanges.length; i++) {
        var L = lineRanges[i];
        var dd = (y < L.top) ? L.top - y : (y > L.base ? y - L.base : 0);
        if (dd < bestd) { bestd = dd; li = i; }
      }
      var rg = lineRanges[li].ranges, ci = -1, f = 0;
      for (i = 0; i < rg.length; i++) {
        if (xx >= rg[i].px0 - tr * 0.5 && xx <= rg[i].px1 + tr * 0.5) {
          ci = rg[i].idx; f = (xx - rg[i].px0) / Math.max(1, rg[i].px1 - rg[i].px0);
          break;
        }
      }
      if (ci < 0) { ci = rg.length ? rg[rg.length - 1].idx : 0; f = 1; }
      var mx = F.x0 + xx / PX, mz = F.z0 + y / PX;
      px.push(mx); pz.push(mz);
      po.push(nC ? (ci + ENG.clamp(f, 0, 1)) / nC : 0);
      pu.push((mx - F.x0) / (F.x1 - F.x0));
      pb.push(Math.min(nBands - 1, ((mz - F.z0) / (F.z1 - F.z0) * nBands) | 0));
      seedq = (seedq + gold) % 1;
      ps.push((seedq * 256) | 0);
    }
  }

  return {
    n: px.length, nBands: nBands,
    x: new Float32Array(px), z: new Float32Array(pz),
    ord: new Float32Array(po), u: new Float32Array(pu),
    band: new Uint8Array(pb), seed: new Uint8Array(ps),
    y: spec.y, chars: chars, nC: nC, field: F, cap: capPx / PX, prof: PROF
  };
}

var PEN_DOWN = 0.66;

function penInk(p, nC) {
  if (!nC || nC < 1) return p;
  var q = ENG.clamp(p, 0, 1) * nC;
  var ci = Math.min(nC - 1, q | 0), f = q - ci;
  return (ci + Math.min(1, f / PEN_DOWN)) / nC;
}

function makePath(T, style) {
  var chars = T.chars, nC = T.nC, F = T.field, nBands = T.nBands, CAP = T.cap;
  var PROF = T.prof || 5, script = style !== 'glide';

  var STROKES = script ? 1.5 : 1.0;

  var HOP = script ? 5.5 : 3.8, RETURN = script ? 17 : 11;

  function inkAt(c, u, out) {
    if (!c.top) { out[0] = c.mz - CAP * 0.62; out[1] = c.mz; return out; }
    var q = ENG.clamp(u, 0, 1) * (PROF - 1);
    var i0 = Math.min(PROF - 2, q | 0), f = q - i0;
    out[0] = ENG.lerp(c.top[i0], c.top[i0 + 1], f);
    out[1] = ENG.lerp(c.bot[i0], c.bot[i0 + 1], f);
    return out;
  }
  var pA = [0, 0], pB = [0, 0];

  return {
    contact: function (p) {
      if (nC === 0) return [(F.x0 + F.x1) / 2, 0, 0];
      var q = Math.min(nC - 1e-6, Math.max(0, p) * nC);
      var ci = q | 0, f = q - ci, c = chars[ci];

      if (f <= PEN_DOWN) {
        var u = f / PEN_DOWN;
        inkAt(c, u, pA);

        var s = 0.5 - 0.5 * Math.cos(u * Math.PI * 2 * STROKES);
        return [
          ENG.lerp(c.mx0, c.mx1, u),
          ENG.lerp(pA[0], pA[1], s),

          (script ? 0.9 : 0.5) * Math.pow(Math.abs(2 * s - 1), 4)
        ];
      }

      var g = (f - PEN_DOWN) / (1 - PEN_DOWN);
      var e = g * g * (3 - 2 * g);
      var nx = chars[ci + 1];
      inkAt(c, 1, pA);
      if (!nx) return [c.mx1, pA[1], 0];
      inkAt(nx, 0, pB);
      return [
        ENG.lerp(c.mx1, nx.mx0, e),
        ENG.lerp(pA[1], pB[0], e),
        (nx.line !== c.line ? RETURN : HOP) * Math.sin(Math.PI * g)
      ];
    },
    erase: function (e) {
      var b = ENG.clamp(e, 0, 1) * nBands;
      var bi = Math.min(nBands - 1, b | 0), f = b - bi;
      var u = (bi % 2 === 0) ? f : 1 - f;
      return [ENG.lerp(F.x0, F.x1, u),
              F.z0 + (bi + 0.5) * (F.z1 - F.z0) / nBands,
              1.6 * Math.pow(Math.abs(2 * f - 1), 8)];
    }
  };
}

function erasedAt(e, band, u) {
  var nB = 3, b = ENG.clamp(e, 0, 1) * nB;
  var bi = Math.min(nB - 1, b | 0), f = b - bi;
  if (band < bi) return true;
  if (band > bi) return false;
  var s = (bi % 2 === 0) ? f : 1 - f;
  return (bi % 2 === 0) ? (u <= s) : (u >= s);
}

function buildTexts() {
  tLat = buildTextCloud({
    lines: LATIN, field: ENG.FIELD, cap: 19, lead: 27, track: 0.11,
    px: 4, harvest: 0.95, align: 'center', inset: 4, mono: false,
    y: ENG.FIELD.y - ENG.CFG.INCISE
  });

  tCode = buildTextCloud({
    lines: CODE, field: ENG.SCREEN, cap: 9.0, lead: 17.0, track: 0,
    px: 10, harvest: 0.34, align: 'left', inset: 8, mono: true,
    y: ENG.SCREEN.y + 0.16
  });
  var pa = makePath(tLat, 'script'), pb = makePath(tCode, 'glide');
  layout = {
    contact: function (p, m) {
      var a = pa.contact(p), b = pb.contact(p);
      return [ENG.lerp(a[0], b[0], m), ENG.lerp(a[1], b[1], m), ENG.lerp(a[2], b[2], m)];
    },
    erase: function (e, m) {
      var a = pa.erase(e), b = pb.erase(e);
      return [ENG.lerp(a[0], b[0], m), ENG.lerp(a[1], b[1], m), ENG.lerp(a[2], b[2], m)];
    }
  };
}

var lastSig = '';
function resize() {
  var dpr = Math.min(OPT.DPR_CAP, window.devicePixelRatio || 1);
  var w = Math.max(320, Math.round(cvs.clientWidth * dpr));
  var h = Math.max(240, Math.round(cvs.clientHeight * dpr));
  var sig = w + 'x' + h + '/' + dpr + '/' + OPT.grain + '/' + OPT.spacing;
  if (sig === lastSig && img) return false;
  lastSig = sig;

  DPR = dpr; W = w; H = h;
  cvs.width = W; cvs.height = H;

  compact = window.innerWidth < 901;
  cell = Math.max(2, Math.round(OPT.grain * DPR));
  buildKernels();
  gw = Math.ceil(W / cell) + 1; gh = Math.ceil(H / cell) + 1;
  hoR = Math.max(9, Math.round(Math.min(gw, gh) * 0.20));
  var N = gw * gh;
  bufD = new Float32Array(N); bufI = new Int32Array(N);
  bufX = new Float32Array(N); bufY = new Float32Array(N);
  bufV = new Float32Array(N); bufF = new Uint8Array(N);

  img = ctx.createImageData(W, H);
  buf32 = new Uint32Array(img.data.buffer);
  buildBG();
  buildAtlas();
  fitted = false; dirty = true; blankOn = false;
  return true;
}

function splat(x, y, lev, warm) {
  var K = DK[lev], c = (warm ? RAMPW : RAMP)[Math.min(LEVELS - 1, lev * 2 + 1)];
  var r = c[0], g = c[1], b = c[2];
  var xi = x | 0, yi = y | 0, n = K.n, ox = K.ox, oy = K.oy, ka = K.a;
  var safe = (xi > DKR && yi > DKR && xi < W - DKR - 1 && yi < H - DKR - 1);
  for (var i = 0; i < n; i++) {
    var pxx = xi + ox[i], pyy = yi + oy[i];
    if (!safe && (pxx < 0 || pyy < 0 || pxx >= W || pyy >= H)) continue;
    var idx = pyy * W + pxx, d = buf32[idx], a = ka[i];
    var dr = (d >>> SR) & 255, dg = (d >>> SG) & 255, db = (d >>> SB) & 255;
    buf32[idx] = AMASK |
      ((dr + (r - dr) * a) << SR) |
      ((dg + (g - dg) * a) << SG) |
      ((db + (b - db) * a) << SB);
  }
}

function drawGlyph(x, y, lev, g, warm) {
  ctx.drawImage(warm ? atlasW : atlas, g * aw, lev * ah, aw, ah, (x - aw * 0.5) | 0, (y - ah * 0.5) | 0, aw, ah);
}

var SPREAD = 95, FRONT0 = -178, FRONT1 = 186, front = -1e4, mScalar = 0;
function wavefront(m) {
  front = ENG.lerp(FRONT0, FRONT1, m);
  mScalar = ENG.s01(ENG.clamp((front + 92) / SPREAD, 0, 1));
}
function localMorph(x) { return ENG.s01(ENG.clamp((front - x) / SPREAD, 0, 1)); }

function prepareCloud(m) {
  if (m <= 0.0004) { posCur = scene.posA; norCur = scene.norA; return; }
  if (m >= 0.9996) { posCur = scene.posB; norCur = scene.norB; return; }
  var n = scene.n, a = scene.posA, b = scene.posB, na = scene.norA, nb = scene.norB, sd = scene.seed;
  if (!sPos || sPos.length !== n * 3) { sPos = new Float32Array(n * 3); sNor = new Float32Array(n * 3); }
  var puff = Math.sin(Math.PI * m) * 5.6;
  for (var i = 0, i3 = 0; i < n; i++, i3 += 3) {
    var mi = localMorph(a[i3]);
    var nx = na[i3] + (nb[i3] - na[i3]) * mi;
    var ny = na[i3 + 1] + (nb[i3 + 1] - na[i3 + 1]) * mi;
    var nz = na[i3 + 2] + (nb[i3 + 2] - na[i3 + 2]) * mi;
    var L = 1 / (Math.sqrt(nx * nx + ny * ny + nz * nz) || 1);
    nx *= L; ny *= L; nz *= L;
    var s = puff * (4 * mi * (1 - mi)) * (sd[i] * 0.00784 - 0.55);
    sPos[i3] = a[i3] + (b[i3] - a[i3]) * mi + nx * s;
    sPos[i3 + 1] = a[i3 + 1] + (b[i3 + 1] - a[i3 + 1]) * mi + ny * s;
    sPos[i3 + 2] = a[i3 + 2] + (b[i3 + 2] - a[i3 + 2]) * mi + nz * s;
    sNor[i3] = nx; sNor[i3 + 1] = ny; sNor[i3 + 2] = nz;
  }
  posCur = sPos; norCur = sNor;
}

var WM = [null, null, null], MV = [null, null, null];
var o3 = [0, 0, 0], v3 = [0, 0, 0];

var sbA = [0, 0, 0], stA = [0, 0, 0], sbB = [0, 0, 0], stB = [0, 0, 0];

var IDLE_CYCLE = 20.0, IDLE_DEPTH = 0.42, IDLE_FADE = 0.55;

var idleT0 = -1;

function idleAt(st, t) {
  var u = (t % IDLE_CYCLE) / IDLE_CYCLE;

  var w = ENG.s01(ENG.clamp(u / 0.46, 0, 1)) * IDLE_DEPTH;
  var e = ENG.s01(ENG.clamp((u - 0.62) / 0.26, 0, 1));
  var fl = ENG.s01((u - 0.56) / 0.06) - ENG.s01((u - 0.90) / 0.05);
  st.write = Math.max(st.write, w);
  st.erase = Math.max(st.erase, e);
  st.flip = Math.max(st.flip, fl);
}

function drawFrame(t) {
  var i, k, p;
  var st = ENG.stateAt(deckP, deckQ);

  if (!REDUCED && ENG.KEY[0].idle && idleT0 >= 0 && deckP < IDLE_FADE) {
    var idleW = 1 - ENG.s01(deckP / IDLE_FADE);
    if (idleW > 0.004) {
      var probe = { write: 0, erase: 0, flip: 0 };
      idleAt(probe, t - idleT0);
      st.write = Math.max(st.write, probe.write * idleW);
      st.erase = Math.max(st.erase, probe.erase * idleW);
      st.flip = Math.max(st.flip, probe.flip * idleW);
    }
  }
  stCur = st;

  var hb = ENG.s01(ENG.clamp(st.hand || 0, 0, 1));

  wavefront(st.morph);
  prepareCloud(st.morph);

  densCur += ((st.dens === undefined ? 1 : st.dens) - densCur) * 0.16;
  digCur  += ((st.dig  === undefined ? 0 : st.dig)  - digCur)  * 0.16;

  var pose = ENG.poseFor(st, layout);

  var asm = ENG.assemblyAt(REDUCED ? 0 : t, st.roll + (st.turn || 0), st.spin);
  for (p = 0; p < 3; p++) WM[p] = ENG.tMul(asm, pose.mats[p]);

  var f = (H / 2) / Math.tan(21 * Math.PI / 180) * (st.lens === undefined ? 1 : st.lens);
  var panX, panY, cam;

  {

    var iters = fitted ? 1 : 24;
    for (var it = 0; it < iters; it++) {

      var rl = st.regL === undefined ? 0 : st.regL;
      var cx = 0, cy = 0, cz = 0, cnt = 0, lx0 = 0, ly0 = 0, lz0 = 0, lcnt = 0;
      for (i = 0; i < scene.n; i += 29) {
        ENG.tApply(WM[scene.part[i]], posCur[i * 3], posCur[i * 3 + 1], posCur[i * 3 + 2], o3);
        cx += o3[0]; cy += o3[1]; cz += o3[2]; cnt++;
        if (scene.part[i] !== 2) { lx0 += o3[0]; ly0 += o3[1]; lz0 += o3[2]; lcnt++; }
      }
      if (!lcnt) lcnt = 1;
      var tg = [ENG.lerp(cx / cnt, lx0 / lcnt, rl),
                ENG.lerp(cy / cnt, ly0 / lcnt, rl),
                ENG.lerp(cz / cnt, lz0 / lcnt, rl)];
      if (fitted) {
        target[0] += (tg[0] - target[0]) * 0.10;
        target[1] += (tg[1] - target[1]) * 0.10;
        target[2] += (tg[2] - target[2]) * 0.10;
      } else { target = tg; }
      cam = ENG.cameraAt(st.yaw + pxNudge, st.pit + pyNudge, dist, target);
      var mxA = 1, myA = 1, mxL = 1, myL = 1;
      for (i = 0; i < scene.n; i += 29) {
        ENG.tApply(WM[scene.part[i]], posCur[i * 3], posCur[i * 3 + 1], posCur[i * 3 + 2], o3);
        ENG.tApply(cam.V, o3[0], o3[1], o3[2], v3);
        var d0 = -v3[2]; if (d0 < 1) continue;
        var ax = Math.abs(f * v3[0] / d0), ay = Math.abs(f * v3[1] / d0);
        if (ax > mxA) mxA = ax; if (ay > myA) myA = ay;
        if (scene.part[i] !== 2) { if (ax > mxL) mxL = ax; if (ay > myL) myL = ay; }
      }
      var mx = ENG.lerp(mxA, mxL, rl), my = ENG.lerp(myA, myL, rl);

      var lw = compact ? ENG.clamp(1 - deckP, 0, 1) : 0;

      var cw = compact ? ENG.clamp(st.figC || 0, 0, 1) : 0;
      var fillx = st.fill  * (compact ? ENG.lerp(ENG.lerp(0.80, 0.88, cw), 1.00, lw) : 1) * bloomGrow;

      var filly = (st.fillY === undefined ? st.fill : st.fillY) * (compact ? ENG.lerp(ENG.lerp(0.44, 0.78, cw), 1.00, lw) : 1) * bloomGrow;
      var kk = Math.max(mx / (0.5 * fillx * W), my / (0.5 * filly * H));
      var want = dist * kk;

      dist += (want - dist) * (fitted ? 0.075 : 0.62);

      if (!isFinite(dist)) { dist = 380; fitted = false; }
      dist = ENG.clamp(dist, 140, 1700);
    }
    fitted = true;
    panX = st.px * W; panY = st.py * H;
    if (compact) {
      var lw2 = ENG.clamp(1 - deckP, 0, 1);
      var cw2 = ENG.clamp(st.figC || 0, 0, 1);
      panX = ENG.lerp(0, st.px, lw2) * W;

      panY = ENG.lerp(ENG.lerp(-0.250, -0.030, cw2), st.py, lw2) * H;
    }
  }

  var camYaw = st.yaw + pxNudge, camPit = st.pit + pyNudge;
  var useDist = dist, tgx = target[0], tgy = target[1], tgz = target[2];

  if (hb > 0.0015) {

    var len = Math.min(W * 0.19, H * 0.27) * (1 - 0.085 * handSwing);
    var sway = REDUCED ? 0 : 0.011 * Math.sin(t * 0.52) + 0.004 * Math.sin(t * 1.13);
    var mN = ENG.tMul(ENG.tRotZ(handPhi + sway), ENG.tTrans(-ENG.STY_BUTT, 0, 0));

    ENG.tApply(WM[2], ENG.STY_BUTT, 0, 0, sbA);
    ENG.tApply(WM[2], ENG.STY_TIP,  0, 0, stA);
    ENG.tApply(mN,    ENG.STY_BUTT, 0, 0, sbB);
    ENG.tApply(mN,    ENG.STY_TIP,  0, 0, stB);
    var bx = ENG.lerp(sbA[0], sbB[0], hb), by = ENG.lerp(sbA[1], sbB[1], hb), bz = ENG.lerp(sbA[2], sbB[2], hb);

    var ax2 = bx - ENG.lerp(stA[0], stB[0], hb);
    var ay2 = by - ENG.lerp(stA[1], stB[1], hb);
    var az2 = bz - ENG.lerp(stA[2], stB[2], hb);
    var al = Math.sqrt(ax2 * ax2 + ay2 * ay2 + az2 * az2) || 1;
    ax2 /= al; ay2 /= al; az2 /= al;
    WM[2] = ENG.tMul(
      ENG.tTrans(bx - ax2 * ENG.STY_BUTT, by - ay2 * ENG.STY_BUTT, bz - az2 * ENG.STY_BUTT),
      ENG.styBasis([ax2, ay2, az2]));

    camYaw = ENG.lerp(camYaw, 0, hb);
    camPit = ENG.lerp(camPit, 0, hb);
    useDist = ENG.lerp(useDist, 122 * f / Math.max(1, len), hb);
    tgx = ENG.lerp(tgx, 0, hb); tgy = ENG.lerp(tgy, 0, hb); tgz = ENG.lerp(tgz, 0, hb);
    panX = ENG.lerp(panX, 0, hb);
    panY = ENG.lerp(panY, (HAND_CY - 0.5) * H, hb);
  }
  cam = ENG.cameraAt(camYaw, camPit, useDist, [tgx, tgy, tgz]);

  for (p = 0; p < 3; p++) MV[p] = ENG.tMul(cam.V, WM[p]);

  {
    ENG.tApply(MV[2], ENG.STY_TIP, 0, 0, o3);
    var pz0 = -o3[2];
    styScr[0] = W * 0.5 + panX + f * o3[0] / (pz0 || 1);
    styScr[1] = H * 0.5 + panY - f * o3[1] / (pz0 || 1);
    ENG.tApply(MV[2], ENG.STY_BUTT, 0, 0, o3);
    var pz1 = -o3[2];
    styScr[2] = W * 0.5 + panX + f * o3[0] / (pz1 || 1);
    styScr[3] = H * 0.5 + panY - f * o3[1] / (pz1 || 1);
  }

  var V = cam.V, Lw = [-0.45, 0.82, 0.36];
  var lx = V[0] * Lw[0] + V[1] * Lw[1] + V[2] * Lw[2];
  var ly = V[4] * Lw[0] + V[5] * Lw[1] + V[6] * Lw[2];
  var lz = V[8] * Lw[0] + V[9] * Lw[1] + V[10] * Lw[2];

  var ink = (st.ink === undefined ? 1 : st.ink);

  if (compact) ink *= (st.figM === undefined ? 1 : ENG.clamp(st.figM, 0, 1));

  ink *= (1 - veil);

  if (ink < 0.004) {
    if (!blankOn) { buf32.set(bgBuf); ctx.putImageData(img, 0, 0); blankOn = true; }
    return;
  }
  blankOn = false;

  buf32.set(bgBuf);

  var N = gw * gh;
  bufI.fill(-1);
  var dNear = useDist * 0.45, dFar = useDist * 2.0, dRange = dFar - dNear;
  var tick = (t * 3.1) | 0;
  var ghosts = OPT.xray && hb < 0.5;
  var moving = st.morph > 0.0004 && st.morph < 0.9996;

  var leafInk = ink * (1 - hb);

  var pos = posCur, nor = norCur, part = scene.part, flag = scene.flag, sd = scene.seed;
  var M, a0, a1, a2, a4, a5, a6, a8, a9, a10, pInk = 0;
  var curPart = -1;

  for (i = 0; i < scene.n; i++) {
    var pt = part[i];
    if (pt !== curPart) {
      curPart = pt; M = MV[pt];
      pInk = pt === 2 ? ink : leafInk;
      a0 = M[0]; a1 = M[1]; a2 = M[2]; a4 = M[4]; a5 = M[5]; a6 = M[6];
      a8 = M[8]; a9 = M[9]; a10 = M[10];
    }
    if (pInk < 0.004) continue;
    var i3 = i * 3, X = pos[i3], Y = pos[i3 + 1], Z = pos[i3 + 2];
    var vx = a0 * X + a1 * Y + a2 * Z + M[3];
    var vy = a4 * X + a5 * Y + a6 * Z + M[7];
    var vz = a8 * X + a9 * Y + a10 * Z + M[11];
    var d = -vz; if (d < 12) continue;
    var nx = nor[i3], ny = nor[i3 + 1], nz = nor[i3 + 2];
    var tx = a0 * nx + a1 * ny + a2 * nz;
    var ty = a4 * nx + a5 * ny + a6 * nz;
    var tz = a8 * nx + a9 * ny + a10 * nz;
    var il = 1 / Math.sqrt(vx * vx + vy * vy + vz * vz);
    var ndv = -(tx * vx + ty * vy + tz * vz) * il;
    if (ndv < 0.035) continue;

    var lam = tx * lx + ty * ly + tz * lz; if (lam < 0) lam = 0;
    var r1 = 1 - (ndv > 1 ? 1 : ndv);
    var rim = r1 * r1 * (0.55 + 0.45 * r1);
    var fl = flag[i];
    var alb = 1.0, eb = 1.0, bias = 0;
    if (fl & 2) alb = 0.30 + 0.34 * mScalar;
    else if (fl & 16) alb = 0.85;
    if (fl & 4) { alb = 1.05; lam = lam * lam * 0.6 + lam * 0.55; }
    if (fl & 1) { eb = 1.55; bias = 0.9; }

    var val = alb * (0.135 + 0.76 * lam + 0.66 * rim * eb) * (eb > 1 ? 1.22 : 1);
    var fade = (dFar - d) / dRange; fade = fade < 0.30 ? 0.30 : (fade > 1 ? 1 : fade);
    val *= fade * pInk;
    if (moving) {
      var w = 1 - ENG.clamp(Math.abs(X - front) / (SPREAD * 0.42), 0, 1);
      val *= 1 + 1.35 * w * w;
    }
    if (val < 0.055) continue;

    var sx = W * 0.5 + panX + f * vx / d, sy = H * 0.5 + panY - f * vy / d;
    if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
    var idx = ((sy / cell) | 0) * gw + ((sx / cell) | 0);
    var db = d - bias;
    if (bufI[idx] < 0 || db < bufD[idx]) {
      if (ghosts && bufI[idx] >= 0 && (sd[i] & 15) === 0) ghostAt(bufX[idx], bufY[idx]);
      bufD[idx] = db; bufI[idx] = i; bufX[idx] = sx; bufY[idx] = sy; bufV[idx] = val; bufF[idx] = 0;
    } else if (ghosts && (sd[i] & 15) === 0) {
      ghostAt(sx, sy);
    }
  }

  if (leafInk > 0.004) {
    M = MV[0];
    var tnx = M[1], tny = M[5], tnz = M[9];
    var lam2 = tnx * lx + tny * ly + tnz * lz; if (lam2 < 0) lam2 = 0;
    drawInscription(tLat, false, penInk(st.write, tLat.nC), st.erase, f, dFar, dRange, lam2, M, tnx, tny, tnz, panX, panY, leafInk);
    drawInscription(tCode, true, penInk(st.write, tCode.nC), st.erase, f, dFar, dRange, lam2, M, tnx, tny, tnz, panX, panY, leafInk);
  }

  var dg = digCur, dn = densCur;
  var hcx = hovX / cell, hcy = hovY / cell, hR2 = hoR * hoR, hA = hovA;
  var digits = [];
  for (k = 0; k < N; k++) {
    var bi = bufI[k]; if (bi === -1) continue;
    var cxk = k % gw, cyk = (k / gw) | 0;
    if (dn < 0.999 && hash2(cxk + 101, cyk + 57) > dn) continue;
    var sdk = bufF[k] ? (bufF[k] === 2 ? tCode.seed[-2 - bi] : tLat.seed[-2 - bi]) : sd[bi];

    var wm = warmBase;
    if (hA > 0.004) {
      var hdx = cxk - hcx, hdy = cyk - hcy, hd2 = hdx * hdx + hdy * hdy;
      if (hd2 < hR2) { var ht = 1 - hd2 / hR2; wm += ht * ht * hA; }
    }
    var warm = wm > 0.004 && hash2(cxk + 7, cyk + 3) < wm;

    var hv = dg > 0 ? hash2(cxk, cyk) : 1;
    var claimed = dg > 0 && hv < dg && !bufF[k];
    if (claimed && (cxk % DSX) === 0 && (cyk % DSY) === 0) {
      var lv2 = (bufV[k] * (LEVELS - 1) * 1.14 + 0.5) | 0;
      if (lv2 > LEVELS - 1) lv2 = LEVELS - 1; if (lv2 < 0) lv2 = 0;
      digits.push(bufX[k], bufY[k], lv2, (sdk + ((sdk & 7) === 0 ? tick : 0)) % 10, warm ? 1 : 0);
      continue;
    }

    var q = bufV[k] * (DOTLV + 0.35) * (claimed ? INFILL : 1) + BAYER[(cyk & 7) * 8 + (cxk & 7)] - 0.06;
    var lev = q | 0;
    if (lev < 1) continue;
    if (lev > DOTLV) lev = DOTLV;
    splat(bufX[k], bufY[k], lev, warm);
  }

  ctx.putImageData(img, 0, 0);

  if (digits.length) {

    ctx.globalCompositeOperation = P().op || 'lighter';
    for (i = 0; i < digits.length; i += 5) drawGlyph(digits[i], digits[i + 1], digits[i + 2], digits[i + 3], digits[i + 4]);
    ctx.globalCompositeOperation = 'source-over';
  }
}

function ghostAt(x, y) { if (x > 1 && y > 1 && x < W - 2 && y < H - 2) splat(x, y, 1); }

function drawInscription(T, code, wp, ep, f, dFar, dRange, lam2, M, tnx, tny, tnz, panX, panY, ink) {
  if (!T || !T.n) return;
  var a0 = M[0], a1 = M[1], a2 = M[2], a4 = M[4], a5 = M[5], a6 = M[6];
  var a8 = M[8], a9 = M[9], a10 = M[10];
  var yA = ENG.FIELD.y - ENG.CFG.INCISE, yB = ENG.SCREEN.y + 0.16;
  var mark = code ? 2 : 1;
  for (var i = 0; i < T.n; i++) {
    if (T.ord[i] > wp) continue;
    if (ep > 0 && erasedAt(ep, T.band[i], T.u[i])) continue;
    var X2 = T.x[i], Z2 = T.z[i];
    var mi = localMorph(X2);
    var vis = code ? mi : 1 - mi;
    if (vis < 0.03) continue;
    var wy = ENG.lerp(yA, yB, mi);
    var vx2 = a0 * X2 + a1 * wy + a2 * Z2 + M[3];
    var vy2 = a4 * X2 + a5 * wy + a6 * Z2 + M[7];
    var vz2 = a8 * X2 + a9 * wy + a10 * Z2 + M[11];
    var d2 = -vz2; if (d2 < 12) continue;
    var il2 = 1 / Math.sqrt(vx2 * vx2 + vy2 * vy2 + vz2 * vz2);
    var ndv2 = -(tnx * vx2 + tny * vy2 + tnz * vz2) * il2;
    if (ndv2 < 0.05) continue;
    var val2 = (code ? 0.62 + 0.42 * lam2 : 0.36 + 0.72 * lam2 + 0.30 * (1 - ndv2)) * vis * ink;
    var fade2 = (dFar - d2) / dRange; if (fade2 < 0.3) fade2 = 0.3; if (fade2 > 1) fade2 = 1;
    val2 *= fade2;
    var age = wp - T.ord[i];
    if (age < 0.035) val2 *= 1 + (0.035 - age) * 16;
    var sx2 = W * 0.5 + panX + f * vx2 / d2, sy2 = H * 0.5 + panY - f * vy2 / d2;
    if (sx2 < 0 || sy2 < 0 || sx2 >= W || sy2 >= H) continue;
    var idx2 = ((sy2 / cell) | 0) * gw + ((sx2 / cell) | 0);
    var db2 = d2 - 3.2;
    if (bufI[idx2] < 0 || db2 < bufD[idx2]) {
      bufD[idx2] = db2; bufI[idx2] = -2 - i; bufX[idx2] = sx2; bufY[idx2] = sy2;
      bufV[idx2] = val2; bufF[idx2] = mark;
    }
  }
}

function rebuild() {
  var cells = gw * gh;

  var k = ENG.clamp(Math.sqrt(60000 / Math.max(1, cells)), 0.78, 1.70);
  scene = ENG.buildScene(ENG.clamp(OPT.spacing * k, 1.62, 4.60));
  sPos = null; sNor = null;
  posCur = scene.posA; norCur = scene.norA;
  fitted = false; dirty = true;
}

function tickLoop(ms) {
  raf = requestAnimationFrame(tickLoop);
  var dt = last ? Math.min(0.06, (ms - last) / 1000) : 0;
  last = ms;
  if (!running) return;
  clock += dt;

  if (handT0 >= 0) {
    var hu = ENG.clamp((clock - handT0) / handDur, 0, 1);

    var he = 1 - Math.pow(1 - hu, 3);
    he += Math.sin(hu * TAU) * 0.055 * (1 - hu) * (1 - hu);
    handPhi = handFrom + (handTo - handFrom) * he;
    handSwing = Math.sin(hu * Math.PI);
    if (hu >= 1) { handT0 = -1; handPhi = handTo; handSwing = 0; }
    dirty = true;
  }

  if (Math.abs(pxAim - pxNudge) > 1e-4 || Math.abs(pyAim - pyNudge) > 1e-4) {
    pxNudge += (pxAim - pxNudge) * Math.min(1, dt * 3.2);
    pyNudge += (pyAim - pyNudge) * Math.min(1, dt * 3.2);
    dirty = true;
  }

  if (Math.abs(hovAim - hovA) > 1e-3) {
    hovA += (hovAim - hovA) * Math.min(1, dt * (hovAim > hovA ? 7.0 : 2.4));
    dirty = true;
  }

  if (REDUCED && !dirty) return;
  dirty = false;
  drawFrame(clock);

  frames++; fpsAcc += dt;
  if (fpsAcc > 0.6) {
    fps = frames / fpsAcc; frames = 0; fpsAcc = 0;
    if (clock > 3 && fps > 0 && fps < 26) {
      if (degraded === 0) { degraded = 1; OPT.spacing *= 1.28; OPT.grain += 0.6; resize(); rebuild(); }
      else if (degraded === 1) { degraded = 2; OPT.DPR_CAP = 1.25; resize(); rebuild(); }
    }
  }
}

var HAND_CY = 0.155;

window.FIGURE = {
  HAND_CY: HAND_CY,
  ready: false,

  init: function () {
    if (this.ready) return;
    resize();
    buildRamp();
    buildAtlas();
    rebuild();
    buildTexts();
    this.ready = true;
    running = true;
    last = 0;
    raf = requestAnimationFrame(tickLoop);
  },

  setPose: function (p, q) {
    if (p !== deckP || q !== deckQ) dirty = true;
    deckP = p; deckQ = q;
  },

  setHand: function (sector, sectors) {
    if (sectors) handSectors = sectors;
    if (sector !== undefined && sector !== null) {
      if (sector !== handSec) {
        var to = Math.PI * (sector + 0.5) / handSectors;
        var step = handSec < 0 ? 1 : Math.abs(sector - handSec);

        if (REDUCED) { handPhi = to; handTo = to; handSec = sector; handT0 = -1; handSwing = 0; dirty = true; return; }
        handFrom = handPhi; handTo = to;

        handDur = 0.30 + 0.16 * Math.min(3, step);
        handT0 = clock;
        handSec = sector;
      }
    }
    dirty = true;
  },

  beginIdle: function () { if (idleT0 < 0) idleT0 = clock; dirty = true; },

  setVeil: function (v) {
    v = ENG.clamp(v || 0, 0, 1);
    if (Math.abs(v - veil) < 0.002) return;
    veil = v; dirty = true;
  },

  setBloom: function (g) {
    g = ENG.clamp(g, 0.5, 2);
    if (Math.abs(g - bloomGrow) < 0.0015) return;
    bloomGrow = g; fitted = false; dirty = true;
  },

  setHover: function (x, y, on) {
    if (x !== undefined && x !== null) { hovX = x * DPR; hovY = y * DPR; }
    hovAim = on ? 1 : 0;
    dirty = true;
  },

  setWarm: function (a) { warmBase = ENG.clamp(a || 0, 0, 0.5); dirty = true; },
  setTheme: function (k) {
    if (!PAL[k]) return;
    OPT.theme = k;
    buildRamp(); buildKernels(); buildAtlas(); buildBG();

    blankOn = false;
    dirty = true;
  },
  nudge: function (x, y) { pxAim = x; pyAim = y; },

  refit: function () { fitted = false; dirty = true; },
  pause: function () { running = false; },
  resume: function () { if (!running) { running = true; last = 0; dirty = true; } },

  resize: function () { if (resize()) rebuild(); },

  state: function () {
    return { p: deckP, q: deckQ, fps: fps, n: scene ? scene.n : 0, dist: dist,
             hand: stCur ? (stCur.hand || 0) : 0 };
  },

  stylus: function () {
    var x0 = styScr[0] / DPR, y0 = styScr[1] / DPR;
    var x1 = styScr[2] / DPR, y1 = styScr[3] / DPR;
    return {
      tip: [Math.round(x0), Math.round(y0)],
      butt: [Math.round(x1), Math.round(y1)],
      deg: +(Math.atan2(y0 - y1, x1 - x0) * 180 / Math.PI).toFixed(1),
      len: Math.round(Math.hypot(x1 - x0, y1 - y0))
    };
  }
};

(function () {
  var ab = new ArrayBuffer(4), u8 = new Uint8Array(ab), u32 = new Uint32Array(ab);
  u32[0] = 0x01020304;
  if (u8[0] === 0x01) { SR = 24; SG = 16; SB = 8; AMASK = 0x000000FF; }
})();

document.addEventListener('visibilitychange', function () {
  if (document.hidden) window.FIGURE.pause(); else window.FIGURE.resume();
});

})();
