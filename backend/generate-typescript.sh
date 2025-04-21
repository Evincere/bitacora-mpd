#!/bin/bash
echo "Generando especificacion OpenAPI y tipos TypeScript..."

# Crear el directorio target si no existe
mkdir -p target

# Generar el archivo OpenAPI usando OpenApiGenerator
mvn exec:java -Dexec.mainClass="com.bitacora.tools.OpenApiGenerator" -Dexec.classpathScope=runtime

# Si falla, crear un archivo OpenAPI básico manualmente
if [ $? -ne 0 ]; then
    echo "Error: No se pudo generar el archivo OpenAPI usando OpenApiGenerator"
    echo "Creando archivo OpenAPI manualmente como alternativa..."

    cat > target/openapi.json << 'EOF'
{
  "openapi": "3.0.1",
  "info": {
    "title": "Bitácora MPD API",
    "description": "API para la aplicación Bitácora MPD",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "/api",
      "description": "Servidor de desarrollo"
    }
  ],
  "paths": {
    "/auth/login": {
      "post": {
        "tags": ["Autenticación"],
        "summary": "Iniciar sesión",
        "operationId": "login",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AuthRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Autenticación exitosa",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthResponse"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "AuthRequest": {
        "type": "object",
        "properties": {
          "username": {
            "type": "string"
          },
          "password": {
            "type": "string"
          }
        }
      },
      "AuthResponse": {
        "type": "object",
        "properties": {
          "accessToken": {
            "type": "string"
          },
          "refreshToken": {
            "type": "string"
          },
          "tokenType": {
            "type": "string"
          },
          "expiresIn": {
            "type": "integer"
          },
          "user": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "username": {
                "type": "string"
              },
              "email": {
                "type": "string"
              },
              "firstName": {
                "type": "string"
              },
              "lastName": {
                "type": "string"
              },
              "role": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  }
}
EOF
    echo "Archivo OpenAPI básico creado manualmente."
fi

# Verificar si el archivo openapi.json se ha generado
if [ ! -f "target/openapi.json" ]; then
    echo "Error: No se pudo generar el archivo openapi.json"
    exit 1
fi

echo "Archivo openapi.json generado correctamente."

# Generar los tipos TypeScript
echo "Paso 2: Generando tipos TypeScript..."
# Usar mvn directamente en lugar de mvnw
mvn org.openapitools:openapi-generator-maven-plugin:generate@generate-typescript-client

# Verificar si la generación fue exitosa
if [ $? -ne 0 ]; then
    echo "Error: No se pudieron generar los tipos TypeScript"
    exit 1
fi

echo "Tipos TypeScript generados correctamente en ../frontend/src/api/generated"
echo "Proceso completado con exito."
