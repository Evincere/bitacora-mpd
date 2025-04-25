package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityStatusNew;

/**
 * Estado APPROVED (Aprobada) de una actividad.
 */
public class ApprovedState extends AbstractActivityState {
    
    /**
     * Constructor.
     */
    public ApprovedState() {
        super(ActivityStatusNew.APPROVED);
    }
    
    // No hay transiciones válidas desde el estado APPROVED
}
