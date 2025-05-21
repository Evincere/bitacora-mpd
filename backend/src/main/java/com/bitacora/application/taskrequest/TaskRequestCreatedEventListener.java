package com.bitacora.application.taskrequest;

import com.bitacora.domain.event.taskrequest.TaskRequestCreatedEvent;
import com.bitacora.domain.model.notification.NotificationType;
import com.bitacora.domain.model.notification.RealTimeNotification;
import com.bitacora.domain.model.taskrequest.TaskRequestStatus;
import com.bitacora.domain.port.notification.NotificationPort;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

/**
 * Listener para eventos de creación de solicitudes de tareas.
 * Envía notificaciones en tiempo real cuando se crea una nueva solicitud.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TaskRequestCreatedEventListener {

    private final NotificationPort notificationPort;

    /**
     * Maneja el evento de creación de solicitud de tarea.
     *
     * @param event El evento de creación de solicitud
     */
    @EventListener
    @Async
    public void handleTaskRequestCreatedEvent(TaskRequestCreatedEvent event) {
        log.info("Procesando evento de creación de solicitud de tarea: {}", event.getTaskRequestId());

        try {
            // Solo enviar notificaciones para solicitudes en estado SUBMITTED
            if (event.getStatus() == TaskRequestStatus.SUBMITTED) {
                // Enviar notificación a todos los asignadores
                sendNotificationToAssigners(event);

                // Enviar evento específico de nueva solicitud para actualizar la bandeja de
                // entrada
                sendNewTaskRequestEvent(event);
            }
        } catch (Exception e) {
            log.error("Error al procesar evento de creación de solicitud: {}", e.getMessage(), e);
        }
    }

    /**
     * Envía una notificación a todos los usuarios con rol de asignador.
     *
     * @param event El evento de creación de solicitud
     */
    private void sendNotificationToAssigners(TaskRequestCreatedEvent event) {
        // Crear notificación
        RealTimeNotification notification = RealTimeNotification.builder()
                .id(UUID.randomUUID().toString())
                .title("Nueva solicitud de tarea")
                .message("Se ha recibido una nueva solicitud: " + event.getTitle())
                .type(NotificationType.INFO)
                .read(false)
                .timestamp(System.currentTimeMillis())
                .data("/app/asignacion/bandeja")
                .build();

        // Enviar notificación global (a todos los asignadores)
        notificationPort.sendGlobalNotification(notification);
        log.debug("Notificación enviada para la solicitud: {}", event.getTaskRequestId());
    }

    /**
     * Envía un evento específico de nueva solicitud para actualizar la bandeja de
     * entrada.
     *
     * @param event El evento de creación de solicitud
     */
    private void sendNewTaskRequestEvent(TaskRequestCreatedEvent event) {
        // Crear datos del evento
        TaskRequestCreatedEventData eventData = new TaskRequestCreatedEventData(
                event.getTaskRequestId(),
                event.getTitle(),
                event.getRequesterId());

        // Enviar evento a través del canal de WebSocket
        notificationPort.sendCustomEvent("new-task-request", eventData);
        log.debug("Evento new-task-request enviado para la solicitud: {}", event.getTaskRequestId());
    }

    /**
     * Clase interna para los datos del evento de nueva solicitud.
     * Los getters son necesarios para la serialización JSON aunque no se usen
     * localmente.
     */
    private static class TaskRequestCreatedEventData {
        private final Long id;
        private final String title;
        private final Long requesterId;

        public TaskRequestCreatedEventData(Long id, String title, Long requesterId) {
            this.id = id;
            this.title = title;
            this.requesterId = requesterId;
        }

        @JsonProperty
        public Long getId() {
            return id;
        }

        @JsonProperty
        public String getTitle() {
            return title;
        }

        @JsonProperty
        public Long getRequesterId() {
            return requesterId;
        }
    }
}
