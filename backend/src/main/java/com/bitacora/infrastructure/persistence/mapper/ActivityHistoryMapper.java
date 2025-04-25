package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.activity.ActivityHistory;
import com.bitacora.infrastructure.persistence.entity.ActivityHistoryEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre ActivityHistory y ActivityHistoryEntity.
 */
@Component
public class ActivityHistoryMapper {
    
    /**
     * Convierte una entidad ActivityHistoryEntity a un modelo de dominio ActivityHistory.
     * 
     * @param entity La entidad ActivityHistoryEntity
     * @return El modelo de dominio ActivityHistory
     */
    public ActivityHistory toDomain(ActivityHistoryEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return ActivityHistory.builder()
                .id(entity.getId())
                .activityId(entity.getActivityId())
                .userId(entity.getUserId())
                .userName(entity.getUserName())
                .previousStatus(entity.getPreviousStatus())
                .newStatus(entity.getNewStatus())
                .changeDate(entity.getChangeDate())
                .notes(entity.getNotes())
                .build();
    }
    
    /**
     * Convierte un modelo de dominio ActivityHistory a una entidad ActivityHistoryEntity.
     * 
     * @param domain El modelo de dominio ActivityHistory
     * @return La entidad ActivityHistoryEntity
     */
    public ActivityHistoryEntity toEntity(ActivityHistory domain) {
        if (domain == null) {
            return null;
        }
        
        return ActivityHistoryEntity.builder()
                .id(domain.getId())
                .activityId(domain.getActivityId())
                .userId(domain.getUserId())
                .userName(domain.getUserName())
                .previousStatus(domain.getPreviousStatus())
                .newStatus(domain.getNewStatus())
                .changeDate(domain.getChangeDate())
                .notes(domain.getNotes())
                .build();
    }
}
