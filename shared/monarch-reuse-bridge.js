/* MONARCH Reuse Bridge v0.1 — metadata-only, read-only, fail-closed.
 * Source controls remain owned by CROWN CAPREG/HAB/HIA/EXEC-CONS and OpsNudge.
 * This adapter never authenticates a user, grants authority or runs external actions.
 */
(function(root){"use strict";
const ID=/^[a-z0-9][a-z0-9_-]{1,63}$/,DIGEST=/^sha256:[a-f0-9]{64}$/,SHA=/^[a-f0-9]{40}$/;
function makeBridge({tenant,adapters}={}){
 if(!ID.test(tenant||""))throw Error("Tenant required");
 if(!adapters||!["capreg","habHia","consumption","audit","checkpoint"].every(k=>typeof adapters[k]==="function"))throw Error("Five independently supplied read-only adapters required");
 const REQUIRED=["caseId","registryDigest","signerRegistryDigest","version","vaultDigest","executionId","idempotencyKey"];
 function validate(input){
 if(!input||typeof input!=="object"||input.tenant!==tenant)throw Error("Tenant mismatch or absent case");
 if(REQUIRED.some(k=>!(k in input)))throw Error("Missing metadata");
 if(!/^[A-Za-z0-9_-]{2,80}$/.test(input.caseId)||!/^[A-Za-z0-9._:-]{2,100}$/.test(input.executionId)||!/^[A-Za-z0-9._:-]{2,100}$/.test(input.idempotencyKey))throw Error("Invalid identifiers");
 if(!DIGEST.test(input.registryDigest)||!DIGEST.test(input.signerRegistryDigest)||!DIGEST.test(input.vaultDigest)||!Number.isSafeInteger(input.version)||input.version<1)throw Error("Invalid version or digest");
 return Object.freeze({tenant,caseId:input.caseId,registryDigest:input.registryDigest,signerRegistryDigest:input.signerRegistryDigest,version:input.version,vaultDigest:input.vaultDigest,executionId:input.executionId,idempotencyKey:input.idempotencyKey});
 }
 async function inspect(input){
 const m=validate(input),checks={};const failures=[];
 for(const kind of ["capreg","habHia","consumption","audit","checkpoint"]){
 try{
 const result=await adapters[kind]({...m});
 if(!result||result.tenant!==tenant||result.caseId!==m.caseId)throw Error("Missing tenant/case binding");
 if(kind==="capreg"){
 if(result.valid!==true||result.registryDigest!==m.registryDigest||result.canonicalMain!==true||!SHA.test(result.commitSha||""))throw Error("Canonical CAPREG current head not proved");
 }else if(kind==="habHia"){
 if(result.valid!==true||result.signerRegistryDigest!==m.signerRegistryDigest||result.signatureScheme!=="ED25519-HIA-PAYLOAD-V1"||result.scopeMatched!==true||result.currentKeyActive!==true||result.policyValid!==true||result.verificationReceiptCurrent!==true)throw Error("Current HAB/HIA binding invalid");
 }else if(kind==="consumption"){
 if(result.replayBlocked!==true||result.unknown!==false)throw Error("Consumption/replay status insufficient");
 }else if(kind==="audit"){
 if(result.chainValid!==true||result.orgScoped!==true)throw Error("Audit chain or tenant scope not proved");
 }else if(kind==="checkpoint"){
 if(result.verified!==true||result.version!==m.version||result.vaultDigest!==m.vaultDigest||result.independentCustody!==true)throw Error("Independent anchor missing or mismatched");
 }
 checks[kind]="MATCHED_ASSERTION_ONLY";
 }catch(e){checks[kind]="UNKNOWN_OR_FAILED";failures.push(kind+": "+String(e?.message||e).slice(0,170))}
 }
 return Object.freeze({tenant,caseId:m.caseId,version:m.version,checks:Object.freeze(checks),failures:Object.freeze(failures),release:"HOLD",productionAuthority:false,customerDataCopied:false,reason:failures.length?"One or more reuse contracts unavailable/mismatched":"Assertions received; client bridge cannot independently authenticate them; no execution authorised"});
 }
 return Object.freeze({inspect,release:"HOLD"});
}
root.MonarchReuseBridge=Object.freeze({makeBridge});
})(typeof window!=="undefined"?window:globalThis);
