package com.bitacora.infrastructure.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuestas de API genéricas.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
    
    /**
     * Indica si la operación fue exitosa.
     */
    private boolean success;
    
    /**
     * Mensaje descriptivo de la respuesta.
     */
    private String message;
    
    /**
     * Datos adicionales de la respuesta.
     */
    private Object data;
}
