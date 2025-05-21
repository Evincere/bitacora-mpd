package com.bitacora.infrastructure.security.filter;

import com.bitacora.infrastructure.security.JwtTokenProvider;
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

import java.io.IOException;

/**
 * Manejador para validar tokens JWT.
 * Implementa el patrón Chain of Responsibility.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtValidationHandler extends SecurityFilterHandler {

    private final JwtTokenProvider tokenProvider;

    /**
     * Verifica si este manejador puede procesar la solicitud.
     * Puede manejar solicitudes que contienen un token JWT en el encabezado Authorization.
     *
     * @param request La solicitud HTTP
     * @return true si la solicitud contiene un token JWT, false en caso contrario
     */
    @Override
    protected boolean canHandle(HttpServletRequest request) {
        String token = resolveToken(request);
        return StringUtils.hasText(token);
    }

    /**
     * Procesa la solicitud validando el token JWT.
     * Si el token es válido, establece la autenticación en el contexto de seguridad.
     *
     * @param request La solicitud HTTP
     * @param response La respuesta HTTP
     * @param filterChain La cadena de filtros
     * @throws ServletException Si ocurre un error en el servlet
     * @throws IOException Si ocurre un error de E/S
     */
    @Override
    protected void handle(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String token = resolveToken(request);
        
        try {
            if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
                // Si el token es válido, establecer la autenticación
                Authentication auth = tokenProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.debug("Token JWT válido, autenticación establecida para usuario: {}", 
                        auth.getName());
            } else {
                log.debug("Token JWT inválido");
            }
        } catch (Exception e) {
            log.error("Error al validar token JWT: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }
        
        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }

    /**
     * Extrae el token JWT del encabezado Authorization.
     *
     * @param request La solicitud HTTP
     * @return El token JWT, o null si no existe
     */
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
