/* Explicit first-realm activity bindings; IDs and timers are unchanged. */
'use strict';
window.WOOD_EXTRA = [{"name": "Little Red", "generated": true, "clips": 4, "frames": 8}, {"name": "Granny Bramble", "generated": true, "clips": 4, "frames": 8}, {"name": "Hob the Woodcutter", "generated": true, "clips": 4, "frames": 8}, {"name": "Fenwick the Wolf", "generated": true, "clips": 4, "frames": 8}, {"name": "Goldie Locks", "generated": true, "clips": 4, "frames": 8}, {"name": "Papa Bear", "generated": true, "clips": 4, "frames": 8}, {"name": "Brick the Pig", "generated": true, "clips": 4, "frames": 8}, {"name": "Mother Hubbard", "generated": true, "clips": 4, "frames": 8}];
const WOOD_MOTIONS = [
 {base:['gather','lantern'],tasks:{0:['gather'],1:['count',0],2:['butterfly',1],3:['pie',3],4:['flowers',2],5:['sort'],6:['visit'],7:['walk'],8:['lantern']}},
 {base:['knit','write'],tasks:{0:['knit'],1:['dust',3],2:['emote'],3:['stir'],4:['mend',2],5:['bake',0],6:['tea',1],7:['sleep'],8:['write']}},
 {base:['chop','carve'],tasks:{0:['chop'],1:['chop'],2:['whistle',2],3:['stack',0],4:['log',3],5:['sharpen',1],6:['chop'],7:['carve'],8:['carve']}},
 {base:['howl','hammer'],tasks:{0:['howl'],1:['sock',2],2:['emote'],3:['groom',1],4:['walk'],5:['write',0],6:['hammer'],7:['knit',3],8:['howl']}},
 {base:['chair','bed'],tasks:{0:['chair'],1:['sniff',3],2:['bed',1],3:['taste',0],4:['sort',2],5:['chair'],6:['chair'],7:['sleep'],8:['leafbed']}},
 {base:['stir','fish'],tasks:{0:['stir'],1:['roar'],2:['walk'],3:['honey',0],4:['repair',1],5:['dig'],6:['sleep',3],7:['fish'],8:['repair',1],9:['gather',2]}},
 {base:['inspect','brick'],tasks:{0:['inspect'],1:['mortar',0],2:['inspect'],3:['brick',2],4:['teach',3],5:['inspect',1],6:['brick',2],7:['mortar',0],8:['pigplans']}},
 {base:['cupboard','pastry'],tasks:{0:['cupboard'],1:['pet',0],2:['sort',2],3:['bake',1],4:['sort',2],5:['dog',3],6:['stir'],7:['sort',2],8:['pastry']}}
];
window.WOOD_DETAIL_EXTRA = [{"name": "Little Red", "generated": true, "clips": 4, "frames": 8}, {"name": "Granny Bramble", "generated": true, "clips": 4, "frames": 8}, {"name": "Hob the Woodcutter", "generated": true, "clips": 4, "frames": 8}, {"name": "Fenwick the Wolf", "generated": true, "clips": 4, "frames": 8}, {"name": "Goldie Locks", "generated": true, "clips": 4, "frames": 8}, {"name": "Papa Bear", "generated": true, "clips": 4, "frames": 8}, {"name": "Brick the Pig", "generated": true, "clips": 4, "frames": 8}, {"name": "Mother Hubbard", "generated": true, "clips": 4, "frames": 8}];
const WOOD_DETAIL_MOTIONS = [{"tasks": {"5": ["basketsort", 0], "6": ["grannyvisit", 1], "7": ["streamtrail", 2], "9": ["redberries", 3]}}, {"tasks": {"2": ["squirrelscold", 0], "3": ["grannystew", 1], "7": ["kettlenap", 2], "9": ["grannyberries", 3]}}, {"tasks": {"1": ["twigtest", 0], "6": ["pinework", 1], "8": ["shednap", 2], "9": ["hobberries", 3]}}, {"tasks": {"2": ["rabbitsmile", 0], "4": ["politepatrol", 1], "8": ["wolflullaby", 2], "9": ["wolfberries", 3]}}, {"tasks": {"5": ["goldiechairnap", 0], "6": ["chaircompare", 1], "7": ["bearwaitnap", 2], "8": ["leafbed", 3]}}, {"tasks": {"1": ["stumpgrowl", 0], "2": ["bearpace", 1], "5": ["berrypatch", 2], "7": ["bearfishing", 3]}}, {"tasks": {"2": ["walltap", 0], "8": ["pigplans", 1], "9": ["pigberries", 2], "12": ["wellsketch", 3]}}, {"tasks": {"6": ["hubbardstew", 0], "8": ["villageknit", 1], "10": ["hubbardpolish", 2], "12": ["hubbardsketch", 3]}}];
function woodMotion(ci,task){
 if(ci>=8||!task)return null;
 const alias={11:0,18:3,23:6},id=alias[task.i]??task.i;
 const detail=WOOD_DETAIL_MOTIONS[ci].tasks[id];
 if(detail)return {action:detail[0],extra:detail[1],detail:true};
 const wonderDetail=ci>=16&&ci<24?WONDER_DETAIL_MOTIONS[ci-16].tasks[id]:null;
 if(wonderDetail)return {action:wonderDetail[0],extra:wonderDetail[1],detail:true};
 const binding=WOOD_MOTIONS[ci].tasks[id];
 return binding?{action:binding[0],extra:binding[1]??null}:null;
}
window.GINGER_DETAIL_EXTRA = [{"name": "Gingerbread Man", "generated": true, "clips": 4, "frames": 8}, {"name": "Hansel", "generated": true, "clips": 4, "frames": 8}, {"name": "Gretel", "generated": true, "clips": 4, "frames": 8}, {"name": "Peppermint Witch", "generated": true, "clips": 4, "frames": 8}];
const GINGER_DETAIL_MOTIONS = [{"tasks": {"3": ["riverrace", 0], "4": ["ovenpose", 1], "7": ["cookiepetition", 2], "8": ["biscuitnap", 3]}}, {"tasks": {"2": ["candywindow", 0], "6": ["licoricemend", 1], "7": ["crumbcompass", 2], "8": ["ovennap", 3]}}, {"tasks": {"0": ["sugarpot", 0], "6": ["witchwatch", 1], "8": ["cottageicing", 2], "9": ["gretelberries", 3]}}, {"tasks": {"0": ["muffincackle", 0], "4": ["specialbake", 1], "7": ["pastryhouse", 2], "8": ["cakefoundation", 3]}}];
window.GINGER_DETAIL_EXTRA.push(...[{"name": "Sugarplum Fairy", "generated": true, "clips": 4, "frames": 8}, {"name": "Candy Cane Constable", "generated": true, "clips": 4, "frames": 8}, {"name": "Muffin Man", "generated": true, "clips": 4, "frames": 8}, {"name": "Sweet Tooth Troll", "generated": true, "clips": 4, "frames": 8}]);
GINGER_DETAIL_MOTIONS.push(...[{"tasks": {"0": ["gumdropdust", 0], "5": ["fencehover", 1], "6": ["villagesugar", 2], "8": ["gumdropnap", 3]}}, {"tasks": {"0": ["lollipopalibi", 0], "2": ["peppermintguard", 1], "6": ["bakerystakeout", 2], "8": ["cocoapatrol", 3]}}, {"tasks": {"0": ["neighborwave", 0], "5": ["muffintaste", 1], "7": ["lunchservice", 2], "8": ["neighborbook", 3]}}, {"tasks": {"0": ["lollipoptoll", 0], "2": ["bridgegrumble", 1], "4": ["goathaggle", 2], "8": ["sugarcrashnap", 3]}}]);
const GINGER_DETAIL_RENDER = [{"scale": 1.6103, "anchors": [0.4296875, 0.4140625, 0.3984375, 0.4921875], "baseline": 0.90625}, {"scale": 1.4286, "anchors": [0.375, 0.3671875, 0.375, 0.484375], "baseline": 0.90625}, {"scale": 1.5227, "anchors": [0.484375, 0.5078125, 0.3203125, 0.4921875], "baseline": 0.90625}, {"scale": 2.0958, "anchors": [0.3984375, 0.421875, 0.2734375, 0.5546875], "baseline": 0.90625}];
window.GINGER_EXTRA = [{"name": "Gingerbread Man", "generated": true, "clips": 4, "frames": 8}, {"name": "Hansel", "generated": true, "clips": 4, "frames": 8}, {"name": "Gretel", "generated": true, "clips": 4, "frames": 8}, {"name": "Peppermint Witch", "generated": true, "clips": 4, "frames": 8}, {"name": "Sugarplum Fairy", "generated": true, "clips": 4, "frames": 8}, {"name": "Candy Cane Constable", "generated": true, "clips": 4, "frames": 8}, {"name": "Muffin Man", "generated": true, "clips": 4, "frames": 8}, {"name": "Sweet Tooth Troll", "generated": true, "clips": 4, "frames": 8}];
const GINGER_MOTIONS = [
 {base:['run','run'],tasks:{0:['run'],1:['dodge',1],2:['crumbs',0],3:['run'],4:['wave'],5:['hide',2],6:['run'],7:['write'],8:['run'],12:['draw',3]}},
 {base:['pebbles','repair'],tasks:{0:['pebbles'],1:['count',0],2:['lookout'],3:['candy',1],4:['draw',2],5:['sugar',3],6:['repair'],7:['walk'],8:['pebbles']}},
 {base:['stir','lookout'],tasks:{0:['stir'],1:['oven',0],2:['spoon',1],3:['bake',2],4:['trade',3],5:['oven',0],6:['lookout'],7:['bake',2],8:['cottageicing']}},
 {base:['laugh','cast'],tasks:{0:['laugh'],1:['stir',0],2:['broom',1],3:['potion',3],4:['bake'],5:['taffy',2],6:['cast'],7:['bake'],8:['cakefoundation']}},
 {base:['dust','cast'],tasks:{0:['dust'],1:['twirl',0],2:['wave',3],3:['dance',2],4:['icing',1],5:['walk'],6:['cast'],7:['dance',2],8:['dust']}},
 {base:['inspect','lookout'],tasks:{0:['inspect'],1:['whistle',0],2:['lookout'],3:['interview',1],4:['inspect',2],5:['write',3],6:['lookout'],7:['inspect',2],8:['lookout']}},
 {base:['wave','bake'],tasks:{0:['wave'],1:['inspect',0],2:['hat',1],3:['bake',2],4:['delivery',3],5:['taste'],6:['bake',2],7:['bake',2],8:['teach']}},
 {base:['candy','hammer'],tasks:{0:['candy'],1:['count',0],2:['grumble'],3:['chew',1],4:['trade'],5:['sort',2],6:['hammer'],7:['dental',3],8:['hammer']}}
];
window.WONDER_EXTRA = [{"name": "Alice", "generated": true, "clips": 4, "frames": 8}, {"name": "White Rabbit", "generated": true, "clips": 4, "frames": 8}, {"name": "Mad Hatter", "generated": true, "clips": 4, "frames": 8}, {"name": "March Hare", "generated": true, "clips": 4, "frames": 8}, {"name": "Cheshire Cat", "generated": true, "clips": 4, "frames": 8}, {"name": "Queen of Hearts", "generated": true, "clips": 4, "frames": 8}, {"name": "Caterpillar", "generated": true, "clips": 4, "frames": 8}, {"name": "Dormouse", "generated": true, "clips": 4, "frames": 8}];
const WONDER_MOTIONS = [
 {base:['emote','walk'],tasks:{0:['emote'],1:['cake',0],2:['hair',1],3:['croquet',2],4:['tea',3],5:['question'],6:['walk'],7:['grow'],8:['walk']}},
 {base:['clock','walk'],tasks:{0:['clock'],1:['panic',0],2:['walk'],3:['letter',1],4:['wind',2],5:['tea',3],6:['walk'],7:['wind',2],8:['wind',2]}},
 {base:['tea','tea'],tasks:{0:['tea'],1:['seats',0],2:['riddle',1],3:['tea'],4:['hatmend',2],5:['cups',3],6:['tea'],7:['wind'],8:['tea']}},
 {base:['clock','tea'],tasks:{0:['clock'],1:['bounce',0],2:['cake',1],3:['teastir',2],4:['butter',3],5:['cups'],6:['tea'],7:['cake',1],8:['dig']}},
 {base:['emote','lookout'],tasks:{0:['emote'],1:['fade',0],2:['directions',1],3:['comment',3],4:['hover',2],5:['comment',3],6:['lookout'],7:['directions',1],8:['fade',0]}},
 {base:['emote','emote'],tasks:{0:['emote'],1:['roses',0],2:['rosepaint',1],3:['tarts',2],4:['emote'],5:['inspect'],6:['emote'],7:['laws',3],8:['rosepaint',1]}},
 {base:['emote','cocoon'],tasks:{0:['bubbles'],1:['question',0],2:['meditate',1],3:['meditate',1],4:['question',0],5:['mushrooms',2],6:['cocoon'],7:['growth',3],8:['cocoon']}},
 {base:['sleep','sleep'],tasks:{0:['sleep'],1:['wake',0],2:['jam',1],3:['teapot',2],4:['sleep'],5:['story',3],6:['sleep'],7:['sleep'],8:['story',3]}}
];
window.OZ_EXTRA = [{"name": "Dorothy", "generated": false, "clips": 0, "frames": 0, "fallback": "Existing base artwork and procedural task motion"}, {"name": "Scarecrow", "generated": true, "clips": 4, "frames": 8}, {"name": "Tin Woodman", "generated": false, "clips": 0, "frames": 0, "fallback": "Existing base artwork and procedural task motion"}, {"name": "Cowardly Lion", "generated": false, "clips": 0, "frames": 0, "fallback": "Existing base artwork and procedural task motion"}, {"name": "Glinda", "generated": false, "clips": 0, "frames": 0, "fallback": "Existing base artwork and procedural task motion"}, {"name": "Wicked Witch of the West", "generated": false, "clips": 0, "frames": 0, "fallback": "Existing base artwork and procedural task motion"}, {"name": "Wizard of Oz", "generated": true, "clips": 4, "frames": 8}, {"name": "Toto", "generated": true, "clips": 4, "frames": 8}];
const OZ_MOTIONS = [
 {tasks:{1:['slippers',0],2:['wave',1],4:['pie',2],5:['basket',3],7:['sweep']}},
 {tasks:{1:['stuffing',0],3:['route',1],4:['crow',2],5:['pillow',3]}},
 {tasks:{1:['tinpolish',0],3:['hum',1],4:['workshop',2],7:['rain',3]}},
 {tasks:{1:['hide',0],2:['bravestory',1],3:['courage',2],6:['fear',3]}},
 {tasks:{1:['wand',0],2:['crystal',1],5:['royaltea',2],7:['advice',3]}},
 {tasks:{1:['greenbrew',0],2:['broomcare',1],3:['potion',2],8:['witchnap',3]}},
 {tasks:{1:['voice',0],2:['levers',1],4:['illusion',2],7:['machine',3]}},
 {tasks:{1:['bone',0],2:['sniff',1],4:['fetch',2],5:['guard',3]}}
];
window.NEVER_EXTRA = [{"name": "Peter Pan", "generated": false, "clips": 0, "frames": 0, "fallback": "Existing base artwork and procedural task motion"}, {"name": "Tinker Bell", "generated": true, "clips": 4, "frames": 8}, {"name": "Captain Hook", "generated": false, "clips": 0, "frames": 0, "fallback": "Existing base artwork and procedural task motion"}, {"name": "Smee", "generated": true, "clips": 4, "frames": 8}, {"name": "Wendy", "generated": true, "clips": 4, "frames": 8}, {"name": "Tiger Lily", "generated": true, "clips": 4, "frames": 8}, {"name": "Lagoon Mermaid Coralie", "generated": true, "clips": 4, "frames": 8}, {"name": "Crocodile Tick-Tock", "generated": true, "clips": 4, "frames": 8}];
const NEVER_MOTIONS = [
 {tasks:{0:['crow'],6:['starflight'],8:['sleep']}},
 {tasks:{1:['pixiedust',0],3:['potrepair',1],4:['bellpolish',2],7:['belltalk',3]}},
 {tasks:{}},
 {tasks:{1:['shanty',0],3:['crewmeal',1],4:['sailmend',2],7:['treasuresort',3]}},
 {tasks:{1:['sockmend',0],3:['warmmeal',1],4:['darning',2],7:['treetidy',3]}},
 {tasks:{1:['tracking',0],2:['windread',1],4:['featherpaint',2],7:['archerylesson',3]}},
 {tasks:{1:['splash',0],3:['dolphinswim',1],4:['pearl',2],5:['coralcare',3],6:['dolphinswim',1]}},
 {tasks:{1:['snap',0],2:['slide',1],4:['clockdig',2],5:['seagull',3]}}
];
window.NIGHTS_EXTRA = [{"name": "Aladdin", "generated": true, "clips": 4, "frames": 8}, {"name": "Scheherazade", "generated": true, "clips": 4, "frames": 8}, {"name": "Sindbad", "generated": true, "clips": 4, "frames": 8}, {"name": "Genie", "generated": true, "clips": 4, "frames": 8}, {"name": "Ali Baba", "generated": true, "clips": 4, "frames": 8}, {"name": "Morgiana", "generated": true, "clips": 4, "frames": 8}, {"name": "Magic Carpet", "generated": true, "clips": 4, "frames": 8}, {"name": "Sultan Shahryar", "generated": true, "clips": 4, "frames": 8}];
const NIGHTS_MOTIONS = [
 {tasks:{2:['wallclimb',0],3:['lampcloth',1],4:['bazaartrade',2],5:['carpetride',3]}},
 {tasks:{1:['cliffhanger',0],2:['storygesture',1],4:['talescribe',2],7:['gardenstory',3]}},
 {tasks:{2:['horizon',0],3:['shipcargo',1],4:['merchanttrade',2],5:['islandchart',3]}},
 {tasks:{1:['smallwish',0],3:['innerpolish',1],4:['smallwish',0],5:['wishclause',2],7:['lampdecor',3],8:['lampdecor',3]}},
 {tasks:{1:['goldcount',0],2:['donkeycare',1],3:['goodssack',2],4:['treasurehide',3]}},
 {tasks:{1:['courtsweep',0],2:['roofwatch',1],4:['cleverplan',2],7:['shawldance',3]}},
 {tasks:{1:['carpetloop',0],2:['birdswerve',1],3:['passenger',2],5:['fringeweave',3]}},
 {tasks:{1:['throne',0],3:['royalcourt',1],5:['petition',2],7:['banquet',3],8:['banquet',3]}}
];
window.FROST_EXTRA = [{"name": "Gerda", "generated": true, "clips": 4, "frames": 8}, {"name": "Kai", "generated": true, "clips": 4, "frames": 8}, {"name": "Snow Queen", "generated": true, "clips": 4, "frames": 8}, {"name": "Snowman Flurry", "generated": true, "clips": 4, "frames": 8}, {"name": "Reindeer Rowan", "generated": true, "clips": 4, "frames": 8}, {"name": "Ice Skater Ingrid", "generated": true, "clips": 4, "frames": 8}, {"name": "Frost Hound Bruma", "generated": true, "clips": 4, "frames": 8}, {"name": "Aurora Sprite", "generated": true, "clips": 4, "frames": 8}];
const FROST_MOTIONS = [
 {tasks:{1:['winterhum',0],3:['longscarf',1],4:['coatstitch',2],5:['warmstone',3]}},
 {tasks:{1:['snowflakecraft',0],2:['mirrorlook',1],4:['icepuzzle',2],5:['hearthhands',3]}},
 {tasks:{1:['icethrone',0],3:['iceswan',1],4:['palaceplan',2],5:['coldtea',3]}},
 {tasks:{1:['snowball',0],2:['weathercheck',1],3:['snowfriend',2],7:['snowangel',3]}},
 {tasks:{2:['harnesscheck',0],3:['tinysleigh',1],4:['wintercargo',2],7:['antlercare',3]}},
 {tasks:{1:['circleglide',0],2:['skatejump',1],5:['danceplan',2],7:['skatelesson',3]}},
 {tasks:{2:['snowsniff',0],4:['snowden',1],5:['haretrack',2],7:['firesleep',3]}},
 {tasks:{1:['auroraribbon',0],2:['auroraribbon',0],3:['auroraweave',1],4:['skypaint',2],7:['polarchoir',3]}}
];
window.BRIAR_EXTRA = [{"name": "Briar Rose", "generated": true, "clips": 4, "frames": 8}, {"name": "Prince Florian", "generated": true, "clips": 4, "frames": 8}, {"name": "Fairy Fern", "generated": true, "clips": 4, "frames": 8}, {"name": "Spindle Spinner", "generated": true, "clips": 4, "frames": 8}, {"name": "Sleepy King", "generated": true, "clips": 4, "frames": 8}, {"name": "Briar Cook", "generated": true, "clips": 4, "frames": 8}, {"name": "Sleepwalker Wren", "generated": true, "clips": 4, "frames": 8}, {"name": "Thorn Hedgehog", "generated": true, "clips": 4, "frames": 8}];
const BRIAR_MOTIONS = [
 {tasks:{2:['rosescent',0],3:['centurysweep',1],4:['portraitdust',2],5:['rosecutting',3]}},
 {tasks:{1:['hedgecheck',0],2:['courtesybow',1],4:['armormend',2],7:['heroletter',3]}},
 {tasks:{1:['fernglitter',0],2:['rosebushshake',1],3:['partyplan',2],4:['invitation',3]}},
 {tasks:{1:['spindlecheck',0],2:['threadknot',1],3:['tapestry',2],4:['rosewool',3]}},
 {tasks:{1:['royalyawn',0],2:['briefwake',1],3:['shortcourt',2],4:['smalldecree',3]}},
 {tasks:{1:['onionchop',0],2:['souptaste',1],3:['carrotpeel',2],7:['kettleclean',3]}},
 {tasks:{1:['sleepmumble',0],2:['doorbump',1],5:['blanketcarry',2],7:['wrongbed',3]}},
 {tasks:{1:['briarroll',0],2:['rosesniff',1],3:['thorntrim',2],7:['hedgesleep',3]}}
];
window.CAMELOT_EXTRA = [{"name": "King Arthur", "generated": true, "clips": 4, "frames": 8}, {"name": "Merlin", "generated": true, "clips": 4, "frames": 8}, {"name": "Lancelot", "generated": true, "clips": 4, "frames": 8}, {"name": "Guinevere", "generated": true, "clips": 4, "frames": 8}, {"name": "Lady of the Lake", "generated": true, "clips": 4, "frames": 8}, {"name": "Sir Gawain", "generated": true, "clips": 4, "frames": 8}, {"name": "Squire Percy", "generated": true, "clips": 4, "frames": 8}, {"name": "Morgan le Fay", "generated": true, "clips": 4, "frames": 8}];
const CAMELOT_MOTIONS = [
 {tasks:{1:['fairjudgment',0],2:['crownadjust',1],4:['petitioner',2],7:['charter',3]}},
 {tasks:{1:['owlconsult',0],2:['runestone',1],3:['cauldronbrew',2],4:['starchart',3]}},
 {tasks:{1:['horsecheck',0],2:['knightsalute',1],5:['catrescue',2],8:['apology',3]}},
 {tasks:{1:['courtsmile',0],2:['queenwave',1],3:['courttea',2],7:['feastplan',3]}},
 {tasks:{1:['lakerise',0],2:['shoregaze',1],3:['swordpolish',2],5:['lakesong',3]}},
 {tasks:{1:['axecare',0],3:['promiseseal',1],5:['balladwrite',2],7:['bridgemend',3]}},
 {tasks:{1:['shieldpolish',0],2:['tabledust',1],5:['bannermend',2],8:['hayrest',3]}},
 {tasks:{1:['moonflower',0],2:['tealeaf',1],3:['violetbrew',2],4:['mistweave',3]}}
];
const WONDER_DETAIL_MOTIONS=[{"tasks": {"0": ["sensiblequestion", 0], "5": ["caterpillartalk", 1], "7": ["grow", 2], "8": ["dreamnap", 3]}}, {"tasks": {"0": ["watchcheck", 0], "2": ["hedgepeek", 1], "6": ["errandmap", 2], "8": ["oversleep", 3]}}, {"tasks": {"0": ["hatpour", 0], "3": ["smallparty", 1], "7": ["clockargue", 2], "8": ["hatdesign", 3]}}, {"tasks": {"0": ["butterwatch", 0], "5": ["cupswap", 1], "7": ["pieguard", 2], "8": ["harehouse", 3]}}];
const WONDER_DETAIL_RENDER=[{"scale": 1.4102, "anchors": [0.515625, 0.4375, 0.453125, 0.53125], "baseline": 0.90625}, {"scale": 1.3603, "anchors": [0.515625, 0.4609375, 0.5390625, 0.4921875], "baseline": 0.90625}, {"scale": 1.558, "anchors": [0.4140625, 0.375, 0.40625, 0.3828125], "baseline": 0.90625}, {"scale": 1.7273, "anchors": [0.5390625, 0.390625, 0.515625, 0.46875], "baseline": 0.90625}];
window.WONDER_DETAIL_EXTRA=[{"name": "Alice", "generated": true, "clips": 4, "frames": 8}, {"name": "White Rabbit", "generated": true, "clips": 4, "frames": 8}, {"name": "Mad Hatter", "generated": true, "clips": 4, "frames": 8}, {"name": "March Hare", "generated": true, "clips": 4, "frames": 8}];
WONDER_DETAIL_MOTIONS.push(...[{"tasks": {"0": ["branchgrin", 0], "3": ["wrongparty", 1], "5": ["haircomment", 2], "6": ["treelookout", 3]}}, {"tasks": {"0": ["royalproclaim", 0], "4": ["tinycourt", 1], "5": ["jamquestion", 2], "8": ["royalnap", 3]}}, {"tasks": {"0": ["ringpuff", 0], "2": ["toadstoolrest", 1], "6": ["cocoon", 2], "8": ["wingchange", 3]}}, {"tasks": {"4": ["cakedreamnap", 0], "6": ["partynap", 1], "7": ["hatnap", 2], "8": ["bestnap", 3]}}]);
WONDER_DETAIL_RENDER.push(...[{"scale": 1.9839, "anchors": [0.484375, 0.4765625, 0.453125, 0.4765625], "baseline": 0.90625}, {"scale": 1.6983, "anchors": [0.4921875, 0.3671875, 0.3828125, 0.484375], "baseline": 0.90625}, {"scale": 1.2833, "anchors": [0.4140625, 0.5078125, 0.4921875, 0.515625], "baseline": 0.90625}, {"scale": 2.4722, "anchors": [0.453125, 0.3984375, 0.5, 0.5078125], "baseline": 0.90625}]);
window.WONDER_DETAIL_EXTRA.push(...[{"name": "Cheshire Cat", "generated": true, "clips": 4, "frames": 8}, {"name": "Queen of Hearts", "generated": true, "clips": 4, "frames": 8}, {"name": "Caterpillar", "generated": true, "clips": 4, "frames": 8}, {"name": "Dormouse", "generated": true, "clips": 4, "frames": 8}]);
const OZ_RENDER={"0": {"scale": 1.3715, "anchors": [0.3984375, 0.515625, 0.3515625, 0.375], "baseline": 0.90625}, "2": {"scale": 1.2214, "anchors": [0.484375, 0.40625, 0.2578125, 0.5], "baseline": 0.90625}, "3": {"scale": 2.155, "anchors": [0.4609375, 0.3984375, 0.40625, 0.4609375], "baseline": 0.90625}, "4": {"scale": 1.6927, "anchors": [0.40625, 0.4453125, 0.3984375, 0.46875], "baseline": 0.90625}};
Object.assign(window.OZ_EXTRA[0],{generated:true,clips:4,frames:8});delete window.OZ_EXTRA[0].fallback;
Object.assign(window.OZ_EXTRA[2],{generated:true,clips:4,frames:8});delete window.OZ_EXTRA[2].fallback;
Object.assign(window.OZ_EXTRA[3],{generated:true,clips:4,frames:8});delete window.OZ_EXTRA[3].fallback;
Object.assign(window.OZ_EXTRA[4],{generated:true,clips:4,frames:8});delete window.OZ_EXTRA[4].fallback;

// Sherwood first work pass; stable resident/task IDs, four accepted columns.
window.SHERWOOD_EXTRA=['Robin Hood','Maid Marian','Little John','Friar Tuck','Will Scarlet','Sheriff of Nottingham','Alan-a-Dale','Sherwood Stag'].map((name,j)=>({name,generated:j<4,clips:j<4?4:0,frames:j<4?8:0}));
const SHERWOOD_MOTIONS=[
 {tasks:{1:['coinsharecount',0],2:['hollowhide',1],4:['coinshare',2],5:['outlawplan',3]}},
 {tasks:{1:['forestmap',0],2:['roadscout',1],3:['cleverlet',2],8:['nightplans',3]}},
 {tasks:{1:['loglift',0],5:['waterhaul',1],7:['campbreakfast',2],8:['shadenap',3]}},
 {tasks:{2:['campstir',0],3:['smallbrew',1],4:['campblessing',2],7:['longsermon',3]}}
];
const SHERWOOD_RENDER={"0": {"scale": 1.8571, "anchors": [0.421875, 0.4296875, 0.4609375, 0.4375], "baseline": 0.90625}, "1": {"scale": 1.049, "anchors": [0.4453125, 0.46875, 0.3984375, 0.4140625], "baseline": 0.90625}, "2": {"scale": 1.8135, "anchors": [0.484375, 0.5, 0.4765625, 0.5], "baseline": 0.90625}, "3": {"scale": 1.6208, "anchors": [0.40625, 0.4453125, 0.46875, 0.4921875], "baseline": 0.90625}};

// Accepted Deep Below art; Triton request rejected, existing behavior retained.
window.DEEP_EXTRA=['Little Mermaid Marina','Sea Witch Ursa','King Triton','Hermit Crab Clive','Nautilus Captain','Coral Weaver','Anglerfish Lamplighter','Pearl Diver Pim'].map((name,j)=>({name,generated:[0,1,3].includes(j),clips:[0,1,3].includes(j)?4:0,frames:[0,1,3].includes(j)?8:0}));
const DEEP_MOTIONS=[
 {tasks:{1:['pearlfind',0],3:['shoestudy',1],4:['seapoem',2],8:['clamrest',3]}},
 {tasks:{2:['tentacletap',0],3:['swiftpotion',1],5:['fineprint',2],8:['seabednap',3]}},
 {tasks:{}},
 {tasks:{1:['shellfit',0],2:['rockstudy',1],7:['shellbuild',2],8:['shellretreat',3]}}
];
const DEEP_RENDER={"0": {"scale": 1.3527, "anchors": [0.4609375, 0.4765625, 0.4296875, 0.5], "baseline": 0.90625}, "1": {"scale": 2.1071, "anchors": [0.4921875, 0.4765625, 0.4765625, 0.484375], "baseline": 0.90625}, "3": {"scale": 1.7734, "anchors": [0.4375, 0.453125, 0.4375, 0.546875], "baseline": 0.90625}};

// First four Beanstalk Heights work sheets, stable resident/task IDs.
window.SKY_EXTRA=['Jack','Giant Grumble','Giantess Gertie','Golden Harp','Golden Hen','Cloud Shepherd','Thunder Sprite','Bean Merchant'].map((name,j)=>({name,generated:j<4,clips:j<4?4:0,frames:j<4?8:0}));
const SKY_MOTIONS=[
 {tasks:{1:['beancheck',0],2:['cloudpeek',1],4:['beanwater',2],8:['leafnap',3]}},
 {tasks:{1:['giantscratch',0],3:['kingdomtidy',1],6:['stormnap',2],7:['bridgefix',3]}},
 {tasks:{1:['pantrycheck',0],3:['carrotchop',1],5:['sockmend',2],8:['giantessnap',3]}},
 {tasks:{1:['goldhum',0],3:['giantrecital',1],4:['balladwrite',2],8:['cloudharprest',3]}}
];
const SKY_RENDER={"0": {"scale": 1.5071, "anchors": [0.421875, 0.40625, 0.4140625, 0.4375], "baseline": 0.90625}, "1": {"scale": 2.325, "anchors": [0.4921875, 0.421875, 0.46875, 0.4375], "baseline": 0.90625}, "2": {"scale": 2.225, "anchors": [0.40625, 0.4296875, 0.4140625, 0.453125], "baseline": 0.90625}, "3": {"scale": 1.2689, "anchors": [0.484375, 0.4453125, 0.46875, 0.4296875], "baseline": 0.90625}};
const SKY_BASE_RENDER={"0": {"scale": 0.9, "feet": [0.95625, 0.95625, 0.95625, 0.9625, 0.95625, 0.95625, 0.95625, 0.9625]}, "1": {"scale": 1.55, "feet": [0.9625, 0.95625, 0.9625, 0.95625, 0.9625, 0.95625, 0.95625, 0.9625]}, "2": {"scale": 1.45, "feet": [0.9625, 0.95625, 0.9625, 0.95625, 0.95625, 0.9625, 0.9625, 0.9625]}, "3": {"scale": 1.15, "feet": [0.9625, 0.95625, 0.9625, 0.9625, 0.95625, 0.95625, 0.95625, 0.9625]}};

// Black Forest accepted work sheets. Snow White request rejected; original behavior retained.
window.FOREST_EXTRA=['Huntsman Gunther','Snow White','Dwarf Dooley','Evil Queen'].map((name,j)=>({name,generated:j!==1,clips:j!==1?4:0,frames:j!==1?8:0}));
const FOREST_MOTIONS=[
 {tasks:{2:['trapcheck',0],5:['quietdinner',1],7:['queendefy',2],8:['thicketnap',3]}},
 {tasks:{}},
 {tasks:{1:['workwhistle',0],2:['seamcheck',1],5:['gempolish',2],8:['dwarfnap',3]}},
 {tasks:{1:['crownfix',0],3:['beautybrew',1],5:['disguiseplan',2],7:['queenscheme',3]}}
];
const FOREST_RENDER={"0": {"scale": 1.3861, "anchors": [0.4140625, 0.453125, 0.5, 0.453125], "baseline": 0.90625}, "2": {"scale": 1.4186, "anchors": [0.5, 0.4296875, 0.390625, 0.4375], "baseline": 0.90625}, "3": {"scale": 1.4429, "anchors": [0.515625, 0.46875, 0.453125, 0.4453125], "baseline": 0.90625}};
const FOREST_BASE_RENDER={"0": {"scale": 1.1, "feet": [0.9625, 0.9625, 0.9625, 0.9625, 0.9625, 0.9625, 0.9625, 0.9625]}, "2": {"scale": 1, "feet": [0.9625, 0.9625, 0.9625, 0.9625, 0.9625, 0.9625, 0.9625, 0.9625]}, "3": {"scale": 1.05, "feet": [0.9625, 0.9625, 0.95625, 0.95625, 0.9625, 0.9625, 0.95, 0.9625]}};
function activityMotion(ci,task){
 if(ci<8)return woodMotion(ci,task);
 if(ci>=100||ci===82||ci===97||!task)return null;
 const alias={11:0,18:3,23:6},id=alias[task.i]??task.i;
 const detail=ci>=8&&ci<16?GINGER_DETAIL_MOTIONS[ci-8].tasks[id]:null;
 if(detail)return {action:detail[0],extra:detail[1],detail:true};
 const wonderDetail=ci>=16&&ci<24?WONDER_DETAIL_MOTIONS[ci-16].tasks[id]:null;
 if(wonderDetail)return {action:wonderDetail[0],extra:wonderDetail[1],detail:true};
 const binding=(ci<16?GINGER_MOTIONS[ci-8]:ci<24?WONDER_MOTIONS[ci-16]:ci<32?OZ_MOTIONS[ci-24]:ci<40?NEVER_MOTIONS[ci-32]:ci<48?NIGHTS_MOTIONS[ci-40]:ci<56?FROST_MOTIONS[ci-48]:ci<64?BRIAR_MOTIONS[ci-56]:ci<72?CAMELOT_MOTIONS[ci-64]:ci<80?SHERWOOD_MOTIONS[ci-72]:ci<88?DEEP_MOTIONS[ci-80]:ci<96?SKY_MOTIONS[ci-88]:FOREST_MOTIONS[ci-96]).tasks[id];
 return binding?{action:binding[0],extra:binding[1]??null}:ci>=24&&alias[task.i]!=null?{alias:id}:null;
}
function activityReady(ci){return ci<8?!!window.WOOD_EXTRA?.[ci]?.generated:ci<16?!!window.GINGER_EXTRA?.[ci-8]?.generated:ci<24?!!window.WONDER_EXTRA?.[ci-16]?.generated:ci<32?!!window.OZ_EXTRA?.[ci-24]?.generated:ci<40?!!window.NEVER_EXTRA?.[ci-32]?.generated:ci<48?!!window.NIGHTS_EXTRA?.[ci-40]?.generated:ci<56?!!window.FROST_EXTRA?.[ci-48]?.generated:ci<64?!!window.BRIAR_EXTRA?.[ci-56]?.generated:ci<72?!!window.CAMELOT_EXTRA?.[ci-64]?.generated:ci<80?!!window.SHERWOOD_EXTRA?.[ci-72]?.generated:ci<88?!!window.DEEP_EXTRA?.[ci-80]?.generated:ci<96?!!window.SKY_EXTRA?.[ci-88]?.generated:ci<100?!!window.FOREST_EXTRA?.[ci-96]?.generated:false;}

// v25 accepted artwork; extra Neverland requests were rejected by the image service.
OZ_RENDER[5]={"scale": 1.4053, "anchors": [0.421875, 0.421875, 0.390625, 0.4140625], "baseline": 0.90625};
Object.assign(window.OZ_EXTRA[5],{generated:true,clips:4,frames:8});delete window.OZ_EXTRA[5].fallback;
const NEVER_BASE_RENDER={"0": {"scale": 1.0642, "anchors": [0.5390625, 0.4609375, 0.5, 0.53125], "baseline": 0.90625}, "2": {"scale": 1.0373, "anchors": [0.515625, 0.515625, 0.5234375, 0.53125], "baseline": 0.90625}};

// v27 second half of Sherwood; task definitions/tuning remain unchanged.
SHERWOOD_MOTIONS.push(
 {tasks:{1:['twigcraft',0],2:['branchscout',1],7:['toolcare',2],8:['alertnap',3]}},
 {tasks:{1:['taxledger',0],4:['sheriffcourt',1],7:['wantedsketch',2],8:['towerplot',3]}},
 {tasks:{1:['bardhum',0],3:['songwrite',1],7:['feastlute',2],8:['lutenap',3]}},
 {tasks:{1:['stagalert',0],4:['stagdrink',1],5:['dewshake',2],8:['fernrest',3]}}
);
for(let j=4;j<8;j++)Object.assign(window.SHERWOOD_EXTRA[j],{generated:true,clips:4,frames:8});
Object.assign(SHERWOOD_RENDER,{"4": {"scale": 1.3257, "anchors": [0.5078125, 0.421875, 0.4296875, 0.4609375], "baseline": 0.90625}, "5": {"scale": 1.6208, "anchors": [0.4296875, 0.4453125, 0.4453125, 0.4765625], "baseline": 0.90625}, "6": {"scale": 1.5189, "anchors": [0.5, 0.484375, 0.4609375, 0.453125], "baseline": 0.90625}, "7": {"scale": 1.3258, "anchors": [0.484375, 0.4375, 0.484375, 0.46875], "baseline": 0.90625}});

// v29 remaining Deep Below residents; Triton remains on original behavior.
DEEP_MOTIONS.push(
 {tasks:{1:['shipclock',0],2:['portholewatch',1],4:['hullrepair',2],7:['captainlog',3]}},
 {tasks:{1:['coralwater',0],3:['coralsprout',1],4:['kelptrim',2],8:['polypnap',3]}},
 {tasks:{1:['shrimplure',0],2:['darkcheck',1],5:['glowgather',2],7:['lamprepair',3]}},
 {tasks:{2:['ropeknots',0],4:['pearlsort',1],5:['netmend',2],7:['pearlstring',3]}}
);
for(let j=4;j<8;j++)Object.assign(window.DEEP_EXTRA[j],{generated:true,clips:4,frames:8});
Object.assign(DEEP_RENDER,{"4": {"scale": 1.5476, "anchors": [0.453125, 0.453125, 0.421875, 0.421875], "baseline": 0.90625}, "5": {"scale": 1.3243, "anchors": [0.4375, 0.453125, 0.4375, 0.4296875], "baseline": 0.90625}, "6": {"scale": 1.6464, "anchors": [0.453125, 0.4453125, 0.421875, 0.421875], "baseline": 0.90625}, "7": {"scale": 1.0969, "anchors": [0.3984375, 0.375, 0.3828125, 0.40625], "baseline": 0.90625}});

// v31 second half of Beanstalk Heights; stored tasks unchanged.
SKY_MOTIONS.push(
 {tasks:{1:['henfluff',0],4:['nesttend',1],5:['eggcount',2],8:['strawnap',3]}},
 {tasks:{1:['cloudcount',0],4:['cloudshear',1],5:['rainweave',2],8:['cumulusnap',3]}},
 {tasks:{1:['cloudrumble',0],5:['lamplight',1],7:['stormcharge',2],8:['rodnap',3]}},
 {tasks:{3:['beanplant',0],4:['beansort',1],5:['beanpack',2],7:['refunddebate',3]}}
);
for(let j=4;j<8;j++)Object.assign(window.SKY_EXTRA[j],{generated:true,clips:4,frames:8});
Object.assign(SKY_RENDER,{"4": {"scale": 1.6719, "anchors": [0.5, 0.4375, 0.40625, 0.484375], "baseline": 0.90625}, "5": {"scale": 2.2679, "anchors": [0.34375, 0.3515625, 0.328125, 0.34375], "baseline": 0.90625}, "6": {"scale": 1.2792, "anchors": [0.4609375, 0.3984375, 0.4609375, 0.5078125], "baseline": 0.90625}, "7": {"scale": 1.5333, "anchors": [0.421875, 0.4296875, 0.4140625, 0.4453125], "baseline": 0.90625}});
Object.assign(SKY_BASE_RENDER,{"4": {"scale": 1, "feet": [0.9625, 0.95625, 0.9625, 0.95625, 0.9625, 0.95625, 0.9625, 0.9625]}, "5": {"scale": 1.05, "feet": [0.95625, 0.9625, 0.9625, 0.95625, 0.9625, 0.9625, 0.9625, 0.9625]}, "6": {"scale": 0.85, "feet": [0.9625, 0.95625, 0.95625, 0.95625, 0.95625, 0.95625, 0.95625, 0.95625]}, "7": {"scale": 1.08, "feet": [0.9625, 0.9625, 0.9625, 0.9625, 0.95625, 0.95625, 0.9625, 0.9625]}});
