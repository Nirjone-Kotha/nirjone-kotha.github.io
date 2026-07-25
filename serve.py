from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
os.chdir(Path(__file__).parent)
print("Moner Kotha: http://127.0.0.1:5500")
ThreadingHTTPServer(("127.0.0.1",5500),SimpleHTTPRequestHandler).serve_forever()
