"""Isolated browser acceptance checks for the synthetic MONARCH Trade × Waka lab.
Run from repository root: python -m pip install playwright && python -m playwright install chromium
python tests/test_monarch_waka_browser.py
No network or live customer data is required.
"""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = (Path(__file__).resolve().parents[1] / "monarch-trade-waka-review.html").as_uri()

def main():
    with sync_playwright() as p:
        engine = os.environ.get("WAKA_BROWSER", "chromium")
        assert engine in ("chromium", "webkit"), f"Unsupported engine: {engine}"
        browser = getattr(p, engine).launch(headless=True)
        for width, height in [(320,568),(375,667),(390,844)]:
            page = browser.new_page(viewport={"width":width,"height":height})
            outbound=[]
            errors=[]
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("request",lambda req: outbound.append(req.url) if req.url.startswith(("https://","http://")) else None)
            page.goto(URL)
            assert page.get_by_role("heading",name="Watein you wan do?").is_visible()
            assert page.locator(".tile").count()==6
            for tile in page.locator(".tile").all():
                box=tile.bounding_box()
                assert tile.is_visible() and box is not None
                assert box["x"] >= 0 and box["y"] >= 0 and box["x"]+box["width"] <= width and box["y"]+box["height"] <= height, f"Button outside viewport at {width}x{height}: {box}"
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"Horizontal overflow at {width}"
            for mode in ["sell","send","stock","money","team","osayi"]:
                page.locator(f'.tile[data-mode="{mode}"]').click()
                assert page.locator("#workspace").is_visible(),mode
                assert page.locator("#homeActions").get_attribute("inert") is not None, mode
                assert page.locator("#workspace").evaluate("(e)=>getComputedStyle(e).position")=="fixed"
                page.locator("#back").click()
                assert page.locator("#workspace").is_hidden(),mode
                assert page.locator("#homeActions").get_attribute("inert") is None, mode
            samples={"sell":{"item":"Akara","amount":"250","quantity":"2"},"send":{"item":"Farm produce","destination":"Fictional Ekekhuan Road"},"stock":{"item":"Rice bag","amount":"55000"},"money":{"item":"Claimed receipt","amount":"1000"},"team":{"item":"Fictional worker"}}
            for sample_mode,fields in samples.items():
                page.locator(f'.tile[data-mode="{sample_mode}"]').click()
                for name,value in fields.items():
                    page.locator(f'[name="{name}"]').fill(value)
                page.locator('#journey button[type="submit"]').click()
                assert "SIM-" in page.locator("#result").inner_text(),sample_mode
                assert page.locator('#journey button[type="submit"]').is_disabled(), "Duplicate-submit guard missing"
                counts={"sell":"orders","send":"trips","stock":"stock","money":"ledger","team":"delegations"}
                before=page.evaluate("(key)=>state[key].length",counts[sample_mode])
                page.locator("#journey").dispatch_event("submit")
                after=page.evaluate("(key)=>state[key].length",counts[sample_mode])
                assert after==before, f"Duplicate submission in {sample_mode}"
                page.locator("#back").click()
            page.locator('.tile[data-mode="sell"]').click()
            page.locator('[name="item"]').fill("Fictional akara")
            page.locator('[name="amount"]').fill("250")
            page.locator('[name="quantity"]').fill("2")
            page.locator('#journey button[type="submit"]').click()
            assert "SIM-" in page.locator("#result").inner_text()
            page.locator("#back").click()
            page.locator('.tile[data-mode="osayi"]').click()
            page.locator('[name="item"]').fill("How can I send stock?")
            page.locator('#journey button[type="submit"]').click()
            page.locator('[name="item"]').fill("What did I ask previously?")
            page.locator('#journey button[type="submit"]').click()
            assert "How can I send stock?" in page.locator("#messages").inner_text()
            page.locator("#back").click()
            page.locator('.tile[data-mode="osayi"]').click()
            assert "How can I send stock?" in page.locator("#messages").inner_text(), "Conversation lost on reopen"
            page.locator('[name="item"]').fill("Cancel me")
            page.locator("#cancelTurn").click()
            assert page.locator('[name="item"]').input_value()==""
            page.locator("#clearChat").click()
            assert "Conversation cleared" in page.locator("#messages").inner_text()
            page.locator("#back").click()
            page.locator('.tile[data-mode="osayi"]').click()
            assert page.locator("#messages").is_visible()
            assert "How can I send stock?" not in page.locator("#messages").inner_text(), "Clear did not erase session history"
            page.locator("#back").click()
            page.locator('.tile[data-mode="osayi"]').click()
            assert page.locator("#playIntro").is_visible()
            assert page.locator("#osayiIntro").get_attribute("src").endswith("intro.mp3")
            audio_path=Path(__file__).resolve().parents[1] / "audio/stephen-osayi-v5/intro.mp3"
            assert audio_path.is_file() and audio_path.stat().st_size > 1000, "Recorded greeting asset missing or empty"
            page.locator("#playIntro").click()
            page.wait_for_function("() => { const a=document.querySelector('#osayiIntro'); return a && !a.paused && a.currentTime > 0.1 && !a.error; }", timeout=15000)
            assert "prerecorded" in page.locator("#result").inner_text()
            page.locator("#clearChat").click()
            assert page.locator("#osayiIntro").evaluate("(a) => a.paused && a.currentTime === 0")
            page.keyboard.press("Escape")
            assert page.locator("#workspace").is_hidden()
            # Exercise the attached controls through the visible review UI.
            controls=page.get_by_role("button", name="🔒 Decision controls", exact=True)
            controls.click()
            panel=page.get_by_role("region", name="Synthetic transaction controls")
            assert panel.is_visible()
            panel.get_by_role("button", name="Create fictional case").click()
            advance=panel.get_by_role("button", name="Advance one research gate")
            advance.click()
            assert '"status": "RESEARCH"' in panel.inner_text()
            advance.click()
            assert '"status": "EVIDENCE_REVIEW"' in panel.inner_text()
            advance.click()
            assert "BLOCKED: Missing or invalid evidence" in panel.inner_text()
            panel.get_by_role("button", name="Stop this case").click()
            assert '"status": "STOPPED"' in panel.inner_text()
            controls.click()
            assert panel.is_hidden()
            # Independent synthetic engines test state invariants, not identity authentication.
            checks=page.evaluate("""() => {
                const e=MonarchControl.makeEngine({tenant:"journey-a",prototype:"test-trade"});
                const other=MonarchControl.makeEngine({tenant:"journey-b",prototype:"test-trade"});
                const passed=[];
                function ok(condition, label) { if(!condition) throw Error(label); passed.push(label); }
                function blocked(fn,label) { const before=JSON.stringify(e.snapshot()); let threw=false;
                    try { fn(); } catch { threw=true; }
                    ok(threw && before===JSON.stringify(e.snapshot()),label); }
                e.create("SIM_JOURNEY");
                blocked(()=>e.create("SIM_JOURNEY"),"duplicate case rejected without mutation");
                blocked(()=>e.transition("SIM_JOURNEY","SETTLEMENT_SIMULATED"),"settlement cannot skip gates");
                e.transition("SIM_JOURNEY","RESEARCH");
                e.transition("SIM_JOURNEY","EVIDENCE_REVIEW");
                blocked(()=>e.transition("SIM_JOURNEY","OWNER_REVIEW"),"UNKNOWN evidence blocks review");
                for(const key of MonarchControl.REQUIRED) e.record("SIM_JOURNEY",key,"SUPPLIED_UNVERIFIED");
                e.transition("SIM_JOURNEY","OWNER_REVIEW");
                blocked(()=>e.transition("SIM_JOURNEY","APPROVED_FOR_SIMULATION",{actor:"researcher"}),"researcher cannot approve simulation");
                blocked(()=>e.transition("SIM_JOURNEY","APPROVED_FOR_SIMULATION",{actor:"owner"}),"unreviewed evidence blocks simulation approval");
                for(const key of MonarchControl.REQUIRED) e.record("SIM_JOURNEY",key,"REVIEWED_UNAUTHENTICATED");
                e.transition("SIM_JOURNEY","OWNER_REVIEW");
                e.transition("SIM_JOURNEY","APPROVED_FOR_SIMULATION",{actor:"owner"});
                e.transition("SIM_JOURNEY","FULFILMENT_SIMULATED");
                e.revokeConsent("SIM_JOURNEY");
                ok(e.view("SIM_JOURNEY").status==="EVIDENCE_REVIEW" && e.view("SIM_JOURNEY").approvedBy===null,
                    "consent revocation invalidates simulation approval");
                blocked(()=>e.transition("SIM_JOURNEY","OWNER_REVIEW"),"revoked consent blocks review");
                let hidden=false; try { other.view("SIM_JOURNEY"); } catch { hidden=true; }
                ok(hidden && other.snapshot().cases.length===0,"separate engine instances do not share cases");
                e.transition("SIM_JOURNEY","STOPPED",{reason:"Synthetic user stop"});
                blocked(()=>e.record("SIM_JOURNEY","consent","REVIEWED_UNAUTHENTICATED"),"stopped case cannot change evidence");
                blocked(()=>e.transition("SIM_JOURNEY","RESEARCH"),"stopped case cannot restart");
                const beforeStop=JSON.stringify(e.snapshot());
                e.transition("SIM_JOURNEY","STOPPED");
                ok(beforeStop===JSON.stringify(e.snapshot()),"repeated stop is idempotent");
                const ledger=e.ledger("SIM_JOURNEY");
                ok(ledger.every((event,index)=>event.sequence===index+1),"synthetic ledger sequence is contiguous");
                return passed;
            }""")
            assert len(checks)==12, checks
            print(f"PASS {engine} {width}x{height}: shared controls UI and {len(checks)} synthetic invariants")
            Path("test-evidence").mkdir(exist_ok=True)
            page.screenshot(path=f"test-evidence/{engine}-{width}x{height}.png")
            assert not errors, f"Browser script errors: {errors}"
            assert not outbound, f"Unexpected external requests: {outbound}"
            page.close()
        browser.close()
    print(f"PASS {engine}: recorded greeting playback and stop; 3 mobile viewports; six-button navigation; five synthetic workflows; Osayi recall/cancel/clear; no outbound HTTP")

if __name__=="__main__":
    main()
