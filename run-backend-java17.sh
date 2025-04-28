#!/bin/bash

# Colores para mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Ejecutando el backend con Java 17...${NC}"

# Verificar si Java está instalado
if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java no está instalado.${NC}"
    echo -e "${YELLOW}Instala Java con: sudo ./install-java17.sh${NC}"
    exit 1
fi

# Verificar versión de Java
java_version=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$java_version" -lt 17 ]; then
    echo -e "${RED}Error: La versión de Java es demasiado antigua (Java $java_version).${NC}"
    echo -e "${YELLOW}El proyecto requiere Java 17 o superior.${NC}"
    echo -e "${YELLOW}Instala Java 17 con: sudo ./install-java17.sh${NC}"
    exit 1
fi

# Ir al directorio del backend
cd backend || {
    echo -e "${RED}Error: No se pudo acceder al directorio 'backend'.${NC}"
    exit 1
}

# Verificar si existe el archivo JAR
if [ ! -f "target/bitacora-backend-0.0.1-SNAPSHOT.jar" ]; then
    echo -e "${YELLOW}No se encontró el archivo JAR. Compilando el proyecto...${NC}"
    JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java)))) mvn clean package -DskipTests -Dmaven.compiler.release=17
    
    # Verificar si la compilación fue exitosa
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: No se pudo compilar el proyecto.${NC}"
        exit 1
    fi
fi

# Ejecutar la aplicación con Java 17
echo -e "${GREEN}Iniciando aplicación Spring Boot en el puerto 8080...${NC}"
JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java)))) java -jar target/bitacora-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev,flyway

# Volver al directorio raíz
cd ..
