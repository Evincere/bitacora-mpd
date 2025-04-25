package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatusNew;

/**
 * Interfaz que define el comportamiento de un estado de actividad.
 * Implementa el patrón State para gestionar las transiciones entre estados.
 */
public interface ActivityState {
    
    /**
     * Obtiene el estado actual de la actividad.
     * 
     * @return El estado actual
     */
    ActivityStatusNew getStatus();
    
    /**
     * Solicita una actividad.
     * 
     * @param activity La actividad
     * @param requesterId ID del solicitante
     * @param notes Notas de la solicitud
     * @return El nuevo estado
     * @throws IllegalStateException Si la transición no es válida
     */
    ActivityState request(ActivityExtended activity, Long requesterId, String notes);
    
    /**
     * Asigna una actividad.
     * 
     * @param activity La actividad
     * @param assignerId ID del asignador
     * @param executorId ID del ejecutor
     * @param notes Notas de la asignación
     * @return El nuevo estado
     * @throws IllegalStateException Si la transición no es válida
     */
    ActivityState assign(ActivityExtended activity, Long assignerId, Long executorId, String notes);
    
    /**
     * Inicia una actividad.
     * 
     * @param activity La actividad
     * @param notes Notas de inicio
     * @return El nuevo estado
     * @throws IllegalStateException Si la transición no es válida
     */
    ActivityState start(ActivityExtended activity, String notes);
    
    /**
     * Completa una actividad.
     * 
     * @param activity La actividad
     * @param notes Notas de finalización
     * @param actualHours Horas reales dedicadas
     * @return El nuevo estado
     * @throws IllegalStateException Si la transición no es válida
     */
    ActivityState complete(ActivityExtended activity, String notes, Integer actualHours);
    
    /**
     * Aprueba una actividad.
     * 
     * @param activity La actividad
     * @param notes Notas de aprobación
     * @return El nuevo estado
     * @throws IllegalStateException Si la transición no es válida
     */
    ActivityState approve(ActivityExtended activity, String notes);
    
    /**
     * Rechaza una actividad.
     * 
     * @param activity La actividad
     * @param notes Notas de rechazo
     * @return El nuevo estado
     * @throws IllegalStateException Si la transición no es válida
     */
    ActivityState reject(ActivityExtended activity, String notes);
    
    /**
     * Cancela una actividad.
     * 
     * @param activity La actividad
     * @param notes Notas de cancelación
     * @return El nuevo estado
     * @throws IllegalStateException Si la transición no es válida
     */
    ActivityState cancel(ActivityExtended activity, String notes);
}
