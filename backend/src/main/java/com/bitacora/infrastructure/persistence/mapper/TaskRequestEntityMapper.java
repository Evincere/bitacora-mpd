package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestAttachment;
import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.domain.model.taskrequest.TaskRequestPriority;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.infrastructure.persistence.entity.TaskRequestAttachmentEntity;
import com.bitacora.infrastructure.persistence.entity.TaskRequestCommentEntity;
import com.bitacora.infrastructure.persistence.entity.TaskRequestEntity;
import com.bitacora.infrastructure.persistence.entity.TaskRequestPriorityEntity;
import com.bitacora.infrastructure.persistence.entity.TaskRequestStatusEntity;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre entidades JPA y entidades de dominio relacionadas
 * con solicitudes de tareas.
 */
@Component
public class TaskRequestEntityMapper {

    private final TaskRequestCategoryEntityMapper categoryMapper;

    /**
     * Constructor.
     *
     * @param categoryMapper Mapper para categorías
     */
    public TaskRequestEntityMapper(TaskRequestCategoryEntityMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    /**
     * Convierte una entidad JPA TaskRequestEntity a una entidad de dominio
     * TaskRequest.
     *
     * @param entity La entidad JPA a convertir
     * @return La entidad de dominio resultante
     */
    public TaskRequest toDomain(TaskRequestEntity entity) {
        if (entity == null) {
            return null;
        }

        return TaskRequest.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .category(categoryMapper.toDomain(entity.getCategory()))
                .priority(mapToDomainPriority(entity.getPriority()))
                .dueDate(entity.getDueDate())
                .status(mapToDomainStatus(entity.getStatus()))
                .requesterId(entity.getRequesterId())
                .assignerId(entity.getAssignerId())
                .executorId(entity.getExecutorId())
                .requestDate(entity.getRequestDate())
                .assignmentDate(entity.getAssignmentDate())
                .notes(entity.getNotes())
                .attachments(mapToDomainAttachments(entity.getAttachments()))
                .comments(mapToDomainComments(entity.getComments()))
                .build();
    }

    /**
     * Convierte una entidad de dominio TaskRequest a una entidad JPA
     * TaskRequestEntity.
     *
     * @param domain La entidad de dominio a convertir
     * @return La entidad JPA resultante
     */
    public TaskRequestEntity toEntity(TaskRequest domain) {
        if (domain == null) {
            return null;
        }

        return TaskRequestEntity.Builder.builder()
                .id(domain.getId())
                .title(domain.getTitle())
                .description(domain.getDescription())
                .category(categoryMapper.toEntity(domain.getCategory()))
                .priority(mapToEntityPriority(domain.getPriority()))
                .dueDate(domain.getDueDate())
                .status(mapToEntityStatus(domain.getStatus()))
                .requesterId(domain.getRequesterId())
                .assignerId(domain.getAssignerId())
                .executorId(domain.getExecutorId())
                .requestDate(domain.getRequestDate())
                .assignmentDate(domain.getAssignmentDate())
                .notes(domain.getNotes())
                .attachments(mapToEntityAttachments(domain.getAttachments(), domain.getId()))
                .comments(mapToEntityComments(domain.getComments(), domain.getId()))
                .build();
    }

    /**
     * Convierte una lista de entidades JPA TaskRequestEntity a una lista de
     * entidades de dominio TaskRequest.
     *
     * @param entities La lista de entidades JPA a convertir
     * @return La lista de entidades de dominio resultante
     */
    public List<TaskRequest> toDomainList(List<TaskRequestEntity> entities) {
        if (entities == null) {
            return new ArrayList<>();
        }

        return entities.stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    /**
     * Convierte una entidad JPA TaskRequestCommentEntity a una entidad de dominio
     * TaskRequestComment.
     *
     * @param entity La entidad JPA a convertir
     * @return La entidad de dominio resultante
     */
    private TaskRequestComment toDomainComment(TaskRequestCommentEntity entity) {
        if (entity == null) {
            return null;
        }

        return TaskRequestComment.builder()
                .id(entity.getId())
                .taskRequestId(entity.getTaskRequest() != null ? entity.getTaskRequest().getId() : null)
                .userId(entity.getUserId())
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    /**
     * Convierte una entidad JPA TaskRequestAttachmentEntity a una entidad de
     * dominio TaskRequestAttachment.
     *
     * @param entity La entidad JPA a convertir
     * @return La entidad de dominio resultante
     */
    private TaskRequestAttachment toDomainAttachment(TaskRequestAttachmentEntity entity) {
        if (entity == null) {
            return null;
        }

        return TaskRequestAttachment.builder()
                .id(entity.getId())
                .taskRequestId(entity.getTaskRequest() != null ? entity.getTaskRequest().getId() : null)
                .userId(entity.getUserId())
                .fileName(entity.getFileName())
                .fileType(entity.getFileType())
                .filePath(entity.getFilePath())
                .fileSize(entity.getFileSize())
                .uploadedAt(entity.getUploadedAt())
                .build();
    }

    /**
     * Convierte una lista de entidades JPA TaskRequestCommentEntity a una lista de
     * entidades de dominio TaskRequestComment.
     *
     * @param entities La lista de entidades JPA a convertir
     * @return La lista de entidades de dominio resultante
     */
    private List<TaskRequestComment> mapToDomainComments(List<TaskRequestCommentEntity> entities) {
        if (entities == null) {
            return new ArrayList<>();
        }

        return entities.stream()
                .map(this::toDomainComment)
                .collect(Collectors.toList());
    }

    /**
     * Convierte una lista de entidades JPA TaskRequestAttachmentEntity a una lista
     * de entidades de dominio TaskRequestAttachment.
     *
     * @param entities La lista de entidades JPA a convertir
     * @return La lista de entidades de dominio resultante
     */
    private List<TaskRequestAttachment> mapToDomainAttachments(List<TaskRequestAttachmentEntity> entities) {
        if (entities == null) {
            return new ArrayList<>();
        }

        return entities.stream()
                .map(this::toDomainAttachment)
                .collect(Collectors.toList());
    }

    /**
     * Convierte una entidad de dominio TaskRequestComment a una entidad JPA
     * TaskRequestCommentEntity.
     *
     * @param domain        La entidad de dominio a convertir
     * @param taskRequestId El ID de la solicitud a la que pertenece el comentario
     * @return La entidad JPA resultante
     */
    private TaskRequestCommentEntity toEntityComment(TaskRequestComment domain, Long taskRequestId) {
        if (domain == null) {
            return null;
        }

        TaskRequestEntity taskRequest = null;
        if (taskRequestId != null) {
            taskRequest = new TaskRequestEntity();
            taskRequest.setId(taskRequestId);
        }

        return TaskRequestCommentEntity.Builder.builder()
                .id(domain.getId())
                .taskRequest(taskRequest)
                .userId(domain.getUserId())
                .content(domain.getContent())
                .createdAt(domain.getCreatedAt())
                .build();
    }

    /**
     * Convierte una entidad de dominio TaskRequestAttachment a una entidad JPA
     * TaskRequestAttachmentEntity.
     *
     * @param domain        La entidad de dominio a convertir
     * @param taskRequestId El ID de la solicitud a la que pertenece el archivo
     *                      adjunto
     * @return La entidad JPA resultante
     */
    private TaskRequestAttachmentEntity toEntityAttachment(TaskRequestAttachment domain, Long taskRequestId) {
        if (domain == null) {
            return null;
        }

        TaskRequestEntity taskRequest = null;
        if (taskRequestId != null) {
            taskRequest = new TaskRequestEntity();
            taskRequest.setId(taskRequestId);
        }

        return TaskRequestAttachmentEntity.Builder.builder()
                .id(domain.getId())
                .taskRequest(taskRequest)
                .userId(domain.getUserId())
                .fileName(domain.getFileName())
                .fileType(domain.getFileType())
                .filePath(domain.getFilePath())
                .fileSize(domain.getFileSize())
                .uploadedAt(domain.getUploadedAt())
                .build();
    }

    /**
     * Convierte una lista de entidades de dominio TaskRequestComment a una lista de
     * entidades JPA TaskRequestCommentEntity.
     *
     * @param domains       La lista de entidades de dominio a convertir
     * @param taskRequestId El ID de la solicitud a la que pertenecen los
     *                      comentarios
     * @return La lista de entidades JPA resultante
     */
    private List<TaskRequestCommentEntity> mapToEntityComments(List<TaskRequestComment> domains, Long taskRequestId) {
        if (domains == null) {
            return new ArrayList<>();
        }

        return domains.stream()
                .map(domain -> toEntityComment(domain, taskRequestId))
                .collect(Collectors.toList());
    }

    /**
     * Convierte una lista de entidades de dominio TaskRequestAttachment a una lista
     * de entidades JPA TaskRequestAttachmentEntity.
     *
     * @param domains       La lista de entidades de dominio a convertir
     * @param taskRequestId El ID de la solicitud a la que pertenecen los archivos
     *                      adjuntos
     * @return La lista de entidades JPA resultante
     */
    private List<TaskRequestAttachmentEntity> mapToEntityAttachments(List<TaskRequestAttachment> domains,
            Long taskRequestId) {
        if (domains == null) {
            return new ArrayList<>();
        }

        return domains.stream()
                .map(domain -> toEntityAttachment(domain, taskRequestId))
                .collect(Collectors.toList());
    }

    /**
     * Convierte un enum de dominio TaskRequestStatus a un enum de entidad
     * TaskRequestStatusEntity.
     *
     * @param status El enum de dominio a convertir
     * @return El enum de entidad resultante
     */
    private TaskRequestStatusEntity mapToEntityStatus(TaskRequestStatus status) {
        if (status == null) {
            return TaskRequestStatusEntity.DRAFT;
        }

        switch (status) {
            case DRAFT:
                return TaskRequestStatusEntity.DRAFT;
            case SUBMITTED:
                return TaskRequestStatusEntity.SUBMITTED;
            case ASSIGNED:
                return TaskRequestStatusEntity.ASSIGNED;
            case COMPLETED:
                return TaskRequestStatusEntity.COMPLETED;
            case CANCELLED:
                return TaskRequestStatusEntity.CANCELLED;
            default:
                return TaskRequestStatusEntity.DRAFT;
        }
    }

    /**
     * Convierte un enum de entidad TaskRequestStatusEntity a un enum de dominio
     * TaskRequestStatus.
     *
     * @param status El enum de entidad a convertir
     * @return El enum de dominio resultante
     */
    private TaskRequestStatus mapToDomainStatus(TaskRequestStatusEntity status) {
        if (status == null) {
            return TaskRequestStatus.DRAFT;
        }

        switch (status) {
            case DRAFT:
                return TaskRequestStatus.DRAFT;
            case SUBMITTED:
                return TaskRequestStatus.SUBMITTED;
            case ASSIGNED:
                return TaskRequestStatus.ASSIGNED;
            case COMPLETED:
                return TaskRequestStatus.COMPLETED;
            case CANCELLED:
                return TaskRequestStatus.CANCELLED;
            default:
                return TaskRequestStatus.DRAFT;
        }
    }

    /**
     * Convierte un enum de dominio TaskRequestPriority a un enum de entidad
     * TaskRequestPriorityEntity.
     *
     * @param priority El enum de dominio a convertir
     * @return El enum de entidad resultante
     */
    private TaskRequestPriorityEntity mapToEntityPriority(TaskRequestPriority priority) {
        if (priority == null) {
            return TaskRequestPriorityEntity.MEDIUM;
        }

        switch (priority) {
            case CRITICAL:
                return TaskRequestPriorityEntity.CRITICAL;
            case HIGH:
                return TaskRequestPriorityEntity.HIGH;
            case MEDIUM:
                return TaskRequestPriorityEntity.MEDIUM;
            case LOW:
                return TaskRequestPriorityEntity.LOW;
            case TRIVIAL:
                return TaskRequestPriorityEntity.TRIVIAL;
            default:
                return TaskRequestPriorityEntity.MEDIUM;
        }
    }

    /**
     * Convierte un enum de entidad TaskRequestPriorityEntity a un enum de dominio
     * TaskRequestPriority.
     *
     * @param priority El enum de entidad a convertir
     * @return El enum de dominio resultante
     */
    private TaskRequestPriority mapToDomainPriority(TaskRequestPriorityEntity priority) {
        if (priority == null) {
            return TaskRequestPriority.MEDIUM;
        }

        switch (priority) {
            case CRITICAL:
                return TaskRequestPriority.CRITICAL;
            case HIGH:
                return TaskRequestPriority.HIGH;
            case MEDIUM:
                return TaskRequestPriority.MEDIUM;
            case LOW:
                return TaskRequestPriority.LOW;
            case TRIVIAL:
                return TaskRequestPriority.TRIVIAL;
            default:
                return TaskRequestPriority.MEDIUM;
        }
    }
}
