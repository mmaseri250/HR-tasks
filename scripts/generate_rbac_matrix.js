// scripts/generate_rbac_matrix.js
const { db, query } = require('../server/database/db');
const fs = require('fs');
const path = require('path');

const emps = query(`
  SELECT e.id, e.emp_code, e.full_name_ar, e.direct_manager_name, e.manager_id,
         e.job_title_ar, d.name_ar as dept_name, b.name_ar as branch_name
  FROM employees e
  LEFT JOIN departments d ON e.department_id = d.id
  LEFT JOIN branches b ON e.branch_id = b.id
  WHERE e.status = 'نشط'
  ORDER BY e.emp_code ASC
`);

// Role Mapping based on Management Hierarchy & Job Function
// 1. Admin: System Admin
// 2. HR Executive / Specialist: عبدالملك الشريف (HR Director / Top Executive), شامة عسيري (HR Specialist)
// 3. Department & Branch Managers: Employees who have direct subordinates
// 4. Employee (ESS): Standard employees who have a manager and no subordinates

const managersWithSubordinates = query(`
  SELECT DISTINCT direct_manager_name FROM employees WHERE status = 'نشط' AND direct_manager_name IS NOT NULL
`).map(r => r.direct_manager_name);

const matrix = emps.map(e => {
  let role = 'employee';
  let roleNameAr = 'موظف (الخدمة الذاتية ESS)';
  let dataScope = 'OWN';
  let allowedPages = ['الخدمة الذاتية (ESS)', 'سجل الحضور الشخصي', 'قسيمة الراتب', 'طلباتي', 'التعاميم والسياسات'];
  let allowedActions = ['تقديم طلب إجازة', 'طلب سلفة', 'طلب إخلاء طرف', 'عرض الحضور', 'تحميل قسيمة الراتب'];

  if (e.emp_code === 'JM-0001' || e.full_name_ar.includes('عبدالملك سعيد الشريف')) {
    role = 'hr_manager';
    roleNameAr = 'المدير التنفيذي للموارد البشرية';
    dataScope = 'ALL';
    allowedPages = ['كافة صفحات النظام', 'لوحة المؤشرات التنفيذية', 'شؤون الموظفين', 'الموافقات', 'مسيرات الرواتب WPS', 'التقارير الشاملة'];
    allowedActions = ['كافة الإجراءات', 'الاعتماد النهائي للإجازات', 'تعديل الأرصدة', 'إصدار القرارات الجزائية', 'اعتماد المسيرات'];
  } else if (e.full_name_ar.includes('شامة علي محمد عسيري')) {
    role = 'hr_specialist';
    roleNameAr = 'أخصائي موارد بشرية';
    dataScope = 'ALL';
    allowedPages = ['شؤون الموظفين', 'سير الموافقات', 'التراخيص والسجلات', 'إدارة الأسطول (تم)', 'التعاميم'];
    allowedActions = ['تدقيق طلبات الإجازات (المرحلة 2)', 'تسجيل الموظفين', 'متابعة الوثائق', 'تصدير التقارير'];
  } else if (managersWithSubordinates.includes(e.full_name_ar) || e.job_title_ar.includes('مدير') || e.job_title_ar.includes('مشرف')) {
    role = 'dept_manager';
    roleNameAr = 'مدير إدارة / فرع (مدير مباشر)';
    dataScope = 'DIRECT_SUBORDINATES';
    allowedPages = ['صفحة المدير', 'الخدمة الذاتية', 'فريق العمل', 'اعتماد طلبات الفريق', 'مهام الفريق', 'التعاميم'];
    allowedActions = ['اعتماد/رفض طلبات المرؤوسين (المرحلة 1)', 'إسناد مهام للفريق', 'طلب قرار جزائي للمرؤوس'];
  }

  return {
    emp_code: e.emp_code,
    full_name_ar: e.full_name_ar,
    job_title: e.job_title_ar,
    department: e.dept_name,
    direct_manager: e.direct_manager_name || 'مجلس الإدارة / المدير العام',
    role: role,
    role_ar: roleNameAr,
    data_scope: dataScope,
    allowed_pages: allowedPages.join(' | '),
    allowed_actions: allowedActions.join(' | ')
  };
});

fs.writeFileSync(path.join(__dirname, 'rbac_108_matrix.json'), JSON.stringify(matrix, null, 2), 'utf8');
console.log(`Generated RBAC Matrix for ${matrix.length} active employees.`);
const summary = matrix.reduce((acc, m) => { acc[m.role] = (acc[m.role] || 0) + 1; return acc; }, {});
console.log('Role Distribution:', summary);
