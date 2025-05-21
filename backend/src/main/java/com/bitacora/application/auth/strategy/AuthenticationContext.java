package com.bitacora.application.auth.strategy;

import com.bitacora.infrastructure.rest.dto.auth.JwtResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Contexto para el patrón Strategy de autenticación.
 * Selecciona la estrategia adecuada según el tipo de credenciales.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AuthenticationContext {

    private final List<AuthenticationStrategy> strategies;

    /**
     * Autentica a un usuario utilizando la estrategia adecuada.
     *
     * @param credentials Las credenciales de autenticación
     * @param request La solicitud HTTP
     * @return Respuesta con el token JWT y datos del usuario
     * @throws IllegalArgumentException Si no se encuentra una estrategia adecuada
     */
    public JwtResponse authenticate(Object credentials, HttpServletRequest request) {
        log.debug("Buscando estrategia de autenticación para credenciales de tipo: {}", credentials.getClass().getSimpleName());
        
        // Buscar la estrategia adecuada
        for (AuthenticationStrategy strategy : strategies) {
            if (strategy.supports(credentials)) {
                log.debug("Utilizando estrategia: {}", strategy.getClass().getSimpleName());
                return strategy.authenticate(credentials, request);
            }
        }
        
        // Si no se encuentra una estrategia adecuada
        throw new IllegalArgumentException("No se encontró una estrategia de autenticación para el tipo de credenciales: " + credentials.getClass().getSimpleName());
    }
}
