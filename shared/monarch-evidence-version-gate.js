/* MONARCH Evidence Version Gate — RESEARCH ONLY, never an authority itself.
A caller-supplied authority must be an independently trusted, authenticated, tenant-bound service.
*/
(function(root){"use strict";
const tenantPattern=/^[a-z0-9][a-z0-9_-]{1,63}$/;
const toHex=a=>Array.from(new Uint8Array(a),x=>x.toString(16).padStart(2,"0")).join("");
function makeVersionGate({tenant,authority,webcrypto}={}){
 if(!tenantPattern.test(tenant||""))throw Error("Valid tenant required");
 if(!authority||typeof authority.read!=="function")throw Error("Independent version authority required");
 const crypto=webcrypto||(typeof globalThis!=="undefined"?globalThis.crypto:null);
 if(!crypto?.subtle)throw Error("WebCrypto required");
 async function digest(envelope){if(typeof envelope!=="string"||envelope.length>2000000||!envelope)throw Error("Invalid encrypted envelope");return toHex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(envelope)))}
 function validAnchor(a){if(!a||a.tenant!==tenant||!Number.isSafeInteger(a.version)||a.version<1||!/^[a-f0-9]{64}$/.test(a.digest||""))throw Error("Invalid or untrusted version anchor");return a}
 function localEnvelope(envelope){let parsed;try{parsed=JSON.parse(envelope)}catch{throw Error("Invalid envelope JSON")};if(parsed?.tenant!==tenant||parsed?.format!=="monarch-research-vault-v1")throw Error("Wrong tenant or archive format");return parsed}
 async function inspect({envelope,version}={}){
 localEnvelope(envelope);
 if(!Number.isSafeInteger(version)||version<1)throw Error("Invalid archive version");
 const hash=await digest(envelope);
 let anchor;try{anchor=await authority.read({tenant})}catch{throw Error("Version authority unavailable: HOLD")}
 if(anchor==null)return Object.freeze({status:"UNANCHORED_HOLD",release:"HOLD",version,digest:hash,reason:"No independent version anchor"});
 validAnchor(anchor);
 if(version<anchor.version)return Object.freeze({status:"ROLLBACK_DETECTED",release:"HOLD",version,anchorVersion:anchor.version,reason:"Older backup than trusted anchor"});
 if(version>anchor.version)return Object.freeze({status:"UNCOMMITTED_VERSION",release:"HOLD",version,anchorVersion:anchor.version,reason:"Archive is newer than trusted anchor; reconcile without replay"});
 if(hash!==anchor.digest)return Object.freeze({status:"SAME_VERSION_CONFLICT",release:"HOLD",version,anchorVersion:anchor.version,reason:"Different ciphertext at trusted version"});
 return Object.freeze({status:"ANCHOR_MATCH_QUARANTINE",release:"HOLD",version,anchorVersion:anchor.version,reason:"Anchor matched; encrypted archive still requires authenticated review and may not auto-execute"});
 }
 async function propose({envelope,nextVersion}={}){
 localEnvelope(envelope);
 if(!Number.isSafeInteger(nextVersion)||nextVersion<1)throw Error("Invalid next version");
 let anchor;try{anchor=await authority.read({tenant})}catch{throw Error("Version authority unavailable: HOLD")}
 if(anchor!==null&&anchor!==undefined){validAnchor(anchor);if(nextVersion!==anchor.version+1)throw Error("Non-monotonic proposed version");}
 else if(nextVersion!==1)throw Error("Initial anchored version must be 1");
 return Object.freeze({tenant,expectedVersion:anchor?.version??0,nextVersion,digest:await digest(envelope),status:"PROPOSAL_ONLY",release:"HOLD",reason:"No authority write, storage write, or operational action performed"});
 }
 return Object.freeze({inspect,propose,digest,release:"HOLD"});
}
root.MonarchEvidenceVersionGate=Object.freeze({makeVersionGate});
})(typeof window!=="undefined"?window:globalThis);
