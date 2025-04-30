package com.bitacora.infrastructure.persistence.adapter;

import com.bitacora.domain.model.taskrequest.TaskRequestCategory;
import com.bitacora.domain.port.repository.TaskRequestCategoryRepository;
import com.bitacora.infrastructure.persistence.mapper.TaskRequestCategoryEntityMapper;
import com.bitacora.infrastructure.persistence.repository.TaskRequestCategoryJpaRepository;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Adaptador que implementa la interfaz TaskRequestCategoryRepository utilizando JPA.
 */
@Component
public class TaskRequestCategoryRepositoryAdapter implements TaskRequestCategoryRepository {

    private final TaskRequestCategoryJpaRepository jpaRepository;
    private final TaskRequestCategoryEntityMapper mapper;

    /**
     * Constructor.
     *
     * @param jpaRepository Repositorio JPA
     * @param mapper Mapper para convertir entre entidades
     */
    public TaskRequestCategoryRepositoryAdapter(TaskRequestCategoryJpaRepository jpaRepository, TaskRequestCategoryEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    /**
     * Guarda una categoría de solicitud.
     *
     * @param category La categoría a guardar
     * @return La categoría guardada con su ID asignado
     */
    @Override
    public TaskRequestCategory save(TaskRequestCategory category) {
        var entity = mapper.toEntity(category);
        var savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    /**
     * Busca una categoría por su ID.
     *
     * @param id El ID de la categoría
     * @return Un Optional que contiene la categoría si existe, o vacío si no
     */
    @Override
    public Optional<TaskRequestCategory> findById(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    /**
     * Busca todas las categorías.
     *
     * @return Lista de categorías
     */
    @Override
    public List<TaskRequestCategory> findAll() {
        return mapper.toDomainList(jpaRepository.findAll());
    }

    /**
     * Busca la categoría por defecto.
     *
     * @return Un Optional que contiene la categoría por defecto si existe, o vacío si no
     */
    @Override
    public Optional<TaskRequestCategory> findDefault() {
        return jpaRepository.findByIsDefaultTrue()
                .map(mapper::toDomain);
    }

    /**
     * Busca categorías por nombre (coincidencia parcial).
     *
     * @param name Parte del nombre a buscar
     * @return Lista de categorías que coinciden con el nombre
     */
    @Override
    public List<TaskRequestCategory> findByNameContaining(String name) {
        return mapper.toDomainList(jpaRepository.findByNameContainingIgnoreCase(name));
    }

    /**
     * Elimina una categoría por su ID.
     *
     * @param id ID de la categoría a eliminar
     */
    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}
