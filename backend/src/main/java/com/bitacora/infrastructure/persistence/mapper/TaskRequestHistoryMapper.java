package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.taskrequest.TaskRequestHistory;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.infrastructure.persistence.entity.TaskRequestHistoryEntity;
import com.bitacora.infrastructure.persistence.entity.TaskRequestStatusEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre TaskRequestHistory y TaskRequestHistoryEntity.
 */
@Component("taskRequestHistoryEntityMapper")
public class TaskRequestHistoryMapper {

    /**
     * Convierte una entidad TaskRequestHistoryEntity a un modelo de dominio TaskRequestHistory.
     *
     * @param entity La entidad TaskRequestHistoryEntity
     * @return El modelo de dominio TaskRequestHistory
     */
    public TaskRequestHistory toDomain(TaskRequestHistoryEntity entity) {
        if (entity == null) {
            return null;
        }

        return TaskRequestHistory.builder()
                .id(entity.getId())
                .taskRequestId(entity.getTaskRequestId())
                .userId(entity.getUserId())
                .userName(entity.getUserName())
                .previousStatus(mapStatusToDomain(entity.getPreviousStatus()))
                .newStatus(mapStatusToDomain(entity.getNewStatus()))
                .changeDate(entity.getChangeDate())
                .notes(entity.getNotes())
                .build();
    }

    /**
     * Convierte un modelo de dominio TaskRequestHistory a una entidad TaskRequestHistoryEntity.
     *
     * @param history El modelo de dominio TaskRequestHistory
     * @return La entidad TaskRequestHistoryEntity
     */
    public TaskRequestHistoryEntity toEntity(TaskRequestHistory history) {
        if (history == null) {
            return null;
        }

        return TaskRequestHistoryEntity.Builder.builder()
                .id(history.getId())
                .taskRequestId(history.getTaskRequestId())
                .userId(history.getUserId())
                .userName(history.getUserName())
                .previousStatus(mapStatusToEntity(history.getPreviousStatus()))
                .newStatus(mapStatusToEntity(history.getNewStatus()))
                .changeDate(history.getChangeDate())
                .notes(history.getNotes())
                .build();
    }

    /**
     * Mapea un estado de solicitud de la entidad al dominio.
     *
     * @param statusEntity El estado de la entidad
     * @return El estado del dominio
     */
    private TaskRequestStatus mapStatusToDomain(TaskRequestStatusEntity statusEntity) {
        if (statusEntity == null) {
            return null;
        }

        return TaskRequestStatus.valueOf(statusEntity.name());
    }

    /**
     * Mapea un estado de solicitud del dominio a la entidad.
     *
     * @param status El estado del dominio
     * @return El estado de la entidad
     */
    private TaskRequestStatusEntity mapStatusToEntity(TaskRequestStatus status) {
        if (status == null) {
            return null;
        }

        return TaskRequestStatusEntity.valueOf(status.name());
    }
}
