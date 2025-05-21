package com.bitacora.application.auth.strategy;

import com.bitacora.application.session.UserSessionService;
import com.bitacora.domain.model.user.User;
import com.bitacora.domain.port.UserRepository;
import com.bitacora.infrastructure.rest.dto.auth.JwtResponse;
import com.bitacora.infrastructure.rest.dto.auth.LoginRequest;
import com.bitacora.infrastructure.security.JwtTokenProvider;
import com.bitacora.infrastructure.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación de la estrategia de autenticación basada en JWT.
 * Autentica a un usuario con nombre de usuario y contraseña, y genera un token JWT.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationStrategy implements AuthenticationStrategy {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserSessionService sessionService;
    private final UserRepository userRepository;

    /**
     * Autentica a un usuario con nombre de usuario y contraseña, y genera un token JWT.
     *
     * @param credentials Las credenciales de autenticación (LoginRequest)
     * @param request La solicitud HTTP
     * @return Respuesta con el token JWT y datos del usuario
     */
    @Override
    public JwtResponse authenticate(Object credentials, HttpServletRequest request) {
        if (!supports(credentials)) {
            throw new IllegalArgumentException("Tipo de credenciales no soportado");
        }

        LoginRequest loginRequest = (LoginRequest) credentials;
        log.debug("Autenticando usuario: {}", loginRequest.getUsername());

        // Autenticar al usuario
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        // Obtener detalles del usuario autenticado
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        
        // Buscar el usuario en la base de datos
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalStateException("Usuario no encontrado después de la autenticación"));

        // Crear token JWT
        String jwt = jwtTokenProvider.createToken(user, userDetails.getAuthorities());

        // Generar token de refresco
        String refreshToken = jwtTokenProvider.createRefreshToken(user, userDetails.getAuthorities());

        // Registrar la sesión
        sessionService.createSession(user.getId(), jwt, refreshToken, request);

        // Obtener permisos del usuario
        List<String> permissions = user.getPermissions().stream()
                .map(permission -> permission.name())
                .collect(Collectors.toList());

        // Construir respuesta
        return JwtResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail().getValue())
                .firstName(user.getPersonName().getFirstName())
                .lastName(user.getPersonName().getLastName())
                .fullName(user.getPersonName().getFullName())
                .role(user.getRole().name())
                .permissions(permissions)
                .build();
    }

    /**
     * Verifica si esta estrategia puede manejar el tipo de credenciales proporcionado.
     *
     * @param credentials Las credenciales a verificar
     * @return true si las credenciales son de tipo LoginRequest, false en caso contrario
     */
    @Override
    public boolean supports(Object credentials) {
        return credentials instanceof LoginRequest;
    }
}
