package com.bitacora.domain.model.activity;

/**
 * Enumeración que representa los diferentes estados de una actividad en el
 * sistema de gestión de tareas.
 */
public enum ActivityStatusNew {
    REQUESTED("Solicitada"),
    ASSIGNED("Asignada"),
    IN_PROGRESS("En Progreso"),
    COMPLETED("Completada"),
    APPROVED("Aprobada"),
    REJECTED("Rechazada"),
    CANCELLED("Cancelada");

    private final String displayName;

    ActivityStatusNew(final String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Convierte un string en un ActivityStatusNew, ignorando mayúsculas/minúsculas
     * y acentos.
     * Si no se encuentra una coincidencia, devuelve REQUESTED.
     *
     * @param text El texto a convertir
     * @return El ActivityStatusNew correspondiente o REQUESTED si no hay
     *         coincidencia
     */
    public static ActivityStatusNew fromString(final String text) {
        if (text == null || text.trim().isEmpty()) {
            return REQUESTED;
        }

        for (final ActivityStatusNew status : ActivityStatusNew.values()) {
            if (status.name().equalsIgnoreCase(text)
                    || status.getDisplayName().equalsIgnoreCase(text)) {
                return status;
            }
        }
        return REQUESTED;
    }
}
