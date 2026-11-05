const fs = require('node:fs');
const path = require('node:path');

console.log('--- Patching Frontend Overhaul ---');

const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
const appJsPath = path.join(__dirname, '..', 'public', 'js', 'app.js');
const styleCssPath = path.join(__dirname, '..', 'public', 'css', 'style.css');

let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
let appJs = fs.readFileSync(appJsPath, 'utf8');
let styleCss = fs.readFileSync(styleCssPath, 'utf8');

// 1. Add .hr-hub-card to style.css
if (!styleCss.includes('.hr-hub-card')) {
  styleCss += `

/* Central HR Control Center Cards */
.hr-hub-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  padding: 1.25rem;
  box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hr-hub-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 24px -4px rgba(112, 12, 20, 0.08), 0 8px 12px -6px rgba(112, 12, 20, 0.04);
  border-color: rgba(112, 12, 20, 0.3);
}

.subtab-active-pill {
  background: #700c14 !important;
  color: #ffffff !important;
  font-weight: 800 !important;
  box-shadow: 0 2px 4px rgba(112, 12, 20, 0.25);
}
`;
  fs.writeFileSync(styleCssPath, styleCss, 'utf8');
  console.log('Updated style.css with .hr-hub-card styles.');
}

// 2. Streamline Sidebar in index.html
const sidebarStartMarker = '<!-- 1. Dashboard -->';
const sidebarEndMarker = '<!-- Desktop Sidebar Logout & Trust Badge -->';

const newSidebarHtml = `<!-- 1. Dashboard -->
        <button onclick="switchTab('dashboard')" id="nav-dashboard" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-brand nav-item-active">
          <i class="fa-solid fa-chart-pie w-5 text-center text-base"></i>
          <span data-i18n="nav_dashboard">لوحة المؤشرات</span>
        </button>

        <!-- 2. Central HR Control Center (NEW UNIFIED HUB) -->
        <button onclick="switchTab('hr-center')" id="nav-hr-center" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-brand hover:text-brand-dark bg-brand/5 hover:bg-brand/10 border border-brand/20 shadow-xs">
          <i class="fa-solid fa-cubes w-5 text-center text-base text-brand"></i>
          <span class="flex-1 text-right font-black">لوحة تحكم الموارد البشرية</span>
          <span class="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-brand text-amber-300">14 قسماً</span>
        </button>

        <!-- 3. Self-Service (ESS) -->
        <button onclick="switchTab('selfservice')" id="nav-selfservice" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-brand">
          <i class="fa-solid fa-user-shield w-5 text-center text-base text-indigo-600"></i>
          <span data-i18n="nav_selfservice">بوابة الخدمة الذاتية (ESS)</span>
        </button>

        <!-- 4. Administrative Circulars -->
        <button onclick="switchTab('circulars')" id="nav-circulars" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-brand">
          <i class="fa-solid fa-bullhorn w-5 text-center text-base text-rose-700"></i>
          <span class="flex-1 text-right" data-i18n="nav_circulars">التعاميم والقرارات الإدارية</span>
          <span id="badgeNavCirculars" class="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300">تعاميم</span>
        </button>

        <!-- 5. Fleet Management -->
        <button onclick="switchTab('fleet')" id="nav-fleet" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-brand">
          <i class="fa-solid fa-car-side w-5 text-center text-base text-blue-600"></i>
          <span class="flex-1 text-right" data-i18n="nav_fleet">إدارة الأسطول ومنصة تم</span>
          <span id="badgeNavFleet" class="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300">تم</span>
        </button>

        <!-- 6. Company Licenses -->
        <button onclick="switchTab('licenses')" id="nav-licenses" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-brand">
          <i class="fa-solid fa-file-shield w-5 text-center text-base text-teal-700"></i>
          <span class="flex-1 text-right" data-i18n="nav_licenses">السجلات والتراخيص الحكومية</span>
          <span id="badgeNavLicenses" class="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-900 border border-teal-300">تراخيص</span>
        </button>

        <!-- 7. Comprehensive Reports -->
        <button onclick="switchTab('reports')" id="nav-reports" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-brand">
          <i class="fa-solid fa-chart-column w-5 text-center text-base text-amber-600"></i>
          <span class="flex-1 text-right" data-i18n="nav_reports">التقارير المؤسسية الشاملة</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">شامل</span>
        </button>

        <div class="pt-3 border-t border-slate-100 px-3 py-1 text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <i class="fa-solid fa-shield-halved text-brand text-[10px]"></i>
          <span>الإدارة والتحكم</span>
        </div>

        <!-- 8. Organization & Structure -->
        <button onclick="switchTab('organization')" id="nav-organization" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-brand">
          <i class="fa-solid fa-sitemap w-5 text-center text-base text-brand"></i>
          <span data-i18n="nav_org">الهيكل التنظيمي والفروع</span>
        </button>

        <!-- 9. Users & Permissions -->
        <button onclick="switchTab('users')" id="nav-users" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-brand">
          <i class="fa-solid fa-users-gear w-5 text-center text-base text-purple-600"></i>
          <span data-i18n="nav_users">المستخدمون والصلاحيات</span>
        </button>

        <!-- Preserved Hidden Elements for Compatibility -->
        <button onclick="switchTab('employees-db')" id="nav-employees-db" class="hidden"></button>
        <button onclick="switchTab('leaves')" id="nav-leaves" class="hidden"><span id="badgeNavLeaves"></span></button>
        <button onclick="switchTab('tasks')" id="nav-tasks" class="hidden"><span id="badgeNavTasks"></span></button>
        <button onclick="switchTab('forms')" id="nav-forms" class="hidden"></button>
        <button onclick="switchTab('compliance')" id="nav-compliance" class="hidden"><span id="badgeNavCompliance"></span></button>
        <button onclick="switchTab('penalties')" id="nav-penalties" class="hidden"></button>
        <button onclick="switchTab('attendance')" id="nav-attendance" class="hidden"></button>
        <button onclick="switchTab('payroll')" id="nav-payroll" class="hidden"></button>
        <button onclick="switchTab('loans')" id="nav-loans" class="hidden"></button>
        <button onclick="switchTab('terminated')" id="nav-terminated" class="hidden"></button>
        <button onclick="switchTab('attendance-notices')" id="nav-attendance-notices" class="hidden"><span id="badgeNavNotices"></span></button>
        <button onclick="switchTab('absence')" id="nav-absence" class="hidden"></button>
        <button onclick="switchTab('recruitment')" id="nav-recruitment" class="hidden"><span id="badgeNavRecruitment"></span></button>
        <button onclick="switchTab('insurance')" id="nav-insurance" class="hidden"><span id="badgeNavInsurance"></span></button>
        <button onclick="switchTab('branches')" id="nav-branches" class="hidden"></button>
        <button onclick="switchTab('audit-log')" id="nav-audit-log" class="hidden"></button>
        <button onclick="switchTab('data-exchange')" id="nav-data-exchange" class="hidden"></button>
        <button onclick="switchTab('docs')" id="nav-docs" class="hidden"></button>

        `;

if (indexHtml.includes(sidebarStartMarker) && indexHtml.includes(sidebarEndMarker)) {
  const p1 = indexHtml.indexOf(sidebarStartMarker);
  const p2 = indexHtml.indexOf(sidebarEndMarker);
  indexHtml = indexHtml.substring(0, p1) + newSidebarHtml + indexHtml.substring(p2);
  console.log('Streamlined sidebar successfully.');
}

// 3. Terminology updates
indexHtml = indexHtml.replace(
  '<span class="text-[9px] font-bold text-brand leading-tight">الإدارة والتشغيل</span>',
  '<span class="text-[9px] font-bold text-brand leading-tight">نظام الموارد البشرية</span>'
);

// 4. Create view-hr-center
const hrCenterSectionHtml = `
      <!-- =====================================================================
           VIEW HR CENTER: CENTRAL HR CONTROL CENTER (مركز لوحة تحكم الموارد البشرية)
           ===================================================================== -->
      <section id="view-hr-center" class="space-y-6 hidden">

        <!-- Executive Banner -->
        <div class="brand-gradient text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-brand-gold/30">
          <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div class="space-y-2 max-w-2xl">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-brand shadow">
                  <i class="fa-solid fa-cubes"></i> المنصة المركزية الموحدة
                </span>
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-amber-200 border border-white/20">
                  <i class="fa-solid fa-check-double text-emerald-400"></i> 14 نظاماً تشغيلياً متكاملاً
                </span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black text-white leading-tight">مركز لوحة تحكم الموارد البشرية</h2>
              <p class="text-xs sm:text-sm text-white/85 leading-relaxed">
                الواجهة المركزية الموحدة لإدارة كافة العمليات المؤسسية، النماذج والمستندات، الأفراد، السياسات، الامتثال وسير العمل لشركة جوهرة المجد.
              </p>
            </div>
            <!-- Quick Hub Search -->
            <div class="w-full md:w-80">
              <div class="relative">
                <input type="text" id="hrCenterSearchInput" oninput="filterHrCenterCards(this.value)" placeholder="ابحث في الأقسام والأنظمة (14 قسماً)..." class="w-full bg-white/15 backdrop-blur-md text-white placeholder-white/60 text-xs rounded-2xl py-3 pr-10 pl-4 border border-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400">
                <i class="fa-solid fa-magnifying-glass absolute right-3.5 top-3.5 text-amber-300 text-xs"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- 14 Interactive Glassmorphism Cards Grid -->
        <div id="hrCenterCardsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">

          <!-- 1. Employee Database -->
          <div class="hr-hub-card group" data-card-title="قاعدة بيانات الموظفين" onclick="switchTab('employees-db')">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-amber-300 flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-users-gear"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">108 نشط • 5 منتهي</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-brand transition">قاعدة بيانات الموظفين</h3>
              <p class="text-xs text-slate-500 line-clamp-2">إدارة سجلات الموظفين، العقود، البدلات، بطاقة 360، ورفع المستندات والصور.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand">
              <span>فتح قاعدة البيانات</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 2. Leaves Management -->
          <div class="hr-hub-card group" data-card-title="إدارة الإجازات والموافقات" onclick="switchTab('leaves')">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-calendar-check"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">تراكم ديناميكي</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-teal-700 transition">إدارة الإجازات وسير العمل</h3>
              <p class="text-xs text-slate-500 line-clamp-2">محرك الاحتساب التراكمي المعتمد 2026-11-05، التحقق من الرصيد والبديل الإلزامي.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>إدارة الإجازات</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 3. Official Documents & Forms (Word) -->
          <div class="hr-hub-card group" data-card-title="النماذج والمستندات Word" onclick="switchTab('forms')">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-file-word"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">8 نماذج Word رسمية</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-blue-700 transition">النماذج والمستندات</h3>
              <p class="text-xs text-slate-500 line-clamp-2">توليد وتنزيل النماذج الرسمية Word: طلب إجازة، إنهاء عقد، إخلاء طرف، إخطارات وعقوبات.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>استعراض النماذج</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 4. Compliance & Muqeem -->
          <div class="hr-hub-card group" data-card-title="مؤشر الامتثال ولوائح مقيم" onclick="switchTab('compliance')">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">87 مقيم نشط</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-emerald-700 transition">الامتثال ولوائح مقيم</h3>
              <p class="text-xs text-slate-500 line-clamp-2">صلاحيات الإقامات والجوازات، رخص العمل، مطابقة بيانات مقيم ونطاقات التوطين.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>فحص الامتثال</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 5. Penalties Regulations (لائحة العقوبات والجزاءات - 50 بنداً) -->
          <div class="hr-hub-card group" data-card-title="لائحة العقوبات والجزاءات" onclick="switchTab('penalties'); setTimeout(() => switchPenaltiesSubTab('regulations'), 100);">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-book-bookmark"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">50 بنداً معتمداً</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-amber-700 transition">لائحة العقوبات والجزاءات</h3>
              <p class="text-xs text-slate-500 line-clamp-2">اللائحة الرسمية المعتمدة لشركة جوهرة المجد، تصنيفات المخالفات وجدول تدرج الجزاءات.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>استعراض اللائحة</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 6. Disciplinary Decisions Issued (القرارات الجزائية الصادرة) -->
          <div class="hr-hub-card group" data-card-title="القرارات الجزائية الصادرة" onclick="switchTab('penalties'); setTimeout(() => switchPenaltiesSubTab('issued'), 100);">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-800 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-gavel"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">سجل القرارات</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-rose-700 transition">القرارات الجزائية الصادرة</h3>
              <p class="text-xs text-slate-500 line-clamp-2">إصدار القرارات الجزائية، التحقيقات، تطبيق خصومات الرواتب وطباعة إخطارات العقوبة.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-700">
              <span>القرارات والإجراءات</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 7. Biometric Attendance -->
          <div class="hr-hub-card group" data-card-title="الحضور والبصمة الحيوية" onclick="switchTab('attendance')">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-fingerprint"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">أجهزة ZKTeco</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-sky-700 transition">الحضور والبصمة الحيوية</h3>
              <p class="text-xs text-slate-500 line-clamp-2">ربط الحضور التلقائي، حساب ساعات العمل والتأخير والغياب، وكشوفات الدوام الشهرية.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
              <span>متابعة الحضور</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 8. Payroll & WPS -->
          <div class="hr-hub-card group" data-card-title="مسيرات الرواتب وحماية الأجور" onclick="switchTab('payroll')">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-money-check-dollar"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">حماية الأجور WPS</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-emerald-700 transition">مسيرات الرواتب وحماية الأجور</h3>
              <p class="text-xs text-slate-500 line-clamp-2">إصدار المسيرات الشهرية، خصومات التأمينات والسلف والغياب، وتوليد ملفات البنوك الرسمية.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>إدارة المسيرات</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 9. Recruitment & ATS -->
          <div class="hr-hub-card group" data-card-title="التوظيف واستقطاب الكفاءات ATS" onclick="switchTab('recruitment')">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-user-plus"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200">نظام ATS</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-violet-700 transition">التوظيف واستقطاب الكفاءات</h3>
              <p class="text-xs text-slate-500 line-clamp-2">الإعلانات الوظيفية، فرز المتقدمين، مراحل المقابلات وتوليد عروض العمل الرسمية.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-violet-700">
              <span>بوابة التوظيف</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 10. Loans & Advances -->
          <div class="hr-hub-card group" data-card-title="السلف والأقساط الشهرية" onclick="switchTab('loans')">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-hand-holding-dollar"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">أقساط شهرية</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-amber-700 transition">السلف والأقساط الشهرية</h3>
              <p class="text-xs text-slate-500 line-clamp-2">قيد السلف المالية، جدول الأقساط، الخصم المباشر من مسير الرواتب ومتابعة الأرصدة المتبقية.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>إدارة السلف</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 11. Attendance Notices & Disciplinary Warnings -->
          <div class="hr-hub-card group" data-card-title="إشعارات وإنذارات الدوام الرسمية" onclick="switchTab('attendance-notices')">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">المادة 80</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-rose-700 transition">إشعارات وإنذارات الدوام</h3>
              <p class="text-xs text-slate-500 line-clamp-2">إنذارات الغياب المتصل والمتقطع وفق نظام العمل السعودي، والربط بالبريد الرسمي.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-700">
              <span>إدارة الإنذارات</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 12. Health Insurance & Medical Cards -->
          <div class="hr-hub-card group" data-card-title="التأمين الطبي والبطاقات الصحية" onclick="switchTab('insurance')">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-heart-pulse"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-red-50 text-red-800 border border-red-200">CCHI • بلدي</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-red-700 transition">التأمين الطبي والبطاقات الصحية</h3>
              <p class="text-xs text-slate-500 line-clamp-2">تغطية منسوبي الشركة، وثائق الضمان الصحي، بطاقات الشهادة الصحية للعاملين، ومواعيد التجديد.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-700">
              <span>سجل التأمين الصحي</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 13. End of Service Calculator & Settlements -->
          <div class="hr-hub-card group" data-card-title="نهاية الخدمة والمخالصة EOS" onclick="switchTab('terminated')">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-dark to-brand text-amber-300 flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-calculator"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">المواد 84-87</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-brand transition">نهاية الخدمة والمخالصة (EOS)</h3>
              <p class="text-xs text-slate-500 line-clamp-2">حاسبة نظامية 100% متوافقة مع نظام العمل السعودي، الأسباب النظامية، وإخلاء الطرف الشامل.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand">
              <span>حاسبة نهاية الخدمة</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

          <!-- 14. Approvals Pipeline & Audit Log -->
          <div class="hr-hub-card group" data-card-title="سير العمل وسجل الرقابة والموافقات" onclick="switchTab('audit-log')">
            <div class="flex items-start justify-between">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition">
                <i class="fa-solid fa-clipboard-check"></i>
              </div>
              <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">سجل مشفر</span>
            </div>
            <div class="mt-4 space-y-1.5">
              <h3 class="text-sm font-black text-slate-800 group-hover:text-indigo-700 transition">سير العمل وسجل الرقابة</h3>
              <p class="text-xs text-slate-500 line-clamp-2">متابعة مسارات الموافقات الثلاثية، سجل العمليات الشامل (Audit Log) والإجراءات الإدارية.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
              <span>سجل الرقابة والعمليات</span>
              <i class="fa-solid fa-arrow-left transition group-hover:-translate-x-1"></i>
            </div>
          </div>

        </div>

      </section>
`;

if (!indexHtml.includes('id="view-hr-center"')) {
  const insertBeforeMarker = '<section id="view-employees-db"';
  indexHtml = indexHtml.replace(insertBeforeMarker, hrCenterSectionHtml + '\n      ' + insertBeforeMarker);
  console.log('Inserted view-hr-center section.');
}

// 5. Add Active vs Terminated tabs in employees view
const employeesTabsHtml = `
          <!-- Active vs Terminated Employees Sub-tabs -->
          <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button type="button" id="btnEmpSubTabActive" onclick="setEmployeeSubTab('active')" class="px-4 py-2 rounded-xl text-xs font-black transition subtab-active-pill flex items-center gap-2">
              <i class="fa-solid fa-user-check"></i>
              <span>الموظفون على رأس العمل</span>
              <span id="badgeEmpActiveTabCount" class="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-mono">108</span>
            </button>
            <button type="button" id="btnEmpSubTabTerminated" onclick="setEmployeeSubTab('terminated')" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-2">
              <i class="fa-solid fa-user-xmark"></i>
              <span>الموظفون المنهية خدماتهم</span>
              <span id="badgeEmpTerminatedTabCount" class="px-2 py-0.5 rounded-full text-[10px] bg-slate-300 text-slate-800 font-mono">5</span>
            </button>
          </div>
`;

if (!indexHtml.includes('id="btnEmpSubTabActive"')) {
  const kpiMarker = '<!-- 6 Smart Top KPI Cards -->';
  indexHtml = indexHtml.replace(kpiMarker, employeesTabsHtml + '\n          ' + kpiMarker);
  console.log('Added Active vs Terminated tabs to employees view.');
}

// 6. Make substitute employee mandatory in modalNewLeaveRequest
indexHtml = indexHtml.replace(
  '<label class="block font-bold text-slate-700 mb-1">الموظف البديل (المغطي):</label>',
  '<label class="block font-bold text-slate-700 mb-1">الموظف البديل (المغطي): *</label>'
);
indexHtml = indexHtml.replace(
  '<select id="leaveFormSubstitute" class="w-full rounded-xl border border-slate-300 py-2 px-3 font-semibold bg-white">\n              <option value="">-- اختياري --</option>',
  '<select id="leaveFormSubstitute" required class="w-full rounded-xl border border-slate-300 py-2 px-3 font-semibold bg-white">\n              <option value="">-- اختر الموظف البديل (إلزامي) --</option>'
);

// 7. Update Employee Modal 360 with Photo Upload & Document Management
const avatarUploadMarker = '<div id="emp360AvatarCircle" class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-amber-300 shadow border-2 border-white/30" style="background-color: rgba(255, 255, 255, 0.15);">';
const newAvatarUploadHtml = `
          <div class="relative group">
            <div id="emp360AvatarCircle" class="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-amber-300 shadow border-2 border-white/30 overflow-hidden" style="background-color: rgba(255, 255, 255, 0.15);">
              <!-- Initials or Image -->
            </div>
            <button type="button" onclick="triggerEmpPhotoUpload()" title="تغيير الصورة الشخصية" class="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 flex items-center justify-center text-[10px] shadow transition">
              <i class="fa-solid fa-camera"></i>
            </button>
            <input type="file" id="empPhotoUploadInput" accept="image/*" class="hidden" onchange="handleEmpPhotoFileSelected(event)">
          </div>
`;
if (indexHtml.includes(avatarUploadMarker)) {
  indexHtml = indexHtml.replace(avatarUploadMarker, newAvatarUploadHtml);
  console.log('Updated Employee 360 Avatar with photo upload capability.');
}

// 8. Add Document Management inside tabContent360Documents
const docTabMarker = '<div id="tabContent360Documents" class="space-y-4 text-xs hidden">';
const newDocTabContent = `<div id="tabContent360Documents" class="space-y-4 text-xs hidden">
        <!-- Document Upload Box -->
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <h4 class="font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-cloud-arrow-up text-brand"></i> رفع وثيقة أو مستند رسمي جديد للموظف
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">نوع المستند: *</label>
              <select id="empDocTypeSelect" class="w-full rounded-xl border border-slate-300 p-2 bg-white text-xs">
                <option value="هوية / إقامة">هوية / إقامة</option>
                <option value="عقد عمل موثق">عقد عمل موثق</option>
                <option value="مؤهل علمي">مؤهل علمي</option>
                <option value="رخصة قيادة">رخصة قيادة</option>
                <option value="شهادة صحية">شهادة صحية</option>
                <option value="إقرار أو تعهد">إقرار أو تعهد</option>
                <option value="مستند رسمي آخر">مستند رسمي آخر</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">عنوان / وصف المستند:</label>
              <input type="text" id="empDocTitleInput" placeholder="مثال: هوية مقيم مجددة 2026" class="w-full rounded-xl border border-slate-300 p-2 text-xs">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">اختيار الملف: *</label>
              <input type="file" id="empDocFileInput" class="w-full rounded-xl border border-slate-300 p-1.5 text-xs bg-white">
            </div>
          </div>
          <div class="flex justify-end pt-1">
            <button type="button" onclick="uploadEmployeeDocument()" class="brand-gradient text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5">
              <i class="fa-solid fa-upload"></i> رفع وحفظ المستند
            </button>
          </div>
        </div>

        <!-- Attached Documents Table -->
        <div class="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
          <div class="flex justify-between items-center">
            <h4 class="font-bold text-slate-800 flex items-center gap-2">
              <i class="fa-solid fa-paperclip text-brand"></i> المستندات والوثائق المرفوعة للموظف
            </h4>
            <span id="empDocsCountBadge" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">0 مستندات</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-right text-xs">
              <thead>
                <tr class="border-b border-slate-200 text-slate-400 font-bold">
                  <th class="py-2 px-3">نوع المستند</th>
                  <th class="py-2 px-3">العنوان</th>
                  <th class="py-2 px-3">الحجم</th>
                  <th class="py-2 px-3">تاريخ الرفع</th>
                  <th class="py-2 px-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody id="empDocsTableBody">
                <tr><td colspan="5" class="py-6 text-center text-slate-400 font-medium">جاري تحميل المستندات...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
`;

if (indexHtml.includes(docTabMarker)) {
  indexHtml = indexHtml.replace(docTabMarker, newDocTabContent);
  console.log('Updated Employee 360 Documents Tab with uploader and table.');
}

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('index.html updated successfully.');

// 9. Update app.js
// A. Update allTabs in switchTab to include 'hr-center'
if (!appJs.includes("'hr-center'")) {
  appJs = appJs.replace(
    "const allTabs = ['dashboard',",
    "const allTabs = ['dashboard', 'hr-center',"
  );
  console.log("Added 'hr-center' to allTabs in app.js.");
}

// B. Append helper functions to app.js
const appJsAdditions = `
/* =========================================================================
   CENTRAL HR CONTROL CENTER & EMPLOYEE OVERHAUL FUNCTIONS
   ========================================================================= */

// Filter HR Center Cards
function filterHrCenterCards(query) {
  const q = (query || '').toLowerCase().trim();
  const cards = document.querySelectorAll('#hrCenterCardsGrid .hr-hub-card');
  cards.forEach(c => {
    const title = (c.getAttribute('data-card-title') || '').toLowerCase();
    const text = c.textContent.toLowerCase();
    if (!q || title.includes(q) || text.includes(q)) {
      c.style.display = 'flex';
    } else {
      c.style.display = 'none';
    }
  });
}

// Active vs Terminated Sub-tab state
if (typeof empDbState !== 'undefined') {
  empDbState.activeSubTab = 'active';
}

function setEmployeeSubTab(tab) {
  if (typeof empDbState !== 'undefined') {
    empDbState.activeSubTab = tab;
  }
  const btnActive = document.getElementById('btnEmpSubTabActive');
  const btnTerminated = document.getElementById('btnEmpSubTabTerminated');

  if (tab === 'active') {
    if (btnActive) {
      btnActive.className = 'px-4 py-2 rounded-xl text-xs font-black transition subtab-active-pill flex items-center gap-2';
    }
    if (btnTerminated) {
      btnTerminated.className = 'px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-2';
    }
  } else {
    if (btnActive) {
      btnActive.className = 'px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-2';
    }
    if (btnTerminated) {
      btnTerminated.className = 'px-4 py-2 rounded-xl text-xs font-black transition subtab-active-pill flex items-center gap-2';
    }
  }

  if (typeof filterEmployeesTable === 'function') {
    filterEmployeesTable();
  }
}

// Employee Photo Upload Trigger
function triggerEmpPhotoUpload() {
  const input = document.getElementById('empPhotoUploadInput');
  if (input) input.click();
}

async function handleEmpPhotoFileSelected(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const empId = window.current360EmpId;
  if (!empId) {
    alert('لم يتم تحديد الموظف');
    return;
  }

  const formData = new FormData();
  formData.append('photo', file);

  try {
    const res = await fetch(\`/api/employees/\${empId}/photo\`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      if (typeof showToast === 'function') showToast('تم تحديث الصورة الشخصية للموظف بنجاح', 'success');
      else alert('تم تحديث الصورة الشخصية للموظف بنجاح');

      // Update avatar circle in modal
      const avatarCircle = document.getElementById('emp360AvatarCircle');
      if (avatarCircle && data.photo_url) {
        avatarCircle.innerHTML = \`<img src="\${data.photo_url}" class="w-full h-full object-cover">\`;
      }
      // Reload employees state
      if (typeof loadEmployees === 'function') loadEmployees();
    } else {
      alert(data.error || 'فشل تحديث الصورة');
    }
  } catch (err) {
    alert('حدث خطأ أثناء رفع الصورة: ' + err.message);
  }
}

// Load and Upload Employee Documents
async function loadEmployeeDocuments(empId) {
  const tbody = document.getElementById('empDocsTableBody');
  const countBadge = document.getElementById('empDocsCountBadge');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-slate-400">جاري التحميل...</td></tr>';

  try {
    const res = await apiFetch(\`/api/employees/\${empId}/documents\`);
    const docs = (res && res.success && res.data) ? res.data : [];
    if (countBadge) countBadge.textContent = \`\${docs.length} مستندات\`;

    if (docs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="py-6 text-center text-slate-400">لا توجد وثائق مرفوعة لهذا الموظف حتى الآن.</td></tr>';
      return;
    }

    tbody.innerHTML = docs.map(d => \`
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
        <td class="py-2.5 px-3 font-bold text-slate-700">\${d.doc_type}</td>
        <td class="py-2.5 px-3 font-medium text-slate-800">\${d.title || d.file_name}</td>
        <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500">\${d.file_size ? Math.round(d.file_size / 1024) + ' KB' : '—'}</td>
        <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500">\${d.created_at ? d.created_at.split(' ')[0] : '—'}</td>
        <td class="py-2.5 px-3 text-center space-x-1.5 space-x-reverse">
          <a href="\${d.file_path}" target="_blank" class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold inline-flex items-center gap-1">
            <i class="fa-solid fa-eye"></i> معاينة
          </a>
          <button type="button" onclick="deleteEmployeeDocument(\${d.id})" class="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold inline-flex items-center gap-1">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    \`).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-rose-500 font-bold">حدث خطأ أثناء تحميل المستندات</td></tr>';
  }
}

async function uploadEmployeeDocument() {
  const empId = window.current360EmpId;
  if (!empId) return alert('لم يتم تحديد الموظف');

  const fileInput = document.getElementById('empDocFileInput');
  const typeSelect = document.getElementById('empDocTypeSelect');
  const titleInput = document.getElementById('empDocTitleInput');

  const file = fileInput?.files && fileInput.files[0];
  if (!file) return alert('يرجى اختيار ملف لرفعه');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('doc_type', typeSelect?.value || 'مستند رسمي');
  formData.append('title', titleInput?.value || file.name);

  try {
    const res = await fetch(\`/api/employees/\${empId}/documents\`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      if (typeof showToast === 'function') showToast('تم رفع المستند بنجاح', 'success');
      else alert('تم رفع المستند بنجاح');
      if (fileInput) fileInput.value = '';
      if (titleInput) titleInput.value = '';
      loadEmployeeDocuments(empId);
    } else {
      alert(data.error || 'فشل رفع المستند');
    }
  } catch (err) {
    alert('حدث خطأ: ' + err.message);
  }
}

async function deleteEmployeeDocument(docId) {
  const empId = window.current360EmpId;
  if (!empId || !docId) return;
  if (!confirm('هل أنت متأكد من حذف هذا المستند؟')) return;

  try {
    const res = await apiFetch(\`/api/employees/\${empId}/documents/\${docId}\`, { method: 'DELETE' });
    if (res && res.success) {
      if (typeof showToast === 'function') showToast('تم حذف المستند بنجاح', 'success');
      loadEmployeeDocuments(empId);
    } else {
      alert(res?.error || 'فشل حذف المستند');
    }
  } catch (err) {
    alert('حدث خطأ أثناء الحذف: ' + err.message);
  }
}

// Hook loadEmployeeDocuments when opening Employee 360 Documents Tab
const originalSwitch360Tab = window.switch360Tab;
window.switch360Tab = function(tabName) {
  if (typeof originalSwitch360Tab === 'function') {
    originalSwitch360Tab(tabName);
  }
  if (tabName === 'documents' && window.current360EmpId) {
    loadEmployeeDocuments(window.current360EmpId);
  }
};
`;

if (!appJs.includes('function filterHrCenterCards')) {
  appJs += '\n' + appJsAdditions;
  fs.writeFileSync(appJsPath, appJs, 'utf8');
  console.log('Appended HR center & document functions to app.js.');
}

console.log('--- Frontend Overhaul Patched Successfully ---');
