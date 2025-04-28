package com.bitacora.domain.model.session;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Date;

/**
 * Modelo de dominio para una sesión de usuario.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSession {

    /**
     * Identificador único de la sesión.
     */
    private Long id;

    /**
     * Identificador del usuario al que pertenece la sesión.
     */
    private Long userId;

    /**
     * Token JWT asociado a la sesión.
     */
    private String token;

    /**
     * Token de refresco asociado a la sesión.
     */
    private String refreshToken;

    /**
     * Dirección IP desde la que se inició la sesión.
     */
    private String ipAddress;

    /**
     * User-Agent del navegador o cliente.
     */
    private String userAgent;

    /**
     * Dispositivo desde el que se inició la sesión.
     */
    private String device;

    /**
     * Ubicación geográfica desde la que se inició la sesión.
     */
    private String location;

    /**
     * Fecha y hora de inicio de la sesión.
     */
    private Date loginTime;

    /**
     * Fecha y hora de la última actividad en la sesión.
     */
    private Date lastActivityTime;

    /**
     * Fecha y hora de expiración del token.
     */
    private Date expiryTime;

    /**
     * Estado actual de la sesión.
     */
    @Builder.Default
    private SessionStatus status = SessionStatus.ACTIVE;

    /**
     * Indica si la sesión es sospechosa.
     */
    @Builder.Default
    private boolean suspicious = false;

    /**
     * Razón por la que la sesión se considera sospechosa.
     */
    private String suspiciousReason;

    /**
     * Fecha y hora de cierre de la sesión.
     */
    private Date logoutTime;

    /**
     * Actualiza la hora de la última actividad.
     */
    public void updateLastActivity() {
        this.lastActivityTime = Date.from(Instant.now());
    }

    /**
     * Cierra la sesión.
     */
    public void logout() {
        this.status = SessionStatus.CLOSED;
        this.logoutTime = Date.from(Instant.now());
    }

    /**
     * Marca la sesión como sospechosa.
     *
     * @param reason La razón por la que la sesión se considera sospechosa
     */
    public void markAsSuspicious(final String reason) {
        this.suspicious = true;
        this.suspiciousReason = reason;
    }

    /**
     * Revoca la sesión.
     *
     * @param reason La razón por la que se revoca la sesión
     */
    public void revoke(final String reason) {
        this.status = SessionStatus.REVOKED;
        this.logoutTime = Date.from(Instant.now());
        this.suspiciousReason = reason;
    }

    /**
     * Estados posibles para una sesión.
     */
    public enum SessionStatus {
        /**
         * Sesión activa.
         */
        ACTIVE,

        /**
         * Sesión cerrada por el usuario.
         */
        CLOSED,

        /**
         * Sesión expirada por inactividad.
         */
        EXPIRED,

        /**
         * Sesión revocada por el sistema o un administrador.
         */
        REVOKED
    }
}
