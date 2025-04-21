package com.bitacora.infrastructure.rest.dto.session;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitudes de revocación de sesiones.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionRevokeRequest {
    
    /**
     * Razón por la que se revoca la sesión.
     */
    @NotBlank(message = "La razón no puede estar vacía")
    @Size(max = 255, message = "La razón no puede tener más de 255 caracteres")
    private String reason;
}
