package com.bitacora.domain.model.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Modelo de dominio para notificaciones de asignación de tareas.
 * Extiende la clase base RealTimeNotification.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TaskAssignmentNotification extends RealTimeNotification {
    
    /**
     * Identificador de la actividad asignada.
     */
    private Long activityId;
    
    /**
     * Título de la actividad asignada.
     */
    private String activityTitle;
    
    /**
     * Identificador del usuario que asignó la actividad.
     */
    private Long assignerId;
    
    /**
     * Nombre del usuario que asignó la actividad.
     */
    private String assignerName;
    
    /**
     * Fecha límite de la actividad, si existe.
     */
    private Long dueDate;
}
