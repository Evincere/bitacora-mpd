package com.bitacora.infrastructure.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * DTO para crear un nuevo usuario.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para crear un nuevo usuario")
public class UserCreateDto {
    
    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "El nombre de usuario solo puede contener letras, números, puntos, guiones bajos y guiones")
    @Schema(description = "Nombre de usuario", example = "jperez", required = true)
    private String username;
    
    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$", 
             message = "La contraseña debe contener al menos un número, una letra minúscula, una letra mayúscula y un carácter especial")
    @Schema(description = "Contraseña", example = "P@ssw0rd", required = true)
    private String password;
    
    @NotBlank(message = "El correo electrónico no puede estar vacío")
    @Email(message = "El correo electrónico debe ser válido")
    @Schema(description = "Correo electrónico", example = "jperez@example.com", required = true)
    private String email;
    
    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(max = 100, message = "El nombre no puede tener más de 100 caracteres")
    @Schema(description = "Nombre", example = "Juan", required = true)
    private String firstName;
    
    @NotBlank(message = "El apellido no puede estar vacío")
    @Size(max = 100, message = "El apellido no puede tener más de 100 caracteres")
    @Schema(description = "Apellido", example = "Pérez", required = true)
    private String lastName;
    
    @NotBlank(message = "El rol no puede estar vacío")
    @Schema(description = "Rol del usuario", example = "USUARIO", required = true)
    private String role;
    
    @Schema(description = "Cargo o posición", example = "Defensor Público")
    private String position;
    
    @Schema(description = "Departamento", example = "Defensoría")
    private String department;
    
    @Builder.Default
    @Schema(description = "Permisos adicionales del usuario", example = "[\"GENERATE_REPORTS\"]")
    private Set<String> permissions = new HashSet<>();
}
