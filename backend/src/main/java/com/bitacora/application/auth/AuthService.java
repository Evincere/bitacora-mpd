package com.bitacora.application.auth;

import com.bitacora.application.auth.strategy.AuthenticationContext;
import com.bitacora.application.session.UserSessionService;
import com.bitacora.infrastructure.rest.dto.auth.JwtResponse;
import com.bitacora.infrastructure.rest.dto.auth.LoginRequest;
import com.bitacora.infrastructure.rest.dto.auth.RefreshTokenRequest;

import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio para la autenticación de usuarios.
 * Implementa los casos de uso relacionados con autenticación.
 * Utiliza el patrón Strategy para soportar diferentes mecanismos de
 * autenticación.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

        private final AuthenticationContext authenticationContext;
        private final UserSessionService sessionService;

        /**
         * Autentica a un usuario y genera un token JWT.
         *
         * @param loginRequest La solicitud de inicio de sesión
         * @param request      La solicitud HTTP
         * @return Respuesta con el token JWT
         */
        public JwtResponse authenticateUser(LoginRequest loginRequest, HttpServletRequest request) {
                log.debug("Autenticando usuario con nombre de usuario y contraseña: {}", loginRequest.getUsername());
                return authenticationContext.authenticate(loginRequest, request);
        }

        /**
         * Cierra la sesión de un usuario.
         *
         * @param token El token JWT
         * @return true si la sesión se cerró correctamente, false en caso contrario
         */
        public boolean logout(String token) {
                if (token != null && token.startsWith("Bearer ")) {
                        token = token.substring(7);
                        return sessionService.closeSession(token).isPresent();
                }
                return false;
        }

        /**
         * Refresca un token JWT.
         *
         * @param refreshToken El token de refresco
         * @param request      La solicitud HTTP
         * @return Respuesta con el nuevo token JWT
         */
        public JwtResponse refreshToken(String refreshToken, HttpServletRequest request) {
                log.debug("Refrescando token con refresh token");
                RefreshTokenRequest refreshTokenRequest = new RefreshTokenRequest(refreshToken);
                return authenticationContext.authenticate(refreshTokenRequest, request);
        }
}
