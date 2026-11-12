/* MONARCH threat triage v0.1 — REVIEW ONLY. Untrusted text never grants authority. */
(function(root){'use strict';
const MAX=4000;
const RULES=Object.freeze([
 {id:'CREDENTIAL_REQUEST',re:/(?:send|share|give|tell|enter|provide).{0,45}(?:otp|one.time (?:password|code)|password|pin\b|recovery code|seed phrase)/i},
 {id:'PAYMENT_REDIRECT',re:/(?:pay|transfer|send money|deposit).{0,90}(?:personal account|new account|different account|whatsapp|telegram)/i},
 {id:'IMPERSONATION',re:/(?:i am|this is|speaking as).{0,35}(?:admin|support|founder|owner).{0,60}(?:override|ignore|disable|approve)/i},
 {id:'INSTRUCTION_INJECTION',re:/(?:ignore (?:all |the )?(?:previous|prior|system) instructions|disable (?:security|audit|checks|hold)|bypass (?:approval|verification|policy)|reveal (?:system prompt|secret|api key))/i},
 {id:'URGENCY_PRESSURE',re:/(?:urgent|immediately|right now).{0,65}(?:otp|password|transfer|pay|account)/i}
]);
function assess(input){
 if(typeof input!=='string')return Object.freeze({decision:'QUARANTINE',signals:['INVALID_INPUT'],trusted:false});
 if(input.length>MAX)return Object.freeze({decision:'QUARANTINE',signals:['OVERSIZE'],trusted:false});
 const signals=RULES.filter(r=>r.re.test(input)).map(r=>r.id);
 return Object.freeze({decision:signals.length?'REVIEW':'UNTRUSTED_TEXT',signals:Object.freeze(signals),trusted:false});
}
root.MonarchThreatTriage=Object.freeze({assess,MAX});
})(typeof window!=='undefined'?window:globalThis);
