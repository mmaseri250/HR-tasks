# -*- coding: utf-8 -*-
"""
Extract 15 official forms from 'النماذج والمستندات.docx' into individual .docx files
in 'server/templates/official_word_forms/'.
"""
import docx
from docx.oxml import OxmlElement
import copy
import os
import sys

source_path = "النماذج والمستندات.docx"
target_dir = os.path.join("server", "templates", "official_word_forms")
os.makedirs(target_dir, exist_ok=True)

doc = docx.Document(source_path)

# Header table indices found earlier
# Form 1: Table 0
# Form 2: Table 7
# Form 3: Table 13
# Form 4: Table 20
# Form 5: Table 27
# Form 6: Table 34
# Form 7: Table 40
# Form 8: Table 45
# Form 9: Table 49
# Form 10: Table 53
# Form 11: Table 57
# Form 12: Table 63
# Form 13: Table 70
# Form 14: Table 78
# Form 15: Table 87

form_headers = [
    (0, "JM-HR-F-001", "JM_HR_F_001_Employee_Status_Notification.docx", "إشعار حالة موظف"),
    (7, "JM-HR-F-002", "JM_HR_F_002_Employee_Advance_Request.docx", "طلب سلفة"),
    (13, "JM-HR-F-003", "JM_HR_F_003_Iqama_Receipt_Acknowledgment.docx", "نموذج استلام إقامة"),
    (20, "JM-HR-F-004", "JM_HR_F_004_Final_Exit_Request.docx", "خروج نهائي"),
    (27, "JM-HR-F-005", "JM_HR_F_005_Sponsorship_Transfer_Request.docx", "نقل كفالة"),
    (34, "JM-HR-F-006", "JM_HR_F_006_Employee_Settlement.docx", "تصفية موظف/ـة"),
    (40, "JM-HR-F-007", "JM_HR_F_007_Clearance_And_Final_Settlement.docx", "وثيقة إبراء ذمة واستلام المستحقات"),
    (45, "JM-HR-F-008", "JM_HR_F_008_Notice_Penalty_Absence.docx", "إخطار عقوبة – غياب"),
    (49, "JM-HR-F-009", "JM_HR_F_009_Notice_Penalty_Instruction.docx", "إخطار عقوبة – مخالفة الأوامر والتعليمات"),
    (53, "JM-HR-F-010", "JM_HR_F_010_Notice_Non_Renewal_Contract.docx", "إشعار عدم تجديد العقد"),
    (57, "JM-HR-F-011", "JM_HR_F_011_Employee_Clearance_Form.docx", "نموذج إخلاء طرف موظف"),
    (63, "JM-HR-F-012", "JM_HR_F_012_Penalty_Procedure_Form.docx", "نموذج إجراء جزائي"),
    (70, "JM-HR-F-013", "JM_HR_F_013_Resignation_Termination_Form.docx", "نموذج الاستقالة وإنهاء عقد العمل"),
    (78, "JM-HR-F-014", "JM_HR_F_014_Leave_Request_Form.docx", "نموذج طلب إجازة"),
    (87, "JM-HR-F-015", "JM_HR_F_015_Salary_Certificate.docx", "تعريف بالراتب"),
]

total_tables = len(doc.tables)

for idx, (start_table, code, filename, title) in enumerate(form_headers):
    end_table = form_headers[idx + 1][0] if idx + 1 < len(form_headers) else total_tables
    
    # Create new document with same styles
    new_doc = docx.Document()
    
    # Copy section margins from original
    orig_sec = doc.sections[0]
    new_sec = new_doc.sections[0]
    new_sec.top_margin = orig_sec.top_margin
    new_sec.bottom_margin = orig_sec.bottom_margin
    new_sec.left_margin = orig_sec.left_margin
    new_sec.right_margin = orig_sec.right_margin
    new_sec.page_width = orig_sec.page_width
    new_sec.page_height = orig_sec.page_height
    
    # Remove initial empty paragraph if present
    if len(new_doc.paragraphs) > 0:
        p_init = new_doc.paragraphs[0]._element
        p_init.getparent().remove(p_init)
    
    # Clone tables from start_table to end_table
    for t_i in range(start_table, end_table):
        t_elem = doc.tables[t_i]._element
        cloned_elem = copy.deepcopy(t_elem)
        new_doc._body._element.append(cloned_elem)
        
    out_path = os.path.join(target_dir, filename)
    new_doc.save(out_path)
    print(f"Extracted {code} ({title}) -> {out_path} ({end_table - start_table} tables)")

print("\nAll 15 official forms extracted successfully!")
