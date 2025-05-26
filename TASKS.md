# Plan de Implementación - Proyecto Bitácora

## Tareas Completadas Recientemente

### Mejora del Sistema de Autenticación y Seguridad
- [x] Unificación de controladores de autenticación
  - [x] Consolidar `AuthController.java` y `RootAuthController.java` en un único controlador
  - [x] Actualizar las configuraciones de seguridad correspondientes
  - [x] Asegurar que todas las rutas de autenticación funcionen correctamente
- [x] Mejora del manejo de tokens
  - [x] Implementar un servicio de tokens mejorado (`tokenService.ts`)
  - [x] Implementar un manejo más seguro de tokens en el frontend
  - [x] Implementar decodificación y validación de tokens JWT en el cliente
- [x] Mejora de la gestión de errores
  - [x] Implementar un servicio centralizado de manejo de errores (`errorHandlingService.ts`)
  - [x] Mejorar los mensajes de error para el usuario
  - [x] Implementar manejo consistente de errores en el flujo de autenticación
- [x] Implementación de cliente HTTP con interceptores
  - [x] Crear cliente HTTP con manejo automático de tokens y errores (`apiClient.ts`)
  - [x] Implementar renovación automática de tokens
  - [x] Actualizar servicios para utilizar el nuevo cliente HTTP
- [x] Aplicación de patrones de diseño
  - [x] Implementar patrón Strategy para diferentes mecanismos de autenticación
  - [x] Implementar patrón Factory para la creación de tokens
  - [x] Implementar patrón Chain of Responsibility para filtros de seguridad
  - [x] Corrección de errores en el sistema de autenticación

### Implementación de funcionalidad para editar y reenviar solicitudes rechazadas
- [x] Implementación de funcionalidad para editar y reenviar solicitudes rechazadas
  - [x] Creada ruta `/app/solicitudes/editar/:id` para editar solicitudes rechazadas
  - [x] Modificado el componente `SolicitudForm` para soportar la edición de solicitudes existentes
  - [x] Añadida funcionalidad para cargar los datos de la solicitud rechazada en el formulario
  - [x] Implementada visualización de archivos adjuntos existentes y capacidad para añadir nuevos
  - [x] Añadido botón "Guardar y reenviar" para actualizar y reenviar la solicitud en un solo paso
  - [x] Añadido botón "Guardar cambios" para actualizar la solicitud sin reenviarla
  - [x] Añadido botón de edición en la vista de seguimiento de solicitudes rechazadas
  - [x] Añadido botón de edición en la lista de solicitudes para solicitudes rechazadas
  - [x] Actualizado el hook `useSolicitudes` para soportar la actualización y reenvío de solicitudes
  - [x] Actualizado el servicio `solicitudesService` para incluir métodos de actualización
  - [x] Mejorada la experiencia de usuario con mensajes claros sobre el motivo del rechazo
  - [x] Implementada validación para asegurar que solo se puedan editar solicitudes en estado REJECTED

### Corrección de errores en la interfaz de usuario y funcionalidad
- [x] Corregido error 500 al rechazar solicitudes de tareas como usuario asignador
  - [x] Corregido el error "La columna NEW_STATUS no permite valores nulos (NULL)" al rechazar solicitudes
  - [x] Actualizado el método `mapStatusToEntity` en `TaskRequestHistoryMapper` para incluir el estado `REJECTED`
  - [x] Mejorado el método `recordStatusChange` en `TaskRequestHistoryService` para validar que `newStatus` no sea nulo
  - [x] Creada nueva migración `V25__Fix_Rejected_Status_In_Task_Requests.sql` para corregir inconsistencias en la base de datos
  - [x] Corregido el problema de desajuste entre los estados esperados y reales en las solicitudes rechazadas
  - [x] Mejorado el servicio `TaskRequestWorkflowService.reject` para validar el estado de la solicitud antes de intentar rechazarla
  - [x] Mejorado el componente `RechazarSolicitudModal` para mostrar alertas cuando la solicitud no está en estado SUBMITTED
  - [x] Corregido error de importación en `RechazarSolicitudModal.tsx` utilizando `ErrorAlert` en lugar de `Alert`
  - [x] Implementada validación previa en el frontend para verificar el estado de la solicitud antes de enviar la petición
  - [x] Mejorado el servicio `asignacionService.rejectTaskRequest` para asegurar que los datos enviados coincidan con lo que espera el backend
  - [x] Implementado manejo de errores más detallado en `useAsignacion` para proporcionar mensajes específicos según el tipo de error
  - [x] Añadida actualización automática de datos después de un error para asegurar que la interfaz muestra el estado actual
  - [x] Mejorada la invalidación de consultas para actualizar correctamente todos los datos relacionados

### Corrección de errores en la interfaz de usuario y visualización de datos
- [x] Corregido error en la visualización de fechas en las tarjetas de seguimiento
  - [x] Mejorada la función `formatDate` en `SeguimientoGeneral.tsx` para manejar correctamente fechas inválidas o nulas
  - [x] Implementada validación robusta para prevenir errores al formatear fechas
  - [x] Añadido manejo de errores con mensajes descriptivos cuando una fecha no es válida
  - [x] Mejorada la experiencia de usuario al mostrar mensajes claros cuando hay problemas con las fechas

### Corrección de errores en el sistema de comentarios y WebSockets
- [x] Corregido error al crear comentarios con archivos adjuntos (múltiples representaciones de la misma entidad)
  - [x] Modificado el flujo de creación de comentarios para evitar guardar la misma entidad dos veces
  - [x] Optimizado el servicio TaskRequestCommentService para usar una única operación de guardado
  - [x] Eliminada la operación redundante de guardar el comentario antes de añadirlo a la solicitud
  - [x] Mejorado el manejo de errores con mensajes más descriptivos
- [x] Corregido error en la configuración de WebSockets
  - [x] Añadido endpoint adicional `/api/ws` para compatibilidad con el context-path de la aplicación
  - [x] Mantenido el endpoint original `/ws` para compatibilidad con código existente
  - [x] Solucionado el error "No endpoint GET /api/ws/" que impedía la conexión de WebSockets
  - [x] Mejorada la configuración para soportar tanto acceso directo como a través del context-path

### Mejora de los mensajes de error en la interfaz de usuario
- [x] Creado componente ErrorAlert con estilo glassmorphism para mostrar errores de forma consistente
- [x] Implementado componente ErrorSolicitud especializado para errores al cargar solicitudes
- [x] Mejorada la experiencia visual con animaciones y efectos de transición
- [x] Añadida información contextual sobre posibles causas y soluciones
- [x] Implementado botón de reintento con animación al hacer hover
- [x] Mantenida la consistencia visual con el tema general de la aplicación

### Corrección de error 400 (Bad Request) al enviar comentarios con archivos adjuntos
- [x] Añadida configuración de Spring para multipart con límites adecuados de tamaño de archivos
- [x] Implementada validación de tamaño de archivos en el backend y frontend
- [x] Creado manejador de excepciones para errores de carga de archivos
- [x] Mejorados los mensajes de error para proporcionar información clara al usuario
- [x] Implementada validación previa en el frontend para evitar enviar archivos demasiado grandes
- [x] Limitado el número máximo de archivos adjuntos por comentario
- [x] Mejorada la experiencia de usuario con mensajes de error específicos

### Auditoría Completa y Consolidación de Duplicaciones ✅
- [x] **AUDITORÍA COMPLETA**: Identificación sistemática de duplicaciones en todo el proyecto frontend
  - [x] Análisis de tipos, interfaces y enums duplicados
  - [x] Identificación de componentes duplicados en múltiples ubicaciones
  - [x] Revisión de utilidades y servicios duplicados
  - [x] Documentación detallada en `DUPLICATIONS_AUDIT.md`
- [x] **CONSOLIDACIÓN DE TIPOS DUPLICADOS**:
  - [x] Eliminada definición duplicada de `Notification` en `core/types/models.ts`
  - [x] Eliminado archivo `utils/enumTranslations.js` (conflicto JavaScript/TypeScript)
  - [x] Corregido error de sintaxis con `ToastType` en exportaciones
- [x] **CONSOLIDACIÓN DE COMPONENTES DUPLICADOS**:
  - [x] `Loader`: Eliminadas 2 versiones duplicadas, mantenida versión en `shared/components/common/`
  - [x] `ConfirmDialog`: Eliminadas 2 versiones duplicadas, mantenida versión en `shared/components/common/`
  - [x] `NotFound`: Eliminadas 2 versiones duplicadas, mantenida versión en `shared/components/ui/`
- [x] **CONSOLIDACIÓN DE UTILIDADES DUPLICADAS**:
  - [x] `dateUtils`: Eliminada versión duplicada, consolidada en `core/utils/dateUtils.ts`
  - [x] Agregada función `formatDateForBackend` a la versión principal
  - [x] Actualizadas 15+ importaciones para usar rutas consistentes
- [x] **ELIMINACIÓN DE SISTEMAS DUPLICADOS**:
  - [x] Eliminados directorios obsoletos `Notification/` y `Notifications/`
  - [x] Mantenidos solo `RealTimeNotification/` y `Toast/` como sistemas unificados
- [x] **VERIFICACIÓN Y TESTING**:
  - [x] Verificado que el servidor de desarrollo funciona correctamente
  - [x] Confirmado que no hay errores de compilación TypeScript
  - [x] Validado que todas las importaciones usan rutas consistentes

## Fase 2: Refactorización y Aplicación de Patrones de Diseño

### Aplicación de Patrones de Diseño en el Backend
- [x] Implementar el Patrón Strategy para Autenticación
  - [x] Crear interfaz `AuthenticationStrategy` con método `authenticate`
  - [x] Implementar estrategias concretas: `JwtAuthenticationStrategy`, `RefreshTokenAuthenticationStrategy`
  - [x] Refactorizar `AuthService` para usar el patrón Strategy
- [x] Implementar el Patrón Factory para Creación de Tokens
  - [x] Crear interfaz `TokenFactory` con métodos para crear diferentes tipos de tokens
  - [x] Implementar `JwtTokenFactory` que encapsule la lógica de creación de tokens JWT
  - [x] Refactorizar `JwtTokenProvider` para usar la fábrica de tokens
- [x] Implementar el Patrón Chain of Responsibility para Filtros de Seguridad
  - [x] Crear clase base abstracta `SecurityFilterHandler` con método `handle`
  - [x] Implementar manejadores concretos: `JwtValidationHandler`, `BlacklistCheckHandler`, `PermissionsHandler`
  - [x] Refactorizar los filtros para usar la cadena de responsabilidad

### Aplicación de Patrones de Diseño en el Frontend
- [x] Implementar el Patrón Observer para Eventos de Autenticación
  - [x] Crear clase `AuthEventEmitter` que implemente el patrón Observer
  - [x] Definir eventos como `login`, `logout`, `tokenExpired`, `tokenRefreshed`
  - [x] Permitir que componentes se suscriban a estos eventos
  - [x] Refactorizar servicios para emitir eventos en momentos clave
- [ ] Implementar el Patrón Adapter para Servicios de Autenticación
  - [ ] Crear interfaz común `AuthServiceInterface`
  - [ ] Implementar adaptadores para los diferentes servicios de autenticación
  - [ ] Unificar la API de autenticación
  - [ ] Eliminar código duplicado entre servicios
- [ ] Implementar el Patrón Proxy para Interceptar Peticiones HTTP
  - [ ] Crear un proxy que intercepte todas las peticiones HTTP
  - [ ] Implementar lógica para añadir tokens, manejar errores y renovar tokens
  - [ ] Centralizar la lógica de manejo de peticiones HTTP

### Eliminación de Código Duplicado
- [ ] Unificar Servicios de Autenticación en el Frontend
  - [ ] Consolidar toda la lógica de autenticación en un único servicio
  - [ ] Eliminar archivos duplicados
  - [ ] Actualizar todas las referencias a los servicios antiguos
- [ ] Unificar Hooks de Autenticación
  - [ ] Consolidar toda la lógica en un único hook
  - [ ] Eliminar hooks duplicados
  - [ ] Actualizar todas las referencias a los hooks antiguos
- [ ] Unificar Manejo de Errores
  - [ ] Consolidar toda la lógica de manejo de errores en `errorHandlingService.ts`
  - [ ] Eliminar código duplicado en los diferentes servicios
  - [ ] Implementar un sistema consistente de manejo de errores

### Mejora de la Estructura de Carpetas y Nomenclatura
- [ ] Reorganizar Estructura de Carpetas en el Frontend
  - [ ] Mover todos los servicios de autenticación a `frontend/src/core/auth/`
  - [ ] Mover todos los hooks de autenticación a `frontend/src/core/auth/hooks/`
  - [ ] Mover todos los componentes de autenticación a `frontend/src/features/auth/components/`
  - [ ] Actualizar todas las importaciones
- [ ] Estandarizar Nomenclatura
  - [ ] Usar nombres consistentes para servicios, hooks y componentes
  - [ ] Seguir convenciones de nomenclatura para interfaces, tipos y clases
  - [ ] Documentar todas las funciones y clases con JSDoc/TSDoc

### Implementación de Pruebas Unitarias
- [ ] Pruebas para Servicios de Backend
  - [ ] Implementar pruebas unitarias para los servicios de autenticación
  - [ ] Implementar pruebas para la generación y validación de tokens
  - [ ] Implementar pruebas para los filtros de seguridad
- [ ] Pruebas para Servicios de Frontend
  - [ ] Implementar pruebas unitarias para los servicios de autenticación
  - [ ] Implementar pruebas para el manejo de tokens
  - [ ] Implementar pruebas para el manejo de errores

## Sprint 20: Implementación de Apache Kafka - Sistema de Notificaciones en Tiempo Real

### Descripción del Sprint
Este sprint se enfocará en la implementación inicial de Apache Kafka en el proyecto, comenzando con el sistema de notificaciones en tiempo real. Se establecerá la infraestructura básica de Kafka y se migrará el sistema actual de notificaciones a un modelo basado en eventos, mejorando la fiabilidad, escalabilidad y persistencia de las notificaciones.

### Objetivos
- Establecer la infraestructura básica de Apache Kafka
- Capacitar al equipo en los conceptos fundamentales de Kafka
- Migrar el sistema de notificaciones actual a un modelo basado en eventos
- Mejorar la fiabilidad y persistencia de las notificaciones
- Implementar un sistema de entrega garantizada de notificaciones

### 1. Capacitación y Preparación (3 días)

#### Historia de Usuario: Capacitación del Equipo
**Como** miembro del equipo de desarrollo
**Quiero** comprender los conceptos fundamentales de Apache Kafka
**Para** poder implementar y mantener eficazmente soluciones basadas en eventos

**Tareas:**
- [ ] Organizar taller de capacitación sobre conceptos básicos de Kafka (1 día)
  - [ ] Tópicos, particiones y grupos de consumidores
  - [ ] Productores y consumidores
  - [ ] Garantías de entrega y ordenamiento
  - [ ] Configuración y administración básica
- [ ] Crear documentación interna sobre mejores prácticas de Kafka (0.5 días)
  - [ ] Guía de diseño de tópicos
  - [ ] Estrategias de particionado
  - [ ] Patrones de consumo
  - [ ] Manejo de errores y recuperación
- [ ] Preparar entorno de desarrollo con Kafka (1.5 días)
  - [ ] Configurar Docker Compose para Kafka y ZooKeeper
  - [ ] Implementar scripts de inicialización para tópicos
  - [ ] Configurar herramientas de monitoreo básicas
  - [ ] Crear guía de inicio rápido para desarrolladores

**Criterios de Aceptación:**
- El equipo ha completado el taller de capacitación
- Existe documentación interna accesible sobre Kafka
- El entorno de desarrollo con Kafka está funcionando
- Los desarrolladores pueden crear y consumir mensajes de prueba

**Riesgos:**
- Curva de aprendizaje empinada para algunos miembros del equipo
- **Mitigación:** Proporcionar recursos adicionales y sesiones de seguimiento

### 2. Implementación de Infraestructura Kafka (4 días)

#### Historia de Usuario: Infraestructura Kafka
**Como** arquitecto del sistema
**Quiero** establecer una infraestructura robusta de Apache Kafka
**Para** soportar comunicación asíncrona confiable entre componentes del sistema

**Tareas:**
- [ ] Implementar configuración de Kafka en Spring Boot (1 día)
  - [ ] Añadir dependencias de Spring Kafka
  - [ ] Configurar propiedades de conexión
  - [ ] Implementar beans de configuración para productores y consumidores
  - [ ] Configurar serialización/deserialización de mensajes
- [ ] Diseñar e implementar estructura de tópicos (1 día)
  - [ ] Definir esquema de nombres para tópicos
  - [ ] Crear tópico `notifications` con particiones adecuadas
  - [ ] Configurar políticas de retención
  - [ ] Implementar script de creación de tópicos
- [ ] Implementar servicios base para Kafka (1 día)
  - [ ] Crear `KafkaProducerService` genérico
  - [ ] Implementar `KafkaConsumerService` con manejo de errores
  - [ ] Desarrollar mecanismos de retry para mensajes fallidos
  - [ ] Implementar monitoreo básico de productores y consumidores
- [ ] Configurar seguridad y monitoreo (1 día)
  - [ ] Implementar autenticación para conexiones Kafka
  - [ ] Configurar TLS para comunicaciones seguras
  - [ ] Integrar métricas de Kafka con Actuator
  - [ ] Implementar alertas para problemas de conexión

**Criterios de Aceptación:**
- La aplicación puede conectarse a Kafka y enviar/recibir mensajes
- Los tópicos están correctamente configurados con particiones adecuadas
- Existen mecanismos de retry y manejo de errores
- La comunicación con Kafka es segura
- Se pueden monitorear métricas básicas de Kafka

**Riesgos:**
- Problemas de configuración en diferentes entornos
- **Mitigación:** Documentar detalladamente la configuración y usar propiedades externalizadas

### 3. Migración del Sistema de Notificaciones (5 días)

#### Historia de Usuario: Notificaciones Basadas en Eventos
**Como** usuario del sistema
**Quiero** recibir notificaciones confiables y en tiempo real
**Para** estar informado sobre eventos importantes relacionados con mis tareas

**Tareas:**
- [ ] Adaptar el modelo de dominio para eventos (1 día)
  - [ ] Crear clases de eventos de dominio para notificaciones
  - [ ] Implementar serializadores/deserializadores para eventos
  - [ ] Actualizar el modelo de notificaciones para soportar persistencia
  - [ ] Implementar mappers entre eventos y entidades
- [ ] Implementar productores de eventos de notificación (1 día)
  - [ ] Crear `NotificationEventProducer` para publicar eventos
  - [ ] Integrar con servicios existentes que generan notificaciones
  - [ ] Implementar estrategia de particionado basada en destinatario
  - [ ] Añadir cabeceras para metadatos y trazabilidad
- [ ] Implementar consumidores de eventos de notificación (2 días)
  - [ ] Crear `NotificationEventConsumer` para procesar eventos
  - [ ] Implementar persistencia de notificaciones en base de datos
  - [ ] Desarrollar integración con WebSockets para entrega en tiempo real
  - [ ] Implementar mecanismo de confirmación de entrega
- [ ] Actualizar la interfaz de usuario (1 día)
  - [ ] Adaptar componentes de notificación para el nuevo modelo
  - [ ] Implementar indicadores de estado de entrega
  - [ ] Mejorar la experiencia de usuario con animaciones
  - [ ] Añadir soporte para notificaciones offline

**Criterios de Aceptación:**
- Las notificaciones se generan, persisten y entregan de manera confiable
- El sistema mantiene el estado de las notificaciones entre sesiones
- Las notificaciones se entregan en tiempo real cuando es posible
- Las notificaciones pendientes se entregan cuando el usuario se conecta
- La interfaz de usuario muestra claramente el estado de las notificaciones

**Riesgos:**
- Posible pérdida de mensajes durante la migración
- **Mitigación:** Implementar sistema dual durante la transición y validar entregas

**Dependencias:**
- Requiere que la infraestructura de Kafka esté operativa

### 4. Pruebas y Optimización (3 días)

#### Historia de Usuario: Sistema de Notificaciones Confiable
**Como** administrador del sistema
**Quiero** asegurarme de que el sistema de notificaciones sea confiable y eficiente
**Para** garantizar que los usuarios reciban información importante sin problemas

**Tareas:**
- [ ] Implementar pruebas automatizadas (1 día)
  - [ ] Crear pruebas unitarias para productores y consumidores
  - [ ] Implementar pruebas de integración con TestContainers
  - [ ] Desarrollar pruebas de carga para escenarios de alto volumen
  - [ ] Implementar pruebas de recuperación ante fallos
- [ ] Optimizar configuración de Kafka (1 día)
  - [ ] Ajustar parámetros de batch para productores
  - [ ] Optimizar configuración de consumidores
  - [ ] Implementar compresión de mensajes
  - [ ] Ajustar timeouts y reintentos
- [ ] Implementar monitoreo avanzado (1 día)
  - [ ] Crear dashboard de métricas de Kafka
  - [ ] Implementar alertas para problemas operativos
  - [ ] Desarrollar herramientas de diagnóstico
  - [ ] Documentar procedimientos de solución de problemas

**Criterios de Aceptación:**
- Las pruebas automatizadas verifican la confiabilidad del sistema
- El sistema puede manejar picos de carga sin degradación
- Existen métricas y alertas para monitorear el sistema
- La documentación de operaciones está completa

**Riesgos:**
- Rendimiento subóptimo en producción
- **Mitigación:** Realizar pruebas de carga realistas y ajustar configuración

## Sprint Completado: Dashboard de Métricas y Análisis ✅

### Descripción del Sprint
Este sprint se enfocó en la implementación completa de un sistema de dashboard con métricas y análisis para el proyecto Bitácora. Se desarrolló tanto el backend como el frontend necesario para visualizar métricas de rendimiento del sistema.

### Tareas Completadas ✅
- [x] **Análisis y Diseño**
  - [x] Análisis de requerimientos del dashboard
  - [x] Diseño de la arquitectura de métricas
  - [x] Definición de DTOs para métricas del dashboard

- [x] **Implementación del Backend**
  - [x] Implementación del servicio de métricas del dashboard (`DashboardMetricsService`)
  - [x] Creación de DTOs para métricas del dashboard (`TaskStatusMetricsDto`, `UserActivityMetricsDto`, `SystemPerformanceMetricsDto`)
  - [x] Implementación del controlador REST para dashboard (`DashboardController`)
  - [x] Configuración de endpoints de API para métricas
  - [x] Creación de vistas de base de datos para métricas (V26)
  - [x] Implementación de métricas de estado de tareas
  - [x] Implementación de métricas de actividad de usuarios
  - [x] Implementación de métricas de rendimiento del sistema

- [x] **Base de Datos y Migraciones**
  - [x] Creación de tabla `dashboard_metrics` para almacenar métricas (V27)
  - [x] Corrección de sintaxis H2 para índices (V27.1)
  - [x] Aplicación exitosa de 29 migraciones

- [x] **Configuración del Sistema**
  - [x] Configuración y inicio exitoso del backend en puerto 8080
  - [x] Configuración y inicio exitoso del frontend en puerto 3001
  - [x] Configuración de base de datos H2 en memoria
  - [x] Configuración de Flyway para migraciones automáticas

### Estado Final del Sistema 🚀
- **Backend**: ✅ Ejecutándose correctamente en puerto 8080
- **Frontend**: ✅ Ejecutándose correctamente en puerto 3001
- **Base de datos**: ✅ H2 en memoria configurada y funcionando
- **Migraciones**: ✅ 29 migraciones aplicadas exitosamente
- **API REST**: ✅ 126 endpoints mapeados correctamente
- **WebSockets**: ✅ Configurados y funcionando
- **Consola H2**: ✅ Disponible en `/h2-console`

### Endpoints Implementados
- `GET /api/dashboard/task-status-metrics` - Métricas de estado de tareas
- `GET /api/dashboard/user-activity-metrics` - Métricas de actividad de usuarios
- `GET /api/dashboard/system-performance-metrics` - Métricas de rendimiento del sistema

### Próximos Pasos Sugeridos
- [ ] Implementación del frontend del dashboard con visualizaciones
- [ ] Integración con librerías de gráficos (Chart.js, D3.js, etc.)
- [ ] Implementación de filtros temporales para métricas
- [ ] Optimización de consultas para grandes volúmenes de datos
- [ ] Implementación de caché para métricas frecuentemente consultadas

## Sprint 21: Implementación de Apache Kafka - Seguimiento de Cambios Basado en Eventos

### Descripción del Sprint
Este sprint se enfocará en implementar un sistema de seguimiento de cambios basado en eventos utilizando Apache Kafka. Se aplicará el patrón Event Sourcing para registrar todos los cambios de estado en solicitudes y tareas, permitiendo un historial completo y auditado, así como la capacidad de reconstruir el estado en cualquier punto del tiempo.

### Objetivos
- Implementar el patrón Event Sourcing para solicitudes y tareas
- Crear un historial inmutable de todos los cambios de estado
- Mejorar la capacidad de auditoría del sistema
- Implementar proyecciones para reconstruir estados
- Sentar las bases para funcionalidades avanzadas como "viaje en el tiempo"

### 1. Diseño del Modelo de Eventos (3 días)

#### Historia de Usuario: Historial Completo de Cambios
**Como** administrador del sistema
**Quiero** tener un registro inmutable de todos los cambios en solicitudes y tareas
**Para** poder auditar y entender la evolución de cada elemento

**Tareas:**
- [ ] Diseñar jerarquía de eventos de dominio (1 día)
  - [ ] Crear clase base `DomainEvent` con metadatos comunes
  - [ ] Implementar eventos específicos para solicitudes (`TaskRequestEvent`)
  - [ ] Implementar eventos específicos para actividades (`ActivityEvent`)
  - [ ] Definir esquemas de serialización para eventos
- [ ] Diseñar estructura de tópicos para eventos (1 día)
  - [ ] Crear tópico `task-request-events` con particionado por ID
  - [ ] Crear tópico `activity-events` con particionado por ID
  - [ ] Configurar políticas de retención para almacenamiento a largo plazo
  - [ ] Implementar compactación para eventos del mismo agregado
- [ ] Implementar generación de eventos desde el dominio (1 día)
  - [ ] Modificar entidades de dominio para generar eventos
  - [ ] Implementar mecanismo para capturar y publicar eventos
  - [ ] Crear servicio para publicar eventos en Kafka
  - [ ] Implementar transacciones que abarquen base de datos y Kafka

**Criterios de Aceptación:**
- Existe un modelo de eventos bien definido para el dominio
- Los tópicos están correctamente configurados para almacenamiento a largo plazo
- Las entidades de dominio generan eventos apropiados en cada cambio
- Los eventos se publican de manera confiable en Kafka

**Riesgos:**
- Diseño inadecuado de eventos que no capture toda la información necesaria
- **Mitigación:** Revisión exhaustiva del modelo de dominio y validación con expertos

**Dependencias:**
- Requiere la infraestructura básica de Kafka del Sprint 20

### 2. Implementación de Event Sourcing (5 días)

#### Historia de Usuario: Reconstrucción de Estado
**Como** desarrollador del sistema
**Quiero** poder reconstruir el estado de cualquier entidad a partir de su historial de eventos
**Para** implementar funcionalidades avanzadas y garantizar la integridad de los datos

**Tareas:**
- [ ] Implementar productores de eventos de dominio (1 día)
  - [ ] Crear `DomainEventProducer` genérico
  - [ ] Implementar productores específicos para cada tipo de evento
  - [ ] Integrar con servicios de aplicación existentes
  - [ ] Implementar manejo de errores y reintentos
- [ ] Implementar almacenamiento de eventos (1 día)
  - [ ] Crear tablas para almacenar eventos en la base de datos
  - [ ] Implementar repositorio para eventos
  - [ ] Crear índices para búsqueda eficiente
  - [ ] Implementar políticas de retención
- [ ] Desarrollar proyecciones para reconstrucción de estado (2 días)
  - [ ] Crear servicio `EventSourcingService` para reconstruir estado
  - [ ] Implementar proyecciones específicas para solicitudes
  - [ ] Implementar proyecciones específicas para actividades
  - [ ] Crear caché para proyecciones frecuentes
- [ ] Implementar consistencia eventual (1 día)
  - [ ] Crear mecanismo para sincronizar estado entre proyecciones
  - [ ] Implementar manejo de eventos fuera de orden
  - [ ] Desarrollar estrategia para resolver conflictos
  - [ ] Crear mecanismo de recuperación para proyecciones corruptas

**Criterios de Aceptación:**
- Los eventos de dominio se publican y almacenan correctamente
- Es posible reconstruir el estado completo de una entidad a partir de sus eventos
- Las proyecciones se mantienen actualizadas con nuevos eventos
- El sistema maneja correctamente eventos fuera de orden y conflictos

**Riesgos:**
- Complejidad en la implementación de proyecciones y manejo de eventos
- **Mitigación:** Comenzar con casos simples y aumentar gradualmente la complejidad

### 3. Implementación de Historial de Cambios (4 días)

#### Historia de Usuario: Visualización de Historial
**Como** usuario del sistema
**Quiero** ver un historial detallado de cambios en solicitudes y tareas
**Para** entender su evolución y tomar decisiones informadas

**Tareas:**
- [ ] Implementar API para consulta de historial (1 día)
  - [ ] Crear endpoint para obtener historial de solicitudes
  - [ ] Crear endpoint para obtener historial de actividades
  - [ ] Implementar filtros y paginación
  - [ ] Optimizar consultas para rendimiento
- [ ] Desarrollar consumidores para generar vistas de historial (1 día)
  - [ ] Crear `HistoryViewConsumer` para procesar eventos
  - [ ] Implementar almacenamiento optimizado para consultas
  - [ ] Desarrollar lógica para agregar metadatos útiles
  - [ ] Implementar caché para consultas frecuentes
- [ ] Implementar interfaz de usuario para historial (2 días)
  - [ ] Crear componente `ChangeHistoryTimeline` para visualizar cambios
  - [ ] Implementar filtros y búsqueda en la interfaz
  - [ ] Desarrollar visualización detallada de cada cambio
  - [ ] Añadir comparación visual entre estados

**Criterios de Aceptación:**
- La API proporciona acceso eficiente al historial de cambios
- La interfaz de usuario muestra claramente la evolución de solicitudes y tareas
- Es posible filtrar y buscar en el historial
- La visualización es intuitiva y proporciona contexto útil

**Riesgos:**
- Rendimiento deficiente con historiales muy largos
- **Mitigación:** Implementar paginación eficiente y optimizar consultas

**Dependencias:**
- Requiere la implementación de Event Sourcing

### 4. Pruebas y Optimización (3 días)

#### Historia de Usuario: Sistema de Historial Confiable
**Como** administrador del sistema
**Quiero** asegurarme de que el sistema de historial sea confiable y eficiente
**Para** garantizar la integridad de los datos históricos y un buen rendimiento

**Tareas:**
- [ ] Implementar pruebas automatizadas (1 día)
  - [ ] Crear pruebas unitarias para productores y consumidores
  - [ ] Implementar pruebas de integración para Event Sourcing
  - [ ] Desarrollar pruebas de reconstrucción de estado
  - [ ] Implementar pruebas de rendimiento para consultas de historial
- [ ] Optimizar rendimiento (1 día)
  - [ ] Ajustar configuración de Kafka para eventos de dominio
  - [ ] Optimizar índices en la base de datos
  - [ ] Implementar estrategias de caché
  - [ ] Ajustar tamaño de batch para consumidores
- [ ] Implementar herramientas de diagnóstico (1 día)
  - [ ] Crear dashboard para monitoreo de eventos
  - [ ] Implementar alertas para problemas de procesamiento
  - [ ] Desarrollar herramientas para reprocessar eventos
  - [ ] Documentar procedimientos de recuperación

**Criterios de Aceptación:**
- Las pruebas automatizadas verifican la confiabilidad del sistema
- El rendimiento de las consultas de historial es aceptable incluso con grandes volúmenes
- Existen herramientas para diagnosticar y resolver problemas
- La documentación de operaciones está completa

**Riesgos:**
- Crecimiento excesivo del volumen de eventos
- **Mitigación:** Implementar políticas de retención y compactación adecuadas

## Sprint 22: Implementación de Apache Kafka - CQRS y Optimización de Consultas

### Descripción del Sprint
Este sprint se enfocará en implementar el patrón CQRS (Command Query Responsibility Segregation) utilizando Apache Kafka para separar las operaciones de lectura y escritura, optimizando el rendimiento y la escalabilidad del sistema. Se crearán vistas especializadas para diferentes casos de uso y se implementarán mecanismos para mantenerlas actualizadas.

### Objetivos
- Implementar el patrón CQRS para separar operaciones de lectura y escritura
- Crear vistas especializadas para diferentes casos de uso
- Optimizar el rendimiento de consultas complejas
- Mejorar la escalabilidad del sistema
- Implementar mecanismos para mantener la consistencia entre comandos y consultas

### 1. Diseño e Implementación de CQRS (5 días)

#### Historia de Usuario: Consultas Optimizadas
**Como** usuario del sistema
**Quiero** que las consultas complejas se ejecuten rápidamente
**Para** obtener la información que necesito sin demoras

**Tareas:**
- [ ] Diseñar arquitectura CQRS (1 día)
  - [ ] Definir separación clara entre comandos y consultas
  - [ ] Identificar vistas especializadas necesarias
  - [ ] Diseñar flujo de datos entre escritura y lectura
  - [ ] Documentar estrategia de consistencia
- [ ] Implementar lado de comandos (2 días)
  - [ ] Refactorizar servicios existentes para enfocarse en comandos
  - [ ] Implementar validación de comandos
  - [ ] Crear manejadores de comandos que generen eventos
  - [ ] Implementar transacciones que abarquen base de datos y Kafka
- [ ] Implementar lado de consultas (2 días)
  - [ ] Crear esquemas de base de datos optimizados para consultas
  - [ ] Implementar repositorios específicos para consultas
  - [ ] Desarrollar servicios de consulta especializados
  - [ ] Implementar caché para consultas frecuentes

**Criterios de Aceptación:**
- Existe una separación clara entre operaciones de lectura y escritura
- Los comandos generan eventos que actualizan las vistas de consulta
- Las consultas se ejecutan contra modelos optimizados
- El rendimiento de las consultas mejora significativamente

**Riesgos:**
- Complejidad adicional en la arquitectura
- **Mitigación:** Documentación clara y capacitación del equipo

**Dependencias:**
- Requiere la implementación de Event Sourcing del Sprint 21

### 2. Implementación de Vistas Especializadas (4 días)

#### Historia de Usuario: Vistas Personalizadas
**Como** usuario con diferentes roles en el sistema
**Quiero** tener vistas optimizadas para mis necesidades específicas
**Para** acceder rápidamente a la información relevante para mi rol

**Tareas:**
- [ ] Identificar y diseñar vistas especializadas (1 día)
  - [ ] Vista de bandeja de entrada para asignadores
  - [ ] Vista de tareas pendientes para ejecutores
  - [ ] Vista de seguimiento para solicitantes
  - [ ] Vista de dashboard para administradores
- [ ] Implementar consumidores para vistas especializadas (2 días)
  - [ ] Crear `ViewModelConsumer` genérico
  - [ ] Implementar consumidores específicos para cada vista
  - [ ] Desarrollar lógica para transformar eventos en modelos de vista
  - [ ] Implementar almacenamiento eficiente para vistas
- [ ] Implementar API para vistas especializadas (1 día)
  - [ ] Crear endpoints para cada vista especializada
  - [ ] Implementar filtros y paginación optimizados
  - [ ] Desarrollar DTOs específicos para cada vista
  - [ ] Documentar API con OpenAPI

**Criterios de Aceptación:**
- Existen vistas especializadas para diferentes roles y casos de uso
- Las vistas se mantienen actualizadas con los eventos del sistema
- La API proporciona acceso eficiente a las vistas
- El rendimiento de las consultas es óptimo incluso con grandes volúmenes de datos

**Riesgos:**
- Proliferación excesiva de vistas especializadas
- **Mitigación:** Análisis cuidadoso de necesidades reales y consolidación donde sea posible

### 3. Actualización de la Interfaz de Usuario (3 días)

#### Historia de Usuario: Interfaz Adaptativa
**Como** usuario del sistema
**Quiero** que la interfaz se adapte a mis necesidades específicas
**Para** trabajar de manera más eficiente

**Tareas:**
- [ ] Adaptar componentes existentes para CQRS (1 día)
  - [ ] Actualizar servicios de frontend para usar nuevos endpoints
  - [ ] Implementar manejo de consistencia eventual en la UI
  - [ ] Desarrollar indicadores de estado de sincronización
  - [ ] Optimizar estrategias de caché en el cliente
- [ ] Implementar nuevas vistas en la interfaz (1 día)
  - [ ] Crear componentes para vistas especializadas
  - [ ] Implementar filtros y búsqueda optimizados
  - [ ] Desarrollar visualizaciones personalizadas por rol
  - [ ] Mejorar la navegación entre vistas
- [ ] Mejorar experiencia de usuario con datos en tiempo real (1 día)
  - [ ] Implementar actualizaciones en tiempo real con WebSockets
  - [ ] Desarrollar animaciones para cambios de estado
  - [ ] Implementar notificaciones de cambios relevantes
  - [ ] Optimizar rendimiento de actualizaciones frecuentes

**Criterios de Aceptación:**
- La interfaz de usuario utiliza eficientemente las vistas especializadas
- La experiencia de usuario es fluida incluso con datos cambiantes
- Los usuarios reciben feedback visual sobre el estado de sincronización
- La interfaz se adapta a diferentes roles y necesidades

**Riesgos:**
- Problemas de usabilidad con consistencia eventual
- **Mitigación:** Diseño cuidadoso de la experiencia de usuario y feedback claro

**Dependencias:**
- Requiere la implementación de vistas especializadas

### 4. Pruebas y Optimización (3 días)

#### Historia de Usuario: Sistema Escalable y Confiable
**Como** administrador del sistema
**Quiero** asegurarme de que el sistema sea escalable y confiable
**Para** soportar el crecimiento futuro y garantizar una buena experiencia de usuario

**Tareas:**
- [ ] Implementar pruebas automatizadas (1 día)
  - [ ] Crear pruebas unitarias para componentes CQRS
  - [ ] Implementar pruebas de integración para flujo completo
  - [ ] Desarrollar pruebas de rendimiento para consultas
  - [ ] Implementar pruebas de consistencia eventual
- [ ] Optimizar rendimiento y escalabilidad (1 día)
  - [ ] Ajustar configuración de Kafka para escalabilidad
  - [ ] Optimizar consultas y índices en la base de datos
  - [ ] Implementar estrategias de caché en múltiples niveles
  - [ ] Configurar sharding para vistas de alto volumen
- [ ] Implementar monitoreo y herramientas operativas (1 día)
  - [ ] Crear dashboard para monitoreo de CQRS
  - [ ] Implementar alertas para problemas de sincronización
  - [ ] Desarrollar herramientas para resincronizar vistas
  - [ ] Documentar procedimientos operativos

**Criterios de Aceptación:**
- Las pruebas automatizadas verifican la confiabilidad del sistema
- El sistema puede escalar horizontalmente para manejar mayor carga
- Existen herramientas para monitorear y resolver problemas
- La documentación operativa está completa

**Riesgos:**
- Complejidad operativa del sistema CQRS
- **Mitigación:** Herramientas de monitoreo robustas y documentación detallada

### 5. Documentación y Capacitación (2 días)

#### Historia de Usuario: Conocimiento Compartido
**Como** miembro del equipo de desarrollo
**Quiero** entender completamente la arquitectura CQRS implementada
**Para** poder mantener y extender el sistema de manera efectiva

**Tareas:**
- [ ] Crear documentación técnica detallada (1 día)
  - [ ] Documentar arquitectura CQRS implementada
  - [ ] Crear diagramas de flujo de datos
  - [ ] Documentar patrones y decisiones de diseño
  - [ ] Crear guías para extender el sistema
- [ ] Realizar sesiones de capacitación (1 día)
  - [ ] Organizar taller sobre la arquitectura implementada
  - [ ] Crear ejercicios prácticos para el equipo
  - [ ] Documentar preguntas frecuentes y soluciones
  - [ ] Preparar materiales de referencia rápida

**Criterios de Aceptación:**
- Existe documentación técnica completa y actualizada
- El equipo ha participado en sesiones de capacitación
- Los desarrolladores pueden explicar la arquitectura CQRS
- Existen recursos de referencia para consulta rápida

**Riesgos:**
- Rotación de personal que lleve a pérdida de conocimiento
- **Mitigación:** Documentación exhaustiva y sesiones de capacitación periódicas

## Sprint 1: Fundamentos y Arquitectura Base

### 1. Migración Arquitectura Backend
1. **Preparación Inicial**
   - [ ] Crear nueva estructura de directorios según arquitectura hexagonal
   - [ ] Configurar dependencias Maven:
     ```xml
     <!-- Caché -->
     <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-cache</artifactId>
     </dependency>
     <dependency>
         <groupId>com.github.ben-manes.caffeine</groupId>
         <artifactId>caffeine</artifactId>
     </dependency>
     <!-- Resto de dependencias... -->
     ```
   - [ ] Establecer configuraciones base

2. **Implementación Capa de Dominio**
   - [ ] Contexto de Actividades
     - [ ] Activity, ActivityType, ActivityStatus
     - [ ] Interfaces de repositorio
     - [ ] Eventos de dominio
     - [ ] Excepciones específicas
   - [ ] Contexto de Usuarios
     - [ ] User, UserRole, Permission
     - [ ] Value Objects (Email, Password, PersonName)
     - [ ] Interfaces de repositorio
   - [ ] Componentes compartidos
     - [ ] Value Objects base
     - [ ] Excepciones base

3. **Implementación Capa de Aplicación**
   - [ ] Casos de uso de Actividades
     - [ ] CreateActivityCommand y Handler
     - [ ] UpdateActivityCommand y Handler
     - [ ] DTOs correspondientes
   - [ ] Casos de uso de Usuarios
     - [ ] AuthenticationCommand y Handler
     - [ ] UserManagementCommand y Handler
     - [ ] DTOs correspondientes

### 2. Configuración de Infraestructura
- [ ] Configurar base de datos PostgreSQL
- [ ] Implementar migraciones Flyway
- [ ] Configurar caché con Caffeine
- [ ] Configurar monitoreo básico con Actuator

## Sprint 2: Implementación Core y Seguridad

### 1. Capa de Infraestructura
- [ ] Implementar persistencia
  - [ ] Entidades JPA
  - [ ] Repositorios JPA
  - [ ] Mappers
- [ ] Implementar API REST
  - [ ] Controladores por contexto
  - [ ] Manejo de errores global
  - [ ] Documentación OpenAPI
- [ ] Configurar seguridad
  - [ ] JWT
  - [ ] Filtros de seguridad
  - [ ] CORS

### 2. Testing Backend
- [ ] Tests unitarios de dominio
- [ ] Tests de integración
- [ ] Tests de API con TestContainers

## Sprint 3: Frontend y Optimizaciones

### 1. Migración Frontend a TypeScript
- [ ] Configuración inicial
  - [ ] Instalar TypeScript y dependencias
  - [ ] Configurar tsconfig.json
  - [ ] Configurar ESLint
- [ ] Migración de componentes
  - [ ] Servicios de API
  - [ ] Store y slices
  - [ ] Componentes compartidos
- [ ] Implementar tipos
  - [ ] Interfaces de dominio
  - [ ] Tipos para estado global
  - [ ] Tipos para API

### 2. Optimizaciones Frontend
- [ ] Implementar lazy loading
- [ ] Optimizar bundle size
- [ ] Configurar caché con React Query
- [ ] Implementar skeleton loading

## Sprint 4: DevOps y Monitoreo

### 1. Configuración CI/CD
- [ ] Pipeline de integración continua
- [ ] Pipeline de despliegue
- [ ] Gestión de secretos
- [ ] Automatización de pruebas

### 2. Monitoreo y Observabilidad
- [ ] Configurar Prometheus
- [ ] Implementar tracing distribuido
- [ ] Configurar alertas
- [ ] Dashboard de métricas

## Sprint 5: Documentación y Calidad

### 1. Documentación
- [ ] Arquitectura del sistema
- [ ] API (OpenAPI/Swagger)
- [ ] Guías de desarrollo
- [ ] ADRs (Architecture Decision Records)

### 2. Calidad y Seguridad
- [ ] Análisis de código estático
- [ ] Revisión de vulnerabilidades
- [ ] Pruebas de rendimiento
- [ ] Auditoría de seguridad

## Sprint 6: Estabilización y Funcionalidades Básicas

### 1. Corrección de Conexión API (3 días)
- [x] Revisar y corregir configuración de URLs de API en frontend
- [x] Implementar manejo de errores en peticiones
- [x] Solucionar problemas de CORS
- [x] Implementar interceptores para tokens
- [x] Verificar conexión con endpoints principales

### 2. Implementación de Autenticación (3 días)
- [x] Corregir flujo de login/logout
- [x] Implementar almacenamiento seguro de tokens
- [x] Proteger rutas que requieren autenticación
- [x] Añadir redirección a login cuando no hay sesión
- [x] Implementar persistencia de sesión

### 2.1 Mejoras de Seguridad en Autenticación (2 días)
- [x] Implementar cierre de sesión en el backend (invalidación de tokens)
- [x] Crear lista negra de tokens JWT en el backend
- [x] Implementar temporizador de inactividad para cierre automático de sesión
- [x] Mejorar interfaz de usuario para el menú de perfil
- [x] Añadir animaciones y transiciones para mejorar la experiencia de usuario
- [x] Implementar funcionalidad para colapsar el sidebar a iconos

### 3. Listado de Actividades Funcional (2 días)
- [x] Implementar carga de datos desde API
- [x] Añadir paginación funcional
- [x] Implementar estados de carga y error con skeletons modernos
- [x] Mostrar mensaje cuando no hay actividades
- [x] Optimizar renderizado de listas con virtualización
- [x] Implementar servicio simulado para desarrollo mientras el backend está en desarrollo
- [x] Mejorar la detección de datos simulados y mostrar banner informativo
- [x] Configurar variables de entorno para controlar el uso del servicio simulado

### 4. Creación y Edición de Actividades (4 días)
- [x] Implementar formulario de creación conectado a API
- [x] Desarrollar validación de campos con React Hook Form y Zod
- [x] Implementar formulario de edición
- [x] Añadir mensajes de éxito/error con sistema de notificaciones
- [x] Implementar confirmación para acciones críticas

### 5. Pruebas y Corrección de Errores (2 días)
- [x] Realizar pruebas end-to-end de flujos básicos
- [x] Corregir errores encontrados
- [x] Optimizar rendimiento de peticiones con Ky y React Query
- [x] Documentar problemas resueltos
- [x] Actualizar documentación técnica

## Sprint 7: Implementación de Backend para Actividades y Mejoras de Seguridad

### 1. Implementación de Backend para Actividades (3 días)
- [x] Verificar la implementación actual del controlador de actividades
- [x] Corregir la configuración de rutas para el endpoint /api/activities
- [x] Implementar pruebas para el controlador de actividades
- [x] Configurar la base de datos para almacenar actividades
- [x] Documentar la API de actividades

### 2. Integración Frontend-Backend (2 días)
- [x] Configurar el frontend para usar el backend real
- [x] Implementar manejo de errores específicos del backend
- [x] Actualizar la documentación del módulo de actividades
- [x] Realizar pruebas end-to-end de la integración
- [x] Optimizar peticiones al backend para evitar múltiples solicitudes innecesarias
- [x] Implementar mecanismos de caché y debounce para mejorar el rendimiento
- [x] Implementar un sistema de prevención de peticiones duplicadas
- [x] Configurar React Query a nivel global para optimizar el rendimiento
- [x] Implementar adaptadores de datos para manejar diferentes formatos de respuesta del backend
- [x] Agregar validación y normalización de datos para garantizar la compatibilidad
- [x] Mejorar el manejo de fechas para soportar diferentes formatos
  - [x] Corregir error de formato de fecha con zona horaria Z en la creación de actividades
- [x] Implementar manejo de errores robusto en la renderización de actividades
- [x] Implementar limitador de frecuencia de peticiones para evitar sobrecarga del servidor
- [x] Agregar caché en localStorage para mejorar la experiencia offline
- [x] Simplificar componentes para reducir re-renderizados innecesarios
- [x] Migrar de Redux a React Query para mejorar el rendimiento y simplificar el código
- [x] Implementar hooks personalizados para operaciones CRUD con React Query
- [x] Agregar debounce para la búsqueda de actividades
- [x] Corregir advertencias de styled-components para props booleanas
- [x] Implementar validación de parámetros para evitar errores 500
- [x] ~~Implementar sistema de datos simulados cuando el backend no está disponible~~ (Eliminado)

### 3. Mejoras de Seguridad (4 días)
- [x] Implementar rotación de tokens JWT
  - [x] Implementar refresh tokens con rotación
  - [x] Implementar revocación de tokens en cascada
  - [x] Implementar lista negra de tokens
- [x] Mejorar validación de contraseñas
  - [x] Implementar validación de patrones de contraseña segura
  - [x] Validar contraseñas en DTOs con expresiones regulares
  - [x] Implementar Value Object para contraseñas seguras
- [x] Implementar registro de auditoría de acciones de seguridad
  - [x] Implementar scripts de análisis de seguridad
  - [x] Configurar análisis de dependencias
  - [x] Configurar análisis de código estático

### 4. Mejoras de Experiencia de Usuario (3 días)
- [x] Implementar sistema de notificaciones en tiempo real
  - [x] Crear servicio WebSocket para comunicación en tiempo real
  - [x] Implementar contexto para gestionar notificaciones
  - [x] Crear componente de centro de notificaciones
  - [x] Integrar con el sistema de notificaciones toast
- [x] Añadir más opciones en el menú de usuario
- [x] Permitir al usuario configurar el tiempo de inactividad
- [x] Implementar temas personalizables (claro/oscuro)

### 5. Gestión de Sesiones (3 días)
- [x] Implementar sistema para gestionar sesiones múltiples
  - [x] Crear tabla de sesiones en la base de datos
  - [x] Almacenar información de dispositivo y ubicación al iniciar sesión
  - [x] Implementar endpoint para listar sesiones activas
- [x] Añadir vista de sesiones activas para el usuario
  - [x] Crear componente para mostrar lista de sesiones
  - [x] Mostrar información detallada de cada sesión (dispositivo, ubicación, fecha)
  - [x] Implementar filtros y búsqueda de sesiones
- [x] Permitir cerrar sesiones remotamente
  - [x] Implementar endpoint para cerrar sesión por ID
  - [x] Añadir botón para cerrar sesiones individuales
  - [x] Implementar opción para cerrar todas las sesiones excepto la actual
- [x] Implementar detección de sesiones sospechosas
  - [x] Detectar cambios inusuales de ubicación o dispositivo
  - [x] Notificar al usuario sobre actividad sospechosa
  - [x] Implementar bloqueo automático de sesiones sospechosas
- [x] Mejorar manejo de tokens expirados
  - [x] Implementar refresh tokens con rotación
  - [x] Manejar expiración de tokens en el cliente
  - [x] Implementar revocación de tokens en cascada

### 6. Correcciones y Mejoras Técnicas (2 días)
- [x] Corregir rutas de importación con alias @/
- [x] Configurar correctamente el alias @/ en vite.config.ts
- [x] Instalar dependencias faltantes (date-fns, socket.io-client, ky)
- [x] Corregir errores de sintaxis JSX en archivos .js
- [x] Implementar soluciones temporales para evitar dependencias problemáticas
- [x] Corregir importación de useAppSelector en RealTimeNotificationContext
- [x] Corregir importación de toggleTheme en Header.jsx
- [x] Corregir error de RealTimeNotificationProvider
- [x] Corregir error de styled-components en PageTransition.tsx
- [x] Corregir orden de proveedores en App.jsx
- [x] Implementar servidor WebSocket en el backend
  - [x] Configurar WebSocket con Spring
  - [x] Implementar autenticación JWT para WebSockets
  - [x] Crear controladores y servicios para notificaciones en tiempo real
- [x] Implementar validación de tipos para las respuestas de la API
  - [x] Crear interfaces TypeScript para todas las respuestas de la API
  - [x] Implementar validación de tipos en tiempo de ejecución con Zod o io-ts
  - [x] Generar tipos automáticamente desde la API de OpenAPI
- [x] Tareas completadas
- [x] Mejorar la integración Frontend-Backend
  - [x] Implementar la conexión WebSocket en el frontend
  - [x] Optimizar la comunicación entre frontend y backend
  - [x] Implementar manejo de errores específicos para WebSockets

## Sprint 8: Refactorización del Sistema de Actividades

### 1. Migración a React Query como capa principal (3 días)
- [x] Eliminar el slice de Redux para actividades
- [x] Completar la implementación de React Query
  - [x] Mejorar los hooks existentes en useActivities.ts
  - [x] Implementar funcionalidades de caché y revalidación
- [x] Actualizar los componentes para usar React Query
  - [x] Modificar Activities.jsx para usar los hooks de React Query
  - [x] Implementar manejo de estados de carga y error con React Query
  - [x] Crear hooks personalizados para operaciones CRUD con React Query
  - [x] Implementar validación de parámetros para evitar errores 500

### 2. Reemplazar Axios con Fetch API o Ky (2 días)
- [x] Crear un nuevo cliente HTTP con Ky
  - [x] Instalar Ky: `npm install ky`
  - [x] Crear un archivo de configuración para Ky
- [x] Refactorizar el servicio de actividades
  - [x] Eliminar la lógica de datos mock
  - [x] Implementar el servicio con Ky
  - [x] Mejorar el manejo de errores
  - [x] Implementar validación de parámetros en el servicio
- [x] Actualizar los hooks de React Query
  - [x] Modificar los hooks para usar el nuevo servicio

### 3. Mejorar Componentes y Rendimiento (3 días)
- [x] Implementar virtualización en las listas
  - [x] Instalar `@tanstack/react-virtual`
  - [x] Crear componentes base de virtualización
  - [x] Refactorizar `ActivityList` para usar virtualización
  - [x] Refactorizar `ActivityGrid` para usar virtualización
- [x] Mejorar formularios con React Hook Form
  - [x] Instalar React Hook Form
  - [x] Refactorizar `ActivityForm` para usar React Hook Form
  - [x] Implementar validación con Zod o Yup
- [x] Implementar Suspense y Error Boundaries
  - [x] Crear componentes de Error Boundary
  - [x] Utilizar Suspense para carga progresiva

### 4. Mejoras en el Backend (Java) (4 días)
- [x] Generar tipos automáticamente para el frontend
  - [x] Configurar OpenAPI en el backend
  - [x] Implementar generación automática de tipos TypeScript
- [x] Implementar Spring Data JPA Specifications
  - [x] Crear especificaciones para filtros dinámicos
  - [x] Refactorizar el repositorio para usar especificaciones
- [x] Mejorar rendimiento con Projections
  - [x] Implementar proyecciones para consultas específicas
  - [x] Optimizar consultas para traer solo los datos necesarios

### 5. Mejoras en Seguridad y Manejo de Errores (2 días)
- [x] Implementar Refresh Tokens Automáticos
  - [x] Crear interceptor para refresh tokens en Axios
  - [x] Implementar lógica de renovación de tokens
- [x] Mejorar el manejo de errores
  - [x] Crear tipos específicos de errores en el backend
  - [x] Implementar mapeo de errores en el frontend

## Sprint 23: Mejora del Rol de Administrador (COMPLETADO)

### Descripción del Sprint
Este sprint se enfocó en mejorar y completar las funcionalidades del rol de administrador en la plataforma, implementando interfaces completas para la gestión de usuarios, configuración del sistema, y herramientas administrativas avanzadas. Se aplicaron patrones de diseño adecuados y se mejoró la calidad del código existente.

### Objetivos Alcanzados
- ✅ Implementar una interfaz completa para la gestión de usuarios y roles
- ✅ Desarrollar herramientas de configuración del sistema para administradores
- ✅ Implementar integraciones con servicios externos
- ✅ Crear panel de configuración general con múltiples secciones

### Próximos Objetivos (Sprint 25)
- Implementar nuevas funcionalidades solicitadas por los usuarios
- Mejorar la experiencia de usuario en módulos existentes
- Optimizar el rendimiento de la aplicación
- Continuar preparación para producción

---

## 🎯 Sprint 24: Eliminación de Sistemas Mock para Producción (En Progreso)

**Duración**: 9 días
**Estado**: 🔄 En Progreso
**Inicio**: 2024-12-06
**Fin**: 2024-12-18

### Objetivos
- Eliminar todos los sistemas de datos simulados (mock data) del proyecto
- Asegurar que la aplicación funcione completamente con APIs reales
- Preparar el sistema para despliegue en producción sin dependencias de datos simulados
- Mejorar el manejo de estados vacíos y errores

### Fase 1: Eliminación de Sistemas Críticos (3 días)

#### Día 1: Sistema de Actividades Mock ✅ COMPLETADO
- [x] Eliminar archivos mock del sistema de actividades
  - [x] Eliminado `frontend/src/features/activities/mockService.js` (373 líneas)
  - [x] Eliminado `frontend/src/features/activities/mockService.d.ts` (45 líneas)
  - [x] Eliminado `frontend/src/features/activities/mockData.js` (208 líneas)
- [x] Actualizar activitiesService.ts para usar solo API real
  - [x] Eliminada lógica de detección de mock data
  - [x] Simplificado manejo de errores para propagar errores al componente
  - [x] Removidos fallbacks a datos simulados
- [x] Simplificar Activities.tsx removiendo lógica de mock data
  - [x] Eliminada variable de estado `usingMockData`
  - [x] Removido efecto para detectar datos simulados
  - [x] Eliminado banner de mock data (`MockDataBanner`)
  - [x] Limpiadas referencias a localStorage de mock data
- [x] Actualizar documentación README-ACTIVITIES.md
  - [x] Eliminadas referencias a `VITE_USE_MOCK_DATA`
  - [x] Removida sección "Servicio simulado"
  - [x] Actualizado flujo de datos para reflejar solo uso de API real

#### Día 2: Datos Hardcodeados en Componentes ✅ COMPLETADO
- [x] Eliminar MOCK_SOLICITUDES de MisSolicitudes.tsx
  - [x] Eliminadas 76 líneas de datos simulados de solicitudes
  - [x] Actualizada lógica para usar solo datos reales de la API
  - [x] Mejorado comentario para clarificar el uso de datos reales
- [x] Eliminar MOCK_TAREAS de DashboardEjecutor.tsx
  - [x] Eliminadas 75 líneas de datos simulados de tareas
  - [x] Actualizada lógica para usar arrays vacíos como fallback
  - [x] Removidos fallbacks a datos mock en favor de arrays vacíos
- [x] Eliminar MOCK_METRICAS de MetricasAsignacion.tsx
  - [x] Eliminadas 46 líneas de datos simulados de métricas
  - [x] Implementado sistema de estados vacíos apropiados
  - [x] Creado componente EmptyState para mejor UX
  - [x] Añadida lógica condicional para mostrar contenido solo cuando hay datos
- [x] Implementar estados vacíos apropiados en todos los componentes
  - [x] Estados vacíos informativos en lugar de datos simulados
  - [x] Mensajes claros sobre por qué no hay datos disponibles
  - [x] Guías para el usuario sobre cómo generar datos reales
  - [x] Mejor experiencia de usuario en aplicaciones sin datos iniciales

#### Día 3: Servicios de Reportes y Dashboard Mock ✅ COMPLETADO
- [x] Eliminar datos de ejemplo de customReportService.ts
  - [x] Eliminadas 186 líneas de campos disponibles simulados
  - [x] Eliminadas 27 líneas de datos de ejemplo en executeReport
  - [x] Eliminadas 44 líneas de reportes guardados simulados
  - [x] Eliminadas 65 líneas de plantillas de reportes simuladas
  - [x] Eliminadas 40 líneas de reportes programados simulados
  - [x] Eliminadas 5 líneas de blob de ejemplo en exportReport
- [x] Eliminar métricas simuladas de dashboardService.ts
  - [x] Eliminadas 18 líneas de timeline metrics simuladas
  - [x] Eliminadas 20 líneas de performance metrics simuladas
  - [x] Implementados endpoints reales para métricas de timeline y performance
- [x] Eliminar plantillas simuladas de notificationConfigService.ts
  - [x] Eliminadas 3 líneas de canales predefinidos como fallback
  - [x] Eliminadas 35 líneas de tipos de notificación predefinidos
  - [x] Eliminadas 13 líneas de preferencias predefinidas como fallback
  - [x] Eliminadas 23 líneas de plantillas predefinidas como fallback
- [x] Implementar manejo de errores apropiado
  - [x] Todos los servicios ahora propagan errores correctamente
  - [x] Eliminados fallbacks a datos simulados
  - [x] Mejor experiencia de error para el usuario final

### Fase 2: Servicios de Integración (3 días)

#### Día 4-5: Google Drive y Calendar Mock ✅ COMPLETADO
- [x] Evaluar estado de implementación real de Google APIs
  - [x] Identificados servicios reales existentes: `RealDriveIntegrationService`, `RealCalendarIntegrationService`, `GoogleAuthService`
  - [x] Identificados servicios mock: `MockDriveIntegrationService`, `MockCalendarIntegrationService`
  - [x] Evaluada arquitectura actual de integraciones
- [x] Reemplazar mock services con servicios "no implementado"
  - [x] Convertido `MockDriveIntegrationService` a `NotImplementedDriveIntegrationService`
  - [x] Convertido `MockCalendarIntegrationService` a `NotImplementedCalendarIntegrationService`
  - [x] Eliminadas 95 líneas de datos mock de Google Drive
  - [x] Eliminadas 67 líneas de datos mock de Google Calendar
  - [x] Implementados mensajes descriptivos de funcionalidad no disponible
  - [x] Todos los métodos ahora lanzan errores informativos en lugar de simular datos
- [x] Actualizar UI para mostrar estado "próximamente"
  - [x] Creado componente `ComingSoonBanner` para indicar funcionalidades futuras
  - [x] Agregados banners informativos en `ConfiguracionIntegraciones.tsx`
  - [x] Actualizadas funciones de manejo para mostrar mensajes informativos
  - [x] Simplificada lógica de carga de estado de autenticación
  - [x] Removidas importaciones de servicios reales no utilizados
- [x] Documentar como funcionalidad futura
  - [x] Creado `frontend/INTEGRACIONES-FUTURAS.md` con documentación completa
  - [x] Documentado estado actual y funcionalidades planificadas
  - [x] Incluidas instrucciones para migración futura
  - [x] Listados archivos relacionados y próximos pasos

#### Día 6: Alertas de Seguridad y Notificaciones ✅ COMPLETADO
- [x] Eliminar mockNotifications de SecurityAlertNotifications.tsx
  - [x] Eliminadas 54 líneas de datos mock de notificaciones de seguridad
  - [x] Implementada carga real desde API con manejo de errores apropiado
  - [x] Mejorado estado vacío con mensaje informativo descriptivo
  - [x] Simplificada lógica de carga de notificaciones
- [x] Eliminar socket simulado de RealTimeNotificationContext.tsx
  - [x] Eliminadas 79 líneas de lógica de socket simulado
  - [x] Simplificada lógica de desarrollo vs producción
  - [x] Eliminada duplicación de código para cargar notificaciones
- [x] Implementar manejo robusto de WebSocket real
  - [x] Mejorada configuración de WebSocket con reconexión automática
  - [x] Implementado manejo robusto de errores de conexión
  - [x] Configurado timeout y reintentos apropiados
- [x] Mejorar estados vacíos de notificaciones
  - [x] Actualizado RealTimeNotificationCenter con mensajes más informativos
  - [x] Mejorado EnhancedNotificationList con descripción de funcionalidad
  - [x] Actualizado NotificacionesPanel con contexto adicional
  - [x] Agregados subtextos explicativos en todos los estados vacíos
- [x] Eliminar datos mock de securityAlertService.ts
  - [x] Eliminadas 298 líneas de datos mock de alertas de seguridad
  - [x] Todos los métodos ahora propagan errores correctamente
  - [x] Eliminados fallbacks a datos simulados en todos los métodos

### Fase 3: Backend y Configuraciones (2 días)

#### Día 7: DataInitializer y Datos de Prueba ✅ COMPLETADO
- [x] Eliminar datos hardcodeados del DataInitializer
  - [x] Marcado DataInitializer.java como obsoleto con @Deprecated
  - [x] Cambiado perfil de activación a 'legacy-data-init'
  - [x] Agregadas advertencias sobre obsolescencia en logs
  - [x] Mantenido para compatibilidad hacia atrás
- [x] Implementar carga desde archivos de configuración
  - [x] Creado InitialDataConfig.java para mapear configuraciones YAML
  - [x] Implementado ConfigurableDataInitializer.java como reemplazo
  - [x] Soporte para variables de entorno en contraseñas
  - [x] Configuración flexible por ambiente (dev, test, prod)
  - [x] Validación de permisos y roles automática
- [x] Crear sistema de configuración flexible
  - [x] application-configurable-data.yml - Configuración base
  - [x] application-dev-data.yml - Datos completos para desarrollo
  - [x] application-test-data.yml - Datos específicos para testing
  - [x] application-prod-data.yml - Datos mínimos para producción
  - [x] Soporte para usuarios, roles, permisos y actividades configurables
  - [x] Resolución automática de variables de entorno
- [x] Documentar configuraciones disponibles
  - [x] Creado CONFIGURABLE-DATA-INITIALIZATION.md con documentación completa
  - [x] Actualizado README-DATA-INITIALIZATION.md con nuevo sistema
  - [x] Documentadas variables de entorno soportadas
  - [x] Incluidos ejemplos de configuración por ambiente
  - [x] Guía de migración desde sistema anterior
  - [x] Troubleshooting y buenas prácticas de seguridad

#### Día 8: Limpieza Final y Testing ✅ COMPLETADO
- [x] Simplificar Query Provider eliminando fallbacks específicos
  - [x] Eliminadas 99 líneas de lógica compleja de fallbacks en QueryProvider.jsx
  - [x] Removido interceptor de fetch con respuestas simuladas
  - [x] Simplificada configuración a solo React Query sin lógica mock
  - [x] Eliminada duplicación de QueryClient en main.tsx
  - [x] Actualizado main.tsx para usar QueryProvider centralizado
- [x] Eliminar referencias a VITE_USE_MOCK_DATA
  - [x] Removido componente MockDataBanner.tsx obsoleto
  - [x] Eliminado archivo vite.config.js duplicado
  - [x] Marcado queryClient.ts como obsoleto con @deprecated
  - [x] Simplificada configuración de QueryClient duplicada
- [x] Actualizar documentación obsoleta
  - [x] Limpiadas configuraciones duplicadas en archivos de configuración
  - [x] Removidas referencias obsoletas a sistemas mock
  - [x] Actualizada documentación de configuración
- [x] Testing integral de todos los módulos
  - [x] Creado script test-no-mocks.sh para verificación integral
  - [x] Creado script test-no-mocks.bat para Windows
  - [x] Verificación automática de ausencia de datos mock
  - [x] Testing de frontend y backend sin dependencias simuladas
  - [x] Validación de configuraciones de datos iniciales
  - [x] Verificación de documentación actualizada

### Día 9: Validación Final
- [ ] Testing exhaustivo sin mock data
- [ ] Verificar manejo de errores en todos los módulos
- [ ] Confirmar UX apropiada en estados vacíos
- [ ] Documentar cambios en CHANGELOG.md

---

## Sprint 23: Mejoras Administrativas y Dashboard Avanzado (COMPLETADO)

### 1. Gestión de Usuarios y Roles (5 días)

#### Historia de Usuario: Gestión Completa de Usuarios
**Como** administrador del sistema
**Quiero** tener una interfaz completa para gestionar usuarios y sus roles
**Para** mantener el control de acceso al sistema de manera eficiente

**Tareas:**
- [x] Implementar interfaz de listado de usuarios (1 día)
  - [x] Crear componente `UserList` con filtros avanzados
  - [x] Implementar paginación y ordenamiento
  - [x] Mostrar información relevante de cada usuario
  - [x] Añadir acciones rápidas (activar/desactivar, editar, eliminar)
- [x] Desarrollar formulario de creación/edición de usuarios (1 día)
  - [x] Crear componente `UserForm` con validación avanzada
  - [x] Implementar selección de roles y permisos
  - [x] Añadir validación de campos críticos (email, contraseña)
  - [x] Implementar previsualización de permisos efectivos
- [x] Implementar gestión de roles y permisos (1.5 días)
  - [x] Crear componente `PermissionsManager` para administrar permisos
  - [x] Implementar matriz de permisos por rol
  - [ ] Añadir funcionalidad para crear/editar roles personalizados
  - [x] Implementar herencia de permisos entre roles


**Criterios de Aceptación:**
- La interfaz permite listar, filtrar y buscar usuarios eficientemente
- Es posible crear, editar y eliminar usuarios con todos sus atributos
- Se pueden gestionar roles y permisos de manera granular
- La interfaz es intuitiva y proporciona feedback claro al usuario

### 2. Configuración del Sistema (4 días)

#### Historia de Usuario: Herramientas de Configuración Avanzada
**Como** administrador del sistema
**Quiero** tener acceso a herramientas de configuración avanzada
**Para** personalizar y optimizar el funcionamiento del sistema

**Tareas:**
- [x] Implementar gestión de categorías y prioridades (1 día)
  - [x] Completar componente `ConfiguracionTareas` existente
  - [x] Añadir CRUD completo para categorías
  - [x] Implementar gestión de prioridades con niveles personalizables
  - [x] Añadir opción para desactivar categorías sin eliminarlas
- [x] Desarrollar configuración de notificaciones (1 día)
  - [x] Completar componente `ConfiguracionNotificaciones` existente
  - [x] Implementar plantillas de notificaciones personalizables
  - [x] Añadir configuración de canales de notificación
  - [x] Implementar reglas de notificación por evento y rol
- [x] Implementar configuración de integraciones (1 día)
  - [x] Completar componente `ConfiguracionIntegraciones` existente
  - [x] Implementar integración real con Google Calendar
  - [x] Añadir integración con Google Drive para almacenamiento
  - [x] Desarrollar sistema de prueba de conexión para integraciones
- [x] Crear panel de configuración general (1 día)
  - [x] Desarrollar componente `ConfiguracionGeneral`
  - [x] Implementar ajustes de rendimiento y caché
  - [x] Añadir configuración de políticas de seguridad
  - [x] Implementar gestión de plantillas de correo electrónico

**Criterios de Aceptación:**
- Las categorías y prioridades se pueden gestionar completamente
- La configuración de notificaciones permite personalización avanzada
- Las integraciones externas funcionan correctamente
- La configuración general permite ajustar parámetros del sistema
- Los cambios en la configuración se aplican correctamente

## Sprint 24: Dashboards, Reportes y Herramientas Administrativas Avanzadas

### Descripción del Sprint
Este sprint se enfocará en mejorar los dashboards administrativos, implementar reportes avanzados y desarrollar herramientas de diagnóstico y mantenimiento para administradores. También se trabajará en la refactorización del código existente para mejorar su calidad y mantenibilidad.

### Objetivos
- Implementar dashboards administrativos avanzados con métricas en tiempo real
- Desarrollar sistema de reportes personalizables y programados
- Crear herramientas de diagnóstico y mantenimiento del sistema
- Refactorizar componentes administrativos para mejorar la calidad del código
- Implementar pruebas automatizadas para funcionalidades administrativas

### 1. Dashboards y Reportes Administrativos (4 días)

#### Historia de Usuario: Información Gerencial Completa
**Como** administrador del sistema
**Quiero** tener acceso a dashboards y reportes avanzados
**Para** tomar decisiones basadas en datos y monitorear el sistema

**Tareas:**
- [x] Mejorar dashboard administrativo (1 día)
  - [x] Refactorizar componente `AdminDashboardContent` existente
  - [x] Implementar métricas en tiempo real
  - [x] Añadir gráficos interactivos con filtros
  - [x] Implementar alertas visuales para situaciones críticas
- [x] Desarrollar reportes personalizables (1 día)
  - [x] Crear componente `ReportBuilder` para reportes ad-hoc
  - [x] Implementar selección de dimensiones y métricas
  - [x] Añadir visualizaciones configurables
  - [x] Implementar exportación en múltiples formatos
- [x] Implementar reportes programados (1 día)
  - [x] Crear componente `ScheduledReportsList` para gestionar reportes
  - [x] Implementar configuración de frecuencia y destinatarios
  - [x] Añadir opciones de formato de exportación
  - [x] Desarrollar plantillas de reportes predefinidos
- [ ] Crear panel de monitoreo del sistema (1 día)
  - [ ] Desarrollar componente `SystemMonitor`
  - [ ] Implementar visualización de métricas de rendimiento
  - [ ] Añadir monitoreo de errores y excepciones
  - [ ] Implementar alertas configurables

**Criterios de Aceptación:**
- ✅ El dashboard administrativo muestra información relevante y actualizada
- ✅ Es posible crear reportes personalizados con múltiples dimensiones
- ✅ Los reportes se pueden programar y distribuir automáticamente
- ⬜ El panel de monitoreo proporciona visibilidad del estado del sistema
- ✅ La información se presenta de manera clara y accionable

### 2. Herramientas Administrativas Avanzadas (3 días)

#### Historia de Usuario: Herramientas de Diagnóstico y Mantenimiento
**Como** administrador del sistema
**Quiero** tener acceso a herramientas avanzadas de diagnóstico y mantenimiento
**Para** resolver problemas y mantener el sistema funcionando óptimamente

**Tareas:**
- [x] Implementar herramientas de diagnóstico (1 día)
  - [x] Crear componente `SystemMonitor` para análisis del sistema
  - [x] Implementar verificación de integridad de datos
  - [x] Añadir detección de inconsistencias
  - [x] Desarrollar herramientas de resolución automática
- [x] Desarrollar herramientas de mantenimiento (1 día)
  - [x] Crear componente `MaintenanceTasksCard` para tareas de mantenimiento
  - [x] Implementar limpieza de datos antiguos
  - [x] Añadir optimización de base de datos
  - [x] Desarrollar gestión de caché del sistema
- [x] Implementar gestión de backups (1 día)
  - [x] Crear funcionalidad para gestionar copias de seguridad
  - [x] Implementar programación de backups automáticos
  - [x] Añadir restauración selectiva de datos
  - [x] Desarrollar verificación de integridad de backups

**Criterios de Aceptación:**
- ✅ Las herramientas de diagnóstico detectan y resuelven problemas comunes
- ✅ Las herramientas de mantenimiento permiten optimizar el sistema
- ✅ La gestión de backups funciona de manera confiable
- ✅ Las herramientas son accesibles solo para administradores
- ✅ Existe documentación clara sobre el uso de cada herramienta

### 3. Refactorización y Mejora de Código (4 días)

#### Historia de Usuario: Código Mantenible y Extensible
**Como** desarrollador del sistema
**Quiero** que el código relacionado con funcionalidades administrativas sea limpio y mantenible
**Para** facilitar futuras mejoras y extensiones

**Tareas:**
- [ ] Refactorizar componentes administrativos (1 día)
  - [ ] Dividir `AdminDashboardContent` en componentes más pequeños
  - [ ] Aplicar principio de responsabilidad única
  - [ ] Implementar patrones de diseño adecuados
  - [ ] Mejorar la reutilización de código
- [ ] Mejorar la arquitectura de servicios administrativos (1 día)
  - [ ] Implementar patrón Facade para servicios administrativos
  - [ ] Aplicar principio de inversión de dependencias
  - [ ] Mejorar la testabilidad de los servicios
  - [ ] Documentar la arquitectura de servicios
- [ ] Implementar pruebas automatizadas (1 día)
  - [ ] Crear pruebas unitarias para componentes administrativos
  - [ ] Implementar pruebas de integración para flujos administrativos
  - [ ] Añadir pruebas end-to-end para funcionalidades críticas
  - [ ] Configurar CI/CD para ejecutar pruebas automáticamente
- [ ] Mejorar la documentación técnica (1 día)
  - [ ] Documentar la arquitectura administrativa
  - [ ] Crear guías para extender funcionalidades administrativas
  - [ ] Documentar decisiones de diseño y patrones utilizados
  - [ ] Implementar documentación en código con JSDoc/TSDoc

**Criterios de Aceptación:**
- Los componentes administrativos siguen principios SOLID
- La arquitectura de servicios es clara y mantenible
- Existen pruebas automatizadas con buena cobertura
- La documentación técnica es completa y actualizada
- El código es fácil de entender y extender

### 4. Sistema de Auditoría de Usuarios (2 días)

#### Historia de Usuario: Seguimiento Completo de Actividad
**Como** administrador del sistema
**Quiero** tener un sistema completo de auditoría de usuarios
**Para** monitorear la actividad y garantizar la seguridad del sistema

**Tareas:**
- [x] Desarrollar sistema de auditoría de usuarios (1 día)
  - [x] Crear componente `UserAuditLog` para visualizar actividad
  - [x] Implementar filtros por usuario, acción y fecha
  - [x] Mostrar cambios detallados en cada acción
  - [x] Añadir exportación de registros de auditoría
- [x] Implementar alertas y notificaciones de seguridad (1 día)
  - [x] Crear sistema de detección de actividades sospechosas
  - [x] Implementar notificaciones para administradores
  - [x] Desarrollar panel de alertas de seguridad
  - [x] Añadir configuración de umbrales y reglas de alerta

**Criterios de Aceptación:**
- ✅ El sistema registra todas las acciones relevantes de los usuarios
- ✅ Es posible filtrar y buscar en los registros de auditoría
- ✅ Se pueden exportar los registros para análisis externos
- ✅ Las alertas de seguridad se generan automáticamente
- ✅ Los administradores reciben notificaciones sobre actividades sospechosas

## Sprint 19: Mejora de Experiencia de Usuario para Ejecutores

### Descripción del Sprint
Este sprint se enfocará en mejorar la experiencia de usuario para el rol de EJECUTOR, haciendo que la interfaz sea más dinámica y responda al estado actual de las tareas asignadas. Se implementarán mejoras visuales y funcionales para proporcionar una experiencia más intuitiva y contextual.

### Objetivos
- Implementar una interfaz dinámica que responda al estado actual de las tareas
- Mejorar la retroalimentación visual para el usuario ejecutor
- Optimizar la visualización de información relevante según el contexto
- Implementar mensajes informativos claros cuando no hay tareas
- Mejorar la experiencia general del usuario ejecutor

### 1. Mejora del Dashboard del Ejecutor (2 días)
- [x] Implementar interfaz dinámica que responda al estado actual de las tareas
  - [x] Deshabilitar o no mostrar el botón "Iniciar Tarea" cuando no hay tareas pendientes
  - [x] Mostrar mensajes informativos cuando no hay tareas asignadas
  - [x] Actualizar automáticamente los componentes del dashboard para reflejar el estado real
  - [x] Proporcionar retroalimentación visual clara sobre las acciones disponibles
  - [x] Mejorar los mensajes de estado vacío en las listas de tareas y gráficos
  - [x] Implementar alerta informativa cuando no hay tareas asignadas
  - [x] Optimizar la experiencia visual con mensajes contextuales

### 2. Mejora del Sistema de Badges/Pills en Historial de Tareas (2 días)
- [x] Implementar sistema unificado de badges para estado, prioridad y categoría de tareas
  - [x] Reemplazar los badges locales por componentes compartidos StatusBadge, PriorityBadge y CategoryBadge
  - [x] Añadir badge de categoría a las tarjetas de tareas
  - [x] Mejorar el contraste entre las tarjetas y el fondo
  - [x] Añadir efectos visuales sutiles para mejorar la jerarquía visual
  - [x] Implementar consistencia visual en toda la aplicación
  - [x] Mejorar la experiencia visual con animaciones y efectos hover
  - [x] Optimizar la organización visual de los badges para mejor legibilidad
  - [x] Mejorar el diseño de los filtros y controles de búsqueda

### 3. Implementación de Sistema Unificado de Badges con Fondos Oscuros (2 días)
- [x] Modificar el componente PriorityBadge para utilizar fondos oscuros
  - [x] Mantener los colores actuales para bordes, sombras y texto
  - [x] Implementar fondos oscuros consistentes con el tema de la aplicación
  - [x] Mejorar el contraste entre el texto y el fondo para garantizar la legibilidad
  - [x] Implementar transiciones suaves entre estados normal y hover

- [x] Aplicar el mismo principio de diseño a StatusBadge y CategoryBadge
  - [x] Modificar StatusBadge para utilizar fondos oscuros manteniendo los colores originales
  - [x] Modificar CategoryBadge para utilizar fondos oscuros manteniendo los colores originales
  - [x] Asegurar consistencia visual entre todos los tipos de badges
  - [x] Mantener la identidad visual distintiva de cada tipo de badge
  - [x] Implementar efectos hover coherentes en todos los componentes

### 4. Ajustes Específicos de Colores en Badges (1 día)
- [x] Intercambiar colores entre badges de estado "APROBADA" y prioridad "BAJA"
  - [x] Modificar los colores del badge de estado APPROVED para usar los colores de la prioridad LOW
  - [x] Modificar los colores del badge de prioridad LOW para usar los colores del estado APPROVED
  - [x] Mantener la consistencia visual con el sistema unificado de badges con fondos oscuros
  - [x] Asegurar que los cambios no afecten la legibilidad de los badges

## Sprint 18: Mejoras de Experiencia de Usuario y Corrección de Errores

### Descripción del Sprint
Este sprint se enfocará en mejorar la experiencia de usuario, corregir errores existentes y añadir funcionalidades que mejoren la usabilidad de la aplicación. Se dará especial atención a la interacción con archivos adjuntos y a la experiencia de los usuarios ejecutores y solicitantes.

### Objetivos
- Mejorar la interacción con archivos adjuntos para usuarios ejecutores y solicitantes
- Corregir errores de interfaz y funcionalidad
- Optimizar la experiencia de usuario en diferentes roles
- Mejorar la visualización de información relevante
- Implementar feedback visual para acciones del usuario
- Mejorar la sección de Historial de tareas para el rol EJECUTOR
- Mejorar la consistencia visual de botones y filtros en la interfaz

### 1. Mejora de Interacción con Archivos Adjuntos (2 días)
- [x] Mejorar la visualización de archivos adjuntos en la vista de detalle de tarea para ejecutores
- [x] Implementar funcionalidad de descarga al hacer clic en los archivos adjuntos
- [x] Añadir efectos visuales para indicar que los archivos son interactivos
- [x] Mejorar la experiencia de usuario con notificaciones toast al descargar archivos
- [x] Añadir título descriptivo a los elementos de archivos adjuntos
- [x] Implementar capacidad para que los ejecutores puedan adjuntar nuevos archivos a las tareas asignadas
- [x] Añadir visualización de archivos adjuntos en la página de seguimiento de solicitud para usuarios solicitantes
- [x] Implementar funcionalidad de descarga de archivos adjuntos para usuarios solicitantes
- [x] Implementar funcionalidad para adjuntar archivos a comentarios en el chat de solicitudes

### 2. Corrección de Errores (1 día)
- [x] Solucionar error de formato de fecha en ActualizarProgreso.tsx
- [x] Implementar validación robusta para el manejo de fechas nulas o inválidas
- [x] Corregir problema con tareas iniciadas que no aparecen en la sección "En Progreso"
- [x] Mejorar la obtención de tareas en progreso para incluir tanto actividades como solicitudes

### 3. Mejora de Funcionalidades para Usuario Asignador (2 días)
- [x] Implementar funcionalidad para editar tareas como usuario asignador
  - [x] Crear componente EditarTarea.tsx para permitir la edición de solicitudes y tareas
  - [x] Implementar formulario con validación para editar campos de la tarea
  - [x] Conectar con la API para actualizar los datos de la tarea
- [x] Implementar funcionalidad para reasignar tareas a otros ejecutores
  - [x] Crear componente ReasignarTarea.tsx para permitir la reasignación de tareas
  - [x] Implementar selección de ejecutores disponibles
  - [x] Conectar con la API para actualizar el ejecutor asignado
- [x] Actualizar las rutas en App.tsx para incluir las nuevas páginas
- [x] Mejorar la navegación entre las páginas de detalle, edición y reasignación

### 4. Mejora de Dashboard para Usuario Solicitante (2 días)
- [x] Mejorar el dashboard de solicitante para mostrar valores reales
  - [x] Implementar actualización automática de datos al cargar el dashboard
  - [x] Añadir botón de recarga manual para actualizar los datos
  - [x] Optimizar la obtención de datos para evitar problemas de caché
  - [x] Mejorar la visualización de estadísticas con datos reales
  - [x] Implementar validación robusta para manejar respuestas de API vacías o erróneas
  - [x] Implementar carga forzada de estadísticas al iniciar el dashboard
  - [x] Mejorar el manejo de errores en las peticiones a la API
  - [x] Implementar actualización periódica de datos cada 30 segundos
  - [x] Reemplazar el cliente ky por fetch nativo para evitar problemas de caché

### 5. Mejora de la Sección de Historial de Tareas para Ejecutores (2 días)
- [x] Implementar informe detallado de tareas
  - [x] Crear componente modal TaskReportModal para mostrar información detallada
  - [x] Implementar visualización de historial completo de cambios de estado
  - [x] Añadir sección para mostrar comentarios asociados a la tarea
  - [x] Implementar visualización de archivos adjuntos con opción de descarga
  - [x] Incluir métricas de tiempo dedicado y fechas relevantes
  - [x] Mejorar la presentación de información del solicitante y asignador
- [x] Rediseñar el mensaje de aprobación
  - [x] Mejorar la coherencia visual con el sistema de badges implementado
  - [x] Optimizar el contraste y legibilidad del texto
  - [x] Implementar diseño más elegante y profesional
  - [x] Añadir iconos para mejorar la experiencia visual
  - [x] Mantener la información importante con presentación más armónica

### 6. Mejora de la Consistencia Visual de Botones y Filtros (1 día)
- [x] Crear componentes reutilizables para botones y filtros
  - [x] Implementar componente RefreshButton para botones de actualización
  - [x] Implementar componente FilterBadge para filtros con estilo de badge
  - [x] Añadir soporte para diferentes tamaños y variantes
  - [x] Implementar animaciones y efectos visuales coherentes
- [x] Actualizar componentes existentes para usar los nuevos componentes
  - [x] Modificar MisTareas.tsx para usar RefreshButton y FilterBadge
  - [x] Modificar ProgresoTareas.tsx para usar RefreshButton y FilterBadge
  - [x] Actualizar estilos para mantener coherencia con el sistema de badges
  - [x] Mejorar la experiencia visual con transiciones suaves
- [x] Implementar funcionalidades de filtrado mejoradas
  - [x] Añadir filtros de búsqueda, categoría y prioridad a la sección "En Progreso"
  - [x] Implementar mensaje informativo cuando no hay resultados que coincidan con los filtros
  - [x] Añadir botón para limpiar filtros cuando no se encuentran resultados
- [x] Asegurar responsividad y accesibilidad
  - [x] Verificar que los componentes se vean bien en diferentes tamaños de pantalla
  - [x] Implementar atributos aria para mejorar la accesibilidad
  - [x] Asegurar suficiente contraste para todos los elementos interactivos

## Sprint 17: Refactorización de Dashboards y Mejora de Interfaces por Rol

### Descripción del Sprint
Este sprint se enfocará en refactorizar la estructura de dashboards para eliminar la redundancia actual donde cada usuario ve dos dashboards (uno común y otro específico a su rol). El objetivo es crear una experiencia más coherente y personalizada para cada rol de usuario.

### Objetivos
- Eliminar la redundancia en los dashboards
- Crear un dashboard unificado basado en roles
- Simplificar la navegación
- Mejorar la experiencia de usuario
- Optimizar el rendimiento de carga de datos

### 1. Análisis y Planificación (2 días)

#### 1.1 Análisis de la estructura actual (1 día)
- [x] Documentar la estructura actual de dashboards y sus componentes
- [x] Identificar componentes duplicados y funcionalidades redundantes
- [x] Analizar las necesidades específicas de cada rol (SOLICITANTE, ASIGNADOR, EJECUTOR, ADMIN)
- [x] Crear diagramas de la estructura actual y la propuesta

#### 1.2 Diseño de la nueva arquitectura (1 día)
- [x] Diseñar la estructura del nuevo dashboard unificado
- [x] Definir qué componentes se mostrarán para cada rol
- [x] Crear mockups de la nueva interfaz
- [x] Documentar la estrategia de migración

### 2. Implementación del Dashboard Unificado (3 días)

#### 2.1 Crear componente de dashboard inteligente (1 día)
- [x] Implementar componente `SmartDashboard` que cargue contenido según el rol
- [x] Crear lógica para detectar el rol del usuario actual
- [x] Implementar sistema de secciones condicionales basadas en rol
- [x] Añadir soporte para personalización (opcional)

#### 2.2 Refactorizar componentes existentes (1 día)
- [x] Extraer lógica específica de cada rol en componentes reutilizables
- [x] Eliminar duplicación de código entre dashboards
- [x] Crear componentes de sección modulares (estadísticas, tareas pendientes, etc.)
- [x] Implementar sistema de configuración para mostrar/ocultar secciones

#### 2.3 Implementar secciones específicas por rol (1 día)
- [x] Implementar secciones para SOLICITANTE
  - [x] Resumen de solicitudes (pendientes, en proceso, completadas)
  - [x] Tiempos de respuesta
  - [x] Próximas fechas límite
  - [x] Solicitudes recientes
  - [x] Botón destacado para nueva solicitud
- [x] Implementar secciones para ASIGNADOR
  - [x] Bandeja de entrada de solicitudes pendientes
  - [x] Distribución de carga de trabajo
  - [x] Métricas de asignación
  - [x] Tareas por vencer
  - [x] Botón destacado para ver bandeja de entrada
  - [x] Mostrar datos reales en el dashboard
  - [x] Implementar notificaciones cuando una tarea es completada por un ejecutor
- [x] Implementar secciones para EJECUTOR
  - [x] Tareas asignadas y en progreso
  - [x] Calendario de vencimientos
  - [x] Progreso de tareas actuales
  - [x] Estadísticas de rendimiento
  - [x] Botón destacado para ver tareas asignadas
- [x] Implementar secciones para ADMIN
  - [x] Vista general del sistema
  - [x] Métricas globales
  - [x] Distribución de carga
  - [x] Actividad reciente
  - [x] Enlaces a configuración y reportes

### 3. Actualización de Rutas y Navegación (2 días)

#### 3.1 Simplificar estructura de rutas (1 día)
- [x] Actualizar `App.tsx` para usar el nuevo dashboard unificado
- [x] Eliminar rutas a dashboards específicos por rol
- [x] Mantener rutas específicas para otras funcionalidades
- [x] Implementar redirecciones para mantener compatibilidad con enlaces existentes

#### 3.2 Mejorar navegación lateral (1 día)
- [x] Actualizar `RoleBasedSidebar.tsx` para simplificar opciones de menú
- [x] Eliminar enlaces redundantes a dashboards específicos
- [x] Mantener solo el dashboard principal como punto de entrada
- [x] Mejorar la organización de opciones por rol

### 4. Mejoras Visuales y de Experiencia de Usuario (2 días)

#### 4.1 Mejorar diseño visual del dashboard (1 día)
- [x] Implementar tarjetas más grandes y visualmente atractivas para estadísticas
- [x] Crear sistema de colores coherente para indicadores
- [x] Añadir visualizaciones interactivas (gráficos, calendarios)
- [x] Mejorar la responsividad para diferentes tamaños de pantalla

#### 4.2 Implementar transiciones y animaciones (1 día)
- [x] Añadir transiciones suaves entre secciones
- [x] Implementar animaciones para carga de datos
- [x] Mejorar feedback visual para acciones del usuario
- [x] Optimizar rendimiento de animaciones

### 5. Pruebas y Optimización (2 días)

#### 5.1 Implementar pruebas (1 día)
- [ ] Crear pruebas unitarias para el nuevo dashboard
- [ ] Implementar pruebas de integración para verificar funcionalidad
- [ ] Realizar pruebas de rendimiento
- [ ] Verificar compatibilidad en diferentes navegadores

#### 5.2 Optimizar rendimiento (1 día)
- [ ] Implementar carga diferida de secciones
- [ ] Optimizar consultas de datos para cada sección
- [ ] Implementar caché para datos que cambian con poca frecuencia
- [ ] Medir y mejorar tiempos de carga

### 6. Documentación y Despliegue (1 día)
- [ ] Actualizar documentación técnica
- [ ] Crear guía de usuario para la nueva interfaz
- [ ] Actualizar CHANGELOG.md con los cambios realizados
- [ ] Preparar para despliegue en producción

### Criterios de Aceptación
- El dashboard unificado muestra contenido relevante según el rol del usuario
- No hay duplicación de información entre dashboards
- La navegación es clara e intuitiva
- El rendimiento es igual o mejor que la versión anterior
- Todos los roles pueden acceder a la información que necesitan
- La documentación está actualizada

## Sprint 9: Mejoras de Rendimiento y Experiencia de Usuario

### 0. Mejoras en el Sistema de Comentarios (3 días)
- [x] Implementar menciones a usuarios con @ en comentarios
  - [x] Crear endpoint para buscar usuarios por nombre o username
  - [x] Modificar el modelo de comentarios para incluir menciones
  - [x] Implementar detección y procesamiento de menciones en el backend
  - [x] Crear componente UserMentionSuggestions para mostrar sugerencias al escribir @
  - [x] Implementar servicio userSearchService para buscar usuarios
  - [x] Mejorar el componente de entrada de comentarios para detectar y procesar menciones
  - [x] Implementar visualización de menciones con resaltado en los comentarios
  - [x] Añadir botón específico para mencionar usuarios
  - [x] Crear tabla task_request_comment_mentions para almacenar menciones en comentarios
- [x] Implementar notificaciones para usuarios mencionados
  - [x] Crear modelo de notificación para menciones
  - [x] Implementar servicio de notificaciones para menciones
  - [x] Enviar notificaciones en tiempo real a usuarios mencionados
- [x] Mejorar la visualización de menciones
  - [x] Implementar avatares de usuario en las menciones
  - [x] Mejorar el estilo visual de las menciones
  - [x] Añadir tooltips con información del usuario
- [x] Implementar mención a todos los usuarios con @all
  - [x] Añadir opción @all en las sugerencias
  - [x] Implementar lógica para notificar a todos los participantes
- [x] Implementar sistema de permisos para menciones
  - [x] Crear servicio de permisos para controlar quién puede mencionar a quién
  - [x] Filtrar resultados de búsqueda según permisos
  - [x] Implementar reglas basadas en roles para menciones

### 1. Optimización de Rendimiento (3 días)

#### 1.1 Implementar virtualización para listas grandes (1 día)
- [x] Revisar el rendimiento de la virtualización actual con `@tanstack/react-virtual`
  - [x] Analizar el rendimiento con diferentes tamaños de listas (100, 500, 1000 elementos)
  - [x] Identificar cuellos de botella en el renderizado
  - [x] Medir tiempos de renderizado y desplazamiento
- [x] Optimizar los parámetros de virtualización
  - [x] Ajustar el valor de `overscan` a 10 para mejorar el desplazamiento fluido
  - [x] Reemplazar `itemHeight` fijo por `estimateSize` configurable
  - [x] Optimizar el cálculo de tamaños para reducir reflows
- [x] Implementar medición dinámica de altura de elementos
  - [x] Crear sistema de medición dinámica con ResizeObserver
  - [x] Implementar cache de mediciones para mejorar rendimiento
  - [x] Añadir prop `dynamicSize` a los componentes VirtualList y VirtualGrid
- [x] Unificar implementaciones de virtualización
  - [x] Eliminar la versión JavaScript de VirtualList
  - [x] Mejorar la implementación TypeScript con nuevas funcionalidades
  - [x] Crear pruebas de rendimiento para validar mejoras
- [x] Aplicar virtualización a todas las listas de la aplicación
  - [x] Identificar componentes adicionales que se beneficiarían de la virtualización
  - [x] Implementar virtualización en listas de notificaciones
  - [x] Crear componente InfiniteVirtualList para carga paginada
  - [x] Documentar componentes y mejores prácticas

#### 1.2 Optimizar carga de imágenes con lazy loading (0.5 días)
- [x] Identificar todas las imágenes en la aplicación
- [x] Implementar atributos `loading="lazy"` en imágenes
- [x] Crear componente `LazyImage` para casos más complejos
- [x] Implementar carga progresiva de imágenes con efectos de desvanecimiento

#### 1.3 Implementar estrategias de code splitting adicionales (0.5 días)
- [ ] Revisar y optimizar los puntos de división actuales
- [ ] Implementar code splitting basado en rutas
- [ ] Implementar code splitting basado en características
- [ ] Configurar prefetching para rutas comunes

#### 1.4 Optimizar bundle size con análisis de dependencias (1 día)
- [ ] Ejecutar análisis de bundle con `rollup-plugin-visualizer`
- [ ] Identificar dependencias grandes o innecesarias
- [ ] Implementar tree-shaking para reducir el tamaño del bundle
- [ ] Considerar el uso de versiones más ligeras de bibliotecas

### 2. Mejoras de Experiencia de Usuario (4 días)

#### 2.1 Implementar skeleton loaders para mejorar la percepción de velocidad (1 día)
- [x] Revisar y mejorar los skeleton loaders existentes
- [x] Implementar skeleton loaders para todas las páginas y componentes principales
- [x] Asegurar que los skeleton loaders reflejen la estructura real de los componentes
- [x] Implementar animaciones suaves para los skeleton loaders

#### 2.2 Implementación de Interfaz para Roles Específicos (3 días)
- [x] Diseñar e implementar interfaz para SOLICITANTES
  - [x] Crear vista específica para solicitar nuevas tareas
  - [x] Implementar formulario adaptado para solicitudes con campos relevantes
  - [x] Desarrollar panel de seguimiento de solicitudes enviadas
  - [x] Implementar filtros específicos para solicitudes (por estado, fecha, etc.)
  - [x] Añadir notificaciones específicas para cambios en solicitudes
- [x] Diseñar e implementar interfaz para ASIGNADORES
  - [x] Crear bandeja de entrada para nuevas solicitudes pendientes de asignación
  - [x] Implementar vista de distribución de carga de trabajo del equipo
  - [x] Desarrollar herramienta de asignación con arrastrar y soltar
  - [x] Añadir panel de métricas de asignación y rendimiento
  - [x] Implementar sistema de priorización visual de tareas
  - [x] Mejorar la interfaz de asignación con scroll vertical para listas largas de ejecutores
  - [x] Mejorar la consistencia visual con fondos oscuros para elementos informativos
  - [x] Optimizar el contraste en los selectores de ejecutores
- [x] Diseñar e implementar interfaz para EJECUTORES
  - [x] Crear vista de tareas asignadas con filtros por prioridad y fecha límite
  - [x] Implementar panel de progreso de tareas actuales
  - [x] Desarrollar formulario para reportar avances y completar tareas
  - [x] Añadir sistema de notificaciones para nuevas asignaciones y fechas límite
  - [x] Implementar vista de historial de tareas completadas
- [x] Implementar sistema de navegación adaptativo según rol
  - [x] Crear menú lateral dinámico que muestre opciones según el rol del usuario
  - [x] Implementar redirección inteligente al dashboard específico según rol
  - [x] Desarrollar componente de cambio rápido entre roles para usuarios con múltiples roles
  - [x] Añadir indicadores visuales del rol activo en la interfaz

#### 2.3 Implementar notificaciones toast para acciones del usuario (1 día)
- [x] Revisar y mejorar el sistema de notificaciones existente
- [x] Asegurar que todas las acciones importantes del usuario tengan notificaciones
- [x] Implementar diferentes tipos de notificaciones (éxito, error, advertencia, información)
- [x] Mejorar la accesibilidad de las notificaciones

### 3. Pruebas Automatizadas (3 días)

#### 3.1 Implementar pruebas unitarias para los componentes principales (1 día)
- [x] Configurar Jest y React Testing Library
- [x] Implementar pruebas para componentes comunes
- [x] Implementar pruebas para hooks personalizados
- [x] Implementar pruebas para funciones de utilidad
- [x] Implementar pruebas unitarias para la capa de dominio
  - [x] Creación de ActivityExtendedTest para probar los métodos de cambio de estado
  - [x] Implementación de ActivityStateTest para probar el patrón State y las transiciones entre estados
  - [x] Creación de ActivityStatusNewTest para probar la enumeración y sus métodos
- [x] Implementar pruebas unitarias para la capa de aplicación
  - [x] Implementación de ActivityWorkflowServiceTest para probar el servicio de flujo de trabajo
  - [x] Pruebas para verificar el comportamiento correcto de las transiciones de estado
  - [x] Pruebas para verificar el manejo de errores y excepciones

#### 3.2 Implementar pruebas de integración para los flujos críticos (1 día)
- [x] Identificar los flujos críticos de la aplicación
- [x] Implementar pruebas para el flujo de autenticación
- [x] Implementar pruebas para el flujo de gestión de actividades
  - [x] Creación de ActivityWorkflowControllerTest para probar los endpoints REST
  - [x] Implementación de ActivityWorkflowIntegrationTest para probar el flujo completo
  - [x] Creación de ActivityWorkflowIntegrationTestNew con enfoque simplificado para pruebas
  - [x] Implementación de ActivityRepositoryMock para pruebas sin dependencia de base de datos
- [x] Implementar pruebas para el flujo de filtrado y búsqueda
- [x] Implementar pruebas de integración para los adaptadores
- [x] Implementar pruebas de integración para los controladores

#### 3.3 Configurar CI/CD para ejecutar pruebas automáticamente (1 día)
- [ ] Configurar GitHub Actions para ejecutar pruebas en cada push
- [ ] Configurar informes de cobertura de pruebas
- [ ] Configurar pruebas de accesibilidad automatizadas
- [ ] Configurar pruebas de rendimiento automatizadas

### 4. Limpieza y Optimización (2 días)
- [x] Eliminar sistema de datos simulados (mock)
- [x] Eliminar hook useMockData y todas sus referencias
- [ ] Optimizar manejo de errores para mostrar mensajes más específicos
- [x] Solucionar problemas de generación de tipos TypeScript desde OpenAPI
  - [x] Crear scripts compatibles con Git Bash para generación de OpenAPI
  - [x] Implementar solución para crear archivo OpenAPI manualmente
  - [x] Actualizar scripts de inicio para soportar diferentes entornos

### 5. Mejoras de Calidad de Código (2 días)

#### 5.1 Corregir advertencias de Checkstyle (1 día)
- [x] Corregir parámetros que deberían ser declarados como `final`
  - [x] Corregido en ApiError.java
  - [x] Corregido en ErrorCode.java
  - [x] Corregido en InvalidTokenException.java
  - [x] Corregido en ResourceNotFoundException.java
  - [x] Corregido en NotificationAdapter.java
  - [x] Corregido en WebSocketController.java
  - [x] Corregido en UserSessionAdapter.java
  - [x] Corregido en Password.java
  - [x] Corregido en Permission.java
  - [x] Corregido en PersonName.java (también declarada como clase final)
  - [x] Corregido en User.java
  - [x] Corregido en UserRole.java
  - [x] Corregido en ActivitySpecifications.java
  - [x] Corregido en WebConfig.java
  - [x] Corregido en WebSocketAuthenticationConfig.java
  - [x] Corregido en JwtAuthenticationFilter.java
  - [x] Corregido en AbstractActivityState.java
  - [x] Corregido en ActivityStateFactory.java (también declarada como clase final)
  - [x] Corregido en RequestedState.java
  - [x] Corregido en AssignedState.java
  - [x] Corregido en InProgressState.java
  - [x] Corregido en CompletedState.java
  - [x] Corregido en AbstractValueObject.java
  - [x] Corregido en ValueObject.java (añadido Javadoc)
  - [x] Corregido en UserSession.java
  - [x] Corregido en ActivityHistory.java
  - [x] Corregido en ActivityPriority.java
  - [x] Corregido en ActivityStatus.java
  - [x] Corregido en ActivityStatusNew.java
  - [x] Corregido en ActivityType.java
- [x] Corregir problemas de formato de código (operadores en nuevas líneas)
  - [x] Corregido en User.java para colocar operadores || en nuevas líneas
  - [x] Corregido en Permission.java para colocar operadores || en nuevas líneas
  - [x] Corregido en PersonName.java para colocar operadores && en nuevas líneas
  - [x] Corregido en UserRole.java para colocar operadores || en nuevas líneas
- [x] Corregir clases de utilidad con constructores públicos
  - [x] Corregido GenerateEmployeePasswords.java para hacerla final y con constructor privado
  - [x] Corregido GeneratePassword.java para hacerla final y con constructor privado
  - [x] Corregido PasswordHashGenerator.java para hacerla final y con constructor privado
- [x] Corregir importaciones no utilizadas o con comodín
  - [x] Corregido ActuatorConfig.java para reemplazar import org.springframework.boot.actuate.endpoint.web.* con importaciones específicas
  - [x] Corregido UserMapper.java para reemplazar import com.bitacora.domain.model.user.* con importaciones específicas
- [x] Corregir problemas de longitud de línea
  - [x] Corregido ActuatorConfig.java para dividir expresiones condicionales largas en variables intermedias
  - [x] Corregido DeadlineReminderService.java para extraer variables intermedias en la creación de notificaciones
  - [x] Corregido OpenApiGenerator.java para dividir la creación de esquemas en variables intermedias
- [x] Corregir problemas de documentación Javadoc
  - [x] Corregido Email.java para hacerla final y añadir modificadores final a los parámetros de métodos
  - [x] Corregido Password.java para hacerla final
- [x] Corregir números mágicos
  - [x] Corregido CacheConfig.java para extraer constantes para valores de configuración de caché
  - [x] Corregido WebConfig.java para extraer constante para el tiempo máximo de caché CORS
  - [x] Corregido WebSocketAuthenticationConfig.java para extraer constante para la longitud del prefijo Bearer
  - [x] Corregido JwtAuthenticationFilter.java para extraer constante para la longitud del prefijo Bearer
  - [x] Corregido GenerateEmployeePasswords.java para extraer constantes para los números de legajo inicial y final

#### 5.2 Corregir problemas de generación de OpenAPI (1 día)
- [x] Investigar y corregir el error en la generación de tipos TypeScript
- [x] Asegurar que el archivo openapi.json se genere correctamente
- [x] Verificar la configuración del plugin openapi-generator-maven-plugin
- [x] Implementar una solución alternativa si es necesario

#### 5.3 Resolver conflictos de controladores (0.5 días)
- [x] Resolver conflicto de beans entre controladores de autenticación
- [x] Renombrar y reorganizar controladores de autenticación para evitar conflictos
- [x] Consolidar controladores de autenticación en una única implementación
- [x] Eliminar controladores obsoletos

Solución implementada:
1. Se ha mantenido `com.bitacora.infrastructure.rest.controller.AuthController` como el controlador principal en `/api/auth`
2. Se ha actualizado `com.bitacora.infrastructure.rest.RootAuthController` para que utilice el servicio `AuthService` en lugar de implementar la lógica directamente
3. Se han eliminado los controladores obsoletos `com.bitacora.infrastructure.rest.OldAuthController` y `com.bitacora.infrastructure.rest.LegacyAuthController`
4. Se han consolidado los DTOs, utilizando los nuevos DTOs en `com.bitacora.infrastructure.rest.dto.auth.*`

## Sprint 10: Sistema de Notificaciones Avanzado (2 semanas)

### Objetivos del Sprint
- Implementar notificaciones en tiempo real para tareas administrativas
- Mejorar la colaboración del equipo mediante alertas contextuales
- Optimizar la gestión de sesiones y seguridad
- Facilitar la comunicación interna mediante anuncios

### Historias de Usuario

#### Historia 1: Notificaciones de Cambios en Tareas (5 puntos)
**Como** miembro del equipo administrativo
**Quiero** recibir notificaciones cuando se me asigne una tarea o cambie su estado
**Para** estar al tanto de mis responsabilidades y el progreso del trabajo

**Tareas:**
- [x] Implementar `TaskAssignmentNotification` en el backend
- [x] Implementar `TaskStatusChangeNotification` en el backend
- [x] Crear eventos de dominio para disparar estas notificaciones
- [x] Adaptar el frontend para mostrar estos tipos específicos de notificaciones
- [x] Añadir acciones rápidas en las notificaciones (ver tarea, marcar como leída)

#### Historia 2: Sistema de Recordatorios de Plazos (4 puntos)
**Como** miembro del equipo administrativo
**Quiero** recibir recordatorios automáticos de fechas límite
**Para** no olvidar plazos importantes

**Tareas:**
- [x] Implementar `DeadlineReminderNotification` en el backend
- [x] Crear servicio programado para verificar tareas próximas a vencer
- [x] Configurar recordatorios escalonados (1 día, 4 horas, 1 hora, 10 minutos antes)
- [x] Adaptar el frontend para destacar visualmente estos recordatorios
- [x] Implementar opción para posponer o descartar recordatorios

#### Historia 3: Gestión de Sesiones Múltiples (3 puntos)
**Como** usuario del sistema
**Quiero** ver y gestionar mis sesiones activas
**Para** mantener la seguridad de mi cuenta

**Tareas:**
- [ ] Mejorar el servicio de sesiones para detectar nuevos inicios de sesión
- [ ] Implementar notificaciones de nueva sesión y actividad sospechosa
- [ ] Crear alerta de expiración de sesión por inactividad con opción de extensión
- [ ] Mejorar la página de gestión de sesiones con actualización en tiempo real
- [ ] Añadir opción de cierre remoto de sesiones desde el panel

#### Historia 4: Sistema de Anuncios y Comunicados (4 puntos)
**Como** administrador o jefe de departamento
**Quiero** enviar anuncios y comunicados a mi equipo
**Para** mantener a todos informados sobre eventos importantes

**Tareas:**
- [x] Implementar `AnnouncementNotification` en el backend
- [x] Crear interfaz de administración para enviar anuncios
- [x] Implementar filtrado por departamento para anuncios específicos
- [x] Añadir soporte para anuncios programados (eventos futuros)
- [x] Crear sección dedicada a anuncios en el centro de notificaciones

#### Historia 5: Colaboración en Tiempo Real (3 puntos)
**Como** miembro del equipo administrativo
**Quiero** saber quién está trabajando en la misma tarea que yo
**Para** evitar conflictos y facilitar la colaboración

**Tareas:**
- [x] Implementar `CollaborationNotification` en el backend
- [x] Crear sistema de presencia para detectar usuarios viendo/editando tareas
- [x] Mostrar indicadores visuales de presencia en la interfaz de tareas
- [x] Implementar notificaciones de edición simultánea
- [x] Añadir sistema de comentarios en tiempo real

#### Historia 6: Personalización de Notificaciones (2 puntos)
**Como** usuario del sistema
**Quiero** personalizar qué notificaciones recibo y cómo
**Para** reducir distracciones y centrarme en lo importante

**Tareas:**
- [x] Crear panel de preferencias de notificaciones
- [x] Implementar opciones de activación/desactivación por tipo
- [x] Añadir configuración de métodos de entrega
- [x] Implementar niveles de urgencia configurables

### Tareas Técnicas

#### Tarea 1: Refactorización del Modelo de Notificaciones (2 puntos)
- [x] Crear jerarquía de clases para los diferentes tipos de notificaciones
- [x] Implementar serialización/deserialización adecuada para WebSockets

#### Tarea 2: Mejora del Centro de Notificaciones (3 puntos)
- [x] Rediseñar la interfaz para soportar categorización
- [x] Implementar filtros y búsqueda de notificaciones
- [x] Añadir visualización especializada por tipo de notificación

#### Tarea 3: Publicación de Eventos de Dominio (2 puntos)
- [x] Implementar `ApplicationEventPublisher` para eventos de dominio
- [x] Crear servicio `ActivityService` para publicar eventos de actividades
- [x] Implementar eventos para cambios de estado de actividades
- [x] Configurar listeners para procesar eventos asíncronamente
- [x] Documentar el flujo de eventos en el sistema

#### Tarea 4: Optimización de WebSockets (2 puntos)
- [x] Completar la implementación real de WebSockets en el frontend
- [x] Implementar reconexión automática mejorada
  - [x] Implementar sistema de reintentos con backoff exponencial
  - [x] Detectar desconexiones y reconectar automáticamente
  - [x] Implementar sistema de heartbeat para detectar conexiones zombies
  - [x] Sincronizar el estado después de una reconexión
- [x] Mejorar manejo de errores en las solicitudes WebSocket
  - [x] Mostrar notificaciones al usuario cuando se pierde la conexión
  - [x] Implementar sistema de cola para mensajes no enviados
- [x] Añadir compresión de mensajes para optimizar rendimiento
  - [x] Implementar compresión automática de mensajes grandes
  - [x] Añadir soporte para diferentes niveles de compresión
  - [x] Crear interfaz para configurar y monitorear la compresión

### Definición de Terminado
- Código implementado y revisado
- Pruebas unitarias y de integración pasando
- Documentación actualizada
- Funcionalidad verificada en entorno de pruebas
- Revisión de UX completada

## Sprint 11: Mejoras Avanzadas del Sistema de Actividades (3 semanas)

### 0. Mejoras de Componentes UI (1 día)
- [x] Crear componentes reutilizables para píldoras de estado y tipo
  - [x] Implementar componente StatusBadge en components/ui
  - [x] Implementar componente TypeBadge en components/ui
  - [x] Unificar estilos para mantener consistencia visual
  - [x] Actualizar componentes existentes para usar los nuevos componentes
- [x] Refactorizar componentes que utilizan píldoras
  - [x] Actualizar ActivityList para usar los nuevos componentes
  - [x] Actualizar ExpandableActivityDetail para usar los nuevos componentes
  - [x] Actualizar ColorTest para usar los nuevos componentes
  - [x] Eliminar código duplicado en múltiples archivos

## Sprint 11: Mejoras Avanzadas del Sistema de Actividades (continuación)

### Objetivos del Sprint
- Mejorar la experiencia de usuario en la gestión de actividades
- Optimizar el rendimiento del sistema para manejar grandes volúmenes de datos
- Implementar nuevas funcionalidades para enriquecer la gestión de actividades
- Mejorar la colaboración en tiempo real entre usuarios

### 1. Mejoras en la Experiencia de Usuario (1 semana)

#### 1.1 Implementación de Filtros Avanzados (2 días)
- [x] Diseñar e implementar interfaz de filtros avanzados
  - [x] Añadir filtros por rango de fechas con selección visual
  - [x] Implementar filtros por múltiples tipos y estados
  - [x] Añadir filtros por usuario asignado y departamento
- [x] Implementar guardado de filtros favoritos
  - [x] Crear componente para guardar configuraciones de filtros
  - [x] Implementar persistencia de filtros en localStorage
  - [x] Añadir funcionalidad para aplicar/eliminar filtros guardados
- [x] Crear filtros rápidos predefinidos
  - [x] Implementar filtro "Mis actividades"
  - [x] Implementar filtro "Pendientes hoy"
  - [x] Implementar filtro "Próximas a vencer"

#### 1.2 Implementación de Vista de Calendario (3 días)
- [x] Desarrollar componente de calendario para actividades
  - [x] Implementar vista mensual con indicadores de actividades
  - [x] Implementar vista semanal detallada
  - [x] Implementar vista de agenda por día
  - [x] Corregir problema de carga de actividades usando el hook correcto (useActivitiesQuery)
  - [x] Adaptar el componente al formato de datos recibido del backend ({activities: [...]} en lugar de {content: [...]})
  - [x] Añadir botón para actualizar manualmente las actividades
  - [x] Añadir tooltip con detalles al pasar el cursor sobre actividades
  - [x] Mejorar navegación al hacer clic en una actividad para ir directamente a su detalle
  - [x] Corregir error 404 al hacer clic en actividades del calendario (actualizar ruta de navegación)
  - [x] Asegurar que el listado de actividades esté ordenado con las más recientes primero
  - [x] Agregar leyenda con referencias de colores
  - [x] Mejorar estilos de botones en la barra de herramientas para mantener consistencia visual
  - [x] Mejorar estilos del tooltip y leyenda para mantener consistencia con el resto de la aplicación
- [x] Añadir funcionalidad de arrastrar y soltar
  - [x] Permitir cambiar fechas arrastrando actividades
  - [x] Implementar actualización en tiempo real al mover actividades
  - [x] Añadir confirmación para cambios de fecha
  - [x] Corregir problemas con la API de arrastrar y soltar de HTML5
  - [x] Mejorar la retroalimentación visual durante el arrastre
  - [x] Corregir error de notificaciones usando el hook useToast en lugar de showNotification
  - [x] Implementar actualización real de actividades en el backend
  - [x] Corregir las URLs de la API para incluir el prefijo '/api'
  - [x] Corregir el formato de fecha para compatibilidad con LocalDateTime en el backend
  - [x] Implementar actualización optimista en la interfaz de usuario
  - [x] Reemplazar el popup nativo por un diálogo de confirmación personalizado
- [x] Integrar con el sistema de filtros
  - [x] Aplicar filtros activos a la vista de calendario
  - [x] Implementar visualización por categorías/tipos

#### 1.3 Mejoras en Formularios de Actividades (2 días)
- [x] Implementar autoguardado de borradores
  - [x] Crear sistema de guardado automático en localStorage
  - [x] Añadir recuperación de borradores al abrir formulario
  - [x] Implementar gestión de múltiples borradores
  - [x] Reemplazar sistema manual de borradores por autoguardado inteligente en formularios de solicitudes
  - [x] Implementar guardado automático después de 3 segundos de inactividad
  - [x] Añadir indicador visual sutil de autoguardado
- [x] Desarrollar sistema de plantillas
  - [x] Crear interfaz para guardar actividades como plantillas
  - [x] Implementar selector de plantillas al crear actividades
  - [x] Añadir gestión de plantillas (CRUD)
  - [x] Corregir problemas de visualización de botones de plantillas
  - [x] Mejorar estilos de botones para mayor consistencia visual
- [x] Mejorar validación y asistencia
  - [x] Implementar sugerencias contextuales en campos
  - [x] Añadir validación en tiempo real con mensajes específicos
  - [x] Implementar autocompletado para campos comunes

### 2. Optimización de Rendimiento (1 semana)

#### 2.1 Mejoras en el Backend (3 días)
- [ ] Optimizar consultas de base de datos
  - [ ] Implementar índices adicionales en tablas críticas
  - [ ] Refactorizar consultas para usar proyecciones específicas
  - [ ] Implementar caché de segundo nivel en Hibernate
- [ ] Implementar paginación con cursor
  - [ ] Refactorizar repositorio para soportar paginación con cursor
  - [ ] Actualizar endpoints de API para soportar nuevos parámetros
  - [ ] Adaptar frontend para utilizar paginación con cursor
- [ ] Optimizar carga de datos relacionados
  - [ ] Implementar carga diferida (lazy loading) para relaciones
  - [ ] Añadir parámetros para incluir/excluir datos relacionados
  - [ ] Optimizar serialización JSON para reducir tamaño de respuestas

#### 2.2 Mejoras en el Frontend (2 días)
- [ ] Optimizar renderizado de componentes
  - [ ] Implementar React.memo para componentes puros
  - [ ] Optimizar uso de useCallback y useMemo
  - [ ] Refactorizar componentes con muchos re-renderizados
- [ ] Mejorar estrategias de caché
  - [ ] Configurar políticas de caché óptimas en React Query
  - [ ] Implementar prefetching inteligente de datos
  - [ ] Optimizar invalidación de caché para actualizaciones
- [ ] Implementar técnicas avanzadas de virtualización
  - [ ] Mejorar componentes virtualizados existentes
  - [ ] Implementar virtualización para todas las listas grandes
  - [ ] Añadir soporte para elementos de altura variable

#### 2.3 Monitoreo y Análisis de Rendimiento (2 días)
- [ ] Implementar métricas de rendimiento
  - [ ] Configurar Micrometer para métricas en backend
  - [ ] Implementar Web Vitals para métricas en frontend
  - [ ] Crear dashboard para visualización de métricas
- [ ] Configurar alertas de rendimiento
  - [ ] Definir umbrales para tiempos de respuesta
  - [ ] Configurar notificaciones para degradación de rendimiento
  - [ ] Implementar registro detallado para análisis

### 3. Nuevas Funcionalidades (1 semana)

#### 3.1 Sistema de Comentarios en Actividades (2 días)
- [x] Implementar modelo de datos para comentarios
  - [x] Crear entidad Comment y relaciones necesarias
  - [x] Implementar repositorio y servicios para comentarios
  - [x] Desarrollar endpoints REST para gestión de comentarios
- [x] Desarrollar interfaz de usuario para comentarios
  - [x] Crear componente de lista de comentarios
  - [x] Implementar formulario para añadir comentarios
  - [x] Añadir funcionalidad de edición y eliminación
- [x] Implementar menciones a usuarios
  - [x] Desarrollar selector de usuarios con @
  - [x] Implementar resaltado de menciones
  - [x] Configurar notificaciones para usuarios mencionados
- [x] Implementar sistema de comentarios para asignadores
  - [x] Crear componente CommentSection reutilizable
  - [x] Implementar servicio commentService para interactuar con la API
  - [x] Crear hook useComments para gestionar el estado de los comentarios
  - [x] Implementar página DetalleTarea para asignadores

#### 3.2 Sistema de Etiquetas y Categorización (2 días)
- [ ] Implementar modelo de datos para etiquetas
  - [ ] Crear entidad Tag y relaciones con Activity
  - [ ] Desarrollar repositorio y servicios para etiquetas
  - [ ] Implementar endpoints REST para gestión de etiquetas
- [ ] Desarrollar interfaz de usuario para etiquetas
  - [ ] Crear componente selector de etiquetas
  - [ ] Implementar gestión de etiquetas (CRUD)
  - [ ] Añadir filtrado por etiquetas en listado de actividades
- [ ] Implementar categorías jerárquicas
  - [ ] Desarrollar modelo para categorías con jerarquía
  - [ ] Crear interfaz para gestionar estructura de categorías
  - [ ] Implementar visualización jerárquica en filtros

#### 3.3 Exportación e Importación de Datos (3 días)
- [ ] Implementar exportación de actividades
  - [ ] Desarrollar exportación a Excel con Apache POI
  - [ ] Implementar exportación a PDF con JasperReports
  - [ ] Añadir exportación a CSV para compatibilidad
- [ ] Desarrollar importación masiva
  - [ ] Crear plantilla de Excel para importación
  - [ ] Implementar validación de datos importados
  - [ ] Desarrollar proceso de importación con manejo de errores
- [ ] Implementar generación de informes
  - [ ] Crear plantillas de informes personalizables
  - [ ] Desarrollar interfaz para configurar informes
  - [ ] Implementar programación de informes periódicos

### 4. Colaboración en Tiempo Real (3 días)

#### 4.1 Mejoras en WebSockets (2 días)
- [ ] Optimizar infraestructura WebSocket
  - [ ] Implementar manejo de reconexión mejorado
  - [ ] Añadir compresión de mensajes para optimizar rendimiento
  - [ ] Mejorar autenticación y seguridad en WebSockets
- [ ] Implementar indicadores de presencia
  - [ ] Desarrollar sistema para detectar usuarios viendo actividades
  - [ ] Crear componente visual de indicador de presencia
  - [ ] Implementar notificaciones de usuarios editando simultáneamente

#### 4.2 Notificaciones en Tiempo Real (1 día)
- [ ] Mejorar sistema de notificaciones para actividades
  - [ ] Implementar notificaciones para cambios en actividades asignadas
  - [ ] Añadir notificaciones para menciones en comentarios
  - [ ] Desarrollar centro de notificaciones mejorado

### Definición de Terminado
- Código implementado y revisado
- Pruebas unitarias y de integración pasando
- Documentación actualizada
- Funcionalidad verificada en entorno de pruebas
- Revisión de UX completada

## Sprint 12: Refactorización de Arquitectura y Solución de Problemas de Plantillas (2 semanas)

### Descripción del Sprint
Este sprint se enfocará en refactorizar la arquitectura del frontend para resolver los problemas de duplicación de archivos, inconsistencias en la estructura y el problema específico de las plantillas que no se están mostrando correctamente.

### Objetivos
- Consolidar archivos duplicados
- Completar la migración a TypeScript
- Reorganizar la estructura de carpetas
- Mejorar la gestión de estado
- Resolver el problema específico de las plantillas
- Documentar la nueva arquitectura

### Fase 1: Consolidación de archivos duplicados (3 días)
- [x] 1.1 Identificar qué versiones de los archivos duplicados se están utilizando realmente
- [x] 1.2 Eliminar las versiones no utilizadas
- [x] 1.3 Actualizar todas las importaciones para que apunten a los archivos correctos
- [x] 1.4 Verificar que la aplicación siga funcionando correctamente

### Fase 2: Migración a TypeScript (2 días)
- [x] 2.1 Convertir los archivos .jsx restantes a .tsx (En progreso - 5 de 32 archivos convertidos)
- [x] 2.2 Añadir tipos e interfaces para todos los componentes (En progreso - Tipos para temas y colores implementados)
- [x] 2.3 Configurar ESLint y Prettier para mantener la consistencia del código

### Fase 3: Reorganización de la estructura de carpetas (3 días)
- [x] 3.1 Crear la nueva estructura de carpetas según la arquitectura propuesta
- [x] 3.2 Mover los componentes a sus ubicaciones correctas
- [x] 3.3 Actualizar todas las importaciones
- [x] 3.4 Crear archivos de barril (index.ts) para simplificar las importaciones

### Fase 4: Mejora de la gestión de estado (2 días)
- [x] 4.1 Consolidar la gestión de estado global con Redux
- [x] 4.2 Implementar React Query para la gestión de datos del servidor
- [x] 4.3 Extraer lógica en hooks personalizados

### Fase 5: Solución del problema de las plantillas (2 días)
- [x] 5.1 Consolidar los archivos ActivityForm.tsx en uno solo
- [x] 5.2 Verificar que los componentes de plantillas se estén importando correctamente
- [x] 5.3 Revisar los estilos para asegurarse de que los componentes sean visibles
- [x] 5.4 Implementar un sistema de depuración para verificar que los componentes se estén renderizando

### Fase 6: Documentación y pruebas (2 días)
- [x] 6.1 Documentar la nueva arquitectura
- [x] 6.2 Añadir comentarios JSDoc a componentes y funciones clave
- [x] 6.3 Implementar pruebas unitarias y de integración
- [x] 6.4 Actualizar el README.md con la nueva estructura y convenciones

### Criterios de aceptación
- No hay archivos duplicados en el proyecto
- Todos los archivos están en TypeScript
- La estructura de carpetas sigue la arquitectura propuesta
- La funcionalidad de plantillas funciona correctamente
- La aplicación funciona sin errores
- La documentación está actualizada

## Sprint 14: Mejoras de Robustez y Experiencia de Usuario (2 semanas)

### Descripción del Sprint
Este sprint se enfocará en mejorar la robustez del sistema, optimizar el manejo de errores, mejorar el rendimiento y la experiencia de usuario, basado en el análisis detallado del sistema actual.

### Objetivos
- Implementar un manejo de errores más robusto
- Optimizar el rendimiento del sistema
- Mejorar la seguridad
- Mejorar la experiencia de usuario
- Implementar pruebas automatizadas
- Mejorar la arquitectura y mantenibilidad

### 0. Correcciones de Funcionalidad (1 día)
- [x] Implementar endpoint para que los ejecutores puedan ver sus tareas asignadas
  - [x] Crear endpoint `/api/task-requests/assigned-to-executor` en el backend
  - [x] Implementar métodos en el servicio y repositorio para buscar por executorId
  - [x] Actualizar el frontend para mostrar las tareas asignadas a un ejecutor
  - [x] Integrar con el sistema de tareas existente

### 1. Manejo de Errores y Resiliencia (3 días)

#### 1.1 Implementar manejo de excepciones robusto en el backend (1 día)
- [ ] Crear clases de excepción específicas para diferentes tipos de errores
- [ ] Implementar un manejador global de excepciones con mensajes detallados
- [ ] Añadir logging estructurado para facilitar el diagnóstico de problemas
- [ ] Implementar respuestas de error estandarizadas con códigos y mensajes claros

#### 1.2 Mejorar el manejo de errores en el frontend (1 día)
- [ ] Implementar interceptores para manejar diferentes tipos de errores HTTP
- [ ] Crear componentes de error específicos para diferentes situaciones
- [ ] Mejorar los mensajes de error para que sean más informativos y útiles
- [ ] Implementar fallbacks para componentes que fallan

#### 1.3 Implementar política de reintentos para peticiones críticas (1 día)
- [ ] Crear un sistema de reintentos con backoff exponencial
- [ ] Implementar almacenamiento temporal de operaciones fallidas
- [ ] Añadir sincronización cuando se recupera la conexión
- [ ] Implementar notificaciones para operaciones en segundo plano

### 2. Rendimiento y Optimización (3 días)

#### 2.1 Implementar caché en el frontend (1 día)
- [ ] Configurar React Query para optimizar la caché de datos
- [ ] Implementar estrategias de staleTime y cacheTime específicas por recurso
- [ ] Añadir prefetching para mejorar la experiencia de navegación
- [ ] Implementar caché en localStorage para datos que cambian con poca frecuencia

#### 2.2 Optimizar consultas en el backend (1 día)
- [ ] Revisar y optimizar consultas SQL con explicación de planes
- [ ] Implementar proyecciones específicas para cada caso de uso
- [ ] Añadir índices para mejorar el rendimiento de consultas frecuentes
- [ ] Implementar caché de segundo nivel en Hibernate

#### 2.3 Implementar paginación consistente (1 día)
- [ ] Estandarizar la paginación en todos los endpoints
- [ ] Implementar paginación con cursor para grandes conjuntos de datos
- [ ] Optimizar la carga de datos relacionados con estrategias de fetch
- [ ] Añadir soporte para ordenamiento dinámico

### 3. Seguridad (2 días)

#### 3.1 Revisar y consolidar el sistema de permisos (1 día)
- [ ] Auditar los permisos actuales y su asignación
- [ ] Crear script para asegurar que todos los usuarios tengan los permisos correctos
- [ ] Implementar validación de permisos en el cliente para mejorar UX
- [ ] Documentar la matriz de permisos y roles

#### 3.2 Mejorar la seguridad general (1 día)
- [ ] Implementar sanitización de logs para datos sensibles
- [ ] Mejorar la validación de datos de entrada en todos los endpoints
- [ ] Implementar protección contra ataques comunes (XSS, CSRF)
- [ ] Revisar y actualizar las dependencias con vulnerabilidades

### 4. Experiencia de Usuario (3 días)

#### 4.1 Mejorar los mensajes de error (1 día)
- [ ] Crear un sistema centralizado de mensajes de error amigables
- [ ] Implementar diferentes niveles de detalle según el contexto
- [ ] Añadir sugerencias de solución para errores comunes
- [ ] Mejorar la accesibilidad de los mensajes de error

#### 4.2 Implementar indicadores de carga más detallados (1 día)
- [ ] Crear componentes de carga específicos para diferentes operaciones
- [ ] Implementar indicadores de progreso para operaciones largas
- [ ] Añadir animaciones suaves para mejorar la percepción de velocidad
- [ ] Implementar carga optimista para operaciones comunes

#### 4.3 Estandarizar la presentación de datos (1 día)
- [ ] Crear componentes reutilizables para mostrar estados, prioridades, etc.
- [ ] Implementar un sistema de iconos consistente
- [ ] Estandarizar los formatos de fecha y hora en toda la aplicación
- [ ] Mejorar el contraste y legibilidad de las etiquetas (pills)

### 5. Pruebas Automatizadas (3 días)

#### 5.1 Implementar pruebas unitarias (1 día)
- [ ] Configurar Jest y React Testing Library
- [ ] Crear pruebas para componentes críticos
- [ ] Implementar pruebas para hooks personalizados
- [ ] Añadir pruebas para funciones de utilidad

#### 5.2 Implementar pruebas de integración (1 día)
- [ ] Identificar flujos críticos para probar
- [ ] Crear pruebas para el flujo de autenticación
- [ ] Implementar pruebas para el flujo de gestión de actividades
- [ ] Añadir pruebas para el flujo de filtrado y búsqueda

#### 5.3 Configurar CI/CD para pruebas (1 día)
- [ ] Configurar GitHub Actions para ejecutar pruebas automáticamente
- [ ] Implementar informes de cobertura
- [ ] Añadir pruebas de accesibilidad
- [ ] Configurar análisis estático de código

### 6. Arquitectura y Mantenibilidad (2 días)

#### 6.1 Extraer lógica común a servicios compartidos (1 día)
- [ ] Identificar código duplicado en controladores y servicios
- [ ] Crear servicios base para operaciones comunes
- [ ] Implementar patrones de diseño para mejorar la estructura
- [ ] Refactorizar para seguir principios SOLID

#### 6.2 Estandarizar el manejo de enumeraciones (0.5 días)
- [ ] Crear convertidores para todas las enumeraciones
- [ ] Implementar serialización/deserialización consistente
- [ ] Añadir validación para valores de enumeración
- [ ] Documentar el uso correcto de enumeraciones

#### 6.3 Mejorar la documentación (0.5 días)
- [ ] Actualizar la documentación de la API con OpenAPI
- [ ] Añadir comentarios JavaDoc/JSDoc a clases y métodos importantes
- [ ] Crear guías de desarrollo para patrones comunes
- [ ] Documentar decisiones de arquitectura (ADRs)

### Criterios de Aceptación
- Todos los errores son manejados adecuadamente y muestran mensajes útiles
- El sistema responde rápidamente incluso con grandes volúmenes de datos
- Todos los usuarios tienen los permisos correctos según su rol
- La interfaz de usuario es consistente y proporciona feedback claro
- Las pruebas automatizadas cubren los flujos críticos
- El código sigue principios SOLID y patrones de diseño adecuados

## Backlog Futuro

### Nuevas Características
- [ ] Reportes avanzados y analytics
- [ ] Integración con IA
- [ ] Implementación de Zipkin para trazado distribuido
  - [ ] Configurar servidor Zipkin
  - [ ] Habilitar trazado en la aplicación
  - [ ] Implementar visualización de trazas
  - [ ] Configurar alertas basadas en latencia

### Mejoras Técnicas
- [ ] Optimización de consultas
- [ ] Caché distribuida
- [ ] Mejoras en UX/UI
- [ ] Optimizaciones de rendimiento adicionales

## Sprint 13: Mejoras en el Sistema de Comentarios y Seguimiento de Solicitudes (2 semanas)

### Descripción del Sprint
Este sprint se enfocará en mejorar el sistema de comentarios para las solicitudes, implementar la persistencia de comentarios y mejorar la experiencia de usuario en el seguimiento de solicitudes.

### Objetivos
- Implementar persistencia de comentarios en solicitudes
- Mejorar la interfaz de usuario para comentarios
- Implementar carga de historial real desde el backend
- Mejorar la gestión de errores en comentarios

### Fase 1: Persistencia de Comentarios (3 días)
- [x] 1.1 Implementar endpoints en el backend para comentarios
  - [x] Crear endpoint para agregar comentarios a una solicitud
  - [x] Crear endpoint para obtener comentarios de una solicitud
- [x] 1.2 Actualizar el servicio de solicitudes en el frontend
  - [x] Implementar método para agregar comentarios
  - [x] Implementar método para obtener comentarios
- [x] 1.3 Actualizar el componente SeguimientoSolicitud
  - [x] Implementar carga de comentarios reales
  - [x] Implementar envío de comentarios al backend
  - [x] Mostrar indicadores de carga para comentarios

### Fase 2: Mejoras en la Interfaz de Usuario (2 días)
- [x] 2.1 Mejorar la visualización de comentarios
  - [x] Implementar agrupación de comentarios por fecha
  - [x] Mejorar el diseño de los avatares de usuario
  - [x] Implementar indicadores de lectura para comentarios
- [x] 2.2 Implementar funcionalidades adicionales
  - [x] Agregar opción para editar comentarios propios
  - [x] Agregar opción para eliminar comentarios propios
  - [x] Implementar menciones a usuarios con @

### Fase 3: Implementación de Historial Real (3 días) ✅
- [x] 3.1 Implementar endpoints en el backend para historial
  - [x] Crear endpoint para obtener historial de una solicitud
  - [x] Implementar registro automático de cambios de estado
- [x] 3.2 Actualizar el servicio de solicitudes en el frontend
  - [x] Implementar método para obtener historial
- [x] 3.3 Actualizar el componente SeguimientoSolicitud
  - [x] Implementar carga de historial real
  - [x] Mostrar indicadores de carga para historial

### Fase 4: Mejoras en la Gestión de Errores (2 días) ✅
- [x] 4.1 Implementar manejo de errores específicos
  - [x] Crear tipos de error específicos para comentarios
  - [x] Implementar mensajes de error personalizados
- [x] 4.2 Implementar reintentos automáticos
  - [x] Implementar reintentos para envío de comentarios
  - [x] Implementar almacenamiento temporal de comentarios no enviados
- [x] 4.3 Mejorar la experiencia de usuario en caso de errores
  - [x] Mostrar mensajes de error amigables
  - [x] Implementar opciones para reintentar acciones fallidas

### Fase 5: Pruebas y Documentación (2 días)
- [ ] 5.1 Implementar pruebas para el sistema de comentarios
  - [ ] Crear pruebas unitarias para el servicio de comentarios
  - [ ] Crear pruebas de integración para los endpoints
- [ ] 5.2 Actualizar la documentación
  - [ ] Documentar el sistema de comentarios en el README
  - [ ] Actualizar el CHANGELOG con las mejoras implementadas

### Criterios de aceptación
- Los comentarios se persisten correctamente en la base de datos
- Los usuarios pueden ver y agregar comentarios en tiempo real
- El historial de la solicitud se carga desde el backend
- Los errores se manejan de forma adecuada y amigable para el usuario
- La documentación está actualizada

## Sprint 14: Unificación de Estilos y Corrección de Errores TypeScript (2 semanas)

### Descripción del Sprint
Este sprint se enfocará en unificar los archivos de estilos duplicados, corregir errores de TypeScript y mejorar la estructura general del proyecto para facilitar el mantenimiento y desarrollo futuro.

### Objetivos
- Unificar archivos de estilos duplicados (statusColors.ts, theme.ts)
- Corregir errores de TypeScript en interfaces y temas
- Mejorar la estructura de carpetas para componentes y utilidades
- Documentar la estructura del proyecto

### Fase 1: Unificación de archivos de estilos (3 días)
- [x] 1.1 Analizar los archivos duplicados de statusColors.ts
  - [x] Identificar las diferencias entre las versiones
  - [x] Determinar qué versión es la más completa y actualizada
- [x] 1.2 Consolidar los archivos statusColors.ts en una única ubicación
  - [x] Crear una versión unificada en shared/styles
  - [x] Actualizar todas las importaciones para usar la versión unificada
  - [x] Eliminar las versiones duplicadas
- [x] 1.3 Analizar los archivos duplicados de theme.ts
  - [x] Identificar las diferencias entre las versiones
  - [x] Determinar qué versión es la más completa y actualizada
- [x] 1.4 Consolidar los archivos theme.ts en una única ubicación
  - [x] Crear una versión unificada en shared/styles
  - [x] Actualizar todas las importaciones para usar la versión unificada
  - [x] Eliminar las versiones duplicadas

### Fase 2: Corrección de errores de TypeScript (4 días)
- [x] 2.1 Corregir errores en interfaces de tema
  - [x] Revisar y corregir la interfaz DefaultTheme en styled.d.ts
  - [x] Asegurar que todas las propiedades tengan tipos consistentes
  - [x] Eliminar propiedades duplicadas o conflictivas
- [x] 2.2 Corregir errores en interfaces de colores
  - [x] Revisar y corregir las interfaces ColorScheme, StatusColorMap y TypeColorMap
  - [x] Asegurar que todas las propiedades tengan tipos consistentes
  - [x] Eliminar propiedades duplicadas o conflictivas
- [x] 2.3 Corregir errores en componentes que usan temas
  - [x] Identificar componentes que acceden a propiedades inexistentes del tema
  - [x] Actualizar los componentes para usar las propiedades correctas
  - [x] Implementar fallbacks para propiedades opcionales
- [ ] 2.4 Implementar pruebas de tipo para verificar la corrección
  - [ ] Crear pruebas para verificar que los temas implementen correctamente la interfaz
  - [ ] Verificar que los componentes accedan correctamente a las propiedades del tema

### Fase 3: Mejora de la estructura de carpetas (3 días)
- [x] 3.1 Analizar la estructura actual de carpetas
  - [x] Identificar inconsistencias y duplicaciones
  - [x] Determinar la estructura óptima para el proyecto
- [x] 3.2 Reorganizar componentes compartidos
  - [x] Mover componentes UI comunes a shared/components/ui
  - [x] Mover componentes de layout a shared/components/layout
  - [x] Crear archivos de barril (index.ts) para simplificar importaciones
- [x] 3.3 Reorganizar utilidades y hooks
  - [x] Mover utilidades comunes a shared/utils
  - [x] Mover hooks comunes a shared/hooks
  - [x] Crear archivos de barril (index.ts) para simplificar importaciones
- [x] 3.4 Eliminar código obsoleto
  - [x] Identificar código que ya no se utiliza
  - [ ] Eliminar archivos y código obsoleto
  - [ ] Verificar que la aplicación siga funcionando correctamente

### Fase 4: Documentación y pruebas (2 días)
- [ ] 4.1 Actualizar README.md con la nueva estructura
  - [ ] Documentar la estructura de carpetas
  - [ ] Explicar las convenciones de código
  - [ ] Documentar el sistema de temas y estilos
- [ ] 4.2 Crear guías de estilo para el desarrollo futuro
  - [ ] Documentar cómo usar el sistema de temas
  - [ ] Explicar cómo crear nuevos componentes
  - [ ] Documentar cómo extender el sistema de estilos
- [ ] 4.3 Implementar pruebas para verificar la corrección
  - [ ] Crear pruebas para verificar que los componentes se rendericen correctamente
  - [ ] Verificar que los estilos se apliquen correctamente

### Criterios de aceptación
- No hay archivos duplicados de estilos en el proyecto
- No hay errores de TypeScript relacionados con temas o estilos
- La estructura de carpetas es coherente y sigue las mejores prácticas
- La documentación está actualizada y es clara
- La aplicación funciona sin errores

## Sprint 14: Mejoras de Rendimiento y Correcciones de Errores (2 semanas)

### Descripción del Sprint
Este sprint se enfocará en mejorar el rendimiento de la aplicación, corregir errores identificados y mejorar la calidad del código tanto en el frontend como en el backend.

### Objetivos
- Corregir errores de autenticación y permisos
- Mejorar el rendimiento de la aplicación
- Implementar pruebas automatizadas
- Corregir errores de código y advertencias
- Solucionar problemas de componentes duplicados

### Fase 1: Corrección de errores de autenticación (3 días)
- [x] 1.1 Corregir problemas con el token de autenticación
  - [x] Revisar el flujo de autenticación en el frontend
  - [x] Corregir la forma en que se obtiene y almacena el token
  - [x] Implementar manejo de errores más robusto para problemas de autenticación
- [ ] 1.2 Mejorar la gestión de permisos
  - [ ] Implementar verificación de permisos en el frontend
  - [ ] Mostrar/ocultar elementos de la interfaz según los permisos del usuario
  - [ ] Implementar redirección a página de acceso denegado cuando corresponda
- [ ] 1.3 Corregir problemas con el cierre de sesión
  - [ ] Asegurar que los tokens se invaliden correctamente en el backend
  - [ ] Limpiar correctamente el estado y el almacenamiento local al cerrar sesión
  - [ ] Implementar cierre de sesión automático por inactividad

### Fase 2: Mejoras de rendimiento (4 días)
- [ ] 2.1 Optimizar consultas de base de datos
  - [ ] Implementar índices adicionales en tablas críticas
  - [ ] Refactorizar consultas para usar proyecciones específicas
  - [ ] Implementar caché de segundo nivel en Hibernate
- [ ] 2.2 Mejorar el rendimiento del frontend
  - [ ] Implementar React.memo para componentes puros
  - [ ] Optimizar uso de useCallback y useMemo
  - [ ] Refactorizar componentes con muchos re-renderizados
- [ ] 2.3 Implementar técnicas avanzadas de virtualización
  - [ ] Mejorar componentes virtualizados existentes
  - [ ] Implementar virtualización para todas las listas grandes
  - [ ] Añadir soporte para elementos de altura variable
- [x] 2.4 Implementar visualización de estadísticas
  - [x] Crear componente para mostrar estadísticas por tipo de actividad usando getStatsByType
  - [x] Crear componente para mostrar estadísticas por estado de actividad usando getStatsByStatus
  - [x] Integrar componentes de estadísticas en el dashboard
  - [x] Actualizar ActivityChart para usar datos reales en lugar de datos estáticos
  - [x] Actualizar StatCard para usar datos reales en lugar de datos estáticos
- [x] 2.5 Corregir problemas con endpoints de estadísticas
  - [x] Corregir rutas de API para estadísticas por tipo (/api/activities/stats/by-type)
  - [x] Corregir rutas de API para estadísticas por estado (/api/activities/stats/by-status)
  - [x] Corregir rutas de API para resúmenes de actividades (/api/activities/summaries)
  - [x] Actualizar controlador para manejar correctamente ambos prefijos de ruta (/activities y /api/activities)
  - [x] Implementar controlador de diagnóstico para verificar rutas disponibles

### Fase 3: Implementación de pruebas automatizadas (3 días)
- [ ] 3.1 Configurar entorno de pruebas
  - [ ] Configurar Jest y React Testing Library para el frontend
  - [ ] Configurar JUnit y Mockito para el backend
  - [ ] Configurar GitHub Actions para ejecutar pruebas automáticamente
- [ ] 3.2 Implementar pruebas unitarias
  - [ ] Crear pruebas para componentes comunes del frontend
  - [ ] Implementar pruebas para hooks personalizados
  - [ ] Crear pruebas para servicios y controladores del backend
- [ ] 3.3 Implementar pruebas de integración
  - [ ] Crear pruebas para flujos críticos de la aplicación
  - [ ] Implementar pruebas para la API REST
  - [ ] Crear pruebas para la capa de persistencia

### Fase 4: Corrección de errores y advertencias (4 días)
- [x] 4.0 Implementar usuarios desde archivo CSV de empleados
  - [x] Crear migración V8__Add_Employees_From_CSV.sql para agregar usuarios del archivo
  - [x] Configurar DNI como nombre de usuario y número de legajo + "@Pass" como contraseña
  - [x] Asignar roles específicos: SOLICITANTE, EJECUTOR, ASIGNADOR
  - [x] Asignar rol ASIGNADOR únicamente a Adriana Sanchez
  - [x] Actualizar usuario admin para que sea Semper Evincere
  - [x] Asignar permisos adecuados según el rol de cada usuario
  - [x] Corregir migración para manejar restricciones de integridad referencial
  - [x] Crear migración V9__Fix_User_Passwords.sql para corregir las contraseñas de los usuarios
  - [x] Crear migración V10__Update_User_Passwords_Format.sql para actualizar el formato de contraseñas a legajo@Pass
  - [x] Crear migración V11__Fix_User_Passwords_For_Testing.sql para asegurar que las contraseñas se actualicen correctamente
  - [x] Crear migración V12__Fix_Employee_Passwords.sql para establecer contraseñas conocidas y funcionales
  - [x] Crear migración V13__Fix_Employee_Passwords_With_System_Hash.sql para usar el hash generado por el sistema
  - [x] Corregir método de logout en el frontend para enviar correctamente el token de autorización
  - [x] Actualizar documentación para reflejar el nuevo formato de contraseñas
  - [x] Simplificar contraseñas de usuarios a "Test@1234" para facilitar pruebas
- [x] 4.1 Corregir errores de acceso basado en roles
  - [x] Corregir el manejo de roles de usuario en el frontend
  - [x] Actualizar la forma en que se almacena y recupera el rol del usuario en localStorage
  - [x] Mejorar el componente de depuración para mostrar información detallada sobre el rol del usuario
  - [x] Asegurar que se respeten las restricciones de acceso basadas en roles
  - [x] Corregir la respuesta de autenticación en el backend para enviar el rol como un campo único
  - [x] Añadir logs de depuración detallados para identificar problemas con los roles
  - [x] Corregir el mapeo de roles en el frontend para manejar correctamente la respuesta del backend
  - [x] Corregir el menú lateral para mostrar solo las secciones correspondientes al rol del usuario
  - [x] Implementar condiciones en RoleBasedSidebar para mostrar elementos de menú según el rol del usuario
- [ ] 4.2 Corregir errores de código en el backend
  - [ ] Corregir advertencias de Checkstyle
  - [ ] Resolver problemas de código no utilizado
  - [ ] Corregir posibles null pointer exceptions
- [x] 4.2 Corregir problemas de componentes duplicados en el frontend
  - [x] Corregir identificadores duplicados en CategoriasList.tsx
  - [x] Corregir identificadores duplicados en PrioridadesList.tsx
  - [x] Implementar componente Card faltante
  - [x] Corregir importaciones en index.ts
  - [x] Implementar componente Skeleton con exportación por defecto
  - [x] Corregir error de exportación en Skeleton.tsx
- [x] 4.3 Implementar protección de rutas basada en roles
  - [x] Mejorar componente ProtectedRoute para verificar autenticación
  - [x] Integrar RoleProtectedRoute en App.tsx para proteger rutas específicas
  - [x] Configurar acceso por roles: ADMIN, SOLICITANTE, ASIGNADOR, EJECUTOR
  - [x] Implementar redirecciones adecuadas para usuarios sin permisos
  - [x] Corregir error de importación de RoleProtectedRoute y UserRole en App.tsx
- [x] 4.4 Corregir errores en componentes del frontend
  - [x] Corregir error "useToastContext must be used within a ToastProvider"
  - [x] Reemplazar useToastContext por react-toastify en todos los componentes afectados
  - [x] Simplificar el sistema de notificaciones para usar directamente toast de react-toastify
- [x] 4.5 Refactorizar inicialización de datos de prueba
  - [x] Consolidar datos de prueba en migraciones Flyway
  - [x] Crear migración V3__Consolidated_Test_Data.sql
  - [x] Deshabilitar mecanismo data.sql
  - [x] Modificar DataInitializer para que solo se active con el perfil "data-init"
  - [x] Implementar prueba unitaria para verificar la inicialización de datos
  - [x] Documentar nuevo enfoque en README-DATA-INITIALIZATION.md
- [x] 4.6 Corregir errores de código en el frontend
  - [x] Resolver advertencias de ESLint
  - [x] Corregir problemas de accesibilidad
  - [x] Eliminar código no utilizado y datos mockeados
  - [x] Eliminar archivos duplicados y consolidar componentes
    - [x] Consolidar componentes StatusBadge y TypeBadge
    - [x] Consolidar componentes PageTransition y AnimatedRoutes
  - [x] Corregir errores en el Dashboard
    - [x] Solucionar error en gráficos de Chart.js
      - [x] Corregir manejo de colores en ActivityTypeStats.tsx
      - [x] Corregir manejo de colores en ActivityStatusStats.tsx
    - [x] Corregir URLs con doble slash en peticiones API
    - [x] Solucionar error de formateo de fechas inválidas
    - [x] Implementar función de utilidad para manejo seguro de fechas
- [ ] 4.7 Mejorar la documentación del código
  - [ ] Añadir comentarios JSDoc a componentes y funciones clave
  - [ ] Documentar APIs públicas
  - [ ] Actualizar README.md con la nueva estructura y convenciones
- [x] 4.8 Implementar componentes para resúmenes de actividades
  - [x] Crear componente para mostrar resúmenes de actividades usando getActivitySummaries
  - [x] Integrar componente de resúmenes en el dashboard
  - [x] Actualizar RecentActivities para usar datos reales en lugar de datos estáticos

### Criterios de aceptación
- No hay errores de autenticación o permisos
- El rendimiento de la aplicación ha mejorado significativamente
- Las pruebas automatizadas cubren al menos el 70% del código
- No hay errores o advertencias de código
- La documentación está actualizada y es clara

## Sprint 16: Implementación de Entidad Solicitud (Request) (3 semanas)

### Descripción del Sprint
Este sprint se enfocará en crear una nueva entidad `Request` (Solicitud) separada de la entidad `Activity` (Actividad) para diferenciar claramente estos dos conceptos de negocio. Esto permitirá una mejor organización del código y una experiencia de usuario más clara.

### Objetivos
- Crear una nueva entidad `Request` en el dominio
- Implementar la infraestructura necesaria para la nueva entidad
- Desarrollar endpoints REST para gestionar solicitudes
- Actualizar la interfaz de usuario para trabajar con la nueva entidad
- Migrar datos existentes a la nueva estructura

### Fase 1: Diseño e Implementación del Dominio (1 semana)

#### 1.1 Diseño del Modelo de Dominio (2 días)
- [x] Diseñar la entidad `TaskRequest` y sus relaciones
  - [x] Definir atributos: id, title, description, category, priority, dueDate, status, etc.
  - [x] Definir relaciones con otras entidades (User, Activity, etc.)
  - [x] Diseñar enumeraciones para estados de solicitud (TaskRequestStatus)
- [x] Diseñar el flujo de trabajo para solicitudes
  - [x] Definir estados posibles: DRAFT, SUBMITTED, ASSIGNED, COMPLETED, CANCELLED, etc.
  - [x] Definir transiciones válidas entre estados
  - [x] Diseñar reglas de negocio para cada transición
- [x] Documentar el modelo de dominio
  - [x] Crear diagramas UML para la entidad y sus relaciones
  - [x] Documentar reglas de negocio y flujo de trabajo

#### 1.2 Implementación de la Capa de Dominio (3 días)
- [x] Implementar la entidad `TaskRequest`
  - [x] Crear clase TaskRequest en el paquete domain.model.taskrequest
  - [x] Implementar atributos y métodos básicos
  - [x] Implementar validaciones de dominio
- [x] Implementar enumeraciones y value objects
  - [x] Crear enum TaskRequestStatus
  - [x] Crear enum TaskRequestPriority
  - [x] Implementar clases TaskRequestCategory, TaskRequestComment y TaskRequestAttachment
- [x] Implementar interfaces de repositorio
  - [x] Crear interfaz TaskRequestRepository en domain.port.repository
  - [x] Crear interfaz TaskRequestCategoryRepository en domain.port.repository
  - [x] Definir métodos para operaciones CRUD
  - [x] Definir métodos para consultas específicas
- [x] Implementar servicios de dominio
  - [x] Crear interfaz TaskRequestService en domain.port.service
  - [x] Crear interfaz TaskRequestCategoryService en domain.port.service
  - [x] Definir métodos para operaciones de negocio
  - [x] Implementar reglas de negocio específicas

### Fase 2: Implementación de la Capa de Aplicación (3 días)

#### 2.1 Implementación de Casos de Uso (2 días)
- [x] Implementar casos de uso para solicitudes
  - [x] Crear CreateTaskRequestUseCase
  - [x] Crear UpdateTaskRequestUseCase
  - [x] Integrar funcionalidad de SubmitTaskRequest en TaskRequestWorkflowService
  - [x] Integrar funcionalidad de CancelTaskRequest en TaskRequestWorkflowService
  - [x] Crear otros casos de uso necesarios
- [x] Implementar servicios de aplicación
  - [x] Crear TaskRequestWorkflowService
  - [x] Implementar lógica para transiciones de estado
  - [x] Implementar validaciones de aplicación

#### 2.2 Implementación de DTOs y Mappers (1 día)
- [x] Crear DTOs para solicitudes
  - [x] Implementar TaskRequestDto
  - [x] Implementar CreateTaskRequestDto
  - [x] Implementar UpdateTaskRequestDto
  - [x] Implementar TaskRequestCategoryDto
  - [x] Implementar TaskRequestCommentDto
  - [x] Implementar TaskRequestAttachmentDto
  - [x] Implementar TaskRequestPageDto
- [x] Implementar mappers
  - [x] Crear TaskRequestMapper para convertir entre entidad y DTOs
  - [x] Crear TaskRequestCategoryMapper para convertir entre entidad y DTOs
  - [x] Implementar mapeo bidireccional
  - [x] Manejar relaciones con otras entidades

### Fase 3: Implementación de la Capa de Infraestructura (1 semana)

#### 3.1 Implementación de Persistencia (3 días)
- [x] Crear entidades JPA para solicitudes
  - [x] Implementar TaskRequestEntity en infrastructure.persistence.entity
  - [x] Implementar TaskRequestCategoryEntity, TaskRequestCommentEntity y TaskRequestAttachmentEntity
  - [x] Implementar enumeraciones TaskRequestStatusEntity y TaskRequestPriorityEntity
  - [x] Definir mapeo ORM con anotaciones JPA
  - [x] Configurar relaciones con otras entidades
- [x] Implementar repositorios JPA
  - [x] Crear TaskRequestJpaRepository
  - [x] Crear TaskRequestCategoryJpaRepository
  - [x] Implementar consultas personalizadas con métodos derivados
  - [x] Configurar paginación y ordenamiento
- [x] Implementar adaptadores de repositorio
  - [x] Crear TaskRequestRepositoryAdapter que implemente TaskRequestRepository
  - [x] Crear TaskRequestCategoryRepositoryAdapter que implemente TaskRequestCategoryRepository
  - [x] Implementar métodos definidos en las interfaces
  - [x] Implementar mapeo entre entidades JPA y entidades de dominio

#### 3.2 Implementación de API REST (2 días)
- [x] Crear controladores REST para solicitudes
  - [x] Implementar TaskRequestController
  - [x] Implementar TaskRequestCategoryController
  - [x] Definir endpoints para operaciones CRUD
  - [x] Definir endpoints para operaciones de flujo de trabajo
- [x] Implementar seguridad para endpoints
  - [x] Configurar permisos basados en roles con anotaciones @PreAuthorize
  - [x] Implementar validación de autorización
  - [x] Configurar acceso según roles (SOLICITANTE, ASIGNADOR, EJECUTOR, ADMIN)
- [x] Documentar API con OpenAPI/Swagger
  - [x] Añadir anotaciones para documentación
  - [x] Configurar etiquetas y descripciones
  - [x] Verificar que la documentación sea clara y completa

#### 3.3 Implementación de Migraciones (2 días)
- [x] Crear script de migración para las nuevas tablas
  - [x] Implementar migración Flyway para crear tablas de solicitudes y relacionadas
  - [x] Definir restricciones y claves foráneas
  - [x] Configurar índices para optimizar consultas
  - [x] Insertar datos iniciales de categorías y ejemplos de solicitudes

### Fase 4: Implementación de la Interfaz de Usuario (1 semana)

#### 4.1 Diseño de Componentes (2 días)
- [x] Diseñar interfaces para gestión de solicitudes
  - [x] Diseñar lista de solicitudes
  - [x] Diseñar formulario de creación/edición
  - [x] Diseñar vista de detalles
  - [x] Diseñar componentes para acciones de flujo de trabajo
- [x] Diseñar interfaces específicas por rol
  - [x] Diseñar vista para SOLICITANTES
  - [x] Diseñar vista para ASIGNADORES
  - [x] Diseñar vista para EJECUTORES
  - [x] Diseñar vista para ADMIN

#### 4.2 Implementación de Componentes (3 días)
- [x] Implementar servicios de frontend
  - [x] Crear taskRequestService.ts para comunicación con API
  - [x] Crear taskRequestCategoryService.ts para gestión de categorías
  - [x] Implementar métodos para operaciones CRUD
  - [x] Implementar métodos para operaciones de flujo de trabajo
- [x] Implementar componentes de React
  - [x] Crear TaskRequestList.tsx para listar solicitudes
  - [x] Crear TaskRequestForm.tsx para crear y editar solicitudes
  - [x] Crear TaskRequestDetail.tsx para ver detalles de solicitudes
  - [x] Crear TaskRequestCategoryList.tsx para gestionar categorías
  - [x] Crear TaskRequestStats.tsx para visualizar estadísticas
- [x] Implementar gestión de estado
  - [x] Crear tipos TypeScript para las entidades
  - [x] Implementar manejo de errores y carga
  - [x] Configurar notificaciones con react-toastify

#### 4.3 Implementación de Rutas y Navegación (2 días)
- [x] Configurar rutas para solicitudes
  - [x] Crear TaskRequestRoutes.tsx con todas las rutas necesarias
  - [x] Configurar protección de rutas por rol con RoleProtectedRoute
  - [x] Implementar redirecciones adecuadas
- [x] Actualizar menú de navegación
  - [x] Añadir enlaces para gestión de solicitudes en Sidebar.tsx
  - [x] Configurar visibilidad según roles (SOLICITANTE, ASIGNADOR, EJECUTOR, ADMIN)
  - [x] Organizar menú por secciones

### Fase 5: Pruebas y Documentación (3 días)

#### 5.1 Implementación de Pruebas (2 días)
- [x] Implementar pruebas unitarias
  - [x] Crear pruebas para entidades de dominio (TaskRequestTest)
  - [x] Crear pruebas para servicios de aplicación (TaskRequestWorkflowServiceTest)
  - [x] Crear pruebas para casos de uso (CreateTaskRequestUseCaseTest)
- [x] Implementar pruebas de integración
  - [x] Crear pruebas para repositorios (TaskRequestRepositoryAdapterTest)
  - [x] Crear pruebas para controladores REST (TaskRequestControllerIntegrationTest)
  - [x] Configurar entorno de pruebas con MockMvc y JUnit 5

#### 5.2 Documentación (1 día)
- [x] Actualizar documentación técnica
  - [x] Documentar el nuevo modelo de dominio
  - [x] Documentar arquitectura y componentes
  - [x] Documentar API REST con endpoints y permisos
- [x] Actualizar documentación de usuario
  - [x] Crear guías para gestión de solicitudes
  - [x] Documentar flujo de trabajo de solicitudes
  - [x] Crear guías detalladas para cada rol (SOLICITANTE, ASIGNADOR, EJECUTOR, ADMIN)

### Criterios de Aceptación
- La entidad `Request` está implementada y funciona correctamente
- El flujo de trabajo para solicitudes funciona según lo esperado
- La API REST para solicitudes está documentada y funciona correctamente
- La interfaz de usuario permite gestionar solicitudes de forma intuitiva
- Las pruebas automatizadas cubren la nueva funcionalidad
- La documentación está actualizada y es clara

## Notas y Consideraciones
- Mantener compatibilidad hacia atrás durante la migración
- Seguir principios SOLID y Clean Architecture
- Documentar decisiones técnicas importantes
- Realizar code reviews frecuentes
- Mantener dependencias actualizadas

## Sprint 15: Implementación del Sistema de Gestión de Tareas (4 semanas) ✅

### Objetivos del Sprint
- Implementar el nuevo modelo de datos para el sistema de gestión de tareas
- Desarrollar el flujo de trabajo para SOLICITANTES, ASIGNADORES y EJECUTORES
- Implementar sistema de categorización y priorización de tareas
- Crear interfaces específicas para cada rol
- Implementar sistema de notificaciones para el flujo de trabajo
- Desarrollar reportes y métricas para seguimiento de tareas
- Preparar integración futura con Google Calendar y Drive

### 1. Actualización del Modelo de Datos (1 semana)

#### 1.1 Implementación de Entidades Principales (3 días)
- [x] Actualizar modelo de Usuario (User)
  - [x] Unificar enumeraciones de roles en UserRole con roles ADMIN, ASIGNADOR, SOLICITANTE, EJECUTOR, SUPERVISOR, USUARIO, CONSULTA
  - [x] Actualizar repositorio y servicios de usuario
  - [x] Implementar migración de base de datos para nuevos roles
- [x] Ampliar modelo de Actividad (Activity)
  - [x] Agregar campos para flujo de trabajo: requesterId, assignerId, executorId
  - [x] Agregar campos de fechas: requestDate, assignmentDate, startDate, completionDate, approvalDate
  - [x] Agregar campos para seguimiento: requestNotes, assignmentNotes, executionNotes, completionNotes, approvalNotes
  - [x] Agregar campos para métricas: estimatedHours, actualHours, priority
  - [x] Implementar migración de base de datos para nuevos campos
- [x] Implementar enum ActivityStatus
  - [x] Definir estados: REQUESTED, ASSIGNED, IN_PROGRESS, COMPLETED, APPROVED, REJECTED, CANCELLED
  - [x] Actualizar servicios y controladores para manejar nuevos estados

#### 1.2 Implementación de Entidades de Soporte (2 días)
- [x] Crear entidad ActivityHistory
  - [x] Implementar campos para seguimiento de cambios de estado
  - [x] Crear repositorio y servicios para historial
  - [x] Implementar migración de base de datos
- [x] Crear entidad ActivityComment
  - [x] Implementar campos para comentarios en actividades
  - [x] Crear repositorio y servicios para comentarios
  - [x] Implementar migración de base de datos
- [x] Crear entidad ActivityAttachment
  - [x] Implementar campos para archivos adjuntos
  - [x] Crear repositorio y servicios para adjuntos
  - [x] Implementar migración de base de datos
- [x] Implementar servicios de aplicación
  - [x] Crear servicios en la capa de aplicación para cada entidad
  - [x] Implementar DTOs y mappers para la API REST
  - [x] Crear controladores REST para exponer la funcionalidad

### 2. Implementación del Flujo de Trabajo (1 semana)

#### 2.1 Desarrollo de Servicios de Flujo de Trabajo (3 días)
- [x] Implementar patrón State para estados de actividad
  - [x] Crear interfaz ActivityState y clases concretas para cada estado
  - [x] Implementar reglas de transición entre estados
  - [x] Desarrollar validaciones para cada transición
- [x] Implementar servicios para el flujo de trabajo
  - [x] Crear servicio para solicitud de actividades (SOLICITANTE)
  - [x] Crear servicio para asignación de actividades (ASIGNADOR)
  - [x] Crear servicio para ejecución de actividades (EJECUTOR)
  - [x] Implementar servicio para aprobación/rechazo de actividades

#### 2.2 Desarrollo de Endpoints de API (2 días)
- [x] Implementar endpoints para el flujo de trabajo
  - [x] POST /api/activities/request - Crear solicitud (SOLICITANTE)
  - [x] POST /api/activities/{id}/assign - Asignar tarea (ASIGNADOR)
  - [x] POST /api/activities/{id}/start - Iniciar tarea (EJECUTOR)
  - [x] POST /api/activities/{id}/complete - Completar tarea (EJECUTOR)
  - [x] POST /api/activities/{id}/approve - Aprobar tarea (ASIGNADOR)
  - [x] POST /api/activities/{id}/reject - Rechazar tarea (ASIGNADOR)
- [x] Implementar endpoints para comentarios y adjuntos
  - [x] Endpoints CRUD para comentarios en actividades
  - [x] Endpoints para gestión de archivos adjuntos
  - [x] Endpoints para consultar historial de actividades
- [x] Proteger adecuadamente los endpoints de actividades
  - [x] Eliminar la configuración temporal que hace públicos los endpoints de actividades
  - [x] Restaurar las anotaciones @PreAuthorize en los métodos GET de ActivityController
  - [x] Verificar que todos los endpoints requieran los permisos adecuados

### 3. Sistema de Categorización y Priorización (1 semana)

#### 3.1 Implementación de Categorías (3 días)
- [x] Desarrollar modelo de categorías
  - [x] Crear entidad ActivityCategory con campos name, description, color
  - [x] Implementar repositorio y servicios para categorías
  - [x] Desarrollar endpoints REST para gestión de categorías
- [x] Implementar sistema de categorías extensible
  - [x] Permitir a ASIGNADORES crear nuevas categorías
  - [x] Implementar categorías predefinidas por defecto
  - [x] Desarrollar interfaz para gestión de categorías

#### 3.2 Implementación de Priorización (2 días)
- [x] Desarrollar sistema de prioridades
  - [x] Implementar enum ActivityPriority con niveles CRITICAL, HIGH, MEDIUM, LOW, TRIVIAL
  - [x] Crear servicios para gestión de prioridades
  - [x] Desarrollar visualización de prioridades en la interfaz
- [x] Implementar sistema de etiquetas (tags)
  - [x] Crear entidad ActivityTag con campos name y color
  - [x] Implementar repositorio y servicios para etiquetas
  - [x] Desarrollar endpoints REST para gestión de etiquetas

### 4. Interfaces Específicas por Rol (1 semana)
  Identificar las necesidades específicas de cada rol (SOLICITANTE, ASIGNADOR, EJECUTOR)
  Revisar los componentes existentes que pueden ser reutilizados
  Determinar qué endpoints del backend son necesarios para cada vista
#### 4.1 Desarrollo de Vistas para SOLICITANTE (2 días)
- [x] Implementar dashboard para SOLICITANTE
  - [x] Crear componente de resumen de solicitudes por estado
  - [x] Implementar visualización de tiempos de respuesta
  - [x] Desarrollar lista de solicitudes recientes
- [x] Implementar formulario de solicitud
  - [x] Crear formulario para nuevas solicitudes
  - [x] Implementar selección de categoría y prioridad
  - [x] Desarrollar sistema de adjuntos para solicitudes

#### 4.2 Desarrollo de Vistas para ASIGNADOR (2 días)
- [x] Implementar dashboard para ASIGNADOR
  - [x] Crear bandeja de entrada de solicitudes pendientes
  - [x] Implementar visualización de tareas asignadas por ejecutor
  - [x] Desarrollar gráficos de distribución de carga
- [x] Implementar formulario de asignación
  - [x] Crear interfaz para asignar tareas a ejecutores
  - [x] Implementar selección de prioridad y fecha límite
  - [x] Desarrollar sistema de notas para la asignación

#### 4.3 Desarrollo de Vistas para EJECUTOR (2 días)
- [x] Implementar dashboard para EJECUTOR
  - [x] Crear lista de tareas asignadas por prioridad
  - [x] Implementar visualización de progreso de tareas actuales
  - [x] Desarrollar calendario de vencimientos
- [x] Implementar formulario de progreso
  - [x] Crear interfaz para actualizar el progreso de tareas
  - [x] Implementar sistema para registrar tiempo dedicado
  - [x] Desarrollar interfaz para completar tareas con resultados

### 5. Sistema de Notificaciones para el Flujo de Trabajo (3 días)

#### 5.1 Implementación de Notificaciones en Tiempo Real (2 días)
- [x] Desarrollar sistema de notificaciones para cambios de estado
  - [x] Implementar notificaciones para nuevas solicitudes (ASIGNADOR)
  - [x] Implementar notificaciones para tareas asignadas (EJECUTOR)
  - [x] Implementar notificaciones para tareas completadas (ASIGNADOR)
  - [x] Implementar notificaciones para tareas aprobadas/rechazadas (SOLICITANTE, EJECUTOR)
- [x] Implementar sistema de presencia para colaboración
  - [x] Crear sistema para detectar usuarios viendo/editando tareas
  - [x] Implementar indicadores visuales de presencia
  - [x] Desarrollar notificaciones de edición simultánea

#### 5.2 Implementación de Centro de Notificaciones (1 día)
- [x] Desarrollar interfaz de centro de notificaciones
  - [x] Crear componente para mostrar notificaciones por categoría
  - [x] Implementar filtros y búsqueda de notificaciones
  - [x] Desarrollar sistema de marcado como leído/no leído
- [x] Implementar preferencias de notificaciones
  - [x] Crear panel de preferencias por tipo de notificación
  - [x] Implementar opciones de activación/desactivación
  - [x] Desarrollar configuración de métodos de entrega

### 6. Reportes y Métricas (3 días)

#### 6.1 Implementación de Reportes Básicos (2 días)
- [x] Desarrollar reportes por estado
  - [x] Crear endpoint para obtener actividades por estado
  - [x] Implementar visualización gráfica de distribución por estado
  - [x] Desarrollar filtros por período
- [x] Implementar reportes por usuario
  - [x] Crear endpoint para obtener actividades por usuario
  - [x] Implementar visualización de carga de trabajo por usuario
  - [x] Desarrollar métricas de rendimiento individual
- [x] Desarrollar reportes por categoría
  - [x] Crear endpoint para obtener actividades por categoría
  - [x] Implementar visualización de distribución por categoría
  - [x] Desarrollar análisis de tendencias por categoría

#### 6.2 Implementación de Métricas Avanzadas (1 día)
- [x] Desarrollar métricas de tiempo de respuesta
  - [x] Implementar cálculo de tiempo entre solicitud y asignación
  - [x] Crear visualización de tiempos promedio por ASIGNADOR
  - [x] Desarrollar alertas para tiempos excesivos
- [x] Implementar métricas de tiempo de finalización
  - [x] Calcular tiempo entre asignación y completitud
  - [x] Crear visualización de tiempos promedio por EJECUTOR
  - [x] Desarrollar comparativa entre tiempo estimado y real

### 7. Preparación para Integraciones Futuras (2 días)

#### 7.1 Preparación para Google Calendar (1 día)
- [x] Diseñar interfaces para integración con Google Calendar
  - [x] Crear interfaz CalendarIntegrationService
  - [x] Definir métodos para crear, actualizar y eliminar eventos
  - [x] Diseñar estructura de datos para eventos de calendario
- [x] Implementar configuración para OAuth
  - [x] Crear estructura para almacenar credenciales de OAuth
  - [x] Diseñar flujo de autorización
  - [x] Preparar endpoints para callback de OAuth

#### 7.2 Preparación para Google Drive (1 día)
- [x] Diseñar interfaces para integración con Google Drive
  - [x] Crear interfaz DriveIntegrationService
  - [x] Definir métodos para subir, descargar y eliminar archivos
  - [x] Diseñar estructura de datos para archivos en Drive
- [x] Implementar estructura para almacenamiento de archivos
  - [x] Crear entidad para almacenar referencias a archivos externos
  - [x] Diseñar sistema de permisos para archivos
  - [x] Preparar interfaz para gestión de archivos

### 8. Pruebas y Documentación (1 semana)

#### 8.1 Implementación de Pruebas (3 días)
- [x] Desarrollar pruebas unitarias
  - [x] Implementar pruebas para la capa de dominio
    - [x] Crear pruebas para ActivityExtended y métodos de cambio de estado
    - [x] Implementar pruebas para el patrón State y transiciones entre estados
    - [x] Crear pruebas para enumeraciones y sus métodos
  - [x] Implementar pruebas para la capa de aplicación
    - [x] Crear pruebas para ActivityWorkflowService
    - [x] Verificar comportamiento correcto de transiciones de estado
    - [x] Probar manejo de errores y excepciones
  - [x] Desarrollar pruebas para servicios y utilidades
- [x] Implementar pruebas de integración
  - [x] Crear pruebas para el flujo de trabajo completo
  - [x] Implementar pruebas para la API REST
  - [x] Desarrollar pruebas para la capa de persistencia
- [ ] Implementar pruebas de interfaz de usuario
  - [ ] Crear pruebas para componentes principales
  - [ ] Implementar pruebas para flujos de usuario
  - [ ] Desarrollar pruebas de accesibilidad

#### 8.2 Documentación (2 días)
- [ ] Crear documentación técnica
  - [ ] Documentar arquitectura del sistema
  - [ ] Crear diagramas UML para entidades y relaciones
  - [ ] Documentar API REST con OpenAPI/Swagger
- [ ] Desarrollar guías de usuario
  - [ ] Crear guías para cada rol (SOLICITANTE, ASIGNADOR, EJECUTOR)
  - [ ] Implementar tutoriales interactivos
  - [ ] Desarrollar documentación de ayuda contextual

### Criterios de Aceptación
- Modelo de datos implementado y probado
- Flujo de trabajo funcionando correctamente para todos los roles
- Sistema de categorización y priorización implementado
- Interfaces específicas para cada rol desarrolladas
- Sistema de notificaciones funcionando correctamente
- Reportes y métricas implementados
- Preparación para integraciones futuras completada
- Pruebas automatizadas implementadas
- Documentación completa y actualizada

## Sprint 15: Implementación de Pruebas Unitarias y de Integración (2 semanas)

### Descripción del Sprint
Este sprint se enfocará en implementar pruebas unitarias y de integración para mejorar la calidad y estabilidad del código, tanto en el frontend como en el backend.

### Objetivos
- Implementar pruebas unitarias para la capa de dominio
- Implementar pruebas unitarias para la capa de aplicación
- Implementar pruebas de integración para los controladores
- Mejorar la cobertura de código
- Documentar las pruebas implementadas

### Fase 1: Pruebas unitarias para la capa de dominio (3 días)
- [x] 1.1 Implementar pruebas para las entidades de dominio
  - [x] Crear pruebas para Activity y sus métodos
  - [x] Crear pruebas para User y sus métodos
  - [x] Crear pruebas para los value objects
- [x] 1.2 Implementar pruebas para los servicios de dominio
  - [x] Crear pruebas para ActivityService
  - [x] Crear pruebas para UserService
  - [x] Crear pruebas para otros servicios de dominio
- [x] 1.3 Implementar pruebas para las reglas de negocio
  - [x] Crear pruebas para validaciones de dominio
  - [x] Crear pruebas para reglas de transición de estado
  - [x] Crear pruebas para permisos y roles

### Fase 2: Pruebas unitarias para la capa de aplicación (3 días)
- [x] 2.1 Implementar pruebas para los casos de uso
  - [x] Crear pruebas para CreateActivityUseCase
  - [x] Crear pruebas para UpdateActivityUseCase
  - [x] Crear pruebas para otros casos de uso
- [x] 2.2 Implementar pruebas para los servicios de aplicación
  - [x] Crear pruebas para ActivityWorkflowService
  - [x] Crear pruebas para AuthenticationService
  - [x] Crear pruebas para otros servicios de aplicación
- [x] 2.3 Implementar pruebas para los DTOs y mappers
  - [x] Crear pruebas para ActivityDTO y su mapper
  - [x] Crear pruebas para UserDTO y su mapper
  - [x] Crear pruebas para otros DTOs y mappers

### Fase 3: Pruebas de integración (4 días)
- [x] 3.1 Implementar pruebas para los controladores REST
  - [x] Crear pruebas para ActivityController
  - [x] Crear pruebas para UserController
  - [x] Crear pruebas para AuthController
  - [x] Crear pruebas para ActivityWorkflowController
- [x] 3.2 Implementar pruebas para los repositorios
  - [x] Crear pruebas para ActivityRepository
  - [x] Crear pruebas para UserRepository
  - [x] Crear pruebas para otros repositorios
- [x] 3.3 Implementar pruebas para la seguridad
  - [x] Crear pruebas para autenticación
  - [x] Crear pruebas para autorización
  - [x] Crear pruebas para manejo de tokens

### Fase 4: Mejora de cobertura y documentación (2 días)
- [x] 4.1 Analizar la cobertura de código
  - [x] Ejecutar informes de cobertura
  - [x] Identificar áreas con baja cobertura
  - [x] Implementar pruebas adicionales para mejorar la cobertura
- [x] 4.2 Documentar las pruebas
  - [x] Actualizar README.md con información sobre pruebas
  - [x] Documentar patrones y convenciones de pruebas
  - [x] Actualizar CHANGELOG.md con las pruebas implementadas

### Criterios de aceptación
- Las pruebas unitarias para la capa de dominio están implementadas y pasan
- Las pruebas unitarias para la capa de aplicación están implementadas y pasan
- Las pruebas de integración están implementadas y pasan
- La cobertura de código ha mejorado
- La documentación está actualizada

## Sprint 24: Refactorización y Mejora de Código

### Descripción del Sprint
Este sprint se enfocó en la refactorización y mejora del código existente, corrigiendo errores, mejorando la estructura de clases y paquetes, y optimizando el rendimiento general del sistema.

### 1. Mejoras en la Gestión de Permisos y Depuración (1 día)
- [x] Implementar herramientas de depuración de permisos
  - [x] Crear utilidad para decodificar y analizar tokens JWT
  - [x] Implementar componente visual para mostrar permisos del usuario
  - [x] Añadir funcionalidad para verificar permisos específicos
- [x] Solucionar problemas de permisos en la API de usuarios
  - [x] Implementar herramienta para diagnosticar errores 403 Forbidden
  - [x] Crear utilidad para añadir permisos necesarios al usuario actual
  - [x] Mejorar el manejo de errores en peticiones a la API
- [x] Mejorar la experiencia de usuario ante errores de permisos
  - [x] Mostrar mensajes informativos cuando faltan permisos
  - [x] Proporcionar opciones para solucionar problemas de permisos
  - [x] Implementar página de depuración avanzada de permisos

### 2. Solución Temporal para Problemas de Permisos en el Backend (0.5 días)
- [x] Modificar el controlador de usuarios para permitir acceso sin verificación de permisos
  - [x] Comentar temporalmente las anotaciones @PreAuthorize en los endpoints de usuarios
  - [x] Añadir logs de depuración para rastrear el acceso a los endpoints
  - [x] Crear un endpoint de prueba para verificar la autenticación
- [x] Implementar herramientas de prueba en el frontend
  - [x] Crear componente AuthTester para probar diferentes endpoints de autenticación
  - [x] Añadir el componente a la página de depuración de permisos
  - [x] Documentar los cambios realizados en TASKS.md

### 3. Mejoras en el Sistema de Permisos (0.5 días)
- [x] Modificar el PermissionsHandler para mejorar la verificación de permisos
  - [x] Añadir verificación específica para el endpoint /api/users
  - [x] Implementar método de depuración para rastrear los permisos del usuario
  - [x] Añadir logs detallados para identificar problemas de permisos
- [x] Implementar solución permanente para el problema de permisos
  - [x] Revisar y corregir la configuración de seguridad
  - [x] Restaurar las anotaciones @PreAuthorize con la configuración correcta
  - [x] Documentar el enfoque de seguridad en el archivo README.md

### 4. Documentación del Sistema de Seguridad (0.5 días)
- [x] Documentar el enfoque de seguridad en múltiples capas
  - [x] Explicar la relación entre filtros de seguridad y anotaciones @PreAuthorize
  - [x] Documentar las rutas protegidas por filtros
  - [x] Documentar los controladores con protección por anotaciones
- [ ] Implementar pruebas para verificar el correcto funcionamiento
  - [ ] Crear pruebas unitarias para el PermissionsHandler
  - [ ] Crear pruebas de integración para verificar la seguridad en endpoints
  - [ ] Implementar pruebas automatizadas para verificar permisos

### Objetivos
- Corregir errores de compilación y advertencias
- Mejorar la estructura de clases y paquetes
- Optimizar consultas y operaciones de base de datos
- Implementar mejores prácticas de programación
- Resolver problemas de dependencias circulares en el backend

### Tareas Completadas
- [x] Refactorización y mejora de código (1 día)
  - [x] Corregir errores de compilación en el sistema de auditoría
    - [x] Separar la clase `JpaUserAuditLogRepositoryImpl` en su propio archivo
    - [x] Eliminar archivo duplicado `JpaUserAuditLogRepository.java`
    - [x] Corregir errores de importación en `UserAuditController.java`
    - [x] Añadir inyección de dependencia para `UserAuditLogRepository` en el controlador
  - [x] Corregir errores en el controlador de auditoría
    - [x] Corregir método `getAuditLogById` para usar el repositorio correcto
    - [x] Corregir importaciones faltantes para `Map` y `HashMap`
  - [x] Corregir advertencias en el código
    - [x] Añadir anotaciones `@JsonProperty` para métodos de serialización JSON en `TaskRequestCreatedEventListener`
    - [x] Eliminar importaciones no utilizadas en `UserAuditLogEntity`
    - [x] Eliminar variable no utilizada en `TaskRequestWorkflowService`
    - [x] Añadir anotaciones `@NonNull` en `SecurityFilterHandler`
    - [x] Corregir importaciones y campos no utilizados en `TaskRequestCommentAttachmentController`
    - [x] Mejorar parámetros `@RequestParam` para eliminar advertencias
    - [x] Configurar lifecycle mapping en `pom.xml` para resolver problemas de plugins Maven
  - [x] Mejorar la estructura de clases y paquetes
    - [x] Organizar correctamente las implementaciones de repositorios
    - [x] Seguir el principio de una clase pública por archivo
  - [x] Implementar mejores prácticas de programación
    - [x] Seguir principios SOLID en la implementación de repositorios
    - [x] Mejorar la inyección de dependencias
    - [x] Documentar adecuadamente el código con comentarios explicativos
- [x] Resolver problemas de dependencias circulares en el backend (1 día)
  - [x] Configurar `@EnableJpaRepositories` para escanear todos los paquetes relevantes de una vez
  - [x] Crear documento de buenas prácticas para repositorios JPA en `docs/jpa-repositories-best-practices.md`
  - [x] Implementar convenciones de nombres para evitar dependencias circulares
  - [x] Mejorar la documentación sobre prevención de dependencias circulares en repositorios

### Criterios de Aceptación
- ✅ Los errores de compilación han sido corregidos
- ✅ Las advertencias del IDE han sido resueltas o documentadas
- ✅ La estructura de clases y paquetes sigue las mejores prácticas
- ✅ El código sigue los principios SOLID
- ✅ La aplicación compila y funciona correctamente

---

## 🎯 **FASE CRÍTICA: FUNCIONALIDADES ADMINISTRATIVAS PRODUCTION-READY**

### **Objetivo General**
Llevar la plataforma administrativa del **72% actual** de completitud a un estado **production-ready del 95%** en 10-12 semanas, implementando las funcionalidades backend críticas identificadas en el análisis exhaustivo de implementación.

### **Estimación Total**: 10-12 semanas
- **Sprint Crítico 25-26**: Backend de Reportes y Métricas (4 semanas)
- **Sprint Crítico 27-28**: Backend de Configuración del Sistema (3 semanas)
- **Sprint Medio 29**: Sistema de Alertas de Seguridad Backend (2 semanas)
- **Sprint Medio 30**: Backend de Diagnóstico del Sistema (2 semanas)
- **Sprint Avanzado 31**: Integraciones Externas Backend (2 semanas)

---

## Sprint 25: Backend de Reportes y Métricas - Parte 1 (Infraestructura)

### **Descripción del Sprint**
Implementar la infraestructura backend completa para el sistema de reportes y métricas administrativas, incluyendo endpoints, servicios, agregaciones de base de datos y APIs para dashboards.

### **Objetivos**
- Implementar endpoints backend para métricas de dashboard
- Crear servicios de agregación de datos
- Implementar vistas y consultas optimizadas en base de datos
- Establecer APIs para reportes básicos
- Conectar frontend existente con backend real

### **Duración**: 2 semanas (10 días laborables)
### **Fecha Estimada**: Semana 1-2 de implementación
### **Recursos**: 1 Desarrollador Backend + 0.5 Desarrollador Frontend

---

### **1. Historia de Usuario: Dashboard Administrativo con Métricas Reales**

**Como** administrador del sistema
**Quiero** acceder a métricas reales y actualizadas del sistema
**Para** tomar decisiones informadas sobre la gestión de recursos y rendimiento

#### **Tareas Backend - Endpoints de Métricas (3 días)**

- [x] **Implementar DashboardController** (1 día) ✅ **COMPLETADO**
  - [x] Crear `@RestController` `/api/admin/dashboard`
  - [x] Endpoint `GET /metrics/overview` - métricas generales
  - [x] Endpoint `GET /metrics/task-status` - distribución por estados
  - [x] Endpoint `GET /metrics/user-activity` - actividad de usuarios
  - [x] Endpoint `GET /metrics/category-distribution` - distribución por categorías
  - [x] Endpoint `GET /metrics/priority-distribution` - distribución por prioridades
  - [x] Implementar validación de parámetros de fecha y filtros
  - [x] Añadir documentación OpenAPI/Swagger

- [x] **Implementar DashboardService** (1 día) ✅ **COMPLETADO**
  - [x] Crear servicio `DashboardMetricsService`
  - [x] Método `getSystemOverview()` - métricas generales del sistema
  - [x] Método `getTaskStatusMetrics(DateRange)` - métricas de estados de tareas
  - [x] Método `getUserActivityMetrics(DateRange)` - métricas de actividad de usuarios
  - [x] Método `getCategoryDistribution(DateRange)` - distribución por categorías
  - [x] Método `getPriorityDistribution(DateRange)` - distribución por prioridades
  - [x] Implementar caché con `@Cacheable` para optimizar rendimiento

- [x] **Implementar DTOs y Mappers** (1 día) ✅ **COMPLETADO**
  - [x] Crear `DashboardMetricsDto` con todas las métricas
  - [x] Crear `TaskStatusMetricsDto` para distribución de estados
  - [x] Crear `UserActivityMetricsDto` para actividad de usuarios
  - [x] Crear `CategoryDistributionDto` para distribución por categorías
  - [x] Crear `PriorityDistributionDto` para distribución por prioridades
  - [x] Implementar mappers con MapStruct
  - [x] Añadir validaciones con Bean Validation

#### **Tareas Backend - Agregaciones de Base de Datos (2 días)**

- [x] **Crear Vistas de Base de Datos** (1 día) ✅ **COMPLETADO**
  - [x] Vista `v_dashboard_metrics` - métricas generales agregadas
  - [x] Vista `v_task_status_summary` - resumen por estados
  - [x] Vista `v_user_activity_summary` - resumen de actividad por usuario
  - [x] Vista `v_category_metrics` - métricas por categoría
  - [x] Vista `v_priority_metrics` - métricas por prioridad
  - [x] Crear migración Flyway `V26__Create_Dashboard_Views.sql`

- [x] **Implementar Repositorios Especializados** (1 día) ✅ **COMPLETADO**
  - [x] Crear `DashboardMetricsRepository` con consultas nativas
  - [x] Método `findSystemOverview()` - métricas generales
  - [x] Método `findTaskStatusDistribution(LocalDateTime, LocalDateTime)`
  - [x] Método `findUserActivityMetrics(LocalDateTime, LocalDateTime)`
  - [x] Método `findCategoryDistribution(LocalDateTime, LocalDateTime)`
  - [x] Método `findPriorityDistribution(LocalDateTime, LocalDateTime)`
  - [x] Optimizar consultas con índices apropiados

#### **Tareas Frontend - Integración con Backend Real (2 días)**

- [x] **Actualizar Servicios Frontend** (1 día) ✅ **COMPLETADO**
  - [x] Modificar `dashboardService.ts` para usar endpoints reales
  - [x] Eliminar datos mock y fallbacks
  - [x] Implementar manejo de errores específicos
  - [x] Añadir tipos TypeScript para respuestas del backend
  - [x] Implementar caché en frontend con React Query

- [x] **Actualizar Hooks y Componentes** (1 día) ✅ **COMPLETADO**
  - [x] Modificar `useDashboardMetrics` para usar datos reales
  - [x] Actualizar `AdminDashboard` para manejar estados de carga
  - [x] Implementar skeleton loaders para mejor UX
  - [x] Añadir manejo de errores con retry automático
  - [x] Actualizar tests unitarios

#### **Tareas de Testing y Documentación (3 días)**

- [x] **Implementar Pruebas Backend** (1.5 días) ✅ **COMPLETADO**
  - [x] Pruebas unitarias para `DashboardController`
  - [x] Pruebas unitarias para `DashboardMetricsService`
  - [x] Pruebas de integración para repositorios
  - [x] Pruebas de rendimiento para consultas agregadas
  - [x] Pruebas de caché y optimización

- [x] **Implementar Pruebas Frontend** (1 día) ✅ **COMPLETADO**
  - [x] Pruebas unitarias para servicios actualizados
  - [x] Pruebas de integración para hooks
  - [x] Pruebas E2E para dashboard administrativo
  - [x] Validar que no hay regresiones

- [x] **Documentación** (0.5 días) ✅ **COMPLETADO**
  - [x] Documentar APIs en Swagger/OpenAPI
  - [x] Actualizar documentación de arquitectura
  - [x] Crear guía de métricas para administradores
  - [x] Documentar consultas de base de datos

### **Criterios de Aceptación**

#### **Funcionales**
- [ ] El dashboard administrativo muestra métricas reales del sistema
- [ ] Las métricas se actualizan en tiempo real o con frecuencia configurable
- [ ] Los filtros de fecha funcionan correctamente
- [ ] Las consultas tienen un rendimiento aceptable (< 2 segundos)
- [ ] Los datos son consistentes entre diferentes vistas

#### **Técnicos**
- [ ] Todos los endpoints están documentados en Swagger
- [ ] Las consultas están optimizadas con índices apropiados
- [ ] El sistema de caché funciona correctamente
- [ ] Cobertura de pruebas > 80%
- [ ] No hay regresiones en funcionalidad existente

#### **No Funcionales**
- [ ] Tiempo de respuesta de APIs < 2 segundos
- [ ] Soporte para al menos 100 usuarios concurrentes
- [ ] Logs estructurados para monitoreo
- [ ] Manejo graceful de errores

### **Definición de "Terminado" (DoD)**
- [ ] ✅ Código revisado y aprobado por al menos 1 desarrollador senior
- [ ] ✅ Todas las pruebas unitarias e integración pasan
- [ ] ✅ Documentación API actualizada y completa
- [ ] ✅ Funcionalidad probada en entorno de staging
- [ ] ✅ Performance validado con datos de prueba realistas
- [ ] ✅ Logs y monitoreo configurados
- [ ] ✅ Migración de base de datos probada y documentada

### **Riesgos Técnicos Identificados**

#### **Alto Riesgo**
- **Rendimiento de consultas agregadas**: Consultas complejas pueden ser lentas
  - **Mitigación**: Implementar índices específicos, usar vistas materializadas si es necesario
- **Volumen de datos**: Agregaciones pueden ser costosas con muchos registros
  - **Mitigación**: Implementar paginación, caché agresivo, consultas incrementales

#### **Medio Riesgo**
- **Consistencia de datos**: Métricas pueden no estar sincronizadas
  - **Mitigación**: Usar transacciones apropiadas, implementar validaciones cruzadas
- **Caché invalidation**: Datos obsoletos en caché
  - **Mitigación**: Estrategia de invalidación basada en eventos, TTL apropiado

### **Dependencias**
- **Prerequisitos**: Sistema de auditoría funcionando (completado)
- **Dependencias Externas**: Ninguna
- **Dependencias Internas**: Base de datos con datos suficientes para testing

### **Criterios de Testing**

#### **Pruebas Unitarias**
- [ ] Cobertura > 80% en servicios y controladores
- [ ] Mocking apropiado de dependencias
- [ ] Validación de edge cases

#### **Pruebas de Integración**
- [ ] Testing de endpoints completos
- [ ] Validación de consultas de base de datos
- [ ] Testing de caché y rendimiento

#### **Pruebas E2E**
- [ ] Flujo completo de dashboard administrativo
- [ ] Validación de métricas en diferentes escenarios
- [ ] Testing de filtros y parámetros

---

## Sprint 26: Backend de Reportes y Métricas - Parte 2 (Reportes Avanzados)

### **Descripción del Sprint**
Implementar el sistema completo de reportes personalizados, incluyendo generación dinámica de reportes, exportación en múltiples formatos, y programación de reportes automáticos.

### **Objetivos**
- Implementar sistema de reportes personalizados
- Crear motor de generación de reportes dinámicos
- Implementar exportación en múltiples formatos (PDF, Excel, CSV)
- Desarrollar sistema de reportes programados
- Conectar ReportBuilder frontend con backend

### **Duración**: 2 semanas (10 días laborables)
### **Fecha Estimada**: Semana 3-4 de implementación
### **Recursos**: 1 Desarrollador Backend + 0.5 Desarrollador Frontend

---

### **2. Historia de Usuario: Reportes Personalizados Dinámicos**

**Como** administrador del sistema
**Quiero** crear reportes personalizados con filtros específicos
**Para** obtener información detallada según mis necesidades de análisis

#### **Tareas Backend - Motor de Reportes (4 días)**

- [ ] **Implementar ReportsController** (1 día)
  - [ ] Crear `@RestController` `/api/admin/reports`
  - [ ] Endpoint `POST /custom` - crear reporte personalizado
  - [ ] Endpoint `GET /custom/{id}` - obtener reporte por ID
  - [ ] Endpoint `GET /custom` - listar reportes guardados
  - [ ] Endpoint `DELETE /custom/{id}` - eliminar reporte
  - [ ] Endpoint `POST /custom/{id}/execute` - ejecutar reporte
  - [ ] Endpoint `GET /custom/{id}/export/{format}` - exportar reporte
  - [ ] Implementar validación de parámetros complejos

- [ ] **Implementar ReportService** (1.5 días)
  - [ ] Crear servicio `CustomReportService`
  - [ ] Método `createReport(ReportDefinition)` - crear reporte personalizado
  - [ ] Método `executeReport(reportId, parameters)` - ejecutar reporte
  - [ ] Método `exportReport(reportId, format)` - exportar en formato específico
  - [ ] Método `scheduleReport(reportId, schedule)` - programar ejecución
  - [ ] Implementar motor de consultas dinámicas
  - [ ] Añadir validación de seguridad para consultas

- [ ] **Implementar Motor de Consultas Dinámicas** (1.5 días)
  - [ ] Crear `DynamicQueryBuilder` para construir consultas SQL
  - [ ] Implementar `FilterProcessor` para procesar filtros complejos
  - [ ] Crear `AggregationProcessor` para agregaciones dinámicas
  - [ ] Implementar `SecurityQueryValidator` para validar consultas
  - [ ] Añadir soporte para joins entre entidades
  - [ ] Implementar caché de consultas frecuentes

#### **Tareas Backend - Exportación de Reportes (3 días)**

- [ ] **Implementar ExportService** (1.5 días)
  - [ ] Crear servicio `ReportExportService`
  - [ ] Implementar `PdfExporter` usando iText o similar
  - [ ] Implementar `ExcelExporter` usando Apache POI
  - [ ] Implementar `CsvExporter` para exportación CSV
  - [ ] Crear templates para diferentes formatos
  - [ ] Implementar compresión para archivos grandes

- [ ] **Implementar Sistema de Templates** (1 día)
  - [ ] Crear `ReportTemplateService`
  - [ ] Implementar templates para PDF con logos y estilos
  - [ ] Crear templates para Excel con formato profesional
  - [ ] Implementar personalización de templates por usuario
  - [ ] Añadir soporte para gráficos en exportaciones

- [ ] **Implementar Gestión de Archivos** (0.5 días)
  - [ ] Crear `ReportFileService` para gestión de archivos generados
  - [ ] Implementar almacenamiento temporal de reportes
  - [ ] Crear limpieza automática de archivos antiguos
  - [ ] Implementar compresión y optimización de archivos

#### **Tareas Backend - Reportes Programados (2 días)**

- [ ] **Implementar ScheduledReportService** (1 día)
  - [ ] Crear servicio para programación de reportes
  - [ ] Implementar `@Scheduled` para ejecución automática
  - [ ] Crear sistema de colas para reportes programados
  - [ ] Implementar notificaciones por email de reportes completados
  - [ ] Añadir gestión de errores en reportes programados

- [ ] **Implementar Entidades de Programación** (1 día)
  - [ ] Crear entidad `ScheduledReport` con configuración de programación
  - [ ] Crear entidad `ReportExecution` para historial de ejecuciones
  - [ ] Implementar repositorios especializados
  - [ ] Crear migración Flyway `V27__Create_Scheduled_Reports.sql`

#### **Tareas Frontend - ReportBuilder Funcional (1 día)**

- [ ] **Conectar ReportBuilder con Backend** (1 día)
  - [ ] Actualizar `customReportService.ts` para usar endpoints reales
  - [ ] Implementar `useCustomReports` hook con React Query
  - [ ] Conectar `ReportBuilder` component con APIs
  - [ ] Implementar preview de reportes en tiempo real
  - [ ] Añadir validación de formularios de reportes

### **Criterios de Aceptación**

#### **Funcionales**
- [ ] Los usuarios pueden crear reportes personalizados con filtros complejos
- [ ] Los reportes se pueden exportar en PDF, Excel y CSV
- [ ] Los reportes se pueden programar para ejecución automática
- [ ] El sistema valida la seguridad de las consultas dinámicas
- [ ] Los reportes grandes se procesan de manera eficiente

#### **Técnicos**
- [ ] El motor de consultas dinámicas es seguro contra SQL injection
- [ ] Los archivos exportados tienen formato profesional
- [ ] El sistema de programación es confiable
- [ ] Las consultas complejas tienen rendimiento aceptable
- [ ] Los archivos temporales se limpian automáticamente

### **Definición de "Terminado" (DoD)**
- [ ] ✅ Sistema de reportes completamente funcional
- [ ] ✅ Exportación en todos los formatos requeridos
- [ ] ✅ Reportes programados funcionando correctamente
- [ ] ✅ Validación de seguridad implementada y probada
- [ ] ✅ Documentación completa de APIs y funcionalidades
- [ ] ✅ Pruebas de rendimiento con reportes complejos
- [ ] ✅ Frontend completamente integrado con backend

### **Riesgos Técnicos Identificados**

#### **Alto Riesgo**
- **Seguridad en consultas dinámicas**: Riesgo de SQL injection
  - **Mitigación**: Validación estricta, whitelist de campos, prepared statements
- **Rendimiento con reportes complejos**: Consultas muy lentas
  - **Mitigación**: Límites de tiempo, paginación, optimización de consultas

#### **Medio Riesgo**
- **Memoria con archivos grandes**: OutOfMemory en exportaciones
  - **Mitigación**: Streaming de datos, procesamiento por chunks
- **Concurrencia en reportes programados**: Conflictos de recursos
  - **Mitigación**: Sistema de colas, locks distribuidos

### **Dependencias**
- **Prerequisitos**: Sprint 25 completado (infraestructura de métricas)
- **Dependencias Externas**: Librerías de exportación (iText, Apache POI)
- **Dependencias Internas**: Sistema de notificaciones funcionando

---

## Sprint 27: Backend de Configuración del Sistema - Parte 1 (Infraestructura)

### **Descripción del Sprint**
Implementar la infraestructura backend completa para el sistema de configuración del sistema, incluyendo endpoints, servicios, persistencia y APIs para todas las configuraciones administrativas.

### **Objetivos**
- Implementar endpoints backend para configuración del sistema
- Crear servicios de gestión de configuraciones
- Implementar persistencia de configuraciones en base de datos
- Establecer APIs para configuración general, tareas, notificaciones
- Conectar frontend existente con backend real

### **Duración**: 1.5 semanas (7 días laborables)
### **Fecha Estimada**: Semana 5-6 de implementación
### **Recursos**: 1 Desarrollador Backend + 0.5 Desarrollador Frontend

---

### **3. Historia de Usuario: Configuración Centralizada del Sistema**

**Como** administrador del sistema
**Quiero** gestionar todas las configuraciones del sistema desde una interfaz centralizada
**Para** personalizar el comportamiento del sistema según las necesidades organizacionales

#### **Tareas Backend - Infraestructura de Configuración (3 días)**

- [ ] **Implementar SystemConfigController** (1 día)
  - [ ] Crear `@RestController` `/api/admin/system/config`
  - [ ] Endpoint `GET /general` - obtener configuración general
  - [ ] Endpoint `PUT /general` - actualizar configuración general
  - [ ] Endpoint `GET /performance` - obtener configuración de rendimiento
  - [ ] Endpoint `PUT /performance` - actualizar configuración de rendimiento
  - [ ] Endpoint `GET /security` - obtener configuración de seguridad
  - [ ] Endpoint `PUT /security` - actualizar configuración de seguridad
  - [ ] Endpoint `GET /email` - obtener configuración de email
  - [ ] Endpoint `PUT /email` - actualizar configuración de email
  - [ ] Implementar validación de configuraciones complejas

- [ ] **Implementar SystemConfigService** (1 día)
  - [ ] Crear servicio `SystemConfigurationService`
  - [ ] Método `getGeneralConfig()` - obtener configuración general
  - [ ] Método `updateGeneralConfig(GeneralConfigDto)` - actualizar configuración
  - [ ] Método `getPerformanceConfig()` - obtener configuración de rendimiento
  - [ ] Método `updatePerformanceConfig(PerformanceConfigDto)` - actualizar rendimiento
  - [ ] Método `getSecurityConfig()` - obtener configuración de seguridad
  - [ ] Método `updateSecurityConfig(SecurityConfigDto)` - actualizar seguridad
  - [ ] Método `getEmailConfig()` - obtener configuración de email
  - [ ] Método `updateEmailConfig(EmailConfigDto)` - actualizar email
  - [ ] Implementar validación de configuraciones y aplicación en tiempo real

- [ ] **Implementar Entidades y Persistencia** (1 día)
  - [ ] Crear entidad `SystemConfiguration` con tipos de configuración
  - [ ] Crear entidad `ConfigurationHistory` para auditoría de cambios
  - [ ] Implementar repositorio `SystemConfigurationRepository`
  - [ ] Crear migración Flyway `V28__Create_System_Configuration.sql`
  - [ ] Implementar caché de configuraciones con `@Cacheable`
  - [ ] Añadir índices para consultas eficientes

#### **Tareas Backend - Configuración de Tareas (2 días)**

- [ ] **Implementar TaskConfigController** (1 día)
  - [ ] Crear `@RestController` `/api/admin/config/tasks`
  - [ ] Endpoint `GET /categories` - obtener categorías de tareas
  - [ ] Endpoint `POST /categories` - crear nueva categoría
  - [ ] Endpoint `PUT /categories/{id}` - actualizar categoría
  - [ ] Endpoint `DELETE /categories/{id}` - eliminar categoría
  - [ ] Endpoint `GET /priorities` - obtener prioridades de tareas
  - [ ] Endpoint `POST /priorities` - crear nueva prioridad
  - [ ] Endpoint `PUT /priorities/{id}` - actualizar prioridad
  - [ ] Endpoint `DELETE /priorities/{id}` - eliminar prioridad
  - [ ] Endpoint `GET /statuses` - obtener estados de tareas
  - [ ] Endpoint `POST /statuses` - crear nuevo estado
  - [ ] Implementar validación de dependencias antes de eliminar

- [ ] **Implementar TaskConfigService** (1 día)
  - [ ] Crear servicio `TaskConfigurationService`
  - [ ] Métodos CRUD para categorías de tareas
  - [ ] Métodos CRUD para prioridades de tareas
  - [ ] Métodos CRUD para estados de tareas
  - [ ] Validación de integridad referencial
  - [ ] Implementar ordenamiento y jerarquías
  - [ ] Añadir auditoría de cambios en configuraciones

#### **Tareas Backend - Configuración de Notificaciones (2 días)**

- [ ] **Implementar NotificationConfigController** (1 día)
  - [ ] Crear `@RestController` `/api/admin/config/notifications`
  - [ ] Endpoint `GET /preferences` - obtener preferencias globales
  - [ ] Endpoint `PUT /preferences` - actualizar preferencias globales
  - [ ] Endpoint `GET /templates` - obtener plantillas de notificaciones
  - [ ] Endpoint `POST /templates` - crear nueva plantilla
  - [ ] Endpoint `PUT /templates/{id}` - actualizar plantilla
  - [ ] Endpoint `DELETE /templates/{id}` - eliminar plantilla
  - [ ] Endpoint `GET /channels` - obtener canales de notificación
  - [ ] Endpoint `PUT /channels` - configurar canales
  - [ ] Implementar preview de plantillas

- [ ] **Implementar NotificationConfigService** (1 día)
  - [ ] Crear servicio `NotificationConfigurationService`
  - [ ] Gestión de preferencias globales de notificaciones
  - [ ] CRUD para plantillas de notificaciones
  - [ ] Configuración de canales (email, app, push)
  - [ ] Validación de plantillas con variables dinámicas
  - [ ] Implementar sistema de fallback para plantillas
  - [ ] Integración con sistema de notificaciones existente

### **Criterios de Aceptación**

#### **Funcionales**
- [ ] Los administradores pueden configurar todos los aspectos del sistema
- [ ] Las configuraciones se persisten correctamente en base de datos
- [ ] Los cambios de configuración se aplican inmediatamente
- [ ] Existe auditoría completa de cambios de configuración
- [ ] Las configuraciones tienen validación robusta

#### **Técnicos**
- [ ] Todas las configuraciones están centralizadas
- [ ] El sistema de caché funciona correctamente
- [ ] Las validaciones previenen configuraciones inválidas
- [ ] Existe rollback para configuraciones problemáticas
- [ ] Las APIs están completamente documentadas

### **Definición de "Terminado" (DoD)**
- [ ] ✅ Todas las configuraciones del frontend tienen backend funcional
- [ ] ✅ Sistema de persistencia y caché implementado
- [ ] ✅ Validaciones robustas para todas las configuraciones
- [ ] ✅ Auditoría completa de cambios implementada
- [ ] ✅ Documentación API completa en Swagger
- [ ] ✅ Pruebas unitarias e integración > 85%
- [ ] ✅ Frontend completamente integrado con backend

### **Riesgos Técnicos Identificados**

#### **Alto Riesgo**
- **Configuraciones inválidas**: Riesgo de romper el sistema
  - **Mitigación**: Validación estricta, rollback automático, configuraciones por defecto
- **Caché inconsistente**: Configuraciones obsoletas en caché
  - **Mitigación**: Invalidación automática, TTL corto para configuraciones críticas

#### **Medio Riesgo**
- **Concurrencia en actualizaciones**: Conflictos al actualizar configuraciones
  - **Mitigación**: Locks optimistas, versionado de configuraciones
- **Migración de configuraciones**: Pérdida de configuraciones existentes
  - **Mitigación**: Backup automático, migración gradual

### **Dependencias**
- **Prerequisitos**: Sistema de auditoría funcionando
- **Dependencias Externas**: Ninguna
- **Dependencias Internas**: Sistema de caché configurado

---

## Sprint 28: Backend de Configuración del Sistema - Parte 2 (Integraciones)

### **Descripción del Sprint**
Completar el sistema de configuración implementando la configuración de integraciones externas, mantenimiento del sistema y funcionalidades avanzadas de configuración.

### **Objetivos**
- Implementar configuración de integraciones externas
- Crear sistema de mantenimiento y diagnóstico
- Implementar configuraciones avanzadas y features flags
- Desarrollar herramientas de backup y restore de configuraciones
- Finalizar integración completa frontend-backend

### **Duración**: 1.5 semanas (7 días laborables)
### **Fecha Estimada**: Semana 7-8 de implementación
### **Recursos**: 1 Desarrollador Backend + 0.5 Desarrollador Frontend

---

### **4. Historia de Usuario: Configuración Avanzada y Mantenimiento**

**Como** administrador del sistema
**Quiero** configurar integraciones externas y herramientas de mantenimiento
**Para** optimizar el sistema y mantenerlo funcionando de manera óptima

#### **Tareas Backend - Configuración de Integraciones (2 días)**

- [ ] **Implementar IntegrationConfigController** (1 día)
  - [ ] Crear `@RestController` `/api/admin/config/integrations`
  - [ ] Endpoint `GET /` - listar todas las integraciones disponibles
  - [ ] Endpoint `GET /{id}` - obtener configuración de integración específica
  - [ ] Endpoint `PUT /{id}` - actualizar configuración de integración
  - [ ] Endpoint `POST /{id}/test` - probar conexión de integración
  - [ ] Endpoint `POST /{id}/sync` - sincronizar integración
  - [ ] Endpoint `GET /{id}/status` - obtener estado de integración
  - [ ] Implementar validación de credenciales y configuraciones

- [ ] **Implementar IntegrationConfigService** (1 día)
  - [ ] Crear servicio `IntegrationConfigurationService`
  - [ ] Gestión de configuraciones de Google Calendar
  - [ ] Gestión de configuraciones de Google Drive
  - [ ] Gestión de configuraciones de email/SMTP
  - [ ] Sistema de prueba de conexiones
  - [ ] Validación de credenciales OAuth
  - [ ] Implementar encriptación de credenciales sensibles

#### **Tareas Backend - Sistema de Mantenimiento (2 días)**

- [ ] **Implementar MaintenanceController** (1 día)
  - [ ] Crear `@RestController` `/api/admin/maintenance`
  - [ ] Endpoint `GET /status` - estado del sistema
  - [ ] Endpoint `POST /backup/config` - backup de configuraciones
  - [ ] Endpoint `POST /restore/config` - restore de configuraciones
  - [ ] Endpoint `POST /cleanup/temp` - limpiar archivos temporales
  - [ ] Endpoint `POST /cleanup/logs` - limpiar logs antiguos
  - [ ] Endpoint `POST /optimize/db` - optimizar base de datos
  - [ ] Endpoint `GET /health` - health check completo

- [ ] **Implementar MaintenanceService** (1 día)
  - [ ] Crear servicio `SystemMaintenanceService`
  - [ ] Implementar backup automático de configuraciones
  - [ ] Crear herramientas de limpieza de datos obsoletos
  - [ ] Implementar optimización de base de datos
  - [ ] Crear sistema de health checks
  - [ ] Implementar monitoreo de recursos del sistema
  - [ ] Añadir programación de tareas de mantenimiento

#### **Tareas Backend - Features Flags y Configuraciones Avanzadas (2 días)**

- [ ] **Implementar FeatureFlagsController** (1 día)
  - [ ] Crear `@RestController` `/api/admin/config/features`
  - [ ] Endpoint `GET /` - listar todas las features disponibles
  - [ ] Endpoint `PUT /{feature}` - habilitar/deshabilitar feature
  - [ ] Endpoint `GET /environment` - obtener configuración de entorno
  - [ ] Endpoint `PUT /environment` - actualizar configuración de entorno
  - [ ] Implementar validación de dependencias entre features

- [ ] **Implementar FeatureFlagsService** (1 día)
  - [ ] Crear servicio `FeatureFlagService`
  - [ ] Gestión dinámica de features flags
  - [ ] Validación de dependencias entre features
  - [ ] Implementar rollout gradual de features
  - [ ] Crear sistema de A/B testing básico
  - [ ] Integración con configuraciones de entorno

#### **Tareas Frontend - Integración Completa (1 día)**

- [ ] **Finalizar Integración Frontend** (1 día)
  - [ ] Actualizar todos los servicios de configuración
  - [ ] Conectar ConfiguracionIntegraciones con backend real
  - [ ] Implementar ConfiguracionMantenimiento funcional
  - [ ] Añadir gestión de features flags en UI
  - [ ] Implementar herramientas de backup/restore en frontend
  - [ ] Añadir validación en tiempo real de configuraciones

### **Criterios de Aceptación**

#### **Funcionales**
- [ ] Los administradores pueden configurar todas las integraciones externas
- [ ] El sistema de mantenimiento funciona correctamente
- [ ] Las features flags se pueden gestionar dinámicamente
- [ ] Existe backup y restore completo de configuraciones
- [ ] Las herramientas de diagnóstico proporcionan información útil

#### **Técnicos**
- [ ] Las credenciales sensibles están encriptadas
- [ ] El sistema de features flags es robusto
- [ ] Las herramientas de mantenimiento son seguras
- [ ] Existe monitoreo completo del sistema
- [ ] Las configuraciones se pueden migrar entre entornos

### **Definición de "Terminado" (DoD)**
- [ ] ✅ Sistema de configuración completamente funcional
- [ ] ✅ Todas las integraciones configurables desde UI
- [ ] ✅ Herramientas de mantenimiento operativas
- [ ] ✅ Features flags implementadas y funcionales
- [ ] ✅ Sistema de backup/restore probado
- [ ] ✅ Documentación completa de administración
- [ ] ✅ Frontend 100% integrado con backend

### **Riesgos Técnicos Identificados**

#### **Alto Riesgo**
- **Seguridad de credenciales**: Exposición de credenciales sensibles
  - **Mitigación**: Encriptación robusta, acceso restringido, auditoría completa
- **Operaciones de mantenimiento**: Riesgo de corrupción de datos
  - **Mitigación**: Backup automático antes de operaciones, validación exhaustiva

#### **Medio Riesgo**
- **Features flags**: Dependencias complejas entre features
  - **Mitigación**: Validación de dependencias, rollback automático
- **Configuraciones de entorno**: Inconsistencias entre entornos
  - **Mitigación**: Validación de configuraciones, templates por entorno

### **Dependencias**
- **Prerequisitos**: Sprint 27 completado (infraestructura de configuración)
- **Dependencias Externas**: APIs de Google (Calendar, Drive)
- **Dependencias Internas**: Sistema de encriptación configurado

---

## Sprint 29: Sistema de Alertas de Seguridad Backend

### **Descripción del Sprint**
Implementar el sistema completo de alertas de seguridad backend, incluyendo detección automática de actividades sospechosas, gestión de alertas, y herramientas de análisis de seguridad.

### **Objetivos**
- Implementar detección automática de actividades sospechosas
- Crear sistema de gestión de alertas de seguridad
- Desarrollar herramientas de análisis de patrones de seguridad
- Implementar notificaciones automáticas de alertas críticas
- Conectar frontend existente con backend funcional

### **Duración**: 2 semanas (10 días laborables)
### **Fecha Estimada**: Semana 9-10 de implementación
### **Recursos**: 1 Desarrollador Backend + 0.5 Desarrollador Frontend

---

### **5. Historia de Usuario: Detección Automática de Amenazas**

**Como** administrador de seguridad
**Quiero** detectar automáticamente actividades sospechosas en el sistema
**Para** responder rápidamente a posibles amenazas de seguridad

#### **Tareas Backend - Sistema de Detección (4 días)**

- [ ] **Implementar SecurityAlertController** (1 día)
  - [ ] Crear `@RestController` `/api/admin/security/alerts`
  - [ ] Endpoint `GET /` - listar alertas de seguridad con filtros
  - [ ] Endpoint `GET /{id}` - obtener detalles de alerta específica
  - [ ] Endpoint `PUT /{id}/status` - actualizar estado de alerta
  - [ ] Endpoint `POST /{id}/resolve` - resolver alerta con comentarios
  - [ ] Endpoint `GET /statistics` - estadísticas de alertas
  - [ ] Endpoint `GET /rules` - obtener reglas de detección
  - [ ] Endpoint `POST /rules` - crear nueva regla de detección
  - [ ] Endpoint `PUT /rules/{id}` - actualizar regla de detección

- [ ] **Implementar SecurityAlertService** (1.5 días)
  - [ ] Crear servicio `SecurityAlertService`
  - [ ] Método `createAlert(SecurityAlertDto)` - crear nueva alerta
  - [ ] Método `getAlerts(filters)` - obtener alertas con filtros
  - [ ] Método `updateAlertStatus(id, status)` - actualizar estado
  - [ ] Método `resolveAlert(id, resolution)` - resolver alerta
  - [ ] Método `getAlertStatistics(dateRange)` - estadísticas
  - [ ] Implementar clasificación automática de severidad
  - [ ] Añadir correlación de alertas relacionadas

- [ ] **Implementar Motor de Detección** (1.5 días)
  - [ ] Crear servicio `ThreatDetectionService`
  - [ ] Implementar `LoginAnomalyDetector` - detección de logins anómalos
  - [ ] Implementar `BruteForceDetector` - detección de ataques de fuerza bruta
  - [ ] Implementar `PrivilegeEscalationDetector` - detección de escalación de privilegios
  - [ ] Implementar `DataAccessAnomalyDetector` - acceso anómalo a datos
  - [ ] Implementar `SessionAnomalyDetector` - sesiones sospechosas
  - [ ] Crear sistema de reglas configurables
  - [ ] Implementar machine learning básico para detección de patrones

#### **Tareas Backend - Gestión de Reglas (2 días)**

- [ ] **Implementar SecurityRuleService** (1 día)
  - [ ] Crear servicio `SecurityRuleService`
  - [ ] CRUD para reglas de detección personalizadas
  - [ ] Validación de sintaxis de reglas
  - [ ] Sistema de activación/desactivación de reglas
  - [ ] Implementar testing de reglas con datos históricos
  - [ ] Crear templates de reglas comunes

- [ ] **Implementar Entidades de Seguridad** (1 día)
  - [ ] Crear entidad `SecurityAlert` con todos los campos necesarios
  - [ ] Crear entidad `SecurityRule` para reglas de detección
  - [ ] Crear entidad `AlertResolution` para resoluciones
  - [ ] Implementar repositorios especializados
  - [ ] Crear migración Flyway `V29__Create_Security_Alerts.sql`
  - [ ] Añadir índices para consultas eficientes

#### **Tareas Backend - Análisis y Estadísticas (2 días)**

- [ ] **Implementar SecurityAnalyticsService** (1 día)
  - [ ] Crear servicio `SecurityAnalyticsService`
  - [ ] Análisis de tendencias de seguridad
  - [ ] Detección de patrones de ataque
  - [ ] Generación de reportes de seguridad
  - [ ] Implementar scoring de riesgo por usuario
  - [ ] Crear dashboard de métricas de seguridad

- [ ] **Implementar Notificaciones de Seguridad** (1 día)
  - [ ] Integrar con sistema de notificaciones existente
  - [ ] Implementar notificaciones por email para alertas críticas
  - [ ] Crear notificaciones en tiempo real para administradores
  - [ ] Implementar escalación automática de alertas
  - [ ] Añadir integración con sistemas externos (Slack, Teams)

#### **Tareas Frontend - Integración Completa (2 días)**

- [ ] **Actualizar Servicios Frontend** (1 día)
  - [ ] Modificar `securityAlertService.ts` para usar endpoints reales
  - [ ] Eliminar datos mock y simulaciones
  - [ ] Implementar manejo de errores específicos
  - [ ] Añadir tipos TypeScript para respuestas del backend
  - [ ] Implementar caché con React Query

- [ ] **Actualizar Componentes de Seguridad** (1 día)
  - [ ] Conectar `SecurityAlertsPage` con backend real
  - [ ] Actualizar `SecurityAlertsList` para datos reales
  - [ ] Implementar `SecurityAlertRules` funcional
  - [ ] Añadir `SecurityAnalyticsDashboard` con métricas reales
  - [ ] Implementar notificaciones en tiempo real

### **Criterios de Aceptación**

#### **Funcionales**
- [ ] El sistema detecta automáticamente actividades sospechosas
- [ ] Las alertas se clasifican correctamente por severidad
- [ ] Los administradores pueden gestionar alertas eficientemente
- [ ] Existe análisis de tendencias y patrones de seguridad
- [ ] Las notificaciones críticas se envían inmediatamente

#### **Técnicos**
- [ ] El motor de detección es eficiente y escalable
- [ ] Las reglas de detección son configurables
- [ ] El sistema tiene baja tasa de falsos positivos
- [ ] Las consultas de análisis son optimizadas
- [ ] Existe integración con sistemas de monitoreo

### **Definición de "Terminado" (DoD)**
- [ ] ✅ Sistema de detección automática funcionando
- [ ] ✅ Gestión completa de alertas implementada
- [ ] ✅ Análisis y estadísticas operativos
- [ ] ✅ Notificaciones automáticas configuradas
- [ ] ✅ Frontend completamente integrado
- [ ] ✅ Documentación de seguridad completa
- [ ] ✅ Pruebas de penetración básicas realizadas

### **Riesgos Técnicos Identificados**

#### **Alto Riesgo**
- **Falsos positivos**: Demasiadas alertas falsas
  - **Mitigación**: Tuning cuidadoso de reglas, machine learning para mejora continua
- **Rendimiento**: Detección en tiempo real puede ser costosa
  - **Mitigación**: Procesamiento asíncrono, optimización de consultas

#### **Medio Riesgo**
- **Evasión de detección**: Ataques sofisticados pueden evadir detección
  - **Mitigación**: Múltiples capas de detección, actualización continua de reglas
- **Volumen de alertas**: Demasiadas alertas pueden saturar administradores
  - **Mitigación**: Priorización inteligente, agrupación de alertas relacionadas

### **Dependencias**
- **Prerequisitos**: Sistema de auditoría funcionando (completado)
- **Dependencias Externas**: Ninguna
- **Dependencias Internas**: Sistema de notificaciones funcionando

---

## Sprint 30: Backend de Diagnóstico del Sistema

### **Descripción del Sprint**
Implementar el sistema completo de diagnóstico y monitoreo del sistema, incluyendo health checks, métricas de rendimiento, monitoreo de recursos y herramientas de mantenimiento.

### **Objetivos**
- Implementar sistema completo de health checks
- Crear monitoreo de recursos del sistema en tiempo real
- Desarrollar herramientas de diagnóstico y troubleshooting
- Implementar alertas de rendimiento y disponibilidad
- Conectar frontend existente con métricas reales

### **Duración**: 2 semanas (10 días laborables)
### **Fecha Estimada**: Semana 11-12 de implementación
### **Recursos**: 1 Desarrollador Backend + 0.5 Desarrollador Frontend

---

### **6. Historia de Usuario: Monitoreo Completo del Sistema**

**Como** administrador del sistema
**Quiero** monitorear la salud y rendimiento del sistema en tiempo real
**Para** detectar y resolver problemas antes de que afecten a los usuarios

#### **Tareas Backend - Health Checks y Monitoreo (3 días)**

- [ ] **Implementar SystemHealthController** (1 día)
  - [ ] Crear `@RestController` `/api/admin/system/health`
  - [ ] Endpoint `GET /` - health check general del sistema
  - [ ] Endpoint `GET /database` - estado de la base de datos
  - [ ] Endpoint `GET /cache` - estado del sistema de caché
  - [ ] Endpoint `GET /external` - estado de servicios externos
  - [ ] Endpoint `GET /resources` - uso de recursos del sistema
  - [ ] Endpoint `GET /metrics` - métricas detalladas de rendimiento
  - [ ] Endpoint `GET /logs` - logs recientes del sistema
  - [ ] Implementar health checks personalizados

- [ ] **Implementar SystemHealthService** (1 día)
  - [ ] Crear servicio `SystemHealthService`
  - [ ] Health check de conectividad de base de datos
  - [ ] Health check de sistema de caché (Redis/Hazelcast)
  - [ ] Health check de servicios externos (APIs, SMTP)
  - [ ] Monitoreo de uso de memoria y CPU
  - [ ] Monitoreo de espacio en disco
  - [ ] Verificación de conectividad de red
  - [ ] Implementar scoring de salud general

- [ ] **Implementar ResourceMonitoringService** (1 día)
  - [ ] Crear servicio `ResourceMonitoringService`
  - [ ] Monitoreo de memoria JVM (heap, non-heap, GC)
  - [ ] Monitoreo de threads y pools de conexiones
  - [ ] Monitoreo de I/O de base de datos
  - [ ] Monitoreo de latencia de red
  - [ ] Implementar alertas automáticas por umbrales
  - [ ] Crear historial de métricas para análisis de tendencias

#### **Tareas Backend - Diagnóstico y Troubleshooting (3 días)**

- [ ] **Implementar DiagnosticsController** (1 día)
  - [ ] Crear `@RestController` `/api/admin/system/diagnostics`
  - [ ] Endpoint `GET /performance` - análisis de rendimiento
  - [ ] Endpoint `GET /bottlenecks` - detección de cuellos de botella
  - [ ] Endpoint `GET /errors` - análisis de errores recientes
  - [ ] Endpoint `POST /gc` - forzar garbage collection
  - [ ] Endpoint `GET /threads` - análisis de threads
  - [ ] Endpoint `GET /connections` - estado de conexiones
  - [ ] Endpoint `POST /cache/clear` - limpiar caché

- [ ] **Implementar DiagnosticsService** (1 día)
  - [ ] Crear servicio `SystemDiagnosticsService`
  - [ ] Análisis automático de rendimiento
  - [ ] Detección de memory leaks
  - [ ] Análisis de queries lentas de base de datos
  - [ ] Detección de deadlocks y contención
  - [ ] Análisis de patrones de error
  - [ ] Generación de reportes de diagnóstico

- [ ] **Implementar MaintenanceToolsService** (1 día)
  - [ ] Crear servicio `MaintenanceToolsService`
  - [ ] Herramientas de limpieza de datos obsoletos
  - [ ] Optimización automática de base de datos
  - [ ] Compactación de logs y archivos temporales
  - [ ] Backup automático de configuraciones críticas
  - [ ] Verificación de integridad de datos
  - [ ] Herramientas de migración y actualización

#### **Tareas Backend - Alertas y Notificaciones (2 días)**

- [ ] **Implementar SystemAlertsService** (1 día)
  - [ ] Crear servicio `SystemAlertsService`
  - [ ] Configuración de umbrales de alerta
  - [ ] Alertas por uso excesivo de recursos
  - [ ] Alertas por errores críticos
  - [ ] Alertas por degradación de rendimiento
  - [ ] Implementar escalación de alertas
  - [ ] Integración con sistemas de monitoreo externos

- [ ] **Implementar Entidades de Monitoreo** (1 día)
  - [ ] Crear entidad `SystemMetrics` para métricas históricas
  - [ ] Crear entidad `SystemAlert` para alertas de sistema
  - [ ] Crear entidad `DiagnosticReport` para reportes
  - [ ] Implementar repositorios especializados
  - [ ] Crear migración Flyway `V30__Create_System_Monitoring.sql`
  - [ ] Implementar retención automática de datos históricos

#### **Tareas Frontend - Integración y Dashboards (2 días)**

- [ ] **Actualizar Servicios Frontend** (1 día)
  - [ ] Modificar `diagnosticService.ts` para usar endpoints reales
  - [ ] Eliminar datos mock y simulaciones
  - [ ] Implementar polling para métricas en tiempo real
  - [ ] Añadir tipos TypeScript para métricas del sistema
  - [ ] Implementar WebSocket para actualizaciones en tiempo real

- [ ] **Actualizar Componentes de Diagnóstico** (1 día)
  - [ ] Conectar `SystemMonitorPage` con backend real
  - [ ] Actualizar `SystemHealthCard` con métricas reales
  - [ ] Implementar `SystemResourcesCard` funcional
  - [ ] Conectar `DatabaseStatsCard` con estadísticas reales
  - [ ] Añadir `SystemAlertsCard` con alertas en tiempo real
  - [ ] Implementar gráficos de tendencias con datos históricos

### **Criterios de Aceptación**

#### **Funcionales**
- [ ] El sistema proporciona health checks completos y precisos
- [ ] Las métricas de recursos se actualizan en tiempo real
- [ ] Las herramientas de diagnóstico identifican problemas correctamente
- [ ] Las alertas se generan apropiadamente según umbrales
- [ ] Los administradores pueden realizar mantenimiento desde la UI

#### **Técnicos**
- [ ] El monitoreo tiene impacto mínimo en el rendimiento
- [ ] Las métricas históricas se almacenan eficientemente
- [ ] Las alertas tienen baja tasa de falsos positivos
- [ ] El sistema es resiliente a fallos de monitoreo
- [ ] Existe integración con herramientas de monitoreo estándar

### **Definición de "Terminado" (DoD)**
- [ ] ✅ Sistema de health checks completamente funcional
- [ ] ✅ Monitoreo de recursos en tiempo real operativo
- [ ] ✅ Herramientas de diagnóstico implementadas
- [ ] ✅ Sistema de alertas configurado y probado
- [ ] ✅ Frontend completamente integrado con métricas reales
- [ ] ✅ Documentación de operaciones completa
- [ ] ✅ Runbooks para troubleshooting creados

### **Riesgos Técnicos Identificados**

#### **Alto Riesgo**
- **Impacto en rendimiento**: Monitoreo excesivo puede degradar rendimiento
  - **Mitigación**: Monitoreo asíncrono, sampling inteligente, optimización de consultas
- **Alertas spam**: Demasiadas alertas pueden saturar administradores
  - **Mitigación**: Umbrales inteligentes, agrupación de alertas, supresión temporal

#### **Medio Riesgo**
- **Fallos en monitoreo**: El sistema de monitoreo puede fallar
  - **Mitigación**: Redundancia en monitoreo, health checks del propio sistema de monitoreo
- **Almacenamiento de métricas**: Crecimiento excesivo de datos históricos
  - **Mitigación**: Políticas de retención, agregación de datos antiguos

### **Dependencias**
- **Prerequisitos**: Sistema de alertas de seguridad (Sprint 29)
- **Dependencias Externas**: Herramientas de monitoreo (opcional)
- **Dependencias Internas**: Sistema de notificaciones funcionando

---

## Sprint 31: Integraciones Externas Backend (Avanzado)

### **Descripción del Sprint**
Implementar el sistema completo de integraciones externas backend, incluyendo OAuth con Google, sincronización con Google Calendar y Drive, y herramientas de gestión de integraciones.

### **Objetivos**
- Implementar OAuth completo con Google (Calendar y Drive)
- Crear sincronización bidireccional con Google Calendar
- Desarrollar gestión de archivos con Google Drive
- Implementar herramientas de monitoreo de integraciones
- Conectar frontend existente con integraciones reales

### **Duración**: 2 semanas (10 días laborables)
### **Fecha Estimada**: Semana 13-14 de implementación
### **Recursos**: 1 Desarrollador Backend + 0.5 Desarrollador Frontend

---

### **7. Historia de Usuario: Integraciones Externas Funcionales**

**Como** administrador del sistema
**Quiero** integrar el sistema con servicios externos como Google Calendar y Drive
**Para** mejorar la productividad y sincronización de datos

#### **Tareas Backend - OAuth y Autenticación (3 días)**

- [ ] **Implementar GoogleOAuthController** (1 día)
  - [ ] Crear `@RestController` `/api/integrations/google/oauth`
  - [ ] Endpoint `GET /authorize` - iniciar flujo OAuth
  - [ ] Endpoint `POST /callback` - manejar callback OAuth
  - [ ] Endpoint `POST /refresh` - renovar tokens
  - [ ] Endpoint `DELETE /revoke` - revocar tokens
  - [ ] Endpoint `GET /status` - estado de autenticación
  - [ ] Implementar validación de scopes y permisos

- [ ] **Implementar GoogleOAuthService** (1 día)
  - [ ] Crear servicio `GoogleOAuthService`
  - [ ] Gestión completa del flujo OAuth 2.0
  - [ ] Almacenamiento seguro de tokens
  - [ ] Renovación automática de tokens
  - [ ] Validación de scopes requeridos
  - [ ] Manejo de errores de autenticación
  - [ ] Implementar encriptación de tokens

- [ ] **Implementar Entidades OAuth** (1 día)
  - [ ] Crear entidad `GoogleOAuthToken` para tokens
  - [ ] Crear entidad `IntegrationConfig` para configuraciones
  - [ ] Implementar repositorios especializados
  - [ ] Crear migración Flyway `V31__Create_Google_Integrations.sql`
  - [ ] Implementar encriptación de datos sensibles
  - [ ] Añadir auditoría de accesos

#### **Tareas Backend - Google Calendar Integration (3 días)**

- [ ] **Implementar GoogleCalendarController** (1 día)
  - [ ] Crear `@RestController` `/api/integrations/google/calendar`
  - [ ] Endpoint `GET /events` - obtener eventos de calendario
  - [ ] Endpoint `POST /events` - crear evento en calendario
  - [ ] Endpoint `PUT /events/{id}` - actualizar evento
  - [ ] Endpoint `DELETE /events/{id}` - eliminar evento
  - [ ] Endpoint `POST /sync` - sincronizar eventos
  - [ ] Endpoint `GET /calendars` - listar calendarios disponibles

- [ ] **Implementar GoogleCalendarService** (1.5 días)
  - [ ] Crear servicio `GoogleCalendarService`
  - [ ] Integración con Google Calendar API
  - [ ] Sincronización bidireccional de eventos
  - [ ] Mapeo entre entidades internas y eventos de Google
  - [ ] Manejo de conflictos en sincronización
  - [ ] Implementar webhooks para cambios en tiempo real
  - [ ] Gestión de múltiples calendarios

- [ ] **Implementar Sincronización Automática** (0.5 días)
  - [ ] Crear servicio `CalendarSyncService`
  - [ ] Programación automática de sincronización
  - [ ] Detección de cambios incrementales
  - [ ] Resolución de conflictos automática
  - [ ] Logging detallado de sincronización

#### **Tareas Backend - Google Drive Integration (3 días)**

- [ ] **Implementar GoogleDriveController** (1 día)
  - [ ] Crear `@RestController` `/api/integrations/google/drive`
  - [ ] Endpoint `GET /files` - listar archivos
  - [ ] Endpoint `POST /files/upload` - subir archivo
  - [ ] Endpoint `GET /files/{id}/download` - descargar archivo
  - [ ] Endpoint `DELETE /files/{id}` - eliminar archivo
  - [ ] Endpoint `POST /sync` - sincronizar archivos
  - [ ] Endpoint `GET /folders` - gestión de carpetas

- [ ] **Implementar GoogleDriveService** (1.5 días)
  - [ ] Crear servicio `GoogleDriveService`
  - [ ] Integración con Google Drive API
  - [ ] Gestión de archivos y carpetas
  - [ ] Sincronización de archivos adjuntos
  - [ ] Manejo de permisos y compartición
  - [ ] Implementar versionado de archivos
  - [ ] Optimización de transferencias grandes

- [ ] **Implementar Gestión de Archivos** (0.5 días)
  - [ ] Crear servicio `DriveFileService`
  - [ ] Mapeo entre archivos locales y Drive
  - [ ] Sincronización automática de adjuntos
  - [ ] Backup automático de archivos críticos
  - [ ] Limpieza de archivos obsoletos

#### **Tareas Frontend - Integración Completa (1 día)**

- [ ] **Finalizar Integraciones Frontend** (1 día)
  - [ ] Conectar `RealCalendarIntegrationService` con backend
  - [ ] Conectar `RealDriveIntegrationService` con backend
  - [ ] Implementar flujo OAuth completo en frontend
  - [ ] Actualizar `ConfiguracionIntegraciones` con funcionalidad real
  - [ ] Añadir monitoreo de estado de integraciones
  - [ ] Implementar notificaciones de sincronización

### **Criterios de Aceptación**

#### **Funcionales**
- [ ] Los usuarios pueden autenticarse con Google OAuth
- [ ] La sincronización con Google Calendar funciona bidireccional
- [ ] Los archivos se sincronizan correctamente con Google Drive
- [ ] Las integraciones se pueden configurar desde la UI
- [ ] Existe monitoreo del estado de las integraciones

#### **Técnicos**
- [ ] Los tokens OAuth se almacenan de forma segura
- [ ] La sincronización es eficiente y no duplica datos
- [ ] Las APIs de Google se usan correctamente
- [ ] Existe manejo robusto de errores de red
- [ ] Las integraciones son resilientes a fallos temporales

### **Definición de "Terminado" (DoD)**
- [ ] ✅ OAuth con Google completamente funcional
- [ ] ✅ Sincronización bidireccional con Calendar operativa
- [ ] ✅ Gestión de archivos con Drive implementada
- [ ] ✅ Frontend completamente integrado
- [ ] ✅ Monitoreo de integraciones funcionando
- [ ] ✅ Documentación de configuración completa
- [ ] ✅ Pruebas de integración con APIs reales

### **Riesgos Técnicos Identificados**

#### **Alto Riesgo**
- **Límites de API de Google**: Exceder quotas de API
  - **Mitigación**: Implementar rate limiting, caché inteligente, manejo de quotas
- **Fallos de red**: Problemas de conectividad con APIs externas
  - **Mitigación**: Retry automático, fallback graceful, queue de operaciones

#### **Medio Riesgo**
- **Cambios en APIs de Google**: Deprecación o cambios en APIs
  - **Mitigación**: Versionado de APIs, monitoreo de deprecaciones, abstracción de APIs
- **Sincronización de datos**: Conflictos en sincronización bidireccional
  - **Mitigación**: Estrategias de resolución de conflictos, timestamps, versionado

### **Dependencias**
- **Prerequisitos**: Sistema de configuración completado (Sprint 27-28)
- **Dependencias Externas**: APIs de Google (Calendar, Drive), credenciales OAuth
- **Dependencias Internas**: Sistema de encriptación, gestión de archivos

---

## 📊 **RESUMEN EJECUTIVO: ROADMAP DE FUNCIONALIDADES ADMINISTRATIVAS**

### **🎯 Objetivo Alcanzado**
Al completar estos 5 sprints críticos, la plataforma administrativa habrá evolucionado del **72% actual** de completitud a un estado **production-ready del 95%**.

### **📈 Progreso por Sprint**

| Sprint | Funcionalidad | Duración | Completitud Objetivo | Estado Actual |
|--------|---------------|----------|---------------------|---------------|
| **25-26** | Backend Reportes y Métricas | 4 semanas | +15% (87%) | ⚠️ 65% → ✅ 95% |
| **27-28** | Backend Configuración Sistema | 3 semanas | +5% (92%) | ⚠️ 60% → ✅ 95% |
| **29** | Sistema Alertas Seguridad | 2 semanas | +2% (94%) | ❌ 0% → ✅ 95% |
| **30** | Backend Diagnóstico Sistema | 2 semanas | +1% (95%) | ❌ 0% → ✅ 95% |
| **31** | Integraciones Externas | 2 semanas | +0% (95%) | ⚠️ 45% → ✅ 95% |

### **🏆 Funcionalidades que Pasarán a Production-Ready**

#### **✅ Ya Production-Ready (No requieren desarrollo)**
1. **Gestión de Usuarios** - 95% completo
2. **Sistema de Autenticación** - 95% completo
3. **Flujos de Trabajo de Tareas** - 90% completo
4. **Auditoría de Usuarios** - 85% completo

#### **🚀 Nuevas Funcionalidades Production-Ready (Post-Sprints)**
1. **Dashboard Administrativo con Métricas Reales** - 95% completo
2. **Sistema de Reportes Personalizados** - 95% completo
3. **Configuración Centralizada del Sistema** - 95% completo
4. **Alertas de Seguridad Automáticas** - 95% completo
5. **Diagnóstico y Monitoreo del Sistema** - 95% completo
6. **Integraciones con Google (Calendar/Drive)** - 95% completo

### **💼 Valor de Negocio Entregado**

#### **Para Administradores del Sistema:**
- **📊 Visibilidad Completa**: Métricas en tiempo real y reportes personalizados
- **⚙️ Control Total**: Configuración centralizada de todos los aspectos del sistema
- **🛡️ Seguridad Avanzada**: Detección automática de amenazas y alertas
- **🔧 Mantenimiento Proactivo**: Herramientas de diagnóstico y monitoreo
- **🔗 Integración Empresarial**: Conectividad con herramientas de Google

#### **Para la Organización:**
- **📈 Productividad**: Integración con calendarios y gestión de archivos
- **🔒 Seguridad**: Monitoreo continuo y respuesta a amenazas
- **📋 Compliance**: Auditoría completa y reportes de cumplimiento
- **⚡ Eficiencia**: Automatización de tareas administrativas
- **📊 Toma de Decisiones**: Datos en tiempo real para decisiones informadas

### **🎯 Métricas de Éxito**

#### **Técnicas:**
- **Cobertura de Pruebas**: > 85% en todos los nuevos componentes
- **Rendimiento**: APIs < 2 segundos, dashboards < 3 segundos
- **Disponibilidad**: 99.5% uptime con monitoreo automático
- **Seguridad**: 0 vulnerabilidades críticas, detección automática de amenazas

#### **Funcionales:**
- **Adopción**: 100% de administradores usando nuevas funcionalidades
- **Satisfacción**: > 4.5/5 en encuestas de usabilidad
- **Eficiencia**: 50% reducción en tiempo de tareas administrativas
- **Incidentes**: 80% reducción en incidentes no detectados

### **🚀 Próximos Pasos Post-Implementación**

#### **Fase de Estabilización (2 semanas)**
- [ ] Monitoreo intensivo de todas las nuevas funcionalidades
- [ ] Ajustes de rendimiento basados en uso real
- [ ] Capacitación de administradores en nuevas herramientas
- [ ] Documentación de procedimientos operativos

#### **Fase de Optimización (4 semanas)**
- [ ] Análisis de métricas de uso y rendimiento
- [ ] Optimizaciones basadas en feedback de usuarios
- [ ] Implementación de mejoras menores
- [ ] Preparación para funcionalidades avanzadas futuras

### **💡 Recomendaciones Estratégicas**

1. **Priorizar Sprints 25-26**: El backend de reportes es crítico para el valor inmediato
2. **Paralelizar cuando sea posible**: Algunos sprints pueden ejecutarse parcialmente en paralelo
3. **Invertir en testing**: La calidad es crucial para funcionalidades administrativas
4. **Capacitación temprana**: Comenzar capacitación de administradores durante desarrollo
5. **Monitoreo continuo**: Implementar observabilidad desde el primer sprint

### **🎉 Resultado Final**

Al completar este roadmap, la plataforma tendrá:
- **✅ 95% de completitud** en funcionalidades administrativas
- **✅ Production-ready** para despliegue empresarial
- **✅ Capacidades avanzadas** de administración y monitoreo
- **✅ Integración empresarial** con herramientas externas
- **✅ Base sólida** para futuras expansiones

**La plataforma estará lista para soportar organizaciones de cualquier tamaño con herramientas administrativas de clase empresarial.**
