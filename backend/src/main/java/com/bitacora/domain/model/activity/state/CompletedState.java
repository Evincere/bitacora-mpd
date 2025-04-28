package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatusNew;

/**
 * Estado COMPLETED (Completada) de una actividad.
 */
public class CompletedState extends AbstractActivityState {

    /**
     * Constructor.
     */
    public CompletedState() {
        super(ActivityStatusNew.COMPLETED);
    }

    @Override
    public ActivityState approve(final ActivityExtended activity, final String notes) {
        activity.approve(notes);
        return new ApprovedState();
    }

    @Override
    public ActivityState reject(final ActivityExtended activity, final String notes) {
        activity.reject(notes);
        return new RejectedState();
    }
}
