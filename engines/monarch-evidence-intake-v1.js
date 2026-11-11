/* MAURIC public evidence adapter: manual/permissioned observations only. No scraping. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.MonarchEvidenceIntake=api})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const allowed=['public-official','public-business','public-social-aggregate','consented-operator','consented-buyer'];
const clean=s=>String(s??'').trim();
function parseDate(v){if(!/^\d{4}-\d{2}-\d{2}$/.test(clean(v)))return null;const d=new Date(v+'T00:00:00Z');return Number.isFinite(d.valueOf())&&d.toISOString().slice(0,10)===v?d:null}
function intake(raw,asOf=new Date().toISOString().slice(0,10)){const errors=[];if(!raw||typeof raw!=='object'||Array.isArray(raw))return {accepted:false,errors:['invalid-record']};const type=clean(raw.sourceType),url=clean(raw.url),observed=parseDate(raw.observedDate),today=parseDate(asOf),label=clean(raw.label),claim=clean(raw.claim);
if(!allowed.includes(type))errors.push('unsupported-source-type');if(!/^https:\/\/[a-z0-9.-]+(?::\d+)?(?:[/?#]|$)/i.test(url))errors.push('https-source-required');if(!observed||!today||observed>today)errors.push('invalid-or-future-date');if(label.length<3||label.length>100||claim.length<8||claim.length>500)errors.push('invalid-label-or-claim');if(raw.permissionVerified!==true&&type.startsWith('consented-'))errors.push('consent-not-verified');
const age=observed&&today?Math.floor((today-observed)/86400000):null;
const record={label,claim,sourceType:type,url,observedDate:clean(raw.observedDate),ageDays:age,stale:age===null||age>30,scope:clean(raw.scope)||'Nigeria (unverified locality)',confidence:'UNVERIFIED',permissions:type.startsWith('consented-')?'REVIEW_REQUIRED':'NOT_APPLICABLE',personalDataAllowed:false};
return {accepted:errors.length===0,errors,record:errors.length===0?record:null,warning:'Source existence does not prove claim, local demand, price or operator capacity.'}}
function summarize(records){const accepted=records.filter(r=>r&&r.accepted&&r.record).map(r=>r.record);return {count:accepted.length,fresh:accepted.filter(r=>!r.stale).length,stale:accepted.filter(r=>r.stale).length,verifiedDemand:0,commercialAuthority:'UNKNOWN',notes:'Human source validation and independent demand evidence required.'}}
return {intake,summarize,allowed};
});
