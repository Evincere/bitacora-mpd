package com.bitacora.infrastructure.rest.dto.workflow;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para rechazar una solicitud de tarea.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para rechazar una solicitud de tarea")
public class RejectTaskRequestDto {
    
    @NotBlank(message = "El motivo de rechazo no puede estar vacío")
    @Schema(description = "Motivo del rechazo", example = "No cumple con los requisitos solicitados", required = true)
    private String reason;
    
    @Schema(description = "Notas adicionales", example = "Por favor, revisar los puntos 2 y 3 del documento")
    private String notes;
}
