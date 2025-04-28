package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.activity.ActivityStatusNew;

/**
 * Fábrica para crear estados de actividad.
 * Implementa el patrón Factory para crear instancias de estados concretos.
 */
public final class ActivityStateFactory {

    private ActivityStateFactory() {
        // Constructor privado para evitar instanciación
    }

    /**
     * Crea un estado de actividad a partir de un estado.
     *
     * @param status El estado
     * @return El estado de actividad
     */
    public static ActivityState createState(final ActivityStatusNew status) {
        if (status == null) {
            throw new IllegalArgumentException("El estado no puede ser nulo");
        }

        switch (status) {
            case REQUESTED:
                return new RequestedState();
            case ASSIGNED:
                return new AssignedState();
            case IN_PROGRESS:
                return new InProgressState();
            case COMPLETED:
                return new CompletedState();
            case APPROVED:
                return new ApprovedState();
            case REJECTED:
                return new RejectedState();
            case CANCELLED:
                return new CancelledState();
            default:
                throw new IllegalArgumentException("Estado no soportado: " + status);
        }
    }

    /**
     * Crea un estado de actividad a partir de un estado de la enumeración
     * ActivityStatus.
     *
     * @param status El estado de ActivityStatus
     * @return El estado de actividad
     */
    public static ActivityState createStateFromActivityStatus(final ActivityStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("El estado no puede ser nulo");
        }

        switch (status) {
            case PENDIENTE:
                return new PendingState();
            case EN_PROGRESO:
                return new InProgressState();
            case COMPLETADA:
                return new CompletedState();
            case CANCELADA:
                return new CancelledState();
            case ARCHIVADA:
                return new CompletedState(); // Usamos CompletedState como equivalente a ARCHIVADA
            default:
                throw new IllegalArgumentException("Estado no soportado: " + status);
        }
    }
}
