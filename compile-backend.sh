#!/bin/bash

# Colores para mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Compilando el backend con Java 17...${NC}"

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

# Verificar si Maven está instalado
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Error: Maven no está instalado.${NC}"
    echo -e "${YELLOW}Instala Maven con: sudo apt install maven${NC}"
    exit 1
fi

# Ir al directorio del backend
cd backend || {
    echo -e "${RED}Error: No se pudo acceder al directorio 'backend'.${NC}"
    exit 1
}

# Limpiar y compilar el proyecto
echo -e "${YELLOW}Limpiando y compilando el proyecto...${NC}"
JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java)))) mvn clean package -DskipTests -Dmaven.compiler.release=17

# Verificar si la compilación fue exitosa
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: No se pudo compilar el proyecto.${NC}"
    echo -e "${YELLOW}Intenta ejecutar: JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java)))) mvn clean package -DskipTests -Dmaven.compiler.release=17 -X${NC}"
    exit 1
fi

echo -e "${GREEN}Proyecto compilado correctamente.${NC}"

# Volver al directorio raíz
cd ..

echo -e "${GREEN}Compilación completada.${NC}"
echo -e "${YELLOW}Ahora puedes ejecutar: ./start-dev-linux.sh${NC}"
