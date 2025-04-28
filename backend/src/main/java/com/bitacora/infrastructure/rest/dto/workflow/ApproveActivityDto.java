package com.bitacora.infrastructure.rest.dto.workflow;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para aprobar una actividad completada.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para aprobar una actividad completada")
public class ApproveActivityDto {
    
    @Schema(description = "Notas de aprobación", example = "Trabajo bien realizado")
    private String notes;
    
    @Schema(description = "Calificación de la actividad (1-5)", example = "5")
    private Integer rating;
}
