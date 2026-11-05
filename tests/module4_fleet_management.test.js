/**
 * tests/module4_fleet_management.test.js
 * Comprehensive Verification Suite for Module 4: Fleet & Vehicle Management (Tamm Platform)
 * Jawharat Al-Majd HRMS — Saudi Labor Law & Tamm Integration Ready
 */

const assert = require('node:assert');
const { query, get } = require('../server/database/db');
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

// --- TEST GROUP 1: Fleet CRUD Operations & Validations ---
console.log('--- TEST GROUP 1: Fleet CRUD & Validations ---');

const initialVehicles = fleetService.getVehicles();
test('Seeded fleet vehicles load with complete Tamm compliance fields', () => {
  assert(Array.isArray(initialVehicles), 'Fleet should return an array');
  assert(initialVehicles.length >= 4, `Expected at least 4 vehicles, got ${initialVehicles.length}`);
  const v1 = initialVehicles[0];
  assert(v1.plate_number_ar, 'Must have plate_number_ar');
  assert(v1.make, 'Must have make');
  assert(v1.model, 'Must have model');
  assert(v1.year > 2000, 'Must have valid year');
  assert(v1.istimara, 'Must compute istimara info');
  assert(v1.fahas, 'Must compute fahas info');
  assert(v1.insurance, 'Must compute insurance info');
});

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

// --- TEST GROUP 2: Tamm Platform Fields & Regulatory Alarms ---
console.log('\n--- TEST GROUP 2: Tamm Platform Fields & Regulatory Alarms ---');

test('computeExpiry calculates expired, expiring_soon, and valid states accurately', () => {
  const pastDate = '2025-01-01';
  const expired = fleetService.computeExpiry(pastDate);
  assert.strictEqual(expired.status, 'expired');
  assert(expired.daysLeft < 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 10);
  const soonDate = tomorrow.toISOString().split('T')[0];
  const expiringSoon = fleetService.computeExpiry(soonDate);
  assert.strictEqual(expiringSoon.status, 'expiring_soon');
  assert(expiringSoon.daysLeft <= 30 && expiringSoon.daysLeft > 0);

  const future = new Date();
  future.setDate(future.getDate() + 200);
  const validDate = future.toISOString().split('T')[0];
  const valid = fleetService.computeExpiry(validDate);
  assert.strictEqual(valid.status, 'valid');
  assert(valid.daysLeft > 30);
});

test('getFleetKpis accurately computes total, assigned, available and Tamm alarms', () => {
  const kpis = fleetService.getFleetKpis();
  assert(kpis.total_vehicles >= 5, `Expected at least 5 vehicles, got ${kpis.total_vehicles}`);
  assert(kpis.assigned_vehicles >= 1);
  assert(typeof kpis.compliance_rate === 'number');
  assert(kpis.total_alerts >= 0);
  assert(typeof kpis.istimara_alerts.expired === 'number');
  assert(typeof kpis.fahas_alerts.expiring_soon === 'number');
});

// --- TEST GROUP 3: Vehicle Custody Handover & Return Workflow ---
console.log('\n--- TEST GROUP 3: Vehicle Custody Handover & Return Workflow ---');

test('assignVehicle assigns custody to employee, updates status to نشط and creates audit log', () => {
  const targetEmp = get(`SELECT id, emp_code, full_name_ar FROM employees WHERE is_saudi = 1 LIMIT 1`);
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

// Clean up test vehicle safely
fleetService.deleteVehicle(createdVehicle.id);

// --- TEST GROUP 4: Import & Export Operations ---
console.log('\n--- TEST GROUP 4: Import & Export Operations ---');

test('exportVehiclesCsv generates valid CSV with UTF-8 BOM for Arabic Excel', () => {
  const csv = fleetService.exportVehiclesCsv();
  assert(typeof csv === 'string');
  assert.strictEqual(csv.charCodeAt(0), 0xFEFF, 'CSV must start with UTF-8 BOM');
  assert(csv.includes('رقم اللوحة (عربي)'));
  assert(csv.includes('منصة تم'));
});

test('exportVehiclesExcel generates valid Excel spreadsheet buffer', () => {
  const buf = fleetService.exportVehiclesExcel();
  assert(Buffer.isBuffer(buf));
  assert(buf.length > 5000, `Excel buffer size too small: ${buf.length}`);
});

test('getImportTemplateCsv returns formatted blank CSV import template', () => {
  const template = fleetService.getImportTemplateCsv();
  assert(template.charCodeAt(0), 0xFEFF);
  assert(template.includes('رقم اللوحة عربي'));
  assert(template.includes('رقم الهيكل VIN'));
});

test('importVehicles handles bulk rows accurately with upsert and validation', () => {
  const importRows = [
    {
      'رقم اللوحة عربي': 'س ص ع 1234',
      'رقم اللوحة إنجليزي': '1234 ESX',
      'الماركة': 'تويوتا',
      'الموديل': 'كورولا سيدان',
      'سنة الصنع': 2024,
      'اللون': 'فضي',
      'رقم الهيكل VIN': 'VIN-COROLLA-' + Date.now(),
      'نوع المركبة': 'خصوصي',
      'قراءة العداد': 18000,
      'تاريخ انتهاء الاستمارة': '2027-08-10',
      'تاريخ انتهاء الفحص الدوري': '2027-02-15',
      'شركة التأمين': 'ميدغلف للتأمين',
      'رقم وثيقة التأمين': 'MED-998811',
      'تاريخ انتهاء التأمين': '2027-08-10',
      'رقم بطاقة الوقود': 'PETRO-772',
      'ملاحظات': 'سيارة مستوردة للاختبار'
    }
  ];

  const res = fleetService.importVehicles(importRows);
  assert.strictEqual(res.total_rows, 1);
  assert.strictEqual(res.inserted, 1);
  assert.strictEqual(res.errors.length, 0);

  // Clean up imported test vehicle
  const imported = get(`SELECT id FROM vehicles WHERE plate_number_ar = 'س ص ع 1234'`);
  if (imported) fleetService.deleteVehicle(imported.id);
});

// --- TEST GROUP 5: Official A4 Printable Handover Certificate ---
console.log('\n--- TEST GROUP 5: Official A4 Printable Handover Certificate ---');

test('generateHandoverPrintHtml generates official A4 certificate with Tamm & Labor Law Article 80', () => {
  const v1 = initialVehicles[0];
  const html = fleetService.generateHandoverPrintHtml(v1.id);

  assert(html.includes('شركة جوهرة المجد للمقاولات والتجارة'), 'Must contain company header');
  assert(html.includes('محضر تسليم عهدة مركبة رسمية'), 'Must contain Arabic certificate title');
  assert(html.includes('Vehicle Custody Handover Certificate'), 'Must contain English certificate title');
  assert(html.includes(v1.plate_number_ar), 'Must contain vehicle plate');
  assert(html.includes('منصة تم'), 'Must cite Tamm platform');
  assert(html.includes('المادة 80'), 'Must cite Article 80 of Saudi Labor Law for asset custody');
  assert(html.includes('قراءة العداد'), 'Must contain odometer field');
  assert(html.includes('الموظف المستلم للعهدة'), 'Must contain employee signature block');
});

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

console.log('\n================================================================');
console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
