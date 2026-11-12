/* Synthetic research memory POC; not approved for real personal/customer data. */
(function(root){
'use strict';
const encoder=new TextEncoder(), decoder=new TextDecoder();
const prefix='monarch-synthetic-research-v1:';
const idPattern=/^[a-z0-9][a-z0-9_-]{1,63}$/;
const maxAge=7*86400000;
// Coordinate instances sharing the same storage object in this JS realm only.
const generations=new WeakMap();
function tokenFor(storage,scope){let scopes=generations.get(storage);if(!scopes){scopes=new Map();generations.set(storage,scopes);}if(!scopes.has(scope))scopes.set(scope,{version:0});return scopes.get(scope);}
function b64(bytes){return btoa(String.fromCharCode(...bytes));}
function un64(value){return Uint8Array.from(atob(value),c=>c.charCodeAt(0));}
function scopeFor(tenant,prototype){if(!idPattern.test(tenant||'')||!idPattern.test(prototype||''))throw Error('Explicit scope required');return prefix+tenant+':'+prototype;}
function validate(data){if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Research object required');if(Object.keys(data).some(k=>!['notes','questions'].includes(k)))throw Error('Only synthetic notes/questions permitted');if(typeof data.notes!=='string'||data.notes.length>8000||!Array.isArray(data.questions)||data.questions.length>20||data.questions.some(x=>typeof x!=='string'||x.length>300))throw Error('Invalid research data');const bytes=encoder.encode(JSON.stringify(data));if(bytes.length>32768)throw Error('Research too large');return bytes;}
async function derive(passphrase,salt,crypto){if(typeof passphrase!=='string'||passphrase.length<12)throw Error('Passphrase must be at least 12 characters');const base=await crypto.subtle.importKey('raw',encoder.encode(passphrase),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:250000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
function create({tenant,prototype,storage,crypto=root.crypto,now=()=>Date.now()}={}){
 const scope=scopeFor(tenant,prototype);if(!storage||!crypto?.subtle||!crypto.getRandomValues)throw Error('Storage and WebCrypto required');
 const token=tokenFor(storage,scope);
 const revisionKey=scope+':deletion-revision';
 function revision(){return storage.getItem(revisionKey);}
 function newRevision(){const bytes=crypto.getRandomValues(new Uint8Array(16));return b64(bytes);}
 async function save(data,passphrase,{consent=false}={}){const requestedAt=token.version,initialRevision=revision();if(consent!==true)throw Error('Explicit save consent required');const plain=validate(data),salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await derive(passphrase,salt,crypto),created=now();const cipher=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode(scope+':'+created)},key,plain);if(requestedAt!==token.version||revision()!==initialRevision)throw Error('Save cancelled by deletion');storage.setItem(scope,JSON.stringify({version:1,created,salt:b64(salt),iv:b64(iv),cipher:b64(new Uint8Array(cipher))}));return {saved:true,expires:created+maxAge};}
 async function load(passphrase){const raw=storage.getItem(scope);if(raw===null)return null;if(raw.length>100000)throw Error('Stored record too large');try{const record=JSON.parse(raw);if(record.version!==1||!Number.isSafeInteger(record.created)||record.created>now()+60000)throw Error('Invalid record');if(now()-record.created>maxAge){storage.removeItem(scope);throw Error('Expired record');}const key=await derive(passphrase,un64(record.salt),crypto);const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:un64(record.iv),additionalData:encoder.encode(scope+':'+record.created)},key,un64(record.cipher));const data=JSON.parse(decoder.decode(plain));validate(data);return data;}catch{throw Error('Unable to decrypt, expired, or invalid research record');}}
 function clear(){token.version++;storage.setItem(revisionKey,newRevision());storage.removeItem(scope);return {cleared:true};}
 return Object.freeze({save,load,clear,hasSaved:()=>storage.getItem(scope)!==null});
}
root.MonarchResearchMemory=Object.freeze({create});
if(typeof module!=='undefined'&&module.exports)module.exports={create};
})(typeof window!=='undefined'?window:globalThis);
