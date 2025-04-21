package com.bitacora.domain.model.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Modelo de dominio para eventos de actividad de sesión.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionActivityEvent {
    /**
     * Identificador de la sesión.
     */
    private String sessionId;
    
    /**
     * Dirección IP desde la que se realizó la actividad.
     */
    private String ipAddress;
    
    /**
     * User-Agent del navegador o cliente.
     */
    private String userAgent;
    
    /**
     * Ubicación geográfica (opcional).
     */
    private String location;
    
    /**
     * Marca de tiempo de la actividad.
     */
    @Builder.Default
    private long timestamp = Instant.now().toEpochMilli();
    
    /**
     * Tipo de acción realizada.
     */
    private SessionAction action;
    
    /**
     * Tipos de acciones de sesión.
     */
    public enum SessionAction {
        /**
         * Inicio de sesión.
         */
        LOGIN,
        
        /**
         * Cierre de sesión.
         */
        LOGOUT,
        
        /**
         * Renovación de token.
         */
        TOKEN_REFRESH,
        
        /**
         * Actividad sospechosa.
         */
        SUSPICIOUS_ACTIVITY
    }
}
