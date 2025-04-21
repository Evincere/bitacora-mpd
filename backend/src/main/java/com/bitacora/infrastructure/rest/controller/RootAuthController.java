package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.auth.AuthService;
import com.bitacora.infrastructure.rest.dto.auth.JwtResponse;
import com.bitacora.infrastructure.rest.dto.auth.LoginRequest;
import com.bitacora.infrastructure.rest.dto.auth.RefreshTokenRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para la autenticación de usuarios en la ruta raíz /auth.
 * Este controlador es para manejar solicitudes sin el prefijo /api.
 */
@Slf4j
@RestController
@RequestMapping(path = "/auth", produces = "application/json")
@RequiredArgsConstructor
@Tag(name = "Autenticación Root", description = "API para la autenticación de usuarios sin el prefijo /api")
public class RootAuthController {

        private final AuthService authService;

        /**
         * Autentica a un usuario y devuelve un token JWT.
         *
         * @param loginRequest La solicitud de inicio de sesión
         * @param request      La solicitud HTTP
         * @return La respuesta de autenticación con el token JWT
         */
        @PostMapping("/login")
        @Operation(summary = "Iniciar sesión (root)", description = "Autentica a un usuario y devuelve un token JWT")
        public ResponseEntity<JwtResponse> login(
                        @Valid @RequestBody LoginRequest loginRequest,
                        HttpServletRequest request) {

                log.debug("Recibida solicitud de autenticación root para el usuario: {}", loginRequest.getUsername());
                JwtResponse jwtResponse = authService.authenticateUser(loginRequest, request);
                return ResponseEntity.ok(jwtResponse);
        }

        /**
         * Cierra la sesión de un usuario.
         *
         * @param authHeader El encabezado de autorización con el token JWT
         * @return Respuesta con mensaje de éxito
         */
        @PostMapping("/logout")
        @Operation(summary = "Cerrar sesión (root)", description = "Cierra la sesión de un usuario invalidando su token JWT")
        public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
                log.debug("Recibida solicitud de cierre de sesión root");

                boolean success = authService.logout(authHeader);
                if (success) {
                        return ResponseEntity.ok("Sesión cerrada correctamente");
                } else {
                        return ResponseEntity.badRequest().body("Error al cerrar sesión");
                }
        }

        /**
         * Refresca un token JWT.
         *
         * @param refreshTokenRequest La solicitud con el token de refresco
         * @param request             La solicitud HTTP
         * @return Un nuevo token JWT de acceso
         */
        @PostMapping("/refresh")
        @Operation(summary = "Refrescar token (root)", description = "Genera un nuevo token JWT de acceso usando un token de refresco")
        public ResponseEntity<JwtResponse> refreshToken(
                        @Valid @RequestBody RefreshTokenRequest refreshTokenRequest,
                        HttpServletRequest request) {

                log.debug("Recibida solicitud de refresco de token root");
                JwtResponse jwtResponse = authService.refreshToken(refreshTokenRequest.getRefreshToken(), request);
                return ResponseEntity.ok(jwtResponse);
        }

        /**
         * Endpoint de prueba para verificar que el controlador de autenticación está
         * funcionando.
         *
         * @return Un mensaje de prueba
         */
        @GetMapping("/test")
        @Operation(summary = "Prueba de autenticación (root)", description = "Endpoint de prueba para verificar que el controlador de autenticación root está funcionando")
        public ResponseEntity<String> test() {
                return ResponseEntity.ok("El controlador de autenticación root está funcionando correctamente");
        }
}
