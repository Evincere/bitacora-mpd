package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.DashboardMetricsEntity;
import com.bitacora.infrastructure.rest.dto.dashboard.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio especializado para consultas de métricas del dashboard.
 *
 * Proporciona métodos para obtener métricas agregadas del sistema,
 * utilizando las vistas creadas en la migración V26 para optimizar el
 * rendimiento.
 */
@Repository
public interface DashboardMetricsRepository extends JpaRepository<DashboardMetricsEntity, Long> {

    // ==================== MÉTRICAS GENERALES ====================

    /**
     * Obtiene el número total de tareas en el sistema.
     */
    @Query(value = "SELECT COUNT(*) FROM task_requests", nativeQuery = true)
    Long getTotalTasks();

    /**
     * Obtiene el número de tareas activas (no completadas).
     */
    @Query(value = "SELECT COUNT(*) FROM task_requests WHERE status NOT IN ('COMPLETED', 'CANCELLED')", nativeQuery = true)
    Long getActiveTasks();

    /**
     * Obtiene el número de tareas completadas.
     */
    @Query(value = "SELECT COUNT(*) FROM task_requests WHERE status = 'COMPLETED'", nativeQuery = true)
    Long getCompletedTasks();

    /**
     * Obtiene el número total de usuarios registrados.
     */
    @Query(value = "SELECT COUNT(*) FROM users WHERE active = true", nativeQuery = true)
    Long getTotalUsers();

    /**
     * Obtiene el número de usuarios activos en los últimos 30 días.
     */
    @Query(value = """
            SELECT COUNT(DISTINCT u.id)
            FROM users u
            INNER JOIN user_audit_log ual ON u.id = ual.user_id
            WHERE ual.action_date >= :thirtyDaysAgo AND u.active = true
            """, nativeQuery = true)
    Long getActiveUsers(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);

    /**
     * Obtiene el número de tareas creadas hoy.
     */
    @Query(value = """
            SELECT COUNT(*)
            FROM task_requests
            WHERE DATE(created_at) = CURRENT_DATE
            """, nativeQuery = true)
    Long getTasksCreatedToday();

    /**
     * Obtiene el número de tareas completadas hoy.
     */
    @Query(value = """
            SELECT COUNT(*)
            FROM task_requests
            WHERE status = 'COMPLETED' AND DATE(updated_at) = CURRENT_DATE
            """, nativeQuery = true)
    Long getTasksCompletedToday();

    /**
     * Obtiene el número de tareas vencidas.
     */
    @Query(value = """
            SELECT COUNT(*)
            FROM task_requests
            WHERE due_date < NOW() AND status NOT IN ('COMPLETED', 'CANCELLED')
            """, nativeQuery = true)
    Long getOverdueTasks();

    /**
     * Obtiene el porcentaje de tareas completadas a tiempo.
     */
    @Query(value = """
            SELECT COALESCE(
                (SELECT COUNT(*) * 100.0 / NULLIF(
                    (SELECT COUNT(*) FROM task_requests WHERE status = 'COMPLETED'), 0
                )
                FROM task_requests
                WHERE status = 'COMPLETED' AND updated_at <= due_date),
                0.0
            )
            """, nativeQuery = true)
    Double getOnTimeCompletionRate();

    /**
     * Obtiene el tiempo promedio de resolución en horas.
     */
    @Query(value = """
            SELECT COALESCE(
                AVG(DATEDIFF('HOUR', created_at, updated_at)),
                0.0
            )
            FROM task_requests
            WHERE status = 'COMPLETED'
            """, nativeQuery = true)
    Double getAverageResolutionTimeHours();

    // ==================== DISTRIBUCIÓN POR ESTADOS ====================

    /**
     * Obtiene la distribución de tareas por estados en un rango de fechas.
     */
    @Query(value = """
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
                ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage,
                CASE
                    WHEN tr.status = 'COMPLETED' THEN '#10B981'
                    WHEN tr.status = 'IN_PROGRESS' THEN '#3B82F6'
                    WHEN tr.status = 'ASSIGNED' THEN '#F59E0B'
                    WHEN tr.status = 'SUBMITTED' THEN '#8B5CF6'
                    WHEN tr.status = 'REJECTED' THEN '#EF4444'
                    WHEN tr.status = 'CANCELLED' THEN '#6B7280'
                    ELSE '#9CA3AF'
                END as color
            FROM task_requests tr
            WHERE tr.created_at BETWEEN :startDate AND :endDate
            GROUP BY tr.status
            ORDER BY count DESC
            """, nativeQuery = true)
    List<Object[]> getTaskStatusDistributionRaw(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Convierte los resultados raw a DTOs para distribución por estados.
     */
    default List<TaskStatusMetricsDto.StatusDistributionItem> getTaskStatusDistribution(
            LocalDateTime startDate, LocalDateTime endDate) {
        return getTaskStatusDistributionRaw(startDate, endDate).stream()
                .map(row -> new TaskStatusMetricsDto.StatusDistributionItem(
                        (String) row[0], // status
                        (String) row[1], // statusName
                        ((Number) row[2]).longValue(), // count
                        ((Number) row[3]).doubleValue(), // percentage
                        (String) row[4] // color
                ))
                .toList();
    }

    // ==================== ACTIVIDAD DE USUARIOS ====================

    /**
     * Obtiene los usuarios más activos en un rango de fechas.
     */
    @Query(value = """
            SELECT
                u.id,
                u.name,
                u.email,
                COUNT(tr.id) as tasks_assigned,
                COUNT(CASE WHEN tr.status = 'COMPLETED' THEN 1 END) as tasks_completed,
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
                MAX(ual.action_date) as last_activity
            FROM users u
            LEFT JOIN task_requests tr ON u.id = tr.executor_id
                AND tr.created_at BETWEEN :startDate AND :endDate
            LEFT JOIN user_audit_log ual ON u.id = ual.user_id
            WHERE u.active = true
            GROUP BY u.id, u.name, u.email
            HAVING COUNT(tr.id) > 0
            ORDER BY tasks_assigned DESC, completion_rate DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<Object[]> getTopActiveUsersRaw(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("limit") int limit);

    /**
     * Convierte los resultados raw a DTOs para actividad de usuarios.
     */
    default List<UserActivityMetricsDto.UserActivityItem> getTopActiveUsers(
            LocalDateTime startDate, LocalDateTime endDate, int limit) {
        return getTopActiveUsersRaw(startDate, endDate, limit).stream()
                .map(row -> new UserActivityMetricsDto.UserActivityItem(
                        ((Number) row[0]).longValue(), // userId
                        (String) row[1], // userName
                        (String) row[2], // userEmail
                        ((Number) row[3]).longValue(), // tasksAssigned
                        ((Number) row[4]).longValue(), // tasksCompleted
                        ((Number) row[5]).doubleValue(), // completionRate
                        ((Number) row[6]).doubleValue(), // averageResolutionTimeHours
                        (LocalDateTime) row[7] // lastActivity
                ))
                .toList();
    }

    /**
     * Obtiene el número total de usuarios activos en un período.
     */
    @Query(value = """
            SELECT COUNT(DISTINCT tr.executor_id)
            FROM task_requests tr
            WHERE tr.created_at BETWEEN :startDate AND :endDate
            AND tr.executor_id IS NOT NULL
            """, nativeQuery = true)
    Long getTotalActiveUsersInPeriod(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Obtiene el promedio de tareas por usuario en un período.
     */
    @Query(value = """
            SELECT COALESCE(
                AVG(task_count), 0.0
            )
            FROM (
                SELECT COUNT(*) as task_count
                FROM task_requests tr
                WHERE tr.created_at BETWEEN :startDate AND :endDate
                AND tr.executor_id IS NOT NULL
                GROUP BY tr.executor_id
            ) user_tasks
            """, nativeQuery = true)
    Double getAverageTasksPerUser(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Obtiene la tasa de finalización promedio en un período.
     */
    @Query(value = """
            SELECT COALESCE(
                AVG(completion_rate), 0.0
            )
            FROM (
                SELECT
                    COUNT(CASE WHEN tr.status = 'COMPLETED' THEN 1 END) * 100.0 /
                    NULLIF(COUNT(*), 0) as completion_rate
                FROM task_requests tr
                WHERE tr.created_at BETWEEN :startDate AND :endDate
                AND tr.executor_id IS NOT NULL
                GROUP BY tr.executor_id
                HAVING COUNT(*) > 0
            ) user_rates
            """, nativeQuery = true)
    Double getAverageCompletionRate(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // ==================== DISTRIBUCIÓN POR CATEGORÍAS ====================

    /**
     * Obtiene la distribución de tareas por categorías en un rango de fechas.
     */
    @Query(value = """
            SELECT
                c.id,
                c.name,
                c.description,
                COUNT(tr.id) as count,
                ROUND(COUNT(tr.id) * 100.0 / SUM(COUNT(tr.id)) OVER (), 2) as percentage,
                COUNT(CASE WHEN tr.status = 'COMPLETED' THEN 1 END) as completed_count,
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
                    WHEN c.id % 6 = 0 THEN '#3B82F6'
                    WHEN c.id % 6 = 1 THEN '#10B981'
                    WHEN c.id % 6 = 2 THEN '#F59E0B'
                    WHEN c.id % 6 = 3 THEN '#8B5CF6'
                    WHEN c.id % 6 = 4 THEN '#EF4444'
                    ELSE '#6B7280'
                END as color
            FROM task_request_categories c
            LEFT JOIN task_requests tr ON c.id = tr.category_id
                AND tr.created_at BETWEEN :startDate AND :endDate
            GROUP BY c.id, c.name, c.description
            HAVING COUNT(tr.id) > 0
            ORDER BY count DESC
            """, nativeQuery = true)
    List<Object[]> getCategoryDistributionRaw(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Convierte los resultados raw a DTOs para distribución por categorías.
     */
    default List<CategoryDistributionDto.CategoryDistributionItem> getCategoryDistribution(
            LocalDateTime startDate, LocalDateTime endDate) {
        return getCategoryDistributionRaw(startDate, endDate).stream()
                .map(row -> new CategoryDistributionDto.CategoryDistributionItem(
                        ((Number) row[0]).longValue(), // categoryId
                        (String) row[1], // categoryName
                        (String) row[2], // categoryDescription
                        ((Number) row[3]).longValue(), // count
                        ((Number) row[4]).doubleValue(), // percentage
                        ((Number) row[5]).longValue(), // completedCount
                        ((Number) row[6]).doubleValue(), // completionRate
                        ((Number) row[7]).doubleValue(), // averageResolutionTimeHours
                        (String) row[8] // color
                ))
                .toList();
    }

    // ==================== DISTRIBUCIÓN POR PRIORIDADES ====================

    /**
     * Obtiene la distribución de tareas por prioridades en un rango de fechas.
     */
    @Query(value = """
            SELECT
                tr.priority as priority,
                CASE
                    WHEN tr.priority = 'CRITICAL' THEN 'Crítica'
                    WHEN tr.priority = 'HIGH' THEN 'Alta'
                    WHEN tr.priority = 'MEDIUM' THEN 'Media'
                    WHEN tr.priority = 'LOW' THEN 'Baja'
                    WHEN tr.priority = 'TRIVIAL' THEN 'Trivial'
                    ELSE tr.priority
                END as priority_name,
                CASE
                    WHEN tr.priority = 'CRITICAL' THEN 1
                    WHEN tr.priority = 'HIGH' THEN 2
                    WHEN tr.priority = 'MEDIUM' THEN 3
                    WHEN tr.priority = 'LOW' THEN 4
                    WHEN tr.priority = 'TRIVIAL' THEN 5
                    ELSE 99
                END as priority_order,
                COUNT(tr.id) as count,
                ROUND(COUNT(tr.id) * 100.0 / SUM(COUNT(tr.id)) OVER (), 2) as percentage,
                COUNT(CASE WHEN tr.status = 'COMPLETED' THEN 1 END) as completed_count,
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
                COUNT(CASE
                    WHEN tr.due_date < CURRENT_TIMESTAMP AND tr.status NOT IN ('COMPLETED', 'CANCELLED')
                    THEN 1
                END) as overdue_count,
                CASE
                    WHEN tr.priority = 'CRITICAL' THEN '#DC2626'
                    WHEN tr.priority = 'HIGH' THEN '#EF4444'
                    WHEN tr.priority = 'MEDIUM' THEN '#F59E0B'
                    WHEN tr.priority = 'LOW' THEN '#10B981'
                    WHEN tr.priority = 'TRIVIAL' THEN '#6B7280'
                    ELSE '#6B7280'
                END as color
            FROM task_requests tr
            WHERE tr.created_at BETWEEN :startDate AND :endDate
            AND tr.priority IS NOT NULL
            GROUP BY tr.priority
            HAVING COUNT(tr.id) > 0
            ORDER BY priority_order ASC
            """, nativeQuery = true)
    List<Object[]> getPriorityDistributionRaw(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Convierte los resultados raw a DTOs para distribución por prioridades.
     */
    default List<PriorityDistributionDto.PriorityDistributionItem> getPriorityDistribution(
            LocalDateTime startDate, LocalDateTime endDate) {
        return getPriorityDistributionRaw(startDate, endDate).stream()
                .map(row -> new PriorityDistributionDto.PriorityDistributionItem(
                        (String) row[0], // priority
                        (String) row[1], // priorityName
                        ((Number) row[2]).intValue(), // priorityOrder
                        ((Number) row[3]).longValue(), // count
                        ((Number) row[4]).doubleValue(), // percentage
                        ((Number) row[5]).longValue(), // completedCount
                        ((Number) row[6]).doubleValue(), // completionRate
                        ((Number) row[7]).doubleValue(), // averageResolutionTimeHours
                        ((Number) row[8]).longValue(), // overdueCount
                        (String) row[9] // color
                ))
                .toList();
    }
}
