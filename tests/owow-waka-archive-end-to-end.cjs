// OWOW encrypted archive end-to-end acceptance. Synthetic data only.
// Run with installed Playwright and OWOW_CHROMIUM_PATH. No external network.
'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 let target;try{target=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]))}catch{res.writeHead(400);res.end();return}
 if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 fs.readFile(target,(err,data)=>{if(err){res.writeHead(404);res.end();return}res.setHeader('Content-Type',target.endsWith('.js')?'text/javascript':target.endsWith('.html')?'text/html':target.endsWith('.mp3')?'audio/mpeg':'application/octet-stream');res.end(data)});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({headless:true,executablePath:process.env.OWOW_CHROMIUM_PATH||undefined,args:['--no-sandbox']});
  const context=await browser.newContext(),p=await context.newPage(),errors=[],base='http://127.0.0.1:'+server.address().port+'/monarch-trade-waka-review.html';
  p.on('pageerror',e=>errors.push(e.message));await p.goto(base);
  await p.locator('.tile[data-mode="sell"]').click();
  await p.locator('[name="item"]').fill('Synthetic tomato');
  await p.locator('[name="amount"]').fill('200');
  await p.locator('[name="quantity"]').fill('1');
  await p.locator('#journey button[type="submit"]').click();
  assert.equal(await p.evaluate(()=>state.orders.length),1);
  await p.locator('#owowArchivePass').fill('synthetic-passphrase-12345');
  await p.locator('#owowArchiveSave').click();
  await assertEventually(p,'#owowArchiveStatus','Encrypted synthetic archive committed');
  const saved=await p.locator('#owowArchiveStatus').innerText();
  await p.reload();
  assert.equal(await p.evaluate(()=>state.orders.length),0,'No automatic transaction replay');
  await p.locator('#owowArchivePass').fill('wrong-passphrase-12345');
  await p.locator('#owowArchiveRestore').click();
  await assertEventually(p,'#owowArchiveStatus','Archive NOT restored');
  await p.locator('#owowArchivePass').fill('synthetic-passphrase-12345');
  await p.locator('#owowArchiveRestore').click();
  await assertEventually(p,'#owowArchiveStatus','Quarantined archive recovered: 1 orders');
  assert.equal(await p.evaluate(()=>state.orders.length),0,'Quarantined data must not execute');
  // The passphrase must never remain in the form after either operation.
  assert.equal(await p.locator('#owowArchivePass').inputValue(),'','Passphrase cleared after restore');
  // A new tab must not overwrite an archive it has not inspected (CAS fail-closed).
  const second=await context.newPage();
  second.on('pageerror',e=>errors.push('second tab: '+e.message));
  await second.goto(base);
  await second.locator('#owowArchivePass').fill('synthetic-passphrase-12345');
  await second.locator('#owowArchiveSave').click();
  await assertEventually(second,'#owowArchiveStatus','Existing archive differs from this session');
  assert.equal(await second.locator('#owowArchivePass').inputValue(),'','Passphrase cleared after rejected save');
  await second.close();
  assert.equal(await p.evaluate(()=>state.orders.length),0,'No transaction replay after restore');
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({status:'PASS',saved,restored:await p.locator('#owowArchiveStatus').innerText(),noAutoReplay:true,wrongKeyRejected:true,pageErrors:errors.length}));
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
async function assertEventually(page,selector,expected){await page.waitForFunction(({selector,expected})=>document.querySelector(selector)?.textContent.includes(expected),{selector,expected},{timeout:15000})}
