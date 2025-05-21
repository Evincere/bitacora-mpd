package com.bitacora.infrastructure.rest.dto.workflow;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para reenviar una solicitud de tarea rechazada.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para reenviar una solicitud de tarea rechazada")
public class ResubmitTaskRequestDto {
    
    @Schema(description = "Notas adicionales", example = "He corregido los puntos solicitados")
    private String notes;
}
