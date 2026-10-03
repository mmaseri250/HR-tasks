// server/database/seedData.js
const { db, get, query, run } = require('./db');

function seedDatabase() {
  // Update or insert company settings with exact name: "شركة جوهرة المجد"
  run(`
    INSERT INTO company_settings (
      id, company_name_ar, company_name_en, cr_number, mhrsd_est_number,
      tax_number, phone, email, website, address_ar, bank_name,
      bank_code, corporate_account, wps_payer_id, office_lat, office_lng,
      geofence_radius_meters, updated_at
    ) VALUES (
      1,
      'شركة جوهرة المجد',
      'Jawharat Al-Majd Co.',
      '7004872169',
      '',
      '310492837400003',
      '920012405',
      'info@jalmajd.com',
      'https://jalmajd.com',
      'المملكة العربية السعودية، منطقة عسير، أبها، حي الشرفية - مول سيتي بارك',
      'مصرف الراجحي',
      'RJHI',
      'SA4480000392608010049283',
      'EST7004872169',
      18.2164,
      42.5053,
      300,
      datetime('now')
    )
    ON CONFLICT(id) DO UPDATE SET
      company_name_ar = 'شركة جوهرة المجد',
      company_name_en = 'Jawharat Al-Majd Co.',
      cr_number = '7004872169',
      wps_payer_id = 'EST7004872169',
      updated_at = datetime('now')
  `);

  // 1. Users System: Seed admin, plus sample employee and manager accounts
  run(`DELETE FROM users`);
  run(`
    INSERT INTO users (username, password, full_name, email, role, permissions, emp_id, is_active)
    VALUES 
      ('admin', 'Jj123', 'مدير النظام (Admin)', 'admin@jalmajd.com', 'admin', '["all"]', 1, 1),
      ('sarah', '123456', 'سارة عبدالله الشهري', 'sarah.shehri@jalmajd.com', 'employee', '["requests","payslips"]', 3, 1),
      ('fahad', '123456', 'م. فهد عبدالعزيز القحطاني', 'fahad.qahtani@jalmajd.com', 'dept_manager', '["requests","payslips","approvals"]', 2, 1)
  `);

  // 2. Departments
  const deptCount = get('SELECT COUNT(*) AS count FROM departments').count;
  if (deptCount === 0) {
    const departments = [
      { code: 'EXEC', name_ar: 'الإدارة العامة والتنفيذية', name_en: 'Executive Management', manager: 'سعود بن محمد القحطاني', budget: 500000, loc: 'الطابق الإداري' },
      { code: 'HR', name_ar: 'الموارد البشرية والخدمات المشتركة', name_en: 'Human Resources & Shared Services', manager: 'خالد سعد الشهراني', budget: 250000, loc: 'مكتب HR - جناح A' },
      { code: 'IT', name_ar: 'تقنية المعلومات والتحول الرقمي', name_en: 'Information Technology & Digital Transformation', manager: 'م. فهد عبدالعزيز القحطاني', budget: 400000, loc: 'مكتب التقنية - جناح C' },
      { code: 'FIN', name_ar: 'الشؤون المالية والمحاسبة', name_en: 'Finance & Accounting', manager: 'عبدالله بن إبراهيم السبيعي', budget: 300000, loc: 'مكتب المالية - جناح B' },
      { code: 'OPS', name_ar: 'إدارة العمليات والمشاريع', name_en: 'Operations & Project Management', manager: 'عبدالرحمن علي عسيري', budget: 650000, loc: 'سيتي بارك - مبنى العمليات' },
      { code: 'MKT', name_ar: 'التسويق والاتصال المؤسسي', name_en: 'Marketing & Corporate Communication', manager: 'نورة سعيد الغامدي', budget: 200000, loc: 'الجناح الإعلامي' }
    ];

    for (const dept of departments) {
      run(`
        INSERT INTO departments (code, name_ar, name_en, manager_name, budget, location)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [dept.code, dept.name_ar, dept.name_en, dept.manager, dept.budget, dept.loc]);
    }
  }

  // 3. Biometric Devices
  const devCount = get('SELECT COUNT(*) AS count FROM biometric_devices').count;
  if (devCount === 0) {
    const devices = [
      { name: 'جهاز البوابة الرئيسية (ZK-MAIN)', code: 'ZK-BIO-MAIN-01', ip: '192.168.10.201', port: 4370, loc: 'المدخل الرئيسي - الاستقبال', status: 'متصل', model: 'ZKTeco SilkBio-101TC' },
      { name: 'جهاز بوابة العمليات والتقنية (ZK-TECH)', code: 'ZK-BIO-TECH-02', ip: '192.168.10.202', port: 4370, loc: 'مدخل أجنحة التقنية والعمليات', status: 'متصل', model: 'ZKTeco SpeedFace-V5L' },
      { name: 'جهاز الإدارة العامة ومول سيتي بارك (ZK-EXEC)', code: 'ZK-BIO-CITY-03', ip: '192.168.10.203', port: 4370, loc: 'الطابق الثاني - صالة الموظفين', status: 'متصل', model: 'ZKTeco ProFace X' }
    ];

    for (const dev of devices) {
      run(`
        INSERT INTO biometric_devices (device_name, device_code, ip_address, port, location, status, last_sync, model)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-5 minutes'), ?)
      `, [dev.name, dev.code, dev.ip, dev.port, dev.loc, dev.status, dev.model]);
    }
  }

  // 4. Employees
  const empCount = get('SELECT COUNT(*) AS count FROM employees').count;
  if (empCount === 0) {
    seedEmployees();
  }

  // 5. Seed Disciplinary Regulations (50 clauses from Desktop اكواد المخالفات.xlsx)
  seedPenaltyRegulations();

  // 6. Seed Sample Issued Penalties if empty
  const issuedCount = get('SELECT COUNT(*) AS count FROM penalties_issued').count;
  if (issuedCount === 0) {
    seedIssuedPenalties();
  }
}

function seedEmployees() {
  const employees = [
    { emp_code: 'JM-1001', full_name_ar: 'خالد سعد الشهراني', full_name_en: 'Khaled Saad Al-Shahrani', national_id: '1084928172', nationality: 'سعودي', is_saudi: 1, gender: 'M', email: 'khaled.shahrani@jalmajd.com', phone: '0501234567', department_id: 2, job_title_ar: 'مدير الموارد البشرية والعمليات الإدارية', job_title_en: 'HR & Administrative Director', basic_salary: 16000, housing_allowance: 4000, transport_allowance: 1500, other_allowance: 1000, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA5580000201608010011001', annual_leave_balance: 24, shift_type: 'دوام صباحي', join_date: '2021-03-01', contract_end: '2027-02-28' },
    { emp_code: 'JM-1002', full_name_ar: 'م. فهد عبدالعزيز القحطاني', full_name_en: 'Eng. Fahad Abdulaziz Al-Qahtani', national_id: '1092837461', nationality: 'سعودي', is_saudi: 1, gender: 'M', email: 'fahad.qahtani@jalmajd.com', phone: '0559876543', department_id: 3, job_title_ar: 'مدير إدارة تقنية المعلومات والتحول الرقمي', job_title_en: 'IT & Digital Transformation Director', basic_salary: 17500, housing_allowance: 4375, transport_allowance: 1500, other_allowance: 1500, bank_name: 'بنك الرياض', bank_code: 'RIBL', iban: 'SA3020000001092837461002', annual_leave_balance: 21, shift_type: 'دوام صباحي', join_date: '2022-01-15', contract_end: '2028-01-14' },
    { emp_code: 'JM-1003', full_name_ar: 'سارة عبدالله الشهري', full_name_en: 'Sarah Abdullah Al-Shehri', national_id: '1102938475', nationality: 'سعودية', is_saudi: 1, gender: 'F', email: 'sarah.shehri@jalmajd.com', phone: '0543210987', department_id: 2, job_title_ar: 'أخصائية موارد بشرية وعلاقات موظفين', job_title_en: 'HR & Employee Relations Specialist', basic_salary: 8500, housing_allowance: 2125, transport_allowance: 1000, other_allowance: 500, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA7780000201608010011003', annual_leave_balance: 28, shift_type: 'دوام صباحي', join_date: '2023-05-10', contract_end: '2027-05-09' },
    { emp_code: 'JM-1004', full_name_ar: 'محمد أحمد العتيبي', full_name_en: 'Mohammed Ahmed Al-Otaibi', national_id: '1074829103', nationality: 'سعودي', is_saudi: 1, gender: 'M', email: 'mohammed.otaibi@jalmajd.com', phone: '0567891234', department_id: 4, job_title_ar: 'محاسب مالي أول ومسؤول مسيرات الرواتب', job_title_en: 'Senior Payroll Accountant', basic_salary: 10500, housing_allowance: 2625, transport_allowance: 1000, other_allowance: 800, bank_name: 'البنك الأهلي السعودي', bank_code: 'NCBK', iban: 'SA1210000001074829103004', annual_leave_balance: 18, shift_type: 'دوام صباحي', join_date: '2022-09-01', contract_end: '2026-10-15' },
    { emp_code: 'JM-1005', full_name_ar: 'م. طارق محمود المنصوري', full_name_en: 'Eng. Tarek Mahmoud Al-Mansouri', national_id: '2491827364', nationality: 'مصري', is_saudi: 0, gender: 'M', email: 'tarek.mansouri@jalmajd.com', phone: '0539182736', department_id: 3, job_title_ar: 'مهندس برمجيات أول ومطور أنظمة سحابية', job_title_en: 'Senior Software Engineer', basic_salary: 12000, housing_allowance: 3000, transport_allowance: 1000, other_allowance: 1000, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA4580000201608010011005', annual_leave_balance: 22, shift_type: 'دوام صباحي', join_date: '2022-11-15', contract_end: '2027-11-14', iqama_expiry: '2027-04-10' },
    { emp_code: 'JM-1006', full_name_ar: 'عبدالرحمن علي عسيري', full_name_en: 'Abdulrahman Ali Asiri', national_id: '1063928174', nationality: 'سعودي', is_saudi: 1, gender: 'M', email: 'abdulrahman.asiri@jalmajd.com', phone: '0509871234', department_id: 5, job_title_ar: 'مدير العمليات التشغيلية والمشاريع', job_title_en: 'Operations Director', basic_salary: 15500, housing_allowance: 3875, transport_allowance: 1500, other_allowance: 1200, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA6680000201608010011006', annual_leave_balance: 15, shift_type: 'دوام صباحي', join_date: '2020-08-01', contract_end: '2028-07-31' },
    { emp_code: 'JM-1007', full_name_ar: 'نورة سعيد الغامدي', full_name_en: 'Noura Saeed Al-Ghamdi', national_id: '1058291740', nationality: 'سعودية', is_saudi: 1, gender: 'F', email: 'noura.ghamdi@jalmajd.com', phone: '0551122334', department_id: 6, job_title_ar: 'مديرة إدارة التسويق والاتصال المؤسسي', job_title_en: 'Marketing Manager', basic_salary: 13000, housing_allowance: 3250, transport_allowance: 1200, other_allowance: 800, bank_name: 'بنك البلاد', bank_code: 'ALBI', iban: 'SA9015000001058291740007', annual_leave_balance: 26, shift_type: 'دوام صباحي', join_date: '2023-02-01', contract_end: '2027-01-31' },
    { emp_code: 'JM-1008', full_name_ar: 'م. أحمد رضوان الشامي', full_name_en: 'Eng. Ahmad Radwan Al-Shami', national_id: '2381920485', nationality: 'أردني', is_saudi: 0, gender: 'M', email: 'ahmad.shami@jalmajd.com', phone: '0562233445', department_id: 3, job_title_ar: 'مهندس نظم وشبكات وأمن معلومات', job_title_en: 'Network & Security Engineer', basic_salary: 9500, housing_allowance: 2375, transport_allowance: 1000, other_allowance: 600, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA3380000201608010011008', annual_leave_balance: 19, shift_type: 'دوام صباحي', join_date: '2023-08-15', contract_end: '2027-08-14', iqama_expiry: '2026-10-10' },
    { emp_code: 'JM-1009', full_name_ar: 'فيصل سلطان الدوسري', full_name_en: 'Faisal Sultan Al-Dossary', national_id: '1047291845', nationality: 'سعودي', is_saudi: 1, gender: 'M', email: 'faisal.dossary@jalmajd.com', phone: '0549988776', department_id: 5, job_title_ar: 'مسؤول السلامة والصحة المهنية (HSE)', job_title_en: 'HSE Officer', basic_salary: 7800, housing_allowance: 1950, transport_allowance: 1000, other_allowance: 500, bank_name: 'مصرف الإنماء', bank_code: 'INMA', iban: 'SA5505000001047291845009', annual_leave_balance: 30, shift_type: 'دوام صباحي', join_date: '2023-11-01', contract_end: '2027-10-31' },
    { emp_code: 'JM-1010', full_name_ar: 'ريم محمد الدوسري', full_name_en: 'Reem Mohammed Al-Dossary', national_id: '1098273615', nationality: 'سعودية', is_saudi: 1, gender: 'F', email: 'reem.dossary@jalmajd.com', phone: '0534455667', department_id: 2, job_title_ar: 'أخصائية استقطاب وتوظيف وتدريب', job_title_en: 'Talent Acquisition Specialist', basic_salary: 7500, housing_allowance: 1875, transport_allowance: 1000, other_allowance: 400, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA1180000201608010011010', annual_leave_balance: 29, shift_type: 'دوام صباحي', join_date: '2024-03-01', contract_end: '2027-02-28' },
    { emp_code: 'JM-1011', full_name_ar: 'عمر فاروق البشير', full_name_en: 'Omar Farooq Al-Bashir', national_id: '2581928471', nationality: 'سوداني', is_saudi: 0, gender: 'M', email: 'omar.bashir@jalmajd.com', phone: '0567788990', department_id: 5, job_title_ar: 'منسق لوجستيات وسلاسل الإمداد', job_title_en: 'Logistics Coordinator', basic_salary: 6500, housing_allowance: 1625, transport_allowance: 800, other_allowance: 300, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA2280000201608010011011', annual_leave_balance: 14, shift_type: 'دوام صباحي', join_date: '2022-04-10', contract_end: '2027-04-09', iqama_expiry: '2027-06-15' },
    { emp_code: 'JM-1012', full_name_ar: 'مريم يوسف النجار', full_name_en: 'Mariam Yousef Al-Najjar', national_id: '2291827461', nationality: 'لبنانية', is_saudi: 0, gender: 'F', email: 'mariam.najjar@jalmajd.com', phone: '0541199882', department_id: 6, job_title_ar: 'مصممة جرافيك وواجهات رقمية (UI/UX)', job_title_en: 'UI/UX Designer', basic_salary: 8000, housing_allowance: 2000, transport_allowance: 1000, other_allowance: 500, bank_name: 'بنك ساب (SAB)', bank_code: 'SABB', iban: 'SA8845000002291827461012', annual_leave_balance: 23, shift_type: 'دوام صباحي', join_date: '2023-06-01', contract_end: '2027-05-31', iqama_expiry: '2027-01-20' },
    { emp_code: 'JM-1013', full_name_ar: 'عبدالله بن صالح القرني', full_name_en: 'Abdullah Saleh Al-Qarni', national_id: '1039281745', nationality: 'سعودي', is_saudi: 1, gender: 'M', email: 'abdullah.qarni@jalmajd.com', phone: '0553344556', department_id: 2, job_title_ar: 'منسق إداري وعلاقات حكومية (معقب)', job_title_en: 'Government Relations Coordinator', basic_salary: 6000, housing_allowance: 1500, transport_allowance: 800, other_allowance: 300, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA9980000201608010011013', annual_leave_balance: 27, shift_type: 'دوام صباحي', join_date: '2024-01-15', contract_end: '2027-01-14' },
    { emp_code: 'JM-1014', full_name_ar: 'كمال الدين حسن مرسي', full_name_en: 'Kamal Eldin Hassan Morsi', national_id: '2192837465', nationality: 'مصري', is_saudi: 0, gender: 'M', email: 'kamal.morsi@jalmajd.com', phone: '0502233114', department_id: 5, job_title_ar: 'مشرف تشغيل وصيانة المنشآت', job_title_en: 'Maintenance Supervisor', basic_salary: 5500, housing_allowance: 1375, transport_allowance: 600, other_allowance: 300, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA4480000201608010011014', annual_leave_balance: 12, shift_type: 'دوام صباحي', join_date: '2021-07-01', contract_end: '2027-06-30', iqama_expiry: '2026-09-15' },
    { emp_code: 'JM-1015', full_name_ar: 'هدى خالد العمري', full_name_en: 'Huda Khaled Al-Omari', national_id: '1082917402', nationality: 'سعودية', is_saudi: 1, gender: 'F', email: 'huda.omari@jalmajd.com', phone: '0537766554', department_id: 4, job_title_ar: 'أخصائية رواتب ومزايا وامتثال مالي', job_title_en: 'Payroll Specialist', basic_salary: 7200, housing_allowance: 1800, transport_allowance: 1000, other_allowance: 400, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA6680000201608010011015', annual_leave_balance: 30, shift_type: 'دوام صباحي', join_date: '2024-05-01', contract_end: '2027-04-30' }
  ];

  for (const emp of employees) {
    run(`
      INSERT INTO employees (
        emp_code, full_name_ar, full_name_en, national_id, nationality,
        is_saudi, gender, email, phone, department_id,
        job_title_ar, job_title_en, basic_salary, housing_allowance, transport_allowance,
        other_allowance, bank_name, bank_code, iban,
        annual_leave_balance, shift_type, join_date, contract_end, iqama_expiry
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      emp.emp_code, emp.full_name_ar, emp.full_name_en, emp.national_id, emp.nationality,
      emp.is_saudi, emp.gender, emp.email, emp.phone, emp.department_id,
      emp.job_title_ar, emp.job_title_en, emp.basic_salary, emp.housing_allowance, emp.transport_allowance,
      emp.other_allowance, emp.bank_name, emp.bank_code, emp.iban,
      emp.annual_leave_balance, emp.shift_type, emp.join_date, emp.contract_end, emp.iqama_expiry || null
    ]);
  }
}

function seedPenaltyRegulations() {
  const count = get('SELECT COUNT(*) AS count FROM penalty_regulations').count;
  if (count >= 50) return;

  run('DELETE FROM penalty_regulations');

  const regulations = [
    // مخالفات مواعيد العمل (1 - 16)
    { code: 'v1', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل لغاية (15) دقيقة دون إذن أو عذر مقبول إذا لم يترتب عليه تعطيل عمال آخرين', p1: 'إنذار كتابي', p2: 'خصم 5% من أجر اليوم', p3: 'خصم 10% من أجر اليوم', p4: 'خصم 20% من أجر اليوم' },
    { code: 'v2', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل لغاية (15) دقيقة دون إذن إذا ترتب عليه تعطيل عمال آخرين', p1: 'إنذار كتابي', p2: 'خصم 15% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم 50% من أجر اليوم' },
    { code: 'v3', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل من (15) دقيقة إلى (30) دقيقة دون إذن إذا لم يترتب عليه تعطيل', p1: 'خصم 10% من أجر اليوم', p2: 'خصم 15% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم نصف يوم' },
    { code: 'v4', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل من (15) دقيقة إلى (30) دقيقة إذا ترتب عليه تعطيل عمال آخرين', p1: 'خصم 25% من أجر اليوم', p2: 'خصم 50% من أجر اليوم', p3: 'خصم 75% من أجر اليوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v5', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل أكثر من (30) دقيقة لغاية (60) دقيقة دون عذر إذا لم يترتب عليه تعطيل', p1: 'خصم 25% من أجر اليوم', p2: 'خصم 50% من أجر اليوم', p3: 'خصم 75% من أجر اليوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v6', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل أكثر من (30) دقيقة لغاية (60) دقيقة إذا ترتب عليه تعطيل عمال آخرين', p1: 'خصم 30% من أجر اليوم', p2: 'خصم 50% من أجر اليوم', p3: 'خصم أجر يوم كامل', p4: 'خصم أجر يومين' },
    { code: 'v7', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل لمدة تزيد على ساعة دون إذن أو عذر مقبول', p1: 'إنذار كتابي', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر ثلاثة أيام' },
    { code: 'v8', cat: 'مخالفات مواعيد العمل', text: 'ترك العمل أو الانصراف قبل الميعاد دون إذن أو عذر بما لا يتجاوز (15) دقيقة', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v9', cat: 'مخالفات مواعيد العمل', text: 'ترك العمل أو الانصراف قبل الميعاد دون إذن بما يتجاوز (15) دقيقة', p1: 'خصم 10% من أجر اليوم', p2: 'خصم 25% من أجر اليوم', p3: 'خصم نصف يوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v10', cat: 'مخالفات مواعيد العمل', text: 'البقاء في أماكن العمل أو العودة إليها بعد انتهاء مواعيد العمل دون إذن مسبق', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v11', cat: 'مخالفات مواعيد العمل', text: 'الغياب دون إذن كتابي أو عذر مقبول لمدة يوم خلال السنة العقدية الواحدة', p1: 'خصم نصف يوم', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر ثلاثة أيام' },
    { code: 'v12', cat: 'مخالفات مواعيد العمل', text: 'الغياب المتصل دون إذن كتابي أو عذر مقبول من يومين إلى ستة أيام خلال السنة', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر أربعة أيام', p4: 'تأجيل الترقية أو الحرمان من العلاوة' },
    { code: 'v13', cat: 'مخالفات مواعيد العمل', text: 'الغياب المتصل دون إذن كتابي أو عذر مقبول من سبعة أيام إلى عشرة أيام خلال السنة', p1: 'خصم أجر أربعة أيام', p2: 'خصم أجر خمسة أيام', p3: 'تأجيل الترقية أو الحرمان من العلاوة', p4: 'فصل مع المكافأة إذا لم يتجاوز 30 يوماً' },
    { code: 'v14', cat: 'مخالفات مواعيد العمل', text: 'الغياب المتصل دون إذن كتابي أو عذر مقبول من أحد عشر يوماً إلى أربعة عشر يوماً', p1: 'خصم أجر خمسة أيام', p2: 'تأجيل الترقية أو الحرمان من العلاوة + إنذار بالفصل', p3: 'فصل من الخدمة مع المكافأة', p4: 'فصل من الخدمة' },
    { code: 'v15', cat: 'مخالفات مواعيد العمل', text: 'الانقطاع عن العمل دون سبب مشروع مدة تزيد على خمسة عشر يوماً متصلة (م 80)', p1: 'الفصل دون مكافأة أو إشعار', p2: '-', p3: '-', p4: '-' },
    { code: 'v16', cat: 'مخالفات مواعيد العمل', text: 'الغياب المتقطع دون سبب مشروع مدداً تزيد في مجموعها على ثلاثين يوماً (م 80)', p1: 'الفصل دون مكافأة أو إشعار', p2: '-', p3: '-', p4: '-' },

    // مخالفات السلوك والعمل (17 - 34)
    { code: 'v17', cat: 'مخالفات السلوك والعمل', text: 'التواجد دون مبرر في غير مكان العمل المخصص للعامل أثناء وقت الدوام', p1: 'خصم 10% من أجر اليوم', p2: 'خصم 25% من أجر اليوم', p3: 'خصم نصف يوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v18', cat: 'مخالفات السلوك والعمل', text: 'استقبال زائرين في غير أمور عمل المنشأة دون إذن مسبق', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 15% من أجر اليوم', p4: 'خصم 25% من أجر اليوم' },
    { code: 'v19', cat: 'مخالفات السلوك والعمل', text: 'استعمال آلات ومعدات المنشأة لأغراض شخصية دون إذن', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم نصف يوم' },
    { code: 'v20', cat: 'مخالفات السلوك والعمل', text: 'تدخل العامل دون وجه حق في أي عمل ليس في اختصاصه ومسؤولياته', p1: 'خصم نصف يوم', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر ثلاثة أيام' },
    { code: 'v21', cat: 'مخالفات السلوك والعمل', text: 'الخروج أو الدخول من غير الأبواب والمداخل المخصصة لذلك', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 15% من أجر اليوم', p4: 'خصم 25% من أجر اليوم' },
    { code: 'v22', cat: 'مخالفات السلوك والعمل', text: 'الإهمال في صيانة الأجهزة والآلات أو عدم العناية بنظافتها', p1: 'خصم نصف يوم', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر ثلاثة أيام' },
    { code: 'v23', cat: 'مخالفات السلوك والعمل', text: 'عدم وضع أدوات الإصلاح والصيانة في أماكنها المخصصة', p1: 'إنذار كتابي', p2: 'خصم 25% من أجر اليوم', p3: 'خصم نصف يوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v24', cat: 'مخالفات السلوك والعمل', text: 'تمزيق أو إتلاف إعلانات المنشأة أو التعليمات الإدارية المعلقة', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v25', cat: 'مخالفات السلوك والعمل', text: 'الإهمال أو التفريط في العهد العينية المسلمة إليه بحكم وظيفته', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v26', cat: 'مخالفات السلوك والعمل', text: 'الأكل في مكان العمل في غير الأوقات أو الأماكن المعدة لذلك', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 15% من أجر اليوم', p4: 'خصم 25% من أجر اليوم' },
    { code: 'v27', cat: 'مخالفات السلوك والعمل', text: 'النوم أثناء ساعات العمل المعتادة', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم نصف يوم' },
    { code: 'v28', cat: 'مخالفات السلوك والعمل', text: 'النوم أثناء العمل في الحالات والوظائف التي تستدعي يقظة مستمرة (أمن، رقابة)', p1: 'خصم نصف يوم', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر ثلاثة أيام' },
    { code: 'v29', cat: 'مخالفات السلوك والعمل', text: 'التسكع أو وجود العامل في غير موقع عمله وتعطيل زملائه', p1: 'خصم 10% من أجر اليوم', p2: 'خصم 25% من أجر اليوم', p3: 'خصم نصف يوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v30', cat: 'مخالفات السلوك والعمل', text: 'التلاعب في إثبات الحضور والانصراف أو تسجيل بصمة لزميل آخر', p1: 'خصم أجر يوم كامل', p2: 'خصم أجر يومين', p3: 'تأجيل الترقية أو الحرمان من العلاوة', p4: 'فصل من الخدمة مع المكافأة' },
    { code: 'v31', cat: 'مخالفات السلوك والعمل', text: 'عدم إطاعة الأوامر والتعليمات الإدارية العادية الخاصة بالعمل', p1: 'خصم 25% من أجر اليوم', p2: 'خصم نصف يوم', p3: 'خصم أجر يوم كامل', p4: 'خصم أجر يومين' },
    { code: 'v32', cat: 'مخالفات السلوك والعمل', text: 'التحريض على مخالفة الأوامر والتعليمات أو تعطيل سير العمل', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v33', cat: 'مخالفات السلوك والعمل', text: 'التدخين في الأماكن المحظورة داخل مقرات ومرافق المنشأة', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v34', cat: 'مخالفات السلوك والعمل', text: 'الإهمال أو التهاون في أداء العمل الذي قد ينشأ عنه ضرر بالممتلكات', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },

    // مخالفات السلوك العام (35 - 50)
    { code: 'v35', cat: 'مخالفات السلوك العام', text: 'التشاجر مع الزملاء أو مع الغير أو إحداث مشاغبات داخل المنشأة', p1: 'خصم أجر يوم كامل', p2: 'خصم أجر يومين', p3: 'خصم أجر ثلاثة أيام', p4: 'خصم أجر خمسة أيام' },
    { code: 'v36', cat: 'مخالفات السلوك العام', text: 'التمارض أو ادعاء الإصابة والمرض كذباً للتهرب من العمل', p1: 'خصم أجر يوم كامل', p2: 'خصم أجر يومين', p3: 'خصم أجر ثلاثة أيام', p4: 'خصم أجر خمسة أيام' },
    { code: 'v37', cat: 'مخالفات السلوك العام', text: 'الامتناع عن الكشف الطبي المقرر أو مخالفة التعليمات الطبية', p1: 'خصم أجر يوم كامل', p2: 'خصم أجر يومين', p3: 'خصم أجر ثلاثة أيام', p4: 'خصم أجر خمسة أيام' },
    { code: 'v38', cat: 'مخالفات السلوك العام', text: 'مخالفة التعليمات الصحية والإجراءات الوقائية المقررة بالمنشأة', p1: 'خصم نصف يوم', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر خمسة أيام' },
    { code: 'v39', cat: 'مخالفات السلوك العام', text: 'الكتابة على جدران المنشأة أو لصق إعلانات دون موافقة الإدارة', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم نصف يوم' },
    { code: 'v40', cat: 'مخالفات السلوك العام', text: 'رفض التفتيش الإداري عند الدخول أو الانصراف حال طلب ذلك', p1: 'خصم 25% من أجر اليوم', p2: 'خصم نصف يوم', p3: 'خصم أجر يوم كامل', p4: 'خصم أجر يومين' },
    { code: 'v41', cat: 'مخالفات السلوك العام', text: 'عدم تسليم المبالغ النقدية المحصلة لحساب المنشأة في مواعيدها', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v42', cat: 'مخالفات السلوك العام', text: 'الامتناع عن ارتداء ملابس وأدوات الوقاية والسلامة أثناء العمل', p1: 'إنذار كتابي', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر خمسة أيام' },
    { code: 'v43', cat: 'مخالفات السلوك العام', text: 'تعمد الخلوة أو ارتكاب سلوكيات مخالفة للآداب والذوق العام', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v44', cat: 'مخالفات السلوك العام', text: 'التلفظ أو الإيحاء بأقوال أو حركات تخدش الحياء العام', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v45', cat: 'مخالفات السلوك العام', text: 'الاعتداء على زملاء العمل بالقول أو الإشارة أو التهديد', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v46', cat: 'مخالفات السلوك العام', text: 'الاعتداء الجسدي بالضرب على أحد الزملاء أو المرؤوسين (م 80)', p1: 'فصل فوري دون مكافأة أو إشعار', p2: '-', p3: '-', p4: '-' },
    { code: 'v47', cat: 'مخالفات السلوك العام', text: 'الاعتداء على صاحب العمل أو المدير المسؤول أو أحد الرؤساء أثناء العمل (م 80)', p1: 'فصل فوري دون مكافأة أو إشعار', p2: '-', p3: '-', p4: '-' },
    { code: 'v48', cat: 'مخالفات السلوك العام', text: 'تقديم بلاغ أو شكوى كيدية ضد أحد منسوبي المنشأة', p1: 'خصم أجر ثلاثة أيام', p2: 'خصم أجر خمسة أيام', p3: 'فصل مع المكافأة', p4: '-' },
    { code: 'v49', cat: 'مخالفات السلوك العام', text: 'الامتناع عن الإدلاء بالشهادة أو الحضور أمام لجنة التحقيق الإداري', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v50', cat: 'مخالفات السلوك العام', text: 'عدم التقيد بالزي الرسمي المعتمد أو المظهر المهني اللائق بالمنشأة', p1: 'خصم أجر يوم كامل', p2: 'خصم أجر يومين', p3: 'خصم أجر ثلاثة أيام', p4: 'خصم أجر خمسة أيام' }
  ];

  for (const reg of regulations) {
    run(`
      INSERT INTO penalty_regulations (code, category, violation_text, penalty_1st, penalty_2nd, penalty_3rd, penalty_4th)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [reg.code, reg.cat, reg.text, reg.p1, reg.p2, reg.p3, reg.p4]);
  }
}

function seedIssuedPenalties() {
  const sampleDecisions = [
    {
      decision_no: 'DEC-2026-0012',
      emp_id: 4, // Mohammed Al-Otaibi
      violation_code: 'v1',
      violation_text: 'التأخر عن مواعيد الحضور للعمل لغاية (15) دقيقة دون إذن أو عذر مقبول إذا لم يترتب عليه تعطيل عمال آخرين',
      category: 'مخالفات مواعيد العمل',
      repetition_level: 'المرة الأولى',
      penalty_text: 'إنذار كتابي رسمي',
      deduction_type: 'إنذار كتابي',
      deduction_days: 0,
      incident_date: '2026-09-25',
      investigation_details: 'تأخر الموظف عن بدء الدوام الصباحي بمقدار 12 دقيقة دون إشعار مسبق. تمت مساءلته وتوجيه إنذار كتابي أول.',
      status: 'معتمد ومطبق',
      issued_by: 'خالد سعد الشهراني (مدير الموارد البشرية)'
    },
    {
      decision_no: 'DEC-2026-0013',
      emp_id: 14, // Kamal Eldin Morsi
      violation_code: 'v11',
      violation_text: 'الغياب دون إذن كتابي أو عذر مقبول لمدة يوم خلال السنة العقدية الواحدة',
      category: 'مخالفات مواعيد العمل',
      repetition_level: 'المرة الأولى',
      penalty_text: 'خصم أجر نصف يوم من الراتب',
      deduction_type: 'خصم راتب',
      deduction_days: 0.5,
      incident_date: '2026-09-22',
      investigation_details: 'تغيب الموظف عن العمل يوم 22 سبتمبر دون تقديم عذر طبي أو إجازة معتمدة. تقرر حسم نصف يوم وفق اللائحة.',
      status: 'معتمد ومطبق',
      issued_by: 'خالد سعد الشهراني (مدير الموارد البشرية)'
    },
    {
      decision_no: 'DEC-2026-0014',
      emp_id: 11, // Omar Bashir
      violation_code: 'v23',
      violation_text: 'عدم وضع أدوات الإصلاح والصيانة في أماكنها المخصصة',
      category: 'مخالفات السلوك والعمل',
      repetition_level: 'المرة الأولى',
      penalty_text: 'إنذار كتابي رسمي',
      deduction_type: 'إنذار كتابي',
      deduction_days: 0,
      incident_date: '2026-09-18',
      investigation_details: 'ترك معدات الفحص اللوجستي خارج مستودع المستلزمات مما عرضها للتلف الجزئي.',
      status: 'معتمد ومطبق',
      issued_by: 'عبدالرحمن علي عسيري (مدير العمليات)'
    }
  ];

  for (const dec of sampleDecisions) {
    run(`
      INSERT INTO penalties_issued (
        decision_no, emp_id, violation_code, violation_text, category,
        repetition_level, penalty_text, deduction_type, deduction_days,
        incident_date, investigation_details, status, issued_by, issued_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-5 days'))
    `, [
      dec.decision_no, dec.emp_id, dec.violation_code, dec.violation_text, dec.category,
      dec.repetition_level, dec.penalty_text, dec.deduction_type, dec.deduction_days,
      dec.incident_date, dec.investigation_details, dec.status, dec.issued_by
    ]);
  }
}

module.exports = {
  seedDatabase
};
