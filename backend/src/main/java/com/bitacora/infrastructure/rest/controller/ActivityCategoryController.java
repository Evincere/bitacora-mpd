package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.activity.ActivityCategoryService;
import com.bitacora.infrastructure.rest.dto.ActivityCategoryDTO;
import com.bitacora.infrastructure.rest.mapper.ActivityCategoryMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar categorías de actividades.
 */
@RestController
@RequestMapping("/api/activity-categories")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Categorías de Actividades", description = "API para gestionar categorías de actividades")
public class ActivityCategoryController {
    
    private final ActivityCategoryService activityCategoryService;
    private final ActivityCategoryMapper activityCategoryMapper;
    
    @Operation(summary = "Crear una nueva categoría")
    @PostMapping
    public ResponseEntity<ActivityCategoryDTO> createCategory(@RequestBody ActivityCategoryDTO categoryDTO) {
        var category = activityCategoryService.createCategory(
                categoryDTO.getName(),
                categoryDTO.getDescription(),
                categoryDTO.getColor(),
                categoryDTO.getCreatorId());
        
        return new ResponseEntity<>(activityCategoryMapper.toDto(category), HttpStatus.CREATED);
    }
    
    @Operation(summary = "Actualizar una categoría existente")
    @PutMapping("/{id}")
    public ResponseEntity<ActivityCategoryDTO> updateCategory(
            @PathVariable Long id,
            @RequestBody ActivityCategoryDTO categoryDTO) {
        
        var category = activityCategoryService.updateCategory(
                id,
                categoryDTO.getName(),
                categoryDTO.getDescription(),
                categoryDTO.getColor());
        
        return ResponseEntity.ok(activityCategoryMapper.toDto(category));
    }
    
    @Operation(summary = "Obtener una categoría por su ID")
    @GetMapping("/{id}")
    public ResponseEntity<ActivityCategoryDTO> getCategoryById(@PathVariable Long id) {
        var category = activityCategoryService.getCategoryById(id);
        return ResponseEntity.ok(activityCategoryMapper.toDto(category));
    }
    
    @Operation(summary = "Obtener todas las categorías")
    @GetMapping
    public ResponseEntity<List<ActivityCategoryDTO>> getAllCategories() {
        var categories = activityCategoryService.getAllCategories();
        return ResponseEntity.ok(activityCategoryMapper.toDtoList(categories));
    }
    
    @Operation(summary = "Obtener categorías predeterminadas")
    @GetMapping("/default")
    public ResponseEntity<List<ActivityCategoryDTO>> getDefaultCategories() {
        var categories = activityCategoryService.getDefaultCategories();
        return ResponseEntity.ok(activityCategoryMapper.toDtoList(categories));
    }
    
    @Operation(summary = "Obtener categorías creadas por un usuario")
    @GetMapping("/by-creator/{creatorId}")
    public ResponseEntity<List<ActivityCategoryDTO>> getCategoriesByCreator(
            @PathVariable Long creatorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        var categories = activityCategoryService.getCategoriesByCreator(creatorId, page, size);
        return ResponseEntity.ok(activityCategoryMapper.toDtoList(categories));
    }
    
    @Operation(summary = "Buscar categorías por nombre")
    @GetMapping("/search-by-name")
    public ResponseEntity<List<ActivityCategoryDTO>> searchCategoriesByName(@RequestParam String name) {
        var categories = activityCategoryService.searchCategoriesByName(name);
        return ResponseEntity.ok(activityCategoryMapper.toDtoList(categories));
    }
    
    @Operation(summary = "Buscar categorías por texto libre")
    @GetMapping("/search")
    public ResponseEntity<List<ActivityCategoryDTO>> searchCategories(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        var categories = activityCategoryService.searchCategories(query, page, size);
        return ResponseEntity.ok(activityCategoryMapper.toDtoList(categories));
    }
    
    @Operation(summary = "Eliminar una categoría")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        activityCategoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
