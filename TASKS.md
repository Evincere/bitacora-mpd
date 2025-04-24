# Plan de Implementación - Proyecto Bitácora

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

## Sprint 9: Mejoras de Rendimiento y Experiencia de Usuario

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

#### 2.2 Mejorar las transiciones entre páginas (1 día)
- [x] Implementar animaciones de transición entre páginas
- [x] Asegurar que las transiciones sean accesibles
- [x] Optimizar el rendimiento de las transiciones
- [x] Implementar transiciones contextuales basadas en la navegación

#### 2.3 Implementar notificaciones toast para acciones del usuario (1 día)
- [x] Revisar y mejorar el sistema de notificaciones existente
- [x] Asegurar que todas las acciones importantes del usuario tengan notificaciones
- [x] Implementar diferentes tipos de notificaciones (éxito, error, advertencia, información)
- [x] Mejorar la accesibilidad de las notificaciones

### 3. Pruebas Automatizadas (3 días)

#### 3.1 Implementar pruebas unitarias para los componentes principales (1 día)
- [ ] Configurar Jest y React Testing Library
- [ ] Implementar pruebas para componentes comunes
- [ ] Implementar pruebas para hooks personalizados
- [ ] Implementar pruebas para funciones de utilidad
- [ ] Implementar pruebas unitarias para la capa de dominio
- [ ] Implementar pruebas unitarias para la capa de aplicación

#### 3.2 Implementar pruebas de integración para los flujos críticos (1 día)
- [ ] Identificar los flujos críticos de la aplicación
- [ ] Implementar pruebas para el flujo de autenticación
- [ ] Implementar pruebas para el flujo de gestión de actividades
- [ ] Implementar pruebas para el flujo de filtrado y búsqueda
- [ ] Implementar pruebas de integración para los adaptadores
- [ ] Implementar pruebas de integración para los controladores

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
- [ ] Corregir parámetros que deberían ser declarados como `final`
- [ ] Corregir problemas de formato de código (operadores en nuevas líneas)
- [ ] Corregir clases de utilidad con constructores públicos
- [ ] Corregir importaciones no utilizadas o con comodín
- [ ] Corregir problemas de longitud de línea
- [ ] Corregir problemas de documentación Javadoc

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
- [ ] Implementar modelo de datos para comentarios
  - [ ] Crear entidad Comment y relaciones necesarias
  - [ ] Implementar repositorio y servicios para comentarios
  - [ ] Desarrollar endpoints REST para gestión de comentarios
- [ ] Desarrollar interfaz de usuario para comentarios
  - [ ] Crear componente de lista de comentarios
  - [ ] Implementar formulario para añadir comentarios
  - [ ] Añadir funcionalidad de edición y eliminación
- [ ] Implementar menciones a usuarios
  - [ ] Desarrollar selector de usuarios con @
  - [ ] Implementar resaltado de menciones
  - [ ] Configurar notificaciones para usuarios mencionados

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

## Sprint 13: Unificación de Estilos y Corrección de Errores TypeScript (2 semanas)

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
- [ ] 4.1 Corregir errores de código en el backend
  - [ ] Corregir advertencias de Checkstyle
  - [ ] Resolver problemas de código no utilizado
  - [ ] Corregir posibles null pointer exceptions
- [x] 4.2 Corregir errores de código en el frontend
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
- [ ] 4.3 Mejorar la documentación del código
  - [ ] Añadir comentarios JSDoc a componentes y funciones clave
  - [ ] Documentar APIs públicas
  - [ ] Actualizar README.md con la nueva estructura y convenciones
- [x] 4.4 Implementar componentes para resúmenes de actividades
  - [x] Crear componente para mostrar resúmenes de actividades usando getActivitySummaries
  - [x] Integrar componente de resúmenes en el dashboard
  - [x] Actualizar RecentActivities para usar datos reales en lugar de datos estáticos

### Criterios de aceptación
- No hay errores de autenticación o permisos
- El rendimiento de la aplicación ha mejorado significativamente
- Las pruebas automatizadas cubren al menos el 70% del código
- No hay errores o advertencias de código
- La documentación está actualizada y es clara

## Notas y Consideraciones
- Mantener compatibilidad hacia atrás durante la migración
- Seguir principios SOLID y Clean Architecture
- Documentar decisiones técnicas importantes
- Realizar code reviews frecuentes
- Mantener dependencias actualizadas

## Sprint 15: Funcionalidades Avanzadas y Mejoras de Productividad (4 semanas)

### Objetivos del Sprint
- Implementar sistema de reportes y analytics avanzados
- Integrar calendario y sistema de recordatorios
- Mejorar la colaboración entre usuarios
- Implementar gestión de recursos y tiempo
- Añadir automatizaciones y workflows
- Mejorar la experiencia de usuario
- Integrar inteligencia artificial
- Implementar sistema de documentación integrado

### 1. Sistema de Reportes y Analytics (1 semana)

#### 1.1 Dashboard Personalizable (3 días)
- [ ] Implementar sistema de widgets personalizables
  - [ ] Crear componentes base para diferentes tipos de gráficos
  - [ ] Implementar sistema de arrastrar y soltar para organizar widgets
  - [ ] Añadir opciones de personalización para cada widget
- [ ] Desarrollar visualizaciones de datos
  - [ ] Implementar gráficos de actividades por período
  - [ ] Crear visualizaciones de métricas de productividad
  - [ ] Desarrollar KPIs personalizables
- [ ] Implementar exportación de datos
  - [ ] Añadir exportación a PDF
  - [ ] Implementar exportación a Excel
  - [ ] Crear plantillas personalizables para exportación

#### 1.2 Análisis Predictivo (2 días)
- [ ] Implementar estimación de tiempos
  - [ ] Desarrollar algoritmo de estimación basado en datos históricos
  - [ ] Crear visualización de estimaciones vs. tiempos reales
  - [ ] Implementar ajuste automático de estimaciones
- [ ] Desarrollar análisis de patrones
  - [ ] Implementar detección de patrones de productividad
  - [ ] Crear visualización de tendencias
  - [ ] Desarrollar sistema de alertas para desviaciones

### 2. Integración con Calendario y Recordatorios (3 días)

#### 2.1 Sincronización con Calendarios Externos
- [ ] Implementar integración con Google Calendar
  - [ ] Configurar OAuth para autenticación
  - [ ] Implementar sincronización bidireccional
  - [ ] Manejar conflictos de sincronización
- [ ] Implementar integración con Outlook
  - [ ] Configurar Microsoft Graph API
  - [ ] Implementar sincronización bidireccional
  - [ ] Manejar conflictos de sincronización

#### 2.2 Sistema de Recordatorios
- [ ] Implementar notificaciones push
  - [ ] Configurar servicio de notificaciones push
  - [ ] Implementar manejo de permisos
  - [ ] Crear sistema de priorización de notificaciones
- [ ] Desarrollar sistema de recordatorios por correo
  - [ ] Implementar plantillas de correo personalizables
  - [ ] Crear sistema de programación de recordatorios
  - [ ] Implementar gestión de preferencias de notificación

### 3. Sistema de Colaboración (4 días)

#### 3.1 Espacios de Trabajo Compartidos
- [ ] Implementar sistema de equipos
  - [ ] Crear modelo de datos para equipos y roles
  - [ ] Implementar gestión de permisos por equipo
  - [ ] Desarrollar interfaz de administración de equipos
- [ ] Implementar compartición de actividades
  - [ ] Crear sistema de invitaciones
  - [ ] Implementar control de acceso granular
  - [ ] Desarrollar sistema de notificaciones de cambios

#### 3.2 Sistema de Comentarios y Menciones
- [ ] Implementar sistema de comentarios
  - [ ] Crear modelo de datos para comentarios y hilos
  - [ ] Implementar sistema de reacciones
  - [ ] Desarrollar notificaciones de menciones
- [ ] Implementar sistema de menciones
  - [ ] Crear selector de usuarios con @
  - [ ] Implementar resaltado de menciones
  - [ ] Desarrollar notificaciones de menciones

### 4. Gestión de Recursos y Tiempo (3 días)

#### 4.1 Time Tracking
- [ ] Implementar cronómetro integrado
  - [ ] Crear componente de cronómetro
  - [ ] Implementar registro automático de tiempo
  - [ ] Desarrollar reportes de tiempo
- [ ] Implementar reportes de tiempo
  - [ ] Crear visualizaciones de tiempo invertido
  - [ ] Implementar exportación de reportes
  - [ ] Desarrollar análisis de productividad

#### 4.2 Gestión de Recursos
- [ ] Implementar control de disponibilidad
  - [ ] Crear calendario de disponibilidad
  - [ ] Implementar sistema de solicitudes
  - [ ] Desarrollar notificaciones de cambios
- [ ] Implementar sistema de alertas
  - [ ] Crear sistema de detección de sobrecarga
  - [ ] Implementar notificaciones de sobrecarga
  - [ ] Desarrollar sugerencias de reasignación

### 5. Automatizaciones y Workflows (3 días)

#### 5.1 Constructor de Flujos de Trabajo
- [ ] Implementar editor visual de workflows
  - [ ] Crear interfaz de arrastrar y soltar
  - [ ] Implementar validación de flujos
  - [ ] Desarrollar sistema de versionado
- [ ] Implementar sistema de triggers
  - [ ] Crear sistema de eventos
  - [ ] Implementar condiciones personalizables
  - [ ] Desarrollar acciones automáticas

#### 5.2 Plantillas de Actividades
- [ ] Implementar sistema de plantillas
  - [ ] Crear editor de plantillas
  - [ ] Implementar variables en plantillas
  - [ ] Desarrollar sistema de versionado
- [ ] Implementar checklists automáticas
  - [ ] Crear sistema de checklists dinámicas
  - [ ] Implementar validación de checklists
  - [ ] Desarrollar notificaciones de completitud

### 6. Mejoras en UX/UI (2 días)

#### 6.1 Modo Offline
- [ ] Implementar sincronización offline
  - [ ] Crear sistema de cola de operaciones
  - [ ] Implementar resolución de conflictos
  - [ ] Desarrollar indicador de estado
- [ ] Implementar caché avanzado
  - [ ] Crear sistema de caché inteligente
  - [ ] Implementar limpieza automática
  - [ ] Desarrollar gestión de espacio

#### 6.2 Personalización Avanzada
- [ ] Implementar temas personalizables
  - [ ] Crear editor de temas
  - [ ] Implementar exportación/importación
  - [ ] Desarrollar temas dinámicos
- [ ] Implementar layouts ajustables
  - [ ] Crear sistema de layouts personalizables
  - [ ] Implementar guardado de layouts
  - [ ] Desarrollar layouts responsivos

### 7. Inteligencia Artificial (3 días)

#### 7.1 Asistente Virtual
- [ ] Implementar sugerencias de priorización
  - [ ] Crear modelo de aprendizaje automático
  - [ ] Implementar análisis de contexto
  - [ ] Desarrollar interfaz de sugerencias
- [ ] Implementar análisis de sentimiento
  - [ ] Crear sistema de análisis de texto
  - [ ] Implementar detección de emociones
  - [ ] Desarrollar visualización de análisis

#### 7.2 Automatización Inteligente
- [ ] Implementar categorización automática
  - [ ] Crear sistema de clasificación
  - [ ] Implementar aprendizaje automático
  - [ ] Desarrollar ajuste manual
- [ ] Implementar detección de duplicados
  - [ ] Crear sistema de comparación
  - [ ] Implementar sugerencias de fusión
  - [ ] Desarrollar manejo de conflictos

### 8. Sistema de Documentación Integrado (2 días)

#### 8.1 Base de Conocimiento
- [ ] Implementar wiki integrada
  - [ ] Crear editor de wiki
  - [ ] Implementar sistema de versionado
  - [ ] Desarrollar búsqueda avanzada
- [ ] Implementar vinculación con actividades
  - [ ] Crear sistema de referencias
  - [ ] Implementar navegación contextual
  - [ ] Desarrollar sugerencias de documentación

#### 8.2 Gestión de Archivos
- [ ] Implementar almacenamiento local
  - [ ] Crear sistema de archivos
  - [ ] Implementar compresión
  - [ ] Desarrollar búsqueda de archivos
- [ ] Implementar versionado de documentos
  - [ ] Crear sistema de versiones
  - [ ] Implementar comparación de versiones
  - [ ] Desarrollar restauración de versiones

### Criterios de Aceptación
- Todas las funcionalidades implementadas y probadas
- Documentación completa y actualizada
- Pruebas automatizadas implementadas
- Rendimiento optimizado
- Experiencia de usuario mejorada
- Seguridad y privacidad garantizadas
