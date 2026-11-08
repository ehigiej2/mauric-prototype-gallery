/* MONARCH OPPORTUNITY POLICY v0.1 — synthetic research only.
   No network requests, identity data, automated approvals or stored secrets.
   Shared governance utility for Waka, Trade and other prototype cockpits. */
(function(root){
 'use strict';
 function finite(n){return typeof n==='number'&&Number.isFinite(n)}
 function evaluate(input){
  const d=input||{},n=d.numbers||{},e=d.evidence||{};
  const invalid=Object.keys(n).some(k=>!finite(n[k])||n[k]<0);
  const evidence=Object.keys(e).map(k=>({check:k,status:e[k]===true?'REPORTED_BY_TESTER':'UNKNOWN'}));
  const blockers=[];
  if(invalid)blockers.push('INVALID_FINANCIAL_INPUT');
  if(!e.buyer)blockers.push('BUYER_UNVERIFIED');
  if(!e.product)blockers.push('PRODUCT_UNVERIFIED');
  if(!e.logistics)blockers.push('LOGISTICS_UNVERIFIED');
  if(d.exportMode&&!e.exportChecks)blockers.push('EXPORT_REQUIREMENTS_UNVERIFIED');
  if(d.exportMode&&!(n.exportStageCost>0))blockers.push('EXPORT_COST_ASSUMPTIONS_MISSING');
  if(finite(n.net)&&n.net<0)blockers.push('NEGATIVE_ILLUSTRATIVE_MARGIN');
  // Tester checkbox is not independent validation; never promote a scenario to live.
  return Object.freeze({
    protocol:'CROWN-OPPORTUNITY-POLICY-001',
    class:'SYNTHETIC_RESEARCH',
    decision: blockers.length?'RESEARCH_BLOCKED':'READY_FOR_INDEPENDENT_EVIDENCE_REVIEW',
    liveAuthorised:false, commerceAuthorised:false,
    evidence: evidence, blockers:blockers,
    disclosure:'Checks are self-reported; evidence authenticity and real-world approval remain UNKNOWN. CROWN HOLD.'
  });
 }
 root.MONARCHOpportunityPolicy=Object.freeze({version:'0.1.0',evaluate:evaluate});
})(typeof window==='undefined'?this:window);
