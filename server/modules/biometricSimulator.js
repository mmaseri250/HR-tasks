// server/modules/biometricSimulator.js
const { query, run } = require('../database/db');
const { recordPunch } = require('./attendance');

// Simulate ZKTeco BioTime / Push SDK webhook payload
// When a biometric terminal pushes punches to the server endpoint
function processZkPushData(payload) {
  // Typical ZKTeco payload format:
  // { SN: 'ZK12345678', table: 'ATTLOG', stamp: '123456', data: '1001\t2026-09-30 08:00:15\t1\t1\t0...' }
  const results = [];

  if (Array.isArray(payload.punches)) {
    for (const p of payload.punches) {
      try {
        const punch = recordPunch({
          emp_id: p.emp_id,
          punch_type: p.punch_type || 'CHECK_IN',
          punch_time: p.punch_time,
          device_id: payload.device_code || p.device_id || 'ZK-BIO-MAIN-01',
          device_name: payload.device_name || 'جهاز بصمة ZKTeco',
          verification_method: p.verification_method || 'FINGERPRINT',
          latitude: p.latitude || 18.2164,
          longitude: p.longitude || 42.5053
        });
        results.push(punch);
      } catch (err) {
        console.error('Error processing push punch:', err.message);
      }
    }
  }

  // Update device last_sync
  if (payload.device_code) {
    run(`UPDATE biometric_devices SET last_sync = datetime('now') WHERE device_code = ?`, [payload.device_code]);
  }

  return {
    success: true,
    processedCount: results.length,
    results
  };
}

// Generates a live simulation of 3-5 employee punches to demonstrate real-time device sync in UI
function triggerDeviceSimulation() {
  const employees = query(`SELECT id, emp_code, full_name_ar FROM employees WHERE status = 'نشط' ORDER BY RANDOM() LIMIT 4`);
  const devices = query(`SELECT device_code, device_name FROM biometric_devices LIMIT 3`);

  const punched = [];
  const now = new Date();
  const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);

  for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];
    const dev = devices[i % devices.length] || { device_code: 'ZK-BIO-MAIN-01', device_name: 'جهاز البوابة الرئيسية' };
    const pType = i % 2 === 0 ? 'CHECK_IN' : 'CHECK_OUT';

    try {
      const res = recordPunch({
        emp_id: emp.id,
        punch_type: pType,
        punch_time: timeStr,
        device_id: dev.device_code,
        device_name: dev.device_name,
        verification_method: i % 2 === 0 ? 'FINGERPRINT' : 'FACE',
        latitude: 18.2164,
        longitude: 42.5053
      });
      punched.push({
        emp_code: emp.emp_code,
        full_name_ar: emp.full_name_ar,
        punch_type: pType,
        punch_time: timeStr,
        device: dev.device_name
      });
    } catch (e) {
      console.warn('Simulation punch skip:', e.message);
    }
  }

  return {
    message: 'تمت محاكاة مزامنة أجهزة البصمة البيومترية بنجاح',
    timestamp: timeStr,
    syncedRecords: punched
  };
}

module.exports = {
  processZkPushData,
  triggerDeviceSimulation
};
