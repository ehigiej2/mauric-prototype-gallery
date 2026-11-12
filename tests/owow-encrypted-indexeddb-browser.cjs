// Browser proof for the existing MONARCH encrypted IndexedDB vault.
// Runs on localhost HTTPS-equivalent secure context, never production data.
'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{const target=req.url==='/shared/monarch-encrypted-vault.js'?path.join(root,'shared/monarch-encrypted-vault.js'):null;if(!target){res.writeHead(404);res.end();return;}res.setHeader('Content-Type','text/javascript');res.end(fs.readFileSync(target));});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.OWOW_CHROMIUM_PATH||undefined,args:['--no-sandbox']});
  const context=await browser.newContext(),page=await context.newPage(),url='http://127.0.0.1:'+server.address().port+'/shared/monarch-encrypted-vault.js';
  await page.goto(url);await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.addScriptTag({url:'/shared/monarch-encrypted-vault.js'});
  const result=await page.evaluate(async()=>{
   const {makeVault,indexedDBStorage}=window.MonarchEncryptedVault;
   const storage=indexedDBStorage({dbName:'owow-synthetic-test-'+crypto.randomUUID()});
   const pass='test-only-strong-passphrase-2026';
   const a=makeVault({tenant:'synthetic-a',storage}),b=makeVault({tenant:'synthetic-b',storage});
   const sample=[{command:{caseId:'CASE001',key:'KEY001',action:'PAYMENT_REQUEST',expectedRevision:1,amountMinor:100,currency:'NGN'},status:'QUEUED_UNVERIFIED'}];
   await a.saveIfUnchanged(sample,pass,null);
   const raw=await a.readEncrypted();
   const bRead=await b.restore(pass);
   const aRead=await a.restore(pass);
   let wrongKeyRejected=false,conflictRejected=false,tamperRejected=false;
   try{await a.restore('wrong-but-long-enough-key')}catch{wrongKeyRejected=true}
   try{await a.saveIfUnchanged(sample,pass,null)}catch{conflictRejected=true}
   const parsed=JSON.parse(raw);parsed.ciphertext=parsed.ciphertext.slice(0,-5)+'AAAAA';
   try{await a.open(JSON.stringify(parsed),pass)}catch{tamperRejected=true}
   return {encrypted:!raw.includes('CASE001'),otherTenantEmpty:!bRead.found,restored:aRead.found&&aRead.records.length===1,quarantined:aRead.records[0]?.status==='QUARANTINED_UNTRUSTED',wrongKeyRejected,conflictRejected,tamperRejected};
  });
  for(const [name,pass] of Object.entries(result))assert.equal(pass,true,name);
  console.log(JSON.stringify({status:'PASS',scope:'Synthetic encrypted IndexedDB vault; not Waka page integration',checks:result},null,2));
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
