package com.bitacora.application.activity;

import com.bitacora.domain.model.activity.ActivityHistory;
import com.bitacora.domain.model.activity.ActivityStatusNew;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio de aplicación para gestionar el historial de actividades.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityHistoryService {
    
    private final com.bitacora.domain.service.ActivityHistoryService activityHistoryService;
    
    /**
     * Registra un cambio de estado en una actividad.
     * 
     * @param activityId ID de la actividad
     * @param userId ID del usuario que realiza el cambio
     * @param userName Nombre del usuario que realiza el cambio
     * @param previousStatus Estado anterior
     * @param newStatus Nuevo estado
     * @param notes Notas sobre el cambio
     * @return El registro de historial creado
     */
    @Transactional
    public ActivityHistory recordStatusChange(
            Long activityId, 
            Long userId, 
            String userName, 
            ActivityStatusNew previousStatus, 
            ActivityStatusNew newStatus, 
            String notes) {
        
        log.debug("Registrando cambio de estado para actividad {}: {} -> {}", 
                activityId, previousStatus, newStatus);
        
        return activityHistoryService.recordStatusChange(
                activityId, userId, userName, previousStatus, newStatus, notes);
    }
    
    /**
     * Obtiene el historial de una actividad.
     * 
     * @param activityId ID de la actividad
     * @return Lista de registros de historial
     */
    @Transactional(readOnly = true)
    public List<ActivityHistory> getHistoryByActivityId(Long activityId) {
        log.debug("Obteniendo historial para actividad con ID: {}", activityId);
        return activityHistoryService.getHistoryByActivityId(activityId);
    }
    
    /**
     * Obtiene el historial de una actividad con paginación.
     * 
     * @param activityId ID de la actividad
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de historial
     */
    @Transactional(readOnly = true)
    public List<ActivityHistory> getHistoryByActivityId(Long activityId, int page, int size) {
        log.debug("Obteniendo historial paginado para actividad con ID: {}", activityId);
        return activityHistoryService.getHistoryByActivityId(activityId, page, size);
    }
    
    /**
     * Obtiene el historial de cambios realizados por un usuario.
     * 
     * @param userId ID del usuario
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de historial
     */
    @Transactional(readOnly = true)
    public List<ActivityHistory> getHistoryByUserId(Long userId, int page, int size) {
        log.debug("Obteniendo historial para usuario con ID: {}", userId);
        return activityHistoryService.getHistoryByUserId(userId, page, size);
    }
    
    /**
     * Obtiene el historial de cambios a un estado específico.
     * 
     * @param status Estado
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de historial
     */
    @Transactional(readOnly = true)
    public List<ActivityHistory> getHistoryByNewStatus(ActivityStatusNew status, int page, int size) {
        log.debug("Obteniendo historial para estado: {}", status);
        return activityHistoryService.getHistoryByNewStatus(status, page, size);
    }
    
    /**
     * Obtiene el historial de cambios en un rango de fechas.
     * 
     * @param startDate Fecha de inicio
     * @param endDate Fecha de fin
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de historial
     */
    @Transactional(readOnly = true)
    public List<ActivityHistory> getHistoryByDateRange(LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        log.debug("Obteniendo historial para rango de fechas: {} - {}", startDate, endDate);
        return activityHistoryService.getHistoryByDateRange(startDate, endDate, page, size);
    }
    
    /**
     * Obtiene un registro de historial por su ID.
     * 
     * @param id ID del registro
     * @return El registro de historial
     */
    @Transactional(readOnly = true)
    public ActivityHistory getHistoryById(Long id) {
        log.debug("Obteniendo registro de historial con ID: {}", id);
        return activityHistoryService.getHistoryById(id);
    }
}
