package com.bitacora.domain.model.activity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad de dominio que representa un archivo adjunto a una actividad.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityAttachment {
    private Long id;
    private Long activityId;
    private Long userId;
    private String userName;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private Long fileSize;
    private LocalDateTime uploadedAt;
    
    /**
     * Crea un nuevo adjunto.
     * 
     * @param activityId ID de la actividad
     * @param userId ID del usuario que sube el archivo
     * @param userName Nombre del usuario que sube el archivo
     * @param fileName Nombre del archivo
     * @param fileType Tipo MIME del archivo
     * @param fileUrl URL o ruta del archivo
     * @param fileSize Tamaño del archivo en bytes
     * @return Un nuevo adjunto
     */
    public static ActivityAttachment create(
            Long activityId, 
            Long userId, 
            String userName, 
            String fileName, 
            String fileType, 
            String fileUrl,
            Long fileSize) {
        
        return ActivityAttachment.builder()
                .activityId(activityId)
                .userId(userId)
                .userName(userName)
                .fileName(fileName)
                .fileType(fileType)
                .fileUrl(fileUrl)
                .fileSize(fileSize)
                .uploadedAt(LocalDateTime.now())
                .build();
    }
}
