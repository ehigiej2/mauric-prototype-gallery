"""Isolated browser acceptance checks for the synthetic MONARCH Trade × Waka lab.
Run from repository root: python -m pip install playwright && python -m playwright install chromium
python tests/test_monarch_waka_browser.py
No network or live customer data is required.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = (Path(__file__).resolve().parents[1] / "monarch-trade-waka-review.html").as_uri()

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width, height in [(320,568),(375,667),(390,844)]:
            page = browser.new_page(viewport={"width":width,"height":height})
            page.goto(URL)
            assert page.get_by_role("heading",name="Watein you wan do?").is_visible()
            assert page.locator(".tile").count()==6
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"Horizontal overflow at {width}"
            for mode in ["sell","send","stock","money","team","osayi"]:
                page.locator(f'.tile[data-mode="{mode}"]').click()
                assert page.locator("#workspace").is_visible(),mode
                assert page.locator("#workspace").evaluate("(e)=>getComputedStyle(e).position")=="fixed"
                page.locator("#back").click()
                assert page.locator("#workspace").is_hidden(),mode
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
            page.locator('[name="item"]').fill("Cancel me")
            page.locator("#cancelTurn").click()
            assert page.locator('[name="item"]').input_value()==""
            page.locator("#clearChat").click()
            assert "Conversation cleared" in page.locator("#messages").inner_text()
            page.keyboard.press("Escape")
            assert page.locator("#workspace").is_hidden()
            page.close()
        browser.close()
    print("PASS: 3 viewports × six-button navigation; sell; recall; cancel; clear; Escape")

if __name__=="__main__":
    main()
