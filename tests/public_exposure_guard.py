#!/usr/bin/env python3
"""MAURIC public-gallery static exposure guard. No network, no file contents in output."""
import pathlib,re,sys
root=pathlib.Path(__file__).resolve().parents[1]
skip={'.git','node_modules','.venv','__pycache__'}
bad_extensions={'.pem','.p12','.pfx','.key','.sqlite','.db'}
rules=[
 ('private-key',re.compile(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----')),
 ('github-token',re.compile(rb'gh[pousr]_[A-Za-z0-9_]{30,}')),
 ('stripe-live-secret',re.compile(rb'sk_live_[A-Za-z0-9]{12,}')),
 ('aws-access-key',re.compile(rb'AKIA[0-9A-Z]{16}')),
 ('elevenlabs-key-assignment',re.compile(rb'(?i)(?:elevenlabs[_-]?api[_-]?key|xi-api-key)\s*[:=]\s*["\x27]?[A-Za-z0-9]{20,}')),
 ('embedded-identity-image',re.compile(rb'(?i)data:image/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]{150,}')),
]
hits=[]
for p in root.rglob('*'):
 if not p.is_file() or any(x in skip for x in p.relative_to(root).parts):continue
 rel=p.relative_to(root).as_posix()
 if p.suffix.lower() in bad_extensions:hits.append((rel,'restricted-file-type'))
 if p.name=='.env' or p.name.startswith('.env.'):hits.append((rel,'environment-file'))
 if p.stat().st_size>3_000_000:continue
 if p.suffix.lower() not in {'.html','.js','.json','.yml','.yaml','.md','.txt','.css','.svg','.py','.xml','.toml'}:continue
 data=p.read_bytes()
 for label,rx in rules:
  if rx.search(data):hits.append((rel,label))
if hits:
 for path,label in hits:print('BLOCK',path,label)
 print('FAIL: potential public exposure; manual review required.')
 sys.exit(1)
print('PASS: static high-confidence exposure patterns absent. Not a full security audit.')
