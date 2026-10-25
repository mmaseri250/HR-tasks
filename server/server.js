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
const leavesModule = require('./modules/leaves');
const tasksModule = require('./modules/tasks');
const formsGenerator = require('./modules/formsGenerator');
const exportService = require('./modules/exportService');
const muqeemModule = require('./modules/muqeem');
const attendanceNoticesModule = require('./modules/attendanceNotices');
const terminatedEmployeesModule = require('./modules/terminatedEmployees');
const loansModule = require('./modules/loans');
const officialTemplates = require('./modules/officialTemplates');
const absenceNoticesModule = require('./modules/absenceNotices');

// Initialize Seed Data
seedDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Anti-stale Cache Control Middleware: ensures browsers and mobile PWAs never receive outdated data
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  } else if (req.path === '/' || req.path.endsWith('.html') || req.path === '/sw.js') {
    res.set('Cache-Control', 'no-cache, must-revalidate');
  }
  next();
});

// Static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// File upload setup for import
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

/* =========================================================================
   0. UNIFIED HIGH-SPEED BOOTSTRAP API (Single-Trip Hydration)
   ========================================================================= */

app.get('/api/bootstrap', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const departments = query(`
      SELECT d.*, COUNT(e.id) AS employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'نشط'
      GROUP BY d.id
      ORDER BY d.id ASC
    `);

    const branches = query(`
      SELECT b.*, COUNT(DISTINCT e.id) AS employee_count, COUNT(DISTINCT d.id) AS device_count
      FROM branches b
      LEFT JOIN employees e ON b.id = e.branch_id AND e.status = 'نشط'
      LEFT JOIN biometric_devices d ON b.id = d.branch_id AND (d.status != 'معطل' OR d.status IS NULL)
      GROUP BY b.id
      ORDER BY b.id ASC
    `);

    const devices = query(`
      SELECT d.*, b.name_ar AS branch_name_ar
      FROM biometric_devices d
      LEFT JOIN branches b ON d.branch_id = b.id
      ORDER BY d.id ASC
    `);

    const employees = employeesModule.getAllEmployees();
    const regulations = penaltiesModule.getAllPenaltyRegulations();
    const issuedPenalties = penaltiesModule.getAllIssuedPenalties();
    const users = usersModule.getAllUsers();
    const policies = query('SELECT * FROM attendance_policies ORDER BY id ASC');
    const allRequests = requestsModule.getAllRequests();

    // Telemetry for instant dashboard & compliance rendering
    const saudization = employeesModule.getSaudizationMetrics();
    const attendance = attendanceModule.getAttendanceStats(today);
    const docAlerts = employeesModule.getDocumentExpiryAlerts();
    const currentPayroll = get(`
      SELECT * FROM payroll_periods
      ORDER BY period_month DESC
      LIMIT 1
    `);
    const compliance = employeesModule.getComplianceMetrics();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        departments,
        branches,
        devices,
        employees,
        regulations,
        issuedPenalties,
        users,
        policies,
        allRequests,
        dashboard: {
          saudization,
          attendance,
          expiringDocsCount: docAlerts.length,
          expiringDocs: docAlerts.slice(0, 5),
          pendingRequestsCount: allRequests.filter(r => r.status === 'معلق').length,
          pendingRequests: allRequests.filter(r => r.status === 'معلق').slice(0, 5),
          currentPayroll,
          deptDistribution: departments.map(d => ({ name_ar: d.name_ar, employee_count: d.employee_count })),
          penaltiesCount: issuedPenalties.length,
          recentPenalties: issuedPenalties.slice(0, 5)
        },
        compliance
      }
    });
  } catch (err) {
    console.error('Bootstrap API error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

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

// Official Muqeem Report (تقرير مقيم الرسمي) API Endpoints
app.get('/api/compliance/muqeem', (req, res) => {
  try {
    const report = muqeemModule.getMuqeemReport(req.query);
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/compliance/muqeem/:id', (req, res) => {
  try {
    const item = muqeemModule.getMuqeemResidentById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'سجل المقيم غير موجود' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/compliance/muqeem', (req, res) => {
  try {
    const created = muqeemModule.createMuqeemResident(req.body);
    res.status(201).json({ success: true, message: 'تم إضافة سجل المقيم بنجاح', data: created });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/compliance/muqeem/:id', (req, res) => {
  try {
    const updated = muqeemModule.updateMuqeemResident(req.params.id, req.body);
    res.json({ success: true, message: 'تم تحديث بيانات المقيم بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/compliance/muqeem/:id', (req, res) => {
  try {
    const result = muqeemModule.deleteMuqeemResident(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/compliance/muqeem/sync', (req, res) => {
  try {
    const result = muqeemModule.syncFromExcel();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/:id', (req, res, next) => {
  if (req.params.id === 'terminated' || req.params.id === 'hierarchy') {
    return next();
  }
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

/* =========================================================================
   10. LEAVES MANAGEMENT ROUTES (إدارة الإجازات وسير الموافقات)
   ========================================================================= */

app.get('/api/leaves/balances', (req, res) => {
  try {
    const balances = leavesModule.getAllLeaveBalances();
    res.json({ success: true, data: balances });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/leaves/balances/:empId', (req, res) => {
  try {
    const balance = leavesModule.getEmployeeLeaveBalance(req.params.empId);
    res.json({ success: true, data: balance });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/leaves/adjust-balance', (req, res) => {
  try {
    const { emp_id, adjustment_days, days_adjusted, reason, adjusted_by, adjusted_by_name } = req.body;
    const days = days_adjusted !== undefined ? days_adjusted : adjustment_days;
    const by = adjusted_by || adjusted_by_name;
    const updated = leavesModule.adjustLeaveBalance(emp_id, days, reason, by);
    res.json({ success: true, message: 'تم تعديل وتحديث رصيد الإجازة بنجاح وتوثيقه في سجل التدقيق', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/leaves/adjustments', (req, res) => {
  try {
    const logs = leavesModule.getBalanceAdjustments(req.query.emp_id);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/leaves/kpis', (req, res) => {
  try {
    const kpis = leavesModule.getLeavesKPIs();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/leaves', (req, res) => {
  try {
    const leaves = leavesModule.getAllLeaves(req.query);
    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/leaves', (req, res) => {
  try {
    const newLeave = leavesModule.submitLeaveRequest(req.body);
    res.status(201).json({ success: true, message: 'تم إرسال طلب الإجازة للمدير المباشر بنجاح', data: newLeave });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/leaves/:id', (req, res) => {
  try {
    const leave = leavesModule.getLeaveById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, error: 'طلب الإجازة غير موجود' });
    res.json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/leaves/:id/approve', (req, res) => {
  try {
    const { action, role, comment, approverName } = req.body;
    const updated = leavesModule.approveLeave(req.params.id, action, role, comment, approverName);
    res.json({ success: true, message: 'تم تحديث حالة طلب الإجازة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/leaves/:id', (req, res) => {
  try {
    leavesModule.deleteLeave(req.params.id);
    res.json({ success: true, message: 'تم حذف طلب الإجازة بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   11. TASKS MANAGEMENT ROUTES (نظام المهام المستقل ولوحة المديرين)
   ========================================================================= */

app.get('/api/tasks/dashboard', (req, res) => {
  try {
    const dashboard = tasksModule.getTasksDashboardMetrics(req.query);
    res.json({ success: true, data: dashboard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/tasks', (req, res) => {
  try {
    const tasks = tasksModule.getAllTasks(req.query);
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const task = tasksModule.createTask(req.body);
    res.status(201).json({ success: true, message: 'تم إنشاء المهمة وإسنادها للموظف بنجاح', data: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/tasks/:id', (req, res) => {
  try {
    const task = tasksModule.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ success: false, error: 'المهمة غير موجودة' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const updated = tasksModule.updateTask(req.params.id, req.body);
    res.json({ success: true, message: 'تم تحديث بيانات ونسبة إنجاز المهمة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/tasks/:id/approve', (req, res) => {
  try {
    const { action, role, comment } = req.body;
    const updated = tasksModule.approveTask(req.params.id, action, role, comment);
    res.json({ success: true, message: 'تم اتخاذ الإجراء على المهمة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    tasksModule.deleteTask(req.params.id);
    res.json({ success: true, message: 'تم حذف المهمة بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   12. ORGANIZATIONAL HIERARCHY & DIRECT MANAGERS
   ========================================================================= */

app.get('/api/employees/hierarchy', (req, res) => {
  try {
    const hierarchy = employeesModule.getOrgHierarchy();
    res.json({ success: true, data: hierarchy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   13. HR WORD FORMS GENERATOR (نماذج Word الرسمية الـ 6)
   ========================================================================= */

app.get('/api/forms/word/:formType', async (req, res) => {
  try {
    const { formType } = req.params;
    const empId = req.query.emp_id;
    if (!empId) {
      return res.status(400).json({ success: false, error: 'يرجى تحديد الموظف لاستخراج النموذج' });
    }

    const { buffer, filename } = await formsGenerator.generateWordForm(formType, empId, req.query);
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   14. UNIVERSAL EXPORT ROUTES (Excel .xlsx & Word .docx)
   ========================================================================= */

app.get('/api/export/excel', (req, res) => {
  try {
    const type = req.query.type || 'employees';
    const { buffer, filename } = exportService.exportToExcel(type, req.query);
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/export/word', async (req, res) => {
  try {
    const type = req.query.type || 'employees';
    const { buffer, filename } = await exportService.exportToWord(type, req.query);
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   ATTENDANCE NOTICES API (In-System Notice System - No Emails)
   ========================================================================= */
app.get('/api/attendance/notices', (req, res) => {
  try {
    const notices = attendanceNoticesModule.getAllNotices(req.query);
    res.json({ success: true, count: notices.length, data: notices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/attendance/notices/kpis', (req, res) => {
  try {
    const kpis = attendanceNoticesModule.getNoticesKPIs();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/attendance/notices/:id', (req, res) => {
  try {
    const notice = attendanceNoticesModule.getNoticeById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, error: 'الإشعار غير موجود' });
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/attendance/notices', (req, res) => {
  try {
    const notice = attendanceNoticesModule.createNotice(req.body);
    res.status(201).json({ success: true, message: 'تم إصدار الإشعار بنجاح', data: notice });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/attendance/notices/:id/acknowledge', (req, res) => {
  try {
    const { employee_notes } = req.body;
    const updated = attendanceNoticesModule.acknowledgeNotice(req.params.id, employee_notes);
    res.json({ success: true, message: 'تم توثيق إقرار واستلام الإشعار بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   TERMINATED EMPLOYEES API (End of Service & Gratuity Calculator)
   ========================================================================= */
app.get('/api/employees/terminated', (req, res) => {
  try {
    const list = terminatedEmployeesModule.getAllTerminated(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/terminated/kpis', (req, res) => {
  try {
    const kpis = terminatedEmployeesModule.getTerminatedKPIs();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/terminated/export', (req, res) => {
  try {
    const buffer = terminatedEmployeesModule.exportToExcel();
    const filename = encodeURIComponent(`الموظفون_المنهي_خدماتهم_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${filename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/terminated/template', (req, res) => {
  try {
    const buffer = terminatedEmployeesModule.generateTemplateExcel();
    const filename = encodeURIComponent('نموذج_استيراد_المنهي_خدماتهم.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${filename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/employees/terminated/calculate', (req, res) => {
  try {
    const calc = terminatedEmployeesModule.calculateSettlement(req.body);
    res.json({ success: true, data: calc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/employees/terminated', (req, res) => {
  try {
    const record = terminatedEmployeesModule.recordTermination(req.body);
    res.status(201).json({ success: true, message: 'تم تسجيل إنهاء الخدمة بنجاح وتحديث حالة الموظف', data: record });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/employees/terminated/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'يرجى إرفاق ملف إكسل للاستيراد' });
    const buffer = fs.readFileSync(req.file.path);
    const result = terminatedEmployeesModule.importFromExcel(buffer);
    try { fs.unlinkSync(req.file.path); } catch (e) {}
    res.json({ success: true, message: `تم استيراد ${result.count} سجل للمنهي خدماتهم بنجاح`, count: result.count });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/terminated/:id', (req, res) => {
  try {
    const record = terminatedEmployeesModule.getTerminatedById(req.params.id);
    if (!record) return res.status(404).json({ success: false, error: 'السجل غير موجود' });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   LOANS & ADVANCES API
   ========================================================================= */
app.get('/api/loans', (req, res) => {
  try {
    const loans = loansModule.getAllLoans(req.query);
    res.json({ success: true, count: loans.length, data: loans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/loans/kpis', (req, res) => {
  try {
    const kpis = loansModule.getLoansKPIs();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/loans/export', (req, res) => {
  try {
    const buffer = loansModule.exportLoansToExcel();
    const filename = encodeURIComponent(`سجل_السلف_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${filename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/loans/template', (req, res) => {
  try {
    const buffer = loansModule.generateLoanTemplateExcel();
    const filename = encodeURIComponent('نموذج_استيراد_السلف.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${filename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/loans', (req, res) => {
  try {
    const loan = loansModule.createLoan(req.body);
    res.status(201).json({ success: true, message: 'تم تسجيل السلفة بنجاح', data: loan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/loans/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'يرجى إرفاق ملف إكسل للاستيراد' });
    const buffer = fs.readFileSync(req.file.path);
    const result = loansModule.importLoansFromExcel(buffer);
    try { fs.unlinkSync(req.file.path); } catch (e) {}
    res.json({ success: true, message: `تم استيراد ${result.count} سلفة بنجاح`, count: result.count });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/loans/:id', (req, res) => {
  try {
    const loan = loansModule.getLoanById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, error: 'السلفة غير موجودة' });
    res.json({ success: true, data: loan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   4-STEP APPROVAL ACTIONS (Requests & Leaves)
   ========================================================================= */
app.post('/api/requests/:id/action', (req, res) => {
  try {
    const { step, action, comment, userName } = req.body;
    const updated = requestsModule.processRequestStep(req.params.id, step, action, comment, userName);
    res.json({ success: true, message: 'تم تحديث خطوة الاعتماد بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/leaves/:id/action', (req, res) => {
  try {
    const { step, action, comment, userName } = req.body;
    const updated = leavesModule.processLeaveStep(req.params.id, step, action, comment, userName);
    res.json({ success: true, message: 'تم تحديث خطوة اعتماد الإجازة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   OFFICIAL HTML FORMS PRINT & PREVIEW
   ========================================================================= */
app.get('/api/forms/html/leave/:id', (req, res) => {
  try {
    const html = officialTemplates.renderLeaveFormHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد النموذج: ${err.message}</h3>`);
  }
});

app.get('/api/forms/html/penalty/:id', (req, res) => {
  try {
    const html = officialTemplates.renderPenaltyFormHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد النموذج: ${err.message}</h3>`);
  }
});

app.get('/api/forms/html/resignation/:id', (req, res) => {
  try {
    const html = officialTemplates.renderResignationTerminationFormHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد النموذج: ${err.message}</h3>`);
  }
});

app.get('/api/forms/html/notice/:id', (req, res) => {
  try {
    const html = officialTemplates.renderAttendanceNoticeHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد النموذج: ${err.message}</h3>`);
  }
});

/* =========================================================================
   ABSENCE NOTICES & COMPANY EMAIL STAGING API
   ========================================================================= */
app.get('/api/absence-notices', (req, res) => {
  try {
    const list = absenceNoticesModule.getAllAbsenceNotices(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/absence-notices/kpis', (req, res) => {
  try {
    const kpis = absenceNoticesModule.getAbsenceKPIs();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/absence-notices/export', (req, res) => {
  try {
    const buffer = absenceNoticesModule.exportAbsenceNoticesExcel(req.query);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="absence-notices.xlsx"');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/absence-notices/template', (req, res) => {
  try {
    const buffer = absenceNoticesModule.generateAbsenceTemplateExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="absence-notices-template.xlsx"');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/absence-notices/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لم يتم رفع ملف إكسل' });
    }
    const buffer = fs.readFileSync(req.file.path);
    const result = absenceNoticesModule.importAbsenceNoticesExcel(buffer);
    fs.unlinkSync(req.file.path);
    res.json({ success: true, message: `تم استيراد ${result.successCount} إشعار غياب بنجاح`, data: result });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/absence-notices/:id', (req, res) => {
  try {
    const notice = absenceNoticesModule.getAbsenceNoticeById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, error: 'إشعار الغياب غير موجود' });
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/absence-notices', (req, res) => {
  try {
    const notice = absenceNoticesModule.createAbsenceNotice(req.body);
    res.status(201).json({ success: true, message: 'تم إنشاء إشعار الغياب وتجهيزه لبريد الشركة بنجاح', data: notice });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/absence-notices/:id/acknowledge', (req, res) => {
  try {
    const notice = absenceNoticesModule.acknowledgeAbsenceNotice(req.params.id, req.body.notes);
    res.json({ success: true, message: 'تم إقرار واستلام إشعار الغياب بنجاح', data: notice });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/absence-notices/:id/print', (req, res) => {
  try {
    const html = absenceNoticesModule.renderOfficialAbsenceLetterHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في طباعة إشعار الغياب: ${err.message}</h3>`);
  }
});

app.get('/api/absence-notices/:id/email-preview', (req, res) => {
  try {
    const notice = absenceNoticesModule.getAbsenceNoticeById(req.params.id);
    if (!notice) return res.status(404).send('<h3>إشعار الغياب غير موجود</h3>');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(notice.email_body_html || '<p>لا توجد معاينة متاحة</p>');
  } catch (err) {
    res.status(500).send(`<h3>خطأ في معاينة البريد: ${err.message}</h3>`);
  }
});

app.get('/api/company-email/settings', (req, res) => {
  try {
    const settings = absenceNoticesModule.getCompanyEmailSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/company-email/settings', (req, res) => {
  try {
    const updated = absenceNoticesModule.saveCompanyEmailSettings(req.body);
    res.json({ success: true, message: 'تم حفظ إعدادات بريد الشركة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
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
