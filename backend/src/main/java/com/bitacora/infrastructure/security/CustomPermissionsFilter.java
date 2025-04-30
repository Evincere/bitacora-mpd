package com.bitacora.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Filtro personalizado para procesar encabezados de permisos adicionales.
 * Este filtro permite añadir permisos temporales a la autenticación actual
 * basándose en encabezados HTTP específicos.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CustomPermissionsFilter extends OncePerRequestFilter {

    /**
     * Nombre del encabezado HTTP que contiene los permisos adicionales.
     */
    private static final String PERMISSIONS_HEADER = "X-User-Permissions";

    /**
     * Filtra las solicitudes para añadir permisos adicionales basados en encabezados HTTP.
     *
     * @param request     La solicitud HTTP
     * @param response    La respuesta HTTP
     * @param filterChain La cadena de filtros
     * @throws ServletException Si ocurre un error en el servlet
     * @throws IOException      Si ocurre un error de E/S
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        
        // Verificar si hay una autenticación existente
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            // Obtener el encabezado de permisos
            String permissionsHeader = request.getHeader(PERMISSIONS_HEADER);
            
            if (StringUtils.hasText(permissionsHeader)) {
                log.debug("Procesando encabezado de permisos: {}", permissionsHeader);
                
                // Obtener las autoridades actuales
                Collection<? extends GrantedAuthority> currentAuthorities = authentication.getAuthorities();
                
                // Convertir el encabezado en una lista de permisos
                List<String> additionalPermissions = Arrays.asList(permissionsHeader.split(","));
                
                // Crear nuevas autoridades incluyendo los permisos adicionales
                List<GrantedAuthority> newAuthorities = new ArrayList<>(currentAuthorities);
                
                // Añadir los permisos adicionales como autoridades
                List<SimpleGrantedAuthority> additionalAuthorities = additionalPermissions.stream()
                        .map(String::trim)
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
                
                // Verificar si ya existen las autoridades antes de añadirlas
                for (SimpleGrantedAuthority authority : additionalAuthorities) {
                    if (!newAuthorities.contains(authority)) {
                        newAuthorities.add(authority);
                        log.debug("Añadido permiso temporal: {}", authority.getAuthority());
                    }
                }
                
                // Crear una nueva autenticación con las autoridades actualizadas
                Authentication newAuthentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        authentication.getPrincipal(),
                        authentication.getCredentials(),
                        newAuthorities
                );
                
                // Actualizar el contexto de seguridad
                SecurityContextHolder.getContext().setAuthentication(newAuthentication);
                
                log.debug("Autenticación actualizada con permisos adicionales para el usuario: {}", 
                        ((UserPrincipal) authentication.getPrincipal()).getUsername());
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
