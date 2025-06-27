import os
from datetime import datetime
import xml.etree.ElementTree as ET
from xml.dom import minidom

def get_priority(filename):
    """Define priority based on calculator type"""
    high_priority = ['index', 'mortgage-calculator', 'bmi-calculator', 'loan-calculator']
    medium_priority = ['investment-calculator', 'retirement-calculator', 'scientific-calculator']
    
    name = filename.replace('.html', '')
    if name in high_priority:
        return '1.0'
    elif name in medium_priority:
        return '0.8'
    else:
        return '0.6'

def get_changefreq(filename):
    """Define change frequency based on calculator type"""
    daily = ['index']
    weekly = ['mortgage-calculator', 'loan-calculator', 'investment-calculator']
    
    name = filename.replace('.html', '')
    if name in daily:
        return 'daily'
    elif name in weekly:
        return 'weekly'
    else:
        return 'monthly'

def create_sitemap():
    # Create root element
    urlset = ET.Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    # Get all HTML files
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    # Add homepage first
    if 'index.html' in html_files:
        html_files.remove('index.html')
        html_files.insert(0, 'index.html')
    
    # Process each HTML file
    for html_file in html_files:
        url = ET.SubElement(urlset, 'url')
        
        # Add location
        loc = ET.SubElement(url, 'loc')
        loc.text = f'https://calculatorfree.online/{html_file}'
        
        # Add last modified date
        lastmod = ET.SubElement(url, 'lastmod')
        lastmod.text = current_date
        
        # Add change frequency
        changefreq = ET.SubElement(url, 'changefreq')
        changefreq.text = get_changefreq(html_file)
        
        # Add priority
        priority = ET.SubElement(url, 'priority')
        priority.text = get_priority(html_file)
    
    # Create the XML string
    xml_str = minidom.parseString(ET.tostring(urlset)).toprettyxml(indent='  ')
    
    # Save to file
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(xml_str)
    
    print(f"Generated sitemap.xml with {len(html_files)} URLs")

def ping_search_engines():
    """Notify search engines about the updated sitemap"""
    sitemap_url = 'https://calculatorfree.online/sitemap.xml'
    ping_urls = [
        f'https://www.google.com/ping?sitemap={sitemap_url}',
        f'https://www.bing.com/ping?sitemap={sitemap_url}'
    ]
    
    print("\nTo notify search engines about your updated sitemap, visit:")
    for url in ping_urls:
        print(f"- {url}")

if __name__ == "__main__":
    create_sitemap()
    ping_search_engines() 