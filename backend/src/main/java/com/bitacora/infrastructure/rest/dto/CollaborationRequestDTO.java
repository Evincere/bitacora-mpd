package com.bitacora.infrastructure.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;

/**
 * DTO para solicitudes de colaboración.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollaborationRequestDTO {

    /**
     * ID de la actividad.
     */
    @NotNull(message = "El ID de la actividad es obligatorio")
    private Long activityId;
}
