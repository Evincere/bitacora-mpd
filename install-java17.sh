#!/bin/bash

# Colores para mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Instalando Java 17...${NC}"

# Verificar si se está ejecutando como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Este script debe ejecutarse como root (sudo).${NC}"
    echo -e "${YELLOW}Ejecuta: sudo ./install-java17.sh${NC}"
    exit 1
fi

# Detectar la distribución de Linux
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VERSION=$VERSION_ID
else
    echo -e "${RED}No se pudo detectar la distribución de Linux.${NC}"
    exit 1
fi

echo -e "${YELLOW}Distribución detectada: $OS $VERSION${NC}"

# Instalar Java 17 según la distribución
case $OS in
    ubuntu|debian)
        echo -e "${YELLOW}Instalando Java 17 en Ubuntu/Debian...${NC}"
        apt update
        apt install -y software-properties-common
        
        if [ "$OS" = "ubuntu" ]; then
            add-apt-repository -y ppa:openjdk-r/ppa
        fi
        
        apt update
        apt install -y openjdk-17-jdk
        ;;
    centos|rhel|fedora)
        echo -e "${YELLOW}Instalando Java 17 en CentOS/RHEL/Fedora...${NC}"
        if [ "$OS" = "fedora" ]; then
            dnf install -y java-17-openjdk-devel
        else
            yum install -y java-17-openjdk-devel
        fi
        ;;
    alpine)
        echo -e "${YELLOW}Instalando Java 17 en Alpine...${NC}"
        apk add --no-cache openjdk17
        ;;
    *)
        echo -e "${RED}Distribución no soportada: $OS${NC}"
        echo -e "${YELLOW}Intenta instalar Java 17 manualmente.${NC}"
        exit 1
        ;;
esac

# Verificar instalación de Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: No se pudo instalar Java.${NC}"
    exit 1
fi

# Verificar versión de Java
java_version=$(java -version 2>&1 | head -n 1)
echo -e "${GREEN}Java instalado: $java_version${NC}"

java_major_version=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$java_major_version" -lt 17 ]; then
    echo -e "${RED}Error: La versión de Java es demasiado antigua (Java $java_major_version).${NC}"
    echo -e "${YELLOW}El proyecto requiere Java 17 o superior.${NC}"
    exit 1
fi

echo -e "${GREEN}Java 17 instalado correctamente.${NC}"

# Configurar Java 17 como predeterminado
if command -v update-alternatives &> /dev/null; then
    echo -e "${YELLOW}Configurando Java 17 como predeterminado...${NC}"
    update-alternatives --set java $(update-alternatives --list java | grep "java-17" | head -n 1)
    echo -e "${GREEN}Java 17 configurado como predeterminado.${NC}"
fi

# Mostrar información de Java
echo -e "${YELLOW}Información de Java:${NC}"
java -version
