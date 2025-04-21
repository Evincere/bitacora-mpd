package com.bitacora.domain.model.user;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Enumeración que representa los diferentes roles de usuario en el sistema.
 */
public enum UserRole {
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
    
    SUPERVISOR("Supervisor", 
          new HashSet<>(Arrays.asList(
              Permission.READ_ACTIVITIES,
              Permission.WRITE_ACTIVITIES,
              Permission.READ_USERS,
              Permission.GENERATE_REPORTS
          ))),
    
    USUARIO("Usuario", 
          new HashSet<>(Arrays.asList(
              Permission.READ_ACTIVITIES,
              Permission.WRITE_ACTIVITIES
          ))),
    
    CONSULTA("Consulta", 
          new HashSet<>(Arrays.asList(
              Permission.READ_ACTIVITIES
          )));

    private final String displayName;
    private final Set<Permission> permissions;

    UserRole(String displayName, Set<Permission> permissions) {
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
     * Convierte un string en un UserRole, ignorando mayúsculas/minúsculas y acentos.
     * Si no se encuentra una coincidencia, devuelve USUARIO.
     *
     * @param text El texto a convertir
     * @return El UserRole correspondiente o USUARIO si no hay coincidencia
     */
    public static UserRole fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return USUARIO;
        }

        for (UserRole role : UserRole.values()) {
            if (role.name().equalsIgnoreCase(text) || 
                role.getDisplayName().equalsIgnoreCase(text)) {
                return role;
            }
        }
        return USUARIO;
    }
}
