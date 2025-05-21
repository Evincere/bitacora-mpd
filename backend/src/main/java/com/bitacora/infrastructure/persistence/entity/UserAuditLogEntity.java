package com.bitacora.infrastructure.persistence.entity;

import com.bitacora.domain.model.audit.AuditActionType;
import com.bitacora.domain.model.audit.AuditResult;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad JPA para el registro de auditoría de usuarios.
 */
@Entity
@Table(name = "user_audit_log")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAuditLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "user_full_name")
    private String userFullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private AuditActionType actionType;

    @Column(name = "entity_type")
    private String entityType;

    @Column(name = "entity_id")
    private String entityId;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    @Column(name = "result")
    private AuditResult result;

    @Column(name = "details", length = 4000)
    private String detailsJson;

    @Column(name = "old_values", length = 4000)
    private String oldValuesJson;

    @Column(name = "new_values", length = 4000)
    private String newValuesJson;

    @Column(name = "suspicious")
    private boolean suspicious;

    @Column(name = "suspicious_reason", length = 500)
    private String suspiciousReason;

    @Column(name = "module")
    private String module;

    @Column(name = "session_id")
    private String sessionId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
