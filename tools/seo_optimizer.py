import os
import re
from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def read_file_with_encoding(file_path):
    encodings = ['utf-8', 'utf-16', 'latin1', 'cp1252']
    
    for encoding in encodings:
        try:
            with open(file_path, 'r', encoding=encoding) as file:
                return file.read()
        except UnicodeDecodeError:
            continue
    
    # If no encoding works, try binary mode and detect encoding
    try:
        with open(file_path, 'rb') as file:
            raw = file.read()
            if raw.startswith(b'\xff\xfe') or raw.startswith(b'\xfe\xff'):
                # UTF-16 with BOM
                return raw.decode('utf-16')
            return raw.decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
        return None

def add_seo_tags(html_file):
    content = read_file_with_encoding(html_file)
    if not content:
        return
    
    soup = BeautifulSoup(content, 'html.parser')
    
    head = soup.find('head')
    if not head:
        return
    
    # Add robots meta if not exists
    if not soup.find('meta', attrs={'name': 'robots'}):
        robots_meta = soup.new_tag('meta')
        robots_meta['name'] = 'robots'
        robots_meta['content'] = 'index, follow'
        head.insert(2, robots_meta)
    
    # Add canonical link if not exists
    if not soup.find('link', attrs={'rel': 'canonical'}):
        canonical = soup.new_tag('link')
        canonical['rel'] = 'canonical'
        canonical['href'] = f"https://calculatorfree.online/{os.path.basename(html_file)}"
        head.insert(3, canonical)
    
    # Add preconnect links if not exist
    preconnect_links = [
        ('https://fonts.googleapis.com', False),
        ('https://fonts.gstatic.com', True),
        ('https://cdnjs.cloudflare.com', False)
    ]
    
    for url, crossorigin in preconnect_links:
        if not soup.find('link', attrs={'rel': 'preconnect', 'href': url}):
            preconnect = soup.new_tag('link')
            preconnect['rel'] = 'preconnect'
            preconnect['href'] = url
            if crossorigin:
                preconnect['crossorigin'] = ''
            head.insert(-1, preconnect)
    
    # Add Schema markup if not exists
    if not soup.find('script', attrs={'type': 'application/ld+json'}):
        # Get calculator name from title
        title = soup.find('title')
        calculator_name = title.string.split('-')[0].strip() if title else os.path.basename(html_file).replace('.html', '').replace('-', ' ').title()
        
        # Software Application Schema
        schema_app = {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": calculator_name,
            "applicationCategory": "CalculatorApplication",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "operatingSystem": "All",
            "description": f"Free online {calculator_name.lower()} with step-by-step calculations and detailed results."
        }
        
        # Breadcrumb Schema
        schema_breadcrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://calculatorfree.online/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Calculators",
                    "item": "https://calculatorfree.online/#calculators"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": calculator_name,
                    "item": f"https://calculatorfree.online/{os.path.basename(html_file)}"
                }
            ]
        }
        
        # Add schemas
        for schema in [schema_app, schema_breadcrumb]:
            schema_tag = soup.new_tag('script')
            schema_tag['type'] = 'application/ld+json'
            schema_tag.string = str(schema).replace("'", '"')
            head.append(schema_tag)
    
    # Save the changes
    try:
        with open(html_file, 'w', encoding='utf-8') as file:
            file.write(str(soup.prettify()))
        print(f"Successfully processed {html_file}")
    except Exception as e:
        print(f"Error saving {html_file}: {str(e)}")

def main():
    # Get all HTML files in current directory
    html_files = [
        f for f in os.listdir(ROOT)
        if f.endswith('.html') and f != 'index.html'
    ]

    for html_file in html_files:
        print(f"Processing {html_file}...")
        add_seo_tags(os.path.join(ROOT, html_file))

if __name__ == "__main__":
    main() 