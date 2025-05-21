package com.bitacora.infrastructure.rest.mapper;

import com.bitacora.domain.model.audit.UserAuditLog;
import com.bitacora.infrastructure.rest.dto.audit.UserAuditLogDTO;
import org.springframework.stereotype.Component;

/**
 * Mapeador para convertir entre el modelo de dominio y el DTO de auditoría de usuarios.
 */
@Component
public class UserAuditLogDTOMapper {
    
    /**
     * Convierte un modelo de dominio a un DTO.
     * 
     * @param domain Modelo de dominio
     * @return DTO
     */
    public UserAuditLogDTO toDTO(UserAuditLog domain) {
        if (domain == null) {
            return null;
        }
        
        return UserAuditLogDTO.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .username(domain.getUsername())
                .userFullName(domain.getUserFullName())
                .actionType(domain.getActionType())
                .actionTypeDisplay(domain.getActionType() != null ? domain.getActionType().getDisplayName() : null)
                .entityType(domain.getEntityType())
                .entityId(domain.getEntityId())
                .description(domain.getDescription())
                .ipAddress(domain.getIpAddress())
                .userAgent(domain.getUserAgent())
                .timestamp(domain.getTimestamp())
                .result(domain.getResult())
                .resultDisplay(domain.getResult() != null ? domain.getResult().getDisplayName() : null)
                .details(domain.getDetails())
                .oldValues(domain.getOldValues())
                .newValues(domain.getNewValues())
                .suspicious(domain.isSuspicious())
                .suspiciousReason(domain.getSuspiciousReason())
                .module(domain.getModule())
                .sessionId(domain.getSessionId())
                .build();
    }
}
