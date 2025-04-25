# Script de PowerShell para limpiar la base de datos y reiniciar las migraciones

Write-Host "Limpiando la base de datos y reiniciando las migraciones..." -ForegroundColor Yellow
Write-Host ""

# Limpiar el proyecto
Write-Host "Limpiando el proyecto..." -ForegroundColor Cyan
mvn clean
Write-Host ""

# Compilar el proyecto
Write-Host "Compilando el proyecto..." -ForegroundColor Cyan
mvn compile
Write-Host ""

# Eliminar archivos de migración compilados
Write-Host "Eliminando archivos de migración compilados..." -ForegroundColor Cyan
if (Test-Path "target\classes\db\migration\prod") {
    Remove-Item -Path "target\classes\db\migration\prod\*.sql" -Force
    Write-Host "Archivos de migración PostgreSQL eliminados." -ForegroundColor Green
}
Write-Host ""

Write-Host "Proceso de limpieza completado." -ForegroundColor Green
Write-Host "Ahora puede ejecutar el script run-dev.ps1 para iniciar la aplicación." -ForegroundColor Green
