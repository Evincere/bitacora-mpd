package com.bitacora.domain.model.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * Modelo de dominio para alertas del sistema.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemAlertEvent {
    /**
     * Identificador único de la alerta.
     */
    @Builder.Default
    private String id = UUID.randomUUID().toString();
    
    /**
     * Nivel de severidad de la alerta.
     */
    private AlertLevel level;
    
    /**
     * Título de la alerta.
     */
    private String title;
    
    /**
     * Mensaje de la alerta.
     */
    private String message;
    
    /**
     * Marca de tiempo de la alerta.
     */
    @Builder.Default
    private long timestamp = Instant.now().toEpochMilli();
    
    /**
     * Indica si la alerta requiere acción por parte del usuario.
     */
    @Builder.Default
    private boolean requiresAction = false;
    
    /**
     * Niveles de severidad para alertas del sistema.
     */
    public enum AlertLevel {
        /**
         * Alerta crítica.
         */
        CRITICAL,
        
        /**
         * Alerta de advertencia.
         */
        WARNING,
        
        /**
         * Alerta informativa.
         */
        INFO
    }
}
