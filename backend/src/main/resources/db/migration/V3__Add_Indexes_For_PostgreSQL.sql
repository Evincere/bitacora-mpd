-- Índices adicionales para PostgreSQL
-- Estos índices son específicos para PostgreSQL y mejoran el rendimiento de las consultas de texto

-- Índice GIN para búsqueda de texto completo en la descripción de actividades
CREATE INDEX IF NOT EXISTS idx_activities_description_gin ON activities USING gin(to_tsvector('spanish', description));

-- Índice GIN para búsqueda de texto completo en la situación de actividades
CREATE INDEX IF NOT EXISTS idx_activities_situation_gin ON activities USING gin(to_tsvector('spanish', situation));

-- Índice GIN para búsqueda de texto completo en el resultado de actividades
CREATE INDEX IF NOT EXISTS idx_activities_result_gin ON activities USING gin(to_tsvector('spanish', result));

-- Índice GIN para búsqueda de texto completo en los comentarios de actividades
CREATE INDEX IF NOT EXISTS idx_activities_comments_gin ON activities USING gin(to_tsvector('spanish', comments));

-- Índice para búsqueda por rango de fechas
CREATE INDEX IF NOT EXISTS idx_activities_date_range ON activities USING btree(date);

-- Índice para búsqueda por tipo y estado
CREATE INDEX IF NOT EXISTS idx_activities_type_status ON activities USING btree(type, status);

-- Índice para búsqueda por usuario y estado
CREATE INDEX IF NOT EXISTS idx_activities_user_status ON activities USING btree(user_id, status);
