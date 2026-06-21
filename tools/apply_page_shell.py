#!/usr/bin/env python3
"""Apply unified homepage shell to calculator subpages (stdlib only)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOOLS = Path(__file__).resolve().parent

CATEGORY_LABELS = {
    'financial': 'Financial',
    'health': 'Health & Fitness',
    'math': 'Math',
    'time': 'Time & Date',
    'construction': 'Construction',
    'utilities': 'Utilities',
    'site': 'Site',
}

CATEGORY_ANCHORS = {
    'financial': 'index.html#financial',
    'health': 'index.html#health',
    'math': 'index.html#math',
    'time': 'index.html#time',
    'construction': 'index.html#construction',
    'utilities': 'index.html#utilities',
    'site': 'index.html',
}

NAV_ITEMS = [
    ('index.html', 'Home', None),
    ('index.html#financial', 'Financial', 'financial'),
    ('index.html#health', 'Health', 'health'),
    ('index.html#math', 'Math', 'math'),
    ('index.html#time', 'Time', 'time'),
    ('index.html#construction', 'Construction', 'construction'),
    ('index.html#utilities', 'Utilities', 'utilities'),
]

FOOTER_COLUMNS = [
    ('Financial', [
        ('mortgage-calculator.html', 'Mortgage'),
        ('loan-calculator.html', 'Loan'),
        ('investment-calculator.html', 'Investment'),
        ('retirement-calculator.html', 'Retirement'),
    ]),
    ('Health', [
        ('bmi-calculator.html', 'BMI'),
        ('calorie-calculator.html', 'Calorie'),
        ('body-fat-calculator.html', 'Body Fat'),
        ('pregnancy-calculator.html', 'Pregnancy'),
    ]),
    ('Math', [
        ('scientific-calculator.html', 'Scientific'),
        ('percentage-calculator.html', 'Percentage'),
        ('fraction-calculator.html', 'Fraction'),
        ('standard-deviation-calculator.html', 'Statistics'),
    ]),
    ('Construction', [
        ('concrete-calculator.html', 'Concrete'),
        ('paint-calculator.html', 'Paint'),
        ('roof-calculator.html', 'Roof'),
        ('square-footage-calculator.html', 'Square Footage'),
    ]),
]

HEADER_RE = re.compile(r'<header class="header">[\s\S]*?</header>', re.I)
FOOTER_RE = re.compile(r'<footer class="footer">[\s\S]*?</footer>', re.I)
HERO_RE = re.compile(r'<section class="hero">[\s\S]*?</section>', re.I)
BODY_RE = re.compile(r'(<body)([^>]*)(>)', re.I)


def load_maps():
    with open(TOOLS / 'category_map.json', encoding='utf-8') as f:
        raw = json.load(f)
    file_to_cat = {name: cat for cat, names in raw.items() for name in names}
    with open(TOOLS / 'related_tools.json', encoding='utf-8') as f:
        related = json.load(f)
    return file_to_cat, related


def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()


def extract_hero_info(content):
    hero = HERO_RE.search(content)
    title, desc = '', ''
    if hero:
        block = hero.group(0)
        h1 = re.search(r'<h1[^>]*>([\s\S]*?)</h1>', block, re.I)
        p = re.search(r'<p[^>]*>([\s\S]*?)</p>', block, re.I)
        if h1:
            title = clean_text(re.sub(r'<[^>]+>', '', h1.group(1)))
        if p:
            desc = clean_text(re.sub(r'<[^>]+>', '', p.group(1)))
    if not title:
        t = re.search(r'<title[^>]*>([\s\S]*?)</title>', content, re.I)
        if t:
            title = clean_text(re.sub(r'<[^>]+>', '', t.group(1))).split('|')[0].strip()
    return title, desc


def build_header(active_cat):
    links = []
    for href, label, cat_key in NAV_ITEMS:
        is_active = (cat_key == active_cat) or (cat_key is None and active_cat is None and href == 'index.html')
        cls = 'nav-link active' if is_active else 'nav-link'
        links.append(f'                <a class="{cls}" href="{href}">{label}</a>')
    nav = '\n'.join(links)
    return f'''<header class="header">
        <div class="container">
            <a class="logo" href="index.html">
                <span class="logo-icon"><i class="fas fa-calculator"></i></span>
                <span>Calculator<span class="logo-domain">Free</span>.Online</span>
            </a>
            <nav class="nav-menu" id="mainNavigation">
{nav}
            </nav>
            <div class="header-actions">
                <a href="sitemap.html" class="btn-browse"><i class="fas fa-th-large"></i> <span>Browse all</span></a>
                <button class="mobile-menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="mainNavigation"><i class="fas fa-bars"></i></button>
            </div>
        </div>
    </header>'''


def build_page_hero(category, page_title, description):
    cat_label = CATEGORY_LABELS.get(category, 'Tools')
    cat_href = CATEGORY_ANCHORS.get(category, 'index.html')
    desc = description or f'Free online {page_title.lower()} with instant, accurate results.'
    return f'''<section class="page-hero">
        <div class="container">
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <a href="index.html">Home</a>
                <span class="sep">/</span>
                <a href="{cat_href}">{cat_label}</a>
                <span class="sep">/</span>
                <span class="current">{page_title}</span>
            </nav>
            <h1>{page_title}</h1>
            <p>{desc}</p>
        </div>
    </section>'''


def build_related(category, current_file, related_map):
    items = related_map.get(category, related_map.get('utilities', []))
    links = []
    for item in items:
        if item['href'] == current_file:
            continue
        links.append(
            f'                <a class="related-link" href="{item["href"]}">'
            f'<i class="fas fa-arrow-right"></i> {item["label"]}</a>'
        )
        if len(links) >= 4:
            break
    if not links:
        return ''
    return '<section class="related-tools">\n        <div class="container">\n            <h2>Related calculators</h2>\n            <div class="related-links">\n' + '\n'.join(links) + '\n            </div>\n        </div>\n    </section>'


def build_footer():
    cols = []
    for title, items in FOOTER_COLUMNS:
        lis = '\n                        '.join(f'<li><a href="{h}">{l}</a></li>' for h, l in items)
        cols.append(f'''                <div class="footer-section">
                    <h4>{title}</h4>
                    <ul>
                        {lis}
                    </ul>
                </div>''')
    cols_html = '\n'.join(cols)
    return f'''<footer class="footer">
        <div class="container">
            <div class="footer-brand">
                <div>
                    <a class="logo" href="index.html">
                        <span class="logo-icon"><i class="fas fa-calculator"></i></span>
                        <span>Calculator<span class="logo-domain">Free</span>.Online</span>
                    </a>
                    <p class="footer-tagline">Free professional calculators — fast, accurate, no signup required.</p>
                </div>
                <div class="footer-quick">
                    <a href="sitemap.html">All Calculators</a>
                    <a href="index.html">Home</a>
                    <a href="copyright.html">About</a>
                </div>
            </div>
            <div class="footer-links-row footer-content">
{cols_html}
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 CalculatorFree.Online · Designed by <strong>Long Thái Bảo</strong></p>
            </div>
        </div>
    </footer>'''


def ensure_head(content):
    if 'page.css' not in content:
        content = content.replace(
            'href="assets/css/styles.css"',
            'href="assets/css/styles.css"/>\n  <link href="assets/css/page.css" rel="stylesheet"',
            1,
        )
        content = content.replace(
            "href='assets/css/styles.css'",
            "href='assets/css/styles.css'>\n  <link href='assets/css/page.css' rel='stylesheet'",
            1,
        )
    if 'Plus+Jakarta+Sans' not in content:
        insert = '  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>\n'
        content = re.sub(r'(</head>)', insert + r'\1', content, count=1, flags=re.I)
    return content


def ensure_scripts(content):
    if 'pwa-lite.js' not in content:
        content = re.sub(
            r'(</body>)',
            '  <script src="assets/js/pwa-lite.js"></script>\n\\1',
            content,
            count=1,
            flags=re.I,
        )
    if 'nav.js' not in content:
        content = re.sub(
            r'(</body>)',
            '  <script src="assets/js/nav.js"></script>\n\\1',
            content,
            count=1,
            flags=re.I,
        )
    content = re.sub(
        r'<div class="mobile-menu-toggle">[\s\S]*?</div>',
        '',
        content,
    )
    return content


def apply_shell(path, file_to_cat, related_map):
    content = path.read_text(encoding='utf-8', errors='ignore')
    filename = path.name
    category = file_to_cat.get(filename, 'utilities')
    active_cat = None if filename in ('sitemap.html', 'copyright.html') else category

    title, desc = extract_hero_info(content)
    header = build_header(active_cat)
    hero = build_page_hero(category, title, desc)
    footer = build_footer()
    related = build_related(category, filename, related_map)

    if HEADER_RE.search(content):
        content = HEADER_RE.sub(header, content, count=1)
    else:
        content = re.sub(r'(<body[^>]*>)', r'\1\n' + header, content, count=1, flags=re.I)

    if HERO_RE.search(content):
        content = HERO_RE.sub(hero, content, count=1)
    else:
        content = re.sub(r'(<main[^>]*>)', r'\1\n' + hero, content, count=1, flags=re.I)

    if 'related-tools' not in content and related:
        if FOOTER_RE.search(content):
            content = FOOTER_RE.sub(related + '\n' + footer, content, count=1)
        else:
            content = content + related + footer
    elif FOOTER_RE.search(content):
        content = FOOTER_RE.sub(footer, content, count=1)

    body_class = f'page-calculator page-calculator--{category}'
    content = BODY_RE.sub(rf'\1 class="{body_class}"\3', content, count=1)

    content = ensure_head(content)
    content = ensure_scripts(content)

    path.write_text(content, encoding='utf-8')
    return category


def main():
    file_to_cat, related_map = load_maps()
    updated = []
    errors = []
    for path in sorted(ROOT.glob('*.html')):
        if path.name == 'index.html':
            continue
        try:
            cat = apply_shell(path, file_to_cat, related_map)
            updated.append((path.name, cat))
        except Exception as exc:
            errors.append((path.name, str(exc)))

    print(f'Updated: {len(updated)} pages')
    if errors:
        print(f'Errors: {len(errors)}')
        for n, e in errors:
            print(f'  {n}: {e}')


if __name__ == '__main__':
    main()
