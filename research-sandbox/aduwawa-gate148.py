#!/usr/bin/env python3
"""Gate 148: run against exact checked-out repository HTML. No network required.
Usage: python research-sandbox/aduwawa-gate148.py
Requires: playwright Python and installed Chromium. No deployment, orders or payments.
"""
import json, os, pathlib, sys, datetime
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
        page.goto(HTML.as_uri())
        page.locator("#tests").click()
        check("19 embedded checks",lambda:"19/19 assertions" in text(page,"#testout"))
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
        page.screenshot(path=str(ROOT/"gate148-local-screenshot.png"),full_page=True)
        evidence={"captured_utc":datetime.datetime.now(datetime.timezone.utc).isoformat(),"prototype":str(HTML),"browser_version":browser.version,"checks":checks,"note":"Local Chromium only. No physical microphone, Safari, voice model, network or hardware validation."}
        OUT.write_text(json.dumps(evidence,indent=2),encoding="utf-8")
        browser.close()
        passed=sum(c["status"]=="PASS" for c in checks)
        print(f"{passed}/{len(checks)} local browser checks passed; evidence: {OUT}")
        return 0 if passed==len(checks) else 1
if __name__=="__main__":
    try: sys.exit(run())
    except Exception as e:
        print("BLOCKED: "+str(e),file=sys.stderr)
        sys.exit(2)
