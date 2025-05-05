-- Añadir campo executor_id a la tabla task_requests
ALTER TABLE task_requests
ADD COLUMN executor_id BIGINT NULL;

-- Añadir clave foránea para executor_id
ALTER TABLE task_requests
ADD CONSTRAINT fk_task_requests_executor FOREIGN KEY (executor_id) REFERENCES users(id);

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX idx_task_requests_executor ON task_requests(executor_id);
