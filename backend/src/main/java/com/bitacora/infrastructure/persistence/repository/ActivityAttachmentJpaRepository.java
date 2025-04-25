package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.ActivityAttachmentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad ActivityAttachmentEntity.
 */
@Repository
public interface ActivityAttachmentJpaRepository extends JpaRepository<ActivityAttachmentEntity, Long> {
    
    /**
     * Busca adjuntos por ID de actividad.
     * 
     * @param activityId El ID de la actividad
     * @return Una lista de adjuntos
     */
    List<ActivityAttachmentEntity> findByActivityIdOrderByUploadedAtDesc(Long activityId);
    
    /**
     * Busca adjuntos por ID de actividad con paginación.
     * 
     * @param activityId El ID de la actividad
     * @param pageable La información de paginación
     * @return Una página de adjuntos
     */
    Page<ActivityAttachmentEntity> findByActivityId(Long activityId, Pageable pageable);
    
    /**
     * Busca adjuntos por ID de usuario.
     * 
     * @param userId El ID del usuario
     * @param pageable La información de paginación
     * @return Una página de adjuntos
     */
    Page<ActivityAttachmentEntity> findByUserId(Long userId, Pageable pageable);
    
    /**
     * Busca adjuntos por tipo de archivo.
     * 
     * @param fileType El tipo de archivo
     * @param pageable La información de paginación
     * @return Una página de adjuntos
     */
    Page<ActivityAttachmentEntity> findByFileTypeContainingIgnoreCase(String fileType, Pageable pageable);
    
    /**
     * Cuenta el número de adjuntos por ID de actividad.
     * 
     * @param activityId El ID de la actividad
     * @return El número de adjuntos
     */
    long countByActivityId(Long activityId);
}
