const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

async function testBrowserRuntime() {
  console.log('================================================================');
  console.log('  محاكاة بيئة المتصفح الكاملة (JSDOM) وفحص أخطاء الواجهة والصفحات  ');
  console.log('================================================================\n');

  const htmlContent = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
  const appJsCode = fs.readFileSync(path.join(__dirname, '../public/js/app.js'), 'utf8');

  const errors = [];
  const warnings = [];

  // Create JSDOM instance
  const dom = new JSDOM(htmlContent, {
    url: 'http://localhost:3000/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    resources: 'usable'
  });

  const { window } = dom;

  // Setup localStorage with Admin user
  const adminUser = {
    id: 1,
    username: 'admin',
    full_name: 'مدير النظام (Admin)',
    role: 'admin',
    permissions: ['all']
  };
  window.localStorage.setItem('jm_hrms_user', JSON.stringify(adminUser));

  // Hook console
  window.console.error = (...args) => {
    const msg = args.join(' ');
    // Ignore JSDOM synthetic canvas missing context in simulated environment
    if (msg.includes('can\'t acquire context') || msg.includes('HTMLCanvasElement')) {
      return;
    }
    errors.push(msg);
    console.error('  [Browser console.error]:', ...args);
  };
  window.console.warn = (...args) => {
    warnings.push(args.join(' '));
  };

  // Mock Window methods
  window.scrollTo = () => {};
  window.alert = () => {};
  window.confirm = () => true;
  window.prompt = () => 'ملاحظة تجريبية';
  window.HTMLCanvasElement.prototype.getContext = () => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: (x, y, w, h) => ({ data: new Array(w * h * 4) }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
  });

  window.Chart = function() {
    return {
      destroy: () => {},
      update: () => {}
    };
  };
  window.QRCode = function() {
    return {};
  };

  // Error listener
  window.addEventListener('error', (event) => {
    errors.push(event.message + ' at ' + event.filename + ':' + event.lineno);
    console.error('  [Browser window.onerror]:', event.message, event.filename, event.lineno);
  });

  // Execute app.js in window context
  try {
    window.eval(appJsCode);
    console.log('✓ تم تحميل وتفسير كود app.js في المتصفح بنجاح دون أخطاء نحوية (Syntax OK)');
  } catch (err) {
    console.error('❌ خطأ أثناء تحميل كود app.js:', err);
    throw err;
  }

  // Trigger DOMContentLoaded
  console.log('\n--- تشغيل حدث DOMContentLoaded وتهيئة النظام ---');
  const event = window.document.createEvent('Event');
  event.initEvent('DOMContentLoaded', true, true);
  window.document.dispatchEvent(event);

  // Wait for initial async operations
  await new Promise(r => setTimeout(r, 1500));

  // Test all 19 tabs
  const allTabs = [
    'dashboard', 'employees-db', 'leaves', 'tasks', 'forms',
    'compliance', 'penalties', 'attendance', 'payroll', 'loans',
    'terminated', 'attendance-notices', 'absence', 'selfservice',
    'organization', 'branches', 'users', 'data-exchange', 'docs'
  ];

  console.log('\n--- اختبار فتح وتصيير كافة التبويبات الـ 19 للمستخدم Admin ---');
  let tabSuccess = 0;
  let tabFailures = 0;

  for (const tab of allTabs) {
    try {
      window.switchTab(tab);
      await new Promise(r => setTimeout(r, 100));

      const viewEl = window.document.getElementById(`view-${tab}`);
      if (!viewEl) {
        throw new Error(`العنصر view-${tab} غير موجود في المستند`);
      }
      if (viewEl.classList.contains('hidden')) {
        throw new Error(`التبويب view-${tab} لم يصبح نشطاً ومخفي حالياً`);
      }

      // Check inner content
      const innerHtml = viewEl.innerHTML.trim();
      if (innerHtml.length < 50) {
        throw new Error(`محتوى التبويب view-${tab} فارغ أو غير مكتمل`);
      }

      console.log(`✓ [نجاح]: التبويب (${tab}) فُتح وعُرض بنجاح وبكافة مكوناته`);
      tabSuccess++;
    } catch (tabErr) {
      console.error(`❌ [فشل]: التبويب (${tab}) واجه خطأ:`, tabErr.message);
      tabFailures++;
    }
  }

  // Test employee role view
  console.log('\n--- اختبار دور الموظفة العادية (شامة علي عسيري) ---');
  const shamaUser = {
    id: 10,
    username: 'shama',
    full_name: 'شامة علي محمد عسيري',
    role: 'employee',
    emp_id: 12324,
    permissions: []
  };
  window.localStorage.setItem('jm_hrms_user', JSON.stringify(shamaUser));
  window.eval('checkAuth();');
  window.switchTab('selfservice');
  await new Promise(r => setTimeout(r, 200));

  const selfServiceView = window.document.getElementById('view-selfservice');
  if (selfServiceView && !selfServiceView.classList.contains('hidden')) {
    console.log('✓ [نجاح]: بوابة الخدمة الذاتية فُتحت بنجاح للموظفة');
  } else {
    console.error('❌ [فشل]: بوابة الخدمة الذاتية لم تُعرض للموظفة');
  }

  // Test Direct Manager role view
  console.log('\n--- اختبار دور المدير المباشر (أ. عبدالملك سعيد الشريف) ---');
  const abdulmalikUser = {
    id: 2,
    username: 'abdulmalik',
    full_name: 'عبدالملك سعيد الشريف',
    role: 'hr_manager',
    emp_id: 12433,
    permissions: ['requests', 'payslips', 'approvals', 'employees', 'attendance', 'penalties', 'payroll', 'loans', 'terminated_employees', 'notices', 'reports']
  };
  window.localStorage.setItem('jm_hrms_user', JSON.stringify(abdulmalikUser));
  window.eval('checkAuth();');
  window.switchTab('leaves');
  await new Promise(r => setTimeout(r, 200));

  const leavesView = window.document.getElementById('view-leaves');
  if (leavesView && !leavesView.classList.contains('hidden')) {
    console.log('✓ [نجاح]: شاشة إدارة الإجازات والاعتمادات فُتحت بنجاح للمدير');
  } else {
    console.error('❌ [فشل]: شاشة الإجازات لم تُعرض للمدير');
  }

  console.log('\n================================================================');
  console.log(`إجمالي التبويبات المختبرة: ${allTabs.length} | الناجحة: ${tabSuccess} | الفاشلة: ${tabFailures}`);
  console.log(`الأخطاء المسجلة في Console المتصفح: ${errors.length}`);
  console.log('================================================================\n');

  if (tabFailures > 0 || errors.length > 0) {
    throw new Error(`يوجد أخطاء في واجهة المتصفح: ${tabFailures} تبويبات فاشلة، ${errors.length} أخطاء.`);
  }
}

testBrowserRuntime()
  .then(() => {
    console.log('★ كافة اختبارات بيئة المتصفح اجتازت بنجاح 100% ★');
    process.exit(0);
  })
  .catch((err) => {
    console.error('فشل في محاكاة المتصفح:', err);
    process.exit(1);
  });
