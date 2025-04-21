package com.bitacora.infrastructure.rest.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * DTO para transferir información de usuarios entre la API y los clientes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Información de un usuario")
public class UserDto {
    
    @Schema(description = "ID del usuario", example = "1")
    private Long id;
    
    @Schema(description = "Nombre de usuario", example = "jperez")
    private String username;
    
    @JsonIgnore
    private String password;
    
    @Schema(description = "Correo electrónico", example = "jperez@example.com")
    private String email;
    
    @Schema(description = "Nombre", example = "Juan")
    private String firstName;
    
    @Schema(description = "Apellido", example = "Pérez")
    private String lastName;
    
    @Schema(description = "Rol del usuario", example = "USUARIO")
    private String role;
    
    @Schema(description = "Cargo o posición", example = "Defensor Público")
    private String position;
    
    @Schema(description = "Departamento", example = "Defensoría")
    private String department;
    
    @Schema(description = "Indica si el usuario está activo", example = "true")
    private boolean active;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "Fecha de creación", example = "2023-04-15T10:00:00")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Schema(description = "Fecha de última actualización", example = "2023-04-16T16:00:00")
    private LocalDateTime updatedAt;
    
    @Builder.Default
    @Schema(description = "Permisos del usuario", example = "[\"READ_ACTIVITIES\", \"WRITE_ACTIVITIES\"]")
    private Set<String> permissions = new HashSet<>();
    
    @Schema(description = "Nombre completo del usuario", example = "Juan Pérez")
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
