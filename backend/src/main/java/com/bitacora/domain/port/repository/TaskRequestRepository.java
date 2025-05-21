package com.bitacora.domain.port.repository;

import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz que define las operaciones de repositorio para la entidad
 * TaskRequest.
 * Siguiendo el patrón de puertos y adaptadores, esta interfaz actúa como un
 * puerto
 * en la capa de dominio que será implementado por un adaptador en la capa de
 * infraestructura.
 */
public interface TaskRequestRepository {

    /**
     * Guarda una solicitud de tarea.
     *
     * @param taskRequest La solicitud a guardar
     * @return La solicitud guardada con su ID asignado
     */
    TaskRequest save(TaskRequest taskRequest);

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
     * Cuenta el número total de solicitudes.
     *
     * @return El número total de solicitudes
     */
    long count();

    /**
     * Busca solicitudes por el ID del solicitante.
     *
     * @param requesterId ID del solicitante
     * @param page        Número de página (0-indexed)
     * @param size        Tamaño de la página
     * @return Lista de solicitudes del solicitante
     */
    List<TaskRequest> findByRequesterId(Long requesterId, int page, int size);

    /**
     * Cuenta el número de solicitudes de un solicitante.
     *
     * @param requesterId ID del solicitante
     * @return El número de solicitudes del solicitante
     */
    long countByRequesterId(Long requesterId);

    /**
     * Busca solicitudes por el ID del asignador.
     *
     * @param assignerId ID del asignador
     * @param page       Número de página (0-indexed)
     * @param size       Tamaño de la página
     * @return Lista de solicitudes asignadas por el asignador
     */
    List<TaskRequest> findByAssignerId(Long assignerId, int page, int size);

    /**
     * Cuenta el número de solicitudes asignadas por un asignador.
     *
     * @param assignerId ID del asignador
     * @return El número de solicitudes asignadas por el asignador
     */
    long countByAssignerId(Long assignerId);

    /**
     * Busca solicitudes por estado.
     *
     * @param status Estado de las solicitudes
     * @param page   Número de página (0-indexed)
     * @param size   Tamaño de la página
     * @return Lista de solicitudes con el estado especificado
     */
    List<TaskRequest> findByStatus(TaskRequestStatus status, int page, int size);

    /**
     * Busca solicitudes por estado y ejecutor.
     *
     * @param status     Estado de las solicitudes
     * @param executorId ID del ejecutor
     * @param page       Número de página (0-indexed)
     * @param size       Tamaño de la página
     * @return Lista de solicitudes con el estado y ejecutor especificados
     */
    List<TaskRequest> findByStatusAndExecutorId(TaskRequestStatus status, Long executorId, int page, int size);

    /**
     * Cuenta el número de solicitudes con un estado y ejecutor específicos.
     *
     * @param status     Estado de las solicitudes
     * @param executorId ID del ejecutor
     * @return El número de solicitudes
     */
    long countByStatusAndExecutorId(TaskRequestStatus status, Long executorId);

    /**
     * Cuenta el número de solicitudes con un estado específico.
     *
     * @param status Estado de las solicitudes
     * @return El número de solicitudes con el estado especificado
     */
    long countByStatus(TaskRequestStatus status);

    /**
     * Elimina una solicitud por su ID.
     *
     * @param id ID de la solicitud a eliminar
     */
    void deleteById(Long id);

    /**
     * Busca una solicitud que contenga un comentario con el ID especificado.
     *
     * @param commentId ID del comentario
     * @return Un Optional que contiene la solicitud si existe, o vacío si no
     */
    Optional<TaskRequest> findByCommentId(Long commentId);

    /**
     * Busca solicitudes por el ID del ejecutor.
     *
     * @param executorId ID del ejecutor
     * @param page       Número de página (0-indexed)
     * @param size       Tamaño de la página
     * @return Lista de solicitudes asignadas al ejecutor
     */
    List<TaskRequest> findByExecutorId(Long executorId, int page, int size);

    /**
     * Cuenta el número de solicitudes asignadas a un ejecutor.
     *
     * @param executorId ID del ejecutor
     * @return El número de solicitudes asignadas al ejecutor
     */
    long countByExecutorId(Long executorId);
}
