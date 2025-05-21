package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.TaskRequestCommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad TaskRequestCommentEntity.
 */
@Repository
public interface TaskRequestCommentJpaRepository extends JpaRepository<TaskRequestCommentEntity, Long> {

    /**
     * Busca todos los comentarios de una solicitud ordenados por fecha de creación.
     *
     * @param taskRequestId El ID de la solicitud
     * @return Lista de comentarios
     */
    List<TaskRequestCommentEntity> findByTaskRequest_IdOrderByCreatedAtAsc(Long taskRequestId);
}
