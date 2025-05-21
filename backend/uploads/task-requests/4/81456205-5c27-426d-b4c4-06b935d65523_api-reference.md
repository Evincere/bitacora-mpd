# Referencia de la API - Bitácora MPD

## Introducción

La API de Bitácora MPD proporciona acceso programático a las funcionalidades de la plataforma de gestión de actividades del Ministerio Público de la Defensa. Esta API sigue los principios REST y utiliza JSON como formato de intercambio de datos.

## Base URL

- **Desarrollo**: `http://localhost:8080/api`
- **Producción**: `https://api.mpd.gov.ar`

## Autenticación

La API utiliza autenticación basada en tokens JWT (JSON Web Tokens). Para acceder a los endpoints protegidos, se debe incluir el token en el encabezado `Authorization` de la solicitud:

```
Authorization: Bearer <token>
```

### Obtener un token

**Endpoint**: `POST /auth/login`

**Descripción**: Autentica al usuario y devuelve un token JWT.

**Cuerpo de la solicitud**:
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

**Respuesta exitosa** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "username": "usuario",
  "email": "usuario@mpd.gov.ar",
  "fullName": "Nombre Completo",
  "role": "USUARIO",
  "permissions": ["READ_ACTIVITIES", "CREATE_ACTIVITIES"]
}
```

## Actividades

### Listar actividades

**Endpoint**: `GET /activities`

**Descripción**: Obtiene una lista paginada de actividades.

**Parámetros de consulta**:
- `page` (opcional): Número de página (por defecto: 0)
- `size` (opcional): Tamaño de página (por defecto: 10)
- `type` (opcional): Filtrar por tipo de actividad
- `status` (opcional): Filtrar por estado de actividad
- `startDate` (opcional): Filtrar por fecha de inicio (formato: YYYY-MM-DD)
- `endDate` (opcional): Filtrar por fecha de fin (formato: YYYY-MM-DD)
- `search` (opcional): Buscar por texto en descripción o persona

**Respuesta exitosa** (200 OK):
```json
{
  "activities": [
    {
      "id": 1,
      "date": "2023-04-15T10:30:00",
      "type": "REUNION",
      "description": "Reunión con el equipo",
      "person": "Juan Pérez",
      "role": "Coordinador",
      "dependency": "Área Técnica",
      "situation": "Planificación de proyecto",
      "result": "Se definieron los próximos pasos",
      "status": "COMPLETADA",
      "lastStatusChangeDate": "2023-04-15T14:00:00",
      "comments": "Reunión productiva",
      "agent": "María López",
      "createdAt": "2023-04-15T09:00:00",
      "updatedAt": "2023-04-15T14:00:00",
      "userId": 1
    },
    // Más actividades...
  ],
  "totalCount": 42,
  "totalPages": 5,
  "currentPage": 0
}
```

### Obtener una actividad

**Endpoint**: `GET /activities/{id}`

**Descripción**: Obtiene los detalles de una actividad específica.

**Parámetros de ruta**:
- `id`: ID de la actividad

**Respuesta exitosa** (200 OK):
```json
{
  "id": 1,
  "date": "2023-04-15T10:30:00",
  "type": "REUNION",
  "description": "Reunión con el equipo",
  "person": "Juan Pérez",
  "role": "Coordinador",
  "dependency": "Área Técnica",
  "situation": "Planificación de proyecto",
  "result": "Se definieron los próximos pasos",
  "status": "COMPLETADA",
  "lastStatusChangeDate": "2023-04-15T14:00:00",
  "comments": "Reunión productiva",
  "agent": "María López",
  "createdAt": "2023-04-15T09:00:00",
  "updatedAt": "2023-04-15T14:00:00",
  "userId": 1
}
```

### Crear una actividad

**Endpoint**: `POST /activities`

**Descripción**: Crea una nueva actividad.

**Cuerpo de la solicitud**:
```json
{
  "date": "2023-04-15T10:30:00",
  "type": "REUNION",
  "description": "Reunión con el equipo",
  "person": "Juan Pérez",
  "role": "Coordinador",
  "dependency": "Área Técnica",
  "situation": "Planificación de proyecto",
  "result": "Se definieron los próximos pasos",
  "status": "COMPLETADA",
  "comments": "Reunión productiva",
  "agent": "María López"
}
```

**Respuesta exitosa** (201 Created):
```json
{
  "id": 1,
  "date": "2023-04-15T10:30:00",
  "type": "REUNION",
  "description": "Reunión con el equipo",
  "person": "Juan Pérez",
  "role": "Coordinador",
  "dependency": "Área Técnica",
  "situation": "Planificación de proyecto",
  "result": "Se definieron los próximos pasos",
  "status": "COMPLETADA",
  "lastStatusChangeDate": "2023-04-15T14:00:00",
  "comments": "Reunión productiva",
  "agent": "María López",
  "createdAt": "2023-04-15T14:00:00",
  "updatedAt": "2023-04-15T14:00:00",
  "userId": 1
}
```

### Actualizar una actividad

**Endpoint**: `PUT /activities/{id}`

**Descripción**: Actualiza una actividad existente.

**Parámetros de ruta**:
- `id`: ID de la actividad

**Cuerpo de la solicitud**:
```json
{
  "date": "2023-04-15T10:30:00",
  "type": "REUNION",
  "description": "Reunión con el equipo de desarrollo",
  "person": "Juan Pérez",
  "role": "Coordinador",
  "dependency": "Área Técnica",
  "situation": "Planificación de proyecto",
  "result": "Se definieron los próximos pasos y responsables",
  "status": "COMPLETADA",
  "comments": "Reunión muy productiva",
  "agent": "María López"
}
```

**Respuesta exitosa** (200 OK):
```json
{
  "id": 1,
  "date": "2023-04-15T10:30:00",
  "type": "REUNION",
  "description": "Reunión con el equipo de desarrollo",
  "person": "Juan Pérez",
  "role": "Coordinador",
  "dependency": "Área Técnica",
  "situation": "Planificación de proyecto",
  "result": "Se definieron los próximos pasos y responsables",
  "status": "COMPLETADA",
  "lastStatusChangeDate": "2023-04-15T14:00:00",
  "comments": "Reunión muy productiva",
  "agent": "María López",
  "createdAt": "2023-04-15T09:00:00",
  "updatedAt": "2023-04-15T15:30:00",
  "userId": 1
}
```

### Eliminar una actividad

**Endpoint**: `DELETE /activities/{id}`

**Descripción**: Elimina una actividad.

**Parámetros de ruta**:
- `id`: ID de la actividad

**Respuesta exitosa** (204 No Content)

## Usuarios

### Listar usuarios

**Endpoint**: `GET /users`

**Descripción**: Obtiene una lista paginada de usuarios.

**Parámetros de consulta**:
- `page` (opcional): Número de página (por defecto: 0)
- `size` (opcional): Tamaño de página (por defecto: 10)
- `role` (opcional): Filtrar por rol
- `active` (opcional): Filtrar por estado (true/false)
- `search` (opcional): Buscar por nombre, apellido o email

**Respuesta exitosa** (200 OK):
```json
{
  "users": [
    {
      "id": 1,
      "username": "jperez",
      "email": "jperez@mpd.gov.ar",
      "firstName": "Juan",
      "lastName": "Pérez",
      "fullName": "Juan Pérez",
      "role": "ADMIN",
      "position": "Coordinador",
      "department": "Sistemas",
      "active": true,
      "createdAt": "2023-01-15T09:00:00",
      "updatedAt": "2023-04-15T14:00:00",
      "permissions": ["READ_ACTIVITIES", "CREATE_ACTIVITIES", "MANAGE_USERS"]
    },
    // Más usuarios...
  ],
  "totalCount": 15,
  "totalPages": 2,
  "currentPage": 0
}
```

### Obtener un usuario

**Endpoint**: `GET /users/{id}`

**Descripción**: Obtiene los detalles de un usuario específico.

**Parámetros de ruta**:
- `id`: ID del usuario

**Respuesta exitosa** (200 OK):
```json
{
  "id": 1,
  "username": "jperez",
  "email": "jperez@mpd.gov.ar",
  "firstName": "Juan",
  "lastName": "Pérez",
  "fullName": "Juan Pérez",
  "role": "ADMIN",
  "position": "Coordinador",
  "department": "Sistemas",
  "active": true,
  "createdAt": "2023-01-15T09:00:00",
  "updatedAt": "2023-04-15T14:00:00",
  "permissions": ["READ_ACTIVITIES", "CREATE_ACTIVITIES", "MANAGE_USERS"]
}
```

### Crear un usuario

**Endpoint**: `POST /users`

**Descripción**: Crea un nuevo usuario.

**Cuerpo de la solicitud**:
```json
{
  "username": "mlopez",
  "password": "contraseña_segura",
  "email": "mlopez@mpd.gov.ar",
  "firstName": "María",
  "lastName": "López",
  "role": "USUARIO",
  "position": "Analista",
  "department": "Legales",
  "permissions": ["READ_ACTIVITIES", "CREATE_ACTIVITIES"]
}
```

**Respuesta exitosa** (201 Created):
```json
{
  "id": 2,
  "username": "mlopez",
  "email": "mlopez@mpd.gov.ar",
  "firstName": "María",
  "lastName": "López",
  "fullName": "María López",
  "role": "USUARIO",
  "position": "Analista",
  "department": "Legales",
  "active": true,
  "createdAt": "2023-04-15T16:00:00",
  "updatedAt": "2023-04-15T16:00:00",
  "permissions": ["READ_ACTIVITIES", "CREATE_ACTIVITIES"]
}
```

### Actualizar un usuario

**Endpoint**: `PUT /users/{id}`

**Descripción**: Actualiza un usuario existente.

**Parámetros de ruta**:
- `id`: ID del usuario

**Cuerpo de la solicitud**:
```json
{
  "email": "mlopez@mpd.gov.ar",
  "firstName": "María",
  "lastName": "López",
  "role": "SUPERVISOR",
  "position": "Coordinadora",
  "department": "Legales",
  "active": true,
  "permissions": ["READ_ACTIVITIES", "CREATE_ACTIVITIES", "APPROVE_ACTIVITIES"]
}
```

**Respuesta exitosa** (200 OK):
```json
{
  "id": 2,
  "username": "mlopez",
  "email": "mlopez@mpd.gov.ar",
  "firstName": "María",
  "lastName": "López",
  "fullName": "María López",
  "role": "SUPERVISOR",
  "position": "Coordinadora",
  "department": "Legales",
  "active": true,
  "createdAt": "2023-04-15T16:00:00",
  "updatedAt": "2023-04-15T17:30:00",
  "permissions": ["READ_ACTIVITIES", "CREATE_ACTIVITIES", "APPROVE_ACTIVITIES"]
}
```

### Cambiar contraseña

**Endpoint**: `PUT /users/{id}/password`

**Descripción**: Cambia la contraseña de un usuario.

**Parámetros de ruta**:
- `id`: ID del usuario

**Cuerpo de la solicitud**:
```json
{
  "currentPassword": "contraseña_actual",
  "newPassword": "nueva_contraseña"
}
```

**Respuesta exitosa** (204 No Content)

## Reportes

### Obtener estadísticas

**Endpoint**: `GET /reports/statistics`

**Descripción**: Obtiene estadísticas generales de actividades.

**Parámetros de consulta**:
- `startDate` (opcional): Fecha de inicio (formato: YYYY-MM-DD)
- `endDate` (opcional): Fecha de fin (formato: YYYY-MM-DD)
- `userId` (opcional): Filtrar por usuario

**Respuesta exitosa** (200 OK):
```json
{
  "totalActivities": 120,
  "completedActivities": 95,
  "pendingActivities": 25,
  "byType": {
    "REUNION": 45,
    "AUDIENCIA": 30,
    "ENTREVISTA": 25,
    "INVESTIGACION": 15,
    "DICTAMEN": 5
  },
  "byMonth": {
    "2023-01": 15,
    "2023-02": 18,
    "2023-03": 22,
    "2023-04": 30,
    "2023-05": 35
  }
}
```

### Generar reporte

**Endpoint**: `GET /reports/generate`

**Descripción**: Genera un reporte de actividades en formato PDF o Excel.

**Parámetros de consulta**:
- `format` (obligatorio): Formato del reporte (PDF o EXCEL)
- `startDate` (opcional): Fecha de inicio (formato: YYYY-MM-DD)
- `endDate` (opcional): Fecha de fin (formato: YYYY-MM-DD)
- `type` (opcional): Filtrar por tipo de actividad
- `userId` (opcional): Filtrar por usuario

**Respuesta exitosa** (200 OK):
Archivo binario con el reporte en el formato solicitado.

## Códigos de Estado

La API utiliza los siguientes códigos de estado HTTP:

- `200 OK`: La solicitud se completó correctamente
- `201 Created`: El recurso se creó correctamente
- `204 No Content`: La solicitud se completó correctamente pero no hay contenido para devolver
- `400 Bad Request`: La solicitud contiene datos inválidos
- `401 Unauthorized`: No se proporcionó un token válido
- `403 Forbidden`: El token es válido pero no tiene permisos suficientes
- `404 Not Found`: El recurso solicitado no existe
- `409 Conflict`: La solicitud no se puede completar debido a un conflicto
- `500 Internal Server Error`: Error interno del servidor

## Manejo de Errores

Cuando ocurre un error, la API devuelve una respuesta con el siguiente formato:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Datos inválidos",
  "path": "/api/activities",
  "timestamp": "2023-04-15T14:00:00",
  "details": [
    "El campo 'type' es obligatorio",
    "El campo 'description' no puede estar vacío"
  ]
}
```

## Paginación

Las respuestas paginadas incluyen los siguientes campos:

- `totalCount`: Número total de elementos
- `totalPages`: Número total de páginas
- `currentPage`: Página actual (comenzando desde 0)

## Limitaciones

- Máximo 100 elementos por página
- Máximo 10 solicitudes por segundo por IP
- Tamaño máximo de carga: 10MB

## Versiones de la API

La versión actual de la API es v1. La versión se especifica en el encabezado `Accept` de la solicitud:

```
Accept: application/json;version=1
```

## Soporte

Para obtener ayuda con la API, contacte a:

- Email: api-support@mpd.gov.ar
- Teléfono: +54 11 1234-5678
