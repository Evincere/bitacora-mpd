package com.bitacora.application.taskrequest;

import com.bitacora.application.notification.MentionNotificationService;
import com.bitacora.domain.event.taskrequest.TaskRequestStatusChangedEvent;
import com.bitacora.domain.exception.CommentException;
import com.bitacora.domain.exception.CommentException.CommentErrorCode;
import com.bitacora.domain.exception.TaskRequestException;
import com.bitacora.domain.exception.TaskRequestException.TaskRequestErrorCode;
import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.domain.port.repository.TaskRequestRepository;
import com.bitacora.domain.port.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Servicio que implementa el flujo de trabajo para las solicitudes de tareas.
 */
@Service
public class TaskRequestWorkflowService {

    private static final Logger logger = LoggerFactory.getLogger(TaskRequestWorkflowService.class);

    private final TaskRequestRepository taskRequestRepository;
    private final TaskRequestHistoryService historyService;
    private final UserRepository userRepository;
    private final MentionNotificationService mentionNotificationService;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Constructor.
     *
     * @param taskRequestRepository      Repositorio de solicitudes de tareas
     * @param historyService             Servicio de historial de solicitudes
     * @param userRepository             Repositorio de usuarios
     * @param mentionNotificationService Servicio de notificaciones de menciones
     * @param eventPublisher             Publicador de eventos
     */
    public TaskRequestWorkflowService(
            final TaskRequestRepository taskRequestRepository,
            final TaskRequestHistoryService historyService,
            final UserRepository userRepository,
            final MentionNotificationService mentionNotificationService,
            final ApplicationEventPublisher eventPublisher) {
        this.taskRequestRepository = taskRequestRepository;
        this.historyService = historyService;
        this.userRepository = userRepository;
        this.mentionNotificationService = mentionNotificationService;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Envía una solicitud de tarea, cambiando su estado de DRAFT a SUBMITTED.
     *
     * @param id          ID de la solicitud
     * @param requesterId ID del solicitante
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe o el solicitante
     *                                  no coincide
     * @throws IllegalStateException    Si la solicitud no está en estado DRAFT
     */
    @Transactional
    public TaskRequest submit(final Long id, final Long requesterId) {
        logger.info("Enviando solicitud de tarea con ID: {} para el solicitante: {}", id, requesterId);

        // Buscar la solicitud
        TaskRequest taskRequest = taskRequestRepository.findById(id)
                .orElseThrow(() -> new TaskRequestException(
                        "Solicitud no encontrada con ID: " + id,
                        TaskRequestErrorCode.TASK_REQUEST_NOT_FOUND));

        // Verificar que el solicitante coincide
        if (!taskRequest.getRequesterId().equals(requesterId)) {
            throw new TaskRequestException(
                    "El solicitante no coincide con el de la solicitud",
                    TaskRequestErrorCode.PERMISSION_DENIED);
        }

        // Verificar que la solicitud está en estado DRAFT
        if (taskRequest.getStatus() != TaskRequestStatus.DRAFT) {
            throw new TaskRequestException(
                    "Solo se pueden enviar solicitudes en estado DRAFT",
                    TaskRequestErrorCode.INVALID_STATE_TRANSITION);
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

        // Registrar el cambio de estado en el historial
        historyService.recordStatusChange(
                savedTaskRequest.getId(),
                requesterId,
                null, // No tenemos el nombre del usuario aquí
                TaskRequestStatus.DRAFT,
                TaskRequestStatus.SUBMITTED,
                "Solicitud enviada por el solicitante");

        return savedTaskRequest;
    }

    /**
     * Asigna una solicitud de tarea a un asignador.
     *
     * @param id         ID de la solicitud
     * @param assignerId ID del asignador
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe
     * @throws IllegalStateException    Si la solicitud no está en estado SUBMITTED
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

        // Registrar el cambio de estado en el historial
        historyService.recordStatusChange(
                savedTaskRequest.getId(),
                assignerId,
                null, // No tenemos el nombre del usuario aquí
                TaskRequestStatus.SUBMITTED,
                TaskRequestStatus.ASSIGNED,
                "Solicitud asignada por el asignador");

        return savedTaskRequest;
    }

    /**
     * Asigna un ejecutor a una solicitud de tarea.
     *
     * @param id         ID de la solicitud
     * @param executorId ID del ejecutor
     * @param notes      Notas adicionales
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe
     * @throws IllegalStateException    Si la solicitud no está en estado ASSIGNED
     */
    @Transactional
    public TaskRequest assignExecutor(final Long id, final Long executorId, final String notes) {
        logger.info("Asignando ejecutor con ID: {} a la solicitud de tarea con ID: {}", executorId, id);

        // Buscar la solicitud
        TaskRequest taskRequest = taskRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada con ID: " + id));

        // Asignar el ejecutor (el método assignExecutor de TaskRequest ya verifica el
        // estado)
        TaskRequest updatedTaskRequest = taskRequest.assignExecutor(executorId);

        // Actualizar las notas si se proporcionan
        if (notes != null && !notes.trim().isEmpty()) {
            updatedTaskRequest.setNotes(notes);
        }

        // Guardar la solicitud actualizada
        TaskRequest savedTaskRequest = taskRequestRepository.save(updatedTaskRequest);
        logger.info("Ejecutor asignado a la solicitud de tarea con ID: {}", savedTaskRequest.getId());

        // Registrar el cambio en el historial
        historyService.recordStatusChange(
                savedTaskRequest.getId(),
                executorId,
                null, // No tenemos el nombre del usuario aquí
                savedTaskRequest.getStatus(),
                savedTaskRequest.getStatus(),
                "Se asignó el ejecutor con ID: " + executorId);

        return savedTaskRequest;
    }

    /**
     * Inicia una solicitud de tarea, cambiando su estado de ASSIGNED a IN_PROGRESS.
     *
     * @param id         ID de la solicitud
     * @param executorId ID del ejecutor
     * @param notes      Notas opcionales para el inicio de la tarea (opcional)
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe
     * @throws IllegalStateException    Si la solicitud no está en estado ASSIGNED
     */
    @Transactional
    public TaskRequest start(final Long id, final Long executorId, final String notes) {
        logger.info("Iniciando solicitud de tarea con ID: {} por el ejecutor: {}", id, executorId);

        try {
            // Buscar la solicitud
            TaskRequest taskRequest = taskRequestRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada con ID: " + id));

            // Verificar que el ejecutor coincida
            if (taskRequest.getExecutorId() != null && !taskRequest.getExecutorId().equals(executorId)) {
                throw new IllegalArgumentException("El ejecutor con ID: " + executorId +
                        " no está asignado a esta solicitud");
            }

            // Guardar el estado anterior para el evento
            TaskRequestStatus oldStatus = taskRequest.getStatus();

            // Iniciar la solicitud (el método start de TaskRequest ya verifica el estado)
            TaskRequest startedTaskRequest = taskRequest.start();

            // Guardar la solicitud actualizada
            TaskRequest savedTaskRequest = taskRequestRepository.save(startedTaskRequest);
            logger.info("Solicitud de tarea iniciada con ID: {}", savedTaskRequest.getId());

            // Registrar el cambio de estado en el historial
            String message = "Solicitud iniciada por el ejecutor";
            if (notes != null && !notes.trim().isEmpty()) {
                message += ": " + notes;
            }

            historyService.recordStatusChange(
                    savedTaskRequest.getId(),
                    executorId,
                    null, // No tenemos el nombre del usuario aquí
                    TaskRequestStatus.ASSIGNED,
                    TaskRequestStatus.IN_PROGRESS,
                    message);

            // Crear una copia del objeto para evitar problemas de transacción
            final TaskRequest finalSavedTaskRequest = savedTaskRequest;
            final TaskRequestStatus finalOldStatus = oldStatus;

            // Publicar evento de cambio de estado después de que la transacción se complete
            // Esto evita problemas de transacción con los listeners
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    try {
                        eventPublisher.publishEvent(new TaskRequestStatusChangedEvent(finalSavedTaskRequest, finalOldStatus, executorId));
                        logger.info("Evento de cambio de estado publicado para la solicitud con ID: {}", finalSavedTaskRequest.getId());
                    } catch (Exception e) {
                        logger.error("Error al publicar evento de cambio de estado: {}", e.getMessage(), e);
                    }
                }
            });

            return savedTaskRequest;
        } catch (Exception e) {
            logger.error("Error al iniciar solicitud de tarea: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Inicia una solicitud de tarea, cambiando su estado de ASSIGNED a IN_PROGRESS.
     * Método sobrecargado para mantener compatibilidad.
     *
     * @param id         ID de la solicitud
     * @param executorId ID del ejecutor
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe
     * @throws IllegalStateException    Si la solicitud no está en estado ASSIGNED
     */
    @Transactional
    public TaskRequest start(final Long id, final Long executorId) {
        return start(id, executorId, null);
    }

    /**
     * Marca una solicitud como completada.
     *
     * @param id         ID de la solicitud
     * @param executorId ID del ejecutor
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe
     * @throws IllegalStateException    Si la solicitud no está en estado ASSIGNED o
     *                                  IN_PROGRESS
     */
    @Transactional
    public TaskRequest complete(final Long id, final Long executorId) {
        logger.info("Completando solicitud de tarea con ID: {} por el ejecutor: {}", id, executorId);

        // Buscar la solicitud
        TaskRequest taskRequest = taskRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada con ID: " + id));

        // Completar la solicitud (el método complete de TaskRequest ya verifica el
        // estado)
        TaskRequest completedTaskRequest = taskRequest.complete();

        // Guardar la solicitud actualizada
        TaskRequest savedTaskRequest = taskRequestRepository.save(completedTaskRequest);
        logger.info("Solicitud de tarea completada con ID: {}", savedTaskRequest.getId());

        // Registrar el cambio de estado en el historial
        historyService.recordStatusChange(
                savedTaskRequest.getId(),
                executorId,
                null, // No tenemos el nombre del usuario aquí
                taskRequest.getStatus(), // Usar el estado actual (ASSIGNED o IN_PROGRESS)
                TaskRequestStatus.COMPLETED,
                "Solicitud completada por el ejecutor");

        return savedTaskRequest;
    }

    /**
     * Cancela una solicitud.
     *
     * @param id          ID de la solicitud
     * @param requesterId ID del solicitante
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe o el solicitante
     *                                  no coincide
     * @throws IllegalStateException    Si la solicitud ya está en estado COMPLETED
     *                                  o CANCELLED
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

        // Registrar el cambio de estado en el historial
        historyService.recordStatusChange(
                savedTaskRequest.getId(),
                requesterId,
                null, // No tenemos el nombre del usuario aquí
                taskRequest.getStatus(),
                TaskRequestStatus.CANCELLED,
                "Solicitud cancelada por el solicitante");

        return savedTaskRequest;
    }

    /**
     * Rechaza una solicitud de tarea por parte del asignador.
     *
     * @param id             ID de la solicitud
     * @param assignerId     ID del asignador
     * @param rejectionReason Motivo del rechazo
     * @return La solicitud actualizada
     * @throws IllegalArgumentException Si la solicitud no existe
     * @throws IllegalStateException    Si la solicitud no está en estado SUBMITTED
     */
    @Transactional
    public TaskRequest reject(final Long id, final Long assignerId, final String rejectionReason) {
        logger.info("Rechazando solicitud de tarea con ID: {} por el asignador: {}", id, assignerId);

        // Buscar la solicitud
        TaskRequest taskRequest = taskRequestRepository.findById(id)
                .orElseThrow(() -> new TaskRequestException(
                        "Solicitud no encontrada con ID: " + id,
                        TaskRequestErrorCode.TASK_REQUEST_NOT_FOUND));

        // Rechazar la solicitud (el método reject de TaskRequest ya verifica el estado)
        TaskRequest rejectedTaskRequest = taskRequest.reject(rejectionReason);

        // Asignar el asignador que rechaza la solicitud
        rejectedTaskRequest.assign(assignerId);

        // Guardar la solicitud actualizada
        TaskRequest savedTaskRequest = taskRequestRepository.save(rejectedTaskRequest);
        logger.info("Solicitud de tarea rechazada con ID: {}", savedTaskRequest.getId());

        // Registrar el cambio de estado en el historial
        historyService.recordStatusChange(
                savedTaskRequest.getId(),
                assignerId,
                null, // No tenemos el nombre del usuario aquí
                TaskRequestStatus.SUBMITTED,
                TaskRequestStatus.CANCELLED,
                "Solicitud rechazada por el asignador: " + rejectionReason);

        return savedTaskRequest;
    }

    /**
     * Añade un comentario a una solicitud.
     *
     * @param id      ID de la solicitud
     * @param comment El comentario a añadir
     * @return La solicitud actualizada
     * @throws TaskRequestException Si la solicitud no existe
     * @throws CommentException     Si hay un error al añadir el comentario
     */
    @Transactional
    public TaskRequest addComment(final Long id, final TaskRequestComment comment) {
        logger.info("Añadiendo comentario a la solicitud de tarea con ID: {}", id);

        // Validar el contenido del comentario
        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            throw new CommentException(
                    "El contenido del comentario no puede estar vacío",
                    CommentErrorCode.INVALID_CONTENT);
        }

        // Buscar la solicitud
        TaskRequest taskRequest = taskRequestRepository.findById(id)
                .orElseThrow(() -> new TaskRequestException(
                        "Solicitud no encontrada con ID: " + id,
                        TaskRequestErrorCode.TASK_REQUEST_NOT_FOUND));

        try {
            // Procesar menciones en el comentario
            processMentions(comment);

            // Enviar notificaciones de menciones
            int notificationsSent = mentionNotificationService.processMentions(comment, comment.getUserId());
            if (notificationsSent > 0) {
                logger.info("Se enviaron {} notificaciones de menciones para el comentario", notificationsSent);
            }

            // Procesar menciones especiales como @all
            if (comment.getContent().contains("@all")) {
                // Obtener todos los usuarios relevantes para la solicitud
                // (por ejemplo, el solicitante, el asignador y otros participantes)
                Set<Long> relevantUserIds = new HashSet<>();

                // Añadir el solicitante
                relevantUserIds.add(taskRequest.getRequesterId());

                // Añadir el asignador si existe
                if (taskRequest.getAssignerId() != null) {
                    relevantUserIds.add(taskRequest.getAssignerId());
                }

                // Añadir los usuarios que han comentado en la solicitud
                taskRequest.getComments().stream()
                        .map(TaskRequestComment::getUserId)
                        .forEach(relevantUserIds::add);

                int specialNotificationsSent = mentionNotificationService.processSpecialMentions(
                        comment, comment.getUserId(), relevantUserIds);

                if (specialNotificationsSent > 0) {
                    logger.info("Se enviaron {} notificaciones de mención @all", specialNotificationsSent);
                }
            }

            // Añadir el comentario
            TaskRequest updatedTaskRequest = taskRequest.addComment(comment);

            // Guardar la solicitud actualizada
            TaskRequest savedTaskRequest = taskRequestRepository.save(updatedTaskRequest);
            logger.info("Comentario añadido a la solicitud de tarea con ID: {}", savedTaskRequest.getId());

            return savedTaskRequest;
        } catch (Exception e) {
            logger.error("Error al añadir comentario a la solicitud: {}", e.getMessage(), e);
            throw new CommentException(
                    "Error al guardar el comentario: " + e.getMessage(),
                    e,
                    CommentErrorCode.SAVE_ERROR);
        }
    }

    /**
     * Procesa las menciones en un comentario.
     * Busca patrones @username en el contenido y añade los IDs de usuario
     * correspondientes a la lista de menciones.
     *
     * @param comment El comentario a procesar
     */
    private void processMentions(final TaskRequestComment comment) {
        String content = comment.getContent();
        if (content == null || content.isEmpty()) {
            return;
        }

        // Expresión regular para encontrar menciones con @
        // Busca @username donde username puede contener letras, números, puntos,
        // guiones y guiones bajos
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("@([\\w.-]+)");
        java.util.regex.Matcher matcher = pattern.matcher(content);

        // Procesar cada mención encontrada
        while (matcher.find()) {
            String username = matcher.group(1);
            logger.debug("Encontrada mención a usuario: {}", username);

            // Buscar el ID del usuario por su nombre de usuario
            userRepository.findByUsername(username)
                    .ifPresent(user -> {
                        // Añadir el ID del usuario a las menciones del comentario
                        comment.addMention(user.getId());
                        logger.debug("Usuario encontrado y añadido a menciones: {} (ID: {})",
                                username, user.getId());
                    });
        }
    }

    /**
     * Busca una solicitud por su ID.
     *
     * @param id El ID de la solicitud
     * @return La solicitud encontrada
     * @throws TaskRequestException Si la solicitud no existe
     */
    @Transactional(readOnly = true)
    public TaskRequest findById(final Long id) {
        return taskRequestRepository.findById(id)
                .orElseThrow(() -> new TaskRequestException(
                        "Solicitud no encontrada con ID: " + id,
                        TaskRequestErrorCode.TASK_REQUEST_NOT_FOUND));
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
     * @param page        Número de página (0-indexed)
     * @param size        Tamaño de la página
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
     * @param page       Número de página (0-indexed)
     * @param size       Tamaño de la página
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
     * @param page   Número de página (0-indexed)
     * @param size   Tamaño de la página
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
        Map<TaskRequestStatus, Long> stats = new HashMap<>();
        stats.put(TaskRequestStatus.DRAFT, taskRequestRepository.countByStatus(TaskRequestStatus.DRAFT));
        stats.put(TaskRequestStatus.SUBMITTED, taskRequestRepository.countByStatus(TaskRequestStatus.SUBMITTED));
        stats.put(TaskRequestStatus.ASSIGNED, taskRequestRepository.countByStatus(TaskRequestStatus.ASSIGNED));
        stats.put(TaskRequestStatus.IN_PROGRESS, taskRequestRepository.countByStatus(TaskRequestStatus.IN_PROGRESS));
        stats.put(TaskRequestStatus.COMPLETED, taskRequestRepository.countByStatus(TaskRequestStatus.COMPLETED));
        stats.put(TaskRequestStatus.CANCELLED, taskRequestRepository.countByStatus(TaskRequestStatus.CANCELLED));
        return stats;
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
     * Busca solicitudes por el ID del ejecutor.
     *
     * @param executorId ID del ejecutor
     * @param page       Número de página (0-indexed)
     * @param size       Tamaño de la página
     * @return Lista de solicitudes asignadas al ejecutor
     */
    @Transactional(readOnly = true)
    public List<TaskRequest> findByExecutorId(final Long executorId, final int page, final int size) {
        logger.info("Buscando solicitudes por ejecutor ID: {}, página: {}, tamaño: {}", executorId, page, size);
        return taskRequestRepository.findByExecutorId(executorId, page, size);
    }

    /**
     * Cuenta las solicitudes por ID de ejecutor.
     */
    @Transactional(readOnly = true)
    public long countByExecutorId(Long executorId) {
        return taskRequestRepository.countByExecutorId(executorId);
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

    /**
     * Obtiene los comentarios de una solicitud de tarea.
     *
     * @param taskRequestId ID de la solicitud
     * @return Lista de comentarios de la solicitud
     * @throws IllegalArgumentException Si la solicitud no existe
     */
    @Transactional(readOnly = true)
    public List<TaskRequestComment> getCommentsByTaskRequestId(final Long taskRequestId) {
        logger.info("Obteniendo comentarios para la solicitud de tarea con ID: {}", taskRequestId);

        // Buscar la solicitud
        TaskRequest taskRequest = taskRequestRepository.findById(taskRequestId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitud no encontrada con ID: " + taskRequestId));

        return taskRequest.getComments();
    }

    /**
     * Marca un comentario como leído por un usuario.
     *
     * @param commentId ID del comentario
     * @param userId    ID del usuario
     * @return El comentario actualizado
     * @throws CommentException Si el comentario no existe o hay un error al
     *                          marcarlo como leído
     */
    @Transactional
    public TaskRequestComment markCommentAsRead(final Long commentId, final Long userId) {
        logger.info("Marcando comentario con ID: {} como leído por el usuario: {}", commentId, userId);

        try {
            // Buscar la solicitud que contiene el comentario
            Optional<TaskRequest> taskRequestOpt = taskRequestRepository.findByCommentId(commentId);

            if (taskRequestOpt.isEmpty()) {
                throw new CommentException(
                        "Comentario no encontrado con ID: " + commentId,
                        CommentErrorCode.COMMENT_NOT_FOUND);
            }

            TaskRequest taskRequest = taskRequestOpt.get();

            // Buscar el comentario en la solicitud
            Optional<TaskRequestComment> commentOpt = taskRequest.getComments().stream()
                    .filter(c -> c.getId().equals(commentId))
                    .findFirst();

            if (commentOpt.isEmpty()) {
                throw new CommentException(
                        "Comentario no encontrado con ID: " + commentId,
                        CommentErrorCode.COMMENT_NOT_FOUND);
            }

            TaskRequestComment comment = commentOpt.get();

            // Marcar el comentario como leído
            comment.markAsReadBy(userId);

            // Actualizar la solicitud con el comentario modificado
            TaskRequest updatedTaskRequest = taskRequest.updateComment(comment);

            // Guardar la solicitud actualizada
            TaskRequest savedTaskRequest = taskRequestRepository.save(updatedTaskRequest);

            // Buscar y devolver el comentario actualizado
            return savedTaskRequest.getComments().stream()
                    .filter(c -> c.getId().equals(commentId))
                    .findFirst()
                    .orElseThrow(() -> new CommentException(
                            "Error al actualizar el comentario",
                            CommentErrorCode.MARK_AS_READ_ERROR));
        } catch (CommentException ce) {
            // Re-lanzar excepciones de comentarios
            throw ce;
        } catch (Exception e) {
            // Capturar cualquier otra excepción y convertirla a CommentException
            logger.error("Error al marcar comentario como leído: {}", e.getMessage(), e);
            throw new CommentException(
                    "Error al marcar el comentario como leído: " + e.getMessage(),
                    e,
                    CommentErrorCode.MARK_AS_READ_ERROR);
        }
    }
}
