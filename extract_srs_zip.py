import zipfile
import xml.etree.ElementTree as ET
import re

docx_path = '/var/local/surian-ai-studio/مشروع الحكومة/مسودة ال SRS النسخة 3.docx'
keywords = ['header', 'logo', 'color', 'navigation', 'identity', 'الترويسة', 'الشعار', 'الألوان', 'القائمة', 'nav', 'navbar', 'branding', 'اللون', 'القوائم', 'وزارة']

try:
    with zipfile.ZipFile(docx_path) as z:
        xml_content = z.read('word/document.xml')
        root = ET.fromstring(xml_content)
        
        # XML namespace map might be needed, but usually we can find 'w:t' elements
        # 'w' namespace is usually http://schemas.openxmlformats.org/wordprocessingml/2006/main
        
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        all_text = []
        for text_node in root.findall('.//w:t', namespaces):
            if text_node.text:
                all_text.append(text_node.text)
                
        full_text = ''.join(all_text)
        
        # It's a bit of a stream, so let's try to split by some logic or just print chunks around keywords
        
        print(f"--- Document extracted ({len(full_text)} chars) ---")
        
        # Simple fuzzy search for context window around keywords
        lower_text = full_text.lower()
        for k in keywords:
            indices = [m.start() for m in re.finditer(k, lower_text)]
            for idx in indices:
                start = max(0, idx - 100)
                end = min(len(full_text), idx + 200)
                print(f"\n[Keyword: {k}]")
                print(f"...{full_text[start:end]}...")

except Exception as e:
    print(f"Error: {e}")
