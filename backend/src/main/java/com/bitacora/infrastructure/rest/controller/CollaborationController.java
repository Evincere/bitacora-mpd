package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.notification.CollaborationService;
import com.bitacora.infrastructure.rest.dto.CommentRequestDTO;
import com.bitacora.infrastructure.security.CurrentUser;
import com.bitacora.infrastructure.security.UserPrincipal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import jakarta.validation.Valid;
import java.util.Set;

/**
 * Controlador REST para colaboración en tiempo real.
 */
@RestController
@RequestMapping("/api/collaboration")
@RequiredArgsConstructor
@Slf4j
public class CollaborationController {

    private final CollaborationService collaborationService;

    /**
     * Registra que un usuario está viendo una actividad.
     *
     * @param activityId  El ID de la actividad
     * @param currentUser El usuario actual
     * @return ResponseEntity con el resultado de la operación
     */
    @PostMapping("/view/{activityId}")
    public ResponseEntity<String> registerViewer(
            @PathVariable Long activityId,
            @CurrentUser UserPrincipal currentUser) {

        log.debug("Recibida solicitud para registrar usuario {} como visor de la actividad {}",
                currentUser.getId(), activityId);

        boolean success = collaborationService.registerViewer(activityId, currentUser.getId());

        if (success) {
            return ResponseEntity.ok("Usuario registrado como visor correctamente");
        } else {
            return ResponseEntity.badRequest().body("Error al registrar usuario como visor");
        }
    }

    /**
     * Registra que un usuario está editando una actividad.
     *
     * @param activityId  El ID de la actividad
     * @param currentUser El usuario actual
     * @return ResponseEntity con el resultado de la operación
     */
    @PostMapping("/edit/{activityId}")
    public ResponseEntity<String> registerEditor(
            @PathVariable Long activityId,
            @CurrentUser UserPrincipal currentUser) {

        log.debug("Recibida solicitud para registrar usuario {} como editor de la actividad {}",
                currentUser.getId(), activityId);

        boolean success = collaborationService.registerEditor(activityId, currentUser.getId());

        if (success) {
            return ResponseEntity.ok("Usuario registrado como editor correctamente");
        } else {
            return ResponseEntity.badRequest().body(
                    "Error al registrar usuario como editor. Es posible que otro usuario ya esté editando la actividad.");
        }
    }

    /**
     * Registra que un usuario ha comentado en una actividad.
     *
     * @param activityId  El ID de la actividad
     * @param requestDTO  El DTO con la información del comentario
     * @param currentUser El usuario actual
     * @return ResponseEntity con el resultado de la operación
     */
    @PostMapping("/comment/{activityId}")
    public ResponseEntity<String> registerComment(
            @PathVariable Long activityId,
            @Valid @RequestBody CommentRequestDTO requestDTO,
            @CurrentUser UserPrincipal currentUser) {

        log.debug("Recibida solicitud para registrar comentario del usuario {} en la actividad {}",
                currentUser.getId(), activityId);

        boolean success = collaborationService.registerComment(
                activityId, currentUser.getId(), requestDTO.getContent());

        if (success) {
            return ResponseEntity.ok("Comentario registrado correctamente");
        } else {
            return ResponseEntity.badRequest().body("Error al registrar comentario");
        }
    }

    /**
     * Registra que un usuario ha dejado de ver/editar una actividad.
     *
     * @param activityId  El ID de la actividad
     * @param currentUser El usuario actual
     * @return ResponseEntity con el resultado de la operación
     */
    @DeleteMapping("/{activityId}")
    public ResponseEntity<String> unregisterUser(
            @PathVariable Long activityId,
            @CurrentUser UserPrincipal currentUser) {

        log.debug("Recibida solicitud para eliminar usuario {} como visor/editor de la actividad {}",
                currentUser.getId(), activityId);

        boolean success = collaborationService.unregisterUser(activityId, currentUser.getId());

        if (success) {
            return ResponseEntity.ok("Usuario eliminado como visor/editor correctamente");
        } else {
            return ResponseEntity.badRequest().body("Error al eliminar usuario como visor/editor");
        }
    }

    /**
     * Obtiene los usuarios que están viendo una actividad.
     *
     * @param activityId El ID de la actividad
     * @return ResponseEntity con el conjunto de IDs de usuarios
     */
    @GetMapping("/viewers/{activityId}")
    public ResponseEntity<Set<Long>> getViewers(@PathVariable Long activityId) {
        log.debug("Recibida solicitud para obtener visores de la actividad {}", activityId);

        Set<Long> viewers = collaborationService.getViewers(activityId);

        return ResponseEntity.ok(viewers);
    }

    /**
     * Obtiene el usuario que está editando una actividad.
     *
     * @param activityId El ID de la actividad
     * @return ResponseEntity con el ID del usuario, o null si nadie está editando
     *         la actividad
     */
    @GetMapping("/editor/{activityId}")
    public ResponseEntity<Long> getEditor(@PathVariable Long activityId) {
        log.debug("Recibida solicitud para obtener editor de la actividad {}", activityId);

        Long editor = collaborationService.getEditor(activityId);

        return ResponseEntity.ok(editor);
    }
}
