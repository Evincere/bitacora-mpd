package com.bitacora.domain.port.repository;

import com.bitacora.domain.model.taskrequest.TaskRequestComment;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz de repositorio para la entidad TaskRequestComment.
 */
public interface TaskRequestCommentRepository {

    /**
     * Guarda un comentario.
     *
     * @param comment El comentario a guardar
     * @return El comentario guardado con su ID asignado
     */
    TaskRequestComment save(TaskRequestComment comment);

    /**
     * Busca un comentario por su ID.
     *
     * @param id El ID del comentario
     * @return Un Optional que contiene el comentario si existe, o vacío si no
     */
    Optional<TaskRequestComment> findById(Long id);

    /**
     * Busca todos los comentarios de una solicitud ordenados por fecha de creación.
     *
     * @param taskRequestId El ID de la solicitud
     * @return Lista de comentarios
     */
    List<TaskRequestComment> findByTaskRequestIdOrderByCreatedAtAsc(Long taskRequestId);

    /**
     * Elimina un comentario por su ID.
     *
     * @param id El ID del comentario
     */
    void deleteById(Long id);
}
