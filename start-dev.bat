@echo off
echo Iniciando entorno de desarrollo...

REM Compilar el backend
echo Compilando el backend...
cd backend

REM Generar especificación OpenAPI
echo Generando especificación OpenAPI...
call generate-openapi.bat

REM Compilar el proyecto
call mvn clean package -DskipTests
cd ..

REM Iniciar servicios de infraestructura con Docker
echo Iniciando servicios de infraestructura (PostgreSQL, Zipkin, etc.)...
docker-compose up -d postgres zipkin prometheus grafana

REM Esperar a que PostgreSQL esté listo
echo Esperando a que PostgreSQL esté listo...
timeout /t 10

REM Iniciar backend en una nueva ventana
echo Iniciando backend...
start "Backend" cmd /c "cd backend && run-dev.bat"

REM Esperar a que el backend esté listo
echo Esperando a que el backend esté listo...
timeout /t 15

REM Iniciar frontend en una nueva ventana
echo Iniciando frontend...
start "Frontend" cmd /c "cd frontend && run-dev.bat"

echo Entorno de desarrollo iniciado correctamente.
echo Backend: http://localhost:8080/api
echo Frontend: http://localhost:3000
echo H2 Console: http://localhost:8080/api/h2-console
echo Swagger UI: http://localhost:8080/api/swagger-ui/index.html
echo Prometheus: http://localhost:9090
echo Grafana: http://localhost:3000
echo Zipkin: http://localhost:9411
