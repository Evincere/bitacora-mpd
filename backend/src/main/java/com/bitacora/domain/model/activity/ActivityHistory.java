package com.bitacora.domain.model.activity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad de dominio que representa un registro en el historial de cambios de una actividad.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityHistory {
    private Long id;
    private Long activityId;
    private Long userId;
    private String userName;
    private String previousStatus;
    private String newStatus;
    private LocalDateTime changeDate;
    private String notes;
    
    /**
     * Crea un nuevo registro de historial para un cambio de estado.
     * 
     * @param activityId ID de la actividad
     * @param userId ID del usuario que realizó el cambio
     * @param userName Nombre del usuario que realizó el cambio
     * @param previousStatus Estado anterior
     * @param newStatus Nuevo estado
     * @param notes Notas sobre el cambio
     * @return Un nuevo registro de historial
     */
    public static ActivityHistory createStatusChange(
            Long activityId, 
            Long userId, 
            String userName, 
            ActivityStatusNew previousStatus, 
            ActivityStatusNew newStatus, 
            String notes) {
        
        return ActivityHistory.builder()
                .activityId(activityId)
                .userId(userId)
                .userName(userName)
                .previousStatus(previousStatus != null ? previousStatus.name() : null)
                .newStatus(newStatus != null ? newStatus.name() : null)
                .changeDate(LocalDateTime.now())
                .notes(notes)
                .build();
    }
}
