Write-Host "Iniciando servidor backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; node server.js"

Start-Sleep -Seconds 3

Write-Host "Iniciando servidor frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Write-Host ""
Write-Host "Servidores iniciados!" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:3002" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Read-Host "Pressione Enter para continuar"
