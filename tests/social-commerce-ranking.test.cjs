const assert=require('node:assert/strict');const a=require('../engines/monarch-social-commerce-ranking-v1.js');
const empty=a.rank([{id:'a',name:'unknown',channel:'tiktok'}])[0];assert.equal(empty.eligible,false);assert.equal(empty.score,0);assert.equal(empty.gate,'HOLD_EVIDENCE_REQUIRED');
const verified={demand:1,repeat:1,contribution:1,reliability:1,permissions:1,safety:1,sourceQuality:1};
const ok=a.rank([{id:'b',name:'test',channel:'whatsapp',evidence:verified}])[0];assert.equal(ok.score,100);assert.equal(ok.eligible,true);assert.equal(ok.gate,'RESEARCH_REVIEW_ONLY');
assert.equal(a.rank([{evidence:{...verified,permissions:0}}])[0].eligible,false);
assert.equal(a.unitEconomics({jobs:20,fee:2500,carrier:1500,handling:200,claims:100,fixed:10000}).periodContribution,4000);
assert.equal(a.unitEconomics({jobs:20,fee:2500,carrier:1500,handling:200,claims:100,fixed:10000}).breakEvenJobs,15);
assert.throws(()=>a.unitEconomics({jobs:-1,fee:1,carrier:0,handling:0,claims:0,fixed:0}));
console.log('PASS: evidence hold, ranking, permissions, downside, break-even, invalid inputs');
