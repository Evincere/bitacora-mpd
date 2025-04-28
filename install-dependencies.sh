#!/bin/bash

# Colores para mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Instalando dependencias para el proyecto Bitácora...${NC}"

# Verificar si se está ejecutando como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Este script debe ejecutarse como root (sudo).${NC}"
    echo -e "${YELLOW}Ejecuta: sudo ./install-dependencies.sh${NC}"
    exit 1
fi

# Actualizar repositorios
echo -e "${YELLOW}Actualizando repositorios...${NC}"
apt update

# Instalar Java
echo -e "${YELLOW}Instalando Java...${NC}"
apt install -y openjdk-17-jdk

# Verificar instalación de Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: No se pudo instalar Java.${NC}"
    exit 1
fi

java_version=$(java -version 2>&1 | head -n 1)
echo -e "${GREEN}Java instalado: $java_version${NC}"

# Instalar Maven
echo -e "${YELLOW}Instalando Maven...${NC}"
apt install -y maven

# Verificar instalación de Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Error: No se pudo instalar Maven.${NC}"
    exit 1
fi

mvn_version=$(mvn --version | head -n 1)
echo -e "${GREEN}Maven instalado: $mvn_version${NC}"

# Instalar Node.js y npm
echo -e "${YELLOW}Instalando Node.js y npm...${NC}"
apt install -y nodejs npm

# Verificar instalación de Node.js y npm
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: No se pudo instalar Node.js.${NC}"
    exit 1
fi

node_version=$(node --version)
npm_version=$(npm --version)
echo -e "${GREEN}Node.js instalado: $node_version${NC}"
echo -e "${GREEN}npm instalado: $npm_version${NC}"

# Instalar Docker si no está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Instalando Docker...${NC}"
    apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    apt update
    apt install -y docker-ce
    
    # Iniciar y habilitar Docker
    systemctl start docker
    systemctl enable docker
    
    # Verificar instalación de Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Error: No se pudo instalar Docker.${NC}"
        exit 1
    fi
    
    docker_version=$(docker --version)
    echo -e "${GREEN}Docker instalado: $docker_version${NC}"
else
    docker_version=$(docker --version)
    echo -e "${GREEN}Docker ya está instalado: $docker_version${NC}"
fi

# Instalar Docker Compose si no está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Instalando Docker Compose...${NC}"
    curl -L "https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Verificar instalación de Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Error: No se pudo instalar Docker Compose.${NC}"
        exit 1
    fi
    
    docker_compose_version=$(docker-compose --version)
    echo -e "${GREEN}Docker Compose instalado: $docker_compose_version${NC}"
else
    docker_compose_version=$(docker-compose --version)
    echo -e "${GREEN}Docker Compose ya está instalado: $docker_compose_version${NC}"
fi

echo -e "${GREEN}Todas las dependencias han sido instaladas correctamente.${NC}"
echo -e "${YELLOW}Ahora puedes ejecutar ./start-dev-linux.sh para iniciar el entorno de desarrollo.${NC}"
