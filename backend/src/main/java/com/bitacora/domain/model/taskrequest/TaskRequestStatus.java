package com.bitacora.domain.model.taskrequest;

/**
 * Enumeración que representa los posibles estados de una solicitud de tarea.
 */
public enum TaskRequestStatus {
    /**
     * Borrador: La solicitud está siendo creada y aún no ha sido enviada.
     */
    DRAFT("Borrador"),

    /**
     * Enviada: La solicitud ha sido enviada al asignador pero aún no ha sido
     * procesada.
     */
    SUBMITTED("Enviada"),

    /**
     * Asignada: La solicitud ha sido procesada por el asignador y asignada a un
     * ejecutor.
     */
    ASSIGNED("Asignada"),

    /**
     * En Progreso: La tarea ha sido iniciada por el ejecutor y está en proceso.
     */
    IN_PROGRESS("En Progreso"),

    /**
     * Completada: La tarea solicitada ha sido completada.
     */
    COMPLETED("Completada"),

    /**
     * Cancelada: La solicitud ha sido cancelada y no será procesada.
     */
    CANCELLED("Cancelada"),

    /**
     * Rechazada: La solicitud ha sido rechazada por el asignador y debe ser
     * corregida.
     */
    REJECTED("Rechazada");

    private final String displayName;

    TaskRequestStatus(final String displayName) {
        this.displayName = displayName;
    }

    /**
     * Obtiene el nombre para mostrar del estado.
     *
     * @return El nombre para mostrar
     */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Convierte una cadena en un valor de la enumeración TaskRequestStatus.
     *
     * @param status La cadena a convertir
     * @return El valor de la enumeración correspondiente
     * @throws IllegalArgumentException Si la cadena no corresponde a ningún valor
     *                                  de la enumeración
     */
    public static TaskRequestStatus fromString(final String status) {
        for (TaskRequestStatus s : TaskRequestStatus.values()) {
            if (s.name().equalsIgnoreCase(status)
                    || s.getDisplayName().equalsIgnoreCase(status)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Estado de solicitud no válido: " + status);
    }
}
