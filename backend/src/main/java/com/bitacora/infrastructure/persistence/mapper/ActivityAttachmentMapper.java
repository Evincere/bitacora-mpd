package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.activity.ActivityAttachment;
import com.bitacora.infrastructure.persistence.entity.ActivityAttachmentEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre ActivityAttachment y ActivityAttachmentEntity.
 */
@Component("activityAttachmentEntityMapper")
public class ActivityAttachmentMapper {

    /**
     * Convierte una entidad ActivityAttachmentEntity a un modelo de dominio ActivityAttachment.
     *
     * @param entity La entidad ActivityAttachmentEntity
     * @return El modelo de dominio ActivityAttachment
     */
    public ActivityAttachment toDomain(ActivityAttachmentEntity entity) {
        if (entity == null) {
            return null;
        }

        return ActivityAttachment.builder()
                .id(entity.getId())
                .activityId(entity.getActivityId())
                .userId(entity.getUserId())
                .userName(entity.getUserName())
                .fileName(entity.getFileName())
                .fileType(entity.getFileType())
                .fileUrl(entity.getFileUrl())
                .fileSize(entity.getFileSize())
                .uploadedAt(entity.getUploadedAt())
                .build();
    }

    /**
     * Convierte un modelo de dominio ActivityAttachment a una entidad ActivityAttachmentEntity.
     *
     * @param domain El modelo de dominio ActivityAttachment
     * @return La entidad ActivityAttachmentEntity
     */
    public ActivityAttachmentEntity toEntity(ActivityAttachment domain) {
        if (domain == null) {
            return null;
        }

        return ActivityAttachmentEntity.builder()
                .id(domain.getId())
                .activityId(domain.getActivityId())
                .userId(domain.getUserId())
                .userName(domain.getUserName())
                .fileName(domain.getFileName())
                .fileType(domain.getFileType())
                .fileUrl(domain.getFileUrl())
                .fileSize(domain.getFileSize())
                .uploadedAt(domain.getUploadedAt())
                .build();
    }
}
