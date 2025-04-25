# Script de PowerShell para iniciar la aplicación en modo producción

Write-Host "Iniciando la aplicación Bitácora en modo producción..." -ForegroundColor Green
Write-Host ""

# Verificar si existe la base de datos PostgreSQL
Write-Host "Verificando la base de datos PostgreSQL..." -ForegroundColor Cyan
$pgResult = $null
try {
    $pgResult = psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='bitacora'" -t
} catch {
    Write-Host "Error al conectar con PostgreSQL. Asegúrese de que PostgreSQL está instalado y en ejecución." -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Crear la base de datos si no existe
if ($pgResult -notmatch "1") {
    Write-Host "La base de datos 'bitacora' no existe. Creándola..." -ForegroundColor Yellow
    try {
        psql -U postgres -c "CREATE DATABASE bitacora WITH ENCODING 'UTF8' LC_COLLATE='en_US.UTF-8' LC_CTYPE='en_US.UTF-8' TEMPLATE=template0;"
        Write-Host "Base de datos 'bitacora' creada correctamente." -ForegroundColor Green
    } catch {
        Write-Host "Error al crear la base de datos 'bitacora'." -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "La base de datos 'bitacora' ya existe." -ForegroundColor Green
}
Write-Host ""

# Limpiar y compilar el proyecto
Write-Host "Limpiando y compilando el proyecto..." -ForegroundColor Cyan
mvn clean compile
Write-Host ""

# Eliminar archivos de migración H2 compilados
Write-Host "Eliminando archivos de migración H2 compilados..." -ForegroundColor Cyan
if (Test-Path "target\classes\db\migration\dev") {
    Remove-Item -Path "target\classes\db\migration\dev" -Recurse -Force
    Write-Host "Archivos de migración H2 eliminados." -ForegroundColor Green
}
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
      "description": "Servidor de producción"
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

# Ejecutar la aplicación con los perfiles correctos
Write-Host "Ejecutando la aplicación con PostgreSQL..." -ForegroundColor Cyan
mvn spring-boot:run "-Dspring-boot.run.profiles=prod,flyway"

Write-Host ""
Write-Host "Aplicación finalizada." -ForegroundColor Green
