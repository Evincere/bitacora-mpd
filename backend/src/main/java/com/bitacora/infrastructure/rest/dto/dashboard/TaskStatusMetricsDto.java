package com.bitacora.infrastructure.rest.dto.dashboard;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para las métricas de distribución de tareas por estado.
 *
 * Contiene información sobre la distribución de tareas agrupadas por estado,
 * incluyendo conteos y porcentajes para cada estado.
 */
@Schema(description = "Métricas de distribución de tareas por estado")
public class TaskStatusMetricsDto {

    @Schema(description = "Lista de distribución por estado")
    @JsonProperty("statusDistribution")
    @NotNull
    private List<StatusDistributionItem> statusDistribution;

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
    public TaskStatusMetricsDto() {
    }

    /**
     * Constructor con parámetros.
     */
    public TaskStatusMetricsDto(List<StatusDistributionItem> statusDistribution, Long totalTasks,
            LocalDateTime periodStart, LocalDateTime periodEnd, LocalDateTime generatedAt) {
        this.statusDistribution = statusDistribution;
        this.totalTasks = totalTasks;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.generatedAt = generatedAt;
    }

    // Getters y Setters

    public List<StatusDistributionItem> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(List<StatusDistributionItem> statusDistribution) {
        this.statusDistribution = statusDistribution;
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
     * Clase interna para representar un elemento de distribución por estado.
     */
    @Schema(description = "Elemento de distribución por estado")
    public static class StatusDistributionItem {

        @Schema(description = "Estado de la tarea", example = "COMPLETED")
        @JsonProperty("status")
        @NotNull
        private String status;

        @Schema(description = "Nombre descriptivo del estado", example = "Completadas")
        @JsonProperty("statusName")
        @NotNull
        private String statusName;

        @Schema(description = "Número de tareas en este estado", example = "125")
        @JsonProperty("count")
        @NotNull
        @PositiveOrZero
        private Long count;

        @Schema(description = "Porcentaje del total", example = "27.8")
        @JsonProperty("percentage")
        @NotNull
        @PositiveOrZero
        private Double percentage;

        @Schema(description = "Color asociado al estado para gráficos", example = "#10B981")
        @JsonProperty("color")
        private String color;

        /**
         * Constructor por defecto.
         */
        public StatusDistributionItem() {
        }

        /**
         * Constructor con parámetros.
         */
        public StatusDistributionItem(String status, String statusName, Long count, Double percentage, String color) {
            this.status = status;
            this.statusName = statusName;
            this.count = count;
            this.percentage = percentage;
            this.color = color;
        }

        // Getters y Setters

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getStatusName() {
            return statusName;
        }

        public void setStatusName(String statusName) {
            this.statusName = statusName;
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

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        @Override
        public String toString() {
            return "StatusDistributionItem{" +
                    "status='" + status + '\'' +
                    ", statusName='" + statusName + '\'' +
                    ", count=" + count +
                    ", percentage=" + percentage +
                    ", color='" + color + '\'' +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "TaskStatusMetricsDto{" +
                "statusDistribution=" + statusDistribution +
                ", totalTasks=" + totalTasks +
                ", periodStart=" + periodStart +
                ", periodEnd=" + periodEnd +
                ", generatedAt=" + generatedAt +
                '}';
    }
}
