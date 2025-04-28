#!/bin/bash

# Colores para mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para verificar dependencias
check_dependencies() {
    echo -e "${BLUE}Verificando dependencias...${NC}"

    # Verificar Java
    if ! command -v java &> /dev/null; then
        echo -e "${RED}Error: Java no está instalado.${NC}"
        echo -e "${YELLOW}Instala Java con: sudo apt install openjdk-17-jdk${NC}"
        exit 1
    fi

    # Verificar versión de Java
    java_version=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$java_version" -lt 17 ]; then
        echo -e "${RED}Error: La versión de Java es demasiado antigua (Java $java_version).${NC}"
        echo -e "${YELLOW}El proyecto requiere Java 17 o superior.${NC}"
        echo -e "${YELLOW}Instala Java 17 con: sudo apt install openjdk-17-jdk${NC}"
        exit 1
    fi

    # Verificar Maven
    if ! command -v mvn &> /dev/null; then
        echo -e "${RED}Error: Maven no está instalado.${NC}"
        echo -e "${YELLOW}Instala Maven con: sudo apt install maven${NC}"
        exit 1
    fi

    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js no está instalado.${NC}"
        echo -e "${YELLOW}Instala Node.js con: sudo apt install nodejs npm${NC}"
        exit 1
    fi

    # Verificar npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}Error: npm no está instalado.${NC}"
        echo -e "${YELLOW}Instala npm con: sudo apt install npm${NC}"
        exit 1
    fi

    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Error: Docker no está instalado.${NC}"
        echo -e "${YELLOW}Instala Docker siguiendo las instrucciones en: https://docs.docker.com/engine/install/${NC}"
        exit 1
    fi

    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Error: Docker Compose no está instalado.${NC}"
        echo -e "${YELLOW}Instala Docker Compose siguiendo las instrucciones en: https://docs.docker.com/compose/install/${NC}"
        exit 1
    fi

    echo -e "${GREEN}Todas las dependencias están instaladas.${NC}"
}

# Función para verificar la estructura de directorios
check_directories() {
    echo -e "${BLUE}Verificando estructura de directorios...${NC}"

    # Verificar directorio backend
    if [ ! -d "backend" ]; then
        echo -e "${RED}Error: No se encontró el directorio 'backend'.${NC}"
        echo -e "${YELLOW}Asegúrate de estar en el directorio raíz del proyecto.${NC}"
        exit 1
    fi

    # Verificar directorio frontend
    if [ ! -d "frontend" ]; then
        echo -e "${RED}Error: No se encontró el directorio 'frontend'.${NC}"
        echo -e "${YELLOW}Asegúrate de estar en el directorio raíz del proyecto.${NC}"
        exit 1
    fi

    echo -e "${GREEN}Estructura de directorios correcta.${NC}"
}

# Función para iniciar el backend
start_backend() {
    echo -e "${BLUE}Iniciando backend...${NC}"

    cd backend

    # Compilar el proyecto
    echo -e "${YELLOW}Compilando el proyecto...${NC}"
    mvn clean package -DskipTests

    # Verificar si la compilación fue exitosa
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: No se pudo compilar el proyecto.${NC}"
        exit 1
    fi

    # Iniciar la aplicación
    echo -e "${GREEN}Iniciando aplicación Spring Boot en el puerto 8080...${NC}"
    java -jar target/bitacora-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev,flyway &

    # Guardar el PID del proceso
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid

    cd ..

    echo -e "${GREEN}Backend iniciado con PID: $BACKEND_PID${NC}"
}

# Función para iniciar el frontend
start_frontend() {
    echo -e "${BLUE}Iniciando frontend...${NC}"

    cd frontend

    # Instalar dependencias
    echo -e "${YELLOW}Instalando dependencias...${NC}"
    npm install

    # Iniciar el servidor de desarrollo
    echo -e "${GREEN}Iniciando servidor de desarrollo en el puerto 3000...${NC}"
    npm run dev &

    # Guardar el PID del proceso
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid

    cd ..

    echo -e "${GREEN}Frontend iniciado con PID: $FRONTEND_PID${NC}"
}

# Función para iniciar servicios de infraestructura
start_infrastructure() {
    echo -e "${BLUE}Iniciando servicios de infraestructura...${NC}"

    # Iniciar servicios con Docker Compose
    docker-compose up -d postgres zipkin prometheus grafana

    echo -e "${GREEN}Servicios de infraestructura iniciados.${NC}"
}

# Función para mostrar información
show_info() {
    echo -e "\n${GREEN}Entorno de desarrollo iniciado correctamente.${NC}"
    echo -e "${BLUE}Backend:${NC} http://localhost:8080/api"
    echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
    echo -e "${BLUE}H2 Console:${NC} http://localhost:8080/api/h2-console"
    echo -e "${BLUE}Swagger UI:${NC} http://localhost:8080/api/swagger-ui/index.html"
    echo -e "${BLUE}Prometheus:${NC} http://localhost:9090"
    echo -e "${BLUE}Grafana:${NC} http://localhost:3000"
    echo -e "${BLUE}Zipkin:${NC} http://localhost:9411"

    echo -e "\n${YELLOW}Para detener el entorno, ejecuta: ./stop-dev-linux.sh${NC}"
}

# Función principal
main() {
    echo -e "${GREEN}Iniciando entorno de desarrollo...${NC}"

    # Verificar dependencias y directorios
    check_dependencies
    check_directories

    # Iniciar servicios
    start_infrastructure

    # Esperar a que los servicios estén listos
    echo -e "${YELLOW}Esperando a que los servicios estén listos...${NC}"
    sleep 10

    # Iniciar backend y frontend
    start_backend

    # Esperar a que el backend esté listo
    echo -e "${YELLOW}Esperando a que el backend esté listo...${NC}"
    sleep 15

    start_frontend

    # Mostrar información
    show_info
}

# Ejecutar función principal
main
