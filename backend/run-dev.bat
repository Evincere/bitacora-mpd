@echo off
echo Iniciando backend en modo desarrollo...
set SPRING_PROFILES_ACTIVE=dev
java -jar -Dspring.profiles.active=dev target\bitacora-backend-0.0.1-SNAPSHOT.jar
