package com.bitacora.domain.model.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Modelo de dominio para eventos de estado de usuario.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatusEvent {
    /**
     * Identificador del usuario.
     */
    private Long userId;
    
    /**
     * Estado del usuario (online, offline, away).
     */
    private UserStatus status;
    
    /**
     * Marca de tiempo de la última actividad.
     */
    @Builder.Default
    private long lastActivity = Instant.now().toEpochMilli();
    
    /**
     * Estados posibles para un usuario.
     */
    public enum UserStatus {
        /**
         * Usuario en línea.
         */
        ONLINE,
        
        /**
         * Usuario fuera de línea.
         */
        OFFLINE,
        
        /**
         * Usuario ausente.
         */
        AWAY
    }
}
