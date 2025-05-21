-- Añadir columna comment_id a la tabla task_request_attachments
ALTER TABLE task_request_attachments ADD COLUMN comment_id BIGINT;

-- Añadir índice para mejorar el rendimiento de las consultas por comment_id
CREATE INDEX idx_task_request_attachments_comment_id ON task_request_attachments(comment_id);

-- Añadir comentario a la columna
COMMENT ON COLUMN task_request_attachments.comment_id IS 'ID del comentario al que está asociado este archivo adjunto (opcional)';
