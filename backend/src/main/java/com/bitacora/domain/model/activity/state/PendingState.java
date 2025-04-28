package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatusNew;

/**
 * Implementación del estado PENDIENTE para una actividad.
 * Este estado representa una actividad que aún no ha sido solicitada.
 */
public class PendingState extends AbstractActivityState {

    /**
     * Constructor.
     */
    public PendingState() {
        super(ActivityStatusNew.REQUESTED); // Usamos REQUESTED como equivalente a PENDIENTE
    }

    @Override
    public ActivityState request(final ActivityExtended activity, final Long requesterId, final String notes) {
        activity.request(requesterId, notes);
        return new RequestedState();
    }
}
