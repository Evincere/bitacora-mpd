param(
    [Parameter(Mandatory=$true)]
    [string]$TestName
)

Write-Host "Ejecutando tests sin Flyway..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Ejecutando test $TestName sin Flyway..." -ForegroundColor Cyan
mvn test "-Dtest=$TestName" "-Dspring.profiles.active=noflywaytest"
Write-Host ""

Write-Host "Tests completados." -ForegroundColor Green
