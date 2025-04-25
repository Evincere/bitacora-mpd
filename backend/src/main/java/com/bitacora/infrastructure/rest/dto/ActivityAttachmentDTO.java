package com.bitacora.infrastructure.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para transferir información de archivos adjuntos a actividades.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityAttachmentDTO {
    private Long id;
    private Long activityId;
    private Long userId;
    private String userName;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private Long fileSize;
    private LocalDateTime uploadedAt;
}
