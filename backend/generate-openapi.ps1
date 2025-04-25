Write-Host "Generando especificacion OpenAPI y tipos TypeScript..."

# Crear el directorio target si no existe
if (-not (Test-Path -Path "target")) {
    New-Item -ItemType Directory -Path "target" | Out-Null
}

# Crear un archivo OpenAPI básico manualmente
$openApiJson = @"
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
                "\$ref": "#/components/schemas/AuthRequest"
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
                  "\$ref": "#/components/schemas/AuthResponse"
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
"@

# Guardar el archivo OpenAPI
$openApiJson | Out-File -FilePath "target/openapi.json" -Encoding utf8

Write-Host "Archivo OpenAPI creado correctamente en target/openapi.json"

# Generar los tipos TypeScript
Write-Host "Generando tipos TypeScript..."
mvn org.openapitools:openapi-generator-maven-plugin:generate@generate-typescript-client -DskipValidateSpec=true

if ($LASTEXITCODE -eq 0) {
    Write-Host "Tipos TypeScript generados correctamente."
} else {
    Write-Host "Error: No se pudieron generar los tipos TypeScript."
    exit 1
}
