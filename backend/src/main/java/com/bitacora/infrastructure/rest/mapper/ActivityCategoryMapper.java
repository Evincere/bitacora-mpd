package com.bitacora.infrastructure.rest.mapper;

import com.bitacora.domain.model.activity.ActivityCategory;
import com.bitacora.infrastructure.rest.dto.ActivityCategoryDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre ActivityCategory y ActivityCategoryDTO.
 */
@Component("activityCategoryDtoMapper")
public class ActivityCategoryMapper {

    /**
     * Convierte un modelo de dominio ActivityCategory a un DTO ActivityCategoryDTO.
     *
     * @param category El modelo de dominio ActivityCategory
     * @return El DTO ActivityCategoryDTO
     */
    public ActivityCategoryDTO toDto(ActivityCategory category) {
        if (category == null) {
            return null;
        }

        return ActivityCategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .color(category.getColor())
                .isDefault(category.isDefault())
                .creatorId(category.getCreatorId())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    /**
     * Convierte una lista de modelos de dominio ActivityCategory a una lista de DTOs ActivityCategoryDTO.
     *
     * @param categories Lista de modelos de dominio ActivityCategory
     * @return Lista de DTOs ActivityCategoryDTO
     */
    public List<ActivityCategoryDTO> toDtoList(List<ActivityCategory> categories) {
        if (categories == null) {
            return null;
        }

        return categories.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
