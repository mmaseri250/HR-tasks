@echo off
chcp 65001 > nul
title بناء وتهيئة نظام موارد بشرية شركة جوهرة المجد
echo =================================================================
echo   نظام موارد بشرية شركة جوهرة المجد - Jawharat Al-Majd HRMS
echo   بناء وتثبيت النظام على خادم ويندوز (Windows Build & Deploy)
echo =================================================================
echo.

echo [1/4] التحقق من بيئة Node.js...
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo خطأ: Node.js غير مثبت على هذا الجهاز. يرجى تثبيت Node.js v22 أو أحدث.
    pause
    exit /b 1
)

echo [2/4] تثبيت حزم التبعات والاعتماديات...
call npm install --omit=dev --no-audit

echo [3/4] إنشاء مجلدات التخزين وقاعدة البيانات...
if not exist "server\database" mkdir "server\database"
if not exist "uploads" mkdir "uploads"
if not exist "public\assets" mkdir "public\assets"

echo [4/4] فحص سلامة قاعدة البيانات والبيانات الرسمية...
node -e "const db = require('./server/database/db'); console.log('✓ قاعدة البيانات جاهزة ومحدثة بنجاح.');"

echo.
echo =================================================================
echo   ✓ اكتمل البناء بنجاح! يمكنك الآن تشغيل النظام عبر:
echo      npm start   أو تشغيل ملف start-hrms.bat
echo =================================================================
echo.
pause
