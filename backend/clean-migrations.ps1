# Script de PowerShell para limpiar las migraciones de Flyway

Write-Host "Limpiando las migraciones de Flyway..." -ForegroundColor Green
Write-Host ""

# Verificar si existen archivos de migración compilados
Write-Host "Verificando archivos de migración compilados..." -ForegroundColor Cyan

# Eliminar archivos de migración H2 compilados
if (Test-Path "target\classes\db\migration\dev") {
    Write-Host "Eliminando archivos de migración H2 compilados..." -ForegroundColor Yellow
    Remove-Item -Path "target\classes\db\migration\dev" -Recurse -Force
    Write-Host "Archivos de migración H2 compilados eliminados." -ForegroundColor Green
} else {
    Write-Host "No se encontraron archivos de migración H2 compilados." -ForegroundColor Yellow
}

# Eliminar archivos de migración PostgreSQL compilados
if (Test-Path "target\classes\db\migration\prod") {
    Write-Host "Eliminando archivos de migración PostgreSQL compilados..." -ForegroundColor Yellow
    Remove-Item -Path "target\classes\db\migration\prod" -Recurse -Force
    Write-Host "Archivos de migración PostgreSQL compilados eliminados." -ForegroundColor Green
} else {
    Write-Host "No se encontraron archivos de migración PostgreSQL compilados." -ForegroundColor Yellow
}

# Limpiar la base de datos H2 (eliminando el archivo si existe)
Write-Host "Verificando archivos de base de datos H2..." -ForegroundColor Cyan
$h2Files = Get-ChildItem -Path "." -Filter "*.db" -Recurse
if ($h2Files.Count -gt 0) {
    Write-Host "Eliminando archivos de base de datos H2..." -ForegroundColor Yellow
    foreach ($file in $h2Files) {
        Remove-Item -Path $file.FullName -Force
        Write-Host "Archivo eliminado: $($file.FullName)" -ForegroundColor Green
    }
    Write-Host "Archivos de base de datos H2 eliminados." -ForegroundColor Green
} else {
    Write-Host "No se encontraron archivos de base de datos H2." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Limpieza completada. Las migraciones de Flyway han sido limpiadas." -ForegroundColor Green
Write-Host "Ahora puede ejecutar el script run-dev.ps1 para iniciar la aplicación con una base de datos limpia." -ForegroundColor Green
