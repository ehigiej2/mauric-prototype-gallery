"""Isolated end-to-end encrypted synthetic research test; serves repository on localhost only."""
import os
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

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
            context = browser.new_context(viewport={"width": 390, "height": 844})
            page = context.new_page()
            requests, errors = [], []
            page.on("request", lambda r: requests.append(r.url) if not r.url.startswith(f"http://127.0.0.1:{server.server_port}/") else None)
            page.on("pageerror", lambda e: errors.append(str(e)))
            url = f"http://127.0.0.1:{server.server_port}/monarch-trade-waka-review.html"
            page.goto(url)
            assert page.locator(".tile").count() == 6
            page.locator('.tile[data-mode="osayi"]').click()
            assert page.locator("#researchMemory").is_visible()
            page.locator("#researchNote").fill("Fictional Benin supplier scenario")
            page.locator("#researchPass").fill("synthetic-research-passphrase-123")
            page.locator("#researchSave").click()
            assert "Not saved" in page.locator("#researchStatus").inner_text()
            page.locator("#researchConsent").check()
            page.locator("#researchSave").click()
            assert "saved locally" in page.locator("#researchStatus").inner_text()
            assert page.locator("#researchPass").input_value() == "", "Passphrase retained after save"
            assert page.evaluate("() => !JSON.stringify(localStorage).includes('Fictional Benin supplier scenario')")
            page.reload()
            assert page.locator(".tile").count() == 6
            page.locator('.tile[data-mode="osayi"]').click()
            page.locator("#researchPass").fill("synthetic-research-passphrase-123")
            page.locator("#researchRecover").click()
            assert page.locator("#researchNote").input_value() == "Fictional Benin supplier scenario"
            assert page.locator("#researchPass").input_value() == "", "Passphrase retained after recovery"
            page.locator("#researchPass").fill("incorrect-passphrase-123")
            page.locator("#researchRecover").click()
            assert "Recovery failed" in page.locator("#researchStatus").inner_text()
            page.locator("#back").click()
            assert page.locator("#researchMemory").count() == 0, "Research controls persist after exit"
            page.locator('.tile[data-mode="osayi"]').click()
            page.locator("#researchDelete").click()
            assert "deleted" in page.locator("#researchStatus").inner_text()
            page.reload()
            page.locator('.tile[data-mode="osayi"]').click()
            page.locator("#researchPass").fill("synthetic-research-passphrase-123")
            page.locator("#researchRecover").click()
            assert "No saved research" in page.locator("#researchStatus").inner_text()
            assert not requests, f"Unexpected outbound requests: {requests}"
            assert not errors, f"JavaScript errors: {errors}"
            context.close()
            browser.close()
            print(f"PASS {engine}: consent, encrypted save, reload recovery, wrong passphrase, deletion, six buttons, localhost-only requests")
    finally:
        server.shutdown()
        server.server_close()

if __name__ == "__main__":
    main()
