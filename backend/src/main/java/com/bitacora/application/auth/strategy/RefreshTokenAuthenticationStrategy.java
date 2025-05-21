package com.bitacora.application.auth.strategy;

import com.bitacora.application.session.UserSessionService;
import com.bitacora.domain.model.user.User;
import com.bitacora.domain.port.UserRepository;
import com.bitacora.infrastructure.exception.InvalidTokenException;
import com.bitacora.infrastructure.rest.dto.auth.JwtResponse;
import com.bitacora.infrastructure.rest.dto.auth.RefreshTokenRequest;
import com.bitacora.infrastructure.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación de la estrategia de autenticación basada en token de refresco.
 * Autentica a un usuario utilizando un token de refresco y genera un nuevo par de tokens.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RefreshTokenAuthenticationStrategy implements AuthenticationStrategy {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserSessionService sessionService;
    private final UserRepository userRepository;

    /**
     * Autentica a un usuario utilizando un token de refresco y genera un nuevo par de tokens.
     *
     * @param credentials Las credenciales de autenticación (RefreshTokenRequest)
     * @param request La solicitud HTTP
     * @return Respuesta con el nuevo token JWT y datos del usuario
     */
    @Override
    public JwtResponse authenticate(Object credentials, HttpServletRequest request) {
        if (!supports(credentials)) {
            throw new IllegalArgumentException("Tipo de credenciales no soportado");
        }

        RefreshTokenRequest refreshTokenRequest = (RefreshTokenRequest) credentials;
        String refreshToken = refreshTokenRequest.getRefreshToken();
        log.debug("Refrescando token con refresh token: {}", refreshToken);

        // Validar el token de refresco
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new InvalidTokenException("Token de refresco inválido o expirado");
        }

        // Obtener el ID de usuario del token
        Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        if (userId == null) {
            throw new InvalidTokenException("Token de refresco no contiene ID de usuario");
        }

        // Verificar si el token de refresco está asociado a una sesión válida
        Optional<String> sessionToken = sessionService.findSessionByRefreshToken(refreshToken);
        if (sessionToken.isEmpty()) {
            throw new InvalidTokenException("Token de refresco no está asociado a una sesión válida");
        }

        // Buscar el usuario en la base de datos
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidTokenException("Usuario no encontrado"));

        // Obtener las autoridades del usuario
        List<GrantedAuthority> authorities = user.getPermissions().stream()
                .map(permission -> new SimpleGrantedAuthority(permission.name()))
                .collect(Collectors.toList());

        // Generar nuevo token JWT
        String newToken = jwtTokenProvider.createToken(user, authorities);

        // Generar nuevo token de refresco
        String newRefreshToken = jwtTokenProvider.createRefreshToken(user, authorities);

        // Actualizar la sesión
        sessionService.createSession(user.getId(), newToken, newRefreshToken, request);

        // Obtener permisos del usuario
        List<String> permissions = user.getPermissions().stream()
                .map(permission -> permission.name())
                .collect(Collectors.toList());

        // Construir respuesta
        return JwtResponse.builder()
                .token(newToken)
                .refreshToken(newRefreshToken)
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
     * @return true si las credenciales son de tipo RefreshTokenRequest, false en caso contrario
     */
    @Override
    public boolean supports(Object credentials) {
        return credentials instanceof RefreshTokenRequest;
    }
}
