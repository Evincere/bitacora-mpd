-- Actualizar las solicitudes que estaban en estado CANCELLED pero que en realidad fueron rechazadas
-- Esto es para mantener la compatibilidad con los datos existentes
UPDATE task_request_history
SET new_status = 'REJECTED'
WHERE notes LIKE 'Solicitud rechazada por el asignador:%'
AND new_status = 'CANCELLED';

-- Actualizar las solicitudes correspondientes
UPDATE task_requests
SET status = 'REJECTED'
WHERE id IN (
    SELECT task_request_id 
    FROM task_request_history 
    WHERE notes LIKE 'Solicitud rechazada por el asignador:%'
    AND new_status = 'REJECTED'
);
