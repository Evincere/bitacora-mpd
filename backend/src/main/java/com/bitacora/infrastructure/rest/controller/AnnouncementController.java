package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.notification.AnnouncementService;
import com.bitacora.infrastructure.rest.dto.AnnouncementRequestDTO;
import com.bitacora.infrastructure.rest.dto.EventAnnouncementRequestDTO;
import com.bitacora.infrastructure.security.CurrentUser;
import com.bitacora.infrastructure.security.UserPrincipal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import jakarta.validation.Valid;

/**
 * Controlador REST para anuncios y comunicados.
 */
@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
@Slf4j
public class AnnouncementController {

    private final AnnouncementService announcementService;

    /**
     * Envía un anuncio global a todos los usuarios.
     *
     * @param requestDTO  El DTO con la información del anuncio
     * @param currentUser El usuario actual
     * @return ResponseEntity con el resultado de la operación
     */
    @PostMapping("/global")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> sendGlobalAnnouncement(
            @Valid @RequestBody AnnouncementRequestDTO requestDTO,
            @CurrentUser UserPrincipal currentUser) {

        log.debug("Recibida solicitud para enviar anuncio global: {}", requestDTO);

        boolean success = announcementService.sendGlobalAnnouncement(
                requestDTO.getTitle(),
                requestDTO.getMessage(),
                currentUser.getId());

        if (success) {
            return ResponseEntity.ok("Anuncio enviado correctamente");
        } else {
            return ResponseEntity.badRequest().body("Error al enviar el anuncio");
        }
    }

    /**
     * Envía un anuncio a un departamento específico.
     *
     * @param requestDTO  El DTO con la información del anuncio
     * @param currentUser El usuario actual
     * @return ResponseEntity con el resultado de la operación
     */
    @PostMapping("/department")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> sendDepartmentAnnouncement(
            @Valid @RequestBody AnnouncementRequestDTO requestDTO,
            @CurrentUser UserPrincipal currentUser) {

        log.debug("Recibida solicitud para enviar anuncio a departamento: {}", requestDTO);

        if (requestDTO.getDepartment() == null || requestDTO.getDepartment().isEmpty()) {
            return ResponseEntity.badRequest().body("El departamento es obligatorio");
        }

        boolean success = announcementService.sendDepartmentAnnouncement(
                requestDTO.getTitle(),
                requestDTO.getMessage(),
                requestDTO.getDepartment(),
                currentUser.getId());

        if (success) {
            return ResponseEntity.ok("Anuncio enviado correctamente");
        } else {
            return ResponseEntity.badRequest().body("Error al enviar el anuncio");
        }
    }

    /**
     * Envía un anuncio de evento programado.
     *
     * @param requestDTO  El DTO con la información del evento
     * @param currentUser El usuario actual
     * @return ResponseEntity con el resultado de la operación
     */
    @PostMapping("/event")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> sendEventAnnouncement(
            @Valid @RequestBody EventAnnouncementRequestDTO requestDTO,
            @CurrentUser UserPrincipal currentUser) {

        log.debug("Recibida solicitud para enviar anuncio de evento: {}", requestDTO);

        boolean success = announcementService.sendEventAnnouncement(
                requestDTO.getTitle(),
                requestDTO.getMessage(),
                requestDTO.getEventDate(),
                requestDTO.getLocation(),
                requestDTO.getDepartment(),
                currentUser.getId());

        if (success) {
            return ResponseEntity.ok("Anuncio de evento enviado correctamente");
        } else {
            return ResponseEntity.badRequest().body("Error al enviar el anuncio de evento");
        }
    }
}
