package com.bitacora.application.auth;

import com.bitacora.application.session.UserSessionService;
import com.bitacora.domain.model.user.User;
import com.bitacora.domain.port.UserRepository;
import com.bitacora.infrastructure.rest.dto.auth.JwtResponse;
import com.bitacora.infrastructure.rest.dto.auth.LoginRequest;
import com.bitacora.infrastructure.security.JwtTokenProvider;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

/**
 * Servicio para la autenticación de usuarios.
 * Implementa los casos de uso relacionados con autenticación.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

        private final AuthenticationManager authenticationManager;
        private final JwtTokenProvider jwtTokenProvider;
        private final UserRepository userRepository;
        private final UserSessionService sessionService;

        /**
         * Autentica a un usuario y genera un token JWT.
         *
         * @param loginRequest La solicitud de inicio de sesión
         * @param request      La solicitud HTTP
         * @return Respuesta con el token JWT
         */
        public JwtResponse authenticateUser(LoginRequest loginRequest, HttpServletRequest request) {
                // Autenticar al usuario
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                loginRequest.getUsername(),
                                                loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Generar token JWT
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                // Obtener el usuario del repositorio
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new IllegalStateException("Usuario no encontrado"));

                // Crear token JWT
                String jwt = jwtTokenProvider.createToken(user, userDetails.getAuthorities());

                // Generar token de refresco
                String refreshToken = jwtTokenProvider.createRefreshToken(user, userDetails.getAuthorities());

                // La información del usuario ya se obtuvo anteriormente

                // Registrar la sesión
                sessionService.createSession(user.getId(), jwt, refreshToken, request);

                // Obtener permisos del usuario
                List<String> permissions = user.getPermissions().stream()
                                .map(permission -> permission.name())
                                .collect(java.util.stream.Collectors.toList());

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
                // Validar el token de refresco
                if (!jwtTokenProvider.validateToken(refreshToken) || !jwtTokenProvider.isRefreshToken(refreshToken)) {
                        throw new IllegalArgumentException("Token de refresco inválido");
                }

                // Obtener el nombre de usuario del token
                String username = jwtTokenProvider.getUsername(refreshToken);

                // Cargar los detalles del usuario
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new IllegalStateException("Usuario no encontrado"));

                // Crear lista de autoridades
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
                user.getPermissions()
                                .forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission.name())));

                // Generar nuevo token JWT
                String newToken = jwtTokenProvider.createToken(user, authorities);

                // Generar nuevo token de refresco
                String newRefreshToken = jwtTokenProvider.createRefreshToken(user, authorities);

                // El usuario ya se obtuvo anteriormente

                // Actualizar la sesión
                sessionService.createSession(user.getId(), newToken, newRefreshToken, request);

                // Obtener permisos del usuario
                List<String> permissions = user.getPermissions().stream()
                                .map(permission -> permission.name())
                                .collect(java.util.stream.Collectors.toList());

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
}
