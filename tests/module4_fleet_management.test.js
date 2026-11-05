/**
 * tests/module4_fleet_management.test.js
 * Comprehensive Verification Suite for Module 4: Fleet & Vehicle Management (Tamm Platform)
 * Jawharat Al-Majd HRMS — Saudi Labor Law & Tamm Integration Ready
 */

const assert = require('node:assert');
const { query, get, run } = require('../server/database/db');
const fleetService = require('../server/modules/fleetService');

console.log('================================================================');
console.log('🧪 RUNNING MODULE 4: FLEET & VEHICLE MANAGEMENT (TAMM) TEST');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// Clean any pre-existing vehicles from tests
run('DELETE FROM vehicle_custody_logs');
run('DELETE FROM vehicle_documents');
run('DELETE FROM vehicles');

// --- TEST GROUP 1: Clean Initial State & Zero Metrics ---
console.log('--- TEST GROUP 1: Clean Initial State & Zero Metrics ---');

test('Clean initial state returns 0 vehicles and zero Tamm alarms', () => {
  const initialVehicles = fleetService.getVehicles();
  assert(Array.isArray(initialVehicles), 'Fleet should return an array');
  assert.strictEqual(initialVehicles.length, 0, 'Clean production state must have 0 vehicles');

  const kpis = fleetService.getFleetKpis();
  assert.strictEqual(kpis.total_vehicles, 0, 'KPI total_vehicles must be 0');
  assert.strictEqual(kpis.active_vehicles, 0, 'KPI active_vehicles must be 0');
  assert.strictEqual(kpis.assigned_vehicles, 0, 'KPI assigned_vehicles must be 0');
  assert.strictEqual(kpis.available_vehicles, 0, 'KPI available_vehicles must be 0');
  assert.strictEqual(kpis.total_alerts, 0, 'KPI total_alerts must be 0');
  assert.strictEqual(kpis.compliance_rate, 0, 'KPI compliance_rate must be 0 when empty');
});

// --- TEST GROUP 2: Fleet CRUD Operations & Validations ---
console.log('\n--- TEST GROUP 2: Fleet CRUD & Validations ---');

const testVin = 'TEST-VIN-' + Date.now();
const testPlate = 'ق ر ط 9988';
let createdVehicle = null;

test('createVehicle adds a new vehicle and prevents duplicate plates/VINs', () => {
  createdVehicle = fleetService.createVehicle({
    plate_number_ar: testPlate,
    plate_number_en: '9988 TRQ',
    make: 'نيسان',
    model: 'باترول سفاري',
    year: 2025,
    color: 'أبيض لؤلؤي',
    vin_serial: testVin,
    vehicle_type: 'خصوصي',
    istimara_expiry: '2028-01-01',
    fahas_expiry: '2027-01-01',
    insurance_company: 'التعاونية للتأمين',
    insurance_policy_no: 'TAW-2026-TEST',
    insurance_expiry: '2028-01-01',
    odometer: 1200,
    status: 'متاح',
    tamm_status: 'ساري'
  });

  assert(createdVehicle.id > 0, 'New vehicle must have valid ID');
  assert.strictEqual(createdVehicle.plate_number_ar, testPlate);
  assert.strictEqual(createdVehicle.vin_serial, testVin);
  assert.strictEqual(createdVehicle.status, 'متاح');

  // Verify duplicate prevention
  assert.throws(() => {
    fleetService.createVehicle({
      plate_number_ar: testPlate,
      make: 'تويوتا',
      model: 'كامري',
      year: 2024
    });
  }, /مسجل مسبقاً/);
});

test('updateVehicle updates specifications and Tamm attributes', () => {
  const updated = fleetService.updateVehicle(createdVehicle.id, {
    odometer: 2500,
    color: 'رمادي غامق',
    notes: 'تمت الصيانة الأولية وتغيير الزيت'
  });

  assert.strictEqual(updated.odometer, 2500);
  assert.strictEqual(updated.color, 'رمادي غامق');
  assert(updated.notes.includes('الصيانة الأولية'));
});

test('getVehicleById retrieves single vehicle with relations and custody logs', () => {
  const fetched = fleetService.getVehicleById(createdVehicle.id);
  assert.strictEqual(fetched.id, createdVehicle.id);
  assert(Array.isArray(fetched.custody_logs));
});

// --- TEST GROUP 3: Vehicle Custody Handover & Return Workflow ---
console.log('\n--- TEST GROUP 3: Vehicle Custody Handover & Return Workflow ---');

test('assignVehicle assigns custody to employee, updates status to نشط and creates audit log', () => {
  const targetEmp = get(`SELECT id, emp_code, full_name_ar FROM employees WHERE status = 'نشط' LIMIT 1`);
  assert(targetEmp, 'Operational employee must exist');

  const result = fleetService.assignVehicle(createdVehicle.id, targetEmp.id, {
    odometer: 3000,
    fuel_level: 'ممتلئ',
    accessories: ['استمارة أصلية', 'مفتاح احتياطي', 'طفاية حريق'],
    body_condition_notes: 'سيارة جديدة ممتازة خالية من الخدوش',
    supervisor_name: 'أحمد السالم (مسؤول الأسطول)'
  });

  assert(result.vehicle);
  assert.strictEqual(result.vehicle.assigned_emp_id, targetEmp.id);
  assert.strictEqual(result.vehicle.assigned_emp_name, targetEmp.full_name_ar);
  assert.strictEqual(result.vehicle.status, 'نشط');
  assert.strictEqual(result.vehicle.odometer, 3000);

  // Check log was recorded
  assert(result.log_id > 0);
  const log = get(`SELECT * FROM vehicle_custody_logs WHERE id = ?`, [result.log_id]);
  assert.strictEqual(log.action_type, 'تسليم_عهدة');
  assert.strictEqual(log.emp_id, targetEmp.id);
});

test('deleteVehicle is blocked while vehicle is assigned as employee custody', () => {
  assert.throws(() => {
    fleetService.deleteVehicle(createdVehicle.id);
  }, /مسلمة كعهدة للموظف/);
});

test('returnVehicle clears custody, sets status to متاح and records return audit log', () => {
  const result = fleetService.returnVehicle(createdVehicle.id, {
    odometer: 3850,
    fuel_level: 'ثلاثة أرباع',
    new_status: 'متاح',
    body_condition_notes: 'تم فحص السيارة واستلامها بحالة ممتازة وإخلاء طرف الموظف'
  });

  assert(result.vehicle);
  assert.strictEqual(result.vehicle.assigned_emp_id, null);
  assert.strictEqual(result.vehicle.assigned_emp_name, null);
  assert.strictEqual(result.vehicle.status, 'متاح');
  assert.strictEqual(result.vehicle.odometer, 3850);

  // Check log
  assert(result.log_id > 0);
  const log = get(`SELECT * FROM vehicle_custody_logs WHERE id = ?`, [result.log_id]);
  assert.strictEqual(log.action_type, 'استرداد_عهدة');
});

// --- TEST GROUP 4: Vehicle Documents & Photos Repository ---
console.log('\n--- TEST GROUP 4: Vehicle Documents & Photos Repository ---');

let createdDocId = null;
test('addVehicleDocument attaches document/photo and validates extensions', () => {
  const mockFile = {
    originalname: 'istimara_scan.pdf',
    filename: 'istimara_scan_123.pdf',
    path: 'uploads/fleet_documents/istimara_scan_123.pdf',
    size: 1024 * 50,
    mimetype: 'application/pdf'
  };

  const doc = fleetService.addVehicleDocument(createdVehicle.id, {
    doc_type: 'الاستمارة',
    title: 'رخصة السير الرسمية (استمارة)',
    issue_date: '2026-01-01',
    expiry_date: '2029-01-01',
    uploaded_by: 'مدير النظام'
  }, mockFile);

  assert(doc.id > 0, 'Document must have valid ID');
  assert.strictEqual(doc.doc_type, 'الاستمارة');
  assert.strictEqual(doc.vehicle_id, createdVehicle.id);
  createdDocId = doc.id;

  // Test dangerous extension block
  assert.throws(() => {
    fleetService.addVehicleDocument(createdVehicle.id, { title: 'virus' }, {
      originalname: 'malware.exe',
      filename: 'malware.exe',
      path: 'temp.exe',
      size: 100,
      mimetype: 'application/octet-stream'
    });
  }, /نوع الملف غير مسموح به/);
});

test('getVehicleDocuments retrieves all documents attached to vehicle', () => {
  const docs = fleetService.getVehicleDocuments(createdVehicle.id);
  assert(Array.isArray(docs));
  assert.strictEqual(docs.length, 1);
  assert.strictEqual(docs[0].id, createdDocId);
});

test('deleteVehicleDocument removes document record', () => {
  const res = fleetService.deleteVehicleDocument(createdDocId);
  assert.strictEqual(res, true);
  const check = fleetService.getVehicleDocuments(createdVehicle.id);
  assert.strictEqual(check.length, 0);
});

// Clean up test vehicle
fleetService.deleteVehicle(createdVehicle.id);

// --- TEST GROUP 5: Import & Export Operations with 24 Columns ---
console.log('\n--- TEST GROUP 5: Import & Export Operations with 24 Columns ---');

test('getImportTemplateExcel generates valid 24-column Excel workbook buffer', () => {
  const buf = fleetService.getImportTemplateExcel();
  assert(Buffer.isBuffer(buf), 'Must return buffer');
  assert(buf.length > 5000, `Buffer size too small: ${buf.length}`);
});

test('importVehicles handles bulk rows with 24 columns, employee code validation, and duplicate rejection', () => {
  const emp = get("SELECT emp_code FROM employees WHERE status = 'نشط' LIMIT 1");
  const testVinBulk = 'VIN-BULK-' + Date.now();

  const importRows = [
    {
      'رقم اللوحة': '7788',
      'رمز اللوحة': 'ك ل م',
      'نوع المركبة': 'نقل خاص',
      'الشركة المصنعة': 'تويوتا',
      'الموديل': 'هايلكس',
      'سنة الصنع': 2024,
      'اللون': 'أبيض',
      'رقم الهيكل VIN': testVinBulk,
      'نوع الاستخدام': 'ميداني',
      'الرقم الوظيفي للموظف المستلم': emp.emp_code,
      'تاريخ التسليم': '2026-02-01',
      'قراءة العداد': 15000,
      'تاريخ انتهاء الاستمارة': '2027-08-10',
      'تاريخ انتهاء الفحص الدوري': '2027-02-15',
      'شركة التأمين': 'التعاونية للتأمين',
      'رقم وثيقة التأمين': 'TAW-998811',
      'تاريخ انتهاء التأمين': '2027-08-10',
      'حالة المركبة': 'نشط',
      'الفرع': 'المقر الرئيسي',
      'الملاحظات': 'سيارة مستوردة للاختبار'
    }
  ];

  const res = fleetService.importVehicles(importRows);
  assert.strictEqual(res.total_rows, 1);
  assert.strictEqual(res.valid_count, 1);
  assert.strictEqual(res.rejected_count, 0);

  // Check imported vehicle exists and assigned to emp
  const importedVeh = get('SELECT * FROM vehicles WHERE vin_serial = ?', [testVinBulk]);
  assert(importedVeh, 'Imported vehicle must exist in DB');
  assert.strictEqual(importedVeh.status, 'نشط');
  assert.strictEqual(importedVeh.plate_number_ar, 'ك ل م 7788');

  // Check duplicate rejection on second run
  const dupRes = fleetService.importVehicles(importRows);
  assert.strictEqual(dupRes.duplicate_count, 1);
  assert.strictEqual(dupRes.valid_count, 0);

  // Clean up
  run('DELETE FROM vehicle_custody_logs WHERE vehicle_id = ?', [importedVeh.id]);
  fleetService.returnVehicle(importedVeh.id, { new_status: 'متاح' });
  fleetService.deleteVehicle(importedVeh.id);
});

// Final verify: Database must have exactly 0 vehicles
run('DELETE FROM vehicle_custody_logs');
run('DELETE FROM vehicle_documents');
run('DELETE FROM vehicles');

// --- TEST GROUP 6: Strict Rule #1 Headcount & Data Integrity Verification ---
console.log('\n--- TEST GROUP 6: Strict Rule #1 Headcount & Data Integrity ---');

test('Strict Rule #1: Exactly 108 active operational employees preserved', () => {
  const activeCount = get(`SELECT COUNT(*) as cnt FROM employees WHERE status = 'نشط'`).cnt;
  assert.strictEqual(activeCount, 108, `Operational headcount violated! Expected 108, got ${activeCount}`);
});

test('Strict Rule #1: Exactly 113 total employees (108 active + 5 terminated) preserved', () => {
  const totalCount = get(`SELECT COUNT(*) as cnt FROM employees`).cnt;
  assert.strictEqual(totalCount, 113, `Total employees count violated! Expected 113, got ${totalCount}`);
});

test('Strict Rule #1: Exactly 14 users are active and preserved', () => {
  const userCount = get(`SELECT COUNT(*) as cnt FROM users`).cnt;
  assert.strictEqual(userCount, 14, `Users count violated! Expected 14, got ${userCount}`);
});

test('Strict Rule #1: Exactly 9 departments are active with 108 employees', () => {
  const deptsCount = get(`SELECT COUNT(*) as cnt FROM departments`).cnt;
  assert.strictEqual(deptsCount, 9, `Departments count violated! Expected 9, got ${deptsCount}`);
});

console.log('\n================================================================');
console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
