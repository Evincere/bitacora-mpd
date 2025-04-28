package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.activity.ActivityCategoryService;
import com.bitacora.domain.model.activity.ActivityPriority;
import com.bitacora.infrastructure.rest.dto.ActivityCategoryDTO;
import com.bitacora.infrastructure.rest.dto.ActivityPriorityDTO;
import com.bitacora.infrastructure.rest.mapper.ActivityCategoryMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador REST para gestionar metadatos de actividades (categorías, prioridades, etc.).
 */
@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Metadatos de Actividades", description = "API para obtener metadatos de actividades")
public class ActivityMetadataController {
    
    private final ActivityCategoryService activityCategoryService;
    private final ActivityCategoryMapper activityCategoryMapper;
    
    /**
     * Obtiene todas las categorías de actividades.
     *
     * @return Lista de categorías de actividades
     */
    @GetMapping("/categories")
    @Operation(summary = "Obtener categorías", description = "Obtiene todas las categorías de actividades disponibles")
    public ResponseEntity<List<ActivityCategoryDTO>> getCategories() {
        log.debug("Obteniendo todas las categorías de actividades");
        var categories = activityCategoryService.getAllCategories();
        return ResponseEntity.ok(activityCategoryMapper.toDtoList(categories));
    }
    
    /**
     * Obtiene todas las prioridades de actividades.
     *
     * @return Lista de prioridades de actividades
     */
    @GetMapping("/priorities")
    @Operation(summary = "Obtener prioridades", description = "Obtiene todas las prioridades de actividades disponibles")
    public ResponseEntity<List<ActivityPriorityDTO>> getPriorities() {
        log.debug("Obteniendo todas las prioridades de actividades");
        
        List<ActivityPriorityDTO> priorities = Arrays.stream(ActivityPriority.values())
                .map(priority -> new ActivityPriorityDTO(
                        priority.name(),
                        priority.getDisplayName(),
                        getPriorityColor(priority)
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(priorities);
    }
    
    /**
     * Obtiene el color asociado a una prioridad.
     *
     * @param priority La prioridad
     * @return El color en formato hexadecimal
     */
    private String getPriorityColor(ActivityPriority priority) {
        return switch (priority) {
            case CRITICAL -> "#F44336"; // Rojo
            case HIGH -> "#FF9800";     // Naranja
            case MEDIUM -> "#2196F3";   // Azul
            case LOW -> "#4CAF50";      // Verde
            case TRIVIAL -> "#9E9E9E";  // Gris
        };
    }
}
