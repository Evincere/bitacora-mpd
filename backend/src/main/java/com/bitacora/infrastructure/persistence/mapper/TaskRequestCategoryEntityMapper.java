package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.taskrequest.TaskRequestCategory;
import com.bitacora.infrastructure.persistence.entity.TaskRequestCategoryEntity;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre entidades JPA y entidades de dominio relacionadas con categorías de solicitudes de tareas.
 */
@Component
public class TaskRequestCategoryEntityMapper {

    /**
     * Convierte una entidad JPA TaskRequestCategoryEntity a una entidad de dominio TaskRequestCategory.
     *
     * @param entity La entidad JPA a convertir
     * @return La entidad de dominio resultante
     */
    public TaskRequestCategory toDomain(TaskRequestCategoryEntity entity) {
        if (entity == null) {
            return null;
        }

        return TaskRequestCategory.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .color(entity.getColor())
                .isDefault(entity.isDefault())
                .build();
    }

    /**
     * Convierte una entidad de dominio TaskRequestCategory a una entidad JPA TaskRequestCategoryEntity.
     *
     * @param domain La entidad de dominio a convertir
     * @return La entidad JPA resultante
     */
    public TaskRequestCategoryEntity toEntity(TaskRequestCategory domain) {
        if (domain == null) {
            return null;
        }

        return TaskRequestCategoryEntity.Builder.builder()
                .id(domain.getId())
                .name(domain.getName())
                .description(domain.getDescription())
                .color(domain.getColor())
                .isDefault(domain.isDefault())
                .build();
    }

    /**
     * Convierte una lista de entidades JPA TaskRequestCategoryEntity a una lista de entidades de dominio TaskRequestCategory.
     *
     * @param entities La lista de entidades JPA a convertir
     * @return La lista de entidades de dominio resultante
     */
    public List<TaskRequestCategory> toDomainList(List<TaskRequestCategoryEntity> entities) {
        if (entities == null) {
            return new ArrayList<>();
        }

        return entities.stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    /**
     * Convierte una lista de entidades de dominio TaskRequestCategory a una lista de entidades JPA TaskRequestCategoryEntity.
     *
     * @param domains La lista de entidades de dominio a convertir
     * @return La lista de entidades JPA resultante
     */
    public List<TaskRequestCategoryEntity> toEntityList(List<TaskRequestCategory> domains) {
        if (domains == null) {
            return new ArrayList<>();
        }

        return domains.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
