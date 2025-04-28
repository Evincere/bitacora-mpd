package com.bitacora.infrastructure.rest.dto.workflow;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para asignar una actividad a un ejecutor.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para asignar una actividad a un ejecutor")
public class AssignActivityDto {
    
    @NotNull(message = "El ID del ejecutor no puede ser nulo")
    @Schema(description = "ID del ejecutor", example = "2", required = true)
    private Long executorId;
    
    @Schema(description = "Notas de asignación", example = "Por favor, completar antes del viernes")
    private String notes;
    
    @Schema(description = "Prioridad de la actividad", example = "HIGH")
    private String priority;
    
    @Schema(description = "Fecha límite para completar la actividad", example = "2023-04-20T17:00:00")
    private String dueDate;
}
