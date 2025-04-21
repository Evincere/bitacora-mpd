@echo off
echo Iniciando la aplicación Bitácora MPD...
echo.

echo Verificando si es necesario generar tipos TypeScript...
set GENERATE_TYPES=n
set /p GENERATE_TYPES=¿Desea generar los tipos TypeScript desde OpenAPI? (s/n) [n]:

if /i "%GENERATE_TYPES%"=="s" (
    echo.
    echo Generando tipos TypeScript desde OpenAPI...
    cd backend
    REM Intentar con el script normal primero
    call generate-typescript.bat
    set RESULT=%ERRORLEVEL%

    REM Si falla, usar el script manual
    if %RESULT% neq 0 (
        echo Intentando generar tipos TypeScript manualmente...
        call create-openapi-manual.bat
        set RESULT=%ERRORLEVEL%
    )

    cd ..
    echo.

    if %RESULT% neq 0 (
        echo Error al generar los tipos TypeScript. Continuando con el inicio de la aplicación...
        echo.
    ) else (
        echo Tipos TypeScript generados correctamente.
        echo.
    )
)

echo Iniciando el backend...
start cmd /k "cd backend && mvn spring-boot:run -Dspring-boot.run.main-class=com.bitacora.BitacoraApplication"
echo.
echo Esperando a que el backend se inicie (15 segundos)...
timeout /t 15 /nobreak
echo.
echo Iniciando el frontend...
start cmd /k "cd frontend && npm run dev"
echo.
echo Esperando a que el frontend se inicie (5 segundos)...
timeout /t 5 /nobreak
echo.
echo Abriendo la aplicación en el navegador...
start http://localhost:3000
echo.
echo ¡Aplicación iniciada correctamente!
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8080/api
echo - Consola H2: http://localhost:8080/api/h2-console
echo.
echo Credenciales de prueba:
echo - Usuario administrador: admin / Admin@123
echo - Usuario regular: usuario / Usuario@123
echo - Usuario de prueba: testuser / test123
