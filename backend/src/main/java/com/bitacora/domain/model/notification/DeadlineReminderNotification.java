package com.bitacora.domain.model.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Modelo de dominio para notificaciones de recordatorio de fechas límite.
 * Extiende la clase base RealTimeNotification.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DeadlineReminderNotification extends RealTimeNotification {
    
    /**
     * Identificador de la actividad con fecha límite próxima.
     */
    private Long activityId;
    
    /**
     * Título de la actividad con fecha límite próxima.
     */
    private String activityTitle;
    
    /**
     * Fecha límite de la actividad en milisegundos desde la época Unix.
     */
    private Long dueDate;
    
    /**
     * Horas restantes hasta la fecha límite.
     */
    private Integer hoursRemaining;
    
    /**
     * Tipo de recordatorio (1 día, 4 horas, 1 hora, etc.).
     */
    private ReminderType reminderType;
    
    /**
     * Tipos de recordatorio disponibles.
     */
    public enum ReminderType {
        /**
         * Recordatorio de 1 día antes.
         */
        ONE_DAY,
        
        /**
         * Recordatorio de 4 horas antes.
         */
        FOUR_HOURS,
        
        /**
         * Recordatorio de 1 hora antes.
         */
        ONE_HOUR,
        
        /**
         * Recordatorio personalizado.
         */
        CUSTOM
    }
}
