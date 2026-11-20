/* Once Upon a Tap v2 — derived data: characters, tasks (unique durations/rewards per character), buildings, tuning. */
function h32(a, b) { let h = (Math.imul(a | 0, 374761393) + Math.imul((b | 0) + 7, 668265263) + 1013904223) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return h >>> 0; }
const hf = (a, b) => h32(a, b) / 4294967296;

const NREALM = REALMS.length;
/* tuning knobs (the sim overrides these via window.__*) */
var TUNE = (typeof window !== 'undefined' && window.__TUNE) || {};
const T_CB = TUNE.cb != null ? TUNE.cb : 12, T_CG = TUNE.cg != null ? TUNE.cg : 1.84, T_RC = TUNE.rc != null ? TUNE.rc : 4, T_XK = TUNE.xk != null ? TUNE.xk : 0.4, T_RG = TUNE.rg != null ? TUNE.rg : 2.9, T_RATE = TUNE.rate != null ? TUNE.rate : 1;
const realmMult = (ri) => Math.pow(1.75, ri);   // coin reward scale per realm
const costMult = (ri) => Math.pow(T_CG, ri) * (ri === 0 ? 0.25 : 1 + 1.2 * Math.max(0, 8 - ri) / 8);   // gentle first realm, then slower early realms easing to normal   // character / building cost scale per realm
const xpMult = (ri) => Math.pow(1.22, ri);
const FRIEND_PTS = [0, 10, 30, 70, 140, 250];
const TASK_UNLOCK = [1, 1, 2, 1, 2, 3, 3, 4, 6];
const TIERS = [
  { key: 'short', icon: '⚡', label: 'Quick',  lo: 30,    hi: 300,   rate: 0.030, xr: 0.020*T_XK, pts: 1 },
  { key: 'mid',   icon: '⏳', label: 'Medium', lo: 900,   hi: 14400, rate: 0.036, xr: 0.026*T_XK, pts: 3 },
  { key: 'long',  icon: '🌙', label: 'Long',   lo: 21600, hi: 86400, rate: 0.042, xr: 0.034*T_XK, pts: 8 },
];
const KIND_ICON = { s: '🔧', l: '📍', r: '🚶', e: '🏠' };

const BEMO = [
 '🏡 🥖 🍖 🧺 🏮 🧵 🌱 🗼', '🏠 🍪 🍫 🍭 🎪 🍯 🎨 🏰', '🏡 🫖 🕰️ 🃏 🍄 ❓ 🎯 🗼', '🧱 💆 🏘️ 🔧 🌺 🌪️ 🎭 ⚙️',
 '🌳 🚢 ✨ ⚓ 💰 🪁 🌑 🗻', '⛺ 🌶️ 🧶 🪔 ⛲ 🐪 📚 🕌', '🛖 ☕ ⛸️ 🦌 🧤 🕯️ 🔭 🏛️', '🏡 🧶 🥀 🍲 📖 🛏️ 🔔 🏰',
 '🏠 ⚔️ 🏟️ 🍖 🚩 ⛪ 🔮 🏯', '⛺ 🏹 🍲 🌉 🍽️ 🕳️ 🔥 🏠', '🐚 🦪 🫧 🌿 ☕ 🐋 🎤 🔱', '🏡 🌱 🥚 🎼 💰 🍖 🌬️ ⚓',
 '🛖 🌿 🐦 🪞 🛒 🪵 🚪 🕯️', '🧸 ⚙️ 🪆 🥁 🧱 🔩 🎭 🕰️', '🏠 ♟️ 🪞 🐴 🌷 🏰 ⏳ 👑', '🛖 🍵 🏮 🕊️ 🧵 🏯 🐉 🌕',
 '🛖 🔨 🍺 🦅 🛡️ 📜 ⛵ 🏛️', '🏛️ ☕ 🪤 👞 🔔 📋 🪈 🚪', '🏚️ 🧪 ☕ 🪞 🏰 🌿 🗼 🏴', '📖 🖋️ ✒️ 🗄️ 📚 ☕ 🎨 🏛️',
].map(s => s.split(' '));

const QUIPS = [
  'Quill: "Every page has a story. Some of them are even true."', 'Quill: "Keep them busy and the book keeps healing."',
  'Quill: "Did you know a quill never forgets an ending?"', 'Quill: "Longer tasks pay more per hour. Sleep is a strategy."',
  'Quill: "I am only a tiny feather. You are doing the real work."', 'Quill: "Befriend everyone. Everyone has a middle."',
  'Quill: "That squirrel has opinions. Don\'t ask."', 'Quill: "The twenty pages are out there. I can feel them."',
  'Quill: "Buildings are doors for stories to walk through."', 'Quill: "Tap a sparkle. They do not stay long."',
  'Quill: "If someone is inside, they are working. Probably."', 'Quill: "A realm is finished when its folk are fast friends."',
  'Quill: "The Unwriter is watching, I think. Politely."', 'Quill: "I have been inked. I am fine."',
  'Quill: "Chain your collections. Combos taste like cake."', 'Quill: "There is always one more page."',
];

/* ---------- characters ---------- */
const ALLC = [].concat(CH1, CH2, CH3);
const CHARS = ALLC.map((c, ci) => {
  const ri = REALMS.findIndex(r => r.id === c[2]), j = ci % 8;
  return { id: ci, name: c[0], emoji: c[1], realm: ri, back: c[3], idle: c[4], j, quote: (window.__U && window.__U.Q[c[0]]) || '',
    cost: ci === 0 ? 0 : ri === 0 ? [0,150,320,600,950,1500,2300,3400][j] : Math.round(110 * T_CB * costMult(ri) * Math.pow(1.5, j)) };
});

/* ---------- tasks: unique durations + rewards per character ---------- */
function niceDur(s) {
  if (s < 120) return Math.max(30, Math.round(s / 5) * 5);
  if (s < 3600) return Math.round(s / 60) * 60;
  if (s < 21600) return Math.round(s / 300) * 300;
  return Math.round(s / 900) * 900;
}
const TASKS = ALLC.map((c, ci) => {
  const ri = CHARS[ci].realm, out = [];
  for (let tier = 0; tier < 3; tier++) {
    const T = TIERS[tier];
    const fr = [0, 1, 2].map(n => hf(ci * 31 + tier * 7 + n, 11)).sort((a, b) => a - b);
    if (tier === 0) fr[0] *= 0.45;            // every character has one very quick task (~30s-1.5m)
    // spread: force a gap so the three tasks of a tier differ clearly
    for (let n = 1; n < 3; n++) if (fr[n] < fr[n - 1] + 0.14) fr[n] = Math.min(1, fr[n - 1] + 0.14);
    for (let n = 0; n < 3; n++) {
      const i = tier * 3 + n, raw = c[5][i].split('|');
      const dur = niceDur(T.lo * Math.pow(T.hi / T.lo, fr[n]));
      const cf = 0.9 + hf(ci * 13 + i, 5) * 0.25;
      const code = raw[1];
      out.push({
        i, name: raw[0], code, kind: code[0], arg: code[0] === 'e' || code[0] === 'l' ? +code[1] : code[0] === 'r' ? [+code[1], +code[2]] : null,
        tier, dur, unlock: TASK_UNLOCK[i], pts: T.pts,
        coin: Math.max(1, Math.round(T.rate * dur * realmMult(ri) * cf)),
        xp: Math.max(1, Math.round(T.xr * dur * xpMult(ri))),
      });
    }
  }
  return out;
});
const taskList = (ci) => TASKS[ci];

/* ---------- buildings (8 slots per realm) ---------- */
function bdef(ri, k) {
  return { ri, k, name: REALMS[ri].names[k], emoji: BEMO[ri][k], w: k === 7 ? 3 : 2, h: 2,
    cost: ri === 0 ? [150,290,500,850,1400,2300,3800,6200][k] : Math.round(220 * T_CB * costMult(ri) * Math.pow(1.55, k)), ench: 1 + k };
}
