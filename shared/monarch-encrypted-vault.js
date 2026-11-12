/* MONARCH synthetic research vault v0.1. No live transactions; no persistent key storage. */
(function(root){
'use strict';
const encoder=new TextEncoder(),decoder=new TextDecoder();
const TENANT=/^[a-z0-9][a-z0-9_-]{1,63}$/;
const RECORD=/^[a-zA-Z0-9_-]{2,80}$/;
const FORMAT='monarch-research-vault-v1';
const prefix='monarch-research-vault:';
function b64(bytes){if(typeof Buffer!=='undefined')return Buffer.from(bytes).toString('base64');let text='';for(const b of bytes)text+=String.fromCharCode(b);return btoa(text)}
function unb64(text){if(typeof text!=='string'||text.length>2000000||!/^[A-Za-z0-9+/]*={0,2}$/.test(text))throw Error('Invalid base64 envelope');if(typeof Buffer!=='undefined')return new Uint8Array(Buffer.from(text,'base64'));const s=atob(text);return Uint8Array.from(s,c=>c.charCodeAt(0))}
function validRecords(value){if(!Array.isArray(value)||value.length>1000)throw Error('Invalid record set');const seen=new Set();return value.map(x=>{
 if(!x||!x.command||!RECORD.test(x.command.caseId||'')||!RECORD.test(x.command.key||''))throw Error('Invalid command');
 if(!['PAYMENT_REQUEST','PAYMENT_CONFIRM','REFUND_REQUEST','REFUND_CONFIRM','FULFILMENT_START','POD_RECORD'].includes(x.command.action))throw Error('Invalid action');
 if(!Number.isSafeInteger(x.command.expectedRevision)||x.command.expectedRevision<1)throw Error('Invalid revision');
 if(!Number.isSafeInteger(x.command.amountMinor)||x.command.amountMinor<0||x.command.amountMinor>100000000000)throw Error('Invalid amount');
 if(!/^[A-Z]{3}$/.test(x.command.currency||''))throw Error('Invalid currency');
 const identity=x.command.caseId+':'+x.command.key;if(seen.has(identity))throw Error('Duplicate record identity');seen.add(identity);
 if(!['QUEUED_UNVERIFIED','UNKNOWN_EXTERNAL_OUTCOME','CANCELLED','RESOLVED_SIM','QUARANTINED_UNTRUSTED'].includes(x.status))throw Error('Invalid record state');
 return {command:{caseId:x.command.caseId,key:x.command.key,action:x.command.action,expectedRevision:x.command.expectedRevision,amountMinor:x.command.amountMinor,currency:x.command.currency},status:x.status};
 })}
function makeVault({tenant,storage,webcrypto,iterations=250000}={}){
 if(!TENANT.test(tenant||''))throw Error('Valid tenant required');
 if(!storage||!['getItem','setItem','removeItem'].every(k=>typeof storage[k]==='function'))throw Error('Storage adapter required');
 const crypto=webcrypto||(typeof globalThis!=='undefined'?globalThis.crypto:null);
 if(!crypto?.subtle||typeof crypto.getRandomValues!=='function')throw Error('WebCrypto required');
 if(!Number.isSafeInteger(iterations)||iterations<210000)throw Error('Weak PBKDF2 settings refused');
 const keyName=prefix+tenant;
 async function derive(passphrase,salt){if(typeof passphrase!=='string'||passphrase.length<12)throw Error('Passphrase must be at least 12 characters');const base=await crypto.subtle.importKey('raw',encoder.encode(passphrase),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
 async function seal(records,passphrase){const clean=validRecords(records);const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));const key=await derive(passphrase,salt);
 const payload=encoder.encode(JSON.stringify({format:FORMAT,tenant,records:clean}));
 if(payload.length>1000000)throw Error('Payload too large');
 const aad=encoder.encode(FORMAT+':'+tenant);
 const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128},key,payload);
 return JSON.stringify({format:FORMAT,tenant,kdf:'PBKDF2-SHA256',iterations,salt:b64(salt),iv:b64(iv),ciphertext:b64(new Uint8Array(ciphertext))});}
 async function open(envelope,passphrase){let p;try{p=JSON.parse(envelope)}catch{throw Error('Invalid vault envelope')}
 if(!p||p.format!==FORMAT||p.tenant!==tenant||p.kdf!=='PBKDF2-SHA256'||p.iterations!==iterations)throw Error('Wrong tenant or unsupported vault parameters');
 const salt=unb64(p.salt),iv=unb64(p.iv),ciphertext=unb64(p.ciphertext);
 if(salt.length!==16||iv.length!==12||ciphertext.length<16||ciphertext.length>1000016)throw Error('Invalid cryptographic envelope');
 const key=await derive(passphrase,salt);let plain;try{plain=await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:encoder.encode(FORMAT+':'+tenant),tagLength:128},key,ciphertext)}catch{throw Error('Authentication failed: wrong passphrase or modified data')}
 let payload;try{payload=JSON.parse(decoder.decode(plain))}catch{throw Error('Invalid decrypted archive')}
 if(payload.format!==FORMAT||payload.tenant!==tenant)throw Error('Decrypted tenant mismatch');
 return Object.freeze(validRecords(payload.records).map(x=>Object.freeze({...x,status:'QUARANTINED_UNTRUSTED',sourceStatus:x.status,reason:'Encrypted archive restored for human reconciliation only; automatic replay prohibited'})))}
 async function save(records,passphrase){const encrypted=await seal(records,passphrase);await storage.setItem(keyName,encrypted);return Object.freeze({saved:true,encrypted:true,recordCount:records.length,release:'HOLD'})}
 async function restore(passphrase){const encrypted=await storage.getItem(keyName);if(encrypted==null)return Object.freeze({found:false,records:[]});return Object.freeze({found:true,records:await open(encrypted,passphrase),release:'HOLD'})}
 async function erase(){await storage.removeItem(keyName);return Object.freeze({erased:true})}
 return Object.freeze({seal,open,save,restore,erase,release:'HOLD'});
}
function indexedDBStorage({dbName='monarch-research-only-v1'}={}){
 if(typeof indexedDB==='undefined')throw Error('IndexedDB not supported');
 async function transact(mode,fn){const db=await new Promise((resolve,reject)=>{const r=indexedDB.open(dbName,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('encrypted'))r.result.createObjectStore('encrypted')};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
 try{return await new Promise((resolve,reject)=>{const tx=db.transaction('encrypted',mode),store=tx.objectStore('encrypted');let value,done=false;const request=fn(store);request.onsuccess=()=>{value=request.result};request.onerror=()=>{};tx.oncomplete=()=>{done=true;resolve(value)};tx.onerror=()=>reject(tx.error||Error('Storage transaction failed'));tx.onabort=()=>reject(tx.error||Error('Storage aborted'))})}finally{db.close()}}
 return Object.freeze({getItem:key=>transact('readonly',s=>s.get(key)),setItem:(key,value)=>transact('readwrite',s=>s.put(value,key)),removeItem:key=>transact('readwrite',s=>s.delete(key))});
}
root.MonarchEncryptedVault=Object.freeze({makeVault,indexedDBStorage});
})(typeof window!=='undefined'?window:globalThis);
