# Script de PowerShell para iniciar la aplicación con los perfiles correctos

Write-Host "Iniciando la aplicación Bitácora con los perfiles dev y flyway..." -ForegroundColor Green
Write-Host ""

# Limpiar y compilar el proyecto
Write-Host "Limpiando y compilando el proyecto..." -ForegroundColor Cyan
mvn clean package -DskipTests
Write-Host ""

# Generar el archivo OpenAPI
Write-Host "Generando archivo OpenAPI y tipos TypeScript..." -ForegroundColor Cyan
.\generate-openapi-typescript.bat
Write-Host ""

# Ejecutar la aplicación con los perfiles correctos
Write-Host "Ejecutando la aplicación..." -ForegroundColor Cyan

# Preguntar qué perfil usar
$perfil = Read-Host "Qué perfil deseas usar? (dev/prod) [dev]"

# Si no se especifica, usar dev por defecto
if ([string]::IsNullOrEmpty($perfil)) {
    $perfil = "dev"
}

# Configurar los perfiles según la selección
if ($perfil -eq "dev") {
    Write-Host "Usando perfil de desarrollo con H2..." -ForegroundColor Yellow
    mvn spring-boot:run "-Dspring-boot.run.profiles=dev,flyway"
} else {
    Write-Host "Usando perfil de producción con PostgreSQL..." -ForegroundColor Yellow
    mvn spring-boot:run "-Dspring-boot.run.profiles=prod,postgresql,flyway"
}

Write-Host ""
Write-Host "Aplicación finalizada." -ForegroundColor Green
