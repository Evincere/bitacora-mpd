#!/bin/bash

# Colores para mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Instalando dependencias faltantes del frontend...${NC}"

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js no está instalado.${NC}"
    echo -e "${YELLOW}Instala Node.js con: sudo apt install nodejs npm${NC}"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm no está instalado.${NC}"
    echo -e "${YELLOW}Instala npm con: sudo apt install npm${NC}"
    exit 1
fi

# Ir al directorio del frontend
cd frontend || {
    echo -e "${RED}Error: No se pudo acceder al directorio 'frontend'.${NC}"
    exit 1
}

# Instalar dependencias faltantes
echo -e "${YELLOW}Instalando dependencias faltantes...${NC}"
npm install @hookform/resolvers react-hook-form zod @tanstack/react-virtual

# Verificar si la instalación fue exitosa
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: No se pudieron instalar las dependencias.${NC}"
    exit 1
fi

echo -e "${GREEN}Dependencias instaladas correctamente.${NC}"

# Volver al directorio raíz
cd ..

echo -e "${GREEN}Instalación completada.${NC}"
echo -e "${YELLOW}Ahora puedes ejecutar: ./start-app-prod-no-docker-frontend.sh${NC}"
