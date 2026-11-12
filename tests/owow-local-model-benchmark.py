#!/usr/bin/env python3
"""Read-only local model benchmark; starts no external services or downloads."""
import json,os,subprocess,time,urllib.request,urllib.error,signal
BIN='/home/ehigiej2/monarch-ai-runtime/llama.cpp/build/bin/llama-server'
MODEL='/home/ehigiej2/MONARCH_Offline/models/gemma-3-270m-it-q4_0.gguf'
PORT=19454
PROMPTS=[
  ('short','Reply in Nigerian Pidgin in one sentence: how can an akara seller record two sales in a notebook?'),
  ('sequential','A fictional seller sold 3 items at 200 naira each and spent 150 naira on delivery. Calculate revenue, delivery expense and difference. Show arithmetic; say this is only a simulation.')
]
def request(url,payload=None):
 data=json.dumps(payload).encode() if payload else None
 req=urllib.request.Request(url,data=data,headers={'Content-Type':'application/json'},method='POST' if payload else 'GET')
 with urllib.request.urlopen(req,timeout=22) as r:return json.load(r)
def run(threads):
 args=[BIN,'--model',MODEL,'--host','127.0.0.1','--port',str(PORT),'--offline','--no-webui','--ctx-size','1024','--threads',str(threads),'--parallel','1','--batch-size','256','--ubatch-size','128']
 start=time.monotonic()
 with open('/tmp/owow-local-model-benchmark.log','ab') as log:
  p=subprocess.Popen(args,stdout=log,stderr=log,start_new_session=True)
  try:
   for _ in range(70):
    try:
     if request(f'http://127.0.0.1:{PORT}/health').get('status')=='ok':break
    except Exception:pass
    time.sleep(.15)
   else:raise RuntimeError('Model did not become ready')
   results=[]
   for kind,prompt in PROMPTS:
    t=time.monotonic()
    reply=request(f'http://127.0.0.1:{PORT}/v1/chat/completions',{'model':'gemma-3-270m-it-q4_0.gguf','messages':[{'role':'system','content':'You are a cautious, concise Nigerian Pidgin assistant. No real actions.'},{'role':'user','content':prompt}],'temperature':0,'max_tokens':90})
    elapsed=round(time.monotonic()-t,2)
    usage=reply.get('usage',{})
    results.append({'kind':kind,'seconds':elapsed,'output_tokens':usage.get('completion_tokens'),'tokens_per_second':round((usage.get('completion_tokens') or 0)/max(elapsed,.01),2),'answer':reply.get('choices',[{}])[0].get('message',{}).get('content','')[:450]})
   return {'threads':threads,'cold_start_seconds':round(time.monotonic()-start,2),'results':results}
  finally:
   os.killpg(p.pid,signal.SIGTERM)
   try:p.wait(timeout=4)
   except subprocess.TimeoutExpired:os.killpg(p.pid,signal.SIGKILL)
if __name__=='__main__':
 print(json.dumps({'benchmark':'synthetic-local-only','runs':[run(t) for t in (2,3)]},ensure_ascii=False,indent=2))
