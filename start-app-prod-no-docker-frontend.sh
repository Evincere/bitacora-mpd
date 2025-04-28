#!/bin/bash

# Colores para mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Iniciando la aplicación en modo producción (sin Docker para el frontend)...${NC}"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker no está instalado.${NC}"
    echo -e "${YELLOW}Instala Docker con: sudo apt install docker.io docker-compose${NC}"
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose no está instalado.${NC}"
    echo -e "${YELLOW}Instala Docker Compose con: sudo apt install docker-compose${NC}"
    exit 1
fi

# Compilar el backend
echo -e "${YELLOW}Compilando el backend...${NC}"
cd backend || {
    echo -e "${RED}Error: No se pudo acceder al directorio 'backend'.${NC}"
    exit 1
}

# Verificar si Maven está instalado
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Error: Maven no está instalado.${NC}"
    echo -e "${YELLOW}Instala Maven con: sudo apt install maven${NC}"
    exit 1
fi

# Compilar el proyecto
echo -e "${YELLOW}Compilando el proyecto...${NC}"
JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java)))) mvn clean package -DskipTests -Dmaven.compiler.release=17

# Verificar si la compilación fue exitosa
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: No se pudo compilar el proyecto.${NC}"
    exit 1
fi

cd ..

# Iniciar los servicios de backend y base de datos con Docker Compose
echo -e "${YELLOW}Iniciando servicios de backend y base de datos con Docker Compose...${NC}"
docker-compose up -d postgres backend

# Verificar si los servicios se iniciaron correctamente
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: No se pudieron iniciar los servicios.${NC}"
    exit 1
fi

# Compilar el frontend
echo -e "${YELLOW}Compilando el frontend...${NC}"
cd frontend || {
    echo -e "${RED}Error: No se pudo acceder al directorio 'frontend'.${NC}"
    exit 1
}

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js no está instalado.${NC}"
    echo -e "${YELLOW}Instala Node.js con: sudo apt install nodejs npm${NC}"
    exit 1
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Instalando dependencias del frontend...${NC}"
    npm install
fi

# Asegurarse de que las dependencias específicas estén instaladas
echo -e "${YELLOW}Verificando dependencias específicas...${NC}"
npm list @hookform/resolvers react-hook-form zod @tanstack/react-virtual || {
    echo -e "${YELLOW}Instalando dependencias faltantes...${NC}"
    npm install @hookform/resolvers react-hook-form zod @tanstack/react-virtual
}

# Iniciar el servidor de desarrollo
echo -e "${GREEN}Iniciando servidor de desarrollo en el puerto 3000...${NC}"
npm run dev &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../frontend.pid

cd ..

echo -e "${GREEN}Aplicación iniciada correctamente.${NC}"
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}Backend API:${NC} http://localhost:8080/api"
echo -e "${BLUE}Grafana:${NC} http://localhost:${GRAFANA_PORT:-3100}"
echo -e "${BLUE}Prometheus:${NC} http://localhost:${PROMETHEUS_PORT:-9090}"
echo -e "${BLUE}Zipkin:${NC} http://localhost:${ZIPKIN_PORT:-9411}"

echo -e "\n${YELLOW}Para detener la aplicación, ejecuta: ./stop-dev-linux.sh${NC}"
