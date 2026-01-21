import zipfile
import xml.etree.ElementTree as ET

docx_path = '/var/local/surian-ai-studio/مشروع الحكومة/مسودة ال SRS النسخة 3.docx'
keywords = ['الرئيسية', 'الصفحة الرئيسية', 'hero', 'home', 'البوابة', 'الإحصائيات', 'الخدمات', 'services', 'dashboard', 'statistics', 'emblem', 'الشعار', 'النسر', 'eagle']

try:
    with zipfile.ZipFile(docx_path) as z:
        xml_content = z.read('word/document.xml')
        root = ET.fromstring(xml_content)
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        paragraphs = []
        for p in root.findall('.//w:p', namespaces):
            p_text = []
            for t in p.findall('.//w:t', namespaces):
                if t.text:
                    p_text.append(t.text)
            if p_text:
                paragraphs.append(''.join(p_text))

        print("=== HOME PAGE / HERO SECTIONS ===")
        for i, line in enumerate(paragraphs):
            lower_line = line.lower()
            if any(k in lower_line for k in keywords):
                print(f"\n[Matches: {[k for k in keywords if k in lower_line]}]")
                if i > 0: print(f"  {paragraphs[i-1][:100]}...")
                print(f">> {line[:200]}...")
                if i < len(paragraphs) - 1: print(f"  {paragraphs[i+1][:100]}...")

except Exception as e:
    print(f"Error: {e}")
