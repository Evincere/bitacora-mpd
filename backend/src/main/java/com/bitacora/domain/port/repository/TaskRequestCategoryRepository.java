package com.bitacora.domain.port.repository;

import com.bitacora.domain.model.taskrequest.TaskRequestCategory;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz que define las operaciones de repositorio para la entidad TaskRequestCategory.
 */
public interface TaskRequestCategoryRepository {

    /**
     * Guarda una categoría de solicitud.
     *
     * @param category La categoría a guardar
     * @return La categoría guardada con su ID asignado
     */
    TaskRequestCategory save(TaskRequestCategory category);

    /**
     * Busca una categoría por su ID.
     *
     * @param id El ID de la categoría
     * @return Un Optional que contiene la categoría si existe, o vacío si no
     */
    Optional<TaskRequestCategory> findById(Long id);

    /**
     * Busca todas las categorías.
     *
     * @return Lista de categorías
     */
    List<TaskRequestCategory> findAll();

    /**
     * Busca la categoría por defecto.
     *
     * @return Un Optional que contiene la categoría por defecto si existe, o vacío si no
     */
    Optional<TaskRequestCategory> findDefault();

    /**
     * Busca categorías por nombre (coincidencia parcial).
     *
     * @param name Parte del nombre a buscar
     * @return Lista de categorías que coinciden con el nombre
     */
    List<TaskRequestCategory> findByNameContaining(String name);

    /**
     * Elimina una categoría por su ID.
     *
     * @param id ID de la categoría a eliminar
     */
    void deleteById(Long id);
}
