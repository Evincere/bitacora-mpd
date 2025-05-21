package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.taskrequest.TaskRequestAttachment;
import com.bitacora.infrastructure.persistence.entity.TaskRequestAttachmentEntity;
import com.bitacora.infrastructure.persistence.entity.TaskRequestEntity;
import com.bitacora.infrastructure.persistence.repository.TaskRequestJpaRepository;
import org.springframework.stereotype.Component;

import java.util.NoSuchElementException;

/**
 * Mapper para convertir entre TaskRequestAttachment y
 * TaskRequestAttachmentEntity.
 */
@Component
public class TaskRequestAttachmentEntityMapper {

    private final TaskRequestJpaRepository taskRequestJpaRepository;

    /**
     * Constructor.
     *
     * @param taskRequestJpaRepository Repositorio JPA para TaskRequestEntity
     */
    public TaskRequestAttachmentEntityMapper(TaskRequestJpaRepository taskRequestJpaRepository) {
        this.taskRequestJpaRepository = taskRequestJpaRepository;
    }

    /**
     * Convierte un objeto de dominio a una entidad JPA.
     *
     * @param domain Objeto de dominio
     * @return Entidad JPA
     */
    public TaskRequestAttachmentEntity toEntity(TaskRequestAttachment domain) {
        if (domain == null) {
            return null;
        }

        // Obtener la entidad TaskRequestEntity
        TaskRequestEntity taskRequestEntity = taskRequestJpaRepository.findById(domain.getTaskRequestId())
                .orElseThrow(() -> new NoSuchElementException(
                        "Solicitud no encontrada con ID: " + domain.getTaskRequestId()));

        return TaskRequestAttachmentEntity.Builder.builder()
                .id(domain.getId())
                .taskRequest(taskRequestEntity)
                .userId(domain.getUserId())
                .commentId(domain.getCommentId())
                .fileName(domain.getFileName())
                .fileType(domain.getFileType())
                .filePath(domain.getFilePath())
                .fileSize(domain.getFileSize())
                .uploadedAt(domain.getUploadedAt())
                .build();
    }

    /**
     * Convierte una entidad JPA a un objeto de dominio.
     *
     * @param entity Entidad JPA
     * @return Objeto de dominio
     */
    public TaskRequestAttachment toDomain(TaskRequestAttachmentEntity entity) {
        if (entity == null) {
            return null;
        }

        return TaskRequestAttachment.builder()
                .id(entity.getId())
                .taskRequestId(entity.getTaskRequest().getId())
                .userId(entity.getUserId())
                .commentId(entity.getCommentId())
                .fileName(entity.getFileName())
                .fileType(entity.getFileType())
                .filePath(entity.getFilePath())
                .fileSize(entity.getFileSize())
                .uploadedAt(entity.getUploadedAt())
                .build();
    }
}
