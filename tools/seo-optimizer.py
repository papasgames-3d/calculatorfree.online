#!/usr/bin/env python3
"""
SEO Optimizer for Calculator Website
Automatically adds comprehensive SEO meta tags, schema markup, and optimizes HTML structure
"""

import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# SEO Templates
SEO_TEMPLATES = {
    "finance-calculator": {
        "title": "Finance Calculator - Loan, Investment, Interest & Savings Calculator | CalculatorFree.Online",
        "description": "All-in-one finance calculator: Calculate loans, compound interest, investment returns, savings goals, present value & mortgage payments. Free professional financial tools.",
        "keywords": "finance calculator, loan calculator, investment calculator, compound interest, savings calculator, financial planning, mortgage calculator",
        "category": "Financial Calculators"
    },
    "ip-subnet-calculator": {
        "title": "IP Subnet Calculator - CIDR, VLSM & Network Analysis Tool | CalculatorFree.Online", 
        "description": "Calculate IP subnets, CIDR blocks, VLSM planning, network addresses, subnet masks. Professional network engineering tool with binary view and examples.",
        "keywords": "IP subnet calculator, CIDR calculator, VLSM calculator, network calculator, subnet mask, IP address calculator",
        "category": "Network Tools"
    },
    "conversion-calculator": {
        "title": "Conversion Calculator - All Units: Length, Weight, Temperature & More | CalculatorFree.Online",
        "description": "Convert between all units: length, weight, temperature, volume, area, speed. Comprehensive unit conversion tool with 6 categories and swap functionality.",
        "keywords": "unit converter, conversion calculator, length converter, weight converter, temperature converter, metric converter",
        "category": "Utility Tools"
    },
    "standard-deviation-calculator": {
        "title": "Standard Deviation Calculator - Statistics, Mean, Variance Calculator | CalculatorFree.Online",
        "description": "Calculate standard deviation, variance, mean, median, mode, quartiles. Complete statistical analysis tool with population and sample calculations.",
        "keywords": "standard deviation calculator, statistics calculator, variance calculator, mean calculator, statistical analysis",
        "category": "Math Calculators"
    }
}

def generate_seo_meta_tags(page_name, page_config):
    """Generate comprehensive SEO meta tags"""
    url = f"https://calculatorfree.online/{page_name}.html"
    image_url = f"https://calculatorfree.online/{page_name}-preview.jpg"
    
    return f"""    <!-- Primary SEO Meta Tags -->
    <title>{page_config['title']}</title>
    <meta name="title" content="{page_config['title']}">
    <meta name="description" content="{page_config['description']}">
    <meta name="keywords" content="{page_config['keywords']}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="CalculatorFree.Online">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{url}">
    <meta property="og:title" content="{page_config['title']}">
    <meta property="og:description" content="{page_config['description']}">
    <meta property="og:image" content="{image_url}">
    <meta property="og:site_name" content="CalculatorFree.Online">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{url}">
    <meta property="twitter:title" content="{page_config['title']}">
    <meta property="twitter:description" content="{page_config['description']}">
    <meta property="twitter:image" content="{image_url}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{url}">"""

def generate_breadcrumb_schema(page_name, page_config):
    """Generate breadcrumb schema markup"""
    return f"""    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://calculatorfree.online/"
      }},{{
        "@type": "ListItem",
        "position": 2,
        "name": "{page_config['category']}",
        "item": "https://calculatorfree.online/#financial"
      }},{{
        "@type": "ListItem",
        "position": 3,
        "name": "{page_config['title'].split(' | ')[0]}",
        "item": "https://calculatorfree.online/{page_name}.html"
      }}]
    }}
    </script>"""

def generate_calculator_schema(page_name, page_config):
    """Generate calculator tool schema markup"""
    return f"""    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "{page_config['title'].split(' | ')[0]}",
      "applicationCategory": "UtilitiesApplication",
      "offers": {{
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }},
      "operatingSystem": "All",
      "description": "{page_config['description']}",
      "screenshot": "https://calculatorfree.online/{page_name}-screenshot.jpg",
      "url": "https://calculatorfree.online/{page_name}.html"
    }}
    </script>"""

def optimize_html_structure(content):
    """Optimize HTML structure for SEO"""
    # Add semantic HTML5 elements
    content = re.sub(r'<div class="container">\s*<h1', '<div class="container"><h1', content)
    
    # Add alt attributes to icons (if missing)
    content = re.sub(r'<i class="fas ([^"]*)">', r'<i class="fas \1" aria-hidden="true">', content)
    
    # Add title attributes to links
    content = re.sub(r'<a href="([^"]*)" class="([^"]*)">', r'<a href="\1" class="\2" title="', content)
    
    return content

def optimize_page(file_path):
    """Optimize a single HTML page for SEO"""
    page_name = Path(file_path).stem
    
    if page_name not in SEO_TEMPLATES:
        print(f"No SEO template for {page_name}, skipping...")
        return
    
    page_config = SEO_TEMPLATES[page_name]
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already optimized
        if 'property="og:title"' in content:
            print(f"{page_name} already optimized, skipping...")
            return
        
        # Find the head section
        head_pattern = r'(<head>.*?)(</head>)'
        head_match = re.search(head_pattern, content, re.DOTALL)
        
        if not head_match:
            print(f"Could not find head section in {page_name}")
            return
        
        # Extract current head content
        current_head = head_match.group(1)
        
        # Generate new SEO elements
        seo_meta = generate_seo_meta_tags(page_name, page_config)
        breadcrumb_schema = generate_breadcrumb_schema(page_name, page_config)
        calculator_schema = generate_calculator_schema(page_name, page_config)
        
        # Replace basic meta tags with optimized ones
        current_head = re.sub(r'<title>.*?</title>', '', current_head)
        current_head = re.sub(r'<meta name="description".*?>', '', current_head)
        
        # Add preconnect for performance
        preconnect_links = '''
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">'''
        
        # Build new head section
        new_head = current_head + '\n' + seo_meta + '\n' + preconnect_links + '\n' + breadcrumb_schema + '\n' + calculator_schema + '\n'
        
        # Replace head section
        new_content = re.sub(head_pattern, new_head + '</head>', content, flags=re.DOTALL)
        
        # Optimize HTML structure
        new_content = optimize_html_structure(new_content)
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Optimized {page_name}")
        
    except Exception as e:
        print(f"❌ Error optimizing {page_name}: {str(e)}")

def main():
    """Main function to optimize all pages"""
    print("🚀 Starting SEO Optimization...")
    
    # Get all HTML files
    html_files = []
    for file_name in SEO_TEMPLATES.keys():
        file_path = ROOT / f"{file_name}.html"
        if file_path.exists():
            html_files.append(str(file_path))
    
    if not html_files:
        print("No HTML files found to optimize.")
        return
    
    print(f"Found {len(html_files)} files to optimize:")
    for file_path in html_files:
        print(f"  - {file_path}")
    
    # Optimize each file
    for file_path in html_files:
        optimize_page(file_path)
    
    print(f"\n🎉 SEO optimization complete! Optimized {len(html_files)} files.")
    print("\n📋 SEO Improvements Added:")
    print("  ✅ Comprehensive meta tags (title, description, keywords)")
    print("  ✅ Open Graph tags for social sharing")
    print("  ✅ Twitter Card tags")
    print("  ✅ Canonical URLs")
    print("  ✅ Schema.org structured data (Breadcrumb + SoftwareApplication)")
    print("  ✅ Performance optimization (preconnect)")
    print("  ✅ Accessibility improvements (aria-hidden, alt text)")

if __name__ == "__main__":
    main() 
"""
SEO Optimizer for Calculator Website
Automatically adds comprehensive SEO meta tags, schema markup, and optimizes HTML structure
"""

import os
import re
from pathlib import Path

# SEO Templates
SEO_TEMPLATES = {
    "finance-calculator": {
        "title": "Finance Calculator - Loan, Investment, Interest & Savings Calculator | CalculatorFree.Online",
        "description": "All-in-one finance calculator: Calculate loans, compound interest, investment returns, savings goals, present value & mortgage payments. Free professional financial tools.",
        "keywords": "finance calculator, loan calculator, investment calculator, compound interest, savings calculator, financial planning, mortgage calculator",
        "category": "Financial Calculators"
    },
    "ip-subnet-calculator": {
        "title": "IP Subnet Calculator - CIDR, VLSM & Network Analysis Tool | CalculatorFree.Online", 
        "description": "Calculate IP subnets, CIDR blocks, VLSM planning, network addresses, subnet masks. Professional network engineering tool with binary view and examples.",
        "keywords": "IP subnet calculator, CIDR calculator, VLSM calculator, network calculator, subnet mask, IP address calculator",
        "category": "Network Tools"
    },
    "conversion-calculator": {
        "title": "Conversion Calculator - All Units: Length, Weight, Temperature & More | CalculatorFree.Online",
        "description": "Convert between all units: length, weight, temperature, volume, area, speed. Comprehensive unit conversion tool with 6 categories and swap functionality.",
        "keywords": "unit converter, conversion calculator, length converter, weight converter, temperature converter, metric converter",
        "category": "Utility Tools"
    },
    "standard-deviation-calculator": {
        "title": "Standard Deviation Calculator - Statistics, Mean, Variance Calculator | CalculatorFree.Online",
        "description": "Calculate standard deviation, variance, mean, median, mode, quartiles. Complete statistical analysis tool with population and sample calculations.",
        "keywords": "standard deviation calculator, statistics calculator, variance calculator, mean calculator, statistical analysis",
        "category": "Math Calculators"
    }
}

def generate_seo_meta_tags(page_name, page_config):
    """Generate comprehensive SEO meta tags"""
    url = f"https://calculatorfree.online/{page_name}.html"
    image_url = f"https://calculatorfree.online/{page_name}-preview.jpg"
    
    return f"""    <!-- Primary SEO Meta Tags -->
    <title>{page_config['title']}</title>
    <meta name="title" content="{page_config['title']}">
    <meta name="description" content="{page_config['description']}">
    <meta name="keywords" content="{page_config['keywords']}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="CalculatorFree.Online">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{url}">
    <meta property="og:title" content="{page_config['title']}">
    <meta property="og:description" content="{page_config['description']}">
    <meta property="og:image" content="{image_url}">
    <meta property="og:site_name" content="CalculatorFree.Online">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{url}">
    <meta property="twitter:title" content="{page_config['title']}">
    <meta property="twitter:description" content="{page_config['description']}">
    <meta property="twitter:image" content="{image_url}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{url}">"""

def generate_breadcrumb_schema(page_name, page_config):
    """Generate breadcrumb schema markup"""
    return f"""    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://calculatorfree.online/"
      }},{{
        "@type": "ListItem",
        "position": 2,
        "name": "{page_config['category']}",
        "item": "https://calculatorfree.online/#financial"
      }},{{
        "@type": "ListItem",
        "position": 3,
        "name": "{page_config['title'].split(' | ')[0]}",
        "item": "https://calculatorfree.online/{page_name}.html"
      }}]
    }}
    </script>"""

def generate_calculator_schema(page_name, page_config):
    """Generate calculator tool schema markup"""
    return f"""    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "{page_config['title'].split(' | ')[0]}",
      "applicationCategory": "UtilitiesApplication",
      "offers": {{
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }},
      "operatingSystem": "All",
      "description": "{page_config['description']}",
      "screenshot": "https://calculatorfree.online/{page_name}-screenshot.jpg",
      "url": "https://calculatorfree.online/{page_name}.html"
    }}
    </script>"""

def optimize_html_structure(content):
    """Optimize HTML structure for SEO"""
    # Add semantic HTML5 elements
    content = re.sub(r'<div class="container">\s*<h1', '<div class="container"><h1', content)
    
    # Add alt attributes to icons (if missing)
    content = re.sub(r'<i class="fas ([^"]*)">', r'<i class="fas \1" aria-hidden="true">', content)
    
    # Add title attributes to links
    content = re.sub(r'<a href="([^"]*)" class="([^"]*)">', r'<a href="\1" class="\2" title="', content)
    
    return content

def optimize_page(file_path):
    """Optimize a single HTML page for SEO"""
    page_name = Path(file_path).stem
    
    if page_name not in SEO_TEMPLATES:
        print(f"No SEO template for {page_name}, skipping...")
        return
    
    page_config = SEO_TEMPLATES[page_name]
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already optimized
        if 'property="og:title"' in content:
            print(f"{page_name} already optimized, skipping...")
            return
        
        # Find the head section
        head_pattern = r'(<head>.*?)(</head>)'
        head_match = re.search(head_pattern, content, re.DOTALL)
        
        if not head_match:
            print(f"Could not find head section in {page_name}")
            return
        
        # Extract current head content
        current_head = head_match.group(1)
        
        # Generate new SEO elements
        seo_meta = generate_seo_meta_tags(page_name, page_config)
        breadcrumb_schema = generate_breadcrumb_schema(page_name, page_config)
        calculator_schema = generate_calculator_schema(page_name, page_config)
        
        # Replace basic meta tags with optimized ones
        current_head = re.sub(r'<title>.*?</title>', '', current_head)
        current_head = re.sub(r'<meta name="description".*?>', '', current_head)
        
        # Add preconnect for performance
        preconnect_links = '''
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">'''
        
        # Build new head section
        new_head = current_head + '\n' + seo_meta + '\n' + preconnect_links + '\n' + breadcrumb_schema + '\n' + calculator_schema + '\n'
        
        # Replace head section
        new_content = re.sub(head_pattern, new_head + '</head>', content, flags=re.DOTALL)
        
        # Optimize HTML structure
        new_content = optimize_html_structure(new_content)
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Optimized {page_name}")
        
    except Exception as e:
        print(f"❌ Error optimizing {page_name}: {str(e)}")

def main():
    """Main function to optimize all pages"""
    print("🚀 Starting SEO Optimization...")
    
    # Get all HTML files
    html_files = []
    for file_name in SEO_TEMPLATES.keys():
        file_path = ROOT / f"{file_name}.html"
        if file_path.exists():
            html_files.append(str(file_path))
    
    if not html_files:
        print("No HTML files found to optimize.")
        return
    
    print(f"Found {len(html_files)} files to optimize:")
    for file_path in html_files:
        print(f"  - {file_path}")
    
    # Optimize each file
    for file_path in html_files:
        optimize_page(file_path)
    
    print(f"\n🎉 SEO optimization complete! Optimized {len(html_files)} files.")
    print("\n📋 SEO Improvements Added:")
    print("  ✅ Comprehensive meta tags (title, description, keywords)")
    print("  ✅ Open Graph tags for social sharing")
    print("  ✅ Twitter Card tags")
    print("  ✅ Canonical URLs")
    print("  ✅ Schema.org structured data (Breadcrumb + SoftwareApplication)")
    print("  ✅ Performance optimization (preconnect)")
    print("  ✅ Accessibility improvements (aria-hidden, alt text)")

if __name__ == "__main__":
    main() 