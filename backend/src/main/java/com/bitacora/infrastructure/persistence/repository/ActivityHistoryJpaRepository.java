package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.ActivityHistoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio JPA para la entidad ActivityHistoryEntity.
 */
@Repository
public interface ActivityHistoryJpaRepository extends JpaRepository<ActivityHistoryEntity, Long> {
    
    /**
     * Busca registros de historial por ID de actividad.
     * 
     * @param activityId El ID de la actividad
     * @return Una lista de registros de historial
     */
    List<ActivityHistoryEntity> findByActivityIdOrderByChangeDateDesc(Long activityId);
    
    /**
     * Busca registros de historial por ID de actividad con paginación.
     * 
     * @param activityId El ID de la actividad
     * @param pageable La información de paginación
     * @return Una página de registros de historial
     */
    Page<ActivityHistoryEntity> findByActivityId(Long activityId, Pageable pageable);
    
    /**
     * Busca registros de historial por ID de usuario.
     * 
     * @param userId El ID del usuario
     * @param pageable La información de paginación
     * @return Una página de registros de historial
     */
    Page<ActivityHistoryEntity> findByUserId(Long userId, Pageable pageable);
    
    /**
     * Busca registros de historial por nuevo estado.
     * 
     * @param newStatus El nuevo estado
     * @param pageable La información de paginación
     * @return Una página de registros de historial
     */
    Page<ActivityHistoryEntity> findByNewStatus(String newStatus, Pageable pageable);
    
    /**
     * Busca registros de historial por rango de fechas.
     * 
     * @param startDate La fecha de inicio
     * @param endDate La fecha de fin
     * @param pageable La información de paginación
     * @return Una página de registros de historial
     */
    Page<ActivityHistoryEntity> findByChangeDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
}
