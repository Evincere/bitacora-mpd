@echo off
echo ===================================================
echo Bitacora MPD - Analisis de Seguridad
echo ===================================================

REM Crear directorio para resultados
if not exist "results" mkdir results

REM Obtener fecha y hora actual para el nombre del archivo
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"

set "timestamp=%YYYY%%MM%%DD%_%HH%%Min%%Sec%"
set "result_dir=results\security_scan_%timestamp%"
mkdir "%result_dir%"

echo Ejecutando analisis de seguridad...
echo Directorio de resultados: %result_dir%

echo.
echo 1. Analisis de dependencias (OWASP Dependency Check)
echo ---------------------------------------------------
cd ..\backend
call mvnw org.owasp:dependency-check-maven:check -DoutputDirectory=..\security\%result_dir%\dependency-check -DformatsEnabled=HTML,JSON,CSV
cd ..\security

echo.
echo 2. Analisis de codigo estatico (PMD)
echo ---------------------------------------------------
cd ..\backend
call mvnw pmd:pmd -DoutputDirectory=..\security\%result_dir%\pmd
cd ..\security

echo.
echo 3. Analisis de codigo estatico (SpotBugs)
echo ---------------------------------------------------
cd ..\backend
call mvnw com.github.spotbugs:spotbugs-maven-plugin:spotbugs -DoutputDirectory=..\security\%result_dir%\spotbugs
cd ..\security

echo.
echo 4. Analisis de dependencias de frontend (npm audit)
echo ---------------------------------------------------
cd ..\frontend
call npm audit --json > ..\security\%result_dir%\npm-audit.json
cd ..\security

echo.
echo 5. Verificacion de configuracion de seguridad
echo ---------------------------------------------------
echo Verificando configuracion de seguridad...

REM Verificar configuracion de seguridad en application.yml
findstr /C:"security" ..\backend\src\main\resources\application.yml > "%result_dir%\security-config.txt"
findstr /C:"jwt" ..\backend\src\main\resources\application.yml >> "%result_dir%\security-config.txt"
findstr /C:"cors" ..\backend\src\main\resources\application.yml >> "%result_dir%\security-config.txt"
findstr /C:"csrf" ..\backend\src\main\resources\application.yml >> "%result_dir%\security-config.txt"

echo.
echo 6. Generando informe de seguridad
echo ---------------------------------------------------
echo Generando informe de seguridad...

echo # Informe de Analisis de Seguridad - Bitacora MPD > "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"
echo Fecha: %YYYY%-%MM%-%DD% %HH%:%Min%:%Sec% >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"

echo ## Resumen >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"
echo Este informe contiene los resultados del analisis de seguridad automatizado para el proyecto Bitacora MPD. >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"

echo ## Analisis de Dependencias (Backend) >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"
echo Ver informe detallado en [dependency-check/dependency-check-report.html](dependency-check/dependency-check-report.html) >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"

echo ## Analisis de Codigo Estatico (PMD) >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"
echo Ver informe detallado en [pmd/pmd-report.html](pmd/pmd-report.html) >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"

echo ## Analisis de Codigo Estatico (SpotBugs) >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"
echo Ver informe detallado en [spotbugs/spotbugs.html](spotbugs/spotbugs.html) >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"

echo ## Analisis de Dependencias (Frontend) >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"
echo Ver informe detallado en [npm-audit.json](npm-audit.json) >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"

echo ## Configuracion de Seguridad >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"
echo ```>> "%result_dir%\security-report.md"
type "%result_dir%\security-config.txt" >> "%result_dir%\security-report.md"
echo ```>> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"

echo ## Recomendaciones >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"
echo 1. Revisar y actualizar las dependencias vulnerables identificadas en los informes >> "%result_dir%\security-report.md"
echo 2. Corregir los problemas de codigo identificados por PMD y SpotBugs >> "%result_dir%\security-report.md"
echo 3. Verificar la configuracion de seguridad y asegurarse de que sigue las mejores practicas >> "%result_dir%\security-report.md"
echo 4. Realizar pruebas de penetracion manuales para identificar vulnerabilidades no detectadas por herramientas automatizadas >> "%result_dir%\security-report.md"
echo. >> "%result_dir%\security-report.md"

echo.
echo Analisis de seguridad completado.
echo Informe generado en: %result_dir%\security-report.md
echo.

exit /b 0
