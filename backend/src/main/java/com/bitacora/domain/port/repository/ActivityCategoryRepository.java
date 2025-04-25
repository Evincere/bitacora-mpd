package com.bitacora.domain.port.repository;

import com.bitacora.domain.model.activity.ActivityCategory;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz de repositorio para la entidad ActivityCategory.
 */
public interface ActivityCategoryRepository {

    /**
     * Guarda una categoría de actividad.
     *
     * @param category La categoría a guardar
     * @return La categoría guardada con ID asignado
     */
    ActivityCategory save(ActivityCategory category);

    /**
     * Busca una categoría por su ID.
     *
     * @param id El ID de la categoría
     * @return La categoría encontrada o vacío
     */
    Optional<ActivityCategory> findById(Long id);

    /**
     * Busca todas las categorías.
     *
     * @return Lista de todas las categorías
     */
    List<ActivityCategory> findAll();

    /**
     * Busca categorías por nombre.
     *
     * @param name El nombre a buscar
     * @return Lista de categorías que coinciden con el nombre
     */
    List<ActivityCategory> findByNameContaining(String name);

    /**
     * Busca categorías predeterminadas.
     *
     * @return Lista de categorías predeterminadas
     */
    List<ActivityCategory> findDefaultCategories();

    /**
     * Busca categorías creadas por un usuario específico.
     *
     * @param creatorId El ID del usuario creador
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de categorías
     */
    List<ActivityCategory> findByCreatorId(Long creatorId, int page, int size);

    /**
     * Busca una categoría por nombre exacto.
     *
     * @param name El nombre exacto
     * @return La categoría encontrada o vacío
     */
    Optional<ActivityCategory> findByName(String name);

    /**
     * Elimina una categoría por su ID.
     *
     * @param id El ID de la categoría
     */
    void deleteById(Long id);

    /**
     * Busca categorías por texto libre.
     *
     * @param query El texto a buscar
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de categorías
     */
    List<ActivityCategory> search(String query, int page, int size);

    /**
     * Cuenta el número de categorías predeterminadas.
     *
     * @return Número de categorías predeterminadas
     */
    long countByIsDefaultTrue();

    /**
     * Guarda una lista de categorías.
     *
     * @param categories Lista de categorías a guardar
     * @return Lista de categorías guardadas
     */
    List<ActivityCategory> saveAll(List<ActivityCategory> categories);
}
