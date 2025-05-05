package com.bitacora.domain.model.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * Modelo de dominio para las notificaciones en tiempo real.
 * Clase base para todos los tipos de notificaciones.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "notificationClass")
@JsonSubTypes({
        @JsonSubTypes.Type(value = TaskAssignmentNotification.class, name = "TaskAssignment"),
        @JsonSubTypes.Type(value = TaskStatusChangeNotification.class, name = "TaskStatusChange"),
        @JsonSubTypes.Type(value = DeadlineReminderNotification.class, name = "DeadlineReminder"),
        @JsonSubTypes.Type(value = AnnouncementNotification.class, name = "Announcement"),
        @JsonSubTypes.Type(value = CollaborationNotification.class, name = "Collaboration"),
        @JsonSubTypes.Type(value = MentionNotification.class, name = "Mention")
})
public class RealTimeNotification {
    /**
     * Identificador único de la notificación.
     */
    @lombok.Builder.Default
    private String id = UUID.randomUUID().toString();

    /**
     * Tipo de notificación.
     */
    private NotificationType type;

    /**
     * Título de la notificación.
     */
    private String title;

    /**
     * Mensaje de la notificación.
     */
    private String message;

    /**
     * Marca de tiempo de la notificación.
     */
    @lombok.Builder.Default
    private long timestamp = Instant.now().toEpochMilli();

    /**
     * Datos adicionales asociados a la notificación.
     */
    private Object data;

    /**
     * Indica si la notificación ha sido leída.
     */
    @lombok.Builder.Default
    private boolean read = false;
}
