# Guía de Usuario: Solicitudes de Tareas

## Introducción

El módulo de Solicitudes de Tareas permite a los usuarios solicitar la realización de tareas específicas, que serán asignadas y gestionadas por el equipo correspondiente. Este sistema facilita la comunicación y seguimiento de solicitudes entre diferentes roles de la organización.

## Roles y Permisos

El sistema de Solicitudes de Tareas utiliza los siguientes roles:

- **SOLICITANTE**: Usuarios que pueden crear y enviar solicitudes de tareas.
- **ASIGNADOR**: Usuario encargado de revisar las solicitudes enviadas y asignarlas.
- **EJECUTOR**: Usuarios que reciben las tareas asignadas y las completan.
- **ADMIN**: Administradores con acceso completo a todas las funcionalidades.

## Flujo de Trabajo

El flujo de trabajo de una solicitud de tarea es el siguiente:

1. **Creación**: Un SOLICITANTE crea una solicitud de tarea (estado DRAFT).
2. **Envío**: El SOLICITANTE envía la solicitud para su procesamiento (estado SUBMITTED).
3. **Asignación**: El ASIGNADOR revisa la solicitud y la asigna (estado ASSIGNED).
4. **Ejecución**: El EJECUTOR realiza la tarea solicitada.
5. **Finalización**: El EJECUTOR marca la solicitud como completada (estado COMPLETED).

En cualquier momento, el SOLICITANTE puede cancelar la solicitud (estado CANCELLED).

## Funcionalidades

### Para Solicitantes

#### Crear una Solicitud

1. Acceda a la sección "Mis Solicitudes" en el menú lateral.
2. Haga clic en el botón "Nueva Solicitud".
3. Complete el formulario con la información requerida:
   - **Título**: Un título descriptivo para la solicitud.
   - **Descripción**: Detalles de lo que se necesita.
   - **Categoría**: Seleccione la categoría que mejor se ajuste a su solicitud.
   - **Prioridad**: Indique la urgencia de la solicitud (Crítica, Alta, Media, Baja, Trivial).
   - **Fecha límite**: Fecha y hora para la que necesita que se complete la tarea.
   - **Notas adicionales**: Cualquier información adicional relevante.
4. Seleccione si desea guardar la solicitud como borrador o enviarla inmediatamente.
5. Haga clic en "Crear Solicitud".

#### Ver Mis Solicitudes

1. Acceda a la sección "Mis Solicitudes" en el menú lateral.
2. Verá una lista de todas sus solicitudes con información básica como título, estado, categoría y fecha.
3. Utilice los filtros disponibles para buscar solicitudes específicas.

#### Ver Detalles de una Solicitud

1. En la lista de solicitudes, haga clic en el botón "Ver detalles" de la solicitud que desea revisar.
2. Se mostrará una página con toda la información de la solicitud, incluyendo comentarios y archivos adjuntos.

#### Enviar una Solicitud en Borrador

1. Acceda a los detalles de la solicitud en estado DRAFT.
2. Haga clic en el botón "Enviar".
3. La solicitud cambiará al estado SUBMITTED y será visible para el asignador.

#### Cancelar una Solicitud

1. Acceda a los detalles de la solicitud que desea cancelar.
2. Haga clic en el botón "Cancelar".
3. Confirme la acción en el diálogo de confirmación.
4. La solicitud cambiará al estado CANCELLED.

#### Añadir Comentarios

1. Acceda a los detalles de la solicitud.
2. Desplácese hasta la sección de comentarios.
3. Escriba su comentario en el campo de texto.
4. Haga clic en "Añadir comentario".

### Para Asignadores

#### Ver Solicitudes Pendientes

1. Acceda a la sección "Solicitudes Enviadas" en el menú lateral.
2. Verá una lista de todas las solicitudes en estado SUBMITTED.

#### Asignar una Solicitud

1. Acceda a los detalles de la solicitud en estado SUBMITTED.
2. Revise la información de la solicitud.
3. Haga clic en el botón "Asignar".
4. La solicitud cambiará al estado ASSIGNED y estará lista para ser ejecutada.

#### Ver Estadísticas

1. Acceda a la sección "Estadísticas" en el menú lateral.
2. Verá gráficos y datos sobre las solicitudes, como distribución por estado, categoría, etc.

### Para Ejecutores

#### Ver Solicitudes Asignadas

1. Acceda a la sección "Solicitudes Asignadas" en el menú lateral.
2. Verá una lista de todas las solicitudes que le han sido asignadas.

#### Completar una Solicitud

1. Acceda a los detalles de la solicitud en estado ASSIGNED.
2. Una vez realizada la tarea, haga clic en el botón "Completar".
3. La solicitud cambiará al estado COMPLETED.

### Para Administradores

#### Gestionar Categorías

1. Acceda a la sección "Categorías" en el menú lateral.
2. Verá una lista de todas las categorías disponibles.
3. Puede crear nuevas categorías haciendo clic en "Nueva Categoría".
4. Puede editar o eliminar categorías existentes utilizando los botones correspondientes.
5. Puede establecer una categoría como predeterminada haciendo clic en el botón "Establecer como predeterminada".

#### Ver Todas las Solicitudes

1. Acceda a la sección "Todas las Solicitudes" en el menú lateral.
2. Verá una lista completa de todas las solicitudes en el sistema.
3. Utilice los filtros disponibles para buscar solicitudes específicas.

## Estados de las Solicitudes

- **DRAFT (Borrador)**: La solicitud está siendo creada y aún no ha sido enviada.
- **SUBMITTED (Enviada)**: La solicitud ha sido enviada al asignador pero aún no ha sido procesada.
- **ASSIGNED (Asignada)**: La solicitud ha sido procesada por el asignador y asignada a un ejecutor.
- **COMPLETED (Completada)**: La tarea solicitada ha sido completada.
- **CANCELLED (Cancelada)**: La solicitud ha sido cancelada y no será procesada.

## Prioridades

- **CRITICAL (Crítica)**: Máxima prioridad, requiere atención inmediata.
- **HIGH (Alta)**: Prioridad elevada, debe ser atendida lo antes posible.
- **MEDIUM (Media)**: Prioridad estándar, debe ser atendida en tiempo razonable.
- **LOW (Baja)**: Prioridad reducida, puede esperar si hay tareas más importantes.
- **TRIVIAL (Trivial)**: Mínima prioridad, puede ser atendida cuando no haya otras tareas pendientes.

## Consejos y Mejores Prácticas

1. **Títulos descriptivos**: Utilice títulos claros y concisos que describan la tarea solicitada.
2. **Descripciones detalladas**: Proporcione toda la información necesaria para que la tarea pueda ser completada correctamente.
3. **Prioridad adecuada**: Asigne la prioridad correcta a su solicitud. No todas las solicitudes son críticas o urgentes.
4. **Comentarios**: Utilice los comentarios para proporcionar información adicional o aclaraciones.
5. **Seguimiento**: Revise regularmente el estado de sus solicitudes para estar al tanto de su progreso.

## Solución de Problemas

### No puedo crear una solicitud

- Verifique que tiene el rol de SOLICITANTE.
- Asegúrese de completar todos los campos obligatorios en el formulario.

### No puedo ver mis solicitudes

- Verifique que está en la sección "Mis Solicitudes".
- Compruebe su conexión a internet.
- Intente actualizar la página.

### No puedo asignar una solicitud

- Verifique que tiene el rol de ASIGNADOR.
- Asegúrese de que la solicitud está en estado SUBMITTED.

### No puedo completar una solicitud

- Verifique que tiene el rol de EJECUTOR.
- Asegúrese de que la solicitud está en estado ASSIGNED.

## Contacto y Soporte

Si tiene problemas o dudas sobre el uso del sistema de Solicitudes de Tareas, contacte al administrador del sistema o al equipo de soporte técnico.
