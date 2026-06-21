import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CSS_PATH = os.path.join(ROOT, 'assets', 'css', 'styles.css')
JS_PATH = os.path.join(ROOT, 'assets', 'js', 'script.js')


def minify_css(content):
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    content = re.sub(r'\s+', ' ', content)
    content = re.sub(r';\s+', ';', content)
    content = re.sub(r'{\s+', '{', content)
    content = re.sub(r'}\s+', '}', content)
    content = re.sub(r',\s+', ',', content)
    content = re.sub(r':\s+', ':', content)
    content = re.sub(r'\s+}', '}', content)
    return content.strip()


def minify_js(content):
    content = re.sub(r'//.*?\n', '\n', content)
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    content = re.sub(r'\s+', ' ', content)
    content = re.sub(r';\s+', ';', content)
    content = re.sub(r'{\s+', '{', content)
    content = re.sub(r'}\s+', '}', content)
    content = re.sub(r',\s+', ',', content)
    content = re.sub(r':\s+', ':', content)
    content = re.sub(r'\s+}', '}', content)
    return content.strip()


def process_file(file_path, is_css=True):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    minified = minify_css(content) if is_css else minify_js(content)
    min_path = file_path.replace('.css', '.min.css') if is_css else file_path.replace('.js', '.min.js')

    with open(min_path, 'w', encoding='utf-8') as f:
        f.write(minified)

    print(f"Minified {file_path} -> {min_path}")
    reduction = ((len(content) - len(minified)) / len(content)) * 100
    print(f"Size reduction: {reduction:.1f}%")


def main():
    if os.path.exists(CSS_PATH):
        process_file(CSS_PATH, is_css=True)

    if os.path.exists(JS_PATH):
        process_file(JS_PATH, is_css=False)


if __name__ == "__main__":
    main()
