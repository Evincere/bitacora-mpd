package com.bitacora.infrastructure.persistence.projection;

import java.time.LocalDateTime;

/**
 * Proyección que contiene un resumen de una actividad.
 * Esta interfaz se utiliza para optimizar las consultas que solo necesitan
 * información básica de las actividades.
 */
public interface ActivitySummary {
    
    /**
     * Obtiene el ID de la actividad.
     *
     * @return El ID de la actividad
     */
    Long getId();
    
    /**
     * Obtiene la fecha de la actividad.
     *
     * @return La fecha de la actividad
     */
    LocalDateTime getDate();
    
    /**
     * Obtiene el tipo de actividad.
     *
     * @return El tipo de actividad
     */
    String getType();
    
    /**
     * Obtiene la descripción de la actividad.
     *
     * @return La descripción de la actividad
     */
    String getDescription();
    
    /**
     * Obtiene el estado de la actividad.
     *
     * @return El estado de la actividad
     */
    String getStatus();
    
    /**
     * Obtiene la persona relacionada con la actividad.
     *
     * @return La persona relacionada con la actividad
     */
    String getPerson();
    
    /**
     * Obtiene la fecha de creación de la actividad.
     *
     * @return La fecha de creación de la actividad
     */
    LocalDateTime getCreatedAt();
    
    /**
     * Obtiene el ID del usuario que creó la actividad.
     *
     * @return El ID del usuario que creó la actividad
     */
    Long getUserId();
}
