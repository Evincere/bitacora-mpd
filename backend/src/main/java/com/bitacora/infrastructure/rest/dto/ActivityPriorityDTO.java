package com.bitacora.infrastructure.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para representar una prioridad de actividad.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityPriorityDTO {
    
    /**
     * Nombre de la prioridad (CRITICAL, HIGH, MEDIUM, LOW, TRIVIAL).
     */
    private String name;
    
    /**
     * Nombre para mostrar (Crítica, Alta, Media, Baja, Trivial).
     */
    private String displayName;
    
    /**
     * Color asociado a la prioridad en formato hexadecimal.
     */
    private String color;
}
