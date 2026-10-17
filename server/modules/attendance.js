// server/modules/attendance.js
const { query, get, run } = require('../database/db');

// Haversine formula to calculate distance in meters between two GPS coordinates
function calculateDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getCompanyLocation() {
  const settings = get('SELECT office_lat, office_lng, geofence_radius_meters FROM company_settings WHERE id = 1');
  return {
    lat: settings ? settings.office_lat : 18.2164,
    lng: settings ? settings.office_lng : 42.5053,
    radius: settings ? settings.geofence_radius_meters : 300
  };
}

function recordPunch(data) {
  const {
    emp_id,
    punch_type, // 'CHECK_IN' or 'CHECK_OUT'
    punch_time, // optional, defaults to now
    device_id = 'PORTAL_WEB',
    device_name = 'بوابة الخدمة الذاتية',
    verification_method = 'MANUAL',
    latitude = null,
    longitude = null,
    raw_data = null
  } = data;

  if (!emp_id || !punch_type) {
    throw new Error('رقم الموظف ونوع البصمة مطلوبان');
  }

  const emp = get('SELECT id, emp_code, full_name_ar, shift_type, policy_id FROM employees WHERE id = ?', [emp_id]);
  if (!emp) {
    throw new Error('الموظف غير موجود');
  }

  const pTime = punch_time || new Date().toISOString().replace('T', ' ').substring(0, 19);
  const dateStr = pTime.split(' ')[0];
  const timeStr = pTime.split(' ')[1] || '08:00:00';

  // Check geofence if coordinates are provided
  let isWithinGeofence = 1;
  let distanceMeters = 0;
  if (latitude && longitude) {
    const office = getCompanyLocation();
    distanceMeters = Math.round(calculateDistanceInMeters(latitude, longitude, office.lat, office.lng));
    isWithinGeofence = distanceMeters <= office.radius ? 1 : 0;
  }

  // 1. Insert into raw logs
  const logResult = run(`
    INSERT INTO attendance_logs (
      emp_id, punch_time, punch_type, device_id, device_name,
      verification_method, latitude, longitude, is_within_geofence, raw_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    emp_id, pTime, punch_type, device_id, device_name,
    verification_method, latitude, longitude, isWithinGeofence, raw_data
  ]);

  // 2. Fetch employee policy to enforce exact policy rules
  const isFlexShift = emp.shift_type === 'flexible' || emp.shift_type === 'دوام مرن';
  const policy = emp.policy_id
    ? get('SELECT * FROM attendance_policies WHERE id = ?', [emp.policy_id])
    : get('SELECT * FROM attendance_policies WHERE shift_type = ? OR shift_type = ? OR flexible_hours = ? LIMIT 1', [
        emp.shift_type || 'دوام صباحي',
        isFlexShift ? 'دوام مرن' : 'دوام صباحي',
        isFlexShift ? 1 : 0
      ]);

  const isFlexible = isFlexShift || (policy && policy.flexible_hours === 1);

  // 3. Update or Insert Daily Summary
  let summary = get('SELECT * FROM attendance_daily_summary WHERE emp_id = ? AND date = ?', [emp_id, dateStr]);

  const [hours, minutes] = timeStr.split(':').map(Number);
  const punchDecimalHours = hours + (minutes / 60);

  if (punch_type === 'CHECK_IN') {
    let delayMinutes = 0;
    let status = 'حاضر';
    let note = 'حضور في الموعد';

    if (isFlexible) {
      // Flexible policy: no fixed in time, must complete 8 hours daily
      delayMinutes = 0;
      status = 'حاضر';
      note = 'حضور دوام مرن';
    } else {
      // Management policy: Saturday to Thursday, 08:00 to 16:00. Grace period: 15 mins.
      const scheduledStart = 8.0;
      const gracePeriodHours = 8.25; // 08:15 AM
      if (punchDecimalHours > gracePeriodHours) {
        delayMinutes = Math.round((punchDecimalHours - scheduledStart) * 60);
        status = 'متأخر';
        note = `تأخير صباحي ${delayMinutes} دقيقة`;
      }
    }

    if (!summary) {
      run(`
        INSERT INTO attendance_daily_summary (
          emp_id, date, check_in, check_out, work_hours, expected_hours,
          delay_minutes, early_departure_minutes, overtime_hours, status, notes
        ) VALUES (?, ?, ?, NULL, 0, 8.0, ?, 0, 0, ?, ?)
      `, [emp_id, dateStr, pTime, delayMinutes, status, note]);
    } else {
      const existingIn = summary.check_in ? summary.check_in : pTime;
      run(`
        UPDATE attendance_daily_summary
        SET check_in = ?, delay_minutes = ?, status = ?, notes = ?
        WHERE id = ?
      `, [existingIn, delayMinutes, status, note, summary.id]);
    }
  } else if (punch_type === 'CHECK_OUT') {
    if (!summary) {
      run(`
        INSERT INTO attendance_daily_summary (
          emp_id, date, check_in, check_out, work_hours, expected_hours,
          delay_minutes, early_departure_minutes, overtime_hours, status, notes
        ) VALUES (?, ?, NULL, ?, 0, 8.0, 0, 0, 0, 'حاضر', 'تسجيل خروج فقط')
      `, [emp_id, dateStr, pTime]);
    } else {
      let workHours = 0;
      let earlyDepartureMinutes = 0;
      const overtimeHours = 0; // Strictly NO overtime calculation or accrual

      let note = summary.notes || '';
      let status = summary.status || 'حاضر';

      if (summary.check_in) {
        const inTimeStr = summary.check_in.split(' ')[1] || '08:00:00';
        const [inH, inM] = inTimeStr.split(':').map(Number);
        const inDecimal = inH + (inM / 60);
        const outDecimal = punchDecimalHours;

        const totalHours = Math.max(0, outDecimal - inDecimal);
        workHours = Math.round(totalHours * 10) / 10;

        if (isFlexible) {
          // Flexible policy: must complete 8 hours, minimum 3 hours to be counted
          if (workHours < 3.0) {
            status = 'غير مستوفٍ للحد الأدنى';
            note = `ساعات العمل الفعلية (${workHours} ساعة) أقل من الحد الأدنى المقرر (3 ساعات)`;
          } else if (workHours < 8.0) {
            status = 'نقص ساعات';
            note = `تم إكمال ${workHours} ساعة من أصل 8 ساعات مطلوبة`;
          } else {
            status = 'مستوفٍ';
            note = `تم إكمال ساعات العمل اليومية (${workHours} ساعة) بنجاح`;
          }
        } else {
          // Management policy: ends at 16:00
          const scheduledEnd = 16.0;
          if (outDecimal < scheduledEnd) {
            earlyDepartureMinutes = Math.round((scheduledEnd - outDecimal) * 60);
            note = `انصراف مبكر ${earlyDepartureMinutes} دقيقة`;
          } else {
            note = 'انصراف بعد اكتمال دوام الإدارة';
          }
        }
      }

      run(`
        UPDATE attendance_daily_summary
        SET check_out = ?,
            work_hours = ?,
            early_departure_minutes = ?,
            overtime_hours = 0,
            status = ?,
            notes = ?
        WHERE id = ?
      `, [pTime, workHours, earlyDepartureMinutes, status, note, summary.id]);
    }
  }

  return {
    success: true,
    logId: logResult.lastInsertRowid,
    emp_code: emp.emp_code,
    full_name_ar: emp.full_name_ar,
    punch_type,
    punch_time: pTime,
    isWithinGeofence,
    distanceMeters
  };
}

function getDailyAttendance(dateStr) {
  const targetDate = dateStr || new Date().toISOString().split('T')[0];
  const sql = `
    SELECT s.*, e.emp_code, e.full_name_ar, e.job_title_ar, d.name_ar AS department_name
    FROM attendance_daily_summary s
    JOIN employees e ON s.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE s.date = ?
    ORDER BY s.check_in ASC, e.id ASC
  `;
  return query(sql, [targetDate]);
}

function getEmployeeAttendanceHistory(empId, monthStr) {
  let sql = `
    SELECT s.*, e.emp_code, e.full_name_ar
    FROM attendance_daily_summary s
    JOIN employees e ON s.emp_id = e.id
    WHERE s.emp_id = ?
  `;
  const params = [empId];

  if (monthStr) {
    sql += ` AND s.date LIKE ?`;
    params.push(`${monthStr}%`);
  }

  sql += ` ORDER BY s.date DESC`;
  return query(sql, params);
}

function getBiometricDevices() {
  return query('SELECT * FROM biometric_devices ORDER BY id ASC');
}

function getAttendanceStats(dateStr) {
  const targetDate = dateStr || new Date().toISOString().split('T')[0];

  const totalEmployees = get(`SELECT COUNT(*) AS count FROM employees WHERE status = 'نشط'`).count || 0;
  const presentCount = get(`SELECT COUNT(*) AS count FROM attendance_daily_summary WHERE date = ? AND (status = 'حاضر' OR status = 'متأخر')`, [targetDate]).count || 0;
  const lateCount = get(`SELECT COUNT(*) AS count FROM attendance_daily_summary WHERE date = ? AND status = 'متأخر'`, [targetDate]).count || 0;
  const onLeaveCount = get(`SELECT COUNT(*) AS count FROM attendance_daily_summary WHERE date = ? AND status LIKE '%إجازة%'`, [targetDate]).count || 0;
  const overtimeCount = get(`SELECT COUNT(*) AS count FROM attendance_daily_summary WHERE date = ? AND overtime_hours > 0`, [targetDate]).count || 0;

  const attendanceRate = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;

  return {
    date: targetDate,
    totalEmployees,
    presentCount,
    lateCount,
    onLeaveCount,
    absentCount: Math.max(0, totalEmployees - presentCount - onLeaveCount),
    overtimeCount,
    attendanceRate
  };
}

// Bulk import of biometric punches
function importBiometricPunches(records) {
  let importedCount = 0;
  for (const item of records) {
    try {
      // Find employee by emp_code or id
      let emp = null;
      if (item.emp_code) {
        emp = get('SELECT id FROM employees WHERE emp_code = ?', [item.emp_code.trim()]);
      } else if (item.emp_id) {
        emp = get('SELECT id FROM employees WHERE id = ?', [Number(item.emp_id)]);
      }

      if (emp) {
        recordPunch({
          emp_id: emp.id,
          punch_type: item.punch_type || 'CHECK_IN',
          punch_time: item.punch_time,
          device_id: item.device_id || 'ZK-IMPORT-FILE',
          device_name: item.device_name || 'ملف استيراد بصمة خارجي',
          verification_method: item.verification_method || 'FINGERPRINT'
        });
        importedCount++;
      }
    } catch (err) {
      console.error('Error importing punch row:', err);
    }
  }
  return { success: true, count: importedCount };
}

module.exports = {
  recordPunch,
  getDailyAttendance,
  getEmployeeAttendanceHistory,
  getBiometricDevices,
  getAttendanceStats,
  importBiometricPunches,
  calculateDistanceInMeters,
  getCompanyLocation
};
