-- Verificar si hay actividades asignadas al ejecutor con ID 20 (Matías Silva)
SELECT * FROM activities WHERE executor_id = 20;

-- Verificar si hay actividades con estado ASSIGNED
SELECT * FROM activities WHERE status = 'ASSIGNED';

-- Verificar si hay actividades con estado ASSIGNED y executor_id = 20
SELECT * FROM activities WHERE status = 'ASSIGNED' AND executor_id = 20;

-- Verificar si el usuario con ID 20 existe
SELECT * FROM users WHERE id = 20;

-- Verificar si hay solicitudes de tareas asignadas al ejecutor con ID 20
SELECT * FROM task_requests WHERE executor_id = 20;

-- Verificar si hay solicitudes de tareas con estado ASSIGNED
SELECT * FROM task_requests WHERE status = 'ASSIGNED';

-- Verificar si hay solicitudes de tareas con estado ASSIGNED y executor_id = 20
SELECT * FROM task_requests WHERE status = 'ASSIGNED' AND executor_id = 20;
