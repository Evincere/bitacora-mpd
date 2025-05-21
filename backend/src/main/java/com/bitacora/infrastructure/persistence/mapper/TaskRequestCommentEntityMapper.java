package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.infrastructure.persistence.entity.TaskRequestCommentEntity;
import com.bitacora.infrastructure.persistence.entity.TaskRequestEntity;
import com.bitacora.infrastructure.persistence.repository.TaskRequestJpaRepository;
import org.springframework.stereotype.Component;

import java.util.NoSuchElementException;

/**
 * Mapper para convertir entre TaskRequestComment y TaskRequestCommentEntity.
 */
@Component
public class TaskRequestCommentEntityMapper {

    private final TaskRequestJpaRepository taskRequestJpaRepository;

    /**
     * Constructor.
     *
     * @param taskRequestJpaRepository Repositorio JPA para TaskRequestEntity
     */
    public TaskRequestCommentEntityMapper(TaskRequestJpaRepository taskRequestJpaRepository) {
        this.taskRequestJpaRepository = taskRequestJpaRepository;
    }

    /**
     * Convierte un objeto de dominio a una entidad JPA.
     *
     * @param domain Objeto de dominio
     * @return Entidad JPA
     */
    public TaskRequestCommentEntity toEntity(TaskRequestComment domain) {
        if (domain == null) {
            return null;
        }

        // Obtener la entidad TaskRequestEntity
        TaskRequestEntity taskRequestEntity = null;
        if (domain.getTaskRequestId() != null) {
            taskRequestEntity = taskRequestJpaRepository.findById(domain.getTaskRequestId())
                    .orElseThrow(() -> new NoSuchElementException(
                            "Solicitud no encontrada con ID: " + domain.getTaskRequestId()));
        }

        return TaskRequestCommentEntity.Builder.builder()
                .id(domain.getId())
                .taskRequest(taskRequestEntity)
                .userId(domain.getUserId())
                .userName(domain.getUserName())
                .content(domain.getContent())
                .createdAt(domain.getCreatedAt())
                .readBy(domain.getReadBy())
                .mentions(domain.getMentions())
                .build();
    }

    /**
     * Convierte una entidad JPA a un objeto de dominio.
     *
     * @param entity Entidad JPA
     * @return Objeto de dominio
     */
    public TaskRequestComment toDomain(TaskRequestCommentEntity entity) {
        if (entity == null) {
            return null;
        }

        return TaskRequestComment.builder()
                .id(entity.getId())
                .taskRequestId(entity.getTaskRequest() != null ? entity.getTaskRequest().getId() : null)
                .userId(entity.getUserId())
                .userName(entity.getUserName())
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .readBy(entity.getReadBy())
                .mentions(entity.getMentions())
                .build();
    }
}
