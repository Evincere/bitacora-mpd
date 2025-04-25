package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.activity.ActivityCategory;
import com.bitacora.infrastructure.persistence.entity.ActivityCategoryEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre ActivityCategory y ActivityCategoryEntity.
 */
@Component("activityCategoryPersistenceMapper")
public class ActivityCategoryMapper {

    /**
     * Convierte una entidad ActivityCategoryEntity a un modelo de dominio ActivityCategory.
     *
     * @param entity La entidad ActivityCategoryEntity
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
     * Convierte un modelo de dominio ActivityCategory a una entidad ActivityCategoryEntity.
     *
     * @param domain El modelo de dominio ActivityCategory
     * @return La entidad ActivityCategoryEntity
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
