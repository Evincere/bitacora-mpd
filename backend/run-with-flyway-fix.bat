@echo off
echo Iniciando la aplicación con la solución para la dependencia circular Flyway-JPA...
echo.

echo Limpiando el proyecto...
call mvn clean -DskipTests
echo.

echo Compilando el proyecto...
call mvn package -DskipTests
echo.

echo Ejecutando la aplicación con los perfiles dev y flyway...
call mvn spring-boot:run -Dspring-boot.run.profiles=dev,flyway
echo.

echo Aplicación finalizada.
