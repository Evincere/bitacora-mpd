package com.bitacora.domain.port.repository;

import com.bitacora.domain.model.taskrequest.TaskRequestAttachment;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para gestionar los archivos adjuntos de las solicitudes de
 * tareas.
 */
public interface TaskRequestAttachmentRepository {

    /**
     * Guarda un archivo adjunto.
     *
     * @param attachment El archivo adjunto a guardar
     * @return El archivo adjunto guardado con su ID asignado
     */
    TaskRequestAttachment save(TaskRequestAttachment attachment);

    /**
     * Busca un archivo adjunto por su ID.
     *
     * @param id El ID del archivo adjunto
     * @return Un Optional que contiene el archivo adjunto si existe, o vacío si no
     */
    Optional<TaskRequestAttachment> findById(Long id);

    /**
     * Busca archivos adjuntos por ID de solicitud.
     *
     * @param taskRequestId El ID de la solicitud
     * @return Una lista de archivos adjuntos
     */
    List<TaskRequestAttachment> findByTaskRequestId(Long taskRequestId);

    /**
     * Busca archivos adjuntos por ID de comentario.
     *
     * @param commentId El ID del comentario
     * @return Una lista de archivos adjuntos
     */
    List<TaskRequestAttachment> findByCommentId(Long commentId);

    /**
     * Elimina un archivo adjunto por su ID.
     *
     * @param id El ID del archivo adjunto
     */
    void deleteById(Long id);
}
