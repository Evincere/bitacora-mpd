package com.bitacora.domain.model.activity;

/**
 * Enumeración que representa los diferentes niveles de prioridad para las
 * actividades.
 */
public enum ActivityPriority {
    CRITICAL(1, "Crítica"),
    HIGH(2, "Alta"),
    MEDIUM(3, "Media"),
    LOW(4, "Baja"),
    TRIVIAL(5, "Trivial");

    private final int value;
    private final String displayName;

    ActivityPriority(final int value, final String displayName) {
        this.value = value;
        this.displayName = displayName;
    }

    public int getValue() {
        return value;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Obtiene una prioridad a partir de su valor numérico.
     *
     * @param value El valor numérico
     * @return La prioridad correspondiente o MEDIUM si no hay coincidencia
     */
    public static ActivityPriority fromValue(final int value) {
        for (final ActivityPriority priority : ActivityPriority.values()) {
            if (priority.getValue() == value) {
                return priority;
            }
        }
        return MEDIUM;
    }

    /**
     * Convierte un string en un ActivityPriority, ignorando mayúsculas/minúsculas y
     * acentos.
     * Si no se encuentra una coincidencia, devuelve MEDIUM.
     *
     * @param text El texto a convertir
     * @return El ActivityPriority correspondiente o MEDIUM si no hay coincidencia
     */
    public static ActivityPriority fromString(final String text) {
        if (text == null || text.trim().isEmpty()) {
            return MEDIUM;
        }

        for (final ActivityPriority priority : ActivityPriority.values()) {
            if (priority.name().equalsIgnoreCase(text)
                    || priority.getDisplayName().equalsIgnoreCase(text)) {
                return priority;
            }
        }

        // Intentar convertir a número
        try {
            int value = Integer.parseInt(text);
            return fromValue(value);
        } catch (final NumberFormatException e) {
            return MEDIUM;
        }
    }
}
