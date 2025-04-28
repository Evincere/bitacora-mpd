package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatusNew;

/**
 * Estado ASSIGNED (Asignada) de una actividad.
 */
public class AssignedState extends AbstractActivityState {

    /**
     * Constructor.
     */
    public AssignedState() {
        super(ActivityStatusNew.ASSIGNED);
    }

    @Override
    public ActivityState start(final ActivityExtended activity, final String notes) {
        activity.start(notes);
        return new InProgressState();
    }
}
