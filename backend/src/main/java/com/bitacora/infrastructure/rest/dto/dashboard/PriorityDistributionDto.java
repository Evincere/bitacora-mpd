package com.bitacora.infrastructure.rest.dto.dashboard;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para la distribución de tareas por prioridades.
 *
 * Contiene información sobre la distribución de tareas agrupadas por prioridad,
 * incluyendo conteos, porcentajes y métricas de rendimiento por prioridad.
 */
@Schema(description = "Distribución de tareas por prioridades")
public class PriorityDistributionDto {

    @Schema(description = "Lista de distribución por prioridad")
    @JsonProperty("priorityDistribution")
    @NotNull
    private List<PriorityDistributionItem> priorityDistribution;

    @Schema(description = "Número total de tareas en el período", example = "450")
    @JsonProperty("totalTasks")
    @NotNull
    @PositiveOrZero
    private Long totalTasks;

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
    public PriorityDistributionDto() {
    }

    /**
     * Constructor con parámetros.
     */
    public PriorityDistributionDto(List<PriorityDistributionItem> priorityDistribution, Long totalTasks,
            LocalDateTime periodStart, LocalDateTime periodEnd, LocalDateTime generatedAt) {
        this.priorityDistribution = priorityDistribution;
        this.totalTasks = totalTasks;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.generatedAt = generatedAt;
    }

    // Getters y Setters

    public List<PriorityDistributionItem> getPriorityDistribution() {
        return priorityDistribution;
    }

    public void setPriorityDistribution(List<PriorityDistributionItem> priorityDistribution) {
        this.priorityDistribution = priorityDistribution;
    }

    public Long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Long totalTasks) {
        this.totalTasks = totalTasks;
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
     * Clase interna para representar un elemento de distribución por prioridad.
     */
    @Schema(description = "Elemento de distribución por prioridad")
    public static class PriorityDistributionItem {

        @Schema(description = "Nivel de prioridad", example = "HIGH")
        @JsonProperty("priority")
        @NotNull
        private String priority;

        @Schema(description = "Nombre descriptivo de la prioridad", example = "Alta")
        @JsonProperty("priorityName")
        @NotNull
        private String priorityName;

        @Schema(description = "Orden de la prioridad (1 = más alta)", example = "1")
        @JsonProperty("priorityOrder")
        @NotNull
        private Integer priorityOrder;

        @Schema(description = "Número de tareas con esta prioridad", example = "85")
        @JsonProperty("count")
        @NotNull
        @PositiveOrZero
        private Long count;

        @Schema(description = "Porcentaje del total", example = "18.9")
        @JsonProperty("percentage")
        @NotNull
        @PositiveOrZero
        private Double percentage;

        @Schema(description = "Número de tareas completadas con esta prioridad", example = "72")
        @JsonProperty("completedCount")
        @NotNull
        @PositiveOrZero
        private Long completedCount;

        @Schema(description = "Tasa de finalización para esta prioridad", example = "84.7")
        @JsonProperty("completionRate")
        @NotNull
        @PositiveOrZero
        private Double completionRate;

        @Schema(description = "Tiempo promedio de resolución en horas para esta prioridad", example = "16.2")
        @JsonProperty("averageResolutionTimeHours")
        @NotNull
        @PositiveOrZero
        private Double averageResolutionTimeHours;

        @Schema(description = "Número de tareas vencidas con esta prioridad", example = "3")
        @JsonProperty("overdueCount")
        @NotNull
        @PositiveOrZero
        private Long overdueCount;

        @Schema(description = "Color asociado a la prioridad para gráficos", example = "#EF4444")
        @JsonProperty("color")
        private String color;

        /**
         * Constructor por defecto.
         */
        public PriorityDistributionItem() {
        }

        /**
         * Constructor con parámetros.
         */
        public PriorityDistributionItem(String priority, String priorityName, Integer priorityOrder,
                Long count, Double percentage, Long completedCount,
                Double completionRate, Double averageResolutionTimeHours,
                Long overdueCount, String color) {
            this.priority = priority;
            this.priorityName = priorityName;
            this.priorityOrder = priorityOrder;
            this.count = count;
            this.percentage = percentage;
            this.completedCount = completedCount;
            this.completionRate = completionRate;
            this.averageResolutionTimeHours = averageResolutionTimeHours;
            this.overdueCount = overdueCount;
            this.color = color;
        }

        // Getters y Setters

        public String getPriority() {
            return priority;
        }

        public void setPriority(String priority) {
            this.priority = priority;
        }

        public String getPriorityName() {
            return priorityName;
        }

        public void setPriorityName(String priorityName) {
            this.priorityName = priorityName;
        }

        public Integer getPriorityOrder() {
            return priorityOrder;
        }

        public void setPriorityOrder(Integer priorityOrder) {
            this.priorityOrder = priorityOrder;
        }

        public Long getCount() {
            return count;
        }

        public void setCount(Long count) {
            this.count = count;
        }

        public Double getPercentage() {
            return percentage;
        }

        public void setPercentage(Double percentage) {
            this.percentage = percentage;
        }

        public Long getCompletedCount() {
            return completedCount;
        }

        public void setCompletedCount(Long completedCount) {
            this.completedCount = completedCount;
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

        public Long getOverdueCount() {
            return overdueCount;
        }

        public void setOverdueCount(Long overdueCount) {
            this.overdueCount = overdueCount;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        @Override
        public String toString() {
            return "PriorityDistributionItem{" +
                    "priority='" + priority + '\'' +
                    ", priorityName='" + priorityName + '\'' +
                    ", priorityOrder=" + priorityOrder +
                    ", count=" + count +
                    ", percentage=" + percentage +
                    ", completedCount=" + completedCount +
                    ", completionRate=" + completionRate +
                    ", averageResolutionTimeHours=" + averageResolutionTimeHours +
                    ", overdueCount=" + overdueCount +
                    ", color='" + color + '\'' +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "PriorityDistributionDto{" +
                "priorityDistribution=" + priorityDistribution +
                ", totalTasks=" + totalTasks +
                ", periodStart=" + periodStart +
                ", periodEnd=" + periodEnd +
                ", generatedAt=" + generatedAt +
                '}';
    }
}
