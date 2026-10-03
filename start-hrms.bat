@echo off
chcp 65001 > nul
title نظام موارد بشرية شركة جوهرة المجد - Jawharat Al-Majd HRMS
echo =================================================================
echo   نظام موارد بشرية شركة جوهرة المجد - Jawharat Al-Majd HRMS
echo   أبها، منطقة عسير (مول سيتي بارك)
echo =================================================================
echo.
echo [1/2] جاري التحقق من التبعات وتشغيل الخادم المحلي...
echo.
start http://localhost:3000
node server/server.js
pause
