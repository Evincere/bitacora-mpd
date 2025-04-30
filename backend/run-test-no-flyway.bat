@echo off
echo Ejecutando tests sin Flyway...
echo.

if "%1"=="" (
    echo Uso: run-test-no-flyway.bat NombreDelTest
    exit /b 1
)

echo Ejecutando test %1 sin Flyway...
call mvn test "-Dtest=%1" "-Dspring.profiles.active=noflywaytest"
echo.

echo Tests completados.
