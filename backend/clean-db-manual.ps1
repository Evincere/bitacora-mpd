# Script de PowerShell para limpiar manualmente la base de datos H2

Write-Host "Limpiando manualmente la base de datos H2..." -ForegroundColor Green
Write-Host ""

# Verificar si la aplicación está en ejecución
Write-Host "Verificando si la aplicación está en ejecución..." -ForegroundColor Cyan
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "ADVERTENCIA: Se encontraron procesos Java en ejecución." -ForegroundColor Yellow
    Write-Host "Es posible que la aplicación esté en ejecución. Se recomienda detenerla antes de continuar." -ForegroundColor Yellow
    $continue = Read-Host "¿Desea continuar de todos modos? (s/n)"
    if ($continue -ne "s") {
        Write-Host "Operación cancelada." -ForegroundColor Red
        exit
    }
}

# Intentar limpiar la base de datos con SQL
Write-Host "Intentando limpiar la base de datos con SQL..." -ForegroundColor Cyan

# Crear un archivo SQL temporal para limpiar la base de datos
$tempSqlFile = "temp-clean.sql"
$sqlContent = @"
DROP ALL OBJECTS;
"@
Set-Content -Path $tempSqlFile -Value $sqlContent

# Intentar ejecutar el archivo SQL con la herramienta H2 Console
try {
    Write-Host "Ejecutando script de limpieza SQL..." -ForegroundColor Yellow
    java -cp "$env:USERPROFILE\.m2\repository\com\h2database\h2\2.2.224\h2-2.2.224.jar" org.h2.tools.RunScript -url "jdbc:h2:mem:bitacoradb" -user "sa" -password "" -script $tempSqlFile -showResults
    Write-Host "Script SQL ejecutado correctamente." -ForegroundColor Green
} catch {
    Write-Host "Error al ejecutar el script SQL: $_" -ForegroundColor Red
    Write-Host "Continuando con métodos alternativos de limpieza..." -ForegroundColor Yellow
}

# Eliminar el archivo temporal
if (Test-Path $tempSqlFile) {
    Remove-Item -Path $tempSqlFile -Force
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

# Eliminar archivos de migración compilados
Write-Host "Verificando archivos de migración compilados..." -ForegroundColor Cyan
if (Test-Path "target\classes\db\migration\dev") {
    Write-Host "Eliminando archivos de migración H2 compilados..." -ForegroundColor Yellow
    Remove-Item -Path "target\classes\db\migration\dev" -Recurse -Force
    Write-Host "Archivos de migración H2 compilados eliminados." -ForegroundColor Green
} else {
    Write-Host "No se encontraron archivos de migración H2 compilados." -ForegroundColor Yellow
}

# Eliminar el directorio target
Write-Host "¿Desea eliminar el directorio target completo? Esto forzará una recompilación completa." -ForegroundColor Cyan
$deleteTarget = Read-Host "Eliminar directorio target (s/n)"
if ($deleteTarget -eq "s") {
    if (Test-Path "target") {
        Write-Host "Eliminando directorio target..." -ForegroundColor Yellow
        Remove-Item -Path "target" -Recurse -Force
        Write-Host "Directorio target eliminado." -ForegroundColor Green
    } else {
        Write-Host "No se encontró el directorio target." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Limpieza completada. La base de datos H2 ha sido limpiada manualmente." -ForegroundColor Green
Write-Host "Ahora puede ejecutar el script run-dev.ps1 para iniciar la aplicación con una base de datos limpia." -ForegroundColor Green
