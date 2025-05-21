package com.bitacora.infrastructure.security;

import com.bitacora.domain.model.user.User;
import com.bitacora.infrastructure.security.token.TokenFactory;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Proveedor de tokens JWT para autenticación y autorización.
 * Utiliza el patrón Factory para la creación de tokens.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final TokenFactory tokenFactory;

    /**
     * Crea un token JWT para un usuario.
     *
     * @param user        El usuario
     * @param authorities Las autoridades del usuario
     * @return El token JWT
     */
    public String createToken(User user, Collection<? extends GrantedAuthority> authorities) {
        return tokenFactory.createAccessToken(user, authorities);
    }

    /**
     * Crea un token de refresco JWT para un usuario.
     *
     * @param user        El usuario
     * @param authorities Las autoridades del usuario
     * @return El token de refresco JWT
     */
    public String createRefreshToken(User user, Collection<? extends GrantedAuthority> authorities) {
        return tokenFactory.createRefreshToken(user, authorities);
    }

    /**
     * Obtiene la autenticación a partir de un token JWT.
     *
     * @param token El token JWT
     * @return La autenticación
     */
    public Authentication getAuthentication(String token) {
        // Validar el token
        if (!validateToken(token)) {
            throw new JwtException("Token inválido");
        }

        // Obtener información del token
        String username = getUsername(token);
        Long userId = getUserId(token);

        // Obtener claims del token para extraer autoridades
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(tokenFactory.getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        @SuppressWarnings("unchecked")
        List<String> authorities = claims.get("authorities", List.class);

        // Convertir autoridades a objetos SimpleGrantedAuthority
        List<SimpleGrantedAuthority> grantedAuthorities = authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // Crear principal y autenticación
        UserPrincipal principal = new UserPrincipal(userId, username, "", grantedAuthorities);
        return new UsernamePasswordAuthenticationToken(principal, "", grantedAuthorities);
    }

    /**
     * Valida un token JWT.
     *
     * @param token El token JWT
     * @return true si el token es válido, false en caso contrario
     */
    public boolean validateToken(String token) {
        return tokenFactory.validateToken(token);
    }

    /**
     * Verifica si un token es un token de refresco.
     *
     * @param token El token JWT
     * @return true si el token es un token de refresco, false en caso contrario
     */
    public boolean isRefreshToken(String token) {
        return tokenFactory.isRefreshToken(token);
    }

    /**
     * Obtiene el nombre de usuario a partir de un token JWT.
     *
     * @param token El token JWT
     * @return El nombre de usuario
     */
    public String getUsername(String token) {
        return tokenFactory.getUsername(token);
    }

    /**
     * Obtiene el ID de usuario a partir de un token JWT.
     *
     * @param token El token JWT
     * @return El ID de usuario
     */
    public Long getUserId(String token) {
        return tokenFactory.getUserId(token);
    }

    /**
     * Obtiene la fecha de expiración a partir de un token JWT.
     *
     * @param token El token JWT
     * @return La fecha de expiración
     */
    public Date getExpirationDateFromToken(String token) {
        return tokenFactory.getExpirationDate(token);
    }

    /**
     * Obtiene el ID de usuario a partir de un token JWT.
     * Este método es un alias de getUserId para mantener compatibilidad con código
     * existente.
     *
     * @param token El token JWT
     * @return El ID de usuario
     */
    public Long getUserIdFromToken(String token) {
        return getUserId(token);
    }

    /**
     * Obtiene el ID de usuario a partir de un nombre de usuario.
     * Este método busca el usuario en el contexto de seguridad actual y devuelve su
     * ID.
     *
     * @param username El nombre de usuario
     * @return El ID de usuario
     */
    public Long getUserIdFromUsername(String username) {
        // Obtener la autenticación actual del contexto de seguridad
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        // Verificar si hay una autenticación válida y si el principal es un
        // UserPrincipal
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

            // Verificar si el nombre de usuario coincide
            if (principal.getUsername().equals(username)) {
                return principal.getId();
            }
        }

        // Si no se encuentra el usuario, lanzar una excepción
        throw new IllegalStateException("No se pudo obtener el ID de usuario para: " + username);
    }
}
