"""Security release gate: deletion in tab B must prevent pending save in tab A.
Expected to expose a known limitation until cross-tab coordination is implemented.
Synthetic research only; localhost, no deployment.
"""
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *_args): pass

def main():
    server=ThreadingHTTPServer(("127.0.0.1",0),partial(Quiet,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True)
            context=browser.new_context()
            a=context.new_page()
            b=context.new_page()
            url=f"http://127.0.0.1:{server.server_port}/monarch-trade-waka-review.html"
            a.goto(url)
            b.goto(url)
            for page in (a,b):
                page.evaluate("""() => { localStorage.clear(); }""")
            # Inject a controllable crypto facade, rather than attempting to
            # overwrite the browser's possibly read-only crypto.subtle.encrypt.
            a.evaluate("""() => {
              window.__encryptStarted=false;
              window.__releaseEncrypt=null;
              const native=crypto;
              const facade={
                getRandomValues: array => native.getRandomValues(array),
                subtle:{
                  importKey:(...args)=>native.subtle.importKey(...args),
                  deriveKey:(...args)=>native.subtle.deriveKey(...args),
                  decrypt:(...args)=>native.subtle.decrypt(...args),
                  encrypt:async (...args)=>{
                    window.__encryptStarted=true;
                    await new Promise(resolve=>window.__releaseEncrypt=resolve);
                    return native.subtle.encrypt(...args);
                  }
                }
              };
              window.__memoryA=MonarchResearchMemory.create({
                tenant:'demo-tenant',prototype:'trade',
                storage:localStorage,crypto:facade
              });
              window.__pendingA=window.__memoryA.save(
                {notes:'Synthetic cross-tab record',questions:[]},
                'synthetic-cross-tab-passphrase',{consent:true}
              ).then(()=>({ok:true}),e=>({ok:false,error:e.message}));
            }""")
            a.wait_for_function("window.__encryptStarted === true",timeout=15000)
            b.evaluate("""() => MonarchResearchMemory.create({
              tenant:'demo-tenant',prototype:'trade',storage:localStorage
            }).clear()""")
            a.evaluate("() => window.__releaseEncrypt()")
            outcome=a.evaluate("async () => await window.__pendingA")
            persisted=b.evaluate("""() => MonarchResearchMemory.create({
              tenant:'demo-tenant',prototype:'trade',storage:localStorage
            }).hasSaved()""")
            assert outcome["ok"] is False and persisted is False, (
                "RELEASE BLOCKER: another tab resurrected research after deletion; "
                f"save={outcome}, persisted={persisted}"
            )
            context.close()
            browser.close()
            print("PASS: cross-tab deletion prevents in-flight save")
    finally:
        server.shutdown()
        server.server_close()

if __name__=="__main__":
    main()
