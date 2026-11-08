import sqlite3
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_path = r'C:\jawharat-hrms\server\database\hrms.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Enable foreign keys
cur.execute("PRAGMA foreign_keys = OFF")

with open(r'C:\jawharat-hrms\server\database\officialEmployees.json', encoding='utf-8') as f:
    employees = json.load(f)

print(f"Loaded {len(employees)} employees from officialEmployees.json")

# 1. PURGE OLD TEST DATA
print("1. Purging old test data...")
cur.execute("DELETE FROM requests")
cur.execute("DELETE FROM leaves")
cur.execute("DELETE FROM leave_balances")
cur.execute("DELETE FROM leave_balance_adjustments")
cur.execute("DELETE FROM muqeem_residents")
cur.execute("DELETE FROM penalties_issued")
cur.execute("DELETE FROM vehicles")
cur.execute("DELETE FROM company_licenses")
cur.execute("DELETE FROM employees")
conn.commit()

# 2. INSERT 108 EMPLOYEES
print("2. Inserting 108 employees...")
insert_emp_sql = """
INSERT INTO employees (
    emp_code, full_name_ar, full_name_en, national_id, nationality,
    is_saudi, gender, birth_date, email, phone,
    department_id, job_title_ar, job_title_en, grade_level,
    contract_type, join_date, contract_start, contract_end,
    iqama_expiry, passport_expiry, basic_salary, housing_allowance,
    transport_allowance, other_allowance, iban, status,
    role, branch_id, section, direct_manager_name,
    opening_leave_balance, monthly_accrual_rate, annual_leave_balance,
    accrual_start_date, created_at
) VALUES (
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?,
    '2026-11-05', datetime('now')
)
"""

for e in employees:
    gender = 'M' if e['gender'] in ('M', 'male', 'ذكر') else 'F'
    cur.execute(insert_emp_sql, (
        e['emp_code'], e['full_name_ar'], e.get('full_name_en', ''), e['national_id'], e['nationality'],
        e['is_saudi'], gender, e['birth_date'], e['email'], e['phone'],
        e['department_id'], e['job_title_ar'], e.get('job_title_en', ''), e['grade_level'],
        e['contract_type'], e['join_date'], e['contract_start'], e['contract_end'],
        e['iqama_expiry'], e['passport_expiry'], e['basic_salary'], e['housing_allowance'],
        e['transport_allowance'], e['other_allowance'], e['iban'], 'نشط',
        e['role'], e['branch_id'], e['section'], e['direct_manager_name'],
        e['opening_leave_balance'], e['monthly_accrual_rate'], e['annual_leave_balance']
    ))
conn.commit()

# Build mapping of name -> id and emp_code -> id
emp_id_by_code = {}
emp_id_by_name = {}
for eid, code, name in cur.execute("SELECT id, emp_code, full_name_ar FROM employees").fetchall():
    emp_id_by_code[code] = eid
    emp_id_by_name[name.strip()] = eid

print(f"Inserted {len(emp_id_by_code)} employees into database.")

# 3. RESOLVE & UPDATE manager_id FOR ALL EMPLOYEES
print("3. Updating manager_id for all employees...")
for e in employees:
    m_name = e['direct_manager_name'].strip()
    m_id = None
    if m_name and m_name != 'مدير النظام':
        m_id = emp_id_by_name.get(m_name)
        if not m_id:
            for kname, kid in emp_id_by_name.items():
                if m_name in kname or kname in m_name:
                    m_id = kid
                    break
    
    cur.execute("UPDATE employees SET manager_id = ? WHERE emp_code = ?", (m_id, e['emp_code']))

conn.commit()

# 4. UPDATE DEPARTMENT MANAGERS
print("4. Updating department managers...")
dept_mgr_mapping = {
    'DEPT-HQ': 'JM-0001',          # عبدالملك سعيد الشريف
    'DEPT-ENG': 'JM-0108',         # فارس عبدالرحمن القحطاني
    'DEPT-CONTRACTS': 'JM-0108',   # فارس عبدالرحمن القحطاني
    'DEPT-BR-MUWADAF': 'JM-0100',  # علي سعد حسين البشري
    'DEPT-BR-CITYPARK': 'JM-0070', # خالد احمد محمد راعي
    'DEPT-BR-DOWNTOWN': 'JM-0096', # احمد عبدالرحمن علي يعن الله
    'DEPT-BR-HABIL': 'JM-0018',    # فهد إبراهيم جعفر الاعوري
    'DEPT-WH': 'JM-0001',          # عبدالملك سعيد الشريف
    'DEPT-MAINT': 'JM-0001',       # عبدالملك سعيد الشريف
}

for dcode, mcode in dept_mgr_mapping.items():
    mid = emp_id_by_code.get(mcode)
    mname = [e['full_name_ar'] for e in employees if e['emp_code'] == mcode][0]
    cur.execute("UPDATE departments SET manager_emp_id = ?, manager_name = ? WHERE code = ?", (mid, mname, dcode))

conn.commit()

# 5. INSERT LEAVE BALANCES
print("5. Inserting leave balances for all 108 employees...")
insert_bal_sql = """
INSERT INTO leave_balances (
    emp_id, base_balance, accrual_rate_annual, accrued_days, used_days,
    manual_adjustment, current_balance, last_accrual_date, updated_at
) VALUES (?, ?, ?, ?, ?, 0, ?, '2026-11-08', datetime('now'))
"""

for e in employees:
    eid = emp_id_by_code[e['emp_code']]
    cur.execute(insert_bal_sql, (
        eid,
        e['opening_leave_balance'],
        e['annual_leave_balance'],
        e['accrued_balance'],
        e['used_balance'],
        e['available_balance']
    ))

conn.commit()

# 6. POPULATE REQUESTS & LEAVES
print("6. Inserting active workflow requests...")

# 6A. JM-0072 (شامة علي محمد عسيري): 1 day pending
id_72 = emp_id_by_code['JM-0072']
mgr_id_72 = emp_id_by_name.get('عبدالملك سعيد الشريف')
cur.execute("""
INSERT INTO requests (
    request_no, emp_id, request_type, start_date, end_date, days_count,
    amount, reason, status, manager_id, manager_name, manager_status,
    created_at, updated_at
) VALUES (
    'REQ-2026-0001', ?, 'إجازة سنوية', '2026-11-05', '2026-11-05', 1,
    0, 'طلب إجازة سنوية اعتيادية وفق الرصيد المتاح', 'بانتظار موافقة المدير المباشر',
    ?, 'عبدالملك سعيد الشريف', 'pending',
    '2026-11-05 09:00:00', '2026-11-05 09:00:00'
)
""", (id_72, mgr_id_72))

cur.execute("""
INSERT INTO leaves (
    request_no, emp_id, leave_type, start_date, end_date, days_count,
    reason, status, manager_id, manager_name, manager_status,
    hr_status, created_at, updated_at
) VALUES (
    'REQ-2026-0001', ?, 'إجازة سنوية', '2026-11-05', '2026-11-05', 1,
    'طلب إجازة سنوية اعتيادية وفق الرصيد المتاح', 'بانتظار موافقة المدير المباشر',
    ?, 'عبدالملك سعيد الشريف', 'pending',
    'pending', '2026-11-05 09:00:00', '2026-11-05 09:00:00'
)
""", (id_72, mgr_id_72))

# 6B. JM-0001 (عبدالملك سعيد الشريف): 8 days pending
id_01 = emp_id_by_code['JM-0001']
cur.execute("""
INSERT INTO requests (
    request_no, emp_id, request_type, start_date, end_date, days_count,
    amount, reason, status, manager_id, manager_name, manager_status,
    created_at, updated_at
) VALUES (
    'REQ-2026-0002', ?, 'إجازة سنوية', '2026-11-15', '2026-11-22', 8,
    0, 'طلب إجازة سنوية مجدولة', 'بانتظار موافقة المدير المباشر',
    NULL, 'مدير النظام', 'pending',
    '2026-11-06 10:00:00', '2026-11-06 10:00:00'
)
""", (id_01,))

cur.execute("""
INSERT INTO leaves (
    request_no, emp_id, leave_type, start_date, end_date, days_count,
    reason, status, manager_id, manager_name, manager_status,
    hr_status, created_at, updated_at
) VALUES (
    'REQ-2026-0002', ?, 'إجازة سنوية', '2026-11-15', '2026-11-22', 8,
    'طلب إجازة سنوية مجدولة', 'بانتظار موافقة المدير المباشر',
    NULL, 'مدير النظام', 'pending',
    'pending', '2026-11-06 10:00:00', '2026-11-06 10:00:00'
)
""", (id_01,))

# 6C. JM-0028 (هاني عبدالرحمن صالح القحطاني): 9 days pending
id_28 = emp_id_by_code['JM-0028']
cur.execute("""
INSERT INTO requests (
    request_no, emp_id, request_type, start_date, end_date, days_count,
    amount, reason, status, manager_id, manager_name, manager_status,
    created_at, updated_at
) VALUES (
    'REQ-2026-0003', ?, 'إجازة سنوية', '2026-11-20', '2026-11-28', 9,
    0, 'طلب إجازة سنوية معتمدة', 'بانتظار موافقة المدير المباشر',
    ?, 'عبدالملك سعيد الشريف', 'pending',
    '2026-11-06 11:30:00', '2026-11-06 11:30:00'
)
""", (id_28, mgr_id_72))

cur.execute("""
INSERT INTO leaves (
    request_no, emp_id, leave_type, start_date, end_date, days_count,
    reason, status, manager_id, manager_name, manager_status,
    hr_status, created_at, updated_at
) VALUES (
    'REQ-2026-0003', ?, 'إجازة سنوية', '2026-11-20', '2026-11-28', 9,
    'طلب إجازة سنوية معتمدة', 'بانتظار موافقة المدير المباشر',
    ?, 'عبدالملك سعيد الشريف', 'pending',
    'pending', '2026-11-06 11:30:00', '2026-11-06 11:30:00'
)
""", (id_28, mgr_id_72))

# 6D. JM-0029 (فيروز علي جان محمد): 7 days used (approved)
id_29 = emp_id_by_code['JM-0029']
cur.execute("""
INSERT INTO requests (
    request_no, emp_id, request_type, start_date, end_date, days_count,
    amount, reason, status, manager_id, manager_name, manager_status,
    hr_director_status, created_at, updated_at
) VALUES (
    'REQ-2026-0004', ?, 'إجازة سنوية', '2026-10-01', '2026-10-07', 7,
    0, 'إجازة سنوية سابقة معتمدة ومخصومة من الرصيد', 'معتمد نهائياً',
    ?, 'عبدالملك سعيد الشريف', 'approved',
    'approved', '2026-10-01 08:00:00', '2026-10-01 08:30:00'
)
""", (id_29, mgr_id_72))

cur.execute("""
INSERT INTO leaves (
    request_no, emp_id, leave_type, start_date, end_date, days_count,
    reason, status, manager_id, manager_name, manager_status,
    hr_status, created_at, updated_at
) VALUES (
    'REQ-2026-0004', ?, 'إجازة سنوية', '2026-10-01', '2026-10-07', 7,
    'إجازة سنوية سابقة معتمدة ومخصومة من الرصيد', 'معتمد نهائياً',
    ?, 'عبدالملك سعيد الشريف', 'approved',
    'approved', '2026-10-01 08:00:00', '2026-10-01 08:30:00'
)
""", (id_29, mgr_id_72))

conn.commit()

# 7. SYNCHRONIZE MUQEEM RESIDENTS (78 NON-SAUDIS)
print("7. Synchronizing muqeem_residents...")
insert_muqeem_sql = """
INSERT INTO muqeem_residents (
    iqama_number, full_name, gender, nationality, occupation,
    passport_number, passport_expiry, iqama_issue_date,
    iqama_expiry_gregorian, iqama_expiry_hijri, birth_date,
    is_outside_ksa, employer_id, created_at, updated_at
) VALUES (
    ?, ?, ?, ?, ?,
    ?, ?, NULL,
    ?, NULL, ?,
    ?, '7013999755', datetime('now'), datetime('now')
)
"""

expats_count = 0
for e in employees:
    if not e['is_saudi']:
        is_outside = 1 if e.get('saudi_presence') == 'outside' else 0
        gender_ar = 'أنثى' if e['gender'] == 'F' else 'ذكر'
        cur.execute(insert_muqeem_sql, (
            e['iqama_number'] or e['national_id'],
            e['full_name_ar'],
            gender_ar,
            e['nationality'],
            e['job_title_ar'],
            e['passport_number'] or None,
            e['passport_expiry'] or None,
            e['iqama_expiry'] or None,
            e['birth_date'] or '1990-01-01',
            is_outside
        ))
        expats_count += 1

conn.commit()
print(f"Synchronized {expats_count} expat residents into muqeem_residents table.")

# 8. VERIFY FINAL DATABASE STATE
print("\n=== FINAL VERIFICATION ===")
total_emp = cur.execute("SELECT COUNT(*) FROM employees").fetchone()[0]
active_emp = cur.execute("SELECT COUNT(*) FROM employees WHERE status = 'نشط'").fetchone()[0]
total_bals = cur.execute("SELECT COUNT(*) FROM leave_balances").fetchone()[0]
total_reqs = cur.execute("SELECT COUNT(*) FROM requests").fetchone()[0]
total_leaves = cur.execute("SELECT COUNT(*) FROM leaves").fetchone()[0]
total_muqeem = cur.execute("SELECT COUNT(*) FROM muqeem_residents").fetchone()[0]
total_vehs = cur.execute("SELECT COUNT(*) FROM vehicles").fetchone()[0]
total_lics = cur.execute("SELECT COUNT(*) FROM company_licenses").fetchone()[0]

print(f"Total employees: {total_emp}")
print(f"Active employees: {active_emp}")
print(f"Leave balances: {total_bals}")
print(f"Workflow requests: {total_reqs}")
print(f"Leaves: {total_leaves}")
print(f"Muqeem expat residents: {total_muqeem}")
print(f"Vehicles: {total_vehs}")
print(f"Company licenses: {total_lics}")

# Show sample employees with manager names
print("\n--- SAMPLE EMPLOYEES WITH DIRECT MANAGERS ---")
samples = cur.execute("""
    SELECT e.emp_code, e.full_name_ar, e.job_title_ar, d.name_ar as dept,
           COALESCE(m.full_name_ar, e.direct_manager_name) as manager,
           lb.current_balance as leave_bal
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN employees m ON e.manager_id = m.id
    LEFT JOIN leave_balances lb ON e.id = lb.emp_id
    WHERE e.emp_code IN ('JM-0001', 'JM-0002', 'JM-0004', 'JM-0014', 'JM-0028', 'JM-0070', 'JM-0072', 'JM-0100', 'JM-0108')
""").fetchall()

for s in samples:
    print(s)

conn.close()
print("\nALL UPDATES COMPLETED SUCCESSFULLY!")
