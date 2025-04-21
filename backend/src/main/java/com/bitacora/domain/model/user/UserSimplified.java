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
 * Versión simplificada que no utiliza objetos de valor para los campos.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSimplified {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private String position;
    private String department;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Builder.Default
    private Set<Permission> permissions = new HashSet<>();
    
    /**
     * Obtiene el nombre completo del usuario.
     * 
     * @return El nombre completo del usuario
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
