package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.activity.ActivityCommentService;
import com.bitacora.domain.model.activity.ActivityComment;
import com.bitacora.infrastructure.rest.dto.ActivityCommentDTO;
import com.bitacora.infrastructure.rest.dto.CommentRequestDTO;
import com.bitacora.infrastructure.rest.mapper.ActivityCommentMapper;
import com.bitacora.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador REST para la gestión de comentarios en actividades.
 */
@RestController
@RequestMapping(path = { "/activities/{activityId}/comments", "/api/activities/{activityId}/comments" })
@RequiredArgsConstructor
@Tag(name = "Comentarios de Actividades", description = "API para la gestión de comentarios en actividades")
@SecurityRequirement(name = "JWT")
@Slf4j
public class ActivityCommentController {

        private final ActivityCommentService activityCommentService;
        private final ActivityCommentMapper activityCommentMapper;

        /**
         * Obtiene todos los comentarios de una actividad.
         *
         * @param activityId ID de la actividad
         * @return Lista de comentarios
         */
        @GetMapping
        @Operation(summary = "Obtener comentarios de una actividad", description = "Obtiene todos los comentarios de una actividad")
        @PreAuthorize("hasAnyAuthority('READ_ACTIVITIES', 'ROLE_ASIGNADOR')")
        public ResponseEntity<List<ActivityCommentDTO>> getCommentsByActivityId(
                        @PathVariable Long activityId,
                        @AuthenticationPrincipal UserPrincipal userPrincipal) {
                log.debug("REST request para obtener comentarios de la actividad con ID: {} por usuario: {}",
                                activityId, userPrincipal.getUsername());

                List<ActivityComment> comments = activityCommentService.getCommentsByActivityId(activityId);
                List<ActivityCommentDTO> commentDtos = comments.stream()
                                .map(comment -> {
                                        ActivityCommentDTO dto = activityCommentMapper.toDto(comment);
                                        // Marcar como leído por el usuario actual si es el autor
                                        dto.setReadByCurrentUser(comment.getUserId().equals(userPrincipal.getId()));
                                        return dto;
                                })
                                .collect(Collectors.toList());

                return ResponseEntity.ok(commentDtos);
        }

        /**
         * Crea un nuevo comentario en una actividad.
         *
         * @param activityId        ID de la actividad
         * @param commentRequestDTO Datos del comentario
         * @param userPrincipal     Usuario autenticado
         * @return El comentario creado
         */
        @PostMapping
        @Operation(summary = "Crear comentario", description = "Crea un nuevo comentario en una actividad")
        @PreAuthorize("hasAnyAuthority('WRITE_ACTIVITIES', 'ROLE_ASIGNADOR')")
        public ResponseEntity<ActivityCommentDTO> createComment(
                        @PathVariable Long activityId,
                        @Valid @RequestBody CommentRequestDTO commentRequestDTO,
                        @AuthenticationPrincipal UserPrincipal userPrincipal) {

                log.debug("REST request para crear un comentario en la actividad con ID: {} por usuario: {}",
                                activityId, userPrincipal.getUsername());

                ActivityComment comment = activityCommentService.createComment(
                                activityId,
                                userPrincipal.getId(),
                                userPrincipal.getUsername(),
                                commentRequestDTO.getContent());

                ActivityCommentDTO commentDto = activityCommentMapper.toDto(comment);
                commentDto.setReadByCurrentUser(true); // El autor siempre ha leído su propio comentario

                return ResponseEntity.status(HttpStatus.CREATED).body(commentDto);
        }

        /**
         * Actualiza un comentario existente.
         *
         * @param activityId        ID de la actividad
         * @param commentId         ID del comentario
         * @param commentRequestDTO Datos actualizados del comentario
         * @param userPrincipal     Usuario autenticado
         * @return El comentario actualizado
         */
        @PutMapping("/{commentId}")
        @Operation(summary = "Actualizar comentario", description = "Actualiza un comentario existente")
        @PreAuthorize("hasAnyAuthority('WRITE_ACTIVITIES', 'ROLE_ASIGNADOR')")
        public ResponseEntity<ActivityCommentDTO> updateComment(
                        @PathVariable Long activityId,
                        @PathVariable Long commentId,
                        @Valid @RequestBody CommentRequestDTO commentRequestDTO,
                        @AuthenticationPrincipal UserPrincipal userPrincipal) {

                log.debug("REST request para actualizar el comentario con ID: {} de la actividad con ID: {} por usuario: {}",
                                commentId, activityId, userPrincipal.getUsername());

                ActivityComment comment = activityCommentService.updateComment(
                                commentId,
                                commentRequestDTO.getContent(),
                                userPrincipal.getId());

                ActivityCommentDTO commentDto = activityCommentMapper.toDto(comment);
                commentDto.setReadByCurrentUser(true); // El autor siempre ha leído su propio comentario

                return ResponseEntity.ok(commentDto);
        }

        /**
         * Elimina un comentario.
         *
         * @param activityId    ID de la actividad
         * @param commentId     ID del comentario
         * @param userPrincipal Usuario autenticado
         * @return Respuesta sin contenido
         */
        @DeleteMapping("/{commentId}")
        @Operation(summary = "Eliminar comentario", description = "Elimina un comentario existente")
        @PreAuthorize("hasAnyAuthority('WRITE_ACTIVITIES', 'ROLE_ASIGNADOR')")
        public ResponseEntity<Void> deleteComment(
                        @PathVariable Long activityId,
                        @PathVariable Long commentId,
                        @AuthenticationPrincipal UserPrincipal userPrincipal) {

                log.debug("REST request para eliminar el comentario con ID: {} de la actividad con ID: {} por usuario: {}",
                                commentId, activityId, userPrincipal.getUsername());

                activityCommentService.deleteComment(commentId, userPrincipal.getId());

                return ResponseEntity.noContent().build();
        }
}
