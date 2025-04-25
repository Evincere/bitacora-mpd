package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityStatusNew;

/**
 * Estado CANCELLED (Cancelada) de una actividad.
 */
public class CancelledState extends AbstractActivityState {
    
    /**
     * Constructor.
     */
    public CancelledState() {
        super(ActivityStatusNew.CANCELLED);
    }
    
    // No hay transiciones válidas desde el estado CANCELLED
}
