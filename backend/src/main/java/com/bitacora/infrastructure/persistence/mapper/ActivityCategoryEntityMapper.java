package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.activity.ActivityCategory;
import com.bitacora.infrastructure.persistence.entity.ActivityCategoryEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre la entidad JPA ActivityCategoryEntity y el modelo de dominio ActivityCategory.
 */
@Component("activityCategoryEntityMapper")
public class ActivityCategoryEntityMapper {

    /**
     * Convierte una entidad JPA a un modelo de dominio.
     *
     * @param entity La entidad JPA ActivityCategoryEntity
     * @return El modelo de dominio ActivityCategory
     */
    public ActivityCategory toDomain(ActivityCategoryEntity entity) {
        if (entity == null) {
            return null;
        }

        return ActivityCategory.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .color(entity.getColor())
                .isDefault(entity.isDefault())
                .creatorId(entity.getCreatorId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    /**
     * Convierte un modelo de dominio a una entidad JPA.
     *
     * @param domain El modelo de dominio ActivityCategory
     * @return La entidad JPA ActivityCategoryEntity
     */
    public ActivityCategoryEntity toEntity(ActivityCategory domain) {
        if (domain == null) {
            return null;
        }

        return ActivityCategoryEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .description(domain.getDescription())
                .color(domain.getColor())
                .isDefault(domain.isDefault())
                .creatorId(domain.getCreatorId())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}
