# Módulo de Actividades - Documentación

> **Nota**: La documentación completa del módulo de actividades se ha integrado en el [README principal](../README.md#módulo-de-actividades).

## Descripción

El módulo de actividades permite gestionar las actividades del sistema, incluyendo la creación, edición, visualización y eliminación de actividades.

## Configuración

El módulo está configurado para funcionar tanto con el backend real como con un servicio simulado cuando el backend no está disponible o no tiene implementado el endpoint correspondiente.

### Variables de entorno

El comportamiento del módulo se puede configurar mediante las siguientes variables de entorno:

- `VITE_API_URL`: URL base de la API. Si se deja vacío, se utilizará el proxy de Vite configurado en `vite.config.js`.
- `VITE_USE_MOCK_DATA`: Si se establece en `true`, se utilizará el servicio simulado para las actividades.

## Servicio simulado

El servicio simulado (`mockService.js`) proporciona datos de prueba para el desarrollo y pruebas cuando el backend no está disponible. Incluye las siguientes funcionalidades:

- Generación de datos aleatorios para actividades
- Implementación de todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
- Simulación de latencia de red para una experiencia más realista
- Filtrado y paginación de actividades

## Componentes principales

- `Activities.tsx`: Componente principal que muestra la lista de actividades
- `ActivityForm.tsx`: Formulario para crear y editar actividades
- `ActivityList.tsx` y `ActivityGrid.tsx`: Componentes para mostrar las actividades en formato lista o cuadrícula
- `ActivityFilters.tsx`: Componente para filtrar actividades

## Flujo de datos

1. El componente `Activities.tsx` utiliza el hook `useActivities` para obtener los datos
2. El hook `useActivities` utiliza el servicio `activitiesService.ts` para hacer las peticiones
3. El servicio `activitiesService.ts` decide si usar el backend real o el servicio simulado según la configuración
4. Si se usa el backend real, se hacen peticiones a la API mediante `api-ky.ts`
5. Si se usa el servicio simulado, se utilizan los datos generados en `mockService.js`

## Manejo de errores

El módulo incluye un manejo robusto de errores:

- **Errores de conexión**: Cuando no se puede conectar con el backend
  - Muestra un mensaje claro indicando que no se pudo conectar con el servidor
  - Sugiere verificar la conexión a internet o que el servidor esté en funcionamiento
  - En modo desarrollo, utiliza automáticamente datos simulados como fallback

- **Errores del servidor**: Cuando el backend devuelve un error 500
  - Muestra un mensaje indicando que hubo un error interno del servidor
  - Proporciona información adicional en la consola para ayudar en la depuración
  - En modo desarrollo, utiliza automáticamente datos simulados como fallback

- **Errores de autenticación**: Cuando el usuario no está autenticado (401) o no tiene permisos (403)
  - Muestra un mensaje claro indicando que no tiene permisos para acceder al recurso
  - Sugiere iniciar sesión nuevamente

- **Errores de datos**: Cuando no hay datos que mostrar (404)
  - Muestra un mensaje informativo indicando que no se encontraron actividades
  - Sugiere que puede que no haya actividades registradas

- **Errores de validación**: Cuando los datos enviados son inválidos (400)
  - Muestra un mensaje indicando que los datos son inválidos
  - Proporciona detalles de validación en la consola

Todos los mensajes de error se muestran en un banner informativo con un icono y color apropiados según el tipo de error.

## Implementación del backend

Para que el módulo funcione con el backend real, es necesario implementar los siguientes endpoints:

- `GET /api/activities`: Obtener actividades con paginación y filtros
- `GET /api/activities/{id}`: Obtener una actividad por su ID
- `POST /api/activities`: Crear una nueva actividad
- `PUT /api/activities/{id}`: Actualizar una actividad existente
- `DELETE /api/activities/{id}`: Eliminar una actividad

El controlador `ActivityController.java` ya está implementado en el backend, pero no está funcionando correctamente. Es necesario revisar la configuración del backend para asegurarse de que los endpoints estén correctamente mapeados.

## Solución de problemas

### El frontend muestra "Estás viendo datos simulados"

Esto indica que el frontend está utilizando el servicio simulado porque no puede conectar con el backend. Posibles soluciones:

1. Verificar que el backend esté en ejecución
   - Ejecutar `cd backend && ./mvnw spring-boot:run` para iniciar el backend
   - Verificar que el servidor esté escuchando en el puerto 8080

2. Verificar que el proxy de Vite esté correctamente configurado
   - Revisar el archivo `vite.config.js` y asegurarse de que el proxy esté configurado para redirigir `/api` a `http://localhost:8080`
   - Verificar que no haya errores en la consola del navegador relacionados con CORS

3. Verificar que el controlador `ActivityController.java` esté correctamente implementado
   - Revisar que esté anotado con `@RestController` y `@RequestMapping("/activities")`
   - Verificar que los métodos estén correctamente anotados con `@GetMapping`, `@PostMapping`, etc.

4. Verificar que la ruta `/api/activities` esté correctamente mapeada en el backend
   - Revisar el archivo `application.yml` y verificar que `server.servlet.context-path` esté configurado como `/api`
   - Probar la API directamente con herramientas como Postman o curl

### Error 500 al intentar acceder a las actividades

Esto indica que el backend está devolviendo un error interno. Posibles soluciones:

1. Verificar los logs del backend para identificar el error
   - Revisar la consola donde se ejecuta el backend
   - Buscar mensajes de error en los logs

2. Verificar que la base de datos esté correctamente configurada
   - Revisar el archivo `application.yml` y verificar la configuración de la base de datos
   - Verificar que las tablas necesarias existan en la base de datos

3. Verificar que el controlador `ActivityController.java` esté correctamente implementado
   - Revisar que los métodos estén manejando correctamente las excepciones
   - Verificar que los DTOs estén correctamente definidos

4. Verificar que el repositorio `ActivityRepository.java` esté correctamente implementado
   - Revisar que los métodos estén correctamente definidos
   - Verificar que las consultas SQL estén correctamente escritas

### No se muestran actividades

Esto puede deberse a varias razones:

1. No hay actividades en la base de datos
   - Verificar que la tabla `activities` tenga datos
   - Ejecutar consultas SQL directamente para verificar los datos

2. Los filtros aplicados no coinciden con ninguna actividad
   - Limpiar los filtros y volver a intentar
   - Verificar que los filtros estén correctamente implementados

3. El servicio simulado no está generando datos correctamente
   - Revisar el archivo `mockService.js` y verificar que esté generando datos
   - Verificar que la variable `USE_MOCK_SERVICE` esté configurada correctamente

4. El componente no está renderizando correctamente los datos
   - Verificar que el componente `Activities.tsx` esté correctamente implementado
   - Revisar la consola del navegador para ver si hay errores de JavaScript

## Configuración del entorno

### Variables de entorno

El comportamiento del módulo se puede configurar mediante las siguientes variables de entorno en el archivo `.env`:

```
# URL base de la API - dejar vacío para usar el proxy de Vite
VITE_API_URL=

# Puerto para el servidor de desarrollo
PORT=3000

# Habilitar el uso de datos simulados cuando el backend no está disponible
VITE_USE_MOCK_DATA=false
```

- `VITE_API_URL`: URL base de la API. Si se deja vacío, se utilizará el proxy de Vite configurado en `vite.config.js`.
- `VITE_USE_MOCK_DATA`: Si se establece en `true`, se utilizará el servicio simulado para las actividades, incluso si el backend está disponible.

### Proxy de Vite

El proxy de Vite está configurado en `vite.config.js` para redirigir las solicitudes a `/api` al backend en `http://localhost:8080`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

## Optimizaciones de Rendimiento

### Adaptadores de Datos

El módulo implementa un sistema de adaptadores de datos para manejar diferentes formatos de respuesta del backend:

1. **Adaptación de Respuestas**:
   - Se implementa un sistema que detecta automáticamente el formato de la respuesta del backend.
   - Soporta múltiples formatos: estándar (activities + totalCount), array simple, y respuesta paginada de Spring (content + totalElements).
   - Normaliza los datos a un formato común para garantizar la compatibilidad con los componentes de la interfaz.

2. **Validación y Normalización**:
   - Cada actividad recibida es validada para verificar que tenga los campos mínimos requeridos.
   - Se proporcionan valores por defecto para campos faltantes, evitando errores en la interfaz.
   - Se registran advertencias en la consola para actividades con formato inválido.

3. **Manejo de Errores Robusto**:
   - Se implementa un sistema de detección y recuperación de errores en la estructura de datos.
   - En caso de recibir datos con formato inesperado, se intenta adaptar al formato esperado.
   - Si la adaptación no es posible, se devuelve una estructura vacía para evitar errores en la interfaz.

### Caché y Reducción de Peticiones

El módulo implementa varias estrategias para optimizar el rendimiento y reducir las peticiones al servidor:

1. **Configuración Global de React Query**:
   - Se ha implementado un proveedor global de React Query con configuración optimizada para toda la aplicación.
   - `staleTime`: Los datos se consideran actualizados durante 5 minutos, evitando peticiones innecesarias.
   - `gcTime`: Los datos permanecen en caché durante 10 minutos, incluso después de que los componentes se desmonten.
   - `refetchOnMount: false`: No se realizan nuevas peticiones al montar el componente si los datos no están obsoletos.
   - `refetchOnWindowFocus: false`: No se realizan nuevas peticiones cuando la ventana recupera el foco.
   - `retry: 1`: Se limita a un solo reintento en caso de error para evitar múltiples peticiones fallidas.

2. **Sistema de Prevención de Peticiones Duplicadas**:
   - Se ha implementado un sistema de caché a nivel de servicio para evitar peticiones duplicadas.
   - Las peticiones idénticas que se realizan simultáneamente comparten la misma promesa.
   - Se utiliza un mapa de caché con claves únicas basadas en el método, URL y parámetros.
   - Las entradas de caché se eliminan automáticamente después de completarse la petición.

3. **Interceptor de Fetch Global**:
   - Se ha implementado un interceptor a nivel de `window.fetch` para evitar peticiones duplicadas en toda la aplicación.
   - Las peticiones GET idénticas se detectan y se reutiliza la promesa existente.
   - Se implementa un mecanismo de limpieza automática para evitar fugas de memoria.

4. **Debounce en Búsquedas**:
   - Se implementa un retraso de 500ms en las búsquedas para evitar peticiones mientras el usuario está escribiendo.
   - Solo se realiza la petición cuando el usuario deja de escribir durante el tiempo especificado.
   - Se utiliza un hook personalizado `useDebounce` para implementar esta funcionalidad.

5. **Referencias para Evitar Re-renderizados**:
   - Se utilizan referencias (`useRef`) para almacenar valores y evitar re-renderizados innecesarios.
   - Se comparan los valores actuales con los anteriores para evitar actualizaciones redundantes.
   - Se implementan parámetros estables para las claves de consulta de React Query.

6. **Detección Optimizada de Datos Simulados**:
   - La detección de datos simulados se realiza una sola vez por montaje del componente.
   - Se utiliza una referencia para evitar múltiples verificaciones.
   - Se implementa un mecanismo de timeout para evitar bloqueos en la detección.

## Próximos pasos

1. Implementar mejoras en la interfaz de usuario:
   - Añadir más opciones de filtrado
   - Implementar exportación de actividades a CSV o Excel
   - Mejorar la visualización de actividades con gráficos y estadísticas

2. Mejorar aún más el rendimiento:
   - Implementar virtualización para listas muy grandes
   - Optimizar las consultas a la base de datos con índices adicionales
   - Implementar carga progresiva de datos (infinite scroll)

3. Implementar pruebas automatizadas:
   - Pruebas unitarias para los componentes
   - Pruebas de integración para el flujo completo
   - Pruebas end-to-end con Cypress o Playwright

4. Mejorar la accesibilidad:
   - Asegurarse de que todos los componentes sean accesibles
   - Implementar navegación por teclado
   - Añadir etiquetas ARIA donde sea necesario
