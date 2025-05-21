package com.bitacora.application.taskrequest;

import com.bitacora.domain.exception.CommentException;
import com.bitacora.domain.exception.CommentException.CommentErrorCode;
import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.domain.port.repository.TaskRequestCommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

/**
 * Servicio de aplicación para gestionar comentarios de solicitudes de tareas.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TaskRequestCommentService {

    private final TaskRequestCommentRepository commentRepository;
    private final TaskRequestWorkflowService workflowService;

    /**
     * Crea un nuevo comentario para una solicitud de tarea.
     *
     * @param taskRequestId ID de la solicitud
     * @param userId        ID del usuario que crea el comentario
     * @param userName      Nombre de usuario que crea el comentario
     * @param content       Contenido del comentario
     * @return El comentario creado
     * @throws CommentException Si hay un error al crear el comentario
     */
    @Transactional
    public TaskRequestComment createComment(Long taskRequestId, Long userId, String userName, String content) {
        log.info("Creando comentario para la solicitud {} por el usuario {}", taskRequestId, userId);

        // Validar el contenido del comentario
        if (content == null || content.trim().isEmpty()) {
            throw new CommentException(
                    "El contenido del comentario no puede estar vacío",
                    CommentErrorCode.INVALID_CONTENT);
        }

        try {
            // Crear el comentario
            TaskRequestComment comment = TaskRequestComment.builder()
                    .taskRequestId(taskRequestId)
                    .userId(userId)
                    .userName(userName)
                    .content(content)
                    .createdAt(LocalDateTime.now())
                    .readBy(new HashSet<>())
                    .mentions(new HashSet<>())
                    .build();

            // Añadir el comentario a la solicitud y guardar todo en una sola operación
            TaskRequest updatedTaskRequest = workflowService.addComment(taskRequestId, comment);

            // Obtener el comentario guardado de la solicitud actualizada
            TaskRequestComment savedComment = updatedTaskRequest.getComments().stream()
                    .filter(c -> c.getUserId().equals(userId) && c.getContent().equals(content))
                    .findFirst()
                    .orElseThrow(() -> new CommentException(
                            "Error al recuperar el comentario guardado",
                            CommentErrorCode.SAVE_ERROR));

            log.info("Comentario creado con ID: {}", savedComment.getId());
            return savedComment;
        } catch (Exception e) {
            log.error("Error al crear comentario: {}", e.getMessage(), e);
            throw new CommentException(
                    "Error al crear el comentario: " + e.getMessage(),
                    e,
                    CommentErrorCode.SAVE_ERROR);
        }
    }

    /**
     * Obtiene un comentario por su ID.
     *
     * @param commentId ID del comentario
     * @return El comentario encontrado
     * @throws CommentException Si el comentario no existe
     */
    @Transactional(readOnly = true)
    public TaskRequestComment getCommentById(Long commentId) {
        log.info("Obteniendo comentario con ID: {}", commentId);
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentException(
                        "Comentario no encontrado con ID: " + commentId,
                        CommentErrorCode.COMMENT_NOT_FOUND));
    }

    /**
     * Obtiene todos los comentarios de una solicitud.
     *
     * @param taskRequestId ID de la solicitud
     * @return Lista de comentarios
     */
    @Transactional(readOnly = true)
    public List<TaskRequestComment> getCommentsByTaskRequestId(Long taskRequestId) {
        log.info("Obteniendo comentarios para la solicitud: {}", taskRequestId);
        return commentRepository.findByTaskRequestIdOrderByCreatedAtAsc(taskRequestId);
    }

    /**
     * Marca un comentario como leído por un usuario.
     *
     * @param commentId ID del comentario
     * @param userId    ID del usuario
     * @return El comentario actualizado
     * @throws CommentException Si hay un error al marcar el comentario como leído
     */
    @Transactional
    public TaskRequestComment markAsRead(Long commentId, Long userId) {
        log.info("Marcando comentario {} como leído por el usuario {}", commentId, userId);

        try {
            // Obtener el comentario
            TaskRequestComment comment = getCommentById(commentId);

            // Marcar como leído
            comment.markAsReadBy(userId);

            // Guardar el comentario actualizado
            TaskRequestComment updatedComment = commentRepository.save(comment);
            log.info("Comentario {} marcado como leído por el usuario {}", commentId, userId);

            return updatedComment;
        } catch (CommentException ce) {
            throw ce;
        } catch (Exception e) {
            log.error("Error al marcar comentario como leído: {}", e.getMessage(), e);
            throw new CommentException(
                    "Error al marcar el comentario como leído: " + e.getMessage(),
                    e,
                    CommentErrorCode.MARK_AS_READ_ERROR);
        }
    }
}
