/* Updated by the v5 atlas packer once each individual character sheet is verified. */
'use strict';
window.NEVER_ART = [{"name": "Peter Pan", "generated": false, "status": "provisional-reused-generated-sprite", "reason": "The image generator rejected this character sheet during its output safety review."}, {"name": "Tinker Bell", "generated": true, "status": "original-individual-generated-sheet", "frames": 8}, {"name": "Captain Hook", "generated": false, "status": "provisional-reused-generated-sprite", "reason": "The image generator rejected this character sheet during its output safety review."}, {"name": "Smee", "generated": true, "status": "original-individual-generated-sheet", "frames": 8}, {"name": "Wendy", "generated": true, "status": "original-individual-generated-sheet", "frames": 8}, {"name": "Tiger Lily", "generated": true, "status": "original-individual-generated-sheet", "frames": 8}, {"name": "Lagoon Mermaid Coralie", "generated": true, "status": "original-individual-generated-sheet", "frames": 8}, {"name": "Crocodile Tick-Tock", "generated": true, "status": "original-individual-generated-sheet", "frames": 8}];
const NEVER_ACTIONS = [
 ['crow','starflight'],['sing','hammer'],['polish','lookout'],['sweep','rope'],
 ['read','write'],['archery','lantern'],['groom','sing'],['clock','clock']
];
// Explicit bindings keep personal work clips tied to their actual activity.
const NEVER_TASK_ACTIONS = [
 {0:'sing',6:'lantern',8:'lantern'}, {0:'sing',6:'hammer'},
 {0:'polish',2:'lookout',6:'lookout'}, {0:'sweep',2:'rope'},
 {0:'read',5:'read',6:'read',8:'read'}, {0:'archery',6:'lantern',8:'lantern'},
 {0:'groom',2:'sing',6:'sing',8:'sing'}, {0:'clock',6:'clock',7:'clock',8:'clock'}
];
TASKS.slice(32,40).forEach((ts,j)=>ts.forEach(t=>{
 if(NEVER_TASK_ACTIONS[j][t.i])t.action=NEVER_TASK_ACTIONS[j][t.i];
}));

for(const j of [0,2])window.NEVER_ART[j]={name:window.NEVER_ART[j].name,generated:true,status:"original-individual-generated-sheet",frames:8,edition:25};
