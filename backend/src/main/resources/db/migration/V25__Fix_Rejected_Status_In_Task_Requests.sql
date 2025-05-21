-- Corregir el problema con las solicitudes rechazadas
-- Esta migración soluciona un problema donde las solicitudes rechazadas no se actualizan correctamente

-- Asegurarse de que todas las solicitudes con historial de rechazo tengan el estado REJECTED
UPDATE task_requests
SET status = 'REJECTED'
WHERE id IN (
    SELECT task_request_id
    FROM task_request_history
    WHERE notes LIKE 'Solicitud rechazada por el asignador:%'
);

-- Asegurarse de que todos los registros de historial de rechazo tengan el estado correcto
UPDATE task_request_history
SET new_status = 'REJECTED'
WHERE notes LIKE 'Solicitud rechazada por el asignador:%';

-- Asegurarse de que los registros de historial tengan el estado anterior correcto
UPDATE task_request_history
SET previous_status = 'SUBMITTED'
WHERE notes LIKE 'Solicitud rechazada por el asignador:%'
AND previous_status IS NULL;

-- Corregir el problema específico de columna NEW_STATUS que no permite valores nulos
-- Actualizar registros en task_request_history donde new_status es NULL
UPDATE task_request_history
SET new_status = 'REJECTED'
WHERE new_status IS NULL
AND task_request_id IN (
    SELECT id FROM task_requests WHERE status = 'REJECTED'
);

-- Verificar y corregir registros inconsistentes en task_request_history
UPDATE task_request_history
SET new_status = 'REJECTED'
WHERE new_status IS NULL
AND notes LIKE '%rechaza%';
