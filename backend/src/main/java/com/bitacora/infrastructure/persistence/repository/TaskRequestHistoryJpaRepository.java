package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.infrastructure.persistence.entity.TaskRequestHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad TaskRequestHistoryEntity.
 */
@Repository
public interface TaskRequestHistoryJpaRepository extends JpaRepository<TaskRequestHistoryEntity, Long> {
    
    /**
     * Busca registros de historial por ID de solicitud ordenados por fecha de cambio (más reciente primero).
     * 
     * @param taskRequestId El ID de la solicitud
     * @return Lista de registros de historial
     */
    List<TaskRequestHistoryEntity> findByTaskRequestIdOrderByChangeDateDesc(Long taskRequestId);
}
