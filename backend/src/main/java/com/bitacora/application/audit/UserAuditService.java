package com.bitacora.application.audit;

import com.bitacora.domain.model.audit.AuditActionType;
import com.bitacora.domain.model.audit.AuditResult;
import com.bitacora.domain.model.audit.UserAuditLog;
import com.bitacora.domain.port.repository.UserAuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio de aplicación para la gestión de auditoría de usuarios.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserAuditService {

    private final UserAuditLogRepository auditLogRepository;

    /**
     * Registra una acción de usuario en el sistema de auditoría.
     *
     * @param userId       ID del usuario
     * @param username     Nombre de usuario
     * @param userFullName Nombre completo del usuario
     * @param actionType   Tipo de acción
     * @param entityType   Tipo de entidad
     * @param entityId     ID de la entidad
     * @param description  Descripción de la acción
     * @param ipAddress    Dirección IP
     * @param userAgent    Agente de usuario
     * @param result       Resultado de la acción
     * @param details      Detalles adicionales
     * @param module       Módulo del sistema
     * @param sessionId    ID de sesión
     * @return Registro de auditoría creado
     */
    @Async
    @Transactional
    public UserAuditLog logUserAction(
            Long userId,
            String username,
            String userFullName,
            AuditActionType actionType,
            String entityType,
            String entityId,
            String description,
            String ipAddress,
            String userAgent,
            AuditResult result,
            Map<String, String> details,
            String module,
            String sessionId) {

        UserAuditLog auditLog = UserAuditLog.builder()
                .userId(userId)
                .username(username)
                .userFullName(userFullName)
                .actionType(actionType)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .timestamp(LocalDateTime.now())
                .result(result)
                .details(details != null ? details : new HashMap<>())
                .suspicious(false)
                .module(module)
                .sessionId(sessionId)
                .build();

        log.debug("Registrando acción de usuario: {} - {} - {}", username, actionType, entityType);
        return auditLogRepository.save(auditLog);
    }

    /**
     * Registra una acción de cambio de datos en el sistema de auditoría.
     *
     * @param userId       ID del usuario
     * @param username     Nombre de usuario
     * @param userFullName Nombre completo del usuario
     * @param actionType   Tipo de acción
     * @param entityType   Tipo de entidad
     * @param entityId     ID de la entidad
     * @param description  Descripción de la acción
     * @param ipAddress    Dirección IP
     * @param userAgent    Agente de usuario
     * @param oldValues    Valores anteriores
     * @param newValues    Nuevos valores
     * @param result       Resultado de la acción
     * @param details      Detalles adicionales
     * @param module       Módulo del sistema
     * @param sessionId    ID de sesión
     * @return Registro de auditoría creado
     */
    @Async
    @Transactional
    public UserAuditLog logDataChange(
            Long userId,
            String username,
            String userFullName,
            AuditActionType actionType,
            String entityType,
            String entityId,
            String description,
            String ipAddress,
            String userAgent,
            Map<String, String> oldValues,
            Map<String, String> newValues,
            AuditResult result,
            Map<String, String> details,
            String module,
            String sessionId) {

        UserAuditLog auditLog = UserAuditLog.builder()
                .userId(userId)
                .username(username)
                .userFullName(userFullName)
                .actionType(actionType)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .timestamp(LocalDateTime.now())
                .result(result)
                .oldValues(oldValues != null ? oldValues : new HashMap<>())
                .newValues(newValues != null ? newValues : new HashMap<>())
                .details(details != null ? details : new HashMap<>())
                .suspicious(false)
                .module(module)
                .sessionId(sessionId)
                .build();

        log.debug("Registrando cambio de datos: {} - {} - {}", username, actionType, entityType);
        return auditLogRepository.save(auditLog);
    }

    /**
     * Marca un registro de auditoría como sospechoso.
     *
     * @param auditLogId ID del registro de auditoría
     * @param reason     Razón por la que se marca como sospechoso
     * @return Registro de auditoría actualizado
     */
    @Transactional
    public Optional<UserAuditLog> markAsSuspicious(Long auditLogId, String reason) {
        Optional<UserAuditLog> auditLogOpt = auditLogRepository.findById(auditLogId);

        return auditLogOpt.map(auditLog -> {
            auditLog.setSuspicious(true);
            auditLog.setSuspiciousReason(reason);
            return auditLogRepository.save(auditLog);
        });
    }

    /**
     * Busca registros de auditoría con filtros combinados.
     *
     * @param userId     ID del usuario (opcional)
     * @param username   Nombre de usuario (opcional)
     * @param actionType Tipo de acción (opcional)
     * @param entityType Tipo de entidad (opcional)
     * @param entityId   ID de la entidad (opcional)
     * @param result     Resultado de la acción (opcional)
     * @param startDate  Fecha de inicio (opcional)
     * @param endDate    Fecha de fin (opcional)
     * @param suspicious Indica si buscar registros sospechosos (opcional)
     * @param module     Módulo del sistema (opcional)
     * @param page       Número de página (0-based)
     * @param size       Tamaño de página
     * @return Lista de registros de auditoría que cumplen con los filtros
     */
    @Transactional(readOnly = true)
    public List<UserAuditLog> searchAuditLogs(
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
            int size) {

        return auditLogRepository.findByFilters(
                userId, username, actionType, entityType, entityId,
                result, startDate, endDate, suspicious, module, page, size);
    }

    /**
     * Cuenta el número total de registros de auditoría que cumplen con los filtros.
     *
     * @param userId     ID del usuario (opcional)
     * @param username   Nombre de usuario (opcional)
     * @param actionType Tipo de acción (opcional)
     * @param entityType Tipo de entidad (opcional)
     * @param entityId   ID de la entidad (opcional)
     * @param result     Resultado de la acción (opcional)
     * @param startDate  Fecha de inicio (opcional)
     * @param endDate    Fecha de fin (opcional)
     * @param suspicious Indica si contar registros sospechosos (opcional)
     * @param module     Módulo del sistema (opcional)
     * @return Número total de registros que cumplen con los filtros
     */
    @Transactional(readOnly = true)
    public long countAuditLogs(
            Long userId,
            String username,
            AuditActionType actionType,
            String entityType,
            String entityId,
            AuditResult result,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Boolean suspicious,
            String module) {

        return auditLogRepository.countByFilters(
                userId, username, actionType, entityType, entityId,
                result, startDate, endDate, suspicious, module);
    }

    /**
     * Tarea programada para limpiar registros de auditoría antiguos.
     * Se ejecuta una vez al día a las 2:00 AM.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanupOldAuditLogs() {
        // Por defecto, mantener registros de los últimos 90 días
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(90);
        int deletedCount = auditLogRepository.deleteByTimestampBefore(cutoffDate);

        if (deletedCount > 0) {
            log.info("Se eliminaron {} registros de auditoría antiguos", deletedCount);
        }
    }
}
