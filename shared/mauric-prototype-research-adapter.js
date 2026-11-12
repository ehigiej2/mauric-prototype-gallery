/* MAURIC shared prototype adapter v0.1 — synthetic research ONLY.
   Opt-in per prototype; no automatic storage, network, approval or data transfer. */
(function(root){
'use strict';
const ID=/^[a-z0-9][a-z0-9_-]{1,63}$/;
function validate(value,label){if(!ID.test(value||''))throw Error('Invalid '+label);return value;}
function connect({tenant,prototype,storage=root.localStorage,crypto=root.crypto}={}){
 validate(tenant,'tenant');validate(prototype,'prototype');
 if(!root.MonarchResearchMemory?.create)throw Error('Load secure-research-memory.js first');
 const memory=root.MonarchResearchMemory.create({tenant,prototype,storage,crypto});
 // References contain no content, ciphertext, credentials or approvals.
 function makeReference({id,revision=1,destination}={}){
  validate(id,'reference');validate(destination,'destination');
  if(!Number.isSafeInteger(revision)||revision<1)throw Error('Invalid revision');
  return Object.freeze({schema:'mauric-synthetic-research-reference-v1',tenant,source:prototype,destination,id,revision,kind:'RESEARCH_REFERENCE_ONLY'});
 }
 function acceptReference(packet){
  if(!packet||packet.schema!=='mauric-synthetic-research-reference-v1'||packet.tenant!==tenant||packet.destination!==prototype||packet.kind!=='RESEARCH_REFERENCE_ONLY')throw Error('Cross-tenant, destination or schema mismatch');
  validate(packet.source,'source');validate(packet.id,'reference');
  if(!Number.isSafeInteger(packet.revision)||packet.revision<1)throw Error('Invalid revision');
  const expected=['schema','tenant','source','destination','id','revision','kind'];
  if(Object.keys(packet).some(k=>!expected.includes(k)))throw Error('Unexpected handoff fields');
  return Object.freeze({acceptedForReview:true,verified:false,reference:packet.id,source:packet.source,revision:packet.revision});
 }
 return Object.freeze({tenant,prototype,memory,makeReference,acceptReference});
}
root.MauricPrototypeResearch=Object.freeze({connect});
if(typeof module!=='undefined'&&module.exports)module.exports={connect};
})(typeof window!=='undefined'?window:globalThis);
