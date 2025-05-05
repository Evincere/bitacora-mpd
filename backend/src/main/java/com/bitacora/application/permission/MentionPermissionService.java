package com.bitacora.application.permission;

import com.bitacora.domain.model.taskrequest.TaskRequest;
import com.bitacora.domain.model.user.User;
import com.bitacora.domain.model.user.UserRole;
import com.bitacora.domain.port.UserRepository;
import com.bitacora.domain.port.repository.TaskRequestRepository;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar los permisos de menciones.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MentionPermissionService {

    private final UserRepository userRepository;
    private final TaskRequestRepository taskRequestRepository;

    /**
     * Verifica si un usuario puede mencionar a otro usuario.
     *
     * @param mentionerUserId ID del usuario que realiza la mención
     * @param mentionedUserId ID del usuario mencionado
     * @return true si el usuario puede mencionar al otro usuario, false en caso
     *         contrario
     */
    public boolean canMention(final Long mentionerUserId, final Long mentionedUserId) {
        // No se puede mencionar a uno mismo
        if (mentionerUserId.equals(mentionedUserId)) {
            return false;
        }

        // Obtener los usuarios
        Optional<User> mentionerOpt = userRepository.findById(mentionerUserId);
        Optional<User> mentionedOpt = userRepository.findById(mentionedUserId);

        if (mentionerOpt.isEmpty() || mentionedOpt.isEmpty()) {
            return false;
        }

        User mentioner = mentionerOpt.get();
        User mentioned = mentionedOpt.get();

        // Los administradores pueden mencionar a cualquier usuario
        if (UserRole.ADMIN.equals(mentioner.getRole())) {
            return true;
        }

        // Los asignadores pueden mencionar a cualquier usuario
        if (UserRole.ASIGNADOR.equals(mentioner.getRole())) {
            return true;
        }

        // Los solicitantes solo pueden mencionar a asignadores y administradores
        if (UserRole.SOLICITANTE.equals(mentioner.getRole())) {
            return UserRole.ASIGNADOR.equals(mentioned.getRole()) || UserRole.ADMIN.equals(mentioned.getRole());
        }

        // Los ejecutores pueden mencionar a asignadores, administradores y solicitantes
        if (UserRole.EJECUTOR.equals(mentioner.getRole())) {
            return UserRole.ASIGNADOR.equals(mentioned.getRole()) ||
                    UserRole.ADMIN.equals(mentioned.getRole()) ||
                    UserRole.SOLICITANTE.equals(mentioned.getRole());
        }

        // Por defecto, no se permite la mención
        return false;
    }

    /**
     * Obtiene los usuarios que pueden ser mencionados por un usuario en una
     * solicitud específica.
     *
     * @param mentionerUserId ID del usuario que realiza la mención
     * @param taskRequestId   ID de la solicitud
     * @return Lista de usuarios que pueden ser mencionados
     */
    public List<User> getMentionableUsers(final Long mentionerUserId, final Long taskRequestId) {
        // Obtener el usuario que realiza la mención
        Optional<User> mentionerOpt = userRepository.findById(mentionerUserId);
        if (mentionerOpt.isEmpty()) {
            return new ArrayList<>();
        }

        User mentioner = mentionerOpt.get();

        // Obtener la solicitud
        Optional<TaskRequest> taskRequestOpt = taskRequestRepository.findById(taskRequestId);
        if (taskRequestOpt.isEmpty()) {
            return new ArrayList<>();
        }

        TaskRequest taskRequest = taskRequestOpt.get();

        // Vamos a obtener los usuarios que pueden ser mencionados según el rol

        // Los administradores pueden mencionar a cualquier usuario
        if (UserRole.ADMIN.equals(mentioner.getRole())) {
            // Obtener todos los usuarios (página 0, tamaño 1000 para obtener todos)
            return userRepository.findAll(0, 1000);
        }

        // Los asignadores pueden mencionar a cualquier usuario
        if (UserRole.ASIGNADOR.equals(mentioner.getRole())) {
            // Obtener todos los usuarios (página 0, tamaño 1000 para obtener todos)
            return userRepository.findAll(0, 1000);
        }

        // Los solicitantes solo pueden mencionar a asignadores y administradores
        if (UserRole.SOLICITANTE.equals(mentioner.getRole())) {
            // Obtener asignadores y administradores (página 0, tamaño 100 para obtener
            // todos)
            List<User> asignadores = userRepository.findByRole(UserRole.ASIGNADOR, 0, 100);
            List<User> admins = userRepository.findByRole(UserRole.ADMIN, 0, 100);

            // Combinar las listas
            List<User> mentionableUsers = new ArrayList<>(asignadores);
            mentionableUsers.addAll(admins);

            return mentionableUsers;
        }

        // Los ejecutores pueden mencionar a asignadores, administradores y al
        // solicitante de la tarea
        if (UserRole.EJECUTOR.equals(mentioner.getRole())) {
            // Obtener asignadores y administradores (página 0, tamaño 100 para obtener
            // todos)
            List<User> asignadores = userRepository.findByRole(UserRole.ASIGNADOR, 0, 100);
            List<User> admins = userRepository.findByRole(UserRole.ADMIN, 0, 100);

            // Combinar las listas
            List<User> mentionableUsers = new ArrayList<>(asignadores);
            mentionableUsers.addAll(admins);

            // Añadir al solicitante de la tarea
            userRepository.findById(taskRequest.getRequesterId())
                    .ifPresent(mentionableUsers::add);

            return mentionableUsers;
        }

        // Por defecto, devolver una lista vacía
        return new ArrayList<>();
    }

    /**
     * Filtra una lista de usuarios para obtener solo aquellos que pueden ser
     * mencionados por un usuario.
     *
     * @param mentionerUserId ID del usuario que realiza la mención
     * @param users           Lista de usuarios a filtrar
     * @return Lista de usuarios que pueden ser mencionados
     */
    public List<User> filterMentionableUsers(final Long mentionerUserId, final List<User> users) {
        return users.stream()
                .filter(user -> canMention(mentionerUserId, user.getId()))
                .collect(Collectors.toList());
    }
}
