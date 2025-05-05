-- Crear tabla para historial de solicitudes de tareas
CREATE TABLE task_request_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_request_id BIGINT NOT NULL,
    user_id BIGINT,
    user_name VARCHAR(200),
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    change_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(1000),
    FOREIGN KEY (task_request_id) REFERENCES task_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX idx_task_request_history_task_request_id ON task_request_history(task_request_id);
