// OWOW real-browser acceptance runner; run from a local checkout with Playwright available.
// No external traffic, production data, or deployment. Chromium executable via OWOW_CHROMIUM_PATH.
'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.OWOW_CHROMIUM_PATH||undefined,args:['--no-sandbox']});
 let count=0;
 try{
  for(const [w,h] of [[320,568],[375,667],[390,844]]){
   const p=await browser.newPage({viewport:{width:w,height:h}}),errors=[];
   p.on('pageerror',e=>errors.push(e.message));
   await p.goto(pathToFileURL(path.join(__dirname,'..','owow-approved-prototypes-review.html')).href);
   assert.equal(await p.locator('.nav').count(),6);
   for(let i=0;i<6;i++){const b=p.locator('.nav').nth(i),id=await b.getAttribute('aria-controls');await b.click();assert.equal(await p.locator('#'+id).isVisible(),true);assert.equal(await b.getAttribute('aria-expanded'),'true');}
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.deepEqual(errors,[]);count++;await p.close();
  }
  for(const file of ['family.html','terry-benin-waka-trade-community.html','terry-working-journey.html','stephen-preview.html','zaza-trade.html','jp-marketplace.html','waka-rider-requester-farmer.html','edo-hospital.html','kelvin-idon.html','obi-waka.html','mauric-chat.html','knightpride.html','knightpride-latest.html','martins-executive.html']){
   const p=await browser.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.goto(pathToFileURL(path.join(__dirname,'..',file)).href,{timeout:15000});
   assert.deepEqual(errors,[],file+' script errors');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,file+' overflow');count++;await p.close();
  }
  const p=await browser.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(pathToFileURL(path.join(__dirname,'..','monarch-trade-waka-review.html')).href);
  for(const mode of ['sell','send','stock','money','team','osayi']){await p.locator('.tile[data-mode="'+mode+'"]').click();assert.equal(await p.locator('#workspace').isVisible(),true);await p.locator('#back').click();count++;}
  await p.locator('.tile[data-mode="sell"]').click();await p.locator('[name="item"]').fill('Fictional akara');await p.locator('[name="amount"]').fill('250');await p.locator('[name="quantity"]').fill('2');await p.locator('#journey button[type="submit"]').click();
  assert.equal(await p.evaluate(()=>state.orders.length),1);
  assert.equal(await p.locator('#journey button[type="submit"]').isDisabled(),true);count++;
  await p.reload();assert.equal(await p.evaluate(()=>state.orders.length),0,'Known limitation: Waka state must not be misrepresented as persistent');count++;
  await p.locator('.tile[data-mode="osayi"]').click();await p.locator('#playIntro').click();await p.waitForTimeout(700);
  const audio=await p.locator('#osayiIntro').evaluate(a=>({time:a.currentTime,ready:a.readyState,error:a.error?.message||null}));
  assert.ok(audio.time>0&&audio.ready>=2&&!audio.error,'Recorded audio browser playback');count++;
  assert.deepEqual(errors,[]);await p.close();
  console.log(JSON.stringify({status:'PASS',checks:count,scope:'Browser smoke only; Waka persistence known failure; live voice/device/security UNKNOWN'}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack);process.exitCode=1});
