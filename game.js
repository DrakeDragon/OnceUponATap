'use strict';
/* ONCE UPON A TAP v2 — engine
   One realm map at a time. Tile grid + A* pathfinding: characters can only walk on free tiles,
   walk to buildings and vanish inside (timer over the roof), or work at landmarks / spots / routes. */
(function () {
const $ = (s) => document.querySelector(s);
const now = () => Date.now();
const SAVE_KEY = 'onceUponATap_v2';
const LVL_CAP = 80, TALE_NEED = 30;

/* ---------- utils ---------- */
function fmt(n) {
  n = Math.floor(n);
  if (n < 1000) return '' + n;
  const u = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
  let i = 0, v = n;
  while (v >= 1000 && i < u.length - 1) { v /= 1000; i++; }
  return String(parseFloat(v.toFixed(v >= 100 ? 0 : v >= 10 ? 1 : 2))) + u[i];
}
function fmtTime(s) {
  s = Math.max(0, Math.ceil(s));
  if (s < 60) return s + 's';
  if (s < 3600) return Math.floor(s / 60) + 'm' + (s % 60 ? ' ' + (s % 60) + 's' : '');
  return Math.floor(s / 3600) + 'h' + (Math.floor(s / 60) % 60 ? ' ' + (Math.floor(s / 60) % 60) + 'm' : '');
}
const rnd = (a, b) => a + Math.random() * (b - a);
const rint = (a, b) => Math.floor(rnd(a, b + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const dayKey = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
const xpNeed = (L) => Math.floor(25 * Math.pow(L, 2.5));
const friendLvl = (fp) => { let l = 1; for (let i = 1; i < FRIEND_PTS.length; i++) if (fp >= FRIEND_PTS[i]) l = i + 1; return l; };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/* ---------- state ---------- */
let S;
const R = { rc: {}, sparks: [], pops: [], parts: [], combo: 0, lastCollect: 0, cam: { x: 0, y: 0, z: 1 }, place: null,
  sheetFn: null, W: 0, H: 0, dpr: 1, nextSpark: now() + 20000, nextQuip: now() + 60000, hintT: 0, flash: 0, tick: 0, rt: null, layer: null };

function newState() {
  return { v: 2, coins: 180, wishes: 3, xp: 0, lvl: 1, realms: REALMS.map((r, i) => i === 0), cur: 0,
    blds: [], chars: { 0: mkChar() }, qc: {}, done: {}, seen: {}, uid: 1,
    stats: { tasks: 0, short: 0, mid: 0, long: 0, coins: 0, combo: 0, sparks: 0, chests: 0 },
    tale: 0, day: '', streak: 0, wellDay: '', sound: true, last: now() };
}
function mkChar() { return { fp: 0, task: null, last: null, rep: false, discoveries: {} }; }
function save() { try { S.last = now(); const snapshot = R.place && R.place.moving ? { ...S, blds: [...S.blds, R.place.moving] } : S; localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot)); } catch (e) {} }
function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY); if (!raw) return null;
    const parsed = JSON.parse(raw), s = Campaign.migrate(parsed);
    if (s !== parsed) {
      // Both writes must succeed before booting the reduced town. Never fall back
      // to a new town when backup/migration storage fails.
      localStorage.setItem(SAVE_KEY + '_pre100', raw);
      localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    }
    while (s.realms.length < REALMS.length) s.realms.push(false);
    s.stats = Object.assign({ tasks: 0, short: 0, mid: 0, long: 0, coins: 0, combo: 0, sparks: 0, chests: 0 }, s.stats);
    return s;
  } catch (e) { throw new Error("Could not safely load this town. Export your existing save before retrying. " + e.message); }
}

/* ---------- derived ---------- */
const ownedCount = () => Object.keys(S.chars).length;
const realmChars = (ri) => CHARS.filter(c => c.realm === ri);
const hiredIn = (ri) => realmChars(ri).filter(c => S.chars[c.id]).length;
const bldAt = (ri, k) => S.blds.find(b => b.r === ri && b.k === k);
const doneCount = () => Object.keys(S.done).length;
const STAR_T = [4, 16, 40, 80, 104];
const stars = () => { let s = 0; STAR_T.forEach(t => { if (S.blds.length >= t) s++; }); return s; };
const coinBonus = () => 1 + 0.04 * stars();
function topRealm() { let t = 0; S.realms.forEach((u, i) => { if (u) t = i; }); return t; }
function statVal(k) {
  switch (k) {
    case 'chars': return ownedCount();
    case 'built': return S.blds.length;
    case 'realms': return S.realms.filter(Boolean).length;
    case 'pages': return doneCount();
    case 'level': return S.lvl;
    default: return S.stats[k] || 0;
  }
}

/* ---------- audio / haptics ---------- */
let AC = null;
function tone(f, d, type, v) {
  if (!S || !S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(v || 0.06, AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + d);
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + d);
  } catch (e) {}
}
const buzz = (ms) => { try { if (S && S.sound && navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };
function sfxCollect(c) { const b = 520 * Math.pow(1.0595, Math.min(c, 12) * 2); tone(b, 0.12, 'triangle'); setTimeout(() => tone(b * 1.5, 0.14, 'triangle'), 60); }
function sfxStart() { tone(330, 0.08, 'square', 0.03); }
function sfxLevel() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.25, 'triangle', 0.08), i * 110)); }
function sfxPage() { [392, 523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => tone(f, 0.4, 'sine', 0.07), i * 140)); }

/* ---------- toasts / pops / particles ---------- */
function toast(msg, big) {
  const d = document.createElement('div');
  d.className = 'toast' + (big ? ' big' : ''); d.textContent = msg;
  const box = $('#toasts'); box.appendChild(d);
  while (box.children.length > 3) box.removeChild(box.firstChild);
  setTimeout(() => d.remove(), 3300);
}
function pop(x, y, text, color, size) { R.pops.push({ x, y, text, color: color || '#fff', t: 0, size: size || 16 }); }
function burst(x, y, n, emoji) { for (let i = 0; i < n; i++) R.parts.push({ x, y, vx: rnd(-90, 90), vy: rnd(-160, -40), t: 0, life: rnd(0.6, 1.1), e: emoji || '✨' }); }

/* ---------- modal queue (story pop-ups never overwrite each other) ---------- */
const MQ = []; let modalOpen = false;
function showModal(html) { MQ.push(html); pumpModal(); }
function pumpModal() {
  if (modalOpen) return;
  const h = MQ.shift(); if (h == null) return;
  modalOpen = true; $('#modalbox').innerHTML = h; $('#modal').classList.remove('hidden');
}
function closeModal() { modalOpen = false; $('#modal').classList.add('hidden'); setTimeout(pumpModal, 120); }
function story(e, title, body, sub, btn) {
  showModal('<div class="big">' + e + '</div><h2>' + esc(title) + '</h2><p class="story">' + esc(body) + '</p>' + (sub ? '<p class="small">' + sub + '</p>' : '') +
    '<p><button class="btn" onclick="G.closeModal()">' + (btn || 'Continue') + '</button></p>');
}

/* ======================================================================
   MAPS — tile grid, obstacles, landmarks, features. Built deterministically per realm.
   kind: 0 free, 1 border, 2 water, 3 hedge/shelf/pillar/sealed, 4 rock, 5 landmark
   ====================================================================== */
const MAPS = {};
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
function seeded(seed) { let s = seed * 2654435761 % 2147483647 || 1; return () => (s = s * 16807 % 2147483647) / 2147483647; }
function canStep(blk, W, H, x, y, dx, dy) {
  const nx = x + dx, ny = y + dy;
  if (nx < 0 || ny < 0 || nx >= W || ny >= H || blk[ny * W + nx]) return false;
  if (dx && dy && (blk[y * W + nx] || blk[ny * W + x])) return false;
  return true;
}
function bfs(blk, W, H, sx, sy) {
  const reach = new Uint8Array(W * H), q = [sy * W + sx]; reach[sy * W + sx] = 1; let n = 1;
  for (let qi = 0; qi < q.length; qi++) {
    const i = q[qi], x = i % W, y = (i / W) | 0;
    for (let d = 0; d < 8; d++) {
      const dx = DIRS[d][0], dy = DIRS[d][1];
      if (!canStep(blk, W, H, x, y, dx, dy)) continue;
      const ni = (y + dy) * W + x + dx;
      if (!reach[ni]) { reach[ni] = 1; q.push(ni); n++; }
    }
  }
  return { reach, n };
}
function genMap(ri) {
  const Rm = REALMS[ri], W = Rm.W, H = Rm.H, kind = new Uint8Array(W * H), deco = new Uint8Array(W * H), rn = seeded(ri * 77 + 5);
  const set = (x, y, k) => { if (x >= 0 && y >= 0 && x < W && y < H) kind[y * W + x] = k; };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (x < 2 || y < 2 || x >= W - 2 || y >= H - 2) kind[y * W + x] = 1;
  // landmarks in the four corner slots; door = free tile below the middle
  const slots = [[3, 3], [W - 6, 3], [3, H - 6], [W - 6, H - 6]], lms = [];
  Rm.lm.forEach((l, i) => {
    const sx = slots[i][0], sy = slots[i][1];
    for (let dy = 0; dy < 3; dy++) for (let dx = 0; dx < 3; dx++) set(sx + dx, sy + dy, 5);
    lms.push({ n: l[0], e: l[1], x: sx, y: sy, door: { x: sx + 1, y: sy + 3 } });
  });
  const cx = (W / 2) | 0, cy = (H / 2) | 0, x0 = 7, x1 = W - 8;
  const feat = Rm.feat;
  if (feat === 'pond') { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const dx = (x - cx) / 3.4, dy = (y - cy) / 2.4; if (dx * dx + dy * dy <= 1) set(x, y, 2); } }
  if (feat === 'hedges') { [cy - 3, cy + 3].forEach((yy, n) => { const gx = n ? x0 + 2 : x1 - 5; for (let x = x0; x <= x1; x++) if (x < gx || x > gx + 2) set(x, yy, 3); }); }
  if (feat === 'maze') { for (let y = 6; y < H - 6; y++) for (let x = 8; x < W - 8; x++) { if (x % 4 === 0 && y % 3 === 0) set(x, y, 3); if (y % 6 === 0 && (x % 8 === 2 || x % 8 === 3 || x % 8 === 4)) set(x, y, 3); } }
  if (feat === 'rocks') { for (let n = 0; n < 16; n++) { const x = rint2(rn, x0, x1), y = rint2(rn, 7, H - 8); set(x, y, 4); if (rn() < 0.5) set(x + 1, y, 4); } }
  if (feat === 'river') { for (let y = 2; y < H - 2; y++) { const gap = y >= cy - 2 && y <= cy + 1; for (let x = cx - 1; x <= cx; x++) { if (gap) deco[y * W + x] = 2; else set(x, y, 2); } } }
  if (feat === 'road') { for (let x = 2; x < W - 2; x++) { const y = cy + Math.round(Math.sin(x / 4) * 2); deco[y * W + x] = 1; deco[(y + 1) * W + x] = 1; } }
  if (feat === 'chess') { for (let y = 2; y < H - 2; y++) for (let x = 2; x < W - 2; x++) deco[y * W + x] = ((x + y) & 1) ? 3 : 4; [[W / 4, cy], [W * 3 / 4, cy], [cx, 8], [cx, H - 9]].forEach(p => set(Math.round(p[0]), Math.round(p[1]), 3)); }
  if (feat === 'library') { [cy - 3, cy + 3].forEach((yy, n) => { for (let x = x0; x <= x1; x++) { if ((x + n * 3) % 6 < 4) set(x, yy, 3); } }); }
  // seal anything the features cut off from the border ring (so nobody can be stranded)
  const blk0 = kind.map(k => (k ? 1 : 0)), r = bfs(blk0, W, H, 2, 2);
  for (let i = 0; i < W * H; i++) if (!kind[i] && !r.reach[i]) kind[i] = 3;
  return { ri, W, H, kind, deco, lms, rn };
}
function rint2(rn, a, b) { return a + Math.floor(rn() * (b - a + 1)); }

/* runtime view of the current realm: adds buildings, reachability, free tile list */
function buildRT(ri) {
  const M = MAPS[ri] || (MAPS[ri] = genMap(ri)), W = M.W, H = M.H, blk = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) blk[i] = M.kind[i] ? 1 : 0;
  const doors = M.lms.map(l => l.door), blds = S.blds.filter(b => b.r === ri);
  blds.forEach(b => { const d = bdef(ri, b.k); for (let dy = 0; dy < d.h; dy++) for (let dx = 0; dx < d.w; dx++) blk[(b.y + dy) * W + b.x + dx] = 1; doors.push(doorOf(b)); });
  const r = bfs(blk, W, H, 2, 2), free = [], edge = [];
  for (let i = 0; i < W * H; i++) if (r.reach[i]) {
    free.push(i);
    const x = i % W, y = (i / W) | 0;
    if (!canStep(blk, W, H, x, y, 1, 0) || !canStep(blk, W, H, x, y, -1, 0) || !canStep(blk, W, H, x, y, 0, 1) || !canStep(blk, W, H, x, y, 0, -1)) edge.push(i);
  }
  return { ri, W, H, M, blk, reach: r.reach, n: r.n, free, edge, doors, lms: M.lms, blds };
}
function doorOf(b) { const d = bdef(b.r, b.k); return { x: b.x + (d.w >> 1), y: b.y + d.h }; }

/* ---------- A* on the tile grid (8-way, no corner cutting) ---------- */
function astar(rt, sx, sy, gx, gy) {
  const W = rt.W, H = rt.H, blk = rt.blk;
  if (blk[gy * W + gx] || blk[sy * W + sx]) return null;
  if (sx === gx && sy === gy) return [];
  const N = W * H, g = new Float32Array(N).fill(1e9), par = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
  const heap = [];
  const push = (f, i) => { heap.push([f, i]); let c = heap.length - 1; while (c > 0) { const p = (c - 1) >> 1; if (heap[p][0] <= heap[c][0]) break; [heap[p], heap[c]] = [heap[c], heap[p]]; c = p; } };
  const popH = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let c = 0; for (;;) { let l = 2 * c + 1, r = l + 1, m = c; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === c) break; [heap[m], heap[c]] = [heap[c], heap[m]]; c = m; } } return top; };
  const h = (x, y) => { const dx = Math.abs(x - gx), dy = Math.abs(y - gy); return dx + dy - 0.586 * Math.min(dx, dy); };
  const si = sy * W + sx, gi = gy * W + gx; g[si] = 0; push(h(sx, sy), si);
  while (heap.length) {
    const cur = popH()[1]; if (closed[cur]) continue; closed[cur] = 1;
    if (cur === gi) break;
    const x = cur % W, y = (cur / W) | 0;
    for (let d = 0; d < 8; d++) {
      const dx = DIRS[d][0], dy = DIRS[d][1];
      if (!canStep(blk, W, H, x, y, dx, dy)) continue;
      const ni = (y + dy) * W + x + dx, ng = g[cur] + (dx && dy ? 1.414 : 1);
      if (ng < g[ni]) { g[ni] = ng; par[ni] = cur; push(ng + h(x + dx, y + dy), ni); }
    }
  }
  if (par[gi] < 0) return null;
  const path = []; for (let i = gi; i !== si; i = par[i]) path.push([i % W, (i / W) | 0]);
  return path.reverse();
}
function nearestFree(rt, x, y) {
  let best = rt.free[0], bd = 1e9;
  for (let k = 0; k < rt.free.length; k++) { const i = rt.free[k], dx = (i % rt.W) - x, dy = ((i / rt.W) | 0) - y, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }
  return { x: best % rt.W, y: (best / rt.W) | 0 };
}

/* ======================================================================
   RUNTIME (per character, current realm only)
   ====================================================================== */
const tcx = (x) => (x + 0.5) * TILE, tcy = (y) => (y + 0.5) * TILE;
function homeTile(rt, ci) {
  const i = rt.free[h32(ci, 91) % rt.free.length];
  return { x: i % rt.W, y: (i / rt.W) | 0 };
}
function spotFor(rt, ci, key, home) {
  // a work spot near home, deterministic per task start
  for (let tries = 0; tries < 40; tries++) {
    const x = home.x + (h32(ci + tries, key) % 13) - 6, y = home.y + (h32(ci * 3 + tries, key + 1) % 9) - 4;
    if (x >= 0 && y >= 0 && x < rt.W && y < rt.H && rt.reach[y * rt.W + x]) return { x, y };
  }
  return home;
}
function ensureRuntime() {
  const rt = R.rt; if (!rt) return;
  Object.keys(S.chars).forEach(k => {
    const ci = +k; if (CHARS[ci].realm !== rt.ri) { delete R.rc[k]; return; }
    if (R.rc[k]) return;
    const h = homeTile(rt, ci), c = S.chars[k], rc = { x: tcx(h.x), y: tcy(h.y), hx: h.x, hy: h.y, path: [], mode: null, wait: rnd(0, 2), seq: h32(ci, 3) % 8, facing: 1, inside: false, bob: rnd(0, 6), spd: 0.85 + hf(ci, 17) * 0.4, off: (h32(ci, 5) % 7) - 3 };
    R.rc[k] = rc;
    if (c.task) {  // resume: put them where their task has them
      const p = planFor(ci, c);
      if (p && p.dest) {
        rc.x = tcx(p.dest.x); rc.y = tcy(p.dest.y);
        if (p.kind === 'e' && now() < c.task.end) { rc.inside = true; rc.mode = 'task'; rc.key = c.task.start; rc.phase = 'in'; }
      }
    }
  });
}
function planFor(ci, c) {
  const rt = R.rt, t = TASKS[ci][c.task.i], rc = R.rc[ci];
  const home = rc ? { x: rc.hx, y: rc.hy } : homeTile(rt, ci);
  if (t.kind === 's') return { kind: 's', dest: spotFor(rt, ci, c.task.start % 100000, home) };
  if (t.kind === 'l') return { kind: 'l', dest: rt.lms[t.arg].door };
  if (t.kind === 'r') return { kind: 'r', dest: rt.lms[t.arg[0]].door, dest2: rt.lms[t.arg[1]].door };
  if (t.kind === 'e') { const b = bldAt(rt.ri, t.arg); return b ? { kind: 'e', dest: doorOf(b), b } : { kind: 's', dest: spotFor(rt, ci, c.task.start % 100000, home) }; }
  return null;
}
function setPath(rc, rt, gx, gy) {
  const sx = Math.round((rc.x - TILE / 2) / TILE), sy = Math.round((rc.y - TILE / 2) / TILE);
  let st = { x: sx, y: sy };
  if (rt.blk[sy * rt.W + sx]) st = nearestFree(rt, sx, sy);
  if (!rt.reach[st.y * rt.W + st.x]) st = nearestFree(rt, st.x, st.y);
  const p = astar(rt, st.x, st.y, gx, gy);
  rc.path = p || [];
  if (st.x !== sx || st.y !== sy) { rc.x = tcx(st.x); rc.y = tcy(st.y); }
}
function idleNext(rc, ci, rt) {
  const st = CHARS[ci].idle, hx = rc.hx, hy = rc.hy, k = rc.seq++;
  const snap = (x, y) => nearestFree(rt, Math.max(2, Math.min(rt.W - 3, Math.round(x))), Math.max(2, Math.min(rt.H - 3, Math.round(y))));
  let t, pause = 1.5, sp = 1;
  switch (st) {
    case 'patrol': { const sgx = (h32(ci, 1) & 1) ? 1 : -1, sgy = (h32(ci, 2) & 1) ? 1 : -1, R2 = 4 + (h32(ci, 3) % 4);
      const wp = [[R2, 0], [R2, 3], [0, 4], [-R2 / 2, 1]][k % 4]; t = snap(hx + wp[0] * sgx, hy + wp[1] * sgy); pause = 0.8; break; }
    case 'pace': { const ax = (h32(ci, 4) & 1), L = 5 + (h32(ci, 6) % 4); t = (k & 1) ? snap(hx, hy) : snap(hx + (ax ? L : 0), hy + (ax ? 0 : L)); pause = 1.8; break; }
    case 'loiter': t = snap(hx + rint(-2, 2), hy + rint(-2, 2)); pause = rnd(4, 9); sp = 0.7; break;
    case 'circle': { const a = k * Math.PI / 4; t = snap(hx + Math.cos(a) * 3.2, hy + Math.sin(a) * 3.2); pause = 0.3; break; }
    case 'zigzag': t = snap(hx + ((k & 1) ? 5 : -5), hy + (((k >> 1) % 3) - 1) * 3); pause = 0.4; sp = 1.15; break;
    case 'hop': t = snap(hx + rint(-3, 3), hy + rint(-3, 3)); pause = rnd(0.15, 0.7); sp = 1.8; break;
    case 'skulk': { const cand = rt.edge.filter(i => Math.abs((i % rt.W) - hx) + Math.abs(((i / rt.W) | 0) - hy) < 14); const i = cand.length ? pick(cand) : rt.free[0]; t = { x: i % rt.W, y: (i / rt.W) | 0 }; pause = rnd(1, 3); sp = 0.9; break; }
    case 'trail': t = snap(hx + rint(-12, 12), hy + rint(-6, 6)); pause = 0.5; break;
    default: t = snap(hx + rint(-9, 9), hy + rint(-5, 5)); pause = rnd(1, 3.5);
  }
  return { t, pause, sp };
}
function stepAlong(rc, dt, speed) {
  let left = speed * dt;
  while (left > 0 && rc.path.length) {
    const p = rc.path[0], tx = tcx(p[0]), ty = tcy(p[1]), dx = tx - rc.x, dy = ty - rc.y, d = Math.hypot(dx, dy);
    // Face the segment actually traveled; vertical paths retain the last direction.
    if (Math.abs(dx) > 0.001) rc.facing = dx < 0 ? -1 : 1;
    if (d <= left) { rc.x = tx; rc.y = ty; rc.path.shift(); left -= d; } else { rc.x += dx / d * left; rc.y += dy / d * left; left = 0; }
  }
  rc.moving = rc.path.length > 0;
}
function updateChars(dt) {
  const rt = R.rt; if (!rt) return;
  ensureRuntime();
  const t = now();
  Object.keys(R.rc).forEach(k => {
    const ci = +k, c = S.chars[k], rc = R.rc[k]; if (!c) return;
    const ready = c.task && t >= c.task.end, working = c.task && t < c.task.end;
    if (ready) {
      if (rc.inside) { rc.inside = false; const p = planFor(ci, c); if (p && p.dest) { rc.x = tcx(p.dest.x); rc.y = tcy(p.dest.y); } burst(rc.x, rc.y - 10, 6, '✨'); }
      rc.path = []; rc.moving = false; rc.mode = 'ready'; return;
    }
    if (working) {
      if (rc.mode !== 'task' || rc.key !== c.task.start) {
        rc.mode = 'task'; rc.key = c.task.start; rc.inside = false; rc.phase = 'go'; rc.plan = planFor(ci, c);
        if (rc.plan && rc.plan.dest) setPath(rc, rt, rc.plan.dest.x, rc.plan.dest.y);
        rc.leg = 0;
      }
      if (rc.phase === 'in') { rc.moving = false; return; }
      if (rc.phase === 'go' || rc.phase === 'route') {
        stepAlong(rc, dt, 85 * rc.spd);
        if (!rc.path.length) {
          const p = rc.plan;
          if (p.kind === 'e') { rc.phase = 'in'; rc.inside = true; }
          else if (p.kind === 'r') { rc.leg ^= 1; const g = rc.leg ? p.dest2 : p.dest; rc.phase = 'route'; setPath(rc, rt, g.x, g.y); if (!rc.path.length) rc.phase = 'work'; }
          else rc.phase = 'work';
        }
      }
      return;
    }
    // idle
    if (rc.mode !== 'idle') { rc.mode = 'idle'; rc.inside = false; rc.path = []; rc.wait = rnd(0.2, 1.5); }
    if (rc.path.length) { stepAlong(rc, dt, 62 * rc.spd * (rc.sp || 1)); return; }
    rc.moving = false; rc.wait -= dt;
    if (rc.wait <= 0) { const n = idleNext(rc, ci, rt); rc.sp = n.sp; rc.wait = n.pause; setPath(rc, rt, n.t.x, n.t.y); }
  });
}
function replanAll() {  // after the map changes (building placed/moved)
  const rt = R.rt; if (!rt) return;
  Object.keys(R.rc).forEach(k => { const rc = R.rc[k]; if (!rc.inside) { rc.mode = null; rc.path = []; const tx = Math.round((rc.x - TILE / 2) / TILE), ty = Math.round((rc.y - TILE / 2) / TILE); if (rt.blk[ty * rt.W + tx] || !rt.reach[ty * rt.W + tx]) { const f = nearestFree(rt, tx, ty); rc.x = tcx(f.x); rc.y = tcy(f.y); } } });
}

/* ---------- realms (switching / unlocking / completion) ---------- */
function setRealm(ri, silent) {
  S.cur = ri; R.rt = buildRT(ri); R.rc = {}; R.layer = null; R.place = null; placeUi();
  R.sparks = [];
  ensureRuntime();
  const M = R.rt, c = R.cam; c.z = Math.max(0.4, Math.min(.95, R.W / (M.W * TILE) * 1.18));
  focusCam(M.W * TILE / 2, M.H * TILE / 2, c.z);
  if (!silent) save();
  hud();
}
const realmCost = (ri) => ri === 0 ? 0 : Math.round(1000 * T_RC * Math.pow(T_RG, Math.min(ri - 1, 8)) * Math.pow(2.1, Math.max(0, ri - 9)));
function realmReq(ri) {
  const r = REALMS[ri], out = [];
  if (S.lvl < r.lvl) out.push('Level ' + r.lvl);
  if (ri > 0 && hiredIn(ri - 1) < 5) out.push('Recruit 5 folk in ' + REALMS[ri - 1].name + ' (' + hiredIn(ri - 1) + '/5)');
  return out;
}
function unlockRealm(ri) {
  const r = REALMS[ri]; if (S.realms[ri]) return;
  const req = realmReq(ri);
  if (req.length) { toast('Needs: ' + req.join(' + ')); return; }
  if (S.coins < realmCost(ri)) { toast('Need ' + fmt(realmCost(ri)) + ' 🪙'); return; }
  S.coins -= realmCost(ri); S.realms[ri] = true;
  closeSheet(); sfxLevel(); buzz(40);
  setRealm(ri, true);
  announceRealm(ri);
  save();
}
function announceRealm(ri) {
  const r = REALMS[ri];
  if (S.seen['i' + ri]) return; S.seen['i' + ri] = 1;
  story(r.e, r.intro[0], r.intro[1], r.name + ' · ' + realmChars(ri).length + ' folk · 8 buildings · 4 landmarks');
}
function realmDone(ri) { return realmChars(ri).every(c => S.chars[c.id] && friendLvl(S.chars[c.id].fp) >= 3); }
function checkRealm(ri) {
  if (S.done[ri] || !realmDone(ri)) return;
  S.done[ri] = true;
  const r = REALMS[ri], w = 3 + Math.ceil(ri / 2), coin = Math.round(140 * realmMult(ri));
  S.wishes += w; gainCoins(coin); sfxPage(); R.flash = 0.8; buzz(60);
  const found = REALMS.map((x, i) => S.done[i] ? x.word : '…').join(' ');
  story('📜', r.outro[0], r.outro[1], 'Torn pages found: ' + doneCount() + '/13<br><b>' + esc(found) + '</b><br>Reward: +' + w + ' ✨ +' + fmt(coin) + ' 🪙', 'Onward');
  if (doneCount() === REALMS.length) { story('📖', ARC.finale[0], ARC.finale[1], 'Every page is home. The tale never ends — keep playing!', 'The End… for now'); }
}

/* ---------- economy ---------- */
function gainCoins(n) { S.coins += n; S.stats.coins += n; }
function gainXp(n) {
  if (S.lvl >= LVL_CAP) return;
  S.xp += n; let up = 0;
  while (S.lvl < LVL_CAP && S.xp >= xpNeed(S.lvl)) { S.xp -= xpNeed(S.lvl); S.lvl++; up++; }
  if (up) levelUp(S.lvl - up, S.lvl);
}
function levelUp(from, to) {
  sfxLevel(); buzz(60); R.flash = 1; S.wishes += 1;
  const lines = [];
  REALMS.forEach((r, i) => { if (!S.realms[i] && r.lvl > from && r.lvl <= to) lines.push('🗺️ ' + r.name + ' can now be uncovered'); });
  showModal('<div class="big">🎉</div><h2>Level ' + to + '!</h2><p>+1 ✨ Wish</p>' + lines.map(l => '<p>' + l + '</p>').join('') + '<p><button class="btn" onclick="G.closeModal()">Onward!</button></p>');
}

/* ---------- tasks ---------- */
function taskBlock(ci, i) {
  return TaskAccess.block(S, ci, i);
}
function startTask(ci, i, silent) {
  const c = S.chars[ci]; if (!c || c.task) return false;
  const why = taskBlock(ci, i);
  if (why) { if (!silent) toast(why); return false; }
  const t = TASKS[ci][i];
  const start = now();
  c.task = { i, start, end: start + t.dur * 1000 }; c.last = i;
  if (!silent) { sfxStart(); buzz(8); }
  save(); return true;
}
function taskReward(ci, i) {
  const c = S.chars[ci], t = TASKS[ci][i], fl = friendLvl(c.fp);
  return { coin: Math.max(1, t.coin * (1 + 0.05 * (fl - 1)) * coinBonus()), xp: t.xp };
}
function charPos(ci) { const rc = R.rc[ci]; return rc ? { x: rc.x, y: rc.y } : null; }
function collectChar(ci, fromAll) {
  const c = S.chars[ci]; if (!c || !c.task || now() < c.task.end) return false;
  const t = TASKS[ci][c.task.i], ch = CHARS[ci], t0 = now();
  R.combo = (t0 - R.lastCollect < 3600) ? Math.min(R.combo + 1, 10) : 1; R.lastCollect = t0;
  S.stats.combo = Math.max(S.stats.combo, R.combo);
  const cm = 1 + 0.1 * (R.combo - 1), r = taskReward(ci, c.task.i);
  let coin = r.coin * cm, xp = r.xp;
  const twist = Math.random() < 0.08; if (twist) { coin *= 2; xp *= 2; }
  coin = Math.max(1, Math.round(coin)); xp = Math.max(1, Math.round(xp));
  gainCoins(coin);
  const prev = friendLvl(c.fp); c.fp += t.pts;
  if (!c.discoveries) c.discoveries = {};
  const first = !c.discoveries[t.i]; c.discoveries[t.i] = true;
  S.realmWork[ch.realm] = (S.realmWork[ch.realm] || 0) + 1;
  if (first && Object.keys(c.discoveries).length % 9 === 0) {
    const bonus = Math.round(45 * realmMult(ch.realm)); gainCoins(bonus);
    toast(ch.name + ': ' + Object.keys(c.discoveries).length + '/27 memories restored! +' + fmt(bonus) + ' coins', true);
  }
  S.stats.tasks++; S.stats[TIERS[t.tier].key]++;
  const pp = charPos(ci);
  if (pp) { pop(pp.x, pp.y - 36, '+' + fmt(coin) + (twist ? ' TWIST!' : ''), twist ? '#ff3fd0' : '#ffd24a', twist ? 20 : 16); burst(pp.x, pp.y - 10, twist ? 12 : 5, twist ? '✨' : '🪙'); }
  if (Math.random() < [0, 0.03, 0.12][t.tier]) { S.wishes++; if (pp) pop(pp.x, pp.y - 58, '+1 ✨', '#22e3ff', 18); }
  if (twist) toast('✨ Twist! ' + ch.name + ' got double rewards!', true);
  const nfl = friendLvl(c.fp);
  if (nfl > prev) { toast('💞 ' + ch.name + ' → Friendship ' + nfl + '! New tasks unlocked', true); if (pp) burst(pp.x, pp.y, 10, '💖'); }
  S.tale += t.pts; if (S.tale >= TALE_NEED) { S.tale -= TALE_NEED; openChest(); }
  c.task = null;
  sfxCollect(R.combo); buzz(10); gainXp(xp);
  if (nfl > prev) checkRealm(ch.realm);
  if (R.combo >= 3) { const e = $('#combo'); e.textContent = '🔥 COMBO x' + R.combo + '  (+' + Math.round((cm - 1) * 100) + '%)'; e.classList.remove('hidden', 'pop'); void e.offsetWidth; e.classList.add('pop'); }
  if (c.rep && c.last != null) startTask(ci, c.last, true);
  save(); return true;
}
function openChest() {
  S.stats.chests++;
  const coin = Math.round(40 * realmMult(topRealm()) * (1 + S.lvl / 10));
  const w = Math.random() < 0.6 ? 1 + (Math.random() < 0.25 ? 1 : 0) : 0;
  gainCoins(coin); S.wishes += w; sfxLevel(); R.flash = 0.6;
  showModal('<div class="big">🎁</div><h2>Tale Chest!</h2><p>The Tale Meter filled up.</p><p>+' + fmt(coin) + ' 🪙' + (w ? ' &nbsp; +' + w + ' ✨' : '') + '</p><p><button class="btn" onclick="G.closeModal()">Lovely</button></p>');
}
function collectAll() {
  let n = 0; Object.keys(S.chars).forEach(k => { if (collectChar(+k, true)) n++; });
  if (!n) toast('Nothing ready yet — send folk to work!'); save();
}
function sendAll() {
  let n = 0;
  Object.keys(S.chars).forEach(k => {
    const ci = +k, c = S.chars[ci]; if (c.task) return;
    let i = c.last; if (i == null || taskBlock(ci, i)) { i = null; for (let j = 0; j < TASKS[ci].length; j++) if (!taskBlock(ci, j)) { i = j; break; } }
    if (i != null && startTask(ci, i, true)) n++;
  });
  if (n) { sfxStart(); buzz(15); toast('🔁 Sent ' + n + ' to work!'); } else toast('Everyone is already busy!');
}

/* ---------- quests ---------- */
const QT = [
  { k: 'tasks', txt: 'Complete {n} tasks', f: (i) => Math.round(6 * Math.pow(1.55, i)) },
  { k: 'short', txt: 'Finish {n} Quick tasks', f: (i) => Math.round(8 * Math.pow(1.5, i)) },
  { k: 'mid', txt: 'Finish {n} Medium tasks', f: (i) => Math.round(2 * Math.pow(1.5, i)) },
  { k: 'long', txt: 'Finish {n} Long tasks', f: (i) => 1 + i * 2 },
  { k: 'built', txt: 'Own {n} buildings', f: (i) => 2 + i * 4 },
  { k: 'chars', txt: 'Befriend {n} characters', f: (i) => 3 + i * 8 },
  { k: 'realms', txt: 'Uncover {n} realms', f: (i) => 2 + i, max: 19 },
  { k: 'pages', txt: 'Find {n} torn pages', f: (i) => 1 + i, max: 20 },
  { k: 'coins', txt: 'Earn {n} coins in total', f: (i) => Math.round(400 * Math.pow(3.4, i)) },
  { k: 'combo', txt: 'Reach a x{n} combo', f: (i) => [3, 5, 7, 10][i], max: 4 },
  { k: 'sparks', txt: 'Catch {n} lucky sparkles', f: (i) => Math.round(3 * Math.pow(1.7, i)) },
  { k: 'level', txt: 'Reach level {n}', f: (i) => 3 + i * 5, max: 15 },
];
const QUESTS = [];
(function () {
  for (let n = 0; n < 130; n++) {
    const T = QT[n % QT.length], k = Math.floor(n / QT.length);
    if (T.max && k >= T.max) continue;
    const tgt = T.f(k), q = QUESTS.length;
    QUESTS.push({ id: q, k: T.k, target: tgt, text: T.txt.replace('{n}', fmt(tgt)), coin: Math.round(6 * Math.pow(1.09, q)), xp: Math.round(5 * Math.pow(1.07, q)), wish: q % 3 === 2 ? 1 + Math.floor(q / 25) : 0 });
  }
})();
const activeQuests = () => { const kinds = new Set(); return QUESTS.filter(q => { if ((q.k==='chars'&&q.target>100)||(q.k==='built'&&q.target>104)||(q.k==='realms'&&q.target>13)||(q.k==='pages'&&q.target>13)) return false; if (S.qc[q.id] || kinds.has(q.k)) return false; kinds.add(q.k); return true; }); };
function claimQuest(id) {
  const q = QUESTS[id]; if (!q || S.qc[id] || statVal(q.k) < q.target) return;
  S.qc[id] = true; gainCoins(q.coin); S.wishes += q.wish; gainXp(q.xp); sfxLevel();
  toast('📜 Quest done! +' + fmt(q.coin) + '🪙' + (q.wish ? ' +' + q.wish + '✨' : ''), true); renderSheet(); save();
}
const claimable = () => activeQuests().filter(q => statVal(q.k) >= q.target).length;

/* ---------- buying characters ---------- */
function buyChar(ci) {
  const ch = CHARS[ci]; if (S.chars[ci]) return;
  if (!S.realms[ch.realm]) { toast('Uncover ' + REALMS[ch.realm].name + ' first'); return; }
  if (S.coins < ch.cost) { toast('Need ' + fmt(ch.cost) + ' 🪙'); return; }
  S.coins -= ch.cost; S.chars[ci] = mkChar();
  sfxLevel(); buzz(20); closeSheet();
  if (ch.realm !== S.cur) setRealm(ch.realm, true); else ensureRuntime();
  const rc = R.rc[ci]; if (rc) { burst(rc.x, rc.y, 14, '💖'); focusCam(rc.x, rc.y, Math.max(R.cam.z, 1)); }
  story(ch.emoji, ch.name + ' joins you!', ch.back, REALMS[ch.realm].name + ' · befriend them to unlock more tasks', 'Hello!');
  checkRealm(ch.realm); save();
}

/* ======================================================================
   BUILDINGS — placement with door + reachability checks
   ====================================================================== */
function startPlace(k, moving) {
  const rt = R.rt; closeSheet();
  const cx = R.cam.x + R.W / 2 / R.cam.z, cy = R.cam.y + R.H / 2 / R.cam.z, d = bdef(rt.ri, k);
  R.place = { k, tx: Math.round(cx / TILE - d.w / 2), ty: Math.round(cy / TILE - d.h / 2), moving: moving || null };
  placeUi();
}
function placeValid(p) {
  const rt = R.rt; if (!rt) return false;
  const d = bdef(rt.ri, p.k), x = p.tx, y = p.ty, W = rt.W, H = rt.H;
  if (x < 2 || y < 2 || x + d.w > W - 2 || y + d.h > H - 2) return false;
  for (let dy = 0; dy < d.h; dy++) for (let dx = 0; dx < d.w; dx++) if (rt.blk[(y + dy) * W + x + dx]) return false;
  const door = { x: x + (d.w >> 1), y: y + d.h };
  if (door.y > H - 3 || rt.blk[door.y * W + door.x]) return false;
  const test = rt.blk.slice();
  for (let dy = 0; dy < d.h; dy++) for (let dx = 0; dx < d.w; dx++) test[(y + dy) * W + x + dx] = 1;
  const r = bfs(test, W, H, 2, 2);
  if (r.n !== rt.n - d.w * d.h) return false;                 // would seal a pocket
  if (!r.reach[door.y * W + door.x]) return false;
  return rt.doors.every(dd => r.reach[dd.y * W + dd.x]);
}
function placeUi() {
  const p = R.place, bar = $('#placebar');
  if (!p) { bar.classList.add('hidden'); return; }
  const d = bdef(R.rt.ri, p.k), ok = placeValid(p);
  bar.classList.remove('hidden');
  $('#placetxt').innerHTML = d.emoji + ' <b>' + esc(d.name) + '</b><br><span class="small">' + (ok ? 'Tap the map to move it, then ✓' : 'Needs free ground with a clear doorway below') + '</span>';
}
function confirmPlace() {
  const p = R.place; if (!p) return;
  if (!placeValid(p)) { toast('Can\'t place there'); return; }
  const d = bdef(R.rt.ri, p.k);
  if (p.moving) { p.moving.x = p.tx; p.moving.y = p.ty; S.blds.push(p.moving); }
  else {
    if (S.coins < d.cost) { toast('Need ' + fmt(d.cost) + ' 🪙'); return; }
    S.coins -= d.cost; S.blds.push({ uid: S.uid++, r: R.rt.ri, k: p.k, x: p.tx, y: p.ty });
    gainXp(Math.round(d.cost / 18 + 5)); burst((p.tx + d.w / 2) * TILE, (p.ty + d.h / 2) * TILE, 10, '✨'); sfxLevel(); buzz(25);
    toast('🔨 Built ' + d.name + '!');
  }
  R.place = null; R.rt = buildRT(S.cur); replanAll(); placeUi(); save();
}
function cancelPlace() { const p = R.place; if (!p) return; if (p.moving) S.blds.push(p.moving); R.place = null; R.rt = buildRT(S.cur); placeUi(); }
function occupant(b) {
  for (const k of Object.keys(R.rc)) { const rc = R.rc[k], c = S.chars[k]; if (rc.inside && c.task && TASKS[+k][c.task.i].kind === 'e' && TASKS[+k][c.task.i].arg === b.k && CHARS[+k].realm === b.r) return +k; }
  return null;
}

/* ---------- sheets ---------- */
function openSheet(title, fn, live) { R.sheetFn = fn; R.sheetLive = !!live; $('#sheettitle').textContent = title; $('#sheet').classList.remove('hidden'); renderSheet(); }
function renderSheet() { if (R.sheetFn) { const b = $('#sheetbody'), sc = b.scrollTop, wasOpen = $('#sheetbody .folk-story')?.open; b.innerHTML = R.sheetFn(); b.scrollTop = sc; const details=$('#sheetbody .folk-story');if(details && wasOpen)details.open=true; } }
function closeSheet() { R.sheetFn = null; R.sheetLive = false; $('#sheet').classList.add('hidden'); }
let folkRealm = 0, buildRealm = 0;

function showChar(ci) {
  if (!S.chars[ci]) return;
  openSheet(CHARS[ci].emoji + ' ' + CHARS[ci].name, () => {
    const ch = CHARS[ci], c = S.chars[ci], fl = friendLvl(c.fp), tl = TASKS[ci];
    const next = FRIEND_PTS[fl] != null ? FRIEND_PTS[fl] : null, prev = FRIEND_PTS[fl - 1];
    let h = '<div class="small">' + REALMS[ch.realm].e + ' ' + REALMS[ch.realm].name + ' · Friendship ' + fl + (next ? ' <span>(' + (c.fp - prev) + '/' + (next - prev) + ')</span>' : ' (MAX)') + '</div>';
    if (next) h += '<div class="prog"><i style="width:' + Math.round(100 * (c.fp - prev) / (next - prev)) + '%"></i></div>';
    h += '<div class="character-banner">' + StoryArt.portrait(ci) + '<div><div class="eyebrow">STORYBOOK FOLK</div><h2>' + esc(ch.name) + '</h2><span class="small">' + Object.keys(c.discoveries || {}).length + '/27 memories restored</span></div></div>';
    h += '<details class="folk-story"><summary>Read their story</summary><p class="story sm">'+esc(ch.back)+'</p>'+(ch.quote?'<p class="small">“'+esc(ch.quote)+'”</p>':'')+'</details>';
    if(StoryArt.provisional(ci))h+='<p class="small">Provisional art: this character currently reuses a generated sprite. Their task motions and gameplay are active.</p>';
    if (c.task) {
      const t = tl[c.task.i], left = (c.task.end - now()) / 1000;
      if (left > 0) h += '<div class="activity-stage"><canvas id="activity-preview" width="780" height="300" data-ci="'+ci+'" aria-label="'+esc(ch.name)+' performing '+esc(t.name)+'"></canvas><span>'+(t.kind==='e'?'Inside '+REALMS[ch.realm].names[t.arg]:'A moment in '+REALMS[ch.realm].name)+'</span></div>';
      if (left <= 0) h += '<div class="row"><div class="mid"><div class="nm">✅ ' + esc(t.name) + '</div><div class="sub">Done! Tap their bubble or collect here.</div></div><button class="btn cy" onclick="G.collect(' + ci + ')">Collect</button></div>';
      else {
        const pct = 100 * taskProgress(c.task, now()), cost = Math.max(1, Math.ceil(left / 900));
        h += '<div class="row" style="display:block"><div class="nm">' + TIERS[t.tier].icon + ' ' + esc(t.name) + '</div><div class="prog"><i style="width:' + pct.toFixed(1) + '%"></i></div><div style="display:flex;justify-content:space-between;align-items:center"><span class="sub">' + fmtTime(left) + ' left</span><button class="btn sm cy" onclick="G.rush(' + ci + ')">Rush · ' + cost + ' ✨</button></div></div>';
      }
    }
    h += '<label class="small" style="display:block;margin:6px 0"><input type="checkbox" ' + (c.rep ? 'checked' : '') + ' onchange="G.rep(' + ci + ',this.checked)"> ♻️ Auto-repeat last task</label>';
    const revealed=tl.filter(t=>TaskAccess.revealed(S,ci,t.i)).length;
    h+='<div class="mystery-summary"><strong>'+revealed+'/27 activities revealed</strong><span>Sealed tasks reveal their names and animations when their requirements are met.</span></div>';
    const filter=R.taskFilters?.[ci]??-1;
    h += '<p class="small">Quick 30s–5m · Medium 6m–2h · Long 2h 30m–24h</p>';
    h += '<div class="chips task-filters" aria-label="Task duration filters">'+[[-1,'All 27'],[0,'Quick · 9'],[1,'Medium · 9'],[2,'Long · 9']].map(([v,label])=>'<button class="chip'+(filter===v?' on':'')+'" onclick="G.filterTasks('+ci+','+v+')">'+label+'</button>').join('')+'</div>';
    const groups=TaskAccess.groups(S,ci,filter),recommended=!c.task&&S.stats.tasks<12&&!taskBlock(ci,9)?9:null;
    for(const [key,label] of [['available',c.task?'Unlocked tasks':'Available tasks'],['locked','Still to unlock']]){
      const tasks=groups[key];
      if(!tasks.length&&key==='locked')continue;
      h+='<section class="task-group '+key+'" data-task-group="'+key+'"><h3 class="task-group-title">'+label+' <span>'+tasks.length+'</span></h3>';
      if(key==='available'&&c.task)h+='<p class="task-group-hint">Choose your next activity after the current task finishes.</p>';
      if(!tasks.length)h+='<p class="task-group-hint">Meet a requirement below to reveal more activities.</p>';
      [0,1,2].forEach(tier=>{
        const visible=tasks.filter(t=>t.tier===tier);
        if(!visible.length)return;
        if(key==='available'&&recommended!=null)visible.sort((a,b)=>(b.i===recommended)-(a.i===recommended));
        h+='<div class="task-tier-label">'+TIERS[tier].icon+' '+TIERS[tier].label+'</div>';
        visible.forEach(t=>{
          const view=TaskAccess.card(S,ci,t.i);
          if(view.hidden){
            h+='<div class="task t'+tier+' mystery" data-task-id="'+t.i+'" role="group" aria-label="Mysterious task. '+esc(view.requirements.join('. '))+'"><span class="tn"><span class="sealed">✧</span> Mysterious task<span class="mystery-copy">A little more of their tale awaits…</span></span><span class="tr">'+esc(view.requirements.join(' · '))+'</span></div>';
            return;
          }
          const why=taskBlock(ci,t.i),r=taskReward(ci,t.i),tip=recommended===t.i&&key==='available'?'<span class="task-recommendation">A little wonder · ready now</span>':'';
          h+='<button class="task t'+tier+(why?' lock':'')+'" data-task-id="'+t.i+'" onclick="G.start('+ci+','+t.i+')"><span class="tn">'+tip+((c.discoveries||{})[t.i]?'✦ ':'')+KIND_ICON[t.kind]+' '+esc(t.name)+'</span><span class="tr">'+(why?esc(why):'⏱ '+fmtTime(t.dur)+'<br>🪙'+fmt(r.coin)+' · ✦'+fmt(r.xp))+'</span></button>';
        });
      });
      h+='</section>';
    }
    return h;
  }, true);
}
function showFolk() {
  if (!S.realms[folkRealm]) folkRealm = S.cur;
  openSheet('👥 Folk (' + ownedCount() + '/' + CHARS.length + ')', () => {
    let h = '<div class="chips">' + REALMS.map((a, i) => S.realms[i] ? '<button class="chip' + (i === folkRealm ? ' on' : '') + '" onclick="G.folkRealm(' + i + ')">' + a.e + ' ' + a.name + ' ' + hiredIn(i) + '/' + realmChars(i).length + '</button>' : '').join('') + '</div>';
    realmChars(folkRealm).forEach(ch => {
      const own = S.chars[ch.id], busy = own && own.task;
      let right;
      if (own) right = '<button class="btn sm cy" onclick="G.showChar(' + ch.id + ')">Tasks</button>';
      else right = '<button class="btn sm' + (S.coins >= ch.cost ? '' : ' off') + '" onclick="G.buyChar(' + ch.id + ')">🪙 ' + fmt(ch.cost) + '</button>';
      h += '<div class="row"><div class="em" style="' + (own ? '' : 'filter:grayscale(.8) brightness(.8)') + '">' + StoryArt.portrait(ch.id) + '</div><div class="mid"><div class="nm">' + esc(ch.name) + '</div><div class="sub">' + (own ? (busy ? 'Working: ' + esc(TASKS[ch.id][own.task.i].name) : 'Idle') + ' · Friend ' + friendLvl(own.fp) : esc(ch.back.split('.')[0] + '.')) + '</div></div>' + right + '</div>';
    });
    return h;
  });
}
function showBuild() {
  const ri = S.cur;
  openSheet('🔨 Build · ' + REALMS[ri].name, () => {
    let h = '<div class="small" style="margin-bottom:6px">Buildings are where folk go inside to work. Each one unlocks new tasks.</div>';
    for (let k = 0; k < 8; k++) {
      const d = bdef(ri, k), have = bldAt(ri, k);
      const uses = []; realmChars(ri).forEach(ch => TASKS[ch.id].forEach(t => { if (t.kind === 'e' && t.arg === k) uses.push(ch.id); }));
      let right = have ? '<span class="small">✅ Built</span>' : '<button class="btn sm' + (S.coins >= d.cost ? '' : ' off') + '" onclick="G.place(' + k + ')">🪙 ' + fmt(d.cost) + '</button>';
      h += '<div class="row"><div class="em">' + d.emoji + '</div><div class="mid"><div class="nm">' + esc(d.name) + '</div><div class="sub">Opens ' + uses.length + ' task' + (uses.length === 1 ? '' : 's') + ' · +' + d.ench + ' charm</div></div>' + right + '</div>';
    }
    return h;
  });
}
function showQuests() {
  openSheet('📜 Quests', () => {
    let h = trailHTML() + commissionHTML() + '<div class="h3">Town achievements</div><div class="small" style="margin-bottom:8px">Charm: ' + S.blds.length + ' buildings · ' + stars() + '/5 ★ (+' + (stars() * 4) + '% coins)</div>';
    const aq = activeQuests(); if (!aq.length) h += '<p>All quests complete — more tales soon!</p>';
    aq.forEach(q => {
      const v = Math.min(statVal(q.k), q.target), ok = v >= q.target;
      h += '<div class="qrow' + (ok ? ' done' : '') + '"><div class="mid"><div class="nm">' + q.text + '</div><div class="prog"><i style="width:' + (100 * v / q.target) + '%"></i></div><div class="sub">' + fmt(v) + ' / ' + fmt(q.target) + ' · 🪙' + fmt(q.coin) + (q.wish ? ' · ' + q.wish + '✨' : '') + '</div></div>' + (ok ? '<button class="btn cy" onclick="G.claim(' + q.id + ')">Claim</button>' : '') + '</div>';
    });
    return h;
  });
}
function showBook() {
  openSheet('📖 The Torn Storybook', () => {
    const words = REALMS.map((r, i) => S.done[i] ? '<b>' + esc(r.word) + '</b>' : '<span class="blank">____</span>').join(' ');
    let h = '<p class="story sm">' + words + '</p><div class="small" style="margin-bottom:8px">Befriend every folk of a realm to Friendship 3 to find its torn page. Pages found: ' + doneCount() + '/13</div>';
    REALMS.forEach((a, i) => {
      if (!S.realms[i]) { h += '<div class="row"><div class="em">🔒</div><div class="mid"><div class="nm">???</div><div class="sub">A realm not yet uncovered</div></div></div>'; return; }
      const list = realmChars(i);
      h += '<div class="row" style="display:block"><div class="nm">' + a.e + ' ' + a.name + ' <span class="small">' + hiredIn(i) + '/' + realmChars(i).length + (S.done[i] ? ' · 📜 page found' : '') + '</span></div><div style="font-size:22px;letter-spacing:2px;margin-top:4px;word-break:break-all">' + list.map(c => S.chars[c.id] ? c.emoji : '<span style="filter:grayscale(1) brightness(.4)">' + c.emoji + '</span>').join('') + '</div></div>';
    });
    if(doneCount()===REALMS.length)h+='<h2>'+esc(ARC.finale[0])+'</h2><p>'+esc(ARC.finale[1])+'</p>';
    return h;
  });
}
function showRealms() {
  openSheet('🗺️ Realms', () => {
    let h = '';
    REALMS.forEach((a, i) => {
      const un = S.realms[i], req = realmReq(i);
      let ready = 0; if (un) realmChars(i).forEach(c => { const o = S.chars[c.id]; if (o && o.task && now() >= o.task.end) ready++; });
      let right;
      if (un) right = i === S.cur ? '<span class="small">You are here</span>' : '<button class="btn sm cy" onclick="G.travel(' + i + ')">Go' + (ready ? ' · ' + ready + '🪙' : '') + '</button>';
      else right = req.length ? '<span class="small">🔒</span>' : '<button class="btn sm' + (S.coins >= realmCost(i) ? '' : ' off') + '" onclick="G.unlock(' + i + ')">🪙 ' + fmt(realmCost(i)) + '</button>';
      const sub = un ? hiredIn(i) + '/' + realmChars(i).length + ' folk' + (S.done[i] ? ' · 📜 ' + esc(a.word) : '') : (req.length ? 'Needs ' + req.join(', ') : 'Ready to uncover! ' + fmt(realmCost(i)) + ' 🪙');
      h += '<div class="row"><div class="em" style="' + (un ? '' : 'filter:grayscale(1) brightness(.6)') + '">' + StoryArt.realmThumb(i) + '</div><div class="mid"><div class="nm">' + (un || i === 0 || S.realms[i - 1] ? esc(a.name) : '???') + '</div><div class="sub">' + sub + '</div></div>' + right + '</div>';
    });
    return h;
  });
}
function wellReady() { return S.wellDay !== dayKey(); }
function claimWell() {
  if (!wellReady()) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yk = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
  S.streak = (S.day === yk) ? S.streak + 1 : 1; S.day = dayKey(); S.wellDay = dayKey();
  const coin = Math.round(80 * realmMult(topRealm()) * (1 + Math.min(S.streak, 14) * 0.25)), w = 1 + (S.streak % 7 === 0 ? 5 : 0) + (Math.random() < 0.4 ? 1 : 0);
  gainCoins(coin); S.wishes += w; sfxLevel();
  showModal('<div class="big">⛲</div><h2>Wishing Well</h2><p>Day ' + S.streak + ' streak!</p><p>+' + fmt(coin) + ' 🪙 &nbsp; +' + w + ' ✨</p><p class="small">Come back tomorrow. Every 7th day is extra generous.</p><p><button class="btn" onclick="G.closeModal()">Thank you!</button></p>');
  renderSheet(); save();
}
function showMenu() {
  openSheet('⚙️ More', () =>
    '<div class="row"><div class="mid"><div class="nm">100-character campaign</div><div class="sub">Save migration, archived progress and original backup.</div></div><button class="btn sm cy" onclick="G.legacy()">Review</button></div>' +
    '<div class="row"><div class="mid"><div class="nm">Animation studio</div><div class="sub">Revisit the activities your town has unlocked. Future tasks stay sealed.</div></div><a class="btn sm cy" href="art-gallery.html">Visit</a></div>' +
    '<div class="row"><div class="mid"><div class="nm">Development journal</div><div class="sub">What is complete, what is in progress, and what comes next.</div></div><a class="btn sm cy" href="project-status.html">Read</a></div>' +
    '<div class="row"><div class="em">⛲</div><div class="mid"><div class="nm">Wishing Well</div><div class="sub">Daily gift · streak ' + S.streak + '</div></div>' + (wellReady() ? '<button class="btn cy" onclick="G.well()">Wish</button>' : '<span class="small">Tomorrow</span>') + '</div>' +
    '<div class="row"><div class="em">📖</div><div class="mid"><div class="nm">Replay the story</div><div class="sub">Prologue and every realm intro you have seen</div></div><button class="btn sm cy" onclick="G.replay()">Read</button></div>' +
    '<div class="row"><div class="em">🔊</div><div class="mid"><div class="nm">Sound & vibration</div></div><button class="btn sm" onclick="G.toggleSound()">' + (S.sound ? 'On' : 'Off') + '</button></div>' +
    '<div class="row"><div class="em">💾</div><div class="mid"><div class="nm">Backup save</div><div class="sub">Progress lives in this browser only.</div></div><button class="btn sm" onclick="G.exportSave()">Copy</button><button class="btn sm cy" onclick="G.importSave()">Load</button></div>' +
    '<div class="row"><div class="em">🗺️</div><div class="mid"><div class="nm">Progress</div><div class="sub">' + S.realms.filter(Boolean).length + '/13 realms · ' + ownedCount() + '/100 folk · ' + doneCount() + '/13 pages</div></div></div>' +
    '<div class="row"><div class="em">🧹</div><div class="mid"><div class="nm">Start over</div></div><button class="btn sm off" onclick="G.reset()">Reset</button></div>');
}
function showBldInfo(b) {
  const d = bdef(b.r, b.k), oc = occupant(b);
  let line = oc != null ? CHARS[oc].emoji + ' ' + esc(CHARS[oc].name) + ' is inside: ' + esc(TASKS[oc][S.chars[oc].task.i].name) : 'Empty right now.';
  showModal('<div class="big">' + d.emoji + '</div><h2>' + esc(d.name) + '</h2><p>' + line + '</p><p>' + (oc == null ? '<button class="btn cy" onclick="G.moveBld(' + b.uid + ')">Move</button> ' : '') + '<button class="btn sm off" onclick="G.closeModal()">Close</button></p>');
}

/* ---------- camera ---------- */
function worldW() { return R.rt ? R.rt.W * TILE : 1; }
function worldH() { return R.rt ? R.rt.H * TILE : 1; }
function clampCam() {
  const c = R.cam, minZ = Math.max(0.2, Math.min(R.W / worldW(), R.H / worldH()) * 0.9);
  c.z = Math.max(minZ, Math.min(2.4, c.z));
  const vw = R.W / c.z, vh = R.H / c.z, mg = 40;
  c.x = vw >= worldW() + mg * 2 ? (worldW() - vw) / 2 : Math.max(-mg, Math.min(worldW() - vw + mg, c.x));
  c.y = vh >= worldH() + mg * 2 ? (worldH() - vh) / 2 : Math.max(-mg, Math.min(worldH() - vh + mg, c.y));
}
function focusCam(x, y, z) { R.cam.z = z || R.cam.z; R.cam.x = x - R.W / 2 / R.cam.z; R.cam.y = y - R.H / 2 / R.cam.z; clampCam(); }

/* ---------- input ---------- */
const cv = $('#c'), ctx = cv.getContext('2d');
const ptrs = new Map(); let pinchD = 0;
function onResize() { R.dpr = Math.min(window.devicePixelRatio || 1, 2.5); R.W = window.innerWidth; R.H = window.innerHeight; cv.width = R.W * R.dpr; cv.height = R.H * R.dpr; clampCam(); }
cv.addEventListener('pointerdown', (e) => {
  if (ptrs.size >= 2 || (e.pointerType === 'mouse' && e.button !== 0)) return;
  try { cv.setPointerCapture(e.pointerId); } catch (_) {}
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false });
  if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinchD = Math.hypot(a.x - b.x, a.y - b.y); ptrs.forEach(p => p.moved = true); }
});
cv.addEventListener('pointermove', (e) => {
  const p = ptrs.get(e.pointerId); if (!p) return;
  if (ptrs.size === 2) {
    p.x = e.clientX; p.y = e.clientY;
    const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
    if (pinchD > 0 && d > 0) { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, wx = mx / R.cam.z + R.cam.x, wy = my / R.cam.z + R.cam.y; R.cam.z *= d / pinchD; clampCam(); R.cam.x = wx - mx / R.cam.z; R.cam.y = wy - my / R.cam.z; clampCam(); }
    pinchD = d; return;
  }
  const dx = e.clientX - p.x, dy = e.clientY - p.y;
  if (!p.moved && Math.hypot(e.clientX - p.sx, e.clientY - p.sy) > 8) p.moved = true;
  if (p.moved) { R.cam.x -= dx / R.cam.z; R.cam.y -= dy / R.cam.z; clampCam(); }
  p.x = e.clientX; p.y = e.clientY;
});
function pEnd(e) {
  const pointer = ptrs.get(e.pointerId);
  if (!pointer) return;
  ptrs.delete(e.pointerId);
  if (ptrs.size < 2) pinchD = 0;
  const releaseDistance = Math.hypot(e.clientX - pointer.sx, e.clientY - pointer.sy);
  if (e.type === 'pointerup' && !pointer.moved && !ptrs.size && releaseDistance <= 8) {
    tap(e.clientX, e.clientY);
  }
}
cv.addEventListener('pointerup', pEnd);
cv.addEventListener('pointercancel', pEnd);
cv.addEventListener('lostpointercapture', pEnd);
window.addEventListener('blur', () => {
  ptrs.clear();
  pinchD = 0;
});
cv.addEventListener('wheel', (e) => { e.preventDefault(); const wx = e.clientX / R.cam.z + R.cam.x, wy = e.clientY / R.cam.z + R.cam.y; R.cam.z *= e.deltaY < 0 ? 1.1 : 0.9; clampCam(); R.cam.x = wx - e.clientX / R.cam.z; R.cam.y = wy - e.clientY / R.cam.z; clampCam(); }, { passive: false });
// Character-body targets follow the rendered lateral offset. Wide task props
// are intentionally excluded, so a nearby table does not steal a neighbor tap.
function characterHit(ci,rc,wx,wy,zoom,ready){
 const px=rc.x+(rc.off||0),dx=wx-px,dy=wy-rc.y,z=Math.min(1,Math.max(.2,zoom));
 if(ready&&Math.abs(dx)<22&&dy<-20&&dy>-66)return 0;
 if(ci>=32&&(ci<88||ci===97||ci>99)){const d=Math.hypot(dx,dy+8);return d<(ready?34:26)/z?d:null;}
 const giant=ci===89||ci===90,half=(giant?28:24)/z,top=Math.min(giant?-84:-64,-26-half),bottom=Math.max(15,-26+half);
 if(Math.abs(dx)>half||dy<top||dy>bottom)return null;
 return Math.hypot(dx,(dy+26)*.7);
}
function tap(sx, sy) {
  const rt = R.rt, wx = sx / R.cam.z + R.cam.x, wy = sy / R.cam.z + R.cam.y;
  if (R.place) { const d = bdef(rt.ri, R.place.k); R.place.tx = Math.round(wx / TILE - d.w / 2); R.place.ty = Math.round(wy / TILE - d.h / 2); placeUi(); return; }
  for (let i = R.sparks.length - 1; i >= 0; i--) { const s = R.sparks[i]; if (Math.hypot(s.x - wx, s.y - wy) < 34 / Math.min(1, R.cam.z) + 10) { catchSpark(s); R.sparks.splice(i, 1); return; } }
  let best = null, bd = 1e9;
  Object.keys(R.rc).forEach(k => {
    const rc = R.rc[k], c = S.chars[k]; if (rc.inside) return;
    const ready=c.task&&now()>=c.task.end,score=characterHit(+k,rc,wx,wy,R.cam.z,ready);
    if(score!=null&&score<bd){bd=score;best=+k;}
  });
  if (best != null) { const c = S.chars[best]; if (c.task && now() >= c.task.end) { collectChar(best); save(); } else showChar(best); return; }
  for (let i = S.blds.length - 1; i >= 0; i--) {
    const b = S.blds[i]; if (b.r !== rt.ri) continue; const d = bdef(b.r, b.k);
    if (wx >= b.x * TILE && wx <= (b.x + d.w) * TILE && wy >= (b.y - 0.6) * TILE && wy <= (b.y + d.h) * TILE) {
      const oc = occupant(b);
      if (oc != null && now() >= S.chars[oc].task.end) { collectChar(oc); save(); return; }
      showBldInfo(b); return;
    }
  }
  for (const l of rt.lms) if (wx >= l.x * TILE && wx <= (l.x + 3) * TILE && wy >= l.y * TILE && wy <= (l.y + 3.5) * TILE) { toast(l.e + ' ' + l.n); return; }
}
function catchSpark(s) {
  S.stats.sparks++;
  const base = 6 * realmMult(topRealm()) * (1 + S.lvl / 10), roll = Math.random();
  let msg;
  if (roll < 0.07) { S.wishes++; msg = '+1 ✨'; } else if (roll < 0.35) { const x = Math.round(base * 0.6); gainXp(x); msg = '+' + fmt(x) + ' XP'; } else { const c = Math.round(base * rnd(0.8, 1.6)); gainCoins(c); msg = '+' + fmt(c) + ' 🪙'; }
  pop(s.x, s.y - 10, msg, '#22e3ff', 20); burst(s.x, s.y, 10, '✨'); sfxCollect(6); buzz(10); save();
}

/* ---------- simulation ---------- */
function update(dt) {
  R.tick += dt; const t = now();
  updateChars(dt);
  if (t > R.nextSpark && R.rt) {
    R.nextSpark = t + (S.stats.tasks < 24 ? rnd(10000, 18000) : rnd(25000, 70000));
    if (R.sparks.length < 3) { const visible = R.rt.free.filter(i => { const x = tcx(i % R.rt.W), y = tcy((i / R.rt.W)|0); return x > R.cam.x + 50/R.cam.z && x < R.cam.x + (R.W-80)/R.cam.z && y > R.cam.y + 210/R.cam.z && y < R.cam.y + (R.H-180)/R.cam.z; }); const i = pick(visible.length ? visible : R.rt.free); R.sparks.push({ x: tcx(i % R.rt.W), y: tcy((i / R.rt.W) | 0), born: t }); }
  }
  R.sparks = R.sparks.filter(s => t - s.born < 20000);
  if (t > R.nextQuip) { R.nextQuip = t + rnd(60000, 120000); toast('🪶 ' + pick(QUIPS)); }
  R.pops.forEach(p => { p.t += dt; p.y -= 26 * dt; }); R.pops = R.pops.filter(p => p.t < 1.4);
  R.parts.forEach(p => { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt; }); R.parts = R.parts.filter(p => p.t < p.life);
  R.flash = Math.max(0, R.flash - dt * 2);
  if (R.combo && t - R.lastCollect > 4000) { R.combo = 0; $('#combo').classList.add('hidden'); }
}

/* ---------- render ---------- */
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function bubble(x, y, e) {
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ff3fd0'; ctx.lineWidth = 3; rr(x - 17, y - 17, 34, 30, 12); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 5, y + 12); ctx.lineTo(x, y + 20); ctx.lineTo(x + 5, y + 12); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.font = '20px serif'; ctx.fillStyle = '#000'; ctx.fillText(e, x, y - 1);
}
function label(txt, x, y, size) { ctx.font = 'bold ' + (size || 10) + 'px system-ui'; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000b'; ctx.lineWidth = 3; ctx.strokeText(txt, x, y); ctx.fillText(txt, x, y); }
const LS = 2; // static layer scale
function buildLayer(rt) { return StoryArt.world(rt, LS); }
function render() {
  const z = R.cam.z, W = R.W, H = R.H, rt = R.rt;
  ctx.setTransform(R.dpr, 0, 0, R.dpr, 0, 0); ctx.fillStyle = '#142f2c'; ctx.fillRect(0, 0, W, H);
  if (!rt) return;
  if (!R.layer || R.layer.ri !== rt.ri || R.layer.rev !== StoryArt.revision()) R.layer = { ri: rt.ri, rev:StoryArt.revision(), c: buildLayer(rt) };
  ctx.setTransform(R.dpr * z, 0, 0, R.dpr * z, -R.cam.x * z * R.dpr, -R.cam.y * z * R.dpr);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (R.layer.c) ctx.drawImage(R.layer.c, 0, 0, rt.W * TILE, rt.H * TILE); else { ctx.fillStyle = REALMS[rt.ri].ground; ctx.fillRect(0, 0, rt.W * TILE, rt.H * TILE); }
  const tt = R.tick, t = now();
  if (R.place) {
    ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = 2; x <= rt.W - 2; x++) { ctx.moveTo(x * TILE, 2 * TILE); ctx.lineTo(x * TILE, (rt.H - 2) * TILE); }
    for (let y = 2; y <= rt.H - 2; y++) { ctx.moveTo(2 * TILE, y * TILE); ctx.lineTo((rt.W - 2) * TILE, y * TILE); }
    ctx.stroke();
  }
  // buildings + characters depth-sorted
  const items = [];
  S.blds.forEach(b => { if (b.r === rt.ri) items.push({ y: (b.y + bdef(b.r, b.k).h) * TILE, b }); });
  Object.keys(R.rc).forEach(k => { const rc = R.rc[k]; if (!rc.inside) items.push({ y: rc.y + 12, k }); });
  items.sort((a, b) => a.y - b.y);
  const bubbles = [];
  items.forEach(it => {
    if (it.b) {
      const b = it.b, d = bdef(b.r, b.k), x = b.x * TILE, y = b.y * TILE, w = d.w * TILE, h = d.h * TILE, oc = occupant(b);
      StoryArt.building(ctx, x, y, w, h, b.r, b.k, oc != null, tt);
      ctx.fillStyle = 'rgba(30,15,50,.85)'; const dx = x + (d.w >> 1) * TILE; rr(dx + 8, y + h - 16, TILE - 16, 16, 6); ctx.fill();  // doorway
      if (z > 0.7) label(d.name, x + w / 2, y + h + 9, 11);
      if (oc != null) {
        const c = S.chars[oc], left = (c.task.end - t) / 1000, ready = left <= 0;
        if (ready) bubbles.push([x + w / 2, y - 8 + Math.sin(tt * 6 + b.uid) * 4]);
        else {
          const pct = taskProgress(c.task, t), bw = Math.max(w, 62), bx = x + w / 2 - bw / 2, by = y - 26;
          ctx.fillStyle = 'rgba(20,10,40,.88)'; rr(bx, by, bw, 24, 8); ctx.fill();
          ctx.fillStyle = '#22e3ff'; rr(bx + 3, by + 18, (bw - 6) * pct, 3, 1.5); ctx.fill();
          ctx.font = 'bold 11px system-ui'; ctx.fillStyle = '#fff'; ctx.fillText(CHARS[oc].emoji + ' ' + fmtTime(left), x + w / 2, by + 9);
        }
      }
    } else {
      const k = it.k, rc = R.rc[k], c = S.chars[k], ch = CHARS[k], working = c.task && t < c.task.end, ready = c.task && t >= c.task.end;
      const px = rc.x + rc.off, bob = rc.moving ? Math.abs(Math.sin(tt * 9 + rc.bob)) * 5 : (working && rc.phase === 'work' ? Math.sin(tt * 6 + rc.bob) * 2 : 0);
      const task = c.task ? TASKS[k][c.task.i] : null;
      StoryArt.character(ctx, +k, px, rc.y, tt, rc.moving, working, ready, task, rc.facing);
      if (z > 1.05) label(ch.name, px, rc.y + 22, 10);
      if (!working && !ready && ch.quote && z > 0.8 && ((t / 1000 + k * 7.3) % 45) < 4) label('“' + ch.quote + '”', px, rc.y - 36 - bob, 10);
      if (working && z > 0.5) label(TIERS[TASKS[k][c.task.i].tier].icon + ' ' + fmtTime((c.task.end - t) / 1000), px, rc.y - 31 - bob, 10);
      if (ready) bubbles.push([px, rc.y - 40 + Math.sin(tt * 6 + rc.bob) * 4]);
    }
  });
  bubbles.forEach(b => bubble(b[0], b[1], '🪙'));
  R.sparks.forEach(s => { const age = (t - s.born) / 1000, a = age > 15 ? 0.5 + 0.5 * Math.sin(age * 20) : 1; ctx.globalAlpha = a; ctx.font = '34px serif'; ctx.fillStyle = '#fff'; ctx.shadowColor = '#f4d991'; ctx.shadowBlur = 18; ctx.fillText('✨', s.x, s.y + Math.sin(tt * 4 + s.x) * 5); ctx.shadowBlur = 0; ctx.globalAlpha = 1; });
  if (R.place) {
    const p = R.place, d = bdef(rt.ri, p.k), ok = placeValid(p);
    ctx.fillStyle = ok ? 'rgba(23,201,100,.45)' : 'rgba(229,51,90,.5)'; rr(p.tx * TILE, p.ty * TILE, d.w * TILE, d.h * TILE, 10); ctx.fill();
    ctx.fillStyle = ok ? 'rgba(23,201,100,.8)' : 'rgba(229,51,90,.8)'; ctx.fillRect((p.tx + (d.w >> 1)) * TILE + 10, (p.ty + d.h) * TILE + 6, TILE - 20, TILE - 12);
    ctx.globalAlpha = .8; StoryArt.building(ctx, p.tx*TILE, p.ty*TILE, d.w*TILE, d.h*TILE, rt.ri, p.k, false, tt); ctx.globalAlpha = 1;
  }
  R.pops.forEach(p => { ctx.globalAlpha = Math.min(1, 1.5 - p.t); ctx.font = 'bold ' + p.size + 'px system-ui'; ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.fillStyle = p.color; ctx.strokeText(p.text, p.x, p.y); ctx.fillText(p.text, p.x, p.y); ctx.globalAlpha = 1; });
  R.parts.forEach(p => { ctx.globalAlpha = 1 - p.t / p.life; ctx.font = '16px serif'; ctx.fillText(p.e, p.x, p.y); ctx.globalAlpha = 1; });
  if (R.flash > 0) { ctx.setTransform(R.dpr, 0, 0, R.dpr, 0, 0); ctx.fillStyle = 'rgba(255,224,156,' + R.flash * 0.12 + ')'; ctx.fillRect(0, 0, W, H); }
}

/* ---------- HUD ---------- */
function readyCount() { return Object.values(S.chars).filter(c => c.task && now() >= c.task.end).length; }
function hud() {
  $('#lvl').textContent = S.lvl;
  updateJourney();
  const need = xpNeed(S.lvl), pct = S.lvl >= LVL_CAP ? 100 : 100 * S.xp / need;
  $('#xpf').style.width = pct + '%'; $('#xpt').textContent = S.lvl >= LVL_CAP ? 'MAX' : fmt(S.xp) + ' / ' + fmt(need);
  $('#coins').textContent = '🪙 ' + fmt(S.coins); $('#wish').textContent = '✨ ' + S.wishes;
  const st = stars(); $('#ench').textContent = '💖 ' + '★'.repeat(st) + '☆'.repeat(5 - st);
  $('#tf').style.width = (100 * S.tale / TALE_NEED) + '%'; $('#tt').textContent = '🎁 Tale meter ' + S.tale + '/' + TALE_NEED;
  const rb = $('#realmbtn'); if (rb) rb.textContent = REALMS[S.cur].e + ' ' + REALMS[S.cur].name + ' ▾';
  const ready = readyCount(), bc = $('#bdgCollect'); if (ready) { bc.textContent = ready; bc.classList.remove('hidden'); } else bc.classList.add('hidden');
  const cq = claimable(), bq = $('#bdgQuest'); if (cq) { bq.textContent = cq; bq.classList.remove('hidden'); } else bq.classList.add('hidden');
  const bm = $('#bdgMenu'); if (wellReady()) { bm.textContent = '!'; bm.classList.remove('hidden'); } else bm.classList.add('hidden');
  const h = $('#hint'); let msg = '';
  if (S.stats.tasks === 0) msg = '👆 Tap ' + CHARS[0].name + ', then pick a task. Quick ⚡ tasks take under two minutes!';
  else if (S.stats.tasks < 4) msg = '🪙 Tap the bubble over a character to collect. Chain collects for COMBOS!';
  else if (ownedCount() < 2) msg = S.coins >= CHARS[1].cost ? '👥 You can afford a friend! Open Folk to meet ' + CHARS[1].name + '.' : '🪙 Earn ' + fmt(CHARS[1].cost) + ' coins to bring ' + CHARS[1].name + ' home. Longer tasks pay more!';
  else if (S.blds.length === 0 && S.coins >= bdef(0, 0).cost) msg = '🔨 Build the ' + REALMS[0].names[0] + ' — folk walk inside to work and a timer shows on its roof.';
  else if (!S.realms[1] && S.lvl >= REALMS[1].lvl && realmReq(1).length === 0) msg = '🗺️ Open the Realms pill (top) to uncover ' + REALMS[1].name + '!';
  if (msg && now() > R.hintT) { h.textContent = msg; h.classList.add('show'); } else h.classList.remove('show');
}

/* ---------- loop ---------- */
let lastT = now(), saveT = 0, sheetT = 0, hudT = 1;
function frame() {
  const t = now(), dt = Math.min(0.1, (t - lastT) / 1000); lastT = t;
  update(dt); render();
  const preview=$('#activity-preview'); if(preview && preview.dataset && preview.dataset.ci!=null) { const ci=+preview.dataset.ci,c=S.chars[ci]; if(c && c.task)StoryArt.preview(preview,ci,TASKS[ci][c.task.i],R.tick); }
  hudT += dt; if (hudT > 0.2) { hudT = 0; hud(); }
  sheetT += dt; if (sheetT > 0.5) { sheetT = 0; if (R.sheetFn && R.sheetLive && !R.place) renderSheet(); }
  saveT += dt; if (saveT > 6) { saveT = 0; save(); }
  requestAnimationFrame(frame);
}

/* ---------- API ---------- */
function replayStory() {
  story('📖', ARC.prologue[0], ARC.prologue[1]);
  REALMS.forEach((r, i) => { if (S.realms[i]) story(r.e, r.intro[0], r.intro[1]); if (S.done[i]) story('📜', r.outro[0], r.outro[1]); });
  closeSheet();
}
window.G = {
  closeModal, closeSheet, showChar, claimTrail, claimCommission,
  filterTasks: (ci,tier) => { R.taskFilters=R.taskFilters||{};R.taskFilters[ci]=tier;$('#sheetbody').scrollTop=0;renderSheet(); },
  start: (ci, i) => { if (startTask(ci, i)) { closeSheet(); const rc=R.rc[ci]; if(rc)focusCam(rc.x,rc.y-R.H*.08/R.cam.z,Math.max(.9,R.cam.z)); } },
  collect: (ci) => { collectChar(ci); renderSheet(); save(); },
  rush: (ci) => { const c = S.chars[ci]; if (!c || !c.task) return; const left = (c.task.end - now()) / 1000, cost = Math.max(1, Math.ceil(left / 900)); if (S.wishes < cost) { toast('Need ' + cost + ' ✨'); return; } S.wishes -= cost; c.task.end = now(); toast('⚡ Rushed!'); renderSheet(); save(); },
  rep: (ci, v) => { S.chars[ci].rep = !!v; save(); },
  folkRealm: (i) => { folkRealm = i; renderSheet(); },
  buyChar, unlock: unlockRealm, travel: (i) => { closeSheet(); setRealm(i); },
  place: (k) => { const d = bdef(S.cur, k); if (S.coins < d.cost) { toast('Need ' + fmt(d.cost) + ' 🪙'); return; } startPlace(k); },
  claim: claimQuest, well: claimWell, replay: replayStory,
  toggleSound: () => { S.sound = !S.sound; renderSheet(); save(); },
  moveBld: (uid) => { const i = S.blds.findIndex(b => b.uid === uid); if (i < 0) return; const b = S.blds.splice(i, 1)[0]; closeModal(); R.rt = buildRT(S.cur); startPlace(b.k, b); R.place.tx = b.x; R.place.ty = b.y; placeUi(); },
  legacy: showLegacy, legacyClaim: claimLegacy, legacyBackup: () => { const raw=S.legacyArchive?.original||localStorage.getItem(SAVE_KEY+'_pre100'); if(raw)window.prompt('Copy this ORIGINAL pre-100 save code. Import it into v18 to restore that town:',btoa(unescape(encodeURIComponent(raw)))); else toast('No older town is archived'); },
  exportSave: () => { const s = btoa(unescape(encodeURIComponent(JSON.stringify(S)))); (navigator.clipboard ? navigator.clipboard.writeText(s) : Promise.reject()).then(() => toast('💾 Save copied to clipboard'), () => window.prompt('Copy your save code:', s)); },
  importSave: () => { const s = window.prompt('Paste your save code:'); if (!s) return; try { const raw=decodeURIComponent(escape(atob(s.trim()))), o=Campaign.migrate(JSON.parse(raw)); if (!validSave(o)) throw 0; const current=localStorage.getItem(SAVE_KEY); if(current)localStorage.setItem(SAVE_KEY+'_beforeImport',current); if(o.legacyArchive)localStorage.setItem(SAVE_KEY+'_pre100',o.legacyArchive.original); localStorage.setItem(SAVE_KEY, JSON.stringify(o)); location.reload(); } catch (e) { toast('That save code did not work'); } },
  reset: () => { if (window.confirm('Erase everything and start over?')) { localStorage.removeItem(SAVE_KEY); location.reload(); } },
  _state: () => S, _R: R,
  _t: { characterHit, taskBlock, stepAlong, collectChar, startTask, placeValid, confirmPlace, collectAll, update, render, hud, save, showFolk, showBuild, showQuests, showBook, showRealms, showMenu, showChar, QUESTS, sendAll, setRealm, unlockRealm, buyChar, buildRT, genMap, bfs, astar, checkRealm, getPlace: () => R.place, setPlace: (p) => { R.place = p; }, gainCoins, gainXp, MAPS, bldAt },
};

/* These functions are included inside the engine closure by the release script. */
function validSave(s) { return Campaign.valid(s); }
function SaneIndex(v,n){return Number.isInteger(v)&&v>=0&&v<n;}
function migrateEdition(){
 S.edition=42; S.campaign=19; S.trail=Number.isInteger(S.trail)?Math.max(0,Math.min(TRAIL.length,S.trail)):0;
 S.realmWork=S.realmWork||{}; S.commissions=S.commissions||{};
 Object.values(S.chars).forEach(c=>c.discoveries=c.discoveries||{});
}
function trailHTML(){
 const q=TRAIL[S.trail];
 if(!q)return '<div class="trail-card"><div class="eyebrow">PROLOGUE COMPLETE</div><h2>Your story is only beginning</h2><p>Restore thirteen pages, discover 2,700 character activities, and take realm commissions between chapters.</p></div>';
 const v=Math.min(q[3],statVal(q[2])),ok=v>=q[3];
 return '<div class="trail-card"><div class="eyebrow">THE OPENING CHAPTER · '+(S.trail+1)+' / '+TRAIL.length+'</div><h2>'+q[0]+'</h2><p>'+q[1]+'</p><div class="prog"><i style="width:'+100*v/q[3]+'%"></i></div><div class="trail-bottom"><span>'+v+' / '+q[3]+' · '+q[4]+' coins · '+q[5]+' XP</span><button class="btn" onclick="G.claimTrail()">'+(ok?'Claim reward':'Show me')+'</button></div></div>';
}
function claimTrail(){
 const q=TRAIL[S.trail];if(!q)return;
 if(statVal(q[2])<q[3]) { if(q[6]==='folk')showFolk();else if(q[6]==='build')showBuild();else if(q[6]==='realms')showRealms();else closeSheet();return; }
 S.trail++;gainCoins(q[4]);gainXp(q[5]);save();sfxCollect(3);toast('Chapter step complete! +'+q[4]+' coins',true);renderSheet();hud();
}
function commission(ri){
 if(!S.commissions[ri])S.commissions[ri]={round:0,base:S.realmWork[ri]||0};
 const c=S.commissions[ri],target=Math.min(40,6+c.round*2);
 return {c,target,progress:Math.min(target,Math.max(0,(S.realmWork[ri]||0)-c.base)),reward:Math.round((35+target*5)*realmMult(ri))};
}
function commissionHTML(){
 const ri=S.cur,{c,target,progress,reward}=commission(ri),ok=progress>=target;
 return '<div class="h3">Realm commission · '+REALMS[ri].name+'</div><div class="qrow '+(ok?'done':'')+'"><div class="mid"><div class="nm">'+['Preparations for the festival','A favor for every neighbor','Lanterns along the road','Stories worth remembering'][c.round%4]+'</div><div class="sub">Complete '+target+' tasks with folk from this realm. Tasks count after this commission begins.</div><div class="prog"><i style="width:'+100*progress/target+'%"></i></div><div class="sub">'+progress+'/'+target+' · '+fmt(reward)+' coins · Commission '+(c.round+1)+'</div></div>'+(ok?'<button class="btn" onclick="G.claimCommission()">Claim</button>':'')+'</div>';
}
function claimCommission(){
 const {c,target,progress,reward}=commission(S.cur);if(progress<target)return;
 c.round++;c.base=S.realmWork[S.cur]||0;gainCoins(reward);save();toast('Commission delivered! +'+fmt(reward)+' coins',true);renderSheet();hud();
}
function updateJourney(){
 const q=TRAIL[S.trail],b=$('#journey');
 const idle=Object.values(S.chars).filter(c=>!c.task).length;
 b.innerHTML=q?'<span class="eyebrow">STORY TRAIL · '+(S.trail+1)+'/12</span><strong>'+q[0]+'</strong><span class="journey-state">'+(statVal(q[2])>=q[3]?'Claim reward →':Math.min(statVal(q[2]),q[3])+'/'+q[3]+' · Open journal →')+'</span>':'<span class="eyebrow">THE NEXT CHAPTER</span><strong>'+REALMS[S.cur].name+'</strong><span class="journey-state">'+idle+' idle folk · Realm commissions →</span>';
}


function showLegacy(){
 const a=S.legacyArchive,jobs=a?.jobs||[],ready=jobs.filter(j=>!j.claimed&&now()>=j.task.end).length;
 openSheet('Your 100-character story',()=>'<h2>Thirteen realms. One hundred neighbors.</h2><p>The first twelve realms keep eight neighbors each. The Black Forest closes the story with four. Retained progress is unchanged.</p>'+(a?'<p>Your original town and removed content are preserved in your save archive: '+Object.keys(a.chars).length+' characters, '+a.blds.length+' buildings, '+Object.keys(a.done).length+' recovered pages. Archived characters cannot take new jobs. Their existing jobs finish once at their original deadlines, with the saved base payout and friendship points; no random collection bonuses are rolled.</p><p>'+ready+' archived jobs ready; '+jobs.filter(j=>!j.claimed).length+' unclaimed.</p><button class="btn" onclick="G.legacyClaim()">Collect ready archived jobs</button> <button class="btn cy" onclick="G.legacyBackup()">Copy original v18 save</button>':'<p>This town began in the smaller campaign; no content needed archiving.</p>')+'<p>Use More → Backup save to copy your current town, including its archive. Keep the original v18 code separately. Use the same browser and site address when upgrading.</p><button class="btn" onclick="G.closeSheet()">Return to town</button>');
 if(S.scopeNotice){S.scopeNotice=false;save();}
}
function claimLegacy(){const r=Campaign.settle(S,now());if(!r.count){toast('No archived jobs ready yet');return;}gainCoins(r.coin);gainXp(r.xp);save();showLegacy();toast(r.count+' archived jobs collected: +'+fmt(r.coin)+' coins');}

/* ---------- boot ---------- */
function boot() {
  let loaded; try { loaded=load(); } catch(e) { document.body.innerHTML='<main style="padding:30px;color:#fff;background:#173e37"><h1>Your town is protected</h1><p>'+esc(e.message)+'</p><p>No new town has been created. Keep this browser data and your v18 export.</p></main>'; return; } const fresh = !loaded;
  S = loaded || newState();
  migrateEdition();
  if(S.scopeNotice){showLegacy();}
  $('#begin').textContent = fresh ? 'Open the storybook →' : 'Continue your story →';
  $('#begin').onclick = () => { $('#title-screen').classList.add('hidden'); if (fresh) { toast('Welcome, Reader. Your story trail starts with Little Red.', true); showChar(0); } };
  StoryArt.title($('#title-art'));
  $('#journey').onclick = showQuests;
  $('#zoomin').onclick = () => { R.cam.z = Math.min(2, R.cam.z * 1.2); clampCam(); };
  $('#zoomout').onclick = () => { R.cam.z = Math.max(0.45, R.cam.z / 1.2); clampCam(); };
  $('#homecam').onclick = () => focusCam(worldW()/2, worldH()/2, R.cam.z);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (modalOpen) closeModal(); else if (R.place) cancelPlace(); else closeSheet(); } });
  window.addEventListener('resize', onResize); onResize();
  setRealm(Math.min(S.cur || 0, REALMS.length - 1), true);
  $('#sheetclose').onclick = closeSheet;
  $('#btnCollect').onclick = collectAll; $('#btnSend').onclick = sendAll;
  $('#placeYes').onclick = confirmPlace; $('#placeNo').onclick = cancelPlace;
  $('#realmbtn').onclick = () => { if (R.place) cancelPlace(); showRealms(); };
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal' && !MQ.length) closeModal(); });
  document.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => {
    const k = b.dataset.nav; if (R.place) cancelPlace();
    if (k === 'build') showBuild(); else if (k === 'folk') showFolk(); else if (k === 'quests') showQuests(); else if (k === 'book') showBook(); else showMenu();
  });
  if (fresh) { S.seen.i0 = 1; }
  else {
    const away = (now() - S.last) / 1000, rn = readyCount();
    if (S.stats.tasks > 0 && away > 60 && rn) toast('Welcome back! ' + rn + ' task' + (rn > 1 ? 's are' : ' is') + ' ready to collect 🪙', true);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  window.addEventListener('pagehide', save);
  requestAnimationFrame(frame);
}
boot();
})();
