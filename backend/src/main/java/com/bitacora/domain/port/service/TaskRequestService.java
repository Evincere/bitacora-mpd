package com.bitacora.domain.port.service;

import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz que define las operaciones de servicio para la entidad TaskRequest.
 * Esta interfaz define las operaciones de negocio relacionadas con las solicitudes de tareas.
 */
public interface TaskRequestService {

    /**
     * Crea una nueva solicitud de tarea en estado DRAFT.
     *
     * @param taskRequest La solicitud a crear
     * @return La solicitud creada con su ID asignado
     */
    TaskRequest createDraft(TaskRequest taskRequest);

    /**
     * Envía una solicitud de tarea, cambiando su estado de DRAFT a SUBMITTED.
     *
     * @param id ID de la solicitud
     * @param requesterId ID del solicitante
     * @return La solicitud actualizada
     * @throws IllegalStateException Si la solicitud no está en estado DRAFT
     * @throws IllegalArgumentException Si el ID del solicitante no coincide con el de la solicitud
     */
    TaskRequest submit(Long id, Long requesterId);

    /**
     * Asigna una solicitud de tarea a un asignador.
     *
     * @param id ID de la solicitud
     * @param assignerId ID del asignador
     * @return La solicitud actualizada
     * @throws IllegalStateException Si la solicitud no está en estado SUBMITTED
     */
    TaskRequest assign(Long id, Long assignerId);

    /**
     * Marca una solicitud como completada.
     *
     * @param id ID de la solicitud
     * @return La solicitud actualizada
     * @throws IllegalStateException Si la solicitud no está en estado ASSIGNED
     */
    TaskRequest complete(Long id);

    /**
     * Cancela una solicitud.
     *
     * @param id ID de la solicitud
     * @param requesterId ID del solicitante
     * @return La solicitud actualizada
     * @throws IllegalStateException Si la solicitud ya está en estado COMPLETED o CANCELLED
     * @throws IllegalArgumentException Si el ID del solicitante no coincide con el de la solicitud
     */
    TaskRequest cancel(Long id, Long requesterId);

    /**
     * Añade un comentario a una solicitud.
     *
     * @param id ID de la solicitud
     * @param comment El comentario a añadir
     * @return La solicitud actualizada
     */
    TaskRequest addComment(Long id, TaskRequestComment comment);

    /**
     * Busca una solicitud por su ID.
     *
     * @param id El ID de la solicitud
     * @return Un Optional que contiene la solicitud si existe, o vacío si no
     */
    Optional<TaskRequest> findById(Long id);

    /**
     * Busca todas las solicitudes.
     *
     * @param page Número de página (0-indexed)
     * @param size Tamaño de la página
     * @return Lista de solicitudes
     */
    List<TaskRequest> findAll(int page, int size);

    /**
     * Busca solicitudes por el ID del solicitante.
     *
     * @param requesterId ID del solicitante
     * @param page Número de página (0-indexed)
     * @param size Tamaño de la página
     * @return Lista de solicitudes del solicitante
     */
    List<TaskRequest> findByRequesterId(Long requesterId, int page, int size);

    /**
     * Busca solicitudes por el ID del asignador.
     *
     * @param assignerId ID del asignador
     * @param page Número de página (0-indexed)
     * @param size Tamaño de la página
     * @return Lista de solicitudes asignadas por el asignador
     */
    List<TaskRequest> findByAssignerId(Long assignerId, int page, int size);

    /**
     * Busca solicitudes por estado.
     *
     * @param status Estado de las solicitudes
     * @param page Número de página (0-indexed)
     * @param size Tamaño de la página
     * @return Lista de solicitudes con el estado especificado
     */
    List<TaskRequest> findByStatus(TaskRequestStatus status, int page, int size);

    /**
     * Obtiene estadísticas de solicitudes por estado.
     *
     * @return Un mapa con el número de solicitudes por estado
     */
    java.util.Map<TaskRequestStatus, Long> getStatsByStatus();

    /**
     * Obtiene estadísticas de solicitudes por solicitante.
     *
     * @param limit Número máximo de solicitantes a incluir
     * @return Un mapa con el número de solicitudes por solicitante
     */
    java.util.Map<Long, Long> getStatsByRequester(int limit);
}
