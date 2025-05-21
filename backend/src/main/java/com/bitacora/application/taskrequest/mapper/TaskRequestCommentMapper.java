package com.bitacora.application.taskrequest.mapper;

import com.bitacora.application.taskrequest.dto.TaskRequestCommentDto;
import com.bitacora.application.taskrequest.dto.TaskRequestCommentWithReadStatusDto;
import com.bitacora.domain.model.taskrequest.TaskRequestComment;
import com.bitacora.domain.model.user.User;
import com.bitacora.domain.port.UserRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre entidades TaskRequestComment y DTOs.
 */
@Component
public class TaskRequestCommentMapper {

    private final UserRepository userRepository;

    /**
     * Constructor.
     *
     * @param userRepository Repositorio de usuarios para obtener información adicional
     */
    public TaskRequestCommentMapper(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Convierte una entidad TaskRequestComment a un DTO TaskRequestCommentDto.
     *
     * @param comment La entidad a convertir
     * @return El DTO resultante
     */
    public TaskRequestCommentDto toDto(final TaskRequestComment comment) {
        if (comment == null) {
            return null;
        }

        // Buscar información del usuario que hizo el comentario
        String userName = comment.getUserName();
        if (userName == null && comment.getUserId() != null) {
            Optional<User> userOpt = userRepository.findById(comment.getUserId());
            if (userOpt.isPresent()) {
                userName = userOpt.get().getUsername();
            }
        }

        TaskRequestCommentDto.Builder builder = TaskRequestCommentDto.builder()
                .id(comment.getId())
                .taskRequestId(comment.getTaskRequestId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .mentions(comment.getMentions());

        if (userName != null) {
            builder.userName(userName);
        }

        return builder.build();
    }

    /**
     * Convierte una lista de entidades TaskRequestComment a una lista de DTOs TaskRequestCommentDto.
     *
     * @param comments Las entidades a convertir
     * @return Los DTOs resultantes
     */
    public List<TaskRequestCommentDto> toDtoList(final List<TaskRequestComment> comments) {
        if (comments == null) {
            return List.of();
        }

        return comments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Convierte una entidad TaskRequestComment a un DTO TaskRequestCommentWithReadStatusDto.
     *
     * @param comment La entidad a convertir
     * @param currentUserId ID del usuario actual para determinar si ha leído el comentario
     * @return El DTO resultante
     */
    public TaskRequestCommentWithReadStatusDto toDtoWithReadStatus(
            final TaskRequestComment comment, final Long currentUserId) {
        if (comment == null) {
            return null;
        }

        // Buscar información del usuario que hizo el comentario
        String userName = comment.getUserName();
        String userFullName = null;
        String userEmail = null;

        if (comment.getUserId() != null) {
            Optional<User> userOpt = userRepository.findById(comment.getUserId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                userName = user.getUsername();
                userFullName = user.getFullName();
                userEmail = user.getEmail() != null ? user.getEmail().getValue() : null;
            }
        }

        boolean readByCurrentUser = currentUserId != null && comment.getReadBy() != null
                && comment.getReadBy().contains(currentUserId);

        TaskRequestCommentWithReadStatusDto.Builder builder = TaskRequestCommentWithReadStatusDto.builder()
                .id(comment.getId())
                .taskRequestId(comment.getTaskRequestId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .readBy(comment.getReadBy())
                .readByCurrentUser(readByCurrentUser)
                .mentions(comment.getMentions());

        if (userName != null) {
            builder.userName(userName);
        }

        if (userFullName != null) {
            builder.userFullName(userFullName);
        }

        if (userEmail != null) {
            builder.userEmail(userEmail);
        }

        return builder.build();
    }

    /**
     * Convierte una lista de entidades TaskRequestComment a una lista de DTOs TaskRequestCommentWithReadStatusDto.
     *
     * @param comments Las entidades a convertir
     * @param currentUserId ID del usuario actual para determinar si ha leído cada comentario
     * @return Los DTOs resultantes
     */
    public List<TaskRequestCommentWithReadStatusDto> toDtoWithReadStatusList(
            final List<TaskRequestComment> comments, final Long currentUserId) {
        if (comments == null) {
            return List.of();
        }

        return comments.stream()
                .map(comment -> toDtoWithReadStatus(comment, currentUserId))
                .collect(Collectors.toList());
    }
}
