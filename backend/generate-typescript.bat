@echo off
echo Generando especificacion OpenAPI y tipos TypeScript...

REM Generar el archivo OpenAPI manualmente
echo Paso 1: Generando especificacion OpenAPI...

REM Limpiar el directorio target si existe
if exist "target" (
    echo Limpiando directorio target...
    rmdir /s /q "target"
)

REM Crear el directorio target
mkdir target

REM Crear un archivo OpenAPI básico manualmente
(
echo {
    "openapi": "3.0.1",
    "info": {
        "title": "Bitacora MPD API",
        "description": "API para la aplicacion Bitacora MPD",
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "/api",
            "description": "Servidor de desarrollo"
        }
    ],
    "paths": {}
}
) > target\openapi.json

echo Archivo OpenAPI básico creado manualmente.

REM Verificar si el archivo openapi.json se ha generado
if not exist "target\openapi.json" (
    echo Error: No se pudo generar el archivo openapi.json
    exit /b 1
)

echo Archivo openapi.json generado correctamente.

REM Generar los tipos TypeScript
echo Paso 2: Generando tipos TypeScript...
IF EXIST "mvnw.cmd" (
    call mvnw.cmd org.openapitools:openapi-generator-maven-plugin:generate@generate-typescript-client
) ELSE (
    call mvn org.openapitools:openapi-generator-maven-plugin:generate@generate-typescript-client
)

REM Verificar si la generacion fue exitosa
if %ERRORLEVEL% neq 0 (
    echo Error: No se pudieron generar los tipos TypeScript
    exit /b 1
)

echo Tipos TypeScript generados correctamente en ../frontend/src/api/generated
echo Proceso completado con exito.
