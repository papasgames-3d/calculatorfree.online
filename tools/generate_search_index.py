#!/usr/bin/env python3
"""Generate assets/js/search-index.js from category_map.json and page titles."""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOOLS = Path(__file__).resolve().parent

CATEGORY_LABELS = {
    'financial': 'Financial',
    'health': 'Health',
    'math': 'Math',
    'time': 'Time',
    'construction': 'Construction',
    'utilities': 'Utilities',
}


def label_from_file(path: Path) -> str:
    text = path.read_text(encoding='utf-8', errors='ignore')
    match = re.search(r'<title>([^<]+)</title>', text, re.I)
    if match:
        title = html.unescape(match.group(1).strip())
        title = re.sub(r'\s*[\|–-]\s*CalculatorFree\.Online.*$', '', title, flags=re.I)
        title = re.sub(r'\s*[\|–-]\s*Free Online.*$', '', title, flags=re.I)
        return title.strip()
    return path.stem.replace('-', ' ').title()


def main():
    with open(TOOLS / 'category_map.json', encoding='utf-8') as f:
        cat_map = json.load(f)

    items = []
    seen = set()
    for cat, files in cat_map.items():
        if cat == 'site':
            continue
        for fn in files:
            if fn in seen:
                continue
            path = ROOT / fn
            if not path.exists():
                continue
            seen.add(fn)
            items.append({
                'label': label_from_file(path),
                'href': fn,
                'category': CATEGORY_LABELS.get(cat, cat.title()),
                'keywords': fn.replace('.html', '').replace('-', ' '),
            })

    items.sort(key=lambda x: x['label'].lower())
    out = ROOT / 'assets' / 'js' / 'search-index.js'
    out.write_text(
        'window.CALCULATOR_SEARCH_INDEX = '
        + json.dumps(items, ensure_ascii=False, indent=2)
        + ';\n',
        encoding='utf-8',
    )
    print(f'Wrote {len(items)} entries to {out.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
