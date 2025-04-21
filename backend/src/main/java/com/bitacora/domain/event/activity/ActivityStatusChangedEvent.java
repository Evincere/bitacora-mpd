package com.bitacora.domain.event.activity;

import com.bitacora.domain.event.AbstractDomainEvent;
import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityStatus;

/**
 * Evento de dominio que se dispara cuando cambia el estado de una actividad.
 */
public class ActivityStatusChangedEvent extends AbstractDomainEvent {
    
    private final Long activityId;
    private final ActivityStatus oldStatus;
    private final ActivityStatus newStatus;
    private final Long userId;
    
    /**
     * Constructor para crear una instancia de ActivityStatusChangedEvent.
     * 
     * @param activity La actividad cuyo estado ha cambiado
     * @param oldStatus El estado anterior de la actividad
     */
    public ActivityStatusChangedEvent(Activity activity, ActivityStatus oldStatus) {
        super();
        this.activityId = activity.getId();
        this.oldStatus = oldStatus;
        this.newStatus = activity.getStatus();
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
     * Obtiene el estado anterior de la actividad.
     * 
     * @return El estado anterior
     */
    public ActivityStatus getOldStatus() {
        return oldStatus;
    }
    
    /**
     * Obtiene el nuevo estado de la actividad.
     * 
     * @return El nuevo estado
     */
    public ActivityStatus getNewStatus() {
        return newStatus;
    }
    
    /**
     * Obtiene el ID del usuario que cambió el estado de la actividad.
     * 
     * @return El ID del usuario
     */
    public Long getUserId() {
        return userId;
    }
}
