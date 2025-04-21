package com.bitacora.application.notification;

import com.bitacora.domain.event.activity.ActivityCreatedEvent;
import com.bitacora.domain.event.activity.ActivityStatusChangedEvent;
import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.notification.TaskAssignmentNotification;
import com.bitacora.domain.model.notification.TaskStatusChangeNotification;
import com.bitacora.domain.model.user.User;
import com.bitacora.domain.port.notification.NotificationPort;
import com.bitacora.domain.port.repository.ActivityRepository;
import com.bitacora.domain.port.UserRepository;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;

/**
 * Servicio para manejar notificaciones relacionadas con actividades.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityNotificationService {

    private final NotificationPort notificationPort;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    /**
     * Maneja el evento de creación de actividad.
     *
     * @param event El evento de creación de actividad
     */
    @EventListener
    public void handleActivityCreatedEvent(ActivityCreatedEvent event) {
        log.debug("Manejando evento de creación de actividad: {}", event);

        // Obtener la actividad
        Optional<Activity> activityOpt = activityRepository.findById(event.getActivityId());
        if (activityOpt.isEmpty()) {
            log.warn("No se encontró la actividad con ID: {}", event.getActivityId());
            return;
        }

        Activity activity = activityOpt.get();

        // Si la actividad tiene un usuario asignado, enviar notificación
        if (activity.getUserId() != null) {
            // Obtener el usuario que creó la actividad
            Optional<User> creatorOpt = userRepository.findById(event.getUserId());
            if (creatorOpt.isEmpty()) {
                log.warn("No se encontró el usuario creador con ID: {}", event.getUserId());
                return;
            }

            User creator = creatorOpt.get();

            // Obtener el usuario asignado
            Optional<User> assignedUserOpt = userRepository.findById(activity.getUserId());
            if (assignedUserOpt.isEmpty()) {
                log.warn("No se encontró el usuario asignado con ID: {}", activity.getUserId());
                return;
            }

            User assignedUser = assignedUserOpt.get();

            // Crear notificación de asignación de tarea
            TaskAssignmentNotification notification = TaskAssignmentNotification.builder()
                    .activityId(activity.getId())
                    .activityTitle(activity.getDescription())
                    .assignerId(creator.getId())
                    .assignerName(creator.getPersonName().getFullName())
                    .dueDate(activity.getDate() != null
                            ? activity.getDate().toInstant(java.time.ZoneOffset.UTC).toEpochMilli()
                            : null)
                    .title("Nueva actividad asignada")
                    .message("Se te ha asignado una nueva actividad: " + activity.getDescription())
                    .build();

            // Enviar notificación
            notificationPort.sendTaskAssignmentNotification(assignedUser.getUsername(), notification);
        }
    }

    /**
     * Maneja el evento de cambio de estado de actividad.
     *
     * @param event El evento de cambio de estado de actividad
     */
    @EventListener
    public void handleActivityStatusChangedEvent(ActivityStatusChangedEvent event) {
        log.debug("Manejando evento de cambio de estado de actividad: {}", event);

        // Obtener la actividad
        Optional<Activity> activityOpt = activityRepository.findById(event.getActivityId());
        if (activityOpt.isEmpty()) {
            log.warn("No se encontró la actividad con ID: {}", event.getActivityId());
            return;
        }

        Activity activity = activityOpt.get();

        // Si la actividad tiene un usuario asignado, enviar notificación
        if (activity.getUserId() != null) {
            // Obtener el usuario que cambió el estado
            Optional<User> changerOpt = userRepository.findById(event.getUserId());
            if (changerOpt.isEmpty()) {
                log.warn("No se encontró el usuario que cambió el estado con ID: {}", event.getUserId());
                return;
            }

            User changer = changerOpt.get();

            // Obtener el usuario asignado
            Optional<User> assignedUserOpt = userRepository.findById(activity.getUserId());
            if (assignedUserOpt.isEmpty()) {
                log.warn("No se encontró el usuario asignado con ID: {}", activity.getUserId());
                return;
            }

            User assignedUser = assignedUserOpt.get();

            // Crear notificación de cambio de estado
            TaskStatusChangeNotification notification = TaskStatusChangeNotification.builder()
                    .activityId(activity.getId())
                    .activityTitle(activity.getDescription())
                    .previousStatus(event.getOldStatus().name())
                    .newStatus(event.getNewStatus().name())
                    .changedById(changer.getId())
                    .changedByName(changer.getPersonName().getFullName())
                    .title("Estado de actividad actualizado")
                    .message("El estado de la actividad \"" + activity.getDescription() +
                            "\" ha cambiado de " + event.getOldStatus().name() +
                            " a " + event.getNewStatus().name())
                    .build();

            // Enviar notificación
            notificationPort.sendTaskStatusChangeNotification(assignedUser.getUsername(), notification);
        }
    }
}
