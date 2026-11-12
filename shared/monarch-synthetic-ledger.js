/* MONARCH Synthetic Operations Ledger v0.1 — no live payment, refund, dispatch, or settlement. */
(function(root){
"use strict";
const ACTIONS=Object.freeze(["PAYMENT_REQUEST","PAYMENT_CONFIRM","REFUND_REQUEST","REFUND_CONFIRM","FULFILMENT_START","POD_RECORD"]);
const ids=/^[A-Za-z0-9_-]{2,80}$/;
const tenantIds=/^[a-z0-9][a-z0-9_-]{1,63}$/;
function makeLedger({tenant,clock=()=>new Date().toISOString()}={}){
 if(!tenantIds.test(tenant||""))throw Error("Valid tenant required");
 const cases=new Map(),journal=[],keys=new Map();let sequence=0;
 function event(caseId,kind,status){const entry=Object.freeze({seq:++sequence,tenant,caseId,time:clock(),kind,status});journal.push(entry);return entry}
 function get(id){const c=cases.get(id);if(!c)throw Error("Case not found in this tenant");return c}
 function view(id){const c=get(id);return Object.freeze({tenant,caseId:id,revision:c.revision,payment:c.payment,fulfilment:c.fulfilment,stopped:c.stopped,release:"HOLD",liveActions:false})}
 function register(id){if(!ids.test(id||"")||cases.has(id))throw Error("Invalid or duplicate synthetic case");cases.set(id,{revision:1,payment:"NONE",fulfilment:"NONE",stopped:false});event(id,"REGISTER","SYNTHETIC");return view(id)}
 function stop(id){const c=get(id);if(c.stopped)return view(id);c.stopped=true;c.revision++;event(id,"STOP","STOPPED");return view(id)}
 function execute({caseId,action,key,expectedRevision,amountMinor=0,currency="NGN",simulationAcknowledgement}={}){
 if(!ids.test(caseId||"")||!ids.test(key||""))throw Error("Valid case and idempotency key required");
 if(!ACTIONS.includes(action))throw Error("Unsupported operation");
 if(simulationAcknowledgement!=="SYNTHETIC_ONLY")throw Error("Synthetic-only acknowledgement required");
 if(!Number.isSafeInteger(amountMinor)||amountMinor<0||amountMinor>100000000000)throw Error("Invalid minor-unit amount");
 if(!/^[A-Z]{3}$/.test(currency))throw Error("Invalid ISO currency code");
 if(!Number.isSafeInteger(expectedRevision)||expectedRevision<1)throw Error("Expected revision required");
 const c=get(caseId);
 const fingerprint=JSON.stringify([caseId,action,amountMinor,currency]);
 const scopedKey=tenant+":"+caseId+":"+key;
 const prior=keys.get(scopedKey);
 if(prior){if(prior.fingerprint!==fingerprint)throw Error("Idempotency key conflict");return Object.freeze({duplicate:true,...prior.receipt})}
 if(c.stopped)throw Error("STOPPED case cannot execute");
 if(c.revision!==expectedRevision)throw Error("Stale case revision");
 if(["PAYMENT_REQUEST","PAYMENT_CONFIRM","REFUND_REQUEST","REFUND_CONFIRM"].includes(action)&&amountMinor===0)throw Error("Positive amount required");
 switch(action){
 case "PAYMENT_REQUEST":if(c.payment!=="NONE")throw Error("Payment already initiated");c.payment="PENDING_SIM";break;
 case "PAYMENT_CONFIRM":if(c.payment!=="PENDING_SIM")throw Error("Payment confirmation out of order");c.payment="PAID_SIM";break;
 case "REFUND_REQUEST":if(c.payment!=="PAID_SIM"||c.fulfilment!=="NONE")throw Error("Refund not eligible after fulfilment starts or without simulated payment");c.payment="REFUND_PENDING_SIM";break;
 case "REFUND_CONFIRM":if(c.payment!=="REFUND_PENDING_SIM")throw Error("Refund confirmation out of order");c.payment="REFUNDED_SIM";break;
 case "FULFILMENT_START":if(c.payment!=="PAID_SIM"||c.fulfilment!=="NONE")throw Error("Fulfilment requires simulated payment and cannot be duplicated");c.fulfilment="STARTED_SIM";break;
 case "POD_RECORD":if(c.fulfilment!=="STARTED_SIM")throw Error("Proof of delivery requires simulated fulfilment");c.fulfilment="POD_SIM";break;
 }
 c.revision++;
 event(caseId,action,"SYNTHETIC_ONLY");
 const receipt=Object.freeze({caseId,tenant,action,key,revision:c.revision,payment:c.payment,fulfilment:c.fulfilment,release:"HOLD",realMoneyMoved:false,realGoodsMoved:false});
 keys.set(scopedKey,{fingerprint,receipt});
 return Object.freeze({duplicate:false,...receipt});
 }
 function evidence(id){if(id)get(id);return Object.freeze(journal.filter(e=>!id||e.caseId===id).map(x=>({...x})))}
 return Object.freeze({register,view,stop,execute,evidence,actions:ACTIONS});
}
root.MonarchSyntheticLedger=Object.freeze({makeLedger,ACTIONS});
})(typeof window!=="undefined"?window:globalThis);
