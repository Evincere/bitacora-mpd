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
    public ActivityState assign(final ActivityExtended activity, final Long assignerId, final Long executorId,
            final String notes) {
        activity.assign(assignerId, executorId, notes);
        return new AssignedState();
    }

    @Override
    public ActivityState start(final ActivityExtended activity, final String notes) {
        activity.start(notes);
        return new InProgressState();
    }
}
