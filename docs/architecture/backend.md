# Arquitectura del Backend - Bitácora MPD

## Visión General

El backend de Bitácora MPD está implementado siguiendo los principios de la Arquitectura Hexagonal (también conocida como Puertos y Adaptadores), utilizando Spring Boot como framework principal. Esta arquitectura permite separar claramente la lógica de negocio de los detalles técnicos, facilitando el mantenimiento, testing y evolución del sistema.

## Estructura de Paquetes

```
com.bitacora
├── application/            # Casos de uso de la aplicación
│   ├── activity/           # Casos de uso relacionados con actividades
│   └── user/               # Casos de uso relacionados con usuarios
├── domain/                 # Entidades y reglas de negocio
│   ├── event/              # Eventos de dominio
│   ├── exception/          # Excepciones de dominio
│   ├── model/              # Modelos de dominio
│   │   ├── activity/       # Modelos relacionados con actividades
│   │   ├── shared/         # Componentes compartidos (Value Objects, etc.)
│   │   └── user/           # Modelos relacionados con usuarios
│   └── port/               # Puertos (interfaces para repositorios y servicios)
└── infrastructure/         # Adaptadores para interactuar con el exterior
    ├── config/             # Configuraciones de Spring
    │   ├── cache/          # Configuración de caché
    │   ├── security/       # Configuración de seguridad
    │   └── swagger/        # Configuración de OpenAPI/Swagger
    ├── persistence/        # Implementaciones de repositorios
    │   ├── entity/         # Entidades JPA
    │   ├── mapper/         # Mappers entre entidades JPA y de dominio
    │   └── repository/     # Implementaciones de repositorios
    └── rest/               # Controladores REST
        ├── advice/         # Manejadores de excepciones
        ├── dto/            # Objetos de transferencia de datos
        ├── mapper/         # Mappers entre DTOs y entidades de dominio
        └── controller/     # Controladores REST
```

## Capas de la Arquitectura

### 1. Capa de Dominio

La capa de dominio es el núcleo de la aplicación y contiene:

- **Entidades**: Objetos que tienen identidad y ciclo de vida (Activity, User, etc.)
- **Value Objects**: Objetos inmutables que representan conceptos del dominio (Email, PersonName, etc.)
- **Puertos**: Interfaces que definen cómo la capa de dominio interactúa con el exterior
- **Eventos de Dominio**: Notificaciones sobre cambios importantes en el dominio
- **Excepciones de Dominio**: Errores específicos del dominio

Características clave:
- No tiene dependencias externas
- Contiene toda la lógica de negocio
- Es independiente de frameworks y tecnologías

### 2. Capa de Aplicación

La capa de aplicación orquesta el flujo de datos entre el exterior y el dominio:

- **Servicios de Aplicación**: Implementan los casos de uso
- **DTOs**: Objetos para transferencia de datos entre capas
- **Mappers**: Conversión entre DTOs y objetos de dominio

Características clave:
- Depende de la capa de dominio
- No contiene lógica de negocio
- Coordina las operaciones del dominio

### 3. Capa de Infraestructura

La capa de infraestructura proporciona implementaciones concretas para los puertos definidos en el dominio:

- **Adaptadores de Persistencia**: Implementaciones de repositorios con JPA
- **Adaptadores de API REST**: Controladores Spring MVC
- **Configuraciones**: Configuración de Spring Boot, seguridad, caché, etc.

Características clave:
- Depende de la capa de dominio y aplicación
- Contiene detalles técnicos y dependencias externas
- Es reemplazable sin afectar al dominio

## Flujo de Control

1. Las solicitudes HTTP llegan a los controladores REST en la capa de infraestructura
2. Los controladores convierten los datos de la solicitud en DTOs
3. Los DTOs se pasan a los servicios de aplicación
4. Los servicios de aplicación convierten los DTOs en objetos de dominio
5. Los servicios de aplicación utilizan los objetos de dominio para ejecutar la lógica de negocio
6. Los resultados se convierten de nuevo en DTOs y se devuelven al cliente

## Patrones de Diseño Utilizados

- **Repository**: Para abstraer el acceso a datos
- **Factory**: Para crear objetos complejos
- **Adapter**: Para conectar componentes incompatibles
- **DTO (Data Transfer Object)**: Para transferir datos entre capas
- **Dependency Injection**: Para gestionar dependencias
- **Command/Query Responsibility Segregation (CQRS)**: Separación de operaciones de lectura y escritura

## Tecnologías Principales

- **Spring Boot**: Framework principal
- **Spring Data JPA**: Para acceso a datos
- **Spring Security**: Para autenticación y autorización
- **Flyway**: Para migraciones de base de datos
- **Caffeine**: Para caché en memoria
- **SpringDoc OpenAPI**: Para documentación de API

## Gestión de Transacciones

Las transacciones se gestionan a nivel de servicio de aplicación utilizando las anotaciones de Spring:

```java
@Transactional
public ActivityDTO createActivity(ActivityCreateDTO dto) {
    // Lógica para crear una actividad
}
```

## Manejo de Errores

El manejo de errores sigue un enfoque centralizado:

1. Las excepciones de dominio se lanzan desde la capa de dominio
2. Los servicios de aplicación pueden capturar y transformar estas excepciones
3. Un manejador global de excepciones (@ControllerAdvice) captura todas las excepciones no manejadas
4. Las excepciones se convierten en respuestas HTTP apropiadas

## Seguridad

La seguridad se implementa utilizando Spring Security y JWT:

1. Autenticación basada en tokens JWT
2. Autorización basada en roles y permisos
3. Filtros de seguridad para validar tokens
4. Encriptación de contraseñas con BCrypt

## Caché

La caché se implementa utilizando Caffeine y las anotaciones de Spring:

```java
@Cacheable(value = "activities", key = "#id")
public ActivityDTO getActivityById(Long id) {
    // Lógica para obtener una actividad
}
```

## Observabilidad

La observabilidad se implementa utilizando Spring Boot Actuator, Micrometer y Zipkin:

1. Métricas de rendimiento y salud
2. Tracing distribuido
3. Logs estructurados

## Consideraciones de Rendimiento

- Uso de caché para reducir accesos a base de datos
- Paginación para consultas que devuelven muchos resultados
- Índices en la base de datos para consultas frecuentes
- Lazy loading para relaciones JPA cuando es apropiado

## Pruebas

La arquitectura hexagonal facilita las pruebas:

- **Pruebas Unitarias**: Para la lógica de dominio, utilizando mocks para los puertos
- **Pruebas de Integración**: Para verificar la interacción entre componentes
- **Pruebas de API**: Para verificar el comportamiento de los endpoints REST

## Evolución y Mantenimiento

La arquitectura hexagonal facilita la evolución del sistema:

- Cambios en la infraestructura (por ejemplo, cambiar de JPA a MongoDB) no afectan al dominio
- Nuevos casos de uso pueden añadirse sin modificar el código existente
- Las pruebas unitarias garantizan que los cambios no rompen la funcionalidad existente
