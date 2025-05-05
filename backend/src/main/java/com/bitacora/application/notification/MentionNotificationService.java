package com.bitacora.application.notification;

import com.bitacora.domain.model.notification.MentionNotification;
import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.domain.model.user.User;
import com.bitacora.domain.port.notification.NotificationPort;
import com.bitacora.domain.port.repository.TaskRequestRepository;
import com.bitacora.domain.port.UserRepository;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Servicio para manejar notificaciones de menciones en comentarios.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MentionNotificationService {

    private final NotificationPort notificationPort;
    private final UserRepository userRepository;
    private final TaskRequestRepository taskRequestRepository;

    // Patrón para detectar menciones con @
    private static final Pattern MENTION_PATTERN = Pattern.compile("@([\\w.-]+)");

    /**
     * Procesa las menciones en un comentario y envía notificaciones a los usuarios
     * mencionados.
     *
     * @param comment         El comentario que contiene las menciones
     * @param mentionerUserId El ID del usuario que realizó las menciones
     * @return El número de notificaciones enviadas
     */
    public int processMentions(final TaskRequestComment comment, final Long mentionerUserId) {
        if (comment == null || comment.getContent() == null || comment.getContent().isEmpty()) {
            return 0;
        }

        // Obtener la solicitud
        Optional<TaskRequest> taskRequestOpt = taskRequestRepository.findById(comment.getTaskRequestId());
        if (taskRequestOpt.isEmpty()) {
            log.warn("No se encontró la solicitud con ID: {}", comment.getTaskRequestId());
            return 0;
        }

        TaskRequest taskRequest = taskRequestOpt.get();

        // Obtener el usuario que realizó las menciones
        Optional<User> mentionerOpt = userRepository.findById(mentionerUserId);
        if (mentionerOpt.isEmpty()) {
            log.warn("No se encontró el usuario con ID: {}", mentionerUserId);
            return 0;
        }

        User mentioner = mentionerOpt.get();

        // Buscar menciones en el contenido del comentario
        Matcher matcher = MENTION_PATTERN.matcher(comment.getContent());
        int notificationsSent = 0;

        while (matcher.find()) {
            String username = matcher.group(1);

            // Buscar el usuario mencionado
            Optional<User> mentionedUserOpt = userRepository.findByUsername(username);
            if (mentionedUserOpt.isPresent()) {
                User mentionedUser = mentionedUserOpt.get();

                // Evitar enviar notificación al propio usuario que hizo la mención
                if (mentionedUser.getId().equals(mentionerUserId)) {
                    continue;
                }

                // Crear y enviar la notificación
                sendMentionNotification(
                        mentionedUser.getUsername(),
                        comment,
                        taskRequest,
                        mentioner,
                        getCommentFragment(comment.getContent(), matcher.start()));

                // Registrar la mención en el comentario
                comment.addMention(mentionedUser.getId());

                notificationsSent++;
            }
        }

        return notificationsSent;
    }

    /**
     * Procesa las menciones especiales como @all en un comentario.
     *
     * @param comment         El comentario que contiene las menciones
     * @param mentionerUserId El ID del usuario que realizó las menciones
     * @param relevantUserIds Conjunto de IDs de usuarios relevantes para la
     *                        mención @all
     * @return El número de notificaciones enviadas
     */
    public int processSpecialMentions(final TaskRequestComment comment, final Long mentionerUserId,
            final Set<Long> relevantUserIds) {
        if (comment == null || comment.getContent() == null || comment.getContent().isEmpty()) {
            return 0;
        }

        // Verificar si hay mención @all
        if (!comment.getContent().contains("@all")) {
            return 0;
        }

        // Obtener la solicitud
        Optional<TaskRequest> taskRequestOpt = taskRequestRepository.findById(comment.getTaskRequestId());
        if (taskRequestOpt.isEmpty()) {
            log.warn("No se encontró la solicitud con ID: {}", comment.getTaskRequestId());
            return 0;
        }

        TaskRequest taskRequest = taskRequestOpt.get();

        // Obtener el usuario que realizó las menciones
        Optional<User> mentionerOpt = userRepository.findById(mentionerUserId);
        if (mentionerOpt.isEmpty()) {
            log.warn("No se encontró el usuario con ID: {}", mentionerUserId);
            return 0;
        }

        User mentioner = mentionerOpt.get();

        // Enviar notificaciones a todos los usuarios relevantes
        int notificationsSent = 0;

        for (Long userId : relevantUserIds) {
            // Evitar enviar notificación al propio usuario que hizo la mención
            if (userId.equals(mentionerUserId)) {
                continue;
            }

            // Buscar el usuario
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                // Crear y enviar la notificación
                sendMentionNotification(
                        user.getUsername(),
                        comment,
                        taskRequest,
                        mentioner,
                        getCommentFragment(comment.getContent(), comment.getContent().indexOf("@all")));

                // Registrar la mención en el comentario
                comment.addMention(userId);

                notificationsSent++;
            }
        }

        return notificationsSent;
    }

    /**
     * Envía una notificación de mención a un usuario.
     *
     * @param username        El nombre de usuario del destinatario
     * @param comment         El comentario donde se realizó la mención
     * @param taskRequest     La solicitud a la que pertenece el comentario
     * @param mentioner       El usuario que realizó la mención
     * @param commentFragment Fragmento del comentario que contiene la mención
     */
    private void sendMentionNotification(final String username, final TaskRequestComment comment,
            final TaskRequest taskRequest, final User mentioner, final String commentFragment) {

        // Crear la notificación
        MentionNotification notification = MentionNotification.builder()
                .taskRequestId(taskRequest.getId())
                .taskRequestTitle(taskRequest.getTitle())
                .commentId(comment.getId())
                .mentionedById(mentioner.getId())
                .mentionedByName(mentioner.getPersonName().getFullName())
                .commentFragment(commentFragment)
                .title("Has sido mencionado en un comentario")
                .message(mentioner.getPersonName().getFullName() + " te ha mencionado en un comentario")
                .build();

        // Enviar la notificación
        notificationPort.sendMentionNotification(username, notification);

        log.debug("Notificación de mención enviada a {} para el comentario {}", username, comment.getId());
    }

    /**
     * Obtiene un fragmento del comentario alrededor de la mención.
     *
     * @param content      El contenido completo del comentario
     * @param mentionIndex El índice donde comienza la mención
     * @return Un fragmento del comentario
     */
    private String getCommentFragment(final String content, final int mentionIndex) {
        // Determinar el inicio del fragmento (hasta 50 caracteres antes de la mención)
        int startIndex = Math.max(0, mentionIndex - 50);

        // Determinar el fin del fragmento (hasta 50 caracteres después de la mención)
        int endIndex = Math.min(content.length(), mentionIndex + 50);

        // Extraer el fragmento
        String fragment = content.substring(startIndex, endIndex);

        // Añadir elipsis si el fragmento no comienza al inicio del comentario
        if (startIndex > 0) {
            fragment = "..." + fragment;
        }

        // Añadir elipsis si el fragmento no termina al final del comentario
        if (endIndex < content.length()) {
            fragment = fragment + "...";
        }

        return fragment;
    }
}
