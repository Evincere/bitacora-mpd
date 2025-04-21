package com.bitacora.application.notification;

import com.bitacora.domain.model.notification.AnnouncementNotification;
import com.bitacora.domain.model.notification.AnnouncementNotification.AnnouncementType;
import com.bitacora.domain.model.user.User;
import com.bitacora.domain.port.notification.NotificationPort;
import com.bitacora.domain.port.UserRepository;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;

/**
 * Servicio para manejar anuncios y comunicados.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnnouncementService {

    private final NotificationPort notificationPort;
    private final UserRepository userRepository;

    /**
     * Envía un anuncio global a todos los usuarios.
     *
     * @param title   El título del anuncio
     * @param message El mensaje del anuncio
     * @param userId  El ID del usuario que envía el anuncio
     * @return true si el anuncio se envió correctamente, false en caso contrario
     */
    public boolean sendGlobalAnnouncement(String title, String message, Long userId) {
        log.debug("Enviando anuncio global: {}", title);

        // Obtener el usuario que envía el anuncio
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            log.warn("No se encontró el usuario con ID: {}", userId);
            return false;
        }

        User user = userOpt.get();

        // Crear notificación de anuncio
        AnnouncementNotification notification = AnnouncementNotification.builder()
                .announcementType(AnnouncementType.GLOBAL)
                .createdById(user.getId())
                .createdByName(user.getPersonName().getFullName())
                .title(title)
                .message(message)
                .build();

        // Enviar notificación
        notificationPort.broadcastAnnouncementNotification(notification, null);

        return true;
    }

    /**
     * Envía un anuncio a un departamento específico.
     *
     * @param title      El título del anuncio
     * @param message    El mensaje del anuncio
     * @param department El departamento destinatario
     * @param userId     El ID del usuario que envía el anuncio
     * @return true si el anuncio se envió correctamente, false en caso contrario
     */
    public boolean sendDepartmentAnnouncement(String title, String message, String department, Long userId) {
        log.debug("Enviando anuncio al departamento {}: {}", department, title);

        // Obtener el usuario que envía el anuncio
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            log.warn("No se encontró el usuario con ID: {}", userId);
            return false;
        }

        User user = userOpt.get();

        // Crear notificación de anuncio
        AnnouncementNotification notification = AnnouncementNotification.builder()
                .announcementType(AnnouncementType.DEPARTMENTAL)
                .department(department)
                .createdById(user.getId())
                .createdByName(user.getPersonName().getFullName())
                .title(title)
                .message(message)
                .build();

        // Enviar notificación
        notificationPort.broadcastAnnouncementNotification(notification, department);

        return true;
    }

    /**
     * Envía un anuncio de evento programado.
     *
     * @param title      El título del evento
     * @param message    La descripción del evento
     * @param eventDate  La fecha del evento en milisegundos desde la época Unix
     * @param location   La ubicación del evento
     * @param department El departamento destinatario (null para todos los usuarios)
     * @param userId     El ID del usuario que envía el anuncio
     * @return true si el anuncio se envió correctamente, false en caso contrario
     */
    public boolean sendEventAnnouncement(String title, String message, Long eventDate, String location,
            String department, Long userId) {
        log.debug("Enviando anuncio de evento: {}", title);

        // Obtener el usuario que envía el anuncio
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            log.warn("No se encontró el usuario con ID: {}", userId);
            return false;
        }

        User user = userOpt.get();

        // Crear notificación de anuncio
        AnnouncementNotification notification = AnnouncementNotification.builder()
                .announcementType(AnnouncementType.EVENT)
                .department(department)
                .eventDate(eventDate)
                .location(location)
                .createdById(user.getId())
                .createdByName(user.getPersonName().getFullName())
                .title(title)
                .message(message)
                .build();

        // Enviar notificación
        notificationPort.broadcastAnnouncementNotification(notification, department);

        return true;
    }
}
