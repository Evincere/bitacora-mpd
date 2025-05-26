package com.bitacora.infrastructure.rest.dto.dashboard;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para las métricas de actividad de usuarios.
 *
 * Contiene información sobre la actividad de usuarios en el sistema,
 * incluyendo usuarios más activos, estadísticas de productividad y métricas de
 * rendimiento.
 */
@Schema(description = "Métricas de actividad de usuarios")
public class UserActivityMetricsDto {

    @Schema(description = "Lista de usuarios más activos")
    @JsonProperty("topActiveUsers")
    @NotNull
    private List<UserActivityItem> topActiveUsers;

    @Schema(description = "Número total de usuarios activos en el período", example = "45")
    @JsonProperty("totalActiveUsers")
    @NotNull
    @PositiveOrZero
    private Long totalActiveUsers;

    @Schema(description = "Promedio de tareas por usuario", example = "8.5")
    @JsonProperty("averageTasksPerUser")
    @NotNull
    @PositiveOrZero
    private Double averageTasksPerUser;

    @Schema(description = "Tasa de finalización promedio", example = "87.3")
    @JsonProperty("averageCompletionRate")
    @NotNull
    @PositiveOrZero
    private Double averageCompletionRate;

    @Schema(description = "Fecha de inicio del período analizado")
    @JsonProperty("periodStart")
    private LocalDateTime periodStart;

    @Schema(description = "Fecha de fin del período analizado")
    @JsonProperty("periodEnd")
    private LocalDateTime periodEnd;

    @Schema(description = "Fecha y hora de generación de las métricas")
    @JsonProperty("generatedAt")
    @NotNull
    private LocalDateTime generatedAt;

    /**
     * Constructor por defecto.
     */
    public UserActivityMetricsDto() {
    }

    /**
     * Constructor con parámetros.
     */
    public UserActivityMetricsDto(List<UserActivityItem> topActiveUsers, Long totalActiveUsers,
            Double averageTasksPerUser, Double averageCompletionRate,
            LocalDateTime periodStart, LocalDateTime periodEnd, LocalDateTime generatedAt) {
        this.topActiveUsers = topActiveUsers;
        this.totalActiveUsers = totalActiveUsers;
        this.averageTasksPerUser = averageTasksPerUser;
        this.averageCompletionRate = averageCompletionRate;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.generatedAt = generatedAt;
    }

    // Getters y Setters

    public List<UserActivityItem> getTopActiveUsers() {
        return topActiveUsers;
    }

    public void setTopActiveUsers(List<UserActivityItem> topActiveUsers) {
        this.topActiveUsers = topActiveUsers;
    }

    public Long getTotalActiveUsers() {
        return totalActiveUsers;
    }

    public void setTotalActiveUsers(Long totalActiveUsers) {
        this.totalActiveUsers = totalActiveUsers;
    }

    public Double getAverageTasksPerUser() {
        return averageTasksPerUser;
    }

    public void setAverageTasksPerUser(Double averageTasksPerUser) {
        this.averageTasksPerUser = averageTasksPerUser;
    }

    public Double getAverageCompletionRate() {
        return averageCompletionRate;
    }

    public void setAverageCompletionRate(Double averageCompletionRate) {
        this.averageCompletionRate = averageCompletionRate;
    }

    public LocalDateTime getPeriodStart() {
        return periodStart;
    }

    public void setPeriodStart(LocalDateTime periodStart) {
        this.periodStart = periodStart;
    }

    public LocalDateTime getPeriodEnd() {
        return periodEnd;
    }

    public void setPeriodEnd(LocalDateTime periodEnd) {
        this.periodEnd = periodEnd;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    /**
     * Clase interna para representar la actividad de un usuario.
     */
    @Schema(description = "Elemento de actividad de usuario")
    public static class UserActivityItem {

        @Schema(description = "ID del usuario", example = "123")
        @JsonProperty("userId")
        @NotNull
        private Long userId;

        @Schema(description = "Nombre del usuario", example = "Juan Pérez")
        @JsonProperty("userName")
        @NotNull
        private String userName;

        @Schema(description = "Email del usuario", example = "juan.perez@empresa.com")
        @JsonProperty("userEmail")
        private String userEmail;

        @Schema(description = "Número de tareas asignadas", example = "25")
        @JsonProperty("tasksAssigned")
        @NotNull
        @PositiveOrZero
        private Long tasksAssigned;

        @Schema(description = "Número de tareas completadas", example = "22")
        @JsonProperty("tasksCompleted")
        @NotNull
        @PositiveOrZero
        private Long tasksCompleted;

        @Schema(description = "Tasa de finalización", example = "88.0")
        @JsonProperty("completionRate")
        @NotNull
        @PositiveOrZero
        private Double completionRate;

        @Schema(description = "Tiempo promedio de resolución en horas", example = "18.5")
        @JsonProperty("averageResolutionTimeHours")
        @NotNull
        @PositiveOrZero
        private Double averageResolutionTimeHours;

        @Schema(description = "Fecha de última actividad")
        @JsonProperty("lastActivity")
        private LocalDateTime lastActivity;

        /**
         * Constructor por defecto.
         */
        public UserActivityItem() {
        }

        /**
         * Constructor con parámetros.
         */
        public UserActivityItem(Long userId, String userName, String userEmail, Long tasksAssigned,
                Long tasksCompleted, Double completionRate, Double averageResolutionTimeHours,
                LocalDateTime lastActivity) {
            this.userId = userId;
            this.userName = userName;
            this.userEmail = userEmail;
            this.tasksAssigned = tasksAssigned;
            this.tasksCompleted = tasksCompleted;
            this.completionRate = completionRate;
            this.averageResolutionTimeHours = averageResolutionTimeHours;
            this.lastActivity = lastActivity;
        }

        // Getters y Setters

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getUserEmail() {
            return userEmail;
        }

        public void setUserEmail(String userEmail) {
            this.userEmail = userEmail;
        }

        public Long getTasksAssigned() {
            return tasksAssigned;
        }

        public void setTasksAssigned(Long tasksAssigned) {
            this.tasksAssigned = tasksAssigned;
        }

        public Long getTasksCompleted() {
            return tasksCompleted;
        }

        public void setTasksCompleted(Long tasksCompleted) {
            this.tasksCompleted = tasksCompleted;
        }

        public Double getCompletionRate() {
            return completionRate;
        }

        public void setCompletionRate(Double completionRate) {
            this.completionRate = completionRate;
        }

        public Double getAverageResolutionTimeHours() {
            return averageResolutionTimeHours;
        }

        public void setAverageResolutionTimeHours(Double averageResolutionTimeHours) {
            this.averageResolutionTimeHours = averageResolutionTimeHours;
        }

        public LocalDateTime getLastActivity() {
            return lastActivity;
        }

        public void setLastActivity(LocalDateTime lastActivity) {
            this.lastActivity = lastActivity;
        }

        @Override
        public String toString() {
            return "UserActivityItem{" +
                    "userId=" + userId +
                    ", userName='" + userName + '\'' +
                    ", userEmail='" + userEmail + '\'' +
                    ", tasksAssigned=" + tasksAssigned +
                    ", tasksCompleted=" + tasksCompleted +
                    ", completionRate=" + completionRate +
                    ", averageResolutionTimeHours=" + averageResolutionTimeHours +
                    ", lastActivity=" + lastActivity +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "UserActivityMetricsDto{" +
                "topActiveUsers=" + topActiveUsers +
                ", totalActiveUsers=" + totalActiveUsers +
                ", averageTasksPerUser=" + averageTasksPerUser +
                ", averageCompletionRate=" + averageCompletionRate +
                ", periodStart=" + periodStart +
                ", periodEnd=" + periodEnd +
                ", generatedAt=" + generatedAt +
                '}';
    }
}
