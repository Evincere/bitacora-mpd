package com.bitacora.application.taskrequest.mapper;

import com.bitacora.application.taskrequest.dto.TaskRequestAttachmentDto;
import com.bitacora.domain.model.taskrequest.TaskRequestAttachment;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre TaskRequestAttachment y TaskRequestAttachmentDto.
 */
@Component
public class TaskRequestAttachmentMapper {

    /**
     * Convierte un objeto de dominio a un DTO.
     *
     * @param domain Objeto de dominio
     * @return DTO
     */
    public TaskRequestAttachmentDto toDto(TaskRequestAttachment domain) {
        if (domain == null) {
            return null;
        }

        // Generar la URL de descarga
        String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/task-requests/attachments/{id}/download")
                .buildAndExpand(domain.getId())
                .toUriString();

        return TaskRequestAttachmentDto.builder()
                .id(domain.getId())
                .taskRequestId(domain.getTaskRequestId())
                .userId(domain.getUserId())
                .fileName(domain.getFileName())
                .fileType(domain.getFileType())
                .fileSize(domain.getFileSize())
                .downloadUrl(downloadUrl)
                .uploadedAt(domain.getUploadedAt())
                .build();
    }

    /**
     * Convierte una lista de objetos de dominio a una lista de DTOs.
     *
     * @param domains Lista de objetos de dominio
     * @return Lista de DTOs
     */
    public List<TaskRequestAttachmentDto> toDtoList(List<TaskRequestAttachment> domains) {
        if (domains == null) {
            return List.of();
        }

        return domains.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
