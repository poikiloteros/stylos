'use strict';

var CFG = {
  W: 112,
  H: 156,
  T: 12,
  GAP: 1.5,
  MARGIN: 11.5,
  WAXY: -0.9,
  INCISE: 1.05,
  CORD_R: 13.0,
  CORD_r: 1.35,
  CORD_Z: 44,
  GROOVE: 2.55,
  OPEN_MAX: 2.72,
  SP: 2.05,
  SPE: 1.05,
  ANISO: 0.66
};

var LX0 = CFG.GAP, LX1 = CFG.GAP + CFG.W;

var MODA = { T: 5.4, M: 8.0, WAXY: -0.34, RO: 17.0, RS: 4.0, RI: 11.0 };
var MODB = { T: 3.1, M: 6.4, WAXY: -0.15, RO: 17.0, RS: 4.0, RI: 12.5 };

var HING = { RX: 12.6, RY: 5.6, YC: -1.15, RM: 0.55, ZW: 4.4 };

var STY = [
  [-60.0, 0.14, 0.14],
  [-54.0, 0.65, 0.65],
  [-45.0, 1.30, 1.30],
  [-12.0, 1.68, 1.68],
  [ 28.0, 2.01, 2.01],
  [ 33.5, 2.83, 2.83],
  [ 38.5, 2.83, 2.83],
  [ 42.5, 1.71, 1.71],
  [ 46.0, 1.24, 2.48],
  [ 52.0, 0.94, 3.89],
  [ 57.5, 0.73, 4.54],
  [ 60.5, 0.53, 3.78],
  [ 62.0, 0.21, 1.53]
];
var MSTY = [
  [-60.0, 0.15, 0.15],
  [-54.0, 0.74, 0.74],
  [-45.0, 1.42, 1.42],
  [-12.0, 2.04, 2.04],
  [ 28.0, 2.12, 2.12],
  [ 33.5, 2.26, 2.26],
  [ 38.5, 2.26, 2.26],
  [ 42.5, 2.12, 2.12],
  [ 46.0, 2.14, 2.14],
  [ 52.0, 2.14, 2.14],
  [ 57.5, 2.10, 2.10],
  [ 60.5, 1.84, 1.84],
  [ 62.0, 0.66, 0.66]
];
var STY_TIP = -60.0, STY_BUTT = 62.0;

var F_EDGE = 1, F_WAX = 2, F_METAL = 4, F_CORD = 16;

var TAU = Math.PI * 2;
function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
function lerp(a, b, t) { return a + (b - a) * t; }
function s01(t) { return t <= 0 ? 0 : (t >= 1 ? 1 : t * t * (3 - 2 * t)); }
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function tI() { return new Float64Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]); }
function tMul(A, B, o) {
  o = o || new Float64Array(12);
  for (var r = 0; r < 3; r++) {
    var a0 = A[r * 4], a1 = A[r * 4 + 1], a2 = A[r * 4 + 2];
    for (var c = 0; c < 3; c++) o[r * 4 + c] = a0 * B[c] + a1 * B[4 + c] + a2 * B[8 + c];
    o[r * 4 + 3] = a0 * B[3] + a1 * B[7] + a2 * B[11] + A[r * 4 + 3];
  }
  return o;
}
function tRotX(a) { var c = Math.cos(a), s = Math.sin(a); return new Float64Array([1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0]); }
function tRotY(a) { var c = Math.cos(a), s = Math.sin(a); return new Float64Array([c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0]); }
function tRotZ(a) { var c = Math.cos(a), s = Math.sin(a); return new Float64Array([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0]); }
function tMirrorY() { return new Float64Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0]); }
function tTrans(x, y, z) { return new Float64Array([1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z]); }
function tApply(M, x, y, z, out) {
  out[0] = M[0] * x + M[1] * y + M[2] * z + M[3];
  out[1] = M[4] * x + M[5] * y + M[6] * z + M[7];
  out[2] = M[8] * x + M[9] * y + M[10] * z + M[11];
  return out;
}
function nrm3(v) { var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
function cross3(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }

function makeLeafMap(p) {
  var W = CFG.W, H = CFG.H, T = CFG.T, M = CFG.MARGIN, wy = CFG.WAXY;
  var XA = LX0, XB = LX1, Z0 = -H / 2, Z1 = H / 2;
  var Mm = p.M, Tm = p.T, wym = p.WAXY;
  var sM = Mm / M;
  var sFx = ((XB - Mm) - (XA + Mm)) / ((XB - M) - (XA + M));
  var sFz = ((Z1 - Mm) - (Z0 + Mm)) / ((Z1 - M) - (Z0 + M));
  var sYr = wym / wy;
  var sYb = (-Tm - wym) / (-T - wy);
  var ix0 = XA + Mm, ix1 = XB - Mm, iz0 = Z0 + Mm, iz1 = Z1 - Mm;
  var ro = p.RO, rs = p.RS, ri = p.RI, EPS = 1e-4;

  function round4(x, z, nx, nz, xa, xb, za, zb, rA, rB, o) {
    var loX = (x - xa) <= (xb - x);
    var r = loX ? rA : rB;
    o[0] = x; o[1] = z; o[2] = nx; o[3] = nz;
    if (r <= 0) return;
    var ex = loX ? (xa + r) - x : x - (xb - r);
    if (ex <= 0) return;
    var loZ = (z - za) <= (zb - z);
    var ez = loZ ? (za + r) - z : z - (zb - r);
    if (ez <= 0) return;
    var L = Math.sqrt(ex * ex + ez * ez);
    if (L <= r || L < 1e-9) return;
    var ux = ex / L, uz = ez / L;
    ex = ux * r; ez = uz * r;
    o[0] = loX ? (xa + r) - ex : (xb - r) + ex;
    o[1] = loZ ? (za + r) - ez : (zb - r) + ez;
    var ox = loX ? -ux : ux, oz = loZ ? -uz : uz;
    var w = Math.sqrt(nx * nx + nz * nz);
    if (w > 1e-6) {
      var s = (nx * ox + nz * oz) >= 0 ? w : -w;
      o[2] = ox * s; o[3] = oz * s;
    }
  }

  var tmp = [0, 0, 0, 0];
  return function (x, y, z, nx, ny, nz, o) {
    var sx, sy, sz;
    if (x <= XA + M) { sx = sM; x = XA + (x - XA) * sM; }
    else if (x >= XB - M) { sx = sM; x = XB - (XB - x) * sM; }
    else { sx = sFx; x = (XA + Mm) + (x - (XA + M)) * sFx; }
    if (z <= Z0 + M) { sz = sM; z = Z0 + (z - Z0) * sM; }
    else if (z >= Z1 - M) { sz = sM; z = Z1 - (Z1 - z) * sM; }
    else { sz = sFz; z = (Z0 + Mm) + (z - (Z0 + M)) * sFz; }
    if (y >= wy) { sy = sYr; y = y * sYr; }
    else { sy = sYb; y = wym + (y - wy) * sYb; }

    nx /= sx; ny /= sy; nz /= sz;

    round4(x, z, nx, nz, XA, XB, Z0, Z1, rs, ro, tmp);
    x = tmp[0]; z = tmp[1]; nx = tmp[2]; nz = tmp[3];

    if (y >= wym - EPS && x >= ix0 - EPS && x <= ix1 + EPS && z >= iz0 - EPS && z <= iz1 + EPS) {
      round4(x, z, nx, nz, ix0, ix1, iz0, iz1, ri, ri, tmp);
      x = tmp[0]; z = tmp[1]; nx = tmp[2]; nz = tmp[3];
    }

    var L = 1 / (Math.sqrt(nx * nx + ny * ny + nz * nz) || 1);
    o[0] = x; o[1] = y; o[2] = z; o[3] = nx * L; o[4] = ny * L; o[5] = nz * L;
  };
}

function makeCordMap(z0) {
  var R = CFG.CORD_R, r = CFG.CORD_r;
  return function (x, y, z, nx, ny, nz, o) {
    var u = Math.atan2(y, x);
    var rr = Math.sqrt(x * x + y * y);
    var cv = (rr - R) / r, sv = (z - z0) / r;
    var cu = Math.cos(u), su = Math.sin(u);
    o[0] = (HING.RX + HING.RM * cv) * cu;
    o[1] = HING.YC + (HING.RY + HING.RM * cv) * su;
    o[2] = z0 + HING.ZW * sv;
    var mx = cv * cu, my = cv * su * 1.6, mz = sv * 0.85;
    var L = 1 / (Math.sqrt(mx * mx + my * my + mz * mz) || 1);
    o[3] = mx * L; o[4] = my * L; o[5] = mz * L;
  };
}

function Builder(seed) {
  this.ax = []; this.ay = []; this.az = [];
  this.anx = []; this.any = []; this.anz = [];
  this.bx = []; this.by = []; this.bz = [];
  this.bnx = []; this.bny = []; this.bnz = [];
  this.part = []; this.flag = [];
  this.rnd = mulberry32(seed || 12345);
  this.map = null;
  this.o6 = [0, 0, 0, 0, 0, 0];
}
Builder.prototype.add = function (x, y, z, nx, ny, nz, part, flag) {
  var L = 1 / (Math.sqrt(nx * nx + ny * ny + nz * nz) || 1);
  nx *= L; ny *= L; nz *= L;
  this.ax.push(x); this.ay.push(y); this.az.push(z);
  this.anx.push(nx); this.any.push(ny); this.anz.push(nz);
  if (this.map) {
    var o = this.o6;
    this.map(x, y, z, nx, ny, nz, o);
    this.bx.push(o[0]); this.by.push(o[1]); this.bz.push(o[2]);
    this.bnx.push(o[3]); this.bny.push(o[4]); this.bnz.push(o[5]);
  } else {
    this.bx.push(x); this.by.push(y); this.bz.push(z);
    this.bnx.push(nx); this.bny.push(ny); this.bnz.push(nz);
  }
  this.part.push(part); this.flag.push(flag | 0);
};

Builder.prototype.addPair = function (ax, ay, az, anx, any, anz, bx, by, bz, bnx, bny, bnz, part, flag) {
  var L = 1 / (Math.sqrt(anx * anx + any * any + anz * anz) || 1);
  var K = 1 / (Math.sqrt(bnx * bnx + bny * bny + bnz * bnz) || 1);
  this.ax.push(ax); this.ay.push(ay); this.az.push(az);
  this.anx.push(anx * L); this.any.push(any * L); this.anz.push(anz * L);
  this.bx.push(bx); this.by.push(by); this.bz.push(bz);
  this.bnx.push(bnx * K); this.bny.push(bny * K); this.bnz.push(bnz * K);
  this.part.push(part); this.flag.push(flag | 0);
};
Builder.prototype.pack = function () {
  var n = this.ax.length, i;
  var o = {
    n: n,
    posA: new Float32Array(n * 3), norA: new Float32Array(n * 3),
    posB: new Float32Array(n * 3), norB: new Float32Array(n * 3),
    part: new Uint8Array(n), flag: new Uint8Array(n), seed: new Uint8Array(n)
  };
  for (i = 0; i < n; i++) {
    var i3 = i * 3;
    o.posA[i3] = this.ax[i]; o.posA[i3 + 1] = this.ay[i]; o.posA[i3 + 2] = this.az[i];
    o.norA[i3] = this.anx[i]; o.norA[i3 + 1] = this.any[i]; o.norA[i3 + 2] = this.anz[i];
    o.posB[i3] = this.bx[i]; o.posB[i3 + 1] = this.by[i]; o.posB[i3 + 2] = this.bz[i];
    o.norB[i3] = this.bnx[i]; o.norB[i3 + 1] = this.bny[i]; o.norB[i3 + 2] = this.bnz[i];
    o.part[i] = this.part[i]; o.flag[i] = this.flag[i];
    o.seed[i] = (this.rnd() * 256) | 0;
  }
  return o;
};

function quad(B, o, U, V, du, dv, N, part, flag, reject) {
  var lu = Math.hypot(U[0], U[1], U[2]), lv = Math.hypot(V[0], V[1], V[2]);
  var nu = Math.max(1, Math.round(lu / du)), nv = Math.max(1, Math.round(lv / dv));
  var j = 0.16;
  for (var i = 0; i < nu; i++) for (var k = 0; k < nv; k++) {
    var a = (i + 0.5 + (B.rnd() - 0.5) * j) / nu, b = (k + 0.5 + (B.rnd() - 0.5) * j) / nv;
    var x = o[0] + U[0] * a + V[0] * b, y = o[1] + U[1] * a + V[1] * b, z = o[2] + U[2] * a + V[2] * b;
    if (reject && reject(x, y, z)) continue;
    B.add(x, y, z, N[0], N[1], N[2], part, flag);
  }
}

function edge(B, p0, p1, ds, N, part, flag, reject) {
  var d = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
  var L = Math.hypot(d[0], d[1], d[2]);
  var n = Math.max(1, Math.round(L / ds));
  for (var i = 0; i <= n; i++) {
    var t = i / n;
    var x = p0[0] + d[0] * t, y = p0[1] + d[1] * t, z = p0[2] + d[2] * t;
    if (reject && reject(x, y, z)) continue;
    B.add(x, y, z, N[0], N[1], N[2], part, flag | F_EDGE);
  }
}

function rectEdge(B, ax, av, u0, u1, v0, v1, ds, N, part, flag, reject) {
  var mk = function (u, v) { return ax === 1 ? [u, av, v] : (ax === 0 ? [av, u, v] : [u, v, av]); };
  edge(B, mk(u0, v0), mk(u1, v0), ds, N, part, flag, reject);
  edge(B, mk(u1, v0), mk(u1, v1), ds, N, part, flag, reject);
  edge(B, mk(u1, v1), mk(u0, v1), ds, N, part, flag, reject);
  edge(B, mk(u0, v1), mk(u0, v0), ds, N, part, flag, reject);
}

function tube2(B, pa, pb, du, dth, part, flag) {
  for (var s = 0; s < pa.length - 1; s++) {
    var x0 = pa[s][0], x1 = pa[s + 1][0], seg = x1 - x0;
    var a0 = pa[s][1], b0 = pa[s][2], a1 = pa[s + 1][1], b1 = pa[s + 1][2];
    var c0 = pb[s][1], d0 = pb[s][2], c1 = pb[s + 1][1], d1 = pb[s + 1][2];
    var nu = Math.max(1, Math.round(seg / du));
    var ap = (a1 - a0) / seg, bp = (b1 - b0) / seg, cp = (c1 - c0) / seg, dp = (d1 - d0) / seg;
    for (var i = 0; i < nu; i++) {
      var t = (i + 0.5) / nu, x = x0 + seg * t;
      var a = a0 + (a1 - a0) * t, b = b0 + (b1 - b0) * t;
      var c = c0 + (c1 - c0) * t, d = d0 + (d1 - d0) * t;
      var ca = Math.PI * (1.5 * (a + b) - Math.sqrt(a * b));
      var cb = Math.PI * (1.5 * (c + d) - Math.sqrt(c * d));
      var nth = Math.max(6, Math.round(Math.max(ca, cb) / dth));
      for (var k = 0; k < nth; k++) {
        var th = (k + 0.5) / nth * TAU, ct = Math.cos(th), st = Math.sin(th);
        B.addPair(
          x, a * ct, b * st,
          -(a * bp * st * st + b * ap * ct * ct), b * ct, a * st,
          x, c * ct, d * st,
          -(c * dp * st * st + d * cp * ct * ct), d * ct, c * st,
          part, flag);
      }
    }
  }
}

function torusZ(B, R, r, z0, du, dv, part, flag) {
  var nu = Math.max(12, Math.round(TAU * R / du));
  var nv = Math.max(6, Math.round(TAU * r / dv));
  for (var i = 0; i < nu; i++) for (var k = 0; k < nv; k++) {
    var u = (i + 0.5) / nu * TAU, v = (k + 0.5) / nv * TAU;
    var cu = Math.cos(u), su = Math.sin(u), cv = Math.cos(v), sv = Math.sin(v);
    B.add((R + r * cv) * cu, (R + r * cv) * su, z0 + r * sv, cv * cu, cv * su, sv, part, flag);
  }
}

function buildLeaf(B, part, sp, spe) {
  var W = CFG.W, H = CFG.H, T = CFG.T, M = CFG.MARGIN, wy = CFG.WAXY;
  var XA = LX0, XB = LX1, Z1 = H / 2, Z0 = -H / 2;
  var FX0 = XA + M, FX1 = XB - M, FZ0 = Z0 + M, FZ1 = Z1 - M;
  var du = sp * CFG.ANISO, dv = sp;
  var UP = [0, 1, 0], DN = [0, -1, 0];

  var R = CFG.CORD_R, g = CFG.GROOVE, cz = CFG.CORD_Z;
  function rej(x, y, z) {
    if (Math.abs(Math.abs(z) - cz) > g) return false;
    return Math.abs(Math.hypot(x, y) - R) < g;
  }

  quad(B, [XA, 0, Z0], [M, 0, 0], [0, 0, H], du, dv, UP, part, 0, rej);
  quad(B, [FX1, 0, Z0], [M, 0, 0], [0, 0, H], du, dv, UP, part, 0, rej);
  quad(B, [FX0, 0, FZ1], [FX1 - FX0, 0, 0], [0, 0, M], du, dv, UP, part, 0, rej);
  quad(B, [FX0, 0, Z0], [FX1 - FX0, 0, 0], [0, 0, M], du, dv, UP, part, 0, rej);

  quad(B, [FX0, wy, FZ0], [FX1 - FX0, 0, 0], [0, 0, FZ1 - FZ0], du, dv, UP, part, F_WAX, null);

  quad(B, [FX0, wy, FZ0], [0, -wy, 0], [0, 0, FZ1 - FZ0], sp * 0.5, dv, [1, 0, 0], part, 0, null);
  quad(B, [FX1, wy, FZ0], [0, -wy, 0], [0, 0, FZ1 - FZ0], sp * 0.5, dv, [-1, 0, 0], part, 0, null);
  quad(B, [FX0, wy, FZ0], [FX1 - FX0, 0, 0], [0, -wy, 0], du, sp * 0.5, [0, 0, 1], part, 0, null);
  quad(B, [FX0, wy, FZ1], [FX1 - FX0, 0, 0], [0, -wy, 0], du, sp * 0.5, [0, 0, -1], part, 0, null);

  quad(B, [XA, -T, Z0], [0, T, 0], [0, 0, H], sp, dv, [-1, 0, 0], part, 0, rej);
  quad(B, [XB, -T, Z0], [0, T, 0], [0, 0, H], sp, dv, [1, 0, 0], part, 0, rej);
  quad(B, [XA, -T, Z1], [W, 0, 0], [0, T, 0], du, sp, [0, 0, 1], part, 0, rej);
  quad(B, [XA, -T, Z0], [W, 0, 0], [0, T, 0], du, sp, [0, 0, -1], part, 0, rej);

  quad(B, [XA, -T, Z0], [W, 0, 0], [0, 0, H], du, dv, DN, part, 0, rej);

  rectEdge(B, 1, 0, XA, XB, Z0, Z1, spe, [0, 0.72, 0.69], part, 0, rej);
  rectEdge(B, 1, -T, XA, XB, Z0, Z1, spe, [0, -0.72, 0.69], part, 0, rej);
  rectEdge(B, 1, 0, FX0, FX1, FZ0, FZ1, spe, [0, 0.80, 0.60], part, 0, null);
  rectEdge(B, 1, wy, FX0, FX1, FZ0, FZ1, spe, [0, 0.80, 0.60], part, F_WAX, null);

  var cs = [[XA, Z0, -0.7, -0.7], [XB, Z0, 0.7, -0.7], [XB, Z1, 0.7, 0.7], [XA, Z1, -0.7, 0.7]];
  for (var i = 0; i < 4; i++) {
    edge(B, [cs[i][0], -T, cs[i][1]], [cs[i][0], 0, cs[i][1]], spe,
      [cs[i][2], 0, cs[i][3]], part, 0, rej);
  }
}

function modernOnly(B, spe) {
  var W = CFG.W, H = CFG.H, M = CFG.MARGIN;
  var XA = LX0, XB = LX1, Z0 = -H / 2, Z1 = H / 2;
  var mapA = makeLeafMap(MODA), mapB = makeLeafMap(MODB);
  var o = [0, 0, 0, 0, 0, 0];

  function park(x, z) {
    var px = clamp(x, XA + 1.5, XB - 1.5), pz = clamp(z, Z0 + 1.5, Z1 - 1.5);
    if (px > XA + M && px < XB - M && pz > Z0 + M && pz < Z1 - M) {
      pz = (pz - Z0 < Z1 - pz) ? Z0 + M * 0.5 : Z1 - M * 0.5;
    }
    return [px, 0, pz];
  }

  function put(map, part, x, y, z, nx, ny, nz, flag) {
    map(x, y, z, nx, ny, nz, o);
    var a = park(x, z);
    B.addPair(a[0], a[1], a[2], 0, 1, 0, o[0], o[1], o[2], o[3], o[4], o[5], part, flag);
  }

  var k, t, i, n;
  for (k = 1; k <= 2; k++) {
    var cx = XA + (XB - XA) * (k / 3);
    n = Math.max(8, Math.round((H - 2 * MODB.M) / (spe * 1.15)));
    for (i = 0; i <= n; i++) {
      var cz = lerp(Z0 + MODB.M * 1.2, Z1 - MODB.M * 1.2, i / n);
      put(mapB, 1, cx, MODB.WAXY, cz, 0, 1, 0, F_EDGE);
      put(mapB, 1, cx + 0.9, MODB.WAXY, cz, 0, 1, 0, 0);
    }
  }

  var midx = (XA + XB) / 2, cz0 = Z0 + MODA.M * 0.5;
  n = 22;
  for (i = 0; i < n; i++) {
    t = i / n * TAU;
    put(mapA, 0, midx + Math.cos(t) * 1.5, 0, cz0 + Math.sin(t) * 1.5, 0, 1, 0, F_EDGE);
  }

  var pz = Z1 - MODA.M * 0.5, mid = (XA + XB) / 2;
  for (k = -1; k <= 1; k += 2) {
    for (i = 0; i < 8; i++) {
      put(mapA, 0, mid + k * (14 + i * 2.4), 0, pz, 0, 1, 0, 0);
    }
  }
  n = 16;
  for (i = 0; i <= n; i++) {
    t = i / n * TAU;
    put(mapA, 0, mid + Math.cos(t) * 4.4, 0, pz + Math.sin(t) * 1.1, 0, 1, 0, F_EDGE);
  }
}

function buildScene(sp) {
  sp = sp || CFG.SP;
  var spe = CFG.SPE * (sp / CFG.SP);
  var B = new Builder(20260801);

  B.map = makeLeafMap(MODA); buildLeaf(B, 0, sp, spe);
  B.map = makeLeafMap(MODB); buildLeaf(B, 1, sp, spe);

  B.map = makeCordMap(CFG.CORD_Z);
  torusZ(B, CFG.CORD_R, CFG.CORD_r, CFG.CORD_Z, sp * 0.55, sp * 0.5, 0, F_CORD);
  B.map = makeCordMap(-CFG.CORD_Z);
  torusZ(B, CFG.CORD_R, CFG.CORD_r, -CFG.CORD_Z, sp * 0.55, sp * 0.5, 0, F_CORD);

  B.map = null;
  modernOnly(B, spe);

  tube2(B, STY, MSTY, sp * 0.30, sp * 0.26, 2, F_METAL);

  var n = Math.max(2, Math.round(116 / (spe * 1.3)));
  for (var s = -1; s <= 1; s += 2) {
    for (var i = 0; i <= n; i++) {
      var t = i / n;
      B.addPair(
        lerp(-56, 60, t), 0, s * lerp(1.1, 3.6, t), 0, 0.30, s * 0.95,
        lerp(-53, 60.5, t), 0, s * lerp(1.0, 1.9, t), 0, 0.30, s * 0.95,
        2, F_METAL | F_EDGE);
    }
  }
  return B.pack();
}

var FIELD = (function () {
  var M = CFG.MARGIN, H2 = CFG.H / 2;
  return { x0: LX0 + M, x1: LX1 - M, z0: -H2 + M, z1: H2 - M, y: CFG.WAXY };
})();
var SCREEN = (function () {
  var M = MODA.M, H2 = CFG.H / 2;
  return { x0: LX0 + M, x1: LX1 - M, z0: -H2 + M, z1: H2 - M, y: MODA.WAXY };
})();

var TURN1 = TAU;

var KEY = [

  { open: 1.00, morph: 0, write: 0.00, erase: 0, flip: 0, work: 1.00,
    yaw: -0.1394, pit: 0.6983, roll: 0.1055, turn: 0, fill: 0.70, px: 0.02, py: -0.06,
    dig: 0.46, dens: 0.42, ink: 0.86, lens: 2.20, regL: 1, figM: 1, idle: 1 },

  { open: 0.06, morph: 0, write: 0.00, erase: 0, flip: 0, work: 0.00,
    yaw: -0.62, pit: 0.92, roll: 0.06, turn: TURN1, fill: 0.76, px: 0.00, py: -0.01,
    dig: 0.50, dens: 0.46, ink: 0.96, lens: 1.60, regL: 0.00, spin: 0.30,
    figM: 1, figC: 1 },

  { open: 0.60, morph: 0, write: 0.00, erase: 0, flip: 0, work: 0.88,
    yaw: -0.94, pit: 0.13, roll: 0.00, turn: TURN1, fill: 0.82, px: 0.00, py: 0.02,
    dig: 0.40, dens: 0.50, ink: 1.00, lens: 1.26, spin: 0.26, figM: 1, figC: 1 },

  { open: 1.00, morph: 0, write: 0.02, erase: 0, flip: 0, work: 1.00,
    yaw: -0.14, pit: 0.96, roll: 0.02, turn: TURN1, fill: 0.88, px: 0.00, py: 0.00,
    dig: 0.34, dens: 0.52, ink: 1.00, lens: 1.06, spin: 0.14, figM: 1, figC: 1,
    writeTo: 1.00, actMs: 12000 },

  { open: 1.00, morph: 0, write: 0.00, erase: 0, flip: 0, work: 1.00,
    yaw: 0.14, pit: 0.80, roll: -0.03, turn: TURN1, fill: 0.48, px: 0.29, py: 0.08,
    dig: 0.38, dens: 0.52, ink: 0.84, figM: 1,
    writeTo: 1.00, eraseTo: 1.00, actMs: 16000 },

  { open: 1.00, morph: 0, write: 0.10, erase: 0, flip: 0, work: 0.44,
    yaw: 0.34, pit: 0.58, roll: 0.03, turn: TURN1, fill: 0.54, px: 0.27, py: 0.02,
    dig: 0.36, dens: 0.56, ink: 0.82, figM: 1,
    morphTo: 1, actMs: 11000 },

  { open: 1.00, morph: 1, write: 0.06, erase: 0, flip: 0, work: 1.00,
    yaw: 0.34, pit: 0.72, roll: 0.00, turn: TURN1, fill: 0.60, px: 0.25, py: 0.02,
    dig: 0.42, dens: 0.64, ink: 0.92, spin: 0.18, figM: 0,
    writeTo: 0.40, actMs: 9000 },

  { open: 1.00, morph: 1, write: 0.40, erase: 0, flip: 0, work: 1.00,
    yaw: -0.34, pit: 0.84, roll: 0.00, turn: TURN1, fill: 0.56, px: -0.34, py: 0.02,
    dig: 0.42, dens: 0.64, ink: 0.92, spin: 0.18, figM: 0,
    writeTo: 0.72, actMs: 8500 },

  { open: 0.74, morph: 1, write: 0.72, erase: 0, flip: 0, work: 1.00,
    yaw: 0.26, pit: 0.54, roll: 0.03, turn: TURN1, fill: 0.68, px: 0.26, py: 0.06,
    dig: 0.40, dens: 0.62, ink: 0.90, spin: 0.18, figM: 0,
    writeTo: 1.00, actMs: 8000 },

  { open: 1.00, morph: 1, write: 1.00, erase: 0, flip: 0, work: 0.30,
    yaw: 0.30, pit: 0.70, roll: 0.00, turn: TURN1, fill: 0.60, px: 0.00, py: 0.00,
    dig: 0.34, dens: 0.68, ink: 0.72, hand: 1, figM: 0 },

  { open: 0.86, morph: 1, write: 1.00, erase: 0, flip: 0, work: 0.30,
    yaw: 1.05, pit: 0.62, roll: 0.00, turn: TURN1,
    fill: 0.205, fillY: 0.62, px: 0.010, py: 0.065,
    dig: 0.36, dens: 0.68, ink: 0.86, spin: 1, figM: 0 },

  { open: 1.00, morph: 1, write: 0.00, erase: 0, flip: 0, work: 1.00,
    yaw: 0.02, pit: 0.94, roll: 0.02, turn: TURN1, fill: 0.72, px: 0.24, py: 0.02,
    dig: 0.40, dens: 0.70, ink: 0.96, figM: 0,
    writeTo: 1.00, actMs: 20000 },

  { open: 1.00, morph: 1, write: 0.06, erase: 0, flip: 0, work: 1.00,
    yaw: 0.26, pit: 0.58, roll: 0.02, turn: TURN1, fill: 0.62, px: 0.27, py: -0.20,
    dig: 0.46, dens: 0.62, ink: 0.92, figM: 1,

    writeTo: 1.00, actMs: 14000 }
];

var KEYS = ['open', 'morph', 'write', 'erase', 'flip', 'work', 'yaw', 'pit', 'roll', 'fill', 'px', 'py',
            'dig', 'dens', 'ink', 'figM'];

function stateAt(p, q) {
  var n = KEY.length;
  p = clamp(p, 0, n - 1);
  var i = Math.min(n - 2, Math.floor(p)), f = s01(p - i);
  var A = KEY[i], B = KEY[i + 1], o = {}, k;
  for (k = 0; k < KEYS.length; k++) {
    var key = KEYS[k];
    o[key] = lerp(A[key], B[key], f);
  }

  o.work = lerp(A.work, B.work, s01(f > 0.40 ? 1 : f / 0.40));

  var cur = KEY[Math.round(p)];
  if (cur && q > 0) {

    if (cur.writeTo !== undefined) o.write = Math.max(o.write, lerp(cur.write, cur.writeTo, s01(q * 1.08)));
    if (cur.eraseTo !== undefined) {
      var e = s01((q - 0.62) / 0.38);
      o.erase = Math.max(o.erase, lerp(0, cur.eraseTo, e));
      if (e > 0) o.flip = Math.max(o.flip, s01((q - 0.58) / 0.10) - s01((q - 0.97) / 0.06));
    }

    if (cur.morphTo !== undefined) {
      o.morph = Math.max(o.morph, lerp(cur.morph, cur.morphTo, s01(q / 0.82)));
    }
  }

  o.hand = lerp(A.hand || 0, B.hand || 0, f);
  o.spin = lerp(A.spin || 0, B.spin || 0, f);

  o.figC = lerp(A.figC || 0, B.figC || 0, f);

  o.lens = lerp(A.lens === undefined ? 1 : A.lens, B.lens === undefined ? 1 : B.lens, f);
  o.regL = lerp(A.regL === undefined ? 0 : A.regL, B.regL === undefined ? 0 : B.regL, f);

  var fA = A.fillY === undefined ? A.fill : A.fillY;
  var fB = B.fillY === undefined ? B.fill : B.fillY;
  o.fillY = lerp(fA, fB, f);

  var lf = p - i;

  var snap = lf <= 0 ? 0 : (lf >= 1 ? 1 : 1 - Math.pow(1 - lf, 2.0));
  o.turn = lerp(A.turn || 0, B.turn || 0, snap);
  return o;
}

function styBasis(d) {
  var X = nrm3(d);
  var ref = Math.abs(X[1]) < 0.94 ? [0, 1, 0] : [0, 0, 1];
  var Z = nrm3(cross3(X, ref));
  var Y = cross3(Z, X);
  return new Float64Array([X[0], Y[0], Z[0], 0, X[1], Y[1], Z[1], 0, X[2], Y[2], Z[2], 0]);
}

function poseFor(st, layout) {
  var m = st.morph;
  var theta = CFG.OPEN_MAX * st.open;
  var wp = clamp(st.write, 0, 1), ep = clamp(st.erase, 0, 1);
  var flip = Math.PI * clamp(st.flip, 0, 1);
  var surfY = lerp(FIELD.y, SCREEN.y, m);

  var mA = tI();

  var mB = tMul(tRotZ(theta), tMirrorY());

  var cx, cz, lift = 0;
  if (ep > 0 && layout && layout.erase) {
    var e = layout.erase(ep, m); cx = e[0]; cz = e[1]; lift = e[2] || 0;
  } else if (layout && layout.contact) {
    var c = layout.contact(wp, m); cx = c[0]; cz = c[1]; lift = c[2];
  } else { cx = (FIELD.x0 + FIELD.x1) / 2; cz = 0; }

  var dW = nrm3([0.50, 0.76, 0.40]);
  var dE = nrm3([0.58, 0.68, 0.46]);
  var dR = nrm3([0.86, 0.46, -0.11]);

  var fw = clamp(st.flip, 0, 1);
  var dA = [lerp(dW[0], dE[0], fw), lerp(dW[1], dE[1], fw), lerp(dW[2], dE[2], fw)];
  var work = clamp(st.work, 0, 1);
  var d = nrm3([lerp(dR[0], dA[0], work), lerp(dR[1], dA[1], work), lerp(dR[2], dA[2], work)]);

  var Mfull = tMul(styBasis(d), tRotZ(flip));
  var hover = lift + 22 * (1 - work) * work;

  var target = [cx, surfY + 0.2 + hover, cz];
  var rest = [LX0 + 30, -lerp(CFG.T, MODA.T, m) + 2.6, CFG.H / 2 + 24];

  var wt = clamp(flip / Math.PI, 0, 1);
  var anchor = [lerp(STY_TIP, STY_BUTT, wt), 0, 0];
  var av = tApply(Mfull, anchor[0], anchor[1], anchor[2], [0, 0, 0]);

  var cw = [target[0] - av[0], target[1] - av[1], target[2] - av[2]];

  var pos = [lerp(rest[0], cw[0], work), lerp(rest[1], cw[1], work), lerp(rest[2], cw[2], work)];
  var mS = tMul(tTrans(pos[0], pos[1], pos[2]), Mfull);

  return {
    theta: theta, write: wp, erase: ep, flip: flip, morph: m,
    mats: [mA, mB, mS],
    contact: [cx, surfY, cz]
  };
}

function cameraAt(yaw, pit, dist, target) {
  pit = clamp(pit, -0.25, 1.46);
  var eye = [
    target[0] + dist * Math.cos(pit) * Math.sin(yaw),
    target[1] + dist * Math.sin(pit),
    target[2] + dist * Math.cos(pit) * Math.cos(yaw)
  ];
  var f = nrm3([target[0] - eye[0], target[1] - eye[1], target[2] - eye[2]]);
  var s = nrm3(cross3(f, [0, 1, 0]));
  var u = cross3(s, f);
  var V = new Float64Array([
    s[0], s[1], s[2], -(s[0] * eye[0] + s[1] * eye[1] + s[2] * eye[2]),
    u[0], u[1], u[2], -(u[0] * eye[0] + u[1] * eye[1] + u[2] * eye[2]),
    -f[0], -f[1], -f[2], (f[0] * eye[0] + f[1] * eye[1] + f[2] * eye[2])
  ]);
  return { V: V, eye: eye, yaw: yaw, pit: pit };
}

function assemblyAt(t, roll, spin) {
  return tMul(tTrans(0, 1.4 * Math.sin(t * 0.42), 0),
         tMul(tRotY(roll + (spin || 0) * 0.42 * Math.sin(t * 0.19) + 0.030 * Math.sin(t * 0.21)),
              tRotX(0.020 * Math.sin(t * 0.17 + 2))));
}

var ENG = {
  CFG: CFG, FIELD: FIELD, SCREEN: SCREEN,
  KEY: KEY, STY_TIP: STY_TIP, STY_BUTT: STY_BUTT,
  buildScene: buildScene, stateAt: stateAt, poseFor: poseFor,
  cameraAt: cameraAt, assemblyAt: assemblyAt, styBasis: styBasis,
  tMul: tMul, tRotZ: tRotZ, tTrans: tTrans, tApply: tApply,
  clamp: clamp, lerp: lerp, s01: s01
};
