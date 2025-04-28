#!/bin/bash

# Colores para mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Iniciando la aplicación con Java 17...${NC}"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker no está instalado. No se iniciarán los servicios de infraestructura.${NC}"
    echo -e "${YELLOW}Puedes instalar Docker con: sudo apt install docker.io docker-compose${NC}"
else
    # Iniciar servicios de infraestructura con Docker Compose
    echo -e "${YELLOW}Iniciando servicios de infraestructura...${NC}"
    docker-compose up -d postgres

    # Esperar a que PostgreSQL esté listo
    echo -e "${YELLOW}Esperando a que PostgreSQL esté listo...${NC}"
    sleep 10
fi

# Compilar el backend
echo -e "${YELLOW}Compilando el backend...${NC}"
./compile-backend.sh

# Iniciar el backend en segundo plano
echo -e "${YELLOW}Iniciando el backend...${NC}"
./run-backend-java17.sh &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

# Esperar a que el backend esté listo
echo -e "${YELLOW}Esperando a que el backend esté listo...${NC}"
sleep 15

# Iniciar el frontend
echo -e "${YELLOW}Iniciando el frontend...${NC}"
cd frontend || {
    echo -e "${RED}Error: No se pudo acceder al directorio 'frontend'.${NC}"
    exit 1
}

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Instalando dependencias del frontend...${NC}"
    npm install
fi

# Iniciar el servidor de desarrollo
echo -e "${GREEN}Iniciando servidor de desarrollo en el puerto 3000...${NC}"
npm run dev &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../frontend.pid

cd ..

echo -e "${GREEN}Aplicación iniciada correctamente.${NC}"
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}Backend API:${NC} http://localhost:8080/api"
echo -e "${BLUE}H2 Console:${NC} http://localhost:8080/api/h2-console"
echo -e "${BLUE}Swagger UI:${NC} http://localhost:8080/api/swagger-ui/index.html"

echo -e "\n${YELLOW}Para detener la aplicación, ejecuta: ./stop-dev-linux.sh${NC}"
