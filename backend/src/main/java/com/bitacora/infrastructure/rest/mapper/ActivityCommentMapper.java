package com.bitacora.infrastructure.rest.mapper;

import com.bitacora.domain.model.activity.ActivityComment;
import com.bitacora.infrastructure.rest.dto.ActivityCommentDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

/**
 * Mapper para convertir entre ActivityComment y ActivityCommentDto.
 */
@Component("activityCommentDtoMapper")
public class ActivityCommentMapper {

    /**
     * Convierte un modelo de dominio ActivityComment a un DTO ActivityCommentDto.
     *
     * @param comment El modelo de dominio ActivityComment
     * @return El DTO ActivityCommentDto
     */
    public ActivityCommentDto toDto(ActivityComment comment) {
        if (comment == null) {
            return null;
        }

        return ActivityCommentDto.builder()
                .id(comment.getId())
                .activityId(comment.getActivityId())
                .userId(comment.getUserId())
                .userName(comment.getUserName())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .readBy(new ArrayList<>()) // Por defecto, nadie lo ha leído
                .readByCurrentUser(false) // Por defecto, no leído por el usuario actual
                .mentions(new ArrayList<>()) // Por defecto, sin menciones
                .build();
    }

    /**
     * Convierte una lista de modelos de dominio ActivityComment a una lista de DTOs
     * ActivityCommentDto.
     *
     * @param comments Lista de modelos de dominio ActivityComment
     * @return Lista de DTOs ActivityCommentDto
     */
    public List<ActivityCommentDto> toDtoList(List<ActivityComment> comments) {
        if (comments == null) {
            return null;
        }

        return comments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
