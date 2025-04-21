@echo off
echo Deteniendo entorno de desarrollo...

REM Detener servicios de infraestructura con Docker
echo Deteniendo servicios de infraestructura...
docker-compose stop postgres zipkin prometheus grafana

REM Detener procesos de backend y frontend
echo Deteniendo procesos de backend y frontend...
taskkill /FI "WINDOWTITLE eq Backend*" /F
taskkill /FI "WINDOWTITLE eq Frontend*" /F

echo Entorno de desarrollo detenido correctamente.
