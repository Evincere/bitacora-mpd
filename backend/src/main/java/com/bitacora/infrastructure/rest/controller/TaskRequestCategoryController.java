package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.taskrequest.TaskRequestCategoryService;
import com.bitacora.application.taskrequest.dto.TaskRequestCategoryDto;
import com.bitacora.application.taskrequest.mapper.TaskRequestCategoryMapper;
import com.bitacora.domain.model.taskrequest.TaskRequestCategory;
import com.bitacora.infrastructure.security.CurrentUser;
import com.bitacora.infrastructure.security.UserPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador REST para gestionar categorías de solicitudes de tareas.
 */
@RestController
@RequestMapping("/api/task-request-categories")
@Tag(name = "Task Request Categories", description = "API para gestionar categorías de solicitudes de tareas")
public class TaskRequestCategoryController {

    private static final Logger logger = LoggerFactory.getLogger(TaskRequestCategoryController.class);

    private final TaskRequestCategoryService categoryService;
    private final TaskRequestCategoryMapper categoryMapper;

    /**
     * Constructor.
     *
     * @param categoryService Servicio de categorías
     * @param categoryMapper Mapper para convertir entre entidades y DTOs
     */
    public TaskRequestCategoryController(TaskRequestCategoryService categoryService, TaskRequestCategoryMapper categoryMapper) {
        this.categoryService = categoryService;
        this.categoryMapper = categoryMapper;
    }

    /**
     * Crea una nueva categoría de solicitud.
     *
     * @param categoryDto DTO con los datos de la categoría
     * @param currentUser Usuario actual
     * @return La categoría creada
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crea una nueva categoría de solicitud", description = "Crea una nueva categoría de solicitud de tarea")
    public ResponseEntity<TaskRequestCategoryDto> createCategory(
            @Valid @RequestBody TaskRequestCategoryDto categoryDto,
            @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {
        
        logger.info("Creando categoría de solicitud: {} por el usuario: {}", categoryDto.getName(), currentUser.getId());
        
        TaskRequestCategory category = categoryMapper.toEntity(categoryDto);
        TaskRequestCategory createdCategory = categoryService.create(category);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryMapper.toDto(createdCategory));
    }

    /**
     * Actualiza una categoría de solicitud existente.
     *
     * @param id ID de la categoría a actualizar
     * @param categoryDto DTO con los datos actualizados
     * @param currentUser Usuario actual
     * @return La categoría actualizada
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualiza una categoría de solicitud", description = "Actualiza una categoría de solicitud de tarea existente")
    public ResponseEntity<TaskRequestCategoryDto> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestCategoryDto categoryDto,
            @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {
        
        logger.info("Actualizando categoría de solicitud con ID: {} por el usuario: {}", id, currentUser.getId());
        
        TaskRequestCategory category = categoryMapper.toEntity(categoryDto);
        TaskRequestCategory updatedCategory = categoryService.update(id, category);
        
        return ResponseEntity.ok(categoryMapper.toDto(updatedCategory));
    }

    /**
     * Obtiene una categoría de solicitud por su ID.
     *
     * @param id ID de la categoría
     * @return La categoría
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
    @Operation(summary = "Obtiene una categoría de solicitud", description = "Obtiene una categoría de solicitud de tarea por su ID")
    public ResponseEntity<TaskRequestCategoryDto> getCategory(@PathVariable Long id) {
        logger.info("Obteniendo categoría de solicitud con ID: {}", id);
        
        return categoryService.findById(id)
                .map(categoryMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtiene todas las categorías de solicitud.
     *
     * @return Lista de categorías
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
    @Operation(summary = "Obtiene todas las categorías de solicitud", description = "Obtiene todas las categorías de solicitud de tarea")
    public ResponseEntity<List<TaskRequestCategoryDto>> getAllCategories() {
        logger.info("Obteniendo todas las categorías de solicitud");
        
        List<TaskRequestCategory> categories = categoryService.findAll();
        
        return ResponseEntity.ok(categoryMapper.toDtoList(categories));
    }

    /**
     * Obtiene la categoría de solicitud por defecto.
     *
     * @return La categoría por defecto
     */
    @GetMapping("/default")
    @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
    @Operation(summary = "Obtiene la categoría de solicitud por defecto", description = "Obtiene la categoría de solicitud de tarea establecida como por defecto")
    public ResponseEntity<TaskRequestCategoryDto> getDefaultCategory() {
        logger.info("Obteniendo categoría de solicitud por defecto");
        
        return categoryService.findDefault()
                .map(categoryMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Busca categorías de solicitud por nombre.
     *
     * @param name Parte del nombre a buscar
     * @return Lista de categorías que coinciden con el nombre
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SOLICITANTE', 'ASIGNADOR', 'EJECUTOR', 'ADMIN')")
    @Operation(summary = "Busca categorías de solicitud por nombre", description = "Busca categorías de solicitud de tarea que contengan el nombre especificado")
    public ResponseEntity<List<TaskRequestCategoryDto>> searchCategories(@RequestParam String name) {
        logger.info("Buscando categorías de solicitud con nombre: {}", name);
        
        List<TaskRequestCategory> categories = categoryService.findByNameContaining(name);
        
        return ResponseEntity.ok(categoryMapper.toDtoList(categories));
    }

    /**
     * Establece una categoría de solicitud como la categoría por defecto.
     *
     * @param id ID de la categoría
     * @param currentUser Usuario actual
     * @return La categoría actualizada
     */
    @PostMapping("/{id}/set-default")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Establece una categoría de solicitud como la categoría por defecto", description = "Establece una categoría de solicitud de tarea como la categoría por defecto")
    public ResponseEntity<TaskRequestCategoryDto> setDefaultCategory(
            @PathVariable Long id,
            @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {
        
        logger.info("Estableciendo categoría de solicitud con ID: {} como por defecto por el usuario: {}", id, currentUser.getId());
        
        TaskRequestCategory category = categoryService.setAsDefault(id);
        
        return ResponseEntity.ok(categoryMapper.toDto(category));
    }

    /**
     * Elimina una categoría de solicitud.
     *
     * @param id ID de la categoría
     * @param currentUser Usuario actual
     * @return Respuesta vacía
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Elimina una categoría de solicitud", description = "Elimina una categoría de solicitud de tarea existente. No se puede eliminar la categoría por defecto.")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id,
            @Parameter(hidden = true) @CurrentUser UserPrincipal currentUser) {
        
        logger.info("Eliminando categoría de solicitud con ID: {} por el usuario: {}", id, currentUser.getId());
        
        categoryService.deleteById(id);
        
        return ResponseEntity.noContent().build();
    }
}
