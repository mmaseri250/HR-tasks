import docx
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

src_path = 'C:/Users/alnwa/.gemini/antigravity/brain/592c605b-19a2-4a29-9e0a-591b298c485a/.user_uploaded/media_1793905096471_9ea06f5c.docx'
out_dir = 'C:/jawharat-hrms/server/templates/official_word_forms'
os.makedirs(out_dir, exist_ok=True)

doc = docx.Document(src_path)

# Form definitions with identifiers
form_keys = [
    ('esn', '01_إشعار_حالة_موظف_Employee_Status_Notification.docx'),
    ('adv', '02_طلب_سلفة_Employee_Advance_Request.docx'),
    ('ira', '03_نموذج_استلام_إقامة_Iqama_Receipt_Acknowledgment.docx'),
    ('fer', '04_خروج_نهائي_Final_Exit_Request.docx'),
    ('str', '05_نقل_كفالة_Sponsorship_Transfer_Request.docx'),
    ('ecf', '06_تصفية_موظف_Employee_Clearance_Form.docx'),
    ('ffs', '07_وثيقة_إبراء_ذمة_Full_and_Final_Settlement.docx'),
    ('pna', '08_إخطار_عقوبة_غياب_Notice_of_Penalty_Absence.docx'),
    ('pni', '09_إخطار_عقوبة_مخالفة_التعليمات_Notice_of_Penalty_Instructions.docx'),
    ('cnr', '10_إشعار_عدم_تجديد_العقد_Notice_of_Non_Renewal.docx'),
    ('cle', '11_نموذج_إخلاء_طرف_موظف_Employee_Clearance_Form_005.docx'),
    ('ppf', '12_نموذج_إجراء_جزائي_Penalty_Procedure_Form.docx'),
    ('rct', '13_نموذج_الاستقالة_وإنهاء_العقد_Resignation_Termination.docx'),
    ('lrf', '14_نموذج_طلب_إجازة_Leave_Request_Form.docx'),
    ('scf', '15_تعريف_بالراتب_Salary_Certificate.docx')
]

print(f"Total tables in source document: {len(doc.tables)}")
