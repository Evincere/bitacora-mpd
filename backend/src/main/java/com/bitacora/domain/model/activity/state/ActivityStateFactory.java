package com.bitacora.domain.model.activity.state;

import com.bitacora.domain.model.activity.ActivityStatusNew;

/**
 * Fábrica para crear estados de actividad.
 * Implementa el patrón Factory para crear instancias de estados concretos.
 */
public class ActivityStateFactory {
    
    /**
     * Crea un estado de actividad a partir de un estado.
     * 
     * @param status El estado
     * @return El estado de actividad
     */
    public static ActivityState createState(ActivityStatusNew status) {
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
}
