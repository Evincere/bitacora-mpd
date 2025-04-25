@echo off
echo ===================================================
echo Generando OpenAPI y tipos TypeScript para Bitacora
echo ===================================================
echo.

REM Crear el directorio target si no existe
if not exist "target" (
    mkdir target
)

echo Paso 1: Generando archivo OpenAPI...
echo.

REM Intentar generar el archivo OpenAPI usando la clase OpenApiGenerator
call mvn exec:java -Dexec.mainClass="com.bitacora.tools.OpenApiGenerator" -Dexec.classpathScope=runtime

REM Verificar si la generación fue exitosa
if not exist "target\openapi.json" (
    echo Error: No se pudo generar el archivo OpenAPI usando OpenApiGenerator
    echo Creando archivo OpenAPI manualmente como alternativa...
    echo.
    
    REM Crear un archivo OpenAPI básico manualmente
    (
echo {
echo   "openapi": "3.0.1",
echo   "info": {
echo     "title": "Bitacora MPD API",
echo     "description": "API para la aplicacion Bitacora MPD",
echo     "version": "1.0.0"
echo   },
echo   "servers": [
echo     {
echo       "url": "/api",
echo       "description": "Servidor de desarrollo"
echo     }
echo   ],
echo   "paths": {
echo     "/auth/login": {
echo       "post": {
echo         "tags": ["Autenticacion"],
echo         "summary": "Iniciar sesion",
echo         "operationId": "login",
echo         "requestBody": {
echo           "content": {
echo             "application/json": {
echo               "schema": {
echo                 "$ref": "#/components/schemas/AuthRequest"
echo               }
echo             }
echo           }
echo         },
echo         "responses": {
echo           "200": {
echo             "description": "Autenticacion exitosa",
echo             "content": {
echo               "application/json": {
echo                 "schema": {
echo                   "$ref": "#/components/schemas/AuthResponse"
echo                 }
echo               }
echo             }
echo           }
echo         }
echo       }
echo     }
echo   },
echo   "components": {
echo     "schemas": {
echo       "AuthRequest": {
echo         "type": "object",
echo         "properties": {
echo           "username": {
echo             "type": "string"
echo           },
echo           "password": {
echo             "type": "string"
echo           }
echo         }
echo       },
echo       "AuthResponse": {
echo         "type": "object",
echo         "properties": {
echo           "accessToken": {
echo             "type": "string"
echo           },
echo           "refreshToken": {
echo             "type": "string"
echo           },
echo           "tokenType": {
echo             "type": "string"
echo           },
echo           "expiresIn": {
echo             "type": "integer"
echo           },
echo           "user": {
echo             "type": "object",
echo             "properties": {
echo               "id": {
echo                 "type": "string"
echo               },
echo               "username": {
echo                 "type": "string"
echo               },
echo               "email": {
echo                 "type": "string"
echo               },
echo               "firstName": {
echo                 "type": "string"
echo               },
echo               "lastName": {
echo                 "type": "string"
echo               },
echo               "role": {
echo                 "type": "string"
echo               }
echo             }
echo           }
echo         }
echo       }
echo     }
echo   }
echo }
    ) > target\openapi.json
    
    echo Archivo OpenAPI creado manualmente en target\openapi.json
)

echo.
echo Paso 2: Generando tipos TypeScript...
echo.

REM Generar los tipos TypeScript usando el plugin de Maven
call mvn org.openapitools:openapi-generator-maven-plugin:generate@generate-typescript-client -DskipValidateSpec=true

REM Verificar si la generación fue exitosa
if %ERRORLEVEL% neq 0 (
    echo.
    echo Error: No se pudieron generar los tipos TypeScript
    exit /b 1
)

echo.
echo ===================================================
echo Proceso completado con exito!
echo.
echo Los tipos TypeScript se han generado en:
echo ../frontend/src/api/generated
echo ===================================================
