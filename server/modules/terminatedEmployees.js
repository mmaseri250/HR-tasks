// server/modules/terminatedEmployees.js - Terminated Employees Management, Gratuity Calculator & Qiwa Compliance
const { query, get, run } = require('../database/db');
const xlsx = require('xlsx');

/**
 * Official Termination Reasons matching the Qiwa Platform End of Service Reward Calculator
 * (حاسبة مكافأة نهاية الخدمة المعتمدة في منصة قوى ووزارة الموارد البشرية)
 */
const QIWA_TERMINATION_REASONS = [
  {
    id: 'resignation',
    name: 'استقالة الموظف',
    article: 'المادة 85',
    category: 'استقالة',
    entitlement_type: 'resignation_scale', // 0% (<2y), 33.33% (2-5y), 66.67% (5-10y), 100% (>=10y)
    notes: 'استقالة اختيارية من الموظف وفق شرائح المادة 85 من نظام العمل'
  },
  {
    id: 'probation_termination',
    name: 'فسخ العقد خلال فترة التجربة وفقاً للمادة 53 من نظام العمل',
    article: 'المادة 53',
    category: 'فترة التجربة',
    entitlement_type: 'zero',
    notes: 'لا يستحق مكافأة نهاية خدمة خلال فترة التجربة وفقاً للمادة 53'
  },
  {
    id: 'mutual_agreement',
    name: 'بإتفاق الطرفين وفقاً للمادة 74 من نظام العمل',
    article: 'المادة 74/1',
    category: 'اتفاق الطرفين',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% باتفاق الطرفين كتابة وفقاً للمادة 74/1 والمادة 84'
  },
  {
    id: 'article_80_dismissal',
    name: 'فسخ عقد العمل من قبل صاحب العمل وفقاً للمادة 80 من نظام العمل',
    article: 'المادة 80',
    category: 'فسخ تأديبي',
    entitlement_type: 'zero',
    notes: 'حرمان من مكافأة نهاية الخدمة والتعويض والإشعار لارتكاب مخالفة جسيمة وفقاً للمادة 80'
  },
  {
    id: 'contract_expiry',
    name: 'إنتهاء العقد بإنتهاء مدته',
    article: 'المادة 74/2',
    category: 'انتهاء العقد',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% لانقضاء مدة العقد المحدد وفقاً للمادة 74/2 والمادة 84'
  },
  {
    id: 'retirement',
    name: 'بلوغ العامل سن التقاعد وفقاً للمادة 74 من نظام العمل',
    article: 'المادة 74/4',
    category: 'تقاعد',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% عند بلوغ سن التقاعد النظامي وفقاً للمادة 74/4 والمادة 84'
  },
  {
    id: 'facility_closure',
    name: 'إغلاق المنشأة نهائياً وفقاً للمادة 74 من نظام العمل',
    article: 'المادة 74/6',
    category: 'إغلاق المنشأة',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% عند إغلاق المنشأة نهائياً وتصفيتها وفقاً للمادة 74/6'
  },
  {
    id: 'activity_termination',
    name: 'إنهاء النشاط الذي يعمل فيه العامل وفقاً للمادة 74 من نظام العمل',
    article: 'المادة 74/7',
    category: 'إنهاء النشاط',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% عند إنهاء النشاط وفقاً للمادة 74/7'
  },
  {
    id: 'article_77_unlawful',
    name: 'إنهاء العقد دون سبب مشروع وفقاً للمادة 77 من نظام العمل',
    article: 'المادة 77',
    category: 'إنهاء غير مشروع',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% للمكافأة بالإضافة للتعويض المقرر بموجب المادة 77'
  },
  {
    id: 'employee_death',
    name: 'وفاة العامل وفقاً للمادة 79 من نظام العمل',
    article: 'المادة 79',
    category: 'وفاة',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% يصرف للورثة الشرعيين وفقاً للمادة 79 والمادة 84'
  },
  {
    id: 'work_injury_disability',
    name: 'عجز العامل عن العمل (الناتج عن إصابة العمل) وفقاً للمادة 137 من نظام العمل',
    article: 'المادة 137',
    category: 'عجز وإصابة',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% بالإضافة لتعويضات إصابة العمل وفقاً للمادة 137'
  },
  {
    id: 'transfer_of_ownership',
    name: 'إنتقال ملكية المنشأة (الفردية) إلى مالك جديد وفقاً للمادة 18 من نظام العمل',
    article: 'المادة 18',
    category: 'انتقال ملكية',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% عند تصفية الحقوق وفقاً للمادة 18'
  },
  {
    id: 'female_maternity_leave',
    name: 'إنهاء المرأة العاملة العقد بسبب الوضع وفقاً للمادة 87 من نظام العمل',
    article: 'المادة 87',
    category: 'استثناء الوضع',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% خلال 6 أشهر من تاريخ الوضع استثناءً من المادة 85'
  },
  {
    id: 'female_marriage_leave',
    name: 'إنهاء المرأة العاملة العقد بسبب الزواج وفقاً للمادة 87 من نظام العمل',
    article: 'المادة 87',
    category: 'استثناء الزواج',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% خلال 3 أشهر من تاريخ عقد الزواج استثناءً من المادة 85'
  },
  {
    id: 'employer_death',
    name: 'وفاة صاحب العمل وفقاً للمادة 79 من نظام العمل إذا كانت شخصيته قد روعيت في عقد العمل',
    article: 'المادة 79',
    category: 'وفاة صاحب العمل',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% عند وفاة صاحب العمل الذي كانت شخصيته محل اعتبار'
  },
  {
    id: 'article_81_employee_leave',
    name: 'فسخ العقد من قبل العامل وفقاً للمادة 81 من نظام العمل',
    article: 'المادة 81 و87',
    category: 'فسخ من العامل',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% لفسخ العقد من العامل لإخلال صاحب العمل بالتزاماته'
  },
  {
    id: 'force_majeure',
    name: 'القوة القاهرة وفقاً للمادة 74 من نظام العمل',
    article: 'المادة 74/5 و87',
    category: 'قوة قاهرة',
    entitlement_type: 'full',
    notes: 'استحقاق كامل بنسبة 100% لانتهاء العقد بسبب القوة القاهرة وفقاً للمادة 74/5'
  }
];

function getAllTerminated(filters = {}) {
  let sql = `
    SELECT t.*
    FROM terminated_employees t
    WHERE 1=1
  `;
  const params = [];

  if (filters.termination_type) {
    sql += ` AND t.termination_type LIKE ?`;
    params.push(`%${filters.termination_type}%`);
  }

  if (filters.clearance_status) {
    sql += ` AND t.clearance_status = ?`;
    params.push(filters.clearance_status);
  }

  if (filters.qiwa_status) {
    sql += ` AND t.qiwa_status = ?`;
    params.push(filters.qiwa_status);
  }

  if (filters.search) {
    sql += ` AND (t.emp_code LIKE ? OR t.full_name_ar LIKE ? OR t.national_id LIKE ? OR t.department_name LIKE ?)`;
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
  }

  sql += ` ORDER BY t.termination_date DESC, t.id DESC`;
  return query(sql, params);
}

function getTerminatedById(id) {
  return get('SELECT * FROM terminated_employees WHERE id = ?', [id]);
}

/**
 * Calculate exact service period in years, months, days and fractional years
 */
function calculateServicePeriod(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return { years: 0, months: 0, days: 0, totalYears: 0, formatted: '0 سنة' };
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Exact day count
  const diffDays = Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
  const totalYears = Math.round((diffDays / 365.25) * 100) / 100;

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'سنة' : (years === 2 ? 'سنتان' : (years <= 10 ? 'سنوات' : 'سنة'))}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'شهر' : (months === 2 ? 'شهران' : (months <= 10 ? 'أشهر' : 'شهر'))}`);
  if (days > 0) parts.push(`${days} ${days === 1 ? 'يوم' : (days === 2 ? 'يومان' : (days <= 10 ? 'أيام' : 'يوماً'))}`);

  return {
    years,
    months,
    days,
    diffDays,
    totalYears,
    formatted: parts.length > 0 ? parts.join(' و ') : 'أقل من يوم'
  };
}

/**
 * Matches user-provided termination type string to official Qiwa reason object
 */
function resolveTerminationReason(reasonString) {
  if (!reasonString) return QIWA_TERMINATION_REASONS[0];

  const str = String(reasonString).trim();

  // 1. Exact match by name or id
  const exact = QIWA_TERMINATION_REASONS.find(r => r.name === str || r.id === str);
  if (exact) return exact;

  // 2. Keyword-based matching for robust backward compatibility
  if (str.includes('مادة 80') || str.includes('المادة 80') || str.includes('فصل') || str.includes('فسخ بموجب')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'article_80_dismissal');
  }
  if (str.includes('تجربة') || str.includes('المادة 53') || str.includes('مادة 53')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'probation_termination');
  }
  if (str.includes('استقالة') || str.includes('المادة 85') || str.includes('طلب العامل')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'resignation');
  }
  if (str.includes('اتفاق') || str.includes('المادة 74/1') || str.includes('74/1')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'mutual_agreement');
  }
  if (str.includes('انتهاء مدة') || str.includes('إنتهاء العقد') || str.includes('انتهاء العقد') || str.includes('المادة 74/2') || str.includes('74/2')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'contract_expiry');
  }
  if (str.includes('تقاعد') || str.includes('التقاعد') || str.includes('74/4')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'retirement');
  }
  if (str.includes('إغلاق') || str.includes('اغلاق') || str.includes('74/6')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'facility_closure');
  }
  if (str.includes('إنهاء النشاط') || str.includes('انهاء النشاط') || str.includes('74/7')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'activity_termination');
  }
  if (str.includes('دون سبب مشروع') || str.includes('المادة 77') || str.includes('مادة 77') || str.includes('صاحب العمل')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'article_77_unlawful');
  }
  if (str.includes('وفاة صاحب العمل')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'employer_death');
  }
  if (str.includes('وفاة العامل') || (str.includes('وفاة') && !str.includes('صاحب العمل'))) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'employee_death');
  }
  if (str.includes('عجز') || str.includes('إصابة') || str.includes('137')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'work_injury_disability');
  }
  if (str.includes('ملكية') || str.includes('المادة 18') || str.includes('مادة 18')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'transfer_of_ownership');
  }
  if (str.includes('وضع') || str.includes('الوضع') || (str.includes('87') && str.includes('وضع'))) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'female_maternity_leave');
  }
  if (str.includes('زواج') || str.includes('الزواج') || (str.includes('87') && str.includes('زواج'))) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'female_marriage_leave');
  }
  if (str.includes('المادة 81') || str.includes('مادة 81')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'article_81_employee_leave');
  }
  if (str.includes('قوة قاهرة') || str.includes('قاهرة') || str.includes('طارئة')) {
    return QIWA_TERMINATION_REASONS.find(r => r.id === 'force_majeure');
  }

  return QIWA_TERMINATION_REASONS.find(r => r.id === 'contract_expiry') || QIWA_TERMINATION_REASONS[0];
}

/**
 * Base Gratuity Calculation Engine based on Saudi Labor Law Article 84
 * - First 5 years: Half-month salary per year
 * - Subsequent years: Full-month salary per year
 */
function calculateBaseGratuity(lastSalary, totalYears) {
  if (totalYears <= 0 || lastSalary <= 0) return 0;
  let base = 0;
  if (totalYears <= 5) {
    base = totalYears * (lastSalary * 0.5);
  } else {
    base = (5 * (lastSalary * 0.5)) + ((totalYears - 5) * lastSalary);
  }
  return Math.round(base * 100) / 100;
}

/**
 * Determine Entitlement Rate and Statutory Explanation based on Qiwa & Saudi Labor Law
 */
function calculateEntitlement(reasonObj, totalYears) {
  let rate = 1.0;
  let pctLabel = '100% (المكافأة كاملة)';
  let statutoryRule = '';

  if (reasonObj.entitlement_type === 'zero') {
    rate = 0.0;
    pctLabel = '0% (لا يستحق مكافأة)';
    statutoryRule = reasonObj.id === 'article_80_dismissal'
      ? 'وفقاً للمادة 80 من نظام العمل: فسخ العقد لسبب مشروع يسقط حق العامل في مكافأة نهاية الخدمة والتعويض والإشعار.'
      : 'وفقاً للمادة 53 من نظام العمل: إنهاء العقد خلال فترة التجربة لا يرتب أي استحقاق لمكافأة نهاية الخدمة.';
  } else if (reasonObj.entitlement_type === 'resignation_scale') {
    if (totalYears < 2) {
      rate = 0.0;
      pctLabel = '0% (خدمة أقل من سنتين)';
      statutoryRule = 'وفقاً للمادة 85 من نظام العمل: لا يستحق العامل المستقيل أي مكافأة إذا كانت مدة خدمته أقل من سنتين متتاليتين.';
    } else if (totalYears < 5) {
      rate = 1.0 / 3.0;
      pctLabel = '33.33% (ثلث المكافأة)';
      statutoryRule = 'وفقاً للمادة 85 من نظام العمل: يستحق العامل المستقيل ثلث المكافأة بعد خدمة لا تقل عن سنتين ولا تزيد على خمس سنوات.';
    } else if (totalYears < 10) {
      rate = 2.0 / 3.0;
      pctLabel = '66.67% (ثلثي المكافأة)';
      statutoryRule = 'وفقاً للمادة 85 من نظام العمل: يستحق العامل المستقيل ثلثي المكافأة إذا زادت مدة خدمته على خمس سنوات ولم تبلغ عشر سنوات.';
    } else {
      rate = 1.0;
      pctLabel = '100% (المكافأة كاملة)';
      statutoryRule = 'وفقاً للمادة 85 من نظام العمل: يستحق العامل المستقيل المكافأة كاملة إذا بلغت مدة خدمته عشر سنوات فأكثر.';
    }
  } else {
    // Full entitlement (100%)
    rate = 1.0;
    pctLabel = '100% (المكافأة كاملة)';
    statutoryRule = `وفقاً للمادة 84 و ${reasonObj.article} من نظام العمل: يستحق العامل مكافأة نهاية الخدمة كاملة بنسبة 100%.`;
  }

  return { rate, pctLabel, statutoryRule };
}

/**
 * Complete End of Service & Settlement Calculation Engine (Qiwa Platform Compliant)
 */
function calculateSettlement(data) {
  const {
    emp_id,
    termination_date,
    termination_type = 'استقالة الموظف',
    deductions_amount = 0
  } = data;

  const emp = get(`
    SELECT e.*, d.name_ar AS department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.id = ?
  `, [emp_id]);

  if (!emp) throw new Error('الموظف غير موجود');

  const termDateStr = termination_date || new Date().toISOString().split('T')[0];
  const joinDateStr = emp.join_date || termDateStr;

  const period = calculateServicePeriod(joinDateStr, termDateStr);
  const totalYears = period.totalYears;

  const grossSalary = (emp.basic_salary || 0) + (emp.housing_allowance || 0) + (emp.transport_allowance || 0) + (emp.other_allowance || 0);
  const lastSalary = grossSalary > 0 ? grossSalary : (emp.basic_salary || 0);

  const baseGratuity = calculateBaseGratuity(lastSalary, totalYears);
  const reasonObj = resolveTerminationReason(termination_type);
  const entitlement = calculateEntitlement(reasonObj, totalYears);

  const finalGratuity = Math.round(baseGratuity * entitlement.rate * 100) / 100;

  // Leave balance compensation (المادة 111: رصيد الإجازات المستحق مضروباً في الأجر اليومي)
  const leaveDays = Number(emp.annual_leave_balance) || 0;
  const dailyWage = lastSalary / 30.0;
  const leaveCompensation = Math.max(0, Math.round(leaveDays * dailyWage * 100) / 100);

  const deductions = Math.max(0, Number(deductions_amount) || 0);
  const totalSettlement = Math.max(0, Math.round((finalGratuity + leaveCompensation - deductions) * 100) / 100);

  return {
    employee: {
      id: emp.id,
      emp_code: emp.emp_code,
      full_name_ar: emp.full_name_ar,
      national_id: emp.national_id,
      nationality: emp.nationality,
      job_title_ar: emp.job_title_ar,
      department_name: emp.department_name,
      join_date: emp.join_date,
      contract_type: emp.contract_type || 'عقد محدد المدة',
      basic_salary: emp.basic_salary,
      last_salary: lastSalary,
      leave_balance: leaveDays
    },
    termination_date: termDateStr,
    termination_type: reasonObj.name,
    termination_reason_id: reasonObj.id,
    statutory_article: reasonObj.article,
    statutory_rule: entitlement.statutoryRule,
    service_period: {
      years: period.years,
      months: period.months,
      days: period.days,
      total_years: period.totalYears,
      formatted: period.formatted
    },
    service_years: totalYears,
    base_gratuity: baseGratuity,
    entitlement_rate: entitlement.rate,
    entitlement_percentage: entitlement.pctLabel,
    end_of_service_reward: finalGratuity,
    leave_compensation: leaveCompensation,
    deductions_amount: deductions,
    total_settlement: totalSettlement
  };
}

function recordTermination(data) {
  const {
    emp_id,
    termination_date,
    termination_type = 'استقالة الموظف',
    termination_reason = '',
    clearance_status = 'قيد إجراءات إخلاء الطرف',
    qiwa_status = 'بانتظار الإسقاط من قوى',
    notes = '',
    deductions_amount = 0
  } = data;

  const calc = calculateSettlement({ emp_id, termination_date, termination_type, deductions_amount });
  const emp = calc.employee;

  const sql = `
    INSERT INTO terminated_employees (
      emp_id, emp_code, full_name_ar, national_id, nationality,
      department_name, job_title_ar, join_date, termination_date,
      termination_type, termination_reason, service_years, last_salary,
      end_of_service_reward, leave_compensation, deductions_amount,
      total_settlement, clearance_status, qiwa_status, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `;

  const finalReason = termination_reason || calc.statutory_rule;

  const result = run(sql, [
    emp.id,
    emp.emp_code || '',
    emp.full_name_ar || '',
    emp.national_id || '',
    emp.nationality || '',
    emp.department_name || '',
    emp.job_title_ar || '',
    emp.join_date || '',
    calc.termination_date || '',
    calc.termination_type || termination_type,
    finalReason,
    calc.service_years || 0,
    calc.employee.last_salary || 0,
    calc.end_of_service_reward || 0,
    calc.leave_compensation || 0,
    calc.deductions_amount || 0,
    calc.total_settlement || 0,
    clearance_status || '',
    qiwa_status || '',
    notes || ''
  ]);

  // Update employee status to 'منهي خدماته'
  run("UPDATE employees SET status = 'منهي خدماته' WHERE id = ?", [emp.id]);

  return getTerminatedById(result.lastInsertRowid);
}

function exportToExcel() {
  const records = getAllTerminated();
  const rows = records.map((r, i) => ({
    'م': i + 1,
    'الرقم الوظيفي': r.emp_code,
    'الاسم الكامل': r.full_name_ar,
    'الهوية / الإقامة': r.national_id || '',
    'الجنسية': r.nationality,
    'الإدارة': r.department_name || '',
    'المسمى الوظيفي': r.job_title_ar,
    'تاريخ التعيين': r.join_date || '',
    'تاريخ إنهاء الخدمة': r.termination_date,
    'نوع الإنهاء (قوى)': r.termination_type,
    'سنوات الخدمة': r.service_years,
    'آخر راتب': r.last_salary,
    'مكافأة نهاية الخدمة': r.end_of_service_reward,
    'تعويض رصيد الإجازات': r.leave_compensation,
    'الخصومات': r.deductions_amount,
    'صافي المستحقات': r.total_settlement,
    'حالة إخلاء الطرف': r.clearance_status,
    'حالة منصة قوى': r.qiwa_status,
    'الأساس النظامي': r.termination_reason || '',
    'ملاحظات': r.notes || ''
  }));

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows);
  ws['!views'] = [{ rightToLeft: true }];
  xlsx.utils.book_append_sheet(wb, ws, 'الموظفون المنهي خدماتهم');
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

function generateTemplateExcel() {
  const sample = [
    {
      'الرقم الوظيفي': 'JM-1050',
      'الاسم الكامل': 'اسم الموظف التجريبي',
      'الهوية / الإقامة': '1088990011',
      'الجنسية': 'سعودي',
      'الإدارة': 'إدارة المبيعات',
      'المسمى الوظيفي': 'بائع',
      'تاريخ التعيين': '2022-01-01',
      'تاريخ إنهاء الخدمة': '2026-10-01',
      'نوع الإنهاء': 'استقالة الموظف',
      'سبب الإنهاء': 'المادة 85 من نظام العمل',
      'مكافأة نهاية الخدمة': 5000,
      'تعويض رصيد الإجازات': 1200,
      'الخصومات': 0,
      'صافي المستحقات': 6200,
      'حالة إخلاء الطرف': 'مكتمل',
      'حالة منصة قوى': 'تم الإسقاط',
      'ملاحظات': 'تم تسليم كافة العهد'
    }
  ];
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(sample);
  ws['!views'] = [{ rightToLeft: true }];
  xlsx.utils.book_append_sheet(wb, ws, 'نموذج_استيراد_المنهي_خدماتهم');
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

function importFromExcel(buffer) {
  const wb = xlsx.read(buffer, { type: 'buffer' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws);

  let imported = 0;
  for (const row of data) {
    const code = String(row['الرقم الوظيفي'] || '').trim();
    const name = String(row['الاسم الكامل'] || row['اسم الموظف'] || '').trim();
    if (!name && !code) continue;

    // Find employee by code or national_id or name
    let emp = null;
    if (code) emp = get('SELECT * FROM employees WHERE emp_code = ?', [code]);
    if (!emp && row['الهوية / الإقامة']) {
      emp = get('SELECT * FROM employees WHERE national_id = ?', [String(row['الهوية / الإقامة']).trim()]);
    }
    if (!emp && name) {
      emp = get('SELECT * FROM employees WHERE full_name_ar = ?', [name]);
    }

    const termDate = row['تاريخ إنهاء الخدمة'] || new Date().toISOString().split('T')[0];
    const rawType = row['نوع الإنهاء'] || row['نوع الإنهاء (قوى)'] || 'استقالة الموظف';
    const reasonObj = resolveTerminationReason(rawType);
    const termType = reasonObj.name;

    const reward = Number(row['مكافأة نهاية الخدمة']) || 0;
    const leaveComp = Number(row['تعويض رصيد الإجازات']) || 0;
    const deduct = Number(row['الخصومات']) || 0;
    const total = Number(row['صافي المستحقات']) || (reward + leaveComp - deduct);

    run(`
      INSERT INTO terminated_employees (
        emp_id, emp_code, full_name_ar, national_id, nationality,
        department_name, job_title_ar, join_date, termination_date,
        termination_type, termination_reason, service_years, last_salary,
        end_of_service_reward, leave_compensation, deductions_amount,
        total_settlement, clearance_status, qiwa_status, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, [
      emp ? emp.id : null,
      code || (emp ? emp.emp_code : 'JM-TERM'),
      name || (emp ? emp.full_name_ar : 'موظف'),
      row['الهوية / الإقامة'] || (emp ? emp.national_id : ''),
      row['الجنسية'] || (emp ? emp.nationality : 'سعودي'),
      row['الإدارة'] || (emp ? emp.department_name : ''),
      row['المسمى الوظيفي'] || (emp ? emp.job_title_ar : ''),
      row['تاريخ التعيين'] || (emp ? emp.join_date : ''),
      termDate,
      termType,
      row['سبب الإنهاء'] || row['الأساس النظامي'] || reasonObj.notes || '',
      Number(row['سنوات الخدمة']) || 0,
      Number(row['آخر راتب']) || (emp ? emp.basic_salary : 0),
      reward,
      leaveComp,
      deduct,
      total,
      row['حالة إخلاء الطرف'] || 'مكتمل',
      row['حالة منصة قوى'] || 'تم الإسقاط',
      row['ملاحظات'] || ''
    ]);

    if (emp) {
      run("UPDATE employees SET status = 'منهي خدماته' WHERE id = ?", [emp.id]);
    }
    imported++;
  }

  return { success: true, count: imported };
}

function getTerminatedKPIs() {
  const total = get('SELECT COUNT(*) AS c FROM terminated_employees').c || 0;
  const resignations = get("SELECT COUNT(*) AS c FROM terminated_employees WHERE termination_type LIKE '%استقالة%'").c || 0;
  const contracts = get("SELECT COUNT(*) AS c FROM terminated_employees WHERE termination_type LIKE '%عقد%' OR termination_type LIKE '%إنهاء%'").c || 0;
  const pendingClearance = get("SELECT COUNT(*) AS c FROM terminated_employees WHERE clearance_status != 'مكتمل'").c || 0;
  const totalSettlements = get('SELECT COALESCE(SUM(total_settlement), 0) AS s FROM terminated_employees').s || 0;
  return { total, resignations, contracts, pendingClearance, totalSettlements };
}

module.exports = {
  QIWA_TERMINATION_REASONS,
  getAllTerminated,
  getTerminatedById,
  calculateServicePeriod,
  resolveTerminationReason,
  calculateBaseGratuity,
  calculateEntitlement,
  calculateSettlement,
  recordTermination,
  exportToExcel,
  generateTemplateExcel,
  importFromExcel,
  getTerminatedKPIs
};
