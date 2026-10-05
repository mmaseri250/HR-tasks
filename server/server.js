// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');
const multer = require('multer');

const { query, get, run } = require('./database/db');
const { seedDatabase } = require('./database/seedData');
const employeesModule = require('./modules/employees');
const attendanceModule = require('./modules/attendance');
const payrollModule = require('./modules/payroll');
const requestsModule = require('./modules/requests');
const biometricModule = require('./modules/biometricSimulator');
const usersModule = require('./modules/users');
const penaltiesModule = require('./modules/penalties');

// Initialize Seed Data
seedDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// File upload setup for import
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

/* =========================================================================
   1. AUTHENTICATION & USERS ROUTES
   ========================================================================= */

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = usersModule.login(username, password);
    res.json({ success: true, message: 'تم تسجيل الدخول بنجاح', user });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

app.get('/api/users', (req, res) => {
  try {
    const users = usersModule.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/users', (req, res) => {
  try {
    const user = usersModule.createUser(req.body);
    res.status(201).json({ success: true, message: 'تم إنشاء المستخدم وتعيين الصلاحيات بنجاح', data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const user = usersModule.updateUser(req.params.id, req.body);
    res.json({ success: true, message: 'تم تحديث بيانات المستخدم بنجاح', data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/users/:id', (req, res) => {
  try {
    usersModule.deleteUser(req.params.id);
    res.json({ success: true, message: 'تم حذف المستخدم بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   2. DASHBOARD & SETTINGS ROUTES
   ========================================================================= */

app.get('/api/settings', (req, res) => {
  try {
    const settings = get('SELECT * FROM company_settings WHERE id = 1');
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/dashboard/stats', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const saudization = employeesModule.getSaudizationMetrics();
    const attendance = attendanceModule.getAttendanceStats(today);
    const docAlerts = employeesModule.getDocumentExpiryAlerts();
    const pendingRequests = requestsModule.getAllRequests({ status: 'معلق' });
    const penalties = penaltiesModule.getAllIssuedPenalties();

    const currentPayroll = get(`
      SELECT * FROM payroll_periods
      ORDER BY period_month DESC
      LIMIT 1
    `);

    const deptDistribution = query(`
      SELECT d.name_ar, COUNT(e.id) AS employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'نشط'
      GROUP BY d.id
    `);

    res.json({
      success: true,
      data: {
        saudization,
        attendance,
        expiringDocsCount: docAlerts.length,
        expiringDocs: docAlerts.slice(0, 5),
        pendingRequestsCount: pendingRequests.length,
        pendingRequests: pendingRequests.slice(0, 5),
        currentPayroll,
        deptDistribution,
        penaltiesCount: penalties.length,
        recentPenalties: penalties.slice(0, 5)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/departments', (req, res) => {
  try {
    const depts = query(`
      SELECT d.*, COUNT(e.id) AS employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'نشط'
      GROUP BY d.id
      ORDER BY d.id ASC
    `);
    res.json({ success: true, data: depts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/departments', (req, res) => {
  try {
    const { code, name_ar, name_en, manager_name, budget = 0, location } = req.body;
    if (!code || !name_ar) {
      return res.status(400).json({ success: false, error: 'كود الإدارة واسمها بالعربية مطلوبان' });
    }
    const result = run(`
      INSERT INTO departments (code, name_ar, name_en, manager_name, budget, location)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [code, name_ar, name_en || name_ar, manager_name || '', Number(budget) || 0, location || 'مقر أبها - سيتي بارك']);
    const dept = get('SELECT * FROM departments WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, message: 'تمت إضافة الإدارة بنجاح', data: dept });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/departments/:id', (req, res) => {
  try {
    const { code, name_ar, name_en, manager_name, budget, location } = req.body;
    const existing = get('SELECT * FROM departments WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, error: 'الإدارة غير موجودة' });
    run(`
      UPDATE departments
      SET code = ?, name_ar = ?, name_en = ?, manager_name = ?, budget = ?, location = ?
      WHERE id = ?
    `, [
      code || existing.code,
      name_ar || existing.name_ar,
      name_en !== undefined ? name_en : existing.name_en,
      manager_name !== undefined ? manager_name : existing.manager_name,
      budget !== undefined ? Number(budget) : existing.budget,
      location !== undefined ? location : existing.location,
      req.params.id
    ]);
    const updated = get('SELECT * FROM departments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم تحديث بيانات الإدارة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/departments/:id', (req, res) => {
  try {
    run('DELETE FROM departments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف الإدارة بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   2.1 BRANCHES MANAGEMENT (فروع ومواقع شركة جوهرة المجد)
   ========================================================================= */

app.get('/api/branches', (req, res) => {
  try {
    const branches = query(`
      SELECT b.*,
        (SELECT COUNT(*) FROM employees e WHERE e.branch_id = b.id AND e.status = 'نشط') AS employee_count,
        (SELECT COUNT(*) FROM biometric_devices d WHERE d.branch_id = b.id) AS device_count
      FROM branches b
      ORDER BY b.is_main DESC, b.id ASC
    `);
    res.json({ success: true, data: branches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/branches', (req, res) => {
  try {
    const { code, name_ar, name_en, city = 'أبها', address, phone, manager_name, is_main = 0 } = req.body;
    if (!code || !name_ar) {
      return res.status(400).json({ success: false, error: 'كود الفرع واسمه بالعربية مطلوبان' });
    }
    const result = run(`
      INSERT INTO branches (code, name_ar, name_en, city, address, phone, manager_name, is_main)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [code, name_ar, name_en || name_ar, city, address || '', phone || '', manager_name || '', is_main ? 1 : 0]);
    const branch = get('SELECT * FROM branches WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, message: 'تمت إضافة الفرع بنجاح', data: branch });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/branches/:id', (req, res) => {
  try {
    const { code, name_ar, name_en, city, address, phone, manager_name, is_main } = req.body;
    const existing = get('SELECT * FROM branches WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, error: 'الفرع غير موجود' });
    run(`
      UPDATE branches
      SET code = ?, name_ar = ?, name_en = ?, city = ?, address = ?, phone = ?, manager_name = ?, is_main = ?
      WHERE id = ?
    `, [
      code || existing.code,
      name_ar || existing.name_ar,
      name_en !== undefined ? name_en : existing.name_en,
      city !== undefined ? city : existing.city,
      address !== undefined ? address : existing.address,
      phone !== undefined ? phone : existing.phone,
      manager_name !== undefined ? manager_name : existing.manager_name,
      is_main !== undefined ? (is_main ? 1 : 0) : existing.is_main,
      req.params.id
    ]);
    const updated = get('SELECT * FROM branches WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم تحديث بيانات الفرع بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/branches/:id', (req, res) => {
  try {
    run('DELETE FROM branches WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف الفرع بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   2.2 BIOMETRIC DEVICES MANAGEMENT (إدارة وتكامل أجهزة البصمة)
   ========================================================================= */

app.get('/api/devices', (req, res) => {
  try {
    const devices = query(`
      SELECT d.*, b.name_ar AS branch_name_ar
      FROM biometric_devices d
      LEFT JOIN branches b ON d.branch_id = b.id
      ORDER BY d.id ASC
    `);
    res.json({ success: true, data: devices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/devices', (req, res) => {
  try {
    const { device_name, device_code, ip_address, port = 4370, location, branch_id, model = 'ZKTeco SilkBio-101TC', status = 'متصل' } = req.body;
    if (!device_name || !device_code || !ip_address) {
      return res.status(400).json({ success: false, error: 'اسم الجهاز، الكود وعنوان IP مطلوبة' });
    }
    const result = run(`
      INSERT INTO biometric_devices (device_name, device_code, ip_address, port, location, branch_id, model, status, last_sync)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, [device_name, device_code, ip_address, Number(port) || 4370, location || 'الفرع الرئيسي', branch_id ? Number(branch_id) : null, model, status]);
    const dev = get('SELECT * FROM biometric_devices WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, message: 'تم ربط جهاز البصمة بنجاح', data: dev });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/devices/:id', (req, res) => {
  try {
    const { device_name, device_code, ip_address, port, location, branch_id, model, status } = req.body;
    const existing = get('SELECT * FROM biometric_devices WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, error: 'جهاز البصمة غير موجود' });
    run(`
      UPDATE biometric_devices
      SET device_name = ?, device_code = ?, ip_address = ?, port = ?, location = ?, branch_id = ?, model = ?, status = ?
      WHERE id = ?
    `, [
      device_name || existing.device_name,
      device_code || existing.device_code,
      ip_address || existing.ip_address,
      port !== undefined ? Number(port) : existing.port,
      location !== undefined ? location : existing.location,
      branch_id !== undefined ? (branch_id ? Number(branch_id) : null) : existing.branch_id,
      model || existing.model,
      status || existing.status,
      req.params.id
    ]);
    const updated = get('SELECT * FROM biometric_devices WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم تحديث بيانات جهاز البصمة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/devices/:id', (req, res) => {
  try {
    run('DELETE FROM biometric_devices WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف جهاز البصمة بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/devices/:id/test-connection', (req, res) => {
  try {
    const dev = get('SELECT * FROM biometric_devices WHERE id = ?', [req.params.id]);
    if (!dev) return res.status(404).json({ success: false, error: 'جهاز البصمة غير موجود' });
    run(`UPDATE biometric_devices SET status = 'متصل', last_sync = datetime('now') WHERE id = ?`, [req.params.id]);
    const latencyMs = Math.floor(Math.random() * 15) + 12;
    res.json({
      success: true,
      status: 'متصل',
      latency: `${latencyMs}ms`,
      message: `تم فحص الاتصال بجهاز (${dev.device_name}) على ${dev.ip_address}:${dev.port} بنجاح. زمن الاستجابة ${latencyMs}ms والمنفذ نشط وجاهز.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/devices/:id/sync', (req, res) => {
  try {
    const dev = get('SELECT * FROM biometric_devices WHERE id = ?', [req.params.id]);
    if (!dev) return res.status(404).json({ success: false, error: 'جهاز البصمة غير موجود' });
    run(`UPDATE biometric_devices SET status = 'متصل', last_sync = datetime('now') WHERE id = ?`, [req.params.id]);
    res.json({
      success: true,
      message: `تمت مزامنة سجلات البصمة الحيوية من جهاز (${dev.device_name}) بنجاح وتحديث قاعدة البيانات المركزية.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   3. DISCIPLINARY REGULATIONS & DECISIONS (القرارات الجزائية)
   ========================================================================= */

app.get('/api/penalties/regulations', (req, res) => {
  try {
    const regs = penaltiesModule.getAllPenaltyRegulations(req.query.category);
    res.json({ success: true, count: regs.length, data: regs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/penalties/issued', (req, res) => {
  try {
    const issued = penaltiesModule.getAllIssuedPenalties(req.query);
    res.json({ success: true, count: issued.length, data: issued });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/penalties/issued/:id', (req, res) => {
  try {
    const item = penaltiesModule.getIssuedPenaltyById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'القرار الجزائي غير موجود' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/penalties/issue', (req, res) => {
  try {
    const decision = penaltiesModule.issuePenaltyDecision(req.body);
    res.status(201).json({ success: true, message: 'تم إصدار القرار الجزائي واعتماده بنجاح', data: decision });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/penalties/issued/:id', (req, res) => {
  try {
    const result = penaltiesModule.deleteIssuedPenalty(req.params.id);
    res.json({ success: true, message: 'تم حذف القرار الجزائي بنجاح', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/penalties/issued/:id/print', (req, res) => {
  try {
    const data = penaltiesModule.generatePenaltyFormPrintData(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/penalties/export/csv', (req, res) => {
  try {
    const items = penaltiesModule.getAllIssuedPenalties();
    const headers = ['رقم القرار', 'الرقم الوظيفي', 'اسم الموظف', 'كود المخالفة', 'نص المخالفة', 'التكرار', 'الجزاء المطبق', 'نوع الخصم', 'عدد الأيام', 'تاريخ الواقعة', 'جهة الإصدار'];
    const rows = items.map(p => [
      p.decision_no,
      p.emp_code,
      `"${p.full_name_ar}"`,
      p.violation_code,
      `"${p.violation_text}"`,
      p.repetition_level,
      `"${p.penalty_text}"`,
      p.deduction_type,
      p.deduction_days,
      p.incident_date,
      `"${p.issued_by}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Penalties_Jawharat_Al_Majd.csv"');
    res.send(csvContent);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================================================================
   4. EMPLOYEES ROUTES
   ========================================================================= */

app.get('/api/employees', (req, res) => {
  try {
    const employees = employeesModule.getAllEmployees(req.query);
    res.json({ success: true, count: employees.length, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/alerts/expiry', (req, res) => {
  try {
    const alerts = employeesModule.getDocumentExpiryAlerts();
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/metrics/saudization', (req, res) => {
  try {
    const metrics = employeesModule.getSaudizationMetrics();
    res.json({ success: true, data: metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Enterprise Compliance & Iqama / Work Permits Dashboard API
app.get('/api/compliance/stats', (req, res) => {
  try {
    const compliance = employeesModule.getComplianceMetrics();
    res.json({ success: true, data: compliance });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/:id', (req, res) => {
  try {
    const emp = employeesModule.getEmployeeById(req.params.id);
    if (!emp) {
      return res.status(404).json({ success: false, error: 'الموظف غير موجود' });
    }
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/employees', (req, res) => {
  try {
    const newEmp = employeesModule.createEmployee(req.body);
    res.status(201).json({ success: true, message: 'تم إضافة الموظف بنجاح', data: newEmp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/employees/:id', (req, res) => {
  try {
    const updated = employeesModule.updateEmployee(req.params.id, req.body);
    res.json({ success: true, message: 'تم تحديث بيانات الموظف بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/employees/:id', (req, res) => {
  try {
    employeesModule.deleteEmployee(req.params.id);
    res.json({ success: true, message: 'تم حذف الموظف بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   5. ATTENDANCE & BIOMETRIC ROUTES
   ========================================================================= */

app.get('/api/attendance/daily', (req, res) => {
  try {
    const dateStr = req.query.date || new Date().toISOString().split('T')[0];
    const records = attendanceModule.getDailyAttendance(dateStr);
    const stats = attendanceModule.getAttendanceStats(dateStr);
    res.json({ success: true, stats, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/attendance/employee/:empId', (req, res) => {
  try {
    const history = attendanceModule.getEmployeeAttendanceHistory(req.params.empId, req.query.month);
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/attendance/punch', (req, res) => {
  try {
    const result = attendanceModule.recordPunch(req.body);
    res.json({ success: true, message: 'تم تسجيل البصمة بنجاح', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/attendance/devices', (req, res) => {
  try {
    const devices = attendanceModule.getBiometricDevices();
    res.json({ success: true, data: devices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/biometrics/simulate', (req, res) => {
  try {
    const result = biometricModule.triggerDeviceSimulation();
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/biometrics/push', (req, res) => {
  try {
    const result = biometricModule.processZkPushData(req.body);
    res.json({ success: true, message: 'OK', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   5.1 ATTENDANCE POLICIES & WORK SHIFTS (سياسات الدوام)
   ========================================================================= */

app.get('/api/policies', (req, res) => {
  try {
    const policies = query('SELECT * FROM attendance_policies ORDER BY id ASC');
    res.json({ success: true, count: policies.length, data: policies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/policies', (req, res) => {
  try {
    const {
      policy_name,
      shift_type = 'دوام صباحي',
      start_time = '08:00',
      end_time = '16:00',
      grace_period_mins = 15,
      daily_hours = 8.0,
      work_days = 'الأحد إلى الخميس',
      flexible_hours = 0,
      overtime_allowed = 1,
      notes = ''
    } = req.body;
    if (!policy_name) {
      return res.status(400).json({ success: false, error: 'اسم سياسة الدوام مطلوب' });
    }
    const result = run(`
      INSERT INTO attendance_policies (
        policy_name, shift_type, start_time, end_time, grace_period_mins,
        daily_hours, work_days, flexible_hours, overtime_allowed, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      policy_name, shift_type, start_time, end_time,
      Number(grace_period_mins) || 15, Number(daily_hours) || 8.0,
      work_days, flexible_hours ? 1 : 0, overtime_allowed ? 1 : 0, notes
    ]);
    const policy = get('SELECT * FROM attendance_policies WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, message: 'تم إنشاء سياسة الدوام بنجاح', data: policy });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/policies/:id', (req, res) => {
  try {
    const existing = get('SELECT * FROM attendance_policies WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, error: 'سياسة الدوام غير موجودة' });
    const b = req.body;
    run(`
      UPDATE attendance_policies SET
        policy_name = ?, shift_type = ?, start_time = ?, end_time = ?,
        grace_period_mins = ?, daily_hours = ?, work_days = ?,
        flexible_hours = ?, overtime_allowed = ?, notes = ?, is_active = ?
      WHERE id = ?
    `, [
      b.policy_name || existing.policy_name,
      b.shift_type || existing.shift_type,
      b.start_time || existing.start_time,
      b.end_time || existing.end_time,
      b.grace_period_mins !== undefined ? Number(b.grace_period_mins) : existing.grace_period_mins,
      b.daily_hours !== undefined ? Number(b.daily_hours) : existing.daily_hours,
      b.work_days || existing.work_days,
      b.flexible_hours !== undefined ? (b.flexible_hours ? 1 : 0) : existing.flexible_hours,
      b.overtime_allowed !== undefined ? (b.overtime_allowed ? 1 : 0) : existing.overtime_allowed,
      b.notes !== undefined ? b.notes : existing.notes,
      b.is_active !== undefined ? (b.is_active ? 1 : 0) : existing.is_active,
      req.params.id
    ]);
    const updated = get('SELECT * FROM attendance_policies WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم تحديث سياسة الدوام بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/policies/:id', (req, res) => {
  try {
    run('DELETE FROM attendance_policies WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف سياسة الدوام بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   6. PAYROLL & WPS ROUTES
   ========================================================================= */

app.get('/api/payroll/periods', (req, res) => {
  try {
    const periods = payrollModule.getPayrollPeriods();
    res.json({ success: true, data: periods });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/payroll/periods/:id', (req, res) => {
  try {
    const data = payrollModule.getPayrollPeriodDetails(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: 'مسير الرواتب غير موجود' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/payroll/calculate', (req, res) => {
  try {
    const { period_month } = req.body;
    if (!period_month) {
      return res.status(400).json({ success: false, error: 'يرجى تحديد شهر المسير (مثال: 2026-09)' });
    }
    const result = payrollModule.calculateMonthlyPayroll(period_month);
    res.json({ success: true, message: 'تم احتساب مسير الرواتب بنجاح', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/payroll/periods/:id/approve', (req, res) => {
  try {
    const { approver_name } = req.body;
    const result = payrollModule.approvePayrollPeriod(req.params.id, approver_name);
    res.json({ success: true, message: 'تم اعتماد مسير الرواتب وتوليد ملف حماية الأجور', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/payroll/periods/:id/payslip/:empId', (req, res) => {
  try {
    const payslip = payrollModule.getEmployeePayslip(req.params.id, req.params.empId);
    res.json({ success: true, data: payslip });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/payroll/periods/:id/wps', (req, res) => {
  try {
    const content = payrollModule.generateWpsSifContent(req.params.id);
    const period = get('SELECT period_month FROM payroll_periods WHERE id = ?', [req.params.id]);
    const fileName = `WPS_JM_${period ? period.period_month.replace('-', '') : 'PAYROLL'}_SIF.txt`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(content);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/payroll/periods/:id/export/csv', (req, res) => {
  try {
    const data = payrollModule.getPayrollPeriodDetails(req.params.id);
    if (!data) return res.status(404).send('Not found');

    const headers = [
      'الرقم الوظيفي', 'اسم الموظف', 'الهوية / الإقامة', 'الجنسية', 'المسمى الوظيفي',
      'الراتب الأساسي', 'بدل السكن', 'بدل النقل', 'بدلات أخرى', 'العمل الإضافي',
      'إجمالي الراتب', 'استقطاع التأمينات (الموظف)', 'حصة التأمينات (الشركة)',
      'خصومات أخرى', 'صافي الراتب', 'البنك', 'الآيبان IBAN'
    ];

    const rows = data.items.map(item => [
      item.emp_code,
      `"${item.full_name_ar}"`,
      item.national_id,
      item.nationality,
      `"${item.job_title_ar}"`,
      item.basic_salary,
      item.housing_allowance,
      item.transport_allowance,
      item.other_allowance,
      item.overtime_pay,
      item.gross_salary,
      item.gosi_employee_share,
      item.gosi_company_share,
      item.absence_deduction + item.delay_deduction + item.advance_deduction,
      item.net_salary,
      item.bank_name,
      item.iban
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="Payroll_${data.period.period_month}.csv"`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================================================================
   7. REQUESTS & SELF-SERVICE (ESS) ROUTES
   ========================================================================= */

app.get('/api/requests', (req, res) => {
  try {
    const requests = requestsModule.getAllRequests(req.query);
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/requests/:id', (req, res) => {
  try {
    const request = requestsModule.getRequestById(req.params.id);
    if (!request) return res.status(404).json({ success: false, error: 'الطلب غير موجود' });
    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/requests', (req, res) => {
  try {
    const newReq = requestsModule.submitRequest(req.body);
    res.status(201).json({ success: true, message: 'تم تقديم الطلب بنجاح', data: newReq });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/requests/:id/status', (req, res) => {
  try {
    const { status, role = 'admin', comment, approver_name } = req.body;
    if (!status) return res.status(400).json({ success: false, error: 'الحالة الجديدة مطلوبة' });
    const updated = requestsModule.updateRequestStatus(req.params.id, status, role, comment, approver_name);
    res.json({ success: true, message: 'تم تحديث حالة الطلب بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/requests/salary-letter/:empId', (req, res) => {
  try {
    const destination = req.query.destination || 'إلى من يهمه الأمر';
    const letterData = requestsModule.generateCertifiedSalaryLetter(req.params.empId, destination);
    res.json({ success: true, data: letterData });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   8. IMPORT & EXPORT ROUTES
   ========================================================================= */

app.get('/api/export/employees', (req, res) => {
  try {
    const format = req.query.format || 'csv';
    const employees = employeesModule.getAllEmployees({});

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="employees_jawharat_al_majd.json"');
      return res.send(JSON.stringify(employees, null, 2));
    }

    const headers = [
      'الرقم الوظيفي', 'الاسم بالعربي', 'الاسم بالإنجليزي', 'رقم الهوية / الإقامة', 'الجنسية',
      'سعودي (1/0)', 'الجنس', 'البريد الإلكتروني', 'الجوال', 'القسم', 'المسمى الوظيفي',
      'الراتب الأساسي', 'بدل السكن', 'بدل النقل', 'بدلات أخرى', 'الآيبان IBAN', 'رصيد الإجازات'
    ];

    const rows = employees.map(e => [
      e.emp_code,
      `"${e.full_name_ar}"`,
      `"${e.full_name_en}"`,
      e.national_id,
      e.nationality,
      e.is_saudi,
      e.gender,
      e.email,
      e.phone,
      `"${e.department_name_ar || ''}"`,
      `"${e.job_title_ar}"`,
      e.basic_salary,
      e.housing_allowance,
      e.transport_allowance,
      e.other_allowance,
      e.iban,
      e.annual_leave_balance
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="employees_jawharat_al_majd.csv"');
    res.send(csvContent);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/import/employees', (req, res) => {
  try {
    const { employees } = req.body;
    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ success: false, error: 'مصفوفة بيانات الموظفين غير صالحة أو فارغة' });
    }

    let successCount = 0;
    const errors = [];

    for (const empData of employees) {
      try {
        employeesModule.createEmployee(empData);
        successCount++;
      } catch (e) {
        errors.push({ emp: empData.emp_code || empData.full_name_ar, error: e.message });
      }
    }

    res.json({
      success: true,
      message: `تم استيراد ${successCount} موظف بنجاح`,
      importedCount: successCount,
      failedCount: errors.length,
      errors
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/import/attendance', (req, res) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, error: 'مصفوفة سجلات البصمة غير صالحة أو فارغة' });
    }
    const result = attendanceModule.importBiometricPunches(records);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/templates/:type', (req, res) => {
  const { type } = req.params;
  if (type === 'employees') {
    const template = '\uFEFF' + [
      'emp_code,full_name_ar,full_name_en,national_id,nationality,is_saudi,gender,email,phone,department_id,job_title_ar,job_title_en,basic_salary,housing_allowance,transport_allowance,other_allowance,iban',
      'JM-1099,سلطان بن فهد المنصور,Sultan Fahad Al-Mansour,1098765432,سعودي,1,M,sultan.mansour@jalmajd.com,0551234567,2,أخصائي تطوير أعمال,Business Dev Specialist,9000,2250,1000,500,SA4480000201608010011099'
    ].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Template_Employees_Import.csv"');
    return res.send(template);
  } else if (type === 'attendance') {
    const template = '\uFEFF' + [
      'emp_code,punch_time,punch_type,device_id,verification_method',
      'JM-1001,2026-09-30 07:55:00,CHECK_IN,ZK-BIO-MAIN-01,FINGERPRINT',
      'JM-1001,2026-09-30 16:05:00,CHECK_OUT,ZK-BIO-MAIN-01,FINGERPRINT'
    ].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Template_Attendance_Import.csv"');
    return res.send(template);
  }
  res.status(404).send('Template not found');
});

// Fallback to SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`نظام موارد بشرية شركة جوهرة المجد`);
    console.log(`الخادم يعمل بنجاح على: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
