/* Synthetic decision ledger: explicit authorised lock events only.
 No chat scraping, network, financial execution, or cross-tenant transfer. */
(function(root){
'use strict';
const ID=/^[a-z0-9][a-z0-9_-]{1,63}$/;
const TYPES=new Set(['locked','superseded','revoked']);
function connect({tenant,prototype,storage,now=()=>Date.now()}={}){
 if(!ID.test(tenant||'')||!ID.test(prototype||''))throw Error('Explicit tenant and prototype required');
 if(!storage)throw Error('Storage required');
 const key='mauric-synthetic-decisions-v1:'+tenant+':'+prototype;
 function read(){const raw=storage.getItem(key);if(!raw)return [];if(raw.length>100000)throw Error('Ledger too large');const data=JSON.parse(raw);if(!Array.isArray(data)||data.length>100)throw Error('Invalid ledger');return data;}
 function lock({id,summary,source,approvedBy,approvalRecorded=false}={}){
  if(!ID.test(id||'')||typeof summary!=='string'||summary.length<1||summary.length>500||typeof source!=='string'||source.length<1||source.length>120)throw Error('Invalid decision');
  if(approvalRecorded!==true||typeof approvedBy!=='string'||approvedBy.length<2||approvedBy.length>100)throw Error('Explicit approval record required');
  const entries=read();if(entries.some(x=>x.id===id))throw Error('Decision ID already recorded');
  const event={id,summary,source,approvedBy,at:now(),status:'locked',executionAuthorised:false};
  if(entries.length>=100)throw Error('Ledger capacity reached');
  storage.setItem(key,JSON.stringify([...entries,event]));return Object.freeze({...event});
 }
 // Single-action adapter for authorised conversation interfaces.
 // The caller must explicitly supply an approval event; never infer approval
 // from assistant text, a model summary, or an untrusted chat message.
 function captureApproved({decisionKey,summary,source,approvedBy,approvalRecorded=false}={}){
  if(!ID.test(decisionKey||''))throw Error('Valid decision key required');
  if(approvalRecorded!==true)throw Error('Explicit approval record required');
  const existing=read().find(x=>x.id===decisionKey);
  if(existing){
   if(existing.status!=='locked')throw Error('Decision no longer active: explicit new approval required');
   if(existing.summary!==summary||existing.source!==source||existing.approvedBy!==approvedBy)
    throw Error('Decision key conflict: use a new key and supersede explicitly');
   return Object.freeze({...existing,alreadyRecorded:true});
  }
  return lock({id:decisionKey,summary,source,approvedBy,approvalRecorded});
 }
 function latestLocked(){return list().filter(x=>x.status==='locked').sort((a,b)=>b.at-a.at);}
 function change({id,status,approvedBy}={}){
  if(!ID.test(id||'')||!TYPES.has(status)||status==='locked'||typeof approvedBy!=='string'||approvedBy.length<2)throw Error('Invalid change');
  const entries=read(),idx=entries.findIndex(x=>x.id===id);
  if(idx<0)throw Error('Decision not found');
  if(entries[idx].status!=='locked')throw Error('Decision already closed');
  entries[idx]={...entries[idx],status,changedAt:now(),changedBy:approvedBy};
  storage.setItem(key,JSON.stringify(entries));return Object.freeze({...entries[idx]});
 }
 function list(){return read().map(x=>Object.freeze({...x}));}
 function clear(){storage.removeItem(key);}
 return Object.freeze({lock,captureApproved,latestLocked,change,list,clear});
}
root.MauricSyntheticDecisionLedger=Object.freeze({connect});
if(typeof module!=='undefined'&&module.exports)module.exports={connect};
})(typeof window!=='undefined'?window:globalThis);
