package com.bitacora.infrastructure.persistence.adapter;

import com.bitacora.domain.model.taskrequest.TaskRequestHistory;
import com.bitacora.domain.port.repository.TaskRequestHistoryRepository;
import com.bitacora.infrastructure.persistence.mapper.TaskRequestHistoryMapper;
import com.bitacora.infrastructure.persistence.repository.TaskRequestHistoryJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adaptador para el repositorio de historial de solicitudes de tareas.
 */
@Component
public class TaskRequestHistoryRepositoryAdapter implements TaskRequestHistoryRepository {

    private final TaskRequestHistoryJpaRepository jpaRepository;
    private final TaskRequestHistoryMapper mapper;

    /**
     * Constructor.
     *
     * @param jpaRepository Repositorio JPA
     * @param mapper        Mapper para convertir entre entidades
     */
    public TaskRequestHistoryRepositoryAdapter(
            final TaskRequestHistoryJpaRepository jpaRepository,
            final TaskRequestHistoryMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    /**
     * Guarda un registro de historial.
     *
     * @param history El registro a guardar
     * @return El registro guardado con ID asignado
     */
    @Override
    public TaskRequestHistory save(final TaskRequestHistory history) {
        var entity = mapper.toEntity(history);
        var savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    /**
     * Busca un registro de historial por su ID.
     *
     * @param id El ID del registro
     * @return El registro encontrado o vacío
     */
    @Override
    public Optional<TaskRequestHistory> findById(final Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    /**
     * Busca registros de historial por ID de solicitud.
     *
     * @param taskRequestId El ID de la solicitud
     * @return Lista de registros de historial ordenados por fecha de cambio (más reciente primero)
     */
    @Override
    public List<TaskRequestHistory> findByTaskRequestId(final Long taskRequestId) {
        return jpaRepository.findByTaskRequestIdOrderByChangeDateDesc(taskRequestId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
}
