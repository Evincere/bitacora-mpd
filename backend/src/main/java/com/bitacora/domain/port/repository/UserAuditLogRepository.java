package com.bitacora.domain.port.repository;

import com.bitacora.domain.model.audit.AuditActionType;
import com.bitacora.domain.model.audit.AuditResult;
import com.bitacora.domain.model.audit.UserAuditLog;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Puerto de repositorio para la gestión de registros de auditoría de usuarios.
 */
public interface UserAuditLogRepository {
    
    /**
     * Guarda un registro de auditoría.
     * 
     * @param auditLog Registro de auditoría a guardar
     * @return Registro de auditoría guardado
     */
    UserAuditLog save(UserAuditLog auditLog);
    
    /**
     * Busca un registro de auditoría por su ID.
     * 
     * @param id ID del registro de auditoría
     * @return Registro de auditoría encontrado o vacío si no existe
     */
    Optional<UserAuditLog> findById(Long id);
    
    /**
     * Busca registros de auditoría por ID de usuario.
     * 
     * @param userId ID del usuario
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de auditoría
     */
    List<UserAuditLog> findByUserId(Long userId, int page, int size);
    
    /**
     * Busca registros de auditoría por nombre de usuario.
     * 
     * @param username Nombre de usuario
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de auditoría
     */
    List<UserAuditLog> findByUsername(String username, int page, int size);
    
    /**
     * Busca registros de auditoría por tipo de acción.
     * 
     * @param actionType Tipo de acción
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de auditoría
     */
    List<UserAuditLog> findByActionType(AuditActionType actionType, int page, int size);
    
    /**
     * Busca registros de auditoría por tipo de entidad.
     * 
     * @param entityType Tipo de entidad
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de auditoría
     */
    List<UserAuditLog> findByEntityType(String entityType, int page, int size);
    
    /**
     * Busca registros de auditoría por ID de entidad.
     * 
     * @param entityId ID de la entidad
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de auditoría
     */
    List<UserAuditLog> findByEntityId(String entityId, int page, int size);
    
    /**
     * Busca registros de auditoría por resultado.
     * 
     * @param result Resultado de la acción
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de auditoría
     */
    List<UserAuditLog> findByResult(AuditResult result, int page, int size);
    
    /**
     * Busca registros de auditoría por rango de fechas.
     * 
     * @param startDate Fecha de inicio
     * @param endDate Fecha de fin
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de auditoría
     */
    List<UserAuditLog> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate, int page, int size);
    
    /**
     * Busca registros de auditoría marcados como sospechosos.
     * 
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de auditoría sospechosos
     */
    List<UserAuditLog> findBySuspicious(boolean suspicious, int page, int size);
    
    /**
     * Busca registros de auditoría con filtros combinados.
     * 
     * @param userId ID del usuario (opcional)
     * @param username Nombre de usuario (opcional)
     * @param actionType Tipo de acción (opcional)
     * @param entityType Tipo de entidad (opcional)
     * @param entityId ID de la entidad (opcional)
     * @param result Resultado de la acción (opcional)
     * @param startDate Fecha de inicio (opcional)
     * @param endDate Fecha de fin (opcional)
     * @param suspicious Indica si buscar registros sospechosos (opcional)
     * @param module Módulo del sistema (opcional)
     * @param page Número de página (0-based)
     * @param size Tamaño de página
     * @return Lista de registros de auditoría que cumplen con los filtros
     */
    List<UserAuditLog> findByFilters(
            Long userId,
            String username,
            AuditActionType actionType,
            String entityType,
            String entityId,
            AuditResult result,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Boolean suspicious,
            String module,
            int page,
            int size);
    
    /**
     * Cuenta el número total de registros de auditoría que cumplen con los filtros.
     * 
     * @param userId ID del usuario (opcional)
     * @param username Nombre de usuario (opcional)
     * @param actionType Tipo de acción (opcional)
     * @param entityType Tipo de entidad (opcional)
     * @param entityId ID de la entidad (opcional)
     * @param result Resultado de la acción (opcional)
     * @param startDate Fecha de inicio (opcional)
     * @param endDate Fecha de fin (opcional)
     * @param suspicious Indica si contar registros sospechosos (opcional)
     * @param module Módulo del sistema (opcional)
     * @return Número total de registros que cumplen con los filtros
     */
    long countByFilters(
            Long userId,
            String username,
            AuditActionType actionType,
            String entityType,
            String entityId,
            AuditResult result,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Boolean suspicious,
            String module);
    
    /**
     * Elimina registros de auditoría anteriores a una fecha determinada.
     * 
     * @param date Fecha límite
     * @return Número de registros eliminados
     */
    int deleteByTimestampBefore(LocalDateTime date);
}
