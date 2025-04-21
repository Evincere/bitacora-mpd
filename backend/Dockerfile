FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Crear un usuario no root para ejecutar la aplicación
RUN addgroup -S spring && adduser -S spring -G spring

# Copiar el JAR construido
COPY target/*.jar app.jar

# Establecer permisos
RUN chown -R spring:spring /app
USER spring:spring

# Variables de entorno
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xms512m -Xmx1024m"

# Puerto de la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
