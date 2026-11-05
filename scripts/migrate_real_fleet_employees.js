const db = require('../server/database/db');

console.log('--- MIGRATING FLEET TO REAL EMPLOYEES ---');

// Official active employees to assign to fleet:
// 1. عبدالملك سعيد الشريف (مدير إدارة الموارد البشرية) - ID 36598
// 2. فارس عبدالرحمن القحطاني (مدير الإدارة الهندسية) - ID 32380
// 3. هاني عبدالرحمن صالح القحطاني (المدير المالي) - ID 32408
// 4. يام بهادور جاها (سائق) - ID 32404
// 5. رشيد منظور منظور حسين (سائق) - ID 32407
// 6. ناباب خان (سائق) - ID 32469
// 7. عبدالواحد عبدالواحد محمود مصطفى (مندوب مشتريات) - ID 32436
// 8. عبدالعزيز سعيد مفرح آل الحضيري (معقب) - ID 32492
// 9. علي سعد حسين البشري (مشرف صالة) - ID 32480
// 10. خالد احمد محمد راعي (مشرف صالة) - ID 32450
// 11. فهمي سالم عبيد باعمير (مشرف صالة) - ID 32384
// 12. فهد إبراهيم جعفر الاعوري (مشرف صالة) - ID 32398
// 13. عزت محمد سعد عزه (مهندس مدني) - ID 32461
// 14. محمد شكيل (فني شبكات تقنية معلومات) - ID 32397
// 15. هاني علي شامي عسيري (مشرف صالة) - ID 32462

const assignments = [
  { plate: 'ل ك م 7788', emp_id: 36598, name: 'عبدالملك سعيد الشريف' },
  { plate: 'ح ط ي 5566', emp_id: 32480, name: 'علي سعد حسين البشري' },
  { plate: 'د ف ص 3344', emp_id: 32450, name: 'خالد احمد محمد راعي' },
  { plate: 'أ ب ج 1122', emp_id: 32380, name: 'فارس عبدالرحمن القحطاني' },
  { plate: 'ر ص ق 4812', emp_id: 32408, name: 'هاني عبدالرحمن صالح القحطاني' },
  { plate: 'ن ط ع 7291', emp_id: 32404, name: 'يام بهادور جاها' }, // سائق
  { plate: 'م ل ك 3845', emp_id: 32407, name: 'رشيد منظور منظور حسين' }, // سائق
  { plate: 'س ب ح 9021', emp_id: 32469, name: 'ناباب خان' }, // سائق
  { plate: 'ق و ي 1543', emp_id: 32436, name: 'عبدالواحد عبدالواحد محمود مصطفى' }, // مندوب مشتريات
  { plate: 'هـ ن د 6182', emp_id: 32492, name: 'عبدالعزيز سعيد مفرح آل الحضيري' }, // معقب
  { plate: 'و ص ل 8394', emp_id: null, name: 'حركة النقليات (غير مسندة)' }, // former عبدالعزيز السلمي -> unassigned
  { plate: 'ع م ر 2471', emp_id: 32384, name: 'فهمي سالم عبيد باعمير' },
  { plate: 'ك ر م 5190', emp_id: 32461, name: 'عزت محمد سعد عزه' },
  { plate: 'ط ر ق 9314', emp_id: 32397, name: 'محمد شكيل' },
  { plate: 'ب د ر 4628', emp_id: 32398, name: 'فهد إبراهيم جعفر الاعوري' },
  { plate: 'ف هـ د 7831', emp_id: 32462, name: 'هاني علي شامي عسيري' },
  { plate: 'ج م ل 3054', emp_id: null, name: 'حركة النقليات (غير مسندة)' },
  { plate: 'ز ي د 1928', emp_id: null, name: 'حركة النقليات (غير مسندة)' },
  { plate: 'ح ك م 6542', emp_id: null, name: 'حركة النقليات (غير مسندة)' },
  { plate: 'ن ج م 8173', emp_id: null, name: 'حركة النقليات (غير مسندة)' },
  { plate: 'ص ق ر 9405', emp_id: null, name: 'حركة النقليات (غير مسندة)' },
  { plate: 'م ر و 3719', emp_id: null, name: 'حركة النقليات (غير مسندة)' },
  { plate: 'ي م ن 5082', emp_id: null, name: 'حركة النقليات (غير مسندة)' }
];

for (const a of assignments) {
  db.run(`UPDATE vehicles SET assigned_emp_id = ?, assigned_emp_name = ? WHERE plate_number_ar = ?`, [a.emp_id, a.name, a.plate]);
}

const check = db.query(`SELECT id, plate_number_ar, make, model, assigned_emp_id, assigned_emp_name FROM vehicles`);
console.log('Updated vehicles count:', check.length);
check.forEach(v => {
  console.log(`[${v.id}] ${v.plate_number_ar} -> ${v.assigned_emp_name} (Emp ID: ${v.assigned_emp_id})`);
});

console.log('Migration completed successfully.');
