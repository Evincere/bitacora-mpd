#!/bin/bash
echo "Creando archivo OpenAPI manualmente..."

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

echo "Archivo OpenAPI creado correctamente en target/openapi.json"

# Generar los tipos TypeScript
echo "Generando tipos TypeScript..."
mvn org.openapitools:openapi-generator-maven-plugin:generate@generate-typescript-client -DskipValidateSpec=true

if [ $? -eq 0 ]; then
    echo "Tipos TypeScript generados correctamente."
else
    echo "Error: No se pudieron generar los tipos TypeScript."
    exit 1
fi
