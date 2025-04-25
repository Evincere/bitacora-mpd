package com.bitacora.infrastructure.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para transferir información de historial de actividades.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityHistoryDTO {
    private Long id;
    private Long activityId;
    private Long userId;
    private String userName;
    private String previousStatus;
    private String newStatus;
    private LocalDateTime changeDate;
    private String notes;
}
