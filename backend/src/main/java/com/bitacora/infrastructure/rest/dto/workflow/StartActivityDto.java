package com.bitacora.infrastructure.rest.dto.workflow;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para iniciar una actividad.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para iniciar una actividad")
public class StartActivityDto {
    
    @Schema(description = "Notas de inicio", example = "Comenzando a trabajar en la tarea")
    private String notes;
}
