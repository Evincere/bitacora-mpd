package com.bitacora.domain.port.session;

import com.bitacora.domain.model.session.UserSession;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Puerto para la gestión de sesiones de usuario.
 * Define las operaciones que debe implementar un adaptador de sesiones.
 */
public interface UserSessionPort {
    
    /**
     * Guarda una sesión de usuario.
     * 
     * @param session La sesión a guardar
     * @return La sesión guardada
     */
    UserSession saveSession(UserSession session);
    
    /**
     * Busca una sesión por su token.
     * 
     * @param token El token JWT
     * @return La sesión encontrada, o un Optional vacío si no existe
     */
    Optional<UserSession> findByToken(String token);
    
    /**
     * Busca una sesión por su token de refresco.
     * 
     * @param refreshToken El token de refresco
     * @return La sesión encontrada, o un Optional vacío si no existe
     */
    Optional<UserSession> findByRefreshToken(String refreshToken);
    
    /**
     * Busca todas las sesiones activas de un usuario.
     * 
     * @param userId El ID del usuario
     * @return Lista de sesiones activas
     */
    List<UserSession> findActiveSessionsByUserId(Long userId);
    
    /**
     * Busca todas las sesiones de un usuario.
     * 
     * @param userId El ID del usuario
     * @return Lista de sesiones
     */
    List<UserSession> findAllSessionsByUserId(Long userId);
    
    /**
     * Busca una sesión por su ID.
     * 
     * @param sessionId El ID de la sesión
     * @return La sesión encontrada, o un Optional vacío si no existe
     */
    Optional<UserSession> findById(Long sessionId);
    
    /**
     * Busca todas las sesiones sospechosas.
     * 
     * @return Lista de sesiones sospechosas
     */
    List<UserSession> findSuspiciousSessions();
    
    /**
     * Busca todas las sesiones que han expirado pero aún están marcadas como activas.
     * 
     * @param now La fecha y hora actual
     * @return Lista de sesiones expiradas
     */
    List<UserSession> findExpiredSessions(Date now);
    
    /**
     * Busca todas las sesiones inactivas por un período determinado.
     * 
     * @param lastActivityBefore La fecha y hora antes de la cual se considera inactividad
     * @return Lista de sesiones inactivas
     */
    List<UserSession> findInactiveSessions(Date lastActivityBefore);
    
    /**
     * Actualiza el estado de todas las sesiones expiradas.
     * 
     * @param now La fecha y hora actual
     * @return El número de sesiones actualizadas
     */
    int updateExpiredSessions(Date now);
    
    /**
     * Cierra todas las sesiones activas de un usuario excepto la sesión actual.
     * 
     * @param userId El ID del usuario
     * @param currentSessionId El ID de la sesión actual
     * @return El número de sesiones cerradas
     */
    int closeOtherSessions(Long userId, Long currentSessionId);
}
