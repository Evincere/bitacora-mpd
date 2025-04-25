package com.bitacora.domain.model.user;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Enumeración que representa los diferentes roles de usuario en el sistema de gestión de tareas.
 */
public enum UserRoleNew {
    ADMIN("Administrador", 
          new HashSet<>(Arrays.asList(
              Permission.READ_ACTIVITIES,
              Permission.WRITE_ACTIVITIES,
              Permission.DELETE_ACTIVITIES,
              Permission.READ_USERS,
              Permission.WRITE_USERS,
              Permission.DELETE_USERS,
              Permission.GENERATE_REPORTS
          ))),
    
    ASIGNADOR("Asignador", 
          new HashSet<>(Arrays.asList(
              Permission.READ_ACTIVITIES,
              Permission.WRITE_ACTIVITIES,
              Permission.READ_USERS,
              Permission.GENERATE_REPORTS
          ))),
    
    SOLICITANTE("Solicitante", 
          new HashSet<>(Arrays.asList(
              Permission.READ_ACTIVITIES,
              Permission.WRITE_ACTIVITIES
          ))),
    
    EJECUTOR("Ejecutor", 
          new HashSet<>(Arrays.asList(
              Permission.READ_ACTIVITIES,
              Permission.WRITE_ACTIVITIES
          ))));

    private final String displayName;
    private final Set<Permission> permissions;

    UserRoleNew(String displayName, Set<Permission> permissions) {
        this.displayName = displayName;
        this.permissions = Collections.unmodifiableSet(permissions);
    }

    public String getDisplayName() {
        return displayName;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    /**
     * Convierte un string en un UserRoleNew, ignorando mayúsculas/minúsculas y acentos.
     * Si no se encuentra una coincidencia, devuelve EJECUTOR.
     *
     * @param text El texto a convertir
     * @return El UserRoleNew correspondiente o EJECUTOR si no hay coincidencia
     */
    public static UserRoleNew fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return EJECUTOR;
        }

        for (UserRoleNew role : UserRoleNew.values()) {
            if (role.name().equalsIgnoreCase(text) || 
                role.getDisplayName().equalsIgnoreCase(text)) {
                return role;
            }
        }
        return EJECUTOR;
    }
}
