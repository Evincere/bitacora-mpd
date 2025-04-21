package com.bitacora.infrastructure.persistence.mapper;

import com.bitacora.domain.model.session.UserSession;
import com.bitacora.infrastructure.persistence.entity.UserSessionEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre el modelo de dominio UserSession y la entidad JPA UserSessionEntity.
 */
@Component
public class UserSessionMapper {
    
    /**
     * Convierte una entidad JPA a un modelo de dominio.
     * 
     * @param entity La entidad JPA
     * @return El modelo de dominio
     */
    public UserSession toDomain(UserSessionEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return UserSession.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .token(entity.getToken())
                .refreshToken(entity.getRefreshToken())
                .ipAddress(entity.getIpAddress())
                .userAgent(entity.getUserAgent())
                .device(entity.getDevice())
                .location(entity.getLocation())
                .loginTime(entity.getLoginTime())
                .lastActivityTime(entity.getLastActivityTime())
                .expiryTime(entity.getExpiryTime())
                .status(entity.getStatus())
                .suspicious(entity.isSuspicious())
                .suspiciousReason(entity.getSuspiciousReason())
                .logoutTime(entity.getLogoutTime())
                .build();
    }
    
    /**
     * Convierte un modelo de dominio a una entidad JPA.
     * 
     * @param domain El modelo de dominio
     * @return La entidad JPA
     */
    public UserSessionEntity toEntity(UserSession domain) {
        if (domain == null) {
            return null;
        }
        
        return UserSessionEntity.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .token(domain.getToken())
                .refreshToken(domain.getRefreshToken())
                .ipAddress(domain.getIpAddress())
                .userAgent(domain.getUserAgent())
                .device(domain.getDevice())
                .location(domain.getLocation())
                .loginTime(domain.getLoginTime())
                .lastActivityTime(domain.getLastActivityTime())
                .expiryTime(domain.getExpiryTime())
                .status(domain.getStatus())
                .suspicious(domain.isSuspicious())
                .suspiciousReason(domain.getSuspiciousReason())
                .logoutTime(domain.getLogoutTime())
                .build();
    }
}
