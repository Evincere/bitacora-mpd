package com.bitacora.domain.model.audit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Modelo de dominio para el registro de auditoría de usuarios.
 * Registra las acciones realizadas por los usuarios en el sistema.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAuditLog {
    
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
    private LocalDateTime timestamp;
    
    /**
     * Resultado de la acción (éxito, error, etc.).
     */
    private AuditResult result;
    
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
