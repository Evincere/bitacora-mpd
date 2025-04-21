package com.bitacora.infrastructure.messaging.adapter;

import com.bitacora.domain.model.notification.NotificationType;
import com.bitacora.domain.model.notification.RealTimeNotification;
import com.bitacora.domain.model.notification.SessionActivityEvent;
import com.bitacora.domain.model.notification.SystemAlertEvent;
import com.bitacora.domain.model.notification.UserStatusEvent;
import com.bitacora.domain.model.notification.TaskAssignmentNotification;
import com.bitacora.domain.model.notification.TaskStatusChangeNotification;
import com.bitacora.domain.model.notification.DeadlineReminderNotification;
import com.bitacora.domain.model.notification.AnnouncementNotification;
import com.bitacora.domain.model.notification.CollaborationNotification;
import com.bitacora.domain.port.notification.NotificationPort;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Adaptador para el envío de notificaciones en tiempo real.
 * Implementa el puerto NotificationPort utilizando WebSockets.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationAdapter implements NotificationPort {

    private final SimpMessagingTemplate messagingTemplate;

    private static final String NOTIFICATION_DESTINATION = "/topic/notification";
    private static final String USER_STATUS_DESTINATION = "/topic/user-status";
    private static final String SESSION_ACTIVITY_DESTINATION = "/topic/session-activity";
    private static final String SYSTEM_ALERT_DESTINATION = "/topic/system-alert";
    private static final String USER_NOTIFICATION_DESTINATION = "/queue/notification";
    private static final String ACTIVITY_COLLABORATION_DESTINATION = "/topic/activity/";
    private static final String DEPARTMENT_ANNOUNCEMENT_DESTINATION = "/topic/department/";

    @Override
    public void sendGlobalNotification(RealTimeNotification notification) {
        log.debug("Enviando notificación global: {}", notification);
        messagingTemplate.convertAndSend(NOTIFICATION_DESTINATION, notification);
    }

    @Override
    public void sendPrivateNotification(String username, RealTimeNotification notification) {
        log.debug("Enviando notificación privada a {}: {}", username, notification);
        messagingTemplate.convertAndSendToUser(username, USER_NOTIFICATION_DESTINATION, notification);
    }

    @Override
    public void sendSuccessNotification(String username, String title, String message) {
        RealTimeNotification notification = RealTimeNotification.builder()
                .type(NotificationType.SUCCESS)
                .title(title)
                .message(message)
                .build();
        sendPrivateNotification(username, notification);
    }

    @Override
    public void sendErrorNotification(String username, String title, String message) {
        RealTimeNotification notification = RealTimeNotification.builder()
                .type(NotificationType.ERROR)
                .title(title)
                .message(message)
                .build();
        sendPrivateNotification(username, notification);
    }

    @Override
    public void sendWarningNotification(String username, String title, String message) {
        RealTimeNotification notification = RealTimeNotification.builder()
                .type(NotificationType.WARNING)
                .title(title)
                .message(message)
                .build();
        sendPrivateNotification(username, notification);
    }

    @Override
    public void sendInfoNotification(String username, String title, String message) {
        RealTimeNotification notification = RealTimeNotification.builder()
                .type(NotificationType.INFO)
                .title(title)
                .message(message)
                .build();
        sendPrivateNotification(username, notification);
    }

    @Override
    public void broadcastUserStatus(UserStatusEvent statusEvent) {
        log.debug("Enviando evento de estado de usuario: {}", statusEvent);
        messagingTemplate.convertAndSend(USER_STATUS_DESTINATION, statusEvent);
    }

    @Override
    public void broadcastSessionActivity(SessionActivityEvent activityEvent) {
        log.debug("Enviando evento de actividad de sesión: {}", activityEvent);
        messagingTemplate.convertAndSend(SESSION_ACTIVITY_DESTINATION, activityEvent);
    }

    @Override
    public void broadcastSystemAlert(SystemAlertEvent alertEvent) {
        log.debug("Enviando alerta del sistema: {}", alertEvent);
        messagingTemplate.convertAndSend(SYSTEM_ALERT_DESTINATION, alertEvent);
    }

    @Override
    public void sendTaskAssignmentNotification(String username, TaskAssignmentNotification notification) {
        log.debug("Enviando notificación de asignación de tarea a {}: {}", username, notification);
        notification.setType(NotificationType.TASK_ASSIGNMENT);
        messagingTemplate.convertAndSendToUser(username, USER_NOTIFICATION_DESTINATION, notification);
    }

    @Override
    public void sendTaskStatusChangeNotification(String username, TaskStatusChangeNotification notification) {
        log.debug("Enviando notificación de cambio de estado de tarea a {}: {}", username, notification);
        notification.setType(NotificationType.TASK_STATUS_CHANGE);
        messagingTemplate.convertAndSendToUser(username, USER_NOTIFICATION_DESTINATION, notification);
    }

    @Override
    public void sendDeadlineReminderNotification(String username, DeadlineReminderNotification notification) {
        log.debug("Enviando notificación de recordatorio de fecha límite a {}: {}", username, notification);
        notification.setType(NotificationType.DEADLINE_REMINDER);
        messagingTemplate.convertAndSendToUser(username, USER_NOTIFICATION_DESTINATION, notification);
    }

    @Override
    public void broadcastAnnouncementNotification(AnnouncementNotification notification, String department) {
        log.debug("Enviando notificación de anuncio: {}", notification);
        notification.setType(NotificationType.ANNOUNCEMENT);

        if (department != null && !department.isEmpty()) {
            // Enviar a un departamento específico
            messagingTemplate.convertAndSend(DEPARTMENT_ANNOUNCEMENT_DESTINATION + department, notification);
        } else {
            // Enviar a todos los usuarios
            messagingTemplate.convertAndSend(NOTIFICATION_DESTINATION, notification);
        }
    }

    @Override
    public void broadcastCollaborationNotification(CollaborationNotification notification, Long activityId) {
        log.debug("Enviando notificación de colaboración para la actividad {}: {}", activityId, notification);
        notification.setType(NotificationType.COLLABORATION);
        messagingTemplate.convertAndSend(ACTIVITY_COLLABORATION_DESTINATION + activityId, notification);
    }
}
