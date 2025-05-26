-- V27__Create_Dashboard_Metrics_Table.sql
-- Crear tabla para almacenar métricas del dashboard

CREATE TABLE dashboard_metrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(255) NOT NULL,
    metric_value TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices por separado para H2
CREATE INDEX idx_dashboard_metrics_name ON dashboard_metrics (metric_name);
CREATE INDEX idx_dashboard_metrics_generated_at ON dashboard_metrics (generated_at);

-- Insertar algunas métricas de ejemplo para testing
INSERT INTO dashboard_metrics (metric_name, metric_value) VALUES
('system_status', 'active'),
('last_update', CURRENT_TIMESTAMP);
