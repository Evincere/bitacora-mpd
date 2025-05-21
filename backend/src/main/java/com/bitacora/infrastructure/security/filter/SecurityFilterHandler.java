package com.bitacora.infrastructure.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Clase base abstracta para implementar el patrón Chain of Responsibility en
 * filtros de seguridad.
 * Cada manejador puede procesar una solicitud o pasarla al siguiente manejador
 * en la cadena.
 */
@Slf4j
public abstract class SecurityFilterHandler extends OncePerRequestFilter {

    /**
     * El siguiente manejador en la cadena.
     */
    private SecurityFilterHandler next;

    /**
     * Establece el siguiente manejador en la cadena.
     *
     * @param next El siguiente manejador
     * @return El manejador actual para permitir encadenamiento
     */
    public SecurityFilterHandler setNext(SecurityFilterHandler next) {
        this.next = next;
        return this;
    }

    /**
     * Método principal que implementa la lógica del filtro.
     * Si el manejador actual no puede procesar la solicitud, la pasa al siguiente
     * manejador.
     *
     * @param request     La solicitud HTTP
     * @param response    La respuesta HTTP
     * @param filterChain La cadena de filtros
     * @throws ServletException Si ocurre un error en el servlet
     * @throws IOException      Si ocurre un error de E/S
     */
    @Override
    protected void doFilterInternal(@org.springframework.lang.NonNull HttpServletRequest request,
            @org.springframework.lang.NonNull HttpServletResponse response,
            @org.springframework.lang.NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // Verificar si este manejador puede procesar la solicitud
        if (canHandle(request)) {
            log.debug("Manejando solicitud con {}", this.getClass().getSimpleName());
            handle(request, response, filterChain);
        } else if (next != null) {
            // Pasar la solicitud al siguiente manejador
            log.debug("Pasando solicitud al siguiente manejador: {}", next.getClass().getSimpleName());
            next.doFilter(request, response, filterChain);
        } else {
            // Si no hay más manejadores, continuar con la cadena de filtros
            log.debug("Fin de la cadena de manejadores, continuando con la cadena de filtros");
            filterChain.doFilter(request, response);
        }
    }

    /**
     * Verifica si este manejador puede procesar la solicitud.
     *
     * @param request La solicitud HTTP
     * @return true si este manejador puede procesar la solicitud, false en caso
     *         contrario
     */
    protected abstract boolean canHandle(HttpServletRequest request);

    /**
     * Procesa la solicitud.
     *
     * @param request     La solicitud HTTP
     * @param response    La respuesta HTTP
     * @param filterChain La cadena de filtros
     * @throws ServletException Si ocurre un error en el servlet
     * @throws IOException      Si ocurre un error de E/S
     */
    protected abstract void handle(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException;
}
