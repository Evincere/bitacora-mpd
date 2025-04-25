package com.bitacora.infrastructure.rest.mapper;

import com.bitacora.domain.model.activity.ActivityAttachment;
import com.bitacora.infrastructure.rest.dto.ActivityAttachmentDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre ActivityAttachment y ActivityAttachmentDTO.
 */
@Component
public class ActivityAttachmentMapper {
    
    /**
     * Convierte un modelo de dominio ActivityAttachment a un DTO ActivityAttachmentDTO.
     * 
     * @param attachment El modelo de dominio ActivityAttachment
     * @return El DTO ActivityAttachmentDTO
     */
    public ActivityAttachmentDTO toDto(ActivityAttachment attachment) {
        if (attachment == null) {
            return null;
        }
        
        return ActivityAttachmentDTO.builder()
                .id(attachment.getId())
                .activityId(attachment.getActivityId())
                .userId(attachment.getUserId())
                .userName(attachment.getUserName())
                .fileName(attachment.getFileName())
                .fileType(attachment.getFileType())
                .fileUrl(attachment.getFileUrl())
                .fileSize(attachment.getFileSize())
                .uploadedAt(attachment.getUploadedAt())
                .build();
    }
    
    /**
     * Convierte una lista de modelos de dominio ActivityAttachment a una lista de DTOs ActivityAttachmentDTO.
     * 
     * @param attachments Lista de modelos de dominio ActivityAttachment
     * @return Lista de DTOs ActivityAttachmentDTO
     */
    public List<ActivityAttachmentDTO> toDtoList(List<ActivityAttachment> attachments) {
        if (attachments == null) {
            return null;
        }
        
        return attachments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
