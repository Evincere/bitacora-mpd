package com.bitacora.application.dashboard;

import com.bitacora.infrastructure.rest.dto.dashboard.*;
import com.bitacora.infrastructure.persistence.repository.DashboardMetricsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio para obtener métricas del dashboard administrativo.
 *
 * Proporciona métodos para obtener métricas agregadas del sistema,
 * incluyendo estadísticas de tareas, usuarios, y distribuciones por
 * diferentes criterios.
 */
@Service
@Transactional(readOnly = true)
public class DashboardMetricsService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardMetricsService.class);

    private final DashboardMetricsRepository dashboardMetricsRepository;

    /**
     * Constructor del servicio.
     *
     * @param dashboardMetricsRepository Repositorio para consultas de métricas
     */
    public DashboardMetricsService(DashboardMetricsRepository dashboardMetricsRepository) {
        this.dashboardMetricsRepository = dashboardMetricsRepository;
    }

    /**
     * Obtiene las métricas generales del sistema.
     *
     * @return Métricas generales del dashboard
     */
    @Cacheable(value = "dashboard-overview", unless = "#result == null")
    public DashboardMetricsDto getSystemOverview() {
        logger.debug("Obteniendo métricas generales del sistema");

        try {
            // Obtener métricas básicas
            Long totalTasks = dashboardMetricsRepository.getTotalTasks();
            Long activeTasks = dashboardMetricsRepository.getActiveTasks();
            Long completedTasks = dashboardMetricsRepository.getCompletedTasks();
            Long totalUsers = dashboardMetricsRepository.getTotalUsers();
            Long activeUsers = dashboardMetricsRepository.getActiveUsers(LocalDateTime.now().minusDays(30));

            // Obtener métricas del día actual
            Long tasksCreatedToday = dashboardMetricsRepository.getTasksCreatedToday();
            Long tasksCompletedToday = dashboardMetricsRepository.getTasksCompletedToday();
            Long overdueTasks = dashboardMetricsRepository.getOverdueTasks();

            // Calcular métricas derivadas
            Double onTimeCompletionRate = dashboardMetricsRepository.getOnTimeCompletionRate();
            Double averageResolutionTimeHours = dashboardMetricsRepository.getAverageResolutionTimeHours();

            DashboardMetricsDto metrics = new DashboardMetricsDto(
                    totalTasks,
                    activeTasks,
                    completedTasks,
                    totalUsers,
                    activeUsers,
                    tasksCreatedToday,
                    tasksCompletedToday,
                    overdueTasks,
                    onTimeCompletionRate,
                    averageResolutionTimeHours,
                    LocalDateTime.now());

            logger.debug("Métricas generales obtenidas exitosamente: {}", metrics);
            return metrics;

        } catch (Exception e) {
            logger.error("Error al obtener métricas generales del sistema", e);
            throw new RuntimeException("Error al obtener métricas del dashboard", e);
        }
    }

    /**
     * Obtiene la distribución de tareas por estados en un rango de fechas.
     *
     * @param startDate Fecha de inicio (opcional)
     * @param endDate   Fecha de fin (opcional)
     * @return Distribución de tareas por estados
     */
    @Cacheable(value = "task-status-metrics", key = "#startDate + '_' + #endDate", unless = "#result == null")
    public TaskStatusMetricsDto getTaskStatusMetrics(LocalDateTime startDate, LocalDateTime endDate) {
        logger.debug("Obteniendo métricas de estado de tareas para el período: {} - {}", startDate, endDate);

        try {
            // Establecer fechas por defecto si no se proporcionan
            LocalDateTime effectiveStartDate = startDate != null ? startDate : LocalDateTime.now().minusDays(30);
            LocalDateTime effectiveEndDate = endDate != null ? endDate : LocalDateTime.now();

            // Obtener distribución por estados
            List<TaskStatusMetricsDto.StatusDistributionItem> statusDistribution = dashboardMetricsRepository
                    .getTaskStatusDistribution(effectiveStartDate, effectiveEndDate);

            // Calcular total de tareas
            Long totalTasks = statusDistribution.stream()
                    .mapToLong(TaskStatusMetricsDto.StatusDistributionItem::getCount)
                    .sum();

            TaskStatusMetricsDto metrics = new TaskStatusMetricsDto(
                    statusDistribution,
                    totalTasks,
                    effectiveStartDate,
                    effectiveEndDate,
                    LocalDateTime.now());

            logger.debug("Métricas de estado de tareas obtenidas exitosamente: {} elementos",
                    statusDistribution.size());
            return metrics;

        } catch (Exception e) {
            logger.error("Error al obtener métricas de estado de tareas", e);
            throw new RuntimeException("Error al obtener métricas de estado de tareas", e);
        }
    }

    /**
     * Obtiene las métricas de actividad de usuarios en un rango de fechas.
     *
     * @param startDate Fecha de inicio (opcional)
     * @param endDate   Fecha de fin (opcional)
     * @return Métricas de actividad de usuarios
     */
    @Cacheable(value = "user-activity-metrics", key = "#startDate + '_' + #endDate", unless = "#result == null")
    public UserActivityMetricsDto getUserActivityMetrics(LocalDateTime startDate, LocalDateTime endDate) {
        logger.debug("Obteniendo métricas de actividad de usuarios para el período: {} - {}", startDate, endDate);

        try {
            // Establecer fechas por defecto si no se proporcionan
            LocalDateTime effectiveStartDate = startDate != null ? startDate : LocalDateTime.now().minusDays(30);
            LocalDateTime effectiveEndDate = endDate != null ? endDate : LocalDateTime.now();

            // Obtener usuarios más activos
            List<UserActivityMetricsDto.UserActivityItem> topActiveUsers = dashboardMetricsRepository
                    .getTopActiveUsers(effectiveStartDate, effectiveEndDate, 10);

            // Obtener métricas agregadas
            Long totalActiveUsers = dashboardMetricsRepository.getTotalActiveUsersInPeriod(effectiveStartDate,
                    effectiveEndDate);
            Double averageTasksPerUser = dashboardMetricsRepository.getAverageTasksPerUser(effectiveStartDate,
                    effectiveEndDate);
            Double averageCompletionRate = dashboardMetricsRepository.getAverageCompletionRate(effectiveStartDate,
                    effectiveEndDate);

            UserActivityMetricsDto metrics = new UserActivityMetricsDto(
                    topActiveUsers,
                    totalActiveUsers,
                    averageTasksPerUser,
                    averageCompletionRate,
                    effectiveStartDate,
                    effectiveEndDate,
                    LocalDateTime.now());

            logger.debug("Métricas de actividad de usuarios obtenidas exitosamente: {} usuarios activos",
                    totalActiveUsers);
            return metrics;

        } catch (Exception e) {
            logger.error("Error al obtener métricas de actividad de usuarios", e);
            throw new RuntimeException("Error al obtener métricas de actividad de usuarios", e);
        }
    }

    /**
     * Obtiene la distribución de tareas por categorías en un rango de fechas.
     *
     * @param startDate Fecha de inicio (opcional)
     * @param endDate   Fecha de fin (opcional)
     * @return Distribución de tareas por categorías
     */
    @Cacheable(value = "category-distribution", key = "#startDate + '_' + #endDate", unless = "#result == null")
    public CategoryDistributionDto getCategoryDistribution(LocalDateTime startDate, LocalDateTime endDate) {
        logger.debug("Obteniendo distribución por categorías para el período: {} - {}", startDate, endDate);

        try {
            // Establecer fechas por defecto si no se proporcionan
            LocalDateTime effectiveStartDate = startDate != null ? startDate : LocalDateTime.now().minusDays(30);
            LocalDateTime effectiveEndDate = endDate != null ? endDate : LocalDateTime.now();

            // Obtener distribución por categorías
            List<CategoryDistributionDto.CategoryDistributionItem> categoryDistribution = dashboardMetricsRepository
                    .getCategoryDistribution(effectiveStartDate, effectiveEndDate);

            // Calcular total de tareas
            Long totalTasks = categoryDistribution.stream()
                    .mapToLong(CategoryDistributionDto.CategoryDistributionItem::getCount)
                    .sum();

            CategoryDistributionDto distribution = new CategoryDistributionDto(
                    categoryDistribution,
                    totalTasks,
                    effectiveStartDate,
                    effectiveEndDate,
                    LocalDateTime.now());

            logger.debug("Distribución por categorías obtenida exitosamente: {} categorías",
                    categoryDistribution.size());
            return distribution;

        } catch (Exception e) {
            logger.error("Error al obtener distribución por categorías", e);
            throw new RuntimeException("Error al obtener distribución por categorías", e);
        }
    }

    /**
     * Obtiene la distribución de tareas por prioridades en un rango de fechas.
     *
     * @param startDate Fecha de inicio (opcional)
     * @param endDate   Fecha de fin (opcional)
     * @return Distribución de tareas por prioridades
     */
    @Cacheable(value = "priority-distribution", key = "#startDate + '_' + #endDate", unless = "#result == null")
    public PriorityDistributionDto getPriorityDistribution(LocalDateTime startDate, LocalDateTime endDate) {
        logger.debug("Obteniendo distribución por prioridades para el período: {} - {}", startDate, endDate);

        try {
            // Establecer fechas por defecto si no se proporcionan
            LocalDateTime effectiveStartDate = startDate != null ? startDate : LocalDateTime.now().minusDays(30);
            LocalDateTime effectiveEndDate = endDate != null ? endDate : LocalDateTime.now();

            // Obtener distribución por prioridades
            List<PriorityDistributionDto.PriorityDistributionItem> priorityDistribution = dashboardMetricsRepository
                    .getPriorityDistribution(effectiveStartDate, effectiveEndDate);

            // Calcular total de tareas
            Long totalTasks = priorityDistribution.stream()
                    .mapToLong(PriorityDistributionDto.PriorityDistributionItem::getCount)
                    .sum();

            PriorityDistributionDto distribution = new PriorityDistributionDto(
                    priorityDistribution,
                    totalTasks,
                    effectiveStartDate,
                    effectiveEndDate,
                    LocalDateTime.now());

            logger.debug("Distribución por prioridades obtenida exitosamente: {} prioridades",
                    priorityDistribution.size());
            return distribution;

        } catch (Exception e) {
            logger.error("Error al obtener distribución por prioridades", e);
            throw new RuntimeException("Error al obtener distribución por prioridades", e);
        }
    }
}
