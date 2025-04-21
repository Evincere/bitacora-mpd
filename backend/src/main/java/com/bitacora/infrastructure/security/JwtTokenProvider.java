package com.bitacora.infrastructure.security;

import com.bitacora.domain.model.user.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Proveedor de tokens JWT para autenticación y autorización.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${spring.jwt.secret:${jwt.secret:bitacoraSecretKey2023SecureApplicationWithLongSecretKey}}")
    private String secretKey;

    @Value("${spring.jwt.expiration:${jwt.expiration:86400000}}")
    private long validityInMilliseconds;

    @Value("${spring.jwt.refresh-expiration:${jwt.refresh-expiration:604800000}}")
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
     * Crea un token JWT para un usuario.
     *
     * @param user        El usuario
     * @param authorities Las autoridades del usuario
     * @return El token JWT
     */
    public String createToken(User user, Collection<? extends GrantedAuthority> authorities) {
        return createToken(user, authorities, validityInMilliseconds, false);
    }

    /**
     * Crea un token de refresco JWT para un usuario.
     *
     * @param user        El usuario
     * @param authorities Las autoridades del usuario
     * @return El token de refresco JWT
     */
    public String createRefreshToken(User user, Collection<? extends GrantedAuthority> authorities) {
        return createToken(user, authorities, refreshValidityInMilliseconds, true);
    }

    /**
     * Crea un token JWT para un usuario con la validez especificada.
     *
     * @param user           El usuario
     * @param authorities    Las autoridades del usuario
     * @param validityMillis La validez del token en milisegundos
     * @param isRefreshToken Indica si es un token de refresco
     * @return El token JWT
     */
    private String createToken(User user, Collection<? extends GrantedAuthority> authorities,
            long validityMillis, boolean isRefreshToken) {
        Claims claims = Jwts.claims().setSubject(user.getUsername());
        claims.put("id", user.getId());
        claims.put("email", user.getEmail().getValue());
        claims.put("firstName", user.getPersonName().getFirstName());
        claims.put("lastName", user.getPersonName().getLastName());
        claims.put("role", user.getRole().name());
        claims.put("isRefreshToken", isRefreshToken);

        Set<String> authoritiesSet = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
        claims.put("authorities", authoritiesSet);

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityMillis);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Obtiene la autenticación a partir de un token JWT.
     *
     * @param token El token JWT
     * @return La autenticación
     */
    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        String username = claims.getSubject();
        Long id = claims.get("id", Long.class);

        @SuppressWarnings("unchecked")
        List<String> authorities = claims.get("authorities", List.class);

        List<SimpleGrantedAuthority> grantedAuthorities = authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        UserPrincipal principal = new UserPrincipal(id, username, "", grantedAuthorities);

        return new UsernamePasswordAuthenticationToken(principal, "", grantedAuthorities);
    }

    /**
     * Valida un token JWT.
     *
     * @param token El token JWT
     * @return true si el token es válido, false en caso contrario
     */
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
     * Verifica si un token es un token de refresco.
     *
     * @param token El token JWT
     * @return true si el token es un token de refresco, false en caso contrario
     */
    public boolean isRefreshToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return Boolean.TRUE.equals(claims.get("isRefreshToken", Boolean.class));
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Error al verificar si el token es de refresco: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Obtiene el nombre de usuario a partir de un token JWT.
     *
     * @param token El token JWT
     * @return El nombre de usuario
     */
    public String getUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Obtiene la fecha de expiración a partir de un token JWT.
     *
     * @param token El token JWT
     * @return La fecha de expiración
     */
    public Date getExpirationDateFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    /**
     * Obtiene el ID de usuario a partir de un token JWT.
     *
     * @param token El token JWT
     * @return El ID de usuario
     */
    public Long getUserId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("id", Long.class);
    }

    /**
     * Obtiene el ID de usuario a partir de un nombre de usuario.
     * Este método busca el usuario en la base de datos y devuelve su ID.
     *
     * @param username El nombre de usuario
     * @return El ID de usuario
     */
    public Long getUserIdFromUsername(String username) {
        // Implementación temporal: buscar el token actual en el contexto de seguridad
        // y extraer el ID de usuario
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            return principal.getId();
        }
        throw new IllegalStateException("No se pudo obtener el ID de usuario para: " + username);
    }
}
