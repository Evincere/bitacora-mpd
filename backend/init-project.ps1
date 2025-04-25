# Script de PowerShell para inicializar el proyecto desde cero

Write-Host "Inicializando el proyecto Bitácora desde cero..." -ForegroundColor Green
Write-Host ""

# Limpiar y compilar el proyecto
Write-Host "Limpiando y compilando el proyecto..." -ForegroundColor Cyan
mvn clean compile
Write-Host ""

# Verificar si estamos en modo desarrollo o producción
$mode = Read-Host "¿Desea inicializar en modo desarrollo (dev) o producción (prod)? [dev/prod]"
if ($mode -eq "prod") {
    # Limpiar la base de datos PostgreSQL
    Write-Host "Inicializando en modo producción..." -ForegroundColor Yellow
    Write-Host "Limpiando la base de datos PostgreSQL..." -ForegroundColor Cyan
    .\clean-db-postgres.ps1
    
    # Ejecutar la aplicación en modo producción
    Write-Host "Ejecutando la aplicación en modo producción..." -ForegroundColor Cyan
    .\run-prod.ps1
} else {
    # Modo desarrollo por defecto
    Write-Host "Inicializando en modo desarrollo..." -ForegroundColor Yellow
    Write-Host "Limpiando la base de datos H2..." -ForegroundColor Cyan
    .\clean-migrations.ps1
    
    # Ejecutar la aplicación en modo desarrollo
    Write-Host "Ejecutando la aplicación en modo desarrollo..." -ForegroundColor Cyan
    .\run-dev.ps1
}

Write-Host ""
Write-Host "Inicialización completada." -ForegroundColor Green
