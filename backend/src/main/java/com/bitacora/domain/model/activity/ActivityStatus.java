package com.bitacora.domain.model.activity;

/**
 * Enumeración que representa los diferentes estados de una actividad en el
 * sistema.
 */
public enum ActivityStatus {
    PENDIENTE("Pendiente"),
    EN_PROGRESO("En Progreso"),
    COMPLETADA("Completada"),
    CANCELADA("Cancelada"),
    ARCHIVADA("Archivada"),
    // Estados nuevos para el flujo de trabajo
    REQUESTED("Solicitada"),
    ASSIGNED("Asignada"),
    IN_PROGRESS("En Ejecución"),
    COMPLETED("Finalizada"),
    APPROVED("Aprobada"),
    REJECTED("Rechazada");

    private final String displayName;

    ActivityStatus(final String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Convierte un string en un ActivityStatus, ignorando mayúsculas/minúsculas y
     * acentos.
     * Si no se encuentra una coincidencia, devuelve PENDIENTE.
     *
     * @param text El texto a convertir
     * @return El ActivityStatus correspondiente o PENDIENTE si no hay coincidencia
     */
    public static ActivityStatus fromString(final String text) {
        if (text == null || text.trim().isEmpty()) {
            return PENDIENTE;
        }

        for (final ActivityStatus status : ActivityStatus.values()) {
            if (status.name().equalsIgnoreCase(text)
                    || status.getDisplayName().equalsIgnoreCase(text)) {
                return status;
            }
        }
        return PENDIENTE;
    }
}
