package com.bitacora.infrastructure.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * Manejador para verificar permisos específicos para ciertas rutas.
 * Implementa el patrón Chain of Responsibility.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PermissionsHandler extends SecurityFilterHandler {

    /**
     * Verifica si este manejador puede procesar la solicitud.
     * Puede manejar solicitudes autenticadas que acceden a rutas protegidas.
     *
     * @param request La solicitud HTTP
     * @return true si la solicitud está autenticada y accede a una ruta protegida, false en caso contrario
     */
    @Override
    protected boolean canHandle(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() && isProtectedRoute(request.getRequestURI());
    }

    /**
     * Procesa la solicitud verificando si el usuario tiene los permisos necesarios.
     * Si el usuario no tiene los permisos necesarios, devuelve un error 403.
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
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String requestUri = request.getRequestURI();
        
        // Verificar si el usuario tiene los permisos necesarios para acceder a la ruta
        if (!hasRequiredPermissions(authentication, requestUri)) {
            log.debug("Acceso denegado a {}: permisos insuficientes", requestUri);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Permisos insuficientes para acceder a este recurso");
            return;
        }
        
        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }

    /**
     * Verifica si una ruta está protegida y requiere permisos específicos.
     *
     * @param uri La URI de la solicitud
     * @return true si la ruta está protegida, false en caso contrario
     */
    private boolean isProtectedRoute(String uri) {
        // Ejemplos de rutas protegidas que requieren permisos específicos
        return uri.contains("/api/admin/") || 
               uri.contains("/api/task-requests/assign") ||
               uri.contains("/api/task-requests/reject") ||
               uri.contains("/api/activities/stats");
    }

    /**
     * Verifica si el usuario tiene los permisos necesarios para acceder a una ruta.
     *
     * @param authentication La autenticación del usuario
     * @param uri La URI de la solicitud
     * @return true si el usuario tiene los permisos necesarios, false en caso contrario
     */
    private boolean hasRequiredPermissions(Authentication authentication, String uri) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        // Obtener las autoridades del usuario
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Set<String> userPermissions = new HashSet<>();
        for (GrantedAuthority authority : authorities) {
            userPermissions.add(authority.getAuthority());
        }
        
        // Verificar permisos según la ruta
        if (uri.contains("/api/admin/")) {
            return userPermissions.contains("ROLE_ADMIN");
        } else if (uri.contains("/api/task-requests/assign") || uri.contains("/api/task-requests/reject")) {
            return userPermissions.contains("ROLE_ASIGNADOR") || userPermissions.contains("ROLE_ADMIN");
        } else if (uri.contains("/api/activities/stats")) {
            return userPermissions.contains("ROLE_ADMIN") || userPermissions.contains("ROLE_ASIGNADOR");
        }
        
        // Por defecto, permitir el acceso
        return true;
    }
}
