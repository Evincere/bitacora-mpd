package com.bitacora.infrastructure.rest.dto.dashboard;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para la distribución de tareas por categorías.
 *
 * Contiene información sobre la distribución de tareas agrupadas por categoría,
 * incluyendo conteos, porcentajes y métricas de rendimiento por categoría.
 */
@Schema(description = "Distribución de tareas por categorías")
public class CategoryDistributionDto {

    @Schema(description = "Lista de distribución por categoría")
    @JsonProperty("categoryDistribution")
    @NotNull
    private List<CategoryDistributionItem> categoryDistribution;

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
    public CategoryDistributionDto() {
    }

    /**
     * Constructor con parámetros.
     */
    public CategoryDistributionDto(List<CategoryDistributionItem> categoryDistribution, Long totalTasks,
            LocalDateTime periodStart, LocalDateTime periodEnd, LocalDateTime generatedAt) {
        this.categoryDistribution = categoryDistribution;
        this.totalTasks = totalTasks;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.generatedAt = generatedAt;
    }

    // Getters y Setters

    public List<CategoryDistributionItem> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(List<CategoryDistributionItem> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
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
     * Clase interna para representar un elemento de distribución por categoría.
     */
    @Schema(description = "Elemento de distribución por categoría")
    public static class CategoryDistributionItem {

        @Schema(description = "ID de la categoría", example = "1")
        @JsonProperty("categoryId")
        @NotNull
        private Long categoryId;

        @Schema(description = "Nombre de la categoría", example = "Desarrollo")
        @JsonProperty("categoryName")
        @NotNull
        private String categoryName;

        @Schema(description = "Descripción de la categoría", example = "Tareas relacionadas con desarrollo de software")
        @JsonProperty("categoryDescription")
        private String categoryDescription;

        @Schema(description = "Número de tareas en esta categoría", example = "125")
        @JsonProperty("count")
        @NotNull
        @PositiveOrZero
        private Long count;

        @Schema(description = "Porcentaje del total", example = "27.8")
        @JsonProperty("percentage")
        @NotNull
        @PositiveOrZero
        private Double percentage;

        @Schema(description = "Número de tareas completadas en esta categoría", example = "98")
        @JsonProperty("completedCount")
        @NotNull
        @PositiveOrZero
        private Long completedCount;

        @Schema(description = "Tasa de finalización para esta categoría", example = "78.4")
        @JsonProperty("completionRate")
        @NotNull
        @PositiveOrZero
        private Double completionRate;

        @Schema(description = "Tiempo promedio de resolución en horas para esta categoría", example = "32.5")
        @JsonProperty("averageResolutionTimeHours")
        @NotNull
        @PositiveOrZero
        private Double averageResolutionTimeHours;

        @Schema(description = "Color asociado a la categoría para gráficos", example = "#3B82F6")
        @JsonProperty("color")
        private String color;

        /**
         * Constructor por defecto.
         */
        public CategoryDistributionItem() {
        }

        /**
         * Constructor con parámetros.
         */
        public CategoryDistributionItem(Long categoryId, String categoryName, String categoryDescription,
                Long count, Double percentage, Long completedCount,
                Double completionRate, Double averageResolutionTimeHours, String color) {
            this.categoryId = categoryId;
            this.categoryName = categoryName;
            this.categoryDescription = categoryDescription;
            this.count = count;
            this.percentage = percentage;
            this.completedCount = completedCount;
            this.completionRate = completionRate;
            this.averageResolutionTimeHours = averageResolutionTimeHours;
            this.color = color;
        }

        // Getters y Setters

        public Long getCategoryId() {
            return categoryId;
        }

        public void setCategoryId(Long categoryId) {
            this.categoryId = categoryId;
        }

        public String getCategoryName() {
            return categoryName;
        }

        public void setCategoryName(String categoryName) {
            this.categoryName = categoryName;
        }

        public String getCategoryDescription() {
            return categoryDescription;
        }

        public void setCategoryDescription(String categoryDescription) {
            this.categoryDescription = categoryDescription;
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

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        @Override
        public String toString() {
            return "CategoryDistributionItem{" +
                    "categoryId=" + categoryId +
                    ", categoryName='" + categoryName + '\'' +
                    ", categoryDescription='" + categoryDescription + '\'' +
                    ", count=" + count +
                    ", percentage=" + percentage +
                    ", completedCount=" + completedCount +
                    ", completionRate=" + completionRate +
                    ", averageResolutionTimeHours=" + averageResolutionTimeHours +
                    ", color='" + color + '\'' +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "CategoryDistributionDto{" +
                "categoryDistribution=" + categoryDistribution +
                ", totalTasks=" + totalTasks +
                ", periodStart=" + periodStart +
                ", periodEnd=" + periodEnd +
                ", generatedAt=" + generatedAt +
                '}';
    }
}
