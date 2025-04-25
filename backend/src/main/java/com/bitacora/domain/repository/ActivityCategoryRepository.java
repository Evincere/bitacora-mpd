package com.bitacora.domain.repository;

import com.bitacora.domain.model.activity.ActivityCategory;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para gestionar las operaciones de persistencia de las categorías de actividades.
 */
public interface ActivityCategoryRepository {
    
    /**
     * Guarda una categoría de actividad.
     *
     * @param category La categoría a guardar
     * @return La categoría guardada con su ID asignado
     */
    ActivityCategory save(ActivityCategory category);
    
    /**
     * Guarda una lista de categorías de actividad.
     *
     * @param categories Lista de categorías a guardar
     * @return Lista de categorías guardadas
     */
    List<ActivityCategory> saveAll(List<ActivityCategory> categories);
    
    /**
     * Busca una categoría por su ID.
     *
     * @param id ID de la categoría
     * @return La categoría encontrada o vacío si no existe
     */
    Optional<ActivityCategory> findById(Long id);
    
    /**
     * Obtiene todas las categorías.
     *
     * @return Lista de todas las categorías
     */
    List<ActivityCategory> findAll();
    
    /**
     * Busca categorías que son predeterminadas.
     *
     * @return Lista de categorías predeterminadas
     */
    List<ActivityCategory> findByIsDefaultTrue();
    
    /**
     * Cuenta el número de categorías predeterminadas.
     *
     * @return Número de categorías predeterminadas
     */
    long countByIsDefaultTrue();
    
    /**
     * Busca categorías creadas por un usuario específico.
     *
     * @param creatorId ID del usuario creador
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de categorías del usuario
     */
    List<ActivityCategory> findByCreatorId(Long creatorId, int page, int size);
    
    /**
     * Busca categorías por nombre (búsqueda parcial, case-insensitive).
     *
     * @param name Nombre o parte del nombre a buscar
     * @return Lista de categorías que coinciden con el nombre
     */
    List<ActivityCategory> findByNameContainingIgnoreCase(String name);
    
    /**
     * Busca categorías por texto libre en nombre y descripción.
     *
     * @param query Texto a buscar
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de categorías que coinciden con la búsqueda
     */
    List<ActivityCategory> search(String query, int page, int size);
    
    /**
     * Elimina una categoría por su ID.
     *
     * @param id ID de la categoría a eliminar
     */
    void delete(Long id);
}
