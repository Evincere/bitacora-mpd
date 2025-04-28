#!/bin/bash

# Colores para mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Deteniendo entorno de desarrollo...${NC}"

# Detener frontend
if [ -f "frontend.pid" ]; then
    FRONTEND_PID=$(cat frontend.pid)
    echo -e "${YELLOW}Deteniendo frontend (PID: $FRONTEND_PID)...${NC}"
    kill -9 $FRONTEND_PID 2>/dev/null || true
    rm frontend.pid
    echo -e "${GREEN}Frontend detenido.${NC}"
else
    echo -e "${YELLOW}No se encontró el archivo frontend.pid. El frontend podría no estar en ejecución.${NC}"
fi

# Detener backend
if [ -f "backend.pid" ]; then
    BACKEND_PID=$(cat backend.pid)
    echo -e "${YELLOW}Deteniendo backend (PID: $BACKEND_PID)...${NC}"
    kill -9 $BACKEND_PID 2>/dev/null || true
    rm backend.pid
    echo -e "${GREEN}Backend detenido.${NC}"
else
    echo -e "${YELLOW}No se encontró el archivo backend.pid. El backend podría no estar en ejecución.${NC}"
fi

# Detener servicios de infraestructura
echo -e "${YELLOW}Deteniendo servicios de infraestructura...${NC}"
docker-compose down

echo -e "${GREEN}Entorno de desarrollo detenido correctamente.${NC}"
