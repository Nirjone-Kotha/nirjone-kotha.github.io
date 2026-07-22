#!/usr/bin/env python3
"""Generate crawlable bilingual public pages, metadata, JSON-LD and sitemaps.

Uses only Python standard library so the project remains Node-free.
Run from the project root:
    py tools/generate_static_site.py
For production, first set environment=production and baseUrl=https://your-domain in config/site.json.
"""
from __future__ import annotations
from pathlib import Path
from datetime import date
from html import escape
from urllib.parse import urljoin
import argparse, json, re, shutil, sys

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "config/site.json"
CONTENT_PATH = ROOT / "content/seo-pages.json"
TODAY = date.today().isoformat()

PUBLIC_KEYS = {
    "home", "about", "contact", "privacy", "terms", "community-guidelines",
    "safety", "cookie-policy", "data-deletion", "resources",
    "feature-anonymous-sharing", "feature-mood-check-in", "feature-support-circles",
    "feature-calm-room", "feature-supportive-community", "feature-privacy-and-safety",
    "topic-anxiety", "topic-loneliness", "topic-stress", "topic-relationship"
}

NAV = [
    ("home", {"en":"Home","bn":"হোম"}),
    ("about", {"en":"About","bn":"সম্পর্কে"}),
    ("resources", {"en":"Resources","bn":"রিসোর্স"}),
    ("community-guidelines", {"en":"Guidelines","bn":"নির্দেশিকা"}),
    ("safety", {"en":"Safety","bn":"নিরাপত্তা"}),
    ("contact", {"en":"Contact","bn":"যোগাযোগ"}),
]

FOOTER = [
    ("about", {"en":"About","bn":"সম্পর্কে"}),
    ("feature-anonymous-sharing", {"en":"Features","bn":"ফিচার"}),
    ("resources", {"en":"Resources","bn":"রিসোর্স"}),
    ("community-guidelines", {"en":"Community Guidelines","bn":"কমিউনিটি নির্দেশিকা"}),
    ("safety", {"en":"Safety","bn":"নিরাপত্তা"}),
    ("privacy", {"en":"Privacy","bn":"গোপনীয়তা"}),
    ("terms", {"en":"Terms","bn":"শর্ত"}),
    ("contact", {"en":"Contact","bn":"যোগাযোগ"}),
    ("cookie-policy", {"en":"Cookie Settings","bn":"কুকি সেটিংস"}),
    ("data-deletion", {"en":"Data Deletion","bn":"ডেটা মুছুন"}),
]

FEATURES = [
    "feature-anonymous-sharing", "feature-mood-check-in", "feature-support-circles",
    "feature-calm-room", "feature-supportive-community", "feature-privacy-and-safety"
]
TOPICS = ["topic-anxiety", "topic-loneliness", "topic-stress", "topic-relationship"]
LEGAL_DRAFT_KEYS = {"privacy", "terms", "cookie-policy", "data-deletion"}


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_base(value: str) -> str:
    value = str(value or "").strip().rstrip("/")
    return value if re.match(r"^https?://[^\s/]+", value, re.I) else ""


def path_for(page: dict, locale: str) -> str:
    tail = page["path"].strip("/")
    return f"/{locale}/{tail + '/' if tail else ''}"


def abs_url(base: str, path: str) -> str:
    return urljoin(base + "/", path.lstrip("/")) if base else path


def h(value: object) -> str:
    return escape(str(value), quote=True)


def json_script(data: dict) -> str:
    text = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    return text.replace("</", "<\\/")


def page_label(page: dict, locale: str) -> str:
    title = page[locale]["title"]
    return title.split(" — ")[0]


def contact_structured(config: dict, base: str) -> dict | None:
    contact = config.get("contact", {})
    email = str(contact.get("supportEmail", "")).strip()
    phone = re.sub(r"\D", "", str(contact.get("whatsappNumber", "")))
    facebook = str(contact.get("facebookPageUrl", "")).strip()
    if not any([email, phone, facebook]):
        return None
    organization = {
        "@type": "Organization",
        "@id": abs_url(base, "/#organization"),
        "name": config.get("siteName", "Moner Kotha"),
        "url": abs_url(base, "/"),
        "logo": abs_url(base, "/assets/brand/logo-mark.png")
    }
    if email:
        organization["email"] = email
    if phone:
        organization["telephone"] = f"+{phone}"
        organization["contactPoint"] = {
            "@type": "ContactPoint", "contactType": "customer support",
            "telephone": f"+{phone}", "availableLanguage": ["bn", "en"]
        }
    if facebook.startswith("https://"):
        organization["sameAs"] = [facebook]
    return organization


def metadata(config: dict, pages: dict, key: str, locale: str, base: str, production: bool) -> str:
    page = pages[key]
    other = "bn" if locale == "en" else "en"
    page_url = abs_url(base, path_for(page, locale))
    alternate_url = abs_url(base, path_for(page, other))
    x_default = abs_url(base, path_for(page, "en"))
    og_image = abs_url(base, config.get("defaultOgImage", "/assets/brand/share-cover.png"))
    locale_code = "bn_BD" if locale == "bn" else "en_GB"
    robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" if production else "noindex,follow"
    canonical = f'<link rel="canonical" href="{h(page_url)}">' if base else ""
    hreflangs = "" if not base else "\n".join([
        f'<link rel="alternate" hreflang="{locale}" href="{h(page_url)}">',
        f'<link rel="alternate" hreflang="{other}" href="{h(alternate_url)}">',
        f'<link rel="alternate" hreflang="x-default" href="{h(x_default)}">'
    ])
    verification = []
    analytics = config.get("analytics", {})
    if production and analytics.get("googleSiteVerification"):
        verification.append(f'<meta name="google-site-verification" content="{h(analytics["googleSiteVerification"])}">')
    if production and analytics.get("bingSiteVerification"):
        verification.append(f'<meta name="msvalidate.01" content="{h(analytics["bingSiteVerification"])}">')
    return f"""
  <title>{h(page[locale]['title'])}</title>
  <meta name="description" content="{h(page[locale]['description'])}">
  <meta name="robots" content="{robots}">
  {canonical}
  {hreflangs}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="{h(config.get('siteName','Moner Kotha'))}">
  <meta property="og:title" content="{h(page[locale]['title'])}">
  <meta property="og:description" content="{h(page[locale]['description'])}">
  <meta property="og:url" content="{h(page_url)}">
  <meta property="og:image" content="{h(og_image)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="{locale_code}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{h(page[locale]['title'])}">
  <meta name="twitter:description" content="{h(page[locale]['description'])}">
  <meta name="twitter:image" content="{h(og_image)}">
  {' '.join(verification)}"""


def breadcrumb_data(config: dict, pages: dict, key: str, locale: str, base: str) -> tuple[list[tuple[str,str]], dict]:
    page = pages[key]
    crumbs = [("home", "হোম" if locale == "bn" else "Home")]
    if key != "home":
        if key.startswith("feature-"):
            crumbs.append(("feature-anonymous-sharing", "ফিচার" if locale == "bn" else "Features"))
        elif key.startswith("topic-"):
            crumbs.append(("resources", "বিষয়" if locale == "bn" else "Topics"))
        crumbs.append((key, page_label(page, locale)))
    items = []
    for pos,(crumb_key,label) in enumerate(crumbs,1):
        crumb_page = pages[crumb_key]
        items.append({"@type":"ListItem","position":pos,"name":label,"item":abs_url(base,path_for(crumb_page,locale))})
    return crumbs, {"@type":"BreadcrumbList","itemListElement":items}


def structured_data(config: dict, pages: dict, key: str, locale: str, base: str) -> str:
    page = pages[key]
    url = abs_url(base, path_for(page, locale))
    crumbs, breadcrumb = breadcrumb_data(config,pages,key,locale,base)
    page_type = page.get("type", "WebPage")
    website = {
        "@type":"WebSite", "@id":abs_url(base,"/#website"),
        "url":abs_url(base,"/"), "name":config.get("siteName","Moner Kotha"),
        "inLanguage":["bn","en"]
    }
    web_page = {
        "@type":page_type, "@id":url+"#webpage", "url":url,
        "name":page[locale]["title"], "description":page[locale]["description"],
        "inLanguage":locale, "isPartOf":{"@id":website["@id"]},
        "breadcrumb":{"@id":url+"#breadcrumb"},
        "dateModified":TODAY
    }
    breadcrumb["@id"] = url+"#breadcrumb"
    graph = [website, web_page, breadcrumb]
    organization = contact_structured(config,base)
    if organization:
        graph.append(organization)
        website["publisher"]={"@id":organization["@id"]}
    return json_script({"@context":"https://schema.org","@graph":graph})


def nav_html(pages: dict, locale: str) -> str:
    links=[]
    for key,labels in NAV:
        links.append(f'<a href="{h(path_for(pages[key],locale))}">{h(labels[locale])}</a>')
    return "".join(links)


def language_link(pages: dict, key: str, locale: str) -> str:
    other = "bn" if locale == "en" else "en"
    label = "বাংলা" if other == "bn" else "English"
    return f'<a class="public-button" href="{h(path_for(pages[key],other))}" hreflang="{other}" lang="{other}">{label}</a>'


def breadcrumbs_html(pages: dict,key: str,locale: str) -> str:
    crumbs,_=breadcrumb_data({},pages,key,locale,"")
    values=[]
    for idx,(crumb_key,label) in enumerate(crumbs):
        if idx == len(crumbs)-1:
            values.append(f'<span aria-current="page">{h(label)}</span>')
        else:
            values.append(f'<a href="{h(path_for(pages[crumb_key],locale))}">{h(label)}</a><span aria-hidden="true">/</span>')
    return "".join(values)


def contact_cards(config: dict, locale: str) -> str:
    title = "শিগগির যোগ হবে" if locale == "bn" else "Coming soon"
    contact = config.get("contact", {})
    facebook = str(contact.get("facebookPageUrl", "")).strip()
    email = str(contact.get("supportEmail", "")).strip()
    whatsapp = re.sub(r"\D", "", str(contact.get("whatsappNumber", "")))
    message = str(contact.get("whatsappPrefilledMessage", "")).strip()
    from urllib.parse import quote
    options = [
        ("f","Facebook Page", "প্ল্যাটফর্মের আপডেট ও সাধারণ যোগাযোগ" if locale=="bn" else "Platform updates and general enquiries", facebook if facebook.startswith("https://") else "", True),
        ("@","ইমেইল সাপোর্ট" if locale=="bn" else "Email support", "প্রযুক্তিগত, গোপনীয়তা বা অ্যাকাউন্ট প্রশ্ন" if locale=="bn" else "Technical, privacy or account questions", f"mailto:{email}" if re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email) else "", False),
        ("⌁","WhatsApp", "প্ল্যাটফর্ম-সংক্রান্ত সহায়তার বার্তা" if locale=="bn" else "Message the platform support team", f"https://wa.me/{whatsapp}{'?text='+quote(message) if message else ''}" if 8 <= len(whatsapp) <= 15 else "", True)
    ]
    cards=[]
    for icon,label,desc,href,external in options:
        content=f'<span class="public-contact-icon" aria-hidden="true">{icon}</span><span><strong>{h(label)}</strong><small>{h(desc)}</small></span><em>{"↗" if href else h(title)}</em>'
        if href:
            attrs=' target="_blank" rel="noopener noreferrer"' if external else ''
            cards.append(f'<a class="public-contact-card" href="{h(href)}" aria-label="{h(label)}"{attrs}>{content}</a>')
        else:
            cards.append(f'<div class="public-contact-card is-disabled" aria-disabled="true">{content}</div>')
    return "".join(cards)


def render_page(config: dict, pages: dict, key: str, locale: str, base: str, production: bool) -> str:
    page=pages[key]
    data=page[locale]
    skip="মূল কনটেন্টে যান" if locale=="bn" else "Skip to main content"
    app_label="অ্যাপ খুলুন" if locale=="bn" else "Open app"
    theme_label="থিম বদলান" if locale=="bn" else "Change theme"
    related_label="সম্পর্কিত পেজ" if locale=="bn" else "Related pages"
    faq_label="সাধারণ প্রশ্ন" if locale=="bn" else "Frequently asked questions"
    draft_notice = ""
    if key in LEGAL_DRAFT_KEYS:
        draft_notice = f'<div class="draft-notice" role="note">{h("এটি চালুর আগের সম্পাদনাযোগ্য খসড়া; চূড়ান্ত আইনগত পর্যালোচনা প্রয়োজন।" if locale=="bn" else "Editable pre-launch draft: owner and legal review are still required.")}</div>'
    sections="".join(f'<section class="public-section"><h2>{h(section["heading"])}</h2><p>{h(section["body"])}</p></section>' for section in data["sections"])
    faqs="".join(f'<details class="faq-item"><summary>{h(item["question"])}</summary><p>{h(item["answer"])}</p></details>' for item in data["faqs"])
    related=[]
    for related_key in page.get("related",[]):
        if related_key in pages:
            related.append(f'<a href="{h(path_for(pages[related_key],locale))}">{h(page_label(pages[related_key],locale))}</a>')
    contact_section=""
    if key=="contact":
        contact_section=f'<section class="public-card"><h2>{h("যোগাযোগের মাধ্যম" if locale=="bn" else "Contact options")}</h2><div class="public-contact-list" data-contact-list>{contact_cards(config, locale)}</div></section>'
    hero_art="" if key not in {"home","about"} else '<div class="public-hero-art"><img src="/assets/brand/logo-mark.png" srcset="/assets/brand/logo-mark.png 192w, /assets/brand/logo-mark.png 800w" sizes="(max-width: 700px) 180px, 320px" width="800" height="800" alt="Moner Kotha logo" fetchpriority="high"></div>'
    hero_class="public-hero" if hero_art else "public-hero compact"
    intro_cta = f'<a class="public-button primary" href="/?lang={locale}">{h(app_label)}</a><a class="public-button" href="{h(path_for(pages["community-guidelines"],locale))}">{h("নিরাপদ ব্যবহার" if locale=="bn" else "Use safely")}</a>'
    footer_links="".join(f'<a href="{h(path_for(pages[k],locale))}">{h(labels[locale])}</a>' for k,labels in FOOTER)
    page_type=page.get("type","WebPage")
    return f'''<!doctype html>
<html lang="{locale}" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  {metadata(config,pages,key,locale,base,production)}
  <meta name="theme-color" content="#f4f8f7">
  <link rel="icon" href="/assets/icons/favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
  <link rel="stylesheet" href="/assets/css/public.css">
  <script type="application/ld+json">{structured_data(config,pages,key,locale,base)}</script>
</head>
<body data-page-type="{h(page_type)}">
<a class="skip-link" href="#main-content">{h(skip)}</a>
<header class="public-header">
  <div class="public-header-inner">
    <a class="public-brand" href="{h(path_for(pages['home'],locale))}" aria-label="Moner Kotha home"><img src="/assets/brand/logo-mark.png" width="192" height="192" alt=""><span>Moner Kotha</span></a>
    <nav class="public-nav" aria-label="{'প্রধান নেভিগেশন' if locale=='bn' else 'Primary navigation'}">{nav_html(pages,locale)}</nav>
    <div class="public-actions"><button class="public-icon-button" data-public-action="theme" aria-label="{h(theme_label)}">◐</button>{language_link(pages,key,locale)}<a class="public-button primary" href="/?lang={locale}">{h(app_label)}</a></div>
  </div>
</header>
<main class="public-main" id="main-content">
  <nav class="breadcrumbs" aria-label="Breadcrumb">{breadcrumbs_html(pages,key,locale)}</nav>
  <section class="{hero_class}">
    <div><span class="public-eyebrow">Moner Kotha</span><h1>{h(data['title'].split(' — ')[0])}</h1><p>{h(data['intro'])}</p><div class="public-cta-row">{intro_cta}</div></div>
    {hero_art}
  </section>
  {draft_notice}
  <div class="public-layout">
    <article class="public-article">{sections}<section class="public-section"><h2>{h(faq_label)}</h2><div class="faq-list">{faqs}</div></section></article>
    <aside class="public-side">{contact_section}<section class="public-card"><h2>{h(related_label)}</h2>{''.join(related)}</section><section class="public-card"><h2>{h('মনে রাখুন' if locale=='bn' else 'Please remember')}</h2><p>{h('এটি সহমর্মিতাভিত্তিক সামাজিক সহায়তার জায়গা; চিকিৎসা, রোগ নির্ণয় বা জরুরি সেবা নয়।' if locale=='bn' else 'This is a peer-support space, not medical diagnosis, treatment or an emergency service.')}</p></section></aside>
  </div>
</main>
<footer class="public-footer"><div class="public-footer-inner"><div><a class="public-brand" href="{h(path_for(pages['home'],locale))}"><img src="/assets/brand/logo-mark.png" width="192" height="192" alt=""><span>Moner Kotha</span></a><p>{h('বলুন। কেউ শুনছে।' if locale=='bn' else 'Speak. Someone is listening.')}</p><small>© {date.today().year} Moner Kotha</small></div><div class="public-footer-links">{footer_links}</div><div><h3>{h('যোগাযোগ' if locale=='bn' else 'Contact')}</h3><div class="public-contact-list" data-contact-list>{contact_cards(config, locale)}</div></div></div></footer>
<dialog id="cookieDialog"><div class="cookie-dialog-inner"><h2>{h('কুকি পছন্দ' if locale=='bn' else 'Cookie choices')}</h2><p>{h('প্রয়োজনীয় স্টোরেজ সবসময় চালু। ঐচ্ছিক analytics ও advertising defaultভাবে বন্ধ।' if locale=='bn' else 'Essential storage is always active. Optional analytics and advertising are off by default.')}</p><label class="cookie-option"><span><strong>{h('Analytics' if locale=='en' else 'অ্যানালিটিক্স')}</strong><small>{h('শুধু সাধারণ page ও performance তথ্য; আবেগের লেখা নয়।' if locale=='bn' else 'Generic page and performance data only; never emotional text.')}</small></span><input id="analyticsConsent" type="checkbox"></label><label class="cookie-option"><span><strong>{h('Advertising' if locale=='en' else 'বিজ্ঞাপন')}</strong><small>{h('বর্তমানে provider নেই; ভবিষ্যতের non-personalized বিজ্ঞাপনের পছন্দ।' if locale=='bn' else 'No provider is configured; this is for future non-personalized ads.')}</small></span><input id="adsConsent" type="checkbox"></label><div class="cookie-actions"><button class="public-button" data-public-action="close-cookie-settings">{h('বাতিল' if locale=='bn' else 'Cancel')}</button><button class="public-button primary" data-public-action="save-cookie-settings">{h('সংরক্ষণ করুন' if locale=='bn' else 'Save choices')}</button></div></div></dialog>
<button class="public-button" style="position:fixed;right:14px;bottom:14px;z-index:30" data-public-action="cookie-settings">{h('কুকি সেটিংস' if locale=='bn' else 'Cookie settings')}</button>
<script type="module" src="/assets/js/public.js"></script>
</body></html>'''


def write_page(root: Path, page: dict, locale: str, html: str) -> Path:
    target = root / locale / page["path"] / "index.html" if page["path"] else root / locale / "index.html"
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(html,encoding="utf-8")
    return target


def urlset(urls: list[tuple[str,str]]) -> str:
    body="".join(f"  <url><loc>{h(url)}</loc><lastmod>{lastmod}</lastmod></url>\n" for url,lastmod in urls)
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}</urlset>\n'


def generate_sitemaps(base: str, pages: dict, production: bool) -> None:
    groups={"pages":[],"features":[],"resources":[],"topics":[]}
    for key,page in pages.items():
        if key not in PUBLIC_KEYS: continue
        group="features" if key.startswith("feature-") else "topics" if key.startswith("topic-") else "resources" if key=="resources" else "pages"
        for locale in ("bn","en"):
            groups[group].append((abs_url(base,path_for(page,locale)),TODAY))
    for group,urls in groups.items():
        (ROOT/f"sitemap-{group}.xml").write_text(urlset(urls),encoding="utf-8")
    if base:
        body="".join(f"  <sitemap><loc>{h(abs_url(base,f'/sitemap-{group}.xml'))}</loc><lastmod>{TODAY}</lastmod></sitemap>\n" for group in groups)
        index=f'<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}</sitemapindex>\n'
        (ROOT/"sitemap-index.xml").write_text(index,encoding="utf-8")
        (ROOT/"sitemap.xml").write_text(index,encoding="utf-8")
    else:
        empty=urlset([])
        (ROOT/"sitemap-index.xml").write_text(empty,encoding="utf-8")
        (ROOT/"sitemap.xml").write_text(empty,encoding="utf-8")


def generate_robots(base: str, production: bool) -> None:
    if production and base:
        text=f"""User-agent: *
Allow: /
Disallow: /api/
Disallow: /profile/
Disallow: /settings/
Disallow: /search/
Disallow: /draft/
Disallow: /messages/
Sitemap: {abs_url(base,'/sitemap.xml')}
"""
    else:
        text="User-agent: *\nDisallow: /\n# Development build: enable production crawling only after setting config/site.json.\n"
    (ROOT/"robots.txt").write_text(text,encoding="utf-8")


def generate_404(config: dict,pages:dict) -> None:
    body='''<!doctype html><html lang="bn"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>পৃষ্ঠা পাওয়া যায়নি — Page not found</title><link rel="stylesheet" href="/assets/css/public.css"></head><body><main class="public-main" id="main-content"><section class="public-hero compact"><div><span class="public-eyebrow">404</span><h1>পৃষ্ঠা পাওয়া যায়নি</h1><p>The page you requested could not be found. ঠিকানাটি পরীক্ষা করুন অথবা হোমে ফিরে যান।</p><div class="public-cta-row"><a class="public-button primary" href="/bn/">বাংলা হোম</a><a class="public-button" href="/en/">English home</a><a class="public-button" href="/">অ্যাপ খুলুন / Open app</a></div></div></section></main></body></html>'''
    (ROOT/"404.html").write_text(body,encoding="utf-8")


def main() -> int:
    parser=argparse.ArgumentParser()
    parser.add_argument("--base-url",default="",help="Override config base URL for this generation")
    parser.add_argument("--production",action="store_true",help="Generate indexable production metadata")
    args=parser.parse_args()
    config=read_json(CONFIG_PATH)
    content=read_json(CONTENT_PATH)
    pages=content["pages"]
    missing=PUBLIC_KEYS-set(pages)
    if missing:
        raise SystemExit(f"Missing page content: {sorted(missing)}")
    base=normalize_base(args.base_url or config.get("baseUrl",""))
    production=bool(args.production or config.get("environment")=="production")
    if production and not base:
        raise SystemExit("Production generation requires a valid https:// baseUrl in config/site.json or --base-url.")
    if production and not base.startswith("https://"):
        raise SystemExit("Production baseUrl must use HTTPS.")
    generated=[]
    for key in sorted(PUBLIC_KEYS):
        page=pages[key]
        for locale in ("bn","en"):
            generated.append(write_page(ROOT,page,locale,render_page(config,pages,key,locale,base,production)))
    generate_sitemaps(base,pages,production)
    generate_robots(base,production)
    generate_404(config,pages)
    report={"generatedAt":TODAY,"environment":"production" if production else "development","baseUrl":base,"pages":len(generated),"routes":["/"+str(p.relative_to(ROOT).parent).replace('\\','/')+"/" for p in generated]}
    (ROOT/"docs/GENERATED_ROUTES.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"Generated {len(generated)} localized HTML pages ({'production' if production else 'development'} mode).")
    return 0

if __name__=="__main__":
    raise SystemExit(main())
