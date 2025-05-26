package com.bitacora.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidad simple para métricas del dashboard.
 * Esta entidad se usa principalmente para consultas nativas que devuelven datos agregados.
 */
@Entity
@Table(name = "dashboard_metrics")
public class DashboardMetricsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "metric_name")
    private String metricName;

    @Column(name = "metric_value")
    private String metricValue;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    /**
     * Constructor por defecto.
     */
    public DashboardMetricsEntity() {
        this.generatedAt = LocalDateTime.now();
    }

    /**
     * Constructor con parámetros.
     *
     * @param metricName  nombre de la métrica
     * @param metricValue valor de la métrica
     */
    public DashboardMetricsEntity(final String metricName, final String metricValue) {
        this.metricName = metricName;
        this.metricValue = metricValue;
        this.generatedAt = LocalDateTime.now();
    }

    /**
     * Obtiene el ID.
     *
     * @return el ID
     */
    public Long getId() {
        return id;
    }

    /**
     * Establece el ID.
     *
     * @param id el ID a establecer
     */
    public void setId(final Long id) {
        this.id = id;
    }

    /**
     * Obtiene el nombre de la métrica.
     *
     * @return el nombre de la métrica
     */
    public String getMetricName() {
        return metricName;
    }

    /**
     * Establece el nombre de la métrica.
     *
     * @param metricName el nombre de la métrica a establecer
     */
    public void setMetricName(final String metricName) {
        this.metricName = metricName;
    }

    /**
     * Obtiene el valor de la métrica.
     *
     * @return el valor de la métrica
     */
    public String getMetricValue() {
        return metricValue;
    }

    /**
     * Establece el valor de la métrica.
     *
     * @param metricValue el valor de la métrica a establecer
     */
    public void setMetricValue(final String metricValue) {
        this.metricValue = metricValue;
    }

    /**
     * Obtiene la fecha de generación.
     *
     * @return la fecha de generación
     */
    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    /**
     * Establece la fecha de generación.
     *
     * @param generatedAt la fecha de generación a establecer
     */
    public void setGeneratedAt(final LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    @Override
    public String toString() {
        return "DashboardMetricsEntity{"
                + "id=" + id
                + ", metricName='" + metricName + '\''
                + ", metricValue='" + metricValue + '\''
                + ", generatedAt=" + generatedAt
                + '}';
    }
}
