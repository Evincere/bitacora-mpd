package com.bitacora.domain.model.user;

/**
 * Enumeración que representa los diferentes permisos en el sistema.
 */
public enum Permission {
    READ_ACTIVITIES("Leer actividades"),
    WRITE_ACTIVITIES("Escribir actividades"),
    DELETE_ACTIVITIES("Eliminar actividades"),
    READ_USERS("Leer usuarios"),
    WRITE_USERS("Escribir usuarios"),
    DELETE_USERS("Eliminar usuarios"),
    GENERATE_REPORTS("Generar informes");

    private final String displayName;

    Permission(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Convierte un string en un Permission, ignorando mayúsculas/minúsculas y acentos.
     * Si no se encuentra una coincidencia, devuelve null.
     *
     * @param text El texto a convertir
     * @return El Permission correspondiente o null si no hay coincidencia
     */
    public static Permission fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return null;
        }

        for (Permission permission : Permission.values()) {
            if (permission.name().equalsIgnoreCase(text) || 
                permission.getDisplayName().equalsIgnoreCase(text)) {
                return permission;
            }
        }
        return null;
    }
}
