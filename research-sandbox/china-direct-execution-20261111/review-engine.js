(function(root){
'use strict';
const specs=['specification','quantity','currency','destination','delivery_scope','quality_returns'];
const text=v=>typeof v==='string'&&v.trim().length>0;
function compare(a,b,fee,now){
 const unknown=[];
 for(const [name,q] of [['import',a],['local',b]]){
  for(const k of specs.concat('source','valid_until'))if(k==='quantity'?!(Number.isInteger(q[k])&&q[k]>0):!text(q[k]))unknown.push(name+'.'+k);
  if(q.total===null||q.total===undefined||String(q.total).trim()===''||!Number.isFinite(Number(q.total))||Number(q.total)<0)unknown.push(name+'.total');
 }
 if(fee===null||fee===undefined||String(fee).trim()===''||!Number.isFinite(Number(fee))||Number(fee)<0)unknown.push('disclosed_fee');
 if(unknown.length)return {status:'UNKNOWN',reasons:unknown};
 const mismatches=specs.filter(k=>String(a[k]).trim()!==String(b[k]).trim());
 if(mismatches.length)return {status:'NOT COMPARABLE',reasons:mismatches};
 const nowDate=new Date(now),dates=[new Date(a.valid_until),new Date(b.valid_until)];
 if(!Number.isFinite(+nowDate)||dates.some(d=>!Number.isFinite(+d)))return {status:'INVALID',reasons:['Invalid comparison or quotation date']};
 if(dates.some(d=>d<nowDate))return {status:'EXPIRED',reasons:['At least one quotation has expired']};
 const customerTotal=Number(a.total)+Number(fee),difference=Number(b.total)-customerTotal;
 if(!Number.isFinite(customerTotal)||!Number.isFinite(difference))return {status:'INVALID',reasons:['Arithmetic overflow']};
 return {status:'SIMULATED',customerTotal,difference,currency:a.currency,quantity:a.quantity,meaning:difference>0?'Potential saving, unverified':difference<0?'Import route costs more':'No saving'};
}
function brief(input,now){
 const comparison=compare(input.import,input.local,input.fee,now);
 return {version:1,created_at:now,status:'PREPARED FOR OWNER REVIEW — NOT APPROVED',crown_hold:true,comparison,
 supplier_enquiries:'NOT SENT — authorised sender identity/account unconfirmed',
 next_action:comparison.status==='SIMULATED'?'Independently verify source documents, exact specification, importer/compliance, fulfilment and returns before owner decision.':'Resolve comparison blockers before any recommendation.',
 limitations:'User-entered planning data only; no verified savings, order, contract, payment or live inventory. Do not enter customer details.'};
}
const api={specs,compare,brief};if(typeof module!=='undefined')module.exports=api;root.ReviewEngine=api;
})(typeof window!=='undefined'?window:globalThis);