#!/bin/bash

echo "Iniciando entorno de desarrollo..."

# Compilar el backend
echo "Compilando el backend..."
cd backend

# Generar especificación OpenAPI
echo "Generando especificación OpenAPI..."
./generate-openapi.sh

# Compilar el proyecto
mvn clean package -DskipTests
cd ..

# Iniciar servicios de infraestructura con Docker
echo "Iniciando servicios de infraestructura (PostgreSQL, Zipkin, etc.)..."
docker-compose up -d postgres zipkin prometheus grafana

# Esperar a que PostgreSQL esté listo
echo "Esperando a que PostgreSQL esté listo..."
sleep 10

# Iniciar backend en una nueva terminal
echo "Iniciando backend..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'/backend\" && ./run-dev.sh"'
else
    # Linux
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd \"$(pwd)/backend\" && ./run-dev.sh; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd \"$(pwd)/backend\" && ./run-dev.sh" &
    elif command -v konsole &> /dev/null; then
        konsole --new-tab -e "cd \"$(pwd)/backend\" && ./run-dev.sh" &
    else
        echo "No se pudo encontrar un emulador de terminal compatible. Iniciando backend en segundo plano."
        cd backend && ./run-dev.sh &
        cd ..
    fi
fi

# Esperar a que el backend esté listo
echo "Esperando a que el backend esté listo..."
sleep 15

# Iniciar frontend en una nueva terminal
echo "Iniciando frontend..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'/frontend\" && ./run-dev.sh"'
else
    # Linux
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd \"$(pwd)/frontend\" && ./run-dev.sh; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd \"$(pwd)/frontend\" && ./run-dev.sh" &
    elif command -v konsole &> /dev/null; then
        konsole --new-tab -e "cd \"$(pwd)/frontend\" && ./run-dev.sh" &
    else
        echo "No se pudo encontrar un emulador de terminal compatible. Iniciando frontend en segundo plano."
        cd frontend && ./run-dev.sh &
        cd ..
    fi
fi

echo "Entorno de desarrollo iniciado correctamente."
echo "Backend: http://localhost:8080/api"
echo "Frontend: http://localhost:3000"
echo "H2 Console: http://localhost:8080/api/h2-console"
echo "Swagger UI: http://localhost:8080/api/swagger-ui/index.html"
echo "Prometheus: http://localhost:9090"
echo "Grafana: http://localhost:3000"
echo "Zipkin: http://localhost:9411"
