package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.activity.ActivityComment;
import com.bitacora.infrastructure.persistence.entity.ActivityCommentEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre ActivityComment y ActivityCommentEntity.
 */
@Component
public class ActivityCommentMapper {
    
    /**
     * Convierte una entidad ActivityCommentEntity a un modelo de dominio ActivityComment.
     * 
     * @param entity La entidad ActivityCommentEntity
     * @return El modelo de dominio ActivityComment
     */
    public ActivityComment toDomain(ActivityCommentEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return ActivityComment.builder()
                .id(entity.getId())
                .activityId(entity.getActivityId())
                .userId(entity.getUserId())
                .userName(entity.getUserName())
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    /**
     * Convierte un modelo de dominio ActivityComment a una entidad ActivityCommentEntity.
     * 
     * @param domain El modelo de dominio ActivityComment
     * @return La entidad ActivityCommentEntity
     */
    public ActivityCommentEntity toEntity(ActivityComment domain) {
        if (domain == null) {
            return null;
        }
        
        return ActivityCommentEntity.builder()
                .id(domain.getId())
                .activityId(domain.getActivityId())
                .userId(domain.getUserId())
                .userName(domain.getUserName())
                .content(domain.getContent())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}
