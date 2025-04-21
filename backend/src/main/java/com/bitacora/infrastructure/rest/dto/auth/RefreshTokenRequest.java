package com.bitacora.infrastructure.rest.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para solicitudes de refresco de token.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenRequest {
    
    /**
     * Token de refresco.
     */
    @NotBlank(message = "El token de refresco no puede estar vacío")
    private String refreshToken;
}
