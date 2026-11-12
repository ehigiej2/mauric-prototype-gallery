/* MONARCH Offline Reconciliation Lab — synthetic references only. NOT durable or encrypted storage. */
(function(root){"use strict";
const ACTIONS=["PAYMENT_REQUEST","PAYMENT_CONFIRM","REFUND_REQUEST","REFUND_CONFIRM","FULFILMENT_START","POD_RECORD"];
const id=/^[A-Za-z0-9_-]{2,80}$/,tenantId=/^[a-z0-9][a-z0-9_-]{1,63}$/;
const uncertain=new Set(["PAYMENT_CONFIRM","REFUND_CONFIRM","FULFILMENT_START","POD_RECORD"]);
function makeQueue({tenant,clock=()=>new Date().toISOString()}={}){
 if(!tenantId.test(tenant||""))throw Error("Tenant required");
 const records=new Map(),order=[];
 function safeCopy(r){return Object.freeze({...r})}
 function validate(input){
 if(!input||!id.test(input.caseId||"")||!id.test(input.key||"")||!ACTIONS.includes(input.action))throw Error("Invalid synthetic command");
 if(!Number.isSafeInteger(input.expectedRevision)||input.expectedRevision<1)throw Error("Invalid expected revision");
 if(!Number.isSafeInteger(input.amountMinor??0)||(input.amountMinor??0)<0||input.amountMinor>100000000000)throw Error("Invalid amount");
 if(!/^[A-Z]{3}$/.test(input.currency||"NGN"))throw Error("Invalid currency");
 return {caseId:input.caseId,key:input.key,action:input.action,expectedRevision:input.expectedRevision,amountMinor:input.amountMinor??0,currency:input.currency||"NGN"};
 }
 function enqueue(input){const cmd=validate(input),identity=cmd.caseId+":"+cmd.key,prior=records.get(identity);
 if(prior){if(JSON.stringify(prior.command)!==JSON.stringify(cmd))throw Error("Offline idempotency conflict");return Object.freeze({duplicate:true,record:safeCopy(prior)})}
 const record={identity,command:Object.freeze(cmd),status:"QUEUED_UNVERIFIED",created:clock(),reason:"Offline intent only; no external action executed"};
 records.set(identity,record);order.push(identity);return Object.freeze({duplicate:false,record:safeCopy(record)})}
 function inspect(){return Object.freeze(order.map(k=>safeCopy(records.get(k))))}
 function markUnknown(caseId,key,reason){const r=records.get(caseId+":"+key);if(!r)throw Error("Unknown queue record");if(r.status==="RESOLVED_SIM"||r.status==="CANCELLED")throw Error("Finalised record");r.status="UNKNOWN_EXTERNAL_OUTCOME";r.reason=String(reason||"Connection interruption; outcome cannot be inferred").slice(0,200);return safeCopy(r)}
 function cancel(caseId,key){const r=records.get(caseId+":"+key);if(!r)throw Error("Unknown queue record");if(r.status==="RESOLVED_SIM")throw Error("Cannot cancel resolved rehearsal");r.status="CANCELLED";r.reason="Locally cancelled; external outcome remains unverified";return safeCopy(r)}
 function rehearse(caseId,key,ledger,{humanReconciled=false}={}){
 const r=records.get(caseId+":"+key);if(!r)throw Error("Unknown queue record");
 if(r.status==="RESOLVED_SIM")return Object.freeze({duplicate:true,record:safeCopy(r)});
 if(r.status==="CANCELLED")throw Error("Cancelled command cannot execute");
 if(r.status==="UNKNOWN_EXTERNAL_OUTCOME")throw Error("Unknown external outcome must be reconciled out-of-band; automatic replay prohibited");
 if(uncertain.has(r.command.action)&&!humanReconciled)throw Error("High-risk action requires explicit human simulation reconciliation");
 if(!ledger||typeof ledger.execute!=="function")throw Error("Synthetic ledger required");
 const result=ledger.execute({...r.command,simulationAcknowledgement:"SYNTHETIC_ONLY"});
 r.status="RESOLVED_SIM";r.reason="In-memory synthetic ledger rehearsal only";r.result=Object.freeze({...result});return Object.freeze({duplicate:false,record:safeCopy(r)})}
 function exportUntrusted(){return JSON.stringify({schema:"monarch-offline-queue-research-v1",tenant,records:inspect().map(r=>({command:r.command,status:r.status,created:r.created}))})}
 function inspectUntrustedArchive(raw){let obj;try{obj=JSON.parse(raw)}catch{throw Error("Invalid archive JSON")}
 if(!obj||obj.schema!=="monarch-offline-queue-research-v1"||obj.tenant!==tenant||!Array.isArray(obj.records)||obj.records.length>1000)throw Error("Wrong tenant or archive schema");
 const identities=new Set();return Object.freeze(obj.records.map(r=>{const c=validate(r?.command),key=c.caseId+":"+c.key;if(identities.has(key))throw Error("Duplicate archive key");identities.add(key);return Object.freeze({command:Object.freeze(c),status:"QUARANTINED_UNTRUSTED",reason:"Archive is unverified; no automatic restore or replay"})}))}
 return Object.freeze({enqueue,inspect,markUnknown,cancel,rehearse,exportUntrusted,inspectUntrustedArchive,release:"HOLD"});
}
root.MonarchOfflineLab=Object.freeze({makeQueue});
})(typeof window!=="undefined"?window:globalThis);
