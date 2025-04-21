package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.auth.AuthService;
import com.bitacora.infrastructure.rest.dto.ApiResponse;
import com.bitacora.infrastructure.rest.dto.auth.JwtResponse;
import com.bitacora.infrastructure.rest.dto.auth.LoginRequest;
import com.bitacora.infrastructure.rest.dto.auth.RefreshTokenRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controlador para la autenticación de usuarios.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    
    /**
     * Autentica a un usuario y genera un token JWT.
     * 
     * @param loginRequest La solicitud de inicio de sesión
     * @param request La solicitud HTTP
     * @return Respuesta con el token JWT
     */
    @PostMapping("/login")
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
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logoutUser(
            @RequestHeader("Authorization") String authHeader) {
        
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
     * @param request La solicitud HTTP
     * @return Respuesta con el nuevo token JWT
     */
    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest refreshTokenRequest,
            HttpServletRequest request) {
        
        JwtResponse jwtResponse = authService.refreshToken(refreshTokenRequest.getRefreshToken(), request);
        
        return ResponseEntity.ok(jwtResponse);
    }
}
