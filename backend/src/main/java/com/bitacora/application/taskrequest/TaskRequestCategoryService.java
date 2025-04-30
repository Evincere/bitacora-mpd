package com.bitacora.application.taskrequest;

import com.bitacora.domain.model.taskrequest.TaskRequestCategory;
import com.bitacora.domain.port.repository.TaskRequestCategoryRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Servicio de aplicación para gestionar las categorías de solicitudes de tareas.
 */
@Service
public class TaskRequestCategoryService implements com.bitacora.domain.port.service.TaskRequestCategoryService {

    private static final Logger logger = LoggerFactory.getLogger(TaskRequestCategoryService.class);

    private final TaskRequestCategoryRepository categoryRepository;

    /**
     * Constructor.
     *
     * @param categoryRepository Repositorio de categorías de solicitudes
     */
    public TaskRequestCategoryService(final TaskRequestCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Crea una nueva categoría de solicitud.
     *
     * @param category La categoría a crear
     * @return La categoría creada con su ID asignado
     */
    @Override
    @Transactional
    public TaskRequestCategory create(final TaskRequestCategory category) {
        logger.info("Creando nueva categoría de solicitud: {}", category.getName());
        
        // Si la categoría es por defecto, desactivar la categoría por defecto actual
        if (category.isDefault()) {
            Optional<TaskRequestCategory> currentDefault = categoryRepository.findDefault();
            if (currentDefault.isPresent()) {
                TaskRequestCategory defaultCategory = currentDefault.get();
                TaskRequestCategory updatedCategory = TaskRequestCategory.builder()
                        .id(defaultCategory.getId())
                        .name(defaultCategory.getName())
                        .description(defaultCategory.getDescription())
                        .color(defaultCategory.getColor())
                        .isDefault(false)
                        .build();
                categoryRepository.save(updatedCategory);
                logger.info("Categoría por defecto anterior desactivada: {}", defaultCategory.getName());
            }
        }
        
        // Guardar la nueva categoría
        TaskRequestCategory savedCategory = categoryRepository.save(category);
        logger.info("Categoría de solicitud creada con ID: {}", savedCategory.getId());
        
        return savedCategory;
    }

    /**
     * Actualiza una categoría existente.
     *
     * @param id ID de la categoría a actualizar
     * @param category La categoría con los datos actualizados
     * @return La categoría actualizada
     * @throws IllegalArgumentException Si no existe una categoría con el ID especificado
     */
    @Override
    @Transactional
    public TaskRequestCategory update(final Long id, final TaskRequestCategory category) {
        logger.info("Actualizando categoría de solicitud con ID: {}", id);
        
        // Verificar que la categoría existe
        TaskRequestCategory existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));
        
        // Si la categoría actualizada es por defecto, desactivar la categoría por defecto actual
        if (category.isDefault() && !existingCategory.isDefault()) {
            Optional<TaskRequestCategory> currentDefault = categoryRepository.findDefault();
            if (currentDefault.isPresent() && !currentDefault.get().getId().equals(id)) {
                TaskRequestCategory defaultCategory = currentDefault.get();
                TaskRequestCategory updatedDefaultCategory = TaskRequestCategory.builder()
                        .id(defaultCategory.getId())
                        .name(defaultCategory.getName())
                        .description(defaultCategory.getDescription())
                        .color(defaultCategory.getColor())
                        .isDefault(false)
                        .build();
                categoryRepository.save(updatedDefaultCategory);
                logger.info("Categoría por defecto anterior desactivada: {}", defaultCategory.getName());
            }
        }
        
        // Crear la categoría actualizada
        TaskRequestCategory updatedCategory = TaskRequestCategory.builder()
                .id(id)
                .name(category.getName())
                .description(category.getDescription())
                .color(category.getColor())
                .isDefault(category.isDefault())
                .build();
        
        // Guardar la categoría actualizada
        TaskRequestCategory savedCategory = categoryRepository.save(updatedCategory);
        logger.info("Categoría de solicitud actualizada con ID: {}", savedCategory.getId());
        
        return savedCategory;
    }

    /**
     * Establece una categoría como la categoría por defecto.
     *
     * @param id ID de la categoría a establecer como por defecto
     * @return La categoría actualizada
     * @throws IllegalArgumentException Si no existe una categoría con el ID especificado
     */
    @Override
    @Transactional
    public TaskRequestCategory setAsDefault(final Long id) {
        logger.info("Estableciendo categoría de solicitud con ID: {} como por defecto", id);
        
        // Verificar que la categoría existe
        TaskRequestCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));
        
        // Si la categoría ya es por defecto, no hacer nada
        if (category.isDefault()) {
            logger.info("La categoría ya es por defecto: {}", category.getName());
            return category;
        }
        
        // Desactivar la categoría por defecto actual
        Optional<TaskRequestCategory> currentDefault = categoryRepository.findDefault();
        if (currentDefault.isPresent()) {
            TaskRequestCategory defaultCategory = currentDefault.get();
            TaskRequestCategory updatedDefaultCategory = TaskRequestCategory.builder()
                    .id(defaultCategory.getId())
                    .name(defaultCategory.getName())
                    .description(defaultCategory.getDescription())
                    .color(defaultCategory.getColor())
                    .isDefault(false)
                    .build();
            categoryRepository.save(updatedDefaultCategory);
            logger.info("Categoría por defecto anterior desactivada: {}", defaultCategory.getName());
        }
        
        // Establecer la nueva categoría por defecto
        TaskRequestCategory updatedCategory = TaskRequestCategory.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .color(category.getColor())
                .isDefault(true)
                .build();
        
        // Guardar la categoría actualizada
        TaskRequestCategory savedCategory = categoryRepository.save(updatedCategory);
        logger.info("Categoría de solicitud establecida como por defecto: {}", savedCategory.getName());
        
        return savedCategory;
    }

    /**
     * Busca una categoría por su ID.
     *
     * @param id El ID de la categoría
     * @return Un Optional que contiene la categoría si existe, o vacío si no
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<TaskRequestCategory> findById(final Long id) {
        return categoryRepository.findById(id);
    }

    /**
     * Busca todas las categorías.
     *
     * @return Lista de categorías
     */
    @Override
    @Transactional(readOnly = true)
    public List<TaskRequestCategory> findAll() {
        return categoryRepository.findAll();
    }

    /**
     * Busca la categoría por defecto.
     *
     * @return Un Optional que contiene la categoría por defecto si existe, o vacío si no
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<TaskRequestCategory> findDefault() {
        return categoryRepository.findDefault();
    }

    /**
     * Busca categorías por nombre (coincidencia parcial).
     *
     * @param name Parte del nombre a buscar
     * @return Lista de categorías que coinciden con el nombre
     */
    @Override
    @Transactional(readOnly = true)
    public List<TaskRequestCategory> findByNameContaining(final String name) {
        return categoryRepository.findByNameContaining(name);
    }

    /**
     * Elimina una categoría por su ID.
     *
     * @param id ID de la categoría a eliminar
     * @throws IllegalArgumentException Si no existe una categoría con el ID especificado
     * @throws IllegalStateException Si la categoría es la categoría por defecto
     */
    @Override
    @Transactional
    public void deleteById(final Long id) {
        logger.info("Eliminando categoría de solicitud con ID: {}", id);
        
        // Verificar que la categoría existe
        TaskRequestCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));
        
        // Verificar que la categoría no es la categoría por defecto
        if (category.isDefault()) {
            throw new IllegalStateException("No se puede eliminar la categoría por defecto");
        }
        
        // Eliminar la categoría
        categoryRepository.deleteById(id);
        logger.info("Categoría de solicitud eliminada con ID: {}", id);
    }
}
