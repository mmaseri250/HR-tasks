import csv
import json
import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Load CSVs
with open(r'C:\jawharat-hrms\server\database\first_block.csv', encoding='utf-8') as f:
    r1 = list(csv.DictReader(f))

with open(r'C:\jawharat-hrms\server\database\official_employees_source.csv', encoding='utf-8') as f:
    r2 = list(csv.DictReader(f))

d1 = {row['الرقم الوظيفي'].strip(): row for row in r1}
d2 = {row['employee_code'].strip(): row for row in r2}

db_path = r'C:\jawharat-hrms\server\database\hrms.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

depts = cur.execute("SELECT id, code, name_ar FROM departments").fetchall()
dept_map = {}
for did, code, name in depts:
    dept_map[name.strip()] = did

branches = cur.execute("SELECT id, code, name_ar FROM branches").fetchall()
branch_map = {}
for bid, code, name in branches:
    branch_map[name.strip()] = bid

def get_dept_id(dept_name):
    d = dept_name.strip()
    if d in dept_map: return dept_map[d]
    for k, v in dept_map.items():
        if d in k or k in d: return v
    return dept_map.get('الإدارة الرئيسية', 4851)

def get_branch_id(dept_name):
    d = dept_name.strip()
    if 'سيتي بارك' in d:
        for k, v in branch_map.items():
            if 'سيتي بارك' in k: return v
    elif 'حي الموظفين' in d:
        for k, v in branch_map.items():
            if 'حي الموظفين' in k: return v
    elif 'مجمع وسط البلد' in d:
        for k, v in branch_map.items():
            if 'وسط البلد' in k or 'مجمع' in k: return v
    elif 'الحبيل' in d:
        for k, v in branch_map.items():
            if 'الحبيل' in k: return v
    for k, v in branch_map.items():
        if 'الرئيسي' in k: return v
    return list(branch_map.values())[0]

employees_list = []
for code in sorted(d2.keys()):
    c1 = d1.get(code, {})
    c2 = d2.get(code, {})

    full_name_ar = c2.get('full_name', '').strip() or c1.get('الاسم الرباعي', '').strip()
    nat = c2.get('nationality', '').strip() or c1.get('الجنسية', '').strip()
    is_saudi = 1 if ('السعودية' in nat or 'سعودي' in nat) else 0

    dept_name = c2.get('department', '').strip() or c1.get('الإدارة', '').strip()
    dept_id = get_dept_id(dept_name)
    branch_id = get_branch_id(dept_name)
    section = c2.get('section', '').strip() or c1.get('القسم', '').strip()
    job_title = c2.get('job_title', '').strip() or c1.get('المسمى الوظيفي', '').strip()

    raw_nat_id = c2.get('national_id', '').strip() or c1.get('رقم الهوية / الإقامة', '').strip()
    national_id = raw_nat_id if raw_nat_id else None

    iqama_number = c2.get('iqama_number', '').strip() or (national_id if not is_saudi else '')
    iqama_expiry = c2.get('iqama_expiry', '').strip() or c1.get('تاريخ انتهاء الإقامة', '').strip()
    if iqama_expiry in ('لا ينطبق', '', None) or is_saudi:
        iqama_expiry = None

    passport_number = c2.get('passport_number', '').strip()
    passport_expiry = c2.get('passport_expiry', '').strip()
    if not passport_expiry: passport_expiry = None

    saudi_presence = c2.get('saudi_presence', '').strip() or 'inside'

    email = c2.get('email', '').strip() or c1.get('البريد الإلكتروني', '').strip()
    mobile = c2.get('mobile', '').strip() or c1.get('رقم الجوال', '').strip()

    hire_date = c2.get('hire_date', '').strip() or c1.get('تاريخ المباشرة', '').strip()
    if not hire_date: hire_date = '2023-01-01'
    contract_type = c2.get('contract_type', '').strip() or ('غير محدد المدة' if is_saudi else 'محدد المدة')
    contract_start = c2.get('contract_start', '').strip() or hire_date
    contract_end = c2.get('contract_end', '').strip() or ('2027-12-31' if not is_saudi else None)

    def parse_float(val, default=0.0):
        try:
            return float(str(val).replace(',', '').strip())
        except:
            return default

    basic_salary = parse_float(c2.get('basic_salary') or c1.get('الراتب الأساسي'))
    housing = parse_float(c2.get('housing_allowance') or c1.get('بدل السكن'))
    transport = parse_float(c2.get('transport_allowance') or c1.get('بدل المواصلات'))
    other_allow = parse_float(c2.get('other_allowances') or c1.get('بدلات أخرى'))

    iban = c2.get('iban', '').strip() or c1.get('رقم الآيبان', '').strip()
    if iban == '473': iban = ''

    manager_name = c2.get('المدير المباشر', '').strip() or c1.get('المدير المباشر', '').strip()

    monthly_accrual = parse_float(c1.get('الاحتساب الشهري للاجازات'), 2.5 if is_saudi else 1.75)
    opening_bal = parse_float(c2.get('الافتتاحي'), 0.0)
    accrued_bal = parse_float(c2.get('المستحق'), 0.0)
    used_bal = parse_float(c2.get('المستخدم'), 0.0)
    pending_bal = parse_float(c2.get('محجوز (قيد الاعتماد)'), 0.0)
    avail_bal = parse_float(c2.get('المتاح'), opening_bal)

    raw_gender = (c1.get('الجنس', '') or '').strip().lower()
    if raw_gender in ('female', 'f', 'أنثى', 'انثى'):
        gender = 'F'
    elif raw_gender in ('male', 'm', 'ذكر'):
        gender = 'M'
    else:
        gender = 'F' if any(w in full_name_ar for w in ['سميه', 'نوره', 'خيريه', 'لينا', 'منال', 'عهود', 'نوف', 'فاطمة', 'صالحة', 'ندى', 'عبير', 'عهد', 'غدي', 'شامة']) else 'M'

    emp_obj = {
        'emp_code': code,
        'full_name_ar': full_name_ar,
        'full_name_en': '',
        'national_id': national_id,
        'nationality': nat,
        'is_saudi': is_saudi,
        'gender': gender,
        'birth_date': '1990-01-01',
        'email': email,
        'phone': mobile,
        'department_id': dept_id,
        'department_name': dept_name,
        'section': section,
        'branch_id': branch_id,
        'job_title_ar': job_title,
        'job_title_en': '',
        'grade_level': 'Staff',
        'contract_type': contract_type,
        'join_date': hire_date,
        'contract_start': contract_start,
        'contract_end': contract_end,
        'iqama_number': iqama_number,
        'iqama_expiry': iqama_expiry,
        'passport_number': passport_number,
        'passport_expiry': passport_expiry,
        'saudi_presence': saudi_presence,
        'basic_salary': basic_salary,
        'housing_allowance': housing,
        'transport_allowance': transport,
        'other_allowance': other_allow,
        'iban': iban,
        'status': 'نشط',
        'role': 'employee',
        'direct_manager_name': manager_name,
        'opening_leave_balance': opening_bal,
        'accrued_balance': accrued_bal,
        'used_balance': used_bal,
        'pending_balance': pending_bal,
        'available_balance': avail_bal,
        'monthly_accrual_rate': monthly_accrual,
        'annual_leave_balance': 30 if monthly_accrual >= 2.5 else 21
    }
    employees_list.append(emp_obj)

with open(r'C:\jawharat-hrms\server\database\officialEmployees.json', 'w', encoding='utf-8') as f:
    json.dump(employees_list, f, ensure_ascii=False, indent=2)

with open(r'C:\jawharat-hrms\server\database\officialEmployeesClean.json', 'w', encoding='utf-8') as f:
    json.dump(employees_list, f, ensure_ascii=False, indent=2)

print("Master employee data prepared successfully.")
