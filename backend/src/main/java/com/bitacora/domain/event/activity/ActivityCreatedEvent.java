package com.bitacora.domain.event.activity;

import com.bitacora.domain.event.AbstractDomainEvent;
import com.bitacora.domain.model.activity.Activity;

/**
 * Evento de dominio que se dispara cuando se crea una actividad.
 */
public class ActivityCreatedEvent extends AbstractDomainEvent {
    
    private final Long activityId;
    private final String description;
    private final Long userId;
    
    /**
     * Constructor para crear una instancia de ActivityCreatedEvent.
     * 
     * @param activity La actividad creada
     */
    public ActivityCreatedEvent(Activity activity) {
        super();
        this.activityId = activity.getId();
        this.description = activity.getDescription();
        this.userId = activity.getUserId();
    }
    
    /**
     * Obtiene el ID de la actividad.
     * 
     * @return El ID de la actividad
     */
    public Long getActivityId() {
        return activityId;
    }
    
    /**
     * Obtiene la descripción de la actividad.
     * 
     * @return La descripción de la actividad
     */
    public String getDescription() {
        return description;
    }
    
    /**
     * Obtiene el ID del usuario que creó la actividad.
     * 
     * @return El ID del usuario
     */
    public Long getUserId() {
        return userId;
    }
}
