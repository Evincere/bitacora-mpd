#!/bin/bash

echo "Iniciando backend en modo desarrollo..."

# Verificar si existe el archivo JAR
if [ ! -f "target/bitacora-backend-0.0.1-SNAPSHOT.jar" ]; then
    echo "No se encontró el archivo JAR. Compilando el proyecto..."
    mvn clean package -DskipTests
fi

# Iniciar la aplicación con Spring Boot
echo "Iniciando aplicación Spring Boot en el puerto 8080..."
java -jar target/bitacora-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev,flyway

# Alternativamente, se puede usar Maven para iniciar la aplicación
# mvn spring-boot:run -Dspring-boot.run.profiles=dev,flyway
