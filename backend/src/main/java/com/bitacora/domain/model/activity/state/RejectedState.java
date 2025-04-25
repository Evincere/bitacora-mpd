package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatusNew;

/**
 * Estado REJECTED (Rechazada) de una actividad.
 */
public class RejectedState extends AbstractActivityState {
    
    /**
     * Constructor.
     */
    public RejectedState() {
        super(ActivityStatusNew.REJECTED);
    }
    
    // No hay transiciones válidas desde el estado REJECTED
}
