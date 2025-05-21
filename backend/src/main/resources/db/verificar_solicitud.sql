-- Verificar el estado actual de la solicitud con ID 4
SELECT id, title, status, requester_id, assigner_id, executor_id, notes
FROM task_requests
WHERE id = 4;

-- Verificar el historial de la solicitud con ID 4
SELECT id, task_request_id, user_id, previous_status, new_status, change_date, notes
FROM task_request_history
WHERE task_request_id = 4
ORDER BY change_date DESC;
