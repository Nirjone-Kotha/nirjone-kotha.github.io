from pathlib import Path
from html.parser import HTMLParser
import json, shutil, subprocess, tempfile, re, sys
ROOT=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory() as td:
    copy=Path(td)/'site'; shutil.copytree(ROOT,copy)
    subprocess.run([sys.executable,str(copy/'tools/generate_static_site.py'),'--base-url','https://monerkotha.example','--production'],cwd=copy,check=True,capture_output=True,text=True)
    routes=json.loads((copy/'docs/GENERATED_ROUTES.json').read_text())['routes']
    assert len(routes)==40
    titles=set(); descriptions=set()
    for route in routes:
        page=copy/route.lstrip('/')/'index.html'
        text=page.read_text(encoding='utf-8')
        title=re.search(r'<title>(.*?)</title>',text,re.S).group(1)
        desc=re.search(r'<meta name="description" content="([^"]+)"',text).group(1)
        assert title not in titles, title; titles.add(title)
        assert desc not in descriptions, desc; descriptions.add(desc)
        assert 'rel="canonical" href="https://monerkotha.example/' in text
        assert 'hreflang="bn"' in text and 'hreflang="en"' in text and 'hreflang="x-default"' in text
        assert 'name="robots" content="index,follow' in text
        blocks=re.findall(r'<script type="application/ld\+json">(.*?)</script>',text,re.S)
        assert blocks
        for block in blocks: json.loads(block)
        assert '<main ' in text and '<h1>' in text and '<footer ' in text
    robots=(copy/'robots.txt').read_text()
    assert 'Allow: /' in robots and 'Sitemap: https://monerkotha.example/sitemap.xml' in robots
    sitemap=(copy/'sitemap-pages.xml').read_text()
    assert 'https://monerkotha.example/bn/' in sitemap
    assert '/profile' not in sitemap and '/settings' not in sitemap
    production_files=[p for p in copy.rglob('*') if p.is_file() and 'tests' not in p.parts and p.stat().st_size<2_000_000]
    assert 'YOUR-DOMAIN' not in '\n'.join(p.read_text(encoding='utf-8',errors='ignore') for p in production_files)
print('PASS - production static generation, canonicals, hreflang, JSON-LD and sitemaps')
