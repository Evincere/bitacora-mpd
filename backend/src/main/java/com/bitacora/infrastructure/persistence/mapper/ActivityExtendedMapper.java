package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.activity.ActivityType;
import com.bitacora.infrastructure.persistence.entity.ActivityEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre la entidad ActivityEntity y el modelo de dominio ActivityExtended.
 */
@Component("activityExtendedEntityMapper")
public class ActivityExtendedMapper {

    /**
     * Convierte una entidad ActivityEntity a un modelo de dominio ActivityExtended.
     *
     * @param entity La entidad ActivityEntity
     * @return El modelo de dominio ActivityExtended
     */
    public ActivityExtended toDomain(ActivityEntity entity) {
        if (entity == null) {
            return null;
        }

        return ActivityExtended.builder()
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
                .requesterId(entity.getRequesterId())
                .assignerId(entity.getAssignerId())
                .executorId(entity.getExecutorId())
                .requestDate(entity.getRequestDate())
                .assignmentDate(entity.getAssignmentDate())
                .startDate(entity.getStartDate())
                .completionDate(entity.getCompletionDate())
                .approvalDate(entity.getApprovalDate())
                .requestNotes(entity.getRequestNotes())
                .assignmentNotes(entity.getAssignmentNotes())
                .executionNotes(entity.getExecutionNotes())
                .completionNotes(entity.getCompletionNotes())
                .approvalNotes(entity.getApprovalNotes())
                .estimatedHours(entity.getEstimatedHours())
                .actualHours(entity.getActualHours())
                .build();
    }

    /**
     * Convierte un modelo de dominio ActivityExtended a una entidad ActivityEntity.
     *
     * @param domain El modelo de dominio ActivityExtended
     * @return La entidad ActivityEntity
     */
    public ActivityEntity toEntity(ActivityExtended domain) {
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
                .requesterId(domain.getRequesterId())
                .assignerId(domain.getAssignerId())
                .executorId(domain.getExecutorId())
                .requestDate(domain.getRequestDate())
                .assignmentDate(domain.getAssignmentDate())
                .startDate(domain.getStartDate())
                .completionDate(domain.getCompletionDate())
                .approvalDate(domain.getApprovalDate())
                .requestNotes(domain.getRequestNotes())
                .assignmentNotes(domain.getAssignmentNotes())
                .executionNotes(domain.getExecutionNotes())
                .completionNotes(domain.getCompletionNotes())
                .approvalNotes(domain.getApprovalNotes())
                .estimatedHours(domain.getEstimatedHours())
                .actualHours(domain.getActualHours())
                .build();
    }

    /**
     * Convierte un objeto Activity a ActivityExtended.
     *
     * @param activity La actividad base
     * @return La actividad extendida
     */
    public ActivityExtended fromActivity(Activity activity) {
        if (activity == null) {
            return null;
        }
        
        if (activity instanceof ActivityExtended) {
            return (ActivityExtended) activity;
        }

        return ActivityExtended.builder()
                .id(activity.getId())
                .date(activity.getDate())
                .type(activity.getType())
                .description(activity.getDescription())
                .person(activity.getPerson())
                .role(activity.getRole())
                .dependency(activity.getDependency())
                .situation(activity.getSituation())
                .result(activity.getResult())
                .status(activity.getStatus())
                .lastStatusChangeDate(activity.getLastStatusChangeDate())
                .comments(activity.getComments())
                .agent(activity.getAgent())
                .createdAt(activity.getCreatedAt())
                .updatedAt(activity.getUpdatedAt())
                .userId(activity.getUserId())
                .build();
    }
}
