package com.bitacora.infrastructure.rest.dto.audit;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la solicitud de marcar un registro de auditoría como sospechoso.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarkAsSuspiciousRequest {
    
    /**
     * Razón por la que se marca el registro como sospechoso.
     */
    @NotBlank(message = "La razón es obligatoria")
    @Size(max = 500, message = "La razón no puede tener más de 500 caracteres")
    private String reason;
}
