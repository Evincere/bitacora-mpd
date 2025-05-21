package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.TaskRequestAttachmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad TaskRequestAttachmentEntity.
 */
@Repository
public interface TaskRequestAttachmentJpaRepository extends JpaRepository<TaskRequestAttachmentEntity, Long> {

    /**
     * Busca archivos adjuntos por ID de solicitud.
     *
     * @param taskRequestId El ID de la solicitud
     * @return Una lista de archivos adjuntos
     */
    List<TaskRequestAttachmentEntity> findByTaskRequest_IdOrderByUploadedAtDesc(Long taskRequestId);

    /**
     * Busca archivos adjuntos por ID de comentario.
     *
     * @param commentId El ID del comentario
     * @return Una lista de archivos adjuntos
     */
    List<TaskRequestAttachmentEntity> findByCommentIdOrderByUploadedAtDesc(Long commentId);
}
