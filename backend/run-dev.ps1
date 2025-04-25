# Script de PowerShell para iniciar la aplicación en modo desarrollo

Write-Host "Iniciando la aplicación Bitácora en modo desarrollo..." -ForegroundColor Green
Write-Host ""

# Limpiar y compilar el proyecto
Write-Host "Limpiando y compilando el proyecto..." -ForegroundColor Cyan
mvn clean compile
Write-Host ""

# Crear archivo OpenAPI básico si no existe
Write-Host "Verificando archivo OpenAPI..." -ForegroundColor Cyan
if (-not (Test-Path "target\openapi.json")) {
    Write-Host "Creando archivo OpenAPI básico..." -ForegroundColor Yellow
    $openApiContent = @"
{
  "openapi": "3.0.1",
  "info": {
    "title": "Bitácora API",
    "description": "API para la aplicación Bitácora",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://localhost:8080/api",
      "description": "Servidor de desarrollo"
    }
  ],
  "paths": {},
  "components": {
    "schemas": {}
  }
}
"@
    Set-Content -Path "target\openapi.json" -Value $openApiContent
    Write-Host "Archivo OpenAPI básico creado." -ForegroundColor Green
}
Write-Host ""

# Limpiar archivos de migración PostgreSQL
Write-Host "Limpiando archivos de migración PostgreSQL..." -ForegroundColor Cyan
.\clean-migrations.ps1
Write-Host ""

# Ejecutar la aplicación con los perfiles correctos
Write-Host "Ejecutando la aplicación con H2..." -ForegroundColor Cyan
mvn spring-boot:run "-Dspring-boot.run.profiles=dev,flyway"

Write-Host ""
Write-Host "Aplicación finalizada." -ForegroundColor Green
