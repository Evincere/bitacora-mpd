package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.auth.AuthService;
import com.bitacora.infrastructure.rest.dto.ApiResponse;
import com.bitacora.infrastructure.rest.dto.auth.JwtResponse;
import com.bitacora.infrastructure.rest.dto.auth.LoginRequest;
import com.bitacora.infrastructure.rest.dto.auth.RefreshTokenRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controlador unificado para la autenticación de usuarios.
 * Maneja tanto las rutas con prefijo /api/auth como las rutas sin prefijo
 * /auth.
 */
@RestController
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Autenticación", description = "API para la autenticación de usuarios")
public class AuthController {

    private final AuthService authService;

    /**
     * Autentica a un usuario y genera un token JWT.
     *
     * @param loginRequest La solicitud de inicio de sesión
     * @param request      La solicitud HTTP
     * @return Respuesta con el token JWT
     */
    @PostMapping({ "/api/auth/login", "/auth/login" })
    @Operation(summary = "Iniciar sesión", description = "Autentica a un usuario y devuelve un token JWT")
    public ResponseEntity<JwtResponse> authenticateUser(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request) {

        log.debug("Intento de inicio de sesión para el usuario: {}", loginRequest.getUsername());
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest, request);

        return ResponseEntity.ok(jwtResponse);
    }

    /**
     * Cierra la sesión de un usuario.
     *
     * @param authHeader El header de autorización
     * @return Respuesta indicando el resultado de la operación
     */
    @PostMapping({ "/api/auth/logout", "/auth/logout" })
    @Operation(summary = "Cerrar sesión", description = "Cierra la sesión de un usuario invalidando su token JWT")
    public ResponseEntity<ApiResponse> logoutUser(
            @RequestHeader("Authorization") String authHeader) {

        log.debug("Recibida solicitud de cierre de sesión");
        boolean success = authService.logout(authHeader);

        if (success) {
            return ResponseEntity.ok(new ApiResponse(true, "Sesión cerrada correctamente", null));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error al cerrar sesión", null));
        }
    }

    /**
     * Refresca un token JWT.
     *
     * @param refreshTokenRequest La solicitud de refresco de token
     * @param request             La solicitud HTTP
     * @return Respuesta con el nuevo token JWT
     */
    @PostMapping({ "/api/auth/refresh", "/auth/refresh" })
    @Operation(summary = "Refrescar token", description = "Genera un nuevo token JWT de acceso usando un token de refresco")
    public ResponseEntity<JwtResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest refreshTokenRequest,
            HttpServletRequest request) {

        log.debug("Recibida solicitud de refresco de token");
        JwtResponse jwtResponse = authService.refreshToken(refreshTokenRequest.getRefreshToken(), request);

        return ResponseEntity.ok(jwtResponse);
    }

    /**
     * Endpoint de prueba para verificar que el controlador de autenticación está
     * funcionando.
     *
     * @return Un mensaje de prueba
     */
    @GetMapping({ "/api/auth/test", "/auth/test" })
    @Operation(summary = "Prueba de autenticación", description = "Endpoint de prueba para verificar que el controlador de autenticación está funcionando")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("El controlador de autenticación está funcionando correctamente");
    }
}
