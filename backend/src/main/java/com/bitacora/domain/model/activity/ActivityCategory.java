package com.bitacora.domain.model.activity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad de dominio que representa una categoría de actividad en el sistema.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityCategory {
    private Long id;
    private String name;
    private String description;
    private String color;
    private boolean isDefault;
    private Long creatorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Crea una nueva categoría predeterminada.
     * 
     * @param name Nombre de la categoría
     * @param description Descripción de la categoría
     * @param color Color de la categoría en formato hexadecimal
     * @return Una nueva categoría predeterminada
     */
    public static ActivityCategory createDefault(String name, String description, String color) {
        return ActivityCategory.builder()
                .name(name)
                .description(description)
                .color(color)
                .isDefault(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
    
    /**
     * Crea una nueva categoría personalizada.
     * 
     * @param name Nombre de la categoría
     * @param description Descripción de la categoría
     * @param color Color de la categoría en formato hexadecimal
     * @param creatorId ID del usuario creador
     * @return Una nueva categoría personalizada
     */
    public static ActivityCategory createCustom(String name, String description, String color, Long creatorId) {
        return ActivityCategory.builder()
                .name(name)
                .description(description)
                .color(color)
                .isDefault(false)
                .creatorId(creatorId)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
}
