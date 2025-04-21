package com.bitacora.domain.model.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Modelo de dominio para notificaciones de cambio de estado de tareas.
 * Extiende la clase base RealTimeNotification.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TaskStatusChangeNotification extends RealTimeNotification {
    
    /**
     * Identificador de la actividad cuyo estado ha cambiado.
     */
    private Long activityId;
    
    /**
     * Título de la actividad cuyo estado ha cambiado.
     */
    private String activityTitle;
    
    /**
     * Estado anterior de la actividad.
     */
    private String previousStatus;
    
    /**
     * Nuevo estado de la actividad.
     */
    private String newStatus;
    
    /**
     * Identificador del usuario que cambió el estado.
     */
    private Long changedById;
    
    /**
     * Nombre del usuario que cambió el estado.
     */
    private String changedByName;
}
