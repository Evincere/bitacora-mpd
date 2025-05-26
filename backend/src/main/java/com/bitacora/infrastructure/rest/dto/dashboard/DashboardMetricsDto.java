package com.bitacora.infrastructure.rest.dto.dashboard;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;

/**
 * DTO para las métricas generales del dashboard administrativo.
 *
 * Contiene información agregada sobre el estado general del sistema,
 * incluyendo totales de tareas, usuarios activos, y estadísticas de
 * rendimiento.
 */
@Schema(description = "Métricas generales del dashboard administrativo")
public class DashboardMetricsDto {

    @Schema(description = "Número total de tareas en el sistema", example = "1250")
    @JsonProperty("totalTasks")
    @NotNull
    @PositiveOrZero
    private Long totalTasks;

    @Schema(description = "Número de tareas activas (no completadas)", example = "320")
    @JsonProperty("activeTasks")
    @NotNull
    @PositiveOrZero
    private Long activeTasks;

    @Schema(description = "Número de tareas completadas", example = "930")
    @JsonProperty("completedTasks")
    @NotNull
    @PositiveOrZero
    private Long completedTasks;

    @Schema(description = "Número total de usuarios registrados", example = "85")
    @JsonProperty("totalUsers")
    @NotNull
    @PositiveOrZero
    private Long totalUsers;

    @Schema(description = "Número de usuarios activos en los últimos 30 días", example = "67")
    @JsonProperty("activeUsers")
    @NotNull
    @PositiveOrZero
    private Long activeUsers;

    @Schema(description = "Número de tareas creadas hoy", example = "12")
    @JsonProperty("tasksCreatedToday")
    @NotNull
    @PositiveOrZero
    private Long tasksCreatedToday;

    @Schema(description = "Número de tareas completadas hoy", example = "8")
    @JsonProperty("tasksCompletedToday")
    @NotNull
    @PositiveOrZero
    private Long tasksCompletedToday;

    @Schema(description = "Número de tareas vencidas", example = "5")
    @JsonProperty("overdueTasks")
    @NotNull
    @PositiveOrZero
    private Long overdueTasks;

    @Schema(description = "Porcentaje de tareas completadas a tiempo", example = "87.5")
    @JsonProperty("onTimeCompletionRate")
    @NotNull
    @PositiveOrZero
    private Double onTimeCompletionRate;

    @Schema(description = "Tiempo promedio de resolución en horas", example = "24.5")
    @JsonProperty("averageResolutionTimeHours")
    @NotNull
    @PositiveOrZero
    private Double averageResolutionTimeHours;

    @Schema(description = "Fecha y hora de la última actualización de métricas")
    @JsonProperty("lastUpdated")
    @NotNull
    private LocalDateTime lastUpdated;

    /**
     * Constructor por defecto.
     */
    public DashboardMetricsDto() {
    }

    /**
     * Constructor con todos los parámetros.
     */
    public DashboardMetricsDto(Long totalTasks, Long activeTasks, Long completedTasks,
            Long totalUsers, Long activeUsers, Long tasksCreatedToday,
            Long tasksCompletedToday, Long overdueTasks,
            Double onTimeCompletionRate, Double averageResolutionTimeHours,
            LocalDateTime lastUpdated) {
        this.totalTasks = totalTasks;
        this.activeTasks = activeTasks;
        this.completedTasks = completedTasks;
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.tasksCreatedToday = tasksCreatedToday;
        this.tasksCompletedToday = tasksCompletedToday;
        this.overdueTasks = overdueTasks;
        this.onTimeCompletionRate = onTimeCompletionRate;
        this.averageResolutionTimeHours = averageResolutionTimeHours;
        this.lastUpdated = lastUpdated;
    }

    // Getters y Setters

    public Long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Long getActiveTasks() {
        return activeTasks;
    }

    public void setActiveTasks(Long activeTasks) {
        this.activeTasks = activeTasks;
    }

    public Long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(Long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(Long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public Long getTasksCreatedToday() {
        return tasksCreatedToday;
    }

    public void setTasksCreatedToday(Long tasksCreatedToday) {
        this.tasksCreatedToday = tasksCreatedToday;
    }

    public Long getTasksCompletedToday() {
        return tasksCompletedToday;
    }

    public void setTasksCompletedToday(Long tasksCompletedToday) {
        this.tasksCompletedToday = tasksCompletedToday;
    }

    public Long getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(Long overdueTasks) {
        this.overdueTasks = overdueTasks;
    }

    public Double getOnTimeCompletionRate() {
        return onTimeCompletionRate;
    }

    public void setOnTimeCompletionRate(Double onTimeCompletionRate) {
        this.onTimeCompletionRate = onTimeCompletionRate;
    }

    public Double getAverageResolutionTimeHours() {
        return averageResolutionTimeHours;
    }

    public void setAverageResolutionTimeHours(Double averageResolutionTimeHours) {
        this.averageResolutionTimeHours = averageResolutionTimeHours;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    @Override
    public String toString() {
        return "DashboardMetricsDto{" +
                "totalTasks=" + totalTasks +
                ", activeTasks=" + activeTasks +
                ", completedTasks=" + completedTasks +
                ", totalUsers=" + totalUsers +
                ", activeUsers=" + activeUsers +
                ", tasksCreatedToday=" + tasksCreatedToday +
                ", tasksCompletedToday=" + tasksCompletedToday +
                ", overdueTasks=" + overdueTasks +
                ", onTimeCompletionRate=" + onTimeCompletionRate +
                ", averageResolutionTimeHours=" + averageResolutionTimeHours +
                ", lastUpdated=" + lastUpdated +
                '}';
    }
}
