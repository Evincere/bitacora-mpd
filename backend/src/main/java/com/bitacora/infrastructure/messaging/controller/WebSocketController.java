package com.bitacora.infrastructure.messaging.controller;

import com.bitacora.domain.model.notification.RealTimeNotification;
import com.bitacora.domain.model.notification.SessionActivityEvent;
import com.bitacora.domain.model.notification.SystemAlertEvent;
import com.bitacora.domain.model.notification.UserStatusEvent;
import com.bitacora.domain.port.notification.NotificationPort;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controlador para manejar mensajes WebSocket.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final NotificationPort notificationPort;

    /**
     * Maneja las notificaciones enviadas por los clientes.
     *
     * @param notification   La notificación enviada por el cliente
     * @param headerAccessor Acceso a los headers del mensaje
     * @param authentication La autenticación del usuario
     */
    @MessageMapping("/notification")
    public void handleNotification(
            @Payload final RealTimeNotification notification,
            final SimpMessageHeaderAccessor headerAccessor,
            final Authentication authentication) {

        String username = authentication.getName();
        log.debug("Recibida notificación de {}: {}", username, notification);

        // Aquí podrías implementar lógica para validar y procesar la notificación
        // antes de reenviarla a otros usuarios

        // Por ejemplo, solo permitir que administradores envíen notificaciones globales
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            notificationPort.sendGlobalNotification(notification);
        } else {
            log.warn("Usuario no autorizado {} intentó enviar una notificación global", username);
        }
    }

    /**
     * Maneja los eventos de estado de usuario enviados por los clientes.
     *
     * @param statusEvent    El evento de estado de usuario
     * @param headerAccessor Acceso a los headers del mensaje
     * @param authentication La autenticación del usuario
     */
    @MessageMapping("/user-status")
    public void handleUserStatus(
            @Payload final UserStatusEvent statusEvent,
            final SimpMessageHeaderAccessor headerAccessor,
            final Authentication authentication) {

        String username = authentication.getName();
        log.debug("Recibido evento de estado de usuario de {}: {}", username, statusEvent);

        // Verificar que el usuario solo pueda actualizar su propio estado
        if (statusEvent.getUserId() != null) {
            // Aquí deberías verificar que el ID del usuario coincida con el usuario
            // autenticado
            // Esta es una implementación simplificada
            notificationPort.broadcastUserStatus(statusEvent);
        } else {
            log.warn("Evento de estado de usuario inválido recibido de {}", username);
        }
    }

    /**
     * Maneja los eventos de actividad de sesión enviados por los clientes.
     *
     * @param activityEvent  El evento de actividad de sesión
     * @param headerAccessor Acceso a los headers del mensaje
     * @param authentication La autenticación del usuario
     */
    @MessageMapping("/session-activity")
    public void handleSessionActivity(
            @Payload final SessionActivityEvent activityEvent,
            final SimpMessageHeaderAccessor headerAccessor,
            final Authentication authentication) {

        String username = authentication.getName();
        log.debug("Recibido evento de actividad de sesión de {}: {}", username, activityEvent);

        // Solo los administradores pueden ver todas las actividades de sesión
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            notificationPort.broadcastSessionActivity(activityEvent);
        } else {
            log.warn("Usuario no autorizado {} intentó enviar un evento de actividad de sesión", username);
        }
    }

    /**
     * Maneja las alertas del sistema enviadas por los clientes.
     *
     * @param alertEvent     La alerta del sistema
     * @param headerAccessor Acceso a los headers del mensaje
     * @param authentication La autenticación del usuario
     */
    @MessageMapping("/system-alert")
    public void handleSystemAlert(
            @Payload final SystemAlertEvent alertEvent,
            final SimpMessageHeaderAccessor headerAccessor,
            final Authentication authentication) {

        String username = authentication.getName();
        log.debug("Recibida alerta del sistema de {}: {}", username, alertEvent);

        // Solo los administradores pueden enviar alertas del sistema
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            notificationPort.broadcastSystemAlert(alertEvent);
        } else {
            log.warn("Usuario no autorizado {} intentó enviar una alerta del sistema", username);
        }
    }
}
