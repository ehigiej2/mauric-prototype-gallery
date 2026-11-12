/* MONARCH CAPREG read-only binding — research adapter only.
 * Consumes output from original CROWN persistence.recover_state(), never substitutes for it.
 * No Git queries, registry writes, custody claims, execution or approval.
 */
(function(root){"use strict";
const DIGEST=/^sha256:[0-9a-f]{64}$/,COMMIT=/^[0-9a-f]{40}$/;
function makeCAPREGReadAdapter({recover,headAttestor}={}){
 if(typeof recover!=="function"||typeof headAttestor!=="function")throw Error("Canonical recover and independent head attestor required");
 return async function capreg(meta){
 const fail=reason=>Object.freeze({tenant:meta?.tenant??null,caseId:meta?.caseId??null,valid:false,canonicalMain:false,reason});
 try{
 if(!meta||!DIGEST.test(meta.registryDigest||""))return fail("Expected registry digest missing");
 // recover() must call unchanged CROWN CAPREG persistence.recover_state on a controlled local checkout.
 const recovered=await recover();
 if(!recovered||recovered.state!=="RECOVERED"||recovered.execution_authority!==false||!DIGEST.test(recovered.current_registry_digest||"")||!DIGEST.test(recovered.current_snapshot_digest||"")||!/^CAPREG-SNAPSHOT-\d{6}$/.test(recovered.current_snapshot_id||"")||!Number.isSafeInteger(recovered.snapshot_count)||recovered.snapshot_count<1)return fail("CROWN recovery evidence invalid");
 if(recovered.current_registry_digest!==meta.registryDigest)return fail("Requested registry does not match recovered current head");
 // Independent attestor must validate canonical Git main commit and bind to exact recovered snapshot.
 const head=await headAttestor({registryDigest:recovered.current_registry_digest,snapshotDigest:recovered.current_snapshot_digest,snapshotId:recovered.current_snapshot_id});
 if(!head||head.canonicalMain!==true||head.verified!==true||!COMMIT.test(head.commitSha||"")||head.registryDigest!==recovered.current_registry_digest||head.snapshotDigest!==recovered.current_snapshot_digest)return fail("Canonical main attestation absent or mismatched");
 return Object.freeze({tenant:meta.tenant,caseId:meta.caseId,valid:true,canonicalMain:true,commitSha:head.commitSha,registryDigest:recovered.current_registry_digest,executionAuthority:false,source:"CAPREG-001-R2-RECOVERED",note:"Assertion adapter only; caller must independently trust recover and attestor"});
 }catch(e){return fail("CAPREG source unavailable or failed validation")}
 }
}
root.MonarchCAPREGReadAdapter=Object.freeze({makeCAPREGReadAdapter});
})(typeof window!=="undefined"?window:globalThis);