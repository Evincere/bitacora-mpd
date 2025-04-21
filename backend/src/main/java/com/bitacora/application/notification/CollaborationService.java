package com.bitacora.application.notification;

import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.model.notification.CollaborationNotification;
import com.bitacora.domain.model.notification.CollaborationNotification.CollaborationAction;
import com.bitacora.domain.model.user.User;
import com.bitacora.domain.port.notification.NotificationPort;
import com.bitacora.domain.port.repository.ActivityRepository;
import com.bitacora.domain.port.UserRepository;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.Set;
import java.util.concurrent.ConcurrentSkipListSet;

/**
 * Servicio para manejar la colaboración en tiempo real.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CollaborationService {

    private final NotificationPort notificationPort;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    // Mapa para rastrear qué usuarios están viendo/editando cada actividad
    private final ConcurrentMap<Long, Set<Long>> activityViewers = new ConcurrentHashMap<>();
    private final ConcurrentMap<Long, Long> activityEditors = new ConcurrentHashMap<>();

    /**
     * Registra que un usuario está viendo una actividad.
     *
     * @param activityId El ID de la actividad
     * @param userId     El ID del usuario
     * @return true si se registró correctamente, false en caso contrario
     */
    public boolean registerViewer(Long activityId, Long userId) {
        log.debug("Registrando usuario {} como visor de la actividad {}", userId, activityId);

        // Obtener la actividad
        Optional<Activity> activityOpt = activityRepository.findById(activityId);
        if (activityOpt.isEmpty()) {
            log.warn("No se encontró la actividad con ID: {}", activityId);
            return false;
        }

        // Obtener el usuario
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            log.warn("No se encontró el usuario con ID: {}", userId);
            return false;
        }

        Activity activity = activityOpt.get();
        User user = userOpt.get();

        // Registrar al usuario como visor
        Set<Long> viewers = activityViewers.computeIfAbsent(activityId, k -> new ConcurrentSkipListSet<>());
        boolean isNewViewer = viewers.add(userId);

        // Si es un nuevo visor, notificar a los demás usuarios
        if (isNewViewer) {
            CollaborationNotification notification = CollaborationNotification.builder()
                    .activityId(activityId)
                    .activityTitle(activity.getDescription())
                    .userId(userId)
                    .userName(user.getPersonName().getFullName())
                    .action(CollaborationAction.VIEWING)
                    .title("Usuario viendo actividad")
                    .message(user.getPersonName().getFullName() + " está viendo la actividad")
                    .build();

            notificationPort.broadcastCollaborationNotification(notification, activityId);
        }

        return true;
    }

    /**
     * Registra que un usuario está editando una actividad.
     *
     * @param activityId El ID de la actividad
     * @param userId     El ID del usuario
     * @return true si se registró correctamente, false en caso contrario
     */
    public boolean registerEditor(Long activityId, Long userId) {
        log.debug("Registrando usuario {} como editor de la actividad {}", userId, activityId);

        // Obtener la actividad
        Optional<Activity> activityOpt = activityRepository.findById(activityId);
        if (activityOpt.isEmpty()) {
            log.warn("No se encontró la actividad con ID: {}", activityId);
            return false;
        }

        // Obtener el usuario
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            log.warn("No se encontró el usuario con ID: {}", userId);
            return false;
        }

        Activity activity = activityOpt.get();
        User user = userOpt.get();

        // Verificar si ya hay un editor
        Long currentEditor = activityEditors.get(activityId);
        if (currentEditor != null && !currentEditor.equals(userId)) {
            log.warn("La actividad {} ya está siendo editada por el usuario {}", activityId, currentEditor);
            return false;
        }

        // Registrar al usuario como editor
        activityEditors.put(activityId, userId);

        // Registrar también como visor
        registerViewer(activityId, userId);

        // Notificar a los demás usuarios
        CollaborationNotification notification = CollaborationNotification.builder()
                .activityId(activityId)
                .activityTitle(activity.getDescription())
                .userId(userId)
                .userName(user.getPersonName().getFullName())
                .action(CollaborationAction.EDITING)
                .title("Usuario editando actividad")
                .message(user.getPersonName().getFullName() + " está editando la actividad")
                .build();

        notificationPort.broadcastCollaborationNotification(notification, activityId);

        return true;
    }

    /**
     * Registra que un usuario ha comentado en una actividad.
     *
     * @param activityId El ID de la actividad
     * @param userId     El ID del usuario
     * @param comment    El comentario
     * @return true si se registró correctamente, false en caso contrario
     */
    public boolean registerComment(Long activityId, Long userId, String comment) {
        log.debug("Registrando comentario del usuario {} en la actividad {}", userId, activityId);

        // Obtener la actividad
        Optional<Activity> activityOpt = activityRepository.findById(activityId);
        if (activityOpt.isEmpty()) {
            log.warn("No se encontró la actividad con ID: {}", activityId);
            return false;
        }

        // Obtener el usuario
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            log.warn("No se encontró el usuario con ID: {}", userId);
            return false;
        }

        Activity activity = activityOpt.get();
        User user = userOpt.get();

        // Notificar a los demás usuarios
        CollaborationNotification notification = CollaborationNotification.builder()
                .activityId(activityId)
                .activityTitle(activity.getDescription())
                .userId(userId)
                .userName(user.getPersonName().getFullName())
                .action(CollaborationAction.COMMENTED)
                .title("Nuevo comentario en actividad")
                .message(user.getPersonName().getFullName() + " ha comentado: " + comment)
                .build();

        notificationPort.broadcastCollaborationNotification(notification, activityId);

        return true;
    }

    /**
     * Registra que un usuario ha dejado de ver/editar una actividad.
     *
     * @param activityId El ID de la actividad
     * @param userId     El ID del usuario
     * @return true si se registró correctamente, false en caso contrario
     */
    public boolean unregisterUser(Long activityId, Long userId) {
        log.debug("Eliminando usuario {} como visor/editor de la actividad {}", userId, activityId);

        // Obtener la actividad
        Optional<Activity> activityOpt = activityRepository.findById(activityId);
        if (activityOpt.isEmpty()) {
            log.warn("No se encontró la actividad con ID: {}", activityId);
            return false;
        }

        // Obtener el usuario
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            log.warn("No se encontró el usuario con ID: {}", userId);
            return false;
        }

        Activity activity = activityOpt.get();
        User user = userOpt.get();

        // Eliminar al usuario como editor si lo es
        Long currentEditor = activityEditors.get(activityId);
        if (currentEditor != null && currentEditor.equals(userId)) {
            activityEditors.remove(activityId);
        }

        // Eliminar al usuario como visor
        Set<Long> viewers = activityViewers.get(activityId);
        if (viewers != null) {
            boolean wasViewer = viewers.remove(userId);

            // Si estaba viendo la actividad, notificar a los demás usuarios
            if (wasViewer) {
                CollaborationNotification notification = CollaborationNotification.builder()
                        .activityId(activityId)
                        .activityTitle(activity.getDescription())
                        .userId(userId)
                        .userName(user.getPersonName().getFullName())
                        .action(CollaborationAction.LEFT)
                        .title("Usuario dejó de ver actividad")
                        .message(user.getPersonName().getFullName() + " dejó de ver la actividad")
                        .build();

                notificationPort.broadcastCollaborationNotification(notification, activityId);
            }

            // Si no hay más visores, eliminar la entrada del mapa
            if (viewers.isEmpty()) {
                activityViewers.remove(activityId);
            }
        }

        return true;
    }

    /**
     * Obtiene el conjunto de usuarios que están viendo una actividad.
     *
     * @param activityId El ID de la actividad
     * @return El conjunto de IDs de usuarios
     */
    public Set<Long> getViewers(Long activityId) {
        return activityViewers.getOrDefault(activityId, new ConcurrentSkipListSet<>());
    }

    /**
     * Obtiene el usuario que está editando una actividad.
     *
     * @param activityId El ID de la actividad
     * @return El ID del usuario, o null si nadie está editando la actividad
     */
    public Long getEditor(Long activityId) {
        return activityEditors.get(activityId);
    }
}
