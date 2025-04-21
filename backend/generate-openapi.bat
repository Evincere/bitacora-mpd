@echo off
echo Generando especificacion OpenAPI manualmente...

REM Crear el directorio target si no existe
if not exist "target" (
    mkdir target
)

REM Ejecutar una clase Java específica para generar el archivo OpenAPI
echo Ejecutando clase OpenApiGenerator...
call mvnw exec:java -Dexec.mainClass="com.bitacora.tools.OpenApiGenerator" -Dexec.classpathScope=runtime

REM Verificar si el archivo openapi.json se ha generado
if not exist "target\openapi.json" (
    echo Error: No se pudo generar el archivo openapi.json
    exit /b 1
)

echo Archivo openapi.json generado correctamente en target/openapi.json
