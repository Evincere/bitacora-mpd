package com.bitacora.domain.model.activity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * Entidad de dominio extendida que representa una actividad en el sistema de
 * gestión de tareas.
 * Extiende la entidad Activity con campos adicionales para el flujo de trabajo.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ActivityExtended extends Activity {
    // Campos para el flujo de trabajo
    private Long requesterId; // ID del SOLICITANTE
    private Long assignerId; // ID del ASIGNADOR
    private Long executorId; // ID del EJECUTOR
    private LocalDateTime requestDate; // Fecha de solicitud
    private LocalDateTime assignmentDate; // Fecha de asignación
    private LocalDateTime startDate; // Fecha de inicio
    private LocalDateTime completionDate; // Fecha de finalización
    private LocalDateTime approvalDate; // Fecha de aprobación

    // Campos para seguimiento
    private String requestNotes; // Notas del SOLICITANTE
    private String assignmentNotes; // Notas del ASIGNADOR al asignar
    private String executionNotes; // Notas del EJECUTOR durante la ejecución
    private String completionNotes; // Notas del EJECUTOR al completar
    private String approvalNotes; // Notas del ASIGNADOR al aprobar

    // Campos para métricas
    private Integer estimatedHours; // Horas estimadas
    private Integer actualHours; // Horas reales
    private ActivityPriority priority; // Prioridad
    private ActivityCategory category; // Categoría de la tarea

    /**
     * Cambia el estado de la actividad a REQUESTED (Solicitada).
     *
     * @param requesterId ID del usuario solicitante
     * @param notes       Notas de la solicitud
     */
    public void request(Long requesterId, String notes) {
        this.requesterId = requesterId;
        this.requestNotes = notes;
        this.requestDate = LocalDateTime.now();

        // Si el userId no está establecido, usar el requesterId
        if (this.getUserId() == null) {
            this.setUserId(requesterId);
        }

        changeStatus(ActivityStatusNew.REQUESTED);
    }

    /**
     * Cambia el estado de la actividad a ASSIGNED (Asignada).
     *
     * @param assignerId ID del usuario asignador
     * @param executorId ID del usuario ejecutor
     * @param notes      Notas de la asignación
     */
    public void assign(Long assignerId, Long executorId, String notes) {
        this.assignerId = assignerId;
        this.executorId = executorId;
        this.assignmentNotes = notes;
        this.assignmentDate = LocalDateTime.now();
        changeStatus(ActivityStatusNew.ASSIGNED);
    }

    /**
     * Cambia el estado de la actividad a IN_PROGRESS (En Progreso).
     *
     * @param notes Notas de inicio
     */
    public void start(String notes) {
        this.executionNotes = notes;
        this.startDate = LocalDateTime.now();
        changeStatus(ActivityStatusNew.IN_PROGRESS);
    }

    /**
     * Cambia el estado de la actividad a COMPLETED (Completada).
     *
     * @param notes       Notas de finalización
     * @param actualHours Horas reales dedicadas
     */
    public void complete(String notes, Integer actualHours) {
        this.completionNotes = notes;
        this.actualHours = actualHours;
        this.completionDate = LocalDateTime.now();
        changeStatus(ActivityStatusNew.COMPLETED);
    }

    /**
     * Cambia el estado de la actividad a APPROVED (Aprobada).
     *
     * @param notes Notas de aprobación
     */
    public void approve(String notes) {
        this.approvalNotes = notes;
        this.approvalDate = LocalDateTime.now();
        changeStatus(ActivityStatusNew.APPROVED);
    }

    /**
     * Cambia el estado de la actividad a REJECTED (Rechazada).
     *
     * @param notes Notas de rechazo
     */
    public void reject(String notes) {
        this.approvalNotes = notes;
        this.approvalDate = LocalDateTime.now();
        changeStatus(ActivityStatusNew.REJECTED);
    }

    /**
     * Cambia el estado de la actividad a CANCELLED (Cancelada).
     *
     * @param notes Notas de cancelación
     */
    public void cancel(String notes) {
        this.approvalNotes = notes;
        changeStatus(ActivityStatusNew.CANCELLED);
    }

    /**
     * Cambia el estado de la actividad y actualiza la fecha del último cambio de
     * estado.
     *
     * @param newStatus El nuevo estado de la actividad
     */
    public void changeStatus(ActivityStatusNew newStatus) {
        // Aquí necesitamos convertir ActivityStatusNew a ActivityStatus
        // Esto es temporal hasta que se complete la migración
        ActivityStatus status = mapNewStatusToOld(newStatus);
        super.changeStatus(status);
    }

    /**
     * Mapea un estado nuevo (ActivityStatusNew) a un estado antiguo
     * (ActivityStatus).
     * Método temporal para la migración.
     *
     * @param newStatus El nuevo estado
     * @return El estado antiguo equivalente
     */
    private ActivityStatus mapNewStatusToOld(ActivityStatusNew newStatus) {
        switch (newStatus) {
            case REQUESTED:
                // Mantener el estado REQUESTED para diferenciar solicitudes de actividades
                // regulares
                return ActivityStatus.valueOf("REQUESTED");
            case ASSIGNED:
            case IN_PROGRESS:
                return ActivityStatus.EN_PROGRESO;
            case COMPLETED:
            case APPROVED:
                return ActivityStatus.COMPLETADA;
            case REJECTED:
            case CANCELLED:
                return ActivityStatus.CANCELADA;
            default:
                return ActivityStatus.PENDIENTE;
        }
    }
}
