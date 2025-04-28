# Script PowerShell para ejecutar los scripts .sh usando WSL

Write-Host "Iniciando entorno de desarrollo usando WSL..." -ForegroundColor Green

# Verificar si WSL está instalado
$wslCheck = wsl --list
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: WSL no está instalado o no está configurado correctamente." -ForegroundColor Red
    Write-Host "Por favor, instala WSL siguiendo las instrucciones en: https://docs.microsoft.com/en-us/windows/wsl/install" -ForegroundColor Yellow
    exit 1
}

# Hacer los scripts ejecutables
Write-Host "Haciendo los scripts ejecutables..." -ForegroundColor Cyan
wsl chmod +x start-dev.sh backend/run-dev.sh frontend/run-dev.sh backend/generate-openapi.sh

# Ejecutar el script principal
Write-Host "Ejecutando script de inicio..." -ForegroundColor Cyan
wsl ./start-dev.sh

Write-Host "Proceso de inicio completado." -ForegroundColor Green
