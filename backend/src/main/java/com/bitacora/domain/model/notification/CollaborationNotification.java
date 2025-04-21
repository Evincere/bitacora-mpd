package com.bitacora.domain.model.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Modelo de dominio para notificaciones de colaboración en tiempo real.
 * Extiende la clase base RealTimeNotification.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CollaborationNotification extends RealTimeNotification {
    
    /**
     * Identificador de la actividad en la que se está colaborando.
     */
    private Long activityId;
    
    /**
     * Título de la actividad en la que se está colaborando.
     */
    private String activityTitle;
    
    /**
     * Identificador del usuario que está realizando la acción.
     */
    private Long userId;
    
    /**
     * Nombre del usuario que está realizando la acción.
     */
    private String userName;
    
    /**
     * Tipo de acción que está realizando el usuario.
     */
    private CollaborationAction action;
    
    /**
     * Tipos de acciones de colaboración disponibles.
     */
    public enum CollaborationAction {
        /**
         * Usuario está viendo la actividad.
         */
        VIEWING,
        
        /**
         * Usuario está editando la actividad.
         */
        EDITING,
        
        /**
         * Usuario ha comentado en la actividad.
         */
        COMMENTED,
        
        /**
         * Usuario ha dejado de ver/editar la actividad.
         */
        LEFT
    }
}
