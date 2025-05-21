package com.bitacora.infrastructure.security.filter;

import com.bitacora.application.session.UserSessionService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;

/**
 * Manejador para verificar si un token está en la lista negra.
 * Implementa el patrón Chain of Responsibility.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class BlacklistCheckHandler extends SecurityFilterHandler {

    private final UserSessionService sessionService;

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
     * Procesa la solicitud verificando si el token está en la lista negra.
     * Si el token está en la lista negra, limpia el contexto de seguridad.
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
            if (StringUtils.hasText(token) && sessionService.isTokenBlacklisted(token)) {
                // Si el token está en la lista negra, limpiar el contexto de seguridad
                log.debug("Token en lista negra, acceso denegado");
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token inválido o revocado");
                return;
            }
        } catch (Exception e) {
            log.error("Error al verificar token en lista negra: {}", e.getMessage());
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
