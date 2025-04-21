package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.session.UserSessionService;
import com.bitacora.domain.model.session.UserSession;
import com.bitacora.infrastructure.rest.dto.ApiResponse;
import com.bitacora.infrastructure.rest.dto.session.SessionDTO;
import com.bitacora.infrastructure.rest.dto.session.SessionRevokeRequest;
import com.bitacora.infrastructure.security.JwtTokenProvider;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador para gestionar sesiones de usuario.
 */
@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@Slf4j
public class SessionController {

    private final UserSessionService sessionService;
    private final JwtTokenProvider jwtTokenProvider;
    
    /**
     * Obtiene todas las sesiones activas del usuario autenticado.
     * 
     * @param authentication La autenticación del usuario
     * @return Lista de sesiones activas
     */
    @GetMapping("/active")
    public ResponseEntity<List<SessionDTO>> getActiveSessions(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = jwtTokenProvider.getUserIdFromUsername(userDetails.getUsername());
        
        List<UserSession> sessions = sessionService.getActiveSessions(userId);
        List<SessionDTO> sessionDTOs = mapToSessionDTOs(sessions);
        
        return ResponseEntity.ok(sessionDTOs);
    }
    
    /**
     * Obtiene todas las sesiones del usuario autenticado.
     * 
     * @param authentication La autenticación del usuario
     * @return Lista de sesiones
     */
    @GetMapping("/all")
    public ResponseEntity<List<SessionDTO>> getAllSessions(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = jwtTokenProvider.getUserIdFromUsername(userDetails.getUsername());
        
        List<UserSession> sessions = sessionService.getAllSessions(userId);
        List<SessionDTO> sessionDTOs = mapToSessionDTOs(sessions);
        
        return ResponseEntity.ok(sessionDTOs);
    }
    
    /**
     * Cierra todas las sesiones del usuario autenticado excepto la sesión actual.
     * 
     * @param authentication La autenticación del usuario
     * @param token El token JWT de la sesión actual
     * @return Respuesta con el número de sesiones cerradas
     */
    @PostMapping("/close-others")
    public ResponseEntity<ApiResponse> closeOtherSessions(
            Authentication authentication,
            @RequestBody String token) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = jwtTokenProvider.getUserIdFromUsername(userDetails.getUsername());
        
        // Obtener el ID de la sesión actual
        UserSession currentSession = sessionService.updateLastActivity(token)
                .orElseThrow(() -> new IllegalArgumentException("Sesión no encontrada"));
        
        int closedSessions = sessionService.closeOtherSessions(userId, currentSession.getId());
        
        return ResponseEntity.ok(new ApiResponse(
                true,
                "Se han cerrado " + closedSessions + " sesiones",
                closedSessions));
    }
    
    /**
     * Cierra una sesión específica.
     * 
     * @param authentication La autenticación del usuario
     * @param sessionId El ID de la sesión a cerrar
     * @return Respuesta indicando el resultado de la operación
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<ApiResponse> closeSession(
            Authentication authentication,
            @PathVariable Long sessionId) {
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = jwtTokenProvider.getUserIdFromUsername(userDetails.getUsername());
        
        // Verificar que la sesión pertenezca al usuario
        UserSession session = sessionService.getAllSessions(userId).stream()
                .filter(s -> s.getId().equals(sessionId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Sesión no encontrada o no autorizada"));
        
        sessionService.revokeSession(sessionId, "Cerrada por el usuario");
        
        return ResponseEntity.ok(new ApiResponse(
                true,
                "Sesión cerrada correctamente",
                null));
    }
    
    /**
     * Obtiene todas las sesiones sospechosas (solo para administradores).
     * 
     * @return Lista de sesiones sospechosas
     */
    @GetMapping("/suspicious")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SessionDTO>> getSuspiciousSessions() {
        List<UserSession> sessions = sessionService.getSuspiciousSessions();
        List<SessionDTO> sessionDTOs = mapToSessionDTOs(sessions);
        
        return ResponseEntity.ok(sessionDTOs);
    }
    
    /**
     * Revoca una sesión (solo para administradores).
     * 
     * @param sessionId El ID de la sesión a revocar
     * @param request La solicitud de revocación
     * @return Respuesta indicando el resultado de la operación
     */
    @PostMapping("/{sessionId}/revoke")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> revokeSession(
            @PathVariable Long sessionId,
            @Valid @RequestBody SessionRevokeRequest request) {
        
        sessionService.revokeSession(sessionId, request.getReason())
                .orElseThrow(() -> new IllegalArgumentException("Sesión no encontrada"));
        
        return ResponseEntity.ok(new ApiResponse(
                true,
                "Sesión revocada correctamente",
                null));
    }
    
    /**
     * Convierte una lista de entidades UserSession a DTOs.
     * 
     * @param sessions Lista de entidades UserSession
     * @return Lista de DTOs
     */
    private List<SessionDTO> mapToSessionDTOs(List<UserSession> sessions) {
        return sessions.stream()
                .map(session -> SessionDTO.builder()
                        .id(session.getId())
                        .userId(session.getUserId())
                        .ipAddress(session.getIpAddress())
                        .device(session.getDevice())
                        .location(session.getLocation())
                        .loginTime(session.getLoginTime())
                        .lastActivityTime(session.getLastActivityTime())
                        .expiryTime(session.getExpiryTime())
                        .status(session.getStatus().name())
                        .suspicious(session.isSuspicious())
                        .suspiciousReason(session.getSuspiciousReason())
                        .logoutTime(session.getLogoutTime())
                        .build())
                .collect(Collectors.toList());
    }
}
