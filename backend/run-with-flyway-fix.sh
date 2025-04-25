#!/bin/bash

echo "Iniciando la aplicación con la solución para la dependencia circular Flyway-JPA..."
echo

echo "Limpiando el proyecto..."
mvn clean -DskipTests
echo

echo "Compilando el proyecto..."
mvn package -DskipTests
echo

echo "Ejecutando la aplicación con los perfiles dev y flyway..."
mvn spring-boot:run -Dspring-boot.run.profiles=dev,flyway
echo

echo "Aplicación finalizada."
