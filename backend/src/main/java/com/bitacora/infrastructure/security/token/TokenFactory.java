package com.bitacora.infrastructure.security.token;

import com.bitacora.domain.model.user.User;
import org.springframework.security.core.GrantedAuthority;

import java.security.Key;
import java.util.Collection;
import java.util.Date;

/**
 * Interfaz para la fábrica de tokens.
 * Implementa el patrón Factory para la creación de diferentes tipos de tokens.
 */
public interface TokenFactory {

    /**
     * Crea un token de acceso para un usuario.
     *
     * @param user        El usuario para el que se crea el token
     * @param authorities Las autoridades del usuario
     * @return El token de acceso
     */
    String createAccessToken(User user, Collection<? extends GrantedAuthority> authorities);

    /**
     * Crea un token de refresco para un usuario.
     *
     * @param user        El usuario para el que se crea el token
     * @param authorities Las autoridades del usuario
     * @return El token de refresco
     */
    String createRefreshToken(User user, Collection<? extends GrantedAuthority> authorities);

    /**
     * Valida un token.
     *
     * @param token El token a validar
     * @return true si el token es válido, false en caso contrario
     */
    boolean validateToken(String token);

    /**
     * Obtiene el nombre de usuario de un token.
     *
     * @param token El token
     * @return El nombre de usuario
     */
    String getUsername(String token);

    /**
     * Obtiene el ID de usuario de un token.
     *
     * @param token El token
     * @return El ID de usuario
     */
    Long getUserId(String token);

    /**
     * Verifica si un token es un token de refresco.
     *
     * @param token El token
     * @return true si el token es un token de refresco, false en caso contrario
     */
    boolean isRefreshToken(String token);

    /**
     * Obtiene la fecha de expiración de un token.
     *
     * @param token El token
     * @return La fecha de expiración
     */
    Date getExpirationDate(String token);

    /**
     * Obtiene la clave de firma utilizada para los tokens.
     *
     * @return La clave de firma
     */
    Key getSigningKey();
}
