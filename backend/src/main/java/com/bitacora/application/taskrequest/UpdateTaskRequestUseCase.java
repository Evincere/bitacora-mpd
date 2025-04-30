package com.bitacora.application.taskrequest;

import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestCategory;
import com.bitacora.domain.model.taskrequest.TaskRequestPriority;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.domain.port.repository.TaskRequestCategoryRepository;
import com.bitacora.domain.port.repository.TaskRequestRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Caso de uso para actualizar una solicitud de tarea existente.
 */
@Service
public class UpdateTaskRequestUseCase {

    private static final Logger logger = LoggerFactory.getLogger(UpdateTaskRequestUseCase.class);

    private final TaskRequestRepository taskRequestRepository;
    private final TaskRequestCategoryRepository categoryRepository;

    /**
     * Constructor.
     *
     * @param taskRequestRepository Repositorio de solicitudes de tareas
     * @param categoryRepository Repositorio de categorías de solicitudes
     */
    public UpdateTaskRequestUseCase(final TaskRequestRepository taskRequestRepository,
                                   final TaskRequestCategoryRepository categoryRepository) {
        this.taskRequestRepository = taskRequestRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * Actualiza una solicitud de tarea existente.
     * Solo se pueden actualizar solicitudes en estado DRAFT.
     *
     * @param id ID de la solicitud a actualizar
     * @param title Nuevo título (opcional)
     * @param description Nueva descripción (opcional)
     * @param categoryId ID de la nueva categoría (opcional)
     * @param priority Nueva prioridad (opcional)
     * @param dueDate Nueva fecha límite (opcional)
     * @param notes Nuevas notas (opcional)
     * @param requesterId ID del solicitante (para verificación)
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe o el solicitante no coincide
     * @throws IllegalStateException Si la solicitud no está en estado DRAFT
     */
    @Transactional
    public TaskRequest update(final Long id,
                             final String title,
                             final String description,
                             final Long categoryId,
                             final TaskRequestPriority priority,
                             final LocalDateTime dueDate,
                             final String notes,
                             final Long requesterId) {
        
        logger.info("Actualizando solicitud de tarea con ID: {} para el solicitante: {}", id, requesterId);
        
        // Buscar la solicitud
        TaskRequest taskRequest = taskRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada con ID: " + id));
        
        // Verificar que el solicitante coincide
        if (!taskRequest.getRequesterId().equals(requesterId)) {
            throw new IllegalArgumentException("El solicitante no coincide con el de la solicitud");
        }
        
        // Verificar que la solicitud está en estado DRAFT
        if (taskRequest.getStatus() != TaskRequestStatus.DRAFT) {
            throw new IllegalStateException("Solo se pueden actualizar solicitudes en estado DRAFT");
        }
        
        // Actualizar la categoría si se proporciona un ID
        if (categoryId != null) {
            Optional<TaskRequestCategory> optionalCategory = categoryRepository.findById(categoryId);
            if (optionalCategory.isPresent()) {
                TaskRequestCategory category = optionalCategory.get();
                taskRequest = TaskRequest.builder()
                        .id(taskRequest.getId())
                        .title(taskRequest.getTitle())
                        .description(taskRequest.getDescription())
                        .category(category)
                        .priority(taskRequest.getPriority())
                        .dueDate(taskRequest.getDueDate())
                        .status(taskRequest.getStatus())
                        .requesterId(taskRequest.getRequesterId())
                        .requestDate(taskRequest.getRequestDate())
                        .notes(taskRequest.getNotes())
                        .attachments(taskRequest.getAttachments())
                        .comments(taskRequest.getComments())
                        .build();
            } else {
                logger.warn("Categoría con ID {} no encontrada, manteniendo categoría actual", categoryId);
            }
        }
        
        // Crear un nuevo builder con los valores actuales
        TaskRequest.Builder builder = TaskRequest.builder()
                .id(taskRequest.getId())
                .title(title != null ? title : taskRequest.getTitle())
                .description(description != null ? description : taskRequest.getDescription())
                .category(taskRequest.getCategory())
                .priority(priority != null ? priority : taskRequest.getPriority())
                .dueDate(dueDate != null ? dueDate : taskRequest.getDueDate())
                .status(taskRequest.getStatus())
                .requesterId(taskRequest.getRequesterId())
                .requestDate(taskRequest.getRequestDate())
                .notes(notes != null ? notes : taskRequest.getNotes())
                .attachments(taskRequest.getAttachments())
                .comments(taskRequest.getComments());
        
        // Construir la solicitud actualizada
        TaskRequest updatedTaskRequest = builder.build();
        
        // Guardar la solicitud actualizada
        TaskRequest savedTaskRequest = taskRequestRepository.save(updatedTaskRequest);
        logger.info("Solicitud de tarea actualizada con ID: {}", savedTaskRequest.getId());
        
        return savedTaskRequest;
    }
}
