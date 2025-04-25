package com.bitacora.application.activity;

import com.bitacora.domain.model.activity.ActivityComment;
import com.bitacora.domain.port.repository.ActivityCommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * Servicio de aplicación para gestionar comentarios en actividades.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityCommentService {

    private final ActivityCommentRepository activityCommentRepository;

    /**
     * Crea un nuevo comentario.
     *
     * @param activityId ID de la actividad
     * @param userId ID del usuario que comenta
     * @param userName Nombre del usuario que comenta
     * @param content Contenido del comentario
     * @return El comentario creado
     */
    @Transactional
    public ActivityComment createComment(Long activityId, Long userId, String userName, String content) {
        log.debug("Creando comentario para actividad con ID: {}", activityId);
        ActivityComment comment = ActivityComment.create(activityId, userId, userName, content);
        return activityCommentRepository.save(comment);
    }

    /**
     * Actualiza un comentario existente.
     *
     * @param id ID del comentario
     * @param content Nuevo contenido
     * @param userId ID del usuario que actualiza
     * @return El comentario actualizado
     */
    @Transactional
    public ActivityComment updateComment(Long id, String content, Long userId) {
        log.debug("Actualizando comentario con ID: {}", id);

        ActivityComment comment = activityCommentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Comentario no encontrado con ID: " + id));

        // Verificar que el usuario es el propietario del comentario
        if (!comment.getUserId().equals(userId)) {
            throw new SecurityException("No tienes permiso para actualizar este comentario");
        }

        comment.updateContent(content);
        return activityCommentRepository.save(comment);
    }

    /**
     * Obtiene un comentario por su ID.
     *
     * @param id ID del comentario
     * @return El comentario
     */
    @Transactional(readOnly = true)
    public ActivityComment getCommentById(Long id) {
        log.debug("Obteniendo comentario con ID: {}", id);
        return activityCommentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Comentario no encontrado con ID: " + id));
    }

    /**
     * Obtiene los comentarios de una actividad.
     *
     * @param activityId ID de la actividad
     * @return Lista de comentarios
     */
    @Transactional(readOnly = true)
    public List<ActivityComment> getCommentsByActivityId(Long activityId) {
        log.debug("Obteniendo comentarios para actividad con ID: {}", activityId);
        return activityCommentRepository.findByActivityId(activityId);
    }

    /**
     * Obtiene los comentarios de una actividad con paginación.
     *
     * @param activityId ID de la actividad
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de comentarios
     */
    @Transactional(readOnly = true)
    public List<ActivityComment> getCommentsByActivityId(Long activityId, int page, int size) {
        log.debug("Obteniendo comentarios paginados para actividad con ID: {}", activityId);
        return activityCommentRepository.findByActivityId(activityId, page, size);
    }

    /**
     * Obtiene los comentarios realizados por un usuario.
     *
     * @param userId ID del usuario
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de comentarios
     */
    @Transactional(readOnly = true)
    public List<ActivityComment> getCommentsByUserId(Long userId, int page, int size) {
        log.debug("Obteniendo comentarios para usuario con ID: {}", userId);
        return activityCommentRepository.findByUserId(userId, page, size);
    }

    /**
     * Cuenta el número de comentarios en una actividad.
     *
     * @param activityId ID de la actividad
     * @return Número de comentarios
     */
    @Transactional(readOnly = true)
    public long countCommentsByActivityId(Long activityId) {
        log.debug("Contando comentarios para actividad con ID: {}", activityId);
        return activityCommentRepository.countByActivityId(activityId);
    }

    /**
     * Elimina un comentario.
     *
     * @param id ID del comentario
     * @param userId ID del usuario que elimina
     */
    @Transactional
    public void deleteComment(Long id, Long userId) {
        log.debug("Eliminando comentario con ID: {}", id);

        ActivityComment comment = activityCommentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Comentario no encontrado con ID: " + id));

        // Verificar que el usuario es el propietario del comentario
        if (!comment.getUserId().equals(userId)) {
            throw new SecurityException("No tienes permiso para eliminar este comentario");
        }

        activityCommentRepository.deleteById(id);
    }
}
