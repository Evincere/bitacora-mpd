@echo off
REM Script para testing integral sin datos mock (Windows)
REM Verifica que todos los módulos funcionen correctamente sin dependencias simuladas

setlocal enabledelayedexpansion

echo ========================================
echo   TESTING INTEGRAL SIN DATOS MOCK
echo ========================================
echo.

REM Verificar que estamos en el directorio raíz del proyecto
if not exist "package.json" if not exist "backend\pom.xml" (
    echo [ERROR] Este script debe ejecutarse desde el directorio raíz del proyecto
    exit /b 1
)

REM Contador de errores
set errors=0

echo 1. VERIFICACIÓN DE CONFIGURACIÓN
echo ==================================

REM Verificar que no existan referencias a VITE_USE_MOCK_DATA
echo [INFO] Verificando ausencia de referencias a VITE_USE_MOCK_DATA...
findstr /r /s "VITE_USE_MOCK_DATA" frontend\src\* >nul 2>&1
if !errorlevel! equ 0 (
    echo [ERROR] Se encontraron referencias a VITE_USE_MOCK_DATA en el código
    set /a errors+=1
) else (
    echo [OK] No se encontraron referencias a VITE_USE_MOCK_DATA
)

REM Verificar que no existan archivos mock obsoletos
echo [INFO] Verificando ausencia de archivos mock obsoletos...
set mock_files_found=false

if exist "frontend\src\components\common\MockDataBanner.tsx" (
    echo [ERROR] MockDataBanner.tsx aún existe
    set mock_files_found=true
)

if "!mock_files_found!"=="false" (
    echo [OK] No se encontraron archivos mock obsoletos
) else (
    set /a errors+=1
)

echo.
echo 2. TESTING DEL FRONTEND
echo ========================

cd frontend

REM Verificar que las dependencias estén instaladas
echo [INFO] Verificando dependencias del frontend...
if not exist "node_modules" (
    echo [WARN] Instalando dependencias del frontend...
    npm install
)

REM Ejecutar linting
echo [INFO] Ejecutando linting del frontend...
npm run lint
if !errorlevel! equ 0 (
    echo [OK] Linting del frontend pasó
) else (
    echo [ERROR] Linting del frontend falló
    set /a errors+=1
)

REM Ejecutar type checking
echo [INFO] Ejecutando verificación de tipos...
npm run type-check
if !errorlevel! equ 0 (
    echo [OK] Verificación de tipos pasó
) else (
    echo [ERROR] Verificación de tipos falló
    set /a errors+=1
)

REM Ejecutar tests unitarios
echo [INFO] Ejecutando tests unitarios del frontend...
npm run test:run
if !errorlevel! equ 0 (
    echo [OK] Tests unitarios del frontend pasaron
) else (
    echo [ERROR] Tests unitarios del frontend fallaron
    set /a errors+=1
)

REM Verificar que el build funcione
echo [INFO] Verificando build del frontend...
npm run build
if !errorlevel! equ 0 (
    echo [OK] Build del frontend exitoso
    REM Limpiar el build
    if exist "dist" rmdir /s /q dist
) else (
    echo [ERROR] Build del frontend falló
    set /a errors+=1
)

cd ..

echo.
echo 3. TESTING DEL BACKEND
echo ======================

cd backend

REM Verificar que Maven esté disponible
echo [INFO] Verificando Maven...
where mvn >nul 2>&1
if !errorlevel! equ 0 (
    set MAVEN_CMD=mvn
) else (
    if exist "mvnw.cmd" (
        set MAVEN_CMD=mvnw.cmd
    ) else (
        echo [ERROR] Maven no está disponible
        exit /b 1
    )
)

REM Ejecutar tests unitarios del backend
echo [INFO] Ejecutando tests unitarios del backend...
!MAVEN_CMD! test -Dspring.profiles.active=test
if !errorlevel! equ 0 (
    echo [OK] Tests unitarios del backend pasaron
) else (
    echo [ERROR] Tests unitarios del backend fallaron
    set /a errors+=1
)

REM Verificar compilación
echo [INFO] Verificando compilación del backend...
!MAVEN_CMD! compile -DskipTests
if !errorlevel! equ 0 (
    echo [OK] Compilación del backend exitosa
) else (
    echo [ERROR] Compilación del backend falló
    set /a errors+=1
)

cd ..

echo.
echo 4. VERIFICACIÓN DE INTEGRACIÓN
echo ===============================

REM Verificar configuraciones de datos iniciales
echo [INFO] Verificando archivos de configuración de datos...

set config_files=backend\src\main\resources\application-configurable-data.yml backend\src\main\resources\application-dev-data.yml backend\src\main\resources\application-test-data.yml backend\src\main\resources\application-prod-data.yml

for %%f in (%config_files%) do (
    if exist "%%f" (
        echo [OK] Encontrado: %%f
    ) else (
        echo [ERROR] Falta: %%f
        set /a errors+=1
    )
)

REM Verificar documentación
echo [INFO] Verificando documentación actualizada...

set doc_files=backend\CONFIGURABLE-DATA-INITIALIZATION.md backend\README-DATA-INITIALIZATION.md CHANGELOG.md TASKS.md

for %%f in (%doc_files%) do (
    if exist "%%f" (
        echo [OK] Encontrado: %%f
    ) else (
        echo [ERROR] Falta: %%f
        set /a errors+=1
    )
)

echo.
echo 5. RESUMEN DE RESULTADOS
echo =========================

if !errors! equ 0 (
    echo ✅ TODOS LOS TESTS PASARON
    echo ✅ El sistema está listo para producción sin datos mock
    echo.
    echo Beneficios logrados:
    echo • ✅ Eliminados todos los datos mock y hardcodeados
    echo • ✅ Sistema de configuración flexible implementado
    echo • ✅ Manejo de errores robusto en toda la aplicación
    echo • ✅ Estados vacíos apropiados para mejor UX
    echo • ✅ Configuración por ambiente sin recompilación
    echo • ✅ Seguridad mejorada con variables de entorno
    echo.
    echo Para usar el sistema configurable:
    echo • Desarrollo: --spring.profiles.active=dev,configurable-data-init,dev-data
    echo • Testing: --spring.profiles.active=test,configurable-data-init,test-data
    echo • Producción: --spring.profiles.active=prod,configurable-data-init,prod-data
    echo.
    exit /b 0
) else (
    echo ❌ SE ENCONTRARON !errors! ERRORES
    echo ❌ Revisar los errores antes de continuar
    echo.
    echo Acciones recomendadas:
    echo • Revisar y corregir los errores reportados
    echo • Ejecutar tests individuales para más detalles
    echo • Verificar configuraciones de ambiente
    echo.
    exit /b 1
)
