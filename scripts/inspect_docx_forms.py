import docx
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')
doc = docx.Document('C:/Users/alnwa/.gemini/antigravity/brain/592c605b-19a2-4a29-9e0a-591b298c485a/.user_uploaded/media_1793905096471_9ea06f5c.docx')

forms = []
cur_form = None

for t_idx, table in enumerate(doc.tables):
    all_text = ' '.join(c.text.strip().replace('\n', ' ') for r in table.rows for c in r.cells)
    if 'Form No:' in all_text:
        # Header table
        title_cell = ''
        meta_cell = ''
        for r in table.rows:
            for c in r.cells:
                txt = c.text.strip()
                if 'Form No:' in txt:
                    meta_cell = txt
                elif txt and not title_cell:
                    title_cell = txt
        cur_form = {
            'index': len(forms) + 1,
            'header_table_idx': t_idx,
            'title': title_cell,
            'meta': meta_cell,
            'tables': []
        }
        forms.append(cur_form)
    elif cur_form:
        cur_form['tables'].append(t_idx)

print(f"Total Forms Found: {len(forms)}")
for f in forms:
    print(f"\n--- FORM #{f['index']} ---")
    print(f"Title: {f['title']}")
    print(f"Meta: {f['meta']}")
    print(f"Child tables: {f['tables']}")
