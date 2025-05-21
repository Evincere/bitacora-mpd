-- V23__Remove_Test_Task_Requests.sql
-- Migración para eliminar las solicitudes de prueba insertadas en migraciones anteriores

-- Eliminar comentarios asociados a las solicitudes de prueba
DELETE FROM task_request_comments
WHERE task_request_id IN (
    SELECT id FROM task_requests
    WHERE title IN ('Actualización de software', 'Revisión de documentación', 'Implementación de nueva funcionalidad')
);

-- Eliminar archivos adjuntos asociados a las solicitudes de prueba
DELETE FROM task_request_attachments
WHERE task_request_id IN (
    SELECT id FROM task_requests
    WHERE title IN ('Actualización de software', 'Revisión de documentación', 'Implementación de nueva funcionalidad')
);

-- Eliminar historial asociado a las solicitudes de prueba
DELETE FROM task_request_history
WHERE task_request_id IN (
    SELECT id FROM task_requests
    WHERE title IN ('Actualización de software', 'Revisión de documentación', 'Implementación de nueva funcionalidad')
);

-- Eliminar las solicitudes de prueba
DELETE FROM task_requests
WHERE title IN ('Actualización de software', 'Revisión de documentación', 'Implementación de nueva funcionalidad');

-- No es necesario registrar en el log, Flyway lo hace automáticamente
