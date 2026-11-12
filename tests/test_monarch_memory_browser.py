"""Isolated end-to-end encrypted synthetic research test; serves repository on localhost only."""
import os
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args): pass

def main():
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        with sync_playwright() as p:
            engine = os.environ.get("WAKA_BROWSER", "chromium")
            assert engine in ("chromium", "webkit")
            browser = getattr(p, engine).launch(headless=True)
            viewport = os.environ.get("WAKA_VIEWPORT", "390x844")
            width, height = (int(n) for n in viewport.split("x"))
            context = browser.new_context(viewport={"width": width, "height": height})
            page = context.new_page()
            requests, errors = [], []
            page.on("request", lambda r: requests.append(r.url) if not r.url.startswith(f"http://127.0.0.1:{server.server_port}/") else None)
            page.on("pageerror", lambda e: errors.append(str(e)))
            url = f"http://127.0.0.1:{server.server_port}/monarch-trade-waka-review.html"
            page.goto(url)
            assert page.locator(".tile").count() == 6
            for tile in page.locator(".tile").all():
                box = tile.bounding_box()
                assert box and box["x"] >= 0 and box["y"] >= 0 and box["x"] + box["width"] <= width and box["y"] + box["height"] <= height, f"Home tile outside viewport {width}x{height}: {box}"
            page.locator('.tile[data-mode="osayi"]').click()
            assert page.locator("#researchMemory").is_visible()
            assert page.locator("#researchConsent").is_checked() is False
            assert page.evaluate("() => localStorage.length") == 0, "Unexpected storage before consent"
            page.locator("#researchNote").fill("Fictional Benin supplier scenario")
            page.locator("#researchPass").fill("synthetic-research-passphrase-123")
            page.locator("#researchSave").click()
            assert "Not saved" in page.locator("#researchStatus").inner_text()
            assert page.locator("#researchPass").input_value() == "", "Passphrase retained after consent rejection"
            page.locator("#researchPass").fill("synthetic-research-passphrase-123")
            assert page.evaluate("() => localStorage.length") == 0, "Research stored without consent"
            page.locator("#researchConsent").check()
            page.locator("#researchSave").click()
            expect(page.locator("#researchStatus")).to_contain_text("saved locally", timeout=15000)
            assert page.locator("#researchPass").input_value() == "", "Passphrase retained after save"
            assert page.evaluate("() => !JSON.stringify(localStorage).includes('Fictional Benin supplier scenario')")
            assert page.evaluate("() => localStorage.length === 1"), "Unexpected research storage keys"
            page.reload()
            assert page.locator(".tile").count() == 6
            page.locator('.tile[data-mode="osayi"]').click()
            page.locator("#researchPass").fill("synthetic-research-passphrase-123")
            page.locator("#researchRecover").click()
            expect(page.locator("#researchNote")).to_have_value("Fictional Benin supplier scenario", timeout=15000)
            assert page.locator("#researchPass").input_value() == "", "Passphrase retained after recovery"
            assert page.locator("#researchConsent").is_checked() is False, "Consent incorrectly persisted"
            page.locator("#researchPass").fill("incorrect-passphrase-123")
            page.locator("#researchRecover").click()
            expect(page.locator("#researchStatus")).to_contain_text("Recovery failed", timeout=15000)
            assert page.locator("#researchPass").input_value() == "", "Passphrase retained after failed recovery"
            assert page.locator("#researchNote").input_value() == "Fictional Benin supplier scenario", "Failed recovery unexpectedly changed note"
            assert page.evaluate("() => Object.keys(localStorage).some(k => k.startsWith('monarch-synthetic-research-v1:') && !k.endsWith(':deletion-revision'))"), "Wrong passphrase deleted valid ciphertext"
            page.locator("#researchPass").fill("synthetic-research-passphrase-123")
            page.locator("#researchRecover").click()
            expect(page.locator("#researchStatus")).to_contain_text("recovered locally", timeout=15000)
            assert page.locator("#researchPass").input_value() == "", "Passphrase retained after retry"
            page.locator("#back").click()
            assert page.locator("#researchMemory").count() == 0, "Research controls persist after exit"
            page.locator('.tile[data-mode="osayi"]').click()
            page.locator("#researchDelete").click()
            assert "deleted" in page.locator("#researchStatus").inner_text()
            page.reload()
            page.locator('.tile[data-mode="osayi"]').click()
            page.locator("#researchPass").fill("synthetic-research-passphrase-123")
            page.locator("#researchRecover").click()
            expect(page.locator("#researchStatus")).to_contain_text("No saved research", timeout=15000)
            assert page.locator("#researchPass").input_value() == "", "Passphrase retained when no record exists"
            assert not requests, f"Unexpected outbound requests: {requests}"
            assert not errors, f"JavaScript errors: {errors}"
            context.close()
            browser.close()
            print(f"PASS {engine} {width}x{height}: consent, encrypted save, reload recovery, wrong passphrase, deletion, six buttons, localhost-only requests")
    finally:
        server.shutdown()
        server.server_close()

if __name__ == "__main__":
    main()
