package com.bitacora.application.taskrequest.mapper;

import com.bitacora.application.taskrequest.dto.TaskRequestCategoryDto;
import com.bitacora.domain.model.taskrequest.TaskRequestCategory;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre entidades de dominio y DTOs relacionados con categorías de solicitudes de tareas.
 */
@Component
public class TaskRequestCategoryMapper {

    /**
     * Convierte una entidad TaskRequestCategory a un DTO TaskRequestCategoryDto.
     *
     * @param category La entidad a convertir
     * @return El DTO resultante
     */
    public TaskRequestCategoryDto toDto(final TaskRequestCategory category) {
        if (category == null) {
            return null;
        }
        
        return TaskRequestCategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .color(category.getColor())
                .isDefault(category.isDefault())
                .build();
    }

    /**
     * Convierte un DTO TaskRequestCategoryDto a una entidad TaskRequestCategory.
     *
     * @param dto El DTO a convertir
     * @return La entidad resultante
     */
    public TaskRequestCategory toEntity(final TaskRequestCategoryDto dto) {
        if (dto == null) {
            return null;
        }
        
        return TaskRequestCategory.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .color(dto.getColor())
                .isDefault(dto.isDefault())
                .build();
    }

    /**
     * Convierte una lista de entidades TaskRequestCategory a una lista de DTOs TaskRequestCategoryDto.
     *
     * @param categories La lista de entidades a convertir
     * @return La lista de DTOs resultante
     */
    public List<TaskRequestCategoryDto> toDtoList(final List<TaskRequestCategory> categories) {
        if (categories == null) {
            return Collections.emptyList();
        }
        
        return categories.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Convierte una lista de DTOs TaskRequestCategoryDto a una lista de entidades TaskRequestCategory.
     *
     * @param dtos La lista de DTOs a convertir
     * @return La lista de entidades resultante
     */
    public List<TaskRequestCategory> toEntityList(final List<TaskRequestCategoryDto> dtos) {
        if (dtos == null) {
            return Collections.emptyList();
        }
        
        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
