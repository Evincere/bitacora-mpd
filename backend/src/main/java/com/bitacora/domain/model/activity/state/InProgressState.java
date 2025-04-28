package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatusNew;

/**
 * Estado IN_PROGRESS (En Progreso) de una actividad.
 */
public class InProgressState extends AbstractActivityState {

    /**
     * Constructor.
     */
    public InProgressState() {
        super(ActivityStatusNew.IN_PROGRESS);
    }

    @Override
    public ActivityState complete(final ActivityExtended activity, final String notes, final Integer actualHours) {
        activity.complete(notes, actualHours);
        return new CompletedState();
    }
}
