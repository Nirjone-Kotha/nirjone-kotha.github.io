from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urljoin
import contextlib
import os
import re
import threading

ROOT = Path(__file__).resolve().parents[1]

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

old_cwd = Path.cwd()
os.chdir(ROOT)
server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
base = f"http://127.0.0.1:{server.server_port}/"

try:
    index = urlopen(base, timeout=5)
    html = index.read().decode("utf-8")
    assert index.status == 200
    assert "Moner Kotha: Anonymous Social Site" in html
    assert "telegram-web-app" not in html.lower()

    assets = set(re.findall(r'(?:href|src)=["\'](\./[^"\']+)["\']', html))
    app = (ROOT / "assets/js/app.js").read_text(encoding="utf-8")
    assets.update(urljoin("./assets/js/", rel) for rel in re.findall(r'(?:from\s+|import\s*)["\'](\./[^"\']+)["\']', app))
    assets.update({"./sw.js", "./offline.html"})

    checked = []
    for rel in sorted(assets):
        response = urlopen(urljoin(base, rel), timeout=5)
        body = response.read()
        assert response.status == 200, rel
        assert body, rel
        checked.append({"path": rel, "contentType": response.headers.get_content_type(), "bytes": len(body)})

    manifest_response = urlopen(urljoin(base, "manifest.webmanifest"), timeout=5)
    assert manifest_response.headers.get_content_type() in {"application/manifest+json", "application/json", "text/plain"}
    public_checked=[]
    for rel in ["bn/", "en/", "bn/contact/", "en/features/anonymous-sharing/", "bn/topics/relationship/", "sitemap.xml", "robots.txt"]:
        response=urlopen(urljoin(base,rel),timeout=5)
        body=response.read()
        assert response.status==200 and body, rel
        public_checked.append(rel)
    try:
        urlopen(urljoin(base,"not-a-real-page"),timeout=5)
        raise AssertionError("Unknown URL unexpectedly returned 200")
    except Exception as error:
        if getattr(error,"code",404)!=404: raise
    print(f"PASS - local HTTP root, {len(checked)} runtime resources and {len(public_checked)} public/SEO resources returned expected statuses")
finally:
    server.shutdown()
    server.server_close()
    os.chdir(old_cwd)
