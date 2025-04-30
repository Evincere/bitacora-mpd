package com.bitacora.infrastructure.rest.controller;

import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.port.repository.ActivityRepository;
import com.bitacora.infrastructure.persistence.mapper.ActivityExtendedMapper;
import com.bitacora.infrastructure.rest.dto.ActivityDto;
import com.bitacora.infrastructure.security.CurrentUser;
import com.bitacora.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controlador para gestionar las actividades del usuario actual.
 */
@RestController
@RequestMapping({ "/api/activities/user", "/activities/user" })
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Actividades de Usuario", description = "Operaciones relacionadas con las actividades del usuario actual")
public class ActivityUserController {

    private final ActivityRepository activityRepository;
    private final ActivityExtendedMapper activityExtendedMapper;

    /**
     * Obtiene las actividades del usuario actual con paginación.
     *
     * @param page          El número de página (comenzando desde 0)
     * @param size          El tamaño de la página
     * @param userPrincipal El usuario autenticado
     * @return Una respuesta con las actividades y el total
     */
    @GetMapping("/my-activities")
    @Operation(summary = "Obtener mis actividades", description = "Obtiene las actividades del usuario actual con paginación")
    public ResponseEntity<Map<String, Object>> getMyActivities(
            @Parameter(description = "Número de página (comenzando desde 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de la página") @RequestParam(defaultValue = "10") int size,
            @CurrentUser UserPrincipal userPrincipal) {

        // Verificar si el usuario está autenticado
        if (userPrincipal == null) {
            log.error("Error: UserPrincipal es nulo. El usuario no está autenticado correctamente.");
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Usuario no autenticado");
            errorResponse.put("message", "Debe iniciar sesión para acceder a esta funcionalidad");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        log.debug("Obteniendo actividades para el usuario con ID: {}", userPrincipal.getId());

        List<Activity> activities = activityRepository.findByUserId(userPrincipal.getId(), page, size);
        long total = activityRepository.countByUserId(userPrincipal.getId());

        List<ActivityDto> activityDtos = activities.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("activities", activityDtos);
        response.put("currentPage", page);
        response.put("totalItems", total);
        response.put("totalPages", Math.ceil((double) total / size));

        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene las actividades solicitadas por el usuario actual con paginación.
     *
     * @param page          El número de página (comenzando desde 0)
     * @param size          El tamaño de la página
     * @param userPrincipal El usuario autenticado
     * @return Una respuesta con las actividades y el total
     */
    @GetMapping("/my-requests")
    @Operation(summary = "Obtener mis solicitudes", description = "Obtiene las actividades solicitadas por el usuario actual con paginación")
    public ResponseEntity<Map<String, Object>> getMyRequests(
            @Parameter(description = "Número de página (comenzando desde 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de la página") @RequestParam(defaultValue = "10") int size,
            @CurrentUser UserPrincipal userPrincipal) {

        // Verificar si el usuario está autenticado
        if (userPrincipal == null) {
            log.error("Error: UserPrincipal es nulo. El usuario no está autenticado correctamente.");
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Usuario no autenticado");
            errorResponse.put("message", "Debe iniciar sesión para acceder a esta funcionalidad");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        log.debug("Obteniendo solicitudes para el usuario con ID: {}", userPrincipal.getId());

        List<Activity> activities = activityRepository.findByRequesterId(userPrincipal.getId(), page, size);
        long total = activityRepository.countByRequesterId(userPrincipal.getId());

        List<ActivityDto> activityDtos = activities.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("activities", activityDtos);
        response.put("currentPage", page);
        response.put("totalItems", total);
        response.put("totalPages", Math.ceil((double) total / size));

        return ResponseEntity.ok(response);
    }

    /**
     * Convierte una actividad a DTO.
     *
     * @param activity La actividad
     * @return El DTO
     */
    private ActivityDto mapToDto(Activity activity) {
        // Convertir a ActivityExtended si es posible
        ActivityExtended activityExtended = null;
        if (activity instanceof ActivityExtended) {
            activityExtended = (ActivityExtended) activity;
        } else {
            activityExtended = activityExtendedMapper.fromActivity(activity);
        }

        return ActivityDto.builder()
                .id(activity.getId())
                .date(activity.getDate())
                .type(activity.getType() != null ? activity.getType().name() : null)
                .description(activity.getDescription())
                .person(activity.getPerson())
                .role(activity.getRole())
                .dependency(activity.getDependency())
                .situation(activity.getSituation())
                .status(activity.getStatus() != null ? activity.getStatus().name() : null)
                .lastStatusChangeDate(activity.getLastStatusChangeDate())
                .createdAt(activity.getCreatedAt())
                .updatedAt(activity.getUpdatedAt())
                .userId(activity.getUserId())
                .requesterId(activityExtended.getRequesterId())
                .build();
    }
}
