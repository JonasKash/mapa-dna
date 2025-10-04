@echo off
echo Iniciando servidor backend...
start "Backend" cmd /k "cd /d %~dp0 && node server.js"

timeout /t 3 /nobreak >nul

echo Iniciando servidor frontend...
start "Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Servidores iniciados!
echo Backend: http://localhost:3002
echo Frontend: http://localhost:3000
echo.
pause
