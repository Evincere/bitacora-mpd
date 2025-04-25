package com.bitacora.domain.port.repository;

import com.bitacora.domain.model.activity.ActivityHistory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Interfaz de repositorio para la entidad ActivityHistory.
 */
public interface ActivityHistoryRepository {
    
    /**
     * Guarda un registro de historial.
     * 
     * @param history El registro a guardar
     * @return El registro guardado con ID asignado
     */
    ActivityHistory save(ActivityHistory history);
    
    /**
     * Busca un registro de historial por su ID.
     * 
     * @param id El ID del registro
     * @return El registro encontrado o vacío
     */
    Optional<ActivityHistory> findById(Long id);
    
    /**
     * Busca registros de historial por ID de actividad.
     * 
     * @param activityId El ID de la actividad
     * @return Lista de registros de historial
     */
    List<ActivityHistory> findByActivityId(Long activityId);
    
    /**
     * Busca registros de historial por ID de actividad con paginación.
     * 
     * @param activityId El ID de la actividad
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de historial
     */
    List<ActivityHistory> findByActivityId(Long activityId, int page, int size);
    
    /**
     * Busca registros de historial por ID de usuario.
     * 
     * @param userId El ID del usuario
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de historial
     */
    List<ActivityHistory> findByUserId(Long userId, int page, int size);
    
    /**
     * Busca registros de historial por nuevo estado.
     * 
     * @param newStatus El nuevo estado
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de historial
     */
    List<ActivityHistory> findByNewStatus(String newStatus, int page, int size);
    
    /**
     * Busca registros de historial por rango de fechas.
     * 
     * @param startDate La fecha de inicio
     * @param endDate La fecha de fin
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de historial
     */
    List<ActivityHistory> findByChangeDateBetween(LocalDateTime startDate, LocalDateTime endDate, int page, int size);
    
    /**
     * Elimina un registro de historial por su ID.
     * 
     * @param id El ID del registro
     */
    void deleteById(Long id);
}
