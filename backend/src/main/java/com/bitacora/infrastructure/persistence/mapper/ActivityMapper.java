package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.activity.ActivityType;
import com.bitacora.infrastructure.persistence.entity.ActivityEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre la entidad ActivityEntity y el modelo de dominio
 * Activity.
 */
@Component("activityEntityMapper")
public class ActivityMapper {

    /**
     * Convierte una entidad ActivityEntity a un modelo de dominio Activity.
     *
     * @param entity La entidad ActivityEntity
     * @return El modelo de dominio Activity
     */
    public Activity toDomain(ActivityEntity entity) {
        if (entity == null) {
            return null;
        }

        return Activity.builder()
                .id(entity.getId())
                .date(entity.getDate())
                .type(ActivityType.fromString(entity.getType()))
                .description(entity.getDescription())
                .person(entity.getPerson())
                .role(entity.getRole())
                .dependency(entity.getDependency())
                .situation(entity.getSituation())
                .result(entity.getResult())
                .status(ActivityStatus.fromString(entity.getStatus()))
                .lastStatusChangeDate(entity.getLastStatusChangeDate())
                .comments(entity.getComments())
                .agent(entity.getAgent())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .userId(entity.getUserId())
                .executorId(entity.getExecutorId()) // Añadimos el campo executorId
                .build();
    }

    /**
     * Convierte un modelo de dominio Activity a una entidad ActivityEntity.
     *
     * @param domain El modelo de dominio Activity
     * @return La entidad ActivityEntity
     */
    public ActivityEntity toEntity(Activity domain) {
        if (domain == null) {
            return null;
        }

        return ActivityEntity.builder()
                .id(domain.getId())
                .date(domain.getDate())
                .type(domain.getType() != null ? domain.getType().name() : null)
                .description(domain.getDescription())
                .person(domain.getPerson())
                .role(domain.getRole())
                .dependency(domain.getDependency())
                .situation(domain.getSituation())
                .result(domain.getResult())
                .status(domain.getStatus() != null ? domain.getStatus().name() : null)
                .lastStatusChangeDate(domain.getLastStatusChangeDate())
                .comments(domain.getComments())
                .agent(domain.getAgent())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .userId(domain.getUserId())
                .executorId(domain.getExecutorId()) // Añadimos el campo executorId
                .build();
    }
}
