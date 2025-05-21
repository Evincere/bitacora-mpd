package com.bitacora.application.taskrequest;

import com.bitacora.domain.model.taskrequest.TaskRequestHistory;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.domain.port.repository.TaskRequestHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio de aplicación para gestionar el historial de solicitudes de tareas.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TaskRequestHistoryService {

    private final TaskRequestHistoryRepository taskRequestHistoryRepository;

    /**
     * Registra un cambio de estado en una solicitud de tarea.
     *
     * @param taskRequestId  ID de la solicitud
     * @param userId         ID del usuario que realiza el cambio
     * @param userName       Nombre del usuario que realiza el cambio
     * @param previousStatus Estado anterior
     * @param newStatus      Nuevo estado
     * @param notes          Notas sobre el cambio
     * @return El registro de historial creado
     */
    @Transactional
    public TaskRequestHistory recordStatusChange(
            final Long taskRequestId,
            final Long userId,
            final String userName,
            final TaskRequestStatus previousStatus,
            final TaskRequestStatus newStatus,
            final String notes) {

        log.debug("Registrando cambio de estado para solicitud {}: {} -> {}",
                taskRequestId, previousStatus, newStatus);

        // Verificar que newStatus no sea nulo
        if (newStatus == null) {
            throw new IllegalArgumentException("El nuevo estado no puede ser nulo");
        }

        TaskRequestHistory history = TaskRequestHistory.createStatusChange(
                taskRequestId, userId, userName, previousStatus, newStatus, notes);
        return taskRequestHistoryRepository.save(history);
    }

    /**
     * Obtiene el historial de una solicitud de tarea.
     *
     * @param taskRequestId ID de la solicitud
     * @return Lista de registros de historial
     */
    @Transactional(readOnly = true)
    public List<TaskRequestHistory> getHistoryByTaskRequestId(final Long taskRequestId) {
        log.debug("Obteniendo historial para solicitud con ID: {}", taskRequestId);
        return taskRequestHistoryRepository.findByTaskRequestId(taskRequestId);
    }
}
