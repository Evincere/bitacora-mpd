package com.bitacora.application.session;

import com.bitacora.domain.model.notification.SessionActivityEvent;
import com.bitacora.domain.model.notification.SessionActivityEvent.SessionAction;
import com.bitacora.domain.model.session.UserSession;
import com.bitacora.domain.model.session.UserSession.SessionStatus;
import com.bitacora.domain.port.notification.NotificationPort;
import com.bitacora.domain.port.session.UserSessionPort;
import com.bitacora.infrastructure.security.JwtTokenProvider;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestionar sesiones de usuario.
 * Implementa los casos de uso relacionados con sesiones.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserSessionService {

    private final UserSessionPort sessionPort;
    private final JwtTokenProvider jwtTokenProvider;
    private final NotificationPort notificationPort;

    /**
     * Crea una nueva sesión para un usuario.
     *
     * @param userId       El ID del usuario
     * @param token        El token JWT
     * @param refreshToken El token de refresco
     * @param request      La solicitud HTTP
     * @return La sesión creada
     */
    @Transactional
    public UserSession createSession(Long userId, String token, String refreshToken, HttpServletRequest request) {
        String ipAddress = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");

        // Extraer información del dispositivo del User-Agent
        String device = parseDevice(userAgent);

        // Obtener la ubicación a partir de la IP (simplificado)
        String location = "Desconocida"; // En una implementación real, usarías un servicio de geolocalización

        // Calcular la fecha de expiración a partir del token
        Date expiryTime = jwtTokenProvider.getExpirationDateFromToken(token);

        UserSession session = UserSession.builder()
                .userId(userId)
                .token(token)
                .refreshToken(refreshToken)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .device(device)
                .location(location)
                .loginTime(Date.from(Instant.now()))
                .lastActivityTime(Date.from(Instant.now()))
                .expiryTime(expiryTime)
                .status(SessionStatus.ACTIVE)
                .build();

        UserSession savedSession = sessionPort.saveSession(session);

        // Enviar evento de actividad de sesión
        notifySessionActivity(savedSession, SessionAction.LOGIN);

        return savedSession;
    }

    /**
     * Actualiza la hora de la última actividad de una sesión.
     *
     * @param token El token JWT
     * @return La sesión actualizada, o un Optional vacío si no existe
     */
    @Transactional
    public Optional<UserSession> updateLastActivity(String token) {
        return sessionPort.findByToken(token).map(session -> {
            session.updateLastActivity();
            return sessionPort.saveSession(session);
        });
    }

    /**
     * Cierra una sesión.
     *
     * @param token El token JWT
     * @return La sesión cerrada, o un Optional vacío si no existe
     */
    @Transactional
    public Optional<UserSession> closeSession(String token) {
        return sessionPort.findByToken(token).map(session -> {
            session.logout();
            UserSession savedSession = sessionPort.saveSession(session);

            // Enviar evento de actividad de sesión
            notifySessionActivity(savedSession, SessionAction.LOGOUT);

            return savedSession;
        });
    }

    /**
     * Cierra todas las sesiones de un usuario excepto la sesión actual.
     *
     * @param userId           El ID del usuario
     * @param currentSessionId El ID de la sesión actual
     * @return El número de sesiones cerradas
     */
    @Transactional
    public int closeOtherSessions(Long userId, Long currentSessionId) {
        int closedSessions = sessionPort.closeOtherSessions(userId, currentSessionId);

        log.debug("Cerradas {} sesiones para el usuario {}", closedSessions, userId);
        return closedSessions;
    }

    /**
     * Revoca una sesión.
     *
     * @param sessionId El ID de la sesión
     * @param reason    La razón de la revocación
     * @return La sesión revocada, o un Optional vacío si no existe
     */
    @Transactional
    public Optional<UserSession> revokeSession(Long sessionId, String reason) {
        return sessionPort.findById(sessionId).map(session -> {
            session.revoke(reason);
            UserSession savedSession = sessionPort.saveSession(session);

            // Enviar evento de actividad de sesión
            notifySessionActivity(savedSession, SessionAction.SUSPICIOUS_ACTIVITY);

            // Enviar notificación al usuario
            String username = jwtTokenProvider.getUsername(savedSession.getToken());
            notificationPort.sendWarningNotification(
                    username,
                    "Sesión revocada",
                    "Tu sesión ha sido revocada por el siguiente motivo: " + reason);

            return savedSession;
        });
    }

    /**
     * Obtiene todas las sesiones activas de un usuario.
     *
     * @param userId El ID del usuario
     * @return Lista de sesiones activas
     */
    public List<UserSession> getActiveSessions(Long userId) {
        return sessionPort.findActiveSessionsByUserId(userId);
    }

    /**
     * Obtiene todas las sesiones de un usuario.
     *
     * @param userId El ID del usuario
     * @return Lista de sesiones
     */
    public List<UserSession> getAllSessions(Long userId) {
        return sessionPort.findAllSessionsByUserId(userId);
    }

    /**
     * Obtiene todas las sesiones sospechosas.
     *
     * @return Lista de sesiones sospechosas
     */
    public List<UserSession> getSuspiciousSessions() {
        return sessionPort.findSuspiciousSessions();
    }

    /**
     * Marca una sesión como sospechosa.
     *
     * @param sessionId El ID de la sesión
     * @param reason    La razón por la que la sesión se considera sospechosa
     * @return La sesión marcada como sospechosa, o un Optional vacío si no existe
     */
    @Transactional
    public Optional<UserSession> markSessionAsSuspicious(Long sessionId, String reason) {
        return sessionPort.findById(sessionId).map(session -> {
            session.markAsSuspicious(reason);
            UserSession savedSession = sessionPort.saveSession(session);

            // Enviar evento de actividad de sesión
            notifySessionActivity(savedSession, SessionAction.SUSPICIOUS_ACTIVITY);

            // Enviar notificación al usuario
            String username = jwtTokenProvider.getUsername(savedSession.getToken());
            notificationPort.sendWarningNotification(
                    username,
                    "Actividad sospechosa detectada",
                    "Se ha detectado actividad sospechosa en tu sesión: " + reason);

            return savedSession;
        });
    }

    /**
     * Tarea programada para actualizar el estado de las sesiones expiradas.
     */
    @Scheduled(fixedRate = 300000) // Cada 5 minutos
    @Transactional
    public void updateExpiredSessions() {
        Date now = Date.from(Instant.now());
        int updatedSessions = sessionPort.updateExpiredSessions(now);

        if (updatedSessions > 0) {
            log.debug("Actualizadas {} sesiones expiradas", updatedSessions);
        }
    }

    /**
     * Tarea programada para detectar sesiones inactivas.
     */
    @Scheduled(fixedRate = 600000) // Cada 10 minutos
    @Transactional
    public void detectInactiveSessions() {
        // Considerar inactivas las sesiones sin actividad en los últimos 30 minutos
        Date threshold = Date.from(Instant.now().minusSeconds(1800));
        List<UserSession> inactiveSessions = sessionPort.findInactiveSessions(threshold);

        for (UserSession session : inactiveSessions) {
            // Enviar notificación al usuario
            String username = jwtTokenProvider.getUsername(session.getToken());
            notificationPort.sendInfoNotification(
                    username,
                    "Sesión inactiva",
                    "Tu sesión ha estado inactiva durante más de 30 minutos");
        }

        if (!inactiveSessions.isEmpty()) {
            log.debug("Detectadas {} sesiones inactivas", inactiveSessions.size());
        }
    }

    /**
     * Obtiene la dirección IP del cliente.
     *
     * @param request La solicitud HTTP
     * @return La dirección IP del cliente
     */
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    /**
     * Extrae información del dispositivo del User-Agent.
     *
     * @param userAgent El User-Agent
     * @return Información del dispositivo
     */
    private String parseDevice(String userAgent) {
        if (userAgent == null) {
            return "Desconocido";
        }

        if (userAgent.contains("Mobile") || userAgent.contains("Android") || userAgent.contains("iPhone")) {
            return "Móvil";
        } else if (userAgent.contains("iPad") || userAgent.contains("Tablet")) {
            return "Tablet";
        } else {
            return "Escritorio";
        }
    }

    /**
     * Envía un evento de actividad de sesión.
     *
     * @param session La sesión
     * @param action  El tipo de acción
     */
    private void notifySessionActivity(UserSession session, SessionAction action) {
        SessionActivityEvent event = SessionActivityEvent.builder()
                .sessionId(session.getId().toString())
                .ipAddress(session.getIpAddress())
                .userAgent(session.getUserAgent())
                .location(session.getLocation())
                .timestamp(Instant.now().toEpochMilli())
                .action(action)
                .build();

        notificationPort.broadcastSessionActivity(event);
    }
}
