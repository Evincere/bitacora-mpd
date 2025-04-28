package com.bitacora.domain.model.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad de dominio que representa un usuario en el sistema.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String username;
    private Password password;
    private Email email;
    private PersonName personName;
    private UserRole role;
    private String position;
    private String department;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private Set<Permission> permissions = new HashSet<>();

    /**
     * Verifica si el usuario tiene un permiso específico.
     *
     * @param permission El permiso a verificar
     * @return true si el usuario tiene el permiso, false en caso contrario
     */
    public boolean hasPermission(final Permission permission) {
        return permissions.contains(permission)
                || (role != null && role.getPermissions().contains(permission));
    }

    /**
     * Agrega un permiso al usuario.
     *
     * @param permission El permiso a agregar
     */
    public void addPermission(final Permission permission) {
        permissions.add(permission);
    }

    /**
     * Elimina un permiso del usuario.
     *
     * @param permission El permiso a eliminar
     */
    public void removePermission(final Permission permission) {
        permissions.remove(permission);
    }

    /**
     * Activa el usuario.
     */
    public void activate() {
        this.active = true;
    }

    /**
     * Desactiva el usuario.
     */
    public void deactivate() {
        this.active = false;
    }

    /**
     * Verifica si el usuario está activo.
     *
     * @return true si el usuario está activo, false en caso contrario
     */
    public boolean isActive() {
        return active;
    }

    /**
     * Obtiene el nombre completo del usuario.
     *
     * @return El nombre completo del usuario
     */
    public String getFullName() {
        return personName != null ? personName.getFullName() : "";
    }
}
