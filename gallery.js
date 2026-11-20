'use strict';
const $=s=>document.querySelector(s),demo={chars:{}},G={_state:()=>demo};
const escapeHTML=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
let town=null,ci=-1,selected=-1;
function readTown(){
 try{const s=JSON.parse(localStorage.getItem('onceUponATap_v2'));return s?.v===2&&s.chars&&typeof s.chars==='object'&&Array.isArray(s.blds)&&Array.isArray(s.realms)?s:null;}catch(e){return null;}
}
function owned(id){return Number.isInteger(id)&&!!CHARS[id]&&!!town?.chars?.[id]&&!!town.realms[CHARS[id].realm];}
function updateTown(wantedCi=ci,wantedTask=selected){
 town=readTown();const folk=CHARS.filter(c=>owned(c.id)),realmIds=[...new Set(folk.map(c=>c.realm))];
 ci=owned(wantedCi)?wantedCi:folk[0]?.id??-1;
 $('#realm').innerHTML=realmIds.length?realmIds.map(i=>'<option value="'+i+'">'+escapeHTML(REALMS[i].name)+'</option>').join(''):'<option value="-1">No realm to preview yet</option>';
 $('#realm').disabled=!realmIds.length;$('#realm').value=ci<0?-1:CHARS[ci].realm;populateFolk(ci,wantedTask);
}
function populateFolk(wantedCi=-1,wantedTask=-1){
 const ri=+$('#realm').value,list=CHARS.filter(c=>c.realm===ri&&owned(c.id));
 ci=list.some(c=>c.id===wantedCi)?wantedCi:list[0]?.id??-1;
 $('#folk').innerHTML=list.length?list.map(c=>'<option value="'+c.id+'">'+escapeHTML(c.name)+'</option>').join(''):'<option value="-1">Recruit a character in your town</option>';
 $('#folk').disabled=!list.length;$('#folk').value=ci;populateTasks(wantedTask);
}
function populateTasks(wantedTask=-1){
 ci=+$('#folk').value;
 if(!owned(ci)){
  ci=-1;selected=-1;$('#task').innerHTML='<option value="-1">Your next tale awaits</option>';$('#task').disabled=true;describe();return;
 }
 $('#task').disabled=false;
 const groups=TaskAccess.groups(town,ci);
 $('#task').innerHTML=[...groups.available,...groups.locked].map(t=>{const view=TaskAccess.card(town,ci,t.i);return '<option value="'+t.i+'"'+(view.hidden?' disabled':'')+'>'+TIERS[t.tier].label+' · '+escapeHTML(view.hidden?'Mysterious task':view.name)+'</option>';}).join('');
 selected=Number.isInteger(wantedTask)&&!!TASKS[ci][wantedTask]?wantedTask:TASKS[ci].find(t=>TaskAccess.revealed(town,ci,t.i))?.i??-1;
 $('#task').value=selected;describe();
}
function describe(){
 selected=+$('#task').value;demo.chars={};
 if(!owned(ci)||!TASKS[ci]?.[selected]){$('#details').innerHTML='<strong>A story waiting to unfold</strong><p>Return to your town and recruit a character. Only unlocked activities appear here.</p>';return;}
 const view=TaskAccess.card(town,ci,selected);
 if(view.hidden){$('#details').innerHTML='<strong>✧ Mysterious task</strong><p>This part of the tale is still sealed.</p><p class="small">'+escapeHTML(view.requirements.join(' · '))+'</p>';return;}
 const c=CHARS[ci],t=TASKS[ci][selected],plan=StoryArt.motionPlan(ci,t);
 demo.chars[ci]={task:{start:Date.now(),end:Date.now()+t.dur*1000}};
 $('#details').innerHTML='<strong>'+escapeHTML(c.name)+' · '+escapeHTML(view.name)+'</strong>'+(StoryArt.provisional(ci)?'<p class="small">This character currently uses provisional artwork.</p>':'')+'<p class="small">'+escapeHTML(c.back)+'</p><div class="small">'+(['activities','details'].includes(plan.source)?'Expanded personal work animation':plan.signature?'Personal work animation':'Shared task animation')+' · '+TIERS[t.tier].label+' · '+t.dur+' seconds</div>';
 try{history.replaceState(null,'','?character='+ci+'&task='+selected);}catch(e){}
}
$('#realm').onchange=()=>populateFolk();$('#folk').onchange=()=>populateTasks();$('#task').onchange=describe;
const params=new URLSearchParams(location.search);
updateTown(Number(params.get('character')??-1),Number(params.get('task')??-1));
window.addEventListener('storage',e=>{if(e.key==='onceUponATap_v2'||e.key===null)updateTown();});
window.addEventListener('focus',()=>updateTown());
function frame(ms){
 const cv=$('#studio'),g=cv.getContext('2d'),t=ms/1000;
 // Guard every frame as well as selection: a direct URL cannot reveal a locked task.
 if(!owned(ci)||!TaskAccess.revealed(town,ci,selected)){
  g.fillStyle='#294c46';g.fillRect(0,0,cv.width,cv.height);g.textAlign='center';g.fillStyle='#d9c28e';g.font='28px Georgia';g.fillText('✧ A tale still sealed ✧',cv.width/2,cv.height/2);g.textAlign='start';
 }else if($('#motion').value==='task')StoryArt.preview(cv,ci,TASKS[ci][selected],t,+$('#direction').value);
 else{g.fillStyle='#426b56';g.fillRect(0,0,cv.width,cv.height);g.save();g.translate(cv.width/2,cv.height*.82);g.scale(4.5,4.5);StoryArt.character(g,ci,0,0,t,$('#motion').value==='walk',false,false,null,+$('#direction').value);g.restore();}
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
