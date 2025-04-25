package com.bitacora.infrastructure.rest.mapper;

import com.bitacora.domain.model.activity.ActivityComment;
import com.bitacora.infrastructure.rest.dto.ActivityCommentDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre ActivityComment y ActivityCommentDTO.
 */
@Component
public class ActivityCommentMapper {
    
    /**
     * Convierte un modelo de dominio ActivityComment a un DTO ActivityCommentDTO.
     * 
     * @param comment El modelo de dominio ActivityComment
     * @return El DTO ActivityCommentDTO
     */
    public ActivityCommentDTO toDto(ActivityComment comment) {
        if (comment == null) {
            return null;
        }
        
        return ActivityCommentDTO.builder()
                .id(comment.getId())
                .activityId(comment.getActivityId())
                .userId(comment.getUserId())
                .userName(comment.getUserName())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
    
    /**
     * Convierte una lista de modelos de dominio ActivityComment a una lista de DTOs ActivityCommentDTO.
     * 
     * @param comments Lista de modelos de dominio ActivityComment
     * @return Lista de DTOs ActivityCommentDTO
     */
    public List<ActivityCommentDTO> toDtoList(List<ActivityComment> comments) {
        if (comments == null) {
            return null;
        }
        
        return comments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
