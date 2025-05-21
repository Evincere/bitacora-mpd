package com.bitacora.infrastructure.security.token;

import com.bitacora.domain.model.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementación de la fábrica de tokens JWT.
 */
@Slf4j
@Component
public class JwtTokenFactory implements TokenFactory {

    @Value("${spring.jwt.secret:${bitacora.jwt.secret:bitacoraSecretKey2023SecureApplicationWithLongSecretKey}}")
    private String secretKey;

    @Value("${spring.jwt.expiration:${bitacora.jwt.expiration:86400000}}")
    private long validityInMilliseconds;

    @Value("${spring.jwt.refresh-expiration:${bitacora.jwt.refresh-expiration:604800000}}")
    private long refreshValidityInMilliseconds;

    private Key key;

    /**
     * Inicializa la clave secreta.
     */
    @PostConstruct
    protected void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Crea un token de acceso para un usuario.
     *
     * @param user        El usuario para el que se crea el token
     * @param authorities Las autoridades del usuario
     * @return El token de acceso
     */
    @Override
    public String createAccessToken(User user, Collection<? extends GrantedAuthority> authorities) {
        return createToken(user, authorities, validityInMilliseconds, false);
    }

    /**
     * Crea un token de refresco para un usuario.
     *
     * @param user        El usuario para el que se crea el token
     * @param authorities Las autoridades del usuario
     * @return El token de refresco
     */
    @Override
    public String createRefreshToken(User user, Collection<? extends GrantedAuthority> authorities) {
        return createToken(user, authorities, refreshValidityInMilliseconds, true);
    }

    /**
     * Crea un token JWT.
     *
     * @param user                   El usuario para el que se crea el token
     * @param authorities            Las autoridades del usuario
     * @param validityInMilliseconds La validez del token en milisegundos
     * @param isRefreshToken         Indica si es un token de refresco
     * @return El token JWT
     */
    private String createToken(User user, Collection<? extends GrantedAuthority> authorities,
            long validityInMilliseconds, boolean isRefreshToken) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        // Convertir autoridades a strings
        Collection<String> authoritiesAsStrings = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Crear claims adicionales
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("authorities", authoritiesAsStrings);
        claims.put("role", user.getRole().name());
        claims.put("isRefreshToken", isRefreshToken);

        // Construir el token
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Valida un token.
     *
     * @param token El token a validar
     * @return true si el token es válido, false en caso contrario
     */
    @Override
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Token JWT inválido: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Obtiene el nombre de usuario de un token.
     *
     * @param token El token
     * @return El nombre de usuario
     */
    @Override
    public String getUsername(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Obtiene el ID de usuario de un token.
     *
     * @param token El token
     * @return El ID de usuario
     */
    @Override
    public Long getUserId(String token) {
        return getClaims(token).get("id", Long.class);
    }

    /**
     * Verifica si un token es un token de refresco.
     *
     * @param token El token
     * @return true si el token es un token de refresco, false en caso contrario
     */
    @Override
    public boolean isRefreshToken(String token) {
        return getClaims(token).get("isRefreshToken", Boolean.class);
    }

    /**
     * Obtiene los claims de un token.
     *
     * @param token El token
     * @return Los claims
     */
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Obtiene la fecha de expiración de un token.
     *
     * @param token El token
     * @return La fecha de expiración
     */
    @Override
    public Date getExpirationDate(String token) {
        return getClaims(token).getExpiration();
    }

    /**
     * Obtiene la clave de firma utilizada para los tokens.
     *
     * @return La clave de firma
     */
    @Override
    public Key getSigningKey() {
        return key;
    }
}
