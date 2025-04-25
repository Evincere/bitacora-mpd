package com.bitacora.application.activity;

import com.bitacora.domain.model.activity.ActivityHistory;
import com.bitacora.domain.model.activity.ActivityStatusNew;
import com.bitacora.domain.port.repository.ActivityHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Servicio de aplicación para gestionar el historial de actividades.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityHistoryService {

    private final ActivityHistoryRepository activityHistoryRepository;

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

        ActivityHistory history = ActivityHistory.createStatusChange(
                activityId, userId, userName, previousStatus, newStatus, notes);
        return activityHistoryRepository.save(history);
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
        return activityHistoryRepository.findByActivityId(activityId);
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
        return activityHistoryRepository.findByActivityId(activityId, page, size);
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
        return activityHistoryRepository.findByUserId(userId, page, size);
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
        return activityHistoryRepository.findByNewStatus(status.name(), page, size);
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
        return activityHistoryRepository.findByChangeDateBetween(startDate, endDate, page, size);
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
        return activityHistoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Registro de historial no encontrado con ID: " + id));
    }
}
