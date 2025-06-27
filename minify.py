import os
import re
import csscompressor
import jsmin

def minify_css(content):
    # Remove comments
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    # Remove whitespace
    content = re.sub(r'\s+', ' ', content)
    content = re.sub(r';\s+', ';', content)
    content = re.sub(r'{\s+', '{', content)
    content = re.sub(r'}\s+', '}', content)
    content = re.sub(r',\s+', ',', content)
    content = re.sub(r':\s+', ':', content)
    content = re.sub(r'\s+}', '}', content)
    content = re.sub(r'}\s+', '}', content)
    content = content.strip()
    return content

def minify_js(content):
    # Remove comments
    content = re.sub(r'//.*?\n', '\n', content)
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    # Remove whitespace
    content = re.sub(r'\s+', ' ', content)
    content = re.sub(r';\s+', ';', content)
    content = re.sub(r'{\s+', '{', content)
    content = re.sub(r'}\s+', '}', content)
    content = re.sub(r',\s+', ',', content)
    content = re.sub(r':\s+', ':', content)
    content = re.sub(r'\s+}', '}', content)
    content = re.sub(r'}\s+', '}', content)
    content = content.strip()
    return content

def process_file(file_path, is_css=True):
    # Read original file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create minified version
    minified = minify_css(content) if is_css else minify_js(content)
    
    # Save minified version
    min_path = file_path.replace('.css', '.min.css') if is_css else file_path.replace('.js', '.min.js')
    with open(min_path, 'w', encoding='utf-8') as f:
        f.write(minified)
    
    print(f"Minified {file_path} -> {min_path}")
    original_size = len(content)
    minified_size = len(minified)
    reduction = ((original_size - minified_size) / original_size) * 100
    print(f"Size reduction: {reduction:.1f}%")

def main():
    # Process CSS files
    if os.path.exists('styles.css'):
        process_file('styles.css', is_css=True)
    
    # Process JS files
    if os.path.exists('script.js'):
        process_file('script.js', is_css=False)

if __name__ == "__main__":
    main() 