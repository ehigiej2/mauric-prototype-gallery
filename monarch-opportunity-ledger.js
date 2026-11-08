/* CROWN-OPPORTUNITY-LEDGER-001 · session-only portable research ledger.
   No network, persistence, live approvals or inferred verified outcomes. */
(function(root){
'use strict';
const MAX=250;
function clone(x){return JSON.parse(JSON.stringify(x))}
function key(r){return [r.sourceCockpit,r.type,r.problem,r.candidate].map(v=>String(v||'').trim().toLowerCase()).join('|')}
function newLedger(){let entries=[];let seq=0;
function add(record){
 const check=root.MONARCHOpportunityRecord&&root.MONARCHOpportunityRecord.validate(record);
 if(!check||!check.valid)return {ok:false,error:'INVALID_RECORD',details:check?check.errors:[]};
 const fingerprint=key(record), match=entries.find(x=>x.fingerprint===fingerprint);
 if(match)return {ok:false,error:'POSSIBLE_DUPLICATE',existingId:match.id};
 if(entries.length>=MAX)return {ok:false,error:'LEDGER_CAP_REACHED'};
 const id='LEDGER-'+String(++seq).padStart(4,'0');
 entries.push({id,fingerprint,record:clone(record),revisions:[{version:1,kind:'CREATED',reason:'Initial research entry',snapshot:clone(record)}]});
 return {ok:true,id,count:entries.length};
}
function revise(id,values,reason){
 const row=entries.find(x=>x.id===id);
 if(!row)return {ok:false,error:'NOT_FOUND'};
 const n=values||{},allowed=['modeledGrossGap','modeledNetBenefit','incrementalCost'];
 if(!reason||String(reason).trim().length<5)return {ok:false,error:'REVISION_REASON_REQUIRED'};
 if(Object.keys(n).some(k=>!allowed.includes(k)))return {ok:false,error:'FIELD_NOT_EDITABLE'};
 if(Object.values(n).some(v=>typeof v!=='number'||!Number.isFinite(v)||v<0||v>1e12))return {ok:false,error:'INVALID_REVISION'};
 const next=clone(row.record);Object.assign(next.money,n);
 if(!root.MONARCHOpportunityRecord.validate(next).valid)return {ok:false,error:'INVALID_RECORD'};
 row.record=next;row.revisions.push({version:row.revisions.length+1,kind:'ASSUMPTION_REVISED',reason:String(reason).trim().slice(0,200),snapshot:clone(next)});
 return {ok:true,id,revision:row.revisions.length};
}
function list(){return clone(entries.map(x=>({id:x.id,key:x.fingerprint,record:x.record,revisionCount:x.revisions.length})))}
function history(id){const row=entries.find(x=>x.id===id);return row?clone(row.revisions):[]}
function exportJson(){return JSON.stringify({schema:'CROWN-OPPORTUNITY-LEDGER-001',version:1,crownHold:true,classification:'SYNTHETIC_RESEARCH',entries:entries},null,2)}
function importJson(raw){
 let parsed;
 try{parsed=JSON.parse(raw)}catch(e){return {ok:false,error:'INVALID_JSON'}}
 if(!parsed||parsed.schema!=='CROWN-OPPORTUNITY-LEDGER-001'||parsed.crownHold!==true||!Array.isArray(parsed.entries)||parsed.entries.length>MAX)return {ok:false,error:'UNTRUSTED_LEDGER'};
 const keys=new Set(),ids=new Set();
 for(const row of parsed.entries){
  if(!row||typeof row.id!=='string'||!/^LEDGER-[0-9]{4}$/.test(row.id)||ids.has(row.id)||!row.record||key(row.record)!==row.fingerprint||keys.has(row.fingerprint)||!Array.isArray(row.revisions)||!row.revisions.length)return {ok:false,error:'INVALID_LEDGER_ENTRY'};
  ids.add(row.id);keys.add(row.fingerprint);
  if(!root.MONARCHOpportunityRecord||!root.MONARCHOpportunityRecord.validate(row.record).valid)return {ok:false,error:'UNSAFE_RECORD'};
  for(let i=0;i<row.revisions.length;i++){
   const v=row.revisions[i];
   if(!v||v.version!==i+1||!v.snapshot||!root.MONARCHOpportunityRecord.validate(v.snapshot).valid)return {ok:false,error:'INVALID_REVISION_HISTORY'};
  }
  if(JSON.stringify(row.revisions[row.revisions.length-1].snapshot)!==JSON.stringify(row.record))return {ok:false,error:'LATEST_REVISION_MISMATCH'};
 }
 entries=clone(parsed.entries);seq=entries.reduce((m,r)=>Math.max(m,Number(r.id.slice(7))),0);
 return {ok:true,count:entries.length,notice:'Imported self-reported data is NOT verified evidence'};
}
return Object.freeze({add,revise,list,history,exportJson,importJson});
}
root.MONARCHOpportunityLedger=Object.freeze({version:'1.0.0',create:newLedger});
})(typeof window==='undefined'?this:window);
