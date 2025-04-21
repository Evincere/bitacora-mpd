package com.bitacora.domain.port;

import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.activity.ActivityType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Puerto (interfaz) para el repositorio de actividades.
 * Define las operaciones que debe proporcionar cualquier implementación de
 * repositorio de actividades.
 */
public interface ActivityRepository {

    /**
     * Guarda una actividad.
     *
     * @param activity La actividad a guardar
     * @return La actividad guardada con su ID asignado
     */
    Activity save(Activity activity);

    /**
     * Busca una actividad por su ID.
     *
     * @param id El ID de la actividad
     * @return Un Optional que contiene la actividad si se encuentra, o vacío si no
     */
    Optional<Activity> findById(Long id);

    /**
     * Busca todas las actividades con paginación.
     *
     * @param page El número de página (comenzando desde 0)
     * @param size El tamaño de la página
     * @return Una lista con las actividades de la página especificada
     */
    List<Activity> findAll(int page, int size);

    /**
     * Busca actividades por tipo con paginación.
     *
     * @param type El tipo de actividad
     * @param page El número de página (comenzando desde 0)
     * @param size El tamaño de la página
     * @return Una lista con las actividades del tipo especificado
     */
    List<Activity> findByType(ActivityType type, int page, int size);

    /**
     * Busca actividades por estado con paginación.
     *
     * @param status El estado de la actividad
     * @param page   El número de página (comenzando desde 0)
     * @param size   El tamaño de la página
     * @return Una lista con las actividades del estado especificado
     */
    List<Activity> findByStatus(ActivityStatus status, int page, int size);

    /**
     * Busca actividades por usuario con paginación.
     *
     * @param userId El ID del usuario
     * @param page   El número de página (comenzando desde 0)
     * @param size   El tamaño de la página
     * @return Una lista con las actividades del usuario especificado
     */
    List<Activity> findByUserId(Long userId, int page, int size);

    /**
     * Busca actividades por rango de fechas con paginación.
     *
     * @param startDate La fecha de inicio
     * @param endDate   La fecha de fin
     * @param page      El número de página (comenzando desde 0)
     * @param size      El tamaño de la página
     * @return Una lista con las actividades en el rango de fechas especificado
     */
    List<Activity> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate, int page, int size);

    /**
     * Busca actividades por persona con paginación.
     *
     * @param person El nombre de la persona
     * @param page   El número de página (comenzando desde 0)
     * @param size   El tamaño de la página
     * @return Una lista con las actividades de la persona especificada
     */
    List<Activity> findByPerson(String person, int page, int size);

    /**
     * Busca actividades por texto libre con paginación.
     *
     * @param query El texto a buscar
     * @param page  El número de página (comenzando desde 0)
     * @param size  El tamaño de la página
     * @return Una lista con las actividades que coinciden con la búsqueda
     */
    List<Activity> search(String query, int page, int size);

    /**
     * Busca actividades con filtros dinámicos y paginación.
     *
     * @param filters Un mapa con los filtros a aplicar (clave: nombre del filtro,
     *                valor: valor del filtro)
     * @param page    El número de página (comenzando desde 0)
     * @param size    El tamaño de la página
     * @return Una lista con las actividades que cumplen los filtros
     */
    List<Activity> findWithFilters(Map<String, Object> filters, int page, int size);

    /**
     * Cuenta el número de actividades que cumplen los filtros especificados.
     *
     * @param filters Un mapa con los filtros a aplicar (clave: nombre del filtro,
     *                valor: valor del filtro)
     * @return El número de actividades que cumplen los filtros
     */
    long countWithFilters(Map<String, Object> filters);

    /**
     * Cuenta el número total de actividades.
     *
     * @return El número total de actividades
     */
    long count();

    /**
     * Cuenta el número de actividades por usuario.
     *
     * @param userId El ID del usuario
     * @return El número de actividades del usuario especificado
     */
    long countByUserId(Long userId);

    /**
     * Cuenta el número de actividades por tipo.
     *
     * @param type El tipo de actividad
     * @return El número de actividades del tipo especificado
     */
    long countByType(ActivityType type);

    /**
     * Cuenta el número de actividades por estado.
     *
     * @param status El estado de la actividad
     * @return El número de actividades con el estado especificado
     */
    long countByStatus(ActivityStatus status);

    /**
     * Cuenta el número de actividades por rango de fechas.
     *
     * @param startDate La fecha de inicio
     * @param endDate   La fecha de fin
     * @return El número de actividades en el rango de fechas especificado
     */
    long countByDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Cuenta el número de actividades por persona.
     *
     * @param person El nombre de la persona
     * @return El número de actividades de la persona especificada
     */
    long countByPerson(String person);

    /**
     * Cuenta el número de actividades que coinciden con una búsqueda.
     *
     * @param query El texto a buscar
     * @return El número de actividades que coinciden con la búsqueda
     */
    long countSearch(String query);

    /**
     * Elimina una actividad.
     *
     * @param id El ID de la actividad a eliminar
     */
    void deleteById(Long id);
}
