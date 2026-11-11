/* MAURIC Nigeria social-commerce evidence ranking v1. Research only; no scraping or tracking. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.MonarchSocialCommerceRanking=api})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const weights={demand:0.23,repeat:0.13,contribution:0.19,reliability:0.14,permissions:0.16,safety:0.10,sourceQuality:0.05};
const channels=['whatsapp','facebook','tiktok','instagram','offline','other'];
function rank(items){if(!Array.isArray(items))throw Error('Expected candidate array');
return items.map((item,i)=>{const evidence=item.evidence||{},missing=[],scores={};for(const k of Object.keys(weights)){const v=evidence[k];if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>1){missing.push(k);scores[k]=0}else scores[k]=v}
const consent=evidence.permissions===1,lawful=evidence.safety===1;const score=Object.keys(weights).reduce((s,k)=>s+weights[k]*scores[k],0);
const eligible=consent&&lawful&&missing.length===0;
return {id:String(item.id??i),name:String(item.name||'Unnamed candidate'),score:Math.round(score*1000)/10,eligible,missing,gate:eligible?'RESEARCH_REVIEW_ONLY':'HOLD_EVIDENCE_REQUIRED',channel:channels.includes(item.channel)?item.channel:'other',notes:'Not a live offer, quote, dispatch or authorisation'};}).sort((a,b)=>Number(b.eligible)-Number(a.eligible)||b.score-a.score||a.id.localeCompare(b.id))}
function unitEconomics({jobs,fee,carrier,handling,claims,fixed}){const values=[jobs,fee,carrier,handling,claims,fixed];if(values.some(v=>typeof v!=='number'||!Number.isFinite(v)||v<0))throw Error('Nonnegative finite numbers required');const unit=fee-carrier-handling-claims;const total=jobs*unit-fixed;return {unitContribution:unit,periodContribution:total,breakEvenJobs:unit>0?Math.ceil(fixed/unit):null,downsideContribution:Math.floor(jobs*0.7)*(fee-carrier*1.2-handling-claims)-fixed,simulation:true,earnedRevenue:false}}
return {rank,unitEconomics,weights,channels};
});
