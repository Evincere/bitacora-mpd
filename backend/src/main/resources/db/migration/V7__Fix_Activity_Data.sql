-- V7__Fix_Activity_Data.sql
-- Migración para corregir datos en la tabla de actividades

-- Asegurarse de que todos los tipos de actividad sean válidos
UPDATE activities
SET type = 'REUNION'
WHERE type IS NULL OR type NOT IN ('REUNION', 'AUDIENCIA', 'ENTREVISTA', 'INVESTIGACION', 'DICTAMEN', 'OTRO');

-- Asegurarse de que todos los estados de actividad sean válidos
UPDATE activities
SET status = 'PENDIENTE'
WHERE status IS NULL OR status NOT IN (
    'PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA', 'ARCHIVADA',
    'REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'APPROVED', 'REJECTED', 'CANCELLED'
);

-- Asegurarse de que todas las actividades tengan una fecha
UPDATE activities
SET date = CURRENT_TIMESTAMP
WHERE date IS NULL;

-- Asegurarse de que todas las actividades tengan una descripción
UPDATE activities
SET description = 'Sin descripción'
WHERE description IS NULL OR description = '';

-- Insertar actividades de ejemplo si no hay ninguna
INSERT INTO activities (
    date, type, description, person, role, dependency, situation, result, status, 
    last_status_change_date, comments, agent, created_at, updated_at, user_id
)
SELECT 
    CURRENT_TIMESTAMP, 'REUNION', 'Reunión de equipo', 'Equipo de desarrollo', 
    'Desarrolladores', 'Departamento de IT', 'Planificación semanal', 
    'Se definieron tareas para la semana', 'COMPLETADA', CURRENT_TIMESTAMP, 
    'Reunión productiva', 'Sistema', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, id
FROM users
WHERE username = 'admin'
AND NOT EXISTS (SELECT 1 FROM activities LIMIT 1);

-- Insertar más actividades de ejemplo con diferentes tipos y estados
INSERT INTO activities (
    date, type, description, person, role, dependency, situation, result, status, 
    last_status_change_date, comments, agent, created_at, updated_at, user_id
)
SELECT 
    CURRENT_TIMESTAMP, 'AUDIENCIA', 'Audiencia judicial', 'Juan Pérez', 
    'Abogado', 'Juzgado Civil', 'Presentación de pruebas', 
    'Se admitieron las pruebas', 'EN_PROGRESO', CURRENT_TIMESTAMP, 
    'Pendiente resolución', 'Sistema', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, id
FROM users
WHERE username = 'admin'
AND NOT EXISTS (SELECT 1 FROM activities WHERE type = 'AUDIENCIA' LIMIT 1);

INSERT INTO activities (
    date, type, description, person, role, dependency, situation, result, status, 
    last_status_change_date, comments, agent, created_at, updated_at, user_id
)
SELECT 
    CURRENT_TIMESTAMP, 'ENTREVISTA', 'Entrevista con cliente', 'María López', 
    'Cliente', 'Empresa XYZ', 'Relevamiento de requisitos', 
    'Se documentaron los requisitos', 'PENDIENTE', CURRENT_TIMESTAMP, 
    'Programar seguimiento', 'Sistema', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, id
FROM users
WHERE username = 'admin'
AND NOT EXISTS (SELECT 1 FROM activities WHERE type = 'ENTREVISTA' LIMIT 1);

INSERT INTO activities (
    date, type, description, person, role, dependency, situation, result, status, 
    last_status_change_date, comments, agent, created_at, updated_at, user_id
)
SELECT 
    CURRENT_TIMESTAMP, 'INVESTIGACION', 'Investigación de nuevas tecnologías', 'Equipo técnico', 
    'Investigadores', 'Departamento de I+D', 'Evaluación de frameworks', 
    'Se seleccionaron 3 frameworks para pruebas', 'COMPLETADA', CURRENT_TIMESTAMP, 
    'Informe finalizado', 'Sistema', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, id
FROM users
WHERE username = 'admin'
AND NOT EXISTS (SELECT 1 FROM activities WHERE type = 'INVESTIGACION' LIMIT 1);

INSERT INTO activities (
    date, type, description, person, role, dependency, situation, result, status, 
    last_status_change_date, comments, agent, created_at, updated_at, user_id
)
SELECT 
    CURRENT_TIMESTAMP, 'DICTAMEN', 'Dictamen técnico', 'Carlos Rodríguez', 
    'Perito', 'Juzgado Penal', 'Análisis de evidencia digital', 
    'Se emitió dictamen favorable', 'COMPLETADA', CURRENT_TIMESTAMP, 
    'Dictamen entregado', 'Sistema', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, id
FROM users
WHERE username = 'admin'
AND NOT EXISTS (SELECT 1 FROM activities WHERE type = 'DICTAMEN' LIMIT 1);

INSERT INTO activities (
    date, type, description, person, role, dependency, situation, result, status, 
    last_status_change_date, comments, agent, created_at, updated_at, user_id
)
SELECT 
    CURRENT_TIMESTAMP, 'OTRO', 'Capacitación interna', 'Departamento de RRHH', 
    'Capacitadores', 'Recursos Humanos', 'Capacitación sobre nueva normativa', 
    'Se capacitó a 15 empleados', 'COMPLETADA', CURRENT_TIMESTAMP, 
    'Evaluaciones pendientes', 'Sistema', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, id
FROM users
WHERE username = 'admin'
AND NOT EXISTS (SELECT 1 FROM activities WHERE type = 'OTRO' LIMIT 1);
