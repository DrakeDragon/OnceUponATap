/* Gilded Storybook: append-only task IDs preserve v2/v3 saves and active timers. */
'use strict';
const REALM_CRAFT = [
 ['wild berries','moss lanterns','a woodland picnic'],['sugar crystals','gingerbread tiles','the midnight sweet fair'],
 ['painted roses','impossible teacups','the unbirthday procession'],['poppy seeds','emerald mosaics','a yellow-road festival'],
 ['star dust','pirate pennants','the second-star regatta'],['oasis dates','silk lanterns','a thousand-night bazaar'],
 ['snowdrops','aurora candles','the thawing ceremony'],['rose petals','thorn garlands','the waking-day ball'],
 ['lake lilies','round-table banners','the midsummer tournament'],['forest acorns','archery ribbons','the outlaws feast'],
 ['moon pearls','coral charms','the deep-sea chorus'],['cloud beans','golden harp strings','the sky harvest'],
 ['silver apples','raven feathers','the forest vigil'],['clockwork springs','toy ribbons','the midnight parade'],
 ['mirror shards','chess crowns','the backward coronation'],['jade leaves','wish lanterns','the moon-gate celebration'],
 ['rune stones','saga scrolls','the nine-world feast'],['river reeds','bell ribbons','the homecoming concert'],
 ['bramble buds','velvet capes','the reformed villains supper'],['lost letters','gilded bookmarks','the final chapter festival']
];
ALLC.forEach((c,ci) => {
 const ri=CHARS[ci].realm, r=REALMS[ri], own=TASKS[ci], craft=REALM_CRAFT[ri];
 // Preserve all nine original activities; eighteen new authored patterns draw on each
 // character's personal activity, landmarks, local craft, partner and realm festival.
 const partner=CHARS[ri*8+(CHARS[ci].j+1)%8].name;
 const original=c[5].map(x=>x.split('|')[0]);
 const additions=[
  [`Gather ${craft[0]} for ${partner}`,'l2',0,1,ci<2?12:25,'gather'],
  [`Polish ${CHARS[ci].name}'s keepsake from ${r.lm[0][0]}`,'l0',0,1,45,'polish'],
  [`Practice “${original[0]}” with an apprentice`,'s',0,2,80,'signature'],
  [`Sketch ${r.lm[1][0]} in ${CHARS[ci].name}'s journal`,'l1',0,2,120,'draw'],
  [`Arrange ${CHARS[ci].name}'s ${craft[1]} at ${r.lm[3][0]}`,'l3',0,3,180,'craft'],
  [`Deliver a lucky keepsake to ${partner}`,'r01',0,4,240,'carry'],
  [`Prepare ${craft[0]} for supper with ${partner}`,'e1',1,1,300,'cook'],
  [`Teach ${partner}: ${original[1].charAt(0).toLowerCase()+original[1].slice(1)}`,'l2',1,2,600,'teach'],
  [`Make ${craft[1]} for ${partner}'s home`,'e0',1,2,1200,'craft'],
  [`Rehearse “${original[3]}” for visitors`,'l0',1,3,2400,'signature'],
  [`Illustrate ${CHARS[ci].name}'s memory of ${r.lm[3][0]}`,'e6',1,4,3600,'draw'],
  [`Lead ${partner} on a lantern tour of ${r.name}`,'r23',1,5,7200,'lantern'],
  [`Carve ${CHARS[ci].name}'s welcome sign at ${r.lm[0][0]}`,'l0',2,3,10800,'hammer'],
  [`Write a new ending to ${CHARS[ci].name}'s own tale`,'e7',2,4,21600,'write'],
  [`Recreate “${original[6]}” beneath the stars`,'l3',2,4,28800,'signatureLong'],
  [`Fill ${CHARS[ci].name}'s workshop with ${craft[1]}`,'e5',2,5,43200,'craft'],
  [`Keep watch with ${partner} until dawn`,'l1',2,5,57600,'lantern'],
  [`Host ${craft[2]} with ${partner}`,'e7',2,6,86400,'celebrate']
 ];
 additions.forEach(([name,code,tier,unlock,dur,action]) => {
  const i=own.length,T=TIERS[tier];
  own.push({i,name,code,kind:code[0],arg:/[el]/.test(code[0])?+code[1]:code[0]==='r'?[+code[1],+code[2]]:null,
   tier,unlock,dur,action,pts:T.pts,coin:Math.max(tier===0?5:1,Math.round(T.rate*dur*realmMult(ri))),xp:Math.max(1,Math.round(T.xr*dur*xpMult(ri)))});
 });
 own.forEach(t=>{ if(t.tier===0)t.coin=Math.max(t.coin,Math.round(4*realmMult(ri))); });
});
const TRAIL = [
 ['A basket of beginnings','Complete your first task. Open Little Red and choose Gather wild berries.', 'tasks',1,80,4,'folk'],
 ['Every tale needs company','Invite Granny Bramble from Folk.', 'chars',2,100,5,'folk'],
 ['A place to belong','Build a Cottage. Tap free ground and confirm with the check mark.', 'built',1,100,6,'build'],
 ['Three small wonders','Collect three completed tasks.', 'tasks',3,100,8,'folk'],
 ['A light in the leaves','Catch one floating golden sparkle in your town.', 'sparks',1,100,6,'world'],
 ['Hands make a home','Invite a third character.', 'chars',3,140,8,'folk'],
 ['Fresh bread, fresh stories','Build a second building. The Bakehouse opens cooking activities.', 'built',2,160,10,'build'],
 ['A chapter takes shape','Collect twelve completed tasks.', 'tasks',12,220,15,'folk'],
 ['Take a little time','Finish one Medium task. Work continues while you are away.', 'mid',1,250,20,'folk'],
 ['The welcoming committee','Invite five storybook folk.', 'chars',5,350,30,'folk'],
 ['An evening to remember','Complete one Long task.', 'long',1,500,40,'folk'],
 ['Beyond the binding','Uncover Gingerbread Grove when its requirements are met.', 'realms',2,600,50,'realms']
];
