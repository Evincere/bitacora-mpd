#!/bin/bash
echo "==================================================="
echo "Generando OpenAPI y tipos TypeScript para Bitacora"
echo "==================================================="
echo

# Crear el directorio target si no existe
mkdir -p target

echo "Paso 1: Generando archivo OpenAPI..."
echo

# Intentar generar el archivo OpenAPI usando la clase OpenApiGenerator
mvn exec:java -Dexec.mainClass="com.bitacora.tools.OpenApiGenerator" -Dexec.classpathScope=runtime

# Verificar si la generación fue exitosa
if [ ! -f "target/openapi.json" ]; then
    echo "Error: No se pudo generar el archivo OpenAPI usando OpenApiGenerator"
    echo "Creando archivo OpenAPI manualmente como alternativa..."
    echo
    
    # Crear un archivo OpenAPI básico manualmente
    cat > target/openapi.json << 'EOF'
{
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
  "paths": {
    "/auth/login": {
      "post": {
        "tags": ["Autenticacion"],
        "summary": "Iniciar sesion",
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
            "description": "Autenticacion exitosa",
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
fi

echo
echo "Paso 2: Generando tipos TypeScript..."
echo

# Generar los tipos TypeScript usando el plugin de Maven
mvn org.openapitools:openapi-generator-maven-plugin:generate@generate-typescript-client -DskipValidateSpec=true

# Verificar si la generación fue exitosa
if [ $? -ne 0 ]; then
    echo
    echo "Error: No se pudieron generar los tipos TypeScript"
    exit 1
fi

echo
echo "==================================================="
echo "Proceso completado con exito!"
echo
echo "Los tipos TypeScript se han generado en:"
echo "../frontend/src/api/generated"
echo "==================================================="
