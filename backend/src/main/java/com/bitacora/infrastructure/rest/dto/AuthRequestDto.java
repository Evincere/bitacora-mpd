package com.bitacora.infrastructure.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para solicitudes de autenticación.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Solicitud de autenticación")
public class AuthRequestDto {
    
    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    @Schema(description = "Nombre de usuario", example = "jperez", required = true)
    private String username;
    
    @NotBlank(message = "La contraseña no puede estar vacía")
    @Schema(description = "Contraseña", example = "P@ssw0rd", required = true)
    private String password;
}
