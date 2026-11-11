#!/usr/bin/env python3
"""Gate 148: run against exact checked-out repository HTML. No network required.
Usage: python research-sandbox/aduwawa-gate148.py
Requires: playwright Python and installed Chromium. No deployment, orders or payments.
"""
import json, os, pathlib, sys, datetime, hashlib, traceback
from playwright.sync_api import sync_playwright

ROOT=pathlib.Path(__file__).resolve().parent
HTML=ROOT/"osayi-aduwawa-north-gate128.html"
OUT=ROOT/"gate148-local-evidence.json"
checks=[]
def check(name, predicate):
    try:
        passed=bool(predicate())
        checks.append({"name":name,"status":"PASS" if passed else "FAIL"})
    except Exception as e:
        checks.append({"name":name,"status":"ERROR","detail":str(e)})
def text(page, selector): return page.locator(selector).inner_text()
def run():
    if not HTML.is_file(): raise FileNotFoundError(f"Exact prototype file missing: {HTML}")
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH","/usr/bin/chromium"),headless=True,args=["--no-sandbox"])
        page=browser.new_page()
        page_errors=[]
        page.on("pageerror",lambda error:page_errors.append(str(error)))
        page.goto(HTML.as_uri())
        page.locator("#compute").click()
        page.locator("#confirm").click()
        before=(page.locator('[data-role="cattle"]').get_attribute("aria-pressed"),
                text(page,"#math"),text(page,"#ledger"),page.locator("#qty").input_value())
        page.locator("#tests").click()
        check("19 embedded checks",lambda:"19/19 assertions" in text(page,"#testout"))
        after=(page.locator('[data-role="cattle"]').get_attribute("aria-pressed"),
               text(page,"#math"),text(page,"#ledger"),page.locator("#qty").input_value())
        check("self-tests restore trader quote and approval",lambda:before==after)
        page.locator("#reset").click()
        page.locator("#confirm").click()
        check("approval without calculation blocked",lambda:"BLOCKED" in text(page,"#ledger"))
        page.locator("#compute").click()
        check("synthetic arithmetic",lambda:"₦5,000" in text(page,"#math"))
        page.locator("#confirm").click()
        check("approval after review",lambda:"SIMULATED OWNER CONFIRMATION" in text(page,"#ledger"))
        page.locator("#qty").fill("11")
        check("input invalidates approval",lambda:"Draft invalidated" in text(page,"#ledger"))
        page.locator("#confirm").click()
        check("stale approval blocked",lambda:"BLOCKED" in text(page,"#ledger"))
        page.locator("#qty").fill("")
        page.locator("#compute").click()
        check("blank quantity rejected",lambda:"INVALID INPUT" in text(page,"#math"))
        page.locator("#reset").click()
        for role in ("cattle","suya","farmer","shop","mining"):
            page.locator(f'[data-role="{role}"]').click()
            check(f"role {role}",lambda role=role:page.locator(f'[data-role="{role}"]').get_attribute("aria-pressed")=="true")
        page.locator("#next").click()
        check("mineral sale blocked",lambda:"Mineral sale remain blocked" in text(page,"#response"))
        page.locator("#stock").click()
        check("unverified inventory not fabricated",lambda:"never get verified stock" in text(page,"#response"))
        check("voice consent off by default",lambda:not page.locator("#voiceConsent").is_checked())
        page.locator("#listen").click()
        check("listening without consent blocked",lambda:"BLOCKED" in text(page,"#voiceStatus"))
        page.locator("#stoplisten").click()
        check("microphone stop control",lambda:"stopped" in text(page,"#voiceStatus"))
        check("consent cleared",lambda:not page.locator("#voiceConsent").is_checked())
        # Simulated recognition callbacks, not actual microphone or voice-model proof.
        page.add_init_script("""window.__fakeRecognition=[];
          window.SpeechRecognition=class {
            constructor(){window.__fakeRecognition.push(this)}
            start(){}
            abort(){if(this.onend)this.onend()}
          };""")
        page.reload()
        page.locator("#voiceConsent").check()
        page.locator("#listen").click()
        check("fake recognition starts with consent",lambda:"Listening after browser permission" in text(page,"#voiceStatus"))
        page.locator("#stoplisten").click()
        page.evaluate("""() => window.__fakeRecognition[0].onresult({results:[[{transcript:'cost'}]]})""")
        check("late transcript rejected after stop",lambda:"stopped" in text(page,"#voiceStatus") and "Your synthetic contribution" not in text(page,"#response"))
        check("stopped session remains without consent",lambda:not page.locator("#voiceConsent").is_checked())
        page.locator("#voiceConsent").check()
        page.locator("#listen").click()
        page.evaluate("""() => window.__fakeRecognition[1].onresult({results:[[{transcript:'cost'}]]})""")
        check("one utterance generates bounded response",lambda:"Your synthetic contribution" in text(page,"#response"))
        check("one utterance closes listening session",lambda:"stopped" in text(page,"#voiceStatus").lower())
        check("new voice session requires consent",lambda:not page.locator("#voiceConsent").is_checked())
        # Inject a deterministic fake recognition engine before reloading the app.
        # This is a simulated browser event, NOT a real microphone acceptance test.
        page.add_init_script("""window.__fakeRecognition=[];
          window.SpeechRecognition=class {
            constructor(){window.__fakeRecognition.push(this)}
            start(){}
            abort(){if(this.onend)this.onend()}
          };""")
        page.reload()
        page.locator("#voiceConsent").check()
        page.locator("#listen").click()
        check("fake recognition starts with consent",lambda:"Listening after browser permission" in text(page,"#voiceStatus"))
        page.locator("#stoplisten").click()
        page.evaluate("""() => window.__fakeRecognition[0].onresult({results:[[{transcript:'cost'}]]})""")
        check("late transcript rejected after stop",lambda:"stopped" in text(page,"#voiceStatus") and "Your synthetic contribution" not in text(page,"#response"))
        check("stopped session remains without consent",lambda:not page.locator("#voiceConsent").is_checked())
        page.locator("#voiceConsent").check()
        page.locator("#listen").click()
        page.evaluate("""() => window.__fakeRecognition[1].onresult({results:[[{transcript:'cost'}]]})""")
        check("one utterance generates bounded response",lambda:"Your synthetic contribution" in text(page,"#response"))
        check("one utterance closes listening session",lambda:"stopped" in text(page,"#voiceStatus").lower())
        check("new voice session requires consent",lambda:not page.locator("#voiceConsent").is_checked())
        check("no uncaught browser JavaScript errors",lambda:not page_errors)
        page.screenshot(path=str(ROOT/"gate148-local-screenshot.png"),full_page=True)
        evidence={"captured_utc":datetime.datetime.now(datetime.timezone.utc).isoformat(),"prototype":str(HTML),"prototype_sha256":hashlib.sha256(HTML.read_bytes()).hexdigest(),"browser_version":browser.version,"browser_page_errors":page_errors,"checks":checks,"note":"Local Chromium only. No physical microphone, Safari, voice model, network or hardware validation."}
        OUT.write_text(json.dumps(evidence,indent=2),encoding="utf-8")
        browser.close()
        passed=sum(c["status"]=="PASS" for c in checks)
        print(f"{passed}/{len(checks)} local browser checks passed; evidence: {OUT}")
        return 0 if passed==len(checks) else 1
if __name__=="__main__":
    try: sys.exit(run())
    except Exception as e:
        print("BLOCKED: "+str(e),file=sys.stderr)
        traceback.print_exc()
        sys.exit(2)
