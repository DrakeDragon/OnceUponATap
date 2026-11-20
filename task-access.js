/* Shared gameplay/preview gates. Presentation mysteries are not encrypted assets. */
'use strict';
const TaskAccess=(()=>{
 function level(fp){let n=1;for(let i=1;i<FRIEND_PTS.length;i++)if(fp>=FRIEND_PTS[i])n=i+1;return n;}
 function requirements(state,ci,i){
  const ch=CHARS[ci],task=TASKS[ci]?.[i],own=state?.chars?.[ci];
  if(!ch||!task)return ['Unavailable task'];
  if(!own)return ['Recruit this character'];
  const result=[];
  if(level(own.fp||0)<task.unlock)result.push('🔒 Friendship '+task.unlock);
  if(task.kind==='e'&&!state.blds?.some(b=>b.r===ch.realm&&b.k===task.arg))result.push('🏗️ Build '+REALMS[ch.realm].names[task.arg]);
  return result;
 }
 function block(state,ci,i){return requirements(state,ci,i)[0]||null;}
 function revealed(state,ci,i){
  if(!TASKS[ci]?.[i]||!state?.chars?.[ci])return false;
  // A previously assigned job must remain readable even during a building move.
  return state.chars[ci].task?.i===i||!block(state,ci,i);
 }
 function card(state,ci,i){
  const task=TASKS[ci]?.[i],hidden=!revealed(state,ci,i),needs=requirements(state,ci,i);
  if(!task)return {id:i,hidden:true,name:'Mysterious task',requirements:needs};
  if(hidden)return {id:i,tier:task.tier,hidden:true,name:'Mysterious task',requirements:needs};
  return {id:i,tier:task.tier,hidden:false,name:task.name,dur:task.dur,coin:task.coin,xp:task.xp,kind:task.kind,requirements:needs};
 }
 function groups(state,ci,tier=-1){
  const available=[],locked=[];
  for(const task of TASKS[ci]||[]){
   if(tier>=0&&task.tier!==tier)continue;
   (block(state,ci,task.i)?locked:available).push(task);
  }
  return {available,locked};
 }
 return {level,requirements,block,revealed,card,groups};
})();

// Active jobs use the saved interval so duration tuning never moves their progress.
function taskProgress(job, timestamp) {
 const duration = job.end - job.start;
 if (duration <= 0) return timestamp >= job.end ? 1 : 0;
 return Math.max(0, Math.min(1, (timestamp - job.start) / duration));
}
