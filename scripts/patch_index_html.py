import os

path = r'C:\jawharat-hrms\public\index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update password field and add 24h activation notice
old_pwd_block = '''        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">اسم المستخدم (Username): *</label>
            <input type="text" id="userFormUsername" required placeholder="مثال: ahmed أو sarah" class="w-full rounded-xl border border-slate-300 py-2 px-3 font-mono font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">كلمة المرور (Password):</label>
            <input type="password" id="userFormPassword" placeholder="اتركه فارغاً للإبقاء على الحالية عند التعديل" class="w-full rounded-xl border border-slate-300 py-2 px-3 font-mono font-bold">
          </div>
        </div>'''

new_pwd_block = '''        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">اسم المستخدم (Username): *</label>
            <input type="text" id="userFormUsername" required placeholder="مثال: ahmed أو sarah" class="w-full rounded-xl border border-slate-300 py-2 px-3 font-mono font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">كلمة المرور (اختياري / يُنشئها المستخدم):</label>
            <input type="password" id="userFormPassword" placeholder="اتركه فارغاً لإصدار رابط تفعيل 24 ساعة للمستخدم" class="w-full rounded-xl border border-slate-300 py-2 px-3 font-mono font-bold">
          </div>
        </div>

        <!-- 24-Hour Mandatory Activation Notice for New Accounts -->
        <div id="userActivationPolicyNotice" class="p-3 bg-amber-50/90 rounded-2xl border border-amber-300 text-amber-950 text-xs shadow-xs">
          <div class="flex items-start gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5 shadow-xs">
              <i class="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div>
              <span class="block font-black text-amber-900 text-xs">شرط أمني إلزامي: رابط تفعيل وتعيين كلمة مرور (صالح لـ 24 ساعة)</span>
              <p class="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                عند إضافة مستخدم جديد، <strong>لن يتم تفعيل الحساب فوراً</strong>. سيقوم النظام تلقائياً بإنشاء رابط تفعيل فريد وصالح لمدة 24 ساعة بالضبط. يتولى المستخدم فتح الرابط وتعيين كلمة المرور الخاصة به وتفعيل حسابه نظامياً.
              </p>
            </div>
          </div>
        </div>'''

content_norm = content.replace('\r\n', '\n')
if old_pwd_block in content_norm:
    content_norm = content_norm.replace(old_pwd_block, new_pwd_block, 1)
    print('1. Replaced password block successfully.')
else:
    print('1. Could not find old_pwd_block')

# 2. Add Modules 6, 7, 8 in RBAC checkboxes before Sensitive Admin
old_sensitive_card = '''            <!-- 6. Sensitive Administration (Admin Only) -->
            <div class="bg-rose-50/60 p-3 rounded-xl border border-rose-200 space-y-1.5">
              <div class="font-bold text-rose-800 border-b border-rose-200 pb-1 flex items-center gap-1.5">
                <i class="fa-solid fa-shield-halved text-rose-600"></i> صلاحيات إدارية وسيادية حساسة
              </div>
              <label class="flex items-center gap-2 cursor-pointer text-rose-900">
                <input type="checkbox" id="perm_users" class="rounded text-rose-600 focus:ring-rose-500">
                <span><strong>إدارة المستخدمين والصلاحيات (RBAC)</strong></span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-rose-900">
                <input type="checkbox" id="perm_audit" class="rounded text-rose-600 focus:ring-rose-500">
                <span><strong>سجل الرقابة والعمليات (Audit Log)</strong></span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-rose-900">
                <input type="checkbox" id="perm_edit_attendance" class="rounded text-rose-600 focus:ring-rose-500">
                <span>تعديل سجلات الحضور يدوياً</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-rose-900">
                <input type="checkbox" id="perm_delete" class="rounded text-rose-600 focus:ring-rose-500">
                <span>الحذف النهائي للسجلات (Delete)</span>
              </label>
            </div>'''

new_cards_block = '''            <!-- 6. Fleet & Licenses -->
            <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div class="font-bold text-blue-700 border-b pb-1 flex items-center gap-1.5">
                <i class="fa-solid fa-truck-front text-blue-600"></i> الأسطول والوثائق المؤسسية
              </div>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="perm_fleet" class="rounded text-brand focus:ring-brand">
                <span>إدارة أسطول المركبات والعهد والتفويضات</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="perm_licenses" class="rounded text-brand focus:ring-brand">
                <span>السجلات التجارية والتراخيص وبلدي والدفاع المدني</span>
              </label>
            </div>

            <!-- 7. Recruitment & Job Descriptions -->
            <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div class="font-bold text-amber-700 border-b pb-1 flex items-center gap-1.5">
                <i class="fa-solid fa-briefcase text-amber-600"></i> التوظيف والوصف الوظيفي الذكي
              </div>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="perm_recruitment" class="rounded text-brand focus:ring-brand">
                <span>إدارة التوظيف وبنك السير الذاتية ومسير المقابلات</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="perm_job_descriptions" class="rounded text-brand focus:ring-brand">
                <span>استوديو بطاقات الوصف الوظيفي (AI) واعتمادها</span>
              </label>
            </div>

            <!-- 8. Reports & Organizational Hierarchy -->
            <div class="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div class="font-bold text-emerald-700 border-b pb-1 flex items-center gap-1.5">
                <i class="fa-solid fa-chart-pie text-emerald-600"></i> التقارير والهيكل التنظيمي
              </div>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="perm_reports" class="rounded text-brand focus:ring-brand">
                <span>عرض التقارير الإحصائية والتحليلية والبيانية</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="perm_organization" class="rounded text-brand focus:ring-brand">
                <span>الهيكل التنظيمي والفروع وإدارات الشركة</span>
              </label>
            </div>

            <!-- 9. Sensitive Administration (Admin Only) -->
            <div class="bg-rose-50/60 p-3 rounded-xl border border-rose-200 space-y-1.5">
              <div class="font-bold text-rose-800 border-b border-rose-200 pb-1 flex items-center gap-1.5">
                <i class="fa-solid fa-shield-halved text-rose-600"></i> صلاحيات إدارية وسيادية حساسة
              </div>
              <label class="flex items-center gap-2 cursor-pointer text-rose-900">
                <input type="checkbox" id="perm_users" class="rounded text-rose-600 focus:ring-rose-500">
                <span><strong>إدارة المستخدمين والصلاحيات (RBAC)</strong></span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-rose-900">
                <input type="checkbox" id="perm_audit" class="rounded text-rose-600 focus:ring-rose-500">
                <span><strong>سجل الرقابة والعمليات (Audit Log)</strong></span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-rose-900">
                <input type="checkbox" id="perm_edit_attendance" class="rounded text-rose-600 focus:ring-rose-500">
                <span>تعديل سجلات الحضور يدوياً</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer text-rose-900">
                <input type="checkbox" id="perm_delete" class="rounded text-rose-600 focus:ring-rose-500">
                <span>الحذف النهائي للسجلات (Delete)</span>
              </label>
            </div>'''

if old_sensitive_card in content_norm:
    content_norm = content_norm.replace(old_sensitive_card, new_cards_block, 1)
    print('2. Added modules 6, 7, 8 cards successfully.')
else:
    print('2. Could not find old_sensitive_card')

# 3. Add modalUserActivationNotice after modalAddUser
old_modal_close = '    </div>\n  </div>\n\n  <!-- =====================================================================\n       EFFECTIVE PERMISSIONS INSPECTOR MODAL'
new_modal_act = '''    </div>
  </div>

  <!-- Modal: User Activation Notice & 24h Link (نافذة رابط التفعيل الآمن لـ 24 ساعة) -->
  <div id="modalUserActivationNotice" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay hidden">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-amber-300">
      <div class="flex items-center gap-3 border-b pb-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center text-xl shadow-md">
          <i class="fa-solid fa-key"></i>
        </div>
        <div>
          <h3 class="text-base font-black text-slate-800">رابط تفعيل المستخدم وتعيين كلمة المرور</h3>
          <p class="text-xs text-amber-700 font-bold">صالح لمدة 24 ساعة فقط من وقت الإنشاء</p>
        </div>
      </div>

      <div class="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2 text-xs">
        <div class="flex justify-between items-center text-slate-700">
          <span class="font-bold">المستخدم:</span>
          <span id="actNoticeUsername" class="font-mono font-black text-brand text-sm">--</span>
        </div>
        <div class="flex justify-between items-center text-slate-700">
          <span class="font-bold">الاسم الكامل:</span>
          <span id="actNoticeFullName" class="font-black text-slate-900">--</span>
        </div>
        <div class="flex justify-between items-center text-slate-700 border-t border-amber-200/60 pt-1.5">
          <span class="font-bold">حالة الحساب:</span>
          <span class="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px]">معلق - بانتظار تعيين كلمة المرور (24س)</span>
        </div>
        <div class="flex justify-between items-center text-slate-700">
          <span class="font-bold">تاريخ انتهاء الصلاحية:</span>
          <span id="actNoticeExpires" class="font-mono font-bold text-rose-700">--</span>
        </div>
      </div>

      <div class="space-y-1.5 text-xs">
        <label class="block font-bold text-slate-700">رابط التفعيل المباشر (أرسله للموظف):</label>
        <div class="flex gap-2">
          <input type="text" id="actNoticeLinkInput" readonly class="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-[11px] text-slate-800 font-bold select-all">
          <button type="button" onclick="copyActivationNoticeLink()" class="px-4 py-2 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl flex items-center gap-1.5 shadow transition active:scale-95">
            <i class="fa-solid fa-copy"></i>
            <span>نسخ</span>
          </button>
        </div>
      </div>

      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
        <p class="font-bold text-slate-800"><i class="fa-brands fa-whatsapp text-emerald-600 text-xs"></i> كيفية تفعيل الحساب:</p>
        <p>1. انسخ الرابط أعلاه وأرسله للموظف عبر البريد الرسمي أو الواتساب.</p>
        <p>2. يفتح الموظف الرابط ويقوم بإنشاء كلمة المرور الشخصية الخاصة به.</p>
        <p>3. يتم تفعيل الحساب فوراً وتلقائياً وتسجيل وقت التفعيل في سجل الرقابة.</p>
      </div>

      <div class="flex justify-end pt-2 border-t">
        <button type="button" onclick="closeModal('modalUserActivationNotice')" class="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition">
          إغلاق ومتابعة
        </button>
      </div>
    </div>
  </div>

  <!-- =====================================================================
       EFFECTIVE PERMISSIONS INSPECTOR MODAL'''

if old_modal_close in content_norm:
    content_norm = content_norm.replace(old_modal_close, new_modal_act, 1)
    print('3. Added modalUserActivationNotice successfully.')
else:
    print('3. Could not find old_modal_close')

# 4. Add Job Description action card to tabContent360Contract
old_contract_end = '''          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-slate-400 block text-[11px] font-bold">حالة فترة التجربة:</span>
            <span id="c360ProbationStatus" class="font-bold text-emerald-700 mt-0.5 block">تم اجتياز فترة التجربة بنجاح</span>
          </div>
        </div>
      </div>'''

new_contract_end = '''          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-slate-400 block text-[11px] font-bold">حالة فترة التجربة:</span>
            <span id="c360ProbationStatus" class="font-bold text-emerald-700 mt-0.5 block">تم اجتياز فترة التجربة بنجاح</span>
          </div>
        </div>

        <!-- Job Description Action Card -->
        <div class="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center text-lg shadow-sm">
              <i class="fa-solid fa-file-signature"></i>
            </div>
            <div>
              <h4 class="font-black text-slate-900 text-xs">بطاقة الوصف الوظيفي المعتمدة للموظف</h4>
              <p class="text-[11px] text-slate-600 mt-0.5">عرض وطباعة بطاقة الوصف الوظيفي والواجبات والصلاحيات ومؤشرات الأداء (KPIs)</p>
            </div>
          </div>
          <button type="button" onclick="openJobDescriptionForEmployee(window.current360EmpId)" class="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95 whitespace-nowrap">
            <i class="fa-solid fa-print"></i>
            <span>طباعة ورقة الوصف الوظيفي</span>
          </button>
        </div>
      </div>'''

if old_contract_end in content_norm:
    content_norm = content_norm.replace(old_contract_end, new_contract_end, 1)
    print('4. Added Job Description action card to 360 Contract tab successfully.')
else:
    print('4. Could not find old_contract_end')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_norm)

print('Done writing C:\\jawharat-hrms\\public\\index.html')
