/* Original canvas environments + generated character atlases. No external requests. */
'use strict';
const OPENING_BASE_SCALE=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1.1, 1, 1, 1, 1.06, 1.13, 1.2, 1.15, 1.2, 1.12, 1.2, 1.1, 1.08, 1.12, 1.25];
const OPENING_DETAIL_SCALE=[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.9, 1, 1, 1, 1, 1, 1, 1, 0.75, 1, 1, 0.75];
const OPENING_FOOT=[[0.95625, 0.95625, 0.9625, 0.9625], [0.95625, 0.95625, 0.9625, 0.9625], [0.9625, 0.9625, 0.9625, 0.9625], [0.9625, 0.9625, 0.9625, 0.9625], [0.9625, 0.9625, 0.9625, 0.9625], [0.9625, 0.9625, 0.95625, 0.9625], [0.9625, 0.9625, 0.9625, 0.9625], [0.9625, 0.9625, 0.9625, 0.95625], [0.95625, 0.9625, 0.9625, 0.95625, 0.95625, 0.9625, 0.9625, 0.95625], [0.9625, 0.95625, 0.9625, 0.9625, 0.9625, 0.95625, 0.9625, 0.9625], [0.9625, 0.9625, 0.9625, 0.95625, 0.9625, 0.95625, 0.9625, 0.9625], [0.95625, 0.95625, 0.95625, 0.9625, 0.9625, 0.95625, 0.95625, 0.95625], [0.95625, 0.95625, 0.95625, 0.9625, 0.9625, 0.95625, 0.9375, 0.95625], [0.9625, 0.95625, 0.95625, 0.95625, 0.9625, 0.95625, 0.95625, 0.95625], [0.9625, 0.95625, 0.95625, 0.94375, 0.9625, 0.9625, 0.9625, 0.95625], [0.9625, 0.9625, 0.95625, 0.9625, 0.9625, 0.95625, 0.95625, 0.95625], [0.9625, 0.9625, 0.95625, 0.9625, 0.95625, 0.9625, 0.9625, 0.95625], [0.9625, 0.9625, 0.95625, 0.95625, 0.95625, 0.9625, 0.9625, 0.9625], [0.9625, 0.9625, 0.9625, 0.95625, 0.95, 0.95625, 0.9625, 0.9625], [0.9625, 0.9625, 0.95625, 0.95625, 0.9625, 0.9625, 0.9625, 0.9625], [0.9625, 0.9625, 0.95625, 0.9625, 0.9625, 0.95625, 0.95625, 0.95625], [0.9625, 0.9625, 0.9625, 0.9625, 0.9625, 0.9625, 0.95625, 0.9625], [0.9625, 0.95625, 0.9625, 0.95625, 0.95625, 0.95625, 0.95625, 0.95625], [0.9625, 0.9625, 0.9625, 0.9625, 0.9625, 0.95625, 0.9625, 0.95625]];
const StoryArt=(()=>{
 const palettes=[
 ['#466650','#6c8557','#1d443c','#c6674c'],['#977357','#b29a6c','#585b55','#cf8b85'],
 ['#62657b','#8a8694','#394f57','#b56b8d'],['#4d8163','#7e9d65','#23564d','#60a28f'],
 ['#4b7b70','#849d75','#255b5b','#b97858'],['#a79067','#d0b17b','#547377','#a76c53'],
 ['#8ba6ac','#c0cdd1','#567a94','#839ac2'],['#747c67','#9eaa83','#405c55','#b76b7f'],
 ['#718369','#a8ac7e','#40575c','#6a7f99'],['#4e6e42','#839467','#2d513e','#a78a51'],
 ['#356b7b','#609e9f','#274659','#c68d9b'],['#7fa48d','#b8c7a1','#516e76','#d4aa67'],
 ['#445d51','#72836a','#243f3c','#956f6a'],['#a68b73','#c6af8e','#5e6967','#a85756'],
 ['#777986','#b2b3aa','#455262','#a86c78'],['#5f886e','#a2b68b','#375c55','#b66550'],
 ['#7b9495','#afbaba','#4d6471','#85695c'],['#8b9577','#b3b995','#52655c','#aa7856'],
 ['#666d60','#95967c','#354b48','#8e667b'],['#727770','#aba88c','#3e5858','#8b6560']];
 const sheets=new Map(),extraSheets=new Map(),thumbs=new Map(),ATLAS_LIMIT=4;
 function cachedAtlas(cache,key,url){
  let im=cache.get(key);
  if(im){cache.delete(key);cache.set(key,im);return im;}
  im=new Image();im.src=url;cache.set(key,im);
  while(cache.size>ATLAS_LIMIT)cache.delete(cache.keys().next().value);
  return im;
 }
 let revision=0;
 const scenery=new Image();scenery.onload=()=>{revision++;thumbs.clear();};scenery.src='assets/scenery.webp';
 const gingerScenery=new Image();gingerScenery.onload=()=>{revision++;thumbs.clear();};
 function gingerSprite(g,index,x,y,w,h){
  if(!gingerScenery.src)gingerScenery.src='assets/ginger-scenery.webp?v=18';
  if(!gingerScenery.complete||!gingerScenery.naturalWidth)return false;
  const cw=gingerScenery.naturalWidth/8,ch=gingerScenery.naturalHeight/2;g.drawImage(gingerScenery,index%8*cw,Math.floor(index/8)*ch,cw,ch,x,y,w,h);return true;
 }
 const wonderScenery=new Image();wonderScenery.onload=()=>{revision++;thumbs.clear();};
 function wonderSprite(g,index,x,y,w,h){
  if(!wonderScenery.src)wonderScenery.src='assets/wonder-scenery.webp?v=18';
  if(!wonderScenery.complete||!wonderScenery.naturalWidth)return false;
  const cw=wonderScenery.naturalWidth/8,ch=wonderScenery.naturalHeight/2;g.drawImage(wonderScenery,index%8*cw,Math.floor(index/8)*ch,cw,ch,x,y,w,h);return true;
 }
 const ozScenery=new Image();ozScenery.onload=()=>{revision++;thumbs.clear();};
 function ozSprite(g,index,x,y,w,h){
  if(!ozScenery.src)ozScenery.src='assets/oz-scenery.webp?v=18';
  if(!ozScenery.complete||!ozScenery.naturalWidth)return false;
  const cw=ozScenery.naturalWidth/8,ch=ozScenery.naturalHeight/2;g.drawImage(ozScenery,index%8*cw,Math.floor(index/8)*ch,cw,ch,x,y,w,h);return true;
 }
 const neverScenery=new Image();neverScenery.onload=()=>{revision++;thumbs.clear();};
 function neverSprite(g,index,x,y,w,h){
  if(!neverScenery.src)neverScenery.src='assets/never-scenery.webp?v=18';
  if(!neverScenery.complete||!neverScenery.naturalWidth)return false;
  const cw=neverScenery.naturalWidth/8,ch=neverScenery.naturalHeight/2;g.drawImage(neverScenery,index%8*cw,Math.floor(index/8)*ch,cw,ch,x,y,w,h);return true;
 }
 const nightsScenery=new Image();nightsScenery.onload=()=>{revision++;thumbs.clear();};
 function nightsSprite(g,index,x,y,w,h){
  if(!nightsScenery.src)nightsScenery.src='assets/nights-scenery.webp?v=18';
  if(!nightsScenery.complete||!nightsScenery.naturalWidth)return false;
  const cw=nightsScenery.naturalWidth/8,ch=nightsScenery.naturalHeight/2;g.drawImage(nightsScenery,index%8*cw,Math.floor(index/8)*ch,cw,ch,x,y,w,h);return true;
 }
 const frostScenery=new Image();frostScenery.onload=()=>{revision++;thumbs.clear();};
 function frostSprite(g,index,x,y,w,h){
  if(!frostScenery.src)frostScenery.src='assets/frost-scenery.webp?v=18';
  if(!frostScenery.complete||!frostScenery.naturalWidth)return false;
  const cw=frostScenery.naturalWidth/8,ch=frostScenery.naturalHeight/2;g.drawImage(frostScenery,index%8*cw,Math.floor(index/8)*ch,cw,ch,x,y,w,h);return true;
 }
 const briarScenery=new Image();briarScenery.onload=()=>{revision++;thumbs.clear();};
 function briarSprite(g,index,x,y,w,h){
  if(!briarScenery.src)briarScenery.src='assets/briar-scenery.webp?v=18';
  if(!briarScenery.complete||!briarScenery.naturalWidth)return false;
  const cw=briarScenery.naturalWidth/8,ch=briarScenery.naturalHeight/2;g.drawImage(briarScenery,index%8*cw,Math.floor(index/8)*ch,cw,ch,x,y,w,h);return true;
 }
 const camelotScenery=new Image();camelotScenery.onload=()=>{revision++;thumbs.clear();};
 function camelotSprite(g,index,x,y,w,h){
  if(!camelotScenery.src)camelotScenery.src='assets/camelot-scenery.webp?v=18';
  if(!camelotScenery.complete||!camelotScenery.naturalWidth)return false;
  const cw=camelotScenery.naturalWidth/8,ch=camelotScenery.naturalHeight/2;g.drawImage(camelotScenery,index%8*cw,Math.floor(index/8)*ch,cw,ch,x,y,w,h);return true;
 }
 const deepScenery=new Image();deepScenery.onload=()=>{revision++;thumbs.clear();};
 const DEEP_SCENERY_BOUNDS=[[12, 80, 232, 226], [12, 88, 232, 218], [12, 97, 232, 209], [12, 150, 232, 156], [12, 65, 232, 241], [12, 66, 232, 240], [12, 83, 232, 223], [12, 81, 232, 225], [12, 94, 232, 212], [12, 89, 232, 217], [12, 57, 232, 249], [12, 122, 232, 184], [12, 23, 232, 283], [30, 14, 196, 292], [12, 148, 232, 158], [12, 148, 232, 158]];
 function deepSprite(g,index,x,y,w,h){
  const b=DEEP_SCENERY_BOUNDS[index];if(!b)return false;
  if(!deepScenery.src)deepScenery.src='assets/deep-scenery.webp?v=34';
  if(!deepScenery.complete||deepScenery.naturalWidth!==2048||deepScenery.naturalHeight!==640)return false;
  const scale=Math.min(w/b[2],h/b[3]),dw=b[2]*scale,dh=b[3]*scale;
  g.drawImage(deepScenery,index%8*256+b[0],Math.floor(index/8)*320+b[1],b[2],b[3],x+(w-dw)/2,y+h-dh,dw,dh);return true;
 }
 const skyScenery=new Image();skyScenery.onload=()=>{revision++;thumbs.clear();};
 const SKY_SCENERY_BOUNDS=[[12, 83, 232, 223], [12, 93, 232, 213], [12, 73, 232, 233], [12, 89, 232, 217], [12, 45, 232, 261], [12, 94, 232, 212], [12, 14, 232, 292], [12, 137, 232, 169], [12, 61, 232, 245], [12, 42, 232, 264], [12, 52, 232, 254], [12, 17, 232, 289], [12, 88, 232, 218], [34, 14, 187, 292], [12, 140, 232, 166], [12, 177, 232, 129]];
 function skySprite(g,index,x,y,w,h){
  const b=SKY_SCENERY_BOUNDS[index];if(!b)return false;
  if(!skyScenery.src)skyScenery.src='assets/sky-scenery.webp?v=35';
  if(!skyScenery.complete||skyScenery.naturalWidth!==2048||skyScenery.naturalHeight!==640)return false;
  const scale=Math.min(w/b[2],h/b[3]),dw=b[2]*scale,dh=b[3]*scale;
  g.drawImage(skyScenery,index%8*256+b[0],Math.floor(index/8)*320+b[1],b[2],b[3],x+(w-dw)/2,y+h-dh,dw,dh);return true;
 }
 const forestScenery=new Image();forestScenery.onload=()=>{revision++;thumbs.clear();};
 const FOREST_SCENERY_BOUNDS=[[12, 102, 232, 204], [12, 106, 232, 200], [21, 14, 213, 292], [12, 75, 232, 231], [12, 119, 232, 187], [12, 105, 232, 201], [12, 105, 232, 201], [40, 14, 176, 292], [12, 76, 232, 230], [12, 102, 232, 204], [12, 163, 232, 143], [12, 111, 232, 195], [12, 86, 232, 220], [12, 32, 232, 274], [12, 141, 232, 165], [12, 161, 232, 145]];
 function forestSprite(g,index,x,y,w,h){
  const b=FOREST_SCENERY_BOUNDS[index];if(!b)return false;
  if(!forestScenery.src)forestScenery.src='assets/forest-scenery.webp?v=36';
  if(!forestScenery.complete||forestScenery.naturalWidth!==2048||forestScenery.naturalHeight!==640)return false;
  const scale=Math.min(w/b[2],h/b[3]),dw=b[2]*scale,dh=b[3]*scale;
  g.drawImage(forestScenery,index%8*256+b[0],Math.floor(index/8)*320+b[1],b[2],b[3],x+(w-dw)/2,y+h-dh,dw,dh);return true;
 }
 const sherwoodScenery=new Image();sherwoodScenery.onload=()=>{revision++;thumbs.clear();};
 const SHERWOOD_SCENERY_BOUNDS=[[12, 114, 232, 192], [12, 117, 232, 189], [12, 125, 232, 181], [12, 188, 232, 118], [12, 179, 232, 127], [12, 142, 232, 164], [18, 14, 220, 292], [12, 150, 232, 156], [12, 131, 232, 175], [12, 185, 232, 121], [12, 156, 232, 150], [12, 155, 232, 151], [12, 94, 232, 212], [12, 44, 232, 262], [12, 138, 232, 168], [12, 155, 232, 151]];
 function sherwoodSprite(g,index,x,y,w,h){
  const b=SHERWOOD_SCENERY_BOUNDS[index];if(!b)return false;
  if(!sherwoodScenery.src)sherwoodScenery.src='assets/sherwood-scenery.webp?v=33';
  if(!sherwoodScenery.complete||sherwoodScenery.naturalWidth!==2048||sherwoodScenery.naturalHeight!==640)return false;
  const scale=Math.min(w/b[2],h/b[3]),dw=b[2]*scale,dh=b[3]*scale;
  g.drawImage(sherwoodScenery,index%8*256+b[0],Math.floor(index/8)*320+b[1],b[2],b[3],x+(w-dw)/2,y+h-dh,dw,dh);return true;
 }
 const woodScenery=new Image();woodScenery.onload=()=>{revision++;thumbs.clear();};
 function woodSprite(g,index,x,y,w,h){
  if(!woodScenery.src)woodScenery.src='assets/wood-scenery.webp?v=18';
  if(!woodScenery.complete||!woodScenery.naturalWidth)return false;
  const cw=woodScenery.naturalWidth/8,ch=woodScenery.naturalHeight/2;g.drawImage(woodScenery,index%8*cw,Math.floor(index/8)*ch,cw,ch,x,y,w,h);return true;
 }
 function sprite(g,index,x,y,w,h){if(!scenery.complete||!scenery.naturalWidth)return false;const cw=scenery.naturalWidth/8,ch=scenery.naturalHeight/4;g.drawImage(scenery,index%8*cw,Math.floor(index/8)*ch,cw,ch,x,y,w,h);return true;}
 const rows=ri=>ri===0?4:8;
 function sheet(ri){return cachedAtlas(sheets,ri,'assets/folk-'+String(ri).padStart(2,'0')+'.webp?v='+(ri===4?'25':'18'));}
 const work=new Image();work.src='assets/wood-work.webp';
 const activities=new Image();activities.src='assets/wood-activities.webp?v=18';
 const woodDetails=new Image();
 const gingerDetails=new Image();
 const wonderDetails=new Image();
 function wonderDetailImage(){if(!wonderDetails.src)wonderDetails.src='assets/wonder-details.webp?v=22';return wonderDetails;}
 function gingerDetailImage(){if(!gingerDetails.src)gingerDetails.src='assets/ginger-details.webp?v=20';return gingerDetails;}
 function woodDetailImage(){if(!woodDetails.src)woodDetails.src='assets/wood-details.webp?v=18';return woodDetails;}
 function activityImage(ri){
  if(ri===0)return activities;
  const prefix={1:'ginger',2:'wonder',3:'oz',4:'never',5:'nights',6:'frost',7:'briar',8:'camelot',9:'sherwood',10:'deep',11:'sky',12:'forest'}[ri];
  return prefix?cachedAtlas(extraSheets,ri,'assets/'+prefix+'-activities.webp?v='+(ri===12?'32':ri===11?'31':ri===10?'29':ri===9?'27':ri===3?'25':'18')):null;
 }

 function oval(g,x,y,rx,ry,color){g.fillStyle=color;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();}
 function box(g,x,y,w,h,c,r=3){g.fillStyle=c;g.beginPath();g.roundRect(x,y,w,h,r);g.fill();}
 function poly(g,pts,c){g.fillStyle=c;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.fill();}
 function line(g,x,y,xx,yy,c,w=2){g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(xx,yy);g.stroke();}
 function tree(g,x,y,s,ri,n=0){
  if(ri===12&&forestSprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  if(ri===11&&skySprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  if(ri===10&&deepSprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  if(ri===9&&sherwoodSprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  if(ri===0&&woodSprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  if(ri===8&&camelotSprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  if(ri===7&&briarSprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  if(ri===6&&frostSprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  if(ri===5&&nightsSprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  if(ri===4&&neverSprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  if(ri===3&&ozSprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  if(ri===2&&wonderSprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  if(ri===1&&gingerSprite(g,12+n%2,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  const nature=[0,4,5,0,3,3,2,0,0,1,6,0,1,0,5,7,2,0,1,0][ri];
  if(ri!==19&&sprite(g,8+nature,x-s*.62,y-s*.85,s*1.24,s*1.45))return;
  const p=palettes[ri];oval(g,x+s*.15,y+s*.46,s*.58,s*.2,'#152d2c40');
  box(g,x-s*.08,y-s*.3,s*.17,s*.75,'#725d43',2);line(g,x,y,x-s*.25,y-s*.3,'#765f42',s*.06);
  if([6,16].includes(ri)){
   for(let j=0;j<3;j++){poly(g,[[x-s*(.34+j*.08),y-s*.1+j*s*.22],[x,y-s*.95+j*s*.2],[x+s*(.34+j*.08),y-s*.1+j*s*.22]],j%2?'#c3d0ca':p[2]);}
  }else if(ri===19){box(g,x-s*.35,y-s*.65,s*.7,s*.95,'#715942');for(let i=0;i<4;i++){line(g,x-s*.32,y-s*.42+i*s*.2,x+s*.32,y-s*.42+i*s*.2,'#d6b58a',2);for(let j=0;j<5;j++)box(g,x-s*.28+j*s*.12,y-s*.6+i*s*.2,s*.09,s*.16,[p[2],p[3],'#b89a58'][j%3],1);}}
  else {for(let j=0;j<5;j++){const a=j*2.4;oval(g,x+Math.cos(a)*s*.2,y-s*.4+Math.sin(a)*s*.2,s*.35,s*.28,j%2?p[2]:p[0]);}oval(g,x-s*.12,y-s*.55,s*.3,s*.23,p[1]+'c0');}
  if(ri===1){oval(g,x,y-s*.5,s*.36,s*.36,['#dab9a3','#aa6975','#e4d0a1'][n%3]);line(g,x-s*.2,y-s*.6,x+s*.2,y-s*.4,'#f5dfc4',s*.08);}
 }
 function rock(g,x,y,s){oval(g,x,y+s*.14,s*.5,s*.18,'#23393240');poly(g,[[x-s*.44,y+s*.12],[x-s*.32,y-s*.22],[x+s*.07,y-s*.4],[x+s*.4,y-s*.16],[x+s*.46,y+s*.13]],'#87918a');poly(g,[[x-s*.32,y-s*.22],[x+s*.07,y-s*.4],[x+s*.3,y-s*.1],[x-s*.1,y-s*.04]],'#a8ada1');}
 function building(g,x,y,w,h,ri,k,busy=false,t=0){
  if(ri===12&&forestSprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42))return;
  if(ri===11&&skySprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42))return;
  if(ri===10&&deepSprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42)){if(busy&&k===2){for(let j=0;j<3;j++){const by=y-h*.25-j*6-(t*5%6);oval(g,x+w*.55+Math.sin(t+j)*2,by,2+j,2+j,'#b8e8ee55');}}return;}
  if(ri===9&&sherwoodSprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42)){if(busy&&(k===2||k===6)){for(let j=0;j<3;j++)oval(g,x+w*.55+Math.sin(t+j)*2,y-h*.3-j*6-(t*5%6),2+j,1+j,'#fff0cc55');}return;}
  if(ri===0&&woodSprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42)){if(busy){for(let j=0;j<3;j++)oval(g,x+w*.7+Math.sin(t+j)*2,y-h*.3-j*6-(t*5%6),3+j,2+j,'#fff0cc55');}return;}
  if(ri===8&&camelotSprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42))return;
  if(ri===7&&briarSprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42)){if(busy){for(let j=0;j<3;j++)oval(g,x+w*.7+Math.sin(t+j)*2,y-h*.3-j*6-(t*5%6),3+j,2+j,'#fff0cc55');}return;}
  if(ri===6&&frostSprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42)){if(busy){for(let j=0;j<3;j++)oval(g,x+w*.7+Math.sin(t+j)*2,y-h*.3-j*6-(t*5%6),3+j,2+j,'#fff0cc55');}return;}
  if(ri===5&&nightsSprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42)){if(busy){for(let j=0;j<3;j++)oval(g,x+w*.7+Math.sin(t+j)*2,y-h*.3-j*6-(t*5%6),3+j,2+j,'#fff0cc55');}return;}
  if(ri===4&&neverSprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42)){if(busy){for(let j=0;j<3;j++)oval(g,x+w*.7+Math.sin(t+j)*2,y-h*.3-j*6-(t*5%6),3+j,2+j,'#fff0cc55');}return;}
  if(ri===3&&ozSprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42)){if(busy){for(let j=0;j<3;j++)oval(g,x+w*.7+Math.sin(t+j)*2,y-h*.3-j*6-(t*5%6),3+j,2+j,'#fff0cc55');}return;}
  if(ri===2&&wonderSprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42)){if(busy){for(let j=0;j<3;j++)oval(g,x+w*.7+Math.sin(t+j)*2,y-h*.3-j*6-(t*5%6),3+j,2+j,'#fff0cc55');}return;}
  if(ri===1&&gingerSprite(g,k,x-w*.06,y-h*.39,w*1.12,h*1.42)){if(busy){for(let j=0;j<3;j++)oval(g,x+w*.7+Math.sin(t+j)*2,y-h*.3-j*6-(t*5%6),3+j,2+j,'#fff0cc55');}return;}
  const special=ri===6?24:ri===3?25:ri===5?26:ri===4?27:ri===14?28:ri===11?31:null;
  if(sprite(g,k===7&&special!==null?special:k,x-w*.06,y-h*.39,w*1.12,h*1.42)){
   if(busy){for(let j=0;j<3;j++)oval(g,x+w*.7+Math.sin(t+j)*2,y-h*.3-j*6-(t*5%6),3+j,2+j,'#fff0cc55');}return;
  }
  const p=palettes[ri];g.save();g.translate(x+w/2,y+h*.52);g.scale(w/84,h/76);
  oval(g,4,28,43,13,'#17302c44');box(g,-34,-6,68,42,'#c6b08a');poly(g,[[24,-6],[35,-13],[35,33],[24,37]],'#9f8b70');
  box(g,-29,0,53,30,'#e2cd9e');line(g,-26,26,23,26,'#a58e68',2);
  if(ri===10){oval(g,0,-7,37,25,'#cda4a7');for(let j=-2;j<=2;j++)line(g,j*12,9,j*5,-28,'#f1ced1',2);}
  else if(ri===5||ri===15){box(g,-36,-13,72,10,p[3]);oval(g,0,-16,27,25,p[3]);poly(g,[[-31,-9],[0,-49],[31,-9]],p[3]);oval(g,0,-48,3,3,'#e3bc68');}
  else {poly(g,[[-42,0],[-3,-43],[42,0]],p[2]);poly(g,[[-42,0],[-3,-43],[4,-38],[-33,3]],p[1]);for(let q=0;q<4;q++)line(g,-30+q*7,-q*6,30-q*7,-q*6,p[0],1.5);box(g,18,-30,9,17,'#ab9b7e');box(g,16,-32,13,4,'#d5c39a');}
  if(k===7){box(g,-13,-39,25,30,'#dacba6');poly(g,[[-19,-36],[0,-68],[19,-36]],p[3]);box(g,-4,-30,8,13,'#a0ced0');line(g,0,-69,0,-81,'#d9c38b',2);poly(g,[[0,-81],[19,-75],[0,-71]],p[3]);}
  box(g,-7,8,15,29,'#5c5548',7);box(g,-4,13,9,22,'#806a4f',4);oval(g,3,26,1.2,1.2,'#f6d88c');
  [-23,19].forEach(wx=>{box(g,wx-6,4,12,14,'#6a6857');box(g,wx-4,6,8,10,busy?'#ffe1a0':'#c8dcb9');line(g,wx,5,wx,17,'#8a7757',1);line(g,wx-5,11,wx+5,11,'#8a7757',1);});
  if(k===1){box(g,-29,22,56,7,p[3]);for(let q=0;q<6;q++)box(g,-28+q*9,22,4,7,'#e2c7a0',0);}
  if(k===4){line(g,24,0,24,-21,'#735b44',3);oval(g,24,-23,6,8,'#f2cc75');}
  if(busy){g.globalAlpha=.3;for(let j=0;j<3;j++)oval(g,22+Math.sin(t*2+j)*3,-35-j*7-(t*7%7),5+j,3+j,'#e9e6cf');}
  g.restore();
 }
 function landmark(g,l,ri,T){
  const x=(l.x+1.5)*T,y=(l.y+1.65)*T,p=palettes[ri],n=l.n.toLowerCase();
  oval(g,x,y+T*.75,T*1.35,T*.48,'#233b3430');
  let index=/oak|tree/.test(n)?16:/well|fountain/.test(n)?17:/mushroom|toadstool/.test(n)?18:/stump/.test(n)?19:/rose|thorn/.test(n)?20:/tea|table/.test(n)?21:/shelf|library/.test(n)?23:/ice|aurora/.test(n)?24:/emerald/.test(n)?25:/palace|bazaar/.test(n)?26:/pirate|skull/.test(n)?27:/mirror/.test(n)?28:/lamp/.test(n)?29:/rune/.test(n)?30:/cloud/.test(n)?31:22;
  const deepIndex=ri===10?REALMS[10].lm.findIndex(lm=>lm[0]===l.n):-1;
  const skyIndex=ri===11?REALMS[11].lm.findIndex(lm=>lm[0]===l.n):-1;
  const forestIndex=ri===12?REALMS[12].lm.findIndex(lm=>lm[0]===l.n):-1;
  const sherwoodIndex=ri===9?REALMS[9].lm.findIndex(lm=>lm[0]===l.n):-1;
  const gingerIndex=ri===1?REALMS[1].lm.findIndex(lm=>lm[0]===l.n):-1;
  const wonderIndex=ri===2?REALMS[2].lm.findIndex(lm=>lm[0]===l.n):-1;
  const ozIndex=ri===3?REALMS[3].lm.findIndex(lm=>lm[0]===l.n):-1;
  const neverIndex=ri===4?REALMS[4].lm.findIndex(lm=>lm[0]===l.n):-1;
  const nightsIndex=ri===5?REALMS[5].lm.findIndex(lm=>lm[0]===l.n):-1;
  const frostIndex=ri===6?REALMS[6].lm.findIndex(lm=>lm[0]===l.n):-1;
  const briarIndex=ri===7?REALMS[7].lm.findIndex(lm=>lm[0]===l.n):-1;
  const camelotIndex=ri===8?REALMS[8].lm.findIndex(lm=>lm[0]===l.n):-1;
  const woodIndex=ri===0?REALMS[0].lm.findIndex(lm=>lm[0]===l.n):-1;
  const illustrated=ri===12?forestSprite(g,8+Math.max(0,forestIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):ri===11?skySprite(g,8+Math.max(0,skyIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):ri===10?deepSprite(g,8+Math.max(0,deepIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):ri===9?sherwoodSprite(g,8+Math.max(0,sherwoodIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):ri===0?woodSprite(g,8+Math.max(0,woodIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):ri===8?camelotSprite(g,8+Math.max(0,camelotIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):ri===7?briarSprite(g,8+Math.max(0,briarIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):ri===6?frostSprite(g,8+Math.max(0,frostIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):ri===5?nightsSprite(g,8+Math.max(0,nightsIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):ri===4?neverSprite(g,8+Math.max(0,neverIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):ri===3?ozSprite(g,8+Math.max(0,ozIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):ri===2?wonderSprite(g,8+Math.max(0,wonderIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):ri===1?gingerSprite(g,8+Math.max(0,gingerIndex),x-T*1.5,y-T*1.7,T*3,T*2.8):sprite(g,index,x-T*1.5,y-T*1.7,T*3,T*2.8);
  if(illustrated){}
  else if(/tree|oak|palm|thorn|rose|poppy|field|reeds|garden|vine|stalk/.test(n)){tree(g,x,y,T*1.6,ri);}
  else if(/well|fountain|lagoon|pond|pool|lake/.test(n)){
   oval(g,x,y+T*.25,T*1.04,T*.6,'#bac1a0');oval(g,x,y+T*.2,T*.88,T*.43,'#558b91');oval(g,x-T*.15,y+T*.08,T*.55,T*.15,'#8dbab2');box(g,x-T*.1,y-T*.6,T*.2,T*.85,'#cfc7a2');oval(g,x,y-T*.6,T*.48,T*.18,'#dcd4ae');
  }else if(/rock|stump|shard|stone|cave|hole/.test(n)){rock(g,x,y+T*.25,T*1.7);oval(g,x,y+T*.35,T*.43,T*.25,'#324c48');}
  else if(/table|tea|feast/.test(n)){box(g,x-T*.8,y+T*.2,T*1.6,T*.28,'#b4996b');for(let q=-1;q<=1;q++){oval(g,x+q*T*.5,y+T*.2,T*.15,T*.08,'#ebdfba');}box(g,x-T*.6,y+T*.45,T*.12,T*.4,'#786346');box(g,x+T*.5,y+T*.45,T*.12,T*.4,'#786346');}
  else {building(g,x-T*1.2,y-T*.8,T*2.4,T*1.7,ri,7);}
  g.textAlign='center';g.textBaseline='middle';g.font='600 '+T*.25+'px Georgia';g.lineWidth=T*.08;g.strokeStyle='#243b36';g.strokeText(l.n,x,(l.y+3.02)*T);g.fillStyle='#f4e8bd';g.fillText(l.n,x,(l.y+3.02)*T);
  oval(g,(l.door.x+.5)*T,(l.door.y+.5)*T,T*.13,T*.08,'#f4d99888');
 }
 function world(rt,scale=1){
  const cv=document.createElement('canvas'),T=TILE*scale,W=rt.W,H=rt.H,M=rt.M,ri=rt.ri,p=palettes[ri];cv.width=W*T;cv.height=H*T;const g=cv.getContext('2d');
  let seed=ri*129+37;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  const grad=g.createLinearGradient(0,0,W*T,H*T);grad.addColorStop(0,p[1]);grad.addColorStop(1,p[0]);g.fillStyle=grad;g.fillRect(0,0,cv.width,cv.height);
  if(ri===5){
   g.strokeStyle='#e9ce9828';g.lineWidth=T*.12;
   for(let j=0;j<10;j++){const yy=(j+.4)*H*T/10;g.beginPath();g.moveTo(0,yy);g.bezierCurveTo(W*T*.3,yy-T*1.4,W*T*.7,yy+T*1.1,W*T,yy-T*.6);g.stroke();}
  }
  // Fine irregular grass and leaf flecks replace the old checkerboard tiles.
  for(let i=0;i<W*H*9;i++){const x=rand()*W*T,y=rand()*H*T;oval(g,x,y,T*.035,T*.014,rand()>.5?'#f0dfac18':'#173e3420');}
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){
   const k=M.kind[y*W+x],dc=M.deco[y*W+x];
   if(k===0&&(dc===1||Math.abs(y-H/2)<.9||Math.abs(x-W/2)<.8)){
    box(g,x*T,y*T,T+1,T+1,ri===3?'#d7ba7188':ri===6?'#e8eee3aa':'#c0ad7b50',T*.08);for(let q=0;q<3;q++)oval(g,(x+rand())*T,(y+rand())*T,T*.1,T*.05,'#eee0b025');
    if(ri===3&&dc===1){
     box(g,x*T,y*T,T+1,T+1,'#d9bd74',T*.05);
     for(let row=0;row<3;row++){
      line(g,x*T,(y+row/3)*T,(x+1)*T,(y+row/3)*T,'#b49b59',T*.025);
      for(let col=0;col<3;col++){const bx=x+(col+(row%2)*.5)/3;line(g,bx*T,(y+row/3)*T,bx*T,(y+(row+1)/3)*T,'#b49b59',T*.022);}
     }
    }
   }
   if(dc===3||dc===4){box(g,x*T,y*T,T,T,dc===3?'#dad5b44a':'#253e3e30',0);}
   if(k===2&&REALMS[ri].feat!=='pond'){
    box(g,x*T,y*T,T+1,T+1,'#436f76',0);const shimmer=g.createLinearGradient(0,y*T,0,(y+1)*T);shimmer.addColorStop(0,'#87b6ac70');shimmer.addColorStop(1,'#326a7750');g.fillStyle=shimmer;g.fillRect(x*T,y*T,T,T);for(let j=0;j<2;j++)line(g,(x+.15+j*.1)*T,(y+.3+j*.4)*T,(x+.72+j*.08)*T,(y+.3+j*.4)*T,'#b1d4c455',T*.025);
   }
   if(dc===2){box(g,x*T,y*T,T,T,'#ad916a',0);for(let j=0;j<4;j++)line(g,x*T,(y+j/4)*T,(x+1)*T,(y+j/4)*T,'#715d46',T*.035);}
   if(k===4){if(ri===12&&forestSprite(g,14,x*T,y*T,T,T)){}else if(ri===11&&skySprite(g,14,x*T,y*T,T,T)){}else if(ri===10&&deepSprite(g,14,x*T,y*T,T,T)){}else if(ri===9&&sherwoodSprite(g,14,x*T,y*T,T,T)){}else if(ri===0&&woodSprite(g,14,x*T,y*T,T,T)){}else if(ri===8&&camelotSprite(g,14,x*T,y*T,T,T)){}else if(ri===7&&briarSprite(g,14,x*T,y*T,T,T)){}else if(ri===6&&frostSprite(g,14,x*T,y*T,T,T)){}else if(ri===5&&nightsSprite(g,14,x*T,y*T,T,T)){}else if(ri===4&&neverSprite(g,14,x*T,y*T,T,T)){}else if(ri===3&&ozSprite(g,14,x*T,y*T,T,T)){}else if(ri===2&&wonderSprite(g,14,x*T,y*T,T,T)){}else if(ri!==1||!gingerSprite(g,14,x*T,y*T,T,T))rock(g,(x+.5)*T,(y+.6)*T,T*.8);}
   if(k===3) {if(ri===12&&forestSprite(g,15,x*T,y*T,T,T)){}else if(ri===11&&skySprite(g,15,x*T,y*T,T,T)){}else if(ri===10&&deepSprite(g,15,x*T,y*T,T,T)){}else if(ri===9&&sherwoodSprite(g,15,x*T,y*T,T,T)){}else if(ri===0&&woodSprite(g,15,x*T,y*T,T,T)){}else if(ri===8&&camelotSprite(g,15,x*T,y*T,T,T)){}else if(ri===7&&briarSprite(g,15,x*T,y*T,T,T)){}else if(ri===6&&frostSprite(g,15,x*T,y*T,T,T)){}else if(ri===5&&nightsSprite(g,15,x*T,y*T,T,T)){}else if(ri===4&&neverSprite(g,15,x*T,y*T,T,T)){}else if(ri===3&&ozSprite(g,15,x*T,y*T,T,T)){}else if(ri===2&&wonderSprite(g,15,x*T,y*T,T,T)){}else if(ri===1&&gingerSprite(g,15,x*T,y*T,T,T)){}else if(ri===19)tree(g,(x+.5)*T,(y+.5)*T,T*.85,ri);else oval(g,(x+.5)*T,(y+.5)*T,T*.48,T*.38,p[2]);}
   if(k===0&&rand()<.08){const xx=(x+.5)*T,yy=(y+.6)*T;line(g,xx,yy,xx,yy-T*.2,'#446349',T*.03);oval(g,xx,yy-T*.2,T*.08,T*.06,ri===1?'#f6bca5':'#e4d8a4');}
  }
  if(REALMS[ri].feat==='pond'){
   const cx=(Math.floor(W/2)+.5)*T,cy=(Math.floor(H/2)+.5)*T;
   oval(g,cx,cy,T*3.8,T*2.8,'#9eab7a');
   const water=g.createLinearGradient(cx,cy-T*2.6,cx,cy+T*2.6);water.addColorStop(0,ri===6?'#e4eefa':ri===4?'#7dc5bd':'#80aba1');water.addColorStop(.45,ri===6?'#b1d4e1':ri===4?'#43999f':'#4d8589');water.addColorStop(1,ri===6?'#90b7ce':ri===4?'#286e85':'#3f707d');
   g.fillStyle=water;g.beginPath();g.ellipse(cx,cy,T*3.6,T*2.6,0,0,7);g.fill();
   for(let j=0;j<8;j++){const yy=cy+(j-3.5)*T*.5,spread=Math.sqrt(Math.max(0,1-Math.pow((yy-cy)/(T*2.6),2)))*T*2.9;line(g,cx-spread,yy,cx+spread,yy,'#c9e0c42b',T*.025);}
   if(ri===6){
    for(let j=0;j<5;j++){const xx=cx+(j-2)*T;line(g,xx,cy-T*.9,xx+T*.3,cy+T*.8,'#f2f7ee99',T*.025);line(g,xx+T*.14,cy,xx+T*.7,cy-T*.25,'#f2f7ee77',T*.02);}
    oval(g,cx-T*.9,cy-T*.7,T*1.7,T*.18,'#c0c8ef44');
   }
   if(ri===4){g.strokeStyle='#d6e5c866';g.lineWidth=T*.035;g.beginPath();g.ellipse(cx,cy,T*3.68,T*2.68,0,0,7);g.stroke();}
   oval(g,cx-T*1.8,cy+T*.8,T*.3,T*.13,'#91b48a');oval(g,cx+T*2,cy-T*.5,T*.2,T*.09,'#91b48a');
  }
  // Layer tall border trees behind landmarks. Maps/collisions remain unchanged.
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(M.kind[y*W+x]===1)tree(g,(x+.5)*T,(y+.65)*T,T*(.85+rand()*.3),ri,x+y);
  M.lms.forEach(l=>landmark(g,l,ri,T));
  const vignette=g.createRadialGradient(cv.width/2,cv.height/2,cv.height*.18,cv.width/2,cv.height/2,cv.width*.65);vignette.addColorStop(0,'#122a2600');vignette.addColorStop(1,'#122a2655');g.fillStyle=vignette;g.fillRect(0,0,cv.width,cv.height);
  return cv;
 }
 function infer(task){
  if(task.action && !task.action.startsWith('signature'))return task.action;
  const n=task.name.toLowerCase();
  if(task.kind==='r' && /\b(deliver|carry|haul|return)/.test(n))return /\blantern/.test(n)?'lantern':/\bpie\b/.test(n)?'pie':/\blog\b/.test(n)?'log':'carry';
  if(/\b(sleep|nap|doze|dream|rest|hibernate|snore)/.test(n))return 'sleep';
  if(/\b(count|inventory|tally)/.test(n))return 'count';
  if(/\b(teach|tutor|lesson)/.test(n))return 'teach';
  if(/\b(sharpen|grind)/.test(n))return 'sharpen';
  if(/\b(carv|chisel)/.test(n))return 'carve';
  if(/\b(chop|axe|fell)\b/.test(n))return 'chop';
  if(/\b(knit|weav|mend|sew|thread|scarf)/.test(n))return 'knit';
  if(/\b(bake|knead|pastry|bread)\b/.test(n))return 'bake';
  if(/\btea\b|\bbrew/.test(n))return 'tea';
  if(/\b(cook|stir|porridge|soup|stew|kettle|pie)\b/.test(n))return 'stir';
  if(/\b(rewrit|writ|catalog|draft|edit|letter|scroll)/.test(n))return 'write';
  if(/\b(read|book|story|tale|riddle)/.test(n))return 'read';
  if(/\b(paint|draw|sketch|illustrat|color)/.test(n))return 'draw';
  if(/\btelescope|scan the sea|\blookout|\bguard|\bpatrol|keep watch/.test(n))return task.kind==='r'?'walk':'lookout';
  if(/\brope|\bknot/.test(n))return 'rope';
  if(/\b(swab|mop|sweep)/.test(n))return 'sweep';
  if(/\bcomb.*hair|\bbrush.*fur/.test(n))return 'groom';
  if(/\bbows?\b|\barrows?\b|archery/.test(n))return 'archery';
  if(/\b(tick|tock|clock)\b|\bpocket watch/.test(n))return 'clock';
  if(/\b(cast|spell|wand|magic|bubble|wish)/.test(n))return 'cast';
  if(/\b(lantern|candle)/.test(n))return 'lantern';
  if(/\b(fish|pearl|dive)/.test(n))return 'fish';
  if(/\b(mortar|cement)/.test(n))return 'mortar';
  if(/\b(brick|wall)/.test(n))return 'brick';
  if(/\b(build|repair|hammer|forge)/.test(n))return 'hammer';
  if(/\b(howl|roar)/.test(n))return 'howl';
  if(/\b(sing|whistle|song|music|bell|jingle|dance|pirouette)|crow at/.test(n))return 'sing';
  if(/\b(dig|plant|garden)/.test(n))return 'dig';
  if(/\b(pick|gather|berry|berries|collect|mushroom|harvest)/.test(n))return 'gather';
  if(/\b(polish|dust|clean|brush)/.test(n))return 'polish';
  if(/\b(deliver|carry|haul|return)/.test(n))return 'carry';
  if(task.kind==='r')return 'walk';
  return 'emote';
 }
 // Landmark rehearsals depict a prop, gesture, or preparation for the original route.
 const REHEARSAL_ACTIONS = {
  '16:23': 'tracking',
  '24:18': 'draw',
  '24:23': 'draw',
  '30:23': 'windread',
  '31:18': 'tracking',
  '31:23': 'teach',
  '35:23': 'rope',
  '37:18': 'tracking',
  '39:18': 'tracking',
  '42:23': 'draw',
  '46:23': 'windread',
  '48:23': 'lookout',
  '52:23': 'teach',
  '53:23': 'skatejump',
  '54:23': 'lookout',
  '57:18': 'sweep',
  '66:23': 'draw',
  '69:23': 'lookout',
  '72:18': 'lookout',
  '72:23': 'teach',
  '79:18': 'teach',
  '83:18': 'tracking',
  '83:23': 'lookout',
  '84:23': 'draw',
  '86:18': 'lantern',
  '88:18': 'rope',
  '93:18': 'teach',
  '93:23': 'windread',
  '94:23': 'cast',
  '96:18': 'tracking'
 };
 const FINAL_WORK = {
  "97": {
    "column": 0,
    "tasks": [
      1,
      2,
      4,
      5
    ],
    "anchors": [
      0.359375,
      0.3828125,
      0.3125,
      0.3984375
    ],
    "baseline": 0.91875,
    "scale": 1.013
  },
  "32": {
    "column": 1,
    "tasks": [
      1,
      2,
      4,
      7
    ],
    "anchors": [
      0.5,
      0.390625,
      0.3984375,
      0.3515625
    ],
    "baseline": 0.91875,
    "scale": 1.561
  },
  "34": {
    "column": 2,
    "tasks": [
      1,
      2,
      3,
      7
    ],
    "anchors": [
      0.5,
      0.4453125,
      0.3671875,
      0.515625
    ],
    "baseline": 0.91875,
    "scale": 1.052
  },
  "82": {
    "column": 3,
    "tasks": [
      1,
      2,
      4,
      8
    ],
    "anchors": [
      0.4140625,
      0.453125,
      0.4453125,
      0.5234375
    ],
    "baseline": 0.91875,
    "scale": 1.489
  }
};
 const finalWorkImage = new Image();
 function finalWorkPlan(ci,task,t){
  const art=FINAL_WORK[ci];
  const clip=art?.tasks.indexOf(task.i) ?? -1;
  if(clip<0)return null;
  if(!finalWorkImage.src)finalWorkImage.src='assets/final-work.webp?v=39';
  if(!finalWorkImage.complete||finalWorkImage.naturalWidth!==512||finalWorkImage.naturalHeight!==1280)return null;
  return {action:infer(task),image:finalWorkImage,source:'activities',sourceRows:8,columns:4,column:art.column,frame:clip*2+Math.floor(t*2.5)%2,signature:true,grounded:true,registration:{scale:art.scale,anchorX:art.anchors[clip],baseline:art.baseline}};
 }
 function motionPlan(ci,task,t=0,moving=false,working=true){
  if(task&&working&&!moving){const plan=finalWorkPlan(ci,task,t);if(plan)return plan;}
  const ri=CHARS[ci].realm,col=CHARS[ci].j,binding=activityMotion(ci,task),extraImage=binding?.detail?(ri===0?woodDetailImage():ri===1?gingerDetailImage():wonderDetailImage()):activityImage(ri),ready=binding?.detail?(ri===0?!!window.WOOD_DETAIL_EXTRA?.[ci]?.generated:ri===1?!!window.GINGER_DETAIL_EXTRA?.[ci-8]?.generated:!!window.WONDER_DETAIL_EXTRA?.[ci-16]?.generated):activityReady(ci);
  const rehearsal=task && REHEARSAL_ACTIONS[ci+':'+task.i];
  const action=rehearsal || binding?.action|| (task?infer(binding?.alias!=null?TASKS[ci][binding.alias]:task):'emote');
  let image=sheet(ri),source='base',sourceRows=rows(ri),frame=ri===0?0:Math.floor(t*.4)%2,signature=false;
  if(moving)frame=ri===0?1+Math.floor(t*6)%2:2+Math.floor(t*6)%2;
  else if(working&&task){
   if(binding?.extra!=null && ready && extraImage?.complete && extraImage.naturalWidth){image=extraImage;source=binding.detail?'details':'activities';sourceRows=8;frame=binding.extra*2+Math.floor(t*2.5)%2;signature=true;}
   else {
    const a=ri===0?WOOD_MOTIONS[ci].base[0]:ri===1?GINGER_MOTIONS[col].base[0]:ri===2?WONDER_MOTIONS[col].base[0]:ri===4?NEVER_ACTIONS[col][0]:infer(TASKS[ci][0]);
    const b=ri===0?WOOD_MOTIONS[ci].base[1]:ri===1?GINGER_MOTIONS[col].base[1]:ri===2?WONDER_MOTIONS[col].base[1]:ri===4?NEVER_ACTIONS[col][1]:infer(TASKS[ci][6]);
    // A generic expression is not evidence that two activities share a baked work pose.
    const canonicalId=({11:0,18:3,23:6})[task.i]??task.i;
    signature=!rehearsal&&!provisional(ci)&&(action===a||action===b)&&(action!=='emote'||canonicalId===0||canonicalId===6);
    const second=action===b&&(a!==b||task.tier===2);
    if(signature&&ri===0&&work.complete&&work.naturalWidth){image=work;source='work';sourceRows=4;frame=(second?2:0)+Math.floor(t*2.5)%2;}
    else if(signature&&ri>0)frame=(second?6:4)+Math.floor(t*2.5)%2;
    if(signature&&ri===0&&source==='base')signature=false;
   }
  }
  let registration=source==='details'&&ri===1&&ci>=12&&ci<16?{...GINGER_DETAIL_RENDER[ci-12],anchorX:GINGER_DETAIL_RENDER[ci-12].anchors[binding.extra]}:source==='details'&&ri===2&&ci>=16&&ci<24?{...WONDER_DETAIL_RENDER[ci-16],anchorX:WONDER_DETAIL_RENDER[ci-16].anchors[binding.extra]}:null;
  if(ri===3&&source==='activities'&&OZ_RENDER[col])registration={...OZ_RENDER[col],anchorX:OZ_RENDER[col].anchors[binding.extra]};
  if(ri===4&&source==='base'&&NEVER_BASE_RENDER[col])registration={...NEVER_BASE_RENDER[col],anchorX:NEVER_BASE_RENDER[col].anchors[Math.floor(frame/2)]};
  if(ri===9&&source==='activities'&&SHERWOOD_RENDER[col])registration={...SHERWOOD_RENDER[col],anchorX:SHERWOOD_RENDER[col].anchors[binding.extra]};
  if(ri===10&&source==='activities'&&DEEP_RENDER[col])registration={...DEEP_RENDER[col],anchorX:DEEP_RENDER[col].anchors[binding.extra]};
  if(ri===11&&source==='activities'&&SKY_RENDER[col])registration={...SKY_RENDER[col],anchorX:SKY_RENDER[col].anchors[binding.extra]};
  if(ri===11&&source==='base'&&SKY_BASE_RENDER[col])registration={scale:SKY_BASE_RENDER[col].scale,anchorX:.5,baseline:SKY_BASE_RENDER[col].feet[frame]};
  if(ri===12&&source==='activities'&&FOREST_RENDER[col])registration={...FOREST_RENDER[col],anchorX:FOREST_RENDER[col].anchors[binding.extra]};
  if(ri===12&&source==='base'&&FOREST_BASE_RENDER[col])registration={scale:FOREST_BASE_RENDER[col].scale,anchorX:.5,baseline:FOREST_BASE_RENDER[col].feet[frame]};
  if(ci<24){
   if(source==='base')registration={scale:working&&!moving&&signature?1:OPENING_BASE_SCALE[ci],anchorX:.5,baseline:OPENING_FOOT[ci][frame]};
   else if(source==='details'&&registration)registration={...registration,scale:registration.scale*OPENING_DETAIL_SCALE[ci]};
  }
  return {action,image,source,sourceRows,frame,signature,columns:8,registration,grounded:!!registration&&(((ri===3||ri===9||ri===10||ri===11||ri===12)&&source==='activities')||((ri===4||ri===11||ri===12)&&source==='base'))};
 }
 function detailProps(g,a,t,task,ci){
  const s=Math.sin(t*4+ci),p=palettes[CHARS[ci].realm];
  if(a==='crumbs'||a==='pebbles'){
   for(let j=0;j<5;j++)oval(g,10+j*6,7+Math.sin(j)*2,a==='crumbs'?1.5:2.5,a==='crumbs'?1:2,a==='crumbs'?'#d9bc87':'#aeb6a1');oval(g,20+s*4,-16,3,2,'#d4bf97');
  }else if(a==='candy'||a==='chew'){
   if(a==='candy'){line(g,21,-4,25,-29,'#e4d7ae',2);oval(g,25,-31,7,7,'#d69b97');g.strokeStyle='#f1d8b6';g.lineWidth=1.5;g.beginPath();g.arc(25,-31,4,0,5);g.stroke();}
   else {box(g,15,-32+s*2,12,7,'#b98e54',3);oval(g,25,-37,2+s,2,'#f0ddb388');}
  }else if(a==='sugar'||a==='delivery'){
   box(g,10,-21,26,21,a==='sugar'?'#d5c7a7':'#b19765',5);line(g,13,-24,33,-24,'#b6a47f',3);
   if(a==='delivery')for(let j=0;j<3;j++){box(g,13+j*7,-21,6,7,'#b48254',2);oval(g,16+j*7,-22,4,3,'#dfb16b');}
   else {poly(g,[[20,-16],[26,-16],[28,-8],[18,-8]],'#eadfbb');}
  }else if(a==='oven'){
   box(g,11,-25,29,32,'#a58d6b',4);box(g,15,-20,21,21,'#5f6354',3);oval(g,25,-9,6,4,'#dfa16a');line(g,16,-18,34,-18,'#d9c49a',2);oval(g,32+s*3,-3,4,4,'#e1cba0');
  }else if(a==='spoon'){
   line(g,13,-8,30,-32,'#c3a36b',3);oval(g,31,-34,4,6,'#cdb17a');box(g,14,-20+s*3,9,7,'#ad9e83',1);
  }else if(a==='trade'){
   box(g,11,-8,14,9,'#bea36d',3);oval(g,34,6,8,5,'#cbc4aa');oval(g,39,1,4,4,'#ddd2b7');oval(g,38,-5,1.7,6,'#e5d7bc');oval(g,42,-4,1.7,6,'#e5d7bc');oval(g,25+s*3,-16,3,3,'#d9a5a0');
  }else if(a==='broom'){
   g.save();g.rotate(s*.12);line(g,13,-35,28,1,'#bc9b6d',3);poly(g,[[23,-1],[30,-3],[37,11],[21,11]],'#b6a477');line(g,14,-21+s*4,27,-21+s*4,'#e3cfad',4);g.restore();
  }else if(a==='taffy'){
   g.strokeStyle='#d7a0b3';g.lineWidth=5;g.beginPath();g.moveTo(7,-25-s*4);g.quadraticCurveTo(22,-8,40,-25+s*4);g.stroke();
  }else if(a==='potion'){
   poly(g,[[20,-32],[27,-32],[27,-24],[35,-10],[31,-2],[16,-2],[12,-10],[20,-24]],'#a2c4b485');oval(g,24,-8,9,4,'#d7a9b5');line(g,21,-34,27,-34,'#c4a476',3);for(let j=0;j<3;j++)oval(g,20+j*4,-12-(t*5+j*4)%14,1,1,'#eed5ba');
  }else if(a==='icing'){
   box(g,9,-5,33,5,'#a4aa94',2);for(let j=0;j<3;j++){oval(g,16+j*10,-8,4,3,'#c8a067');line(g,13+j*10,-8,19+j*10,-8,'#e5c6b9',1.5);}poly(g,[[19,-31],[29,-29],[22,-15+s*3]],'#d9b1bd');
  }else if(a==='twirl'||a==='dance'){
   for(let j=0;j<6;j++){const q=t*2+j;oval(g,20+Math.cos(q)*17,-22+Math.sin(q)*12,1.5,1.5,j%2?'#e8cb9b':'#cea6c1');}
   if(a==='dance'){oval(g,22,10,16,4,'#d7b8bf');line(g,22,12,22,18,'#c9b193',3);}
  }else if(a==='interview'){
   box(g,7,-26,17,20,'#dac799',2);line(g,10,-21,20,-21,'#a28f6b',1);oval(g,36,-7,6,8,'#c29864');oval(g,34,-9,1,1,'#405047');oval(g,38,-9,1,1,'#405047');oval(g,29,-29+s*3,5,3,'#ead5ae70');
  }else if(a==='hat'){
   oval(g,24,-37+s*3,13,4,'#d6c49f');box(g,15,-50+s*3,18,13,'#eee3c7',5);oval(g,17,-49+s*3,5,5,'#eee3c7');oval(g,30,-49+s*3,5,5,'#eee3c7');
  }else if(a==='dental'){
   line(g,11,-12,24,-34+s*3,'#b7ceb7',2);box(g,21,-38+s*3,7,6,'#dfddc2',1);g.strokeStyle='#d8c99e';g.lineWidth=2;g.beginPath();g.arc(34,-22,5,0,7);g.stroke();line(g,31,-17,27,-10,'#b8bda5',2);
  }else if(a==='hide'){
   box(g,13,-18,27,30,'#a68b66',3);box(g,16,-15,21,19,'#b8d0bc66',1);oval(g,23,-4,6,3,'#dfb776');
  }else if(a==='wave'||a==='laugh'||a==='grumble'||a==='dodge'){
   oval(g,23,-35,7,6,'#eadbb766');if(a==='grumble'){line(g,19,-35,27,-35,'#aa8967',1.5);}else{oval(g,23,-35,2,2,'#edcf93');}
  }else if(a==='run'){return true;}
  else if(a==='read'){
   poly(g,[[5,-24],[17,-27],[30,-24],[30,-8],[17,-11],[5,-8]],'#ecdeb9');line(g,17,-26,17,-11,'#a58d66',1);
   for(let j=0;j<3;j++){line(g,8,-21+j*3,14,-22+j*3,'#a99b7b',.7);line(g,21,-22+j*3,27,-21+j*3,'#a99b7b',.7);}
   g.strokeStyle='#f6ebcf';g.lineWidth=1;g.beginPath();g.moveTo(18,-26);g.quadraticCurveTo(20+s*6,-19,18,-11);g.stroke();
  }else if(a==='write'){
   box(g,6,-17,30,15,'#9c805b',2);box(g,9,-19,23,14,'#ebdbac',1);line(g,11,-15,20,-15,'#948a6f',.8);line(g,11,-11,17+(s+1)*5,-11,'#766b57',1);
   line(g,21+s*3,-11,31+s*3,-31,'#ad8d52',1.5);poly(g,[[27+s*3,-23],[33+s*3,-35],[36+s*3,-32]],'#dfd5b9');oval(g,38,-6,4,3,'#344b49');
  }else if(a==='draw'){
   line(g,12,10,20,-34,'#b69a6d',2);line(g,32,10,25,-34,'#b69a6d',2);box(g,9,-35,28,27,'#eee3c6',1);
   line(g,22,-12,22,-24,'#719269',1.5);oval(g,22,-25,4,3,p[3]);oval(g,17,-18,4,1.5,'#8ba16d');line(g,25,-20+s*5,40,-31+s*5,'#bca06a',2);
  }else if(a==='teach'){
   box(g,9,-34,29,27,'#b49b71',2);box(g,12,-31,23,21,'#3d6256',1);line(g,17,-26,29,-26,'#d6ddbb',1);line(g,17,-21,24,-16,'#d6ddbb',1);line(g,4,-12,27,-24+s*3,'#dec28e',1.5);
  }else if(a==='celebrate'){
   for(let j=0;j<8;j++){const q=t*1.4+j;box(g,13+Math.sin(q)*19,-45+(q%2)*20,3,2,[p[3],'#e6c879','#a8caa4'][j%3],0);}line(g,11,-7,14,-32,'#c4aa73',1.5);poly(g,[[14,-32],[33,-27],[14,-22]],p[3]);
  }else if(a==='hammer'||a==='repair'){
   box(g,12,-1,23,5,'#b49a70');box(g,13,4,3,10,'#806646');box(g,30,4,3,10,'#806646');g.save();g.translate(15,-25);g.rotate(s*.6);line(g,0,0,2,-18,'#c4a577',3);box(g,-6,-22,15,6,'#9da59a',1);g.restore();
  }else if(a==='bake'||a==='pastry'){
   oval(g,24,-4,17,6,'#807b64');oval(g,24,-8,13,8,'#d0a065');for(let j=0;j<3;j++)line(g,17+j*5,-10,20+j*5,-14,'#f2cf8d',1.5);line(g,11,-18+s*3,34,-18+s*3,'#b48d59',5);
  }else if(a==='tea'||a==='visit'){
   box(g,9,-12,11,10,'#e2d4aa',3);g.strokeStyle='#e2d4aa';g.lineWidth=2;g.beginPath();g.arc(21,-8,4,-1.5,1.5);g.stroke();oval(g,32,-23+s*2,8,7,'#a5b99a');line(g,26,-23+s*2,20,-20+s*2,'#a5b99a',4);line(g,20,-20+s*2,15,-13,'#d6b97b',1);
  }else if(a==='craft'){
   box(g,8,-4,31,5,'#aa8b61');line(g,14,0,12,11,'#806b48',2);line(g,34,0,36,11,'#806b48',2);
   const material=REALM_CRAFT[CHARS[ci].realm][1];
   if(/lantern|candle/.test(material)){box(g,19,-27,13,19,p[3],3);box(g,22,-24,7,12,'#f0d797',2);line(g,19,-30,32,-30,'#e1c58c',1.5);}
   else if(/ribbon|banner|cape|garland/.test(material)){for(let j=0;j<3;j++)poly(g,[[12+j*7,-27],[18+j*7,-27],[20+j*7,-7+s],[15+j*7,-9]],j%2?p[3]:'#d6bd80');}
   else if(/tile|mosaic/.test(material)){for(let j=0;j<6;j++)box(g,13+j%3*7,-24+Math.floor(j/3)*8,6,6,j%2?p[3]:'#c4c69a',1);}
   else {poly(g,[[17,-22],[27,-27],[35,-19],[29,-10],[18,-12]],p[3]);line(g,8,-26+s*3,24,-15+s*3,'#c8b080',2);}
  }else if(a==='brick'||a==='mortar'){
   if(a==='brick'){for(let j=0;j<3;j++)box(g,10+j*8,-1-j%2*6,15,6,'#b77960',1);line(g,11,-9,35,-9,'#d6ccb0',2);poly(g,[[15,-16+s*3],[25,-18+s*3],[25,-13+s*3]],'#b4b9a5');}
   else {box(g,13,-15,22,17,'#8e987f',4);oval(g,24,-15,11,4,'#bcbda8');line(g,24+s*4,-15,27+s*4,-32,'#bda477',2);}
  }else if(a==='count'||a==='sort'||a==='cupboard'){
   box(g,9,-24,27,25,'#a08c62',2);for(let j=0;j<3;j++){line(g,11,-18+j*7,34,-18+j*7,'#e1c894',1);for(let k=0;k<3;k++)oval(g,15+k*6+(j===Math.floor((t*2)%3)?s*2:0),-18+j*7,2.3,2.3,[p[3],'#d4bf7d','#92b49b'][j]);}
  }else if(a==='inspect'){
   box(g,15,-5,21,9,'#b98565',1);g.strokeStyle='#d6bd85';g.lineWidth=2;g.beginPath();g.arc(21+s*2,-21,7,0,7);g.stroke();line(g,16+s*2,-16,10+s*2,-8,'#a48c61',3);
  }else if(a==='butterfly'||a==='flowers'){
   if(a==='butterfly'){const x=24+Math.sin(t*2)*10,y=-37+Math.cos(t*3)*5;oval(g,x-4,y,4,Math.abs(s)*5+1,'#ddbb77');oval(g,x+4,y,4,Math.abs(s)*5+1,'#c78fa1');line(g,x,y-3,x,y+3,'#61563d',1);}
   else {for(let j=0;j<7;j++){const q=j*6.28/7;oval(g,22+Math.cos(q)*11,-17+Math.sin(q)*6,3,2,j%2?'#ead3a3':p[3]);}}
  }else if(a==='pie'){
   oval(g,23,-8,17,5,'#b8b395');oval(g,23,-11,13,6,'#d3ac6b');for(let j=0;j<3;j++)line(g,15+j*6,-14,21+j*6,-9,'#f1d190',1.5);
  }else if(a==='log'||a==='stack'){
   for(let j=0;j<(a==='stack'?3:1);j++){box(g,10+j%2*5,-9-j*5,27,8,'#8e704c',4);oval(g,35+j%2*5,-5-j*5,4,4,'#d0b17b');}
  }else if(a==='sharpen'){
   oval(g,25,-4,10,10,'#9da394');line(g,25,-4,25+Math.cos(t*6)*8,-4+Math.sin(t*6)*8,'#d6d8b9',1.5);line(g,6,-18+s*2,27,-6+s*2,'#c9aa77',3);poly(g,[[18,-14+s*2],[28,-15+s*2],[32,-9+s*2],[25,-6+s*2]],'#bbc3b2');
  }else if(a==='howl'||a==='roar'||a==='whistle'){
   g.strokeStyle='#e4d4ab';g.lineWidth=1;for(let j=0;j<3;j++){g.beginPath();g.arc(13,-36,7+j*5+(s+1)*2,-.8,.8);g.stroke();}
  }else if(a==='honey'){
   box(g,14,-16,20,19,'#bf9750',5);oval(g,24,-16,9,3,'#e7bc65');line(g,22+s*3,-19,31+s*3,-33,'#c0a06e',2);oval(g,31+s*3,-33,4,5,'#e0ba62');
  }else if(a==='dog'||a==='pet'){
   oval(g,29,7,12,6,'#a58059');oval(g,40,2,5,6,'#bb9468');oval(g,37,-2,2,5,'#795b43');line(g,18,5,13,0+s*4,'#a58059',3);line(g,39,6,40,15,'#856749',2);line(g,23,9,22,15,'#856749',2);if(a==='dog')line(g,10,-22,38,-1,'#d3c098',1);
  }else if(a==='dig'){
   line(g,8,-30,25,2,'#b9a06c',2.5);poly(g,[[19,-1],[28,-5],[33,7],[26,11]],'#a4ada1');oval(g,29,12,10,3,'#8a7750');
  }else if(a==='taste'||a==='sniff'){
   oval(g,23,-10,12,6,'#c2b58c');oval(g,23,-12,10,3,'#d5ae70');line(g,16,-14-s*6,10,-26-s*6,'#b7c4aa',1.8);oval(g,10,-27-s*6,3,2,'#d1dac2');
  }else if(a==='chair'||a==='bed'){
   box(g,13,-3,22,6,'#b79c6b');box(g,13,-25,4,24,'#9b8056');box(g,14,2,3,12,'#9b8056');box(g,31,2,3,12,'#9b8056');if(a==='bed')box(g,17,-7,16,5,'#dccdab',3);
  }else if(a==='dust'){
   line(g,12,-8,23,-30+s*5,'#baa06e',2);oval(g,26,-34+s*5,8,5,'#c8bca3');
  }else if(a==='sock'){
   poly(g,[[16,-25],[24,-25],[24,-10],[31,-9],[31,-3],[16,-4]],'#bba7a1');for(let j=0;j<3;j++)line(g,17,-22+j*5,24,-22+j*5,'#e9d8b2',2);
  }else if(a==='emote'){
   oval(g,23,-38,7,6,'#eadbb77a');oval(g,17,-29,2,2,'#eadbb77a');
  }else if(a==='walk'){return true;}
  else return false;
  return true;
 }

 // Counter-mirror glyphs while their positions follow the character's facing.
 function uprightText(g,text,x,y,facing){
  g.save();g.translate(x,y);g.scale(facing,1);g.fillText(text,0,0);g.restore();
 }
 function wonderProps(g,a,t,task,ci,facing){
  const s=Math.sin(t*4),phase=(t*.5)%1;
  if(a==='croquet'){
   line(g,18,-29,31+s*5,3,'#d5a16d',2.5);oval(g,32+s*5,3,8,4,'#ca8b98');oval(g,40+Math.max(0,s)*5,10,3.5,3.5,'#d9c588');
   g.strokeStyle='#dccd9c';g.lineWidth=2;g.beginPath();g.arc(44,5,7,Math.PI,0);g.stroke();
  }else if(a==='letter'){
   box(g,10,-24+s*2,23,15,'#e6d4ad',2);line(g,10,-24+s*2,22,-15+s*2,'#ae9470',1);line(g,33,-24+s*2,22,-15+s*2,'#ae9470',1);oval(g,22,-15+s*2,2.5,2.5,'#aa6265');
  }else if(a==='directions'){
   line(g,24,-36,24,11,'#c5a577',2);poly(g,[[6,-34],[29,-34],[29,-39],[38,-30],[29,-22],[29,-27],[6,-27]],'#8fa6a0');poly(g,[[40,-16],[17,-16],[17,-21],[8,-12],[17,-4],[17,-9],[40,-9]],'#c2a17c');
  }else if(a==='roses'||a==='rosepaint'){
   for(let j=0;j<3;j++){const x=14+j*10;line(g,x,8,x,-18-j%2*8,'#87a477',2);oval(g,x,-20-j%2*8,5,5,a==='rosepaint'&&j===2?'#e4d8ba':'#b66a7e');}
   if(a==='rosepaint'){box(g,31,-1,9,11,'#a4676a',2);line(g,8,-24,22+s*6,-30,'#c9ae7c',2);oval(g,22+s*6,-30,3,2,'#b85e72');}
  }else if(a==='teapot'){
   oval(g,20,1,16,12,'#c7d2bd');oval(g,20,-10,9,3,'#e5dbbb');line(g,7,-1,0,-12,'#c7d2bd',5);g.strokeStyle='#c7d2bd';g.lineWidth=3;g.beginPath();g.arc(35,-1,7,-1.5,1.5);g.stroke();
  }else if(a==='butter'){
   oval(g,23,-4+s*2,16,5,'#d1d6bc');box(g,13,-14+s*2,21,9,'#dfc47f',3);line(g,16,-12+s*2,28,-12+s*2,'#f3df9d',1);
  }else if(a==='cocoon'){
   oval(g,16,-16,12,25,'#adbd9c99');for(let j=0;j<8;j++)line(g,5,-35+j*6,27,-29+j*4,'#e8d9ad88',1);
  }else if(a==='bubbles'){
   for(let j=0;j<3;j++){g.strokeStyle='#d1ddd699';g.lineWidth=1;g.beginPath();g.arc(18+Math.sin(t+j)*5,-27-j*9-phase*8,3+j,0,Math.PI*2);g.stroke();}
  }else if(['question','riddle','comment','meditate','fade','hover','grow'].includes(a)){
   if(a==='hover'){g.strokeStyle='#e1c397';g.lineWidth=2;g.beginPath();g.arc(24,9,9,Math.PI,0);g.stroke();}
   else if(a==='question'||a==='riddle'){g.font='bold 15px Georgia';g.fillStyle='#e8d4a2';uprightText(g,'?',23,-33-phase*9,facing);}
   else for(let j=0;j<3;j++)oval(g,18+Math.sin(t+j)*9,-20-j*9,1.5,1.5,'#e4cc9caa');
  }else return false;
  return true;
 }
 function ozProps(g,a,t){
  const s=Math.sin(t*4);
  if(a==='slippers'||a==='fetch'){
   for(let j=0;j<2;j++){oval(g,17+j*10,-3+j*4,8,4,'#bdc9c2');oval(g,14+j*10,-5+j*4,3,2,'#8eaaa6');}line(g,11,-10+s*3,21,-7,'#e6d8a6',2);
  }else if(a==='crystal'){
   box(g,16,-3,20,5,'#b79e6b',2);oval(g,26,-18,11,13,'#9bc5c4aa');oval(g,23,-22,4,5,'#e4e7cc88');oval(g,26+Math.sin(t)*5,-18,2,2,'#e8ce8b');
  }else if(a==='levers'||a==='machine'){
   box(g,10,-9,30,17,'#8c9e82',3);oval(g,21,-5,6,6,'#e3d3a7');line(g,21,-5,21+Math.cos(t*2)*4,-5+Math.sin(t*2)*4,'#56766b',1);line(g,32,-5,36+s*4,-24,'#cab07b',2);oval(g,36+s*4,-24,3,3,'#b18262');
   if(a==='machine')for(let j=0;j<3;j++)oval(g,14+j*9,-18-j%2*5,4,4,'#c1aa72');
  }else if(a==='voice'){
   poly(g,[[12,-28],[27,-33],[33,-20],[14,-23]],'#cab077');oval(g,30,-26,4,7,'#8f885e');for(let j=0;j<3;j++)line(g,36+j*4,-30+j*3,39+j*4,-34+j*3,'#e0cfa166',1);
  }else if(a==='rain'){
   line(g,23,-42,23,0,'#bda679',2);g.fillStyle='#7b9fba';g.beginPath();g.arc(23,-40,22,Math.PI,0);g.fill();for(let j=0;j<4;j++)line(g,5+j*11,-49+(t*12+j*5)%15,4+j*11,-44+(t*12+j*5)%15,'#b5d1ca99',1);
  }else if(a==='crow'||a==='illusion'){
   const x=24+s*3;oval(g,x,-19,7,5,a==='crow'?'#59665e':'#d7d4af');oval(g,x+5,-24,4,4,a==='crow'?'#64716a':'#e8dfbf');poly(g,[[x+8,-25],[x+13,-23],[x+8,-21]],'#c6aa71');line(g,x-2,-14,x-4,-7,'#bb9c6c',1.5);line(g,x+2,-14,x+4,-7,'#bb9c6c',1.5);
  }else if(a==='stuffing'||a==='pillow'){
   box(g,12,-18,25,20,'#c7bf97',5);for(let j=0;j<5;j++)line(g,15+j*4,-12+s*2,13+j*4,-23+s*2,'#d4b777',1);
  }else if(a==='bone'){
   oval(g,25,8,15,4,'#8e7754');line(g,17,-2,30,-9,'#d9c89e',4);for(const [x,y] of [[16,-3],[18,0],[29,-11],[32,-8]])oval(g,x,y,3,3,'#d9c89e');
  }else if(a==='guard'){
   for(let j=0;j<4;j++)box(g,12+j*8,-13,3,24,'#b5a17c',1);line(g,12,-4,39,-4,'#b5a17c',2);line(g,12,5,39,5,'#b5a17c',2);
  }else if(a==='courage'){
   oval(g,26,-20,11,19,'#b7c8ba');g.strokeStyle='#c8ad70';g.lineWidth=3;g.beginPath();g.ellipse(26,-20,11,19,0,0,7);g.stroke();line(g,26,-1,26,11,'#c8ad70',2);
  }else if(a==='fear'){
   oval(g,26,5,11,4,'#849b68');oval(g,26,1,4,4,'#b66564');line(g,26,-3,26,5,'#6a6650',1);oval(g,24,0,1,1,'#515e50');oval(g,28,2,1,1,'#515e50');
  }else return false;
  return true;
 }
 function neverProps(g,a,t){
  const s=Math.sin(t*4);
  if(a==='pixiedust'){
   oval(g,18,-15,5,7,'#b49a69');for(let j=0;j<7;j++){const p=(t*.7+j*.13)%1;oval(g,21+p*20,-24+p*30+Math.sin(j)*4,1.3,1.3,'#f2d689');}
  }else if(a==='potrepair'){
   oval(g,25,2,12,5,'#b99a70');box(g,13,-9,24,11,'#b99063',4);line(g,14,-25,22+s*5,-10,'#c6b58a',3);box(g,10,-29,10,5,'#9cac9e',1);
  }else if(a==='belltalk'||a==='bellpolish'){
   const count=a==='belltalk'?2:1;
   for(let j=0;j<count;j++){const x=14+j*17,y=-20+Math.sin(t*5+j)*3;poly(g,[[x-5,y+5],[x-3,y-4],[x+3,y-4],[x+5,y+5]],'#c7aa6f');oval(g,x,y+5,6,2,'#dec68a');line(g,x,y-4,x,y-10,'#c7aa6f',2);}
   if(a==='bellpolish')line(g,11,-15+s*3,25,-15+s*3,'#e0d6b4',4);
  }else if(a==='sailmend'){
   poly(g,[[10,-29],[37,-29],[34,8],[12,8]],'#d7d6b4');box(g,17,-14,11,11,'#a6b4a1',1);line(g,20,-22,30+s*3,-4,'#b3926b',1);line(g,10,-29,37,-29,'#c4a77b',2);
  }else if(a==='tracking'){
   oval(g,26,7,15,5,'#c5b98b');for(let j=0;j<2;j++){oval(g,20+j*9,3-j*3,2,4,'#8e8b66');oval(g,20+j*9,-1-j*3,3,2,'#8e8b66');}line(g,12,-17,23+s*3,-2,'#d4bd8b',2);
  }else if(a==='windread'){
   line(g,18,-35,18,9,'#bda879',2);g.strokeStyle='#d29b8b';g.lineWidth=4;g.beginPath();g.moveTo(18,-30);g.bezierCurveTo(24,-35+s*3,31,-24+s*3,41,-30+s*4);g.stroke();
  }else if(a==='featherpaint'){
   line(g,23,-30,19,3,'#c9be93',1.5);oval(g,23,-17,5,13,'#83b5a4');line(g,8,-16,25+s*4,-24,'#c5a77a',2);box(g,32,0,7,9,'#b28b76',2);
  }else if(a==='pearl'){
   oval(g,24,3,12,5,'#bd9daa');g.strokeStyle='#e2c7be';g.lineWidth=1;for(let j=0;j<5;j++)line(g,24,7,14+j*5,0,'#e2c7be',1);oval(g,24+s*2,-7-Math.abs(s)*7,4,4,'#eee4c7');
  }else if(a==='coralcare'){
   oval(g,24,8,14,5,'#9eb9b0');for(let j=0;j<3;j++){const x=15+j*9;line(g,x,5,x,-15+j%2*7,'#ce9e9b',3);line(g,x,-7,x-5,-12,'#ce9e9b',2);line(g,x,-4,x+5,-10,'#ce9e9b',2);}
  }else if(a==='splash'||a==='slide'||a==='dolphinswim'){
   for(let j=0;j<3;j++){g.strokeStyle='#98d4ce99';g.lineWidth=1.3;g.beginPath();g.ellipse(21,9+j*3,10+j*5,2+j,0,0,7);g.stroke();}
   if(a==='splash')for(let j=0;j<4;j++)oval(g,15+j*6,-15+Math.sin(t*3+j)*8,1.5,3,'#a4d6d0');
   if(a==='dolphinswim'){oval(g,29,-13+s*3,11,5,'#8eb1b7');poly(g,[[19,-14+s*3],[12,-22+s*3],[12,-6+s*3]],'#8eb1b7');poly(g,[[26,-17+s*3],[28,-25+s*3],[32,-16+s*3]],'#8eb1b7');}
  }else if(a==='seagull'){
   oval(g,27,-29,5,3,'#e1e1c6');line(g,27,-29,17,-34+s*4,'#d5dcca',2);line(g,27,-29,37,-34-s*4,'#d5dcca',2);poly(g,[[31,-30],[36,-28],[31,-27]],'#d0b579');
  }else return false;
  return true;
 }
 function nightsProps(g,a,t){
  const s=Math.sin(t*4);
  if(a==='wallclimb'){
   box(g,14,-17,29,28,'#bcaa81',2);for(let j=0;j<3;j++){line(g,14,-10+j*8,43,-10+j*8,'#958769',1);line(g,23+j%2*8,-17+j*8,23+j%2*8,-9+j*8,'#958769',1);}
  }else if(a==='lampcloth'||a==='innerpolish'||a==='lampdecor'){
   oval(g,24,-3,12,6,'#c5a46b');poly(g,[[32,-6],[43,-13],[40,-5],[32,1]],'#c5a46b');oval(g,22,-10,6,3,'#d8be81');line(g,17,-17,29,-17+s*3,a==='lampdecor'?'#8b9b9c':'#e0d5b5',a==='lampdecor'?2:4);
  }else if(a==='bazaartrade'||a==='merchanttrade'){
   box(g,10,-2,32,6,'#b6986d',1);line(g,14,4,14,12,'#b6986d',2);line(g,37,4,37,12,'#b6986d',2);oval(g,31,-5,9,4,'#a37e55');for(let j=0;j<3;j++)oval(g,27+j*4,-7,2,2,'#ad8260');oval(g,16+s*3,-13,3,3,'#d6bd7a');
  }else if(a==='donkeycare'){
   oval(g,28,-2,13,7,'#9a9d8a');oval(g,39,-11,6,7,'#9a9d8a');oval(g,39,-21,2,8,'#a9aa96');oval(g,44,-20,2,8,'#a9aa96');for(const x of [19,24,32,36])line(g,x,1,x,12,'#8a8c79',2);oval(g,41,-12,1,1,'#46594f');
  }else if(a==='goodssack'){
   oval(g,25,-9,12,20,'#b9a57b');line(g,18,-23,31,-23,'#8d805c',2);line(g,25,-22,25,6,'#d2bd8e',1);
  }else if(a==='treasurehide'||a==='cleverplan'){
   box(g,14,-10,27,18,a==='cleverplan'?'#a48a62':'#9d835c',3);box(g,14,-15,27,8,'#b69b6d',3);line(g,22,-15,22,8,'#d3ba7f',2);line(g,34,-15,34,8,'#d3ba7f',2);oval(g,28,-2,2,3,'#ead4a2');
  }else if(a==='shawldance'){
   g.strokeStyle='#b8939f';g.lineWidth=5;g.beginPath();g.moveTo(7,-25);g.bezierCurveTo(21,-42+s*5,29,-1-s*6,43,-25);g.stroke();
  }else if(a==='fringeweave'){
   for(let j=0;j<6;j++)line(g,12+j*5,-15,12+j*5+Math.sin(t*3+j)*3,6,'#d7b77b',1.4);line(g,9,-8+s*2,41,-8+s*2,'#e9d09b',1.5);
  }else if(a==='passenger'){
   oval(g,25,-30,5,6,'#c6aa85');poly(g,[[20,-24],[30,-24],[35,-7],[15,-7]],'#e0d5b4');oval(g,25,-36,6,3,'#e0d5b4');
  }else if(a==='carpetride'||a==='carpetloop'){
   poly(g,[[8,3],[30,-2-s*2],[42,8],[20,13]],'#6e9294');line(g,10,3,40,8,'#d0ba82',1.5);
  }else if(a==='throne'){
   box(g,15,-38,26,47,'#b59c65',5);box(g,19,-34,18,27,'#6f9f9c',5);box(g,13,-7,30,7,'#8bb2aa',3);line(g,15,0,15,13,'#b59c65',3);line(g,40,0,40,13,'#b59c65',3);
  }else if(a==='banquet'){
   oval(g,25,0,17,5,'#a8b9b2');for(let j=0;j<4;j++)oval(g,16+j*6,-5-j%2*3,3.5,3.5,['#c5a16a','#ad7d69'][j%2]);
  }else return false;
  return true;
 }
 function frostProps(g,a,t){
  const s=Math.sin(t*4);
  if(a==='warmstone'||a==='hearthhands'){
   box(g,13,-6,28,17,'#a59c8c',3);box(g,18,-3,18,11,'#837f77',2);oval(g,27,3,6,5,'#d4a46f');oval(g,26,0,3,5,'#ead29a');if(a==='warmstone')oval(g,18,-15+s*2,5,3,'#b5b6a0');
  }else if(a==='snowflakecraft'||a==='icepuzzle'){
   box(g,10,0,32,5,'#b9b7a2',1);
   if(a==='icepuzzle')for(let j=0;j<4;j++)box(g,14+j%2*11,-16+Math.floor(j/2)*10,9,9,'#9fc8d9',2);
   else for(let j=0;j<6;j++){const angle=j*Math.PI/3;line(g,26,-17,26+Math.cos(angle)*12,-17+Math.sin(angle)*12,'#bfe0e3',1.5);}
  }else if(a==='icethrone'){
   poly(g,[[14,9],[14,-32],[21,-44],[27,-35],[34,-44],[41,-32],[41,9]],'#b8d8e0');box(g,19,-30,17,22,'#8eb8cf',3);box(g,12,-7,31,7,'#d5e5df',2);
  }else if(a==='iceswan'){
   box(g,12,6,29,6,'#b0c5cf',2);oval(g,26,-1,11,7,'#b4dce3');line(g,31,-5,34,-20,'#b4dce3',5);oval(g,34,-22,5,4,'#cee8e6');line(g,8,-23,22+s*4,-8,'#c9c4ac',2);
  }else if(a==='snowball'||a==='snowfriend'){
   oval(g,26,1,11,10,'#e1ece4');if(a==='snowfriend'){oval(g,26,-13,8,8,'#e1ece4');oval(g,26,-25,6,6,'#e1ece4');oval(g,24,-26,1,1,'#6b7c7c');poly(g,[[28,-26],[36,-24],[28,-22]],'#cb9e74');}else oval(g,23,-1,6,6,'#c2dce0');
  }else if(a==='weathercheck'){
   box(g,19,-39,13,43,'#b7b5a3',3);box(g,23,-34,4,26,'#dce5d6',2);line(g,25,-12,25,-24+s*3,'#bd8b8a',2);oval(g,25,-9,4,4,'#bd8b8a');
  }else if(a==='snowangel'||a==='snowsniff'||a==='snowden'){
   oval(g,25,9,20,6,'#d2e4e1');if(a==='snowden'){oval(g,27,-4,18,14,'#dfece6');oval(g,26,0,9,9,'#90b3c0');}else for(let j=0;j<3;j++)oval(g,17+j*8,7-j%2*2,2,3,'#accbd1');
  }else if(a==='harnesscheck'){
   g.strokeStyle='#ad8b71';g.lineWidth=2.5;g.beginPath();g.ellipse(25,-8,12,18,.3,0,7);g.stroke();box(g,24,-3,7,6,'#cdb780',1);
  }else if(a==='tinysleigh'||a==='wintercargo'){
   box(g,11,-4,31,11,'#b69c76',3);line(g,10,12,41,12,'#8ca3a6',2);line(g,13,7,16,12,'#b69c76',2);line(g,36,7,38,12,'#b69c76',2);if(a==='wintercargo'){box(g,16,-17,13,13,'#a2aea0',2);box(g,30,-11,10,7,'#c3ad85',2);}
  }else if(a==='antlercare'){
   line(g,26,-32,26,11,'#ad9e80',3);box(g,17,-32,19,21,'#e2d8bf',3);line(g,20,-29,20,-15,'#bacac7',1);
  }else if(a==='circleglide'||a==='skatejump'){
   g.strokeStyle='#cee8e4';g.lineWidth=1.3;g.beginPath();g.ellipse(23,10,20,5,0,0,7);g.stroke();line(g,10,13,35+s*4,13,'#e8f0e8',1);
  }else if(a==='skatelesson'){
   line(g,10,-11,43,-11,'#b9b19b',3);line(g,15,-11,15,12,'#b9b19b',2);line(g,38,-11,38,12,'#b9b19b',2);
  }else if(a==='haretrack'){
   oval(g,28,4,10,6,'#dce9e1');oval(g,35,-3,5,5,'#dce9e1');oval(g,34,-12,2,7,'#dce9e1');oval(g,39,-11,2,7,'#dce9e1');oval(g,37,-4,1,1,'#839e9e');
  }else if(['auroraribbon','auroraweave','skypaint','polarchoir'].includes(a)){
   if(a==='auroraweave'){box(g,12,-31,26,38,'#aab39b',2);box(g,16,-27,18,29,'#88b9ad',1);for(let j=0;j<5;j++)line(g,17+j*3,-26,17+j*3,2,'#bcc6de',1);}
   else if(a==='polarchoir'){line(g,10,-15,25+s*3,-35,'#d8d9b9',2);for(let j=0;j<3;j++)oval(g,21+j*9,-31+Math.sin(t*2+j)*4,3,3,['#8fc9b4','#aebde0','#cfb4d5'][j]);}
   else {g.strokeStyle='#94d3b5';g.lineWidth=3;g.beginPath();g.moveTo(8,-23);g.bezierCurveTo(21,-43+s*5,30,-4-s*5,43,-27);g.stroke();line(g,13,-22,29+s*4,-30,'#c1b5d3',1.5);}
  }else return false;
  return true;
 }
 function briarProps(g,a,t){
  const s=Math.sin(t*4);
  if(a==='rosescent'||a==='rosesniff'||a==='rosecutting'||a==='rosebushshake'){
   if(a==='rosecutting'){poly(g,[[15,-1],[36,-1],[33,11],[18,11]],'#af8d6f');}
   const x=25+(a==='rosebushshake'?s*3:0);line(g,x,5,x,-23,'#91aa79',2);oval(g,x-4,-11,5,2,'#91aa79');oval(g,x+4,-15,5,2,'#91aa79');for(let j=0;j<5;j++)oval(g,x+Math.cos(j*1.26)*4,-25+Math.sin(j*1.26)*4,3.5,3.5,'#c38c99');oval(g,x,-25,3,3,'#dec0ab');
  }else if(a==='portraitdust'){
   box(g,14,-35,27,41,'#b59b6d',3);box(g,17,-32,21,35,'#bfc3a2',1);oval(g,27,-23,5,6,'#d8c6a2');poly(g,[[21,-17],[33,-17],[36,-2],[18,-2]],'#98a28b');line(g,8,-20,24+s*4,-33,'#b39c72',2);oval(g,24+s*4,-33,5,3,'#d9d7bf');
  }else if(a==='hedgecheck'){
   box(g,11,-12,31,21,'#819773',6);for(let j=0;j<4;j++)oval(g,15+j*7,-14,6,6,'#93aa7c');g.strokeStyle='#c9b079';g.lineWidth=2;g.beginPath();g.arc(28,-22,7,0,7);g.stroke();line(g,23,-17,14,-7,'#c9b079',2);
  }else if(a==='armormend'){
   poly(g,[[17,-28],[25,-24],[33,-28],[38,-7],[28,4],[13,-7]],'#a5b6b1');line(g,25,-24,25,2,'#d6d6bd',1.5);line(g,8,-24,21+s*3,-9,'#b9a077',3);box(g,6,-28,9,5,'#9daea8',1);
  }else if(a==='partyplan'){
   poly(g,[[8,-23],[24,-27],[39,-22],[39,-4],[24,-8],[8,-4]],'#e0d2ac');line(g,24,-26,24,-8,'#b49a73',1);line(g,27,-15,35+s*3,-29,'#806f59',2);for(let j=0;j<3;j++)oval(g,15+j*10,7,3,3,['#c99ca7','#a4b99d','#cab27b'][j]);
  }else if(a==='spindlecheck'){
   line(g,23,-38,26,7,'#b69a70',2);oval(g,26,-4,8,4,'#cfbf97');box(g,19,-40+s*2,9,6,'#d6c6a0',2);
  }else if(a==='tapestry'){
   box(g,11,-37,28,46,'#b49a73',2);box(g,15,-33,20,33,'#bda6a1',1);for(let j=0;j<6;j++)line(g,16+j*3,-32,16+j*3,-2,'#dcc8ac',1);line(g,14,-16+s*4,37,-16+s*4,'#a18c70',2);
  }else if(a==='rosewool'){
   oval(g,25,2,15,6,'#a58c70');oval(g,25,-1,13,5,'#bd8d9c');line(g,14,-26,31,-6,'#bda77b',2);g.strokeStyle='#d1a7ad';g.lineWidth=2.5;g.beginPath();g.moveTo(15,-24);g.bezierCurveTo(36,-19,15,-6,29,-3);g.stroke();
  }else if(a==='onionchop'||a==='carrotpeel'){
   box(g,10,3,33,5,'#baa17a',2);
   if(a==='onionchop'){oval(g,27,-1,7,5,'#d7c9a0');line(g,14,-15+s*3,30,-9+s*3,'#b0bcb5',4);}
   else {poly(g,[[14,-10],[37,-2],[17,1]],'#cf9a71');line(g,14,-5,9,-11,'#8fa57b',2);line(g,25,-14+s*3,29,-4+s*3,'#aebdb5',2);}
  }else if(a==='kettleclean'){
   oval(g,25,-8,11,13,'#b6976c');poly(g,[[33,-14],[43,-22],[39,-7],[34,-2]],'#b6976c');g.strokeStyle='#c4aa7d';g.lineWidth=2;g.beginPath();g.arc(14,-9,7,-1.7,1.7);g.stroke();line(g,17,-10+s*3,31,-10+s*3,'#e0d5b9',4);
  }else if(a==='sleepmumble'){
   oval(g,26,-26,12,8,'#e3d7b5aa');for(let j=0;j<3;j++)oval(g,21+j*5,-26,1,1,'#95a28c');
  }else if(a==='doorbump'){
   box(g,19,-42,25,53,'#bba27a',4);box(g,23,-36,17,42,'#9a896b',2);oval(g,37,-11,2,2,'#d7bc7e');
  }else if(a==='blanketcarry'){
   box(g,9,-23,31,21,'#9aabc0',4);for(let j=0;j<4;j++)line(g,12,-20+j*5,37,-20+j*5,'#d3c8b6',1);line(g,12,-3,36,-3,'#b5c4c4',2);
  }else if(a==='thorntrim'){
   line(g,15,6,32,-26,'#96a47a',2);line(g,22,-7,14,-13,'#96a47a',1);line(g,27,-17,36,-20,'#96a47a',1);line(g,8,-12,25+s*3,-19,'#b7bdb0',2);line(g,10,-19,25+s*3,-12,'#b7bdb0',2);
  }else if(a==='courtesybow'||a==='briarroll'){
   if(a==='briarroll')for(let j=0;j<3;j++)oval(g,16+j*8,8+Math.sin(t*3+j)*2,3,1.5,'#a1ac82');
  }else return false;
  return true;
 }
 function props(g,action,t,task,ci,facing=1){
  const s=Math.sin(t*5+ci),p=palettes[CHARS[ci].realm],phase=(t*.65)%1;
  g.save();g.translate(0,0);
  action=({"fairjudgment": "count", "crownadjust": "groom", "petitioner": "wave", "charter": "write", "owlconsult": "teach", "runestone": "carve", "cauldronbrew": "stir", "starchart": "draw", "horsecheck": "groom", "knightsalute": "wave", "catrescue": "carry", "apology": "write", "courtsmile": "emote", "queenwave": "wave", "courttea": "tea", "feastplan": "write", "lakerise": "hover", "shoregaze": "lookout", "swordpolish": "polish", "lakesong": "sing", "axecare": "polish", "promiseseal": "write", "balladwrite": "write", "bridgemend": "hammer", "shieldpolish": "polish", "tabledust": "sweep", "bannermend": "knit", "hayrest": "sleep", "moonflower": "gather", "tealeaf": "tea", "violetbrew": "stir", "mistweave": "cast"})[action]||action;
  action=({"basketsort": "sort", "grannyvisit": "stir", "streamtrail": "lookout", "redberries": "gather", "squirrelscold": "teach", "grannystew": "stir", "kettlenap": "sleep", "grannyberries": "gather", "twigtest": "chop", "pinework": "chop", "shednap": "sleep", "hobberries": "gather", "rabbitsmile": "wave", "politepatrol": "lantern", "wolflullaby": "sing", "wolfberries": "gather", "goldiechairnap": "sleep", "chaircompare": "chair", "bearwaitnap": "sleep", "leafbed": "bed", "stumpgrowl": "howl", "bearpace": "walk", "berrypatch": "dig", "bearfishing": "fish", "walltap": "hammer", "pigplans": "draw", "pigberries": "gather", "wellsketch": "draw", "hubbardstew": "stir", "villageknit": "knit", "hubbardpolish": "polish", "hubbardsketch": "draw"})[action]||action;
  action=({"riverrace": "run", "ovenpose": "wave", "cookiepetition": "write", "biscuitnap": "sleep", "candywindow": "lookout", "licoricemend": "repair", "crumbcompass": "lookout", "ovennap": "sleep", "sugarpot": "stir", "witchwatch": "lookout", "cottageicing": "icing", "gretelberries": "gather", "muffincackle": "laugh", "specialbake": "bake", "pastryhouse": "craft", "cakefoundation": "bake"})[action]||action;
  if(briarProps(g,action,t)){g.restore();return;}
  action=({centurysweep:"sweep",heroletter:"letter",fernglitter:"pixiedust",invitation:"letter",threadknot:"rope",royalyawn:"sleep",briefwake:"wave",shortcourt:"write",smalldecree:"write",souptaste:"taste",wrongbed:"bed",hedgesleep:"sleep"})[action]||action;
  if(frostProps(g,action,t)){g.restore();return;}
  action=({winterhum:"sing",longscarf:"knit",coatstitch:"knit",mirrorlook:"courage",palaceplan:"draw",coldtea:"tea",danceplan:"write",firesleep:"sleep"})[action]||action;
  if(nightsProps(g,action,t)){g.restore();return;}
  action=({cliffhanger:"riddle",storygesture:"read",talescribe:"write",gardenstory:"read",horizon:"lookout",shipcargo:"carry",islandchart:"draw",smallwish:"cast",wishclause:"write",goldcount:"count",courtsweep:"sweep",roofwatch:"lookout",birdswerve:"seagull",royalcourt:"write",petition:"write"})[action]||action;
  if(neverProps(g,action,t)){g.restore();return;}
  action=({shanty:"sing",crewmeal:"stir",treasuresort:"count",sockmend:"knit",warmmeal:"stir",darning:"knit",treetidy:"sweep",archerylesson:"archery",snap:"emote",clockdig:"clock"})[action]||action;
  if(ozProps(g,action,t)){g.restore();return;}
  action=({basket:"gather",route:"draw",tinpolish:"polish",hum:"sing",workshop:"hammer",bravestory:"read",wand:"cast",royaltea:"tea",advice:"teach",greenbrew:"stir",broomcare:"broom",greenink:"write"})[action]||action;
  if(wonderProps(g,action,t,task,ci,facing)){g.restore();return;}
  action=({cake:"taste",hair:"groom",panic:"clock",wind:"clock",seats:"chair",hatmend:"knit",cups:"tea",teastir:"stir",tarts:"bake",laws:"write",mushrooms:"gather",growth:"teach",wake:"wave",jam:"sleep",story:"read"})[action]||action;
  if(detailProps(g,action,t,task,ci)){g.restore();return;}
  if(action==='stir')action='cook';
  if(action==='mend')action='knit';
  if(action==='sleep'){g.font='bold 11px Georgia';g.fillStyle='#ebdab0';uprightText(g,'z',17,-36-phase*16,facing);uprightText(g,'Z',25,-42-phase*16,facing);}
  else if(action==='clock'){
   oval(g,22,-17,10,12,'#c1a468');oval(g,22,-17,7,9,'#e8dab2');line(g,22,-17,22+Math.cos(t*2)*5,-17+Math.sin(t*2)*5,'#4c6154',1.5);line(g,22,-28,22,-33,'#e3c789',2);
  }else if(action==='archery'){
   g.strokeStyle='#c3a777';g.lineWidth=2;g.beginPath();g.arc(13,-21,18,-1.3,1.3);g.stroke();line(g,18,-39,18,-3,'#e6d9b2',1);line(g,8,-21,40,-21+s,'#b39b6c',1.5);poly(g,[[40,-21+s],[35,-24+s],[35,-18+s]],'#c8d1ba');
  }else if(action==='groom'){
   box(g,9,-28+s*4,15,5,'#d9b87a',1);for(let j=0;j<5;j++)line(g,10+j*3,-25+s*4,10+j*3,-20+s*4,'#dec792',1);
  }else if(action==='sweep'){
   g.save();g.rotate(s*.12);line(g,11,-36,27,4,'#d4b988',2.5);poly(g,[[23,-2],[30,-5],[36,10],[20,10]],'#a9a176');g.restore();
  }else if(action==='carve'){
   box(g,10,-2,25,7,'#b29360');box(g,12,4,3,10,'#806445');box(g,29,4,3,10,'#806445');line(g,16,-5,24+s*4,-17,'#d8d0a8',2);for(let j=0;j<3;j++)oval(g,21+j*4,-1-j*2,1.5,1,'#e7c98a');
  }else if(action==='chop'||action==='hammer'){
   box(g,16,-1,15,9,'#977653');g.save();g.translate(10,-30);g.rotate(s*.65-.35);box(g,-1,-16,3,29,'#bfa078');poly(g,[[0,-18],[14,-19],[12,-7],[0,-10]],'#adbcb0');g.restore();if(s>.6){for(let j=0;j<3;j++)oval(g,20+j*4,-7-j*3,1.6,1,'#e9c992');}
  }else if(action==='cook'){
   oval(g,20,0,13,5,'#5c594f');box(g,8,-10,24,11,'#756f5b',5);oval(g,20,-10,12,4,'#b99661');line(g,20,-10,24+s*5,-28,'#c7b38a',2.5);for(let j=0;j<2;j++)oval(g,18+Math.sin(t*3+j)*3,-22-j*9-phase*5,3,2,'#f5e4be66');
  }else if(action==='lookout'){
   g.save();g.translate(13,-30);g.rotate(-.15+s*.06);box(g,0,-3,27,7,'#c9aa6d',2);box(g,23,-5,7,11,'#a88f5e',2);oval(g,30,.5,2,4,'#91bfc0');g.restore();
  }else if(action==='rope'){
   g.strokeStyle='#d5bb83';g.lineWidth=2.5;g.beginPath();g.moveTo(8,-27);g.bezierCurveTo(35,-36,8,-4,28,-13);g.bezierCurveTo(40,-19,15,-27,16,-4+s*2);g.stroke();
  }else if(action==='read'||action==='draw'||action==='write'){
   poly(g,[[5,-23],[17,-26],[29,-22],[29,-7],[17,-11],[5,-8]],'#e7d5a5');line(g,17,-24,17,-11,'#a88e68',1);line(g,22,-15,29+s*3,-28,'#674e39',2);for(let j=0;j<3;j++)line(g,7,-19+j*3,14,-20+j*3,'#9e8a65',.7);
  }else if(action==='knit'||action==='craft'){
   box(g,9,-23,13,22+s*2,p[3],3);line(g,4,-13,26,-31+s*4,'#e6cc92',1.5);line(g,9,-31,28,-11-s*4,'#e6cc92',1.5);oval(g,26,-1,6,5,p[3]);
  }else if(action==='gather'){
   oval(g,23,0,11,5,'#8a6748');box(g,12,-7,22,7,'#b19765',3);for(let j=0;j<4;j++)oval(g,15+j*4,-8,2.7,2.7,task.name.includes('berries')?'#b65260':'#e0bf75');oval(g,15+s*5,-25+Math.abs(s)*12,3,3,'#d4ab62');
  }else if(action==='fish'){
   line(g,10,-22,29,-52+s*3,'#c8b187',2);g.strokeStyle='#ddd4b5';g.lineWidth=1;g.beginPath();g.moveTo(29,-52+s*3);g.quadraticCurveTo(45,-30,39,0);g.stroke();oval(g,39,0,2,3,'#c47d64');
  }else if(action==='sing'||action==='teach'||action==='celebrate'){
   g.font='bold 14px Georgia';g.fillStyle='#f4d693';uprightText(g,action==='teach'?'✦':'♪',20+s*4,-28-phase*18,facing);uprightText(g,'♫',30-s*3,-14-phase*18,facing);
  }else if(action==='lantern'||action==='carry'){
   if(action==='lantern'){oval(g,20,-20,13,16,'#edca7240');box(g,15,-28,11,14,'#ab8a4d',3);box(g,17,-25,7,9,'#ffe2a0',2);line(g,16,-29,24,-29,'#dec08b',2);}else{box(g,12,-17,17,14,'#b49c6a',3);line(g,19,-17,19,-3,'#e5c58c',2);}
  }else if(action==='polish'){
   oval(g,22,-12,8,11,'#a4bfb8');line(g,16,-14+s*3,28,-14+s*3,'#ecddb5',4);g.fillStyle='#ffe1a0';g.font='12px Georgia';uprightText(g,'✧',27,-28,facing);
  }else{
   line(g,11,-14,25,-36+s*5,'#c8a46b',2);for(let j=0;j<5;j++){const a=t*2+j*1.26;oval(g,26+Math.cos(a)*12,-35+Math.sin(a)*9,1.5,1.5,'#f6dfa2');}
  }
  g.restore();
 }
 function character(g,ci,x,y,t,moving,working,ready,task,facing=1){
  facing=facing<0?-1:1;
  const ch=CHARS[ci],ri=ch.realm,col=ch.j,plan=motionPlan(ci,task,t,moving,working);
  const action=plan.action,source=plan.image,sourceRows=plan.sourceRows,frame=plan.frame,signature=plan.signature;
  const anchored=(ci<24||plan.grounded)&&working&&!moving&&signature;
  const bounce=anchored?0:moving?Math.abs(Math.sin(t*6))*2:working?(/sleep|nap/.test(action)?Math.sin(t*1.5)*.35:Math.sin(t*4+ci))*1.2:Math.sin(t*1.7+ci)*.5;
  oval(g,x+1,y+11,moving?12:14,5,'#142d3540');
  g.save();g.translate(x,y-bounce);
  g.save();g.scale(facing,1);
  if(working&&!moving&&!anchored){
   if(action==='fade')g.globalAlpha=.28+.72*(.5+.5*Math.cos(t*1.6));
   if(action==='dolphinswim'||action==='slide')g.translate(Math.sin(t*2)*2,-Math.sin(t*2.5)*2);
   if(action==='pixiedust')g.translate(0,-2-Math.sin(t*2)*2);
   if(ci===46){g.translate(0,-3-Math.sin(t*2)*2);g.rotate(Math.sin(t*1.6)*.035);}
   if(action==='shawldance')g.rotate(Math.sin(t*3)*.10);
   if(action==='circleglide')g.translate(Math.sin(t*2)*3,0);
   if(action==='skatejump')g.translate(0,-Math.abs(Math.sin(t*3))*5);
   if(action==='auroraribbon')g.rotate(Math.sin(t*2)*.06);
   if(action==='lakerise')g.translate(0,-Math.sin(t*2)*2);
   if(action==='mistweave')g.globalAlpha*=.86+Math.sin(t*2)*.12;
   if(action==='courtesybow')g.rotate(Math.max(0,Math.sin(t*2))*.08);
   if(action==='briarroll')g.rotate(Math.sin(t*3)*.09);
   if(action==='hover')g.translate(0,-5-Math.sin(t*2)*3);
   if(action==='grow'){const size=.92+Math.sin(t*1.3)*.17;g.scale(size,size);}
   if(action==='bounce')g.translate(0,-Math.abs(Math.sin(t*4))*5);
  }
  if(working&&!moving&&!anchored){if(action==='sleep')g.rotate(.14);else if(action==='gather')g.rotate(Math.sin(t*3)*.10);else if(action==='chop')g.rotate(Math.sin(t*5)*.06);}
  if(working&&!moving&&!anchored&&(action==='twirl'||action==='dance'))g.rotate(Math.sin(t*3)*.16);
  if(source.complete&&source.naturalWidth){
   const cw=source.naturalWidth/plan.columns,chh=source.naturalHeight/sourceRows;
   if(plan.registration){const r=plan.registration,w=58*r.scale,h=72*r.scale;g.drawImage(source,(plan.column??col)*cw,frame*chh,cw,chh,-w*r.anchorX,10-h*r.baseline,w,h);}
   else g.drawImage(source,(plan.column??col)*cw,frame*chh,cw,chh,-29,-59,58,72);
  }else {oval(g,0,-22,12,17,palettes[ri][3]);oval(g,0,-40,9,10,'#e9c99a');}
  if(working&&task&&!moving&&(!signature||action==='fringeweave')&&action!=='walk')props(g,action,t,task,ci,facing);
  g.restore(); // Progress and collection rings stay in world orientation.
  if(working&&task){
   const progress=taskProgress(G._state().chars[ci].task,Date.now());
   g.strokeStyle='#e9cb84';g.lineWidth=1.7;g.beginPath();g.arc(0,10,15,-Math.PI/2,-Math.PI/2+Math.max(0,Math.min(1,progress))*Math.PI*2);g.stroke();
  }
  if(ready){g.strokeStyle='#e8ce8e';g.lineWidth=1.3;g.beginPath();g.ellipse(0,10,17,6,0,0,7);g.stroke();}
  g.restore();
 }
 function portrait(ci){
  const ch=CHARS[ci],im=sheet(ch.realm);
  return '<span class="portrait" role="img" aria-label="'+ch.name.replace(/"/g,'&quot;')+'" style="background-image:url(assets/folk-'+String(ch.realm).padStart(2,'0')+'.webp?v='+(ch.realm===4?'25':'18')+');background-size:800% '+rows(ch.realm)*100+'%;background-position:'+ch.j*100/7+'% 0"></span>';
 }
 function provisional(ci){return CHARS[ci].realm===4 && !window.NEVER_ART?.[CHARS[ci].j]?.generated;}
 function realmThumb(ri){
  if(!thumbs.has(ri)){const c=document.createElement('canvas');c.width=120;c.height=100;const g=c.getContext('2d');box(g,0,0,120,100,palettes[ri][0],0);tree(g,15,40,40,ri);building(g,35,23,70,65,ri,7);thumbs.set(ri,c.toDataURL());}
  return '<img class="realm-thumb" src="'+thumbs.get(ri)+'" alt="">';
 }
 function title(cv){
  const draw=()=>{cv.width=innerWidth*Math.min(devicePixelRatio||1,2);cv.height=innerHeight*Math.min(devicePixelRatio||1,2);const g=cv.getContext('2d'),w=cv.width,h=cv.height;g.fillStyle='#193c38';g.fillRect(0,0,w,h);for(let j=0;j<15;j++)tree(g,w*(j/14),h*.85,h*(.35+j%3*.08),0);};draw();window.addEventListener('resize',draw);
 }
 function preview(cv,ci,task,t,facing=1){
  const g=cv.getContext('2d'),w=cv.width,h=cv.height,ri=CHARS[ci].realm,p=palettes[ri];g.clearRect(0,0,w,h);
  const bg=g.createLinearGradient(0,0,w,h);bg.addColorStop(0,p[2]);bg.addColorStop(1,p[0]);g.fillStyle=bg;g.fillRect(0,0,w,h);
  if(task.kind==='e'){
   box(g,w*.12,28,90,115,'#c3ae8055',40);box(g,w*.12+12,40,66,90,'#dbce9c44',30);line(g,w*.12+45,40,w*.12+45,135,'#cbb98755',5);line(g,w*.12+12,85,w*.12+78,85,'#cbb98755',5);
   for(let j=0;j<3;j++){box(g,w*.74,45+j*45,130,8,'#c2a87866');for(let k=0;k<5;k++)box(g,w*.75+k*22,19+j*45,15,26,[p[3],'#baad7d',p[1]][k%3],2);}
   poly(g,[[0,h*.72],[w,h*.72],[w,h],[0,h]],'#a28a5e44');for(let j=0;j<6;j++)line(g,j*w/5,h*.72,(j-.5)*w/5,h,'#d2b78922',2);
  }else{
   tree(g,w*.16,h*.5,h*.65,ri);tree(g,w*.85,h*.5,h*.8,ri);oval(g,w*.5,h*.8,w*.3,h*.13,'#b0ac7866');
  }
  g.save();g.translate(w*.5,h*.81);g.scale(3.15,3.15);character(g,ci,0,0,t,false,true,false,task,facing);g.restore();
  for(let j=0;j<6;j++)oval(g,(.1+j*.16)*w,30+(Math.sin(t*.6+j)+1)*65,1.5,1.5,'#ebda9c88');
 }
 return {expandedWork:FINAL_WORK,world,building,character,portrait,realmThumb,title,infer,motionPlan,drawProps:props,palettes,preview,provisional,revision:()=>revision,cacheStats:()=>({limit:ATLAS_LIMIT,baseline:sheets.size,extra:extraSheets.size,baselineRealms:[...sheets.keys()],extraRealms:[...extraSheets.keys()]})};
})();
