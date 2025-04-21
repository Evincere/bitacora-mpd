package com.bitacora.infrastructure.config;

import com.bitacora.infrastructure.security.JwtTokenProvider;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * Configuración de autenticación para WebSocket.
 * Esta clase configura la autenticación para las conexiones WebSocket.
 */
@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthenticationConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    /**
     * Configura el canal de cliente entrante para agregar un interceptor de
     * autenticación.
     * 
     * @param registration El registro del canal
     */
    @Override
    public void configureClientInboundChannel(@org.springframework.lang.NonNull ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(@org.springframework.lang.NonNull Message<?> message,
                    @org.springframework.lang.NonNull MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Extraer el token de los headers
                    List<String> authorization = accessor.getNativeHeader("Authorization");
                    log.debug("WebSocket Connection attempt with Authorization: {}", authorization);

                    if (authorization != null && !authorization.isEmpty()) {
                        String token = authorization.get(0);
                        if (token != null && token.startsWith("Bearer ")) {
                            token = token.substring(7);

                            try {
                                if (jwtTokenProvider.validateToken(token)) {
                                    String username = jwtTokenProvider.getUsername(token);
                                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                                    Authentication auth = new UsernamePasswordAuthenticationToken(
                                            userDetails, null, userDetails.getAuthorities());

                                    SecurityContextHolder.getContext().setAuthentication(auth);
                                    accessor.setUser(auth);

                                    log.debug("WebSocket Connection authenticated for user: {}", username);
                                }
                            } catch (Exception e) {
                                log.error("WebSocket Authentication error: {}", e.getMessage());
                            }
                        }
                    }
                }
                return message;
            }
        });
    }
}
