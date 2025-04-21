# Registro de Cambios (Changelog)

## [Unreleased]

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
