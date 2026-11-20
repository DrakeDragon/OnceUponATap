/* Edition 19: scope is applied after legacy data construction, before engine boot.
   Legacy metadata is private migration input, never a recruitable roster. */
'use strict';
const Campaign = (() => {
 const oldRealms=REALMS.map(r=>({W:r.W,H:r.H}));
 const oldChars=CHARS.map(c=>({name:c.name,realm:c.realm}));
 const oldTasks=TASKS.map(ts=>ts.map(t=>({...t})));
 const index=(v,n)=>Number.isInteger(v)&&v>=0&&v<n;
 const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
 function valid(s,legacy=false){
  const nr=legacy?20:13,nc=legacy?160:100;
  if(!object(s)||s.v!==2||!Array.isArray(s.realms)||!Array.isArray(s.blds)||![s.chars,s.stats,s.qc,s.done,s.seen].every(object))return false;
  if(![s.coins,s.wishes,s.xp,s.lvl,s.uid].every(Number.isFinite)||s.coins<0||s.wishes<0||s.xp<0||!index(s.cur,nr)||!Number.isInteger(s.lvl)||s.lvl<1||s.lvl>80)return false;
  if(s.realms.length>nr||!s.realms.every(x=>typeof x==='boolean')||!s.realms[s.cur])return false;
  if(!s.blds.every(b=>object(b)&&index(b.r,nr)&&index(b.k,8)&&Number.isInteger(b.x)&&Number.isInteger(b.y)&&b.x>=2&&b.y>=2&&b.x+(b.k===7?3:2)<=oldRealms[b.r].W-2&&b.y+2<=oldRealms[b.r].H-2))return false;
  return Object.entries(s.chars).every(([ci,c])=>index(+ci,nc)&&String(+ci)===ci&&object(c)&&Number.isFinite(c.fp)&&c.fp>=0&&(!c.task||(object(c.task)&&index(c.task.i,27)&&Number.isFinite(c.task.start)&&Number.isFinite(c.task.end)&&c.task.end>=c.task.start)));
 }
 function migrate(input){
  if(input?.campaign===19){if(!valid(input))throw Error('This town failed validation. Your stored save has not been replaced.');return input;}
  if(!valid(input,true))throw Error('This older town failed validation. Your stored save has not been replaced.');
  const s=JSON.parse(JSON.stringify(input)), original=JSON.stringify(input);
  const archive={version:1,original,chars:{},blds:[],realms:s.realms.slice(13),done:{},jobs:[],settled:false};
  const starCount=[4,16,40,80,140].filter(n=>s.blds.length>=n).length;
  for(const [id,c] of Object.entries(s.chars))if(+id>=100){
   archive.chars[id]=c;delete s.chars[id];
   if(c.task){const t=oldTasks[id][c.task.i];let fl=1;FRIEND_PTS.forEach((n,i)=>{if(c.fp>=n)fl=i+1;});archive.jobs.push({id:+id,name:oldChars[id].name,tier:t.tier,realm:oldChars[id].realm,task:JSON.parse(JSON.stringify(c.task)),coin:Math.max(1,Math.round(t.coin*(1+.05*(fl-1))*(1+.04*starCount))),xp:t.xp,pts:t.pts,claimed:false});}
  }
  s.blds=s.blds.filter(b=>{if(b.r<13)return true;archive.blds.push(b);return false;});
  for(const k of Object.keys(s.done))if(+k>=13){archive.done[k]=s.done[k];delete s.done[k];}
  s.realms=s.realms.slice(0,13);while(s.realms.length<13)s.realms.push(false);
  if(s.cur>=13)s.cur=Math.max(0,s.realms.lastIndexOf(true));
  s.legacyArchive=archive;s.campaign=19;s.edition=19;s.scopeNotice=true;
  if(!valid(s))throw Error('Migration could not produce a valid town. The original is safe.');
  return s;
 }
 // No gameplay credit is silently lost. Archived jobs finish once at their saved
 // deadlines; the archive remains immutable except its explicit settlement flags.
 function settle(s,time){
  let coin=0,xp=0,count=0;
  for(const j of s.legacyArchive?.jobs||[])if(!j.claimed&&time>=j.task.end){j.claimed=true;coin+=j.coin;xp+=j.xp;count++;const c=s.legacyArchive.chars[j.id];c.fp+=j.pts;c.discoveries=c.discoveries||{};c.discoveries[j.task.i]=true;c.task=null;s.stats.tasks=(s.stats.tasks||0)+1;const tier=TIERS[j.tier].key;s.stats[tier]=(s.stats[tier]||0)+1;s.realmWork=s.realmWork||{};s.realmWork[j.realm]=(s.realmWork[j.realm]||0)+1;}
  return {coin,xp,count};
 }
 const names=['Every','story','needs','a','reader;','every','forgotten','voice','deserves','a','home','within','ours.'];
 REALMS.splice(13);CHARS.splice(100);TASKS.splice(100);ALLC.splice(100);
 REALMS.forEach((r,i)=>{r.word=names[i];r.outro=[i===12?'The Last Page':'Page '+(i+1)+' Found',[
  'Under the Old Oak, a torn page glows: "Every". Quill follows a thin trail of ink toward the candy paths. "Someone wants us to read this."',
  'A roof tile hides the word "story". On the back, a tiny house has been drawn and rubbed out. "A story without a home," Quill murmurs.',
  'The teacup page says "needs". Alice finds the same erased house inside its rim. Someone has been trying to draw a door.',
  'Inside a silver slipper lies "a". The Scarecrow points out that a house needs more than walls. Quill adds a chair to the sketch.',
  'The crocodile finally releases "reader;". A small ink handprint marks the corner. The missing pages were taken by someone very lonely.',
  'The lamp holds "every". Its keeper cannot wish the pages whole, but the bazaar sends lanterns for whoever waits at the end.',
  'The thaw reveals "forgotten". Beneath it is a voice with no name: "Would anyone miss me?" Quill wraps the page in his scarf.',
  'Among the waking roses, "voice" shines through the dust. The court records an invitation for the unknown page-taker.',
  'The stone releases "deserves". The Round Table offers an empty chair. "Even before we know their name," Quill says.',
  'An arrow brings the word "a" and a basket for the journey. The outlaws have voted: nobody should have to steal a welcome.',
  'A crab guards "home". The reef sends a pearl that holds a song. Quill now has enough gifts to fill his own small cottage.',
  'The golden harp shelters "within". From the clouds, Quill spots an ink trail entering the Black Forest. "One page left. And someone to bring home."',
  'At the Mirror Pool, Snow White, Gunther, Dooley and the Queen find the Unwriter: a blank page that tore out stories to build itself a home. The last word is "ours." Quill reads: "Every story needs a reader; every forgotten voice deserves a home within ours." The Queen turns her mirror toward the empty page. For once it shows a beginning. The Reader opens the door, and the Unwriter writes its own first line.'
 ][i]];});
 REALMS[0].intro[1]=REALMS[0].intro[1].replace('twenty realms','thirteen realms');
 REALMS[12].intro=['The Door in the Ink','The forest holds the last torn page. Snow White has found ink footprints by the Mirror Pool. Gunther guards the path, Dooley repairs the bridge, and even the Queen has stopped arguing with her reflection. Quill carries twelve pages and a welcome. "We finish this together."'];
 SENTENCE.splice(0,SENTENCE.length,...names);
 ARC.prologue=['The Storybook Has Been Torn','Thirteen pages are missing from the Gilded Storybook. A hundred familiar folk have lost the paths between their tales. You are the Reader. Quill, a small talking feather, asks you to rebuild their towns, learn their work and follow the ink trail. Someone has taken the pages. Someone is trying to draw a home.'];
 ARC.finale=['A Home Within Our Story','The thirteen pages settle into the binding. The Unwriter takes the empty chair and writes a tale of its own. Across thirteen realms, one hundred neighbors light their windows. The book is whole. Your towns remain open: finish friendships, discover all 2,700 activities and keep building the home you made together.'];
 QUIPS[7]='Quill: "Thirteen pages. A hundred voices. One home worth making."';
 // The final realm has four neighbors; remove generated references to cut partners.
 for(let ci=96;ci<100;ci++)for(const t of TASKS[ci])for(let cut=100;cut<104;cut++)t.name=t.name.replaceAll(oldChars[cut].name,CHARS[96+(ci-96+1)%4].name);
 // Rebalance retained tasks only, after taking the legacy migration snapshot.
 const durationBands = [[30, 300], [360, 7200], [9000, 86400]];
 durationBands.forEach(([lo, hi], tier) => Object.assign(TIERS[tier], {lo, hi}));
 TASKS.forEach((tasks, ci) => {
  for (const task of tasks) {
   if (task.tier === 0) task.dur = Math.max(60, task.dur);
   if (task.i >= 3 && task.i <= 5) {
    // Spread the original Medium trio over the revised range instead of piling up at the cap.
    task.dur = 360 + 60 * Math.round((task.dur - 900) * 114 / 13500);
   }
   if (task.i === 9 && ci < 2) task.dur = 30;
   if (task.i === 16) task.dur = 360;
   if (task.i === 21) task.dur = 9000;
   if (task.i === 16 || task.i === 21) task.unlock = 1;
   const [lo, hi] = durationBands[task.tier];
   task.dur = Math.max(lo, Math.min(hi, task.dur));
  }
 });
 return {valid,migrate,settle,characterCount:100,realmCount:13};
})();
