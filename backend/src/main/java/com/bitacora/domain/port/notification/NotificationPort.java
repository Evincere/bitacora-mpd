package com.bitacora.domain.port.notification;

import com.bitacora.domain.model.notification.RealTimeNotification;
import com.bitacora.domain.model.notification.SessionActivityEvent;
import com.bitacora.domain.model.notification.SystemAlertEvent;
import com.bitacora.domain.model.notification.UserStatusEvent;
import com.bitacora.domain.model.notification.TaskAssignmentNotification;
import com.bitacora.domain.model.notification.TaskStatusChangeNotification;
import com.bitacora.domain.model.notification.DeadlineReminderNotification;
import com.bitacora.domain.model.notification.AnnouncementNotification;
import com.bitacora.domain.model.notification.CollaborationNotification;
import com.bitacora.domain.model.notification.MentionNotification;

/**
 * Puerto para el envío de notificaciones en tiempo real.
 * Define las operaciones que debe implementar un adaptador de notificaciones.
 */
public interface NotificationPort {

    /**
     * Envía una notificación a todos los usuarios conectados.
     *
     * @param notification La notificación a enviar
     */
    void sendGlobalNotification(RealTimeNotification notification);

    /**
     * Envía una notificación a un usuario específico.
     *
     * @param username     El nombre de usuario del destinatario
     * @param notification La notificación a enviar
     */
    void sendPrivateNotification(String username, RealTimeNotification notification);

    /**
     * Envía una notificación de éxito a un usuario específico.
     *
     * @param username El nombre de usuario del destinatario
     * @param title    El título de la notificación
     * @param message  El mensaje de la notificación
     */
    void sendSuccessNotification(String username, String title, String message);

    /**
     * Envía una notificación de error a un usuario específico.
     *
     * @param username El nombre de usuario del destinatario
     * @param title    El título de la notificación
     * @param message  El mensaje de la notificación
     */
    void sendErrorNotification(String username, String title, String message);

    /**
     * Envía una notificación de advertencia a un usuario específico.
     *
     * @param username El nombre de usuario del destinatario
     * @param title    El título de la notificación
     * @param message  El mensaje de la notificación
     */
    void sendWarningNotification(String username, String title, String message);

    /**
     * Envía una notificación informativa a un usuario específico.
     *
     * @param username El nombre de usuario del destinatario
     * @param title    El título de la notificación
     * @param message  El mensaje de la notificación
     */
    void sendInfoNotification(String username, String title, String message);

    /**
     * Envía un evento de cambio de estado de usuario a todos los usuarios
     * conectados.
     *
     * @param statusEvent El evento de estado de usuario
     */
    void broadcastUserStatus(UserStatusEvent statusEvent);

    /**
     * Envía un evento de actividad de sesión a todos los usuarios conectados.
     *
     * @param activityEvent El evento de actividad de sesión
     */
    void broadcastSessionActivity(SessionActivityEvent activityEvent);

    /**
     * Envía una alerta del sistema a todos los usuarios conectados.
     *
     * @param alertEvent La alerta del sistema
     */
    void broadcastSystemAlert(SystemAlertEvent alertEvent);

    /**
     * Envía una notificación de asignación de tarea a un usuario específico.
     *
     * @param username     El nombre de usuario del destinatario
     * @param notification La notificación de asignación de tarea
     */
    void sendTaskAssignmentNotification(String username, TaskAssignmentNotification notification);

    /**
     * Envía una notificación de cambio de estado de tarea a un usuario específico.
     *
     * @param username     El nombre de usuario del destinatario
     * @param notification La notificación de cambio de estado de tarea
     */
    void sendTaskStatusChangeNotification(String username, TaskStatusChangeNotification notification);

    /**
     * Envía una notificación de recordatorio de fecha límite a un usuario
     * específico.
     *
     * @param username     El nombre de usuario del destinatario
     * @param notification La notificación de recordatorio de fecha límite
     */
    void sendDeadlineReminderNotification(String username, DeadlineReminderNotification notification);

    /**
     * Envía una notificación de anuncio a todos los usuarios o a un departamento
     * específico.
     *
     * @param notification La notificación de anuncio
     * @param department   El departamento destinatario (null para todos los
     *                     usuarios)
     */
    void broadcastAnnouncementNotification(AnnouncementNotification notification, String department);

    /**
     * Envía una notificación de colaboración en tiempo real a todos los usuarios
     * interesados en una actividad.
     *
     * @param notification La notificación de colaboración
     * @param activityId   El ID de la actividad
     */
    void broadcastCollaborationNotification(CollaborationNotification notification, Long activityId);

    /**
     * Envía una notificación de mención en comentario a un usuario.
     *
     * @param username     El nombre de usuario del destinatario
     * @param notification La notificación de mención
     */
    void sendMentionNotification(String username, MentionNotification notification);
}
