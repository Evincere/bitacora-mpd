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
 * Caso de uso para crear una nueva solicitud de tarea.
 */
@Service
public class CreateTaskRequestUseCase {

    private static final Logger logger = LoggerFactory.getLogger(CreateTaskRequestUseCase.class);

    private final TaskRequestRepository taskRequestRepository;
    private final TaskRequestCategoryRepository categoryRepository;

    /**
     * Constructor.
     *
     * @param taskRequestRepository Repositorio de solicitudes de tareas
     * @param categoryRepository Repositorio de categorías de solicitudes
     */
    public CreateTaskRequestUseCase(final TaskRequestRepository taskRequestRepository,
                                   final TaskRequestCategoryRepository categoryRepository) {
        this.taskRequestRepository = taskRequestRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * Crea una nueva solicitud de tarea en estado DRAFT.
     *
     * @param title Título de la solicitud
     * @param description Descripción de la solicitud
     * @param categoryId ID de la categoría (opcional)
     * @param priority Prioridad de la solicitud (opcional)
     * @param dueDate Fecha límite (opcional)
     * @param notes Notas adicionales (opcional)
     * @param requesterId ID del solicitante
     * @return La solicitud creada
     */
    @Transactional
    public TaskRequest createDraft(final String title,
                                  final String description,
                                  final Long categoryId,
                                  final TaskRequestPriority priority,
                                  final LocalDateTime dueDate,
                                  final String notes,
                                  final Long requesterId) {
        
        logger.info("Creando borrador de solicitud de tarea para el solicitante: {}", requesterId);
        
        // Obtener la categoría si se proporciona un ID, o la categoría por defecto si no
        TaskRequestCategory category = null;
        if (categoryId != null) {
            Optional<TaskRequestCategory> optionalCategory = categoryRepository.findById(categoryId);
            if (optionalCategory.isPresent()) {
                category = optionalCategory.get();
            } else {
                logger.warn("Categoría con ID {} no encontrada, usando categoría por defecto", categoryId);
            }
        }
        
        if (category == null) {
            category = categoryRepository.findDefault()
                    .orElseThrow(() -> new IllegalStateException("No se encontró una categoría por defecto"));
        }
        
        // Crear la solicitud
        TaskRequest taskRequest = TaskRequest.builder()
                .title(title)
                .description(description)
                .category(category)
                .priority(priority != null ? priority : TaskRequestPriority.MEDIUM)
                .dueDate(dueDate)
                .status(TaskRequestStatus.DRAFT)
                .requesterId(requesterId)
                .requestDate(LocalDateTime.now())
                .notes(notes)
                .build();
        
        // Guardar la solicitud
        TaskRequest savedTaskRequest = taskRequestRepository.save(taskRequest);
        logger.info("Borrador de solicitud de tarea creado con ID: {}", savedTaskRequest.getId());
        
        return savedTaskRequest;
    }

    /**
     * Crea una nueva solicitud de tarea y la envía directamente (estado SUBMITTED).
     *
     * @param title Título de la solicitud
     * @param description Descripción de la solicitud
     * @param categoryId ID de la categoría (opcional)
     * @param priority Prioridad de la solicitud (opcional)
     * @param dueDate Fecha límite (opcional)
     * @param notes Notas adicionales (opcional)
     * @param requesterId ID del solicitante
     * @return La solicitud creada y enviada
     */
    @Transactional
    public TaskRequest createAndSubmit(final String title,
                                      final String description,
                                      final Long categoryId,
                                      final TaskRequestPriority priority,
                                      final LocalDateTime dueDate,
                                      final String notes,
                                      final Long requesterId) {
        
        logger.info("Creando y enviando solicitud de tarea para el solicitante: {}", requesterId);
        
        // Obtener la categoría si se proporciona un ID, o la categoría por defecto si no
        TaskRequestCategory category = null;
        if (categoryId != null) {
            Optional<TaskRequestCategory> optionalCategory = categoryRepository.findById(categoryId);
            if (optionalCategory.isPresent()) {
                category = optionalCategory.get();
            } else {
                logger.warn("Categoría con ID {} no encontrada, usando categoría por defecto", categoryId);
            }
        }
        
        if (category == null) {
            category = categoryRepository.findDefault()
                    .orElseThrow(() -> new IllegalStateException("No se encontró una categoría por defecto"));
        }
        
        // Crear la solicitud
        TaskRequest taskRequest = TaskRequest.builder()
                .title(title)
                .description(description)
                .category(category)
                .priority(priority != null ? priority : TaskRequestPriority.MEDIUM)
                .dueDate(dueDate)
                .status(TaskRequestStatus.SUBMITTED) // Directamente en estado SUBMITTED
                .requesterId(requesterId)
                .requestDate(LocalDateTime.now())
                .notes(notes)
                .build();
        
        // Guardar la solicitud
        TaskRequest savedTaskRequest = taskRequestRepository.save(taskRequest);
        logger.info("Solicitud de tarea creada y enviada con ID: {}", savedTaskRequest.getId());
        
        return savedTaskRequest;
    }
}
