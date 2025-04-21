package com.bitacora.infrastructure.persistence.entity;

import com.bitacora.domain.model.session.UserSession.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import java.util.Date;

/**
 * Entidad JPA que representa una sesión de usuario en la base de datos.
 */
@Entity
@Table(name = "user_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSessionEntity {
    
    /**
     * Identificador único de la sesión.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Identificador del usuario al que pertenece la sesión.
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    /**
     * Token JWT asociado a la sesión.
     */
    @Column(name = "token", length = 2000)
    private String token;
    
    /**
     * Token de refresco asociado a la sesión.
     */
    @Column(name = "refresh_token", length = 2000)
    private String refreshToken;
    
    /**
     * Dirección IP desde la que se inició la sesión.
     */
    @Column(name = "ip_address")
    private String ipAddress;
    
    /**
     * User-Agent del navegador o cliente.
     */
    @Column(name = "user_agent", length = 500)
    private String userAgent;
    
    /**
     * Dispositivo desde el que se inició la sesión.
     */
    @Column(name = "device")
    private String device;
    
    /**
     * Ubicación geográfica desde la que se inició la sesión.
     */
    @Column(name = "location")
    private String location;
    
    /**
     * Fecha y hora de inicio de la sesión.
     */
    @Column(name = "login_time", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date loginTime;
    
    /**
     * Fecha y hora de la última actividad en la sesión.
     */
    @Column(name = "last_activity_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastActivityTime;
    
    /**
     * Fecha y hora de expiración del token.
     */
    @Column(name = "expiry_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiryTime;
    
    /**
     * Estado actual de la sesión.
     */
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private SessionStatus status;
    
    /**
     * Indica si la sesión es sospechosa.
     */
    @Column(name = "is_suspicious")
    private boolean suspicious;
    
    /**
     * Razón por la que la sesión se considera sospechosa.
     */
    @Column(name = "suspicious_reason")
    private String suspiciousReason;
    
    /**
     * Fecha y hora de cierre de la sesión.
     */
    @Column(name = "logout_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date logoutTime;
}
