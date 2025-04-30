package com.bitacora.application.taskrequest.mapper;

import com.bitacora.application.taskrequest.dto.TaskRequestAttachmentDto;
import com.bitacora.application.taskrequest.dto.TaskRequestCategoryDto;
import com.bitacora.application.taskrequest.dto.TaskRequestCommentDto;
import com.bitacora.application.taskrequest.dto.TaskRequestDto;
import com.bitacora.application.taskrequest.dto.TaskRequestPageDto;
import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestAttachment;
import com.bitacora.domain.model.taskrequest.TaskRequestCategory;
import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.domain.model.taskrequest.TaskRequestPriority;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre entidades de dominio y DTOs relacionados con solicitudes de tareas.
 */
@Component
public class TaskRequestMapper {

    /**
     * Convierte una entidad TaskRequest a un DTO TaskRequestDto.
     *
     * @param taskRequest La entidad a convertir
     * @return El DTO resultante
     */
    public TaskRequestDto toDto(final TaskRequest taskRequest) {
        if (taskRequest == null) {
            return null;
        }
        
        return TaskRequestDto.builder()
                .id(taskRequest.getId())
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .category(toDto(taskRequest.getCategory()))
                .priority(taskRequest.getPriority() != null ? taskRequest.getPriority().name() : null)
                .dueDate(taskRequest.getDueDate())
                .status(taskRequest.getStatus() != null ? taskRequest.getStatus().name() : null)
                .requesterId(taskRequest.getRequesterId())
                .assignerId(taskRequest.getAssignerId())
                .requestDate(taskRequest.getRequestDate())
                .assignmentDate(taskRequest.getAssignmentDate())
                .notes(taskRequest.getNotes())
                .attachments(toAttachmentDtoList(taskRequest.getAttachments()))
                .comments(toCommentDtoList(taskRequest.getComments()))
                .build();
    }

    /**
     * Convierte una entidad TaskRequestCategory a un DTO TaskRequestCategoryDto.
     *
     * @param category La entidad a convertir
     * @return El DTO resultante
     */
    public TaskRequestCategoryDto toDto(final TaskRequestCategory category) {
        if (category == null) {
            return null;
        }
        
        return TaskRequestCategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .color(category.getColor())
                .isDefault(category.isDefault())
                .build();
    }

    /**
     * Convierte una entidad TaskRequestComment a un DTO TaskRequestCommentDto.
     *
     * @param comment La entidad a convertir
     * @return El DTO resultante
     */
    public TaskRequestCommentDto toDto(final TaskRequestComment comment) {
        if (comment == null) {
            return null;
        }
        
        return TaskRequestCommentDto.builder()
                .id(comment.getId())
                .taskRequestId(comment.getTaskRequestId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    /**
     * Convierte una entidad TaskRequestAttachment a un DTO TaskRequestAttachmentDto.
     *
     * @param attachment La entidad a convertir
     * @return El DTO resultante
     */
    public TaskRequestAttachmentDto toDto(final TaskRequestAttachment attachment) {
        if (attachment == null) {
            return null;
        }
        
        return TaskRequestAttachmentDto.builder()
                .id(attachment.getId())
                .taskRequestId(attachment.getTaskRequestId())
                .userId(attachment.getUserId())
                .fileName(attachment.getFileName())
                .fileType(attachment.getFileType())
                .filePath(attachment.getFilePath())
                .fileSize(attachment.getFileSize())
                .uploadedAt(attachment.getUploadedAt())
                .build();
    }

    /**
     * Convierte una lista de entidades TaskRequest a una lista de DTOs TaskRequestDto.
     *
     * @param taskRequests La lista de entidades a convertir
     * @return La lista de DTOs resultante
     */
    public List<TaskRequestDto> toDtoList(final List<TaskRequest> taskRequests) {
        if (taskRequests == null) {
            return Collections.emptyList();
        }
        
        return taskRequests.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Convierte una lista de entidades TaskRequestComment a una lista de DTOs TaskRequestCommentDto.
     *
     * @param comments La lista de entidades a convertir
     * @return La lista de DTOs resultante
     */
    public List<TaskRequestCommentDto> toCommentDtoList(final List<TaskRequestComment> comments) {
        if (comments == null) {
            return Collections.emptyList();
        }
        
        return comments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Convierte una lista de entidades TaskRequestAttachment a una lista de DTOs TaskRequestAttachmentDto.
     *
     * @param attachments La lista de entidades a convertir
     * @return La lista de DTOs resultante
     */
    public List<TaskRequestAttachmentDto> toAttachmentDtoList(final List<TaskRequestAttachment> attachments) {
        if (attachments == null) {
            return Collections.emptyList();
        }
        
        return attachments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Crea un DTO TaskRequestPageDto a partir de una lista de entidades TaskRequest y metadatos de paginación.
     *
     * @param taskRequests La lista de entidades
     * @param totalItems El número total de elementos
     * @param totalPages El número total de páginas
     * @param currentPage La página actual
     * @return El DTO de página resultante
     */
    public TaskRequestPageDto toPageDto(final List<TaskRequest> taskRequests, 
                                       final long totalItems, 
                                       final int totalPages, 
                                       final int currentPage) {
        return TaskRequestPageDto.builder()
                .taskRequests(toDtoList(taskRequests))
                .totalItems(totalItems)
                .totalPages(totalPages)
                .currentPage(currentPage)
                .build();
    }

    /**
     * Convierte un string a un enum TaskRequestPriority.
     *
     * @param priority El string a convertir
     * @return El enum resultante, o MEDIUM si el string es nulo o inválido
     */
    public TaskRequestPriority toPriorityEnum(final String priority) {
        if (priority == null || priority.trim().isEmpty()) {
            return TaskRequestPriority.MEDIUM;
        }
        
        try {
            return TaskRequestPriority.valueOf(priority.toUpperCase());
        } catch (IllegalArgumentException e) {
            return TaskRequestPriority.MEDIUM;
        }
    }

    /**
     * Convierte un string a un enum TaskRequestStatus.
     *
     * @param status El string a convertir
     * @return El enum resultante, o DRAFT si el string es nulo o inválido
     */
    public TaskRequestStatus toStatusEnum(final String status) {
        if (status == null || status.trim().isEmpty()) {
            return TaskRequestStatus.DRAFT;
        }
        
        try {
            return TaskRequestStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return TaskRequestStatus.DRAFT;
        }
    }

    /**
     * Crea una entidad TaskRequestComment a partir de un contenido y metadatos.
     *
     * @param taskRequestId El ID de la solicitud
     * @param userId El ID del usuario
     * @param content El contenido del comentario
     * @return La entidad resultante
     */
    public TaskRequestComment toCommentEntity(final Long taskRequestId, 
                                             final Long userId, 
                                             final String content) {
        return TaskRequestComment.builder()
                .taskRequestId(taskRequestId)
                .userId(userId)
                .content(content)
                .build();
    }
}
