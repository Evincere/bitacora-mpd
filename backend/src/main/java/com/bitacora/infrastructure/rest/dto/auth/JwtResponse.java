package com.bitacora.infrastructure.rest.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para respuestas de autenticación con JWT.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {

    /**
     * Token JWT.
     */
    private String token;

    /**
     * Token de refresco.
     */
    private String refreshToken;

    /**
     * Tipo de token.
     */
    private String tokenType;

    /**
     * ID del usuario.
     */
    private Long userId;

    /**
     * Nombre de usuario.
     */
    private String username;

    /**
     * Correo electrónico del usuario.
     */
    private String email;

    /**
     * Nombre del usuario.
     */
    private String firstName;

    /**
     * Apellido del usuario.
     */
    private String lastName;

    /**
     * Nombre completo del usuario.
     */
    private String fullName;

    /**
     * Rol del usuario.
     */
    private String role;

    /**
     * Permisos del usuario.
     */
    private List<String> permissions;
}
