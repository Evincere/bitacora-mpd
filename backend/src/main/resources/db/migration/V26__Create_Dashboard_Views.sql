-- =====================================================
-- Migración V26: Crear vistas para métricas del dashboard
-- =====================================================
-- Descripción: Crea vistas optimizadas para consultas de métricas del dashboard administrativo
-- Autor: Sistema de Gestión de Tareas
-- Fecha: 2024-12-19

-- =====================================================
-- Vista: v_dashboard_metrics
-- Descripción: Métricas generales agregadas del sistema
-- =====================================================
CREATE VIEW v_dashboard_metrics AS
SELECT
    -- Métricas básicas de tareas
    (SELECT COUNT(*) FROM task_requests) as total_tasks,
    (SELECT COUNT(*) FROM task_requests WHERE status NOT IN ('COMPLETED', 'CANCELLED')) as active_tasks,
    (SELECT COUNT(*) FROM task_requests WHERE status = 'COMPLETED') as completed_tasks,

    -- Métricas de usuarios
    (SELECT COUNT(*) FROM users WHERE active = true) as total_users,
    (SELECT COUNT(DISTINCT u.id)
     FROM users u
     INNER JOIN user_audit_log ual ON u.id = ual.user_id
     WHERE ual.timestamp >= DATEADD('DAY', -30, CURRENT_DATE)
     AND u.active = true) as active_users,

    -- Métricas del día actual
    (SELECT COUNT(*)
     FROM task_requests
     WHERE CAST(created_at AS DATE) = CURRENT_DATE) as tasks_created_today,
    (SELECT COUNT(*)
     FROM task_requests
     WHERE status = 'COMPLETED'
     AND CAST(updated_at AS DATE) = CURRENT_DATE) as tasks_completed_today,

    -- Tareas vencidas
    (SELECT COUNT(*)
     FROM task_requests
     WHERE due_date < CURRENT_TIMESTAMP
     AND status NOT IN ('COMPLETED', 'CANCELLED')) as overdue_tasks,

    -- Métricas calculadas
    COALESCE(
        (SELECT COUNT(*) * 100.0 / NULLIF(
            (SELECT COUNT(*) FROM task_requests WHERE status = 'COMPLETED'), 0
        )
        FROM task_requests
        WHERE status = 'COMPLETED' AND updated_at <= due_date),
        0.0
    ) as on_time_completion_rate,

    COALESCE(
        (SELECT AVG(DATEDIFF('HOUR', created_at, updated_at))
         FROM task_requests
         WHERE status = 'COMPLETED'),
        0.0
    ) as average_resolution_time_hours,

    CURRENT_TIMESTAMP as last_updated;

-- =====================================================
-- Vista: v_task_status_summary
-- Descripción: Resumen de tareas por estado
-- =====================================================
CREATE VIEW v_task_status_summary AS
SELECT
    tr.status,
    CASE
        WHEN tr.status = 'DRAFT' THEN 'Borrador'
        WHEN tr.status = 'SUBMITTED' THEN 'Enviada'
        WHEN tr.status = 'ASSIGNED' THEN 'Asignada'
        WHEN tr.status = 'IN_PROGRESS' THEN 'En Progreso'
        WHEN tr.status = 'COMPLETED' THEN 'Completada'
        WHEN tr.status = 'REJECTED' THEN 'Rechazada'
        WHEN tr.status = 'CANCELLED' THEN 'Cancelada'
        ELSE tr.status
    END as status_name,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM task_requests), 2) as percentage,
    CASE
        WHEN tr.status = 'COMPLETED' THEN '#10B981'
        WHEN tr.status = 'IN_PROGRESS' THEN '#3B82F6'
        WHEN tr.status = 'ASSIGNED' THEN '#F59E0B'
        WHEN tr.status = 'SUBMITTED' THEN '#8B5CF6'
        WHEN tr.status = 'REJECTED' THEN '#EF4444'
        WHEN tr.status = 'CANCELLED' THEN '#6B7280'
        ELSE '#9CA3AF'
    END as color,
    MIN(tr.created_at) as earliest_task,
    MAX(tr.created_at) as latest_task
FROM task_requests tr
GROUP BY tr.status
ORDER BY count DESC;

-- =====================================================
-- Vista: v_user_activity_summary
-- Descripción: Resumen de actividad por usuario
-- =====================================================
CREATE VIEW v_user_activity_summary AS
SELECT
    u.id as user_id,
    CONCAT(u.first_name, ' ', u.last_name) as user_name,
    u.email as user_email,
    u.role as user_role,
    COUNT(tr.id) as tasks_assigned,
    COUNT(CASE WHEN tr.status = 'COMPLETED' THEN 1 END) as tasks_completed,
    COUNT(CASE WHEN tr.status = 'IN_PROGRESS' THEN 1 END) as tasks_in_progress,
    COUNT(CASE WHEN tr.due_date < CURRENT_TIMESTAMP AND tr.status NOT IN ('COMPLETED', 'CANCELLED') THEN 1 END) as overdue_tasks,
    ROUND(
        COUNT(CASE WHEN tr.status = 'COMPLETED' THEN 1 END) * 100.0 /
        NULLIF(COUNT(tr.id), 0), 2
    ) as completion_rate,
    COALESCE(
        AVG(CASE
            WHEN tr.status = 'COMPLETED'
            THEN DATEDIFF('HOUR', tr.created_at, tr.updated_at)
        END),
        0.0
    ) as avg_resolution_hours,
    MAX(ual.timestamp) as last_activity,
    MIN(tr.created_at) as first_task_date,
    MAX(tr.created_at) as last_task_date
FROM users u
LEFT JOIN task_requests tr ON u.id = tr.executor_id
LEFT JOIN user_audit_log ual ON u.id = ual.user_id
WHERE u.active = true
GROUP BY u.id, u.first_name, u.last_name, u.email, u.role
ORDER BY tasks_assigned DESC, completion_rate DESC;

-- =====================================================
-- Vista: v_category_metrics
-- Descripción: Métricas por categoría
-- =====================================================
CREATE VIEW v_category_metrics AS
SELECT
    c.id as category_id,
    c.name as category_name,
    c.description as category_description,
    c.is_default as category_is_default,
    COUNT(tr.id) as total_tasks,
    COUNT(CASE WHEN tr.status = 'COMPLETED' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN tr.status = 'IN_PROGRESS' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN tr.due_date < CURRENT_TIMESTAMP AND tr.status NOT IN ('COMPLETED', 'CANCELLED') THEN 1 END) as overdue_tasks,
    ROUND(
        COUNT(CASE WHEN tr.status = 'COMPLETED' THEN 1 END) * 100.0 /
        NULLIF(COUNT(tr.id), 0), 2
    ) as completion_rate,
    COALESCE(
        AVG(CASE
            WHEN tr.status = 'COMPLETED'
            THEN DATEDIFF('HOUR', tr.created_at, tr.updated_at)
        END),
        0.0
    ) as avg_resolution_hours,
    CASE
        WHEN MOD(c.id, 6) = 0 THEN '#3B82F6'
        WHEN MOD(c.id, 6) = 1 THEN '#10B981'
        WHEN MOD(c.id, 6) = 2 THEN '#F59E0B'
        WHEN MOD(c.id, 6) = 3 THEN '#8B5CF6'
        WHEN MOD(c.id, 6) = 4 THEN '#EF4444'
        ELSE '#6B7280'
    END as color,
    MIN(tr.created_at) as first_task_date,
    MAX(tr.created_at) as last_task_date
FROM task_request_categories c
LEFT JOIN task_requests tr ON c.id = tr.category_id
GROUP BY c.id, c.name, c.description, c.is_default
ORDER BY total_tasks DESC;

-- =====================================================
-- Vista: v_priority_metrics
-- Descripción: Métricas por prioridad
-- =====================================================
CREATE VIEW v_priority_metrics AS
SELECT
    tr.priority as priority_name,
    CASE
        WHEN tr.priority = 'CRITICAL' THEN 'Crítica'
        WHEN tr.priority = 'HIGH' THEN 'Alta'
        WHEN tr.priority = 'MEDIUM' THEN 'Media'
        WHEN tr.priority = 'LOW' THEN 'Baja'
        WHEN tr.priority = 'TRIVIAL' THEN 'Trivial'
        ELSE tr.priority
    END as priority_display_name,
    CASE
        WHEN tr.priority = 'CRITICAL' THEN 1
        WHEN tr.priority = 'HIGH' THEN 2
        WHEN tr.priority = 'MEDIUM' THEN 3
        WHEN tr.priority = 'LOW' THEN 4
        WHEN tr.priority = 'TRIVIAL' THEN 5
        ELSE 99
    END as priority_order,
    COUNT(tr.id) as total_tasks,
    COUNT(CASE WHEN tr.status = 'COMPLETED' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN tr.status = 'IN_PROGRESS' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN tr.due_date < CURRENT_TIMESTAMP AND tr.status NOT IN ('COMPLETED', 'CANCELLED') THEN 1 END) as overdue_tasks,
    ROUND(
        COUNT(CASE WHEN tr.status = 'COMPLETED' THEN 1 END) * 100.0 /
        NULLIF(COUNT(tr.id), 0), 2
    ) as completion_rate,
    COALESCE(
        AVG(CASE
            WHEN tr.status = 'COMPLETED'
            THEN DATEDIFF('HOUR', tr.created_at, tr.updated_at)
        END),
        0.0
    ) as avg_resolution_hours,
    CASE
        WHEN tr.priority = 'CRITICAL' THEN '#DC2626'
        WHEN tr.priority = 'HIGH' THEN '#EF4444'
        WHEN tr.priority = 'MEDIUM' THEN '#F59E0B'
        WHEN tr.priority = 'LOW' THEN '#10B981'
        WHEN tr.priority = 'TRIVIAL' THEN '#6B7280'
        ELSE '#6B7280'
    END as color,
    MIN(tr.created_at) as first_task_date,
    MAX(tr.created_at) as last_task_date
FROM task_requests tr
WHERE tr.priority IS NOT NULL
GROUP BY tr.priority
ORDER BY priority_order ASC;

-- =====================================================
-- Índices para optimizar consultas de métricas
-- =====================================================

-- Índices para task_requests (si no existen)
CREATE INDEX IF NOT EXISTS idx_task_requests_status ON task_requests(status);
CREATE INDEX IF NOT EXISTS idx_task_requests_created_at ON task_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_task_requests_updated_at ON task_requests(updated_at);
CREATE INDEX IF NOT EXISTS idx_task_requests_due_date ON task_requests(due_date);
CREATE INDEX IF NOT EXISTS idx_task_requests_assigner ON task_requests(assigner_id);
CREATE INDEX IF NOT EXISTS idx_task_requests_executor ON task_requests(executor_id);
CREATE INDEX IF NOT EXISTS idx_task_requests_requester ON task_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_task_requests_category ON task_requests(category_id);
CREATE INDEX IF NOT EXISTS idx_task_requests_priority ON task_requests(priority);

-- Índices compuestos para consultas complejas
CREATE INDEX IF NOT EXISTS idx_task_requests_status_created_at ON task_requests(status, created_at);
CREATE INDEX IF NOT EXISTS idx_task_requests_status_updated_at ON task_requests(status, updated_at);
CREATE INDEX IF NOT EXISTS idx_task_requests_due_date_status ON task_requests(due_date, status);

-- Índices para user_audit_log
CREATE INDEX IF NOT EXISTS idx_user_audit_log_user_id ON user_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_audit_log_timestamp ON user_audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_audit_log_user_timestamp ON user_audit_log(user_id, timestamp);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Índices para task_request_categories
CREATE INDEX IF NOT EXISTS idx_task_request_categories_is_default ON task_request_categories(is_default);

-- =====================================================
-- Comentarios en las vistas para documentación
-- =====================================================
-- H2 no soporta COMMENT ON VIEW, por lo que se documentan aquí:
-- v_dashboard_metrics: Vista con métricas generales agregadas del sistema para el dashboard administrativo
-- v_task_status_summary: Vista con resumen de tareas agrupadas por estado
-- v_user_activity_summary: Vista con resumen de actividad y productividad por usuario
-- v_category_metrics: Vista con métricas de tareas agrupadas por categoría
-- v_priority_metrics: Vista con métricas de tareas agrupadas por prioridad
