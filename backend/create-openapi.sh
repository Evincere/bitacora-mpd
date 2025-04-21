#!/bin/bash
echo "Creando archivo OpenAPI usando OpenApiGenerator..."

# Ejecutar la clase OpenApiGenerator para generar el archivo OpenAPI
mvn exec:java -Dexec.mainClass="com.bitacora.tools.OpenApiGenerator" -Dexec.classpathScope=runtime

# Verificar si la generación fue exitosa
if [ $? -ne 0 ]; then
    echo "Error: No se pudo generar el archivo OpenAPI usando OpenApiGenerator"
    echo "Creando archivo OpenAPI manualmente como alternativa..."

    # Crear el directorio target si no existe
    mkdir -p target

    # Crear un archivo OpenAPI básico manualmente
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
    echo "Archivo OpenAPI creado manualmente en target/openapi.json"
else
    echo "Archivo OpenAPI creado correctamente en target/openapi.json"
fi
