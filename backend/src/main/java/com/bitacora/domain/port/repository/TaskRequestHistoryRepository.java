package com.bitacora.domain.port.repository;

import com.bitacora.domain.model.taskrequest.TaskRequestHistory;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz de repositorio para la entidad TaskRequestHistory.
 */
public interface TaskRequestHistoryRepository {
    
    /**
     * Guarda un registro de historial.
     * 
     * @param history El registro a guardar
     * @return El registro guardado con ID asignado
     */
    TaskRequestHistory save(TaskRequestHistory history);
    
    /**
     * Busca un registro de historial por su ID.
     * 
     * @param id El ID del registro
     * @return El registro encontrado o vacío
     */
    Optional<TaskRequestHistory> findById(Long id);
    
    /**
     * Busca registros de historial por ID de solicitud.
     * 
     * @param taskRequestId El ID de la solicitud
     * @return Lista de registros de historial ordenados por fecha de cambio (más reciente primero)
     */
    List<TaskRequestHistory> findByTaskRequestId(Long taskRequestId);
}
