-- Añadir columna user_name a la tabla task_request_comments
ALTER TABLE task_request_comments ADD COLUMN user_name VARCHAR(255);

-- Añadir comentario a la columna
COMMENT ON COLUMN task_request_comments.user_name IS 'Nombre de usuario que creó el comentario';
