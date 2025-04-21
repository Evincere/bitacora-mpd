package com.bitacora.infrastructure.persistence.adapter;

import com.bitacora.domain.model.session.UserSession;
import com.bitacora.domain.model.session.UserSession.SessionStatus;
import com.bitacora.domain.port.session.UserSessionPort;
import com.bitacora.infrastructure.persistence.entity.UserSessionEntity;
import com.bitacora.infrastructure.persistence.mapper.UserSessionMapper;
import com.bitacora.infrastructure.persistence.repository.UserSessionJpaRepository;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adaptador para la persistencia de sesiones de usuario.
 * Implementa el puerto UserSessionPort utilizando JPA.
 */
@Component
@RequiredArgsConstructor
public class UserSessionAdapter implements UserSessionPort {

    private final UserSessionJpaRepository repository;
    private final UserSessionMapper mapper;
    
    @Override
    @Transactional
    public UserSession saveSession(UserSession session) {
        UserSessionEntity entity = mapper.toEntity(session);
        UserSessionEntity savedEntity = repository.save(entity);
        return mapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<UserSession> findByToken(String token) {
        return repository.findByToken(token)
                .map(mapper::toDomain);
    }
    
    @Override
    public Optional<UserSession> findByRefreshToken(String refreshToken) {
        return repository.findByRefreshToken(refreshToken)
                .map(mapper::toDomain);
    }
    
    @Override
    public List<UserSession> findActiveSessionsByUserId(Long userId) {
        return repository.findByUserIdAndStatus(userId, SessionStatus.ACTIVE)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserSession> findAllSessionsByUserId(Long userId) {
        return repository.findByUserId(userId)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<UserSession> findById(Long sessionId) {
        return repository.findById(sessionId)
                .map(mapper::toDomain);
    }
    
    @Override
    public List<UserSession> findSuspiciousSessions() {
        return repository.findBySuspiciousTrue()
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserSession> findExpiredSessions(Date now) {
        return repository.findByStatusAndExpiryTimeBefore(SessionStatus.ACTIVE, now)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<UserSession> findInactiveSessions(Date lastActivityBefore) {
        return repository.findByStatusAndLastActivityTimeBefore(SessionStatus.ACTIVE, lastActivityBefore)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public int updateExpiredSessions(Date now) {
        return repository.updateExpiredSessions(SessionStatus.EXPIRED, now);
    }
    
    @Override
    @Transactional
    public int closeOtherSessions(Long userId, Long currentSessionId) {
        return repository.closeOtherSessions(
                userId, currentSessionId, SessionStatus.CLOSED, new Date());
    }
}
