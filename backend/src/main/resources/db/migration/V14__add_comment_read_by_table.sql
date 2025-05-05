-- Crear tabla para almacenar los usuarios que han leído cada comentario
CREATE TABLE task_request_comment_read_by (
    comment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (comment_id, user_id),
    FOREIGN KEY (comment_id) REFERENCES task_request_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Añadir índice para mejorar el rendimiento de las consultas
CREATE INDEX idx_task_request_comment_read_by_user_id ON task_request_comment_read_by(user_id);
