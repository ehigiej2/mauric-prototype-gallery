import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const url=pathToFileURL(resolve('research-sandbox/osayi-aduwawa-north-gate128.html')).href;
test('19 embedded assertions and financial safeguards',async({page})=>{
 await page.goto(url);
 await page.locator('#tests').click();
 await expect(page.locator('#testout')).toContainText('19/19 assertions');
 await page.locator('#confirm').click();
 await expect(page.locator('#ledger')).toContainText('BLOCKED');
 await page.locator('#compute').click();
 await expect(page.locator('#math')).toContainText('₦5,000');
 await page.locator('#confirm').click();
 await expect(page.locator('#ledger')).toContainText('SIMULATED OWNER CONFIRMATION');
 await page.locator('#qty').fill('11');
 await expect(page.locator('#ledger')).toContainText('Draft invalidated');
 await page.locator('#confirm').click();
 await expect(page.locator('#ledger')).toContainText('BLOCKED');
 await page.locator('#qty').fill('');
 await page.locator('#compute').click();
 await expect(page.locator('#math')).toContainText('INVALID INPUT');
});
test('sector isolation, mining restrictions and no fabricated stock',async({page})=>{
 await page.goto(url);
 for(const role of ['cattle','suya','farmer','shop','mining']){
  await page.locator('[data-role="'+role+'"]').click();
  await expect(page.locator('[data-role="'+role+'"]')).toHaveAttribute('aria-pressed','true');
 }
 await page.locator('#next').click();
 await expect(page.locator('#response')).toContainText('Mineral sale remain blocked');
 await page.locator('#stock').click();
 await expect(page.locator('#response')).toContainText('never get verified stock');
});
test('microphone requires consent, stop clears it',async({page})=>{
 await page.goto(url);
 await expect(page.locator('#voiceConsent')).not.toBeChecked();
 await page.locator('#listen').click();
 await expect(page.locator('#voiceStatus')).toContainText('BLOCKED');
 await page.locator('#voiceConsent').check();
 await page.locator('#stoplisten').click();
 await expect(page.locator('#voiceConsent')).not.toBeChecked();
 await expect(page.locator('#voiceStatus')).toContainText('stopped');
});
test('late recognition callbacks ignored after cancellation',async({page})=>{
 await page.addInitScript(()=>{
  window.__recognizers=[];
  window.SpeechRecognition=class {
   constructor(){window.__recognizers.push(this)}
   start(){this.onstart?.()}
   abort(){this.onend?.()}
  };
 });
 await page.goto(url);
 await page.locator('#voiceConsent').check();
 await page.locator('#listen').click();
 await expect(page.locator('#voiceStatus')).toContainText('Listening after browser permission');
 await page.locator('#stoplisten').click();
 await page.evaluate(()=>{window.__recognizers[0].onresult({results:[[{transcript:'cost'}]]})});
 await expect(page.locator('#voiceStatus')).toContainText('stopped');
 await expect(page.locator('#response')).toContainText('tell me confirmed cattle');
});
