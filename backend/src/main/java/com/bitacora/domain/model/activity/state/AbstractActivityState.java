package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatusNew;

/**
 * Clase abstracta base para los estados de actividad.
 * Proporciona implementaciones por defecto para las transiciones no válidas.
 */
public abstract class AbstractActivityState implements ActivityState {
    
    protected final ActivityStatusNew status;
    
    /**
     * Constructor.
     * 
     * @param status El estado
     */
    protected AbstractActivityState(ActivityStatusNew status) {
        this.status = status;
    }
    
    @Override
    public ActivityStatusNew getStatus() {
        return status;
    }
    
    @Override
    public ActivityState request(ActivityExtended activity, Long requesterId, String notes) {
        throw new IllegalStateException("No se puede solicitar una actividad en estado " + status);
    }
    
    @Override
    public ActivityState assign(ActivityExtended activity, Long assignerId, Long executorId, String notes) {
        throw new IllegalStateException("No se puede asignar una actividad en estado " + status);
    }
    
    @Override
    public ActivityState start(ActivityExtended activity, String notes) {
        throw new IllegalStateException("No se puede iniciar una actividad en estado " + status);
    }
    
    @Override
    public ActivityState complete(ActivityExtended activity, String notes, Integer actualHours) {
        throw new IllegalStateException("No se puede completar una actividad en estado " + status);
    }
    
    @Override
    public ActivityState approve(ActivityExtended activity, String notes) {
        throw new IllegalStateException("No se puede aprobar una actividad en estado " + status);
    }
    
    @Override
    public ActivityState reject(ActivityExtended activity, String notes) {
        throw new IllegalStateException("No se puede rechazar una actividad en estado " + status);
    }
    
    @Override
    public ActivityState cancel(ActivityExtended activity, String notes) {
        // La cancelación es posible en cualquier estado excepto COMPLETED, APPROVED, REJECTED y CANCELLED
        if (status == ActivityStatusNew.COMPLETED || 
            status == ActivityStatusNew.APPROVED || 
            status == ActivityStatusNew.REJECTED || 
            status == ActivityStatusNew.CANCELLED) {
            throw new IllegalStateException("No se puede cancelar una actividad en estado " + status);
        }
        
        activity.cancel(notes);
        return new CancelledState();
    }
}
