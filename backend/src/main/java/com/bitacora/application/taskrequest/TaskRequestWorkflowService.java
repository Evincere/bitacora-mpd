package com.bitacora.application.taskrequest;

import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.domain.port.repository.TaskRequestRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio que implementa el flujo de trabajo para las solicitudes de tareas.
 */
@Service
public class TaskRequestWorkflowService {

    private static final Logger logger = LoggerFactory.getLogger(TaskRequestWorkflowService.class);

    private final TaskRequestRepository taskRequestRepository;

    /**
     * Constructor.
     *
     * @param taskRequestRepository Repositorio de solicitudes de tareas
     */
    public TaskRequestWorkflowService(final TaskRequestRepository taskRequestRepository) {
        this.taskRequestRepository = taskRequestRepository;
    }

    /**
     * Envía una solicitud de tarea, cambiando su estado de DRAFT a SUBMITTED.
     *
     * @param id ID de la solicitud
     * @param requesterId ID del solicitante
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe o el solicitante no coincide
     * @throws IllegalStateException Si la solicitud no está en estado DRAFT
     */
    @Transactional
    public TaskRequest submit(final Long id, final Long requesterId) {
        logger.info("Enviando solicitud de tarea con ID: {} para el solicitante: {}", id, requesterId);
        
        // Buscar la solicitud
        TaskRequest taskRequest = taskRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada con ID: " + id));
        
        // Verificar que el solicitante coincide
        if (!taskRequest.getRequesterId().equals(requesterId)) {
            throw new IllegalArgumentException("El solicitante no coincide con el de la solicitud");
        }
        
        // Verificar que la solicitud está en estado DRAFT
        if (taskRequest.getStatus() != TaskRequestStatus.DRAFT) {
            throw new IllegalStateException("Solo se pueden enviar solicitudes en estado DRAFT");
        }
        
        // Crear una nueva instancia con el estado actualizado
        TaskRequest updatedTaskRequest = TaskRequest.builder()
                .id(taskRequest.getId())
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .category(taskRequest.getCategory())
                .priority(taskRequest.getPriority())
                .dueDate(taskRequest.getDueDate())
                .status(TaskRequestStatus.SUBMITTED) // Cambiar a SUBMITTED
                .requesterId(taskRequest.getRequesterId())
                .requestDate(taskRequest.getRequestDate())
                .notes(taskRequest.getNotes())
                .attachments(taskRequest.getAttachments())
                .comments(taskRequest.getComments())
                .build();
        
        // Guardar la solicitud actualizada
        TaskRequest savedTaskRequest = taskRequestRepository.save(updatedTaskRequest);
        logger.info("Solicitud de tarea enviada con ID: {}", savedTaskRequest.getId());
        
        return savedTaskRequest;
    }

    /**
     * Asigna una solicitud de tarea a un asignador.
     *
     * @param id ID de la solicitud
     * @param assignerId ID del asignador
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe
     * @throws IllegalStateException Si la solicitud no está en estado SUBMITTED
     */
    @Transactional
    public TaskRequest assign(final Long id, final Long assignerId) {
        logger.info("Asignando solicitud de tarea con ID: {} al asignador: {}", id, assignerId);
        
        // Buscar la solicitud
        TaskRequest taskRequest = taskRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada con ID: " + id));
        
        // Asignar la solicitud (el método assign de TaskRequest ya verifica el estado)
        TaskRequest assignedTaskRequest = taskRequest.assign(assignerId);
        
        // Guardar la solicitud actualizada
        TaskRequest savedTaskRequest = taskRequestRepository.save(assignedTaskRequest);
        logger.info("Solicitud de tarea asignada con ID: {}", savedTaskRequest.getId());
        
        return savedTaskRequest;
    }

    /**
     * Marca una solicitud como completada.
     *
     * @param id ID de la solicitud
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe
     * @throws IllegalStateException Si la solicitud no está en estado ASSIGNED
     */
    @Transactional
    public TaskRequest complete(final Long id) {
        logger.info("Completando solicitud de tarea con ID: {}", id);
        
        // Buscar la solicitud
        TaskRequest taskRequest = taskRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada con ID: " + id));
        
        // Completar la solicitud (el método complete de TaskRequest ya verifica el estado)
        TaskRequest completedTaskRequest = taskRequest.complete();
        
        // Guardar la solicitud actualizada
        TaskRequest savedTaskRequest = taskRequestRepository.save(completedTaskRequest);
        logger.info("Solicitud de tarea completada con ID: {}", savedTaskRequest.getId());
        
        return savedTaskRequest;
    }

    /**
     * Cancela una solicitud.
     *
     * @param id ID de la solicitud
     * @param requesterId ID del solicitante
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe o el solicitante no coincide
     * @throws IllegalStateException Si la solicitud ya está en estado COMPLETED o CANCELLED
     */
    @Transactional
    public TaskRequest cancel(final Long id, final Long requesterId) {
        logger.info("Cancelando solicitud de tarea con ID: {} para el solicitante: {}", id, requesterId);
        
        // Buscar la solicitud
        TaskRequest taskRequest = taskRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada con ID: " + id));
        
        // Verificar que el solicitante coincide
        if (!taskRequest.getRequesterId().equals(requesterId)) {
            throw new IllegalArgumentException("El solicitante no coincide con el de la solicitud");
        }
        
        // Cancelar la solicitud (el método cancel de TaskRequest ya verifica el estado)
        TaskRequest cancelledTaskRequest = taskRequest.cancel();
        
        // Guardar la solicitud actualizada
        TaskRequest savedTaskRequest = taskRequestRepository.save(cancelledTaskRequest);
        logger.info("Solicitud de tarea cancelada con ID: {}", savedTaskRequest.getId());
        
        return savedTaskRequest;
    }

    /**
     * Añade un comentario a una solicitud.
     *
     * @param id ID de la solicitud
     * @param comment El comentario a añadir
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe
     */
    @Transactional
    public TaskRequest addComment(final Long id, final TaskRequestComment comment) {
        logger.info("Añadiendo comentario a la solicitud de tarea con ID: {}", id);
        
        // Buscar la solicitud
        TaskRequest taskRequest = taskRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada con ID: " + id));
        
        // Añadir el comentario
        TaskRequest updatedTaskRequest = taskRequest.addComment(comment);
        
        // Guardar la solicitud actualizada
        TaskRequest savedTaskRequest = taskRequestRepository.save(updatedTaskRequest);
        logger.info("Comentario añadido a la solicitud de tarea con ID: {}", savedTaskRequest.getId());
        
        return savedTaskRequest;
    }

    /**
     * Busca una solicitud por su ID.
     *
     * @param id El ID de la solicitud
     * @return Un Optional que contiene la solicitud si existe, o vacío si no
     */
    @Transactional(readOnly = true)
    public Optional<TaskRequest> findById(final Long id) {
        return taskRequestRepository.findById(id);
    }

    /**
     * Busca todas las solicitudes.
     *
     * @param page Número de página (0-indexed)
     * @param size Tamaño de la página
     * @return Lista de solicitudes
     */
    @Transactional(readOnly = true)
    public List<TaskRequest> findAll(final int page, final int size) {
        return taskRequestRepository.findAll(page, size);
    }

    /**
     * Busca solicitudes por el ID del solicitante.
     *
     * @param requesterId ID del solicitante
     * @param page Número de página (0-indexed)
     * @param size Tamaño de la página
     * @return Lista de solicitudes del solicitante
     */
    @Transactional(readOnly = true)
    public List<TaskRequest> findByRequesterId(final Long requesterId, final int page, final int size) {
        return taskRequestRepository.findByRequesterId(requesterId, page, size);
    }

    /**
     * Busca solicitudes por el ID del asignador.
     *
     * @param assignerId ID del asignador
     * @param page Número de página (0-indexed)
     * @param size Tamaño de la página
     * @return Lista de solicitudes asignadas por el asignador
     */
    @Transactional(readOnly = true)
    public List<TaskRequest> findByAssignerId(final Long assignerId, final int page, final int size) {
        return taskRequestRepository.findByAssignerId(assignerId, page, size);
    }

    /**
     * Busca solicitudes por estado.
     *
     * @param status Estado de las solicitudes
     * @param page Número de página (0-indexed)
     * @param size Tamaño de la página
     * @return Lista de solicitudes con el estado especificado
     */
    @Transactional(readOnly = true)
    public List<TaskRequest> findByStatus(final TaskRequestStatus status, final int page, final int size) {
        return taskRequestRepository.findByStatus(status, page, size);
    }

    /**
     * Obtiene estadísticas de solicitudes por estado.
     *
     * @return Un mapa con el número de solicitudes por estado
     */
    @Transactional(readOnly = true)
    public Map<TaskRequestStatus, Long> getStatsByStatus() {
        return Map.of(
            TaskRequestStatus.DRAFT, taskRequestRepository.countByStatus(TaskRequestStatus.DRAFT),
            TaskRequestStatus.SUBMITTED, taskRequestRepository.countByStatus(TaskRequestStatus.SUBMITTED),
            TaskRequestStatus.ASSIGNED, taskRequestRepository.countByStatus(TaskRequestStatus.ASSIGNED),
            TaskRequestStatus.COMPLETED, taskRequestRepository.countByStatus(TaskRequestStatus.COMPLETED),
            TaskRequestStatus.CANCELLED, taskRequestRepository.countByStatus(TaskRequestStatus.CANCELLED)
        );
    }

    /**
     * Cuenta el total de solicitudes.
     */
    @Transactional(readOnly = true)
    public long count() {
        return taskRequestRepository.count();
    }

    /**
     * Cuenta las solicitudes por ID de solicitante.
     */
    @Transactional(readOnly = true)
    public long countByRequesterId(Long requesterId) {
        return taskRequestRepository.countByRequesterId(requesterId);
    }

    /**
     * Cuenta las solicitudes por ID de asignador.
     */
    @Transactional(readOnly = true)
    public long countByAssignerId(Long assignerId) {
        return taskRequestRepository.countByAssignerId(assignerId);
    }

    /**
     * Cuenta las solicitudes por estado.
     */
    @Transactional(readOnly = true)
    public long countByStatus(TaskRequestStatus status) {
        return taskRequestRepository.countByStatus(status);
    }

    /**
     * Elimina una solicitud por su ID.
     */
    @Transactional
    public void deleteById(Long id) {
        taskRequestRepository.deleteById(id);
    }
}
