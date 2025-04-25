package com.bitacora.application.activity;

import com.bitacora.domain.model.activity.ActivityCategory;
import com.bitacora.domain.port.repository.ActivityCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Servicio para gestionar las categorías de actividades.
 * Implementa la lógica de negocio relacionada con las categorías.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityCategoryService {

    private final ActivityCategoryRepository activityCategoryRepository;

    /**
     * Crea una nueva categoría de actividad.
     *
     * @param name        Nombre de la categoría
     * @param description Descripción de la categoría
     * @param color       Color de la categoría en formato hexadecimal
     * @param creatorId   ID del usuario creador
     * @return La categoría creada
     */
    @Transactional
    public ActivityCategory createCategory(String name, String description, String color, Long creatorId) {
        log.info("Creando nueva categoría: {}", name);
        ActivityCategory category = ActivityCategory.createCustom(name, description, color, creatorId);
        return activityCategoryRepository.save(category);
    }

    /**
     * Actualiza una categoría existente.
     *
     * @param id          ID de la categoría a actualizar
     * @param name        Nuevo nombre
     * @param description Nueva descripción
     * @param color       Nuevo color
     * @return La categoría actualizada
     */
    @Transactional
    public ActivityCategory updateCategory(Long id, String name, String description, String color) {
        log.info("Actualizando categoría con ID: {}", id);
        ActivityCategory category = getCategoryById(id);

        category.setName(name);
        category.setDescription(description);
        category.setColor(color);
        category.setUpdatedAt(LocalDateTime.now());

        return activityCategoryRepository.save(category);
    }

    /**
     * Obtiene una categoría por su ID.
     *
     * @param id ID de la categoría
     * @return La categoría encontrada
     * @throws IllegalArgumentException si no se encuentra la categoría
     */
    @Transactional(readOnly = true)
    public ActivityCategory getCategoryById(Long id) {
        log.info("Buscando categoría con ID: {}", id);
        return activityCategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));
    }

    /**
     * Obtiene todas las categorías.
     *
     * @return Lista de todas las categorías
     */
    @Transactional(readOnly = true)
    public List<ActivityCategory> getAllCategories() {
        log.info("Obteniendo todas las categorías");
        return activityCategoryRepository.findAll();
    }

    /**
     * Obtiene las categorías predeterminadas del sistema.
     *
     * @return Lista de categorías predeterminadas
     */
    @Transactional(readOnly = true)
    public List<ActivityCategory> getDefaultCategories() {
        log.info("Obteniendo categorías predeterminadas");
        return activityCategoryRepository.findDefaultCategories();
    }

    /**
     * Obtiene las categorías creadas por un usuario específico.
     *
     * @param creatorId ID del usuario creador
     * @param page      Número de página
     * @param size      Tamaño de página
     * @return Lista de categorías del usuario
     */
    @Transactional(readOnly = true)
    public List<ActivityCategory> getCategoriesByCreator(Long creatorId, int page, int size) {
        log.info("Obteniendo categorías creadas por el usuario con ID: {}", creatorId);
        return activityCategoryRepository.findByCreatorId(creatorId, page, size);
    }

    /**
     * Busca categorías por nombre.
     *
     * @param name Nombre o parte del nombre a buscar
     * @return Lista de categorías que coinciden con el nombre
     */
    @Transactional(readOnly = true)
    public List<ActivityCategory> searchCategoriesByName(String name) {
        log.info("Buscando categorías por nombre: {}", name);
        return activityCategoryRepository.findByNameContaining(name);
    }

    /**
     * Busca categorías por texto libre en nombre y descripción.
     *
     * @param query Texto a buscar
     * @param page  Número de página
     * @param size  Tamaño de página
     * @return Lista de categorías que coinciden con la búsqueda
     */
    @Transactional(readOnly = true)
    public List<ActivityCategory> searchCategories(String query, int page, int size) {
        log.info("Buscando categorías con texto: {}", query);
        return activityCategoryRepository.search(query, page, size);
    }

    /**
     * Elimina una categoría por su ID.
     *
     * @param id ID de la categoría a eliminar
     */
    @Transactional
    public void deleteCategory(Long id) {
        log.info("Eliminando categoría con ID: {}", id);
        ActivityCategory category = getCategoryById(id);

        if (category.isDefault()) {
            throw new IllegalArgumentException("No se pueden eliminar categorías predeterminadas");
        }

        activityCategoryRepository.deleteById(id);
    }

    /**
     * Inicializa las categorías predeterminadas del sistema si no existen.
     */
    @Transactional
    public void initializeDefaultCategories() {
        log.info("Inicializando categorías predeterminadas");

        if (activityCategoryRepository.countByIsDefaultTrue() == 0) {
            List<ActivityCategory> defaultCategories = new ArrayList<>();

            defaultCategories.add(ActivityCategory.createDefault(
                    "Reunión",
                    "Actividades relacionadas con reuniones y encuentros",
                    "#4285F4"));

            defaultCategories.add(ActivityCategory.createDefault(
                    "Tarea",
                    "Tareas y actividades pendientes",
                    "#EA4335"));

            defaultCategories.add(ActivityCategory.createDefault(
                    "Proyecto",
                    "Actividades relacionadas con proyectos",
                    "#FBBC05"));

            defaultCategories.add(ActivityCategory.createDefault(
                    "Evento",
                    "Eventos y celebraciones",
                    "#34A853"));

            defaultCategories.add(ActivityCategory.createDefault(
                    "Recordatorio",
                    "Recordatorios y notas importantes",
                    "#9C27B0"));

            activityCategoryRepository.saveAll(defaultCategories);
            log.info("Categorías predeterminadas creadas: {}", defaultCategories.size());
        } else {
            log.info("Las categorías predeterminadas ya existen");
        }
    }
}
