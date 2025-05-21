package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.TaskRequestEntity;
import com.bitacora.infrastructure.persistence.entity.TaskRequestStatusEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Repositorio JPA para la entidad TaskRequestEntity.
 */
@Repository
public interface TaskRequestJpaRepository
        extends JpaRepository<TaskRequestEntity, Long>, JpaSpecificationExecutor<TaskRequestEntity> {

    /**
     * Busca solicitudes por el ID del solicitante.
     *
     * @param requesterId ID del solicitante
     * @param pageable    Información de paginación
     * @return Página de solicitudes
     */
    Page<TaskRequestEntity> findByRequesterId(Long requesterId, Pageable pageable);

    /**
     * Cuenta el número de solicitudes de un solicitante.
     *
     * @param requesterId ID del solicitante
     * @return El número de solicitudes
     */
    long countByRequesterId(Long requesterId);

    /**
     * Busca solicitudes por el ID del asignador.
     *
     * @param assignerId ID del asignador
     * @param pageable   Información de paginación
     * @return Página de solicitudes
     */
    Page<TaskRequestEntity> findByAssignerId(Long assignerId, Pageable pageable);

    /**
     * Cuenta el número de solicitudes asignadas por un asignador.
     *
     * @param assignerId ID del asignador
     * @return El número de solicitudes
     */
    long countByAssignerId(Long assignerId);

    /**
     * Busca solicitudes por estado.
     *
     * @param status   Estado de las solicitudes
     * @param pageable Información de paginación
     * @return Página de solicitudes
     */
    Page<TaskRequestEntity> findByStatus(TaskRequestStatusEntity status, Pageable pageable);

    /**
     * Busca solicitudes por estado y ejecutor.
     *
     * @param status     Estado de las solicitudes
     * @param executorId ID del ejecutor
     * @param pageable   Información de paginación
     * @return Página de solicitudes
     */
    Page<TaskRequestEntity> findByStatusAndExecutorId(TaskRequestStatusEntity status, Long executorId,
            Pageable pageable);

    /**
     * Cuenta el número de solicitudes con un estado y ejecutor específicos.
     *
     * @param status     Estado de las solicitudes
     * @param executorId ID del ejecutor
     * @return El número de solicitudes
     */
    long countByStatusAndExecutorId(TaskRequestStatusEntity status, Long executorId);

    /**
     * Cuenta el número de solicitudes con un estado específico.
     *
     * @param status Estado de las solicitudes
     * @return El número de solicitudes
     */
    long countByStatus(TaskRequestStatusEntity status);

    /**
     * Busca una solicitud que contenga un comentario con el ID especificado.
     *
     * @param commentId ID del comentario
     * @return La solicitud que contiene el comentario
     */
    @org.springframework.data.jpa.repository.Query("SELECT tr FROM TaskRequestEntity tr JOIN tr.comments c WHERE c.id = :commentId")
    TaskRequestEntity findByCommentId(@org.springframework.data.repository.query.Param("commentId") Long commentId);

    /**
     * Busca solicitudes por el ID del ejecutor.
     *
     * @param executorId ID del ejecutor
     * @param pageable   Información de paginación
     * @return Página de solicitudes
     */
    Page<TaskRequestEntity> findByExecutorId(Long executorId, Pageable pageable);

    /**
     * Cuenta el número de solicitudes asignadas a un ejecutor.
     *
     * @param executorId ID del ejecutor
     * @return El número de solicitudes
     */
    long countByExecutorId(Long executorId);
}
