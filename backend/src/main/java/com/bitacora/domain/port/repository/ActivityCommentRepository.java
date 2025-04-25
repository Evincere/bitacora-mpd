package com.bitacora.domain.port.repository;

import com.bitacora.domain.model.activity.ActivityComment;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz de repositorio para la entidad ActivityComment.
 */
public interface ActivityCommentRepository {
    
    /**
     * Guarda un comentario.
     * 
     * @param comment El comentario a guardar
     * @return El comentario guardado con ID asignado
     */
    ActivityComment save(ActivityComment comment);
    
    /**
     * Busca un comentario por su ID.
     * 
     * @param id El ID del comentario
     * @return El comentario encontrado o vacío
     */
    Optional<ActivityComment> findById(Long id);
    
    /**
     * Busca comentarios por ID de actividad.
     * 
     * @param activityId El ID de la actividad
     * @return Lista de comentarios
     */
    List<ActivityComment> findByActivityId(Long activityId);
    
    /**
     * Busca comentarios por ID de actividad con paginación.
     * 
     * @param activityId El ID de la actividad
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de comentarios
     */
    List<ActivityComment> findByActivityId(Long activityId, int page, int size);
    
    /**
     * Busca comentarios por ID de usuario.
     * 
     * @param userId El ID del usuario
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de comentarios
     */
    List<ActivityComment> findByUserId(Long userId, int page, int size);
    
    /**
     * Cuenta el número de comentarios por ID de actividad.
     * 
     * @param activityId El ID de la actividad
     * @return El número de comentarios
     */
    long countByActivityId(Long activityId);
    
    /**
     * Elimina un comentario por su ID.
     * 
     * @param id El ID del comentario
     */
    void deleteById(Long id);
}
