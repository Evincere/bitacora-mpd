package com.bitacora.infrastructure.rest.controller;

import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.domain.model.activity.ActivityType;
import com.bitacora.application.activity.ActivityService;
import com.bitacora.infrastructure.rest.dto.ActivityCreateDto;
import com.bitacora.infrastructure.rest.dto.ActivityDto;
import com.bitacora.infrastructure.rest.dto.ActivityUpdateDto;
import com.bitacora.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.bitacora.infrastructure.persistence.projection.ActivityCount;
import com.bitacora.infrastructure.persistence.projection.ActivitySummary;
import com.bitacora.infrastructure.persistence.repository.ActivityJpaRepository;

/**
 * Controlador REST para la gestión de actividades.
 */
@RestController
@RequestMapping("/activities")
@RequiredArgsConstructor
@Tag(name = "Actividades", description = "API para la gestión de actividades")
@SecurityRequirement(name = "JWT")
public class ActivityController {

    private final ActivityService activityService;
    private final ActivityJpaRepository activityJpaRepository;

    /**
     * Obtiene todas las actividades con paginación.
     *
     * @param page      El número de página (comenzando desde 0)
     * @param size      El tamaño de la página
     * @param type      El tipo de actividad (opcional)
     * @param status    El estado de la actividad (opcional)
     * @param startDate La fecha de inicio (opcional)
     * @param endDate   La fecha de fin (opcional)
     * @param search    El texto a buscar (opcional)
     * @return Una respuesta con las actividades y el total
     */
    @GetMapping
    @Operation(summary = "Obtener actividades", description = "Obtiene actividades con paginación y filtros opcionales")
    @PreAuthorize("hasAuthority('READ_ACTIVITIES')")
    public ResponseEntity<Map<String, Object>> getAllActivities(
            @Parameter(description = "Número de página (comenzando desde 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de la página") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Tipo de actividad") @RequestParam(required = false) String type,
            @Parameter(description = "Estado de la actividad") @RequestParam(required = false) String status,
            @Parameter(description = "Fecha de inicio (formato: yyyy-MM-dd)") @RequestParam(required = false) String startDate,
            @Parameter(description = "Fecha de fin (formato: yyyy-MM-dd)") @RequestParam(required = false) String endDate,
            @Parameter(description = "Texto a buscar") @RequestParam(required = false) String search) {
        List<Activity> activities;
        long totalCount;

        // Crear mapa de filtros
        Map<String, Object> filters = new HashMap<>();

        if (type != null && !type.isEmpty()) {
            filters.put("type", ActivityType.fromString(type));
        }

        if (status != null && !status.isEmpty()) {
            filters.put("status", ActivityStatus.fromString(status));
        }

        if (startDate != null && !startDate.isEmpty() && endDate != null && !endDate.isEmpty()) {
            filters.put("startDate", LocalDateTime.parse(startDate + "T00:00:00"));
            filters.put("endDate", LocalDateTime.parse(endDate + "T23:59:59"));
        }

        if (search != null && !search.isEmpty()) {
            filters.put("search", search);
        }

        // Si hay filtros, usar findActivitiesWithFilters
        if (!filters.isEmpty()) {
            activities = activityService.findActivitiesWithFilters(filters, page, size);
            totalCount = activityService.countActivitiesWithFilters(filters);
        } else {
            activities = activityService.getAllActivities(page, size);
            totalCount = activityService.countActivities();
        }

        List<ActivityDto> activityDtos = activities.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("activities", activityDtos);
        response.put("totalCount", totalCount);

        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene una actividad por su ID.
     *
     * @param id El ID de la actividad
     * @return La actividad
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener una actividad por ID", description = "Obtiene una actividad por su ID")
    @PreAuthorize("hasAuthority('READ_ACTIVITIES')")
    public ResponseEntity<ActivityDto> getActivityById(@PathVariable Long id) {
        return activityService.getActivityById(id)
                .map(this::mapToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea una nueva actividad.
     *
     * @param activityCreateDto Los datos de la actividad a crear
     * @param userPrincipal     El usuario autenticado
     * @return La actividad creada
     */
    @PostMapping
    @Operation(summary = "Crear una actividad", description = "Crea una nueva actividad")
    @PreAuthorize("hasAuthority('WRITE_ACTIVITIES')")
    public ResponseEntity<ActivityDto> createActivity(
            @Valid @RequestBody ActivityCreateDto activityCreateDto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Activity activity = Activity.builder()
                .date(activityCreateDto.getDate())
                .type(ActivityType.fromString(activityCreateDto.getType()))
                .description(activityCreateDto.getDescription())
                .person(activityCreateDto.getPerson())
                .role(activityCreateDto.getRole())
                .dependency(activityCreateDto.getDependency())
                .situation(activityCreateDto.getSituation())
                .result(activityCreateDto.getResult())
                .status(ActivityStatus.fromString(activityCreateDto.getStatus()))
                .lastStatusChangeDate(LocalDateTime.now())
                .comments(activityCreateDto.getComments())
                .agent(activityCreateDto.getAgent())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .userId(userPrincipal.getId())
                .build();

        Activity savedActivity = activityService.createActivity(activity);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(savedActivity));
    }

    /**
     * Actualiza una actividad existente.
     *
     * @param id                El ID de la actividad a actualizar
     * @param activityUpdateDto Los datos de la actividad a actualizar
     * @return La actividad actualizada
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una actividad", description = "Actualiza una actividad existente")
    @PreAuthorize("hasAuthority('WRITE_ACTIVITIES')")
    public ResponseEntity<ActivityDto> updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody ActivityUpdateDto activityUpdateDto) {

        return activityService.getActivityById(id)
                .map(activity -> {
                    if (activityUpdateDto.getDate() != null) {
                        activity.setDate(activityUpdateDto.getDate());
                    }

                    if (activityUpdateDto.getType() != null) {
                        activity.setType(ActivityType.fromString(activityUpdateDto.getType()));
                    }

                    if (activityUpdateDto.getDescription() != null) {
                        activity.setDescription(activityUpdateDto.getDescription());
                    }

                    if (activityUpdateDto.getPerson() != null) {
                        activity.setPerson(activityUpdateDto.getPerson());
                    }

                    if (activityUpdateDto.getRole() != null) {
                        activity.setRole(activityUpdateDto.getRole());
                    }

                    if (activityUpdateDto.getDependency() != null) {
                        activity.setDependency(activityUpdateDto.getDependency());
                    }

                    if (activityUpdateDto.getSituation() != null) {
                        activity.setSituation(activityUpdateDto.getSituation());
                    }

                    if (activityUpdateDto.getResult() != null) {
                        activity.setResult(activityUpdateDto.getResult());
                    }

                    if (activityUpdateDto.getStatus() != null) {
                        ActivityStatus newStatus = ActivityStatus.fromString(activityUpdateDto.getStatus());
                        activity.setStatus(newStatus);
                    }

                    if (activityUpdateDto.getComments() != null) {
                        activity.setComments(activityUpdateDto.getComments());
                    }

                    if (activityUpdateDto.getAgent() != null) {
                        activity.setAgent(activityUpdateDto.getAgent());
                    }

                    return activityService.updateActivity(id, activity)
                            .map(this::mapToDto)
                            .map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Elimina una actividad.
     *
     * @param id El ID de la actividad a eliminar
     * @return Una respuesta vacía
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una actividad", description = "Elimina una actividad existente")
    @PreAuthorize("hasAuthority('DELETE_ACTIVITIES')")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        if (activityService.getActivityById(id).isPresent()) {
            activityService.deleteActivity(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtiene estadísticas de actividades por tipo.
     *
     * @return Una respuesta con las estadísticas
     */
    @GetMapping("/stats/by-type")
    @Operation(summary = "Obtener estadísticas por tipo", description = "Obtiene el conteo de actividades por tipo")
    @PreAuthorize("hasAuthority('READ_ACTIVITIES')")
    public ResponseEntity<List<Map<String, Object>>> getStatsByType() {
        List<ActivityCount> stats = activityJpaRepository.countByTypeGrouped();

        List<Map<String, Object>> result = stats.stream()
                .map(stat -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("type", stat.getCategory());
                    item.put("count", stat.getCount());
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /**
     * Obtiene estadísticas de actividades por estado.
     *
     * @return Una respuesta con las estadísticas
     */
    @GetMapping("/stats/by-status")
    @Operation(summary = "Obtener estadísticas por estado", description = "Obtiene el conteo de actividades por estado")
    @PreAuthorize("hasAuthority('READ_ACTIVITIES')")
    public ResponseEntity<List<Map<String, Object>>> getStatsByStatus() {
        List<ActivityCount> stats = activityJpaRepository.countByStatusGrouped();

        List<Map<String, Object>> result = stats.stream()
                .map(stat -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("status", stat.getCategory());
                    item.put("count", stat.getCount());
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /**
     * Obtiene un resumen de actividades con paginación.
     *
     * @param page El número de página (comenzando desde 0)
     * @param size El tamaño de la página
     * @return Una respuesta con los resúmenes de actividades
     */
    @GetMapping("/summaries")
    @Operation(summary = "Obtener resúmenes de actividades", description = "Obtiene resúmenes de actividades con paginación")
    @PreAuthorize("hasAuthority('READ_ACTIVITIES')")
    public ResponseEntity<Map<String, Object>> getActivitySummaries(
            @Parameter(description = "Número de página (comenzando desde 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de la página") @RequestParam(defaultValue = "10") int size) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<ActivitySummary> summaries = activityJpaRepository
                .findAllSummaries(pageable);

        List<Map<String, Object>> summaryList = summaries.getContent().stream()
                .map(summary -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", summary.getId());
                    item.put("date", summary.getDate());
                    item.put("type", summary.getType());
                    item.put("description", summary.getDescription());
                    item.put("status", summary.getStatus());
                    item.put("person", summary.getPerson());
                    item.put("createdAt", summary.getCreatedAt());
                    item.put("userId", summary.getUserId());
                    return item;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("summaries", summaryList);
        response.put("totalCount", summaries.getTotalElements());
        response.put("totalPages", summaries.getTotalPages());
        response.put("currentPage", summaries.getNumber());

        return ResponseEntity.ok(response);
    }

    /**
     * Mapea una actividad a un DTO.
     *
     * @param activity La actividad
     * @return El DTO
     */
    private ActivityDto mapToDto(Activity activity) {
        return ActivityDto.builder()
                .id(activity.getId())
                .date(activity.getDate())
                .type(activity.getType() != null ? activity.getType().name() : null)
                .description(activity.getDescription())
                .person(activity.getPerson())
                .role(activity.getRole())
                .dependency(activity.getDependency())
                .situation(activity.getSituation())
                .result(activity.getResult())
                .status(activity.getStatus() != null ? activity.getStatus().name() : null)
                .lastStatusChangeDate(activity.getLastStatusChangeDate())
                .comments(activity.getComments())
                .agent(activity.getAgent())
                .createdAt(activity.getCreatedAt())
                .updatedAt(activity.getUpdatedAt())
                .userId(activity.getUserId())
                .build();
    }
}
