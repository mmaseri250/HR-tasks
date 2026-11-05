// server/modules/muqeem.js
const { query, get, run } = require('../database/db');
const path = require('node:path');
const fs = require('node:fs');

function getMuqeemReport(filters = {}) {
  let sql = 'SELECT * FROM muqeem_residents WHERE 1=1';
  const params = [];

  if (filters.search) {
    sql += ' AND (full_name LIKE ? OR iqama_number LIKE ? OR passport_number LIKE ? OR occupation LIKE ? OR nationality LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s, s, s, s);
  }

  if (filters.nationality) {
    sql += ' AND nationality = ?';
    params.push(filters.nationality);
  }

  if (filters.is_outside_ksa !== undefined && filters.is_outside_ksa !== '') {
    sql += ' AND is_outside_ksa = ?';
    params.push(parseInt(filters.is_outside_ksa, 10));
  }

  sql += ' ORDER BY id ASC';
  const allRows = query(sql, params);

  const now = new Date(); // Operational reference date
  const processed = allRows.map(r => {
    let daysRemaining = null;
    let iqamaStatus = 'سارية وممتثلة';
    let statusClass = 'success';

    if (r.iqama_expiry_gregorian) {
      const expDate = new Date(r.iqama_expiry_gregorian);
      if (!isNaN(expDate.getTime())) {
        daysRemaining = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
        if (daysRemaining < 0) {
          iqamaStatus = 'منتهية (مطلوب التجديد)';
          statusClass = 'danger';
        } else if (daysRemaining <= 60) {
          iqamaStatus = 'تشارف على الانتهاء';
          statusClass = 'warning';
        } else {
          iqamaStatus = 'سارية وممتثلة';
          statusClass = 'success';
        }
      }
    }

    let passportDays = null;
    let passportStatus = 'ساري';
    if (r.passport_expiry) {
      const pExp = new Date(r.passport_expiry);
      if (!isNaN(pExp.getTime())) {
        passportDays = Math.ceil((pExp - now) / (1000 * 60 * 60 * 24));
        if (passportDays < 0) passportStatus = 'منتهي';
        else if (passportDays <= 180) passportStatus = 'يقارب على الانتهاء';
      }
    }

    return {
      ...r,
      days_remaining: daysRemaining,
      iqama_status: iqamaStatus,
      status_class: statusClass,
      passport_days_remaining: passportDays,
      passport_status: passportStatus,
      location_status: r.is_outside_ksa === 1 ? 'خارج السعودية' : 'داخل السعودية'
    };
  });

  // Calculate full database summary stats (unfiltered by search/status for the top cards)
  const allDbRows = query('SELECT * FROM muqeem_residents');
  let strictlyValidCount = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;
  let insideKsaCount = 0;
  let outsideKsaCount = 0;

  allDbRows.forEach(r => {
    if (r.is_outside_ksa === 1) outsideKsaCount++;
    else insideKsaCount++;

    if (r.iqama_expiry_gregorian) {
      const expDate = new Date(r.iqama_expiry_gregorian);
      if (!isNaN(expDate.getTime())) {
        const diff = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
        if (diff < 0) expiredCount++;
        else if (diff <= 60) expiringSoonCount++;
        else strictlyValidCount++;
      } else {
        strictlyValidCount++;
      }
    } else {
      strictlyValidCount++;
    }
  });

  // Valid iqamas includes both strictly valid (> 60 days) and expiring soon (0-60 days)
  const validCount = strictlyValidCount + expiringSoonCount;

  // Apply status filter if requested (e.g. expiring_soon, expired, valid, strictly_valid, inside_ksa, outside_ksa)
  let filteredList = processed;
  if (filters.status === 'expiring_soon') {
    filteredList = processed.filter(p => p.days_remaining !== null && p.days_remaining >= 0 && p.days_remaining <= 60);
  } else if (filters.status === 'expired') {
    filteredList = processed.filter(p => p.days_remaining !== null && p.days_remaining < 0);
  } else if (filters.status === 'valid') {
    filteredList = processed.filter(p => p.days_remaining === null || p.days_remaining >= 0);
  } else if (filters.status === 'strictly_valid') {
    filteredList = processed.filter(p => p.days_remaining === null || p.days_remaining > 60);
  } else if (filters.status === 'inside_ksa' || filters.status === 'inside') {
    filteredList = processed.filter(p => p.is_outside_ksa === 0);
  } else if (filters.status === 'outside_ksa' || filters.status === 'outside') {
    filteredList = processed.filter(p => p.is_outside_ksa === 1);
  }

  const total = allDbRows.length;
  const complianceRate = total > 0 ? Math.round(((total - expiredCount) / total) * 1000) / 10 : 100;

  return {
    residents: filteredList,
    summary: {
      totalResidents: total,
      insideKsa: insideKsaCount,
      outsideKsa: outsideKsaCount,
      validIqamas: validCount, // 19: تشمل السارية والتي شارفت على الانتهاء
      strictlyValid: strictlyValidCount, // 3: سارية بالكامل أكثر من 60 يوماً
      expiringSoon: expiringSoonCount, // 16: تشارف على الانتهاء خلال 60 يوماً
      expiredIqamas: expiredCount, // 61: منتهية تتطلب التجديد
      complianceRate,
      monthlyFeePerWorker: 800,
      totalMonthlyFees: insideKsaCount * 800,
      totalAnnualFees: insideKsaCount * 9600,
      workPermitsCount: total,
      workPermitsValid: validCount,
      workPermitsExpired: expiredCount
    }
  };
}

function getMuqeemResidentById(id) {
  return get('SELECT * FROM muqeem_residents WHERE id = ?', [id]);
}

function createMuqeemResident(data) {
  if (!data.iqama_number || !data.full_name || !data.nationality || !data.occupation) {
    throw new Error('رقم الإقامة، الاسم، الجنسية، والمهنة حقول إلزامية');
  }

  const existing = get('SELECT id FROM muqeem_residents WHERE iqama_number = ?', [data.iqama_number]);
  if (existing) {
    throw new Error('رقم الإقامة مسجل مسبقاً في تقرير مقيم');
  }

  const isOutside = (data.is_outside_ksa === 1 || data.is_outside_ksa === '1' || data.is_outside_ksa === true || data.is_outside_ksa === 'نعم') ? 1 : 0;

  const result = run(`
    INSERT INTO muqeem_residents (
      iqama_number, full_name, gender, nationality, occupation,
      passport_number, passport_expiry, iqama_issue_date,
      iqama_expiry_gregorian, iqama_expiry_hijri, birth_date,
      is_outside_ksa, employer_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    String(data.iqama_number).trim(),
    String(data.full_name).trim(),
    data.gender || 'ذكر',
    String(data.nationality).trim(),
    String(data.occupation).trim(),
    data.passport_number || null,
    data.passport_expiry || null,
    data.iqama_issue_date || null,
    data.iqama_expiry_gregorian || null,
    data.iqama_expiry_hijri || null,
    data.birth_date || null,
    isOutside,
    data.employer_id || '7013999755'
  ]);

  // Sync to employees if present
  syncEmployeeExpiry(data.iqama_number, data.iqama_expiry_gregorian, data.passport_expiry);

  return getMuqeemResidentById(result.lastInsertRowid);
}

function updateMuqeemResident(id, data) {
  const resident = getMuqeemResidentById(id);
  if (!resident) {
    throw new Error('سجل المقيم غير موجود');
  }

  const isOutside = data.is_outside_ksa !== undefined 
    ? ((data.is_outside_ksa === 1 || data.is_outside_ksa === '1' || data.is_outside_ksa === true || data.is_outside_ksa === 'نعم') ? 1 : 0)
    : resident.is_outside_ksa;

  run(`
    UPDATE muqeem_residents SET
      full_name = COALESCE(?, full_name),
      gender = COALESCE(?, gender),
      nationality = COALESCE(?, nationality),
      occupation = COALESCE(?, occupation),
      passport_number = COALESCE(?, passport_number),
      passport_expiry = COALESCE(?, passport_expiry),
      iqama_issue_date = COALESCE(?, iqama_issue_date),
      iqama_expiry_gregorian = COALESCE(?, iqama_expiry_gregorian),
      iqama_expiry_hijri = COALESCE(?, iqama_expiry_hijri),
      birth_date = COALESCE(?, birth_date),
      is_outside_ksa = ?,
      employer_id = COALESCE(?, employer_id),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    data.full_name ? String(data.full_name).trim() : null,
    data.gender || null,
    data.nationality ? String(data.nationality).trim() : null,
    data.occupation ? String(data.occupation).trim() : null,
    data.passport_number || null,
    data.passport_expiry || null,
    data.iqama_issue_date || null,
    data.iqama_expiry_gregorian || null,
    data.iqama_expiry_hijri || null,
    data.birth_date || null,
    isOutside,
    data.employer_id || null,
    id
  ]);

  const updated = getMuqeemResidentById(id);
  syncEmployeeExpiry(updated.iqama_number, updated.iqama_expiry_gregorian, updated.passport_expiry);
  return updated;
}

function deleteMuqeemResident(id) {
  const resident = getMuqeemResidentById(id);
  if (!resident) {
    throw new Error('سجل المقيم غير موجود');
  }
  run('DELETE FROM muqeem_residents WHERE id = ?', [id]);
  return { success: true, message: 'تم حذف سجل المقيم بنجاح' };
}

function syncEmployeeExpiry(iqama, iqamaExpiry, passportExpiry) {
  if (!iqama) return;
  try {
    const emp = get('SELECT id FROM employees WHERE national_id = ?', [iqama]);
    if (emp) {
      run(`
        UPDATE employees SET
          iqama_expiry = COALESCE(?, iqama_expiry),
          passport_expiry = COALESCE(?, passport_expiry)
        WHERE id = ?
      `, [iqamaExpiry || null, passportExpiry || null, emp.id]);
    }
  } catch (e) {
    console.error('Error syncing employee expiry:', e.message);
  }
}

function syncFromExcel() {
  return syncFromEmployees();
}

function syncFromEmployees() {
  try {
    const expats = query(`
      SELECT e.national_id, e.full_name_ar, e.gender, e.nationality, e.job_title_ar,
             e.passport_expiry, e.iqama_expiry, e.birth_date
      FROM employees e
      WHERE e.is_saudi = 0 AND e.status = 'نشط'
      ORDER BY e.id ASC
    `);

    const existingPassports = {};
    try {
      const existing = query('SELECT iqama_number, passport_number FROM muqeem_residents WHERE passport_number IS NOT NULL');
      for (const r of existing) existingPassports[r.iqama_number] = r.passport_number;
    } catch (_) {}

    run('DELETE FROM muqeem_residents');
    const insertSql = `
      INSERT INTO muqeem_residents (
        iqama_number, full_name, gender, nationality, occupation,
        passport_number, passport_expiry, iqama_expiry_gregorian,
        birth_date, is_outside_ksa, employer_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, '7013999755')
    `;

    for (const exp of expats) {
      run(insertSql, [
        exp.national_id,
        exp.full_name_ar,
        exp.gender === 'F' ? 'أنثى' : 'ذكر',
        exp.nationality,
        exp.job_title_ar,
        existingPassports[exp.national_id] || null,
        exp.passport_expiry || null,
        exp.iqama_expiry || null,
        exp.birth_date || null
      ]);
    }

    return {
      success: true,
      count: expats.length,
      message: `تمت المزامنة بنجاح من قاعدة بيانات الموظفين الفعلية (${expats.length} مقيماً نشطاً).`
    };
  } catch (err) {
    return { success: false, error: 'فشل مزامنة المقيمين من الموظفين: ' + err.message };
  }
}

module.exports = {
  getMuqeemReport,
  getMuqeemResidentById,
  createMuqeemResident,
  updateMuqeemResident,
  deleteMuqeemResident,
  syncFromExcel
};
