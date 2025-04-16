@echo off
echo Verificando la configuración del entorno...
echo.
echo Versión de Java:
java -version
echo.
echo Versión de Maven:
mvn -v
echo.
echo Verificando la configuración de Spring Boot...
echo Archivos de configuración:
dir /b src\main\resources\application.*
