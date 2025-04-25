package com.bitacora.infrastructure.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para transferir información de comentarios en actividades.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityCommentDTO {
    private Long id;
    private Long activityId;
    private Long userId;
    private String userName;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
