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
            'sections': []
        }
        forms.append(cur_form)
    elif cur_form:
        section_data = []
        for r in table.rows:
            row_cells = [c.text.strip() for c in r.cells]
            section_data.append(row_cells)
        cur_form['sections'].append({'table_idx': t_idx, 'rows': section_data})

with open('C:/jawharat-hrms/scripts/extracted_official_forms.json', 'w', encoding='utf-8') as f:
    json.dump(forms, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(forms)} official forms to C:/jawharat-hrms/scripts/extracted_official_forms.json")
