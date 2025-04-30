package com.bitacora.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Configuración del servidor WebSocket.
 * Esta clase configura el servidor WebSocket para permitir la comunicación en tiempo real.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Configura el registro de endpoints STOMP.
     * @param registry El registro de endpoints STOMP
     */
    @Override
    public void registerStompEndpoints(@NonNull final StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // En producción, limitar a dominios específicos
                .withSockJS(); // Habilitar SockJS para compatibilidad con navegadores antiguos
    }

    /**
     * Configura el broker de mensajes.
     * @param registry El registro del broker de mensajes
     */
    @Override
    public void configureMessageBroker(@NonNull final MessageBrokerRegistry registry) {
        // Prefijo para endpoints que manejan mensajes del cliente
        registry.setApplicationDestinationPrefixes("/app");
        
        // Habilitar broker simple en memoria con prefijos para tópicos y colas
        registry.enableSimpleBroker("/topic", "/queue", "/user");
        
        // Prefijo para mensajes dirigidos a usuarios específicos
        registry.setUserDestinationPrefix("/user");
    }
}
