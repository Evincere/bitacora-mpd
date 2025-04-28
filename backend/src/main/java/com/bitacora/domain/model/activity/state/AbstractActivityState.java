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
    protected AbstractActivityState(final ActivityStatusNew status) {
        this.status = status;
    }

    @Override
    public ActivityStatusNew getStatus() {
        return status;
    }

    @Override
    public ActivityState request(final ActivityExtended activity, final Long requesterId, final String notes) {
        throw new IllegalStateException("No se puede solicitar una actividad en estado " + status);
    }

    @Override
    public ActivityState assign(final ActivityExtended activity, final Long assignerId, final Long executorId,
            final String notes) {
        throw new IllegalStateException("No se puede asignar una actividad en estado " + status);
    }

    @Override
    public ActivityState start(final ActivityExtended activity, final String notes) {
        throw new IllegalStateException("No se puede iniciar una actividad en estado " + status);
    }

    @Override
    public ActivityState complete(final ActivityExtended activity, final String notes, final Integer actualHours) {
        throw new IllegalStateException("No se puede completar una actividad en estado " + status);
    }

    @Override
    public ActivityState approve(final ActivityExtended activity, final String notes) {
        throw new IllegalStateException("No se puede aprobar una actividad en estado " + status);
    }

    @Override
    public ActivityState reject(final ActivityExtended activity, final String notes) {
        throw new IllegalStateException("No se puede rechazar una actividad en estado " + status);
    }

    @Override
    public ActivityState cancel(final ActivityExtended activity, final String notes) {
        // La cancelación es posible en cualquier estado excepto COMPLETED, APPROVED,
        // REJECTED y CANCELLED
        if (status == ActivityStatusNew.COMPLETED
                || status == ActivityStatusNew.APPROVED
                || status == ActivityStatusNew.REJECTED
                || status == ActivityStatusNew.CANCELLED) {
            throw new IllegalStateException("No se puede cancelar una actividad en estado " + status);
        }

        activity.cancel(notes);
        return new CancelledState();
    }
}
