package com.bitacora.infrastructure.persistence.adapter;

import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.domain.port.repository.TaskRequestCommentRepository;
import com.bitacora.infrastructure.persistence.entity.TaskRequestCommentEntity;
import com.bitacora.infrastructure.persistence.mapper.TaskRequestCommentEntityMapper;
import com.bitacora.infrastructure.persistence.repository.TaskRequestCommentJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adaptador para el repositorio de comentarios de solicitudes de tareas.
 */
@Component
@RequiredArgsConstructor
public class TaskRequestCommentRepositoryAdapter implements TaskRequestCommentRepository {

    private final TaskRequestCommentJpaRepository jpaRepository;
    private final TaskRequestCommentEntityMapper mapper;

    /**
     * Guarda un comentario.
     *
     * @param comment El comentario a guardar
     * @return El comentario guardado con su ID asignado
     */
    @Override
    public TaskRequestComment save(TaskRequestComment comment) {
        TaskRequestCommentEntity entity = mapper.toEntity(comment);
        TaskRequestCommentEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    /**
     * Busca un comentario por su ID.
     *
     * @param id El ID del comentario
     * @return Un Optional que contiene el comentario si existe, o vacío si no
     */
    @Override
    public Optional<TaskRequestComment> findById(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    /**
     * Busca todos los comentarios de una solicitud ordenados por fecha de creación.
     *
     * @param taskRequestId El ID de la solicitud
     * @return Lista de comentarios
     */
    @Override
    public List<TaskRequestComment> findByTaskRequestIdOrderByCreatedAtAsc(Long taskRequestId) {
        return jpaRepository.findByTaskRequest_IdOrderByCreatedAtAsc(taskRequestId)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    /**
     * Elimina un comentario por su ID.
     *
     * @param id El ID del comentario
     */
    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}
