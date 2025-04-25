package com.bitacora.domain.model.activity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad de dominio que representa un comentario en una actividad.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityComment {
    private Long id;
    private Long activityId;
    private Long userId;
    private String userName;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Crea un nuevo comentario.
     * 
     * @param activityId ID de la actividad
     * @param userId ID del usuario que comenta
     * @param userName Nombre del usuario que comenta
     * @param content Contenido del comentario
     * @return Un nuevo comentario
     */
    public static ActivityComment create(Long activityId, Long userId, String userName, String content) {
        LocalDateTime now = LocalDateTime.now();
        
        return ActivityComment.builder()
                .activityId(activityId)
                .userId(userId)
                .userName(userName)
                .content(content)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }
    
    /**
     * Actualiza el contenido del comentario.
     * 
     * @param newContent Nuevo contenido
     */
    public void updateContent(String newContent) {
        this.content = newContent;
        this.updatedAt = LocalDateTime.now();
    }
}
