package com.bitacora.infrastructure.persistence.adapter;

import com.bitacora.domain.model.taskrequest.TaskRequestAttachment;
import com.bitacora.domain.port.repository.TaskRequestAttachmentRepository;
import com.bitacora.infrastructure.persistence.mapper.TaskRequestAttachmentEntityMapper;
import com.bitacora.infrastructure.persistence.repository.TaskRequestAttachmentJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adaptador que implementa la interfaz TaskRequestAttachmentRepository
 * utilizando JPA.
 */
@Component
public class TaskRequestAttachmentRepositoryAdapter implements TaskRequestAttachmentRepository {

    private final TaskRequestAttachmentJpaRepository jpaRepository;
    private final TaskRequestAttachmentEntityMapper mapper;

    /**
     * Constructor.
     *
     * @param jpaRepository Repositorio JPA
     * @param mapper        Mapper para convertir entre entidades
     */
    public TaskRequestAttachmentRepositoryAdapter(
            TaskRequestAttachmentJpaRepository jpaRepository,
            TaskRequestAttachmentEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    /**
     * Guarda un archivo adjunto.
     *
     * @param attachment El archivo adjunto a guardar
     * @return El archivo adjunto guardado con su ID asignado
     */
    @Override
    public TaskRequestAttachment save(TaskRequestAttachment attachment) {
        var entity = mapper.toEntity(attachment);
        var savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    /**
     * Busca un archivo adjunto por su ID.
     *
     * @param id El ID del archivo adjunto
     * @return Un Optional que contiene el archivo adjunto si existe, o vacío si no
     */
    @Override
    public Optional<TaskRequestAttachment> findById(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    /**
     * Busca archivos adjuntos por ID de solicitud.
     *
     * @param taskRequestId El ID de la solicitud
     * @return Una lista de archivos adjuntos
     */
    @Override
    public List<TaskRequestAttachment> findByTaskRequestId(Long taskRequestId) {
        return jpaRepository.findByTaskRequest_IdOrderByUploadedAtDesc(taskRequestId)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    /**
     * Busca archivos adjuntos por ID de comentario.
     *
     * @param commentId El ID del comentario
     * @return Una lista de archivos adjuntos
     */
    @Override
    public List<TaskRequestAttachment> findByCommentId(Long commentId) {
        return jpaRepository.findByCommentIdOrderByUploadedAtDesc(commentId)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    /**
     * Elimina un archivo adjunto por su ID.
     *
     * @param id El ID del archivo adjunto
     */
    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}
