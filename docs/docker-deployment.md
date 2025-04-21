# Despliegue con Docker - Bitácora MPD

## Introducción

Este documento describe la configuración de Docker para el despliegue de la aplicación Bitácora MPD. Incluye instrucciones detalladas sobre cómo configurar y ejecutar la aplicación utilizando Docker Compose.

## Requisitos Previos

- Docker 24.0.0 o superior
- Docker Compose v2.0.0 o superior
- Al menos 4GB de RAM disponible para Docker
- Al menos 10GB de espacio en disco

## Estructura de Contenedores

La aplicación Bitácora MPD se compone de los siguientes contenedores:

1. **postgres**: Base de datos PostgreSQL
2. **backend**: Aplicación Spring Boot
3. **frontend**: Servidor Nginx con la aplicación React
4. **prometheus**: Servidor de métricas
5. **grafana**: Visualización de métricas
6. **zipkin**: Tracing distribuido

## Puertos Utilizados

| Servicio    | Puerto Interno | Puerto Externo (por defecto) |
|-------------|----------------|------------------------------|
| postgres    | 5432           | No expuesto                  |
| backend     | 8080           | No expuesto                  |
| frontend    | 80             | 8090                         |
| prometheus  | 9090           | 9090                         |
| grafana     | 3000           | 3000                         |
| zipkin      | 9411           | 9411                         |

## Volúmenes Persistentes

La configuración utiliza los siguientes volúmenes para persistencia de datos:

- **postgres-data**: Almacena los datos de PostgreSQL
- **prometheus-data**: Almacena las métricas históricas de Prometheus
- **grafana-data**: Almacena la configuración y dashboards de Grafana

## Configuración

### Variables de Entorno

La configuración se puede personalizar mediante variables de entorno:

| Variable                | Descripción                           | Valor por defecto                                    |
|-------------------------|---------------------------------------|------------------------------------------------------|
| DB_NAME                 | Nombre de la base de datos            | bitacoradb                                           |
| DB_USERNAME             | Usuario de la base de datos           | postgres                                             |
| DB_PASSWORD             | Contraseña de la base de datos        | postgres                                             |
| JWT_SECRET              | Clave secreta para JWT                | bitacoraSecretKey2023SecureApplicationWithLongSecretKey |
| JWT_EXPIRATION          | Tiempo de expiración de JWT (ms)      | 86400000 (24 horas)                                  |
| FRONTEND_PORT           | Puerto para el frontend               | 8090                                                 |
| PROMETHEUS_PORT         | Puerto para Prometheus                | 9090                                                 |
| GRAFANA_PORT            | Puerto para Grafana                   | 3000                                                 |
| ZIPKIN_PORT             | Puerto para Zipkin                    | 9411                                                 |
| GRAFANA_ADMIN_USER      | Usuario administrador de Grafana      | admin                                                |
| GRAFANA_ADMIN_PASSWORD  | Contraseña de administrador de Grafana| admin                                                |

Estas variables se pueden configurar en un archivo `.env` en el directorio raíz del proyecto o pasarse directamente al comando `docker-compose`.

### Archivo docker-compose.yml

El archivo `docker-compose.yml` define la configuración de los contenedores. A continuación se describen los aspectos más importantes:

#### PostgreSQL

```yaml
postgres:
  image: postgres:16-alpine
  container_name: bitacora-postgres
  restart: unless-stopped
  environment:
    POSTGRES_DB: ${DB_NAME:-bitacoradb}
    POSTGRES_USER: ${DB_USERNAME:-postgres}
    POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
  volumes:
    - postgres-data:/var/lib/postgresql/data
  networks:
    - bitacora-network
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres"]
    interval: 10s
    timeout: 5s
    retries: 5
```

#### Backend

```yaml
backend:
  image: eclipse-temurin:21-jre-alpine
  working_dir: /app
  volumes:
    - ./backend/target/bitacora-backend-0.0.1-SNAPSHOT.jar:/app/app.jar
  container_name: bitacora-backend
  restart: unless-stopped
  depends_on:
    postgres:
      condition: service_healthy
  environment:
    - SPRING_PROFILES_ACTIVE=prod
    - DB_HOST=postgres
    - DB_PORT=5432
    - DB_NAME=${DB_NAME:-bitacoradb}
    - DB_USERNAME=${DB_USERNAME:-postgres}
    - DB_PASSWORD=${DB_PASSWORD:-postgres}
    - JWT_SECRET=${JWT_SECRET:-bitacoraSecretKey2023SecureApplicationWithLongSecretKey}
    - JWT_EXPIRATION=${JWT_EXPIRATION:-86400000}
  command: ["java", "-jar", "app.jar"]
  networks:
    - bitacora-network
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/api/actuator/health"]
    interval: 30s
    timeout: 10s
    retries: 3
```

#### Frontend

```yaml
frontend:
  image: nginx:alpine
  volumes:
    - ./frontend/static-index.html:/usr/share/nginx/html/index.html
    - ./frontend/nginx.conf:/etc/nginx/conf.d/default.conf
  container_name: bitacora-frontend
  restart: unless-stopped
  depends_on:
    - backend
  ports:
    - "${FRONTEND_PORT:-8090}:80"
  networks:
    - bitacora-network
```

## Instrucciones de Despliegue

### Preparación

1. Compilar el backend:

```bash
cd backend
mvn clean package -DskipTests -Dcheckstyle.skip=true
cd ..
```

2. Verificar que el archivo JAR se ha generado correctamente:

```bash
ls -la backend/target/bitacora-backend-0.0.1-SNAPSHOT.jar
```

3. Asegurarse de que el archivo `frontend/static-index.html` existe (o compilar el frontend si es posible).

### Despliegue

1. Iniciar los contenedores:

```bash
docker-compose up -d
```

2. Verificar que todos los contenedores están en ejecución:

```bash
docker-compose ps
```

3. Acceder a la aplicación:

- Frontend: http://localhost:8090
- Grafana: http://localhost:3000 (usuario: admin, contraseña: admin)
- Prometheus: http://localhost:9090
- Zipkin: http://localhost:9411

### Detener la Aplicación

Para detener todos los contenedores:

```bash
docker-compose down
```

Para detener y eliminar los volúmenes (¡esto eliminará todos los datos!):

```bash
docker-compose down -v
```

## Solución de Problemas

### PostgreSQL no inicia correctamente

Si PostgreSQL no inicia correctamente, puede ser debido a problemas de permisos en el volumen. Intente:

```bash
docker-compose down -v
docker-compose up -d postgres
```

### El backend no se conecta a la base de datos

Verifique los logs del backend:

```bash
docker-compose logs backend
```

Asegúrese de que PostgreSQL está saludable:

```bash
docker-compose ps
```

### El frontend no es accesible

Si el puerto 8090 ya está en uso, puede cambiar el puerto en el archivo `.env`:

```
FRONTEND_PORT=8091
```

O directamente en el comando:

```bash
FRONTEND_PORT=8091 docker-compose up -d
```

## Consideraciones de Seguridad

La configuración actual es adecuada para entornos de desarrollo, pero para producción se recomienda:

1. Cambiar todas las contraseñas por defecto
2. Utilizar secretos de Docker para las credenciales
3. Configurar HTTPS para el frontend
4. Limitar el acceso a los puertos de Prometheus, Grafana y Zipkin
5. Implementar una red DMZ para el frontend

## Optimización de Rendimiento

Para mejorar el rendimiento, considere:

1. Ajustar la configuración de memoria de Java para el backend
2. Configurar el pool de conexiones de PostgreSQL
3. Implementar caché en el frontend con Nginx
4. Utilizar un balanceador de carga para el frontend en caso de múltiples instancias

## Referencias

- [Documentación oficial de Docker](https://docs.docker.com/)
- [Documentación oficial de Docker Compose](https://docs.docker.com/compose/)
- [Documentación oficial de PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación oficial de Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Documentación oficial de Nginx](https://nginx.org/en/docs/)
