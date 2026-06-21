#!/usr/bin/env python3
"""Bulk site updates: nav, PWA, cleanup inline mobile menu."""
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PWA_HEAD = '''  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#4f46e5">
  <link rel="apple-touch-icon" href="assets/icons/icon-192x192.png">'''

PWA_LITE_SCRIPT = '<script src="assets/js/pwa-lite.js"></script>'

CONSTRUCTION_NAV = '''     <a class="nav-link" href="INDEX#construction">
      Construction
     </a>
'''

CONSTRUCTION_NAV_INDEX = '                <a href="#construction" class="nav-link">Construction</a>\n'

UTILITIES_REPLACEMENTS = [
    ('Other Tools', 'Utilities'),
    ('#other', '#utilities'),
    ('index.html#other', 'index.html#utilities'),
]

INLINE_MENU_PATTERN = re.compile(
    r'\s*// Mobile menu toggle functionality[\s\S]*?'
    r'window\.addEventListener\(\'resize\'[\s\S]*?\}\);\s*\}\s*\}',
    re.MULTILINE,
)

MOBILE_MENU_BLOCK = re.compile(
    r'\s*// Mobile menu toggle functionality[\s\S]*?\}\);\s*\}\s*\}\s*\n',
    re.MULTILINE,
)


def add_construction_nav(content, is_index=False):
    if 'href="#construction"' in content or 'href="index.html#construction"' in content:
        return content

    if is_index:
        old = '<a href="#other" class="nav-link">Other Tools</a>'
        new = CONSTRUCTION_NAV_INDEX + '                <a href="#utilities" class="nav-link">Utilities</a>'
        if old in content:
            return content.replace(old, new)
        old2 = '<a href="#time" class="nav-link">Time & Date</a>\n                <a href="#other"'
        if old2 in content:
            return content.replace(
                '<a href="#other" class="nav-link">Other Tools</a>',
                '<a href="#construction" class="nav-link">Construction</a>\n                <a href="#utilities" class="nav-link">Utilities</a>'
            )
        return content

    # Calculator pages - insert before Other Tools nav link
    patterns = [
        (
            r'(<a class="nav-link"[^>]*href="index\.html#time"[^>]*>\s*Time[^<]*</a>\s*)'
            r'(<a class="nav-link"[^>]*href="index\.html#other")',
            r'\1<a class="nav-link" href="index.html#construction">\n      Construction\n     </a>\n     \2'.replace('INDEX', 'index.html'),
        ),
        (
            r'(<a class="nav-link" href="index\.html#math">\s*Math\s*</a>\s*)'
            r'(<a class="nav-link" href="index\.html#other")',
            r'\1<a class="nav-link" href="index.html#construction">\n      Construction\n     </a>\n     \2',
        ),
    ]
    for pat, repl in patterns:
        if re.search(pat, content, re.DOTALL):
            content = re.sub(pat, repl, content, count=1, flags=re.DOTALL)
            break

    content = content.replace('index.html#other', 'index.html#utilities')
    content = content.replace('>Other Tools<', '>Utilities<')
    return content


def add_pwa_head(content, name):
    if 'rel="manifest"' in content:
        return content
    if name == 'index.html':
        return content

    marker = 'assets/css/styles.css'
    if marker in content:
        return content.replace(
            f'href="{marker}" rel="stylesheet"/>' if f'href="{marker}" rel="stylesheet"/>' in content else f'href="{marker}" rel="stylesheet">',
            f'href="{marker}" rel="stylesheet"/>\n{PWA_HEAD}' if f'href="{marker}" rel="stylesheet"/>' in content else f'href="{marker}" rel="stylesheet">\n{PWA_HEAD}',
        )
    return content.replace('assets/css/styles.css', f'assets/css/styles.css">\n{PWA_HEAD}', 1) if 'assets/css/styles.css' in content else content


def add_pwa_lite(content, name):
    if name == 'index.html' or PWA_LITE_SCRIPT in content:
        return content
    if 'assets/js/nav.js' in content:
        return content.replace(
            '<script src="assets/js/nav.js"></script>',
            f'{PWA_LITE_SCRIPT}\n  <script src="assets/js/nav.js"></script>',
        )
    return content


def remove_inline_mobile_menu(content):
    content = MOBILE_MENU_BLOCK.sub('\n', content)
    content = INLINE_MENU_PATTERN.sub('', content)
    return content


def fix_logo_links(content):
    return content.replace('<div class="logo">', '<a class="logo" href="index.html">').replace(
        '</div>\n    <nav class="nav-menu">', '</a>\n    <nav class="nav-menu">', 1
    ) if '<a class="logo"' not in content and '<div class="logo">' in content else content


def main():
    stats = {'pwa_head': 0, 'pwa_lite': 0, 'nav': 0, 'menu_clean': 0, 'logo': 0}

    for html in ROOT.glob('*.html'):
        if html.name == 'index-seo.html':
            continue

        content = html.read_text(encoding='utf-8')
        original = content
        is_index = html.name == 'index.html'

        content = add_pwa_head(content, html.name)
        if content != original:
            stats['pwa_head'] += 1
            original = content

        content = add_construction_nav(content, is_index)
        if content != original:
            stats['nav'] += 1
            original = content

        for old, new in UTILITIES_REPLACEMENTS:
            if old in content and html.name != 'index.html':
                content = content.replace(old, new)
            elif is_index and old == 'Other Tools':
                content = content.replace('#other', '#utilities').replace('Other Tools', 'Utilities')

        content = remove_inline_mobile_menu(content)
        if 'mobileMenuToggle' not in content or content != original:
            stats['menu_clean'] += 1

        content = add_pwa_lite(content, html.name)
        if PWA_LITE_SCRIPT in content and html.name != 'index.html':
            stats['pwa_lite'] += 1

        if html.name != 'index.html':
            new_content = fix_logo_links(content)
            if new_content != content:
                stats['logo'] += 1
                content = new_content

        html.write_text(content, encoding='utf-8')

    print(stats)


if __name__ == '__main__':
    main()
