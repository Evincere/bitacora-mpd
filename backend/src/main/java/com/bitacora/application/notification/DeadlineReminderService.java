package com.bitacora.application.notification;

import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.notification.DeadlineReminderNotification;
import com.bitacora.domain.model.notification.DeadlineReminderNotification.ReminderType;
import com.bitacora.domain.model.user.User;
import com.bitacora.domain.port.notification.NotificationPort;
import com.bitacora.domain.port.repository.ActivityRepository;
import com.bitacora.domain.port.UserRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

import java.util.List;
import java.util.Optional;

/**
 * Servicio para enviar recordatorios de fechas límite.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DeadlineReminderService {

    private final NotificationPort notificationPort;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    /**
     * Envía recordatorios de actividades que vencen en 24 horas.
     * Se ejecuta cada hora.
     */
    @Scheduled(cron = "0 0 * * * *") // Cada hora en punto
    public void sendOneDayReminders() {
        log.debug("Enviando recordatorios de actividades que vencen en 24 horas");

        // Calcular el rango de tiempo (entre 23 y 24 horas desde ahora)
        LocalDateTime start = LocalDateTime.now().plusHours(23);
        LocalDateTime end = LocalDateTime.now().plusHours(24);

        // Obtener actividades que vencen en ese rango
        List<Activity> activities = activityRepository.findByDateBetween(start, end);

        // Enviar recordatorios
        for (Activity activity : activities) {
            sendReminder(activity, ReminderType.ONE_DAY, 24);
        }
    }

    /**
     * Envía recordatorios de actividades que vencen en 4 horas.
     * Se ejecuta cada hora.
     */
    @Scheduled(cron = "0 0 * * * *") // Cada hora en punto
    public void sendFourHourReminders() {
        log.debug("Enviando recordatorios de actividades que vencen en 4 horas");

        // Calcular el rango de tiempo (entre 3 y 4 horas desde ahora)
        LocalDateTime start = LocalDateTime.now().plusHours(3);
        LocalDateTime end = LocalDateTime.now().plusHours(4);

        // Obtener actividades que vencen en ese rango
        List<Activity> activities = activityRepository.findByDateBetween(start, end);

        // Enviar recordatorios
        for (Activity activity : activities) {
            sendReminder(activity, ReminderType.FOUR_HOURS, 4);
        }
    }

    /**
     * Envía recordatorios de actividades que vencen en 1 hora.
     * Se ejecuta cada 15 minutos.
     */
    @Scheduled(cron = "0 */15 * * * *") // Cada 15 minutos
    public void sendOneHourReminders() {
        log.debug("Enviando recordatorios de actividades que vencen en 1 hora");

        // Calcular el rango de tiempo (entre 45 minutos y 1 hora desde ahora)
        LocalDateTime start = LocalDateTime.now().plusMinutes(45);
        LocalDateTime end = LocalDateTime.now().plusHours(1);

        // Obtener actividades que vencen en ese rango
        List<Activity> activities = activityRepository.findByDateBetween(start, end);

        // Enviar recordatorios
        for (Activity activity : activities) {
            sendReminder(activity, ReminderType.ONE_HOUR, 1);
        }
    }

    /**
     * Envía un recordatorio para una actividad.
     *
     * @param activity       La actividad
     * @param reminderType   El tipo de recordatorio
     * @param hoursRemaining Las horas restantes hasta la fecha límite
     */
    private void sendReminder(Activity activity, ReminderType reminderType, int hoursRemaining) {
        // Si la actividad no tiene usuario asignado, no enviar recordatorio
        if (activity.getUserId() == null) {
            return;
        }

        // Obtener el usuario asignado
        Optional<User> userOpt = userRepository.findById(activity.getUserId());
        if (userOpt.isEmpty()) {
            log.warn("No se encontró el usuario con ID: {}", activity.getUserId());
            return;
        }

        User user = userOpt.get();

        // Crear notificación de recordatorio
        DeadlineReminderNotification notification = DeadlineReminderNotification.builder()
                .activityId(activity.getId())
                .activityTitle(activity.getDescription())
                .dueDate(activity.getDate().toInstant(ZoneOffset.UTC).toEpochMilli())
                .hoursRemaining(hoursRemaining)
                .reminderType(reminderType)
                .title("Recordatorio de actividad")
                .message(getMessageForReminderType(activity.getDescription(), reminderType))
                .build();

        // Enviar notificación
        notificationPort.sendDeadlineReminderNotification(user.getUsername(), notification);
    }

    /**
     * Obtiene el mensaje para un tipo de recordatorio.
     *
     * @param activityTitle El título de la actividad
     * @param reminderType  El tipo de recordatorio
     * @return El mensaje
     */
    private String getMessageForReminderType(String activityTitle, ReminderType reminderType) {
        switch (reminderType) {
            case ONE_DAY:
                return "La actividad \"" + activityTitle + "\" vence en 24 horas.";
            case FOUR_HOURS:
                return "La actividad \"" + activityTitle + "\" vence en 4 horas.";
            case ONE_HOUR:
                return "La actividad \"" + activityTitle + "\" vence en 1 hora.";
            case CUSTOM:
            default:
                return "La actividad \"" + activityTitle + "\" está próxima a vencer.";
        }
    }
}
