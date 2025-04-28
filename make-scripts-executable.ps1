# Script PowerShell para recordar al usuario que debe hacer los scripts ejecutables en sistemas Unix

Write-Host "IMPORTANTE: Si vas a usar estos scripts en sistemas Unix/Linux/macOS, debes hacerlos ejecutables." -ForegroundColor Yellow
Write-Host "Ejecuta el siguiente comando en tu terminal Unix:" -ForegroundColor Cyan
Write-Host "chmod +x start-dev.sh backend/run-dev.sh frontend/run-dev.sh backend/generate-openapi.sh" -ForegroundColor Green
Write-Host ""
Write-Host "En Windows, los scripts .sh no son ejecutables directamente. Considera usar:" -ForegroundColor Yellow
Write-Host "- Git Bash" -ForegroundColor Cyan
Write-Host "- WSL (Windows Subsystem for Linux)" -ForegroundColor Cyan
Write-Host "- Cygwin" -ForegroundColor Cyan
Write-Host "- O simplemente usar los scripts .bat equivalentes" -ForegroundColor Cyan
