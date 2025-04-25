# Backend de Bitácora

Este es el backend de la aplicación Bitácora, desarrollado con Java 21 y Spring Boot 3.x siguiendo una arquitectura hexagonal.

## Arquitectura Hexagonal

El proyecto sigue una arquitectura hexagonal (también conocida como "Ports and Adapters") que separa claramente las capas de la aplicación:

- **Dominio**: Contiene las entidades, reglas de negocio y puertos (interfaces)
- **Aplicación**: Contiene los casos de uso que orquestan las operaciones de dominio
- **Infraestructura**: Contiene los adaptadores que implementan los puertos y se conectan con el mundo exterior

## Requisitos previos

- Java 21 JDK instalado
- Maven 3.8+ instalado
- PostgreSQL 14+ (para producción)

## Configuración

### Perfiles de Spring

El proyecto utiliza perfiles de Spring para diferentes entornos:

- **dev**: Utiliza H2 como base de datos en memoria
- **prod**: Utiliza PostgreSQL como base de datos
- **flyway**: Habilita las migraciones de Flyway

### Base de datos

#### H2 (Desarrollo)

La aplicación está configurada para usar H2 (base de datos en memoria) para desarrollo. Esto permite ejecutar la aplicación sin necesidad de instalar PostgreSQL.

La configuración para H2 se encuentra en `application-dev.yml`:

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:bitacoradb
    username: sa
    password:
    driver-class-name: org.h2.Driver
  h2:
    console:
      enabled: true
      path: /h2-console
```

Puedes acceder a la consola H2 en: http://localhost:8081/h2-console

#### PostgreSQL (Producción)

Para producción, se utiliza PostgreSQL. La configuración se encuentra en `application-prod.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/bitacora
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
```

## Scripts de utilidad

El proyecto incluye varios scripts para facilitar el desarrollo:

- **run-dev.ps1**: Inicia la aplicación en modo desarrollo con H2
- **run-prod.ps1**: Inicia la aplicación en modo producción con PostgreSQL
- **clean-migrations.ps1**: Limpia los archivos de migración de Flyway
- **clean-db-postgres.ps1**: Limpia la base de datos PostgreSQL
- **init-project.ps1**: Inicializa el proyecto desde cero

### Compilación

Para compilar el proyecto:

```bash
mvn clean install
```

### Ejecución

#### Modo desarrollo (H2)

```bash
# Usando el script de PowerShell
.\run-dev.ps1

# O manualmente con Maven
mvn spring-boot:run -Dspring-boot.run.profiles=dev,flyway
```

#### Modo producción (PostgreSQL)

```bash
# Usando el script de PowerShell
.\run-prod.ps1

# O manualmente con Maven
mvn spring-boot:run -Dspring-boot.run.profiles=prod,flyway
```

El servidor se iniciará en `http://localhost:8081`.

## Estructura del proyecto

El proyecto sigue una arquitectura hexagonal (puertos y adaptadores):

```
src/main/java/com/bitacora/
├── application/         # Casos de uso
│   ├── activity/          # Casos de uso de actividades
│   ├── auth/              # Casos de uso de autenticación
│   ├── notification/      # Casos de uso de notificaciones
│   └── session/           # Casos de uso de sesiones
├── domain/              # Entidades y reglas de negocio
│   ├── event/             # Eventos de dominio
│   ├── exception/         # Excepciones de dominio
│   ├── model/             # Modelos de dominio
│   │   ├── activity/        # Modelos de actividades
│   │   ├── notification/    # Modelos de notificaciones
│   │   ├── session/         # Modelos de sesiones
│   │   ├── shared/          # Modelos compartidos
│   │   └── user/            # Modelos de usuarios
│   └── port/             # Puertos (interfaces)
│       ├── repository/      # Puertos de repositorios
│       └── service/         # Puertos de servicios
└── infrastructure/      # Adaptadores
    ├── config/           # Configuraciones
    ├── messaging/        # Adaptadores de mensajería
    │   ├── adapter/        # Adaptadores de notificaciones
    │   └── controller/     # Controladores WebSocket
    ├── persistence/      # Adaptadores de persistencia
    │   ├── adapter/        # Adaptadores de repositorios
    │   ├── entity/         # Entidades JPA
    │   ├── mapper/         # Mappers entre entidades y modelos
    │   └── repository/     # Repositorios JPA
    ├── rest/             # Adaptadores REST
    │   ├── controller/     # Controladores REST
    │   ├── dto/           # DTOs para la API REST
    │   └── mapper/         # Mappers entre DTOs y modelos
    └── security/         # Configuración de seguridad
```

## Migraciones de base de datos

El proyecto utiliza Flyway para gestionar las migraciones de base de datos. Los scripts de migración se encuentran en:

- `src/main/resources/db/migration/`: Scripts comunes para todos los entornos
- `src/main/resources/db/migration/dev/`: Scripts específicos para H2
- `src/main/resources/db/migration/prod/`: Scripts específicos para PostgreSQL

## API REST

La API REST está disponible en `/api` y proporciona los siguientes endpoints:

### Autenticación

- `POST /api/auth/login`: Iniciar sesión
- `POST /api/auth/refresh`: Refrescar token JWT
- `POST /api/auth/logout`: Cerrar sesión

### Actividades

- `GET /api/activities`: Obtener lista de actividades (paginada)
- `GET /api/activities/{id}`: Obtener una actividad por ID
- `POST /api/activities`: Crear una nueva actividad
- `PUT /api/activities/{id}`: Actualizar una actividad existente
- `DELETE /api/activities/{id}`: Eliminar una actividad
- `PUT /api/activities/{id}/status`: Actualizar el estado de una actividad

### Estadísticas y Resúmenes

- `GET /api/activities/stats/by-type`: Obtener estadísticas por tipo de actividad
- `GET /api/activities/stats/by-status`: Obtener estadísticas por estado de actividad
- `GET /api/activities/summaries`: Obtener resúmenes de actividades

### Notificaciones y Colaboración

- `POST /api/announcements/global`: Enviar anuncio global
- `POST /api/announcements/department`: Enviar anuncio a un departamento
- `POST /api/announcements/event`: Enviar anuncio de evento
- `POST /api/collaboration/view/{activityId}`: Registrar usuario viendo actividad
- `POST /api/collaboration/edit/{activityId}`: Registrar usuario editando actividad
- `POST /api/collaboration/comment/{activityId}`: Registrar comentario en actividad
- `DELETE /api/collaboration/{activityId}`: Eliminar usuario como visor/editor
- `GET /api/collaboration/viewers/{activityId}`: Obtener usuarios viendo actividad
- `GET /api/collaboration/editor/{activityId}`: Obtener usuario editando actividad

## WebSockets

La aplicación utiliza WebSockets para comunicación en tiempo real. Los endpoints de WebSocket son:

- `/ws`: Endpoint principal de WebSocket
- `/topic/notifications`: Topic para notificaciones generales
- `/topic/activities`: Topic para actualizaciones de actividades
- `/topic/collaboration`: Topic para colaboración en tiempo real

## Seguridad

La aplicación utiliza JWT (JSON Web Tokens) para la autenticación y autorización. Todos los endpoints, excepto los de autenticación, requieren un token válido.

### Usuarios predefinidos

La aplicación incluye tres usuarios predefinidos para pruebas:

1. **Usuario Administrador**:
   - **Usuario**: admin
   - **Contraseña**: Admin@123
   - **Rol**: ADMIN

2. **Usuario Común**:
   - **Usuario**: usuario
   - **Contraseña**: Usuario@123
   - **Rol**: USUARIO

3. **Usuario de Prueba**:
   - **Usuario**: testuser
   - **Contraseña**: test123
   - **Rol**: ADMIN

## Notas de desarrollo

- La aplicación sigue los principios SOLID y Clean Code
- Se utiliza Lombok para reducir el código boilerplate
- La validación de datos se realiza mediante Bean Validation
- Se implementa manejo de excepciones centralizado
- Se utiliza MapStruct para mapeo entre objetos
- Se implementa arquitectura hexagonal para separar las capas de la aplicación
- Se utiliza Spring Data JPA Specifications para filtros dinámicos
- Se implementa generación automática de tipos TypeScript desde OpenAPI

## Solución de problemas

### Problemas con Flyway

Si encuentra problemas con las migraciones de Flyway, puede limpiar la base de datos y reiniciar:

```bash
# Para H2
.\clean-migrations.ps1

# Para PostgreSQL
.\clean-db-postgres.ps1
```

### Problemas con el puerto

Si el puerto 8081 está en uso, puede cambiarlo en `application-dev.yml` o `application-prod.yml`:

```yaml
server:
  port: 8082  # Cambie a un puerto disponible
```

## Licencia

Propiedad del Ministerio Público de la Defensa. Todos los derechos reservados.
