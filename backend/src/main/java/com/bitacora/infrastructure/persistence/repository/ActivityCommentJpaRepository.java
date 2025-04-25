package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.ActivityCommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad ActivityCommentEntity.
 */
@Repository
public interface ActivityCommentJpaRepository extends JpaRepository<ActivityCommentEntity, Long> {
    
    /**
     * Busca comentarios por ID de actividad.
     * 
     * @param activityId El ID de la actividad
     * @return Una lista de comentarios
     */
    List<ActivityCommentEntity> findByActivityIdOrderByCreatedAtDesc(Long activityId);
    
    /**
     * Busca comentarios por ID de actividad con paginación.
     * 
     * @param activityId El ID de la actividad
     * @param pageable La información de paginación
     * @return Una página de comentarios
     */
    Page<ActivityCommentEntity> findByActivityId(Long activityId, Pageable pageable);
    
    /**
     * Busca comentarios por ID de usuario.
     * 
     * @param userId El ID del usuario
     * @param pageable La información de paginación
     * @return Una página de comentarios
     */
    Page<ActivityCommentEntity> findByUserId(Long userId, Pageable pageable);
    
    /**
     * Cuenta el número de comentarios por ID de actividad.
     * 
     * @param activityId El ID de la actividad
     * @return El número de comentarios
     */
    long countByActivityId(Long activityId);
}
