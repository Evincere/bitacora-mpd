# Script de PowerShell para limpiar la base de datos PostgreSQL

Write-Host "Limpiando la base de datos PostgreSQL 'bitacora'..." -ForegroundColor Green
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

# Eliminar y recrear la base de datos si existe
if ($pgResult -match "1") {
    Write-Host "La base de datos 'bitacora' existe. Eliminándola..." -ForegroundColor Yellow
    try {
        # Cerrar todas las conexiones a la base de datos
        psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='bitacora';"
        # Eliminar la base de datos
        psql -U postgres -c "DROP DATABASE bitacora;"
        Write-Host "Base de datos 'bitacora' eliminada correctamente." -ForegroundColor Green
    } catch {
        Write-Host "Error al eliminar la base de datos 'bitacora'." -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }
    
    # Recrear la base de datos
    Write-Host "Recreando la base de datos 'bitacora'..." -ForegroundColor Yellow
    try {
        psql -U postgres -c "CREATE DATABASE bitacora WITH ENCODING 'UTF8' LC_COLLATE='en_US.UTF-8' LC_CTYPE='en_US.UTF-8' TEMPLATE=template0;"
        Write-Host "Base de datos 'bitacora' recreada correctamente." -ForegroundColor Green
    } catch {
        Write-Host "Error al recrear la base de datos 'bitacora'." -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "La base de datos 'bitacora' no existe. Creándola..." -ForegroundColor Yellow
    try {
        psql -U postgres -c "CREATE DATABASE bitacora WITH ENCODING 'UTF8' LC_COLLATE='en_US.UTF-8' LC_CTYPE='en_US.UTF-8' TEMPLATE=template0;"
        Write-Host "Base de datos 'bitacora' creada correctamente." -ForegroundColor Green
    } catch {
        Write-Host "Error al crear la base de datos 'bitacora'." -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Limpieza completada. La base de datos 'bitacora' está lista para ser utilizada." -ForegroundColor Green
Write-Host "Ahora puede ejecutar el script run-prod.ps1 para iniciar la aplicación." -ForegroundColor Green
