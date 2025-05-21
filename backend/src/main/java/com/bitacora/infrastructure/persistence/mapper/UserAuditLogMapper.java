package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.audit.UserAuditLog;
import com.bitacora.infrastructure.persistence.entity.UserAuditLogEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Mapeador para convertir entre la entidad JPA y el modelo de dominio de auditoría de usuarios.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UserAuditLogMapper {
    
    private final ObjectMapper objectMapper;
    
    /**
     * Convierte una entidad JPA a un modelo de dominio.
     * 
     * @param entity Entidad JPA
     * @return Modelo de dominio
     */
    public UserAuditLog toDomain(UserAuditLogEntity entity) {
        if (entity == null) {
            return null;
        }
        
        Map<String, String> details = parseJson(entity.getDetailsJson());
        Map<String, String> oldValues = parseJson(entity.getOldValuesJson());
        Map<String, String> newValues = parseJson(entity.getNewValuesJson());
        
        return UserAuditLog.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .username(entity.getUsername())
                .userFullName(entity.getUserFullName())
                .actionType(entity.getActionType())
                .entityType(entity.getEntityType())
                .entityId(entity.getEntityId())
                .description(entity.getDescription())
                .ipAddress(entity.getIpAddress())
                .userAgent(entity.getUserAgent())
                .timestamp(entity.getTimestamp())
                .result(entity.getResult())
                .details(details)
                .oldValues(oldValues)
                .newValues(newValues)
                .suspicious(entity.isSuspicious())
                .suspiciousReason(entity.getSuspiciousReason())
                .module(entity.getModule())
                .sessionId(entity.getSessionId())
                .build();
    }
    
    /**
     * Convierte un modelo de dominio a una entidad JPA.
     * 
     * @param domain Modelo de dominio
     * @return Entidad JPA
     */
    public UserAuditLogEntity toEntity(UserAuditLog domain) {
        if (domain == null) {
            return null;
        }
        
        String detailsJson = toJson(domain.getDetails());
        String oldValuesJson = toJson(domain.getOldValues());
        String newValuesJson = toJson(domain.getNewValues());
        
        return UserAuditLogEntity.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .username(domain.getUsername())
                .userFullName(domain.getUserFullName())
                .actionType(domain.getActionType())
                .entityType(domain.getEntityType())
                .entityId(domain.getEntityId())
                .description(domain.getDescription())
                .ipAddress(domain.getIpAddress())
                .userAgent(domain.getUserAgent())
                .timestamp(domain.getTimestamp())
                .result(domain.getResult())
                .detailsJson(detailsJson)
                .oldValuesJson(oldValuesJson)
                .newValuesJson(newValuesJson)
                .suspicious(domain.isSuspicious())
                .suspiciousReason(domain.getSuspiciousReason())
                .module(domain.getModule())
                .sessionId(domain.getSessionId())
                .build();
    }
    
    /**
     * Convierte un mapa a una cadena JSON.
     * 
     * @param map Mapa a convertir
     * @return Cadena JSON
     */
    private String toJson(Map<String, String> map) {
        if (map == null || map.isEmpty()) {
            return null;
        }
        
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            log.error("Error al convertir mapa a JSON", e);
            return "{}";
        }
    }
    
    /**
     * Convierte una cadena JSON a un mapa.
     * 
     * @param json Cadena JSON
     * @return Mapa
     */
    private Map<String, String> parseJson(String json) {
        if (json == null || json.isEmpty()) {
            return new HashMap<>();
        }
        
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
        } catch (JsonProcessingException e) {
            log.error("Error al convertir JSON a mapa", e);
            return new HashMap<>();
        }
    }
}
