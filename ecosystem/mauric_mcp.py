#!/usr/bin/env python3
"""Read-only legacy MCP stdio planning foundation. No network, shell or provider actions."""
import json,sys
from pathlib import Path
REGISTRY=json.loads((Path(__file__).parent/'agent-registry.json').read_text())
PROTOCOL='2025-06-18'
TOOLS=[
 {'name':'mauric_agents','description':'List declared responsibilities and actual connection limits. Does not start agents.','inputSchema':{'type':'object','properties':{},'additionalProperties':False},'annotations':{'readOnlyHint':True,'destructiveHint':False,'idempotentHint':True,'openWorldHint':False}},
 {'name':'mauric_route_task','description':'Prepare a read-only task route linked to Stephen and the delivery work. Does not execute integrations.','inputSchema':{'type':'object','properties':{'goal':{'type':'string','minLength':1,'maxLength':500},'system':{'type':'string','enum':['SharePoint','banking','delivery','browser','knowledge']}},'required':['goal','system'],'additionalProperties':False},'annotations':{'readOnlyHint':True,'destructiveHint':False,'idempotentHint':True,'openWorldHint':False}},
 {'name':'mauric_release_contract','description':'Return the delivery gates and current work links, without claiming live checks.','inputSchema':{'type':'object','properties':{},'additionalProperties':False},'annotations':{'readOnlyHint':True,'destructiveHint':False,'idempotentHint':True,'openWorldHint':False}}
]
def tool(name,args):
    if not isinstance(args,dict): raise ValueError('Arguments must be an object')
    if name=='mauric_route_task':
        if set(args)!={'goal','system'} or not isinstance(args['goal'],str) or not args['goal'].strip() or len(args['goal'])>500 or args['system'] not in REGISTRY['systems']:
            raise ValueError('Use a bounded goal and an advertised system')
        agent={'SharePoint':'sharepoint','banking':'banking','delivery':'delivery','browser':'systems','knowledge':'knowledge'}[args['system']]
        return {'goal':args['goal'],'guide':'osayi','coordinator':'marius','assigned_responsibility':agent,'system_state':REGISTRY['systems'][args['system']],'execution':'NOT_PERFORMED','next_steps':REGISTRY['connection_gates'],'linked_work':REGISTRY['current_work'],'crown_hold':True}
    if args: raise ValueError('This tool takes no arguments')
    if name=='mauric_agents': return REGISTRY
    if name=='mauric_release_contract': return {'required':['stable HTTPS URL','HTTP and rendering evidence','downloadable portable package','asset integrity','compatibility limits','version manifest'],'checks_in_this_tool':'NOT_PERFORMED','linked_work':REGISTRY['current_work'],'crown_hold':True}
    raise ValueError('Unknown tool')
def error(i,code,message): return {'jsonrpc':'2.0','id':i,'error':{'code':code,'message':message}}
def run():
    initialized=False;ready=False
    for line in sys.stdin:
        if len(line)>1000000:
            print(json.dumps(error(None,-32600,'Request too large')),flush=True);continue
        try: req=json.loads(line)
        except json.JSONDecodeError:
            print(json.dumps(error(None,-32700,'Parse error')),flush=True);continue
        if not isinstance(req,dict) or req.get('jsonrpc')!='2.0' or not isinstance(req.get('method'),str):
            print(json.dumps(error(req.get('id') if isinstance(req,dict) else None,-32600,'Invalid request')),flush=True);continue
        method=req['method'];i=req.get('id');params=req.get('params',{})
        if method=='notifications/initialized':
            if initialized:ready=True
            continue
        if 'id' not in req:continue
        if not isinstance(params,dict):
            print(json.dumps(error(i,-32602,'Params must be an object')),flush=True);continue
        result=None
        if method=='initialize':
            initialized=True
            result={'protocolVersion':PROTOCOL,'capabilities':{'tools':{'listChanged':False}},'serverInfo':{'name':'mauric-planning-foundation','version':'0.1.0'},'instructions':'Read-only planning only. No external connectors or agent execution are bound. CROWN HOLD.'}
        elif method=='ping':result={}
        elif not ready:
            print(json.dumps(error(i,-32002,'Initialize using legacy MCP lifecycle first')),flush=True);continue
        elif method=='tools/list':result={'tools':TOOLS}
        elif method=='tools/call':
            try: data=tool(params.get('name'),params.get('arguments',{}));result={'content':[{'type':'text','text':json.dumps(data)}],'isError':False}
            except (ValueError,TypeError):result={'content':[{'type':'text','text':'Invalid or unsupported tool arguments; no action performed.'}],'isError':True}
        else:
            print(json.dumps(error(i,-32601,'Method not found')),flush=True);continue
        print(json.dumps({'jsonrpc':'2.0','id':i,'result':result}),flush=True)
if __name__=='__main__':run()
