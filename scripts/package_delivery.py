#!/usr/bin/env python3
"""Build portable static app copies. Standard library only; no credentials."""
import argparse,base64,hashlib,json,re,zipfile
from pathlib import Path
from datetime import datetime,timezone
def data(path,mime):
    return 'data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()
def build(root,out):
    out.mkdir(parents=True,exist_ok=True)
    files={}
    audio=root/'audio/stephen-osayi-v5'
    image=data(root/'assets/mauric-nigeria-business-v1.webp','image/webp')
    for source,target in [('stephen-preview.html','stephen-offline.html'),('nigeria-business-preview.html','nigeria-studio-offline.html')]:
        html=(root/source).read_text()
        if re.search(r'<script[^>]+src=',html,re.I):
            raise ValueError('Bundle external script dependencies before release')
        html=html.replace('/mauric-prototype-gallery/assets/mauric-nigeria-business-v1.webp',image)
        resolver="audioPath=k=>'/mauric-prototype-gallery/audio/stephen-osayi-v5/'+k+'.mp3'"
        if resolver in html:
            mapping={p.stem:data(p,'audio/mpeg') for p in sorted(audio.glob('*.mp3')) if p.stem!='universal'}
            if len(mapping)!=13: raise ValueError('Expected 13 personalised audio assets')
            html=html.replace(resolver,'audioPath=k=>('+json.dumps(mapping,separators=(',',':'))+')[k]')
        html=html.replace('/mauric-prototype-gallery/audio/stephen-osayi-v5/universal.mp3',data(audio/'universal.mp3','audio/mpeg'))
        if '/mauric-prototype-gallery/audio/stephen-osayi-v5/' in html:
            raise ValueError('An audio dependency was not embedded')
        encoded=html.encode()
        (out/target).write_bytes(encoded)
        files[target]={'bytes':len(encoded),'sha256':hashlib.sha256(encoded).hexdigest()}
    readme="""MAURIC portable research apps
Open stephen-offline.html or nigeria-studio-offline.html in a compatible browser.
The core calculators, prerecorded voice, illustration and local storyboard renderer are bundled.
No installation, administrator access, account, microphone or live payment is required.
Some mobile Files previews do not execute HTML/JavaScript; use the HTTPS app in Safari instead.
Optional public GitHub refresh and external source links require internet.
Video export requires browser MediaRecorder/canvas support. Feature presence is not proof of all-device testing.
New AI speech/image/video synthesis and third-party integrations are not connected.
Local saves stay in that browser; they are not encrypted backups or shared accounts.
Do not enter confidential, patient, student or customer records. All transactions are simulated.
CROWN HOLD. No commercial operations. Verify checksums against delivery-manifest.json.
Checksums detect changed bytes; they are not a signing certificate or a universal safety guarantee.
"""
    (out/'README.txt').write_text(readme)
    manifest={'release':'delivery-20261109-01','created_at':datetime.now(timezone.utc).isoformat(),'crown_hold':True,'files':files,'network_required_for_core':False,'optional_network':['public deployment refresh','external source links'],'device_validation':'Chrome only; other combinations unverified'}
    (out/'delivery-manifest.json').write_text(json.dumps(manifest,indent=2))
    with zipfile.ZipFile(out/'mauric-apps-offline.zip','w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for name in [*files,'README.txt','delivery-manifest.json']: z.write(out/name,name)
    with zipfile.ZipFile(out/'mauric-apps-offline.zip') as z:
        assert z.testzip() is None
        for name,meta in files.items():
            assert hashlib.sha256(z.read(name)).hexdigest()==meta['sha256']
    print(json.dumps({'files':files,'zip_bytes':(out/'mauric-apps-offline.zip').stat().st_size,'integrity':'PASS'}))
if __name__=='__main__':
    p=argparse.ArgumentParser()
    p.add_argument('--root',type=Path,default=Path('.'))
    p.add_argument('--output',type=Path,default=Path('downloads'))
    a=p.parse_args();build(a.root.resolve(),a.output.resolve())
