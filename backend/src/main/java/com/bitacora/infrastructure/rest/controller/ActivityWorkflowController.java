package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.activity.ActivityCommentService;
import com.bitacora.application.activity.ActivityService;
import com.bitacora.application.activity.ActivityWorkflowService;
import com.bitacora.application.notification.CollaborationService;
import com.bitacora.domain.model.activity.ActivityExtended;
import com.bitacora.domain.model.activity.ActivityType;
import com.bitacora.infrastructure.rest.dto.ActivityDto;
import com.bitacora.infrastructure.rest.dto.workflow.*;
import com.bitacora.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para el flujo de trabajo de actividades.
 */
@RestController
@RequestMapping({ "/api/activities", "/activities" })
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Flujo de Trabajo de Actividades", description = "API para gestionar el flujo de trabajo de actividades")
public class ActivityWorkflowController {

        private final ActivityWorkflowService activityWorkflowService;
        private final ActivityCommentService activityCommentService;
        private final CollaborationService collaborationService;
        private final ActivityService activityService;

        /**
         * Solicita una nueva actividad.
         *
         * @param requestActivityDto Los datos de la solicitud
         * @param userPrincipal      El usuario autenticado
         * @return La actividad solicitada
         */
        @PostMapping("/request")
        @Operation(summary = "Solicitar actividad", description = "Crea una nueva solicitud de actividad")
        @PreAuthorize("hasAuthority('REQUEST_ACTIVITIES')")
        public ResponseEntity<ActivityDto> requestActivity(
                        @Valid @RequestBody RequestActivityDto requestActivityDto,
                        @AuthenticationPrincipal UserPrincipal userPrincipal) {

                log.debug("Solicitud de actividad recibida: {}", requestActivityDto);

                // Crear la actividad a partir del DTO
                ActivityExtended activity = ActivityExtended.builder()
                                .date(requestActivityDto.getDate())
                                .type(ActivityType.fromString(requestActivityDto.getType()))
                                .description(requestActivityDto.getDescription())
                                .person(requestActivityDto.getPerson())
                                .role(requestActivityDto.getRole())
                                .dependency(requestActivityDto.getDependency())
                                .situation(requestActivityDto.getSituation())
                                .estimatedHours(requestActivityDto.getEstimatedHours())
                                .build();

                // Solicitar la actividad
                ActivityExtended requestedActivity = activityWorkflowService.requestActivity(
                                activity,
                                userPrincipal.getId(),
                                requestActivityDto.getNotes());

                // Convertir a DTO y devolver
                return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(requestedActivity));
        }

        /**
         * Asigna una actividad a un ejecutor.
         *
         * @param id                El ID de la actividad
         * @param assignActivityDto Los datos de la asignación
         * @param userPrincipal     El usuario autenticado
         * @return La actividad asignada
         */
        @PostMapping("/{id}/assign")
        @Operation(summary = "Asignar actividad", description = "Asigna una actividad a un ejecutor")
        @PreAuthorize("hasAuthority('ASSIGN_ACTIVITIES')")
        public ResponseEntity<ActivityDto> assignActivity(
                        @PathVariable Long id,
                        @Valid @RequestBody AssignActivityDto assignActivityDto,
                        @AuthenticationPrincipal UserPrincipal userPrincipal) {

                log.debug("Asignación de actividad recibida para ID: {}", id);

                // Asignar la actividad
                ActivityExtended assignedActivity = activityWorkflowService.assignActivity(
                                id,
                                userPrincipal.getId(),
                                assignActivityDto.getExecutorId(),
                                assignActivityDto.getNotes());

                // Convertir a DTO y devolver
                return ResponseEntity.ok(mapToDto(assignedActivity));
        }

        /**
         * Inicia una actividad.
         *
         * @param id               El ID de la actividad
         * @param startActivityDto Los datos de inicio
         * @return La actividad iniciada
         */
        @PostMapping("/{id}/start")
        @Operation(summary = "Iniciar actividad", description = "Inicia una actividad asignada")
        @PreAuthorize("hasAuthority('EXECUTE_ACTIVITIES')")
        public ResponseEntity<ActivityDto> startActivity(
                        @PathVariable Long id,
                        @Valid @RequestBody StartActivityDto startActivityDto) {

                log.debug("Inicio de actividad recibido para ID: {}", id);

                // Iniciar la actividad
                ActivityExtended startedActivity = activityWorkflowService.startActivity(
                                id,
                                startActivityDto.getNotes());

                // Convertir a DTO y devolver
                return ResponseEntity.ok(mapToDto(startedActivity));
        }

        /**
         * Completa una actividad.
         *
         * @param id                  El ID de la actividad
         * @param completeActivityDto Los datos de finalización
         * @return La actividad completada
         */
        @PostMapping("/{id}/complete")
        @Operation(summary = "Completar actividad", description = "Marca una actividad como completada")
        @PreAuthorize("hasAuthority('EXECUTE_ACTIVITIES')")
        public ResponseEntity<ActivityDto> completeActivity(
                        @PathVariable Long id,
                        @Valid @RequestBody CompleteActivityDto completeActivityDto) {

                log.debug("Finalización de actividad recibida para ID: {}", id);

                // Completar la actividad
                ActivityExtended completedActivity = activityWorkflowService.completeActivity(
                                id,
                                completeActivityDto.getNotes(),
                                completeActivityDto.getActualHours());

                // Convertir a DTO y devolver
                return ResponseEntity.ok(mapToDto(completedActivity));
        }

        /**
         * Aprueba una actividad completada.
         *
         * @param id                 El ID de la actividad
         * @param approveActivityDto Los datos de aprobación
         * @return La actividad aprobada
         */
        @PostMapping("/{id}/approve")
        @Operation(summary = "Aprobar actividad", description = "Aprueba una actividad completada")
        @PreAuthorize("hasAuthority('APPROVE_ACTIVITIES')")
        public ResponseEntity<ActivityDto> approveActivity(
                        @PathVariable Long id,
                        @Valid @RequestBody ApproveActivityDto approveActivityDto) {

                log.debug("Aprobación de actividad recibida para ID: {}", id);

                // Aprobar la actividad
                ActivityExtended approvedActivity = activityWorkflowService.approveActivity(
                                id,
                                approveActivityDto.getNotes());

                // Convertir a DTO y devolver
                return ResponseEntity.ok(mapToDto(approvedActivity));
        }

        /**
         * Rechaza una actividad completada.
         *
         * @param id                El ID de la actividad
         * @param rejectActivityDto Los datos de rechazo
         * @return La actividad rechazada
         */
        @PostMapping("/{id}/reject")
        @Operation(summary = "Rechazar actividad", description = "Rechaza una actividad completada")
        @PreAuthorize("hasAuthority('APPROVE_ACTIVITIES')")
        public ResponseEntity<ActivityDto> rejectActivity(
                        @PathVariable Long id,
                        @Valid @RequestBody RejectActivityDto rejectActivityDto) {

                log.debug("Rechazo de actividad recibido para ID: {}", id);

                // Rechazar la actividad
                ActivityExtended rejectedActivity = activityWorkflowService.rejectActivity(
                                id,
                                rejectActivityDto.getReason() + ": " + rejectActivityDto.getNotes());

                // Convertir a DTO y devolver
                return ResponseEntity.ok(mapToDto(rejectedActivity));
        }

        /**
         * Cancela una actividad.
         *
         * @param id                El ID de la actividad
         * @param rejectActivityDto Los datos de cancelación
         * @return La actividad cancelada
         */
        @PostMapping("/{id}/cancel")
        @Operation(summary = "Cancelar actividad", description = "Cancela una actividad en cualquier estado (excepto completada, aprobada, rechazada o cancelada)")
        @PreAuthorize("hasAnyAuthority('REQUEST_ACTIVITIES', 'ASSIGN_ACTIVITIES')")
        public ResponseEntity<ActivityDto> cancelActivity(
                        @PathVariable Long id,
                        @Valid @RequestBody RejectActivityDto rejectActivityDto) {

                log.debug("Cancelación de actividad recibida para ID: {}", id);

                // Cancelar la actividad
                ActivityExtended cancelledActivity = activityWorkflowService.cancelActivity(
                                id,
                                rejectActivityDto.getReason() + ": " + rejectActivityDto.getNotes());

                // Convertir a DTO y devolver
                return ResponseEntity.ok(mapToDto(cancelledActivity));
        }

        /**
         * Agrega un comentario a una actividad.
         *
         * @param id                 El ID de la actividad
         * @param commentActivityDto Los datos del comentario
         * @param userPrincipal      El usuario autenticado
         * @return La actividad con el comentario agregado
         */
        @PostMapping("/{id}/comment")
        @Operation(summary = "Comentar actividad", description = "Agrega un comentario a una actividad")
        @PreAuthorize("hasAnyAuthority('REQUEST_ACTIVITIES', 'ASSIGN_ACTIVITIES', 'EXECUTE_ACTIVITIES')")
        public ResponseEntity<ActivityDto> commentActivity(
                        @PathVariable Long id,
                        @Valid @RequestBody CommentActivityDto commentActivityDto,
                        @AuthenticationPrincipal UserPrincipal userPrincipal) {

                log.debug("Comentario recibido para actividad con ID: {}", id);

                // Obtener la actividad
                ActivityExtended activity = (ActivityExtended) activityService.getActivityById(id)
                                .orElse(null);
                if (activity == null) {
                        return ResponseEntity.notFound().build();
                }

                // Crear el comentario
                activityCommentService.createComment(
                                id,
                                userPrincipal.getId(),
                                userPrincipal.getUsername(),
                                commentActivityDto.getComment());

                // Notificar a otros usuarios sobre el comentario
                collaborationService.registerComment(id, userPrincipal.getId(), commentActivityDto.getComment());

                // Devolver la actividad actualizada
                return ResponseEntity.ok(mapToDto(activity));
        }

        /**
         * Convierte una actividad a DTO.
         *
         * @param activity La actividad
         * @return El DTO
         */
        private ActivityDto mapToDto(ActivityExtended activity) {
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
                                .build();
        }
}
