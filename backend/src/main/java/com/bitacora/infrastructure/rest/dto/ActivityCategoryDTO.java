package com.bitacora.infrastructure.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para transferir información de categorías de actividades.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityCategoryDTO {
    private Long id;
    private String name;
    private String description;
    private String color;
    private boolean isDefault;
    private Long creatorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
