# Backend de Bitácora

Este es el backend de la aplicación Bitácora, desarrollado con Java 21 y Spring Boot.

## Requisitos previos

- Java 21 JDK instalado
- Maven 3.8+ instalado

## Configuración

### Base de datos

La aplicación está configurada para usar H2 (base de datos en memoria) para desarrollo. Esto permite ejecutar la aplicación sin necesidad de instalar PostgreSQL.

Para desarrollo local, la configuración actual es:

```properties
spring.datasource.url=jdbc:h2:mem:bitacoradb
spring.datasource.username=sa
spring.datasource.password=
spring.datasource.driver-class-name=org.h2.Driver
```

Puedes acceder a la consola H2 en: http://localhost:8080/api/h2-console

Para producción, se recomienda cambiar a PostgreSQL modificando la configuración en `src/main/resources/application.properties`.

### Compilación

Para compilar el proyecto:

```bash
mvn clean install
```

### Ejecución

Para ejecutar la aplicación:

```bash
mvn spring-boot:run
```

El servidor se iniciará en `http://localhost:8080/api`.

## Estructura del proyecto

El proyecto sigue una arquitectura hexagonal (puertos y adaptadores):

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── bitacora/
│   │   │           ├── application/    # Casos de uso
│   │   │           ├── domain/         # Entidades y reglas de negocio
│   │   │           │   ├── model/      # Modelos de dominio
│   │   │           │   └── port/       # Puertos (interfaces)
│   │   │           ├── infrastructure/ # Adaptadores (implementaciones)
│   │   │           │   ├── config/     # Configuración
│   │   │           │   ├── persistence/# Persistencia
│   │   │           │   ├── rest/       # Controladores REST
│   │   │           │   └── security/   # Seguridad
│   │   │           └── BitacoraApplication.java
│   │   └── resources/
│   │       └── application.properties  # Configuración
│   └── test/                           # Pruebas
└── pom.xml                             # Configuración de Maven
```

## API REST

La API REST está disponible en `/api` y proporciona los siguientes endpoints:

### Autenticación

- `POST /api/auth/login`: Iniciar sesión
- `POST /api/auth/register`: Registrar nuevo usuario
- `POST /api/auth/refresh`: Refrescar token

### Actividades

- `GET /api/activities`: Obtener lista de actividades (paginada)
- `GET /api/activities/{id}`: Obtener una actividad por ID
- `POST /api/activities`: Crear una nueva actividad
- `PUT /api/activities/{id}`: Actualizar una actividad existente
- `DELETE /api/activities/{id}`: Eliminar una actividad

### Usuarios

- `GET /api/users`: Obtener lista de usuarios (paginada)
- `GET /api/users/{id}`: Obtener un usuario por ID
- `PUT /api/users/{id}`: Actualizar un usuario existente
- `DELETE /api/users/{id}`: Eliminar un usuario

## Seguridad

La aplicación utiliza JWT (JSON Web Tokens) para la autenticación y autorización. Todos los endpoints, excepto los de autenticación, requieren un token válido.

## Notas de desarrollo

- La aplicación sigue los principios SOLID y Clean Code
- Se utiliza Lombok para reducir el código boilerplate
- La validación de datos se realiza mediante Bean Validation
- Se implementa manejo de excepciones centralizado
