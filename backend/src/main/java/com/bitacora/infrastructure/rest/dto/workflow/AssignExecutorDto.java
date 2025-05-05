package com.bitacora.infrastructure.rest.dto.workflow;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para asignar un ejecutor a una solicitud de tarea.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para asignar un ejecutor a una solicitud de tarea")
public class AssignExecutorDto {
    
    @NotNull(message = "El ID del ejecutor no puede ser nulo")
    @Schema(description = "ID del ejecutor", example = "2", required = true)
    private Long executorId;
    
    @Schema(description = "Notas adicionales", example = "Por favor, completar antes del viernes")
    private String notes;
}
