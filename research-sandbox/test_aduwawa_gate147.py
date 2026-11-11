#!/usr/bin/env python3
"""Gate 147: local, no-network Chromium acceptance. Requires installed playwright + Chromium.
Run from repository root: python3 research-sandbox/test_aduwawa_gate147.py
Does not deploy, buy, message, or process real supplier data.
"""
import asyncio, json, sys, datetime
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parent
APP=ROOT/"osayi-aduwawa-north-gate128.html"
HARNESS=ROOT/"aduwawa-acceptance-gate137.html"
REPORT=ROOT/"gate147-local-results.json"

async def main():
    results=[]
    def record(name,passed,details=""):
        results.append({"name":name,"passed":bool(passed),"details":str(details)})
        print(("PASS " if passed else "FAIL ")+name+(" "+str(details) if details else ""))
    if not APP.exists() or not HARNESS.exists():
        print("BLOCKED: exact sibling HTML files unavailable");return 2
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True,args=["--no-sandbox"])
        page=await browser.new_page()
        errors=[]
        page.on("pageerror",lambda e:errors.append(str(e)))
        await page.goto(APP.as_uri())
        await page.locator("#tests").click()
        text=await page.locator("#testout").inner_text()
        record("19 embedded assertions", "19/19 assertions" in text,text.splitlines()[-1])
        await page.locator("#confirm").click()
        record("unreviewed confirmation blocked","BLOCKED" in await page.locator("#ledger").inner_text())
        await page.locator("#compute").click()
        record("contribution correct","₦5,000" in await page.locator("#math").inner_text())
        await page.locator("#confirm").click()
        record("reviewed quote confirmed","SIMULATED OWNER CONFIRMATION" in await page.locator("#ledger").inner_text())
        await page.locator("#qty").fill("11")
        record("input invalidates approval","Draft invalidated" in await page.locator("#ledger").inner_text())
        await page.locator("#confirm").click()
        record("stale approval blocked","BLOCKED" in await page.locator("#ledger").inner_text())
        await page.locator("#qty").fill("")
        await page.locator("#compute").click()
        record("blank quantity rejected","INVALID INPUT" in await page.locator("#math").inner_text())
        await page.locator("#reset").click()
        await page.locator('[data-role="suya"]').click()
        record("suya mode active",await page.locator('[data-role="suya"]').get_attribute("aria-pressed")=="true")
        await page.locator('[data-role="mining"]').click()
        await page.locator("#next").click()
        record("mineral sale blocked","Mineral sale remain blocked" in await page.locator("#response").inner_text())
        await page.locator("#listen").click()
        record("mic blocked without consent","BLOCKED" in await page.locator("#voiceStatus").inner_text())
        await page.locator("#stoplisten").click()
        record("stop listening works","stopped" in (await page.locator("#voiceStatus").inner_text()).lower())
        record("stop clears consent",not await page.locator("#voiceConsent").is_checked())
        await page.locator("#stopspeech").click()
        record("stop speaking works","stopped" in (await page.locator("#voiceStatus").inner_text()).lower())
        record("no page JavaScript errors",not errors,errors)
        # Inject deterministic speech-recognition mock before the page loads.
        mock=await browser.new_page()
        await mock.add_init_script("""window.__recognizers=[];window.SpeechRecognition=class {
            constructor(){window.__recognizers.push(this)}
            start(){this.started=true}
            abort(){this.aborted=true;if(this.onend)this.onend()}
          };""")
        await mock.goto(APP.as_uri())
        await mock.locator("#voiceConsent").check()
        await mock.locator("#listen").click()
        record("consented mock recognition starts",await mock.evaluate("window.__recognizers.length===1 && window.__recognizers[0].started"))
        await mock.locator("#stoplisten").click()
        await mock.evaluate("""() => {const r=window.__recognizers[0];r.onresult({results:[[{transcript:"calculate cost"}]]})}""")
        record("late transcript ignored after stop","Malam" not in await mock.locator("#response").inner_text() and "stopped" in (await mock.locator("#voiceStatus").inner_text()).lower())
        await mock.locator("#voiceConsent").check()
        await mock.locator("#listen").click()
        await mock.evaluate("""() => {const r=window.__recognizers.at(-1);r.onresult({results:[[{transcript:"calculate cost"}]]})}""")
        record("one utterance processes request","synthetic contribution" in await mock.locator("#response").inner_text())
        record("one utterance aborts microphone",await mock.evaluate("window.__recognizers.at(-1).aborted===true"))
        record("new consent required",not await mock.locator("#voiceConsent").is_checked())
        await browser.close()
    report={"timestamp_utc":datetime.datetime.now(datetime.timezone.utc).isoformat(),"app":str(APP),"checks":results,"passed":sum(r["passed"] for r in results),"total":len(results),"note":"Local Chromium mock tests do not establish Safari, real microphone, offline ASR, or African Sovereign voice."}
    REPORT.write_text(json.dumps(report,indent=2),encoding="utf-8")
    print(f"RESULT {report['passed']}/{report['total']} saved {REPORT}")
    return 0 if report["passed"]==report["total"] else 1

if __name__=="__main__":
    sys.exit(asyncio.run(main()))
