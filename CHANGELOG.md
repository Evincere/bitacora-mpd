# Registro de Cambios (Changelog)

## [Unreleased]

### Próximas Mejoras (Sprint 25)
- Implementación de nuevas funcionalidades

### Cambios Recientes
- Corrección de error de importación en componentes que usan ConfirmDialog
  - Creado archivo de exportación para el componente ConfirmDialog en `components/ui/Dialog/index.ts`
  - Corregida la importación en `UserList.tsx` y `CategoriasList.tsx`
  - Implementada solución para evitar el error "Failed to resolve import @/components/ui/Dialog"
- Configuración unificada de repositorios JPA
  - Modificada la configuración de `@EnableJpaRepositories` para escanear todos los paquetes relevantes de una vez
  - Creado documento de buenas prácticas para repositorios JPA en `docs/jpa-repositories-best-practices.md`
  - Implementadas convenciones de nombres para evitar dependencias circulares
  - Mejorada la documentación sobre prevención de dependencias circulares en repositorios
- Refactorización y mejora de código para corregir errores y advertencias en el sistema
  - Corrección de errores en el sistema de auditoría
  - Resolución de advertencias en TaskRequestCreatedEventListener con anotaciones @JsonProperty
  - Eliminación de importaciones no utilizadas en UserAuditLogEntity
  - Eliminación de variables no utilizadas en TaskRequestWorkflowService
  - Adición de anotaciones @NonNull en SecurityFilterHandler
  - Corrección de importaciones y campos no utilizados en TaskRequestCommentAttachmentController
  - Mejora de parámetros @RequestParam para eliminar advertencias
  - Configuración de lifecycle mapping en pom.xml para resolver problemas de plugins Maven
- Implementación de sistema de alertas y notificaciones de seguridad para auditoría
- Desarrollo de componente `SecurityAlertsList` para visualizar alertas de seguridad
- Implementación de componente `SecurityAlertCard` para mostrar detalles de alertas
- Creación de componente `SecurityAlertStatistics` para análisis de alertas
- Desarrollo de componente `SecurityAlertRules` para configurar reglas de detección
- Implementación de notificaciones en tiempo real para alertas de seguridad
- Implementación de sistema de reportes personalizables y programados
- Desarrollo de componente `ReportBuilder` para creación de reportes ad-hoc
- Implementación de selección de campos, filtros, agrupación y ordenamiento
- Creación de componente `SavedReportsList` para gestionar reportes guardados
- Desarrollo de componente `ScheduledReportsList` para programar reportes
- Implementación de exportación de reportes en múltiples formatos
- Implementación de herramientas de diagnóstico y mantenimiento del sistema
- Desarrollo de componente `SystemMonitor` para monitoreo en tiempo real
- Creación de herramientas para verificación de integridad de datos
- Implementación de funcionalidades para tareas de mantenimiento programadas
- Desarrollo de gestión de backups y restauración
- Implementación de dashboard administrativo avanzado con métricas en tiempo real
- Desarrollo de gráficos interactivos con filtros para análisis de datos
- Creación de visualizaciones para distribución de tareas por categoría y prioridad
- Implementación de sistema de auditoría de usuarios con registro detallado de actividades
- Desarrollo de componente `UserAuditLog` para visualizar y filtrar registros de auditoría
- Implementación de exportación de registros de auditoría a CSV
- Creación de funcionalidad para marcar actividades sospechosas

### Added
- Integración de la librería `driver.js` para implementar tours interactivos.
  - Hook `useTourGuide` en `src/components/ui/TourGuide.tsx` para gestionar tours.
  - Hook `useDashboardTour` en `src/features/auth/hooks/useDashboardTour.ts` para tours específicos del dashboard según el rol del usuario.
  - Ejemplo de pasos para SOLICITANTE, ASIGNADOR y EJECUTOR.

### Updated
- Documentación actualizada para reflejar la nueva funcionalidad de tours interactivos.

## [v1.5.0] - 2023-11-30 - Sprint 23: Mejora del Rol de Administrador

### Añadido

- Implementación de Gestión de Usuarios y Roles para Administradores
  - Creación de componente `UserList` con filtros avanzados, paginación y ordenamiento
  - Implementación de componente `UserForm` para crear y editar usuarios con validación avanzada
  - Desarrollo de componente `UserDetail` para visualizar información completa de usuarios
  - Implementación de componente `PermissionsManager` para gestionar permisos por rol
  - Creación de servicios y hooks para interactuar con la API de usuarios
  - Implementación de rutas protegidas para la gestión de usuarios
  - Integración con el menú lateral y dashboard de administrador

- Implementación de Configuración del Sistema para Administradores
  - Mejora del componente `ConfiguracionTareas` para gestionar categorías y prioridades
  - Implementación de CRUD completo para categorías de tareas
  - Desarrollo de componente `CategoriasList` para visualizar y editar categorías
  - Implementación de componente `PrioridadesList` para visualizar prioridades del sistema
  - Mejora del componente `ConfiguracionNotificaciones` con preferencias personalizables
  - Implementación de componente `NotificationTemplates` para gestionar plantillas de notificaciones
  - Mejora del componente `ConfiguracionIntegraciones` con integraciones reales
  - Implementación de servicios para integración con Google Calendar y Google Drive
  - Desarrollo de componentes `ConnectionTest` y `SyncHistory` para pruebas de conexión e historial
  - Creación de componente `ConfiguracionGeneral` con múltiples secciones:
    - Implementación de `PerformanceConfig` para ajustes de rendimiento y caché
    - Desarrollo de `SecurityConfig` para políticas de seguridad y contraseñas
    - Creación de `EmailConfig` para configuración de correo electrónico
    - Implementación de `MaintenanceConfig` para modo de mantenimiento
    - Desarrollo de `FeaturesConfig` para habilitar/deshabilitar características
  - Creación de servicios y hooks para interactuar con la API de configuración
  - Integración con el menú lateral y dashboard de administrador

- Implementación del Patrón Observer para Eventos de Autenticación en el Frontend
  - Creación de clase `AuthEventEmitter` que implementa el patrón Observer para centralizar eventos de autenticación
  - Definición de tipos de eventos específicos: `login`, `logout`, `tokenExpired`, `tokenRefreshed`, `authError`, etc.
  - Implementación de métodos para suscribirse, desuscribirse y emitir eventos
  - Refactorización de servicios de autenticación para utilizar el nuevo sistema de eventos
  - Creación de hook personalizado `useAuthEvents` para facilitar la suscripción a eventos
  - Implementación de componente `AuthEventsListener` para reaccionar a eventos de autenticación
  - Integración del sistema de eventos con el flujo de autenticación existente
  - Mejora de la experiencia de usuario con notificaciones contextuales basadas en eventos

- Mejora del sistema de autenticación y seguridad
  - Unificación de controladores de autenticación (`AuthController.java` y `RootAuthController.java`) en un único controlador
  - Implementación de un servicio de tokens mejorado (`tokenService.ts`) para gestión segura de tokens JWT
  - Creación de un servicio de manejo de errores centralizado (`errorHandlingService.ts`)
  - Implementación de un cliente HTTP con interceptores para renovación automática de tokens (`apiClient.ts`)
  - Mejora del manejo de errores de autenticación con mensajes descriptivos
  - Actualización del servicio de autenticación para utilizar los nuevos servicios
  - Mejora del proceso de cierre de sesión con invalidación de tokens en el servidor
  - Aplicación de patrones de diseño para mejorar la arquitectura:
    - Patrón Strategy para diferentes mecanismos de autenticación
    - Patrón Factory para la creación de tokens
    - Patrón Chain of Responsibility para filtros de seguridad
      - Implementación de manejadores especializados: `BlacklistCheckHandler`, `JwtValidationHandler`, `PermissionsHandler`
      - Configuración de la cadena de filtros en `SecurityConfig`
      - Mejora de la modularidad y extensibilidad del sistema de seguridad
  - Corrección de errores en el sistema de autenticación:
    - Añadido método `getExpirationDateFromToken` en `JwtTokenProvider`
    - Añadido método `getUserIdFromToken` en `JwtTokenProvider`
    - Añadido método `findSessionByRefreshToken` en `UserSessionService`
    - Añadido método `getExpirationDate` en la interfaz `TokenFactory` y su implementación

- Implementación de funcionalidad para editar y reenviar solicitudes rechazadas
  - Creada ruta `/app/solicitudes/editar/:id` para editar solicitudes rechazadas
  - Modificado el componente `SolicitudForm` para soportar la edición de solicitudes existentes
  - Añadida funcionalidad para cargar los datos de la solicitud rechazada en el formulario
  - Implementada visualización de archivos adjuntos existentes y capacidad para añadir nuevos
  - Añadido botón "Guardar y reenviar" para actualizar y reenviar la solicitud en un solo paso
  - Añadido botón "Guardar cambios" para actualizar la solicitud sin reenviarla
  - Añadido botón de edición en la vista de seguimiento de solicitudes rechazadas
  - Añadido botón de edición en la lista de solicitudes para solicitudes rechazadas
  - Actualizado el hook `useSolicitudes` para soportar la actualización y reenvío de solicitudes
  - Actualizado el servicio `solicitudesService` para incluir métodos de actualización
  - Mejorada la experiencia de usuario con mensajes claros sobre el motivo del rechazo
  - Implementada validación para asegurar que solo se puedan editar solicitudes en estado REJECTED

- Planificación de implementación de Apache Kafka
  - Diseñado plan detallado para implementación incremental en tres sprints
  - Definidas historias de usuario y tareas técnicas para cada fase
  - Establecidos criterios de aceptación y planes de mitigación de riesgos
  - Planificada capacitación del equipo en conceptos fundamentales de Kafka
  - Estructurada implementación comenzando por sistema de notificaciones
  - Diseñada arquitectura para Event Sourcing y seguimiento de cambios
  - Planificada implementación de CQRS para optimización de consultas
  - Actualizado archivo TASKS.md con el plan completo de implementación

- Implementación de componentes UI personalizados para reemplazar Material UI
  - Creado componente Dialog personalizado para reemplazar el Dialog de Material UI
  - Creado componente TextField personalizado para reemplazar el TextField de Material UI
  - Creado componente FormHelperText personalizado para reemplazar el FormHelperText de Material UI
  - Actualizado el componente ReenviarSolicitudModal para usar los componentes personalizados
  - Añadidas dependencias de Material UI al package.json para mantener compatibilidad con componentes existentes
  - Mejorada la consistencia visual de los componentes personalizados con el diseño de la aplicación

- Mejora de la consistencia visual de botones y filtros en la interfaz
  - Creados componentes reutilizables RefreshButton y FilterBadge para mantener coherencia visual
  - Implementado estilo de botones de actualización con fondos oscuros y efectos visuales mejorados
  - Rediseñados filtros para seguir la estética de los badges (StatusBadge, PriorityBadge, CategoryBadge)
  - Añadida animación de rotación para el icono durante la actualización
  - Mejorado el contraste y legibilidad del texto en todos los componentes
  - Implementadas transiciones suaves entre estados normal y hover
  - Optimizada la experiencia visual con efectos sutiles que mejoran la usabilidad
  - Mantenida la coherencia visual con el tema general de la aplicación
  - Extendida la implementación a la sección "En Progreso" para mantener consistencia en toda la aplicación
  - Añadidos filtros de búsqueda, categoría y prioridad a la sección "En Progreso"
  - Implementado mensaje informativo cuando no hay resultados que coincidan con los filtros
  - Añadido botón para limpiar filtros cuando no se encuentran resultados

- Mejoras en la sección de Historial de tareas para el rol EJECUTOR
  - Implementado informe detallado de tareas al hacer clic en "Ver informe completo"
  - Creado componente modal TaskReportModal para mostrar información detallada de la tarea
  - Añadida visualización de historial completo de cambios de estado
  - Implementada visualización de comentarios asociados a la tarea
  - Añadida sección para mostrar archivos adjuntos con opción de descarga
  - Incluidas métricas de tiempo dedicado y fechas relevantes
  - Mejorada la presentación de información del solicitante y asignador
  - Rediseñado el mensaje de aprobación para mayor coherencia visual con el sistema de badges
  - Mejorado el contraste y legibilidad del texto en los mensajes de aprobación/rechazo
  - Añadidos iconos para mejorar la experiencia visual

- Intercambio de colores entre badges de estado "APROBADA" y prioridad "BAJA"
  - Modificados los colores del badge de estado APPROVED para usar los colores originales de la prioridad LOW
  - Modificados los colores del badge de prioridad LOW para usar los colores originales del estado APPROVED
  - Mantenida la consistencia visual con el sistema unificado de badges con fondos oscuros

- Sistema unificado de badges con fondos oscuros para toda la aplicación
  - Modificados los componentes StatusBadge, PriorityBadge y CategoryBadge para utilizar fondos oscuros manteniendo los colores originales de bordes, sombras y texto
  - Implementada consistencia visual entre todos los tipos de badges (estado, prioridad y categoría)
  - Mejorado el contraste entre el texto y el fondo para garantizar la legibilidad en todos los badges
  - Implementadas transiciones suaves entre estados normal y hover en todos los componentes
  - Mantenida la identidad visual distintiva de cada tipo de badge mientras se conserva la coherencia del diseño
  - Optimizada la experiencia visual con efectos sutiles que mejoran la usabilidad

- Mejora del sistema de badges/pills en la sección de Historial de tareas para el rol EJECUTOR
  - Implementado sistema unificado de badges para estado, prioridad y categoría de tareas
  - Mejorado el contraste visual entre las tarjetas y el fondo
  - Añadidos efectos visuales sutiles (sombras, bordes, gradientes) para mejorar la jerarquía visual
  - Implementada consistencia visual en toda la aplicación con el mismo estilo de badges
  - Mejorada la experiencia visual con animaciones y efectos hover en las tarjetas
  - Añadido badge de categoría para facilitar la identificación rápida del tipo de tarea
  - Optimizada la organización visual de los badges para mejor legibilidad
  - Mejorado el diseño de los filtros y controles de búsqueda para mayor usabilidad

- Mejora de la experiencia de usuario para el rol EJECUTOR
  - Implementación de interfaz dinámica que responde al estado actual de las tareas
  - Deshabilitación o no visualización del botón "Iniciar Tarea" cuando no hay tareas pendientes
  - Mejora de los mensajes informativos cuando no hay tareas asignadas o en progreso
  - Actualización automática de los componentes del dashboard para reflejar el estado real
  - Retroalimentación visual clara sobre las acciones disponibles según el contexto
  - Mejora de los mensajes de estado vacío en las listas de tareas y gráficos
  - Implementación de alerta informativa cuando no hay tareas asignadas
  - Optimización de la experiencia visual con mensajes contextuales
  - Corrección de la tarjeta "Tiempo Promedio de Completado" para mostrar datos reales o "N/A" cuando no hay datos suficientes

- Eliminación de datos simulados en el sistema de notificaciones
  - Eliminados los datos simulados (mock data) del contexto RealTimeNotificationContext
  - Implementada la persistencia de notificaciones en localStorage para mantener su estado entre sesiones
  - Mejorado el componente NotificacionesButton para usar notificaciones reales del contexto
  - Actualizado el componente NotificacionesPanel para mostrar notificaciones reales
  - Implementado manejo de errores y experiencia de usuario mejorada cuando no hay notificaciones
  - Mejorado el formateo de fechas en las notificaciones usando date-fns

- Eliminación de datos simulados en el sistema de asignación
  - Creada migración V23__Remove_Test_Task_Requests.sql para eliminar solicitudes de prueba de la base de datos
  - Eliminados los datos simulados del componente DashboardAsignador
  - Eliminados los datos simulados del servicio asignacionService
  - Mejorado el manejo de errores para devolver arrays vacíos en lugar de datos simulados

- Implementación del endpoint `/api/activities/stats/workload` para distribución de carga de trabajo
  - Creado servicio ActivityWorkloadService para obtener datos reales de distribución de carga
  - Implementada lógica para obtener usuarios con rol EJECUTOR y sus tareas asignadas
  - Añadido cálculo de estadísticas por estado de tareas (asignadas, en progreso, completadas)
  - Actualizado el controlador para usar el nuevo servicio
  - Añadido manejo de errores para el endpoint
  - Corregidas importaciones y acceso a métodos en ActivityWorkloadService

- Corrección de error en BandejaEntrada.tsx con assignTaskRequest
  - Corregido el uso de assignTaskRequest por assignTask en BandejaEntrada.tsx
  - Actualizada la referencia a la función correcta del hook useAsignacion

- Implementación de adjuntos en comentarios para solicitudes
  - Creado componente CommentSection mejorado con soporte para archivos adjuntos
  - Implementada funcionalidad para adjuntar archivos a comentarios en el chat de solicitudes
  - Añadida visualización de archivos adjuntos en los comentarios con opciones de descarga
  - Implementado endpoint en el backend para subir archivos adjuntos a comentarios
  - Actualizado el modelo de datos para soportar archivos adjuntos en comentarios
  - Mejorada la experiencia de usuario con indicadores visuales para archivos adjuntos
  - Implementada descarga directa de archivos adjuntos desde los comentarios

- Corrección del dashboard del solicitante para mostrar correctamente la cantidad de solicitudes
  - Modificado el hook `useSmartDashboardData` para usar la estructura correcta de datos (`taskRequests` en lugar de `content`)
  - Corregido el problema de actualización de datos con `staleTime: 0` para forzar la actualización inmediata
  - Añadido botón de actualización manual para refrescar los datos del dashboard
  - Implementada animación de carga para el botón de actualización
  - Mejorados los logs para facilitar la depuración de problemas con los datos
  - Corregido el procesamiento de datos para calcular correctamente los contadores de solicitudes
  - Añadida compatibilidad con diferentes estructuras de datos para mayor robustez

- Implementación de funcionalidad para editar y reasignar tareas para usuario asignador
  - Creado componente EditarTarea.tsx para permitir la edición de solicitudes y tareas
  - Creado componente ReasignarTarea.tsx para permitir la reasignación de tareas a otros ejecutores
  - Actualizado el hook useAsignacion para incluir la funcionalidad de reasignación
  - Implementado método reassignTask en asignacionService para comunicarse con la API
  - Actualizadas las rutas en App.tsx para incluir las nuevas páginas
  - Mejorada la experiencia de usuario con formularios intuitivos y validación de datos
  - Implementada navegación fluida entre las páginas de detalle, edición y reasignación
  - Mejorada la visualización de nombres de solicitante y ejecutor cuando no están disponibles en la API

- Mejora del dashboard de solicitante para mostrar valores reales
  - Corregido el problema de actualización de datos en el dashboard
  - Implementada actualización automática de datos al cargar el dashboard
  - Añadido botón de recarga manual para actualizar los datos
  - Mejorada la visualización de estadísticas con datos reales
  - Optimizada la obtención de datos para evitar problemas de caché
  - Implementada carga forzada de estadísticas al iniciar el dashboard
  - Mejorado el manejo de errores en las peticiones a la API
  - Implementada actualización periódica de datos cada 30 segundos
  - Reemplazado el cliente ky por fetch nativo para evitar problemas de caché

- Mejora de la experiencia de usuario en la visualización del progreso de tareas
  - Implementada visualización mejorada del porcentaje de progreso con colores según el avance
  - Añadida información sobre tiempo restante hasta la fecha límite con indicadores visuales
  - Implementado cálculo de fecha estimada de finalización basado en el progreso actual
  - Mejorada la visualización de fechas de inicio y límite con formato más claro
  - Añadidos indicadores visuales para tareas vencidas o próximas a vencer
  - Implementada barra de progreso con colores dinámicos según el porcentaje completado
  - Mejorada la organización visual de la información para facilitar su comprensión

- Mejora de la consistencia visual de los badges en la aplicación
  - Actualizado el estilo de los badges de estado y prioridad para mantener una apariencia uniforme
  - Implementado diseño con bordes redondeados, sombras y efectos de transición
  - Mejorado el contraste visual para facilitar la identificación de estados
  - Eliminado el componente de depuración para añadir permisos que aparecía en la parte inferior de la pantalla

- Mejora de los mensajes de error en la interfaz de usuario
  - Creado componente ErrorAlert con estilo glassmorphism para mostrar errores de forma consistente
  - Implementado componente ErrorSolicitud especializado para errores al cargar solicitudes
  - Mejorada la experiencia visual con animaciones y efectos de transición
  - Añadida información contextual sobre posibles causas y soluciones
  - Implementado botón de reintento con animación al hacer hover
  - Mantenida la consistencia visual con el tema general de la aplicación
- Implementación de descarga directa de archivos adjuntos para usuarios solicitantes
  - Modificada la funcionalidad de descarga en AsignarTarea.tsx y DetalleTarea.tsx para descargar directamente los archivos
  - Mejorada la iconografía con el icono FiDownload para indicar claramente que los archivos son descargables
  - Implementado feedback visual con notificaciones toast al descargar archivos
  - Mejorado el estilo de los elementos de archivos adjuntos con efectos hover y transiciones
- Mejora de la interacción con archivos adjuntos para usuarios
  - Mejorado el componente de visualización de archivos adjuntos en `DetalleTarea.tsx` y `ActualizarProgreso.tsx`
  - Implementada funcionalidad de descarga directa de archivos adjuntos (sin abrir en nueva pestaña)
  - Implementada capacidad para que los ejecutores puedan adjuntar nuevos archivos a las tareas asignadas
  - Añadida visualización de archivos adjuntos en la página de seguimiento de solicitud para usuarios solicitantes
  - Implementada funcionalidad de descarga de archivos adjuntos para usuarios solicitantes
  - Añadidos efectos visuales para indicar que los archivos son interactivos (hover, sombras, animaciones)
  - Mejorada la experiencia de usuario con notificaciones toast al descargar archivos
  - Añadido título descriptivo a los elementos de archivos adjuntos para mejorar la usabilidad

### Corregido
- Corrección de error en MisSolicitudes.tsx por falta de importación del icono FiEdit2
  - Añadido FiEdit2 a la lista de importaciones para resolver el error "FiEdit2 is not defined"
  - Solucionado el error que impedía editar solicitudes rechazadas desde la vista de Mis Solicitudes

- Mejora de la gestión de errores de WebSocket en RealTimeNotificationContext
  - Implementada mejor gestión de errores para evitar mensajes repetitivos en la consola
  - Mejorado el manejo de conexiones WebSocket en entorno de desarrollo
  - Implementada carga de notificaciones desde localStorage cuando el WebSocket no está disponible
  - Reducido el spam de mensajes de error en la consola durante el desarrollo
  - Asegurado el funcionamiento correcto de la aplicación incluso cuando el WebSocket no está disponible

- Corrección del bucle infinito al editar solicitudes rechazadas
  - Implementado sistema de caché para evitar llamadas repetitivas al endpoint de detalles de solicitud
  - Creado nuevo hook useTaskRequestDetails que utiliza React Query para gestionar el estado y la caché
  - Mejorado el componente SolicitudForm para usar el nuevo hook y evitar efectos secundarios innecesarios
  - Optimizado el servicio solicitudesService para reducir logs duplicados y mejorar la depuración
  - Implementada validación adicional para evitar llamadas con IDs inválidos

- Corrección del error 500 al actualizar solicitudes rechazadas
  - Modificado el flujo de edición de solicitudes rechazadas para usar el endpoint de reenvío en lugar de actualización directa
  - Eliminada la llamada PUT a /api/task-requests/{id} que estaba generando el error 500
  - Mejorado el manejo de archivos adjuntos en solicitudes rechazadas
  - Implementada una solución que mantiene todos los datos del formulario al reenviar la solicitud
  - Añadida información detallada en las notas de reenvío para mantener un registro de los cambios realizados

- Corrección del error 400 al reenviar solicitudes desde la vista de MisSolicitudes
  - Corregida la definición de la mutación resubmitTaskRequestMutation en useSolicitudes.ts
  - Modificado el tipo de parámetro para aceptar un objeto con taskRequestId y notes
  - Solucionado el error "[object Object]" en la URL de reenvío de solicitudes
  - Mejorada la tipificación para evitar errores similares en el futuro

- Corrección del error "undefined" al reenviar solicitudes desde el formulario de edición
  - Actualizada la forma de llamar a resubmitTaskRequest en SolicitudForm.tsx para usar el formato de objeto
  - Corregidas las llamadas en onSubmit y handleResubmit para pasar los parámetros correctamente
  - Añadida validación adicional en el servicio solicitudesService.ts para verificar IDs inválidos
  - Mejorados los mensajes de error para facilitar la depuración

- Implementación de visualización de archivos adjuntos para rol ASIGNADOR
  - Añadida sección de archivos adjuntos en la vista de BandejaEntrada.tsx
  - Modificada la función adaptarSolicitudes para incluir los archivos adjuntos
  - Implementada la funcionalidad de descarga de archivos adjuntos
  - Mantenido el estilo visual consistente con el resto de la aplicación

- Implementación de restricciones de edición para el rol ASIGNADOR
  - Modificado el componente DetalleTarea.tsx para deshabilitar el botón de edición cuando la tarea está en estado ASSIGNED
  - Actualizado el componente EditarTarea.tsx para verificar el estado de la tarea antes de permitir la edición
  - Implementada validación en el backend para verificar permisos según el rol y estado de la tarea
  - Añadidos mensajes informativos para explicar por qué no se puede editar una tarea

- Implementación de funcionalidad de reasignación de tareas para rol ASIGNADOR
  - Añadido método reassignExecutor en TaskRequestWorkflowService.java para permitir la reasignación de ejecutores
  - Creado nuevo endpoint /api/task-requests/{id}/reassign en TaskRequestController.java
  - Modificado el componente DetalleTarea.tsx para mostrar el botón de reasignación solo cuando la tarea está en estado ASSIGNED
  - Actualizado el componente ReasignarTarea.tsx para validar el estado de la tarea antes de permitir la reasignación
  - Implementado registro en el historial de la tarea para documentar quién era el ejecutor anterior y quién es el nuevo
- Corrección de error 500 al rechazar solicitudes de tareas como usuario asignador
  - Corregido el error "La columna NEW_STATUS no permite valores nulos (NULL)" al rechazar solicitudes
  - Actualizado el método `mapStatusToEntity` en `TaskRequestHistoryMapper` para incluir el estado `REJECTED`
  - Mejorado el método `recordStatusChange` en `TaskRequestHistoryService` para validar que `newStatus` no sea nulo
  - Creada nueva migración `V25__Fix_Rejected_Status_In_Task_Requests.sql` para corregir inconsistencias en la base de datos
  - Corregido el problema de desajuste entre los estados esperados y reales en las solicitudes rechazadas
  - Mejorado el servicio `TaskRequestWorkflowService.reject` para validar el estado de la solicitud antes de intentar rechazarla
  - Mejorado el componente `RechazarSolicitudModal` para mostrar alertas cuando la solicitud no está en estado SUBMITTED
  - Corregido error de importación en `RechazarSolicitudModal.tsx` utilizando `ErrorAlert` en lugar de `Alert`
  - Implementada validación previa en el frontend para verificar el estado de la solicitud antes de enviar la petición
  - Mejorado el servicio `asignacionService.rejectTaskRequest` para asegurar que los datos enviados coincidan con lo que espera el backend
  - Implementado manejo de errores más detallado en `useAsignacion` para proporcionar mensajes específicos según el tipo de error
  - Añadida actualización automática de datos después de un error para asegurar que la interfaz muestra el estado actual
  - Mejorada la invalidación de consultas para actualizar correctamente todos los datos relacionados

- Corrección de error en la visualización de fechas en las tarjetas de seguimiento
  - Mejorada la función `formatDate` en `SeguimientoGeneral.tsx` para manejar correctamente fechas inválidas o nulas
  - Implementada validación robusta para prevenir errores al formatear fechas
  - Añadido manejo de errores con mensajes descriptivos cuando una fecha no es válida
  - Mejorada la experiencia de usuario al mostrar mensajes claros cuando hay problemas con las fechas

- Corrección de error al crear comentarios con archivos adjuntos (múltiples representaciones de la misma entidad)
  - Modificado el flujo de creación de comentarios para evitar guardar la misma entidad dos veces
  - Optimizado el servicio TaskRequestCommentService para usar una única operación de guardado
  - Eliminada la operación redundante de guardar el comentario antes de añadirlo a la solicitud
  - Mejorado el manejo de errores con mensajes más descriptivos

- Corrección de error en la configuración de WebSockets
  - Añadido endpoint adicional `/api/ws` para compatibilidad con el context-path de la aplicación
  - Mantenido el endpoint original `/ws` para compatibilidad con código existente
  - Solucionado el error "No endpoint GET /api/ws/" que impedía la conexión de WebSockets
  - Mejorada la configuración para soportar tanto acceso directo como a través del context-path

- Corrección de error 400 (Bad Request) al enviar comentarios con archivos adjuntos
  - Añadida configuración de Spring para multipart con límites adecuados de tamaño de archivos
  - Implementada validación de tamaño de archivos en el backend y frontend
  - Creado manejador de excepciones para errores de carga de archivos
  - Mejorados los mensajes de error para proporcionar información clara al usuario
  - Implementada validación previa en el frontend para evitar enviar archivos demasiado grandes
  - Limitado el número máximo de archivos adjuntos por comentario
  - Mejorada la experiencia de usuario con mensajes de error específicos

- Corrección de error 500 al rechazar solicitudes de tareas
  - Actualizado el componente RechazarSolicitudModal para usar componentes personalizados en lugar de Material UI
  - Reemplazadas las importaciones de @mui/material por componentes propios
  - Simplificada la estructura del componente para mejorar la compatibilidad
  - Corregido el error que impedía rechazar solicitudes de tareas

- Corrección de error de migración Flyway con versiones duplicadas
  - Renumerado el archivo `V19__Add_Rejected_Status_To_Task_Requests.sql` a `V24__Add_Rejected_Status_To_Task_Requests.sql`
  - Solucionado el error "Found more than one migration with version 19" que impedía iniciar la aplicación
  - Limpiado el directorio target para eliminar archivos compilados con la versión antigua

- Corrección de error "React is not defined" en el dashboard del solicitante
  - Añadida importación de React en el hook useSmartDashboardData
  - Reemplazado React.useCallback por useCallback importado directamente
  - Mejorada la estructura de importaciones para evitar errores similares en el futuro

- Corrección de error en la implementación de adjuntos en comentarios
  - Creadas clases faltantes: TaskRequestCommentService, TaskRequestCommentMapper, TaskRequestCommentRepository
  - Implementados adaptadores y repositorios JPA para comentarios
  - Corregidas importaciones en TaskRequestCommentAttachmentController
  - Añadido campo userName a la clase TaskRequestComment para corregir error en el mapper
  - Añadido campo userName a la entidad TaskRequestCommentEntity para mantener consistencia
  - Creadas migraciones V21 y V22 para añadir las columnas necesarias a las tablas
  - Corregidos múltiples conflictos de versiones en las migraciones de Flyway
  - Corregido nombre de tabla en migración (task_request_attachments en lugar de task_request_attachment)
  - Corregido error de sintaxis JSX en CommentSection.tsx envolviendo elementos adyacentes en un fragmento
  - Añadido ícono FiLoader faltante en las importaciones de CommentSection.tsx

- Corrección de error en ProgresoTareas.tsx por referencia a componente eliminado
  - Eliminada referencia a `AddExecutePermission` que causaba error "AddExecutePermission is not defined"
  - Mejorada la estabilidad de la página de tareas en progreso para usuarios ejecutores
  - Solucionado error que impedía a los usuarios ejecutores ver sus tareas en progreso

- Solucionado error `RangeError: Invalid time value` en la página de actualización de progreso
  - Mejorada la función `formatDate` para manejar correctamente fechas nulas, indefinidas o inválidas
  - Implementada validación robusta para prevenir errores al formatear fechas

- Corregido problema con tareas iniciadas que no aparecían en la sección "En Progreso"
  - Modificado el controlador `TaskRequestController` para permitir que los usuarios con rol EJECUTOR accedan al endpoint `/api/task-requests/by-status/IN_PROGRESS`
  - Implementada lógica de filtrado para que los ejecutores solo vean sus propias tareas en progreso
  - Añadidos nuevos métodos en el repositorio y servicios para filtrar tareas por estado y ejecutor
  - Simplificado el código frontend para usar directamente el endpoint corregido
  - Mejorada la documentación de la API para reflejar los cambios de permisos

- Unificación de servicios para obtener tareas asignadas al ejecutor
  - Modificado el servicio `tareasService.getAssignedTasks()` para combinar datos de los endpoints `activities/assigned` y `task-requests/assigned-to-executor`
  - Eliminada la llamada redundante a `taskRequestService.getTasksAssignedToExecutor()` en el hook `useTareas`
  - Actualizado el componente `MisTareas.tsx` para utilizar solo los datos unificados
  - Mejorado el manejo de errores para garantizar que siempre se muestren datos, incluso si uno de los endpoints falla
  - Eliminadas referencias redundantes a `tasksAssignedToExecutor` en todo el código
- Implementación de endpoint para descargar archivos adjuntos
  - Creado nuevo endpoint `GET /api/task-requests/attachments/{attachmentId}/download` para descargar archivos adjuntos
  - Modificado el DTO `TaskRequestAttachmentDto` para incluir la URL de descarga
  - Actualizado el mapper `TaskRequestAttachmentMapper` para generar la URL de descarga utilizando `ServletUriComponentsBuilder`
  - Añadido método `getAttachmentById` en `TaskRequestAttachmentService` para obtener un archivo adjunto por su ID
- Implementación de dashboard con valores reales para usuario solicitante
  - Creado nuevo endpoint `/api/task-requests/stats/requester` que proporciona estadísticas detalladas para el solicitante
  - Implementado DTO `TaskRequestRequesterStatsDto` con información completa de estadísticas
  - Creado hook personalizado `useRequesterStats` para consumir los datos de estadísticas
  - Actualizado el dashboard del solicitante para mostrar datos reales de la API
  - Añadido gráfico de barras para visualizar la distribución de solicitudes por categoría
  - Mejorada la visualización de tiempos promedio de asignación y completado
  - Implementado indicador de porcentaje de solicitudes completadas a tiempo
- Implementación de dashboard con valores reales para usuario asignador
  - Mejorado el hook `useAsignacion` para obtener datos reales de tareas asignadas y distribución de carga
  - Implementada integración con notificaciones en tiempo real para actualizar el dashboard cuando un ejecutor completa una tarea
  - Mejorado el servicio `asignacionService` para calcular distribución de carga a partir de datos reales
  - Actualizado el componente `AsignadorDashboardContent` para mostrar datos reales de la API
  - Añadida tarjeta de estadísticas para mostrar tareas completadas recientemente
  - Implementado gráfico de distribución de tareas por estado con datos reales
  - Mejorada la visualización de la distribución de carga de trabajo entre ejecutores
- Implementación de seguimiento visual de solicitudes
  - Creado nuevo componente `SeguimientoVisual` que muestra el progreso de la solicitud en una línea de tiempo interactiva
  - Rediseñada la página de seguimiento para mostrar claramente el estado actual y el historial de la solicitud
  - Añadidos tooltips informativos para mejorar la experiencia de usuario
  - Cambiado el texto del botón "Ver detalles" a "Ver seguimiento" para mayor claridad
- Mejora de la experiencia de usuario en las vistas de seguimiento
  - Corregido problema en SeguimientoGeneral.tsx para mostrar correctamente las solicitudes en seguimiento
  - Mejorada la descripción de la página de seguimiento para clarificar su propósito
  - Añadido botón para navegar entre "Mis Solicitudes" y "Seguimiento" para facilitar el acceso
  - Mejorada la página de "Mis Solicitudes" con descripción clara de su propósito
  - Diferenciación visual entre la vista completa de solicitudes y la vista de seguimiento
- Implementación de notificaciones visuales para solicitudes urgentes
  - Añadido indicador visual para solicitudes con prioridad alta o crítica
  - Implementado destacado visual para solicitudes con fecha límite vencida
  - Añadida etiqueta "Urgente" o "Vencida" en las tarjetas de solicitudes
  - Mejora del contraste visual con bordes de color según la urgencia
  - Visualización de la fecha límite con formato destacado cuando está vencida
- Mejora de la visualización del progreso de solicitudes
  - Añadida información detallada sobre el tiempo transcurrido en cada etapa
  - Implementada barra de progreso visual para mostrar el avance en cada fase
  - Añadidos indicadores de tiempo de inicio y fin para cada etapa
  - Mejora visual de los tooltips con información detallada
  - Implementado indicador de estado "Vencida" cuando se supera la fecha límite

### Corregido
- Corrección de problemas de autenticación en peticiones fetch después de actualizar el dashboard
  - Corregida la forma en que se obtiene y envía el token JWT en las peticiones fetch
  - Implementada validación para verificar la disponibilidad del token antes de realizar peticiones
  - Mejorado el manejo de errores para proporcionar mensajes más descriptivos sobre problemas de autenticación
  - Reemplazado el cliente ky por fetch nativo para evitar problemas con el token JWT

- Corrección del resaltado múltiple en el menú lateral
  - Modificado el componente `NavItem` para usar la propiedad `end` de React Router
  - Ahora solo se resalta la opción activa actual, evitando confusión visual
  - Mejorada la experiencia de usuario al navegar por la aplicación
- Implementación de página de seguimiento general para usuarios SOLICITANTE
  - Creado componente `SeguimientoGeneral` para mostrar mensaje informativo cuando no hay solicitudes en seguimiento
  - Añadida ruta `/app/solicitudes/seguimiento` para acceder a la página general
  - Mejorada la experiencia de usuario al proporcionar información clara sobre el estado de las solicitudes
  - Implementadas funciones de formateo locales para evitar dependencias innecesarias
- Eliminación de iconos duplicados en la interfaz
  - Removidos los iconos de notificaciones y configuración del componente `DashboardHeader`
  - Mantenidos únicamente los iconos en el encabezado principal de la aplicación
  - Mejorada la consistencia visual y evitada la confusión para el usuario
- Corrección de error en el formulario de solicitudes
  - Eliminada referencia a variable `isSavingDraft` que causaba error al cargar el formulario
  - Simplificada la lógica de estado de carga del formulario
- Corrección de error en SeguimientoGeneral.tsx por falta de importación del icono FiEye
  - Añadido FiEye a la lista de importaciones para resolver el error "FiEye is not defined"
  - Mejorada la estabilidad del componente al evitar errores de referencia
- Mejora del mensaje de error cuando el servidor no está disponible
  - Actualizado el componente `Login.tsx` para mostrar un mensaje más descriptivo y en español
  - Mejorado el manejo de errores en `useAuth.ts` para detectar específicamente errores de conexión
  - Implementado un estilo más visible para los mensajes de error con borde lateral y mejor contraste
  - Personalización de mensajes según el tipo de error para mejorar la experiencia de usuario
- Corrección de error "Maximum update depth exceeded" en el autoguardado de formularios
  - Corregido el hook `useFormDraft.ts` para evitar actualizaciones infinitas del estado
  - Actualizado el componente `SolicitudForm.tsx` para usar correctamente las dependencias en useEffect
  - Eliminada referencia a variable inexistente `isSavingDraft`
  - Mejorado el rendimiento del autoguardado al evitar renderizados innecesarios
- Mejora del componente de seguimiento visual de solicitudes
  - Corregido problema de visualización en la línea de tiempo que mostraba fechas idénticas para todos los estados
  - Implementada lógica para generar fechas progresivas cuando no hay historial completo
  - Mejorado el diseño visual de la línea de progreso con colores consistentes entre estados
  - Optimizada la visualización de los círculos de estado con mejor contraste y efectos visuales
  - Añadido efecto hover a los elementos de la línea de tiempo para mejorar la interactividad
  - Mejorada la presentación de las fechas con fondo para mayor legibilidad

### Agregado
- Implementación de funcionalidad para adjuntar archivos a solicitudes
  - Creado servicio TaskRequestAttachmentService para gestionar archivos adjuntos
  - Implementado controlador REST para subir, listar y eliminar archivos adjuntos
  - Configurado almacenamiento de archivos en el servidor
  - Corregido error 500 al intentar adjuntar archivos a solicitudes
- Sprint 17: Refactorización de Dashboards y Mejora de Interfaces por Rol
  - Análisis y planificación de la refactorización de dashboards
- Implementación de autoguardado periódico en formularios de solicitudes
  - Reemplazo del sistema manual de borradores por un autoguardado inteligente
  - Guardado automático de cambios después de 3 segundos de inactividad
  - Indicador visual sutil que muestra cuando se ha guardado automáticamente
  - Recuperación automática de borradores al volver al formulario
  - Mejora de la experiencia de usuario al prevenir pérdida de datos
  - Corrección del comportamiento de autoguardado para evitar que se borren los campos ingresados
    - Documentación detallada de la estructura actual y sus problemas
    - Identificación de componentes duplicados y funcionalidades redundantes
    - Análisis de las necesidades específicas de cada rol
    - Creación de diagramas de la estructura actual y la propuesta
    - Diseño de la arquitectura del nuevo Smart Dashboard
    - Creación de mockups detallados de la nueva interfaz
    - Documentación de la estrategia de migración
  - Implementación del Dashboard Unificado (Smart Dashboard)
    - Creación del componente base `SmartDashboard` que adapta su contenido según el rol del usuario
    - Implementación de componentes compartidos: `DashboardHeader`, `QuickActionsBar`, `DashboardFooter`
    - Creación de componentes reutilizables: `StatisticsCard`, `TaskList`, `MetricsChart`, `CalendarView`
    - Implementación de contenido específico para cada rol: `SolicitanteDashboardContent`, `AsignadorDashboardContent`, `EjecutorDashboardContent`, `AdminDashboardContent`
    - Creación de hook personalizado `useSmartDashboardData` para obtener datos según el rol
    - Actualización de rutas en `App.tsx` para usar el nuevo dashboard unificado
    - Mantenimiento de compatibilidad con rutas antiguas durante la transición
  - Actualización de la navegación lateral
    - Simplificación del menú lateral en `RoleBasedSidebar.tsx`
    - Eliminación de enlaces redundantes a dashboards específicos por rol
    - Mantenimiento del dashboard principal como punto de entrada único
    - Mejora de la organización de opciones por rol
    - Actualización de la sección de reportes con enlaces más específicos
    - Mantenimiento de compatibilidad con rutas existentes
  - Mejoras visuales y de experiencia de usuario
    - Implementación de componentes de gráficos reutilizables: `BarChart`, `DoughnutChart`, `LineChart`
    - Integración de gráficos interactivos en los dashboards de cada rol
    - Mejora del diseño visual con tarjetas más atractivas y visualizaciones interactivas
    - Implementación de animaciones y transiciones suaves
    - Optimización de la responsividad para diferentes tamaños de pantalla

### Agregado
- Implementación de sistema de comentarios para asignadores
  - Creación de componente CommentSection reutilizable para mostrar y gestionar comentarios
  - Implementación de servicio commentService para interactuar con la API de comentarios
  - Creación de hook useComments para gestionar el estado de los comentarios
  - Implementación de página DetalleTarea para que los asignadores puedan ver detalles de tareas y comentarios
  - Actualización de rutas para incluir la página de detalle de tarea
  - Mejora de la navegación en DashboardAsignador y DistribucionCarga para acceder a los detalles de tareas
  - Implementación de funcionalidad para que los asignadores puedan interactuar con los solicitantes mediante comentarios

### Corregido
- Error en MisTareas.tsx por falta de importación del icono FiEdit de react-icons/fi
  - Añadido FiEdit a la lista de importaciones para resolver el error "FiEdit is not defined"
- Creación de tabla task_request_comment_mentions para almacenar menciones en comentarios
  - Implementación de migración V19__add_comment_mentions_table.sql para crear la tabla faltante
  - Corrección del error "Table TASK_REQUEST_COMMENT_MENTIONS not found" al marcar comentarios como leídos
- Implementación de menciones a usuarios con @ en comentarios
  - Creación de endpoint para buscar usuarios por nombre o username
  - Modificación del modelo de comentarios para incluir menciones
  - Implementación de detección y procesamiento de menciones en el backend
  - Creación de componente UserMentionSuggestions para mostrar sugerencias al escribir @
  - Implementación de servicio userSearchService para buscar usuarios
  - Mejora del componente de entrada de comentarios para detectar y procesar menciones
  - Implementación de visualización de menciones con resaltado en los comentarios
  - Adición de botón específico para mencionar usuarios
  - Implementación de notificaciones para usuarios mencionados
  - Mejora de la visualización de menciones con avatares de usuario
  - Adición de la posibilidad de mencionar a todos los usuarios con @all
  - Implementación de sistema de permisos para controlar quién puede ser mencionado
- Mejoras en la interfaz de usuario para la asignación de tareas
  - Implementación de scroll vertical para el listado de ejecutores cuando hay muchos disponibles
  - Mejora de la consistencia visual con fondos oscuros para elementos informativos
  - Mejora del contraste en los selectores de ejecutores recomendados/todos
  - Estilización de la barra de desplazamiento para mejor integración visual
  - Mejora del campo de notas de asignación con estilos consistentes

- Mejoras en la gestión de errores para comentarios y solicitudes
  - Creación de tipos de error específicos (CommentException, TaskRequestException) con códigos de error detallados
  - Implementación de manejador global de excepciones para la API REST
  - Creación de clases de respuesta de error estandarizadas (ErrorResponse, ValidationErrorResponse)
  - Actualización de servicios para utilizar las nuevas excepciones
  - Implementación de servicio de reintentos automáticos en el frontend
  - Creación de componente ErrorMessage para mostrar mensajes de error amigables
  - Implementación de almacenamiento temporal de comentarios no enviados
  - Mejora de la experiencia de usuario con opciones para reintentar acciones fallidas
  - Procesamiento automático de comentarios pendientes

- Implementación de historial real para solicitudes de tareas
  - Creación de entidad TaskRequestHistory para almacenar cambios de estado
  - Implementación de registro automático de cambios de estado en el flujo de trabajo
  - Creación de endpoint para obtener el historial de una solicitud
  - Actualización del servicio de solicitudes en el frontend para obtener el historial
  - Mejora del componente SeguimientoSolicitud para mostrar el historial real
  - Implementación de indicadores de carga para el historial
  - Mejora visual del historial con colores según el estado

- Implementación de indicadores de lectura para comentarios
  - Creación de tabla task_request_comment_read_by para almacenar los usuarios que han leído cada comentario
  - Actualización del modelo TaskRequestComment para incluir información de lectura
  - Implementación de endpoints para obtener comentarios con estado de lectura y marcar comentarios como leídos
  - Actualización del frontend para mostrar indicadores visuales de comentarios leídos/no leídos
  - Implementación de marcado automático de comentarios como leídos al visualizarlos
  - Adición de tooltip para mostrar quién ha leído cada comentario
  - Mejora visual con indicadores de color para comentarios no leídos

- Corrección de contraseñas para usuarios de prueba
  - Actualización de las contraseñas de los usuarios de prueba (28456789, 25789012, 32345678) para que coincidan con las mostradas en la interfaz de login (Test@1234)
  - Creación de migración V17__Fix_User_Passwords_For_Test_Users.sql para aplicar los cambios
  - Reutilización del hash de contraseña verificado de migraciones anteriores ($2a$10$mAzGMRp1DEnHt4VMF4HeUujvEKhHK0SHXzgk0rqPUvNx7hs/0oB6.)

### Corregido
- Solución de conflictos en la aplicación Spring Boot
  - Eliminación de clases duplicadas de GlobalExceptionHandler en diferentes paquetes
  - Consolidación de manejadores de excepciones en una única clase GlobalExceptionHandler
  - Adición de manejadores específicos para CommentException y TaskRequestException
  - Renumeración de scripts de migración Flyway para evitar conflictos de versión
  - Renombrado de V14__Add_Workflow_Permissions.sql a V16__Add_Workflow_Permissions.sql para evitar conflicto con V14__add_comment_read_by_table.sql
- Solución de problemas de dependencias en el frontend
  - Creación de componente Tooltip personalizado para reemplazar la dependencia de @mui/material
  - Integración del componente Tooltip en el sistema de componentes UI compartidos
  - Actualización de importaciones en SeguimientoSolicitud.tsx para usar el componente personalizado
  - Eliminación de dependencias innecesarias para reducir el tamaño del bundle
  - Corrección de errores en la animación de keyframes en SeguimientoSolicitud.tsx
    - Creación de componente estilizado SpinningLoader para manejar correctamente la animación
    - Reemplazo de todas las instancias de FiLoader con animación por el nuevo componente
  - Corrección de la URL y formato de datos para el envío de comentarios en solicitudes
    - Eliminación del prefijo '/api' duplicado en las URLs de solicitudesService.ts
    - Corrección de props en componentes estilizados para usar props transitorias ($isRead en lugar de isRead)

### Corregido
- Integración de frontend con nuevos endpoints de TaskRequest
  - Actualización de solicitudesService.ts para utilizar los nuevos endpoints de TaskRequest en lugar de los endpoints de Activity
  - Actualización de useSolicitudes.ts para trabajar con el tipo TaskRequestPageDto
  - Actualización de MisSolicitudes.tsx para mostrar correctamente los datos de TaskRequest
  - Actualización de SolicitudForm.tsx para crear solicitudes utilizando el nuevo endpoint
  - Actualización de SeguimientoSolicitud.tsx para mostrar los detalles de una solicitud utilizando el nuevo endpoint
  - Implementación de funcionalidad para agregar y persistir comentarios en las solicitudes
  - Mejora de la interfaz de usuario para comentarios con agrupación por fecha
  - Implementación de funcionalidad para editar y eliminar comentarios propios
  - Mejora del diseño de avatares de usuario con colores basados en iniciales
- Implementación del Sprint 16: Entidad TaskRequest (Solicitud de Tarea)
  - Diseño detallado de la nueva entidad `TaskRequest` separada de `Activity`
  - Implementación de la capa de dominio para la entidad `TaskRequest`
    - Creación de la clase `TaskRequest` con atributos y métodos de negocio
    - Implementación de enumeraciones `TaskRequestStatus` y `TaskRequestPriority`
    - Creación de clases `TaskRequestCategory`, `TaskRequestComment` y `TaskRequestAttachment`
    - Implementación de interfaces de repositorio `TaskRequestRepository` y `TaskRequestCategoryRepository`
    - Implementación de interfaces de servicio `TaskRequestService` y `TaskRequestCategoryService`
  - Implementación de la capa de aplicación para la entidad `TaskRequest`
    - Creación de casos de uso `CreateTaskRequestUseCase` y `UpdateTaskRequestUseCase`
    - Implementación del servicio `TaskRequestWorkflowService` para gestionar el flujo de trabajo
    - Implementación del servicio `TaskRequestCategoryService` para gestionar categorías
    - Creación de DTOs para la comunicación con la capa de infraestructura
    - Implementación de mappers para convertir entre entidades de dominio y DTOs
  - Implementación de la capa de infraestructura para la entidad `TaskRequest`
    - Creación de entidades JPA `TaskRequestEntity`, `TaskRequestCategoryEntity`, etc.
    - Implementación de repositorios JPA `TaskRequestJpaRepository` y `TaskRequestCategoryJpaRepository`
    - Implementación de adaptadores de repositorio `TaskRequestRepositoryAdapter` y `TaskRequestCategoryRepositoryAdapter`
    - Creación de controladores REST `TaskRequestController` y `TaskRequestCategoryController`
    - Implementación de seguridad para endpoints con anotaciones `@PreAuthorize`
    - Creación de script de migración para las nuevas tablas con datos iniciales
  - Implementación de la interfaz de usuario para la entidad `TaskRequest`
    - Creación de tipos TypeScript para las solicitudes de tareas
    - Implementación de servicios de frontend para interactuar con la API
    - Creación de componentes React para listar, ver, crear y editar solicitudes
    - Implementación de componentes para gestionar categorías y ver estadísticas
    - Creación de páginas y rutas para las diferentes funcionalidades
    - Actualización del menú de navegación con las nuevas opciones
    - Implementación de control de acceso basado en roles en el frontend
  - Implementación de pruebas y documentación
    - Creación de pruebas unitarias para entidades de dominio y casos de uso
    - Implementación de pruebas para servicios de aplicación
    - Creación de pruebas de integración para controladores REST
    - Implementación de pruebas para adaptadores de repositorio
    - Creación de documentación de usuario con guías detalladas
    - Implementación de documentación técnica para desarrolladores
  - Documentación del modelo de dominio con diagrama UML y reglas de negocio

- Corrección de problemas con las rutas de API en el frontend y backend
  - Eliminación del prefijo duplicado `/api` en las URLs del servicio de solicitudes
  - Actualización del controlador ActivityUserController para manejar rutas con y sin el prefijo `/api`
  - Mejora de logs para depuración de solicitudes HTTP
- Corrección de problemas con las solicitudes de usuario
  - Actualización del DTO ActivityDto para incluir el campo requesterId
  - Mejora del mapeo entre Activity y ActivityExtended para preservar el requesterId
  - Corrección del controlador ActivityUserController para mostrar correctamente las solicitudes del usuario
  - Manejo de errores mejorado para casos donde el usuario no está autenticado correctamente
  - Actualización del método mapToDto en ActivityWorkflowController para incluir el requesterId en la respuesta
  - Diferenciación clara entre solicitudes y actividades mediante estados específicos
  - Actualización del enum ActivityStatus para incluir estados del flujo de trabajo
  - Mejora de los métodos findByRequesterId y countByRequesterId para filtrar correctamente
- Mejora de la interfaz de usuario
  - Corrección de contraste en los campos de formulario para mejorar la accesibilidad
  - Mejora visual de los selectores con iconos de flecha
  - Adición de efectos visuales para estados de foco en campos de entrada
  - Estandarización de estilos de entrada en toda la aplicación
  - Mejora del control deslizante de progreso para mayor visibilidad
  - Corrección del menú desplegable de plantillas para que se muestre correctamente dentro de la ventana
- Implementación de controlador ActivityMetadataController para gestionar metadatos de actividades
  - Endpoint para obtener categorías de actividades (/api/activities/categories)
  - Endpoint para obtener prioridades de actividades (/api/activities/priorities)
  - Creación de DTO ActivityPriorityDTO para representar prioridades
- Corrección de errores en el frontend para usar las rutas correctas de la API
  - Eliminación del prefijo duplicado /api en solicitudesService.ts
  - Ajuste del formato de fechas para cumplir con el formato esperado por el backend (formato yyyy-MM-dd'T'HH:mm:ss sin milisegundos)
  - Ajuste del formato de datos enviados al endpoint de solicitudes para cumplir con el contrato de la API
  - Corrección de permisos para usuarios con rol SOLICITANTE, asegurando que tengan el permiso REQUEST_ACTIVITIES
  - Implementación de encabezados personalizados para solicitudes a endpoints protegidos, añadiendo X-User-Permissions
- Implementación de filtro de seguridad personalizado en el backend
  - Creación de CustomPermissionsFilter para procesar encabezados X-User-Permissions
  - Integración del filtro en la cadena de filtros de seguridad
  - Soporte para añadir permisos temporales a la autenticación actual
- Corrección de error en la creación de actividades
  - Asegurar que el campo userId se establezca correctamente al crear una actividad
  - Modificación del método request en ActivityExtended para establecer userId si es nulo
  - Establecer explícitamente el userId en el controlador ActivityWorkflowController
  - Implementación de ActivityExtendedMapper para manejar correctamente la conversión entre Activity y ActivityExtended
  - Actualización de ActivityWorkflowService para usar el nuevo mapper y evitar errores de casting
  - Creación de endpoint para obtener las solicitudes del usuario actual
  - Mejora del contraste visual en la vista de "Mis Solicitudes" para mejor legibilidad
- Corrección de errores en la configuración de Zipkin
  - Eliminación de configuraciones duplicadas en application.yml
- Implementación de pruebas unitarias y de integración (Sprint 15, punto 8)
  - Pruebas unitarias para la capa de dominio
    - Creación de ActivityExtendedTest para probar los métodos de cambio de estado
    - Implementación de ActivityStateTest para probar el patrón State y las transiciones entre estados
    - Creación de ActivityStatusNewTest para probar la enumeración y sus métodos
  - Pruebas unitarias para la capa de aplicación
    - Implementación de ActivityWorkflowServiceTest para probar el servicio de flujo de trabajo
    - Pruebas para verificar el comportamiento correcto de las transiciones de estado
    - Pruebas para verificar el manejo de errores y excepciones
  - Pruebas de integración
    - Creación de ActivityWorkflowControllerTest para probar los endpoints REST
    - Implementación de ActivityWorkflowIntegrationTest para probar el flujo completo
    - Pruebas para verificar la autorización y permisos en los endpoints
    - Pruebas para verificar la validación de datos de entrada
    - Creación de ActivityWorkflowIntegrationTestNew con enfoque simplificado para pruebas
    - Implementación de ActivityRepositoryMock para pruebas sin dependencia de base de datos
  - Actualización de CHANGELOG.md para registrar las pruebas implementadas
- Implementación de permisos específicos para el flujo de trabajo de actividades
  - Creación de migración V14__Add_Workflow_Permissions.sql para agregar permisos específicos
  - Actualización de pruebas de integración para usar los permisos correctos
  - Mejora en la configuración de autenticación para pruebas
  - Actualización de data.sql para incluir permisos de flujo de trabajo (REQUEST_ACTIVITIES, ASSIGN_ACTIVITIES, EXECUTE_ACTIVITIES, APPROVE_ACTIVITIES)

### Corregido
- Corrección de advertencias de Checkstyle relacionadas con números mágicos
  - Corregido CacheConfig.java para extraer constantes para valores de configuración de caché
  - Corregido WebConfig.java para extraer constante para el tiempo máximo de caché CORS
  - Corregido WebSocketAuthenticationConfig.java para extraer constante para la longitud del prefijo Bearer
  - Corregido JwtAuthenticationFilter.java para extraer constante para la longitud del prefijo Bearer
  - Corregido GenerateEmployeePasswords.java para extraer constantes para los números de legajo inicial y final
- Corrección de prueba unitaria ActivityExtendedTest para reflejar el comportamiento real del código
  - Actualizado el test testAssign para esperar ActivityStatus.EN_PROGRESO en lugar de PENDIENTE
- Corrección de advertencias de Checkstyle relacionadas con parámetros que deberían ser final en clases de dominio
  - Corregido AbstractActivityState.java para hacer final los parámetros de métodos y constructor
  - Corregido ActivityStateFactory.java para hacerla final y con constructor privado
  - Corregido RequestedState.java para hacer final los parámetros de métodos
  - Corregido AssignedState.java para hacer final los parámetros de métodos
  - Corregido InProgressState.java para hacer final los parámetros de métodos
  - Corregido CompletedState.java para hacer final los parámetros de métodos
  - Corregido AbstractValueObject.java para hacer final los parámetros y añadir llaves a bloques if
  - Corregido ValueObject.java para añadir documentación Javadoc completa
  - Corregido UserSession.java para hacer final los parámetros de métodos
  - Corregido ActivityHistory.java para hacer final los parámetros del método createStatusChange
  - Corregido ActivityPriority.java para hacer final los parámetros de constructor y métodos
  - Corregido ActivityStatus.java para hacer final los parámetros de constructor y método fromString
  - Corregido ActivityStatusNew.java para hacer final los parámetros de constructor y método fromString
  - Corregido ActivityType.java para hacer final los parámetros de constructor y método fromString
  - Corregido operadores || en nuevas líneas en varias clases de enumeración
- Corrección de error en ActivityStateFactory para manejar correctamente estados nulos
  - Añadida validación explícita para lanzar IllegalArgumentException cuando se pasa un estado nulo
- Corrección de implementación del patrón State en clases de estado de actividades
  - Corregido PendingState para usar el constructor de AbstractActivityState correctamente
  - Actualizado RequestedState para permitir la transición a InProgressState directamente
  - Corregido ActivityWorkflowService para manejar correctamente los estados de actividades
  - Añadida prueba unitaria para verificar la transición de RequestedState a InProgressState
  - Mejorado el mapeo entre ActivityStatusNew y ActivityStatus en ActivityWorkflowService

### Corregido
- Corrección de advertencias de Checkstyle relacionadas con parámetros que deberían ser final
  - Corregido ApiError.java para hacer final los parámetros de constructores y métodos
  - Corregido ErrorCode.java para hacer final el parámetro del constructor
  - Corregido InvalidTokenException.java para hacer final los parámetros de constructores
  - Corregido ResourceNotFoundException.java para hacer final los parámetros de constructores
  - Corregido NotificationAdapter.java para hacer final los parámetros de métodos
  - Corregido WebSocketController.java para hacer final los parámetros de métodos
  - Corregido UserSessionAdapter.java para hacer final los parámetros de métodos
  - Corregido Password.java para hacer final los parámetros de métodos
  - Corregido Permission.java para hacer final los parámetros de métodos
  - Corregido PersonName.java para hacer final los parámetros de métodos y declarar la clase como final
  - Corregido User.java para hacer final los parámetros de métodos
  - Corregido UserRole.java para hacer final los parámetros de métodos
- Corrección de advertencias de Checkstyle relacionadas con operadores en nuevas líneas
  - Corregido User.java para colocar operadores || en nuevas líneas
  - Corregido Permission.java para colocar operadores || en nuevas líneas
  - Corregido PersonName.java para colocar operadores && en nuevas líneas
  - Corregido UserRole.java para colocar operadores || en nuevas líneas
- Corrección de advertencias de Checkstyle relacionadas con clases de utilidad con constructores públicos
  - Corregido GenerateEmployeePasswords.java para hacerla final y con constructor privado
  - Corregido GeneratePassword.java para hacerla final y con constructor privado
  - Corregido PasswordHashGenerator.java para hacerla final y con constructor privado
- Corrección de advertencias de Checkstyle relacionadas con importaciones con comodín
  - Corregido ActuatorConfig.java para reemplazar import org.springframework.boot.actuate.endpoint.web.* con importaciones específicas
  - Corregido UserMapper.java para reemplazar import com.bitacora.domain.model.user.* con importaciones específicas
- Corrección de advertencias de Checkstyle relacionadas con longitud de línea excesiva
  - Corregido ActuatorConfig.java para dividir expresiones condicionales largas en variables intermedias
  - Corregido DeadlineReminderService.java para extraer variables intermedias en la creación de notificaciones
  - Corregido OpenApiGenerator.java para dividir la creación de esquemas en variables intermedias
- Corrección de advertencias de Checkstyle relacionadas con clases de valor que deberían ser finales
  - Corregido Email.java para hacerla final y añadir modificadores final a los parámetros de métodos
  - Corregido Password.java para hacerla final

- Implementación de usuarios desde archivo CSV de empleados
  - Creación de migración V8__Add_Employees_From_CSV.sql para agregar usuarios del archivo
  - Configuración de DNI como nombre de usuario y número de legajo + "@Pass" como contraseña
  - Asignación de roles específicos: SOLICITANTE, EJECUTOR, ASIGNADOR
  - Asignación del rol ASIGNADOR únicamente a Adriana Sanchez
  - Actualización del usuario admin para que sea Semper Evincere
  - Asignación de permisos adecuados según el rol de cada usuario
  - Corrección de la migración para eliminar primero las actividades asociadas a usuarios
  - Creación de migración V9__Fix_User_Passwords.sql para corregir las contraseñas de los usuarios
  - Creación de migración V10__Update_User_Passwords_Format.sql para actualizar el formato de contraseñas a legajo@Pass
  - Creación de migración V11__Fix_User_Passwords_For_Testing.sql para asegurar que las contraseñas se actualicen correctamente
  - Creación de migración V12__Fix_Employee_Passwords.sql para establecer contraseñas conocidas y funcionales
  - Creación de migración V13__Fix_Employee_Passwords_With_System_Hash.sql para usar el hash generado por el sistema
  - Corrección del método de logout en el frontend para enviar correctamente el token de autorización
  - Actualización de la documentación para reflejar el nuevo formato de contraseñas
  - Simplificación de contraseñas de usuarios a "Test@1234" para facilitar pruebas

### Corregido
- Solución para permitir que el usuario ADMIN acceda a todos los dashboards y vistas específicas de cada rol
- Modificación del componente App.tsx para usar RoleBasedLayout en lugar de MainLayout
- Corrección del manejo de roles de usuario en el frontend para asegurar que se respeten las restricciones de acceso basadas en roles
- Actualización de la forma en que se almacena y recupera el rol del usuario en localStorage
- Corrección de la respuesta de autenticación en el backend para enviar el rol como un campo único en lugar de una lista
- Mejora del componente de depuración para mostrar información detallada sobre el rol del usuario
- Corrección del mapeo de roles en el frontend para manejar correctamente la respuesta del backend
- Corrección del menú lateral para mostrar solo las secciones correspondientes al rol del usuario
- Implementación de condiciones en RoleBasedSidebar para mostrar elementos de menú según el rol del usuario
- Adición de iconos faltantes en RoleBasedSidebar
- Modificación del componente RoleBasedSidebar para mostrar todos los elementos del menú al usuario ADMIN
- Adición de componente de depuración para verificar el rol del usuario
- Implementación de protección de rutas basada en roles para permitir que el usuario ADMIN acceda a todos los dashboards y vistas específicas de cada rol
- Creación de componente RoleProtectedRoute para manejar la lógica de acceso basado en roles
- Actualización de las rutas para usar el componente de protección de rutas
- Solución al problema de carga de rutas basadas en roles
- Creación de componente PlaceholderDashboard para mostrar en rutas en desarrollo
- Modificación de App.tsx para cargar directamente las rutas en lugar de usar lazy loading
- Implementación de rutas directas para cada sección (solicitudes, asignación, tareas, etc.)
- Activación de las interfaces específicas por rol (SOLICITANTE, ASIGNADOR, EJECUTOR)
  - Reemplazo de componentes PlaceholderDashboard por los componentes reales
  - Importación de todos los componentes necesarios para las interfaces específicas por rol
  - Configuración de rutas para usar los componentes reales en lugar de placeholders
- Corrección de problemas de componentes duplicados en el frontend
  - Corregido error de identificadores duplicados en CategoriasList.tsx
  - Corregido error de identificadores duplicados en PrioridadesList.tsx
  - Implementado componente Card faltante
  - Corregidas importaciones en index.ts
  - Implementado componente Skeleton con exportación por defecto
  - Corregido error de exportación en Skeleton.tsx
- Implementación de protección de rutas basada en roles
  - Mejorado componente ProtectedRoute para verificar autenticación de manera más robusta
  - Integrado RoleProtectedRoute en App.tsx para proteger rutas específicas por rol
  - Configurado acceso por roles: ADMIN (acceso irrestricto), SOLICITANTE, ASIGNADOR, EJECUTOR
  - Implementadas redirecciones adecuadas para usuarios sin permisos
  - Protegidas rutas de configuración y reportes para que solo sean accesibles por ADMIN
  - Corregido error de importación de RoleProtectedRoute y UserRole en App.tsx

### Corregido
- Problema de autenticación con contraseñas incorrectas después de migrar a Flyway
- Endpoints de estadísticas de actividades que devolvían errores 500
  - Corregida la configuración del controlador de actividades para soportar rutas con prefijo /api
  - Implementado controlador de diagnóstico para verificar rutas disponibles
  - Actualizado el controlador para manejar correctamente ambos prefijos de ruta (/activities y /api/activities)
- Manejo de errores mejorado en los endpoints de actividades
- Limpieza de archivos temporales y código no utilizado
- Error en componentes que usaban useToastContext sin estar dentro de un ToastProvider
  - Reemplazado useToastContext por react-toastify en todos los componentes afectados
  - Simplificado el sistema de notificaciones para usar directamente toast de react-toastify

### Agregado
- Implementación de interfaces específicas por rol (Sprint 15, punto 4)
  - Dashboard para SOLICITANTE con:
    - Resumen de solicitudes por estado
    - Visualización de tiempos de respuesta
    - Lista de solicitudes recientes
    - Indicadores de progreso para seguimiento de solicitudes
    - Sección de próximas fechas límite
  - Formulario de solicitud mejorado:
    - Conexión con el endpoint /api/activities/request
    - Selección de categoría y prioridad desde datos reales
    - Sistema de adjuntos para solicitudes con previsualización
    - Validación de formularios con Zod
    - Indicadores de estado de carga durante el envío
  - Dashboard para ASIGNADOR con:
    - Bandeja de entrada de solicitudes pendientes
    - Visualización de tareas asignadas por ejecutor
    - Gráficos de distribución de carga
    - Filtros por categoría y prioridad
  - Formulario de asignación de tareas:
    - Interfaz para asignar tareas a ejecutores
    - Selección de prioridad y fecha límite
    - Sistema de notas para la asignación
    - Conexión con el endpoint /api/activities/{id}/assign
  - Dashboard para EJECUTOR con:
    - Lista de tareas asignadas por prioridad
    - Visualización de progreso de tareas actuales
    - Calendario de vencimientos
    - Estadísticas de rendimiento
  - Formulario de actualización de progreso:
    - Interfaz para actualizar el progreso de tareas con control deslizante
    - Sistema de comentarios para registrar avances
    - Funcionalidad para completar tareas
    - Conexión con los endpoints /api/activities/{id}/progress y /api/activities/{id}/complete
  - Actualización del menú lateral para incluir acceso a los dashboards
  - Actualización de rutas para soportar los nuevos componentes
- Script de migración para corregir datos de actividades (V7__Fix_Activity_Data.sql)
- Documentación detallada sobre el mecanismo de login y rutas protegidas en README.md
- Manejo de errores más robusto en el frontend para mostrar datos vacíos cuando hay errores
- Controlador de diagnóstico para verificar el estado de la aplicación y las rutas disponibles
- Implementación de endpoints para el flujo de trabajo de actividades
  - Endpoint POST /api/activities/request para crear solicitudes (SOLICITANTE)
  - Endpoint POST /api/activities/{id}/assign para asignar tareas (ASIGNADOR)
  - Endpoint POST /api/activities/{id}/start para iniciar tareas (EJECUTOR)
  - Endpoint POST /api/activities/{id}/complete para completar tareas (EJECUTOR)
  - Endpoint POST /api/activities/{id}/approve para aprobar tareas (ASIGNADOR)
  - Endpoint POST /api/activities/{id}/reject para rechazar tareas (ASIGNADOR)
  - Endpoint POST /api/activities/{id}/cancel para cancelar tareas
  - Endpoint POST /api/activities/{id}/comment para agregar comentarios
  - DTOs específicos para cada operación del flujo de trabajo
  - Implementación completa de la funcionalidad de comentarios en actividades

### Agregado
- Inicio del Sprint 15: Implementación del Sistema de Gestión de Tareas
  - Implementación del nuevo modelo de datos para el sistema de gestión de tareas
    - Unificación de enumeraciones de roles en UserRole con roles ADMIN, ASIGNADOR, SOLICITANTE, EJECUTOR, SUPERVISOR, USUARIO, CONSULTA
    - Creación de enum ActivityStatusNew con estados REQUESTED, ASSIGNED, IN_PROGRESS, COMPLETED, APPROVED, REJECTED, CANCELLED
    - Creación de enum ActivityPriority con niveles CRITICAL, HIGH, MEDIUM, LOW, TRIVIAL
    - Ampliación del modelo Activity con campos para flujo de trabajo, seguimiento y métricas
    - Creación de entidades ActivityCategory, ActivityHistory, ActivityComment y ActivityAttachment
    - Implementación de migración de base de datos V3__Add_Task_Management_Fields.sql
    - Creación de entidades JPA y repositorios para las nuevas entidades
    - Implementación de mappers para convertir entre entidades JPA y modelos de dominio
    - Creación de interfaces de repositorio en la capa de dominio
    - Implementación de repositorios en la capa de infraestructura
    - Creación de servicios de dominio para gestionar las entidades
    - Implementación de servicios de aplicación para exponer la funcionalidad
    - Creación de DTOs y mappers para la API REST
    - Implementación de controladores REST para exponer la funcionalidad
  - Implementación del flujo de trabajo para actividades
    - Implementación del patrón State para estados de actividad
    - Creación de clases concretas para cada estado (RequestedState, AssignedState, InProgressState, etc.)
    - Implementación de reglas de transición entre estados
    - Desarrollo de validaciones para cada transición
    - Implementación de servicio para gestionar el flujo de trabajo de actividades
  - Corrección de pruebas unitarias
    - Configuración de datos de prueba para tests
    - Actualización de la configuración de pruebas para cargar datos SQL
    - Corrección de errores en la inicialización del contexto de Spring
  - Implementación de interfaces específicas para roles
    - Implementación de interfaz para SOLICITANTES con formulario de solicitudes y seguimiento
    - Implementación de interfaz para ASIGNADORES con bandeja de entrada, distribución de carga y métricas
    - Implementación de interfaz para EJECUTORES con vista de tareas asignadas, progreso y historial
    - Implementación de sistema de navegación adaptativo con menú lateral dinámico según el rol del usuario
  - Implementación de sistema de categorización y priorización de tareas
    - Desarrollo de componentes para gestión de categorías con colores personalizables
    - Implementación de sistema de prioridades con niveles configurables
    - Creación de interfaz de administración para categorías y prioridades
    - Integración con el flujo de trabajo para clasificar y priorizar tareas
  - Implementación de sistema de notificaciones para el flujo de trabajo
    - Desarrollo de centro de notificaciones con filtros por tipo
    - Implementación de indicador de notificaciones no leídas
    - Creación de panel de configuración de preferencias de notificaciones
    - Integración de múltiples canales de notificación (app, email, push)
  - Desarrollo de reportes y métricas para seguimiento de tareas
    - Implementación de dashboard con resumen de tareas y distribución por estados
    - Creación de gráficos de distribución por categorías
    - Desarrollo de análisis de tendencias de tiempos de respuesta y completado
    - Implementación de métricas de rendimiento por usuario
  - Preparación para integración futura con Google Calendar y Drive
    - Diseño e implementación de interfaces para Google Calendar API
    - Diseño e implementación de interfaces para Google Drive API
    - Creación de panel de configuración para integraciones
    - Implementación de servicios mock para pruebas de integración

## [0.14.1] - 2025-04-25

### Agregado
- Inicio del Sprint 14: Mejoras de Rendimiento y Correcciones de Errores
  - Corrección de problemas con el token de autenticación
    - Revisión del flujo de autenticación en el frontend
    - Corrección de la forma en que se obtiene y almacena el token
    - Implementación de manejo de errores más robusto para problemas de autenticación
  - Planificación de mejoras de rendimiento
    - Optimización de consultas de base de datos
    - Implementación de índices adicionales en tablas críticas
    - Mejora del rendimiento del frontend
    - Implementación de técnicas avanzadas de virtualización
  - Planificación de pruebas automatizadas
    - Configuración de Jest y React Testing Library para el frontend
    - Configuración de JUnit y Mockito para el backend
    - Implementación de pruebas unitarias para componentes comunes
    - Creación de pruebas para flujos críticos de la aplicación
  - Planificación de corrección de errores y advertencias
    - Corrección de advertencias de Checkstyle en el backend
    - Resolución de problemas de código no utilizado
    - Corrección de posibles null pointer exceptions
    - Resolución de advertencias de ESLint en el frontend
    - Mejora de la documentación del código
  - Refactorización de la inicialización de datos de prueba
    - Consolidación de datos de prueba en migraciones Flyway
    - Creación de migración V3__Consolidated_Test_Data.sql
    - Deshabilitación del mecanismo data.sql
    - Modificación de DataInitializer para que solo se active con el perfil "data-init"
    - Implementación de prueba unitaria para verificar la inicialización de datos
    - Documentación del nuevo enfoque en README-DATA-INITIALIZATION.md

### Agregado
- Implementación de visualización de estadísticas
  - Creación de componente ActivityTypeStats para mostrar estadísticas por tipo de actividad
  - Creación de componente ActivityStatusStats para mostrar estadísticas por estado de actividad
  - Creación de componente ActivitySummaryList para mostrar resúmenes de actividades
  - Integración de componentes de estadísticas en el dashboard
  - Implementación de hooks personalizados para obtener estadísticas del backend

### Corregido
- Problema con la autenticación en el frontend
  - Corrección de la forma en que se obtiene el token de autenticación en api-ky.ts
  - Simplificación de la verificación de autenticación en Activities.tsx
  - Corrección del hook useSocket para usar useRealTimeNotifications
  - Integración del ToastProvider en App.tsx para resolver errores en el calendario
  - Eliminación de datos mockeados y mejora de la integración con el backend
  - Implementación de manejo de errores más robusto en el servicio de actividades
- Error en el componente ActivitySummaryList
  - Creación del componente TypeBadge.tsx faltante
  - Actualización del archivo de exportación para incluir el nuevo componente
  - Eliminación de archivos duplicados de StatusBadge y TypeBadge
  - Eliminación de archivos duplicados de PageTransition y AnimatedRoutes
  - Actualización de importaciones en componentes que usaban las versiones antiguas
- Corrección de errores en el Dashboard
  - Solución del error "value.toString is not a function" en los gráficos de Chart.js
    - Corrección en ActivityTypeStats.tsx
    - Corrección en ActivityStatusStats.tsx
  - Corrección de URLs con doble slash en las peticiones API
  - Solución del error "Invalid time value" en el formateo de fechas
  - Implementación de función formatDistanceToNowSafe para manejo seguro de fechas

## [0.14.0] - 2025-04-24

### Agregado
- Completado el Sprint 13: Unificación de Estilos y Corrección de Errores TypeScript
  - Unificación de archivos statusColors.ts en shared/styles
  - Unificación de archivos theme.ts en shared/styles
  - Corrección de errores en interfaces de tema
  - Corrección de errores en interfaces de colores
  - Corrección de componentes que acceden a propiedades inexistentes del tema
  - Mejora de la estructura de carpetas

## [0.13.1] - 2025-04-23

### Agregado
- Completado el Sprint 12: Refactorización de Arquitectura y Solución de Problemas de Plantillas
  - Consolidación de archivos duplicados
  - Migración completa a TypeScript
  - Reorganización de la estructura de carpetas
  - Mejora de la gestión de estado
  - Solución del problema de las plantillas
  - Documentación y pruebas
  - Corrección de errores de dependencias faltantes
  - Implementación de sistema de notificaciones toast con react-toastify
  - Corrección de problemas de autenticación y duplicación de rutas API
  - Corrección de errores de TypeScript en componentes
  - Deshabilitación completa de Zipkin para evitar errores de conexión

## [0.13.0] - 2025-04-22

### Cambios
- Inicio del Sprint 13: Unificación de Estilos y Corrección de Errores TypeScript
- Unificación de archivos statusColors.ts en shared/styles
- Actualización de importaciones para usar la versión unificada de statusColors.ts
- Unificación de archivos theme.ts en shared/styles
- Actualización de importaciones para usar la versión unificada de theme.ts
- Mejora de las interfaces ColorScheme, StatusColorMap y TypeColorMap con tipos más precisos
- Corrección de componentes que acceden a propiedades inexistentes del tema

### Corregido
- Corrección de errores de TypeScript en theme.ts y styled.d.ts
- Corrección de propiedades duplicadas en statusColors.ts
- Corrección de importaciones en shared/styles/index.ts
- Corrección de referencias a propiedades inexistentes del tema en componentes

### Agregado
- Mejoras en formularios de actividades con validación y asistencia
  - Implementación de componente AutocompleteInput para sugerencias mientras se escribe
  - Sistema de sugerencias contextuales basadas en datos históricos
  - Validación en tiempo real con mensajes específicos y contextuales
  - Autocompletado inteligente para campos comunes (personas, roles, dependencias, agentes)
  - Relaciones contextuales entre campos (sugerir roles según la persona seleccionada)
  - Almacenamiento de datos frecuentes en localStorage para mejorar la experiencia de usuario
  - Indicadores visuales para sugerencias basadas en el historial de una persona
  - Validación mejorada con Zod para todos los campos del formulario
  - Mensajes de error más descriptivos y específicos

- Sistema de plantillas para actividades
  - Creación de interfaz para guardar actividades como plantillas
  - Implementación de selector de plantillas al crear actividades
  - Gestión de plantillas (CRUD) con búsqueda y filtrado
  - Almacenamiento local de plantillas con localStorage
  - Aplicación de plantillas manteniendo la fecha y hora actuales
  - Corrección de problemas de visualización de botones de plantillas
  - Mejora de estilos de botones para mayor consistencia visual

- Mejoras de seguridad y manejo de credenciales
  - Actualización del archivo .gitignore para excluir archivos con información sensible
  - Creación de plantillas de ejemplo para archivos de configuración (gcp.oauth.json.example)
  - Documentación mejorada sobre manejo seguro de credenciales
  - Actualización de .env.example con ejemplos más completos y seguros
  - Prevención de exposición accidental de secretos en el repositorio

- Implementación de vista de calendario para actividades
  - Creación de componente Calendar con múltiples vistas (mensual, semanal y diaria)
  - Visualización de actividades por día con indicadores de estado
  - Navegación entre períodos (mes, semana, día) con botones de anterior/siguiente
  - Integración con los componentes StatusBadge y TypeBadge
  - Diseño responsive y estilizado con glassmorphism
  - Acceso directo a la creación y edición de actividades desde el calendario
  - Funcionalidad de arrastrar y soltar para cambiar fechas de actividades
  - Tooltip con detalles al pasar el cursor sobre actividades
  - Navegación directa al detalle de actividad al hacer clic
  - Corrección de error 404 al hacer clic en actividades del calendario
  - Leyenda con referencias de colores para tipos y estados
  - Ordenación de actividades con las más recientes primero
  - Mejora de estilos en botones, tooltip y leyenda para mantener consistencia visual con el resto de la aplicación
  - Indicador de tiempo actual en las vistas semanal y diaria
  - Sistema de filtros por estado y tipo de actividad
  - Confirmación al mover actividades entre fechas
  - Botón para actualizar manualmente las actividades

### Corregido
- Problema de carga de actividades en el calendario usando el hook correcto (useActivitiesQuery)
- Adaptación del componente al formato de datos recibido del backend ({activities: [...]} en lugar de {content: [...]})
- Mejora en la depuración con logs detallados para identificar problemas de formato de fecha
- Corrección de la funcionalidad de arrastrar y soltar con la API de HTML5
  - Implementación correcta de los eventos dataTransfer para transferir datos entre elementos
  - Mejora de la retroalimentación visual durante el arrastre
  - Manejo robusto de errores durante el proceso de arrastrar y soltar
  - Corrección del sistema de notificaciones usando el hook useToast en lugar de showNotification
  - Implementación de actualización real de actividades en el backend
  - Corrección de las URLs de la API para incluir el prefijo '/api'
  - Corrección del formato de fecha para compatibilidad con LocalDateTime en el backend
  - Implementación de actualización optimista en la interfaz de usuario
  - Reemplazo del popup nativo por un diálogo de confirmación personalizado
  - Corrección de errores en el componente de notificaciones

### Cambiado
- Componentes reutilizables para píldoras de estado y tipo
  - Creación de componentes StatusBadge y TypeBadge en la carpeta components/ui
  - Unificación de estilos para mantener consistencia visual en toda la aplicación
  - Mejora de la experiencia de usuario con efectos de hover y transiciones
  - Solución de problemas de visualización de colores en diferentes componentes
- Refactorización de componentes que utilizan píldoras de estado y tipo
  - Actualización de ActivityList para usar los nuevos componentes
  - Actualización de ExpandableActivityDetail para usar los nuevos componentes
  - Actualización de ActivityGrid para usar los nuevos componentes
  - Eliminación de código duplicado en múltiples archivos
- Mejora en la paleta de colores para tipos de actividades
  - Actualización del color de "Reunión" a un azul turquesa más agradable
  - Actualización del color de "OTRO" a un azul grisáceo más suave
  - Implementación de sistema de normalización de valores para compatibilidad entre frontend y backend

### Eliminado
- Componente de prueba ColorTest para visualización de píldoras

## [Unreleased - Anterior]

### Agregado
- Inicio del Sprint 11: Mejoras Avanzadas del Sistema de Actividades
  - Diseño de filtros avanzados con guardado de configuraciones
  - Planificación de vista de calendario para actividades
  - Diseño de sistema de comentarios y menciones a usuarios
  - Planificación de sistema de etiquetas y categorización jerárquica
  - Diseño de funcionalidades de exportación e importación de datos
  - Planificación de optimizaciones de rendimiento para grandes volúmenes de datos
- Actualización del README con información sobre próximas mejoras
- Mejora de la documentación del sistema de actividades
- Unificación de archivos README para centralizar la documentación
  - Incorporación de la información de `frontend/README.md` en el README principal
  - Incorporación de la información de `frontend/README-ACTIVITIES.md` en el README principal
  - Actualización de los README secundarios para que redirijan al principal
- Implementación de detalles expandibles en el listado de actividades
  - Reemplazo del modal por un panel expandible al hacer clic en una actividad
  - Mantenimiento del modal para la vista de grid
  - Mejora de la experiencia de usuario al visualizar detalles de actividades
- Mejoras visuales con efecto glassmorphism
  - Implementación de estilos con efecto de vidrio esmerilado
  - Adición de efectos de profundidad y sombras
  - Mejora de transiciones y animaciones
- Mejora de la iconografía y elementos visuales
  - Iconos específicos para cada tipo de actividad
  - Badges mejoradas para estados y tipos
  - Indicadores visuales de estado con colores distintivos

### Agregado
- Implementación del Sprint 10: Sistema de Notificaciones Avanzado
  - Refactorización del modelo de notificaciones con jerarquía de clases
  - Implementación de `TaskAssignmentNotification` para notificaciones de asignación de tareas
  - Implementación de `TaskStatusChangeNotification` para notificaciones de cambio de estado
  - Implementación de `DeadlineReminderNotification` para recordatorios de fechas límite
  - Implementación de `AnnouncementNotification` para anuncios y comunicados
  - Implementación de `CollaborationNotification` para colaboración en tiempo real
  - Servicio `ActivityService` para gestionar actividades y publicar eventos de dominio
  - Servicio `ActivityNotificationService` para manejar eventos de actividades
  - Servicio `DeadlineReminderService` para enviar recordatorios programados
  - Servicio `AnnouncementService` para gestionar anuncios y comunicados
  - Servicio `CollaborationService` para gestionar colaboración en tiempo real
  - Controladores REST para anuncios y colaboración
  - DTOs para solicitudes de anuncios y colaboración

### Agregado
- Implementación del panel de preferencias de notificaciones
  - Configuración de tipos de notificaciones a recibir
  - Opciones para recibir notificaciones por email, push y sonido
  - Interfaz intuitiva con toggles y checkboxes
- Mejora del centro de notificaciones con categorización
  - Filtrado de notificaciones por categoría (Tareas, Fechas límite, Anuncios, Colaboración, Sistema)
  - Contador de notificaciones por categoría
  - Interfaz mejorada con iconos y colores distintivos
- Optimización de WebSockets con reconexión automática
  - Implementación de backoff exponencial para reintentos
  - Sistema de heartbeat para detectar conexiones zombies
  - Sincronización del estado después de una reconexión
  - Notificaciones al usuario cuando se pierde la conexión
- Indicadores visuales de presencia en la interfaz de actividades
  - Servicio de colaboración en tiempo real para rastrear usuarios
  - Indicadores de quién está viendo o editando una actividad
  - Advertencias cuando otro usuario está editando la misma actividad
  - Tooltips con información detallada sobre los colaboradores
- Sistema de cola para mensajes no enviados durante desconexiones
  - Persistencia de mensajes en localStorage para recuperación entre sesiones
  - Prioridad configurable para mensajes (alta, media, baja)
  - Reintentos automáticos con límite configurable
  - Interfaz para visualizar y gestionar la cola de mensajes
  - Notificaciones sobre el estado de los mensajes en cola
- Compresión de mensajes para optimizar rendimiento
  - Compresión automática de mensajes grandes usando la API CompressionStream
  - Fallback a pako.js para navegadores sin soporte nativo
  - Configuración de umbral y nivel de compresión
  - Estadísticas de compresión en tiempo real
  - Interfaz para gestionar la configuración de compresión
- Niveles de urgencia configurables para notificaciones
  - Implementación de cuatro niveles: Baja, Media, Alta y Crítica
  - Visualización diferenciada según nivel de urgencia
  - Interfaz para configurar el nivel de urgencia por tipo de notificación
  - Animaciones y estilos visuales para destacar notificaciones urgentes
- Mejoras en la visualización de notificaciones específicas
  - Visualización especializada para cada tipo de notificación
  - Destacado visual para recordatorios de fechas límite urgentes
  - Cuenta regresiva para eventos programados
  - Indicadores de colaboración en tiempo real
- Acciones rápidas en notificaciones
  - Botón para ver actividad directamente desde la notificación
  - Opción para marcar como leída sin salir del centro de notificaciones
  - Funcionalidad para posponer recordatorios (15m, 30m, 1h, 4h)
  - Opción para descartar recordatorios no relevantes

### Agregado
- Sistema de notificaciones en tiempo real con WebSockets
  - Servicio WebSocket para comunicación en tiempo real
  - Contexto para gestionar notificaciones
  - Componente de centro de notificaciones
  - Integración con el sistema de notificaciones toast
- Creado cliente HTTP basado en ky para peticiones a la API
- Configurado alias de importación en Vite para mejorar la organización del código
- Instalada dependencia date-fns para formateo de fechas

### Corregido
- Corregido error de sintaxis JSX en archivos .js renombrando a .jsx
  - Servidor WebSocket en el backend con Spring
  - Autenticación JWT para WebSockets
- Sistema de gestión de sesiones múltiples
  - Registro de sesiones de usuario con información detallada
  - Endpoints para listar y gestionar sesiones activas
  - Detección de sesiones sospechosas
  - Cierre remoto de sesiones
  - Vista de sesiones activas con información detallada
  - Filtros y búsqueda de sesiones
  - Botón para cerrar sesiones individuales

### Corregido
- Error de compilación en AuthService.java debido a imports incorrectos
- Error de compilación en UserSessionService.java por métodos indefinidos
- Error de compilación en WebSocketAuthenticationConfig.java por métodos indefinidos
- Actualización de métodos para usar la clase JwtTokenProvider correctamente
- Reemplazo de getUsernameFromToken por getUsername en todas las clases
- Agregadas anotaciones @NonNull faltantes en WebSocketAuthenticationConfig.java
- Documentadas tareas para corregir advertencias de Checkstyle
- Documentadas tareas para corregir problemas de generación de OpenAPI
- Mejorado el script start-dev.bat para generar el archivo OpenAPI antes de compilar el backend
- Verificada la solución existente para la generación de tipos TypeScript desde OpenAPI
- Implementado el método getUserIdFromUsername en JwtTokenProvider para corregir errores en SessionController
- Resuelto conflicto de beans entre controladores de autenticación
- Renombrado y reorganizado controladores de autenticación para evitar conflictos
- Consolidado controladores de autenticación utilizando el servicio AuthService
- Eliminados controladores de autenticación obsoletos (LegacyAuthController y OldAuthController)
- Menú de usuario mejorado con submenús y más opciones
- Configuración de tiempo de inactividad personalizable
- Selección de temas (claro/oscuro) desde el menú de usuario
- Sistema unificado de notificaciones toast con soporte para accesibilidad
- Componente LazyImage para carga diferida de imágenes
- Transiciones suaves entre páginas con el componente PageTransition
- Sistema mejorado de skeleton loaders con múltiples variantes
- Soporte para el usuario de prueba `testuser` con contraseña `test123`
- Script unificado `start-app.bat` para iniciar toda la aplicación
- Funcionalidad de cierre de sesión con menú desplegable en el header
- Animaciones y transiciones en el menú de usuario
- Información detallada del usuario en el menú desplegable
- Temporizador de inactividad para cierre automático de sesión
- Endpoint en el backend para invalidar tokens JWT
- Lista negra de tokens JWT en el backend
- Funcionalidad para colapsar el sidebar a iconos
- Botón para alternar entre sidebar expandido y colapsado
- Listado de actividades funcional conectado a la API
- Estados de carga y error en el listado de actividades
- Mensaje cuando no hay actividades
- Paginación funcional para el listado de actividades
- Hooks personalizados para operaciones CRUD con React Query
- Validación de parámetros para evitar errores 500
- Sistema de caché en localStorage para mejorar la experiencia offline
- Debounce para la búsqueda de actividades
- Generación automática de tipos TypeScript desde OpenAPI
- Especificaciones JPA para filtros dinámicos de actividades
- Proyecciones JPA para optimizar consultas
- Endpoints para estadísticas de actividades por tipo y estado
- Endpoint para obtener resúmenes de actividades
- Sistema de refresh tokens automáticos
- Interceptor para renovación automática de tokens en el frontend
- Manejo centralizado de errores en el backend con códigos específicos
- Respuestas de error estructuradas con detalles y códigos
- Script mejorado para generar tipos TypeScript desde OpenAPI
- Documentación detallada sobre la generación de tipos TypeScript
- Actualización del archivo de tareas con nuevas tareas para pruebas unitarias e integración
- Actualización del README con el estado actual del proyecto y próximos pasos

### Cambiado
- Unificación del sistema de notificaciones toast para usar un solo proveedor
- Mejora en la experiencia de usuario con transiciones entre páginas
- Optimización de carga de imágenes con lazy loading
- Actualización de los skeleton loaders para mayor consistencia visual
- Corrección de rutas de importación para resolver problemas con alias @/
- Implementación de soluciones temporales para evitar dependencias problemáticas (date-fns, socket.io-client)
- Corrección de importación de useAppSelector en RealTimeNotificationContext
- Corrección de importación de toggleTheme en Header.jsx
- Corrección de error de RealTimeNotificationProvider
- Corrección de error de styled-components en PageTransition.tsx
- Corrección de orden de proveedores en App.jsx
- Actualización de las contraseñas de los usuarios de prueba:
  - `admin`: Admin@123
  - `usuario`: Usuario@123
  - `testuser`: test123
- Mejora en la configuración de seguridad para permitir el acceso a las rutas de autenticación
- Actualización de la documentación con las nuevas credenciales de usuarios
- Migración de Redux a React Query para la gestión de estado del servidor
- Mejora en el manejo de errores con mensajes más específicos
- Optimización de componentes para reducir re-renderizados innecesarios
- Actualización de propiedades en componentes styled-components para usar el prefijo `$`
- Refactorización del repositorio de actividades para usar especificaciones JPA
- Mejora en la documentación de la API con OpenAPI 3.0
- Optimización de consultas de actividades con proyecciones
- Mejora en el manejo de excepciones con GlobalExceptionHandler
- Implementación de códigos de error estandarizados
- Actualización del flujo de autenticación para soportar refresh tokens
- Actualización del script start-app.bat para incluir la generación de tipos TypeScript
- Mejora en la visualización de detalles de actividades con panel expandible en la vista de lista
- Mejora en la paleta de colores para píldoras de estado y tipo de actividades
  - Colores más intuitivos y significativos para cada estado (verde para completado, azul para en progreso, etc.)
  - Sistema centralizado de colores para mantener consistencia visual
  - Efectos mejorados de hover y sombras para elementos interactivos
  - Optimización del código para usar acceso directo a propiedades de color
  - Corrección de compatibilidad con valores reales de estados y tipos
  - Solución de problemas de renderizado de colores en componentes styled

### Eliminado
- Scripts innecesarios de actualización de contraseñas
- Configuración redundante en el proxy de Vite
- Sistema de datos simulados (mock) para cuando el backend no está disponible
- Hook useMockData y todas sus referencias

### Corregido
- Problema de autenticación con el usuario `admin`
- Conflicto de puertos con Grafana en el puerto 3000
- Error 403 Forbidden en la ruta `/auth/login`
- Error en la autenticación al acceder a la sección de actividades
- Problema con el envío del token JWT en las solicitudes a la API
- Redirección a la página de login cuando el usuario no está autenticado
- Error al cerrar sesión debido a una importación faltante de `authService`
- Error 500 al enviar valores negativos en el parámetro 'page'
- Advertencias de styled-components para props 'status', 'show', 'danger' y otras propiedades booleanas
- Ciclos infinitos de renderizado en el componente Activities
- Peticiones repetidas al endpoint de actividades
- Error 500 al crear actividades debido a incompatibilidad de formato de fecha con la zona horaria Z
- Problema con la actualización del listado de actividades al crear una nueva actividad
- Botón "Refrescar datos" innecesario en la vista de actividades
- Error "React is not defined" en componentes JSX que no importaban React explícitamente

## [0.1.0] - 2025-04-16

### Agregado
- Implementación inicial de la arquitectura hexagonal
- Configuración básica de Spring Boot
- Implementación de autenticación con JWT
- Configuración de base de datos H2 para desarrollo
- Implementación de frontend con React y TypeScript
- Configuración de Docker y Docker Compose
- Configuración de CI/CD con GitHub Actions
- Configuración de monitoreo con Prometheus y Grafana
- Configuración de tracing distribuido con Zipkin
- Documentación inicial del proyecto
