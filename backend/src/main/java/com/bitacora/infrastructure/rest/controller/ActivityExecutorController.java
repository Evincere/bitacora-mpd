package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.activity.ActivityService;
import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityStatus;
import com.bitacora.infrastructure.rest.dto.ActivityDto;
import com.bitacora.infrastructure.security.CurrentUser;
import com.bitacora.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controlador para gestionar las actividades del ejecutor.
 */
@RestController
@RequestMapping({ "/api/activities", "/activities" })
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Actividades del Ejecutor", description = "Operaciones relacionadas con las actividades del ejecutor")
public class ActivityExecutorController {

    private final ActivityService activityService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Endpoint para insertar una actividad de prueba.
     *
     * @return Resultado de la operación
     */
    @GetMapping("/debug/insert-test-activity")
    @Operation(summary = "Insertar actividad de prueba", description = "Inserta una actividad de prueba asignada al ejecutor con ID 20")
    public ResponseEntity<Map<String, Object>> insertTestActivity() {
        log.info("Insertando actividad de prueba para el ejecutor con ID 20");

        try {
            // Ejecutar el script SQL para insertar la actividad de prueba
            jdbcTemplate.execute("INSERT INTO activities (" +
                    "date, " +
                    "type, " +
                    "description, " +
                    "status, " +
                    "user_id, " +
                    "executor_id, " +
                    "created_at, " +
                    "updated_at, " +
                    "last_status_change_date" +
                    ") VALUES (" +
                    "NOW(), " +
                    "'REUNION', " +
                    "'Actividad de prueba asignada a Matías Silva', " +
                    "'ASSIGNED', " +
                    "1, " +
                    "20, " +
                    "NOW(), " +
                    "NOW(), " +
                    "NOW()" +
                    ")");

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Actividad de prueba insertada correctamente");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error al insertar actividad de prueba", e);

            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "Error al insertar actividad de prueba: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    /**
     * Endpoint de diagnóstico para verificar si hay actividades asignadas al
     * ejecutor.
     *
     * @param userPrincipal El usuario autenticado
     * @return Información de diagnóstico
     */
    @GetMapping("/debug/assigned-check")
    @Operation(summary = "Verificar actividades asignadas", description = "Endpoint de diagnóstico para verificar si hay actividades asignadas al ejecutor")
    public ResponseEntity<Map<String, Object>> checkAssignedActivities(
            @Parameter(hidden = true) @CurrentUser UserPrincipal userPrincipal) {

        log.info("Verificando actividades asignadas para el ejecutor con ID: {}", userPrincipal.getId());

        // Consulta directa a la base de datos para verificar si hay actividades
        // asignadas
        Map<String, Object> result = new HashMap<>();
        result.put("executorId", userPrincipal.getId());
        result.put("authorities", userPrincipal.getAuthorities().toString());

        // Crear mapa de filtros
        Map<String, Object> filters = new HashMap<>();
        filters.put("executorId", userPrincipal.getId());

        // Obtener actividades con los filtros (sin filtro de estado)
        List<Activity> allActivities = activityService.findActivitiesWithFilters(filters, 0, 100);
        result.put("totalActivitiesForExecutor", allActivities.size());

        // Ahora con filtro de estado ASSIGNED
        filters.put("status", "ASSIGNED");
        List<Activity> assignedActivities = activityService.findActivitiesWithFilters(filters, 0, 100);
        result.put("assignedActivitiesForExecutor", assignedActivities.size());

        if (!allActivities.isEmpty()) {
            result.put("sampleActivity", allActivities.get(0).toString());
        }

        return ResponseEntity.ok(result);
    }

    /**
     * Obtiene las actividades asignadas al ejecutor actual.
     *
     * @param userPrincipal El usuario autenticado
     * @return Lista de actividades asignadas
     */
    @GetMapping("/assigned")
    @Operation(summary = "Obtener actividades asignadas", description = "Obtiene las actividades asignadas al ejecutor actual")
    @PreAuthorize("hasAuthority('READ_ACTIVITIES')")
    public ResponseEntity<List<ActivityDto>> getAssignedActivities(
            @Parameter(hidden = true) @CurrentUser UserPrincipal userPrincipal) {

        log.info("Obteniendo actividades asignadas para el ejecutor con ID: {}", userPrincipal.getId());
        log.info("Permisos del usuario: {}", userPrincipal.getAuthorities());

        // Crear mapa de filtros
        Map<String, Object> filters = new HashMap<>();
        filters.put("executorId", userPrincipal.getId());
        filters.put("status", ActivityStatus.ASSIGNED.name());

        log.info("Filtros aplicados: {}", filters);

        // Obtener actividades con los filtros
        List<Activity> activities = activityService.findActivitiesWithFilters(filters, 0, 100);

        log.info("Actividades encontradas: {}", activities.size());
        if (!activities.isEmpty()) {
            log.info("Primera actividad: {}", activities.get(0));
        }

        // Convertir a DTOs
        List<ActivityDto> activityDtos = activities.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(activityDtos);
    }

    /**
     * Obtiene las actividades en progreso del ejecutor actual.
     *
     * @param userPrincipal El usuario autenticado
     * @return Lista de actividades en progreso
     */
    @GetMapping("/in-progress")
    @Operation(summary = "Obtener actividades en progreso", description = "Obtiene las actividades en progreso del ejecutor actual")
    @PreAuthorize("hasAuthority('READ_ACTIVITIES')")
    public ResponseEntity<List<ActivityDto>> getInProgressActivities(
            @Parameter(hidden = true) @CurrentUser UserPrincipal userPrincipal) {

        log.debug("Obteniendo actividades en progreso para el ejecutor con ID: {}", userPrincipal.getId());

        // Crear mapa de filtros
        Map<String, Object> filters = new HashMap<>();
        filters.put("executorId", userPrincipal.getId());
        filters.put("status", ActivityStatus.IN_PROGRESS.name());

        // Obtener actividades con los filtros
        List<Activity> activities = activityService.findActivitiesWithFilters(filters, 0, 100);

        // Convertir a DTOs
        List<ActivityDto> activityDtos = activities.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(activityDtos);
    }

    /**
     * Obtiene las actividades completadas del ejecutor actual.
     *
     * @param userPrincipal El usuario autenticado
     * @return Lista de actividades completadas
     */
    @GetMapping("/completed")
    @Operation(summary = "Obtener actividades completadas", description = "Obtiene las actividades completadas por el ejecutor actual")
    @PreAuthorize("hasAuthority('READ_ACTIVITIES')")
    public ResponseEntity<List<ActivityDto>> getCompletedActivities(
            @Parameter(hidden = true) @CurrentUser UserPrincipal userPrincipal) {

        log.debug("Obteniendo actividades completadas para el ejecutor con ID: {}", userPrincipal.getId());

        // Crear mapa de filtros
        Map<String, Object> filters = new HashMap<>();
        filters.put("executorId", userPrincipal.getId());
        filters.put("status", ActivityStatus.COMPLETED.name());

        // Obtener actividades con los filtros
        List<Activity> activities = activityService.findActivitiesWithFilters(filters, 0, 100);

        // Convertir a DTOs
        List<ActivityDto> activityDtos = activities.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(activityDtos);
    }

    /**
     * Convierte una actividad a DTO.
     *
     * @param activity La actividad a convertir
     * @return El DTO de la actividad
     */
    private ActivityDto mapToDto(Activity activity) {
        ActivityDto.ActivityDtoBuilder builder = ActivityDto.builder()
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
                .userId(activity.getUserId());

        // Si la actividad es una instancia de ActivityExtended, añadir campos
        // adicionales
        if (activity instanceof ActivityExtended) {
            ActivityExtended extendedActivity = (ActivityExtended) activity;
            builder.requesterId(extendedActivity.getRequesterId());

            // Estos campos no están en ActivityDto, así que los omitimos
            // .requesterName(...)
            // .assignerName(...)
            // .executorName(...)
            // .progress(...)

            // Añadir otros campos si están disponibles en ActivityDto
        }

        return builder.build();
    }
}
