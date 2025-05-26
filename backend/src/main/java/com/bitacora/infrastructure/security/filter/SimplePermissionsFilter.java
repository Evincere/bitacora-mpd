package com.bitacora.infrastructure.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * Filtro simplificado para verificar permisos específicos.
 * Este filtro verifica si el usuario tiene los permisos necesarios para acceder
 * a rutas protegidas.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SimplePermissionsFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        String method = request.getMethod();

        // Permitir siempre las solicitudes OPTIONS (CORS preflight)
        if (method.equals("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Permitir siempre las rutas públicas
        if (isPublicRoute(uri)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Verificar si la ruta requiere permisos específicos
        if (isProtectedRoute(uri)) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("No autenticado");
                return;
            }

            // Verificar permisos específicos
            if (!hasRequiredPermissions(authentication, uri, request)) {
                log.warn("Acceso denegado a {}: permisos insuficientes", uri);
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("Permisos insuficientes para acceder a este recurso");
                return;
            }
        }

        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }

    /**
     * Verifica si una ruta es pública y no requiere autenticación.
     *
     * @param uri La URI de la solicitud
     * @return true si la ruta es pública, false en caso contrario
     */
    private boolean isPublicRoute(String uri) {
        return uri.startsWith("/api/auth/") ||
                uri.equals("/api/auth") ||
                uri.startsWith("/auth/") ||
                uri.equals("/auth") ||
                uri.startsWith("/api/api-docs/") ||
                uri.startsWith("/api/swagger-ui/") ||
                uri.equals("/api/swagger-ui.html") ||
                uri.startsWith("/api/actuator/") ||
                uri.startsWith("/api/h2-console/") ||
                uri.startsWith("/h2-console/") ||
                uri.startsWith("/api/ws/") ||
                uri.startsWith("/ws/");
    }

    /**
     * Verifica si una ruta está protegida y requiere permisos específicos.
     *
     * @param uri La URI de la solicitud
     * @return true si la ruta está protegida, false en caso contrario
     */
    private boolean isProtectedRoute(String uri) {
        return uri.contains("/api/admin/") ||
                uri.contains("/api/task-requests/assign") ||
                uri.contains("/api/task-requests/reject") ||
                uri.contains("/api/activities/stats") ||
                uri.contains("/api/users");
    }

    /**
     * Verifica si el usuario tiene los permisos necesarios para acceder a una ruta.
     *
     * @param authentication La autenticación del usuario
     * @param uri            La URI de la solicitud
     * @param request        La solicitud HTTP
     * @return true si el usuario tiene los permisos necesarios, false en caso
     *         contrario
     */
    private boolean hasRequiredPermissions(Authentication authentication, String uri, HttpServletRequest request) {
        // Obtener los permisos del usuario
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
        } else if (uri.contains("/api/users")) {
            String method = request.getMethod();
            boolean isWrite = method.equals("POST") || method.equals("PUT") || method.equals("DELETE");

            boolean hasRead = userPermissions.contains("READ_USERS");
            boolean hasWrite = userPermissions.contains("WRITE_USERS");
            boolean isAdmin = userPermissions.contains("ROLE_ADMIN");
            boolean isAsignador = userPermissions.contains("ROLE_ASIGNADOR");
            boolean isSupervisor = userPermissions.contains("ROLE_SUPERVISOR");

            if (isWrite) {
                return hasWrite || isAdmin; // Solo para escritura
            } else {
                return hasRead || isAdmin || isAsignador || isSupervisor; // Solo lectura
            }
        }

        // Por defecto, permitir el acceso
        return true;
    }
}
