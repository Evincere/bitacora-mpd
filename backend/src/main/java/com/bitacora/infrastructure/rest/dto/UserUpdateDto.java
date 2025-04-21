package com.bitacora.infrastructure.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * DTO para actualizar un usuario existente.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para actualizar un usuario existente")
public class UserUpdateDto {
    
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$", 
             message = "La contraseña debe contener al menos un número, una letra minúscula, una letra mayúscula y un carácter especial")
    @Schema(description = "Contraseña (dejar en blanco para mantener la actual)", example = "P@ssw0rd")
    private String password;
    
    @Email(message = "El correo electrónico debe ser válido")
    @Schema(description = "Correo electrónico", example = "jperez@example.com")
    private String email;
    
    @Size(max = 100, message = "El nombre no puede tener más de 100 caracteres")
    @Schema(description = "Nombre", example = "Juan")
    private String firstName;
    
    @Size(max = 100, message = "El apellido no puede tener más de 100 caracteres")
    @Schema(description = "Apellido", example = "Pérez")
    private String lastName;
    
    @Schema(description = "Rol del usuario", example = "USUARIO")
    private String role;
    
    @Schema(description = "Cargo o posición", example = "Defensor Público")
    private String position;
    
    @Schema(description = "Departamento", example = "Defensoría")
    private String department;
    
    @Schema(description = "Indica si el usuario está activo", example = "true")
    private Boolean active;
    
    @Builder.Default
    @Schema(description = "Permisos del usuario (reemplaza los existentes)", example = "[\"READ_ACTIVITIES\", \"WRITE_ACTIVITIES\", \"GENERATE_REPORTS\"]")
    private Set<String> permissions = new HashSet<>();
}
