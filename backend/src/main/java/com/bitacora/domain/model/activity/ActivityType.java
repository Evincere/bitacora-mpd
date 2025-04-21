package com.bitacora.domain.model.activity;

/**
 * Enumeración que representa los diferentes tipos de actividades en el sistema.
 */
public enum ActivityType {
    REUNION("Reunión"),
    AUDIENCIA("Audiencia"),
    ENTREVISTA("Entrevista"),
    INVESTIGACION("Investigación"),
    DICTAMEN("Dictamen"),
    INFORME("Informe"),
    OTRO("Otro");

    private final String displayName;

    ActivityType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Convierte un string en un ActivityType, ignorando mayúsculas/minúsculas y acentos.
     * Si no se encuentra una coincidencia, devuelve OTRO.
     *
     * @param text El texto a convertir
     * @return El ActivityType correspondiente o OTRO si no hay coincidencia
     */
    public static ActivityType fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return OTRO;
        }

        for (ActivityType type : ActivityType.values()) {
            if (type.name().equalsIgnoreCase(text) || 
                type.getDisplayName().equalsIgnoreCase(text)) {
                return type;
            }
        }
        return OTRO;
    }
}
