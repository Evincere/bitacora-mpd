#!/bin/bash

echo "Generando especificación OpenAPI..."

# Verificar si existe el directorio de recursos
if [ ! -d "src/main/resources" ]; then
    echo "No se encontró el directorio de recursos."
    exit 1
fi

# Crear directorio para la especificación OpenAPI si no existe
mkdir -p src/main/resources/static/api-docs

# Compilar el proyecto para generar la especificación OpenAPI
mvn compile

echo "Especificación OpenAPI generada correctamente."
