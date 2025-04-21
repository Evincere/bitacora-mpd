package com.bitacora.infrastructure.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * DTO para respuestas de autenticación.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Respuesta de autenticación")
public class AuthResponseDto {

    @Schema(description = "Token JWT de acceso", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Schema(description = "Token JWT de refresco", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String refreshToken;

    @Schema(description = "Tipo de token", example = "Bearer")
    private String tokenType;

    @Schema(description = "ID del usuario", example = "1")
    private Long userId;

    @Schema(description = "Nombre de usuario", example = "jperez")
    private String username;

    @Schema(description = "Correo electrónico", example = "jperez@example.com")
    private String email;

    @Schema(description = "Nombre completo", example = "Juan Pérez")
    private String fullName;

    @Schema(description = "Rol del usuario", example = "USUARIO")
    private String role;

    @Schema(description = "Permisos del usuario", example = "[\"READ_ACTIVITIES\", \"WRITE_ACTIVITIES\"]")
    private Set<String> permissions;
}
