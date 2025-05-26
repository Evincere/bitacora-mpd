package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.dashboard.DashboardMetricsService;
import com.bitacora.infrastructure.rest.dto.dashboard.DashboardMetricsDto;
import com.bitacora.infrastructure.rest.dto.dashboard.TaskStatusMetricsDto;
import com.bitacora.infrastructure.rest.dto.dashboard.UserActivityMetricsDto;
import com.bitacora.infrastructure.rest.dto.dashboard.CategoryDistributionDto;
import com.bitacora.infrastructure.rest.dto.dashboard.PriorityDistributionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * Controlador REST para métricas del dashboard administrativo.
 *
 * Proporciona endpoints para obtener métricas generales del sistema,
 * distribución de tareas por estados, actividad de usuarios, y otras
 * métricas relevantes para la administración del sistema.
 */
@RestController
@RequestMapping("/api/admin/dashboard")
@Tag(name = "Dashboard Administrativo", description = "APIs para métricas y estadísticas del dashboard administrativo")
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

    private final DashboardMetricsService dashboardMetricsService;

    /**
     * Constructor del controlador.
     *
     * @param dashboardMetricsService Servicio para obtener métricas del dashboard
     */
    public DashboardController(DashboardMetricsService dashboardMetricsService) {
        this.dashboardMetricsService = dashboardMetricsService;
    }

    /**
     * Obtiene las métricas generales del sistema.
     *
     * @return Métricas generales del dashboard
     */
    @GetMapping("/metrics/overview")
    @Operation(summary = "Obtener métricas generales", description = "Obtiene un resumen general de las métricas del sistema incluyendo totales de tareas, usuarios activos, y estadísticas generales")
    public ResponseEntity<DashboardMetricsDto> getSystemOverview() {
        DashboardMetricsDto metrics = dashboardMetricsService.getSystemOverview();
        return ResponseEntity.ok(metrics);
    }

    /**
     * Obtiene la distribución de tareas por estados.
     *
     * @param startDate Fecha de inicio del rango (opcional)
     * @param endDate   Fecha de fin del rango (opcional)
     * @return Distribución de tareas por estados
     */
    @GetMapping("/metrics/task-status")
    @Operation(summary = "Obtener distribución por estados", description = "Obtiene la distribución de tareas agrupadas por estado en un rango de fechas específico")
    public ResponseEntity<TaskStatusMetricsDto> getTaskStatusMetrics(
            @Parameter(description = "Fecha de inicio del rango (formato: yyyy-MM-dd'T'HH:mm:ss)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,

            @Parameter(description = "Fecha de fin del rango (formato: yyyy-MM-dd'T'HH:mm:ss)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        TaskStatusMetricsDto metrics = dashboardMetricsService.getTaskStatusMetrics(startDate, endDate);
        return ResponseEntity.ok(metrics);
    }

    /**
     * Obtiene las métricas de actividad de usuarios.
     *
     * @param startDate Fecha de inicio del rango (opcional)
     * @param endDate   Fecha de fin del rango (opcional)
     * @return Métricas de actividad de usuarios
     */
    @GetMapping("/metrics/user-activity")
    @Operation(summary = "Obtener actividad de usuarios", description = "Obtiene métricas de actividad de usuarios incluyendo usuarios más activos y estadísticas de productividad")
    public ResponseEntity<UserActivityMetricsDto> getUserActivityMetrics(
            @Parameter(description = "Fecha de inicio del rango (formato: yyyy-MM-dd'T'HH:mm:ss)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,

            @Parameter(description = "Fecha de fin del rango (formato: yyyy-MM-dd'T'HH:mm:ss)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        UserActivityMetricsDto metrics = dashboardMetricsService.getUserActivityMetrics(startDate, endDate);
        return ResponseEntity.ok(metrics);
    }

    /**
     * Obtiene la distribución de tareas por categorías.
     *
     * @param startDate Fecha de inicio del rango (opcional)
     * @param endDate   Fecha de fin del rango (opcional)
     * @return Distribución de tareas por categorías
     */
    @GetMapping("/metrics/category-distribution")
    @Operation(summary = "Obtener distribución por categorías", description = "Obtiene la distribución de tareas agrupadas por categoría en un rango de fechas específico")
    public ResponseEntity<CategoryDistributionDto> getCategoryDistribution(
            @Parameter(description = "Fecha de inicio del rango (formato: yyyy-MM-dd'T'HH:mm:ss)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,

            @Parameter(description = "Fecha de fin del rango (formato: yyyy-MM-dd'T'HH:mm:ss)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        CategoryDistributionDto distribution = dashboardMetricsService.getCategoryDistribution(startDate, endDate);
        return ResponseEntity.ok(distribution);
    }

    /**
     * Obtiene la distribución de tareas por prioridades.
     *
     * @param startDate Fecha de inicio del rango (opcional)
     * @param endDate   Fecha de fin del rango (opcional)
     * @return Distribución de tareas por prioridades
     */
    @GetMapping("/metrics/priority-distribution")
    @Operation(summary = "Obtener distribución por prioridades", description = "Obtiene la distribución de tareas agrupadas por prioridad en un rango de fechas específico")
    public ResponseEntity<PriorityDistributionDto> getPriorityDistribution(
            @Parameter(description = "Fecha de inicio del rango (formato: yyyy-MM-dd'T'HH:mm:ss)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,

            @Parameter(description = "Fecha de fin del rango (formato: yyyy-MM-dd'T'HH:mm:ss)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        PriorityDistributionDto distribution = dashboardMetricsService.getPriorityDistribution(startDate, endDate);
        return ResponseEntity.ok(distribution);
    }
}
