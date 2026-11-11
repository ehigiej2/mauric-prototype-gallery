const assert=require('node:assert/strict'),e=require('./review-engine.js'),cost=require('./cost-engine.js');let count=0;function test(n,f){f();console.log('PASS '+n);count++}
const now='2026-11-11T21:00:00.000Z';const a={specification:'cotton180gsm black shirt S–XXL specified mix',quantity:10,currency:'NGN',destination:'Benin City',delivery_scope:'Delivered by 20Dec2026',quality_returns:'Same measurements and 14-day defect remedy',source:'SIMULATED fixture',valid_until:'2026-11-20T00:00:00Z',total:13000};const b={...a,total:15000};
test('fee reduces potential savings',()=>assert.equal(e.compare(a,b,1000,now).difference,1000));
test('negative difference retained',()=>assert.equal(e.compare(a,b,3000,now).difference,-1000));
test('no savings retained',()=>assert.equal(e.compare(a,b,2000,now).difference,0));
test('unknown fee not zero',()=>assert.equal(e.compare(a,b,'',now).status,'UNKNOWN'));
for(const k of e.specs)test('mismatched '+k+' blocks ranking',()=>assert.equal(e.compare(a,{...b,[k]:k==='quantity'?50:'different'},0,now).status,'NOT COMPARABLE'));
for(const k of ['source','valid_until','total'])test('missing '+k+' blocks ranking',()=>assert.equal(e.compare(a,{...b,[k]:''},0,now).status,'UNKNOWN'));
test('expired quote blocked',()=>assert.equal(e.compare(a,{...b,valid_until:'2026-11-10T00:00:00Z'},0,now).status,'EXPIRED'));
test('invalid date blocked',()=>assert.equal(e.compare(a,{...b,valid_until:'not-a-date'},0,now).status,'INVALID'));
test('text quantity blocked',()=>assert.equal(e.compare({...a,quantity:'ten'},{...b,quantity:'ten'},0,now).status,'UNKNOWN'));test('whitespace price blocked',()=>assert.equal(e.compare(a,{...b,total:' '},0,now).status,'UNKNOWN'));test('negative fee blocked',()=>assert.equal(e.compare(a,b,-1,now).status,'UNKNOWN'));
test('infinite price blocked',()=>assert.equal(e.compare(a,{...b,total:Infinity},0,now).status,'UNKNOWN'));
test('brief cannot approve or lift hold',()=>{const r=e.brief({import:a,local:b,fee:0},now);assert.equal(r.crown_hold,true);assert.match(r.status,/NOT APPROVED/);assert.equal(r.comparison.status,'SIMULATED')});
const costs=Object.fromEntries(cost.fields.map(k=>[k,0]));Object.assign(costs,{currency:'NGN',evidence:' ',accepted_units:1});test('whitespace evidence rejected',()=>assert.equal(cost.calculate(costs).status,'UNKNOWN'));test('cost sum overflow rejected',()=>assert.equal(cost.calculate({...costs,evidence:'SIMULATED',goods:1e308,freight:1e308}).status,'INVALID'));
console.log(count+' review/hardening tests passed; no supplier quotations verified.');