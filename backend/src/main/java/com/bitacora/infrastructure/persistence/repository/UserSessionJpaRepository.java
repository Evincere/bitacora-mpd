package com.bitacora.infrastructure.persistence.repository;

import com.bitacora.domain.model.session.UserSession.SessionStatus;
import com.bitacora.infrastructure.persistence.entity.UserSessionEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad UserSessionEntity.
 */
@Repository
public interface UserSessionJpaRepository extends JpaRepository<UserSessionEntity, Long> {
    
    /**
     * Busca una sesión por su token.
     * 
     * @param token El token JWT
     * @return La sesión encontrada, o un Optional vacío si no existe
     */
    Optional<UserSessionEntity> findByToken(String token);
    
    /**
     * Busca una sesión por su token de refresco.
     * 
     * @param refreshToken El token de refresco
     * @return La sesión encontrada, o un Optional vacío si no existe
     */
    Optional<UserSessionEntity> findByRefreshToken(String refreshToken);
    
    /**
     * Busca todas las sesiones activas de un usuario.
     * 
     * @param userId El ID del usuario
     * @param status El estado de las sesiones
     * @return Lista de sesiones activas
     */
    List<UserSessionEntity> findByUserIdAndStatus(Long userId, SessionStatus status);
    
    /**
     * Busca todas las sesiones de un usuario.
     * 
     * @param userId El ID del usuario
     * @return Lista de sesiones
     */
    List<UserSessionEntity> findByUserId(Long userId);
    
    /**
     * Busca todas las sesiones sospechosas.
     * 
     * @return Lista de sesiones sospechosas
     */
    List<UserSessionEntity> findBySuspiciousTrue();
    
    /**
     * Busca todas las sesiones que han expirado pero aún están marcadas como activas.
     * 
     * @param status El estado de las sesiones
     * @param now La fecha y hora actual
     * @return Lista de sesiones expiradas
     */
    List<UserSessionEntity> findByStatusAndExpiryTimeBefore(SessionStatus status, Date now);
    
    /**
     * Busca todas las sesiones inactivas por un período determinado.
     * 
     * @param status El estado de las sesiones
     * @param lastActivityBefore La fecha y hora antes de la cual se considera inactividad
     * @return Lista de sesiones inactivas
     */
    List<UserSessionEntity> findByStatusAndLastActivityTimeBefore(SessionStatus status, Date lastActivityBefore);
    
    /**
     * Actualiza el estado de todas las sesiones expiradas.
     * 
     * @param newStatus El nuevo estado
     * @param now La fecha y hora actual
     * @return El número de sesiones actualizadas
     */
    @Modifying
    @Query("UPDATE UserSessionEntity s SET s.status = :newStatus WHERE s.status = 'ACTIVE' AND s.expiryTime < :now")
    int updateExpiredSessions(@Param("newStatus") SessionStatus newStatus, @Param("now") Date now);
    
    /**
     * Cierra todas las sesiones activas de un usuario excepto la sesión actual.
     * 
     * @param userId El ID del usuario
     * @param currentSessionId El ID de la sesión actual
     * @param newStatus El nuevo estado
     * @param logoutTime La fecha y hora de cierre
     * @return El número de sesiones actualizadas
     */
    @Modifying
    @Query("UPDATE UserSessionEntity s SET s.status = :newStatus, s.logoutTime = :logoutTime " +
           "WHERE s.userId = :userId AND s.id != :currentSessionId AND s.status = 'ACTIVE'")
    int closeOtherSessions(
            @Param("userId") Long userId,
            @Param("currentSessionId") Long currentSessionId,
            @Param("newStatus") SessionStatus newStatus,
            @Param("logoutTime") Date logoutTime);
}
