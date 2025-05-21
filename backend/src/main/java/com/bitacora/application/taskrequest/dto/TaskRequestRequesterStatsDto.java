package com.bitacora.application.taskrequest.dto;

import java.util.Map;

/**
 * DTO para estadísticas de solicitudes específicas para el usuario solicitante.
 */
public class TaskRequestRequesterStatsDto {

    private long totalRequests;
    private long pendingRequests;
    private long assignedRequests;
    private long inProgressRequests;
    private long completedRequests;
    private long rejectedRequests;
    private long cancelledRequests;
    private double averageAssignmentTime;
    private double averageCompletionTime;
    private double onTimeCompletionPercentage;
    private double lateCompletionPercentage;
    private Map<String, Long> requestsByCategory;
    private Map<String, Long> requestsByPriority;
    private Map<String, Long> requestsByMonth;

    /**
     * Constructor por defecto.
     */
    public TaskRequestRequesterStatsDto() {
    }

    /**
     * Constructor con todos los campos.
     *
     * @param totalRequests              Total de solicitudes
     * @param pendingRequests            Solicitudes pendientes
     * @param assignedRequests           Solicitudes asignadas
     * @param inProgressRequests         Solicitudes en progreso
     * @param completedRequests          Solicitudes completadas
     * @param rejectedRequests           Solicitudes rechazadas
     * @param cancelledRequests          Solicitudes canceladas
     * @param averageAssignmentTime      Tiempo promedio de asignación
     * @param averageCompletionTime      Tiempo promedio de completado
     * @param onTimeCompletionPercentage Porcentaje de solicitudes completadas a tiempo
     * @param lateCompletionPercentage   Porcentaje de solicitudes completadas con retraso
     * @param requestsByCategory         Solicitudes por categoría
     * @param requestsByPriority         Solicitudes por prioridad
     * @param requestsByMonth            Solicitudes por mes
     */
    public TaskRequestRequesterStatsDto(
            long totalRequests,
            long pendingRequests,
            long assignedRequests,
            long inProgressRequests,
            long completedRequests,
            long rejectedRequests,
            long cancelledRequests,
            double averageAssignmentTime,
            double averageCompletionTime,
            double onTimeCompletionPercentage,
            double lateCompletionPercentage,
            Map<String, Long> requestsByCategory,
            Map<String, Long> requestsByPriority,
            Map<String, Long> requestsByMonth) {
        this.totalRequests = totalRequests;
        this.pendingRequests = pendingRequests;
        this.assignedRequests = assignedRequests;
        this.inProgressRequests = inProgressRequests;
        this.completedRequests = completedRequests;
        this.rejectedRequests = rejectedRequests;
        this.cancelledRequests = cancelledRequests;
        this.averageAssignmentTime = averageAssignmentTime;
        this.averageCompletionTime = averageCompletionTime;
        this.onTimeCompletionPercentage = onTimeCompletionPercentage;
        this.lateCompletionPercentage = lateCompletionPercentage;
        this.requestsByCategory = requestsByCategory;
        this.requestsByPriority = requestsByPriority;
        this.requestsByMonth = requestsByMonth;
    }

    // Getters y setters

    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getAssignedRequests() {
        return assignedRequests;
    }

    public void setAssignedRequests(long assignedRequests) {
        this.assignedRequests = assignedRequests;
    }

    public long getInProgressRequests() {
        return inProgressRequests;
    }

    public void setInProgressRequests(long inProgressRequests) {
        this.inProgressRequests = inProgressRequests;
    }

    public long getCompletedRequests() {
        return completedRequests;
    }

    public void setCompletedRequests(long completedRequests) {
        this.completedRequests = completedRequests;
    }

    public long getRejectedRequests() {
        return rejectedRequests;
    }

    public void setRejectedRequests(long rejectedRequests) {
        this.rejectedRequests = rejectedRequests;
    }

    public long getCancelledRequests() {
        return cancelledRequests;
    }

    public void setCancelledRequests(long cancelledRequests) {
        this.cancelledRequests = cancelledRequests;
    }

    public double getAverageAssignmentTime() {
        return averageAssignmentTime;
    }

    public void setAverageAssignmentTime(double averageAssignmentTime) {
        this.averageAssignmentTime = averageAssignmentTime;
    }

    public double getAverageCompletionTime() {
        return averageCompletionTime;
    }

    public void setAverageCompletionTime(double averageCompletionTime) {
        this.averageCompletionTime = averageCompletionTime;
    }

    public double getOnTimeCompletionPercentage() {
        return onTimeCompletionPercentage;
    }

    public void setOnTimeCompletionPercentage(double onTimeCompletionPercentage) {
        this.onTimeCompletionPercentage = onTimeCompletionPercentage;
    }

    public double getLateCompletionPercentage() {
        return lateCompletionPercentage;
    }

    public void setLateCompletionPercentage(double lateCompletionPercentage) {
        this.lateCompletionPercentage = lateCompletionPercentage;
    }

    public Map<String, Long> getRequestsByCategory() {
        return requestsByCategory;
    }

    public void setRequestsByCategory(Map<String, Long> requestsByCategory) {
        this.requestsByCategory = requestsByCategory;
    }

    public Map<String, Long> getRequestsByPriority() {
        return requestsByPriority;
    }

    public void setRequestsByPriority(Map<String, Long> requestsByPriority) {
        this.requestsByPriority = requestsByPriority;
    }

    public Map<String, Long> getRequestsByMonth() {
        return requestsByMonth;
    }

    public void setRequestsByMonth(Map<String, Long> requestsByMonth) {
        this.requestsByMonth = requestsByMonth;
    }
}
