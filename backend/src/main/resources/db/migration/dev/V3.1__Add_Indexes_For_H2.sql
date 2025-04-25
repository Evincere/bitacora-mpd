-- Índices adicionales para H2
-- Estos índices son compatibles con H2 y mejoran el rendimiento de las consultas

-- Índice para búsqueda por rango de fechas
CREATE INDEX IF NOT EXISTS idx_activities_date_range ON activities(date);

-- Índice para búsqueda por tipo y estado
CREATE INDEX IF NOT EXISTS idx_activities_type_status ON activities(type, status);

-- Índice para búsqueda por usuario y estado
CREATE INDEX IF NOT EXISTS idx_activities_user_status ON activities(user_id, status);

-- Índice para búsqueda en la descripción (versión simple para H2)
CREATE INDEX IF NOT EXISTS idx_activities_description ON activities(description);

-- Índice para búsqueda en la situación (versión simple para H2)
CREATE INDEX IF NOT EXISTS idx_activities_situation ON activities(situation);

-- Índice para búsqueda en el resultado (versión simple para H2)
CREATE INDEX IF NOT EXISTS idx_activities_result ON activities(result);

-- Índice para búsqueda en los comentarios (versión simple para H2)
CREATE INDEX IF NOT EXISTS idx_activities_comments ON activities(comments);
