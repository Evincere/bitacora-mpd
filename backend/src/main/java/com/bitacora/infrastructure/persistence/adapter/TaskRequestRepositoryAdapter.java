package com.bitacora.infrastructure.persistence.adapter;

import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.domain.port.repository.TaskRequestRepository;
import com.bitacora.infrastructure.persistence.entity.TaskRequestStatusEntity;
import com.bitacora.infrastructure.persistence.mapper.TaskRequestEntityMapper;
import com.bitacora.infrastructure.persistence.repository.TaskRequestJpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Adaptador que implementa la interfaz TaskRequestRepository utilizando JPA.
 */
@Component
public class TaskRequestRepositoryAdapter implements TaskRequestRepository {

    private final TaskRequestJpaRepository jpaRepository;
    private final TaskRequestEntityMapper mapper;

    /**
     * Constructor.
     *
     * @param jpaRepository Repositorio JPA
     * @param mapper        Mapper para convertir entre entidades
     */
    public TaskRequestRepositoryAdapter(TaskRequestJpaRepository jpaRepository, TaskRequestEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    /**
     * Guarda una solicitud de tarea.
     *
     * @param taskRequest La solicitud a guardar
     * @return La solicitud guardada con su ID asignado
     */
    @Override
    public TaskRequest save(TaskRequest taskRequest) {
        var entity = mapper.toEntity(taskRequest);
        var savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    /**
     * Busca una solicitud por su ID.
     *
     * @param id El ID de la solicitud
     * @return Un Optional que contiene la solicitud si existe, o vacío si no
     */
    @Override
    public Optional<TaskRequest> findById(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    /**
     * Busca todas las solicitudes.
     *
     * @param page Número de página (0-indexed)
     * @param size Tamaño de la página
     * @return Lista de solicitudes
     */
    @Override
    public List<TaskRequest> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "requestDate"));
        Page<TaskRequest> taskRequestPage = jpaRepository.findAll(pageable)
                .map(mapper::toDomain);
        return taskRequestPage.getContent();
    }

    /**
     * Cuenta el número total de solicitudes.
     *
     * @return El número total de solicitudes
     */
    @Override
    public long count() {
        return jpaRepository.count();
    }

    /**
     * Busca solicitudes por el ID del solicitante.
     *
     * @param requesterId ID del solicitante
     * @param page        Número de página (0-indexed)
     * @param size        Tamaño de la página
     * @return Lista de solicitudes del solicitante
     */
    @Override
    public List<TaskRequest> findByRequesterId(Long requesterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "requestDate"));
        Page<TaskRequest> taskRequestPage = jpaRepository.findByRequesterId(requesterId, pageable)
                .map(mapper::toDomain);
        return taskRequestPage.getContent();
    }

    /**
     * Cuenta el número de solicitudes de un solicitante.
     *
     * @param requesterId ID del solicitante
     * @return El número de solicitudes del solicitante
     */
    @Override
    public long countByRequesterId(Long requesterId) {
        return jpaRepository.countByRequesterId(requesterId);
    }

    /**
     * Busca solicitudes por el ID del asignador.
     *
     * @param assignerId ID del asignador
     * @param page       Número de página (0-indexed)
     * @param size       Tamaño de la página
     * @return Lista de solicitudes asignadas por el asignador
     */
    @Override
    public List<TaskRequest> findByAssignerId(Long assignerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "assignmentDate"));
        Page<TaskRequest> taskRequestPage = jpaRepository.findByAssignerId(assignerId, pageable)
                .map(mapper::toDomain);
        return taskRequestPage.getContent();
    }

    /**
     * Cuenta el número de solicitudes asignadas por un asignador.
     *
     * @param assignerId ID del asignador
     * @return El número de solicitudes asignadas por el asignador
     */
    @Override
    public long countByAssignerId(Long assignerId) {
        return jpaRepository.countByAssignerId(assignerId);
    }

    /**
     * Busca solicitudes por estado.
     *
     * @param status Estado de las solicitudes
     * @param page   Número de página (0-indexed)
     * @param size   Tamaño de la página
     * @return Lista de solicitudes con el estado especificado
     */
    @Override
    public List<TaskRequest> findByStatus(TaskRequestStatus status, int page, int size) {
        TaskRequestStatusEntity statusEntity = mapToStatusEntity(status);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "requestDate"));
        Page<TaskRequest> taskRequestPage = jpaRepository.findByStatus(statusEntity, pageable)
                .map(mapper::toDomain);
        return taskRequestPage.getContent();
    }

    /**
     * Cuenta el número de solicitudes con un estado específico.
     *
     * @param status Estado de las solicitudes
     * @return El número de solicitudes con el estado especificado
     */
    @Override
    public long countByStatus(TaskRequestStatus status) {
        TaskRequestStatusEntity statusEntity = mapToStatusEntity(status);
        return jpaRepository.countByStatus(statusEntity);
    }

    /**
     * Elimina una solicitud por su ID.
     *
     * @param id ID de la solicitud a eliminar
     */
    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    /**
     * Busca una solicitud que contenga un comentario con el ID especificado.
     *
     * @param commentId ID del comentario
     * @return Un Optional que contiene la solicitud si existe, o vacío si no
     */
    @Override
    public Optional<TaskRequest> findByCommentId(Long commentId) {
        var entity = jpaRepository.findByCommentId(commentId);
        return Optional.ofNullable(entity).map(mapper::toDomain);
    }

    /**
     * Busca solicitudes por el ID del ejecutor.
     *
     * @param executorId ID del ejecutor
     * @param page       Número de página (0-indexed)
     * @param size       Tamaño de la página
     * @return Lista de solicitudes asignadas al ejecutor
     */
    @Override
    public List<TaskRequest> findByExecutorId(Long executorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "assignmentDate"));
        Page<TaskRequest> taskRequestPage = jpaRepository.findByExecutorId(executorId, pageable)
                .map(mapper::toDomain);
        return taskRequestPage.getContent();
    }

    /**
     * Cuenta el número de solicitudes asignadas a un ejecutor.
     *
     * @param executorId ID del ejecutor
     * @return El número de solicitudes asignadas al ejecutor
     */
    @Override
    public long countByExecutorId(Long executorId) {
        return jpaRepository.countByExecutorId(executorId);
    }

    /**
     * Convierte un enum de dominio TaskRequestStatus a un enum de entidad
     * TaskRequestStatusEntity.
     *
     * @param status El enum de dominio a convertir
     * @return El enum de entidad resultante
     */
    private TaskRequestStatusEntity mapToStatusEntity(TaskRequestStatus status) {
        if (status == null) {
            return TaskRequestStatusEntity.DRAFT;
        }

        switch (status) {
            case DRAFT:
                return TaskRequestStatusEntity.DRAFT;
            case SUBMITTED:
                return TaskRequestStatusEntity.SUBMITTED;
            case ASSIGNED:
                return TaskRequestStatusEntity.ASSIGNED;
            case COMPLETED:
                return TaskRequestStatusEntity.COMPLETED;
            case CANCELLED:
                return TaskRequestStatusEntity.CANCELLED;
            default:
                return TaskRequestStatusEntity.DRAFT;
        }
    }
}
