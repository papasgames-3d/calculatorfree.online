#!/usr/bin/env python3
"""Generate PWA icons for CalculatorFree.Online"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICON_DIR = os.path.join(ROOT, 'assets', 'icons')

SIZES = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512]
SHORTCUTS = {
    'finance-icon.png': ('$', '#059669'),
    'health-icon.png': ('+', '#dc2626'),
    'math-icon.png': ('π', '#7c3aed'),
}


def draw_icon(size, symbol='='):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    margin = max(2, size // 16)
    radius = size // 5
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=radius,
        fill=(79, 70, 229, 255),
    )
    inner = size // 6
    draw.rounded_rectangle(
        [inner * 2, inner * 2.2, size - inner * 2, size - inner * 1.8],
        radius=max(4, size // 20),
        fill=(30, 27, 75, 255),
    )

    font_size = max(10, size // 3)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', font_size)
    except OSError:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), symbol, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) // 2
    y = (size - th) // 2 - size // 20
    draw.text((x, y), symbol, fill=(255, 255, 255, 255), font=font)
    return img


def main():
    os.makedirs(ICON_DIR, exist_ok=True)
    for size in SIZES:
        path = os.path.join(ICON_DIR, f'icon-{size}x{size}.png')
        draw_icon(size).save(path, 'PNG')
        print(f'Created {path}')

    for name, (symbol, color) in SHORTCUTS.items():
        img = draw_icon(96, symbol)
        path = os.path.join(ICON_DIR, name)
        img.save(path, 'PNG')
        print(f'Created {path}')

    preview = draw_icon(512).convert('RGB')
    preview.save(os.path.join(ROOT, 'calculator-preview.jpg'), 'JPEG', quality=90)
    print('Created calculator-preview.jpg')


if __name__ == '__main__':
    main()
