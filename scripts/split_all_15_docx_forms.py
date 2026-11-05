import docx
from docx import Document
import copy
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

src_path = 'C:/Users/alnwa/.gemini/antigravity/brain/592c605b-19a2-4a29-9e0a-591b298c485a/.user_uploaded/media_1793905096471_9ea06f5c.docx'
out_dir = 'C:/jawharat-hrms/server/templates/official_word_forms'
os.makedirs(out_dir, exist_ok=True)

# Form mapping: (key, filename, form_number, title_ar)
form_metadata = [
    ('esn', 'JM_HR_F_001_Employee_Status_Notification.docx', 'JM-HR-F-001', 'إشعار حالة موظف'),
    ('adv', 'JM_HR_F_002_Employee_Advance_Request.docx', 'JM-HR-F-002', 'طلب سلفة'),
    ('ira', 'JM_HR_F_003_Iqama_Receipt_Acknowledgment.docx', 'JM-HR-F-003', 'نموذج استلام إقامة'),
    ('fer', 'JM_HR_F_004_Final_Exit_Request.docx', 'JM-HR-F-004', 'خروج نهائي'),
    ('str', 'JM_HR_F_005_Sponsorship_Transfer_Request.docx', 'JM-HR-F-005', 'نقل كفالة'),
    ('ecf', 'JM_HR_F_006_Employee_Clearance_Form.docx', 'JM-HR-F-006', 'تصفية موظف'),
    ('ffs', 'JM_HR_F_007_Full_Final_Settlement_Release.docx', 'JM-HR-F-007', 'وثيقة إبراء ذمة واستلام المستحقات'),
    ('pna', 'JM_HR_F_004_Notice_Penalty_Absence.docx', 'JM-HR-F-004', 'إخطار عقوبة – غياب'),
    ('pni', 'JM_HR_F_004_Notice_Penalty_Instructions.docx', 'JM-HR-F-004', 'إخطار عقوبة – مخالفة الأوامر والتعليمات'),
    ('cnr', 'JM_HR_F_001_Notice_Non_Renewal_Contract.docx', 'JM-HR-F-001', 'إشعار عدم تجديد العقد'),
    ('cle', 'JM_HR_F_005_Employee_Clearance_Form.docx', 'JM-HR-F-005', 'نموذج إخلاء طرف موظف'),
    ('ppf', 'JM_HR_F_002_Penalty_Procedure_Form.docx', 'JM-HR-F-002', 'نموذج إجراء جزائي'),
    ('rct', 'JM_HR_F_008_Resignation_Termination_Form.docx', 'JM-HR-F-008', 'نموذج الاستقالة وإنهاء عقد العمل'),
    ('lrf', 'JM_HR_F_009_Leave_Request_Form.docx', 'JM-HR-F-009', 'نموذج طلب إجازة'),
    ('scf', 'JM_HR_F_010_Salary_Certificate.docx', 'JM-HR-F-010', 'تعريف بالراتب')
]

doc = Document(src_path)
elements = list(doc.element.body)
form_headers = [i for i, child in enumerate(elements) if 'Form No:' in ''.join(child.itertext())]

# Determine start and end index for each form
form_ranges = []
for idx, h_idx in enumerate(form_headers):
    # Form starts at the banner image right before the header table
    start_idx = h_idx - 1
    # Check if h_idx - 2 was a page break or blank para
    if h_idx >= 2 and elements[h_idx - 2].tag.endswith('p') and not elements[h_idx - 2].xpath('.//w:drawing'):
        # Keep clean start
        pass
    
    if idx + 1 < len(form_headers):
        next_h_idx = form_headers[idx + 1]
        end_idx = next_h_idx - 1
    else:
        end_idx = len(elements) - 1 # exclude last sectPr
    
    form_ranges.append((start_idx, end_idx))

print(f"Generated {len(form_ranges)} ranges:")
for i, (s, e) in enumerate(form_ranges):
    key, fname, fno, tar = form_metadata[i]
    print(f"Form {i+1} ({key} - {tar}): elements {s} -> {e}")
    
    # Create new document by cloning source document and keeping only the target elements
    new_doc = Document(src_path)
    body = new_doc.element.body
    
    # Find all elements to delete (those before s or after e)
    # Note: sectPr must be preserved at the end of body
    sectPr = body.xpath('./w:sectPr')
    last_sectPr = sectPr[-1] if sectPr else None
    
    # We iterate backwards through body children
    all_children = list(body)
    for c_i, child in enumerate(all_children):
        if child == last_sectPr:
            continue
        if c_i < s or c_i >= e:
            body.remove(child)
            
    out_file = os.path.join(out_dir, fname)
    new_doc.save(out_file)
    print(f"  -> Saved: {fname} ({os.path.getsize(out_file)} bytes)")

print("\n✓ Successfully extracted all 15 official Word documents directly from source!")
