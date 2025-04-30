# Documentación Técnica: Módulo de Solicitudes de Tareas

## Arquitectura

El módulo de Solicitudes de Tareas sigue la arquitectura hexagonal (también conocida como Ports and Adapters) y está organizado en tres capas principales:

1. **Capa de Dominio**: Contiene las entidades de negocio, reglas de negocio y puertos (interfaces).
2. **Capa de Aplicación**: Contiene los casos de uso, servicios de aplicación y DTOs.
3. **Capa de Infraestructura**: Contiene los adaptadores para bases de datos, API REST y otros componentes externos.

## Estructura del Código

### Capa de Dominio

#### Entidades

- `TaskRequest`: Entidad principal que representa una solicitud de tarea.
- `TaskRequestCategory`: Entidad que representa una categoría de solicitud.
- `TaskRequestComment`: Entidad que representa un comentario en una solicitud.
- `TaskRequestAttachment`: Entidad que representa un archivo adjunto a una solicitud.

#### Enumeraciones

- `TaskRequestStatus`: Estados posibles de una solicitud (DRAFT, SUBMITTED, ASSIGNED, COMPLETED, CANCELLED).
- `TaskRequestPriority`: Niveles de prioridad (CRITICAL, HIGH, MEDIUM, LOW, TRIVIAL).

#### Puertos (Interfaces)

- `TaskRequestRepository`: Interfaz para operaciones de persistencia de solicitudes.
- `TaskRequestCategoryRepository`: Interfaz para operaciones de persistencia de categorías.

### Capa de Aplicación

#### Casos de Uso

- `CreateTaskRequestUseCase`: Caso de uso para crear solicitudes.
- `UpdateTaskRequestUseCase`: Caso de uso para actualizar solicitudes.

#### Servicios

- `TaskRequestWorkflowService`: Servicio para gestionar el flujo de trabajo de las solicitudes.
- `TaskRequestCategoryService`: Servicio para gestionar las categorías de solicitudes.

#### DTOs

- `TaskRequestDto`: DTO para transferir información completa de solicitudes.
- `CreateTaskRequestDto`: DTO para recibir datos de creación de solicitudes.
- `UpdateTaskRequestDto`: DTO para recibir datos de actualización de solicitudes.
- `TaskRequestCategoryDto`: DTO para transferir información de categorías.
- `TaskRequestCommentDto`: DTO para transferir información de comentarios.
- `TaskRequestAttachmentDto`: DTO para transferir información de archivos adjuntos.
- `TaskRequestCommentCreateDto`: DTO para recibir datos de creación de comentarios.
- `TaskRequestPageDto`: DTO para transferir información paginada de solicitudes.

#### Mappers

- `TaskRequestMapper`: Mapper para convertir entre entidades de dominio y DTOs.
- `TaskRequestCategoryMapper`: Mapper para convertir entre entidades de dominio y DTOs de categorías.

### Capa de Infraestructura

#### Entidades JPA

- `TaskRequestEntity`: Entidad JPA para persistir solicitudes.
- `TaskRequestCategoryEntity`: Entidad JPA para persistir categorías.
- `TaskRequestCommentEntity`: Entidad JPA para persistir comentarios.
- `TaskRequestAttachmentEntity`: Entidad JPA para persistir archivos adjuntos.

#### Enumeraciones JPA

- `TaskRequestStatusEntity`: Enumeración JPA para estados de solicitudes.
- `TaskRequestPriorityEntity`: Enumeración JPA para prioridades de solicitudes.

#### Repositorios JPA

- `TaskRequestJpaRepository`: Repositorio JPA para solicitudes.
- `TaskRequestCategoryJpaRepository`: Repositorio JPA para categorías.

#### Adaptadores

- `TaskRequestRepositoryAdapter`: Adaptador que implementa `TaskRequestRepository` utilizando JPA.
- `TaskRequestCategoryRepositoryAdapter`: Adaptador que implementa `TaskRequestCategoryRepository` utilizando JPA.

#### Controladores REST

- `TaskRequestController`: Controlador REST para operaciones de solicitudes.
- `TaskRequestCategoryController`: Controlador REST para operaciones de categorías.

## Flujo de Datos

1. El cliente envía una solicitud HTTP al controlador REST.
2. El controlador convierte los datos de la solicitud en DTOs.
3. El controlador llama al caso de uso o servicio correspondiente.
4. El caso de uso o servicio procesa la solicitud utilizando las entidades de dominio.
5. El caso de uso o servicio utiliza el repositorio para persistir los cambios.
6. El repositorio utiliza el adaptador para interactuar con la base de datos.
7. El resultado se devuelve al controlador, que lo convierte en un DTO y lo envía al cliente.

## API REST

### Endpoints de Solicitudes

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | /api/task-requests | Obtiene todas las solicitudes | ADMIN |
| GET | /api/task-requests/{id} | Obtiene una solicitud por su ID | SOLICITANTE, ASIGNADOR, EJECUTOR, ADMIN |
| GET | /api/task-requests/my-requests | Obtiene las solicitudes del usuario actual | SOLICITANTE, ADMIN |
| GET | /api/task-requests/assigned-to-me | Obtiene las solicitudes asignadas al usuario actual | ASIGNADOR, ADMIN |
| GET | /api/task-requests/by-status/{status} | Obtiene las solicitudes por estado | ASIGNADOR, ADMIN |
| POST | /api/task-requests | Crea una nueva solicitud | SOLICITANTE, ADMIN |
| PUT | /api/task-requests/{id} | Actualiza una solicitud existente | SOLICITANTE, ADMIN |
| POST | /api/task-requests/{id}/submit | Envía una solicitud | SOLICITANTE, ADMIN |
| POST | /api/task-requests/{id}/assign | Asigna una solicitud | ASIGNADOR, ADMIN |
| POST | /api/task-requests/{id}/complete | Completa una solicitud | EJECUTOR, ADMIN |
| POST | /api/task-requests/{id}/cancel | Cancela una solicitud | SOLICITANTE, ADMIN |
| POST | /api/task-requests/comments | Añade un comentario a una solicitud | SOLICITANTE, ASIGNADOR, EJECUTOR, ADMIN |
| DELETE | /api/task-requests/{id} | Elimina una solicitud | ADMIN |
| GET | /api/task-requests/stats/by-status | Obtiene estadísticas de solicitudes por estado | ASIGNADOR, ADMIN |

### Endpoints de Categorías

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | /api/task-request-categories | Obtiene todas las categorías | SOLICITANTE, ASIGNADOR, EJECUTOR, ADMIN |
| GET | /api/task-request-categories/{id} | Obtiene una categoría por su ID | SOLICITANTE, ASIGNADOR, EJECUTOR, ADMIN |
| GET | /api/task-request-categories/default | Obtiene la categoría por defecto | SOLICITANTE, ASIGNADOR, EJECUTOR, ADMIN |
| GET | /api/task-request-categories/search | Busca categorías por nombre | SOLICITANTE, ASIGNADOR, EJECUTOR, ADMIN |
| POST | /api/task-request-categories | Crea una nueva categoría | ADMIN |
| PUT | /api/task-request-categories/{id} | Actualiza una categoría existente | ADMIN |
| POST | /api/task-request-categories/{id}/set-default | Establece una categoría como predeterminada | ADMIN |
| DELETE | /api/task-request-categories/{id} | Elimina una categoría | ADMIN |

## Base de Datos

### Tablas

- `task_requests`: Almacena las solicitudes de tareas.
- `task_request_categories`: Almacena las categorías de solicitudes.
- `task_request_comments`: Almacena los comentarios de las solicitudes.
- `task_request_attachments`: Almacena los archivos adjuntos de las solicitudes.

### Relaciones

- Una solicitud pertenece a una categoría (relación muchos a uno).
- Una solicitud tiene muchos comentarios (relación uno a muchos).
- Una solicitud tiene muchos archivos adjuntos (relación uno a muchos).

## Frontend

### Tipos TypeScript

- `TaskRequest`: Interfaz para representar una solicitud de tarea.
- `TaskRequestCategory`: Interfaz para representar una categoría de solicitud.
- `TaskRequestComment`: Interfaz para representar un comentario en una solicitud.
- `TaskRequestAttachment`: Interfaz para representar un archivo adjunto a una solicitud.
- `TaskRequestStatus`: Enumeración para estados de solicitudes.
- `TaskRequestPriority`: Enumeración para prioridades de solicitudes.

### Servicios

- `taskRequestService`: Servicio para interactuar con la API de solicitudes.
- `taskRequestCategoryService`: Servicio para interactuar con la API de categorías.

### Componentes

- `TaskRequestList`: Componente para listar solicitudes.
- `TaskRequestDetail`: Componente para ver los detalles de una solicitud.
- `TaskRequestForm`: Componente para crear y editar solicitudes.
- `TaskRequestCategoryList`: Componente para gestionar categorías.
- `TaskRequestStats`: Componente para visualizar estadísticas.

### Páginas

- `AllTaskRequestsPage`: Página para ver todas las solicitudes.
- `MyTaskRequestsPage`: Página para ver las solicitudes del usuario actual.
- `AssignedTaskRequestsPage`: Página para ver las solicitudes asignadas al usuario actual.
- `TaskRequestsByStatusPage`: Página para ver las solicitudes por estado.
- `TaskRequestDetailPage`: Página para ver los detalles de una solicitud.
- `TaskRequestFormPage`: Página para crear y editar solicitudes.
- `TaskRequestCategoryPage`: Página para gestionar categorías.
- `TaskRequestStatsPage`: Página para visualizar estadísticas.

## Seguridad

El acceso a los endpoints está protegido mediante Spring Security y anotaciones `@PreAuthorize` que verifican los roles del usuario. Los roles utilizados son:

- `ROLE_SOLICITANTE`: Para usuarios que pueden crear y enviar solicitudes.
- `ROLE_ASIGNADOR`: Para usuarios que pueden asignar solicitudes.
- `ROLE_EJECUTOR`: Para usuarios que pueden completar solicitudes asignadas.
- `ROLE_ADMIN`: Para administradores con acceso completo.

## Pruebas

### Pruebas Unitarias

- `TaskRequestTest`: Pruebas para la entidad TaskRequest.
- `CreateTaskRequestUseCaseTest`: Pruebas para el caso de uso CreateTaskRequestUseCase.
- `TaskRequestWorkflowServiceTest`: Pruebas para el servicio TaskRequestWorkflowService.
- `TaskRequestRepositoryAdapterTest`: Pruebas para el adaptador TaskRequestRepositoryAdapter.

### Pruebas de Integración

- `TaskRequestControllerIntegrationTest`: Pruebas de integración para TaskRequestController.

## Extensibilidad

El módulo está diseñado para ser extensible:

1. **Nuevos Estados**: Se pueden añadir nuevos estados a la enumeración `TaskRequestStatus`.
2. **Nuevas Prioridades**: Se pueden añadir nuevas prioridades a la enumeración `TaskRequestPriority`.
3. **Campos Personalizados**: Se pueden añadir campos personalizados a las entidades y DTOs.
4. **Nuevos Endpoints**: Se pueden añadir nuevos endpoints a los controladores existentes o crear nuevos controladores.

## Consideraciones de Rendimiento

- Las consultas a la base de datos están paginadas para evitar cargar demasiados datos en memoria.
- Se utilizan índices en las tablas para mejorar el rendimiento de las consultas.
- Los DTOs incluyen solo la información necesaria para cada operación.

## Mejores Prácticas

1. **Separación de Responsabilidades**: Cada clase tiene una única responsabilidad.
2. **Inmutabilidad**: Las entidades de dominio son inmutables para evitar efectos secundarios.
3. **Validación**: Los datos de entrada se validan en los DTOs y en los casos de uso.
4. **Manejo de Errores**: Los errores se manejan de forma consistente en toda la aplicación.
5. **Documentación**: El código está documentado con comentarios JavaDoc.

## Ejemplos de Uso

### Crear una Solicitud

```java
// Crear un DTO con los datos de la solicitud
CreateTaskRequestDto createDto = new CreateTaskRequestDto();
createDto.setTitle("Solicitud de prueba");
createDto.setDescription("Descripción de prueba");
createDto.setPriority("MEDIUM");
createDto.setSubmitImmediately(false);

// Llamar al caso de uso
TaskRequest taskRequest = createTaskRequestUseCase.createDraft(
    createDto.getTitle(),
    createDto.getDescription(),
    createDto.getCategoryId(),
    taskRequestMapper.toPriorityEnum(createDto.getPriority()),
    createDto.getDueDate(),
    createDto.getNotes(),
    currentUser.getId()
);
```

### Enviar una Solicitud

```java
// Llamar al servicio de flujo de trabajo
TaskRequest taskRequest = taskRequestWorkflowService.submit(taskRequestId, currentUser.getId());
```

### Asignar una Solicitud

```java
// Llamar al servicio de flujo de trabajo
TaskRequest taskRequest = taskRequestWorkflowService.assign(taskRequestId, currentUser.getId());
```

### Completar una Solicitud

```java
// Llamar al servicio de flujo de trabajo
TaskRequest taskRequest = taskRequestWorkflowService.complete(taskRequestId);
```

## Solución de Problemas

### Problemas Comunes

1. **Error 403 Forbidden**: Verifique que el usuario tiene el rol adecuado para la operación.
2. **Error 404 Not Found**: Verifique que el ID de la solicitud o categoría existe.
3. **Error 400 Bad Request**: Verifique que los datos enviados son válidos.
4. **Error 500 Internal Server Error**: Verifique los logs del servidor para más detalles.

### Logs

Los logs de la aplicación se pueden encontrar en:

- Backend: `logs/bitacora.log`
- Frontend: Consola del navegador

## Recursos Adicionales

- [Documentación de Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Documentación de React](https://reactjs.org/docs/getting-started.html)
- [Documentación de Material-UI](https://mui.com/getting-started/usage/)
- [Documentación de React Hook Form](https://react-hook-form.com/get-started)
