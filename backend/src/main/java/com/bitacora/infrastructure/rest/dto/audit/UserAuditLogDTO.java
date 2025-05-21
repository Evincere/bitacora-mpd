package com.bitacora.infrastructure.rest.dto.audit;

import com.bitacora.domain.model.audit.AuditActionType;
import com.bitacora.domain.model.audit.AuditResult;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO para el registro de auditoría de usuarios.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAuditLogDTO {
    
    /**
     * Identificador único del registro de auditoría.
     */
    private Long id;
    
    /**
     * Identificador del usuario que realizó la acción.
     */
    private Long userId;
    
    /**
     * Nombre de usuario que realizó la acción.
     */
    private String username;
    
    /**
     * Nombre completo del usuario que realizó la acción.
     */
    private String userFullName;
    
    /**
     * Tipo de acción realizada.
     */
    private AuditActionType actionType;
    
    /**
     * Nombre para mostrar del tipo de acción.
     */
    private String actionTypeDisplay;
    
    /**
     * Entidad sobre la que se realizó la acción.
     */
    private String entityType;
    
    /**
     * Identificador de la entidad sobre la que se realizó la acción.
     */
    private String entityId;
    
    /**
     * Descripción detallada de la acción realizada.
     */
    private String description;
    
    /**
     * Dirección IP desde la que se realizó la acción.
     */
    private String ipAddress;
    
    /**
     * Agente de usuario (navegador) desde el que se realizó la acción.
     */
    private String userAgent;
    
    /**
     * Fecha y hora en que se realizó la acción.
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    /**
     * Resultado de la acción (éxito, error, etc.).
     */
    private AuditResult result;
    
    /**
     * Nombre para mostrar del resultado.
     */
    private String resultDisplay;
    
    /**
     * Detalles adicionales de la acción en formato clave-valor.
     */
    private Map<String, String> details;
    
    /**
     * Valores anteriores de los campos modificados (para acciones de actualización).
     */
    private Map<String, String> oldValues;
    
    /**
     * Nuevos valores de los campos modificados (para acciones de actualización).
     */
    private Map<String, String> newValues;
    
    /**
     * Indica si la acción fue marcada como sospechosa.
     */
    private boolean suspicious;
    
    /**
     * Razón por la que la acción fue marcada como sospechosa.
     */
    private String suspiciousReason;
    
    /**
     * Módulo del sistema donde se realizó la acción.
     */
    private String module;
    
    /**
     * Identificador de la sesión del usuario.
     */
    private String sessionId;
}
