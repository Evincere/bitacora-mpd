package com.bitacora.domain.port.service;

import com.bitacora.domain.model.taskrequest.TaskRequestCategory;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz que define las operaciones de servicio para la entidad TaskRequestCategory.
 */
public interface TaskRequestCategoryService {

    /**
     * Crea una nueva categoría de solicitud.
     *
     * @param category La categoría a crear
     * @return La categoría creada con su ID asignado
     */
    TaskRequestCategory create(TaskRequestCategory category);

    /**
     * Actualiza una categoría existente.
     *
     * @param id ID de la categoría a actualizar
     * @param category La categoría con los datos actualizados
     * @return La categoría actualizada
     * @throws IllegalArgumentException Si no existe una categoría con el ID especificado
     */
    TaskRequestCategory update(Long id, TaskRequestCategory category);

    /**
     * Establece una categoría como la categoría por defecto.
     *
     * @param id ID de la categoría a establecer como por defecto
     * @return La categoría actualizada
     * @throws IllegalArgumentException Si no existe una categoría con el ID especificado
     */
    TaskRequestCategory setAsDefault(Long id);

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
     * @throws IllegalArgumentException Si no existe una categoría con el ID especificado
     * @throws IllegalStateException Si la categoría es la categoría por defecto
     */
    void deleteById(Long id);
}
