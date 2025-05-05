-- Crear tabla para almacenar las menciones de usuarios en comentarios
CREATE TABLE task_request_comment_mentions (
    comment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (comment_id, user_id),
    FOREIGN KEY (comment_id) REFERENCES task_request_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Añadir índice para mejorar el rendimiento de las consultas
CREATE INDEX idx_task_request_comment_mentions_user_id ON task_request_comment_mentions(user_id);
