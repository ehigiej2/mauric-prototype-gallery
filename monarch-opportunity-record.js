/* CROWN-OPPORTUNITY-RECORD-001 — portable, synthetic research envelope.
   No storage, network access, live approvals, identity collection or permissions.
   Version 1.0.0: create and validate immutable evidence-labelled records. */
(function(root){
'use strict';
const VERSION='1.0.0';
const STATES=['SIMULATED','UNKNOWN','REPORTED','VERIFIED'];
const text=(value,max)=>String(value==null?'':value).trim().slice(0,max);
function numeric(value){return typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=1e12}
function build(fields){
 const f=fields||{};
 const money=f.money||{};
 const measures=['modeledGrossGap','modeledNetBenefit','incrementalCost'];
 const valid=measures.every(k=>numeric(money[k]));
 if(!valid) return {ok:false,error:'INVALID_OR_MISSING_FINANCIAL_INPUT'};
 const evidence=Array.isArray(f.evidence)?f.evidence.map(x=>({
  claim:text(x.claim,180),source:text(x.source,250),
  status:STATES.includes(x.status)?x.status:'UNKNOWN'
 })): [];
 const record={
  schema:'CROWN-OPPORTUNITY-RECORD-001',version:VERSION,
  id:'SIM-'+text(f.id,100),type:text(f.type,60),
  problem:text(f.problem,240),candidate:text(f.candidate,180),
  sourceCockpit:text(f.sourceCockpit||'WAKA',50),
  currency:'NGN',
  assumptions:Array.isArray(f.assumptions)?f.assumptions.map(x=>text(x,200)).slice(0,20):[],
  money:{modeledGrossGap:money.modeledGrossGap,modeledNetBenefit:money.modeledNetBenefit,incrementalCost:money.incrementalCost,
   realisedRevenue:null,verifiedSavings:null},
  evidence:evidence,
  risk:text(f.risk,360),nextHumanAction:text(f.nextHumanAction,360),
  decision:'RESEARCH_ONLY',
  permissions:{purchase:false,booking:false,dispatch:false,export:false,payment:false},
  measuredOutcome:'UNKNOWN',privacy:'NO_IDENTIFIABLE_PERSONAL_DATA',
  crownHold:true
 };
 return {ok:true,record:record};
}
function validate(record){
 const errors=[];
 if(!record||record.schema!=='CROWN-OPPORTUNITY-RECORD-001')errors.push('SCHEMA_MISMATCH');
 if(record&&record.crownHold!==true)errors.push('CROWN_HOLD_REQUIRED');
 if(record&&record.decision!=='RESEARCH_ONLY')errors.push('DECISION_NOT_ALLOWED');
 if(record&&record.permissions&&Object.values(record.permissions).some(Boolean))errors.push('ACTION_PERMISSION_NOT_ALLOWED');
 if(record&&record.money&&record.money.realisedRevenue!==null)errors.push('UNVERIFIED_REVENUE_FIELD');
 if(record&&record.money&&record.money.verifiedSavings!==null)errors.push('UNVERIFIED_SAVINGS_FIELD');
 return {valid:errors.length===0,errors:errors};
}
root.MONARCHOpportunityRecord=Object.freeze({version:VERSION,build:build,validate:validate});
})(typeof window==='undefined'?this:window);
