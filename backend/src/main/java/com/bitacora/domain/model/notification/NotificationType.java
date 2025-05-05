package com.bitacora.domain.model.notification;

/**
 * Tipos de notificaciones soportados por el sistema.
 */
public enum NotificationType {
    /**
     * Notificación de éxito.
     */
    SUCCESS,

    /**
     * Notificación de error.
     */
    ERROR,

    /**
     * Notificación de advertencia.
     */
    WARNING,

    /**
     * Notificación informativa.
     */
    INFO,

    /**
     * Notificación de asignación de tarea.
     */
    TASK_ASSIGNMENT,

    /**
     * Notificación de cambio de estado de tarea.
     */
    TASK_STATUS_CHANGE,

    /**
     * Notificación de recordatorio de fecha límite.
     */
    DEADLINE_REMINDER,

    /**
     * Notificación de anuncio o comunicado.
     */
    ANNOUNCEMENT,

    /**
     * Notificación de colaboración en tiempo real.
     */
    COLLABORATION,

    /**
     * Notificación de mención en comentario.
     */
    MENTION
}
