package com.bitacora.infrastructure.rest.dto.session;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * DTO para transferir información de sesiones de usuario.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {
    
    /**
     * Identificador único de la sesión.
     */
    private Long id;
    
    /**
     * Identificador del usuario al que pertenece la sesión.
     */
    private Long userId;
    
    /**
     * Dirección IP desde la que se inició la sesión.
     */
    private String ipAddress;
    
    /**
     * Dispositivo desde el que se inició la sesión.
     */
    private String device;
    
    /**
     * Ubicación geográfica desde la que se inició la sesión.
     */
    private String location;
    
    /**
     * Fecha y hora de inicio de la sesión.
     */
    private Date loginTime;
    
    /**
     * Fecha y hora de la última actividad en la sesión.
     */
    private Date lastActivityTime;
    
    /**
     * Fecha y hora de expiración del token.
     */
    private Date expiryTime;
    
    /**
     * Estado actual de la sesión.
     */
    private String status;
    
    /**
     * Indica si la sesión es sospechosa.
     */
    private boolean suspicious;
    
    /**
     * Razón por la que la sesión se considera sospechosa.
     */
    private String suspiciousReason;
    
    /**
     * Fecha y hora de cierre de la sesión.
     */
    private Date logoutTime;
}
