package com.bitacora.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro de autenticación JWT para validar tokens en las solicitudes.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /**
     * Longitud del prefijo "Bearer " en el token JWT.
     */
    private static final int BEARER_PREFIX_LENGTH = 7;

    private final JwtTokenProvider tokenProvider;
    private final TokenBlacklistService tokenBlacklistService;

    /**
     * Filtra las solicitudes para validar tokens JWT.
     *
     * @param request     La solicitud HTTP
     * @param response    La respuesta HTTP
     * @param filterChain La cadena de filtros
     * @throws ServletException Si ocurre un error en el servlet
     * @throws IOException      Si ocurre un error de E/S
     */
    @Override
    protected void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response,
            final FilterChain filterChain)
            throws ServletException, IOException {

        // No aplicar el filtro a las rutas de autenticación
        String path = request.getRequestURI();
        log.debug("URI de la solicitud: {}", path);

        if (path.startsWith("/api/auth/") || path.equals("/api/auth") || path.startsWith("/auth/")
                || path.equals("/auth")) {
            log.debug("Omitiendo filtro JWT para ruta de autenticación: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                // Verificar si el token está en la lista negra
                if (tokenBlacklistService.isBlacklisted(jwt)) {
                    log.debug("Token JWT en lista negra: {}", jwt);
                    // No establecer la autenticación si el token está en la lista negra
                } else if (tokenProvider.validateToken(jwt)) {
                    Authentication authentication = tokenProvider.getAuthentication(jwt);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (final Exception ex) {
            log.error("No se pudo establecer la autenticación del usuario en el contexto de seguridad", ex);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Obtiene el token JWT de la solicitud.
     *
     * @param request La solicitud HTTP
     * @return El token JWT o null si no existe
     */
    private String getJwtFromRequest(final HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(BEARER_PREFIX_LENGTH);
        }
        return null;
    }
}
