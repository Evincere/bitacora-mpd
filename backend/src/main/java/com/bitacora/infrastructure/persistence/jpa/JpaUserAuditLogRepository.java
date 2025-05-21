package com.bitacora.infrastructure.persistence.jpa;

import com.bitacora.domain.model.audit.AuditActionType;
import com.bitacora.domain.model.audit.AuditResult;
import com.bitacora.infrastructure.persistence.entity.UserAuditLogEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Interfaz JPA para el repositorio de auditoría de usuarios.
 */
public interface JpaUserAuditLogRepository
                extends JpaRepository<UserAuditLogEntity, Long>, JpaSpecificationExecutor<UserAuditLogEntity> {

        /**
         * Busca registros de auditoría por ID de usuario.
         */
        List<UserAuditLogEntity> findByUserIdOrderByTimestampDesc(Long userId, Pageable pageable);

        /**
         * Busca registros de auditoría por nombre de usuario.
         */
        List<UserAuditLogEntity> findByUsernameOrderByTimestampDesc(String username, Pageable pageable);

        /**
         * Busca registros de auditoría por tipo de acción.
         */
        List<UserAuditLogEntity> findByActionTypeOrderByTimestampDesc(AuditActionType actionType, Pageable pageable);

        /**
         * Busca registros de auditoría por tipo de entidad.
         */
        List<UserAuditLogEntity> findByEntityTypeOrderByTimestampDesc(String entityType, Pageable pageable);

        /**
         * Busca registros de auditoría por ID de entidad.
         */
        List<UserAuditLogEntity> findByEntityIdOrderByTimestampDesc(String entityId, Pageable pageable);

        /**
         * Busca registros de auditoría por resultado.
         */
        List<UserAuditLogEntity> findByResultOrderByTimestampDesc(AuditResult result, Pageable pageable);

        /**
         * Busca registros de auditoría por rango de fechas.
         */
        List<UserAuditLogEntity> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime startDate,
                        LocalDateTime endDate, Pageable pageable);

        /**
         * Busca registros de auditoría marcados como sospechosos.
         */
        List<UserAuditLogEntity> findBySuspiciousOrderByTimestampDesc(boolean suspicious, Pageable pageable);

        /**
         * Busca registros de auditoría por módulo.
         */
        List<UserAuditLogEntity> findByModuleOrderByTimestampDesc(String module, Pageable pageable);

        /**
         * Busca registros de auditoría por ID de sesión.
         */
        List<UserAuditLogEntity> findBySessionIdOrderByTimestampDesc(String sessionId, Pageable pageable);

        /**
         * Elimina registros de auditoría anteriores a una fecha determinada.
         */
        @Modifying
        @Query("DELETE FROM UserAuditLogEntity u WHERE u.timestamp < :date")
        int deleteByTimestampBefore(@Param("date") LocalDateTime date);

        /**
         * Cuenta registros de auditoría por tipo de acción y rango de fechas.
         */
        @Query("SELECT COUNT(u) FROM UserAuditLogEntity u WHERE u.actionType = :actionType AND u.timestamp BETWEEN :startDate AND :endDate")
        long countByActionTypeAndTimestampBetween(
                        @Param("actionType") AuditActionType actionType,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        /**
         * Cuenta registros de auditoría por usuario y rango de fechas.
         */
        @Query("SELECT COUNT(u) FROM UserAuditLogEntity u WHERE u.userId = :userId AND u.timestamp BETWEEN :startDate AND :endDate")
        long countByUserIdAndTimestampBetween(
                        @Param("userId") Long userId,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        /**
         * Cuenta registros de auditoría sospechosos por rango de fechas.
         */
        @Query("SELECT COUNT(u) FROM UserAuditLogEntity u WHERE u.suspicious = true AND u.timestamp BETWEEN :startDate AND :endDate")
        long countSuspiciousByTimestampBetween(
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);
}
