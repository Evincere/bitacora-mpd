# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine as builder
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN ./mvnw package -DskipTests -Dcheckstyle.skip=true

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Instalar herramientas básicas
RUN apk add --no-cache curl

# Crear usuario no root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copiar el jar desde el stage de build
COPY --from=builder /app/target/*.jar app.jar

# Variables de entorno por defecto
ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:${SERVER_PORT}/api/actuator/health || exit 1

EXPOSE ${SERVER_PORT}
ENTRYPOINT ["java", \
            "-XX:+UseContainerSupport", \
            "-XX:MaxRAMPercentage=75.0", \
            "-jar", \
            "app.jar"]
