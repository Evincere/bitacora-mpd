package com.bitacora.infrastructure.rest.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitudes de inicio de sesión.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    /**
     * Nombre de usuario.
     */
    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    private String username;
    
    /**
     * Contraseña.
     */
    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 6, max = 100, message = "La contraseña debe tener entre 6 y 100 caracteres")
    private String password;
}
