# API de Actividades - Documentación

## Descripción

La API de Actividades permite gestionar las actividades del sistema, incluyendo la creación, edición, visualización y eliminación de actividades.

## Endpoints

### Obtener todas las actividades

```
GET /api/activities
```

Parámetros de consulta:
- `page`: Número de página (por defecto: 0)
- `size`: Tamaño de página (por defecto: 10)
- `sort`: Campo y dirección de ordenamiento (por defecto: "createdAt,desc")
- `type`: Filtrar por tipo de actividad (opcional)
- `status`: Filtrar por estado de actividad (opcional)
- `startDate`: Filtrar por fecha de inicio (formato: yyyy-MM-dd) (opcional)
- `endDate`: Filtrar por fecha de fin (formato: yyyy-MM-dd) (opcional)
- `search`: Buscar por texto en descripción, persona, rol, dependencia, situación o resultado (opcional)

Respuesta:
```json
{
  "activities": [
    {
      "id": 1,
      "date": "2025-04-15T10:30:00",
      "type": "OTRO",
      "description": "Atención a Juan Pérez por consulta sobre expediente 123/2025",
      "person": "Juan Pérez",
      "role": "Abogado",
      "dependency": "Estudio Jurídico ABC",
      "situation": "El solicitante requiere información sobre el estado actual del expediente 123/2025 relacionado con un trámite administrativo.",
      "result": "Se proporcionó la información solicitada y se indicó que el expediente se encuentra en revisión por el departamento legal.",
      "status": "COMPLETADA",
      "lastStatusChangeDate": "2025-04-15T11:45:00",
      "comments": "El solicitante quedó conforme con la información proporcionada.",
      "agent": "Administrador Sistema",
      "createdAt": "2025-04-15T10:30:00",
      "updatedAt": "2025-04-15T11:45:00"
    }
  ],
  "totalCount": 1
}
```

### Obtener una actividad por ID

```
GET /api/activities/{id}
```

Respuesta:
```json
{
  "id": 1,
  "date": "2025-04-15T10:30:00",
  "type": "OTRO",
  "description": "Atención a Juan Pérez por consulta sobre expediente 123/2025",
  "person": "Juan Pérez",
  "role": "Abogado",
  "dependency": "Estudio Jurídico ABC",
  "situation": "El solicitante requiere información sobre el estado actual del expediente 123/2025 relacionado con un trámite administrativo.",
  "result": "Se proporcionó la información solicitada y se indicó que el expediente se encuentra en revisión por el departamento legal.",
  "status": "COMPLETADA",
  "lastStatusChangeDate": "2025-04-15T11:45:00",
  "comments": "El solicitante quedó conforme con la información proporcionada.",
  "agent": "Administrador Sistema",
  "createdAt": "2025-04-15T10:30:00",
  "updatedAt": "2025-04-15T11:45:00"
}
```

### Crear una nueva actividad

```
POST /api/activities
```

Cuerpo de la solicitud:
```json
{
  "date": "2025-04-19T09:00:00",
  "type": "REUNION",
  "description": "Reunión con equipo de desarrollo",
  "person": "Equipo de desarrollo",
  "role": "Desarrolladores",
  "dependency": "Departamento de IT",
  "situation": "Planificación de sprint",
  "result": "Se definieron las tareas para el próximo sprint",
  "status": "COMPLETADA",
  "comments": "Todos los miembros del equipo participaron activamente"
}
```

Respuesta:
```json
{
  "id": 9,
  "date": "2025-04-19T09:00:00",
  "type": "REUNION",
  "description": "Reunión con equipo de desarrollo",
  "person": "Equipo de desarrollo",
  "role": "Desarrolladores",
  "dependency": "Departamento de IT",
  "situation": "Planificación de sprint",
  "result": "Se definieron las tareas para el próximo sprint",
  "status": "COMPLETADA",
  "lastStatusChangeDate": "2025-04-19T09:00:00",
  "comments": "Todos los miembros del equipo participaron activamente",
  "agent": "Usuario actual",
  "createdAt": "2025-04-19T09:00:00",
  "updatedAt": "2025-04-19T09:00:00"
}
```

### Actualizar una actividad existente

```
PUT /api/activities/{id}
```

Cuerpo de la solicitud:
```json
{
  "description": "Reunión con equipo de desarrollo (actualizada)",
  "status": "EN_PROGRESO",
  "result": "Se definieron las tareas para el próximo sprint y se asignaron responsables"
}
```

Respuesta:
```json
{
  "id": 9,
  "date": "2025-04-19T09:00:00",
  "type": "REUNION",
  "description": "Reunión con equipo de desarrollo (actualizada)",
  "person": "Equipo de desarrollo",
  "role": "Desarrolladores",
  "dependency": "Departamento de IT",
  "situation": "Planificación de sprint",
  "result": "Se definieron las tareas para el próximo sprint y se asignaron responsables",
  "status": "EN_PROGRESO",
  "lastStatusChangeDate": "2025-04-19T10:30:00",
  "comments": "Todos los miembros del equipo participaron activamente",
  "agent": "Usuario actual",
  "createdAt": "2025-04-19T09:00:00",
  "updatedAt": "2025-04-19T10:30:00"
}
```

### Eliminar una actividad

```
DELETE /api/activities/{id}
```

Respuesta:
- Código de estado: 204 No Content

## Tipos de Actividad

Los tipos de actividad disponibles son:
- `REUNION`: Reuniones con personas o equipos
- `LLAMADA`: Llamadas telefónicas
- `CORREO`: Comunicaciones por correo electrónico
- `DOCUMENTO`: Trabajo con documentos
- `OTRO`: Otros tipos de actividades

## Estados de Actividad

Los estados de actividad disponibles son:
- `PENDIENTE`: Actividad pendiente de realizar
- `EN_PROGRESO`: Actividad en curso
- `COMPLETADA`: Actividad finalizada
- `CANCELADA`: Actividad cancelada

## Seguridad

La API de Actividades requiere autenticación mediante token JWT. Los siguientes permisos son necesarios para acceder a los endpoints:

- `READ_ACTIVITIES`: Para obtener actividades (GET)
- `WRITE_ACTIVITIES`: Para crear y actualizar actividades (POST, PUT)
- `DELETE_ACTIVITIES`: Para eliminar actividades (DELETE)

## Errores

La API puede devolver los siguientes códigos de error:

- `400 Bad Request`: Solicitud incorrecta (por ejemplo, datos inválidos)
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No autorizado (falta de permisos)
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error interno del servidor

## Ejemplos de uso

### Curl

```bash
# Obtener todas las actividades
curl -X GET "http://localhost:8080/api/activities?page=0&size=10" -H "Authorization: Bearer {token}"

# Obtener una actividad por ID
curl -X GET "http://localhost:8080/api/activities/1" -H "Authorization: Bearer {token}"

# Crear una nueva actividad
curl -X POST "http://localhost:8080/api/activities" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-04-19T09:00:00",
    "type": "REUNION",
    "description": "Reunión con equipo de desarrollo",
    "status": "COMPLETADA"
  }'

# Actualizar una actividad existente
curl -X PUT "http://localhost:8080/api/activities/9" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Reunión con equipo de desarrollo (actualizada)",
    "status": "EN_PROGRESO"
  }'

# Eliminar una actividad
curl -X DELETE "http://localhost:8080/api/activities/9" -H "Authorization: Bearer {token}"
```

### JavaScript (Fetch API)

```javascript
// Obtener todas las actividades
fetch('http://localhost:8080/api/activities?page=0&size=10', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));

// Crear una nueva actividad
fetch('http://localhost:8080/api/activities', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date: '2025-04-19T09:00:00',
    type: 'REUNION',
    description: 'Reunión con equipo de desarrollo',
    status: 'COMPLETADA'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```
