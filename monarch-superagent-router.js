/* CROWN-SUPERAGENT-ROUTER-001
   Deterministic local research planner. NO AI inference, network calls,
   delegated execution, approvals, personal data, or persistent memory. */
(function(root){
'use strict';
const ROUTES=Object.freeze({
 farmer:['OSAYI','TRADE','WAKA','EXPORTBRIDGE','CROWN'],
 trader:['OSAYI','TRADE','WAKA','CROWN'],
 mechanic:['OSAYI','TRADE','WAKA','CROWN'],
 vehicle:['OSAYI','WAKA','KNIGHTPRIDE','CROWN'],
 diaspora:['OSAYI','TRADE','EXPORTBRIDGE','KNIGHTPRIDE','CROWN']
});
const DESCRIPTIONS=Object.freeze({
 OSAYI:'Explain the opportunity in plain Pidgin; record assumptions and ask human questions.',
 TRADE:'Research buyers, stock, compatible suppliers and possible unit economics; no purchase.',
 WAKA:'Assess suitability, fictional trip economics and operator checks; no dispatch.',
 EXPORTBRIDGE:'Research HS classification, destination requirements and document gaps; no export.',
 KNIGHTPRIDE:'Assess freight capacity, delivery handling and illustrative quotes; no operator assigned.',
 CROWN:'Review evidence gaps and prepare human decision checklist; no automatic approval.'
});
function plan(record,ledgerId){
 const api=root.MONARCHOpportunityRecord, check=api&&api.validate(record);
 if(!check||!check.valid)return {ok:false,error:'RECORD_INVALID'};
 if(typeof ledgerId!=='string'||!/^LEDGER-[0-9]{4}$/.test(ledgerId))return {ok:false,error:'LEDGER_REFERENCE_REQUIRED'};
 const type=record.type,sequence=ROUTES[type];
 if(!sequence)return {ok:false,error:'UNSUPPORTED_SECTOR'};
 const requires=record.evidence.filter(e=>e.status!=='VERIFIED').map(e=>e.claim);
 const tasks=sequence.map((agent,i)=>({
  step:i+1,agent,description:DESCRIPTIONS[agent],
  status:'PROPOSED_RESEARCH_ONLY',requiresHumanReview:true,
  actionExecuted:false
 }));
 return {ok:true,protocol:'CROWN-SUPERAGENT-ROUTER-001',ledgerId,
  recordId:record.id,sector:type,sourceCockpit:record.sourceCockpit,
  tasks,unresolvedEvidence:requires,
  plannedAgentCount:tasks.length,executedAgentCount:0,
  decision:'HUMAN_REVIEW_REQUIRED',crownHold:true,
  permittedActions:[],disclosure:'Specialists are proposed research roles, not active connected autonomous agents.'};
}
root.MONARCHSuperagentRouter=Object.freeze({version:'1.0.0',plan});
})(typeof window==='undefined'?this:window);
