package com.bitacora.application.auth.strategy;

import com.bitacora.infrastructure.rest.dto.auth.JwtResponse;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Interfaz que define la estrategia de autenticación.
 * Implementa el patrón Strategy para permitir diferentes mecanismos de autenticación.
 */
public interface AuthenticationStrategy {
    
    /**
     * Autentica a un usuario utilizando la estrategia específica.
     *
     * @param credentials Las credenciales de autenticación (pueden variar según la estrategia)
     * @param request La solicitud HTTP
     * @return Respuesta con el token JWT y datos del usuario
     */
    JwtResponse authenticate(Object credentials, HttpServletRequest request);
    
    /**
     * Verifica si esta estrategia puede manejar el tipo de credenciales proporcionado.
     *
     * @param credentials Las credenciales a verificar
     * @return true si la estrategia puede manejar estas credenciales, false en caso contrario
     */
    boolean supports(Object credentials);
}
