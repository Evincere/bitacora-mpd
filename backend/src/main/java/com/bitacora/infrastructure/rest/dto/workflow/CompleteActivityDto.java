package com.bitacora.infrastructure.rest.dto.workflow;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para completar una actividad.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para completar una actividad")
public class CompleteActivityDto {
    
    @Schema(description = "Notas de finalización", example = "Tarea completada satisfactoriamente")
    private String notes;
    
    @NotNull(message = "Las horas reales no pueden ser nulas")
    @Min(value = 0, message = "Las horas reales no pueden ser negativas")
    @Schema(description = "Horas reales dedicadas a la actividad", example = "5", required = true)
    private Integer actualHours;
    
    @Schema(description = "Resultado de la actividad", example = "Se implementó la funcionalidad solicitada")
    private String result;
}
