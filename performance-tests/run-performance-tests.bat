@echo off
echo ===================================================
echo Bitacora MPD - Pruebas de Rendimiento
echo ===================================================

REM Verificar si JMeter está instalado
where jmeter >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: JMeter no está instalado o no está en el PATH.
    echo Por favor, instale JMeter desde https://jmeter.apache.org/download_jmeter.cgi
    echo y asegúrese de que esté en el PATH del sistema.
    exit /b 1
)

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
set "result_file=results\bitacora_performance_%timestamp%"

echo Ejecutando pruebas de rendimiento...
echo Archivo de resultados: %result_file%.jtl

REM Ejecutar JMeter en modo no GUI
jmeter -n -t jmeter\bitacora-load-test.jmx -l "%result_file%.jtl" -e -o "%result_file%_report"

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: La prueba de rendimiento falló.
    exit /b 1
)

echo.
echo Pruebas de rendimiento completadas exitosamente.
echo Informe HTML generado en: %result_file%_report\index.html
echo.

REM Abrir el informe en el navegador predeterminado
start "" "%result_file%_report\index.html"

exit /b 0
