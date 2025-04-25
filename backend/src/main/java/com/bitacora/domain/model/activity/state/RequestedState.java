package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatusNew;

/**
 * Estado REQUESTED (Solicitada) de una actividad.
 */
public class RequestedState extends AbstractActivityState {
    
    /**
     * Constructor.
     */
    public RequestedState() {
        super(ActivityStatusNew.REQUESTED);
    }
    
    @Override
    public ActivityState assign(ActivityExtended activity, Long assignerId, Long executorId, String notes) {
        activity.assign(assignerId, executorId, notes);
        return new AssignedState();
    }
}
