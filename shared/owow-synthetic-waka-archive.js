/* OWOW synthetic Waka archive: explicit-key encrypted, never production authority. */
(function(root){'use strict';
const encoder=new TextEncoder(),decoder=new TextDecoder(),format='owow-waka-synthetic-archive-v1';
const keys=['orders','trips','stock','ledger','delegations','chat'];
function validate(data){
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Invalid archive');
 const clean={};
 for(const key of keys){const arr=data[key];if(!Array.isArray(arr)||arr.length>100)throw Error('Invalid '+key);
  clean[key]=arr.map(item=>{if(!item||typeof item!=='object'||Array.isArray(item))throw Error('Invalid record');
   const result={};for(const [k,v] of Object.entries(item)){if(!/^[a-zA-Z][a-zA-Z0-9]{0,30}$/.test(k)||!['string','boolean','number'].includes(typeof v)||typeof v==='string'&&v.length>500||typeof v==='number'&&!Number.isSafeInteger(v))throw Error('Invalid field');result[k]=v;}
   return result;});}
 if(!Number.isSafeInteger(data.counter)||data.counter<0||data.counter>1000000)throw Error('Invalid counter');
 return {...clean,counter:data.counter};
}
function base64(bytes){let str='';for(const x of bytes)str+=String.fromCharCode(x);return btoa(str)}
function unbase64(s){if(typeof s!=='string'||!/^[A-Za-z0-9+/]*={0,2}$/.test(s)||s.length>1500000)throw Error('Invalid encoding');return Uint8Array.from(atob(s),c=>c.charCodeAt(0))}
function make({tenant='demo-tenant',storage,cryptoProvider=root.crypto}={}){
 if(!/^[a-z0-9_-]{2,64}$/.test(tenant)||!storage||typeof storage.compareAndSwap!=='function'||!cryptoProvider?.subtle)throw Error('Secure archive unavailable');
 const key='owow-synthetic-waka:'+tenant;
 async function derive(pass,salt){if(typeof pass!=='string'||pass.length<12)throw Error('Passphrase too short');const base=await cryptoProvider.subtle.importKey('raw',encoder.encode(pass),'PBKDF2',false,['deriveKey']);return cryptoProvider.subtle.deriveKey({name:'PBKDF2',salt,iterations:250000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
 async function encrypt(data,pass){const clean=validate(data),salt=cryptoProvider.getRandomValues(new Uint8Array(16)),iv=cryptoProvider.getRandomValues(new Uint8Array(12));const aes=await derive(pass,salt);const plain=encoder.encode(JSON.stringify({format,tenant,data:clean}));if(plain.length>700000)throw Error('Archive too large');const cipher=await cryptoProvider.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode(format+':'+tenant)},aes,plain);return JSON.stringify({format,tenant,salt:base64(salt),iv:base64(iv),cipher:base64(new Uint8Array(cipher))})}
 async function decrypt(raw,pass){let box;try{box=JSON.parse(raw)}catch{throw Error('Invalid archive envelope')}if(box.format!==format||box.tenant!==tenant)throw Error('Wrong tenant/archive');const salt=unbase64(box.salt),iv=unbase64(box.iv),cipher=unbase64(box.cipher);if(salt.length!==16||iv.length!==12||cipher.length<16)throw Error('Invalid archive envelope');let plain;try{plain=await cryptoProvider.subtle.decrypt({name:'AES-GCM',iv,additionalData:encoder.encode(format+':'+tenant)},await derive(pass,salt),cipher)}catch{throw Error('Wrong passphrase or tampered archive')}const parsed=JSON.parse(decoder.decode(plain));if(parsed.format!==format||parsed.tenant!==tenant)throw Error('Wrong tenant');return validate(parsed.data)}
 async function save(data,pass,expected){const cipher=await encrypt(data,pass);if(!await storage.compareAndSwap(key,expected,cipher))throw Error('Concurrent update conflict');return cipher}
 async function read(){return (await storage.getItem(key))??null}
 async function restore(pass){const raw=await read();if(!raw)return {found:false};return {found:true,data:await decrypt(raw,pass),cipher:raw,quarantined:true}}
 return Object.freeze({save,read,restore,encrypt,decrypt,release:'HOLD'});
}
root.OWOWSyntheticWakaArchive=Object.freeze({make});
})(typeof window!=='undefined'?window:globalThis);
