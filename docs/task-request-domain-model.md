# Modelo de Dominio: TaskRequest (Solicitud de Tarea)

## Descripción

El modelo de dominio `TaskRequest` representa una solicitud de tarea en el sistema. Una solicitud de tarea es una petición creada por un usuario (solicitante) para que se asigne y ejecute una tarea específica.

## Diagrama UML

```
+-------------------+       +----------------------+       +----------------------+
| TaskRequest       |       | TaskRequestCategory  |       | TaskRequestComment   |
+-------------------+       +----------------------+       +----------------------+
| id: Long          |       | id: Long             |       | id: Long             |
| title: String     |       | name: String         |       | taskRequestId: Long  |
| description: String|<>----| description: String  |       | userId: Long         |
| category: TaskReq..|       | color: String        |       | content: String      |
| priority: TaskReq..|       | isDefault: boolean   |       | createdAt: LocalDate.|
| dueDate: LocalDate.|       +----------------------+       +----------------------+
| status: TaskReq... |                                                 ^
| requesterId: Long  |                                                 |
| assignerId: Long   |                                                 |
| requestDate: Local.|                                                 |
| assignmentDate: Lo.|                                                 |
| notes: String      |--------------------------------------------+    |
| attachments: List<>|                                            |    |
| comments: List<>   |--------------------------------------------+----+
+-------------------+
        ^
        |
        |
+-------------------+       +----------------------+
| TaskRequestStatus |       | TaskRequestPriority  |
+-------------------+       +----------------------+
| DRAFT             |       | CRITICAL             |
| SUBMITTED         |       | HIGH                 |
| ASSIGNED          |       | MEDIUM               |
| COMPLETED         |       | LOW                  |
| CANCELLED         |       | TRIVIAL              |
+-------------------+       +----------------------+
```

## Entidades Principales

### TaskRequest

Representa una solicitud de tarea en el sistema.

**Atributos:**
- `id`: Identificador único de la solicitud
- `title`: Título descriptivo de la solicitud
- `description`: Descripción detallada de la solicitud
- `category`: Categoría a la que pertenece la solicitud
- `priority`: Nivel de prioridad de la solicitud
- `dueDate`: Fecha límite para completar la tarea solicitada
- `status`: Estado actual de la solicitud
- `requesterId`: Identificador del usuario que creó la solicitud
- `assignerId`: Identificador del usuario asignador que procesó la solicitud
- `requestDate`: Fecha en que se creó la solicitud
- `assignmentDate`: Fecha en que se asignó la solicitud
- `notes`: Notas adicionales de la solicitud
- `attachments`: Lista de archivos adjuntos a la solicitud
- `comments`: Lista de comentarios de la solicitud

**Métodos principales:**
- `assign(Long assignerId)`: Asigna la solicitud a un usuario asignador
- `complete()`: Marca la solicitud como completada
- `cancel()`: Cancela la solicitud
- `addComment(TaskRequestComment comment)`: Añade un comentario a la solicitud
- `addAttachment(TaskRequestAttachment attachment)`: Añade un archivo adjunto a la solicitud

### TaskRequestCategory

Representa una categoría para las solicitudes de tareas.

**Atributos:**
- `id`: Identificador único de la categoría
- `name`: Nombre de la categoría
- `description`: Descripción de la categoría
- `color`: Color asociado a la categoría (en formato hexadecimal)
- `isDefault`: Indica si esta es la categoría por defecto

### TaskRequestComment

Representa un comentario en una solicitud de tarea.

**Atributos:**
- `id`: Identificador único del comentario
- `taskRequestId`: Identificador de la solicitud a la que pertenece este comentario
- `userId`: Identificador del usuario que creó el comentario
- `content`: Contenido del comentario
- `createdAt`: Fecha y hora de creación del comentario

### TaskRequestAttachment

Representa un archivo adjunto en una solicitud de tarea.

**Atributos:**
- `id`: Identificador único del archivo adjunto
- `taskRequestId`: Identificador de la solicitud a la que pertenece este archivo adjunto
- `userId`: Identificador del usuario que subió el archivo
- `fileName`: Nombre del archivo
- `fileType`: Tipo MIME del archivo
- `filePath`: Ruta donde se almacena el archivo
- `fileSize`: Tamaño del archivo en bytes
- `uploadedAt`: Fecha y hora en que se subió el archivo

## Enumeraciones

### TaskRequestStatus

Representa los posibles estados de una solicitud de tarea.

**Valores:**
- `DRAFT`: Borrador - La solicitud está siendo creada y aún no ha sido enviada
- `SUBMITTED`: Enviada - La solicitud ha sido enviada al asignador pero aún no ha sido procesada
- `ASSIGNED`: Asignada - La solicitud ha sido procesada por el asignador y asignada a un ejecutor
- `COMPLETED`: Completada - La tarea solicitada ha sido completada
- `CANCELLED`: Cancelada - La solicitud ha sido cancelada y no será procesada

### TaskRequestPriority

Representa los niveles de prioridad para las solicitudes de tareas.

**Valores:**
- `CRITICAL`: Crítica - Máxima prioridad, requiere atención inmediata
- `HIGH`: Alta - Prioridad elevada, debe ser atendida lo antes posible
- `MEDIUM`: Media - Prioridad estándar, debe ser atendida en tiempo razonable
- `LOW`: Baja - Prioridad reducida, puede esperar si hay tareas más importantes
- `TRIVIAL`: Trivial - Mínima prioridad, puede ser atendida cuando no haya otras tareas pendientes

## Reglas de Negocio

1. Una solicitud solo puede ser asignada si está en estado `SUBMITTED`
2. Una solicitud solo puede ser completada si está en estado `ASSIGNED`
3. Una solicitud no puede ser cancelada si ya está en estado `COMPLETED` o `CANCELLED`
4. Solo el usuario que creó la solicitud puede cancelarla
5. Toda solicitud debe tener un título y un solicitante
6. La fecha de solicitud se establece automáticamente al crear la solicitud
7. La fecha de asignación se establece automáticamente al asignar la solicitud
8. Si no se especifica una categoría, se utiliza la categoría por defecto
9. Si no se especifica una prioridad, se utiliza la prioridad `MEDIUM`
10. Si no se especifica un estado al crear una solicitud, se utiliza el estado `DRAFT`

## Flujo de Trabajo

1. Un usuario (solicitante) crea una solicitud en estado `DRAFT`
2. El solicitante completa la información y envía la solicitud, cambiando su estado a `SUBMITTED`
3. Un usuario asignador recibe la solicitud y la asigna a un ejecutor, cambiando su estado a `ASSIGNED`
4. El ejecutor completa la tarea solicitada y marca la solicitud como completada, cambiando su estado a `COMPLETED`
5. En cualquier momento antes de completarse, el solicitante puede cancelar la solicitud, cambiando su estado a `CANCELLED`

## Interfaces de Repositorio

### TaskRequestRepository

Define las operaciones de persistencia para la entidad `TaskRequest`.

**Métodos principales:**
- `save(TaskRequest taskRequest)`: Guarda una solicitud de tarea
- `findById(Long id)`: Busca una solicitud por su ID
- `findAll(int page, int size)`: Busca todas las solicitudes con paginación
- `findByRequesterId(Long requesterId, int page, int size)`: Busca solicitudes por el ID del solicitante
- `findByAssignerId(Long assignerId, int page, int size)`: Busca solicitudes por el ID del asignador
- `findByStatus(TaskRequestStatus status, int page, int size)`: Busca solicitudes por estado

### TaskRequestCategoryRepository

Define las operaciones de persistencia para la entidad `TaskRequestCategory`.

**Métodos principales:**
- `save(TaskRequestCategory category)`: Guarda una categoría de solicitud
- `findById(Long id)`: Busca una categoría por su ID
- `findAll()`: Busca todas las categorías
- `findDefault()`: Busca la categoría por defecto
- `findByNameContaining(String name)`: Busca categorías por nombre (coincidencia parcial)

## Interfaces de Servicio

### TaskRequestService

Define las operaciones de negocio para la entidad `TaskRequest`.

**Métodos principales:**
- `createDraft(TaskRequest taskRequest)`: Crea una nueva solicitud de tarea en estado DRAFT
- `submit(Long id, Long requesterId)`: Envía una solicitud de tarea, cambiando su estado de DRAFT a SUBMITTED
- `assign(Long id, Long assignerId)`: Asigna una solicitud de tarea a un asignador
- `complete(Long id)`: Marca una solicitud como completada
- `cancel(Long id, Long requesterId)`: Cancela una solicitud
- `addComment(Long id, TaskRequestComment comment)`: Añade un comentario a una solicitud

### TaskRequestCategoryService

Define las operaciones de negocio para la entidad `TaskRequestCategory`.

**Métodos principales:**
- `create(TaskRequestCategory category)`: Crea una nueva categoría de solicitud
- `update(Long id, TaskRequestCategory category)`: Actualiza una categoría existente
- `setAsDefault(Long id)`: Establece una categoría como la categoría por defecto
- `findById(Long id)`: Busca una categoría por su ID
- `findAll()`: Busca todas las categorías
- `findDefault()`: Busca la categoría por defecto
